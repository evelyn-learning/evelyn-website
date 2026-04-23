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
