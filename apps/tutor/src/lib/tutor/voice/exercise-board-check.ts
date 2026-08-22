/**
 * Exercise-board check (R48 Task 2, live failure 2026-08-12, HS English
 * phaseC verify session): Rule 3a already forces a spoken FORMULA onto the
 * board the same turn; it is math-tuned and does not fire for a spoken
 * PROSE exercise. Live turn: "…press on the trap that catches almost
 * everyone. Look at 'study' — I want you to tell me the job it's doing in
 * three different sentences, starting with 'her study of local water
 * quality.'" — a multi-part exercise (three sentences, quoted working
 * material) delivered voice-only. No show_problem/card ever rendered, so
 * the student had nothing to look at while composing three answers.
 *
 * `detectVoiceOnlyExercise` is the deterministic, pure companion to the new
 * prompt hard-rule (system-prompt-builder.ts, Rule 3a-sibling): it does NOT
 * gate or kill anything — the wiring in VoiceTutorRealtime.tsx uses it only
 * to fire a telemetry advisory (`exercise_no_board`) when a turn poses an
 * exercise in speech and dispatches zero board-rendering tool calls, the
 * same "note, never a kill" precedent as question-anchor.ts's board-anchor
 * net and the turn-cap advisories.
 *
 * Three conservative shapes ONLY — false negatives (a posed exercise that
 * slips past all three) cost nothing beyond a missed telemetry line; false
 * positives cost a misleading advisory on ordinary conversational turns, so
 * every shape requires an explicit ask verb (tell/give/write/come up with)
 * or an unambiguous question mark — never bare rhetorical phrasing:
 *
 *  (i)   `(a)`/`(b)` enumeration + an imperative/question in the same turn.
 *  (ii)  "N different/separate <sentences|examples|ways|cases>" + an ask verb.
 *  (iii) A quoted working phrase (>= 4 words) + an ask verb + an enumeration
 *        signal (either shape above, or a bare "N <sentences|examples|…>").
 *
 * "There are three different ways this shows up" (rhetorical, no ask verb,
 * no second-person imperative) must NOT match — see the negative suite in
 * scripts/test-exercise-board-check.ts.
 *
 * Pure, no LLM, no side effects, never throws.
 */

/** tell me / give me / write (down) / come up with — the brief's explicit
 *  ask-verb set. Deliberately narrow: broader imperative lists (identify,
 *  explain, describe…) invite false positives on ordinary Socratic prompts
 *  that already have their own board-write rules (question-anchor.ts). */
const ASK_VERB_RE = /\b(tell me|give me|write down|write|come up with)\b/i;

/** Literal (a) ... (b) enumeration, case-insensitive, allowing arbitrary
 *  text (and further (c)/(d) parts) between the two anchors. */
const AB_ENUM_RE = /\([a-d]\)[\s\S]{0,300}?\([a-d]\)/i;

/** "three different sentences", "2 separate examples", "several ways" —
 *  the brief's explicit N different/separate <noun> shape. */
const N_DIFFERENT_RE =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|several)\s+(different|separate)\s+(sentences?|examples?|ways?|cases?)\b/i;

/** Looser fallback enumeration signal for shape (iii): a bare count +
 *  sentences/examples/ways/cases without "different"/"separate" — still
 *  requires the ask verb + quote gates above it to ever fire. */
const GENERIC_COUNT_NOUN_RE =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|several)\s+(sentences?|examples?|ways?|cases?)\b/i;

/** A quoted phrase — straight or curly quotes — of at least 4 words. The
 *  opening quote must be preceded by whitespace/start/open-paren (not a
 *  word character) so contraction apostrophes ("it's") never open a false
 *  quote span; the closing quote must be followed by whitespace/punctuation
 *  or end of string. */
