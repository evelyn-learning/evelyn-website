// src/lib/tutor/voice/digit-words.ts
/**
 * Task 30 §J2 (GDI run 17, 299 s: the tutor taught `the "3" can be written as
 * "three" in English` — the digit is the recogniser's spelling, not the
 * learner's error; 855 s: the checked card read "…manufacturer 6 months
 * ago."). In a language lesson a standalone digit 0–12 in the student's
 * transcript is spelled out as an English word before the brain sees it and
 * before any student card is built. A digit inside a larger number (2024,
 * 3.5, 1/2, 10:30, 50%) is left alone. Pure, generic.
 */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const DIGIT_RE = /(?<![\p{L}\p{N}.,:/$£€¥-])(1[0-2]|[0-9])(?![\p{L}\p{N}]|\s*%|[:/]|[.,]\d)/gu;
export function normaliseDigitsToWords(text: string): string {
  return (text ?? '').replace(DIGIT_RE, (_m, d: string) => WORDS[Number(d)]!);
}
