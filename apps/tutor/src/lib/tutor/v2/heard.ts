/**
 * Tutor brain v2 — the student's words as the recogniser wrote them.
 *
 * The recogniser writes every small number it hears as a digit, whatever was meant. "Basically we just multiply
 * the two. So I got this one, we can just move on" arrived as "multiply the 2. So I got this 1", and the tutor
 * marked "1" as a wrong answer to a problem whose answer was 2 (AP Physics, embed-1794500923861). Where the
 * words around a lone 1 or 2 make it a pronoun, it is written back as the word, which a reader can still take
 * as the number if that is what was meant. A digit beside a unit, an operator or another number is left alone.
 */
import { TUTOR_V2_HEARD_NOISE } from '../orchestrator/flags';

const QUANTITY_FOLLOWS = String.raw`(?!\s*(?:[-+*/×÷=^%.,:]?\d|[-+*/×÷=^%]|(?:point|times|plus|minus|over|by|divided|multiplied|squared|cubed|amps?|amperes?|volts?|ohms?|watts?|seconds?|minutes?|hours?|met(?:er|re)s?|grams?|kilo\w*|milli\w*|micro\w*|cent\w*|degrees?|percent|moles?|newtons?|joules?|farads?|hertz|units?|[a-zA-ZΩμ]\b)))`;
const ONE_AFTER = /\b(this|that|which|each|another|any|every|either|neither|other|last|first|next|same|only|previous|right|wrong|new|old|big|small|hard|easy|good|second|no) 1\b/gi;
const ONE_BEFORE = /\b1 (thing|more thing|more question|more time|at a time|by one|after another|of (?:them|these|those|the)|another|last)\b/gi;
const TWO_AFTER = /\b(the|these|those|both|other|you|we|us|them) 2\b(?=\s*(?:[.,;!?]|$|of (?:them|these|those|us)|together|and\b|are\b|is\b))/gi;

export function heardAsWords(text: string): string {
  return text
    .replace(new RegExp(`${ONE_AFTER.source}${QUANTITY_FOLLOWS}`, 'gi'), '$1 one')
    .replace(ONE_BEFORE, 'one $1')
    .replace(new RegExp(`${TWO_AFTER.source}`, 'gi'), '$1 two');
}

/**
 * A transcript that is the recogniser's noise, not words (Task 6e, v2audio tester B #29): for "I'm not sure about it."
 * it returned "I'", then newlines and 5,000 characters of 、, 号, "(" and "(vis" (914 tokens of about ten kinds). That went to the brain and into the
 * stored transcript as one student line. Noise is told by repetition: one character over most of a long transcript, or
 * one token over most of a long run of tokens; or by a length no spoken turn reaches. Real speech, even long and
 * hesitant (tester B's 280-character turns with "the the the uh"), is none of these.
 */
/** More characters than any spoken turn holds: a two-minute monologue at a fast four words a second is about 3,000. */
export const V2_HEARD_MAX_CHARS = 3000;
/** The student's words as the brain is given them when what was heard was noise. Bracketed: never their own words. */
export const V2_UNHEARD_SAID = '[Something was said, but the speech recogniser returned noise, not words: none of it could be made out.]';
const NOISE_MIN_CHARS = 40;
const NOISE_CHAR_SHARE = 0.5;
const NOISE_MIN_TOKENS = 10;
const NOISE_TOKEN_SHARE = 0.6;
const NOISE_FEW_KINDS_MIN_TOKENS = 20;
const NOISE_FEW_KINDS_SHARE = 0.2;

export function v2HeardIsNoise(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.length > V2_HEARD_MAX_CHARS) return true;
  const chars = [...t.replace(/\s+/g, '')];
  if (chars.length >= NOISE_MIN_CHARS) {
    const n = new Map<string, number>();
    for (const c of chars) n.set(c, (n.get(c) ?? 0) + 1);
    if (Math.max(...n.values()) / chars.length >= NOISE_CHAR_SHARE) return true;
  }
  const tokens = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length >= NOISE_MIN_TOKENS) {
    const n = new Map<string, number>();
    for (const w of tokens) n.set(w, (n.get(w) ?? 0) + 1);
    const top = Math.max(...n.values());
    // A run of fillers in real speech ("uh uh uh") is a few tokens of many; noise is the same token over most of them.
    if (top >= NOISE_MIN_TOKENS && top / tokens.length >= NOISE_TOKEN_SHARE) return true;
    // Or a handful of tokens over a long run: the stored line was 914 tokens of about ten kinds ("(vis", "(", 、, 号),
    // none of them over half. A real turn of twenty words or more has most of its words different.
    if (tokens.length >= NOISE_FEW_KINDS_MIN_TOKENS && n.size / tokens.length <= NOISE_FEW_KINDS_SHARE) return true;
  }
  return false;
}

/** The student's words as the brain gets them: in a spoken lesson, noise stands as V2_UNHEARD_SAID (the route's guard;
 *  the voice client already sends it so). Typed words come through no recogniser and are left alone. `enabled` is the
 *  kill switch. */
export function v2HeardForBrain(studentSaid: string | null, mode: 'text' | 'voice', enabled: boolean = TUTOR_V2_HEARD_NOISE): string | null {
  return enabled && mode === 'voice' && studentSaid !== null && v2HeardIsNoise(studentSaid) ? V2_UNHEARD_SAID : studentSaid;
}
