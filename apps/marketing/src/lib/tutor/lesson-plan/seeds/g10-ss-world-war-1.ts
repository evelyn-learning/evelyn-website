/**
 * G10 — Social Studies: World War I (1914-1918).
 *
 * Causes: MAIN (Militarism, Alliances, Imperialism, Nationalism)
 * + the spark of Archduke Franz Ferdinand's assassination. Trench
 * warfare, new technologies, US entry, Treaty of Versailles and
 * its problems, the redrawn map of Europe.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_SS_WORLD_WAR_1: LessonPlan = {
  id: 'evelyn.g10.ss.world-war-1.v1',
  title: 'World War I',
  curriculum: 'state-standards',
  grade: '10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g10.world.wwi',
      description: 'Explain causes, major events, and consequences of World War I.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame WWI as the war that shaped the rest of the 20th century.',
      script: 'Almost everything that defined the 20th century — the rise of the US as a superpower, the fall of European empires, the Russian Revolution, the conditions for WWII, the modern Middle East — traces to WWI. About 17 million people died. The world map and the world\'s power structure both changed permanently.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-wwi',
      kind: 'concept',
      goal: 'MAIN causes + spark + course + Treaty of Versailles + lasting effects.',
      keyIdeas: [
        'CAUSES — the MAIN acronym:',
        '  M — MILITARISM: European powers had been arming up for years, glorifying military strength.',
        '  A — ALLIANCES: Europe was split into two camps — Triple Entente (France, Russia, Britain) vs Triple Alliance (Germany, Austria-Hungary, Italy). A small conflict could pull everyone in.',
        '  I — IMPERIALISM: competition for colonies created tensions.',
        '  N — NATIONALISM: pride in one\'s nation; aggressive in some places, separatist in others (Slavic peoples in the Balkans).',
        'SPARK: June 28, 1914 — Archduke FRANZ FERDINAND of Austria-Hungary assassinated in Sarajevo by a Serbian nationalist. Austria-Hungary declared war on Serbia → alliance system pulled everyone in within weeks.',
        'CENTRAL POWERS: Germany, Austria-Hungary, Ottoman Empire, Bulgaria.',
        'ALLIED POWERS: France, Britain, Russia (until 1917), Italy (switched sides 1915), USA (joined 1917).',
        'WESTERN FRONT: TRENCH WARFARE — soldiers dug into long trenches across France/Belgium. Years of brutal stalemate.',
        'NEW TECHNOLOGIES made the war especially deadly:',
        '  Machine guns, poison gas, tanks, airplanes, submarines (U-boats).',
        '  Old tactics + new weapons = catastrophic casualties.',
        'KEY EVENTS:',
        '  Battles of the Somme (1916), Verdun (1916) — each killed hundreds of thousands.',
        '  RUSSIAN REVOLUTION (1917): communists overthrew the Tsar; Russia exited the war.',
        '  US ENTRY (April 1917): triggered by Germany\'s unrestricted submarine warfare and the Zimmerman Telegram. Tipped the balance.',
        '  ARMISTICE on Nov 11, 1918 — Germany accepted defeat. (Now observed as Veterans Day / Remembrance Day.)',
        'TREATY OF VERSAILLES (1919):',
        '  Punished Germany severely: lost territory, military restrictions, "war guilt" clause, massive REPARATIONS.',
        '  Created LEAGUE OF NATIONS (US never joined — weakened it).',
        '  Many historians see Versailles\'s harsh treatment of Germany as a major cause of WWII (rise of Nazi resentment 20 years later).',
        'Empires that ENDED: German, Austro-Hungarian, Russian (Tsarist), Ottoman.',
      ],
      vocabulary: [
        { term: 'trench warfare', definition: 'fighting from long earthen trenches; dominated WWI Western Front.' },
        { term: 'Treaty of Versailles', definition: '1919 treaty that ended WWI; punished Germany harshly.' },
        { term: 'reparations', definition: 'payments demanded from Germany to compensate for war damages.' },
        { term: 'armistice', definition: 'an agreement to stop fighting; usually a step before a peace treaty.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline', 'show_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-main',
      kind: 'worked_example',
      problem: 'Explain how the alliance system turned a single assassination into a world war.',
      steps: [
        'June 28, 1914: Franz Ferdinand assassinated.',
        'Austria-Hungary blamed Serbia, declared war on Serbia.',
        'Russia (allied with Serbia) mobilized to defend it.',
        'Germany (allied with Austria-Hungary) declared war on Russia, then France (Russia\'s ally) just in case.',
        'Germany invaded Belgium to reach France quickly — that violated Belgian neutrality.',
        'Britain (committed to defend Belgium) declared war on Germany.',
        'Within ~6 weeks, every major European power was at war. The alliance "trip wires" all activated at once.',
      ],
      answer: 'Alliance system created cascading commitments',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the US enter WWI in 1917 after staying neutral for almost three years?',
      expectedAnswer: 'Germany\'s unrestricted submarine warfare (sinking US ships) + Zimmerman Telegram (Germany proposing alliance with Mexico against US).',
      responseFormat: 'free',
      hints: [
        'Two main triggers — both involving Germany.',
        'One concerned ships, one concerned a secret telegram.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-spark-cause',
      kind: 'misconception_check',
      question: 'Mateo says "WWI started because Franz Ferdinand was assassinated." Is that the cause?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the spark with the underlying causes.',
          correctsTo: 'The assassination was the SPARK, not the CAUSE. The MAIN factors (Militarism, Alliances, Imperialism, Nationalism) had been building for decades. Without that context, the assassination of one archduke would have been a localized crisis. With it, ANY spark could have started the fire.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: MAIN (Militarism, Alliances, Imperialism, Nationalism). Spark: Franz Ferdinand assassination.',
        'Two sides: Allies (UK, France, Russia, USA) vs Central Powers (Germany, Austria-Hungary, Ottoman, Bulgaria).',
        'Trench warfare + machine guns + gas → ~17 million deaths.',
        'US entered 1917; Russia exited 1917 (Russian Revolution).',
        'Armistice Nov 11, 1918.',
        'Treaty of Versailles harsh on Germany; foundations for WWII.',
        'Four empires fell: German, Austro-Hungarian, Russian, Ottoman.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did WWI redraw the map of the Middle East?',
      hint: 'After the Ottoman Empire collapsed, Britain and France divided the Arab provinces (Sykes-Picot Agreement). Modern borders of Iraq, Syria, Lebanon, Jordan, Israel/Palestine, Saudi Arabia all trace to post-WWI decisions.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
