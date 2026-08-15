/**
 * TEST PLAN — G5 Civics — Phase 2a Organizer Coverage.
 *
 * QA harness for Phase 2a of the whiteboard markup initiative
 * (commit 96b335e). Exercises all 5 organizer kinds in one session,
 * with EXPLICIT teacherNote directives forcing the brain to emit
 * tutor_scribble AND tutor_handwrite against each organizer's
 * sub-features. Verifies that:
 *
 *   - Each organizer renders correctly with data-feature attrs.
 *   - tutor_scribble target strings against organizer features
 *     (col-N, branch-N, claim, term, k-column, etc.) resolve and
 *     paint a tick or highlight.
 *   - tutor_scribble labels appear in the page's annotation strip
 *     as "{feature} → {label}".
 *   - tutor_handwrite appears in the strip as a self-contained line.
 *
 * Organizers covered (in segment order):
 *   1. frayer_model       — concept-frayer
 *   2. government_branches — concept-branches
 *   3. t_chart            — concept-tchart
 *   4. kwl_chart          — concept-kwl
 *   5. argument_structure — concept-argument
 *
 * How to run:
 *   1. http://localhost:3001/tutor → Social Studies → 5 → Civics
 *   2. Pick "[TEST] G5 Civics — Phase 2a Organizer Coverage".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 *   4. Each concept segment renders one organizer + a scribble +
 *      a handwrite. Watch live WB to confirm tick + strip entries.
 *
 * Pass criteria (per session):
 *   - 5 organizers render (one per concept segment).
 *   - 5 ticks / highlights paint (1 per kind).
 *   - 10 strip entries land (1 scribble-label + 1 handwrite per kind).
 *   - No `[VoiceTutor] scribble-reject` warnings for the directed
 *     targets.
 *   - PDF export contains all 5 organizers + ticks + strip lines.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G5_PHASE2A_ORGANIZERS: LessonPlan = {
  id: 'evelyn.test.g5.civics.phase2a.v1',
  title: '[TEST] G5 Civics — Phase 2a Organizer Coverage',
  curriculum: 'C3',
  grade: '5',
  subject: 'social-studies',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'test.phase2a.organizer-coverage',
      description: 'Exercise all 5 Phase 2a organizer kinds (frayer_model, government_branches, t_chart, kwl_chart, argument_structure) with scribble + handwrite markings on each.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up civics theme — democracy, voting, government.',
      script:
        "Civics is about how we organize society and make decisions together. Let's explore some big ideas around democracy and how it works.",
      estimatedMinutes: 1,
    },

    // ── 1. frayer_model ─────────────────────────────────────────
    {
      id: 'concept-frayer',
      kind: 'concept',
      goal: 'Render a frayer_model for "democracy" + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="frayer_model" and params:\n' +
        '   { term: "democracy", ' +
        'definition: "A system of government where the people choose their leaders by voting.", ' +
        'characteristics: ["Free elections", "Equal rights", "Rule of law"], ' +
        'examples: ["United States", "Canada", "Japan"], ' +
        'nonExamples: ["Monarchy", "Dictatorship"], ' +
        'title: "Defining Democracy" }\n\n' +
        '2. After the frayer renders, emit ONE tutor_scribble:\n' +
        '   { target: "characteristics", shape: "highlight", color: "#16a34a", label: "key traits" }\n\n' +
        '3. Emit ONE tutor_handwrite — a self-contained line for the strip:\n' +
        '   { text: "Remember: democracy stands on the three Cs." }\n\n' +
        '4. Briefly read the definition, then advance.',
      keyIdeas: [
        'Democracy = people choose leaders by voting.',
        'Free elections, equal rights, and rule of law are essential.',
      ],
      vocabulary: [
        { term: 'democracy', definition: 'A government where the people vote for their leaders.' },
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. government_branches ──────────────────────────────────
    {
      id: 'concept-branches',
      kind: 'concept',
      goal: 'Render government_branches for the US + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="government_branches" and params:\n' +
        '   { country: "United States", ' +
        'branches: [' +
        '{ name: "Executive", bodies: ["President"], powers: ["Carries out laws", "Commands military"] }, ' +
        '{ name: "Legislative", bodies: ["Senate", "House of Representatives"], powers: ["Makes laws", "Controls budget"] }, ' +
        '{ name: "Judicial", bodies: ["Supreme Court"], powers: ["Interprets laws", "Reviews cases"] }' +
        '], title: "Three Branches of US Government" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "Legislative", color: "#3b82f6", label: "makes laws" }\n\n' +
        '3. Emit ONE tutor_handwrite — a self-contained line for the strip:\n' +
        '   { text: "The President leads the Executive branch." }\n\n' +
        '4. Briefly explain the separation of powers, then advance.',
      keyIdeas: [
        'Three branches: Executive (carries out laws), Legislative (makes laws), Judicial (interprets laws).',
        'Separation of powers prevents any one branch from getting too powerful.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. t_chart ───────────────────────────────────────────────
    {
      id: 'concept-tchart',
      kind: 'concept',
      goal: 'Render t_chart for rights vs responsibilities + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="t_chart" and params:\n' +
        '   { leftHeader: "Rights", ' +
        'rightHeader: "Responsibilities", ' +
        'leftItems: ["Vote", "Free speech", "Fair trial"], ' +
        'rightItems: ["Obey laws", "Pay taxes", "Serve on juries"], ' +
        'title: "Citizen Rights vs Responsibilities" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "left-column", shape: "highlight", color: "#22c55e", label: "what citizens GET" }\n\n' +
        '3. Emit ONE tutor_handwrite — a self-contained line for the strip:\n' +
        '   { text: "Responsibilities are what citizens MUST DO." }\n\n' +
        '4. Briefly explain the give-and-take, then advance.',
      keyIdeas: [
        'Citizens have rights (what they get) AND responsibilities (what they must do).',
        'Both are needed for a healthy democracy.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. kwl_chart ────────────────────────────────────────────
    {
      id: 'concept-kwl',
      kind: 'concept',
      goal: 'Render kwl_chart for voting knowledge + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="kwl_chart" and params:\n' +
        '   { know: ["Voting is how citizens choose leaders", "You must be 18+ to vote"], ' +
        'want: ["How are votes counted?", "Why some elections feel close"], ' +
        'learned: [], ' +
        'title: "What We Know About Voting" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "w-column", shape: "highlight", color: "#f59e0b", label: "today\'s focus" }\n\n' +
        '3. Emit ONE tutor_handwrite — a self-contained line for the strip:\n' +
        '   { text: "We will fill in the Learned column by the end." }\n\n' +
        '4. Briefly frame the day\'s learning around the W column, then advance.',
      keyIdeas: [
        'KWL charts capture: what we Know, what we Want to know, what we Learned.',
        'Today we focus on the Want column.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. argument_structure ───────────────────────────────────
    {
      id: 'concept-argument',
      kind: 'concept',
      goal: 'Render argument_structure for "should voting be mandatory?" + scribble + handwrite.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Emit ONE show_diagram with type="argument_structure" and params:\n' +
        '   { claim: "Voting should be mandatory for all citizens.", ' +
        'evidence: ["Higher turnout in countries with mandatory voting", "Better-informed citizens"], ' +
        'reasoning: ["When everyone votes, results reflect the whole population", "Required participation builds civic identity"], ' +
        'counter: "Forcing people removes their freedom to abstain.", ' +
        'rebuttal: "Citizens can still cast blank ballots; the requirement is participation, not a specific vote.", ' +
        'title: "Should Voting Be Mandatory?" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "claim", color: "#3b82f6", label: "central claim" }\n\n' +
        '3. Emit ONE tutor_handwrite — a self-contained line for the strip:\n' +
        '   { text: "Evidence = facts that back up the claim." }\n\n' +
        '4. Briefly walk through the structure (claim → evidence → reasoning), then advance.',
      keyIdeas: [
        'A strong argument needs a claim, evidence, and reasoning.',
        'Counterargument and rebuttal show you considered other views.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'Which branch of the US government MAKES the laws?',
      expectedAnswer: 'Legislative',
      hints: [
        'Look back at the Three Branches diagram.',
        'The legislative branch includes the Senate and House.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ───────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Democracy = people choose leaders by voting.',
        'Three branches: Executive, Legislative, Judicial.',
        'Rights come with responsibilities.',
        'Good arguments use claim + evidence + reasoning.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 2a (organizer fan-out). Exercises all 5 organizer kinds (frayer_model, government_branches, t_chart, kwl_chart, argument_structure) with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per organizer. Verifies that the new manifests + data-feature attrs land correctly across all 5 kinds.',
  },
};
