/**
 * World History — Global Conflict: World War I.
 *
 * The powder keg Unit 8 assembled finally goes off. Long-building causes
 * (militarism, alliances, imperialism, nationalism) plus one gunshot in
 * Sarajevo plus mobilization timetables nobody could stop — then four
 * years of industrial stalemate, a genuinely global mobilization of
 * colonial manpower, and a peace whose resentments load the next two
 * lessons. Salvaged factual spine from the legacy world-history WWI seed,
 * reframed subject-first. C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U9_WORLD_WAR_I: LessonPlan = {
  id: 'evelyn.hs.whist.world-war-i.v1',
  title: 'World War I',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.world-war-i',
      standard: 'WHIST-9.1',
      description:
        'Analyze the long-term causes and immediate trigger of World War I, explain why industrial technology produced years of stalemate and total war across a global set of fronts, and evaluate how the 1919 peace settlement created the grievances that shaped the decades that followed (C3 D2.His.1.9-12, D2.His.14.9-12).',
    },
  ],
  prerequisites: ['whist.new-imperialism'],
  followUps: ['whist.interwar-years'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame WWI as the war nobody quite chose — and the moment the modern world gets its shape.',
      script:
        'In the summer of 1914, a teenager fired two shots at a car in Sarajevo. Within six weeks, empires that had spent decades avoiding a general war were marching into one — and most of the men marching believed they would be home by Christmas. They were wrong by four years and roughly nine million soldiers. Here is what makes this the hinge of the modern world: almost nobody wanted the war they got, and yet the alliances, the arms race, and the mobilization timetables they had built made it almost impossible to stop. Four empires would not survive it. The map of the Middle East and eastern Europe you know today was drawn in its aftermath — and so were the grudges that produced the next war.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-world-war-i',
      kind: 'concept',
      goal: 'The MAIN causes, the July Crisis cascade, industrial stalemate, total war and global mobilization, the 1917 pivots, and the peace that set up the next crisis.',
      keyIdeas: [
        'THE POWDER KEG (the MAIN causes) — four long-building pressures, all assembled in Unit 8. MILITARISM: the Anglo-German naval race and war plans built on railway timetables, so mobilizing meant committing. ALLIANCES: the Triple Alliance (Germany, Austria-Hungary, Italy) hardening against the Triple Entente (France, Russia, Britain) — a local quarrel now had automatic partners. IMPERIALISM: colonial rivalries, including repeated crises over Morocco, teaching these powers to see each other as rivals everywhere. NATIONALISM: Slavic nationalism straining multiethnic Austria-Hungary in the Balkan tinderbox, and French revanche — the demand to take back Alsace-Lorraine, lost to Germany in 1871.',
        'THE SPARK IS NOT THE CAUSE — on June 28, 1914, Gavrilo Princip, a Bosnian Serb nationalist, assassinated Archduke Franz Ferdinand, heir to Austria-Hungary, in Sarajevo. That is the TRIGGER. A powder keg needs both the powder (thirty years of the four pressures above) and the match. Neither alone explains the explosion.',
        'THE JULY CRISIS DOMINOES — Germany gave Austria-Hungary a "blank check" of unconditional backing; Austria-Hungary sent Serbia a deliberately unacceptable ultimatum; Russia began mobilizing to defend Serbia; Germany, whose war plan required beating France before Russia was ready, declared war on Russia and then France and invaded neutral Belgium to get there — which brought Britain in by early August. Once mobilization schedules started, stopping them meant surrendering the advantage, so leaders kept going. A war nobody quite chose, in about five weeks.',
        'WHY IT WASN\'T "OVER BY CHRISTMAS" — industrial technology made DEFENSE far stronger than offense. Machine guns, quick-firing artillery, and barbed wire slaughtered attackers crossing open ground, so both sides dug in; by late 1914 a line of trenches ran from the Swiss border to the North Sea and barely moved for three years. The 1916 battles are the emblem: Verdun, a ten-month German attempt to "bleed France white," and the Somme, whose first day (July 1, 1916) cost the British army roughly 57,000 casualties, the worst single day in its history, for gains measured in yards. That is ATTRITION — when the goal stops being territory and becomes exhausting the enemy first.',
        'TOTAL WAR — whole societies were conscripted, not just armies. Governments took control of factories, food, and railways; rationing and propaganda became state functions; women entered munitions plants and offices in enormous numbers, an argument for suffrage that several countries conceded soon after the war (Britain in 1918, Germany and the United States by 1920).',
        'A WORLD WAR IN RECRUITMENT TOO — Britain and France drew soldiers and laborers from their empires: more than a million men from British India served overseas, France recruited West African troops known as the tirailleurs senegalais, and Chinese and Indochinese laborers worked behind the lines. They fought for empires that had never granted them self-rule — and many expected the war to change that. Fronts spread with the Ottoman entry on the German side: Gallipoli in 1915, campaigns across the Middle East, and, during the same period, the Ottoman government\'s systematic deportation and mass killing of its Armenian population beginning in 1915 — the Armenian genocide, a state-organized campaign that killed an estimated 600,000 to 1.5 million people.',
        'THE 1917 PIVOTS AND THE END — Germany resumed unrestricted submarine warfare and the Zimmermann telegram proposed a German-Mexican alliance against the United States, which entered the war in April 1917 with fresh manpower and industry. In the same year Russia\'s revolution pulled it out of the war entirely (Lesson 9.2). Germany\'s last offensive failed and the armistice took effect on the eleventh hour of November 11, 1918. The toll: roughly 9 to 10 million soldiers dead, about 20 million dead counting civilians, with an influenza pandemic sweeping the exhausted world on top of it.',
        'VERSAILLES, 1919 — the treaty assigned Germany war guilt, demanded reparations it could not pay, and stripped its territory and colonies. Four empires dissolved: Austria-Hungary and the Ottoman Empire broke apart, new states were drawn across eastern Europe, and Russia and Germany lost their monarchies. Wilson\'s Fourteen Points had promised self-determination, but colonized peoples got the mandate system instead — former German and Ottoman territories handed to Britain and France to administer. Two sets of resentment left on the table: German humiliation and colonial hopes denied. Both come due in Lessons 9.2 and 9.3.',
      ],
      vocabulary: [
        { term: 'total war', definition: "a war in which a state mobilizes its entire economy and society — industry, food, labor, propaganda — not just its armed forces." },
        { term: 'war of attrition', definition: 'fighting aimed at wearing the enemy down through sustained losses rather than at capturing ground.' },
        { term: 'mandate system', definition: "the postwar arrangement handing former German and Ottoman territories to Britain and France to govern 'on trust' — colonial control under new legal language, not self-rule." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-july-crisis-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did one assassination in Sarajevo on June 28, 1914 become a continental war involving five great powers within about five weeks?',
      steps: [
        'Start with what was ALREADY loaded, before the shots: an arms race, two rigid alliance blocs, colonial rivalries, and Balkan nationalism straining Austria-Hungary. Nothing here forces a war — but every one of them shortens the fuse.',
        'The trigger: Princip, a Bosnian Serb nationalist, kills Franz Ferdinand. Austria-Hungary decides to use the crisis to crush Serbian nationalism for good — and asks Germany whether it will be backed.',
        'Domino one, the blank check: Germany promises unconditional support. That converts an Austro-Serbian quarrel into something Russia cannot ignore, because Germany is now standing behind it.',
        'Domino two, the ultimatum: Austria-Hungary sends Serbia demands written to be refused, then declares war. Russia, protector of Slavic Serbia and unwilling to be humiliated again in the Balkans, orders mobilization.',
        'Domino three, the timetables: German war planning assumed a two-front war and required knocking France out FAST, before Russia finished mobilizing. So Russian mobilization triggers a German declaration on Russia and then on France, and the fast route to Paris runs through neutral Belgium.',
        'Close the chain: violating Belgian neutrality brings Britain in by August 4. Notice the shape — each step was a reasonable response to the previous one, and each narrowed the next leader\'s options. That is why historians say the powers stumbled in: the causes made war possible, the trigger made it urgent, and the schedules made it hard to stop.',
      ],
      answer:
        'Long-term pressures loaded the system; the assassination triggered it; and the blank check, the ultimatum, and the mobilization timetables converted a Balkan quarrel into a five-power war in five weeks — each step locking in the next.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-indian-soldier-account',
      kind: 'worked_example',
      problem:
        'An Indian veteran of the Western Front wrote after the war (paraphrased): "We were told this was a war for the freedom of small nations, and we crossed the sea to fight it. We came home to the same rulers and the same permissions we needed before we left." What does this account reveal about World War I and the peace that followed?',
      steps: [
        'Locate the speaker: not a European, not a general — a colonial soldier. That placement alone makes a point the phrase "European war" hides. More than a million Indian troops served overseas, alongside West African tirailleurs and Chinese and Indochinese labor corps.',
        'Read the first claim: "a war for the freedom of small nations" is wartime language the Allies really used, echoed later in Wilson\'s Fourteen Points and its promise of self-determination. Colonized soldiers heard it and reasonably applied it to themselves.',
        'Read the second claim: "the same rulers and the same permissions." Nothing changed at home. Contribution did not convert into political rights.',
        'Connect to the settlement: at the 1919 peace conference, self-determination was applied to new states in eastern Europe but not to Asia and Africa. Former German and Ottoman territories went to Britain and France as mandates — administration by another name.',
        'Weigh what one account can and cannot show: it is one man\'s memory, not a statistic, and other veterans wrote with pride in their service. What it does document is the EXPECTATION the war created — and expectation denied is exactly the raw material of the anticolonial movements you meet in the next unit.',
      ],
      answer:
        'It shows WWI was global in recruitment as well as in fighting, and that the wartime promise of self-determination was applied selectively at Versailles — turning colonial war service into a grievance that fueled later independence movements.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cascade',
      kind: 'try_yourself',
      problem:
        'A quarrel between Austria-Hungary and Serbia became a war involving Germany, Russia, France, and Britain within weeks. Which factor best explains that escalation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Alliance commitments plus mobilization timetables that made stopping look more dangerous than continuing', correct: true },
        { id: 'b', text: 'The assassination of Franz Ferdinand was itself so destructive that war became unavoidable' },
        { id: 'c', text: 'The League of Nations required member states to declare war on Serbia' },
        { id: 'd', text: 'Britain invaded Belgium in order to reach Germany quickly' },
      ],
      expectedAnswer: 'Alliance commitments plus mobilization timetables that made stopping look more dangerous than continuing',
      hints: [
        'The trigger explains WHY leaders acted in July 1914; something else explains why so many powers were dragged in.',
        'Ask what each leader thought would happen if they paused while a rival kept mobilizing — the railway schedules answer it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-stalemate',
      kind: 'try_yourself',
      problem:
        'Both sides expected a short war of rapid advances. Instead the Western Front barely moved for years. What best explains the stalemate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Machine guns, artillery, and barbed wire gave defenders a decisive edge over attacking infantry', correct: true },
        { id: 'b', text: 'Soldiers dug trenches, and the trenches then made attacking impossible' },
        { id: 'c', text: 'Neither side had enough soldiers to attempt an offensive' },
        { id: 'd', text: 'Commanders on both sides agreed to stop attacking after 1914' },
      ],
      expectedAnswer: 'Machine guns, artillery, and barbed wire gave defenders a decisive edge over attacking infantry',
      hints: [
        'One choice mistakes a RESULT of the stalemate for its cause — trenches were the response, not the reason.',
        'Compare the technology available to a defender behind cover with what an attacker had crossing open ground in 1916.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-versailles',
      kind: 'try_yourself',
      problem:
        'Which outcome of the 1919 Treaty of Versailles most directly created grievances that shaped the following two decades?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A war guilt clause and heavy reparations on Germany, while colonized peoples were given mandates instead of self-rule', correct: true },
        { id: 'b', text: 'Germany was divided into occupation zones administered by the United States and the Soviet Union' },
        { id: 'c', text: 'Every colony of the defeated powers received immediate independence' },
        { id: 'd', text: 'Austria-Hungary and the Ottoman Empire were left intact and strengthened' },
      ],
      expectedAnswer: 'A war guilt clause and heavy reparations on Germany, while colonized peoples were given mandates instead of self-rule',
      hints: [
        'Two groups walked away angry in 1919 — one defeated in Europe, one that had fought FOR the winners.',
        'One distractor describes the settlement after a different war, thirty years later.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-assassination-cause',
      kind: 'misconception_check',
      question:
        'A student writes: "World War I was caused by the assassination of Archduke Franz Ferdinand." What needs correcting?',
      commonErrors: [
        {
          answer: 'The assassination caused World War I',
          misconception: 'Collapsing a trigger into a cause — treating the single dramatic event as the whole explanation, which makes the war look like an accident rather than a system under pressure.',
          correctsTo:
            'The assassination on June 28, 1914 was the TRIGGER. The CAUSES were built over decades: militarism (the naval race, war plans on railway timetables), the alliance blocs, imperial rivalries, and nationalism in the Balkans and in a France still wanting Alsace-Lorraine back. Test it this way: political assassinations happened in Europe repeatedly without producing world wars. This one did because of what it landed on. Powder plus match — name both.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes vs trigger: militarism, alliances, imperialism, and nationalism loaded the powder keg; Sarajevo, June 28, 1914 was the match.',
        'The July Crisis cascade — blank check, ultimatum, mobilization timetables — pulled five great powers in within about five weeks. A war nobody quite chose.',
        'Industrial defense beat offense: machine guns, artillery, and barbed wire produced trenches from Switzerland to the sea, and attrition battles like Verdun and the Somme in 1916.',
        'Total war conscripted whole societies — factories, food, propaganda, women in war work, and colonial troops and laborers from India, Africa, and Indochina.',
        '1917 turned it: submarine warfare and the Zimmermann telegram brought the United States in; revolution took Russia out. Armistice November 11, 1918; roughly 20 million dead in all.',
        'Versailles, 1919: war guilt, reparations, four empires gone, new borders — and self-determination promised but withheld from colonized peoples. Those grievances are the setup for the next two lessons.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'World War I' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
