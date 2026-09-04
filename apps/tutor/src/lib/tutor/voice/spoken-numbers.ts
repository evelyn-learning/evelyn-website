/**
 * Spoken number words → digits, for the TUTOR's own sentences.
 *
 * Why (portal-9a9b7c09, 2026-09-04): the brain speaks numbers as words by
 * design, and every deterministic arithmetic guard parses digits. The session
 * had seven defective tutor turns — including "Sixteen plus nine plus nine
 * plus four plus one-forty-four — that's thirty-eight" (the sum is 182) — and
 * fired zero kills, because arithmetic-claim-check's NUM is `-?\d+` and
 * denied-answer-reversal was matching a stashed "12" against a spoken
 * "Twelve". normalizeSpokenMath's NUMBER_WORDS map stops at twelve and is
 * documented as being for the STUDENT utterance side only, so neither could
 * be reused.
 *
 * Fails CLOSED. A lone "one" is left alone (it is a determiner far more often
 * than a numeral: "that one number", "one more step"), which costs a guard the
 * occasional true positive and can never manufacture a false one.
 *
 * Pure module — no imports, no side effects, never throws.
 */

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const VOCAB = [...Object.keys(UNITS), ...Object.keys(TENS), 'hundred', 'and'];
/** A maximal run of number words joined by spaces or hyphens. */
const RUN_RE = new RegExp(`\\b(?:${VOCAB.join('|')})(?:[- ](?:${VOCAB.join('|')}))*\\b`, 'gi');

function parseRun(run: string): number | null {
  const toks = run.toLowerCase().split(/[- ]+/).filter((t) => t && t !== 'and');
  if (toks.length === 0) return null;
  let cur = 0;
  let seen = false;
  for (const t of toks) {
    if (t in UNITS) { cur += UNITS[t]; seen = true; }
    else if (t in TENS) { cur += TENS[t]; seen = true; }
    else if (t === 'hundred') { cur = (cur === 0 ? 1 : cur) * 100; seen = true; }
    else return null;
  }
  return seen ? cur : null;
}

/** "one forty-four" / "one-forty-four" = 144 — the spoken shorthand for 1xx
 *  that parseRun would otherwise read as 1 + 44 = 45. */
function parseShorthand(run: string): number | null {
  const toks = run.toLowerCase().split(/[- ]+/).filter((t) => t && t !== 'and');
  if (toks.length < 2 || toks[0] !== 'one') return null;
  const rest = parseRun(toks.slice(1).join(' '));
  return rest !== null && rest >= 10 && rest <= 99 ? 100 + rest : null;
}

export function spokenNumbersToDigits(text: string): string {
  return (text ?? '').replace(RUN_RE, (m) => {
    // "and" joins number words INSIDE a value ("one hundred and forty-four");
    // a leading or trailing one is ordinary prose ("…and the four and the total")
    // and must be handed back rather than swallowed into the match.
    let head = '';
    let core = m;
    let tail = '';
    // Leading "and" is prose — it can never be part of a compound number, which
    // would always have a leading digit before its "hundred".
    if (/^and\b/i.test(core)) {
      const match = core.match(/^and[- ]?/i);
      if (match) {
        head = match[0];
        core = core.slice(head.length);
        if (!core) return m;   // Just "and", preserve as-is
      }
    }
    const tm = core.match(/(?:[- ]+and)+$/i);
    if (tm) { tail = core.slice(core.length - tm[0].length); core = core.slice(0, core.length - tm[0].length); }
    if (/^one$/i.test(core.trim())) return m;   // determiner — fail closed
    const sh = parseShorthand(core);
    if (sh !== null) return head + String(sh) + tail;
    const v = parseRun(core);
    return head + (v === null ? core : String(v)) + tail;
  });
}