const QUOTE_RE = /(^|[\s(])['"‘“]([A-Za-z][\w'’.,;:!?\-\s]{2,140}?)['’"”](?=$|[\s).,!?;:])/;

function hasLongQuote(text: string): boolean {
  const m = QUOTE_RE.exec(text);
  if (!m) return false;
  const words = m[2].trim().split(/\s+/).filter(Boolean);
  return words.length >= 4;
}

/** R50 T8 — scene-setting verbs. The three shapes above were derived from a
 *  SINGLE live failure (2026-08-12, HS English: quoted working material +
 *  ask verb), so all three encode that one instance: (a)/(b) enumeration,
 *  "N different sentences", quoted material. The measured consequence is
 *  that `exercise_no_board` fired ZERO times in 1,598 prod sessions between
 *  2026-08-11 and 2026-08-21 — and a detector that never fires is
 *  indistinguishable from a clean corpus.
 *
 *  Live miss that motivated this shape (portal-b0a1b396, Grade 7 geography,
 *  t=186.3s): "Picture a huge mountain range running right next to the coast
 *  — and picture wind carrying moist ocean air toward it. What do you think
 *  happens to that moist air when it hits the mountain wall?" — an entire
 *  spatial situation built in prose, `brain_turn` recorded 0 tool calls, and
 *  none of the three shapes could match because the turn has no enumeration,
 *  no count noun and no quote.
 *
 *  Kept conservative on the same reasoning as the shapes above, and for one
 *  more: this stays TELEMETRY-ONLY, so a false positive costs a triage line
 *  while a false negative costs the signal we do not currently have. */
const SCENE_VERB_RE =
  /\b(?:picture|imagine|visuali[sz]e|envision|suppose)\b|\blet's say\b|\bthink about it like\b|\bthink of it (?:as|like)\b/i;

/** Minimum words for shape (iv). "Imagine that!" is not a posed situation;
 *  the live miss ran 76 words. Guards against short conversational asides
 *  that happen to contain a scene verb and a question mark. */
const SCENE_MIN_WORDS = 20;

export interface VoiceOnlyExerciseResult {
  posed: boolean;
  shape?: 'ab-enum' | 'n-different' | 'quoted-material' | 'scene-prose';
}

export function detectVoiceOnlyExercise(turnText: string): VoiceOnlyExerciseResult {
  const text = (turnText || '').trim();
  if (!text) return { posed: false };

  const hasAskVerb = ASK_VERB_RE.test(text);
  const hasQuestionMark = text.includes('?');
  const hasAbEnum = AB_ENUM_RE.test(text);

  // Shape (i): (a)/(b) enumeration + an imperative/question framing. A
  // recap read-back ("today we covered (a) verbs, (b) nouns.") has neither
  // an ask verb nor a question mark and correctly falls through.
  if (hasAbEnum && (hasAskVerb || hasQuestionMark)) {
    return { posed: true, shape: 'ab-enum' };
  }

  // Shape (ii): "N different/separate sentences|examples|ways|cases" + ask
  // verb. A rhetorical count ("there are three different ways this shows
  // up") has no ask verb and correctly falls through.
  if (N_DIFFERENT_RE.test(text) && hasAskVerb) {
    return { posed: true, shape: 'n-different' };
  }

  // Shape (iii): quoted working material (>= 4 words) + ask verb +
  // enumeration signal. A quote with no ask verb ("the phrase 'her study of
  // local water quality' shows the noun form") correctly falls through.
  if (
    hasAskVerb &&
    hasLongQuote(text) &&
    (hasAbEnum || N_DIFFERENT_RE.test(text) || GENERIC_COUNT_NOUN_RE.test(text))
  ) {
    return { posed: true, shape: 'quoted-material' };
  }

  // Shape (iv) R50: a scene-setting imperative building a spatial/physical
  // situation in prose, plus a question about it, in a substantive turn.
  // Requires the question mark (never bare narration) and a word floor.
  if (
    hasQuestionMark &&
    SCENE_VERB_RE.test(text) &&
    text.trim().split(/\s+/).filter(Boolean).length >= SCENE_MIN_WORDS
  ) {
    return { posed: true, shape: 'scene-prose' };
  }

  return { posed: false };
}

/**
 * R48 Task 2 review round (Finding 1): the wiring originally gated
 * `exercise_no_board` on `isBoardContentTool` (question-anchor.ts), which
 * counts pointer/annotation tools — `tutor_scribble`, `tutor_link`,
 * `tutor_handwrite` — as board content. Those tools cannot render NEW
 * material (`tutor_scribble`'s own description: "Do not use this for new
 * content or for unlabeled spots. If you need to mark something that was
 * never drawn, render it first with a show_* tool"), so a turn that poses a
 * voice-only exercise AND scribbles at an existing board word — the
 * motivating live shape, "Look at 'study'" — silently suppressed the event
 * under the old gate. `RENDER_TOOLS` is the narrower, explicit allowlist:
 * only tools that can paint NEW exercise material count as "reached the
 * board" for this check.
 *
 * Enumerated directly from `WHITEBOARD_TOOLS`
 * (`src/app/tutor/hooks/toolDefinitions.ts`, R48 review round, 64 `show_*`
 * tools total) rather than derived by a `startsWith('show_')` predicate —
 * pinned as a literal set so a membership regression is a diffable code
 * change, not a silent drift if a future tool is renamed off the `show_`
 * prefix.
 *
 * Included: every `show_*` tool — the entire family renders new content
 * (problems, equations, tables, diagrams, passages, cards, ...).
 *
 * Excluded, and why:
 *  - Pointer/annotation tools (`tutor_scribble`, `tutor_link`,
 *    `tutor_handwrite`) — overlay-only, cannot introduce new material.
 *  - `highlight` / `annotate` — boxed commentary/callout cards, not the
 *    tools the prompt directs an exercise through (Rule 3e names
 *    `show_problem` "or the matching card" — a `show_*` card, not a
 *    highlight box).
 *  - `draw_vector` — a single annotation arrow on an existing diagram.
 *  - Control/meta tools (`new_page`, `go_to_page`, `clear`,
 *    `list_whiteboard_features`, `tutor_scroll_whiteboard`) — navigation,
 *    not content.
 *  - Lesson-plan/silent tools (`advance_lesson`, `mark_segment_complete`,
 *    `generate_problem`, `confirm_plan_los`, `propose_plan_swap`,
 *    `record_gap`, `flag_prerequisite_gap`, `expand_topic_notes_theory`,
 *    `add_topic_notes_method`, `add_topic_notes_pointer`) — the notes-*
 *    tools persist text to the student's notes but never render on the
 *    whiteboard itself, so they don't satisfy "the student has something
 *    to look at" either.
 */
export const RENDER_TOOLS: ReadonlySet<string> = new Set([
  'show_equation', 'show_function_graph', 'show_code', 'show_table',
  'show_molecule', 'show_number_line', 'show_geometry',
  'show_geometry_constructed', 'show_unit_circle', 'show_fraction_bar',
  'show_tree', 'show_venn_diagram', 'show_matrix', 'show_try_yourself',
  'show_segment_card', 'show_problem', 'show_diagram', 'show_sketch',
  'show_solution', 'show_worked_example', 'show_timeline', 'show_map',
  'show_circuit', 'show_lewis', 'show_early_math', 'show_phonics',
  'show_graphic_organizer', 'show_labeled_image', 'show_solved_example',
  'show_quiz', 'show_writing_frame', 'show_run_code',
  'show_dimensional_check', 'show_balanced_equation',
  'show_lewis_constructed', 'show_periodic_table', 'show_annotated_passage',
  'show_passage', 'show_call_stack', 'show_flowchart', 'show_manipulative',
  'show_stats', 'show_collision', 'show_reaction_coordinate',
  'show_energy_bars', 'show_free_body_diagram', 'show_coordinate_plane',
  'show_scatter_plot', 'show_cycle_diagram', 'show_concept_map',
  'show_motion_diagram', 'show_projectile_motion', 'show_simple_machine',
  'show_pendulum', 'show_spring_mass', 'show_ray_diagram', 'show_wave',
  'show_vector', 'show_orbital_diagram', 'show_pedigree', 'show_punnett',
  'show_cell_diagram', 'show_dna', 'show_food_web',
]);

export function isRenderTool(name: string): boolean {
  return RENDER_TOOLS.has(name);
}

/**
 * Quantity anchoring (R49b, live 2026-08-20 portal-2d53e403 turn 1).
 *
 * `detectVoiceOnlyExercise` above asks a PRESENCE question — did this turn
 * dispatch a render tool? The Crimsora opener answered yes and was still
 * the exact failure the rule exists to prevent. It called `show_number_line`
 * with `min:-10, max:10, step:1` and one point at 0 labelled "Start", while
 * the four events that WERE the problem — Saturday +12, Monday -4.50,
 * Tuesday +3, Wednesday -6.75 — lived only in speech. Fifty-nine seconds
 * later the student said "Can you write all those events on the whiteboard?".
 *
 * A contentless placeholder satisfies a presence check completely. So this
 * asks the CONTENT question instead: of the quantities the tutor just spoke,
 * how many actually reached the board?
 *
 * WHY NUMBERS AND NOT PROSE. Numerals are the part of a posed situation a
 * student cannot hold in their head and cannot recover by asking a vague
 * question — and they are cheap to compare without an LLM. Prose framing
 * ("your snack account") is genuinely fine to deliver by voice; the ledger
 * of values is not.
 *
 * FALSE-POSITIVE DISCIPLINE. Every teaching turn contains stray numerals,
 * so firing on one missing value would make this noise. Two gates:
 *   - at least MIN_SITUATION_QUANTITIES distinct values must be spoken, so
 *     a turn has to look like a posed situation rather than a passing
 *     mention;
 *   - bare small integers (<= SMALL_COUNT_MAX) with no decimal part are
 *     treated as conversational counts ("3 ways", "2 of them") and ignored
 *     entirely — they are overwhelmingly prose, and a genuine problem
 *     built only from single digits still has its OTHER values checked.
 *
 * Comparison is value-based, not string-based: spoken "4 dollars 50" and
 * rendered "-4.50" are the same quantity, as are "3 dollars" and "+3.00".
 * Sign is deliberately ignored — the board writes "-4.50" for money the
 * tutor describes as a cost, and treating those as different values would
 * fire on correctly-anchored turns.
 *
 * Advisory only, like every other member of this family. Pure, never throws.
 * Exercised by `npm run test:exercise-board`.
 */

/** Fewer distinct spoken quantities than this ⇒ not a posed situation. */
export const MIN_SITUATION_QUANTITIES = 3;
/** Bare integers at or below this are conversational counts, not data. */
export const SMALL_COUNT_MAX = 5;

/**
 * Spoken money carries its cents as a separate word — the tutor says "4
 * dollars 50" and "6 dollars 75" where the board writes "-4.50" and
 * "-6.75". Without this rewrite the two sides never line up, and the
 * detector fires on turns that anchored everything correctly (caught by the
 * REAL_BOARD case in the suite — showTable held all four values and the
 * naive comparison still reported three missing). Same underlying
 * phenomenon as spoken-money.ts: money read aloud loses its decimal point.
 */
function foldSpokenMoney(text: string): string {
  return (text || '').replace(
    /(\d+)\s*(?:dollars?|pounds?|euros?|bucks?)\s+(\d{1,2})\b/gi,
    (_m, whole: string, cents: string) => `${whole}.${cents.padEnd(2, '0')}`,
  );
}

/** Every numeric literal in a blob, as canonical value strings. */
function numericValues(text: string): string[] {
  const out: string[] = [];
  const re = /-?\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text || '')) !== null) {
    const n = Math.abs(parseFloat(m[0]));
    if (Number.isFinite(n)) out.push(canonicalQuantity(n));
  }
  return out;
}

