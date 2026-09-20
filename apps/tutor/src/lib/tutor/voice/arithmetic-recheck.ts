/**
 * A bare arithmetic re-check spoken as the FIRST sentence of a turn that
 * carried a correction note (live 2026-09-05: "20% of 120 is 24; 20% of 15
 * is 3." opened the turn, then the teaching followed). The note asks the
 * brain to re-verify SILENTLY; this is the spoken-text backstop for the
 * shape the meta-narration filter cannot see (no self-reference words —
 * just numbers and an equality verb).
 *
 * Subject-free: numeric density + an equality verb + almost no prose. A
 * teaching sentence about numbers ("So 20% of 120 gives you 24 students —
 * see why?") keeps its prose words and survives.
 */
const NUM_RE = /(?:\$[^$]*\$)|(?:-?\d+(?:[.,]\d+)?%?)|(?:\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|thirty|forty|fifty|hundred|thousand|half|quarter|third)\b)/gi;
const EQ_RE = /\b(?:is|equals?|gives?|makes?|comes? to|yields?|leaves?)\b|=|→|->/i;
const OPERATOR_WORDS = new Set(['of', 'and', 'plus', 'minus', 'times', 'over', 'divided', 'by', 'percent', 'is', 'are', 'equals', 'equal', 'gives', 'give', 'makes', 'make', 'comes', 'come', 'to', 'so', 'then', 'squared', 'cubed', 'root', 'sum', 'total', 'the', 'a', 'an', 'yields', 'yield', 'leaves', 'leave', 'per', 'each', 'x', 'y', 'n']);
const PROSE_RE = /\b(?:you|your|we|us|let'?s|our|because|why|what|how|try|look|think|notice|remember|right|correct|exactly|good|nice|great|see|check|means|since|now|here|there|that'?s|it'?s|which|when|if|but|question|answer|step|first|next|again|students?|people)\b/i;

export function isBareArithmeticRecheck(sentence: string): boolean {
  const s = (sentence || '').trim();
  if (!s || s.length > 160) return false;
  if (PROSE_RE.test(s)) return false;
  // Count numbers INSIDE latex spans too ($3^2 + 1 = 10$ is three numbers).
  const nums = s.match(/-?\d+(?:[.,]\d+)?%?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|thirty|forty|fifty|hundred|thousand|half|quarter|third)\b/gi) ?? [];
  if (nums.length < 2) return false;
  if (!EQ_RE.test(s)) return false;
  const rest = s.replace(NUM_RE, ' ').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter((w) => w && !OPERATOR_WORDS.has(w));
  return rest.length <= 2;
}
