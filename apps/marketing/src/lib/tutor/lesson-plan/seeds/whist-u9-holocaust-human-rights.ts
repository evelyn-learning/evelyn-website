/**
 * World History — The Twentieth Century: The Holocaust, Genocide & Human Rights.
 *
 * The unit's hardest and most necessary lesson. The organizing idea is the
 * ESCALATION LADDER: the Holocaust was a process built rung by rung out of
 * ordinary materials — prejudice, propaganda, law, bureaucracy, obedience,
 * and silence — not a single sudden event. Students then follow the
 * reckoning (Nuremberg, the Genocide Convention, the UDHR) and test
 * "Never Again" against the genocides that followed. Salvaged factual
 * spine from the legacy world-atrocities/human-rights seed, rewritten
 * subject-first. Taught with gravity, precision, and no sensationalism.
 * C3 D2.His.14.9-12, D2.Civ.10.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U9_HOLOCAUST_HUMAN_RIGHTS: LessonPlan = {
  id: 'evelyn.hs.whist.holocaust-human-rights.v1',
  title: 'The Holocaust, Genocide & Human Rights',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.holocaust-human-rights',
      standard: 'WHIST-9.4',
      description:
        'Explain the Holocaust as a documented process of escalating exclusion, dehumanization, and state-organized mass murder, and evaluate the postwar human-rights framework built in response and tested by later genocides (C3 D2.His.14.9-12, D2.Civ.10.9-12).',
    },
  ],
  prerequisites: ['whist.world-war-ii'],
  followUps: ['whist.cold-war'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Holocaust as a process built in stages by ordinary institutions — and make clear why recognizing the stages early is the whole point of studying it.',
      script:
        'Nobody woke up in Germany in 1933 and announced that six million Jewish people would be murdered. That is exactly what makes this history so important and so uncomfortable. It came in stages: first words, then laws, then broken glass, then walls, then trains, then camps — each rung making the next one thinkable. And most of it was carried out not by monsters in the dark but by clerks, engineers, police officers, and neighbors doing their jobs. Historians study this in detail for one reason: genocide is built out of ordinary materials, and the people who lived through the early rungs mostly did not recognize what they were standing on. Today we learn the ladder — so you can see it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-holocaust-and-human-rights',
      kind: 'concept',
      goal: 'The escalation ladder from ideology to industrialized murder, the conditions that made it possible, resistance and rescue, and the postwar human-rights reckoning.',
      keyIdeas: [
        'IDEOLOGY AND SCAPEGOATING FIRST — antisemitism was centuries old in Europe, but Nazi ideology made it the center of a political program. After defeat in World War I, the Versailles settlement, and the Depression, Nazi propaganda blamed Jewish Germans for humiliation and hunger and defined them as a biological "race" that could never belong. Words came before laws; laws came before violence.',
        'LEGAL EXCLUSION — the Nuremberg Laws (1935) stripped German Jews of citizenship, banned marriage with non-Jews, and defined Jewishness by ancestry. Jobs, schools, professions, and public life were closed step by step. This rung matters: the state made persecution ordinary, legal, and paperwork-shaped BEFORE it made it lethal.',
        'STATE-ORGANIZED VIOLENCE — Kristallnacht, the "Night of Broken Glass" (November 1938): coordinated attacks across Germany and Austria burned synagogues, destroyed thousands of Jewish businesses, killed dozens, and sent about 30,000 Jewish men to concentration camps. Police stood by; the government then fined the victims for the damage.',
        'GHETTOS, SHOOTINGS, THEN COORDINATION — after 1939, German occupation forced Jews in Poland and eastern Europe into sealed, starving ghettos (Warsaw the largest). After the 1941 invasion of the Soviet Union, mobile killing units called Einsatzgruppen shot well over a million people at mass graves. At the Wannsee Conference (January 1942), senior officials met to coordinate what they called the "Final Solution" across occupied Europe — the murder was administered, budgeted, scheduled, and written down.',
        'INDUSTRIALIZED MURDER AND THE SCALE — death camps including Auschwitz-Birkenau, Treblinka, Sobibor, Belzec, and Chelmno used railways, camps, and gas chambers to kill on an assembly-line scale. Six million Jews were murdered — about two-thirds of all the Jews in Europe. Nazi Germany also targeted and murdered Roma and Sinti, disabled people (the earlier "euthanasia" killings), Slavic civilians and Soviet prisoners of war, political prisoners, Jehovah\'s Witnesses, and gay men.',
        'HOW IT WAS POSSIBLE — four mechanisms working together: propaganda and dehumanization (people described as vermin or a disease long before they were killed); bureaucratic normalization (ordinary offices scheduling trains, stamping forms, tracking assets — most participants never saw a camp); bystander passivity and collaborationist governments across occupied Europe; and closed borders — the Evian Conference (1938) ended with nearly every nation refusing more Jewish refugees, and the ship St. Louis was turned away from Cuba and the United States in 1939.',
        'RESISTANCE AND RESCUE EXISTED — armed revolt in the Warsaw Ghetto Uprising (1943) and at Sobibor and Treblinka; partisan fighters; ghetto teachers and archivists who hid records so the truth would survive. Denmark ferried roughly 7,000 Jews to neutral Sweden. Thousands of individuals honored as Righteous Among the Nations hid neighbors at mortal risk. Choice was constrained, but it existed — which is why "nothing could be done" does not survive contact with the evidence.',
        'LIBERATION AND THE RECKONING — Allied troops reached the camps in 1944-1945 and documented what they found in film, photographs, and sworn testimony. The Nuremberg Trials (1945-1946) tried senior Nazi officials for crimes against humanity, establishing that INDIVIDUALS are accountable and that "I was following orders" is not a defense. The Genocide Convention (1948) made the crime illegal under international law using a word coined by the lawyer Raphael Lemkin, who lost most of his family in the Holocaust; the Universal Declaration of Human Rights (1948), driven through the new United Nations by Eleanor Roosevelt, stated the baseline rights of every person. "Never Again" has been tested since — Cambodia (1975-1979), Rwanda (1994), and Bosnia, where about 8,000 Bosniak men and boys were killed at Srebrenica (1995) — and in Rwanda roughly 800,000 people were killed in about 100 days while the world watched and did not intervene.',
      ],
      vocabulary: [
        {
          term: 'genocide',
          definition:
            'the deliberate, organized destruction of a national, ethnic, racial, or religious group; the word was coined by Raphael Lemkin in 1944 and defined in international law by the 1948 Genocide Convention.',
        },
        {
          term: 'dehumanization',
          definition:
            'propaganda that redefines a group of people as less than human — the rung that makes later violence feel permissible to ordinary participants and observers.',
        },
        {
          term: 'crimes against humanity',
          definition:
            'a category of international crime established at the Nuremberg Trials, holding individual officials personally responsible for large-scale atrocities against civilians.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-escalation-ladder',
      kind: 'worked_example',
      problem:
        'Build the escalation ladder: trace, rung by rung, how a modern European state moved from prejudice to the industrialized murder of six million people — and identify what each rung made possible.',
      steps: [
        'Rung 1 — IDEA. Nazi propaganda after World War I and the Depression names a scapegoat: Jewish Germans are blamed for defeat and economic collapse and defined as a separate "race." Nothing is illegal yet. What this rung buys: a population that accepts the category.',
        'Rung 2 — LAW. The Nuremberg Laws (1935) strip citizenship and bar marriage and jobs. Persecution becomes routine, official, and enforced by ordinary courts and clerks. What this rung buys: exclusion without protest, because it looks like administration.',
        'Rung 3 — VIOLENCE, STATE-ORGANIZED. Kristallnacht (1938) burns synagogues and jails 30,000 men while police stand aside, and the victims are fined for the damage. What this rung buys: proof that no one — inside Germany or outside — will intervene.',
        'Rung 4 — ISOLATION. Occupation after 1939 seals Jewish communities into ghettos, cutting them off from food, work, and witnesses. What this rung buys: victims concentrated, weakened, and invisible to the wider public.',
        'Rung 5 — MASS KILLING, THEN COORDINATION. Einsatzgruppen shooting units follow the army into Soviet territory in 1941; then the Wannsee Conference (1942) coordinates the "Final Solution" across occupied Europe. What this rung buys: murder converted from local improvisation into a planned, continent-wide state program.',
        'Rung 6 — INDUSTRY. Railways, camps, and gas chambers at Auschwitz-Birkenau, Treblinka, and the other death camps apply factory logic to killing. Six million Jews — two-thirds of European Jewry — plus Roma and Sinti, disabled people, Slavic civilians and Soviet prisoners, political prisoners, and gay men are murdered.',
        'Now read the ladder backwards, which is the historian\'s point: each rung looked survivable to the people standing on it, and each one made the next rung thinkable. The materials are ordinary — a slogan, a statute, a police officer who looks away, a train schedule.',
      ],
      answer:
        'Idea to law to organized violence to isolation to mass shooting and coordination to industrialized murder — six rungs, each one normalizing the next, which is why the Holocaust is studied as a process rather than an event.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-liberator-report',
      kind: 'worked_example',
      problem:
        'A US Army officer wrote home days after his unit reached a camp in April 1945 (paraphrased): "I am writing this down because someday people will say it never happened. We photographed everything, and we made the townspeople from four miles away walk up the road and look, because they told us they had known nothing." Analyze what this account tells a historian.',
      steps: [
        'Identify the writer and the moment: a liberating soldier, writing within days, with no time to shape a story after the fact. That immediacy is part of why liberator accounts are strong evidence.',
        'Read his stated purpose: he expects future denial. Denial was anticipated by the witnesses themselves — which is one reason the Allies documented the camps so heavily in film, photographs, and sworn testimony at the time.',
        'Read the decision to photograph: evidence was gathered deliberately, and it joined an even larger body of proof — the Nazi regime\'s own meticulous records of deportations, camps, and killings, later used against its officials at Nuremberg.',
        'Read the detail about the townspeople: the claim "we knew nothing" was common, and it is the question this lesson keeps returning to. Camps stood near towns; deportations happened in daylight; property was auctioned locally. Knowledge was uneven and fear was real, but total ignorance is not what the evidence shows.',
        'State the limits honestly: one officer sees one camp on one day. He cannot describe the whole system, and a historian would corroborate him against survivor testimony, other units\' reports, and German records — which is exactly what happened.',
        'Draw the conclusion: this is a document about EVIDENCE and RESPONSIBILITY. Holocaust denial is a falsehood contradicted by mountains of proof, including the perpetrators\' own paperwork, and the neighbors\' claim of ignorance is the bystander problem stated in one sentence.',
      ],
      answer:
        'It shows liberators documenting evidence in anticipation of denial, and it puts the bystander question directly on the page — testimony that historians corroborate with survivor accounts and with the regime\'s own extensive records.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sequence',
      kind: 'try_yourself',
      problem:
        'Which sequence correctly orders these stages of Nazi persecution, earliest to latest?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Nuremberg Laws stripping citizenship (1935), Kristallnacht (1938), ghettos in occupied Poland (from 1939), Wannsee Conference coordinating the "Final Solution" (1942)',
          correct: true,
        },
        { id: 'b', text: 'Wannsee Conference (1942), Nuremberg Laws (1935), Kristallnacht (1938), ghettos (from 1939)' },
        { id: 'c', text: 'Kristallnacht (1938), Nuremberg Laws (1935), Wannsee Conference (1942), ghettos (from 1939)' },
        { id: 'd', text: 'Ghettos (from 1939), Wannsee Conference (1942), Kristallnacht (1938), Nuremberg Laws (1935)' },
      ],
      expectedAnswer:
        'Nuremberg Laws stripping citizenship (1935), Kristallnacht (1938), ghettos in occupied Poland (from 1939), Wannsee Conference coordinating the "Final Solution" (1942)',
      hints: [
        'The dates are given in every choice — put them in order first, then check that the order also makes causal sense.',
        'Exclusion by law came before organized street violence, which came before wartime ghettos, which came before continent-wide coordination.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bureaucracy',
      kind: 'try_yourself',
      problem:
        'Historians emphasize that much of the Holocaust was carried out by clerks, railway staff, and local officials who never entered a camp. What does this fact best explain?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'How mass murder could be organized at continental scale — routine paperwork and job roles let ordinary people take part without confronting the outcome',
          correct: true,
        },
        { id: 'b', text: 'That the killing was accidental and no one intended the outcome' },
        { id: 'c', text: 'That only a few senior leaders were responsible and everyone else was uninvolved' },
        { id: 'd', text: 'That the Holocaust was carried out entirely in secret with no records kept' },
      ],
      expectedAnswer:
        'How mass murder could be organized at continental scale — routine paperwork and job roles let ordinary people take part without confronting the outcome',
      hints: [
        'Ask what a continent-wide program actually requires: schedules, budgets, censuses, transport, property transfers.',
        'The point is not that participants were innocent — it is that dividing the work into ordinary tasks made participation feel ordinary.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reckoning',
      kind: 'try_yourself',
      problem:
        'What legal principle did the Nuremberg Trials (1945-1946) establish that still shapes international law?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Individuals can be held personally responsible for crimes against humanity, and following orders is not a defense',
          correct: true,
        },
        { id: 'b', text: 'Only governments, never individual officials, can be charged for wartime atrocities' },
        { id: 'c', text: 'Nations that lose a war automatically forfeit their independence' },
        { id: 'd', text: 'Wartime actions may only be judged by the courts of the country that committed them' },
      ],
      expectedAnswer:
        'Individuals can be held personally responsible for crimes against humanity, and following orders is not a defense',
      hints: [
        'The defendants were named people, not the German state as an abstraction — what does putting individuals in the dock establish?',
        'Their most common defense was that they had orders from above; the tribunal rejected it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-single-event',
      kind: 'misconception_check',
      question:
        'A student writes: "The Holocaust was a single sudden event — the Nazis took over and immediately started the camps, so ordinary Germans had no warning and nothing they did could have mattered." What needs correcting?',
      commonErrors: [
        {
          answer: 'It happened all at once, so ordinary people had no warning and no influence',
          misconception:
            'Compressing a twelve-year escalation into one instant, which erases both the warning signs and the many points where refusal, protest, or rescue was still possible.',
          correctsTo:
            'It was a PROCESS with visible rungs over roughly twelve years: propaganda and scapegoating, then the Nuremberg Laws (1935), then Kristallnacht (1938) in the open streets, then ghettos, then the shootings after 1941, then Wannsee (1942) and the death camps. Each stage was public enough to be seen — synagogues burned in city centers, neighbors deported in daylight, seized property auctioned locally. And ordinary action DID matter: Denmark ferried roughly 7,000 Jews to safety, thousands of individuals honored as Righteous Among the Nations hid neighbors at mortal risk, and the Warsaw Ghetto Uprising (1943) showed resistance under the worst conditions imaginable. Repression was real and the risks were lethal, so judgment should be careful — but "no warning, nothing could matter" is contradicted by the record.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Holocaust was a PROCESS, not an event: ideology and scapegoating, legal exclusion (Nuremberg Laws 1935), organized violence (Kristallnacht 1938), ghettos, Einsatzgruppen shootings after 1941, Wannsee coordination (1942), and industrialized murder at Auschwitz and the other death camps.',
        'Six million Jews were murdered — about two-thirds of European Jewry — along with Roma and Sinti, disabled people, Slavic civilians and Soviet prisoners of war, political prisoners, and gay men.',
        'It was made possible by ordinary materials: propaganda and dehumanization, bureaucratic normalization, bystander passivity, collaborating governments, and closed borders (Evian 1938, the St. Louis).',
        'Resistance and rescue existed — the Warsaw Ghetto Uprising (1943), the Danish rescue, the Righteous Among the Nations — so "nothing could be done" does not match the evidence.',
        'The reckoning: Nuremberg (1945-1946) made individuals accountable and rejected "following orders"; the Genocide Convention (1948) named and outlawed the crime; the Universal Declaration of Human Rights (1948) set a universal baseline.',
        '"Never Again" has been tested — Cambodia (1975-1979), Rwanda (1994, about 800,000 killed in roughly 100 days), Srebrenica in Bosnia (1995) — which is why recognizing the ladder early is the point of the lesson.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'The Holocaust, Genocide & Human Rights' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