/** "4.50" and "4.5" and "+4.50" all collapse to the same key. */
function canonicalQuantity(n: number): string {
  return String(Math.round(n * 100) / 100);
}

export interface UnanchoredQuantitiesResult {
  /** True when the turn posed a multi-value situation the board did not carry. */
  unanchored: boolean;
  /** Spoken quantities with no counterpart on the board. */
  missing: string[];
  /** Distinct spoken quantities considered (post small-count filter). */
  considered: number;
}

export function detectUnanchoredQuantities(opts: {
  /** Everything the tutor said this turn. */
  turnText: string;
  /** Flattened text of every render payload this turn put on the board. */
  renderedText: string;
}): UnanchoredQuantitiesResult {
  const NONE: UnanchoredQuantitiesResult = { unanchored: false, missing: [], considered: 0 };
  const spokenRaw = numericValues(foldSpokenMoney(opts.turnText));
  if (spokenRaw.length === 0) return NONE;

  // Drop conversational counts before deduping so "3 ways" never counts
  // toward the situation threshold.
  const spoken = Array.from(new Set(
    spokenRaw.filter((v) => {
      const n = parseFloat(v);
      const isBareSmallInt = Number.isInteger(n) && n <= SMALL_COUNT_MAX;
      return !isBareSmallInt;
    }),
  ));
  if (spoken.length < MIN_SITUATION_QUANTITIES) return { ...NONE, considered: spoken.length };

  const onBoard = new Set(numericValues(opts.renderedText));
  const missing = spoken.filter((v) => !onBoard.has(v));

  // Fire only when the board is carrying essentially none of the situation.
  // A turn that anchored most of its values and dropped one is not the
  // failure this exists to catch.
  const unanchored = missing.length >= MIN_SITUATION_QUANTITIES;
  return { unanchored, missing, considered: spoken.length };
}

