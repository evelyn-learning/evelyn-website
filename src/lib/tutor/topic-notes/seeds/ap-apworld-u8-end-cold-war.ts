/**
 * AP World History — Unit 8 CED 8.9-8.10: The End of the Cold War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.end-cold-war.v1`. Covers the Sino-Soviet split,
 * détente, the Afghanistan drain, Gorbachev's reforms, the 1989 cascade,
 * and the USSR's 1991 dissolution as multiple, interacting causes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U8_END_COLD_WAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.end-cold-war.v1',
  course: 'AP World History',
  cedUnit: 8,
  cedTopic: '8.9-8.10',
  cedTitle: 'The End of the Cold War',
  planId: 'evelyn.ap.apworld.end-cold-war.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.end-cold-war.v1' }],
  theory: [
    {
      loId: 'apworld.end-cold-war',
      kind: 'event',
      title: 'the Sino-Soviet split',
      content:
        "Despite sharing a Communist ideology, the USSR and China developed sharp ideological and border tensions clearly visible by the 1960s, fracturing the assumption of one unified Communist bloc.",
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'definition',
      title: 'détente',
      content:
        'A period of reduced US-Soviet tension from the late 1960s through the 1970s, marked by direct diplomacy (Nixon\'s visits) and arms-control agreements like SALT I (1972). Eased, but did not end, the underlying rivalry.',
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'cause',
      title: 'the Afghanistan drain',
      content:
        'The USSR invaded Afghanistan in 1979 to prop up a friendly Communist government against a mujahideen insurgency backed by the US and others. The resulting decade-long war drained Soviet military resources and morale before the 1989 withdrawal — a significant cause of Soviet decline.',
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'definition',
      title: 'glasnost / perestroika',
      content:
        "Gorbachev's paired reforms from 1985: glasnost (\"openness,\" reduced censorship) and perestroika (\"restructuring,\" attempted economic reform). Intended to strengthen the Soviet system, they instead exposed long-hidden weaknesses and opened space for dissent.",
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'event',
      title: 'the 1989 cascade',
      content:
        "A wave of largely peaceful revolutions swept Communist Eastern Europe in 1989 (Poland's Solidarity, Hungary, Czechoslovakia, East Germany), enabled by Gorbachev's signal that the USSR would NOT intervene militarily — unlike 1956 Hungary or 1968 Czechoslovakia. The Berlin Wall opened the night of November 9, 1989.",
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'event',
      title: 'the Berlin Wall opening (visual evidence)',
      content:
        'The Wall\'s opening followed an East German GOVERNMENT ANNOUNCEMENT that citizens could travel freely, then a spontaneous civilian celebration — an internal Eastern-bloc policy shift responding to popular pressure, not a military breach from outside.',
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'event',
      title: 'USSR dissolution (December 1991)',
      content:
        'Continuing economic strain, rising nationalist movements within Soviet republics, and a failed 1991 coup attempt against Gorbachev together accelerated the Soviet Union\'s formal dissolution into fifteen independent states.',
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'event',
      title: 'post-Cold-War realignments',
      content:
        'With bipolar rivalry over, the US emerged as the sole superpower (a "unipolar moment"), Germany reunified, and newly independent former Soviet republics and Eastern European states began reshaping the European and global order.',
    },
    {
      loId: 'apworld.end-cold-war',
      kind: 'framework',
      title: 'multiple causes, not one',
      content:
        'The Cold War\'s end resulted from interacting pressures — a fractured Communist bloc (Sino-Soviet split), a costly war (Afghanistan), reform that exposed rather than fixed systemic weakness (Gorbachev), and organized popular movements (1989) — not simply the West outspending or outlasting a static opponent.',
    },
  ],
  methods: [
    {
      title: 'Read a described visual document (photograph set) for what it does and does not prove',
      when_to_use:
        'Use this before concluding what a Cold War-era photograph set (e.g. the Berlin Wall images) shows about causation, rather than just describing its content.',
      steps: [
        'IDENTIFY WHAT THE IMAGE ACTUALLY SHOWS: who is depicted, and what action/decision triggered the moment captured?',
        'CONNECT TO THE PRECEDING POLICY CONTEXT: what decision or signal (e.g. a government announcement, a leader\'s prior policy shift) made this moment possible?',
        'IDENTIFY THE TEMPTING BUT WRONG READING: what simple, one-sided causal story would a viewer be tempted to draw from the image alone?',
        'STATE THE MULTI-CAUSAL CORRECTION: connect the image instead to the several interacting causes the concept actually identifies.',
      ],
      example: {
        problem:
          'The Berlin Wall\'s November 9, 1989 photograph shows civilians celebrating atop the Wall after an East German government announcement. What does this show about how the Cold War ended?',
        solution:
          'It shows an internal Eastern-bloc policy decision (the announcement) followed by genuine popular celebration — not a military breach from outside. That sequence only makes sense given Gorbachev\'s prior non-intervention signal. It would be a mistake to read this as proof the West "won"; it is evidence for the multi-causal explanation (Gorbachev\'s reforms + Eastern European popular pressure).',
      },
      relatedLoIds: ['apworld.end-cold-war'],
    },
  ],
  pointers: [
    { content: 'The Cold War did not end because "the West simply won" — Soviet internal economics (perestroika exposing weakness), the Afghanistan drain, and Eastern European popular movements (1989) were all decisive too. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Keep the Sino-Soviet split (visible by the 1960s) and the Cold War\'s END (1989-1991) as SEPARATE events on a timeline — the split fractured "the Communist bloc" decades before the Cold War itself ended.', kind: 'tip' },
    { content: 'Glasnost = political openness; perestroika = economic restructuring. Don\'t swap the two terms on an SAQ.', kind: 'frq-vocab' },
    { content: 'Gorbachev\'s non-intervention signal (vs. 1956 Hungary/1968 Czechoslovakia, where Soviet tanks enforced Communist rule) is the specific mechanism connecting his reforms to the 1989 cascade — name it, don\'t just say "reforms happened."', kind: 'tip' },
    { content: 'Dates: Berlin Wall opens Nov 9, 1989; USSR dissolves Dec 1991 — these are TWO YEARS apart, not the same event.', kind: 'gotcha' },
  ],
};
