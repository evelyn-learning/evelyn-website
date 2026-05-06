/**
 * Grades 11-12 Social Studies — Philosophy Branches.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_PHILOSOPHY_BRANCHES: LessonPlan = {
  id: 'evelyn.g1112.ss.philosophy.branches.v1',
  title: 'Philosophy — Major Branches and Foundational Questions',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'social-studies',
  topic: 'philosophy',
  locale: 'en',
  los: [
    {
      id: 'g1112.ss.philosophy.branches',
      description: 'Identify the four major branches of philosophy (metaphysics, epistemology, ethics, logic) and key thinkers in each.',
      standard: 'COLLEGE-PREP-PHIL',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Philosophy is the discipline that asks "what are we even doing?" — the foundational questions every other field rests on.',
      script: 'What is real? How do we know? What\'s right and wrong? What\'s a valid argument? Every science, legal system, and ethical decision rests on philosophical foundations — usually unexamined. Today: the four major branches.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-philosophy',
      kind: 'concept',
      goal: 'Four branches, key questions, major thinkers.',
      keyIdeas: [
        'METAPHYSICS asks "what is real?"',
        '  Sub-questions: What exists? Free will? Consciousness?',
        '  Key figures: Plato (ideal forms), Aristotle (substance + form), Descartes (mind-body dualism), modern: David Chalmers.',
        'EPISTEMOLOGY asks "how do we know?"',
        '  What is knowledge? Can we know with certainty? Belief vs justified belief vs knowledge?',
        '  Plato (knowledge as justified true belief), Hume (empiricism, skepticism), Kant (synthesis), Popper (falsifiability).',
        'ETHICS asks "what should we do?"',
        '  Three major frameworks:',
        '    DEONTOLOGY (Kant): rules-based. Some actions right/wrong regardless of consequences.',
        '    CONSEQUENTIALISM (Bentham, Mill): right action maximises good outcomes. UTILITARIANISM is most famous.',
        '    VIRTUE ETHICS (Aristotle): right action stems from virtuous character.',
        '  Modern: Rawls (justice as fairness), Singer (effective altruism).',
        'LOGIC asks "what counts as valid reasoning?"',
        '  Deductive (necessarily true), inductive (likely), abductive (best explanation).',
        '  Aristotle (syllogisms), Frege + Russell (formal logic).',
        '  Modern: critical for AI, CS, math.',
        'WHY PHILOSOPHY MATTERS:',
        '  Science assumes metaphysical claims (the world is real, regular, knowable).',
        '  Law and policy rely on ethics.',
        '  Critical thinking depends on logic.',
        '  Philosophers increasingly hired in tech (ethics teams), medicine (bioethics), law.',
      ],
      vocabulary: [
        { term: 'epistemology', definition: 'the branch of philosophy concerned with the nature and limits of knowledge.' },
        { term: 'utilitarianism', definition: 'an ethical framework holding that the right action produces the greatest good for the greatest number.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A self-driving car must choose: hit a pedestrian (kill 1) or swerve and crash, killing the passenger (1). How would deontology, consequentialism, and virtue ethics each approach this?',
      steps: [
        'CONSEQUENTIALISM: count outcomes. Both kill 1 — neutral on count. Other factors: who consented? (passenger chose to ride; pedestrian didn\'t.)',
        'DEONTOLOGY (Kantian): you cannot use one person as a means to save another. Actively swerving may violate this.',
        'VIRTUE ETHICS: what would a virtuous agent do? Less algorithmic; more about character.',
        'No clear answer. Different frameworks give different verdicts. Real-world AI ethics requires CHOOSING which framework (or hybrid) to encode.',
      ],
      answer: 'Different frameworks give different answers — illustrates the practical relevance of ethical theory.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Hume said "you cannot derive an OUGHT from an IS." What does this mean for ethics?',
      expectedAnswer: 'You can\'t logically deduce a moral conclusion from purely factual premises. Knowing "the cliff is steep" doesn\'t logically tell you "you ought not jump." Ethics requires its own foundation — values, principles, or moral facts. Implications: science alone can\'t resolve ethical questions; ethics is a distinct domain.',
      responseFormat: 'free',
      hints: ['What\'s the difference between a factual claim and a moral claim?', 'Can you logically deduce moral conclusions from facts?'],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-philosophy-impractical',
      kind: 'misconception_check',
      question: 'A student says "philosophy is just word games — useless in real life." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Philosophy is useless',
          misconception: 'Confusing abstract topics with practical irrelevance.',
          correctsTo: 'Philosophy is the foundation of nearly every practical field. Law (what counts as fair?), medicine (when does life begin?), business (whose interests count?), AI (autonomous weapons? algorithmic bias?). Every "common sense" position has hidden philosophical commitments. The questions don\'t go away by ignoring them — they just get answered worse.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four branches: metaphysics (real), epistemology (know), ethics (do), logic (reason).',
        'Three ethical frameworks: deontology, consequentialism, virtue ethics.',
        'Hume\'s is-ought gap: facts alone don\'t entail values.',
        'Philosophy underpins science, law, medicine, AI ethics.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
