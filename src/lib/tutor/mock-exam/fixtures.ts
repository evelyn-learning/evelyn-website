/**
 * Fixture form + items shared by every mock-exam service test. Mirrors the
 * FIXTURE_BLUEPRINT shape in ./blueprints/fixture.ts: sec1 = adaptive MCQ
 * (m1: 2 items, m2-easy/m2-hard: 1 item each), sec2 = 1 FRQ item.
 */

/** Subset of IProblemBank fields the mock service reads. */
export interface SeedableItem {
  id: string;
  loId: string;
  topic: string;
  topicId: string;
  difficulty: 1 | 2 | 3 | 4;
  responseFormat: 'mcq' | 'numeric' | 'frq';
  problemText: string;
  choices?: string[];
  answer: string;
  solutionText?: string;
  passageId?: string;
  bankScope: 'mock';
  rubric?: {
    parts: Array<{ criterionId: string; maxPoints: number; scoringCriteria: string; modelResponse: string }>;
  };
}

export const FIXTURE_ITEMS: SeedableItem[] = [
  {
    id: 'fx-m1-1',
    loId: 'fx.lo1',
    topic: 'Fixture',
    topicId: 'fixture',
    difficulty: 1,
    responseFormat: 'mcq',
    problemText: 'What is 1 + 1?',
    choices: ['2', '3', '4', '5'],
    answer: 'A',
    solutionText: '1 + 1 = 2, choice A.',
    bankScope: 'mock',
  },
  {
    id: 'fx-m1-2',
    loId: 'fx.lo1',
    topic: 'Fixture',
    topicId: 'fixture',
    difficulty: 1,
    responseFormat: 'mcq',
    problemText: 'What is 2 + 1?',
    choices: ['2', '3', '4', '5'],
    answer: 'B',
    solutionText: '2 + 1 = 3, choice B.',
    bankScope: 'mock',
  },
  {
    id: 'fx-m2e-1',
    loId: 'fx.lo2',
    topic: 'Fixture',
    topicId: 'fixture',
    difficulty: 2,
    responseFormat: 'mcq',
    problemText: 'What is 3 + 1?',
    choices: ['2', '3', '4', '5'],
    answer: 'A',
    solutionText: '3 + 1 = 4, choice A.',
    bankScope: 'mock',
  },
  {
    id: 'fx-m2h-1',
    loId: 'fx.lo2',
    topic: 'Fixture',
    topicId: 'fixture',
    difficulty: 3,
    responseFormat: 'numeric',
    problemText: 'What is 40 + 2?',
    answer: '42',
    solutionText: '40 + 2 = 42.',
    bankScope: 'mock',
  },
  {
    id: 'fx-frq-1',
    loId: 'fx.lo3',
    topic: 'Fixture',
    topicId: 'fixture',
    difficulty: 3,
    responseFormat: 'frq',
    problemText: 'Explain why the sum of two even integers is even.',
    answer: 'see rubric',
    solutionText: 'Any two even integers can be written as 2k and 2m; their sum 2k + 2m = 2(k + m) is even.',
    bankScope: 'mock',
    rubric: {
      parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'States 2k+2m form', modelResponse: 'Let the two even integers be 2k and 2m for integers k, m.' },
        { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Concludes 2(k+m) is even', modelResponse: 'Then 2k + 2m = 2(k + m), which is even since it is 2 times an integer.' },
      ],
    },
  },
];

export const FIXTURE_FORM = {
  formId: 'fixture-form-a',
  examKey: 'fixture',
  topicIds: ['fixture'],
  label: 'Fixture Form A',
  status: 'live' as const,
  sections: [
    {
      sectionId: 'sec1',
      modules: [
        { moduleId: 'm1', itemIds: ['fx-m1-1', 'fx-m1-2'] },
        { moduleId: 'm2-easy', itemIds: ['fx-m2e-1'] },
        { moduleId: 'm2-hard', itemIds: ['fx-m2h-1'] },
      ],
    },
    {
      sectionId: 'sec2',
      modules: [{ moduleId: 'frq', itemIds: ['fx-frq-1'] }],
    },
  ],
};
