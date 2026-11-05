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
// M11: a failed summary is re-claimed only after a 60 s cooldown (was: any age).
check('failed 61s -> claimed', claimDecision(L('failed', 20, 61), 20, now) === 'claimed');
check('failed 5s -> busy (M11 cooldown)', claimDecision(L('failed', 20, 5), 20, now) === 'busy');
check('pending reclaim keeps version', claimVersion(L('pending', 20, 130, 2)) === 2);

const pl = claimUpdatePipeline(20, now);
const sub = (pl[0].$set as any).learnerSummary.$mergeObjects?.[0] ?? {};
check('pipeline sub-doc is one $mergeObjects expression (replaces, never merges)', eq2(Object.keys((pl[0].$set as any).learnerSummary), ['$mergeObjects']) && (pl[0].$set as any).learnerSummary.$mergeObjects.length === 1);
// M4: a re-claim keeps the previous summary; status/turnCount/updatedAt/version reset, error dropped.
check('pipeline keeps previous summary, drops error', pl.length === 1 && sub.summary === '$learnerSummary.summary' && !('error' in sub)
  && eq2(Object.keys(sub).sort(), ['status', 'summary', 'turnCount', 'updatedAt', 'version']) && sub.status === 'pending');

const readySummary: any = { version: 1, turn_count: 6 };
check('summaryStateOf absent', summaryStateOf(undefined).status === 'none');
check('summaryStateOf ready', summaryStateOf({ ...L('ready', 6, 1), summary: readySummary } as any).summary === readySummary);
const failedOld = summaryStateOf({ ...L('failed', 9, 1), summary: readySummary, error: 'x' } as any);
check('summaryStateOf failed keeps old summary (M4)', failedOld.status === 'failed' && failedOld.summary === readySummary);

function mkDeps(session: any, replies: Array<Record<string, unknown> | Error>, opts: { profileThrows?: boolean } = {}) {
  const calls = { model: 0, claim: 0 };
  const stored: any[] = [];
  const deps: SummaryStoreDeps = {
    async loadSession() { return session; },
    async claim(_id, tc, n) {
      calls.claim++;
      const d = claimDecision(session.learnerSummary, tc, n);
      // Mirrors claimUpdatePipeline: the previous summary is carried over (M4).
      if (d === 'claimed') {
        const prevSummary = session.learnerSummary?.summary;
        session.learnerSummary = { status: 'pending', turnCount: tc, version: claimVersion(session.learnerSummary), updatedAt: n, ...(prevSummary ? { summary: prevSummary } : {}) };
      }
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
  sessionId: 's1', subject: 'languages', topic: 'Meetings', duration: 600,
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
  {
    // I1: kill switch inside runSummaryForSession — no claim, no model call.
    process.env.TUTOR_LEARNER_SUMMARY = 'off';
    const { deps, calls } = mkDeps(mkSession(), [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    delete process.env.TUTOR_LEARNER_SUMMARY;
    check('flag off: disabled, no claim, no model call', st.status === 'disabled' && calls.claim === 0 && calls.model === 0, JSON.stringify(st));
  }
  {
    // I2: only language lessons are summarised.
    const s: any = mkSession(); s.subject = 'math';
    const { deps, calls } = mkDeps(s, [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('subject math: unsupported, no claim, no model call', st.status === 'unsupported' && calls.claim === 0 && calls.model === 0, JSON.stringify(st));
  }
  {
    // M6: fewer than 4 turns — no claim.
    const s: any = mkSession(); s.transcript = s.transcript.slice(0, 3);
    const { deps, calls } = mkDeps(s, [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('3 turns: too_short, no claim, no model call', st.status === 'too_short' && calls.claim === 0 && calls.model === 0, JSON.stringify(st));
  }
  {
    // M4: a failed regeneration leaves the old summary readable.
    const s: any = mkSession(); s.learnerSummary = { ...L('ready', 3, 999), summary: readySummary };
    const { deps, calls } = mkDeps(s, [{}, {}]);
    const st = await runSummaryForSession('s1', deps);
    check('re-claim then failure: failed with the old summary', calls.model === 2 && st.status === 'failed' && st.summary === readySummary, JSON.stringify(st));
  }
  {
    // M11: Retry within 60 s of a failure is busy (no model call).
    const s: any = mkSession(); s.learnerSummary = { ...L('failed', 6, 10), error: 'x' };
    const { deps, calls } = mkDeps(s, [goodReply]);
    const st = await runSummaryForSession('s1', deps);
    check('failed 10s ago: no model call', calls.model === 0 && st.status === 'failed', JSON.stringify(st));
  }
  {
    // Fix round 2: a session saved before tutorLanguages existed uses the token's languages.
    const systems: string[] = [];
    const run = async (opts?: { fallbackTutorLanguages?: string[] }) => {
      const { deps } = mkDeps(mkSession(), [goodReply]);
      deps.callJson = async (system) => { systems.push(system); return goodReply; };
      return runSummaryForSession('s1', deps, opts);
    };
    const withFb = await run({ fallbackTutorLanguages: ['en', 'ja'] });
    check('fallback [en,ja]: prompt names Japanese, JA lines kept', /Japanese/.test(systems[0] ?? '') && (withFb as any).summary?.assessment.grammar_ja === '文法は安定', systems[0]);
    const noFb = await run();
    check('no fallback: empty _ja', !/Japanese/.test(systems[1] ?? '') && (noFb as any).summary?.assessment.grammar_ja === '', JSON.stringify(noFb).slice(0, 200));
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
