/**
 * Grades 11-12 Social Studies — European History Period Survey.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_EUROPEAN_HISTORY_SURVEY: LessonPlan = {
  id: 'evelyn.g1112.ss.european-history.survey.v1',
  title: 'European History — Renaissance to 20th Century Survey',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'european-history',
  locale: 'en',
  los: [
    {
      id: 'g1112.ss.european-history.survey',
      description: 'Map major periods and themes of European history from the Renaissance through the 20th century, with focus on causation and continuity.',
      standard: 'NCSS-2-Time-Continuity-Change',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Five centuries of European history form the backbone of modern world history.',
      script: 'The Renaissance, Reformation, Enlightenment, French Revolution, Industrial Revolution, two world wars — European events repeatedly shaped global outcomes. Today: the major periods, what drove change, and the recurring themes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-euro-history',
      kind: 'concept',
      goal: 'Major periods + themes from 1400-2000.',
      keyIdeas: [
        'RENAISSANCE (~1400-1600): rebirth of classical learning, art, humanism. Italy first, then northern Europe. Printing press accelerates idea diffusion.',
        'REFORMATION (1517+): Luther challenges Catholic Church. Wars of Religion. Westphalia (1648) ends Thirty Years\' War, establishes modern state system.',
        'AGE OF EXPLORATION (1500s-1600s): Spain, Portugal, England, France, Netherlands establish overseas empires. Triangular trade. Columbian exchange.',
        'SCIENTIFIC REVOLUTION (1500s-1700s): Copernicus, Galileo, Newton. Empirical method, mathematical laws of nature.',
        'ENLIGHTENMENT (1700s): reason, individual rights, social contract (Locke, Rousseau). Inspires American + French revolutions.',
        'FRENCH REVOLUTION (1789-1799): overthrow of monarchy, Reign of Terror, rise of Napoleon. Spreads revolutionary ideals + provokes reaction.',
        'INDUSTRIAL REVOLUTION (1760+): factory system, steam power, urbanisation. Britain leads. Working class, capitalist class. Marx + Engels respond.',
        'NEW IMPERIALISM (1870-1914): European powers carve up Africa and Asia.',
        'WORLD WAR I (1914-1918): nationalism + alliance system + arms race + crisis. ~17M deaths. Versailles\'s harsh terms set up future grievances.',
        'INTERWAR (1918-1939): Weimar Germany, Great Depression, fascism. Stalin\'s USSR. Appeasement.',
        'WORLD WAR II (1939-1945): Hitler, Holocaust, atomic bomb. ~70M deaths.',
        'COLD WAR (1947-1991): US vs USSR. Marshall Plan, Berlin Wall, Cuban Missile Crisis. Ends with Soviet collapse.',
        'POST-1945 INTEGRATION: ECSC → EEC → EU. Reduce nationalism\'s capacity for war via economic interdependence.',
        'RECURRING THEMES: religion vs state, monarchy vs democracy, traditional vs progressive, nation vs empire, capitalism vs socialism.',
      ],
      vocabulary: [
        { term: 'Treaty of Westphalia (1648)', definition: 'ended Thirty Years\' War; established modern state sovereignty.' },
        { term: 'social contract', definition: 'Enlightenment idea that government legitimacy derives from consent of the governed.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'How did the Industrial Revolution contribute to the rise of socialism in Europe?',
      steps: [
        'Industrial Revolution created industrial workers (proletariat) — long hours, low wages, dangerous conditions.',
        'Wealth concentrated in factory owners (bourgeoisie) — visible inequality.',
        'Marx + Engels (Communist Manifesto, 1848) frame this as class struggle.',
        'Workers organise: unions, socialist parties (German SPD founded 1875).',
        'Strikes, labour reforms, eventually social democracy or revolution (Russia 1917).',
        'Causal chain: industrial labour conditions → class consciousness → socialist movements.',
      ],
      answer: 'Industrial labour conditions + concentrated wealth created class consciousness; socialism organised workers in response.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name two long-term consequences of WWI that contributed to WWII.',
      expectedAnswer: '(1) HARSH TREATY OF VERSAILLES — heavy reparations, war guilt clause, territorial losses. Created economic hardship + political resentment Hitler exploited. (2) WEAK LEAGUE OF NATIONS — couldn\'t enforce decisions, US absent. Enabled aggression by Japan (1931), Italy (1935), Germany (rearmament).',
      responseFormat: 'free',
      hints: ['What did Versailles do to Germany?', 'How effective was the League of Nations?'],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-causes-wwi',
      kind: 'misconception_check',
      question: 'A student says WWI was caused by the assassination of Archduke Franz Ferdinand. Why is this an oversimplification?',
      commonErrors: [
        {
          answer: 'Assassination caused WWI',
          misconception: 'Confusing immediate trigger with deeper causes.',
          correctsTo: 'The assassination (June 1914) was the SPARK, not the underlying cause. Deeper causes (the "MAIN" mnemonic): MILITARISM (arms races + war planning), ALLIANCES (Triple Entente vs Triple Alliance turned regional crisis into continental war), IMPERIALISM (colonial competition), NATIONALISM (ethnic flashpoints). Without these structural factors, the assassination would\'ve remained regional. Distinguish "trigger" from "cause" in essays.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Renaissance → Reformation → Scientific Revolution → Enlightenment → Revolutions.',
        'Industrial Revolution: factory system, urbanisation, new class structure.',
        'WWI: structural causes (MAIN) + immediate trigger.',
        'Versailles + League weakness → conditions for WWII.',
        'Trigger ≠ cause — distinguish in essay writing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
