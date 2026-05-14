/**
 * TEST PLAN — Judge ↔ Brain ↔ Orchestrator sync stress (A1 + B1 focus).
 *
 * Built 2026-05-14 after the user reported an AP CS A ArrayList session
 * where validator feedback unexpectedly fired even though the brain's
 * emission (show_code + advance_lesson + topic_notes_pointer × 2)
 * looked structurally correct. The narration discussed `.remove(int)`
 * vs `.remove(Object)` semantics — a self-contained code-content claim
 * that the judge should pass cleanly. This plan re-creates that exact
 * scenario plus adjacent judge-stress cases.
 *
 * Specifically targets:
 *   - A1: judge should NOT kill on self-contained code-content claims,
 *     BST insertion arithmetic, or PPC descriptor narration.
 *   - B1: audio cancellation race — if any kill DOES slip through, the
 *     audio-delta cancelled-id filter should keep post-cancel chunks
 *     from leaking. Best observed when a kill happens mid-stream.
 *   - Sync: orchestrator's retry feedback should not over-fire. The
 *     validator feedback the user reported was unexpected — a clean
 *     session against this plan should have ZERO validator-feedback
 *     retries on the show_code segments.
 *
 * Each concept segment carries prescribedRender so the rendered
 * content is deterministic — eliminates "brain went off-script" as a
 * variable while we evaluate judge/orchestrator behavior.
 *
 * Pass criteria per session:
 *   - Zero `judge_kill` debug events on the concept-arraylist-api
 *     segment (user's failure case).
 *   - Zero `prescribed_render_mismatch` events (brain follows
 *     prescription).
 *   - Zero `try_yourself_answer_reveal` events on the code-write
 *     try-yourself segment (brain doesn't pre-reveal the snippet).
 *   - All judge calls return grounded=true OR severity=advisory.
 *     Any `kill_suppressed_final_attempt` events should be NONE on a
 *     clean run.
 *   - Audio plays cleanly with no overlap on segment transitions.
 *
 * Run:
 *   1. http://localhost:3001/tutor → CS → 11-12 → Computer Science.
 *   2. Pick "[TEST] AP CS A — judge sync stress (A1+B1)".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 *   4. Drive the conversation forward with mostly "Yes" / "Sure" so
 *      the orchestrator's affirmative-no-advance check + B3 segment-
 *      transition newPage injection both fire on transitions.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_JUDGE_SYNC_STRESS: LessonPlan = {
  id: 'evelyn.test.judge-sync-stress.v1',
  title: '[TEST] AP CS A — judge sync stress (A1+B1)',
  curriculum: 'AP CSA',
  grade: '9-12',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'test.judge-sync.coverage',
      description:
        'Stress the judge ↔ brain ↔ orchestrator sync. Each concept segment fires the judge with self-contained content claims (code semantics, BST arithmetic, PPC descriptors) that historically caused false-positive KILLs. With A1 gate-b + descriptor exemption + hypothetical-comparative exemption shipped, all judge calls should pass clean or downgrade to advisory.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the judge-stress test session.',
      script:
        "We're going to look at three things today — ArrayLists in Java, binary search trees, and a quick econ graph. Quick tour. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. ArrayList API — replicates user's reported failure ──────
    // The brain narrates the .remove(int) vs .remove(Object) trap on
    // a show_code card. Judge sees the code, the narration explains
    // overloading semantics — self-contained claims about code
    // content. Pre-A1 the judge would re-derive semantics and
    // potentially mis-fire. With A1 gate (b), claims requiring
    // re-derivation are advisory-only, never kill.
    {
      id: 'concept-arraylist-api',
      kind: 'concept',
      goal: 'Render show_code for ArrayList core methods + narrate the .remove() trap. Stress judge on self-contained code-semantic claims.',
      prescribedRender: {
        tool: 'show_code',
        params: {
          language: 'java',
          label: 'ArrayList Core Methods',
          code:
            'import java.util.ArrayList;\n\n' +
            'ArrayList<String> names = new ArrayList<>();\n\n' +
            '// Adding\n' +
            'names.add("Alice");           // adds to end\n' +
            'names.add(0, "Bob");          // inserts at index 0, shifts rest right\n\n' +
            '// Accessing\n' +
            'names.get(0);                 // returns element at index 0\n' +
            'names.set(0, "Charlie");      // replaces element at index 0\n\n' +
            '// Removing\n' +
            'names.remove(0);              // removes by INDEX\n' +
            'names.remove("Alice");        // removes by VALUE (first occurrence)\n\n' +
            '// Size\n' +
            'names.size();                 // NOT .length — that\'s for arrays!\n\n' +
            '// Traversal\n' +
            'for (int i = 0; i < names.size(); i++) {\n' +
            '    System.out.println(names.get(i));\n' +
            '}\n' +
            '// OR for-each (read-only — don\'t modify list inside this)\n' +
            'for (String s : names) {\n' +
            '    System.out.println(s);\n' +
            '}',
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. show_code with the ArrayList Core Methods snippet (params pinned by prescribedRender).\n\n' +
        '2. Narrate the API at a high level: adding, accessing, removing, size, traversal. Then call out the .remove() OVERLOAD trap: `remove(int index)` removes BY INDEX while `remove(Object o)` removes BY VALUE. Mention the autoboxing gotcha: `ArrayList<Integer>` + `list.remove(2)` removes the element at index 2, NOT the value 2 — use `list.remove(Integer.valueOf(2))` to remove by value.\n\n' +
        '3. ASK the student: "If I have an ArrayList<Integer> with [10, 20, 30] and I call list.remove(1), what gets removed?"\n\n' +
        '4. Emit one add_topic_notes_pointer summarising the .size() vs .length gotcha and one for the autoboxing trap.\n\n' +
        '5. After student answers, briefly confirm/correct and advance.\n\n' +
        'JUDGE CONCERN: the brain will reference code by line / by token (e.g., `.remove(0)`, `.remove("Alice")`, `.size()`). These are self-contained claims about the show_code content. The judge should NOT kill on these — they\'re grounded against the code card on the board.',
      keyIdeas: [
        '.remove(int) removes BY INDEX; .remove(Object) removes BY VALUE.',
        '.size() for ArrayList; .length for arrays. Don\'t mix them up.',
        'Autoboxing trap: ArrayList<Integer>.remove(int) is the INDEX overload.',
      ],
      suggestedTools: ['show_code', 'add_topic_notes_pointer'],
      estimatedMinutes: 3,
    },

    // ── 2. BST search — arithmetic narration stress ────────────────
    // Replicates the canonical A1 gate-b case: brain narrates
    // "6 less than 8, go left" — judge should NOT re-derive and
    // mis-fire ("6 is not less than 8"). With A1 gate (b) shipped,
    // claims requiring arithmetic comparison are advisory-only.
    {
      id: 'concept-bst-search',
      kind: 'concept',
      goal: 'Render BST + walk through the search algorithm for value 6. Stress judge on arithmetic-comparison narration (A1 gate b).',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'binary_tree',
          params: {
            root: {
              value: '8',
              left: { value: '3', left: { value: '1' }, right: { value: '6', left: { value: '4' }, right: { value: '7' } } },
              right: { value: '10', right: { value: '14', left: { value: '13' } } },
            },
            title: 'Binary Search Tree',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page first: new_page { title: "Binary Search Tree" }.\n\n' +
        '2. show_diagram with type="binary_tree" (params pinned by prescribedRender). Tree: root=8, with subtrees on both sides.\n\n' +
        '3. Narrate the BST SEARCH algorithm for the target value 6. Walk it step-by-step:\n' +
        '   - Start at root 8. Compare 6 to 8 → 6 < 8 → go LEFT to node 3.\n' +
        '   - Compare 6 to 3 → 6 > 3 → go RIGHT to node 6. FOUND.\n' +
        '   Use the words "less than" and "greater than" explicitly in narration.\n\n' +
        '4. Emit ONE tutor_handwrite: { text: "BST search: compare at each node, go left if smaller, right if larger." }\n\n' +
        '5. ASK the student: "If you were searching for the value 13 in this tree, what path would you walk?"\n\n' +
        '6. After student answers, confirm/correct and advance.\n\n' +
        'JUDGE CONCERN: the arithmetic-comparison narration ("6 less than 8") is exactly what previously caused a judge mis-fire. With A1 gate (b), the judge should keep these as advisory at worst. Zero kills expected.',
      keyIdeas: [
        'BST search: O(log n) when balanced — halve the search space at each comparison.',
        'Less than parent → go left; greater than parent → go right.',
      ],
      suggestedTools: ['show_diagram', 'tutor_handwrite', 'new_page'],
      estimatedMinutes: 3,
    },

    // ── 3. PPC descriptor — A1 descriptor exemption stress ─────────
    // Canonical A1 descriptor case. Brain narrates "bows outward" +
    // contrasts with a hypothetical straight-line PPC. Pre-A1 the
    // judge would mis-classify shape descriptors as literal claims
    // and KILL. With A1's descriptor + hypothetical exemptions, both
    // should pass clean.
    {
      id: 'concept-ppc-descriptor',
      kind: 'concept',
      goal: 'Render PPC with bowed-out shape + narrate using descriptors + contrast with straight-line counterfactual. Stress A1 descriptor + hypothetical exemptions.',
      prescribedRender: {
        tool: 'show_diagram',
        params: {
          type: 'production_possibilities',
          params: {
            xAxis: { label: 'Pizza', max: 100 },
            yAxis: { label: 'Robots', max: 100 },
            curve: 'bowed-out',
            points: [
              { x: 60, y: 70, label: 'A', position: 'on' },
              { x: 40, y: 40, label: 'B', position: 'inside' },
            ],
            title: 'Pizza vs Robots',
          },
        },
      },
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit new_page first: new_page { title: "Production Possibilities" }.\n\n' +
        '2. show_diagram with type="production_possibilities" (params pinned). Curve bowed-out, with points A on and B inside.\n\n' +
        '3. Narrate USING SHAPE DESCRIPTORS:\n' +
        '   - "The curve bows outward — meaning as we specialize more in one good, the opportunity cost rises."\n' +
        '   - Contrast with a hypothetical: "If resources were perfectly substitutable, the curve would be a straight line instead — constant opportunity cost."\n' +
        '   The descriptor "bows outward" and the hypothetical "if it were a straight line" are exactly the patterns previously triggering judge KILLs.\n\n' +
        '4. Emit ONE tutor_scribble: { target: "point A", color: "#16a34a", label: "efficient" }\n\n' +
        '5. ASK the student: "What does point B being inside the curve tell us about the economy?"\n\n' +
        '6. After student answers, briefly confirm/correct and advance.\n\n' +
        'JUDGE CONCERN: shape descriptors + hypothetical counterfactuals. Both should be advisory-at-most per A1. Zero kills expected.',
      keyIdeas: [
        'Bowed-out PPC = increasing opportunity cost.',
        'Inside the curve = wasted / idle resources.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'new_page'],
      estimatedMinutes: 2,
    },

    // ── try-yourself — combined A1 + Rule 18 stress ────────────────
    // Code-write question. Brain MUST NOT pre-emit a show_equation
    // or show_solution revealing the answer in the same turn as the
    // show_problem (Rule 18, now orchestrator-enforced). If it does,
    // `try_yourself_answer_reveal` rejection fires.
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem:
        'You have an ArrayList<Integer> called `nums` containing the values [10, 20, 30, 40, 50] in that order. Write a single line of Java that removes the value 30 from the list (NOT by its index — by its value). Watch out for the .remove() overload trap.',
      expectedAnswer: 'nums.remove(Integer.valueOf(30));',
      hints: [
        'There are two remove() overloads — by INDEX and by VALUE. Which one fires when you pass a primitive int?',
        'Use Integer.valueOf(...) to force the Object overload.',
      ],
      responseFormat: 'free',
      prescribedRender: {
        tool: 'show_problem',
        params: {
          statement:
            'You have an ArrayList<Integer> called `nums` containing the values [10, 20, 30, 40, 50] in that order. Write a single line of Java that removes the value 30 from the list (NOT by its index — by its value). Watch out for the .remove() overload trap.',
          format: 'free-response',
          title: 'Try Yourself: ArrayList.remove overload',
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
        '.remove(int) removes by INDEX; .remove(Object) removes by VALUE.',
        'Use Integer.valueOf(N) on ArrayList<Integer> to force value-removal.',
        '.size() for ArrayList; .length for arrays.',
        'BST search: O(log n) when balanced; halve the space at each comparison.',
        'Bowed-out PPC = increasing opportunity cost.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Narrow stress test for A1 + B1 judge ↔ brain ↔ orchestrator sync. Built 2026-05-14 after user reported unexpected validator feedback on a show_code segment about ArrayList .remove() overloads. Replicates that exact scenario + adjacent judge-stress patterns (BST arithmetic, PPC descriptor). Every concept segment carries prescribedRender to remove brain-freelancing as a variable.',
  },
};
