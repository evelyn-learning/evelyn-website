/**
 * Digits as English number words for word-by-word comparisons (Task 22 §F1;
 * shared with the sentence board in Task 23 §D1). Pure.
 */
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** Task 22 §F1 (GDI run 10, turns 23–27): the STT writes "3 years" for a
 *  student who said "three years", so a correct repeat never matched the
 *  model. Integer tokens 0–100 and the round hundreds up to 1000 become their
 *  English words ("3" → "three", "21" → "twenty" "one", "1000" → "one"
 *  "thousand"); anything else is left as it is. Hyphenated number words are
 *  already split by the tokeniser ("twenty-one" → "twenty" "one"). */
export function normaliseNumberTokens(tokens: readonly string[]): string[] {
  const out: string[] = [];
  for (const t of tokens) {
    if (!/^(?:0|[1-9]\d{0,3})$/.test(t)) { out.push(t); continue; }
    const n = Number(t);
    if (n < 20) out.push(ONES[n]!);
    else if (n < 100) { out.push(TENS[Math.floor(n / 10)]!); if (n % 10) out.push(ONES[n % 10]!); }
    else if (n === 1000) out.push('one', 'thousand');
    else if (n % 100 === 0 && n < 1000) out.push(ONES[n / 100]!, 'hundred');
    else out.push(t);
  }
  return out;
}
