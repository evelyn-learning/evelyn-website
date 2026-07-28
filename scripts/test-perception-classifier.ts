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
  SPEAKING_ECHO_OVERLAP_THRESHOLD,
  ECHO_ANCHOR_EPSILON_MS,
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

  // 'start' arriving after a 'skip' must not resurrect the entry as live —
  // symmetric with the existing 'end'-after-'skip' guard (fix-wave review
  // finding 3, 2026-07-15).
  pushTtsScript(buf, 'This one raced skip vs start.', 20, 3_000_000);
  applyPlaybackStamp(buf, { scriptId: 20, phase: 'skip', atMs: 3_000_050 });
  applyPlaybackStamp(buf, { scriptId: 20, phase: 'start', atMs: 3_000_100 });
  const e20 = buf.find((e) => e.id === 20)!;
  check(
    'start after skip stays zeroed',
    e20.spokenStartedAt === 0 && e20.spokenEndedAt === 0,
    `start=${e20.spokenStartedAt} end=${e20.spokenEndedAt}`,
  );
}

// ── Fix-wave regression: null-end window leaks on drain paths (review
// finding 1, 2026-07-15) ──────────────────────────────────────────────────
// V2 stamped 'start' with spokenEndedAt=null (perpetually open until an
// 'end' closes it). clearSpeechQueue closed it on a barge-in drain, but
// interrupt()/pause()/disconnect()/reconnect-W4 force-stopped playback
// WITHOUT closing it — a genuine student utterance arriving after one of
// those cuts, sharing vocabulary with the cut sentence, would false-match
// as self-voice and get silently dropped (a regression vs pre-V2). The fix
// wave adds the same `emitPlaybackStamp(id, 'end')` those four sites now
// perform; this test proves the CLOSED window (not the null one) is what a
// real interrupt-path stamp produces, and that it correctly excludes a
// later student utterance despite high text overlap.
console.log('\n=== Fix wave: interrupt-path window close rejects a later real utterance ===');
{
  const CUT_SENTENCE = 'So the derivative of x squared is two x.';
  const cutAtMs = 1_000_000;
  // Student's real, independent answer 3s later happens to share a lot of
  // vocabulary with the cut sentence (plausible in a math tutoring turn).
  const studentTranscript = 'the derivative of x squared is two x right';
  const studentSpeechStart = cutAtMs + 3_000;
  const now = studentSpeechStart + 500;

  // Simulates the OLD (buggy) behaviour: interrupt() cleared audioQueueRef
  // but never emitted 'end', so the entry is still live (end=null) — the
  // window never closes and this later utterance wrongly matches.
  const staleOpen: RecentTtsScript[] = [
    { id: 30, text: CUT_SENTENCE, spokenStartedAt: cutAtMs - 500, spokenEndedAt: null },
  ];
  const sStaleOpen = scoreSelfVoice(studentTranscript, staleOpen, studentSpeechStart, now);
  check(
    'pre-fix: perpetually-open window (end=null) still matches 3s later (documents the regression)',
    sStaleOpen >= SELF_VOICE_THRESHOLD,
    `score=${sStaleOpen.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`,
  );

  // Fix wave: interrupt()/pause()/disconnect()/reconnect now call
  // emitPlaybackStamp(currentScriptIdRef.current, 'end') at the cut, via
  // applyPlaybackStamp — closing the window at cutAtMs.
  const buf: RecentTtsScript[] = [];
  const entry = pushTtsScript(buf, CUT_SENTENCE, 31, cutAtMs - 500)!;
  applyPlaybackStamp(buf, { scriptId: entry.id, phase: 'start', atMs: cutAtMs - 500 });
  applyPlaybackStamp(buf, { scriptId: entry.id, phase: 'end', atMs: cutAtMs }); // the new interrupt-path stamp
  const sClosed = scoreSelfVoice(studentTranscript, buf, studentSpeechStart, now);
  check(
    'fix: window closed at interrupt time does NOT match the student utterance 3s later',
    sClosed < SELF_VOICE_THRESHOLD,
    `score=${sClosed.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
  );
}

// ── Phonetic self-voice matching + speaking-state asymmetry (echo-fix V3,
// 2026-07-15) ──────────────────────────────────────────────────────────
// TDD against the ACTUAL incident (session portal-81f2b582): ASR-garbled
// echoes ("Badu" for "Dadu") scored below SELF_VOICE_THRESHOLD on text
// trigrams and dispatched as real turns. V3 adds (1) a phonetic n-gram pass
// to scoreSelfVoice (conservative, whole-line, runs in every state) and
// (2) a more lenient content-word overlap check scoped to ≤4-word
// utterances during 'speaking' (or its trailing echo window), which alone
// may drop but never barge_in/new_turn even if question-shaped.
console.log('\n=== V3: phonetic self-voice matching (universal scoreSelfVoice) ===');
{
  const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
  const playStart = 2_000_000;
  const playEnd = 2_003_000;
  const scripts: RecentTtsScript[] = [
    { id: 1, text: DADU_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const speechStartedAt = playEnd + 300; // well inside the trail window
  const now = speechStartedAt + 400;

  {
    const s = scoreSelfVoice("Badu, what's now Badu?", scripts, speechStartedAt, now);
    check(
      '"Badu, what\'s now Badu?" phonetically matches "...Dadu, what\'s now Beijing"',
      s >= SELF_VOICE_THRESHOLD,
      `score=${s.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`,
    );
  }
  {
    // Guard: an unrelated short question sharing only common function words
    // ("what"/"the") with the script must NOT phonetically false-match.
    const s = scoreSelfVoice('what about the Ming?', scripts, speechStartedAt, now);
    check(
      '"what about the Ming?" does NOT phonetically false-match the Dadu script',
      s < SELF_VOICE_THRESHOLD,
      `score=${s.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
    );
  }
}

console.log('\n=== V3: speaking-state asymmetry (≤4-word echo during/just-after speaking) ===');
{
  const classifyWithScripts = (
    transcript: string,
    productionState: ProductionStateForClassifier,
    scripts: RecentTtsScript[],
    speechStartedAt: number,
    now: number,
  ) => {
    const input: HeuristicInput = {
      transcript, productionState, recentTtsScripts: scripts, now, speechStartedAt,
    };
    return classifyHeuristic(input);
  };

  const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
  const daduScripts: RecentTtsScript[] = [
    { id: 10, text: DADU_SCRIPT, spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 },
  ];
  const speechStartedAt = 3_003_300;
  const now = speechStartedAt + 400;

  {
    // The actual incident line.
    const r = classifyWithScripts(
      "Badu, what's now Badu?", 'speaking', daduScripts, speechStartedAt, now,
    );
    check(
      '"Badu, what\'s now Badu?" during speaking → drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // "Good question." echoed verbatim — must still drop post-V2/V3 (no
    // regression from adding the phonetic pass / asymmetry gate).
    const scripts: RecentTtsScript[] = [
      { id: 11, text: 'Good question.', spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 },
    ];
    const r = classifyWithScripts('Good question.', 'speaking', scripts, speechStartedAt, now);
    check(
      '"Good question." echo during speaking stays drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Single-word echo diluted below scoreSelfVoice's whole-line bar — only
    // the speaking-state asymmetry catches this one.
    const scripts: RecentTtsScript[] = [
      {
        id: 12,
        text: 'how often the Yuan actually used the Mongol title',
        spokenStartedAt: 3_000_000,
        spokenEndedAt: 3_003_000,
      },
    ];
    const universalScore = scoreSelfVoice('actually turn', scripts, speechStartedAt, now);
    check(
      '"actually turn" does NOT clear the universal (conservative) self-voice bar alone',
      universalScore < SELF_VOICE_THRESHOLD,
      `universal score=${universalScore.toFixed(2)} < ${SELF_VOICE_THRESHOLD} (asymmetry gate must be doing the work)`,
    );
    const r = classifyWithScripts('actually turn', 'speaking', scripts, speechStartedAt, now);
    check(
      '"actually turn" during speaking → drop_self_voice (speaking-state asymmetry, not barge_in)',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // False-positive guard: a genuinely novel question during speaking,
    // sharing only function words with the script — must barge_in.
    const r = classifyWithScripts(
      'what about the Ming?', 'speaking', daduScripts, speechStartedAt, now,
    );
    check(
      '"what about the Ming?" during speaking → barge_in (NOT dropped, novel content)',
      r.verdict === 'barge_in',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // False-positive guard: a short genuine interjection with zero TTS
    // overlap must still barge_in via the existing trigger lexicon.
    const r = classifyWithScripts('no, wait', 'speaking', daduScripts, speechStartedAt, now);
    check(
      '"no, wait" during speaking → barge_in (genuine interjection, no TTS overlap)',
      r.verdict === 'barge_in',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Tricky policy case: the student deliberately echoes the tutor to ask
    // about it. 4 raw words, phonetically + verbatim identical to the
    // script. Documented policy: err toward drop during 'speaking' — V1's
    // sustained-energy gate is the backstop for a genuinely sustained
    // real question, and the student can re-ask once the tutor stops.
    const r = classifyWithScripts(
      "Dadu? what's Dadu?", 'speaking', daduScripts, speechStartedAt, now,
    );
    check(
      '"Dadu? what\'s Dadu?" (echo-as-question) during speaking → drop_self_voice (policy: err toward drop)',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Fix wave (2026-07-15, review finding 1): the asymmetry gate no longer
    // extends into 'listening' via the trailing echo window — it now
    // requires production state to be LITERALLY 'speaking'. A transcript
    // landing in 'listening' just after the script finished — even inside
    // the old trail window — must NOT be swept into the lenient tier-2
    // check; it's a genuine short answer path (new_turn), not an echo.
    const trailNow = speechStartedAt + 200;
    const r = classifyWithScripts(
      'actually turn', 'listening',
      [{ id: 13, text: 'how often the Yuan actually used the Mongol title',
         spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 }],
      speechStartedAt, trailNow,
    );
    check(
      '"actually turn" landing in listening within the old trail window → new_turn (fix wave finding 1)',
      r.verdict === 'new_turn',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Scope guard: the asymmetry only applies to ≤4 raw words. A longer,
    // genuinely ambiguous utterance that happens to reuse "actually" must
    // NOT be swept into drop_self_voice just for sharing one word.
    const r = classifyWithScripts(
      'wait, actually I think I misheard that',
      'speaking',
      [{ id: 14, text: 'how often the Yuan actually used the Mongol title',
         spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 }],
      speechStartedAt, now,
    );
    check(
      'longer utterance (>4 words) reusing one script word stays out of the short-utterance asymmetry',
      r.verdict !== 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Sanity: the threshold constant is the documented 0.5, not silently
    // drifted.
    check(
      'SPEAKING_ECHO_OVERLAP_THRESHOLD is the documented 0.5',
      SPEAKING_ECHO_OVERLAP_THRESHOLD === 0.5,
      `= ${SPEAKING_ECHO_OVERLAP_THRESHOLD}`,
    );
  }
}

// ── Fix wave (2026-07-15): review findings on V3 ─────────────────────────
// Findings from the V3 code review, addressed here via TDD (failing tests
// written first, then the fix applied in perception-classifier.ts):
//   1. (CRITICAL) tier-2 asymmetry gate was `state==='speaking' ||
//      inTrailWindowOfAnyScript(...)` — the OR leaked the lenient 0.5
//      threshold into 'listening', swallowing genuine short answers.
//   2. (Important) phonetic CONTAINMENT alone was too aggressive for a
//      1-content-word transcript (mega-stop-class collisions like
//      big/dig/pig/pick), in every state.
//   3. (Important, observability) a drop reached ONLY via the phonetic pass
//      must say so distinctly in the reason string.
console.log('\n=== Fix wave finding 1: tier-2 asymmetry scoped to literal \'speaking\' only ===');
{
  const classifyWithScripts = (
    transcript: string,
    productionState: ProductionStateForClassifier,
    scripts: RecentTtsScript[],
    speechStartedAt: number,
    now: number,
  ) => {
    const input: HeuristicInput = {
      transcript, productionState, recentTtsScripts: scripts, now, speechStartedAt,
    };
    return classifyHeuristic(input);
  };

  // The probe-confirmed case from the finding: tutor asks a question, the
  // student's short partial-echo ANSWER lands 0.5s later, state already
  // 'listening'.
  const KARAKORUM_SCRIPT = 'was the capital Dadu or Karakorum?';
  const playStart = 4_000_000;
  const playEnd = 4_002_000;
  const scripts: RecentTtsScript[] = [
    { id: 40, text: KARAKORUM_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const speechStartedAt = playEnd + 500; // +0.5s, well inside the old trail window
  const now = speechStartedAt + 300;

  {
    const universal = scoreSelfVoice('Dadu definitely', scripts, speechStartedAt, now);
    check(
      '"Dadu definitely" does not clear the universal (tier-1) self-voice bar alone',
      universal < SELF_VOICE_THRESHOLD,
      `score=${universal.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
    );
  }
  {
    const r = classifyWithScripts('Dadu definitely', 'listening', scripts, speechStartedAt, now);
    check(
      '"Dadu definitely" +0.5s after "...Dadu or Karakorum?", state=listening → NOT dropped (new_turn)',
      r.verdict === 'new_turn',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // The SAME transcript arriving while state is still literally 'speaking'
    // must still be dropped — the gate narrows to 'speaking' only, it
    // doesn't disable tier 2 altogether.
    const r = classifyWithScripts('Dadu definitely', 'speaking', scripts, speechStartedAt, now);
    check(
      '"Dadu definitely" during literal \'speaking\' → still drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
  {
    // Regression guard: every incident-line drop from the original V3 test
    // block above occurred during literal 'speaking' state, so none of them
    // depended on the removed trail-window OR — re-assert the headline
    // incident case here as a fix-wave-scoped guard.
    const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
    const daduScripts: RecentTtsScript[] = [
      { id: 41, text: DADU_SCRIPT, spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 },
    ];
    const r = classifyWithScripts(
      "Badu, what's now Badu?", 'speaking', daduScripts, 3_003_300, 3_003_700,
    );
    check(
      'incident line "Badu, what\'s now Badu?" during speaking still drops after the fix',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }
}

console.log('\n=== Fix wave finding 2: phonetic containment bounded to >1 content word ===');
{
  // "big"/"dig"/"pig"/"pick" all collapse to the same consonant-skeleton
  // code under the mega-stop-class. A bare 1-word transcript that merely
  // SOUNDS like one script token must not drop on that alone.
  const CHANGE_SCRIPT = 'that was a big change for the empire';
  const playStart = 5_000_000;
  const playEnd = 5_002_000;
  const scripts: RecentTtsScript[] = [
    { id: 50, text: CHANGE_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const speechStartedAt = playEnd + 300;
  const now = speechStartedAt + 300;

  {
    const s = scoreSelfVoice('pick', scripts, speechStartedAt, now);
    check(
      '"pick" (1 word, phonetically same class as "big") does NOT self-voice-match via containment alone',
      s < SELF_VOICE_THRESHOLD,
      `score=${s.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
    );
  }

  // The incident's own core case: script contains literal "Dadu", student
  // says the 1-word garble "Badu". This occurred DURING 'speaking', where
  // tier 2 (multi-measure, scoped to 'speaking') still catches it — but a
  // bare 1-word phonetic resemblance during 'listening' must NOT drop on
  // phonetics alone.
  const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
  const daduPlayStart = 5_100_000;
  const daduPlayEnd = 5_102_000;
  const daduScripts: RecentTtsScript[] = [
    { id: 51, text: DADU_SCRIPT, spokenStartedAt: daduPlayStart, spokenEndedAt: daduPlayEnd },
  ];
  const daduSpeechStartedAt = daduPlayEnd + 300;
  const daduNow = daduSpeechStartedAt + 300;

  {
    const classifyWithScripts = (productionState: ProductionStateForClassifier) => {
      const input: HeuristicInput = {
        transcript: 'Badu',
        productionState,
        recentTtsScripts: daduScripts,
        now: daduNow,
        speechStartedAt: daduSpeechStartedAt,
      };
      return classifyHeuristic(input);
    };
    const rSpeaking = classifyWithScripts('speaking');
    check(
      '"Badu" (1 word) during speaking → drop_self_voice (tier 2 still catches it)',
      rSpeaking.verdict === 'drop_self_voice',
      `verdict=${rSpeaking.verdict} (${rSpeaking.reason})`,
    );
    const rListening = classifyWithScripts('listening');
    check(
      '"Badu" (1 word) during listening → NOT dropped by phonetics alone (new_turn)',
      rListening.verdict === 'new_turn',
      `verdict=${rListening.verdict} (${rListening.reason})`,
    );
  }
}

console.log('\n=== Fix wave finding 3: distinct reason for phonetic-only drops ===');
{
  // "Badu, what's now Badu?" against the Dadu script clears threshold via
  // the PHONETIC pass only (text containment misses — "badu" is never a
  // literal token in the script, only "dadu" is). Verified above (V3
  // section) that the universal score is 0.90 via containment; assert here
  // that the reason string names it as phonetic specifically, in EVERY
  // state (tier 1 is unconditional), not just 'speaking'.
  const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
  const playStart = 6_000_000;
  const playEnd = 6_002_000;
  const scripts: RecentTtsScript[] = [
    { id: 60, text: DADU_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const speechStartedAt = playEnd + 300;
  const now = speechStartedAt + 300;
  const input: HeuristicInput = {
    transcript: "Badu, what's now Badu?",
    productionState: 'listening',
    recentTtsScripts: scripts,
    now,
    speechStartedAt,
  };
  const r = classifyHeuristic(input);
  check(
    '"Badu, what\'s now Badu?" → drop_self_voice',
    r.verdict === 'drop_self_voice',
    `verdict=${r.verdict}`,
  );
  check(
    'reason string distinctly names the phonetic-only pass',
    r.reason.startsWith('phonetic-echo overlap'),
    `reason="${r.reason}"`,
  );

  // Regression guard: an exact TEXT echo ("Good question.") must keep the
  // ordinary "self-voice score" reason, not the phonetic-only one — the
  // text pass alone already clears threshold there.
  const goodQ: RecentTtsScript[] = [
    { id: 61, text: 'Good question.', spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  const rText = classifyHeuristic({
    transcript: 'Good question.',
    productionState: 'listening',
    recentTtsScripts: goodQ,
    now,
    speechStartedAt,
  });
  check(
    'exact text echo keeps the ordinary "self-voice score" reason (not phonetic-only)',
    rText.reason.startsWith('self-voice score'),
    `reason="${rText.reason}"`,
  );
}

// ── Final-review fix wave (2026-07-16): distinct reason for containment-only
// drops ─────────────────────────────────────────────────────────────────
// The dominant known FP class in the self-voice matcher (see the KNOWN
// PRE-EXISTING FALSE POSITIVE comment in perception-classifier.ts): the tutor
// asks "...Dadu or Karakorum?" and the student's exact-echo 1-word ANSWER
// "Dadu" trivially contains-matches the script line, even though jaccard/
// n-gram are diluted by the line's length and never approach containment's
// 0.9. Item 1 marks this distinctly (with word count) so prod logs can count
// it separately from ordinary jaccard/n-gram-driven drops and from the
// phonetic-only pass.
console.log('\n=== Final-review item 1: distinct reason for containment-only drops ===');
{
  const KARAKORUM_SCRIPT = 'was the capital Dadu or Karakorum?';
  const playStart = 7_000_000;
  const playEnd = 7_002_000;
  const scripts: RecentTtsScript[] = [
    { id: 70, text: KARAKORUM_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];
  // Speech that BEGINS while the audio is still playing (onset inside
  // [playStart, playEnd]) — a genuine during-playback containment echo, for
  // which the Task X6 echo anchor is satisfied and the containment lift
  // still applies. (The post-playback FP case, where the same "Dadu" is a
  // real answer and must NOT drop, is covered in the Task X6 block below.)
  const speechStartedAt = playStart + 1_000;
  const now = playEnd + 300;

  {
    // "Dadu" alone: contained in the (much longer) script line, but jaccard
    // and n-gram are both diluted well below 0.9 by the line's length — only
    // containment clears the bar.
    const r = classifyHeuristic({
      transcript: 'Dadu',
      productionState: 'listening',
      recentTtsScripts: scripts,
      now,
      speechStartedAt,
    });
    check(
      '"Dadu" contained in the Karakorum script (onset during playback) → drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
    check(
      'reason string names the containment class distinctly, with word count',
      /^self-voice containment \(1w\) [\d.]+$/.test(r.reason),
      `reason="${r.reason}"`,
    );
  }
  {
    // Regression guard: an exact full-line echo ("Good question.") is
    // ALSO trivially containment=1, but jaccard/n-gram tie it there too — the
    // containment marker must NOT fire when it isn't uniquely responsible for
    // the drop, so this must keep the ordinary "self-voice score" reason.
    const goodQ: RecentTtsScript[] = [
      { id: 71, text: 'Good question.', spokenStartedAt: playStart, spokenEndedAt: playEnd },
    ];
    const r = classifyHeuristic({
      transcript: 'Good question.',
      productionState: 'listening',
      recentTtsScripts: goodQ,
      now,
      speechStartedAt,
    });
    check(
      'jaccard/n-gram-driven full-line echo does NOT carry the containment marker',
      !r.reason.startsWith('self-voice containment') && r.reason.startsWith('self-voice score'),
      `reason="${r.reason}"`,
    );
  }
  {
    // Regression guard: the existing phonetic-only case must still take
    // priority over the containment marker (it's checked first) — a
    // phonetic-only drop must never be mislabeled as containment.
    const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
    const daduScripts: RecentTtsScript[] = [
      { id: 72, text: DADU_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
    ];
    const r = classifyHeuristic({
      transcript: "Badu, what's now Badu?",
      productionState: 'listening',
      recentTtsScripts: daduScripts,
      now,
      speechStartedAt,
    });
    check(
      'phonetic-only drop keeps its own marker, not the containment one',
      r.reason.startsWith('phonetic-echo overlap'),
      `reason="${r.reason}"`,
    );
  }
}

// ── Task X6 (2026-07-16): echo anchor — speechStartedAt <= spokenEndedAt+ε
// ─────────────────────────────────────────────────────────────────────────
// The dominant known FP: a genuine 1-2-word ANSWER lands in the trail window
// right after the tutor asked about that exact word ("Dadu" after "...Dadu
// or Karakorum?") and drops as self-voice via text/phonetic CONTAINMENT.
// Remedy: an echo cannot BEGIN after the speaker stopped, so the lenient
// containment measures apply only when the student's speech ONSET
// (speechStartedAt, VAD-reconstructed as Date.now()-latencyMs) is at or
// before playback end + ε. Onset after playback end = student → containment
// lift withheld (jaccard/n-gram stay in play, so a verbatim full-line echo
// still drops). ε accounts for VAD onset lag.
console.log('\n=== Task X6: echo anchor (speechStartedAt <= spokenEndedAt + ε) ===');
{
  const classifyWithScripts = (
    transcript: string,
    productionState: ProductionStateForClassifier,
    scripts: RecentTtsScript[],
    speechStartedAt: number | undefined,
    now: number,
  ) => {
    const input: HeuristicInput = {
      transcript, productionState, recentTtsScripts: scripts, now, speechStartedAt,
    };
    return classifyHeuristic(input);
  };

  const KARAKORUM_SCRIPT = 'was the capital Dadu or Karakorum?';
  const playStart = 8_000_000;
  const playEnd = 8_002_000;
  const scripts: RecentTtsScript[] = [
    { id: 80, text: KARAKORUM_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: playEnd },
  ];

  {
    // THE FP, FIXED: student's exact-echo 1-word answer "Dadu" begins 0.4s
    // AFTER playback ended → not this line's echo → containment withheld →
    // NOT dropped. (Same transcript, same script, as the containment-marker
    // regression above, which uses during-playback onset and still drops.)
    const speechStartedAt = playEnd + 400;
    const now = speechStartedAt + 300;
    const universal = scoreSelfVoice('Dadu', scripts, speechStartedAt, now);
    check(
      '"Dadu" onset 0.4s after playback end no longer clears the self-voice bar',
      universal < SELF_VOICE_THRESHOLD,
      `score=${universal.toFixed(2)} < ${SELF_VOICE_THRESHOLD}`,
    );
    const r = classifyWithScripts('Dadu', 'listening', scripts, speechStartedAt, now);
    check(
      '"Dadu" answer 0.4s after "...Dadu or Karakorum?" → new_turn (FP fixed)',
      r.verdict === 'new_turn',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }

  {
    // A true echo that BEGAN mid-playback but whose transcript arrives late
    // (long perception latency) still drops — onset is before playback end,
    // so the anchor is satisfied and containment applies.
    const speechStartedAt = playStart + 800; // onset while audio still playing
    const lateNow = playEnd + 4_000;         // transcript lands 4s after end
    const r = classifyWithScripts('Dadu', 'listening', scripts, speechStartedAt, lateNow);
    check(
      'true echo (onset mid-playback, transcript late) → still drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }

  {
    // Boundary: onset exactly at playback end + ε is still anchored-in (VAD
    // onset lag budget) → drops. One ms beyond ε → withheld → new_turn.
    const rAtEps = classifyWithScripts(
      'Dadu', 'listening', scripts, playEnd + ECHO_ANCHOR_EPSILON_MS, playEnd + ECHO_ANCHOR_EPSILON_MS + 300,
    );
    check(
      'onset exactly at playEnd+ε → still drop_self_voice (within VAD-onset slop)',
      rAtEps.verdict === 'drop_self_voice',
      `verdict=${rAtEps.verdict} (${rAtEps.reason})`,
    );
    const rPastEps = classifyWithScripts(
      'Dadu', 'listening', scripts, playEnd + ECHO_ANCHOR_EPSILON_MS + 1, playEnd + ECHO_ANCHOR_EPSILON_MS + 301,
    );
    check(
      'onset 1ms past playEnd+ε → new_turn (anchor withholds containment)',
      rPastEps.verdict === 'new_turn',
      `verdict=${rPastEps.verdict} (${rPastEps.reason})`,
    );
  }

  {
    // Fail-safe: some payloads carry no onset (speechStartedAt undefined).
    // The anchor must NOT newly suppress — keep today's behaviour (drop) on
    // missing data rather than risk letting a real echo through.
    const r = classifyWithScripts('Dadu', 'listening', scripts, undefined, playEnd + 400);
    check(
      'speechStartedAt undefined → fail safe: containment still drops (today\'s behaviour)',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }

  {
    // A currently-playing script (spokenEndedAt = null) is live at `now`, so
    // the anchor is trivially satisfied even for an onset "after" any past
    // stamp — containment applies, echo drops. (Mirrors the speaking-state
    // reality where tier-2 relies on this same triviality.)
    const live: RecentTtsScript[] = [
      { id: 81, text: KARAKORUM_SCRIPT, spokenStartedAt: playStart, spokenEndedAt: null },
    ];
    const r = classifyWithScripts('Dadu', 'speaking', live, playStart + 5_000, playStart + 5_300);
    check(
      'live script (end=null) → anchor trivially satisfied → drop_self_voice',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }

  {
    // The anchor removes ONLY the containment lift, NOT the broad-agreement
    // (jaccard/n-gram) path: a verbatim FULL-line echo arriving 0.4s after
    // playback end still drops — a real answer never reproduces a whole
    // tutor line, so this can't swallow a genuine turn.
    const gq: RecentTtsScript[] = [
      { id: 82, text: 'Good question.', spokenStartedAt: playStart, spokenEndedAt: playEnd },
    ];
    const speechStartedAt = playEnd + 400;
    const s = scoreSelfVoice('Good question', gq, speechStartedAt, speechStartedAt + 300);
    check(
      'verbatim full-line echo 0.4s after playback end → still drops (jaccard/n-gram un-anchored)',
      s >= SELF_VOICE_THRESHOLD,
      `score=${s.toFixed(2)} ≥ ${SELF_VOICE_THRESHOLD}`,
    );
  }

  {
    // Fail-safe wiring (2026-07-16, Task X6): when VAD reports no onset
    // (latencyMs === 0, speechStartedAt undefined in caller), the echo anchor
    // is satisfied (fail-safe engaged), so containment-based drops still occur.
    // This mirrors the existing undefined-speechStartedAt test but verifies the
    // zero-latency payload shape (undefined is the fail-safe, not an error).
    const zeroLatencyScripts: RecentTtsScript[] = [
      { id: 91, text: 'was the capital Dadu or Karakorum?', spokenStartedAt: 6_000_000, spokenEndedAt: 6_002_000 },
    ];
    const r = classifyWithScripts('Dadu', 'listening', zeroLatencyScripts, undefined, 6_002_300);
    check(
      'zero-latency (undefined speechStartedAt) payload → containment still drops (fail-safe)',
      r.verdict === 'drop_self_voice',
      `verdict=${r.verdict} (${r.reason})`,
    );
  }

  {
    // Regression: the three original incident lines all occur during literal
    // 'speaking' (tutor still talking) and must STILL drop after the anchor.
    const DADU_SCRIPT = "the Mongol capital up at Dadu, what's now Beijing";
    const YUAN_SCRIPT = 'how often the Yuan actually used the Mongol title';
    const speaking = (transcript: string, text: string) => classifyWithScripts(
      transcript, 'speaking',
      [{ id: 83, text, spokenStartedAt: 3_000_000, spokenEndedAt: 3_003_000 }],
      3_003_300, 3_003_700,
    );
    check(
      'incident 1: "Badu, what\'s now Badu?" during speaking → still drop_self_voice',
      speaking("Badu, what's now Badu?", DADU_SCRIPT).verdict === 'drop_self_voice',
      `verdict=${speaking("Badu, what's now Badu?", DADU_SCRIPT).verdict}`,
    );
    check(
      'incident 2: "actually turn" during speaking → still drop_self_voice',
      speaking('actually turn', YUAN_SCRIPT).verdict === 'drop_self_voice',
      `verdict=${speaking('actually turn', YUAN_SCRIPT).verdict}`,
    );
    check(
      'incident 3: "Dadu? what\'s Dadu?" during speaking → still drop_self_voice',
      speaking("Dadu? what's Dadu?", DADU_SCRIPT).verdict === 'drop_self_voice',
      `verdict=${speaking("Dadu? what's Dadu?", DADU_SCRIPT).verdict}`,
    );
  }

  {
    // Sanity: ε is the documented VAD-onset slop, not silently drifted, and
    // stays in the cited 100-200ms range.
    check(
      'ECHO_ANCHOR_EPSILON_MS is the documented 200ms VAD-onset slop',
      ECHO_ANCHOR_EPSILON_MS === 200,
      `= ${ECHO_ANCHOR_EPSILON_MS}`,
    );
  }
}

console.log('\n=== Offered-option echo exemption (live round 5, 2026-07-23, session-1784778855564) ===');
{
  // Live repro: tutor asked "…or should we move to free body diagrams
  // next?", student answered "Free body diagrams." — containment scored
  // sv=1.00 and the answer was dropped as self-voice; the student had to
  // repeat it. Picking a tutor-OFFERED option from a QUESTION, while
  // LISTENING, without echoing the question's final word, is an answer.
  const OPTION_Q = 'Want to try one with a twist, or should we move to free body diagrams next?';
  const optionScripts: RecentTtsScript[] = [
    { text: OPTION_Q, spokenStartedAt: 990_000, spokenEndedAt: 998_800 },
  ];
  // Onset 999_500 = clearly after playback end (998_800) + the 200ms ε slop
  // (the exemption requires a post-playback onset; at exactly end+ε it must
  // still drop — covered by the Task X6 boundary test above).
  const run = (transcript: string, productionState: ProductionStateForClassifier) =>
    classifyHeuristic({ transcript, productionState, recentTtsScripts: optionScripts, now: 1_000_000, speechStartedAt: 999_500 });

  const pick = run('Free body diagrams.', 'listening');
  check('option pick in listening → NOT dropped as self-voice', pick.verdict !== 'drop_self_voice', `verdict=${pick.verdict} (${pick.reason})`);
  check('option pick classifies as a turn', pick.verdict === 'new_turn', `verdict=${pick.verdict}`);

  const tail = run('free body diagrams next', 'listening');
  check('tail echo (includes final word) → still dropped', tail.verdict === 'drop_self_voice', `verdict=${tail.verdict}`);

  const overtalk = run('Free body diagrams.', 'speaking');
  check('same text during speaking → still dropped', overtalk.verdict === 'drop_self_voice', `verdict=${overtalk.verdict}`);

  const stmtScripts: RecentTtsScript[] = [
    { text: 'We should move to free body diagrams next.', spokenStartedAt: 990_000, spokenEndedAt: 998_800 },
  ];
  const nonQ = classifyHeuristic({ transcript: 'Free body diagrams.', productionState: 'listening', recentTtsScripts: stmtScripts, now: 1_000_000, speechStartedAt: 999_500 });
  check('echo of a NON-question statement → still dropped', nonQ.verdict === 'drop_self_voice', `verdict=${nonQ.verdict}`);
}

console.log('\n=== Brief numeric answers must not silently drop (Session-1784908707278, 2026-07-24) ===');
{
  // Live incident class: tutor asks "how many other carbons?", student
  // answers "4." then "3." while the prod state is speaking/processing —
  // the <3w branches classed them filler and nothing downstream consumes
  // a filler verdict (silent drop). Numeric shapes now escalate to Haiku.
  const r = classify('4.', 'speaking');
  check('"4." in speaking → escalate (not filler)', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('3', 'processing');
  check('"3" in processing → escalate (not filler)', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('Three.', 'speaking');
  check('"Three." in speaking → escalate', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('negative four', 'processing');
  check('"negative four" in processing → escalate', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('3/4', 'speaking');
  check('"3/4" in speaking → escalate', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  // Multiple-choice single letter is an answer shape too.
  const r = classify('B.', 'processing');
  check('"B." in processing → escalate', r.verdict === 'escalate', `verdict=${r.verdict} (${r.reason})`);
}
{
  // Non-numeric brief speech keeps today's behavior.
  const r = classify('so like', 'speaking');
  check('"so like" in speaking → still filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  const r = classify('um', 'processing');
  check('"um" in processing → still filler', r.verdict === 'filler', `verdict=${r.verdict} (${r.reason})`);
}
{
  // In listening the numeric answer already dispatched — unchanged.
  const r = classify('4.', 'listening');
  check('"4." in listening → new_turn (unchanged)', r.verdict === 'new_turn', `verdict=${r.verdict} (${r.reason})`);
}

console.log('\n=== Onset-during-playback echo reaching \'listening\' (portal-b3838f70, 2026-07-28 opener) ===');
{
  // Live incident: the opener echoed into the mic before AEC converged.
  // Barge-in kill #1 cut sentence 1 ("...Praveen — last time...") at
  // 01:20:00.9; resume replayed sentences 2-3; kill #2 cut those at
  // 01:20:02.99 → state 'listening'. The echo's transcript "Praveen,"
  // then landed at 01:20:04.85 with its VAD onset (02.6) DURING the
  // resumed playback — but sentence 1 (the only script containing
  // "Praveen") was already outside its playback+trail window, and the
  // in-window resumed sentences don't contain the word. Tier-1 scored 0,
  // the 'listening' branch dispatched new_turn, and the tutor answered
  // its own echo ("Right, I'm here.").
  const openerScripts: RecentTtsScript[] = [
    // sentence 1 — killed by echo barge-in; onset below is PAST its
    // 1.5s trail window (winEnd = 1_003_900 + TTS_PADDING_TRAIL_MS)
    { text: 'Great to have you back, Praveen — last time we were deep in AP Macro scarcity.', spokenStartedAt: 1_000_000, spokenEndedAt: 1_003_900 },
    // resumed sentence — playing at the echo's onset, no "Praveen" in it
    { text: 'Want to pick up from there, or dive into something new?', spokenStartedAt: 1_004_600, spokenEndedAt: 1_005_950 },
  ];
  const r = classifyHeuristic({
    transcript: 'Praveen,',
    productionState: 'listening',
    recentTtsScripts: openerScripts,
    now: 1_008_000,
    speechStartedAt: 1_005_700, // during the resumed sentence's playback
  });
  check('"Praveen," onset during playback, arriving in listening → drop_self_voice',
    r.verdict === 'drop_self_voice', `verdict=${r.verdict} (${r.reason})`);

  // Guard: same word but onset clearly AFTER all playback ended (student
  // genuinely said the tutor's word once the tutor went quiet) → the
  // during-playback gate must NOT apply; tier-1's conservative pass owns
  // that shape (echo-anchor exemption keeps genuine answers alive).
  const afterPlayback = classifyHeuristic({
    transcript: 'Praveen,',
    productionState: 'listening',
    recentTtsScripts: openerScripts,
    now: 1_008_000,
    speechStartedAt: 1_006_400, // > 1_005_950 + ECHO_ANCHOR_EPSILON_MS
  });
  check('same word, onset after playback ended → NOT the during-playback drop',
    !(afterPlayback.verdict === 'drop_self_voice' && /onset-during-playback/.test(afterPlayback.reason)),
    `verdict=${afterPlayback.verdict} (${afterPlayback.reason})`);

  // Guard: "Dadu definitely" regression class (2026-07-15 review finding 1)
  // — a genuine short answer ~0.5s AFTER the question finished must still
  // dispatch. Onset is not during any playback window → gate off.
  const daduScripts: RecentTtsScript[] = [
    { text: 'So was the capital Dadu or Karakorum?', spokenStartedAt: 990_000, spokenEndedAt: 998_800 },
  ];
  const dadu = classifyHeuristic({
    transcript: 'Dadu definitely',
    productionState: 'listening',
    recentTtsScripts: daduScripts,
    now: 1_000_000,
    speechStartedAt: 999_300,
  });
  check('"Dadu definitely" 0.5s after question → still new_turn',
    dadu.verdict === 'new_turn', `verdict=${dadu.verdict} (${dadu.reason})`);

  // Guard: short utterance with onset during playback but NO overlap with
  // any recent script is a genuine (if rude) barge attempt → not dropped.
  const noOverlap = classifyHeuristic({
    transcript: 'What about interest rates',
    productionState: 'listening',
    recentTtsScripts: openerScripts,
    now: 1_008_000,
    speechStartedAt: 1_005_700,
  });
  check('non-overlapping short speech during playback → not dropped',
    noOverlap.verdict !== 'drop_self_voice', `verdict=${noOverlap.verdict} (${noOverlap.reason})`);

  // Guard: ≥5 raw words never enters the lenient gate even with overlap.
  const long = classifyHeuristic({
    transcript: 'last time we were deep in AP Macro scarcity',
    productionState: 'listening',
    recentTtsScripts: openerScripts,
    now: 1_008_000,
    speechStartedAt: 1_005_700,
  });
  check('long overlapping utterance during playback → not the during-playback drop',
    !/onset-during-playback/.test(long.reason), `verdict=${long.verdict} (${long.reason})`);
}

console.log('\n=== Onset-during-speech via STATE windows (portal-cca76850, round-6 live test) ===');
{
  // Field failure of the script-window gate: "Last we tackled" (garbled
  // echo of the opener "…last time we tackled…") arrived 6.7s after the
  // barge-in kill. By then the kill/resume splintering had CLOSED every
  // script playback window containing the onset — onsetDuringScriptPlayback
  // found nothing and the transcript dispatched as new_turn. The component
  // now ALSO passes `onsetDuringTutorSpeech`, derived from recorded
  // production-state 'speaking' windows, which survives any script-stamp
  // mess.
  const staleScripts: RecentTtsScript[] = [
    // opener sentence: killed long before the onset; its window+trail are past
    { text: 'Great to have you back, Praveen — last time we tackled AP Macro scarcity.', spokenStartedAt: 1_000_000, spokenEndedAt: 1_002_000 },
  ];
  const r = classifyHeuristic({
    transcript: 'Last we tackled',
    productionState: 'listening',
    recentTtsScripts: staleScripts,
    now: 1_012_000,
    speechStartedAt: 1_005_300, // outside every script window…
    onsetDuringTutorSpeech: true, // …but the tutor WAS audibly speaking then
  });
  check('"Last we tackled", stale script windows, state-window onset → drop_self_voice',
    r.verdict === 'drop_self_voice', `verdict=${r.verdict} (${r.reason})`);

  // Without the flag the script-window gate still governs (unchanged shape).
  const noFlag = classifyHeuristic({
    transcript: 'Last we tackled',
    productionState: 'listening',
    recentTtsScripts: staleScripts,
    now: 1_012_000,
    speechStartedAt: 1_005_300,
  });
  check('same input without the state-window flag → not the during-playback drop (script gate off)',
    !/onset-during-playback/.test(noFlag.reason), `verdict=${noFlag.verdict} (${noFlag.reason})`);

  // Guard: state-window flag TRUE but no word overlap → still dispatches.
  const noOverlap = classifyHeuristic({
    transcript: 'What about demand',
    productionState: 'listening',
    recentTtsScripts: staleScripts,
    now: 1_012_000,
    speechStartedAt: 1_005_300,
    onsetDuringTutorSpeech: true,
  });
  check('state-window onset, zero overlap → not dropped',
    noOverlap.verdict !== 'drop_self_voice', `verdict=${noOverlap.verdict} (${noOverlap.reason})`);

  // Guard: flag false + onset after speech ended ("Dadu definitely" class)
  // remains a real answer.
  const dadu = classifyHeuristic({
    transcript: 'Scarcity definitely',
    productionState: 'listening',
    recentTtsScripts: staleScripts,
    now: 1_012_000,
    speechStartedAt: 1_005_300,
    onsetDuringTutorSpeech: false,
  });
  check('post-speech short answer (flag false) → still new_turn',
    dadu.verdict === 'new_turn', `verdict=${dadu.verdict} (${dadu.reason})`);
}

console.log('\n=== Mid-length echo splices past the ≤4-word cap (portal-386d96cb, round-6e) ===');
{
  // Field failures: "x equals to before you check" (6 raw words) and
  // "3. So give us that." (5) — both onset-during-speaking echo splices of
  // the tutor's own sentence, both past tier 1.6's ≤4-word cap, both
  // 'escalate'd to Haiku which dispatched them as barge_in. Words 5-10 with
  // onset during tutor speech now take a STRICTER overlap bar (0.8): an
  // echo splice is composed almost entirely of the tutor's own words.
  const scripts: RecentTtsScript[] = [
    { text: 'So x equals 2 — before you check the two-sided limit, give us that left-hand value. 3, right.', spokenStartedAt: 1_000_000, spokenEndedAt: 1_006_000 },
  ];
  const splice6 = classifyHeuristic({
    transcript: 'x equals to before you check',
    productionState: 'speaking',
    recentTtsScripts: scripts,
    now: 1_009_000,
    speechStartedAt: 1_004_000,
    onsetDuringTutorSpeech: true,
  });
  check('"x equals to before you check" onset-during-speech → drop_self_voice',
    splice6.verdict === 'drop_self_voice', `verdict=${splice6.verdict} (${splice6.reason})`);

  const splice5 = classifyHeuristic({
    transcript: '3. So give us that.',
    productionState: 'speaking',
    recentTtsScripts: scripts,
    now: 1_009_000,
    speechStartedAt: 1_004_500,
    onsetDuringTutorSpeech: true,
  });
  check('"3. So give us that." onset-during-speech → drop_self_voice',
    splice5.verdict === 'drop_self_voice', `verdict=${splice5.verdict} (${splice5.reason})`);

  // Guard: genuine mid-length interjection with low overlap → untouched
  // (escalates as today).
  const genuine = classifyHeuristic({
    transcript: 'wait can we do the homework problem',
    productionState: 'speaking',
    recentTtsScripts: scripts,
    now: 1_009_000,
    speechStartedAt: 1_004_000,
    onsetDuringTutorSpeech: true,
  });
  check('genuine low-overlap mid-length interjection → not dropped',
    genuine.verdict !== 'drop_self_voice', `verdict=${genuine.verdict} (${genuine.reason})`);

  // Guard: a student READING THE BOARD BACK is long (>10 raw words) even
  // when every content word is the tutor's — the cap keeps it alive.
  const recitation = classifyHeuristic({
    transcript: 'when we say that limit x tends to 3 minus is equal to 7 and limit x tends to 3 plus',
    productionState: 'speaking',
    recentTtsScripts: [
      { text: 'The limit as x tends to 3 minus is equal to 7, and as x tends to 3 plus it is equal to 7.', spokenStartedAt: 1_000_000, spokenEndedAt: 1_006_000 },
    ],
    now: 1_009_000,
    speechStartedAt: 1_004_000,
    onsetDuringTutorSpeech: true,
  });
  // (Tier 1's universal window-scoped check may still catch an overtalk
  // recitation — that's the long-standing documented policy. The guard here
  // is only that the NEW window-free mid-length gate never reaches past 10
  // words, where the lookback leniency would be doing the damage.)
  check('long recitation (>10 words) → never the mid-length echo drop',
    !/mid-length echo/.test(recitation.reason), `verdict=${recitation.verdict} (${recitation.reason})`);

  // Guard: same splice but onset NOT during tutor speech → untouched.
  const postSpeech = classifyHeuristic({
    transcript: 'x equals to before you check',
    productionState: 'listening',
    recentTtsScripts: scripts,
    now: 1_012_000,
    speechStartedAt: 1_009_500,
    onsetDuringTutorSpeech: false,
  });
  check('same splice, onset after speech → not the mid-length echo drop',
    !/mid-length echo/.test(postSpeech.reason), `verdict=${postSpeech.verdict} (${postSpeech.reason})`);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
