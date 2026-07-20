/**
 * ACT — English / Rhetorical Skills: Adding, Deleting & Organizing.
 *
 * The signature ACT English question types beyond grammar: "Should the
 * writer add/delete this sentence?" (always framed as Yes/No PLUS a
 * reason) and "which choice best accomplishes the writer's goal?" (where
 * every choice is usually true or grammatical). Both formats are graded
 * on the REASON, not the surface call — the yes/no or the choice letter
 * is worthless without the right justification. All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_RHETORICAL_SKILLS: LessonPlan = {
  id: 'evelyn.testprep.act.rhetorical-skills.v1',
  title: 'Rhetorical Skills: Adding, Deleting & Organizing',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.rhetorical-skills',
      standard: 'ACT-1.9',
      description:
        "Decide whether a proposed sentence should be added or deleted by evaluating the REASON given (not just the yes/no call), and identify which revision most directly accomplishes a stated writer's goal when every choice is factually accurate.",
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe add/delete and accomplishes-goal questions as reason-matching, not yes/no guessing — these are roughly a fifth of ACT English.',
      script:
        "Here's a pattern you'll see 8 to 10 times on ACT English: \"Should the writer add this sentence — yes or no?\" or \"Which choice best accomplishes the writer's goal?\" The trap is that these ALWAYS come with a reason attached, and the ACT scores the reason, not the yes/no. Get the right call for the wrong reason and you still miss it. At about a minute a question, today's job is learning to check the reason first.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reason-matching',
      kind: 'concept',
      goal: 'The add/delete four-choice structure, the accomplishes-goal trap, and the named traps in each.',
      keyIdeas: [
        'ADD/DELETE STRUCTURE: these questions almost always give four choices split two Yes and two No (or two Kept and two Deleted), each with a DIFFERENT reason. The yes/no alone eliminates at most two choices — the reason decides between the remaining two.',
        'TEST THE REASON AGAINST THE TEXT: for each choice, ask "does this reason accurately describe what the sentence does?" A reason can be wrong even when its yes/no call is right, and a reason can describe something TRUE that still is not why the sentence should be added or cut.',
        'ADD trap — TOPICALLY TRUE BUT OFF-FOCUS: a candidate sentence can be accurate and even interesting, but if it drifts from the paragraph\'s specific focus (not just the passage\'s general subject), the right answer is No because it strays, not because it is false.',
        'ADD trap — FALSE REDUNDANCY CLAIM: a "No, because it repeats information already given" choice is only correct if that information was actually stated earlier. Distractors invent a repetition that never happened.',
        'DELETE trap — LOSES THE SPECIFIC EXAMPLE: the most common right answer to "the paragraph would primarily lose ___" is a sentence that supplied a concrete number, name, or detail supporting a general claim made elsewhere in the paragraph.',
        'ACCOMPLISHES-GOAL STRUCTURE: unlike most ACT English questions, all four choices are usually grammatically correct AND factually plausible. The only test is whether the choice matches the EXACT goal named in the prompt (emphasize X, illustrate Y, show contrast) — not whether it is well written.',
        'ACCOMPLISHES-GOAL trap — RIGHT TOPIC, WRONG GOAL: a choice can add true, relevant-sounding detail (a date, a location, a reaction) that answers a DIFFERENT implicit goal than the one stated. Re-read the named goal after evaluating each choice, not before.',
        'NO CHANGE is a fully legitimate answer on both formats — it wins whenever the original best fits the focus or the goal, not because it is the safe default.',
      ],
      vocabulary: [
        { term: 'kept/deleted question', definition: "an ACT English question asking whether a sentence should be added or removed, always paired with a specific reason as part of the answer choice." },
        { term: "accomplishes the writer's goal", definition: 'a question format where every choice is accurate, and only the choice matching the exact stated purpose is correct.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-add-reason',
      kind: 'worked_example',
      problem:
        'A paragraph reads: "The reading room was expanded to include forty new seats and three group-study pods." The writer is considering adding this sentence right after it: "The circulation desk was repainted a pale blue to match the children\'s section." Should the sentence be added? (A) Yes, because it shows the renovation extended beyond the reading room. (B) Yes, because it explains why seating increased. (C) No, because it repeats information already given about seating. (D) No, because it strays from the paragraph\'s focus on the reading room\'s capacity.',
      steps: [
        "Name the paragraph's specific focus: not \"the library\" in general, but the reading room's added seating and study pods.",
        'Check the candidate sentence against that focus: it describes the circulation desk\'s paint color — a different renovation detail, not reading-room capacity.',
        'Test every reason, not just the yes/no: (A) is topically true but does not make it belong HERE; (B) claims the sentence explains the seat increase, but paint color explains nothing about seating; (C) claims redundancy, but paint was never mentioned before — there is nothing to repeat.',
        '(D) is the only reason that accurately names the real problem: the sentence is accurate but off the paragraph\'s specific focus.',
      ],
      answer: "No — do not add it, because it strays from the paragraph's focus on the reading room's capacity (choice D), even though the sentence itself is true.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-accomplishes-goal',
      kind: 'worked_example',
      problem:
        'Original sentence: "During her internship at the design studio, Maya sketched packaging concepts for six different clients." Suppose the writer wants to emphasize the BREADTH of experience Maya gained. Which choice best accomplishes this goal? (A) NO CHANGE (B) "sketched packaging concepts, sat in on client meetings, and helped prepare a trade-show display for six different clients" (C) "sketched packaging concepts for six different clients, most of whom were based in Chicago" (D) "sketched packaging concepts for six different clients over the course of ten weeks"',
      steps: [
        'Isolate the goal exactly as stated: emphasize the BREADTH of Maya\'s experience — not just any true fact about the internship.',
        'Remember all four choices are grammatical and plausible; the test is fit-to-goal, not correctness.',
        'Eliminate goal-mismatches: (C) adds a location detail — true, but says nothing about breadth; (D) adds a timeframe — true, but says nothing about variety of work.',
        'Compare the remaining two: (A) NO CHANGE names only one kind of task across six clients; (B) adds two more distinct tasks — client meetings, trade-show prep — which multiplies the KINDS of work described.',
      ],
      answer: "(B) — it most directly accomplishes \"breadth\" by broadening the range of tasks, not just adding an adjacent true fact.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-add-relevant-detail',
      kind: 'try_yourself',
      problem:
        'A paragraph reads: "After years of working in restaurant kitchens, Elena decided to open her own food truck specializing in Vietnamese sandwiches." The writer is considering adding this sentence right after it: "Elena\'s truck is painted bright yellow with a hand-painted logo of a banh mi." Should the writer add this sentence here?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Yes, because it explains why Elena chose the food-truck business over a restaurant." },
        { id: 'b', text: "Yes, because it gives a concrete, relevant detail about the truck the paragraph just introduced.", correct: true },
        { id: 'c', text: "No, because a food truck cannot legally be painted bright yellow." },
        { id: 'd', text: "No, because the paragraph has already fully described the truck's appearance." },
      ],
      expectedAnswer: "Yes, because it gives a concrete, relevant detail about the truck the paragraph just introduced.",
      hints: [
        "Check what the paragraph has covered so far — has the truck's appearance been described yet?",
        'Test each reason against the sentence itself: does it actually explain WHY Elena chose this business, or does it just describe an object?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-delete-loses-example',
      kind: 'try_yourself',
      problem:
        'A paragraph reads: "Every autumn, the Millbrook Public Library holds a used-book sale that raises money for children\'s programs. Last year\'s sale earned $4,200, funding a new set of picture books for the toddler room. Volunteers sort donated books by genre for three weekends before the sale opens." The writer is considering deleting the middle sentence, about last year\'s sale earning $4,200. If the writer deletes it, the paragraph would primarily lose:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a description of how volunteers prepare for the sale.' },
        { id: 'b', text: "a specific example showing how the sale's proceeds are used.", correct: true },
        { id: 'c', text: 'an explanation of why the library began holding book sales.' },
        { id: 'd', text: "a comparison between this year's sale and last year's sale." },
      ],
      expectedAnswer: "a specific example showing how the sale's proceeds are used.",
      hints: [
        'The sentence contains a specific dollar figure and a specific use for it — what general claim earlier in the paragraph does that support?',
        'Rule out choices describing OTHER sentences: volunteer sorting is the next sentence, not this one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-accomplishes-complexity',
      kind: 'try_yourself',
      problem:
        'Original sentence: "For her science fair project, Priya built a small robot that could sort recycling by material." Suppose the writer wants to emphasize the TECHNICAL COMPLEXITY of Priya\'s project. Which choice best accomplishes this goal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE ("built a small robot that could sort recycling by material")' },
        { id: 'b', text: 'built a small robot using a camera sensor, three motors, and a custom sorting algorithm to sort recycling by material', correct: true },
        { id: 'c', text: "built a small robot that could sort recycling by material, a project she finished two days before the fair" },
        { id: 'd', text: 'built a small robot that could sort recycling by material, which impressed the judges' },
      ],
      expectedAnswer: 'built a small robot using a camera sensor, three motors, and a custom sorting algorithm to sort recycling by material',
      hints: [
        'The named goal is the complexity of the ENGINEERING, not the timeline or how others reacted.',
        'Which choice names specific technical components rather than an adjacent true fact?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reason-vs-call',
      kind: 'misconception_check',
      question:
        'On "should this sentence be added?" questions, a student picks the first choice whose yes/no matches their gut call without reading the reason. On "accomplishes the goal" questions, a student picks the first choice that is simply true. Why do both habits fail on the ACT?',
      commonErrors: [
        {
          answer: 'Choosing a Yes/No choice for its yes/no value alone',
          misconception: 'Treating the yes/no call as the whole answer, when the ACT actually scores the REASON attached to it.',
          correctsTo: "All four choices usually split into two Yes and two No, but four DIFFERENT reasons. Getting the right yes/no with the wrong reason is still wrong — verify the reason accurately describes what the sentence does (new info, redundant, off-focus, or contradicts) before locking in.",
        },
        {
          answer: "Choosing an \"accomplishes the goal\" choice because its content is factually accurate",
          misconception: 'Assuming any true, well-written choice satisfies the question.',
          correctsTo: "On these questions every choice is usually grammatical and true — the question only asks which one matches the SPECIFIC goal named in the prompt. Re-read the exact goal after evaluating each choice, not before, and reject true-but-off-goal choices.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Add/delete choices split two Yes / two No with four different reasons — the REASON decides the answer, not the yes/no call.',
        'Test a reason against the actual paragraph: is it new information, redundant, off-focus, or does it support/contradict a claim made elsewhere?',
        '"Accomplishes the goal" choices are usually all true — reread the exact goal and pick the choice that matches it specifically, not just any strong sentence.',
        'NO CHANGE is a legitimate answer on both formats whenever the original best fits the focus or the goal.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.9', cedTitle: 'Rhetorical Skills: Adding, Deleting & Organizing' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
