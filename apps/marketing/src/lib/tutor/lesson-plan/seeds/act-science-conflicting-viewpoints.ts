/**
 * ACT Science — Conflicting Viewpoints passages.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_SCIENCE_CONFLICTING_VIEWPOINTS: LessonPlan = {
  id: 'evelyn.testprep.act.science.conflicting-viewpoints.v1',
  title: 'ACT Science — Conflicting Viewpoints Passages',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-science',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.science.conflicting-viewpoints',
      description: 'Drill the Conflicting Viewpoints passage: track each scientist\'s argument, identify where they agree/disagree, and answer support / refute / response questions.',
      standard: 'ACT-SCIENCE',
    },
  ],
  prerequisites: ['testprep.act.science.data-rep'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Conflicting Viewpoints is a READING passage disguised as science — track who-argues-what carefully and you\'ll do well.',
      script: 'A typical Conflicting Viewpoints passage has 2-3 scientists/students presenting alternative explanations for the same phenomenon. The questions test whether you can pinpoint each side\'s claim, identify where they disagree, and predict how each would respond to new evidence. Read like a debate moderator.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conflicting',
      kind: 'concept',
      goal: 'Passage shape, note-taking, question types, reasoning patterns.',
      keyIdeas: [
        'PASSAGE STRUCTURE: brief intro stating the question being debated, then 2-3 viewpoints (often labeled Scientist 1, Scientist 2, Student A/B/C, Theory 1/2).',
        'TIME BUDGET: this passage takes the LONGEST of the three Science types — ~7 minutes (vs ~5 for Data Rep). Plan accordingly.',
        'NOTE-TAKING strategy: as you read, jot a 3-word summary of each viewpoint\'s MAIN CLAIM and its KEY EVIDENCE. Use the margins.',
        'COMMON QUESTION TYPES:',
        '  WHAT EACH BELIEVES: "Scientist 2 believes X is caused by..." Direct from passage.',
        '  AGREEMENT: "Both scientists agree that..." — find common ground (often a basic observation; they DIFFER on explanations).',
        '  DISAGREEMENT: "The main disagreement is..." — find divergence, usually about MECHANISMS or causes.',
        '  RESPONSE: "How would Scientist 1 respond to the finding that...?" — predict from their framework.',
        '  STRENGTHEN/WEAKEN: "Which finding would BEST SUPPORT Scientist 1?" — pick the option most consistent with that scientist\'s claim.',
        'REASONING PATTERN: each scientist usually has (1) a CLAIM, (2) some EVIDENCE supporting it, and possibly (3) a CRITIQUE of the other view. Track all three.',
        'TRAPS:',
        '  Mixing up which scientist said what — read carefully and track names.',
        '  Picking an answer that\'s scientifically true but not what the SCIENTIST in the passage said.',
        '  Strengthening one scientist with evidence that ALSO strengthens the other (i.e. both would accept it).',
      ],
      vocabulary: [
        { term: 'point of agreement', definition: 'a claim or observation that ALL viewpoints in the passage accept; often a baseline fact, with disagreement on explanation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Two scientists debate dinosaur extinction. Sci 1: asteroid impact caused mass extinction (Iridium layer evidence). Sci 2: volcanic Deccan Traps eruptions (sulfur isotope evidence). Both agree extinction occurred at K-Pg boundary 65 Mya. Question: A NEW finding shows Iridium peaked at the K-Pg boundary AND sulfur emissions also peaked simultaneously. How would each respond?',
      steps: [
        'Identify each scientist\'s claim. Sci 1: asteroid. Sci 2: volcanic.',
        'New finding: BOTH evidence types peak at the same time.',
        'Sci 1 (asteroid): the Iridium peak supports me. The sulfur peak might be EXPLAINED by the asteroid impact triggering volcanic activity (some argue this) — could spin it as compatible.',
        'Sci 2 (volcanic): the sulfur peak supports me directly. The Iridium could come from the volcanism (some volcanic deposits have Iridium) — argue Iridium is not unique to asteroids.',
        'Or both might say "this supports a COMBINED-causes hypothesis" — neither alone.',
        'ACT typical answer: a finding that fits BOTH frameworks neither strongly favours nor refutes either. Pick the option that captures this.',
      ],
      answer: 'The finding is consistent with BOTH viewpoints, neither strongly favoured.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two students debate why a plant grew faster in red light than blue. Student A: red light is more energetic. Student B: chlorophyll absorbs red more efficiently. Which is consistent with the actual science?',
      expectedAnswer: 'Student B. Red light is actually LESS energetic than blue (lower frequency), so Student A\'s reasoning is wrong. Chlorophyll DOES absorb red (and blue) preferentially over green, which is why plants reflect green and look green. Student B\'s claim aligns with photosynthesis biology. ACT may not require this background — but it tests whether you can identify which claim is internally coherent given the passage.',
      responseFormat: 'free',
      hints: [
        'Compare the two claims for scientific coherence.',
        'Red light has LONGER wavelength than blue — what does that mean for energy?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-mix-up-claims',
      kind: 'misconception_check',
      question: 'A student answers a question by attributing the wrong claim to a scientist. What\'s the fix?',
      commonErrors: [
        {
          answer: 'Mixes up scientist claims',
          misconception: 'Failing to take notes or use names.',
          correctsTo: 'Always note (in your own shorthand) what each named scientist/student/theory claims AS YOU READ. Margin notes like "Sci1: asteroid" "Sci2: volcanic" pay off when questions ask "Sci 1 would argue..." Without notes, students often answer with general scientific knowledge or what THEY believe — not what the passage says. The passage authority always wins.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Conflicting Viewpoints needs ~7 min — longest of the three types.',
        'Note each scientist\'s claim + key evidence in margins.',
        'Identify points of agreement vs disagreement.',
        'Strengthen/weaken: pick what fits ONE viewpoint, not both.',
        'Trust the passage, not your science knowledge.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
