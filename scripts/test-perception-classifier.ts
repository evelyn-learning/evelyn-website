/**
 * Unit tests for the perception heuristic classifier (Stage 1).
 *
 * Focus: state-aware filler semantics (2026-07-11 fix). While the tutor is
 * LISTENING, a bare acknowledgement ("yeah", "okay", "yeah okay") is the
 * student's ANSWER — e.g. to "shall we move on?" — and must classify as
 * new_turn so the perception direct-dispatch path fires a brain turn
 * (Stage 4 made perception the sole input authority; a 'filler' verdict in
 * listening is a silent drop). Pure hesitations ("um", "uh") still drop in
 * every state, and acknowledgements during speaking/processing stay filler
 * (defence layer 3 — false-barge-in protection).
 *
 * Run: npm run test:perception-classifier
 */
import {
  classifyHeuristic,
  scoreSelfVoice,
  SELF_VOICE_THRESHOLD,
  TTS_PADDING_TRAIL_MS,
  type HeuristicInput,
  type ProductionStateForClassifier,
  type RecentTtsScript,
} from '../src/lib/tutor/voice/perception-classifier';
import {
  pushTtsScript,
  applyPlaybackStamp,
} from '../src/lib/tutor/voice/tts-script-buffer';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

function classify(transcript: string, productionState: ProductionStateForClassifier) {
  const input: HeuristicInput = {
    transcript,
    productionState,
    recentTtsScripts: [],
    now: 1_000_000,
    speechStartedAt: 999_000,
  };
  return classifyHeuristic(input);
}

