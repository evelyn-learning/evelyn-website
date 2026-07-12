/**
 * AP World History: Modern — CED Unit 8.1-8.4: The Cold War as a Global
 * Conflict.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). First stop in Unit 8
 * (1945-present): the Cold War as a bipolar, ideological rivalry that
 * organized much of the postwar world into rival blocs, fought an arms race
 * that never produced direct superpower combat, but that turned violently
 * hot again and again across the decolonizing world.
 *
 * Anchor texts: (1) Truman's March 12, 1947 address to Congress — REUSED
 * from the APUSH catalog, evelyn.passage.apush-truman-doctrine.v1 — wired
 * in the concept segment as the doctrine that globalized containment beyond
 * Europe; (2) Kennedy's October 22, 1962 Cuban-quarantine address —
 * evelyn.passage.apworld-jfk-cuba.v1 — wired in the worked example as a
 * document showing deterrence logic playing out in a real nuclear crisis.
 * Both quoted only as the short excerpts already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_COLD_WAR: LessonPlan = {
  id: 'evelyn.ap.apworld.cold-war-global.v1',
  title: 'U8.1-8.4 The Cold War as a Global Conflict',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.cold-war-global',
      description:
        'Explain how the Cold War organized the postwar world into rival ideological blocs, including the arms race and space race, and how proxy conflicts across Asia, Africa, and Latin America made it a genuinely global, and often violent, contest.',
      standard: 'AP-APWORLD-8.1',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.decolonization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Get the student to see the Cold War as a genuinely GLOBAL conflict — hot in much of the world even while the US and USSR never fired on each other directly.",
      script:
        "Textbooks sometimes call it a \"Cold\" War, as if the whole point was that nobody actually fought. From Washington's or Moscow's perspective, that's almost true — American and Soviet soldiers never fired on each other directly. But ask someone who lived through the fighting in Korea, or Vietnam, or Angola, or Afghanistan, and \"cold\" is the last word they'd use. The superpower rivalry organized nearly the entire postwar world into two competing blocs, armed both sides with weapons that could end civilization, and then fought its real, deadly battles almost everywhere EXCEPT between the two superpowers themselves. Today we're tracing how a rivalry that started in Europe became a truly global — and often very hot — conflict.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cold-war-global',
      kind: 'concept',
      goal: 'Explain the bipolar bloc system (NATO/Warsaw Pact), the globalization of containment beyond Europe, the major proxy conflicts, and the nuclear arms race/MAD and space race that defined the Cold War as a worldwide contest.',
      keyIdeas: [
        "A BIPOLAR WORLD: after 1945, the wartime US-Soviet alliance collapsed into a decades-long rivalry between an American-led, capitalist-democratic bloc and a Soviet-led, Communist bloc — each side treating the other's ideology as an existential threat to its own way of life.",
        "NATO (1949) AND THE WARSAW PACT (1955): the North Atlantic Treaty Organization committed the US and Western European allies to mutual defense, formalizing a permanent American military presence in Europe. The Soviet Union answered by organizing its Eastern European allies into the Warsaw Pact — locking the continent into two armed camps.",
        "CONTAINMENT WENT GLOBAL: the Truman Doctrine (1947) had committed the United States to support \"free peoples\" resisting subjugation, stated in universal terms rather than limited to the two countries (Greece and Turkey) it was written to help. Over the following decades, American policymakers treated that commitment as applying anywhere a Communist movement or Soviet-aligned government appeared to be gaining ground — not just in Europe.",
        "PROXY WARS MADE THE CONFLICT GLOBAL AND VIOLENT: because direct US-Soviet combat risked nuclear war, the superpowers instead backed opposing sides in conflicts across the decolonizing world — Korea (1950-53), Vietnam (with both direct US combat and Soviet/Chinese aid to the North), Angola (Cold-War-aligned factions after Portuguese decolonization, backed respectively by the US/South Africa and the USSR/Cuba), and Afghanistan (Soviet invasion in 1979 met by US-backed mujahideen resistance). These conflicts killed and displaced millions — the Cold War's real casualties were overwhelmingly outside the two superpowers' own territory.",
        "THE NUCLEAR ARMS RACE AND MAD: both superpowers built enormous nuclear arsenals capable of destroying each other (and much of the world) many times over. This produced MUTUALLY ASSURED DESTRUCTION (MAD) — the doctrine that neither side would launch a first nuclear strike because the other retained the capacity to respond with equally devastating force, making full-scale nuclear war a form of collective suicide for both sides.",
        "THE SPACE RACE: Cold War competition extended into space technology as a proxy for military and ideological superiority — the Soviet Union's 1957 Sputnik launch shocked American confidence and triggered a sustained US push (culminating in the 1969 Moon landing) to demonstrate technological and systemic superiority without firing a shot.",
        "THE RESULT: a rivalry organized around avoiding direct superpower combat still produced a genuinely global conflict — armed camps across Europe, a permanent nuclear standoff, a technological competition extending into space, and decades of proxy violence concentrated in Asia, Africa, and Latin America.",
      ],
      vocabulary: [
        {
          term: 'containment',
          definition:
            'the US Cold War strategy of resisting the spread of Communism wherever it appeared, applied globally after 1947 rather than limited to the European context it began in.',
        },
        {
          term: 'proxy war',
          definition:
            'a conflict in which two rival powers back opposing sides rather than fighting each other directly — the primary form Cold War violence took after 1945.',
        },
        {
          term: 'Mutually Assured Destruction (MAD)',
          definition:
            'the nuclear-era doctrine that neither superpower would launch a first strike because the other retained the capacity to respond with equally devastating force, making full-scale nuclear war effectively unwinnable for both sides.',
        },
        {
          term: 'NATO / Warsaw Pact',
          definition:
            "the rival mutual-defense alliances (US-led NATO, 1949; Soviet-led Warsaw Pact, 1955) that divided Europe into two armed camps for the duration of the Cold War.",
        },
      ],
      passageId: 'evelyn.passage.apush-truman-doctrine.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-jfk-cuba-quarantine',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from President Kennedy\'s address to the American people, October 22, 1962, announcing the discovery of Soviet missile sites in Cuba: "Neither the United States of America nor the world community of nations can tolerate deliberate deception and offensive threats on the part of any nation, large or small. We no longer live in a world where only the actual firing of weapons represents a sufficient challenge to a nation\'s security to constitute maximum peril. Nuclear weapons are so destructive and ballistic missiles are so swift, that any substantially increased possibility of their use or any sudden change in their deployment may well be regarded as a definite threat to peace. . . . First: To halt this offensive buildup, a strict quarantine on all offensive military equipment under shipment to Cuba is being initiated." Why does Kennedy choose a "quarantine" rather than a military strike, and what does that choice reveal about how nuclear weapons changed the logic of confrontation between the superpowers?',
      steps: [
        'SOURCE IT FIRST. Kennedy is speaking directly to the American public on live television and radio, October 22, 1962, after intelligence confirmed Soviet offensive missile sites under construction in Cuba, roughly 90 miles from Florida.',
        'IDENTIFY THE CLAIM ABOUT NUCLEAR STAKES. Kennedy explicitly states that "we no longer live in a world where only the actual firing of weapons" constitutes "maximum peril" — because nuclear weapons and missiles are so destructive and fast that even the threat of their deployment, not just their use, can count as "a definite threat to peace." This is a direct statement of the raised stakes MAD created: the danger begins well before any weapon is fired.',
        'IDENTIFY THE CHOSEN RESPONSE. Rather than a military strike on the missile sites (which risked immediate escalation to nuclear war), Kennedy announces "a strict quarantine on all offensive military equipment under shipment to Cuba" — a naval blockade intercepting further weapons shipments, not an attack on weapons already in place.',
        "CONNECT TO THE CONCEPT'S MAD LOGIC. A quarantine is a calibrated, non-military-strike response precisely because both superpowers understood that a direct clash risked uncontrollable escalation toward nuclear war, where neither side could truly \"win.\" Choosing the least escalatory option that still forced a Soviet response is exactly the kind of behavior MAD produces: high-stakes confrontation managed short of full combat.",
        'STATE THE LINK TO THE COURSE THESIS. This crisis is a real-world instance of the concept\'s central claim: nuclear weapons raised the cost of direct superpower conflict so high that even a crisis this serious over Cuba was resolved through a controlled, limited-escalation tool (a naval quarantine) rather than the kind of direct war that had settled great-power conflicts before 1945.',
      ],
      answer:
        'Kennedy explicitly frames the danger in nuclear terms — declaring that "we no longer live in a world where only the actual firing of weapons" constitutes "maximum peril," because nuclear weapons and missiles are so destructive and fast that even a "substantially increased possibility of their use" counts as "a definite threat to peace." Rather than striking the missile sites directly, he announces "a strict quarantine on all offensive military equipment under shipment to Cuba" — a naval blockade intercepting future shipments rather than an attack on weapons already in place. That choice reveals exactly the logic Mutually Assured Destruction produced: because a direct US-Soviet clash risked uncontrollable escalation toward a nuclear exchange neither side could survive, Kennedy chose the least escalatory tool that still forced a Soviet response, managing one of the Cold War\'s most dangerous crises short of full combat rather than through the kind of direct war that had settled earlier great-power conflicts.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE alliance system or military bloc that organized the Cold War\'s bipolar division. (b) Explain how ONE Cold War proxy conflict reflected the war\'s genuinely global reach. (c) Explain ONE way the nuclear arms race shaped how the superpowers actually behaved toward each other.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a genuine Cold War alliance/bloc system — e.g. NATO, the Warsaw Pact, or the broader US-led/Soviet-led bloc division. No credit for a vague statement ("the US and USSR were on different sides") with no specific alliance named.',
            modelResponse:
              'One alliance system was NATO (1949), which committed the United States and its Western European allies to mutual defense against the Soviet-led bloc.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific proxy conflict (Korea, Vietnam, Angola, or Afghanistan) and connects it clearly to the Cold War\'s global reach — that the superpowers backed opposing sides rather than fighting directly. No credit for a vague or unconnected example.',
            modelResponse:
              'The Korean War (1950-53) showed the Cold War\'s global reach: Communist North Korea, backed by the Soviet Union and China, invaded US-allied South Korea, and the resulting war was fought entirely by Korean, American, Chinese, and allied forces rather than by direct US-Soviet combat.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the nuclear arms race/MAD shaped superpower behavior — e.g. avoiding direct combat, choosing calibrated responses like a naval quarantine, or pursuing arms-control agreements. No credit for a vague or unsupported claim.',
            modelResponse:
              'Because both superpowers could destroy each other many times over (Mutually Assured Destruction), they avoided direct military confrontation even during a serious crisis: during the 1962 Cuban Missile Crisis, Kennedy chose a naval quarantine of Cuba rather than a military strike on the missile sites, a calibrated response designed to force a Soviet retreat without triggering the kind of escalation that could lead to nuclear war.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-cold-everywhere',
      kind: 'misconception_check',
      question:
        'True or false: the Cold War was "cold" everywhere — the superpower rivalry avoided real armed violence across the whole world, not just between the US and USSR themselves.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Overgeneralizing from the fact that the US and USSR never fought each other directly to the claim that the Cold War produced no real fighting anywhere — erasing the proxy wars that made the conflict genuinely violent across much of the decolonizing world.',
          correctsTo:
            "FALSE. The Cold War was \"cold\" specifically between the two superpowers, who never fought each other directly because of the risks nuclear weapons created. But that same avoidance of direct combat pushed the superpowers to fight through PROXIES instead — Korea (1950-53), Vietnam, Angola, and Afghanistan (from 1979) all saw large-scale, often prolonged violence fueled by opposing US and Soviet (or Soviet/Chinese) backing. Across the Third World, the Cold War was very hot indeed; \"cold\" describes only the absence of direct US-Soviet combat, not the absence of Cold-War-driven violence worldwide.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "NATO (1949) and the Warsaw Pact (1955) formalized Europe's division into two armed blocs after the wartime US-Soviet alliance collapsed.",
        "The Truman Doctrine (1947) stated containment in universal terms — \"free peoples\" anywhere — turning a European aid request into a global commitment applied across the decolonizing world.",
        "Proxy wars (Korea, Vietnam, Angola, Afghanistan) were where the Cold War's real violence happened, because direct US-Soviet combat risked uncontrollable nuclear escalation.",
        "Mutually Assured Destruction (MAD) meant both superpowers avoided direct war and instead managed crises — like the 1962 Cuban Missile Crisis — through calibrated tools like a naval quarantine.",
        "The Space Race (Sputnik 1957, Apollo) extended Cold War competition into technology as a proxy for ideological and military superiority.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.1-8.4',
    cedTitle: 'The Cold War as a Global Conflict',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-truman-doctrine.v1',
        chapter: '1947',
        note: 'Truman Doctrine address — anchor document for containment globalized beyond Europe (reused from the APUSH catalog).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-jfk-cuba.v1',
        chapter: '1962',
        note: "Kennedy's Cuban-quarantine address — anchor document for deterrence logic (MAD) in a real nuclear crisis.",
      },
    ],
  },
};
