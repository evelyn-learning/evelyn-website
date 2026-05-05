/**
 * Grades 11-12 Social Studies — Philosophy (intro).
 *
 * Logic, ethics, epistemology, metaphysics, political philosophy.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_PHILOSOPHY: LessonPlan = {
  id: 'evelyn.ss.11-12.philosophy.v1',
  title: 'Philosophy — logic, ethics, knowledge, mind, politics',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'social-studies',
  topic: 'philosophy',
  locale: 'en',
  los: [
    {
      id: 'hs.philosophy',
      description: 'Identify the major branches of philosophy and analyze arguments using basic logical structure.',
      standard: 'NCSS-D2',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame philosophy as the discipline that asks the questions before there were sciences.',
      script: 'Every science you take started as philosophy. Physics was natural philosophy. Psychology was philosophy of mind. Economics was political philosophy. As questions get answerable empirically they spin off into sciences. The questions still in philosophy are the ones we DON\'T yet know how to settle empirically — what\'s real, what we can know, how we should live, what justice is.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-branches',
      kind: 'concept',
      goal: 'Five branches + how to read an argument.',
      keyIdeas: [
        'LOGIC: rules of valid inference. An argument is VALID if conclusion follows from premises. SOUND if valid + premises true.',
        'EPISTEMOLOGY: what can we know? Rationalism (Descartes — reason) vs empiricism (Locke, Hume — experience). Justified true belief and Gettier problems.',
        'METAPHYSICS: what is real? Mind/body problem. Free will vs determinism vs compatibilism. Time, identity, possibility.',
        'ETHICS: how should we act? Three big traditions: VIRTUE ethics (Aristotle — character), DEONTOLOGY (Kant — duties, the categorical imperative), CONSEQUENTIALISM (Mill — outcomes; utilitarianism = greatest good). Each has weak points.',
        'POLITICAL PHILOSOPHY: what makes a society legitimate? Hobbes (security), Locke (consent + property), Rousseau (general will), Rawls (justice as fairness — veil of ignorance), Nozick (libertarian).',
        'AESTHETICS: what is beauty / art / value? Largely outside scope here.',
        'READING AN ARGUMENT: identify premises + conclusion. Test for validity (does conclusion FOLLOW?). Test for soundness (are premises actually true?). Steelman the opposing view before critique.',
      ],
      vocabulary: [
        { term: 'epistemology', definition: 'the philosophical study of knowledge — what we can know and how.' },
        { term: 'consequentialism', definition: 'an ethical theory that judges actions by their outcomes; utilitarianism is the most common form.' },
        { term: 'valid argument', definition: 'one whose conclusion follows necessarily from its premises (whether or not the premises are true).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trolley',
      kind: 'worked_example',
      problem: 'The trolley problem: divert a runaway trolley from killing 5 people, knowing it will kill 1 person on the side track. What does each ethical theory say?',
      steps: [
        'CONSEQUENTIALIST (utilitarian): divert. 1 death is better than 5. Outcome dominates.',
        'DEONTOLOGIST (Kantian): the trickier answer. Diverting USES the 1 person as a means to save 5 (in some framings). Many Kantians say: don\'t pull the lever; it\'s wrong to actively kill, even to save more.',
        'VIRTUE: what would a person of practical wisdom do? Considers character, intent, situation. Often supports diversion but emphasizes the cost.',
        'The thought experiment shows how theories that often agree on everyday cases diverge sharply at edges.',
      ],
      answer: 'Consequentialism diverts; deontology often refuses; virtue ethics weighs character + situation.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Argument: "All cats are mammals. All mammals are animals. Therefore all cats are animals." Is this valid? Sound?',
      expectedAnswer: 'valid (conclusion follows from premises) AND sound (premises are true)',
      responseFormat: 'free',
      hints: [
        'Validity: does conclusion follow from premises (regardless of truth)?',
        'Soundness: validity + premises actually true.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-opinion',
      kind: 'misconception_check',
      question: 'A student says: "Philosophy is just opinions — none of it is true or false." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because everyone disagrees',
          misconception: 'Mistaking ongoing disagreement for absence of standards.',
          correctsTo: 'Philosophical claims have STANDARDS even when they\'re hard to settle. Some arguments are valid; some aren\'t. Some ethical positions handle counterexamples better than others. Some metaphysical theories explain more with fewer assumptions. Disagreement persists because the questions are genuinely hard, not because the field has no standards. "All opinions are equal" is itself a philosophical claim — and a weak one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Branches: logic, epistemology, metaphysics, ethics, political philosophy.',
        'Valid: conclusion follows. Sound: valid + premises true.',
        'Three ethical traditions: virtue, duty, outcomes — they diverge at edges.',
        'Disagreement isn\'t evidence of no standards.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
