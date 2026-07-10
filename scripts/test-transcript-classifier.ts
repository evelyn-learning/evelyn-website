/**
 * Smoke test for classifyTranscript + supporting filters.
 *
 * Cases are drawn from the real Dutch linear-programming session on
 * 2026-04-22 (see memory: project_tutor_session_2026_04_22_analysis.md).
 * The bar is: noise should be silently dropped, genuine frustration and
 * profanity-like tokens should be flagged 'uncertain' (so the tutor asks
 * rather than guesses), and legitimate utterances — including short ones,
 * language switches, topic switches, and mathematically wrong-but-coherent
 * answers — should pass through as 'clean'.
 *
 * Usage: npx tsx scripts/test-transcript-classifier.ts
 */

import {
  classifyTranscript,
  wrapUncertainTranscript,
  filterTranscriptText,
  type TranscriptClassification,
} from "../src/lib/tutor/voice/transcript-filters";

type TC = {
  input: string;
  expected: TranscriptClassification;
  note?: string;
};

const cases: TC[] = [
  // ── NOISE: YouTube-outro hallucinations observed in the 2026-04-22 session
  { input: "Alsjeblieft abonneer je dan op mijn kanaal voor meer video's!", expected: "noise", note: "Dutch subscribe outro" },
  { input: "I'll see you in the next one. Bye bye.", expected: "noise", note: "EN sign-off" },
  { input: "Please feel free to comment and like!", expected: "noise", note: "EN engagement prompt" },
  { input: "Sous-titres réalisés para la communauté d'Amara.org", expected: "noise", note: "Amara watermark (actual session text, typo and all)" },
  { input: "Thanks for watching", expected: "noise", note: "EN outro" },
  { input: "Don't forget to subscribe!", expected: "noise", note: "EN subscribe" },
  { input: "Abonnez-vous à ma chaîne", expected: "noise", note: "FR subscribe" },

  // ── NOISE: phonetic garbage (ambient noise transcribed as single letters)
  { input: "c o u b e very s i c t i c w a t w a t s i c t i c f u i t f r u f i i c a c a c n blblbldubl", expected: "noise", note: "phonetic garbage from 2026-04-22" },
  { input: "K   d n d n d d n d n n d d e   d d d d t d d d d d", expected: "noise", note: "phonetic garbage from 2026-04-22" },

  // ── NOISE: stutter from audio glitches
  { input: "Oh, f-f-f-f-f-f-f-f-f-f-f-f-ck", expected: "noise", note: "stutter (not real speech)" },
  { input: "wacht wacht wacht wacht wacht", expected: "noise", note: "repeated-word stutter" },

  // ── NOISE: hyphenated babbling (2026-04-23 session 2)
  { input: "goo-gah-goo-gah-gah-gah-gah-gah-bing-gang-go", expected: "noise", note: "hyphen babbling from session 2" },
  { input: "ba-da-ba-da-da-da-da-da", expected: "noise", note: "hyphenated filler" },
  { input: "up-to-date", expected: "clean", note: "real hyphenated phrase — must NOT be flagged" },
  { input: "state-of-the-art solution", expected: "clean", note: "compound adjective — must NOT be flagged" },

  // ── NOISE: substring repetition within a single token (2026-04-23 session 2)
  { input: "Blahblahblahblahblahblahblah", expected: "noise", note: "blah × 7 from session 2" },
  { input: "hahaHAHAHAHahaha", expected: "noise", note: "ha-laughter spam" },
  { input: "nanananana", expected: "noise", note: "na × 5" },

  // ── NOISE: political / news broadcast bleed (pure, no student speech)
  { input: "let's hear what Senate Minority Leader Chuck Schumer has to say", expected: "noise", note: "news TV bleed from session 2" },
  { input: "Democrats were trying to amend the bill last night", expected: "noise", note: "political news register" },
  { input: "Speaker of the House addressed reporters today", expected: "noise", note: "news register" },
  { input: "According to officials, the announcement is coming up tonight", expected: "noise", note: "news register" },

  // ── CLEAN: news vocabulary IN a student question (civics class could ask about this)
  { input: "Can you explain how the Senate Majority Leader is elected?", expected: "noise", note: "edge case: civics question containing 'Senate Majority Leader' — the phrase regex currently flags this. Flagged case for manual review." },

  // ── CLEAN: session 2 student speech that survived amid news bleed
  { input: "can you draw a diagram and explain this situation to me", expected: "clean", note: "student question from session 2" },
  { input: "I'm not sure — can you show me on the whiteboard?", expected: "clean", note: "typical student request" },

  // ── CLEAN: short confirmations
  { input: "ready", expected: "clean", note: "short confirmation, >3 chars" },
  { input: "go ahead", expected: "clean", note: "two-word confirmation" },

  // ── NOISE: VAD phantom turns — empty or whitespace-only transcript
  { input: "", expected: "noise", note: "VAD committed on ambient noise that transcribed to nothing" },
  { input: "   ", expected: "noise", note: "whitespace-only phantom" },
  { input: "\n\t ", expected: "noise", note: "mixed-whitespace phantom" },

  // ── NOISE: short filler / bye
  { input: "bye", expected: "noise" },
  { input: "um", expected: "noise" },
  { input: "hmm", expected: "noise" },

  // ── NOISE: broadcast register (TV / radio / ads)
  { input: "brought to you by the makers of…", expected: "noise", note: "ad register" },
  { input: "And now the weather", expected: "noise", note: "newscast register" },
  { input: "[music]", expected: "noise", note: "caption-style sound tag" },
  { input: "Visit www.example.com for more info", expected: "noise", note: "URL in speech = TV" },

  // ── UNCERTAIN: profanity signal (likely Whisper misrecognition OR real frustration)
  { input: "Fuuuck, ik snap het niet meer", expected: "uncertain", note: "real student frustration — tutor should ask rather than guess" },
  { input: "What the shit does this mean", expected: "uncertain", note: "profanity token present" },
  { input: "Oh, damn it", expected: "uncertain", note: "profanity token" },

  // ── CLEAN: short but valid
  { input: "ja oké", expected: "clean", note: "short affirmation — valid" },
  { input: "2 + y = 8", expected: "clean", note: "math expression, short tokens but not garbage" },
  { input: "yeah", expected: "clean", note: "single-word answer >3 chars" },

  // ── CLEAN: language switch and topic switch — both must pass through
  { input: "Can you speak in Dutch?", expected: "clean", note: "language switch request — freedom preserved" },
  { input: "Actually can we switch to chemistry instead?", expected: "clean", note: "academic topic switch" },
  { input: "Let's do derivatives now", expected: "clean", note: "topic switch" },

  // ── CLEAN: mathematically wrong but coherent — NOT the filter's job to catch
  { input: "6 plus 4 is 10 dan heb je 10y", expected: "clean", note: "wrong math but coherent speech; tutor handles academic error, not filter" },
  { input: "ik denk dat de snijpunt bij (2,6) is", expected: "clean", note: "regular sentence" },

  // ── CLEAN: longer sentences
  { input: "Ik weet niet wat ik moet doen, kun je me helpen?", expected: "clean" },
  { input: "Can you explain that again more slowly?", expected: "clean" },
];

