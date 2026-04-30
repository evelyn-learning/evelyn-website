/**
 * G7 SS — Renaissance and Reformation (deep).
 *
 * Italian Renaissance + Northern Renaissance + Reformation
 * (Luther, Calvin, Henry VIII).
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_RENAISSANCE_REFORMATION: LessonPlan = {
  id: 'evelyn.g7.ss.world-history.renaissance-reformation.v1',
  title: 'Renaissance and Reformation',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.renaissance-reformation',
      description: 'Analyze causes and consequences of the Renaissance and Protestant Reformation.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.middle-ages'],
  followUps: ['ncss.68.history.age-of-exploration'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two revolutions: minds and souls.',
      script: 'Two huge shifts hit Europe between 1300 and 1600. RENAISSANCE: people rediscovered Greek and Roman ideas, sparking art and science. REFORMATION: people split from the Catholic Church, splintering Western Christianity. Both reshaped the world we live in.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Renaissance origins + key figures + Reformation + impact.',
      keyIdeas: [
        'RENAISSANCE ("rebirth"): rediscovery of CLASSICAL learning. Started ~1300s in Italian city-states (Florence, Venice). Funded by wealthy MERCHANTS and the Catholic Church.',
        'HUMANISM: focus on human potential, individual achievement. Studied Greek and Latin texts.',
        'ART: realistic perspective, human figures, secular subjects alongside religious. LEONARDO DA VINCI (Mona Lisa, Vitruvian Man), MICHELANGELO (David, Sistine Chapel), RAPHAEL.',
        'SCIENCE: GALILEO observed moons of Jupiter; supported Copernicus\' SUN-CENTERED model. Risked heresy charges.',
        'NORTHERN RENAISSANCE: spread to Northern Europe ~1500. Erasmus, Dürer. More religious, more critical of Church.',
        'PRINTING PRESS (Gutenberg, ~1440): movable type. Books cheap and plentiful. Enabled rapid spread of ideas — including reformist critiques.',
        'REFORMATION (1517 onward): MARTIN LUTHER, German monk. Posted 95 THESES on Wittenberg church door — criticizing Church abuses, especially INDULGENCES (paying for forgiveness of sin).',
        'CORE LUTHERAN IDEAS: salvation by FAITH ALONE (not works/payments), Bible as sole authority, priesthood of all believers (no Church intermediary needed).',
        'JOHN CALVIN: stricter; PREDESTINATION. Geneva became Calvinist center.',
        'HENRY VIII: split England from Rome (1534) — initially over divorce, established Church of England (Anglican).',
        'RESULT: PROTESTANT churches multiplied. Catholic COUNTER-REFORMATION (Council of Trent, Jesuits) tightened doctrine.',
        'WARS OF RELIGION (~1550-1648): tens of millions died. Ended with PEACE OF WESTPHALIA (1648) — modern STATE SOVEREIGNTY system.',
      ],
      vocabulary: [
        { term: 'humanism', definition: 'Renaissance philosophy emphasizing human potential and classical learning.' },
        { term: 'indulgence', definition: 'a Catholic Church grant reducing punishment for sin, often sold for money.' },
        { term: 'Counter-Reformation', definition: 'Catholic response to Protestant Reformation through reform, education, and missionary work.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-printing',
      kind: 'worked_example',
      problem: 'How did the printing press make the Reformation possible?',
      steps: [
        'Before printing: books copied by hand. EXPENSIVE. Few people had access.',
        'Gutenberg\'s printing press (~1440) made books CHEAP and ABUNDANT.',
        'Luther\'s 95 Theses (1517): printed and distributed across Germany within weeks. Without the press, would have stayed local.',
        'Bibles in VERNACULAR languages (German, English, etc.) put scripture in ordinary hands. People could read for themselves.',
        'Pamphlets and broadsheets carried Reformation arguments to thousands.',
        'COMPARISON: Wycliffe and Hus had reformer-style ideas earlier (1300s) — but without printing, they remained limited.',
      ],
      answer: 'cheap mass production of Reformation pamphlets, vernacular Bibles, and political tracts',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How is the Peace of Westphalia (1648) considered the start of the modern state system?',
      expectedAnswer: 'established sovereignty — each state has authority within its borders, no external interference; ended religious wars',
      responseFormat: 'free',
      hints: [
        'Treaty ended Thirty Years\' War.',
        'Established that rulers determine their state\'s religion.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-renaissance-secular',
      kind: 'misconception_check',
      question: 'Did the Renaissance reject religion?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Renaissance as anti-religious.',
          correctsTo: 'No — Renaissance art was DEEPLY religious (most paintings depicted Bible scenes). The Church was the largest patron of Renaissance art. Renaissance ADDED secular themes alongside religious ones; it didn\'t replace them. The Church and humanism coexisted, sometimes uneasily.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Renaissance: rebirth of classical learning, ~1300-1600.',
        'Humanism + art (Leonardo, Michelangelo) + science (Galileo).',
        'Printing press enabled mass spread of ideas.',
        'Reformation (1517+): Luther → Calvin → Henry VIII split from Rome.',
        'Wars of Religion ended at Peace of Westphalia (1648), establishing state sovereignty.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does today\'s digital media compare to the printing press in spreading ideas and challenging institutions?',
      hint: 'Both democratize information. Printing press: enabled Reformation, Enlightenment, scientific revolution. Internet: enables movements, exposes corruption, also misinformation. Each major communication shift comes with both democratizing benefits and chaotic costs.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
