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

export interface VoiceOnlyExerciseResult {
  posed: boolean;
  shape?: 'ab-enum' | 'n-different' | 'quoted-material';
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
