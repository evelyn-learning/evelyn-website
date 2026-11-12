/**
 * Tutor brain v2 — the student's words as the recogniser wrote them.
 *
 * The recogniser writes every small number it hears as a digit, whatever was meant. "Basically we just multiply
 * the two. So I got this one, we can just move on" arrived as "multiply the 2. So I got this 1", and the tutor
 * marked "1" as a wrong answer to a problem whose answer was 2 (AP Physics, embed-1794500923861). Where the
 * words around a lone 1 or 2 make it a pronoun, it is written back as the word, which a reader can still take
 * as the number if that is what was meant. A digit beside a unit, an operator or another number is left alone.
 */
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
