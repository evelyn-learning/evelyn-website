/**
 * G10 — Social Studies: World War II (1939-1945).
 *
 * Causes (Versailles, Great Depression, rise of fascism), Hitler's
 * aggressions, war's main theaters, Holocaust, US entry after
 * Pearl Harbor, atomic bombs, end and consequences.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_SS_WORLD_WAR_2: LessonPlan = {
  id: 'evelyn.g10.ss.world-war-2.v1',
  title: 'World War II',
  curriculum: 'state-standards',
  grade: '10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g10.world.wwii',
      description: 'Explain causes, course, and consequences of World War II.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame WWII as the deadliest conflict in human history.',
      script: 'WWII killed an estimated 70-85 million people — about 3% of the world\'s population in 1940. Six million Jews and millions of others were murdered in the Holocaust. Two cities were destroyed by atomic bombs. The war ended European world dominance, made the US and USSR superpowers, and set up the Cold War. Almost every aspect of the modern world has WWII fingerprints.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-wwii',
      kind: 'concept',
      goal: 'Causes → European war → Pacific war → Holocaust → end + atomic bombs → aftermath.',
      keyIdeas: [
        'CAUSES:',
        '  TREATY OF VERSAILLES: harsh terms left Germany resentful and economically broken.',
        '  GREAT DEPRESSION (1929+): global economic collapse made extremist politics attractive.',
        '  RISE OF FASCISM: HITLER (Germany, 1933), MUSSOLINI (Italy), militarist government in Japan.',
        '  APPEASEMENT: Britain and France let Hitler annex Austria (1938) and Czechoslovakia (1938-39) hoping to avoid war. Didn\'t work.',
        '  Hitler\'s NAZI ideology: belief in "Aryan" racial superiority, expansion (Lebensraum), antisemitism.',
        'WAR BEGINS: September 1, 1939 — Germany invades Poland. Britain and France declare war.',
        'EUROPEAN THEATER:',
        '  Germany conquers most of Western Europe by 1940 (BLITZKRIEG: lightning warfare).',
        '  Britain stands alone (Battle of Britain, 1940-41 — air war over UK; Britain held).',
        '  Germany invades USSR (June 1941) — biggest invasion in history. Soviets eventually pushed back at huge cost.',
        '  D-DAY (June 6, 1944): Allied invasion of Nazi-occupied France. Beginning of the end.',
        '  Germany surrenders May 8, 1945 (V-E Day).',
        'PACIFIC THEATER:',
        '  Japan had been expanding aggressively in Asia (China since 1937).',
        '  PEARL HARBOR (Dec 7, 1941): Japan attacked the US Pacific Fleet in Hawaii. US entered the war.',
        '  Island-hopping campaigns; major battles: Midway (1942), Iwo Jima, Okinawa.',
        '  ATOMIC BOMBS: HIROSHIMA (Aug 6, 1945) and NAGASAKI (Aug 9, 1945). Japan surrendered Aug 15 (V-J Day).',
        'HOLOCAUST: Nazi systematic murder of ~6 million Jews and millions of others (Roma, disabled, Soviet POWs, political prisoners) in concentration and extermination camps. AUSCHWITZ became the most infamous.',
        'AFTERMATH:',
        '  Allied powers: US, USSR, UK, France controlled defeated Germany.',
        '  UNITED NATIONS founded (1945) — replacement for the failed League.',
        '  Beginning of COLD WAR between US (capitalist democracy) and USSR (communism).',
        '  Decolonization: European empires couldn\'t maintain control; India (1947), African nations followed.',
        '  ISRAEL founded (1948) partly as response to Holocaust.',
      ],
      vocabulary: [
        { term: 'fascism', definition: 'an authoritarian, ultranationalist political ideology.' },
        { term: 'appeasement', definition: 'giving in to aggression to avoid war (failed policy toward Hitler).' },
        { term: 'Holocaust', definition: 'Nazi systematic murder of ~6 million Jews + millions of others.' },
        { term: 'D-Day', definition: 'June 6, 1944 Allied invasion of Nazi-occupied France.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline', 'show_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causes',
      kind: 'worked_example',
      problem: 'Trace how the Treaty of Versailles led to WWII.',
      steps: [
        '1) Versailles (1919) imposed harsh terms on Germany — territorial losses, military limits, war guilt, massive reparations.',
        '2) German economy struggled with reparations + 1929 Great Depression hit hard. Unemployment, hyperinflation, political instability.',
        '3) Germans receptive to anyone promising to "restore" the country. HITLER and the NAZI PARTY exploited resentment, blamed Jews and others, promised national renewal.',
        '4) Hitler became Chancellor (1933), began rebuilding the military (banned by Versailles), reannexing territory.',
        '5) Western powers chose APPEASEMENT — letting Hitler take Austria, then Czechoslovakia.',
        '6) Hitler interpreted appeasement as weakness; invaded Poland 1939 → war declared.',
        'CHAIN: Harsh peace → economic crisis → extremism → aggression → war.',
      ],
      answer: 'See chain above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What was Pearl Harbor and why did it matter?',
      expectedAnswer: 'Japanese surprise attack on US Pacific Fleet (Dec 7, 1941). Brought the US into WWII.',
      responseFormat: 'free',
      hints: [
        'Where was the US in WWII before Dec 1941? Officially neutral.',
        'What changed that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-us-won',
      kind: 'misconception_check',
      question: 'Owen says "the US won WWII." What\'s a more historically complete view?',
      commonErrors: [
        {
          answer: 'true — atomic bombs ended it',
          misconception: 'Centering the US in a war fought by many.',
          correctsTo: 'The US played a critical role, especially in the Pacific and at D-Day, plus economic/industrial production. But the SOVIET UNION did most of the ground fighting against Germany on the Eastern Front and suffered ~80% of all Allied military deaths. Britain held alone for two years before US entry. The war was won by an Allied COALITION; framing it as "America\'s victory" downplays Soviet, British, French, Chinese, and others\' contributions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: Versailles, Depression, rise of fascism, appeasement.',
        'Started Sept 1939 (Poland invaded). US joined Dec 1941 (Pearl Harbor).',
        'European theater ended May 1945 (Germany surrender). Pacific ended Aug 1945 (atomic bombs).',
        'Holocaust: ~6 million Jews + millions of others systematically murdered.',
        'Aftermath: UN, Cold War, decolonization, Israel founded, US/USSR superpowers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the use of atomic bombs on Hiroshima and Nagasaki still debated by historians?',
      hint: 'Pro: ended war quickly, avoided invasion casualties. Con: targeted civilians, Japan was already near surrender, set precedent for nuclear weapons. Both sides have evidence; it\'s an ongoing ethical and historical debate.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