/* ------------------------------------------------------------------ *
 * R51 — a POSED problem whose subject matter is not on the board.
 * ------------------------------------------------------------------ */

/**
 * Live miss (portal-0984e111, t=97.3): the tutor posed an entire new word
 * problem in speech —
 *   "let's push a bit further with problem 3 then. Kris has 5 gift bags,
 *    each filled with s stickers and t toys — what expression captures how
 *    many items are in just one bag?"
 * — while the turn's ONLY render was `showEquation 5p` labelled "New cards
 * from p packs": the answer to the PREVIOUS problem. So the board showed
 * stale content that looked current, and the student was asked to work on
 * something that was never written down.
 *
 * It slipped past all three existing checks, and each for a different
 * reason, which is why this needs its own:
 *   · `exercise_no_board` is a PRESENCE check — *a* render fired, so it was
 *     satisfied. It cannot tell whose problem the render was about.
 *   · `detectUnanchoredQuantities` needs >= MIN_SITUATION_QUANTITIES
 *     numerics; this turn's only number is "5", dropped as a conversational
 *     count, and s/t are variables, not quantities.
 *   · shape (iv) `scene-prose` needs a scene verb (picture/imagine/suppose);
 *     this turn has none — it states a situation flatly.
 *
 * The question this asks is the one none of them ask: does the board carry
 * the SUBJECT MATTER of the thing just posed? Compared on distinctive
 * content words rather than numbers, because the numbers are exactly what
 * collide across problems ("5 gift bags" vs "5p" would match on "5" and
 * prove nothing) while the nouns do not.
 *
 * Telemetry-only, like its siblings — never a kill, never a corrective note.
 */

