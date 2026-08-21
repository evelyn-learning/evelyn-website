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
