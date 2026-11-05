/**
 * Learner-summary route (GDI learner home, task 4): token-scoped GET/POST,
 * handlers imported directly with the secrets + summary-deps seams (no DB, no network).
 * Run: cd apps/tutor && npx tsx scripts/test-learner-summary-route.ts
 */
import { randomBytes } from 'node:crypto';
process.env.PORTAL_SECRET_ENC_KEY = randomBytes(32).toString('base64');

import type { NextRequest } from 'next/server';
import { GET, POST } from '../src/app/api/tutor-portal/learner-summary/route';
import { signEmbedToken } from '../src/lib/tutor/portal/embed-token';
import { __setPartnerTokenSecretDepsForTests } from '../src/lib/tutor/portal/partner-token-secrets';
import {
  __setLearnerSummaryDepsForTests, claimDecision, claimVersion, type SummaryStoreDeps,
} from '../src/lib/tutor/portal/learner-summary-store';
import type { PartnerRecord } from '../src/lib/tutor/portal/registry';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}

const SECRET = 'route-test-secret';
const SECRET2 = 'route-test-secret-p2';
let partnerLookups: string[] = [];
__setPartnerTokenSecretDepsForTests({
  async getPartner(id) {
    partnerLookups.push(id);
    const secret = id === 'p1' ? SECRET : id === 'p2' ? SECRET2 : null;
    if (!secret) return null;
    const r: PartnerRecord = {
      partnerId: id, kind: 'partner', status: 'active', secrets: [secret],
      allowedEndpoints: ['/api/portal/v1/'], limits: { rpm: 600, burst: 60, dailyQuota: null }, flagOverrides: {},
    };
    return r;
  },
  env: {} as NodeJS.ProcessEnv,
});

const exp = Math.floor(Date.now() / 1000) + 3600;
const tok = (claims: Record<string, unknown>) => signEmbedToken({ partner_id: 'p1', exp, ...claims }, SECRET);
const tokA = tok({ student_id: 'A' });
const tokB = tok({ student_id: 'B' });
const tokNone = tok({});
const tokP2A = signEmbedToken({ partner_id: 'p2', exp, student_id: 'A' }, SECRET2);

const goodReply = {
  level_evidence_en: 'Evidence line here', level_evidence_ja: '根拠です', grammar_en: 'Grammar is steady', grammar_ja: '文法は安定',
  pronunciation_comment_en: 'Pronunciation fine', pronunciation_comment_ja: '発音は良い',
  recommendations: [1, 2, 3].map((n) => ({ en: `Practise item ${n}`, ja: `練習 ${n}` })),
};

function mkDeps(sourcePartnerId = 'p1') {
  const calls = { claim: 0, model: 0 };
  const session: any = {
    sessionId: 's1', subject: 'English', topic: 'Meetings', duration: 600, hasAudio: true,
    transcript: Array.from({ length: 6 }, (_, i) => ({ role: i % 2 ? 'tutor' : 'student', text: `turn ${i}` })),
    debugEvents: [], studentId: 'A', sourcePartnerId,
  };
  const deps: SummaryStoreDeps = {
    async loadSession(id) { return id === 's1' ? session : null; },
    async claim(_id, tc, n) {
      calls.claim++;
      const d = claimDecision(session.learnerSummary, tc, n);
      if (d === 'claimed') session.learnerSummary = { status: 'pending', turnCount: tc, version: claimVersion(session.learnerSummary), updatedAt: n };
      return d;
    },
    async store(_id, result, n) {
      session.learnerSummary = result.ok
        ? { ...session.learnerSummary, status: 'ready', summary: result.summary, updatedAt: n }
        : { ...session.learnerSummary, status: 'failed', error: result.error, updatedAt: n };
    },
    async profileLevel() { return null; },
    async callJson() { calls.model++; return goodReply; },
    model: 'fake-model', now: () => new Date(),
  };
  return { deps, calls };
}

const BASE = 'http://engine.test/api/tutor-portal/learner-summary';
const get = (qs: string, token?: string) => GET(new Request(`${BASE}?${qs}`, {
  headers: { ...(token ? { 'x-embed-token': token } : {}), host: 'tutor.example.com', 'x-forwarded-proto': 'https' },
}) as unknown as NextRequest);
const post = (body: Record<string, unknown>, token?: string) => POST(new Request(BASE, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(token ? { 'x-embed-token': token } : {}) },
  body: JSON.stringify(body),
}) as unknown as NextRequest);

