/**
 * G8 — Social Studies: The American Revolution.
 *
 * The conflict that turned 13 British colonies into the United
 * States. Covers causes (taxes, no representation), key events
 * (Boston Tea Party → Lexington/Concord → Declaration of
 * Independence → Yorktown), key figures (Washington, Adams,
 * Jefferson, Franklin), and the outcome (Treaty of Paris 1783).
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_AMERICAN_REVOLUTION: LessonPlan = {
  id: 'evelyn.g8.ss.american-revolution.v1',
  title: 'The American Revolution',
  curriculum: 'state-standards',
  grade: '8',
  subject: 'social-studies',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g8.ushistory.revolution',
      description: 'Explain causes, key events, and outcomes of the American Revolution.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Revolution as 13 colonies pushing back against an absent king.',
      script: 'Imagine a parent moving across the country but still grounding you for missing curfew, taxing your allowance, and never asking your opinion about anything. You\'d push back. That\'s sort of what happened — Britain ruled 13 American colonies from 3,000 miles away, kept piling on rules and taxes, and refused to give the colonists any say in Parliament. The Revolution was the breakup.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-revolution',
      kind: 'concept',
      goal: 'Causes → events → key figures → outcomes.',
      keyIdeas: [
        'CAUSES (1763-1775):',
        '  After the FRENCH AND INDIAN WAR (1754-1763), Britain was in debt and started TAXING the colonies harder (Stamp Act, Townshend Acts, Tea Act).',
        '  Colonists protested: "NO TAXATION WITHOUT REPRESENTATION" — they had no voting members in Parliament.',
        '  BOSTON MASSACRE (1770) — British soldiers killed 5 colonists during a confrontation.',
        '  BOSTON TEA PARTY (1773) — colonists dumped 342 chests of British tea into Boston Harbor.',
        '  Britain responded with the INTOLERABLE ACTS, closing Boston\'s port.',
        'WAR (1775-1781):',
        '  LEXINGTON & CONCORD (April 1775) — first shots; "the shot heard \'round the world."',
        '  DECLARATION OF INDEPENDENCE (July 4, 1776) — written mostly by Thomas Jefferson; declared the 13 colonies independent.',
        '  Long, hard war. Continental Army led by GEORGE WASHINGTON. France joined the colonies\' side.',
        '  YORKTOWN (1781) — British surrender after Washington and French forces trapped them.',
        'OUTCOME: TREATY OF PARIS (1783) ended the war. Britain recognized US independence and ceded land east of the Mississippi.',
        'KEY FIGURES:',
        '  GEORGE WASHINGTON — commander, later 1st President.',
        '  JOHN ADAMS — diplomat, later 2nd President.',
        '  THOMAS JEFFERSON — drafted the Declaration, later 3rd President.',
        '  BENJAMIN FRANKLIN — diplomat in France, helped get French support.',
        '  KING GEORGE III — British monarch.',
      ],
      vocabulary: [
        { term: 'taxation without representation', definition: 'being taxed by a government you have no voting voice in.' },
        { term: 'Declaration of Independence', definition: 'the 1776 document declaring the colonies free from Britain.' },
        { term: 'Treaty of Paris (1783)', definition: 'the treaty that ended the war and recognized US independence.' },
      ],
      suggestedTools: ['show_timeline', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causes',
      kind: 'worked_example',
      problem: 'List three direct causes of the Revolution and explain what they had in common.',
      steps: [
        '1) Stamp Act / Townshend Acts / Tea Act — Britain taxing the colonies to pay for war debt.',
        '2) Lack of colonial representation in Parliament.',
        '3) Boston Massacre and Intolerable Acts — British soldiers and laws cracking down on protest.',
        'COMMON THREAD: colonists felt Britain was treating them as subjects to be taxed and controlled, not as English citizens with rights. Each event eroded colonial loyalty.',
      ],
      answer: 'Taxes, no representation, military/legal crackdown',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'When was the Declaration of Independence signed?',
      expectedAnswer: 'July 4, 1776',
      responseFormat: 'free',
      hints: [
        'Same date the US celebrates as Independence Day.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'misconception-1776-end',
      kind: 'misconception_check',
      question: 'Aiden thinks the Revolution ENDED in 1776 with the Declaration of Independence. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing declaring independence with winning it.',
          correctsTo: 'Wrong. 1776 was when the colonies DECLARED themselves independent — but Britain didn\'t recognize that. The war continued for FIVE more years until Yorktown (1781), and Britain officially recognized US independence with the Treaty of Paris in 1783. Declaring something doesn\'t make it true on the ground.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: taxes without representation, British crackdowns.',
        'Key events: Boston Tea Party (1773) → Lex/Concord (1775) → Declaration (1776) → Yorktown (1781) → Treaty of Paris (1783).',
        'Key figures: Washington (army), Jefferson (writer), Adams + Franklin (diplomats).',
        'Declaring independence ≠ winning it. Took until 1783.',
        'France\'s help was decisive at Yorktown.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was France willing to help the American colonies — even though France was a monarchy and the colonies were rebelling against a king?',
      hint: 'France had lost the French and Indian War to Britain. Helping the Americans was payback against their old rival, not love of democracy.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
