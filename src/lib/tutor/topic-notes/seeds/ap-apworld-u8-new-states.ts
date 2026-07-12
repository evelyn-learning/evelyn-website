/**
 * AP World History — Unit 8 CED 8.7-8.8: New States and Development
 * Strategies.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.new-states.v1`. Covers the Bandung Conference and
 * Non-Aligned Movement, varied development strategies, neocolonial-
 * dependency debates, and artificial-border conflicts.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U8_NEW_STATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.new-states.v1',
  course: 'AP World History',
  cedUnit: 8,
  cedTopic: '8.7-8.8',
  cedTitle: 'New States and Development Strategies',
  planId: 'evelyn.ap.apworld.new-states.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.new-states.v1' }],
  theory: [
    {
      loId: 'apworld.new-states',
      kind: 'event',
      title: 'the Bandung Conference (1955)',
      content:
        "Leaders from newly independent and colonized Asian and African nations met in Bandung, Indonesia, to articulate shared solidarity, oppose colonialism, and promote cooperation among Asian/African states outside the two Cold War blocs. The closing communique is described here, never quoted; it laid the groundwork for formal non-alignment.",
    },
    {
      loId: 'apworld.new-states',
      kind: 'definition',
      title: 'Non-Aligned Movement (NAM)',
      content:
        'Founded 1961, building on Bandung: a formal policy, embraced by leaders including Tito (Yugoslavia), Nehru (India), Nasser (Egypt), Sukarno (Indonesia), and Nkrumah (Ghana), of declining to join either the US-led or Soviet-led military alliance system — a deliberate "third path" through Cold War bipolarity.',
    },
    {
      loId: 'apworld.new-states',
      kind: 'event',
      title: "Nehru's planning and Nasser's Aswan Dam",
      content:
        "Nehru's India pursued state-directed Five-Year industrial planning, drawing partly on Soviet planning methods without joining the Soviet bloc. Nasser's Egypt nationalized the Suez Canal and pursued the Aswan High Dam as a flagship state-led development project, turning to Soviet financing/engineers after Western financing fell through.",
    },
    {
      loId: 'apworld.new-states',
      kind: 'definition',
      title: 'ujamaa',
      content:
        "Julius Nyerere's policy in Tanzania promoting communal, village-based agricultural collectivization, framed as a distinctly African form of socialism — a deliberate alternative to both Western and Soviet development models.",
    },
    {
      loId: 'apworld.new-states',
      kind: 'definition',
      title: 'import substitution industrialization (ISI) vs. export-led growth',
      content:
        'ISI: protecting domestic industry behind tariffs to reduce dependence on imported manufactured goods, pursued by many new states (especially Latin America). A smaller group of Asian economies later shifted toward export-led growth, manufacturing for global markets instead.',
    },
    {
      loId: 'apworld.new-states',
      kind: 'definition',
      title: 'neocolonialism',
      content:
        'A critique, popularized by Kwame Nkrumah, that formal political independence had not ended real economic dependency on former colonial powers and global markets — many new states still relied on exporting raw materials and importing foreign capital/manufactured goods.',
    },
    {
      loId: 'apworld.new-states',
      kind: 'event',
      title: 'the Nigerian Civil War / Biafra (1967-1970)',
      content:
        'Colonial-drawn borders grouped Nigeria\'s diverse ethnic/religious communities into a single state. When the Igbo-dominated southeast attempted to secede as the Republic of Biafra, the resulting war and humanitarian crisis produced a large death toll before the secession was defeated and Nigeria reunified.',
    },
    {
      loId: 'apworld.new-states',
      kind: 'cause',
      title: 'non-alignment in practice: a diplomatic, not economic, posture',
      content:
        'Non-alignment meant declining to join a FORMAL military alliance, not refusing aid from either superpower. Nasser accepted Soviet financing for the Aswan Dam while remaining formally non-aligned — new states routinely used Cold War rivalry as leverage to extract aid from both sides.',
    },
    {
      loId: 'apworld.new-states',
      kind: 'framework',
      title: 'the overall pattern',
      content:
        'New states pursued a genuine, if imperfectly held, alternative to bloc alignment while managing real development needs, inherited colonial borders, and constant pressure from both superpowers to take a side.',
    },
  ],
  methods: [
    {
      title: 'Resolve an apparent tension between two true facts about a new state\'s Cold War posture',
      when_to_use:
        'Use this when a prompt presents two seemingly contradictory facts about a new state (e.g. formally non-aligned, yet accepting superpower aid), before concluding one fact must be wrong.',
      steps: [
        'IDENTIFY THE APPARENT TENSION explicitly — state both facts plainly.',
        'RESOLVE IT BY DEFINING TERMS PRECISELY: non-alignment = no formal military alliance, NOT no contact with either superpower.',
        'IDENTIFY THE MECHANISM: how/why did the state accept aid from one side while avoiding formal bloc membership?',
        'CONNECT TO THE BROADER PATTERN: is this one example of a common non-aligned strategy (playing superpowers off each other for aid)?',
      ],
      example: {
        problem:
          "Egypt was a founding non-aligned state, yet Nasser accepted Soviet financing/engineers for the Aswan High Dam. How can both be true?",
        solution:
          'Non-alignment meant avoiding formal military alliance (NATO/Warsaw Pact), not refusing aid. When Western financing for Aswan fell through, Nasser turned to the USSR for financing/engineers while nationalizing the Suez Canal to help fund it — without joining the Warsaw Pact or hosting Soviet bases. This is the general non-aligned pattern: pragmatic aid acceptance from either side, formal bloc membership from neither.',
      },
      relatedLoIds: ['apworld.new-states'],
    },
  ],
  pointers: [
    { content: 'Non-alignment was a "third path," but an IMPERFECTLY held one — new states routinely accepted superpower aid while avoiding formal alliance. Don\'t equate "non-aligned" with "isolated from both blocs entirely." This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Keep Bandung (1955, conference) and NAM (1961, formal movement) as two separate but connected steps — Bandung came first and laid the groundwork.', kind: 'tip' },
    { content: 'Development strategies are not interchangeable on an SAQ: ISI (tariff-protected domestic industry) is not the same as export-led growth (manufacturing for global markets) — name the correct one for the state you\'re discussing.', kind: 'tip' },
    { content: 'Neocolonialism (Nkrumah\'s term) is about ECONOMIC dependency surviving political independence — a good answer for "challenges new states faced" prompts.', kind: 'frq-vocab' },
    { content: 'Nigeria/Biafra is a strong, specific example for "colonial borders caused conflict" prompts — keep the death-toll discussion measured, not graphic.', kind: 'tip' },
  ],
};
