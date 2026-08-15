/**
 * TEST PLAN — Multi-renderer A1/A2/resolver/B1 stress test.
 *
 * Built 2026-05-14 after the Phase 5 BST session (sessionId
 * session-1778774034765) surfaced four interacting bugs:
 *   - A1 gate (b) leak: judge KILLed on BST insertion claims that
 *     required it to perform arithmetic comparison (7 < 8 → left).
 *   - A2 dormant: verified working but exercised only via the
 *     escalated re-assertion path; want a cleaner direct test.
 *   - Scribble resolver description-mismatch: brain's habit of
 *     copying the manifest `description` verbatim (e.g.
 *     `node "4" (leaf) at depth 2`, `output column "A AND B"`)
 *     silent-dropped 6+ scribbles in one session.
 *   - B1 audio cancel race: deltas arriving after `response.cancel`
 *     was sent slipped into audioQueueRef after clearSpeechQueue
 *     emptied it, producing audible overlap between the killed
 *     attempt + bridge + retry.
 *
 * The fixes shipped alongside this plan:
 *   - Binary tree manifest now exposes parent-child structure in
 *     each non-root node's description (so judge stops guessing).
 *   - resolveTarget also matches against the description field.
 *   - useOpenAIRealtime tracks response_id + cancelled-id set so
 *     post-cancel deltas drop.
 *   - prescribedRender contract on each concept segment — the
 *     orchestrator deep-equals the brain's show_diagram params
 *     against the authored prescription and rejects via the
 *     existing validator-feedback retry loop on mismatch. Added
 *     after a run showed the brain emitting a 9-node BST instead
 *     of the prescribed 6-node example.
 *
 * This plan is designed to RE-elicit the patterns under real session
 * conditions. Two BSTs (small structural tour + larger insertion
 * walkthrough) maximize A1 gate-b stress. PPC re-runs the
 * canonical "bows outward" descriptor case. Truth table re-runs
 * the `output column "X"` description-copy scribble target.
 * Population pyramid forces hypothetical/contrast narration
 * (narrow-base counterfactual). Try-yourself problem mismatches
 * the segment topic deliberately so the brain emits its own
 * show_problem with different numbers than any seed — this stresses
 * the seed-vs-brain numeric collision that was the A2 freeze
 * trigger.
 *
 * Pass criteria per session:
 *   - 5 diagrams render across the concept segments.
 *   - Zero `judge_kill` debug events that weren't escalation-loop
 *     re-assertions (i.e. judge should accept BST/PPC/pyramid
 *     comparative narration without killing).
 *   - Zero `kill_suppressed_final_attempt` events on a clean run
 *     (means A2 didn't have to fire). If it DOES fire, the audio
 *     should still reach the student.
 *   - All directed `tutor_scribble` targets resolve (no
 *     `scribble-reject (silent drop): ... (no_match)` for any
 *     target listed below).
 *   - On any kill that does fire, no audible audio AFTER the
 *     kill-bridge phrase (verifying B1 cancelled-id filter).
 *   - PDF export contains all 5 diagrams + their markings.
 *
 * Run:
 *   1. http://localhost:3001/tutor → CS → 10 → Computer Science.
 *   2. Pick "[TEST] Multi-renderer A1/A2/resolver/B1 stress".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_MULTIRENDERER_STRESS: LessonPlan = {
  id: 'evelyn.test.multirenderer.a1a2resolverb1.v1',
  title: '[TEST] Multi-renderer A1/A2/resolver/B1 stress',
  curriculum: 'Internal QA',
  grade: '9-12',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'test.multirenderer.coverage',
      description:
        'Stress A1 (judge hypothetical/comparative/descriptor exemption + gate-b), A2 (final-attempt suppression), scribble resolver description-form match, and B1 (audio-delta cancelled-id filter) across binary_tree (×2), production_possibilities, truth_table, and population_pyramid.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the multi-renderer stress session.',
      script:
        "We're going to tour a few diagrams — binary trees, an economics graph, a truth table, and a population pyramid. Quick questions along the way. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. binary_tree #1 — structural tour ────────────────────────
    // Targets A1 gate-b (judge shouldn't kill on "4 > 3, so right"),
    // resolver description-verbatim (brain emits scribble target
    // copying the new parent-aware description), and manifest
    // parent/child structure (judge sees correct relationships).
    // prescribedRender pins the BST shape — earlier run showed the
    // brain freelancing a 9-node tree instead of the prescribed one.
    {
      id: 'concept-bst-tour',
      kind: 'concept',
      goal: 'Render BST #1 + walk through parent-child relationships + scribble + handwrite.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'binary_tree',
          params: {
            root: {
              value: '5',
              left: { value: '3', left: { value: '1' }, right: { value: '4' } },
              right: { value: '8', right: { value: '9' } },
            },
            title: 'Sample BST',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. show_diagram with type="binary_tree" and params:\n' +
        '   { root: {\n' +
        '       value: "5",\n' +
        '       left: { value: "3", left: { value: "1" }, right: { value: "4" } },\n' +
        '       right: { value: "8", right: { value: "9" } }\n' +
        '     },\n' +
        '     title: "Sample BST" }\n\n' +
        '2. After it renders, narrate the structure: identify the root, ' +
        'left/right children of 5, left/right children of 3, and 8s only child. ' +
        'Then ASK the student: "Is node 4 in the correct position under node 3, ' +
        'given the BST rule?" Use comparison reasoning in your narration ' +
        '("4 > 3, so 4 should be on the right side of 3").\n\n' +
        '3. Emit ONE tutor_scribble:\n' +
        '   { target: "node \\"4\\" (right child of node \\"3\\", leaf) at depth 2", ' +
        'color: "#16a34a", label: "4 > 3 → right" }\n' +
        '   NOTE: this target intentionally uses the verbose description form, ' +
        'including the depth suffix, to verify resolver description-match.\n\n' +
        '4. Emit ONE tutor_handwrite:\n' +
        '   { text: "BST rule: left subtree < node < right subtree." }\n\n' +
        '5. After student answers, give a brief explanation and advance.',
      keyIdeas: [
        'Root = topmost node (5).',
        'BST invariant: left subtree < node < right subtree.',
        'Comparison-based placement: a child is left or right based on whether its value is less or greater than the parent.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 3,
    },

    // ── 2. binary_tree #2 — insertion walkthrough ──────────────────
    // Hardest A1 gate-b test: the brain narrates the BST insertion
    // algorithm step-by-step, which is ALL arithmetic comparison
    // ("7 > 5 → right subtree; 7 < 8 → left child of 8"). If any
    // single claim KILLs, A1 gate (b) regressed. This is also a
    // dual-BST scenario so the judge has to track structure across
    // two trees.
    {
      id: 'concept-bst-insert',
      kind: 'concept',
      goal: 'Render a second BST + walk through inserting a new node + scribble + handwrite.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'binary_tree',
          params: {
            root: {
              value: '5',
              left: { value: '3', left: { value: '1' }, right: { value: '4' } },
              right: { value: '8', right: { value: '9' } },
            },
            title: 'Starting BST',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page first so this BST lives on its own page:\n' +
        '   new_page { title: "BST insertion: add 7" }\n\n' +
        '2. show_diagram with type="binary_tree" and params:\n' +
        '   { root: {\n' +
        '       value: "5",\n' +
        '       left: { value: "3", left: { value: "1" }, right: { value: "4" } },\n' +
        '       right: { value: "8", right: { value: "9" } }\n' +
        '     },\n' +
        '     title: "Starting BST" }\n\n' +
        '3. Narrate the BST insertion algorithm for the value 7, ' +
        'step-by-step: compare 7 to 5 → 7 > 5 → go right to 8. ' +
        'Compare 7 to 8 → 7 < 8 → go left, but the left slot is empty, ' +
        'so 7 lands there as the new leaf. Use the words "left" and "right" ' +
        'explicitly with the comparison ("less than", "greater than").\n\n' +
        '4. ASK the student: "Where would 6 go if we inserted it next?" ' +
        '(Expected: also left subtree of 8, but the left slot now has 7, ' +
        'so 6 becomes left child of 7.)\n\n' +
        '5. Emit ONE tutor_scribble:\n' +
        '   { target: "node \\"8\\" (right child of node \\"5\\")", ' +
        'color: "#dc2626", label: "7 < 8 → left slot of 8" }\n\n' +
        '6. Emit ONE tutor_handwrite:\n' +
        '   { text: "Insertion: walk down comparing at each node; new value becomes a leaf." }\n\n' +
        '7. After student answers, briefly explain and advance.',
      keyIdeas: [
        'BST insertion walks down the tree, comparing at each node.',
        'A new value lands as a leaf — never displaces an existing node.',
        'Each comparison decides left (smaller) or right (larger).',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite', 'new_page'],
      estimatedMinutes: 3,
    },

    // ── 3. production_possibilities — descriptor stress ────────────
    // Canonical A1 descriptor case. The brain will say "bows out"
    // or "bowed outward" — the judge previously KILLed on this
    // (claiming inward). With A1 the descriptor exemption should
    // make this advisory-or-clean.
    {
      id: 'concept-ppc',
      kind: 'concept',
      goal: 'Render a PPC with bowed-out shape + scribble on a point + handwrite + descriptor narration.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'production_possibilities',
          params: {
            xAxis: { label: 'Guns', max: 100 },
            yAxis: { label: 'Butter', max: 100 },
            curve: 'bowed-out',
            points: [
              { x: 70, y: 60, label: 'A', position: 'on' },
              { x: 30, y: 30, label: 'B', position: 'inside' },
              { x: 90, y: 80, label: 'C', position: 'outside' },
            ],
            title: 'Guns vs Butter',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page:\n' +
        '   new_page { title: "Production Possibilities" }\n\n' +
        '2. show_diagram with type="production_possibilities" and params:\n' +
        '   { xAxis: { label: "Guns", max: 100 },\n' +
        '     yAxis: { label: "Butter", max: 100 },\n' +
        '     curve: "bowed-out",\n' +
        '     points: [\n' +
        '       { x: 70, y: 60, label: "A", position: "on" },\n' +
        '       { x: 30, y: 30, label: "B", position: "inside" },\n' +
        '       { x: 90, y: 80, label: "C", position: "outside" }\n' +
        '     ],\n' +
        '     title: "Guns vs Butter" }\n\n' +
        '3. Narrate USING SHAPE DESCRIPTORS: explain that the curve ' +
        '"bows outward" or "is bowed out" because of increasing ' +
        'opportunity cost. Contrast with what a straight-line PPC would ' +
        'mean (constant opportunity cost) — this contrastive narration ' +
        'is what previously triggered judge KILLs.\n\n' +
        '4. ASK: "What does it mean for the economy to be at point B versus point A?"\n\n' +
        '5. Emit ONE tutor_scribble:\n' +
        '   { target: "point A", color: "#16a34a", label: "efficient" }\n\n' +
        '6. Emit ONE tutor_handwrite:\n' +
        '   { text: "Bowed-out PPC = increasing opportunity cost as you specialize." }\n\n' +
        '7. After student answers, briefly explain and advance.',
      keyIdeas: [
        'Bowed-out PPC = increasing opportunity cost (resources arent perfectly substitutable).',
        'On the curve = efficient; inside = wasted resources; outside = unattainable.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite', 'new_page'],
      estimatedMinutes: 2,
    },

    // ── 4. truth_table — resolver description-form stress ──────────
    // The brain's habitual scribble target is the description form
    // `output column "A AND B"`, which was a silent-drop before the
    // resolver fix. With description-matching, this should resolve.
    {
      id: 'concept-truth-table',
      kind: 'concept',
      goal: 'Render a truth_table + scribble using the description-form target.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'truth_table',
          params: {
            inputs: ['A', 'B'],
            outputColumns: [
              { label: 'A AND B', values: [false, false, false, true] },
              { label: 'A OR B', values: [false, true, true, true] },
            ],
            title: 'AND vs OR',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page:\n' +
        '   new_page { title: "Truth Table" }\n\n' +
        '2. show_diagram with type="truth_table" and params:\n' +
        '   { inputs: ["A", "B"],\n' +
        '     outputColumns: [\n' +
        '       { label: "A AND B", values: [false, false, false, true] },\n' +
        '       { label: "A OR B",  values: [false, true,  true,  true] }\n' +
        '     ],\n' +
        '     title: "AND vs OR" }\n\n' +
        '3. Narrate the difference between AND and OR using row references ' +
        '("the last row", "row 4") and column references ("the AND column", ' +
        '"the OR column").\n\n' +
        '4. ASK: "On which rows does the OR output equal 1?"\n\n' +
        '5. Emit ONE tutor_scribble (intentionally using the description-form target):\n' +
        '   { target: "output column \\"A AND B\\"", color: "#3b82f6", ' +
        'label: "only 1 on last row" }\n' +
        '   NOTE: this target was a silent-drop before the resolver was ' +
        'extended to match against the description field.\n\n' +
        '6. Emit ONE tutor_handwrite:\n' +
        '   { text: "AND output = 1 only when both inputs are 1. OR output = 1 when at least one is 1." }\n\n' +
        '7. After student answers, briefly explain and advance.',
      keyIdeas: [
        '2 inputs → 4 rows (2^n combinations).',
        'AND is 1 only when ALL inputs are 1. OR is 1 when AT LEAST one input is 1.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite', 'new_page'],
      estimatedMinutes: 2,
    },

    // ── 5. population_pyramid — hypothetical-narration stress ──────
    // Forces the brain to describe what a DIFFERENT shape would
    // look like (narrow-base contrast against the rendered wide-
    // base). Pre-A1 the judge confused the hypothetical narrative
    // with a claim about current board state and KILLed.
    {
      id: 'concept-pop-pyramid',
      kind: 'concept',
      goal: 'Render a wide-base pop pyramid + describe a narrow-base counterfactual + scribble + handwrite.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'population_pyramid',
          params: {
            ageGroups: [
              ['0-4', 8.0, 7.7], ['5-9', 7.3, 7.0], ['10-14', 6.6, 6.4],
              ['15-19', 5.8, 5.7], ['20-24', 5.0, 4.9], ['25-29', 4.2, 4.2],
              ['30-34', 3.5, 3.5], ['35-39', 2.8, 2.9], ['40-44', 2.2, 2.3],
              ['45-49', 1.7, 1.8], ['50-54', 1.3, 1.4], ['55-59', 0.9, 1.0],
              ['60-64', 0.6, 0.7], ['65-69', 0.4, 0.5], ['70-74', 0.2, 0.3],
              ['75+', 0.1, 0.2],
            ],
            mode: 'percent',
            xLabel: '% of total population',
            title: 'Nigeria 2024',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page:\n' +
        '   new_page { title: "Population Pyramid" }\n\n' +
        '2. show_diagram with type="population_pyramid" and params (Nigeria — expanding, wide base):\n' +
        '   { ageGroups: [\n' +
        '       ["0-4", 8.0, 7.7], ["5-9", 7.3, 7.0], ["10-14", 6.6, 6.4],\n' +
        '       ["15-19", 5.8, 5.7], ["20-24", 5.0, 4.9], ["25-29", 4.2, 4.2],\n' +
        '       ["30-34", 3.5, 3.5], ["35-39", 2.8, 2.9], ["40-44", 2.2, 2.3],\n' +
        '       ["45-49", 1.7, 1.8], ["50-54", 1.3, 1.4], ["55-59", 0.9, 1.0],\n' +
        '       ["60-64", 0.6, 0.7], ["65-69", 0.4, 0.5], ["70-74", 0.2, 0.3],\n' +
        '       ["75+", 0.1, 0.2]\n' +
        '     ],\n' +
        '     mode: "percent",\n' +
        '     xLabel: "% of total population",\n' +
        '     title: "Nigeria 2024" }\n\n' +
        '3. Narrate the wide base (current board) AND describe what a ' +
        '*narrower* base would mean (declining population, like Japan or ' +
        'Italy). Use hypothetical/contrast language ("if the base were ' +
        'narrower instead", "imagine a country where the base is much ' +
        'thinner"). The judge previously KILLed on this contrastive ' +
        'narration, mis-classifying it as a claim about the current board.\n\n' +
        '4. ASK: "What does the wide base tell us about birth rates?"\n\n' +
        '5. Emit ONE tutor_scribble:\n' +
        '   { target: "base", color: "#dc2626", label: "wide → expanding" }\n\n' +
        '6. Emit ONE tutor_handwrite:\n' +
        '   { text: "Wide base = high birth rate; narrow base = declining population." }\n\n' +
        '7. After student answers, briefly explain and advance.',
      keyIdeas: [
        'Wide base = high birth rate, fast-growing (expanding pyramid).',
        'Narrow base = low birth rate, declining population.',
        'Tall narrow top = long life expectancy.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite', 'new_page'],
      estimatedMinutes: 2,
    },

    // ── try-yourself — A2 retry-budget stress ──────────────────────
    // The problem deliberately references a BST insertion comparison.
    // If the brain emits its own show_problem with different numbers
    // (which it often does for try-yourself), the judge will see
    // both numerics in its snapshot — historically the seed-vs-brain
    // numeric mismatch triggered MAX_VALIDATOR_RETRIES. With A2, the
    // final-attempt suppression should keep audio flowing even if
    // the retry budget exhausts.
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem:
        'Starting from the BST { 5 [3 (1, 4), 8 (_, 9)] }, you insert the value 7. Which existing node becomes 7\'s parent, and is 7 a left or right child of that parent?',
      expectedAnswer: '7 becomes the LEFT child of node 8 (because 7 > 5 → right subtree; 7 < 8 → left side of 8; left slot was empty).',
      hints: [
        'Compare 7 to the root first. Where does that send you?',
        'After the first comparison, what node do you arrive at? Compare 7 to that.',
      ],
      responseFormat: 'free',
      // prescribedRender pins the try-yourself problem emission. The
      // existing show_problem authored-target check uses a regex
      // (/find|calculate|what is/) that doesn't match "which node…"-
      // style questions, so the brain previously felt free to emit
      // its own show_problem with different content (observed
      // 2026-05-14 run: root-10 in-order traversal instead of seed
      // insertion problem). prescribedRender closes that gap with a
      // deep-equal contract. If the brain prefers show_segment_card,
      // the tool-name mismatch means this check doesn't fire — the
      // standard segment-card resolution flow still works.
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement:
            'Starting from the BST { 5 [3 (1, 4), 8 (_, 9)] }, you insert the value 7. Which existing node becomes 7\'s parent, and is 7 a left or right child of that parent?',
          format: 'free-response',
          title: 'Try Yourself: BST Insertion',
          difficulty: 'medium',
        },
      },
      estimatedMinutes: 2,
    },

    // ── recap ──────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'BST: left subtree < node < right subtree (recursive).',
        'BST insertion: walk down comparing at each node, land as a leaf.',
        'Bowed-out PPC = increasing opportunity cost.',
        'AND is 1 only when ALL inputs are 1.',
        'Wide-base pyramid = expanding population.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Stress test for A1 (judge hypothetical/comparative/descriptor exemption + gate-b arithmetic), A2 (final-attempt kill suppression), scribble resolver description-form matching, and B1 (audio-delta cancelled-id filter). Built after the 2026-05-14 Phase 5 BST session surfaced an interacting set of bugs across these four layers.',
  },
};
