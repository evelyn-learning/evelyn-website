/**
 * Grades 6-8 Social Studies — Imperialism & WWI.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_IMPERIALISM_WWI: LessonPlan = {
  id: 'evelyn.g68.ss.imperialism-wwi.v1',
  title: 'Grades 6-8 SS — Imperialism & WWI',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.imperialism-wwi',
      description: 'Identify causes and consequences of European imperialism; explain how it contributed to WWI.',
      standard: 'NCSS 6-8 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g68.ss.industrial-revolution'],
  followUps: ['g68.ss.depression-wwii'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Imperialism set up rivalries between European powers — and one assassination ignited the worst war the world had ever seen.',
      script: 'In 1914, an archduke was shot in Sarajevo. By month\'s end, Europe was at war. By 1918, 17+ million were dead. How does ONE assassination cause a WORLD WAR? The answer goes back to imperialism, alliances, nationalism, and militarism.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperialism-wwi',
      kind: 'concept',
      goal: 'Imperialism + WWI causes (MAIN) + key events + consequences.',
      keyIdeas: [
        'IMPERIALISM (~1870-1914): European powers seized colonies in Africa, Asia, Pacific. By 1914, Britain ruled 1/4 of Earth\'s land.',
        'MOTIVES: raw materials for industry, markets for goods, military bases, "civilising mission" (now seen as paternalistic and racist).',
        'IMPACT on COLONISED PEOPLES: cultures disrupted, resources extracted, traditional governance overthrown. Resistance movements emerged.',
        'WWI CAUSES — MAIN:',
        '  Militarism: arms race, especially Britain vs Germany navy.',
        '  Alliances: complex web (Triple Alliance: Germany, Austria-Hungary, Italy. Triple Entente: France, Russia, Britain).',
        '  Imperialism: rivalry over colonies and global power.',
        '  Nationalism: pride in nation, distrust of others; nationalist movements in Balkans (Serbs, Croats).',
        'TRIGGER: June 28, 1914 — Archduke Franz Ferdinand of Austria-Hungary assassinated in Sarajevo by Gavrilo Princip (Serbian nationalist).',
        'WAR ESCALATION: Austria-Hungary declared war on Serbia. Russia mobilised. Germany declared war on Russia, then France. Britain joined when Germany invaded Belgium.',
        'WESTERN FRONT: trench warfare, brutal stalemate, new technology (machine guns, poison gas, tanks, aircraft).',
        'US ENTRY (April 1917): German submarine attacks (Lusitania, 1915) and the Zimmermann Telegram pushed US in.',
        'END: November 11, 1918 — Armistice. Germany defeated.',
        'TREATY OF VERSAILLES (1919): harsh terms on Germany — territorial losses, reparations, war guilt clause. Sowed seeds of WWII.',
        'CASUALTIES: 17 million dead, 20 million wounded. Empires fell (Russian, Ottoman, Austro-Hungarian, German). League of Nations founded (failed without US).',
      ],
      vocabulary: [
        { term: 'imperialism', definition: 'a policy of extending a country\'s power by colonising, conquering, or dominating other nations.' },
        { term: 'militarism', definition: 'building up strong military forces in preparation for war.' },
        { term: 'alliance', definition: 'an agreement to support another country, often in war.' },
        { term: 'armistice', definition: 'a formal agreement to stop fighting.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-causes',
      kind: 'worked_example',
      problem: 'Apply MAIN to explain how WWI started.',
      steps: [
        'M — Militarism: European armies grew rapidly; Germany\'s navy challenged Britain\'s.',
        'A — Alliances: when Austria-Hungary attacked Serbia, alliances pulled the rest of Europe in (Russia → France → Britain).',
        'I — Imperialism: rivalries over colonies created tensions (Germany vs Britain/France over Africa).',
        'N — Nationalism: pride and ethnic tensions, especially in the Balkans, where Serbian nationalism led to the assassination.',
        'CONCLUSION: WWI wasn\'t caused by ONE thing. The assassination was the spark; MAIN forces had built the bonfire.',
      ],
      answer: 'MAIN explains the deeper causes; assassination was the trigger.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the US join WWI?',
      expectedAnswer: 'Two main reasons: (1) German U-boats sank ships, including the Lusitania (1915) which killed Americans; (2) the Zimmermann Telegram (1917) revealed Germany asking Mexico to invade the US. Combined with sympathy for the Allies, these pushed US public opinion to enter war in April 1917.',
      responseFormat: 'free',
      hints: [
        'Hint: think of submarine attacks AND a secret telegram.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-blame',
      kind: 'misconception_check',
      question: 'A student says "Germany caused WWI." Why is this oversimplified?',
      commonErrors: [
        {
          answer: 'Germany alone caused WWI',
          misconception: 'Reducing complex causes to a single nation\'s fault.',
          correctsTo: 'WWI had MULTIPLE causes shared by many countries: imperial rivalries (all major powers), alliance commitments (all sides), nationalism (especially in the Balkans), arms races (general). The Treaty of Versailles\' "war guilt clause" placed blame on Germany, fueling resentment that contributed to WWII. Modern historians see WWI as a product of Europe\'s entire pre-1914 system — not a single villain.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Imperialism: Europe colonised Africa, Asia, Pacific.',
        'WWI causes: MAIN (Militarism, Alliances, Imperialism, Nationalism).',
        'Trigger: Franz Ferdinand assassinated 1914.',
        'Trench warfare, new tech (gas, tanks).',
        'US entered 1917; war ended Nov 11, 1918.',
        'Treaty of Versailles harsh on Germany → WWII seeds.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did imperialism in Africa CONTRIBUTE to WWI?',
      hint: 'European powers competed for African colonies — Germany wanted "a place in the sun" but had arrived late. Tensions over Morocco (twice) brought Europe to the brink before 1914. The Berlin Conference (1884-85) carved up Africa among Europeans, creating rivalries that persisted into WWI. Colonies also became sites of fighting and supplied troops to the Allies and Central Powers. Imperialism was background tension; WWI brought it to the front.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