/**
 * Ask-phrases that mark a problem being POSED rather than discussed.
 *
 * CALIBRATED AGAINST THE CORPUS, NOT GUESSED — and the first draft was wrong.
 * A looser version (any of what/which/write/how-many near
 * expression|total|value|many|much) fired on 13 of 591 real tutor turns, and
 * inspection showed almost all were FALSE: mishear recoveries ("I couldn't
 * quite catch that"), session resumes ("we're back — right where we left
 * off"), affirmations ("Right — 11.25, that's your total pushback") and idle
 * nudges ("Take your time. Team Plus is pulling with fifteen"). Those are
 * conversation, not a problem being set.
 *
 * Narrowed to an explicit expression-WRITING ask, which is the lesson shape
 * the live miss belongs to. KNOWN AND ACCEPTED BLIND SPOT: a posed
 * ARITHMETIC problem ("Jeff has 12 marbles and gives away 5 — how many
 * left?") will not match. Per this file's standing tradeoff a false negative
 * costs one missed telemetry line, while a false positive costs a misleading
 * advisory on an ordinary turn — and at 591 turns the loose version was
 * mostly noise, which would have made the whole signal unusable.
 */
const POSED_ASK_RE =
  /\b(?:what|which)\s+(?:expression|equation|formula)\b|\bwrite\s+(?:an?|the)\s+(?:expression|equation|formula)\b|\bexpression\s+(?:captures|represents|shows|models|for)\b/i;

/** Words that carry no subject matter, so overlap on them means nothing. */
const CONTENT_STOPWORDS = new Set([
  'what', 'which', 'write', 'give', 'tell', 'them', 'they', 'this', 'that',
  'with', 'from', 'have', 'has', 'had', 'each', 'just', 'only', 'more',
  'than', 'then', 'there', 'here', 'about', 'into', 'your', 'yours', 'their',
  'expression', 'equation', 'formula', 'answer', 'problem', 'question',
  'many', 'much', 'total', 'number', 'numbers', 'value', 'values', 'like',
  'some', 'any', 'all', 'one', 'two', 'three', 'four', 'five', 'lets',
  'let', 'now', 'next', 'first', 'second', 'third', 'captures', 'called',
  'using', 'these', 'those', 'when', 'where', 'does', 'will', 'would',
  'been', 'being', 'were', 'was', 'are', 'and', 'the', 'for', 'but',
]);

