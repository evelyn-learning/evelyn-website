/**
 * AP World History: Modern — CED Unit 8.9-8.10: The End of the Cold War.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). Covers the
 * multi-causal unraveling of the Cold War: the Sino-Soviet split fracturing
 * the assumption of one unified Communist bloc, détente's arms-control
 * interlude, the Afghanistan war draining Soviet resources and morale,
 * Gorbachev's glasnost/perestroika reforms, the 1989 cascade of Eastern
 * European revolutions, and the USSR's 1991 dissolution.
 *
 * Anchor text: a described photograph set on the Berlin Wall (1961-1989) —
 * evelyn.passage.apworld-berlin-wall-visual.v1 — wired in both the concept
 * (as the era's defining physical symbol) and the worked example (a close
 * read of what the Wall's opening does and does not prove about why the
 * Cold War ended).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_END_COLD_WAR: LessonPlan = {
  id: 'evelyn.ap.apworld.end-cold-war.v1',
  title: 'U8.9-8.10 The End of the Cold War',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.end-cold-war',
      description:
        'Explain the multiple causes of the Cold War\'s end, including the Sino-Soviet split, détente, the Afghanistan war, Gorbachev\'s reforms, the 1989 revolutions in Eastern Europe, and the 1991 dissolution of the Soviet Union.',
      standard: 'AP-APWORLD-8.9',
    },
  ],
  prerequisites: ['apworld.cold-war-global', 'apworld.new-states'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Cold War\'s end as a multi-causal unraveling, not a single military or diplomatic "victory."',
      script:
        "It's tempting to tell the end of the Cold War as a simple story: one side had more money and better weapons, so it won. That story leaves out almost everything that actually happened between 1985 and 1991. It leaves out a Communist world that had already fractured, with China and the USSR barely on speaking terms for decades. It leaves out a costly, decade-long Soviet war in Afghanistan that drained resources and morale before it drained Washington's. It leaves out a Soviet leader who tried to reform his own system and, in doing so, accidentally revealed how fragile it already was. And it leaves out millions of ordinary people in Eastern Europe who went out into the streets in 1989 and simply refused to keep living under the old order. Today we're tracing all of that — a genuinely multi-causal collapse, not a single knockout blow.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-end-of-cold-war',
      kind: 'concept',
      goal: "Explain the Sino-Soviet split, détente, the Afghanistan war's drain on the USSR, Gorbachev's reforms, the 1989 cascade, and the USSR's 1991 dissolution as multiple, interacting causes of the Cold War's end.",
      keyIdeas: [
        "THE SINO-SOVIET SPLIT: despite sharing a Communist ideology, the Soviet Union and the People's Republic of China developed sharp ideological disagreements and border tensions that became clearly visible by the 1960s, fracturing the assumption of one unified Communist bloc and complicating any simple story of a single, coordinated Communist adversary facing the West.",
        "DETENTE: from the late 1960s through the 1970s, US-Soviet relations entered a period of reduced tension, marked by direct diplomatic engagement (including Nixon's visits) and arms-control agreements such as SALT I (1972), limiting certain categories of nuclear weapons. Détente eased, but did not end, the underlying rivalry, and tensions later resurfaced.",
        "THE AFGHANISTAN DRAIN: the Soviet Union invaded Afghanistan in 1979 to prop up a friendly Communist government against a growing Islamist/mujahideen insurgency, which received substantial covert backing from the United States and others. The resulting decade-long war proved costly and difficult for Soviet forces, draining military resources and public morale well before the Soviet withdrawal in 1989 — a significant, if partial, cause of the broader Soviet decline.",
        "GORBACHEV'S REFORMS: Mikhail Gorbachev became Soviet General Secretary in 1985 facing a stagnating economy and introduced GLASNOST (\"openness,\" reducing censorship and political repression) and PERESTROIKA (\"restructuring,\" attempting to reform the centrally planned economy). Rather than stabilizing the system, these reforms exposed long-hidden economic weaknesses and, by loosening political control, opened space for criticism and dissent the system had previously suppressed.",
        "THE 1989 CASCADE: a wave of largely peaceful revolutions swept Communist Eastern Europe in 1989 — including Poland's Solidarity-led transition, Hungary, Czechoslovakia, and East Germany — as Gorbachev signaled the USSR would NOT use military force to prop up allied regimes, a sharp break from earlier Soviet interventions (Hungary 1956, Czechoslovakia 1968). The Berlin Wall opened on the night of November 9, 1989, after an East German government spokesman announced citizens could travel freely, becoming the era's defining symbolic moment.",
        "USSR DISSOLUTION (DECEMBER 1991): continuing economic strain, rising nationalist movements within Soviet republics, and a failed 1991 coup attempt against Gorbachev by hardliners together accelerated the Soviet Union's formal dissolution into fifteen independent states by the end of 1991.",
        "POST-COLD-WAR REALIGNMENTS: with bipolar rivalry over, the United States emerged as the world's sole superpower (often called a \"unipolar moment\"), Germany reunified, and the newly independent former Soviet republics and Eastern European states began reshaping the European and global order.",
        "MULTIPLE CAUSES, NOT ONE: the Cold War's end resulted from the interaction of several distinct pressures — a fractured Communist bloc (Sino-Soviet split), a costly war (Afghanistan), internal reform that exposed rather than fixed systemic weakness (Gorbachev), and organized popular movements in Eastern Europe (the 1989 revolutions) — not simply the West outspending or outlasting a static opponent.",
      ],
      vocabulary: [
        {
          term: 'glasnost / perestroika',
          definition:
            "Mikhail Gorbachev's paired reforms from 1985: glasnost (\"openness,\" reduced censorship/political repression) and perestroika (\"restructuring,\" attempted economic reform) — intended to strengthen the Soviet system but instead exposed its underlying weaknesses.",
        },
        {
          term: 'Sino-Soviet split',
          definition:
            'the ideological and border tensions between the Soviet Union and Communist China that became clearly visible by the 1960s, fracturing the assumption of a unified Communist bloc.',
        },
        {
          term: 'détente',
          definition:
            'a period of reduced US-Soviet tension from the late 1960s through the 1970s, marked by direct diplomacy and arms-control agreements such as SALT I (1972).',
        },
        {
          term: 'the 1989 cascade',
          definition:
            'the wave of largely peaceful revolutions across Communist Eastern Europe in 1989 (Poland, Hungary, Czechoslovakia, East Germany), enabled by Gorbachev\'s signal that the USSR would not use force to prop up allied regimes; culminated in the Berlin Wall opening on November 9, 1989.',
        },
      ],
      passageId: 'evelyn.passage.apworld-berlin-wall-visual.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-berlin-wall-visual',
      kind: 'worked_example',
      problem:
        'Consider this described photograph set from the Berlin Wall Memorial\'s exhibition: the first photograph, dated August 13, 1961, shows East German soldiers and police building the first barrier sealing the border between East and West Berlin overnight; the second shows the Checkpoint Charlie crossing point, with American and Soviet-bloc guard posts facing each other; the third, dated November 9, 1989, shows crowds of East and West Berliners standing atop the Wall near the Brandenburg Gate the night border guards opened the crossings, after an East German government spokesman announced citizens could travel freely. What does the THIRD photograph reveal about how the Cold War actually ended, and what would be a mistake to conclude from it?',
      steps: [
        'SOURCE IT FIRST. This is a set of documentary photographs from a museum exhibition on the Berlin Wall\'s history (1961-1989), not a narrative text — visual evidence of the Wall\'s construction, its function as a Cold War crossing point, and its opening.',
        'IDENTIFY WHAT THE THIRD PHOTOGRAPH SHOWS. Civilians — East and West Berliners together — stand atop the Wall near the Brandenburg Gate the night the crossings opened, following an East German government ANNOUNCEMENT that citizens could travel freely. The image shows a policy decision by an Eastern-bloc government, immediately followed by a mass civilian celebration, not a military breach or an external attack on the barrier.',
        'CONNECT TO GORBACHEV\'S SIGNAL. The East German government\'s decision to open the crossings only makes sense in light of Gorbachev\'s prior signal that the USSR would not intervene militarily to prop up allied regimes — a sharp break from 1956 Hungary or 1968 Czechoslovakia, when Soviet tanks enforced Communist rule. Without that signal, an East German government facing this kind of pressure might have responded very differently.',
        'IDENTIFY THE MISTAKE TO AVOID. It would be a mistake to read this photograph as evidence that "the West" militarily or diplomatically forced the Wall open, or that the Cold War ended through a Western victory in a contest of strength. The image shows an internal Eastern-bloc policy shift and a genuinely popular civilian response — evidence for the concept\'s multi-causal argument (Gorbachev\'s reforms plus organized Eastern European pressure), not a simple story of Western triumph.',
        'STATE THE LINK TO THE COURSE THESIS. The photograph is best read as visual confirmation that the Cold War\'s end involved internal Soviet-bloc decisions and popular movements as much as external pressure — precisely the multi-causal picture the concept lays out, rather than a one-sided victory narrative.',
      ],
      answer:
        'The third photograph shows East and West Berliners standing together atop the Wall the night the crossings opened, following an East German government announcement that citizens could travel freely — a policy decision from within the Eastern bloc, followed by a spontaneous civilian celebration, not a military breach of the barrier from outside. That sequence only makes sense against Gorbachev\'s earlier signal that the USSR would not use force to prop up allied regimes, a sharp break from the tank-enforced interventions in Hungary (1956) and Czechoslovakia (1968). It would be a mistake to read this image as proof that the West simply won a contest of strength: the photograph instead shows an internal Eastern-bloc policy shift responding to genuine popular pressure, which fits the concept\'s multi-causal explanation — Gorbachev\'s reforms, the Afghanistan drain, and organized Eastern European movements together — far better than a simple story of Western victory.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE reform Mikhail Gorbachev introduced in the Soviet Union. (b) Explain how ONE specific factor (besides that reform) contributed to the Cold War's end. (c) Explain ONE consequence of the Soviet Union's dissolution in 1991.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a genuine Gorbachev reform — glasnost (political openness) or perestroika (economic restructuring). No credit for a vague or incorrect item.',
            modelResponse:
              'One reform Gorbachev introduced was glasnost, a policy of greater political openness that reduced censorship and allowed more public criticism of the Soviet system than had previously been tolerated.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate additional factor in the Cold War's end distinct from the reform in (a) — e.g. the Sino-Soviet split, the Afghanistan war's drain on Soviet resources, or the 1989 Eastern European revolutions. No credit for restating (a) or for a vague, unconnected claim.",
            modelResponse:
              "The decade-long Soviet war in Afghanistan (from 1979), fought against a mujahideen insurgency backed by the United States, drained Soviet military resources and public morale well before Soviet forces withdrew in 1989, weakening the USSR's capacity and will to sustain its Cold War position.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate consequence of the 1991 Soviet dissolution — e.g. the creation of fifteen independent states, the end of bipolar rivalry and rise of a US "unipolar moment," or German reunification\'s broader European realignment. No credit for a vague or unsupported claim.',
            modelResponse:
              'One consequence of the 1991 Soviet dissolution was the emergence of fifteen newly independent states from former Soviet republics, replacing a single centralized Soviet government with a set of separate nations that had to establish their own political and economic systems.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-west-simply-won',
      kind: 'misconception_check',
      question:
        'True or false: the Cold War ended simply because the West, and the United States in particular, won a contest of military and economic strength against the Soviet Union.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Reducing a multi-causal collapse to a single external-victory narrative, ignoring the internal Soviet and Eastern European dynamics that were just as decisive.',
          correctsTo:
            "FALSE. The Cold War's end resulted from multiple interacting causes, many of them INTERNAL to the Soviet bloc. The Sino-Soviet split had already fractured the idea of one unified Communist adversary by the 1960s. The decade-long Afghanistan war (1979-1989) drained Soviet resources and morale well before Soviet withdrawal. Gorbachev's own reforms — glasnost and perestroika, intended to strengthen the Soviet system — instead exposed long-hidden economic weaknesses and opened space for dissent. And the 1989 revolutions across Eastern Europe were driven by organized popular movements (like Poland's Solidarity) seizing on Gorbachev's signal that the USSR would not intervene militarily, not by direct Western action. Soviet economic stagnation and Eastern European civil-society pressure were every bit as decisive as Western strength — treating the outcome as a simple Western \"win\" erases most of the actual causes.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Sino-Soviet split (visible by the 1960s) fractured the assumption of one unified Communist bloc well before the Cold War formally ended.',
        "The decade-long Soviet war in Afghanistan (1979-1989) drained Soviet resources and morale, a significant internal cause of Soviet decline.",
        "Gorbachev's glasnost and perestroika (from 1985) aimed to strengthen the Soviet system but instead exposed its underlying weaknesses and enabled open dissent.",
        'The 1989 cascade of Eastern European revolutions — culminating in the Berlin Wall opening on November 9, 1989 — succeeded because Gorbachev signaled the USSR would not intervene militarily, unlike in 1956 Hungary or 1968 Czechoslovakia.',
        'The USSR formally dissolved in December 1991 into fifteen independent states, driven by economic strain, nationalist movements, and a failed 1991 coup — a multi-causal ending, not a simple Western military or economic "victory."',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.9-8.10',
    cedTitle: 'The End of the Cold War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-berlin-wall-visual.v1',
        chapter: '1961-1989',
        note: "Berlin Wall photograph set — anchor document for the Cold War's multi-causal end, read against Gorbachev's non-intervention signal.",
      },
    ],
  },
};