console.log('\n=== Listening: bare acknowledgements are answers (regression 2026-07-11) ===');
{
  // Live repro: tutor asked a question, student said "Yeah, okay." 3×,
  // classifier tagged filler each time, turn never dispatched.
  const r = classify('Yeah, okay.', 'listening');
  check('"Yeah, okay." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Okay.', 'listening');
  check('"Okay." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('yeah', 'listening');
  check('"yeah" in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Mhm.', 'listening');
  check('"Mhm." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  // Mixed hesitation+ack ("um, yeah") — the ack carries the meaning.
  const r = classify('Um, yeah.', 'listening');
  check('"Um, yeah." in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}
{
  // 'connected' shares the listening input path.
  const r = classify('Okay.', 'connected');
  check('"Okay." in connected → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Listening: pure hesitations still drop ===');
{
  const r = classify('Um.', 'listening');
  check('"Um." in listening → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('uh, hmm', 'listening');
  check('"uh, hmm" in listening → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Speaking/processing: acknowledgements stay filler (barge-in defence unchanged) ===');
{
  const r = classify('Yeah, okay.', 'speaking');
  check('"Yeah, okay." in speaking → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('okay', 'speaking');
  check('"okay" in speaking → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Yeah, okay.', 'processing');
  check('"Yeah, okay." in processing → filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Unchanged behaviour around the fix ===');
{
  const r = classify('', 'listening');
  check('empty transcript → noise', r.verdict === 'noise', `verdict=${r.verdict}`);
}
{
  const r = classify('What is a derivative?', 'listening');
  check('real question in listening → new_turn', r.verdict === 'new_turn', `verdict=${r.verdict}`);
}
{
  const r = classify('No, wait.', 'speaking');
  check('"No, wait." in speaking → barge_in', r.verdict === 'barge_in', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('so the answer is', 'speaking');
  check('mid-length ambiguous in speaking → escalate', r.verdict === 'escalate', `verdict=${r.verdict}`);
}
{
  const r = classify('and the radius too', 'processing');
  check('continuation lead in processing → continuation', r.verdict === 'continuation', `verdict=${r.verdict}`);
}
{
  const r = classify('okay right', 'error');
  check('ack bigram in transient state → filler (no action path anyway)', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}

// ── Self-voice timing window (echo-fix V2, 2026-07-15) ───────────────────
// The defect: a sentence dispatched at t0 but PLAYED seconds later (long
// multi-sentence turn) was stamped spokenStartedAt==spokenEndedAt==t0, so its
// echo — arriving after real playback, 6–16s of perception latency later —
// fell outside the [start-lead, end+trail] window and was never dropped.
// "Good question." was echoed verbatim and sailed through (World session).
console.log('\n=== Self-voice window: late echo caught only at real playback time (V2) ===');
{
  const SCRIPT = 'Good question.';
  const ECHO = 'Good question';
  // The sentence was DISPATCHED at t=1_000_000 but is sentence #4 of a long
  // turn: it actually PLAYS 6.6s–6.9s later. The student utterance (really the
  // tutor's own voice looping back) "starts" 0.4s after playback ended.
  const dispatchMs = 1_000_000;
  const playStart = 1_006_600;
  const playEnd = 1_006_900;
  const echoSpeechStart = 1_007_300; // 0.4s after real playback-end, 6.3s after dispatch
  const now = 1_010_000; // perception latency

  // Pre-V2: dispatch-time stamps. Window ≈ [999_800, 1_001_500] → echo at
  // 1_007_300 is WAY outside → missed (this is the bug being fixed).
  const preV2: RecentTtsScript[] = [
    { text: SCRIPT, spokenStartedAt: dispatchMs, spokenEndedAt: dispatchMs },
  ];
  const sPre = scoreSelfVoice(ECHO, preV2, echoSpeechStart, now);
  check(
    'pre-V2 dispatch-time stamps MISS the late echo (documents the bug)',
    sPre < SELF_VOICE_THRESHOLD,
    `score=${sPre.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
  );

  // V2: real playback stamps. Window = [playStart-200, playEnd+1500] =
  // [1_006_400, 1_008_400] → echo at 1_007_300 is INSIDE → dropped.
  const v2: RecentTtsScript[] = [
    { id: 1, text: SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const sV2 = scoreSelfVoice(ECHO, v2, echoSpeechStart, now);
  check(
    'V2 real-playback stamps CATCH the late echo',
    sV2 >= SELF_VOICE_THRESHOLD,
    `score=${sV2.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`,
  );

  // Currently-playing sentence: spokenEndedAt=null → treated as live, window
  // extends to now+trail.
  const live: RecentTtsScript[] = [
    { id: 2, text: SCRIPT, spokenStartedAt: playStart, spokenEndedAt: null },
  ];
  const sLive = scoreSelfVoice(ECHO, live, echoSpeechStart, 1_007_400);
  check(
    'currently-playing sentence (ended=null) stays in window',
    sLive >= SELF_VOICE_THRESHOLD,
    `score=${sLive.toFixed(2)}`,
  );

  // Skipped / drained-before-start entry: window zeroed → can never match real
  // student speech (protects against false self-voice drops of real answers).
  const zeroed: RecentTtsScript[] = [
    { id: 3, text: SCRIPT, spokenStartedAt: 0, spokenEndedAt: 0 },
  ];
  const sZero = scoreSelfVoice(ECHO, zeroed, echoSpeechStart, now);
  check(
    'zeroed (skipped/drained) entry never matches real student speech',
    sZero === 0,
    `score=${sZero.toFixed(2)}`,
  );

  check(
    'TTS_PADDING_TRAIL_MS widened to ≥1500ms',
    TTS_PADDING_TRAIL_MS >= 1500,
    `= ${TTS_PADDING_TRAIL_MS}ms`,
  );
}

// ── Script-buffer lifecycle helpers (V2) ─────────────────────────────────
console.log('\n=== Script buffer: dispatch → playback-stamp lifecycle (V2) ===');
{
  const buf: RecentTtsScript[] = [];
  pushTtsScript(buf, 'Good question.', 1, 1_000_000);
  check(
    'dispatch seeds fallback stamps at dispatch time',
    buf[0].spokenStartedAt === 1_000_000 && buf[0].spokenEndedAt === 1_000_000,
    `start=${buf[0].spokenStartedAt} end=${buf[0].spokenEndedAt}`,
  );

  applyPlaybackStamp(buf, { scriptId: 1, phase: 'start', atMs: 1_006_600 });
  check(
    'playback-start stamps real start + marks live (end=null)',
    buf[0].spokenStartedAt === 1_006_600 && buf[0].spokenEndedAt === null,
    `start=${buf[0].spokenStartedAt} end=${buf[0].spokenEndedAt}`,
  );

  applyPlaybackStamp(buf, { scriptId: 1, phase: 'end', atMs: 1_006_900 });
  check(
    'playback-end stamps real end',
    buf[0].spokenEndedAt === 1_006_900,
    `end=${buf[0].spokenEndedAt}`,
  );

  // A skipped sentence (TTS fetch failure) is zeroed.
  pushTtsScript(buf, 'This line failed TTS.', 2, 1_000_100);
  applyPlaybackStamp(buf, { scriptId: 2, phase: 'skip', atMs: 1_000_200 });
  const e2 = buf.find((e) => e.id === 2)!;
  check(
    'skip zeroes the window',
    e2.spokenStartedAt === 0 && e2.spokenEndedAt === 0,
    `start=${e2.spokenStartedAt} end=${e2.spokenEndedAt}`,
  );

  // A stray 'end' after a skip must not resurrect the entry.
  applyPlaybackStamp(buf, { scriptId: 2, phase: 'end', atMs: 1_000_300 });
  check(
    'end after skip stays zeroed',
    e2.spokenStartedAt === 0 && e2.spokenEndedAt === 0,
    `start=${e2.spokenStartedAt} end=${e2.spokenEndedAt}`,
  );

  check(
    'stamp for an unknown id is a no-op (returns false)',
    applyPlaybackStamp(buf, { scriptId: 999, phase: 'end', atMs: 1 }) === false,
  );

  // Duplicate text, distinct ids — each stamps independently (the reason V2
  // carries an id instead of matching by text: "Good question." twice).
  const dup: RecentTtsScript[] = [];
  pushTtsScript(dup, 'Good question.', 10, 2_000_000);
  pushTtsScript(dup, 'Good question.', 11, 2_000_050);
  applyPlaybackStamp(dup, { scriptId: 11, phase: 'start', atMs: 2_006_000 });
  const d10 = dup.find((e) => e.id === 10)!;
  const d11 = dup.find((e) => e.id === 11)!;
  check(
    'duplicate-text entries stamp independently by id',
    d10.spokenStartedAt === 2_000_000 && d11.spokenStartedAt === 2_006_000,
    `d10=${d10.spokenStartedAt} d11=${d11.spokenStartedAt}`,
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