/** Distinctive content words: >=4 letters, not a stopword, deduped. */
function contentWords(text: string): string[] {
  const words = (text || '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !CONTENT_STOPWORDS.has(w));
  return Array.from(new Set(words));
}

/**
 * The POSED sentence, plus the one before it for setup.
 *
 * Comparing the WHOLE turn against the board was the first design and it
 * could not catch its own live miss: that turn OPENS by wrapping up the
 * previous problem ("five p new cards, since each of the p packs holds 5")
 * and only then poses the new one. The board legitimately carried "cards"
 * and "packs" from the wrap-up half, so whole-turn overlap was non-zero and
 * the detector stayed silent — while the half that mattered, the Kris gift
 * bags, was nowhere on the board. **A turn is not one topic, and comparing
 * it as though it were hides exactly the transition this exists to catch.**
 *
 * Sentence split follows the R49b lesson: terminator + whitespace + capital,
 * never a bare /[.!?]/ — a naive split cuts "10.5" at its decimal point, and
 * decimals mid-sentence are routine in a maths tutor.
 */
function posedSegment(text: string): string {
  // \s* not \s+ : real stored turns run sentences together with NO space
  // ("...holds 5.Sounds like this is clicking..." — verbatim from the live
  // miss). Requiring whitespace made the splitter a no-op on exactly the
  // turn it was written for. Decimals stay safe because the lookahead
  // demands a CAPITAL, and "10.5" is followed by a digit.
  const sentences = (text || '').split(/(?<=[.!?])\s*(?=[A-Z"'“])/);
  const idx = sentences.findIndex((x) => POSED_ASK_RE.test(x));
  if (idx < 0) return '';
  return (idx > 0 ? sentences[idx - 1] + ' ' : '') + sentences[idx];
}

/** Minimum distinctive words a turn must carry before the check applies —
 *  below this the overlap statistic is too small to mean anything. */
export const MIN_POSED_CONTENT_WORDS = 4;

export interface PosedProblemUnboardedResult {
  /** True when a problem was posed and the board carries none of its subject. */
  unboarded: boolean;
  /** Distinctive words from the posed text (what was looked for). */
  considered: string[];
  /** Those that DID appear in the render payloads. */
  matched: string[];
}

export function detectPosedProblemUnboarded(opts: {
  turnText: string;
  /** Flattened text of every render payload this turn put on the board. */
  renderedText: string;
}): PosedProblemUnboardedResult {
  const NONE: PosedProblemUnboardedResult = { unboarded: false, considered: [], matched: [] };
  const text = (opts.turnText || '').trim();
  if (!text) return NONE;
  // A posed problem is a QUESTION or an IMPERATIVE. Requiring '?' was the
  // first gate and it was too strict — caught by this suite's own held-out
  // case, "Write an expression for the total bulbs she plants.", which is a
  // perfectly ordinary way to set a problem and carries no question mark.
  // The live miss happened to have one, so a seed-shaped gate looked fine.
  const IMPERATIVE_ASK_RE = /\bwrite\s+(?:an?|the)\s+(?:expression|equation|formula)\b/i;
  if (!text.includes('?') && !IMPERATIVE_ASK_RE.test(text)) return NONE;
  if (!POSED_ASK_RE.test(text)) return NONE;

  // Scope to the posed sentence — NOT the whole turn. See posedSegment.
  const segment = posedSegment(text);
  if (!segment) return NONE;
  const considered = contentWords(segment);
  if (considered.length < MIN_POSED_CONTENT_WORDS) return { ...NONE, considered };

  const board = (opts.renderedText || '').toLowerCase();
  // Substring rather than word match: a render often carries a stemmed or
  // pluralised form ("sticker" for "stickers", "bag" inside "gift bags"),
  // and a near-miss on morphology would fire the detector on a board that
  // is genuinely about the right thing — the expensive direction here.
  const matched = considered.filter((w) => board.includes(w) || board.includes(w.replace(/s$/, '')));

  // Fire ONLY at zero overlap. A board carrying some of the subject is not
  // the failure this exists to catch, and a partial-overlap threshold would
  // make the detector fire on ordinary multi-step turns.
  return { unboarded: matched.length === 0, considered, matched };
}
