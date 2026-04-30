/**
 * AP World History — World War I causes (deep).
 *
 * MAIN: Militarism, Alliances, Imperialism, Nationalism. Plus the
 * spark — assassination of Franz Ferdinand. Why so many died.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_WWI_CAUSES: LessonPlan = {
  id: 'evelyn.ap.world.wwi-causes.v1',
  title: 'Causes of World War I',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.wwi-causes',
      description: 'Analyze the long-term and short-term causes of World War I.',
      standard: 'AP-WORLD-7.1',
    },
  ],
  prerequisites: ['apworld.imperialism'],
  followUps: ['apworld.interwar-period'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose the puzzle: why did one assassination cause a global war?',
      script: 'June 28, 1914: a Serbian nationalist shot Archduke Franz Ferdinand of Austria. Six weeks later, ALL of Europe was at war. Eventually 16 million dead. How does ONE assassination kill millions? The world was already a powder keg. The bullet was just the spark.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-main',
      kind: 'concept',
      goal: 'MAIN causes + the spark + how the war went global.',
      keyIdeas: [
        'MILITARISM: arms race for decades. Britain and Germany built dreadnought battleships. Mass conscription. Generals planned WAR as the natural extension of policy. Glorification of military.',
        'ALLIANCES: web of secret treaties. Triple Entente (France, Russia, Britain) vs Triple Alliance (Germany, Austria-Hungary, Italy). Designed to deter, but ensured a SMALL conflict became a BIG one through chain-reaction obligations.',
        'IMPERIALISM: rival European powers competed for colonies. Crises over Morocco (1905, 1911) and Balkans repeatedly tested alliance systems.',
        'NATIONALISM: ethnic groups within multi-ethnic empires (Austria-Hungary, Ottoman) wanted independence. Slavic nationalism in Balkans was particularly volatile. Germany and Italy had recently unified through nationalist wars.',
        'THE SPARK: Franz Ferdinand assassinated by Gavrilo Princip in Sarajevo, June 28, 1914. Austria-Hungary blamed Serbia, issued ultimatum, declared war.',
        'CHAIN REACTION: Russia mobilized (defended Slavic Serbia). Germany declared war on Russia and France. Germany invaded neutral Belgium → Britain declared war on Germany. Within weeks, all major European powers were fighting.',
        'WHY SO DEADLY: machine guns, artillery, poison gas met 19th-century tactics. Trench warfare for years on the Western Front. Industrial-scale slaughter — Battle of the Somme killed ~1 million.',
      ],
      vocabulary: [
        { term: 'militarism', definition: 'belief in maintaining a strong military and using it aggressively.' },
        { term: 'alliance system', definition: 'mutual defense treaties between nations.' },
        { term: 'mobilization', definition: 'preparing armed forces for war.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-chain',
      kind: 'worked_example',
      problem: 'Show how the assassination of one Archduke triggered a world war via the alliance system.',
      steps: [
        'June 28: Franz Ferdinand assassinated by Bosnian Serb in Sarajevo.',
        'July 23: Austria-Hungary issues harsh ultimatum to Serbia.',
        'July 28: Austria-Hungary declares war on Serbia.',
        'July 30-Aug 1: Russia mobilizes (alliance with Serbia, fellow Slavs). Germany declares war on Russia.',
        'Aug 3: Germany declares war on France (Russia\'s ally). Invades Belgium (neutral) to flank France via Schlieffen Plan.',
        'Aug 4: Britain declares war on Germany (treaty obligation to Belgium + alliance with France).',
        'Within ONE WEEK, the local Serbia-Austria conflict became a continental war.',
        'Each step locked in by treaty obligations and military timetables — once mobilization started, leaders felt unable to stop.',
      ],
      answer: 'alliance system + mobilization timetables turned local conflict into world war within a week',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name the FOUR MAIN causes of WWI (the M.A.I.N. acronym).',
      expectedAnswer: 'Militarism, Alliances, Imperialism, Nationalism',
      responseFormat: 'free',
      hints: [
        'Acronym M-A-I-N.',
        'Each represents a long-term factor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-archduke-only',
      kind: 'misconception_check',
      question: 'Did the assassination of Franz Ferdinand CAUSE WWI?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the spark as the cause.',
          correctsTo: 'No — it was the TRIGGER, not the cause. The MAIN factors (militarism, alliances, imperialism, nationalism) had built up tensions for decades. Without those, the assassination would have been a regional crisis, not a world war. The structures were ready; the spark was just timing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'M.A.I.N. causes: Militarism, Alliances, Imperialism, Nationalism.',
        'Triple Entente vs Triple Alliance set the alignment.',
        'Franz Ferdinand assassinated June 28, 1914 — the spark.',
        'Alliance chain reaction made local conflict global within a week.',
        'Industrial weapons + 19th-century tactics = mass casualties.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why didn\'t WWI end "the war to end all wars" as it was hoped?',
      hint: 'Treaty of Versailles (1919) blamed Germany alone, imposed huge reparations and territory loss. Created resentment. German economic collapse + humiliation set conditions for Hitler\'s rise. WWI directly enabled WWII just 20 years later.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
