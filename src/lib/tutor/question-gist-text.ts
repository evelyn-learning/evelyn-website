/**
 * Pure text helpers for the Q-pin gist (2026-07-14 live-test ask).
 *
 * Lives outside TutorSession.tsx so it stays importable from node test
 * scripts — same reasoning as whiteboard/inline-math.ts living outside
 * InlineMathText.tsx.
 *
 * Task X8 (live-test ask, 2026-07-16): the Haiku gist producer
 * (/api/tutor/question-gist) restates the tutor's question in its own
 * words and sometimes wraps part of it in markdown emphasis (single-star
 * italics / double-star bold). The pin renders through InlineMathText,
 * which only special-cases $...$ math — any other markup, including
 * emphasis, renders as literal text, so the pin showed raw asterisks
 * ("*in order to*") instead of plain words. stripMarkdownEmphasis() strips
 * that markup. lastQuestionSentence() (the client-derived fallback used
 * when the API call fails) already ran this same regex inline before this
 * task — it's extracted here so both paths share one implementation and
 * can't drift apart again.
 */

/** Strip *italic* / **bold** markdown emphasis, keeping the wrapped text.
 *  Content must start with a letter (same gate as the TTS layer's
 *  MD_EMPHASIS_REPLACEMENTS in tts-pronunciation.ts) so bare multiplication
 *  ("2*3*4") is never touched. */
export function stripMarkdownEmphasis(s: string): string {
  return s.replace(/\*{1,2}([A-Za-z][^*]{0,60}?)\*{1,2}/g, '$1');
}

/** The turn's LAST question sentence, COMPLETE (round-4 feedback: a
 *  mid-cut ellipsis gist is useless). Used as the fallback when the LLM
 *  gist call fails, and as the probe source for spoken-reveal timing.
 *  Returns null when there's no question or it's too long to pin whole. */
export function lastQuestionSentence(text: string): string | null {
  const questions = stripMarkdownEmphasis(text).match(/[^.!?\n]{4,}\?/g);
  const last = questions?.[questions.length - 1]?.trim();
  if (!last || last.length > 220) return null;
  return last;
}
