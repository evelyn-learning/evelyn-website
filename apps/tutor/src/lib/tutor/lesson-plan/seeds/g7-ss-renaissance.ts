/**
 * G7 — Social Studies: Renaissance and Reformation.
 *
 * The "rebirth" of classical learning that began in 14th-century
 * Italy and spread across Europe by 1600. Humanism, art, scientific
 * revolution beginnings, the printing press, Protestant Reformation.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_RENAISSANCE: LessonPlan = {
  id: 'evelyn.g7.ss.renaissance.v1',
  title: 'Renaissance and Reformation',
  curriculum: 'state-standards',
  grade: '7',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g7.world.renaissance',
      description: 'Describe the Renaissance, its origins, and the Reformation\'s impact on Europe.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor on iconic Renaissance images.',
      script: 'You\'ve seen the Mona Lisa. The Sistine Chapel ceiling. Statues like David. They\'re all from the same period — the RENAISSANCE, the "rebirth" of classical learning that swept Europe between roughly 1300 and 1600. But it wasn\'t just art. The Renaissance also gave us the printing press, the Protestant Reformation, and the foundations of modern science.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-renaissance',
      kind: 'concept',
      goal: 'Origins, humanism, art, printing press, Reformation.',
      keyIdeas: [
        'RENAISSANCE = "rebirth" (French). Started in Italian city-states (Florence, Venice, Rome) around 1300; spread north by 1500s.',
        'Why Italy first? Wealthy trading cities + ruins of ancient Rome literally underfoot + patrons (the MEDICI family in Florence) funding artists and scholars.',
        'HUMANISM: a worldview that emphasized HUMAN potential and the study of classical (Greek/Roman) texts. Less focus on the afterlife, more on this life.',
        'ART transformed: realistic anatomy, perspective (depth on a flat surface), oil paint, individual portraits.',
        '  KEY ARTISTS: LEONARDO da Vinci (Mona Lisa, Last Supper), MICHELANGELO (David, Sistine Chapel), RAPHAEL (School of Athens).',
        'PRINTING PRESS: Johannes GUTENBERG (~1440) developed movable-type printing in Germany. Books became cheap and reproducible for the first time. Literacy spread; ideas traveled fast.',
        'SCIENTIFIC REVOLUTION beginnings: COPERNICUS proposed a SUN-CENTERED universe (heliocentrism) ~1543. GALILEO supported it later. Conflict with the Church followed.',
        'PROTESTANT REFORMATION (1517+): MARTIN LUTHER posted his 95 THESES challenging Catholic Church practices (especially the sale of INDULGENCES). He was excommunicated; movement spread.',
        '  Result: Christianity SPLIT in Western Europe. Catholic vs Protestant (Lutheran, Calvinist, Anglican).',
        '  Triggered religious wars (e.g. Thirty Years\' War 1618-1648).',
        '  Long-term: weakened single-Church authority; encouraged individual reading of scripture (made possible by printing press).',
      ],
      vocabulary: [
        { term: 'Renaissance', definition: '"rebirth" — the cultural revival of classical learning ~1300-1600.' },
        { term: 'humanism', definition: 'a focus on human potential and classical (Greek/Roman) study.' },
        { term: 'patron', definition: 'a wealthy person who funds artists or scholars.' },
        { term: 'Reformation', definition: 'the 16th-century religious movement that split Christianity into Catholic and Protestant.' },
        { term: 'indulgence', definition: 'a Church-sold pardon for sins — Luther\'s main complaint.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-printing-press',
      kind: 'worked_example',
      problem: 'Why was the printing press one of the most consequential inventions in human history?',
      steps: [
        'BEFORE: books were copied by hand. Each took months. Few existed.',
        'AFTER: thousands of identical copies could be made cheaply.',
        'CONSEQUENCES:',
        '  1) Literacy spread across Europe, especially among middle classes.',
        '  2) Religious texts (esp. the Bible) became accessible to ordinary people in their own languages.',
        '  3) Reformation: Luther\'s 95 Theses spread Europe-wide in WEEKS thanks to printing — would have been impossible by hand.',
        '  4) Scientific knowledge could be shared and built on across borders.',
        '  5) National languages stabilized as standardized printed forms emerged.',
      ],
      answer: 'See above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does HUMANISM mean, and how was it different from medieval thinking?',
      expectedAnswer: 'Humanism focused on human potential and classical study. Medieval thinking focused mostly on the Church, the afterlife, and divine authority.',
      responseFormat: 'free',
      hints: [
        'Hint: think about the SHIFT in focus.',
        'From "next world" to "this world" + classical revival.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dark-after',
      kind: 'misconception_check',
      question: 'Mira says "before the Renaissance, no one read books or did art in Europe." What\'s incorrect?',
      commonErrors: [
        {
          answer: 'true — they were busy farming',
          misconception: 'Treating the Middle Ages as cultural emptiness.',
          correctsTo: 'Wrong. Medieval monasteries copied books for centuries, illuminated manuscripts were intricate art, and Gothic cathedrals are engineering marvels. The Renaissance wasn\'t learning from nothing — it BUILT ON medieval scholarship and added classical recovery + new techniques (perspective, oil paint, printing).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Renaissance: ~1300-1600, started in Italy, spread north.',
        'Humanism: focus on human potential and classical learning.',
        'Art: perspective, anatomy, oil paint. Da Vinci, Michelangelo, Raphael.',
        'Printing press (Gutenberg ~1440) → mass-produced books → spread ideas fast.',
        'Reformation (Luther 1517) → split Christianity into Catholic + Protestant.',
        'Scientific Revolution beginnings: Copernicus, Galileo.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How were the Renaissance and the Protestant Reformation related?',
      hint: 'Both reflected questioning of authority. Renaissance humanism encouraged reading classical and biblical texts in original languages → people read the Bible directly and challenged Church teachings. Printing press made it possible to spread reform ideas widely. Without one, the other might not have happened.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
