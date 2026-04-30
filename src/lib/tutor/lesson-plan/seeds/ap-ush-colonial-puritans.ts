/**
 * AP US History — Colonial period: Puritans, Great Awakening,
 * regional colonial differences.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_COLONIAL_PURITANS: LessonPlan = {
  id: 'evelyn.ap.ush.colonial-puritans-awakening.v1',
  title: 'Colonial America: Puritans, Great Awakening, regional patterns',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.colonial-period',
      description: 'Analyze religious, economic, and political developments in 17th and 18th-century colonial America.',
      standard: 'AP-USH-NAT-2',
    },
  ],
  prerequisites: [],
  followUps: ['apush.american-revolution'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Puritans as ideological visionaries with both gifts and shadows.',
      script: 'Imagine sailing 3000 miles to build a "city upon a hill" — a community so righteous it would be a beacon. That was the Puritan project. They created Harvard, town meetings, and intense communities. They also banned dissenters and hanged "witches".',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-period',
      kind: 'concept',
      goal: 'Three pillars: Puritan New England, regional differences, Great Awakening.',
      keyIdeas: [
        'PURITANS (1620s-): English Calvinists fleeing religious persecution. Settled MASSACHUSETTS. Believed in PREDESTINATION, hard work, education (founded Harvard 1636 to train ministers), strict morality.',
        'CITY UPON A HILL: Governor John Winthrop\'s 1630 sermon. Puritan colonies as a moral example for the world. Foundation of "American exceptionalism".',
        'NEW ENGLAND TOWN MEETINGS: democratic experiments. Property-owning men voted on local issues. Seeds of American self-government.',
        'PURITAN INTOLERANCE: dissenters banished — Roger Williams (founded Rhode Island), Anne Hutchinson. Salem Witch Trials (1692): mass hysteria, 19 hanged.',
        'REGIONAL DIFFERENCES: New England (small farms, religion, commerce). Middle Colonies (diverse, "breadbasket"). Southern (plantations, enslaved labor, Anglican).',
        'GREAT AWAKENING (1730s-40s): religious revival. Preachers (Jonathan Edwards "Sinners in the Hands of an Angry God", George Whitefield) emphasized PERSONAL emotional faith over institutional church. Promoted EQUALITY before God — undermining hierarchy.',
        'IMPACT: Great Awakening contributed to colonial unity (intercolonial preaching tours), and the idea that ordinary people could question authority — both political and religious — feeding the Revolution.',
      ],
      vocabulary: [
        { term: 'Puritan', definition: 'an English Calvinist who sought to "purify" the Church of England.' },
        { term: 'predestination', definition: 'the Calvinist belief that God has already determined who is saved.' },
        { term: 'Great Awakening', definition: 'a religious revival emphasizing personal emotional faith.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-awakening',
      kind: 'worked_example',
      problem: 'How did the Great Awakening contribute to the American Revolution decades later?',
      steps: [
        'EQUAL BEFORE GOD: revival preachers said anyone could find salvation directly. No need for elite priests.',
        'CHALLENGED HIERARCHY: if you can question religious authorities, you can question political ones.',
        'FIRST TRULY INTERCOLONIAL EVENT: Whitefield\'s preaching tours connected colonies. People started thinking of themselves as "Americans" rather than just Virginians or Bostonians.',
        'EMPHASIS ON CONSCIENCE: "the right to choose your own beliefs" foreshadowed political self-determination.',
        'Many Patriots cited Great Awakening ideals when framing Declaration of Independence ("all men are created equal").',
      ],
      answer: 'fostered idea of equality before God, individual conscience, and intercolonial identity — feeding revolutionary thinking',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did Roger Williams get banished from Massachusetts? What did he found?',
      expectedAnswer: 'argued for separation of church and state and religious tolerance; founded Rhode Island',
      responseFormat: 'free',
      hints: [
        'He had ideas the Puritans considered radical.',
        'Religious freedom + fair treatment of Native Americans was his platform.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-religious-freedom',
      kind: 'misconception_check',
      question: 'Did the Pilgrims and Puritans come to America for religious freedom for ALL?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Romanticizing Puritan tolerance.',
          correctsTo: 'No — they came for THEIR OWN religious freedom. They didn\'t extend it to others — they banished dissenters, persecuted Quakers (some hanged), and executed "witches". Religious tolerance for all came LATER, after suffering and political evolution.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Puritans: Calvinist English settlers in New England, founded Harvard, believed in predestination + strict morality.',
        '"City upon a hill" = beacon of righteousness; foundation of American exceptionalism.',
        'Town meetings = early democracy; banishments and Salem trials show intolerance.',
        'Three regions: New England (commerce + religion), Middle (diverse + grain), Southern (plantations + slavery).',
        'Great Awakening (1730s-40s): personal faith, equality before God, intercolonial unity, fed Revolution.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does the Puritan "city upon a hill" idea echo in modern American foreign policy?',
      hint: 'Used by JFK, Reagan, Obama — framing America as a moral example to the world. The phrase has migrated from theological context to political rhetoric over 400 years. Both inspiring and used to justify intervention.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
