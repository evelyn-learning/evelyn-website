/**
 * Grades 11-12 Social Studies — European History.
 *
 * Renaissance → Reformation → Enlightenment → French Revolution →
 * Industrial Rev → World Wars → EU.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_EUROPEAN_HISTORY: LessonPlan = {
  id: 'evelyn.ss.11-12.european-history.v1',
  title: 'European history — Renaissance to the EU',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'european-history',
  locale: 'en',
  los: [
    {
      id: 'hs.eur-hist',
      description: 'Trace key intellectual and political revolutions in European history from c.1450 to today.',
      standard: 'CCSS-RH.11-12',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Europe as the laboratory of modern political ideas.',
      script: 'Most political ideas you encounter today — democracy, rights, nationalism, capitalism, communism, the welfare state — were debated, tried, and refined in Europe over the last 500 years. European history isn\'t just Europe\'s story; it\'s the story of where the modern world\'s vocabulary comes from.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-eras',
      kind: 'concept',
      goal: 'Six revolutions that shaped Europe.',
      keyIdeas: [
        'RENAISSANCE (1400s-1500s): rediscovery of classical texts, humanism, art (da Vinci, Michelangelo), science emerging.',
        'REFORMATION (1517+): Luther, Calvin challenge Catholic Church. Catholic Counter-Reformation. Long wars of religion (Thirty Years War, 1618-48).',
        'ENLIGHTENMENT (1680s-1789): reason, individual rights, natural law (Locke, Rousseau, Voltaire). Foundations for both American and French revolutions.',
        'FRENCH REVOLUTION (1789): overthrow of monarchy, Declaration of the Rights of Man, Terror, Napoleon\'s rise + fall. Spread liberal/national ideas across Europe.',
        'INDUSTRIAL REVOLUTION (1760-1870): steam, factories, railroads. Created urban working class; transformed economies; powered colonial expansion.',
        'WORLD WARS (1914-45): WWI ended empires (Austrian, Ottoman, Russian, German); Versailles\'s harsh peace fed WWII; Holocaust + nuclear age changed moral discourse.',
        'POSTWAR / EU (1945+): Marshall Plan, NATO, ECSC → EEC → EU. Cold War divided East/West. 1989-91 collapse of Soviet bloc → reunification.',
        'KEY THEME: each era reacts to the limits of the previous. Religious wars → secular Enlightenment → political revolutions → industrial labor question → ideological wars → integrative postwar order.',
      ],
      vocabulary: [
        { term: 'Reformation', definition: 'the 16th-century split of Western Christianity into Catholic and Protestant traditions.' },
        { term: 'Enlightenment', definition: 'the 18th-century intellectual movement emphasizing reason, individual rights, and natural law.' },
        { term: 'Treaty of Versailles', definition: 'the post-WWI treaty (1919) imposing reparations and territorial losses on Germany.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-revolutions',
      kind: 'worked_example',
      problem: 'Why did Enlightenment ideas fuel BOTH the American and French Revolutions, but produce different outcomes?',
      steps: [
        'Common cause: both revolutions were inspired by Locke, Rousseau, Montesquieu — natural rights, government by consent.',
        'Different starting conditions: America had practical experience with self-government (colonial assemblies, Mayflower Compact); France had absolute monarchy with no civic infrastructure.',
        'Different scope: American Revolution = political rebellion against a distant power. French Revolution = total social overhaul (clergy, nobility, monarchy all challenged).',
        'Outcomes: America stabilized into constitutional republic. France went through Terror, Napoleon, restoration, more revolutions. Took ~80 years to settle.',
        'LESSON: same ideas, different institutional context, different outcomes. Ideas don\'t implement themselves.',
      ],
      answer: 'Same ideas + different institutional readiness produced different transitions.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the Treaty of Versailles contribute to the rise of WWII?',
      expectedAnswer: 'harsh reparations + territorial losses + war-guilt clause humiliated Germany, fueled grievance and economic instability that Hitler exploited',
      responseFormat: 'free',
      hints: [
        'Specific clauses mattered: war guilt, reparations, demilitarization.',
        'Combined with the Great Depression, conditions were ripe for extremist politics.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-renaissance-rebirth',
      kind: 'misconception_check',
      question: 'A student says: "The Renaissance was the rebirth of learning after the Middle Ages, which were dark and ignorant." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because medieval was dark',
          misconception: 'Buying the Renaissance\'s own self-PR.',
          correctsTo: 'The "Dark Ages" framing was Renaissance writers branding what came before as inferior. Medieval Europe had universities (founded 1100s), Gothic architecture, scholastic philosophy (Aquinas), Arab-mediated transmission of Greek texts, and major scientific work (Bacon, Buridan). The Renaissance recovered SOME classical texts and shifted emphasis, but framing the Middle Ages as ignorant is propaganda, not history.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six revolutions: Renaissance, Reformation, Enlightenment, French Rev, Industrial, World Wars + EU.',
        'Each reacts to the limits of the previous.',
        'Ideas + institutional context together produce outcomes.',
        'Don\'t buy era branding (Dark Ages, Enlightenment\'s self-praise) uncritically.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
