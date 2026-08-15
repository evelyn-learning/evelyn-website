/**
 * Grades 3-5 Social Studies — American Revolution.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_AMERICAN_REVOLUTION: LessonPlan = {
  id: 'evelyn.g35.ss.american-revolution.v1',
  title: 'Grades 3-5 SS — American Revolution',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.american-revolution',
      description: 'Identify the causes, key events, and outcome of the American Revolution; explain why the colonies declared independence.',
      standard: 'NCSS 3-5 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g35.ss.european-exploration'],
  followUps: ['g35.ss.constitution-intro'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A small group of colonies fought the most powerful country in the world — and won.',
      script: 'In 1776, thirteen American colonies wrote a Declaration of Independence saying: we are no longer ruled by Britain. They had to fight a war to make it real. Today we drill the causes, the events, and the outcome.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-revolution',
      kind: 'concept',
      goal: 'Causes + key events + key people + outcome.',
      keyIdeas: [
        'CONTEXT: 13 British colonies along the East Coast. Britain had won the French and Indian War (1763) but was deeply in debt.',
        'CAUSES — Britain taxed colonies WITHOUT giving them representation in Parliament. "No taxation without representation."',
        'TAXES the colonists hated: Stamp Act (1765, taxed paper goods), Tea Act (1773, taxed tea).',
        'BOSTON TEA PARTY (Dec 1773): colonists dumped British tea into Boston Harbour as protest.',
        'WAR BEGINS: Lexington and Concord (April 1775). "Shot heard round the world."',
        'DECLARATION OF INDEPENDENCE (July 4, 1776): written mainly by Thomas Jefferson. Declared the colonies a NEW nation: the United States of America.',
        'KEY FIGURES: George Washington (military commander), Thomas Jefferson, Benjamin Franklin (diplomat to France), John Adams.',
        'KEY BATTLES: Saratoga (1777, turning point — France joined the colonies), Yorktown (1781, British surrender).',
        'TREATY OF PARIS (1783): officially ended the war. Britain recognised US independence.',
        'IDEAS: that "all men are created equal" (Declaration), that government gets its power from the consent of the governed.',
        'IMPORTANT NOTE: "all men" excluded enslaved people, women, and Indigenous peoples — these contradictions led to centuries of further struggle for full equality.',
      ],
      vocabulary: [
        { term: 'colony', definition: 'a region ruled by another country.' },
        { term: 'declaration', definition: 'a formal statement (the Declaration of Independence announced US separation from Britain).' },
        { term: 'representation', definition: 'having a voice in government, usually through elected officials.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cause',
      kind: 'worked_example',
      problem: 'Why did the Boston Tea Party happen?',
      steps: [
        'Britain passed the Tea Act (1773) — kept a tax on tea sold in the colonies.',
        'Colonists were angry: they had no representation in Parliament, so the tax felt unfair.',
        'Many ships full of British tea were heading to colonial ports.',
        'In Boston, on December 16, 1773, a group of colonists boarded the ships and dumped the tea into the harbour.',
        'It was a PROTEST against being taxed without a voice. "No taxation without representation."',
      ],
      answer: 'Protest against tea tax + lack of representation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Who wrote the Declaration of Independence?',
      expectedAnswer: 'Thomas Jefferson (with help from a committee including Ben Franklin and John Adams).',
      responseFormat: 'free',
      hints: [
        'Hint: he later became the 3rd president.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-revolution-easy',
      kind: 'misconception_check',
      question: 'A child says "the colonies just declared independence and Britain agreed." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Independence by simple declaration',
          misconception: 'Skipping the war that followed.',
          correctsTo: 'The Declaration of Independence (1776) was just words. Britain did NOT agree. A long war followed — the Revolutionary War, 1775-1783, with major battles at Lexington/Concord, Saratoga, Yorktown. Independence was won on the battlefield. The Treaty of Paris (1783) finally made it official. Words alone don\'t bring freedom; they declared the goal but the war achieved it.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '13 colonies + Britain + taxes without representation = causes.',
        'Boston Tea Party 1773. War 1775-1783.',
        'Declaration of Independence: July 4, 1776.',
        'Key people: Washington, Jefferson, Franklin, Adams.',
        'Treaty of Paris 1783 = independence official.',
        'Declaration\'s "all men equal" was a goal — full equality came (and is still being worked toward) over many years.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was the Battle of Saratoga (1777) considered the turning point?',
      hint: 'After Saratoga (American victory), FRANCE decided to join the war on the American side. France brought money, soldiers, and a navy that could challenge British ships. Without French help, the colonies likely couldn\'t have won. Saratoga proved the colonies could win — convincing France to back them changed everything.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
