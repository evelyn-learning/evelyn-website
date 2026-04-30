/**
 * AP Gov — Constitution and Bill of Rights.
 *
 * Foundational documents, key compromises, the amendment process.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_CONSTITUTION: LessonPlan = {
  id: 'evelyn.ap.gov.constitution.v1',
  title: 'The Constitution and Bill of Rights',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.constitution',
      description: 'Explain the structure of the Constitution, the compromises that produced it, the protections in the Bill of Rights, and the amendment process.',
      standard: 'AP-GOV-1.B',
    },
  ],
  prerequisites: [],
  followUps: ['apgov.federalism', 'apgov.civil-liberties'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Constitution as a series of compromises.',
      script: 'The Constitution didn\'t fall from the sky. Fifty-five delegates locked themselves in a Philadelphia room in 1787 and argued for four months. Big states vs small states. Slave states vs free states. Strong central government vs state sovereignty. Almost every clause is a compromise — and understanding the deals is how you understand the document.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-structure',
      kind: 'concept',
      goal: 'Articles, key compromises, Bill of Rights, amendment process.',
      keyIdeas: [
        'PREAMBLE: "We the People..." establishes popular sovereignty — power flows from the people, not a king.',
        'ARTICLES I–III set up the three branches: Article I (Congress), II (Executive), III (Judicial). IV–VII handle states\' relations, supremacy, ratification, amendments.',
        'GREAT COMPROMISE (Connecticut Compromise): two houses. House of Representatives based on population (big-state win). Senate gives 2 per state regardless of size (small-state win).',
        'THREE-FIFTHS COMPROMISE: enslaved people counted as 3/5 of a person for representation and taxation. Boosted slave-state House power; later voided by 13th and 14th Amendments.',
        'COMMERCE COMPROMISE: Congress gets to regulate interstate and international commerce. South protected against export taxes for 20 years on the slave trade.',
        'BILL OF RIGHTS (1791) — first 10 amendments, demanded by Anti-Federalists as the price of ratification: 1st (speech, religion, press, assembly, petition), 2nd (arms), 3rd (no quartering troops), 4th (search/seizure), 5th (due process, no double jeopardy, no self-incrimination), 6th (jury trial in criminal cases), 7th (jury trial in civil cases), 8th (no cruel/unusual punishment, no excessive bail), 9th (rights not listed are still retained), 10th (powers not delegated to U.S. reserved to states).',
        'AMENDMENT PROCESS: 2/3 of both houses propose AND 3/4 of states ratify. (Or constitutional convention — never used.) Hard by design — only 27 amendments in 230+ years. The first 10 came together; the others arrived in clusters around major events (Civil War, Progressive Era, Civil Rights).',
        'FEDERALISTS (Hamilton, Madison, Jay) wrote The Federalist Papers urging ratification. ANTI-FEDERALISTS (Brutus, Henry) warned of central tyranny. Bill of Rights was the deal that brought Anti-Federalists on board.',
      ],
      vocabulary: [
        { term: 'popular sovereignty', definition: 'the principle that government power derives from the consent of the governed.' },
        { term: 'ratification', definition: 'formal approval; the Constitution required 9 of 13 states; amendments require 3/4.' },
        { term: 'enumerated powers', definition: 'powers explicitly granted to Congress in Article I, Section 8.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-compromise',
      kind: 'worked_example',
      problem: 'Explain why the Great Compromise was necessary and what it produced.',
      steps: [
        'PROBLEM: Big states (Virginia, Pennsylvania) wanted representation by population. Small states (New Jersey, Delaware) wanted equal representation per state. Both sides threatened to walk if the other won.',
        'VIRGINIA PLAN (Madison): bicameral legislature, both houses by population. Big states win.',
        'NEW JERSEY PLAN (Paterson): unicameral legislature, equal vote per state. Small states win.',
        'GREAT COMPROMISE (Sherman): bicameral. House by population (Virginia Plan), Senate equal per state (New Jersey Plan). Big AND small states each win one chamber.',
        'CONSEQUENCE: every law needs both — population AND state-level support. Still in force today.',
      ],
      answer: 'The Great Compromise resolved big-vs-small-state representation by creating two houses — population-based House and equal-state Senate.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name three rights protected by the First Amendment.',
      expectedAnswer: 'Speech, religion (free exercise + no establishment), press, assembly, petition. Any three.',
      responseFormat: 'free',
      hints: [
        'Five rights total in the First Amendment.',
        'Mnemonic: RAPPS — Religion, Assembly, Press, Petition, Speech.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-amendment-easy',
      kind: 'misconception_check',
      question: 'Can the Constitution be amended by a simple majority of Congress?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating amendments like ordinary laws.',
          correctsTo: 'No — amending requires a 2/3 supermajority of BOTH houses to PROPOSE, then 3/4 of states (38 of 50) to RATIFY. Designed to be hard so the Constitution remains durable. Only 27 amendments since 1789, and 10 of those were the original Bill of Rights. Ordinary laws need only a simple majority and presidential signature; amendments are constitutional law and operate on a different track.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Constitution = compromises (Great, 3/5, Commerce). Articles I-III = three branches.',
        'Bill of Rights = first 10 amendments, ratified 1791. Demanded by Anti-Federalists.',
        'Amendment: 2/3 propose + 3/4 ratify. Hard by design.',
        'Federalist Papers (Hamilton, Madison, Jay) argued FOR ratification.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is it significant that the Bill of Rights was added AFTER the original Constitution rather than included from the start?',
      hint: 'Federalists argued listing rights was unnecessary — and dangerous, because anything not listed could be claimed denied. Anti-Federalists insisted on explicit protections. The 9th Amendment ("rights not listed retained") addresses the Federalist concern. The compromise: add the Bill but include the 9th to defuse the implication.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
