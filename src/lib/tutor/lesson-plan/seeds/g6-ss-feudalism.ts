/**
 * G6/G7 — Feudalism in medieval Europe.
 *
 * Land-for-loyalty system. King → lords → knights → peasants/serfs.
 * Manor system. Why feudalism arose and how it ended.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SS_FEUDALISM: LessonPlan = {
  id: 'evelyn.g6.ss.world-history.feudalism.v1',
  title: 'Feudalism: medieval Europe\'s social pyramid',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.feudalism',
      description: 'Describe feudal society in medieval Europe and the relationships among its members.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.middle-ages'],
  followUps: ['ncss.68.history.renaissance'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame feudalism as a deal: protection in exchange for service.',
      script: 'After Rome fell, no one could protect ordinary people from invaders. So a deal was struck: a powerful lord gave LAND and PROTECTION; in exchange, others gave LOYALTY, SERVICE, and a share of crops. That deal, repeated thousands of times, was feudalism.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pyramid',
      kind: 'concept',
      goal: 'Three-tier hierarchy + manor system + decline.',
      keyIdeas: [
        'KING / MONARCH at the top. Owned all land in theory.',
        'NOBLES / LORDS / VASSALS: granted land (a FIEF) by the king in exchange for military service and loyalty.',
        'KNIGHTS: trained warriors. Served lords in exchange for land or income. Followed code of CHIVALRY (in theory — bravery, honor, protection of weak).',
        'PEASANTS / SERFS: vast majority. Worked the land. SERFS were tied to the land — couldn\'t leave without permission. Free peasants paid rent.',
        'MANOR SYSTEM: each lord\'s estate (manor) was a self-sufficient mini-economy. Field for crops, mill, blacksmith, church. Lord lived in fortified manor house or castle.',
        'CHURCH: powerful parallel hierarchy. Pope, archbishops, bishops, parish priests. Owned huge amounts of land. Provided literacy, hospitals, charity.',
        'DECLINE: 1) BLACK DEATH (1347-1351) killed ~1/3 of Europe → labor shortage → peasants demanded better terms. 2) CRUSADES exposed Europeans to trade and ideas. 3) Rise of TOWNS and merchants outside the feudal system. 4) Stronger MONARCHIES centralizing power. By ~1500, feudalism was fading.',
      ],
      vocabulary: [
        { term: 'feudalism', definition: 'medieval system of land-for-loyalty between lords and vassals.' },
        { term: 'serf', definition: 'a peasant tied to the land of a manor, unable to leave freely.' },
        { term: 'manor', definition: 'a lord\'s self-sufficient estate, the basic unit of feudal economy.' },
        { term: 'chivalry', definition: 'the code of conduct (honor, courage) for knights.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-deal',
      kind: 'worked_example',
      problem: 'A peasant family lives on a lord\'s manor. What does the lord OWE them, and what do they OWE the lord?',
      steps: [
        'Lord owes them: PROTECTION (from invaders, criminals). Use of land to grow food. Justice (settling disputes). Mill and church facilities.',
        'They owe the lord: WORK (on the lord\'s fields several days a week). A SHARE of their own harvest. Various FEES (using the mill, marrying outside the manor, inheriting land).',
        'If they\'re SERFS: they can\'t leave without the lord\'s permission. Tied to the land for life — and so were their children.',
        'It looks unfair to modern eyes — and was. But in a violent, lawless era, the protection was real.',
      ],
      answer: 'lord: protection + land to use; peasant: work + shares + fees; serfs are tied to the land',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the Black Death (1347-1351) help DESTROY feudalism?',
      expectedAnswer: 'killed so many peasants that surviving peasants could demand better terms or move to towns',
      responseFormat: 'free',
      hints: [
        'Feudalism depended on lots of peasants being available.',
        'When 1/3 died, what happened to the labor market?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-king-absolute',
      kind: 'misconception_check',
      question: 'Did medieval kings have absolute power?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing medieval kings with later absolute monarchs.',
          correctsTo: 'No — medieval kings had LIMITED power. They depended on nobles\' loyalty and military support. The Magna Carta (1215) forced the English king to acknowledge limits. Absolute monarchies (Louis XIV) came LATER, after feudalism had weakened.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Feudalism = land in exchange for loyalty and service.',
        'Pyramid: king → lords → knights → peasants/serfs.',
        'Manor system: self-sufficient lord\'s estate.',
        'Decline driven by: Black Death, growing towns, stronger monarchies.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Were similar feudal systems found OUTSIDE of Europe?',
      hint: 'Yes — Japan had a strikingly similar system (samurai, daimyo, peasants). China and India had hierarchical land systems but with stronger imperial control. The conditions that produce feudalism — weak central power + rural economy + need for protection — recur in history.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
