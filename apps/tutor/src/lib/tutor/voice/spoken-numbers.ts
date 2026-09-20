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
 * than a numeral: "that one number", "one more step"), and an "and" that is not
 * inside a hundreds compound SPLITS the run rather than merging across it
 * ("twenty and forty" is two values, not 60) — merging manufactured an
 * arithmetic claim the tutor never made and got a correct turn killed. Both
 * cost a guard the occasional true positive and can never manufacture a false
 * one.
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

/** One run of number words with no "and" in it → its digits, or the run
 *  unchanged when it cannot be resolved. */
function convertValue(core: string): string {
  if (/^one$/i.test(core)) return core;   // determiner — fail closed
  const sh = parseShorthand(core);
  if (sh !== null) return String(sh);
  const v = parseRun(core);
  return v === null ? core : String(v);
}

/** Convert a run that contains "and" but no "hundred": every "and" in it
 *  separates two INDEPENDENT numbers, so each side converts on its own and the
 *  "and" is handed back verbatim. Splitting on the token also subsumes the
 *  leading/trailing-"and" prose handling, which is the same case. */
function splitRunOnAnd(run: string): string {
  const parts = run.split(/([- ]+)/);   // token, sep, token, sep, …
  let out = '';
  let seg: string[] = [];
  const flush = () => {
    const text = seg.join('');
    seg = [];
    if (!text.trim()) { out += text; return; }
    const lead = /^[- ]*/.exec(text)![0];
    const trail = /[- ]*$/.exec(text)![0];
    out += lead + convertValue(text.slice(lead.length, text.length - trail.length)) + trail;
  };
  for (const p of parts) {
    if (/^and$/i.test(p)) { flush(); out += p; }
    else seg.push(p);
  }
  flush();
  return out;
}

export function spokenNumbersToDigits(text: string): string {
  return (text ?? '').replace(RUN_RE, (m) => {
    // "and" is value-internal ONLY inside a hundreds compound ("one hundred
    // and forty-four" = 144). Everywhere else it joins two INDEPENDENT
    // numbers, and merging them MANUFACTURES a claim the tutor never made:
    // "We had twenty and forty times two is eighty" normalized to
    // "60 times 2 is 80" and checkArithmeticClaims KILLED the turn as a false
    // assertion. A false kill is the failure this whole layer exists to
    // avoid, so a run with an "and" and no "hundred" is split at every "and".
    // (Residual, deliberately accepted: a run mixing both — "twenty and one
    // hundred" — still goes down the hundreds path and mis-merges. It is not
    // a shape the brain produces, and widening the rule risks re-opening the
    // false-kill path this closes.)
    if (!/\bhundred\b/i.test(m) && /\band\b/i.test(m)) return splitRunOnAnd(m);
    // Hundreds compound: "and" is value-internal, but a leading or trailing
    // "and" is still ordinary prose ("…and one hundred is your answer") and
    // must be handed back rather than swallowed into the value.
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
    return head + convertValue(core) + tail;
  });
}
