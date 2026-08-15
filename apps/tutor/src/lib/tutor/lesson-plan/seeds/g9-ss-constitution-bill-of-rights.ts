/**
 * G9 — Social Studies: The Constitution and the Bill of Rights.
 *
 * The framework that organizes US government. Why the Articles of
 * Confederation failed; what the Constitution fixed (federalism,
 * 3 branches, amendment process); the Bill of Rights as the first
 * 10 amendments protecting individual rights.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_SS_CONSTITUTION_BILL_OF_RIGHTS: LessonPlan = {
  id: 'evelyn.g9.ss.constitution-bill-of-rights.v1',
  title: 'The Constitution and the Bill of Rights',
  curriculum: 'state-standards',
  grade: '9',
  subject: 'social-studies',
  topic: 'government',
  locale: 'en',
  los: [
    {
      id: 'ss.g9.govt.constitution',
      description: 'Explain the structure of the Constitution and the protections in the Bill of Rights.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why a government needs a written rulebook.',
      script: 'You just won a war for independence. Now you have 13 separate states each acting like a country. You need a system that keeps them together but doesn\'t become tyranny. That\'s what the Constitution is — a written rulebook for how the United States works. And the Bill of Rights is the part that says "but the government can\'t take away THESE specific freedoms, ever."',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-constitution',
      kind: 'concept',
      goal: 'Articles of Confederation failure → Constitution structure → Bill of Rights.',
      keyIdeas: [
        'ARTICLES OF CONFEDERATION (1781-1789) — the FIRST US government document. Too WEAK: no power to tax, no national army, no central executive. States ignored federal requests. Failed.',
        'CONSTITUTIONAL CONVENTION (1787) replaced it with the CONSTITUTION.',
        'PREAMBLE — opening sentence stating purposes ("We the People... in order to form a more perfect Union...").',
        'STRUCTURE: 7 ARTICLES.',
        '  Article I: Legislative (Congress).',
        '  Article II: Executive (President).',
        '  Article III: Judicial (Courts).',
        '  Articles IV-VII: states, amendments, ratification, supremacy.',
        'KEY PRINCIPLES:',
        '  FEDERALISM — power split between FEDERAL government and STATES.',
        '  SEPARATION OF POWERS — three branches, each with distinct jobs.',
        '  CHECKS AND BALANCES — branches limit each other.',
        '  POPULAR SOVEREIGNTY — power comes from the people.',
        '  RULE OF LAW — even leaders are bound by the laws.',
        'AMENDMENTS — the Constitution can be CHANGED, but only with broad agreement (2/3 of Congress + 3/4 of states).',
        'BILL OF RIGHTS = first 10 amendments (added 1791) protecting individual rights from government overreach:',
        '  1st: Speech, religion, press, assembly, petition.',
        '  2nd: Right to bear arms.',
        '  3rd: No quartering of soldiers in homes.',
        '  4th: No unreasonable search and seizure.',
        '  5th: Due process; no self-incrimination; no double jeopardy.',
        '  6th: Speedy public trial, jury, lawyer.',
        '  7th: Jury trial in civil cases.',
        '  8th: No cruel or unusual punishment, no excessive bail.',
        '  9th: Other rights not listed are still retained by people.',
        '  10th: Powers not given to federal go to STATES or PEOPLE.',
      ],
      vocabulary: [
        { term: 'federalism', definition: 'power shared between national and state governments.' },
        { term: 'amendment', definition: 'a change or addition to the Constitution.' },
        { term: 'Bill of Rights', definition: 'the first 10 amendments — protect individual rights.' },
        { term: 'due process', definition: 'fair legal procedures the government must follow.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-which-amendment',
      kind: 'worked_example',
      problem: 'For each scenario, name the amendment that protects the right: (a) A reporter publishes a story criticizing the President. (b) Police search someone\'s house with no warrant or reason. (c) A defendant refuses to answer questions in court that would incriminate them.',
      steps: [
        '(a) Press freedom → 1st Amendment.',
        '(b) Search without warrant/reason → 4th Amendment ("unreasonable search and seizure").',
        '(c) Refusing to incriminate self → 5th Amendment ("plead the Fifth").',
      ],
      answer: '(a) 1st, (b) 4th, (c) 5th',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A protester is arrested for criticizing the government at a public rally. Which amendment did the arrest violate?',
      expectedAnswer: '1st amendment',
      responseFormat: 'free',
      hints: [
        'Public rally = assembly. Criticizing government = speech.',
        'The amendment that covers both is the FIRST.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rights-from-constitution',
      kind: 'misconception_check',
      question: 'Asha says "The Constitution gives Americans their rights." What\'s the more nuanced view?',
      commonErrors: [
        {
          answer: 'yes — that\'s what the Bill of Rights does',
          misconception: 'Treating rights as government-granted instead of pre-existing.',
          correctsTo: 'The Founders\' view (per the Declaration of Independence) was that rights are NATURAL — people have them just by being people. The Constitution doesn\'t GIVE rights; it RESTRICTS THE GOVERNMENT from taking them away. The 9th Amendment specifically says rights not listed are still retained. Subtle but important distinction.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Articles of Confederation = too weak; replaced by Constitution (1789).',
        'Constitution: 7 articles + preamble. Sets up federalism and 3 branches.',
        'Key principles: federalism, separation of powers, checks and balances, popular sovereignty, rule of law.',
        'Bill of Rights = first 10 amendments — individual rights protections.',
        'Amendments are HARD to add: 2/3 Congress + 3/4 states.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was the Bill of Rights added AFTER the Constitution rather than written into the original document?',
      hint: 'Some Founders ("Federalists") thought a list of rights was unnecessary — and that listing some might imply others didn\'t exist. "Anti-Federalists" demanded a Bill of Rights as the price of ratification. They compromised and added it via amendments.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