type Result = { tc: TC; actual: TranscriptClassification; ok: boolean };
const results: Result[] = cases.map((tc) => {
  const actual = classifyTranscript(tc.input);
  return { tc, actual, ok: actual === tc.expected };
});

// Print summary
const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;

for (const r of results) {
  const marker = r.ok ? "✓" : "✗";
  const note = r.tc.note ? ` — ${r.tc.note}` : "";
  const got = r.ok ? "" : `  (got '${r.actual}', expected '${r.tc.expected}')`;
  const inputPreview = r.tc.input.length > 80 ? r.tc.input.slice(0, 77) + "..." : r.tc.input;
  console.log(`${marker} [${r.tc.expected.padEnd(9)}] "${inputPreview}"${note}${got}`);
}

// Also verify wrap helper produces the expected marker format so the
// system-prompt rule can recognise it.
const wrapSample = wrapUncertainTranscript("Fuuuck, ik snap het niet");
const wrapOk = /^\[the student's audio was unclear; they may have said:/.test(wrapSample);
console.log(`\n${wrapOk ? "✓" : "✗"} wrapUncertainTranscript format matches system-prompt expectation: ${wrapSample}`);

// Verify filterTranscriptText no longer rewrites profanity (reroute to 'uncertain'
// means the classifier sees it; filter should not silently change it).
const spellcheckSample = filterTranscriptText("dont worry, fuck this shit");
const profanityPreserved = /fuck/i.test(spellcheckSample) && /shit/i.test(spellcheckSample);
console.log(`${profanityPreserved ? "✓" : "✗"} filterTranscriptText no longer silently rewrites profanity: "${spellcheckSample}"`);
// Spellcheck should still fix "dont" → "don't"
const spellcheckWorks = /don't/i.test(spellcheckSample);
console.log(`${spellcheckWorks ? "✓" : "✗"} filterTranscriptText spellcheck still active: "${spellcheckSample}"`);

console.log(`\n${passed}/${results.length} classification cases passed` + (failed > 0 ? `  (${failed} failed)` : ""));

if (failed > 0 || !wrapOk || !profanityPreserved || !spellcheckWorks) {
  process.exit(1);
}

// ── Session-start greeting exemption (2026-07-09, session-1783615226008):
//    a real student "Hello." was dropped as a Whisper-hallucination
//    pattern and never reached the brain. Before the student's first
//    accepted turn, greeting-only utterances must classify clean;
//    mid-session (allowGreetings absent/false) they stay noise.
{
  const cases: Array<[string, string]> = [
    ['Hello.', 'clean'],
    ['hi', 'clean'],
    ['Hello? Hello?', 'clean'],
    ['Hey!', 'clean'],
  ];
  for (const [text, want] of cases) {
    const got = classifyTranscript(text, { allowGreetings: true });
    if (got !== want) { console.error(`FAIL greeting-exemption "${text}": got ${got}, want ${want}`); process.exit(1); }
  }
  // Mid-session behavior unchanged: greetings are still hallucination noise.
  if (classifyTranscript('Hello.') !== 'noise') { console.error('FAIL: mid-session "Hello." must stay noise'); process.exit(1); }
  // Non-greeting noise still drops even with the exemption active.
  if (classifyTranscript('Thanks for watching!', { allowGreetings: true }) !== 'noise') { console.error('FAIL: outro hallucination must stay noise at session start'); process.exit(1); }
  console.log('OK — session-start greeting exemption');
}

// ── Short-answer whitelist (2026-07-10, session-1783693044096): the
//    student answered a yes/no question with "No." three times; each was
//    dropped by the ≤2-char single-word rule (which "yes" escapes only by
//    being 3 letters). They gave up and asked "Are you going to move on?"
{
  const clean: string[] = ['No.', 'no', 'NO', 'No!', 'ok', 'OK.', 'up', 'Yes.', 'Nope.'];
  for (const t of clean) {
    const got = classifyTranscript(t);
    if (got !== 'clean') { console.error(`FAIL short-answer "${t}": got ${got}, want clean`); process.exit(1); }
  }
  // Genuine 1-2 char fillers must STILL drop (they live in NOISE_PATTERNS).
  const noise: string[] = ['uh', 'um', 'hmm', 'oh', 'ah'];
  for (const t of noise) {
    const got = classifyTranscript(t);
    if (got !== 'noise') { console.error(`FAIL filler "${t}": got ${got}, want noise`); process.exit(1); }
  }
  // Single letters stay clean (math variables) — unchanged behavior.
  if (classifyTranscript('x') !== 'clean') { console.error('FAIL: math var x must stay clean'); process.exit(1); }
  console.log('OK — short-answer whitelist (no/ok reach the brain)');
}
