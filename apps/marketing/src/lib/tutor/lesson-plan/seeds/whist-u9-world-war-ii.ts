/**
 * World History — The World at War: World War II.
 *
 * The deadliest conflict in human history, taught as a causal machine:
 * unresolved Versailles grievances → aggression met with concession →
 * a war that swallowed the planet → a world split between two
 * superpowers. Factual spine salvaged from the legacy world-history
 * WWII seed and rewritten subject-first. The hinge into 9.4 (the
 * Holocaust and human rights) and Unit 10 (the Cold War).
 * C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U9_WORLD_WAR_II: LessonPlan = {
  id: 'evelyn.hs.whist.world-war-ii.v1',
  title: 'World War II',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.world-war-ii',
      standard: 'WHIST-9.3',
      description:
        'Trace the chain of aggression and concession that led to World War II, explain how the war became a truly global and total conflict across Europe, Asia, and the Pacific, and evaluate its human cost and the superpower world it left behind (C3 D2.His.1.9-12, D2.His.14.9-12).',
    },
  ],
  prerequisites: ['whist.interwar-years'],
  followUps: ['whist.holocaust-human-rights'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame WWII as the war people saw coming and could not stop — and as the event that built the world students live in.',
      script:
        'In September 1938, Britain\'s prime minister flew home from a conference in Munich, waved a signed paper at the cameras, and told a relieved crowd he had brought "peace for our time." Eleven months later Germany invaded Poland. Six years after that, roughly sixty to seventy-five million people were dead — most of them civilians — Europe was rubble, two new superpowers stood over the wreckage, and a new organization called the United Nations was founded on the promise that it must never happen again. Almost every border, alliance, and international institution you read about in the news today was drawn or built in the aftermath of this war. So the question worth your next twenty minutes is not just what happened. It is how a continent that had already buried a generation in the First World War talked itself into doing it again — and worse.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-world-war-ii',
      kind: 'concept',
      goal: 'The road to war, the war as a global and total conflict, its human cost, and the superpower world it produced.',
      keyIdeas: [
        'THE ROAD RAN THROUGH GRIEVANCE — Hitler built support by promising to tear up the Treaty of Versailles: reparations, the "war guilt" clause, lost territory, and a capped army. Step by step he broke it and nobody stopped him — rearmament, then the remilitarized Rhineland (1936), then the Anschluss, the annexation of Austria (1938). Each unanswered move taught him the next one was safe.',
        'MUNICH AND APPEASEMENT — at Munich (September 1938) Britain and France handed Germany the Sudetenland, the German-speaking border region of Czechoslovakia, in exchange for a promise of no further demands. Czechoslovakia was not at the table. The logic was not cowardice alone: memories of the WWI slaughter were raw, rearmament was incomplete, and the demand for German-speakers sounded like self-determination. Hitler took the rest of Czechoslovakia within six months. Appeasement failed because it fed an appetite it was trying to satisfy.',
        'THE CYNICAL HANDSHAKE — in August 1939 Nazi Germany and the Soviet Union, sworn ideological enemies, signed a non-aggression pact with a secret protocol dividing Poland and Eastern Europe between them. It stunned communists and fascists alike. Strategically it was the green light: Hitler no longer feared a two-front war. Germany invaded Poland on September 1, 1939; Britain and France declared war two days later.',
        'THE PHASES, IN BRIEF — blitzkrieg ("lightning war," tanks and aircraft punching through instead of grinding trench lines) overran Poland, then France in six weeks in 1940. The Battle of Britain was the first check: radar and the Royal Air Force denied Germany control of the sky. Then the fatal gamble — Operation Barbarossa, the invasion of the USSR in June 1941, opening an Eastern Front that consumed the bulk of the German army. Stalingrad (1942-43), the bloodiest battle in recorded history, is THE turning point: after it, Germany was retreating in the east for the rest of the war.',
        'THE WAR GOES FULLY GLOBAL — Japan had been at war in China since 1937, where its forces committed mass atrocities against civilians, including the killings and assaults at Nanjing in 1937-38. Japan\'s attack on Pearl Harbor (December 7, 1941) brought the United States fully in and welded the Asian and European wars into one conflict. The Allies fought back across the Pacific by island-hopping — seizing key islands and bypassing the rest — while D-Day (June 6, 1944) opened the long-awaited western front in France. Berlin fell in May 1945.',
        'THE END IN THE PACIFIC — the United States firebombed Japanese cities, then dropped atomic bombs on Hiroshima (August 6, 1945) and Nagasaki (August 9); the Soviet Union declared war on Japan; Japan surrendered, signing on September 2, 1945. The stated American rationale was to force surrender without a home-island invasion projected to cost enormous casualties on both sides. The two bombings killed well over a hundred thousand people, most of them civilians, with more dying later of radiation injuries. Historians still genuinely debate whether the bombings were necessary — the evidence supports argument, not a settled verdict.',
        'TOTAL WAR, BEYOND WWI SCALE — every major power deliberately bombed enemy cities, treating civilian morale and industry as military targets: London, Dresden, Tokyo, and many more. Home fronts were fully mobilized, with women entering war industry in unprecedented numbers. Colonial troops were again central: roughly 2.5 million Indians volunteered — the largest volunteer force in history — and African troops and labor were essential in the North African and Asian campaigns. Those contributions became a powerful argument for independence after the war.',
        'THE TOLL AND THE NEW WORLD — roughly 60 to 75 million people died, the majority of them civilians: the USSR lost about 27 million, China roughly 15 to 20 million in a war that began for them in 1937 and is still the most forgotten theater in most textbooks. Europe ended the war ruined and no longer the center of world power. Two states stood above the wreckage — the United States and the Soviet Union — and the United Nations was founded in 1945 to replace the League that had failed. The reckoning with the Holocaust follows next; the superpower standoff follows in Unit 10.',
      ],
      vocabulary: [
        { term: 'appeasement', definition: 'granting an aggressor\'s demands in hopes of avoiding war — the Anglo-French policy that peaked at Munich in 1938 and failed.' },
        { term: 'blitzkrieg', definition: '"lightning war" — fast, concentrated tank-and-aircraft attacks that break through a defensive line rather than grinding against it.' },
        { term: 'total war', definition: 'war in which entire societies are mobilized and civilians, cities, and industry are treated as legitimate targets.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-road-to-war',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a treaty signed in 1919 to end one war help produce an even worse one twenty years later?',
      steps: [
        'Start with the grievance, not the treaty text. Versailles left Germany with reparations, lost territory, a capped army, and a "war guilt" clause many Germans found humiliating. A grievance alone does not cause a war — but it is fuel waiting for someone to light it.',
        'Add the ignition: the Great Depression wrecked the German economy and destroyed faith in the moderate parties. Hitler rose by promising to undo Versailles and restore national strength — the grievance became a political program.',
        'Follow the escalating tests. Rearmament, then troops back into the Rhineland (1936), then the annexation of Austria (1938). Each move was a probe. Each unanswered probe was information: the other side will not fight.',
        'Follow the concession. At Munich (1938) Britain and France gave away the Sudetenland — Czech territory, decided without the Czechs — to buy peace. Six months later Hitler took the rest of Czechoslovakia, which proved the demands had never been about German-speakers.',
        'Close the chain with the pact. The Nazi-Soviet agreement of August 1939 removed the last obstacle, the fear of a two-front war. Germany invaded Poland on September 1, 1939. Chain: humiliation plus economic collapse produced a leader who promised revision; unanswered probes taught him he was safe; concession confirmed it; the pact freed his hands.',
      ],
      answer:
        'Versailles supplied the grievance, the Depression supplied the opening, unanswered aggression and appeasement supplied the confidence, and the Nazi-Soviet Pact removed the last strategic obstacle — a chain, not a single cause.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-munich-source',
      kind: 'worked_example',
      problem:
        'A newspaper editor in Prague wrote in October 1938 (paraphrased): "In London and Paris they are cheering a peace that was signed in our name and without our voice. Four men met in Munich; none of them was Czech. They have handed away our mountains and our forts, and they call this a settlement. We shall find out soon enough what our friends bought with our border." Work through what this account reveals about the Munich Agreement and about appeasement.',
      steps: [
        'Source it first. The writer is Czechoslovak, writing days or weeks after Munich, from the country whose territory was given away. That position explains the bitterness — and it also gives the writer direct knowledge that the crowds in London did not have.',
        'Read the central complaint: "signed in our name and without our voice." The four powers at Munich were Germany, Italy, Britain, and France. Czechoslovakia, whose land was being transferred, was not a party to the agreement. That is the writer\'s core charge, and it is factually accurate.',
        'Read the military detail: "our mountains and our forts." The Sudetenland was not just a German-speaking region — it held Czechoslovakia\'s fortified mountain frontier. Handing it over stripped the country of its defenses, which is why Germany could occupy the rest in March 1939 without a fight.',
        'Read the last line as a prediction. "What our friends bought with our border" is the writer betting that the peace will not hold. Within a year it did not. Sources written before the outcome are valuable precisely because they show what informed people could already see.',
        'Read what the source does NOT show. It does not capture why Britain and France conceded — raw memories of WWI casualties, incomplete rearmament, and a demand that could be framed as self-determination for German-speakers. A single perspective is evidence, not the whole picture; you need the other side\'s reasoning to explain the decision rather than just condemn it.',
      ],
      answer:
        'The source shows Munich from the side that paid for it: a great-power bargain made without the country whose defensible border was traded away, and an accurate prediction that the peace would not last — while leaving out the WWI-shadowed reasoning that made appeasement attractive in London and Paris.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-appeasement',
      kind: 'try_yourself',
      problem:
        'Britain and France conceded the Sudetenland to Germany at Munich in 1938 to prevent a war. Which best explains why the policy of appeasement failed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each unanswered concession signaled that the Western powers would not fight, so German demands escalated rather than stopped', correct: true },
        { id: 'b', text: 'Germany was militarily too weak in 1938 to have acted on any of its demands' },
        { id: 'c', text: 'The Soviet Union forced Britain and France to sign the Munich Agreement' },
        { id: 'd', text: 'Appeasement was invented after the war began, so it had no effect on the road to war' },
      ],
      expectedAnswer: 'Each unanswered concession signaled that the Western powers would not fight, so German demands escalated rather than stopped',
      hints: [
        'Track the sequence: Rhineland 1936, Austria 1938, Sudetenland 1938, the rest of Czechoslovakia 1939. What is happening to the size of the demands?',
        'Ask what Hitler learned from each concession — appeasement was meant to buy a limit, and instead it supplied confidence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-nazi-soviet-pact',
      kind: 'try_yourself',
      problem:
        'In August 1939, Nazi Germany and the Soviet Union — bitter ideological enemies — signed a non-aggression pact. What was its most important immediate consequence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It freed Germany from the risk of a two-front war and cleared the way for the invasion of Poland', correct: true },
        { id: 'b', text: 'It brought the Soviet Union into the Axis as a formal military ally for the whole war' },
        { id: 'c', text: 'It ended the threat to Poland and delayed the outbreak of war by several years' },
        { id: 'd', text: 'It committed the Soviet Union to defend Britain and France against German attack' },
      ],
      expectedAnswer: 'It freed Germany from the risk of a two-front war and cleared the way for the invasion of Poland',
      hints: [
        'Germany invaded Poland just over a week later — what had changed strategically in that week?',
        'Think about what Germany most feared repeating from the First World War: fighting east and west at the same time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-eastern-front',
      kind: 'try_yourself',
      problem:
        'A student is asked where Nazi Germany\'s army was broken. Which answer is best supported by the evidence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'On the Eastern Front, where the invasion of the USSR consumed most of the German army and Stalingrad in 1942-43 turned the war', correct: true },
        { id: 'b', text: 'In the Battle of Britain, which destroyed the German army in 1940' },
        { id: 'c', text: 'At Pearl Harbor, which forced Germany to surrender in 1941' },
        { id: 'd', text: 'On D-Day in 1944, before which Germany had suffered almost no serious losses' },
      ],
      expectedAnswer: 'On the Eastern Front, where the invasion of the USSR consumed most of the German army and Stalingrad in 1942-43 turned the war',
      hints: [
        'Compare the casualty figures: the USSR lost roughly 27 million people. Where was that fighting happening?',
        'D-Day came in June 1944 — nearly three years after Barbarossa and more than a year after Stalingrad. Which came first, and which absorbed more German divisions?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-1939-start',
      kind: 'misconception_check',
      question:
        'A student writes: "World War II began in 1939 and was mostly a European war." What needs correcting?',
      commonErrors: [
        {
          answer: 'The war started in 1939 and Europe was where it mattered',
          misconception:
            'Treating the September 1939 invasion of Poland as the universal start date and treating the Asian and Pacific theater as a side story.',
          correctsTo:
            'September 1939 marks the start of the war IN EUROPE. Japan had invaded Manchuria in 1931 and been at full-scale war with China since 1937 — for hundreds of millions of people the war was already years old when Poland was invaded. And the Asian theater was not a sideshow: China alone lost roughly 15 to 20 million people. The war was global in its causes, its fighting, and its dead.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The chain to war: Versailles grievance plus Depression collapse produced a program of revision; the Rhineland (1936), the Anschluss (1938), and Munich (1938) went unanswered; the Nazi-Soviet Pact (August 1939) removed the two-front fear; Poland was invaded September 1, 1939.',
        'Appeasement failed because concession signaled weakness and demands escalated — Hitler took the rest of Czechoslovakia six months after promising he would not.',
        'The phases: blitzkrieg and the fall of France (1940), the Battle of Britain as the first check, Barbarossa (June 1941) and Stalingrad (1942-43) as THE turning point, Pearl Harbor (December 1941) making the war fully global, D-Day (June 1944), Berlin (May 1945), Japan\'s surrender (September 2, 1945) after Hiroshima and Nagasaki — a decision historians still debate.',
        'Total war beyond WWI scale: cities bombed by all sides, home fronts fully mobilized, women in war industry, and colonial troops again central — including roughly 2.5 million Indian volunteers.',
        'The toll: about 60 to 75 million dead, mostly civilians, with the USSR losing about 27 million and China 15 to 20 million. Europe was ruined, the United States and the USSR emerged as superpowers, and the United Nations was founded in 1945.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'World War II' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
