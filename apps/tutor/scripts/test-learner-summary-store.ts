/**
 * Learner summary store (GDI learner home, task 2): claim rule + orchestrator via
 * in-memory fakes. Run: cd apps/tutor && npx tsx scripts/test-learner-summary-store.ts
 */
import { claimDecision, claimVersion, claimUpdatePipeline, runSummaryForSession, summaryStateOf, type SummaryStoreDeps } from '../src/lib/tutor/portal/learner-summary-store';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}

const eq2 = (a: unknown[], b: unknown[]) => JSON.stringify(a) === JSON.stringify(b);
const now = new Date('2026-11-05T10:00:00Z');
const ago = (s: number) => new Date(now.getTime() - s * 1000);
const L = (status: 'pending' | 'ready' | 'failed', turnCount: number, s: number, version = 1) => ({ status, turnCount, version, updatedAt: ago(s) });

check('absent -> claimed', claimDecision(undefined, 20, now) === 'claimed');
check('absent -> version 1', claimVersion(undefined) === 1);
check('pending 30s -> busy', claimDecision(L('pending', 20, 30), 20, now) === 'busy');
check('pending 130s -> claimed', claimDecision(L('pending', 20, 130), 20, now) === 'claimed');
check('ready 20 -> 22 => ready', claimDecision(L('ready', 20, 999), 22, now) === 'ready');
const r23 = L('ready', 20, 999, 2);
check('ready 20 -> 23 => claimed, version+1', claimDecision(r23, 23, now) === 'claimed' && claimVersion(r23) === 3);
check('failed -> claimed', claimDecision(L('failed', 20, 5), 20, now) === 'claimed');
check('pending reclaim keeps version', claimVersion(L('pending', 20, 130, 2)) === 2);

const pl = claimUpdatePipeline(20, now);
const sub = (pl[0].$set as any).learnerSummary;
check('pipeline replaces whole sub-doc, no summary/error', pl.length === 1 && !('summary' in sub) && !('error' in sub)
  && eq2(Object.keys(sub).sort(), ['status', 'turnCount', 'updatedAt', 'version']) && sub.status === 'pending');

const readySummary: any = { version: 1, turn_count: 6 };
check('summaryStateOf absent', summaryStateOf(undefined).status === 'none');
check('summaryStateOf ready', summaryStateOf({ ...L('ready', 6, 1), summary: readySummary } as any).summary === readySummary);

function mkDeps(session: any, replies: Array<Record<string, unknown> | Error>, opts: { profileThrows?: boolean } = {}) {
  const calls = { model: 0 };
  const stored: any[] = [];
  const deps: SummaryStoreDeps = {
    async loadSession() { return session; },
    async claim(_id, tc, n) {
      const d = claimDecision(session.learnerSummary, tc, n);
      if (d === 'claimed') session.learnerSummary = { status: 'pending', turnCount: tc, version: claimVersion(session.learnerSummary), updatedAt: n };
      return d;
    },
    async store(_id, result, n) {
      stored.push(result);
      session.learnerSummary = result.ok
        ? { ...session.learnerSummary, status: 'ready', summary: result.summary, updatedAt: n }
        : { ...session.learnerSummary, status: 'failed', error: result.error, updatedAt: n };
    },
    async profileLevel() { if (opts.profileThrows) throw new Error('boom'); return null; },
    async callJson() {
      const r = replies[Math.min(calls.model, replies.length - 1)]; calls.model++;
      if (r instanceof Error) throw r; return r;
    },
    model: 'fake-model', now: () => now,
  };
  return { deps, calls, stored };
}
const goodReply = {
  level_evidence_en: 'Evidence line here', level_evidence_ja: '根拠です', grammar_en: 'Grammar is steady', grammar_ja: '文法は安定',
  pronunciation_comment_en: 'Pronunciation fine', pronunciation_comment_ja: '発音は良い',
  recommendations: [1, 2, 3].map((n) => ({ en: `Practise item ${n}`, ja: `練習 ${n}` })),
};
const mkSession = () => ({
  sessionId: 's1', subject: 'English', topic: 'Meetings', duration: 600,
  transcript: Array.from({ length: 6 }, (_, i) => ({ role: i % 2 ? 'tutor' : 'student', text: `turn ${i}` })),
  debugEvents: [], studentId: 'st', sourcePartnerId: 'p',
});

(async () => {
  {
    const { deps, stored } = mkDeps(mkSession(), [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('happy: ready', st.status === 'ready' && stored.length === 1 && stored[0].ok);
    check('happy: turn_count 6', st.summary?.turn_count === 6);
  }
  {
    const { deps, calls, stored } = mkDeps(mkSession(), [{}, {}]);
    const st = await runSummaryForSession('s1', deps);
    check('model fails twice: failed with error', st.status === 'failed' && !!st.error && stored.length === 1 && !stored[0].ok);
    check('model called twice', calls.model === 2);
  }
  {
    const { deps } = mkDeps(mkSession(), [goodReply], { profileThrows: true });
    const st = await runSummaryForSession('s1', deps);
    check('profileLevel throw swallowed', st.status === 'ready' && st.summary?.level.source === 'none');
  }
  {
    const s: any = mkSession(); s.learnerSummary = L('pending', 6, 10);
    const { deps, calls } = mkDeps(s, [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('busy: no model call, state untouched', calls.model === 0 && st.status === 'pending');
  }
  {
    const s: any = mkSession(); s.learnerSummary = { ...L('ready', 6, 100), summary: readySummary };
    const { deps, calls } = mkDeps(s, [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('ready: no model call, stored summary returned', calls.model === 0 && st.summary === readySummary);
  }
  {
    const { deps, calls } = mkDeps(null as any, [goodReply]);
    const st = await runSummaryForSession('nope', deps);
    check('missing session: none, no call', st.status === 'none' && calls.model === 0);
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