(async () => {
  {
    const { deps } = mkDeps();
    __setLearnerSummaryDepsForTests(deps);
    const r = await get('sessionId=s1', tokA);
    const j: any = await r.json();
    check('GET own session -> 200', r.status === 200, `${r.status} ${JSON.stringify(j)}`);
    check('GET carries state.status', j.state?.status === 'none', JSON.stringify(j.state));
    check('GET replayUrl from forwarded origin', typeof j.replayUrl === 'string' && j.replayUrl.startsWith('https://tutor.example.com/tutor-portal/replay?token='), j.replayUrl);
    check('GET hasAudio', j.hasAudio === true);
    const rq = await get(`sessionId=s1&token=${tokA}`);
    check('GET ?token= accepted', rq.status === 200, String(rq.status));
  }
  {
    const { deps, calls } = mkDeps();
    __setLearnerSummaryDepsForTests(deps);
    const r = await get('sessionId=s1', tokB);
    check('GET other student -> 403', r.status === 403 && (await r.json()).error === 'forbidden', String(r.status));
    const p = await post({ sessionId: 's1' }, tokB);
    check('POST other student -> 403', p.status === 403, String(p.status));
    check('claim never called for another student', calls.claim === 0, String(calls.claim));
  }
  {
    // Another partner's token, same student id + session id: 403, no claim, no replay token minted.
    const { deps, calls } = mkDeps();
    __setLearnerSummaryDepsForTests(deps);
    const r = await get('sessionId=s1', tokP2A);
    check('GET p2 token on a p1 session -> 403', r.status === 403, String(r.status));
    partnerLookups = [];
    const p = await post({ sessionId: 's1' }, tokP2A);
    check('POST p2 token on a p1 session -> 403', p.status === 403, String(p.status));
    check('p2 token: claim never called', calls.claim === 0, String(calls.claim));
    check('p2 token: signer never reached (only the verify lookup)', partnerLookups.length === 1 && partnerLookups[0] === 'p2', JSON.stringify(partnerLookups));
  }
  {
    // A p1 token on a session owned by p2 (same student id): 403.
    const { deps, calls } = mkDeps('p2');
    __setLearnerSummaryDepsForTests(deps);
    partnerLookups = [];
    const r = await get('sessionId=s1', tokA);
    check('GET p1 token on a p2 session -> 403', r.status === 403, String(r.status));
    const p = await post({ sessionId: 's1' }, tokA);
    check('POST p1 token on a p2 session -> 403', p.status === 403 && calls.claim === 0, `${p.status} claim=${calls.claim}`);
    check('p1 token on p2 session: signer never reached', partnerLookups.every((x) => x === 'p1') && partnerLookups.length === 2, JSON.stringify(partnerLookups));
  }
  {
    const { deps } = mkDeps();
    __setLearnerSummaryDepsForTests(deps);
    const r = await get('sessionId=s1', tokNone);
    const j: any = await r.json();
    check('GET token without student_id -> 401 student_id_required', r.status === 401 && j.error === 'unauthorized' && j.reason === 'student_id_required', JSON.stringify(j));
    const bad = await get('sessionId=s1', 'not.a.token');
    check('GET bad token -> 401', bad.status === 401, String(bad.status));
    const none = await get('sessionId=s1');
    check('GET no token -> 401', none.status === 401, String(none.status));
    const rp = await get('sessionId=s1', tok({ student_id: 'A', mode: 'replay', session_id: 's1' }));
    check('GET replay-mode token -> 401', rp.status === 401, String(rp.status));
    const nf = await get('sessionId=nope', tokA);
    check('GET unknown session -> 404', nf.status === 404 && (await nf.json()).error === 'not_found', String(nf.status));
  }
  {
    const { deps, calls } = mkDeps();
    __setLearnerSummaryDepsForTests(deps);
    const r = await post({ sessionId: 's1' }, tokA);
    const j: any = await r.json();
    check('POST generates -> 200 ready', r.status === 200 && j.state?.status === 'ready', `${r.status} ${JSON.stringify(j).slice(0, 200)}`);
    check('POST model called once', calls.model === 1, String(calls.model));
    check('POST replayUrl present', typeof j.replayUrl === 'string' && j.replayUrl.includes('/tutor-portal/replay?token='));
    const rb = await post({ sessionId: 's1', embedToken: tokA });
    check('POST body embedToken accepted', rb.status === 200, String(rb.status));
    const nf = await post({ sessionId: 'nope' }, tokA);
    check('POST unknown session -> 404', nf.status === 404, String(nf.status));
  }
  __setLearnerSummaryDepsForTests(null);
  __setPartnerTokenSecretDepsForTests(null);
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
