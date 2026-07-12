/**
 * AP World History — Unit 8 CED 8.5-8.6: Decolonization.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.decolonization.v1`. Covers why decolonization
 * accelerated after 1945 and how it produced contrasting paths — negotiated
 * (Ghana), violent (Algeria, Kenya), Cold-War-entangled (Vietnam) — plus
 * India/Pakistan's partition and the Suez Crisis as imperial twilight.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U8_DECOLONIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.decolonization.v1',
  course: 'AP World History',
  cedUnit: 8,
  cedTopic: '8.5-8.6',
  cedTitle: 'Decolonization',
  planId: 'evelyn.ap.apworld.decolonization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.decolonization.v1' }],
  theory: [
    {
      loId: 'apworld.decolonization',
      kind: 'cause',
      title: 'why decolonization accelerated after 1945',
      content:
        "WWII left Britain and France economically exhausted and militarily overextended, undermining their ability to hold overseas territory by force; wartime rhetoric about self-determination and the new UN's founding principles made colonial rule harder to justify; decades-old nationalist movements within the colonies had grown stronger and more organized.",
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: 'India/Pakistan partition (August 1947)',
      content:
        'Britain granted independence to British India but partitioned it into India (Hindu-majority) and Pakistan (Muslim-majority) along largely religious lines. Measured estimates: roughly one million deaths and about fifteen million displaced in communal violence and mass migration — the era\'s largest single population transfer.',
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: "Gandhi and Nehru in India's independence movement",
      content:
        "Mohandas Gandhi led decades of mass, deliberately nonviolent civil-disobedience campaigns against British rule, building the nationalist pressure that made continued British control increasingly untenable. Jawaharlal Nehru, a close political ally within the Indian National Congress, became independent India's first Prime Minister.",
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: "Ghana's negotiated path (1957)",
      content:
        'Under Kwame Nkrumah, the Gold Coast pursued independence primarily through political organizing, strikes, and negotiation with Britain rather than sustained armed conflict — becoming Ghana in 1957, the first sub-Saharan African colony to gain independence, and a model other movements looked to.',
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: "Algeria's violent path (1954-1962)",
      content:
        "France treated Algeria as an integral part of French territory, with a large settler population resisting concessions. The FLN waged a prolonged, brutal war for independence, achieved in 1962 only after severe costs on both sides.",
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: 'Kenya (Mau Mau uprising) and Indonesia',
      content:
        "Kenya: the Mau Mau uprising (1950s) was an armed anti-colonial rebellion against British rule and settler land policy, suppressed forcefully (including mass detention) before independence in 1963. Indonesia: nationalists declared independence in 1945 after Japan's WWII occupation ended Dutch control; the Netherlands resisted before international pressure secured recognition in 1949.",
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: "Vietnam's Cold-War-entangled path",
      content:
        'Vietnamese nationalists defeated France at Dien Bien Phu (1954), ending French colonial control — but the country was then divided, and the North-South conflict became one of the Cold War\'s defining proxy wars, showing decolonization and superpower rivalry could be inseparable.',
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: 'the Suez Crisis (1956)',
      content:
        "After Nasser nationalized the Suez Canal, Britain, France, and Israel intervened militarily to retake it, but US and Soviet pressure forced their withdrawal — publicly demonstrating Britain and France could no longer act as independent great powers, a symbolic marker of imperial decline.",
    },
    {
      loId: 'apworld.decolonization',
      kind: 'event',
      title: 'the 1960 "Year of Africa" (UN membership data)',
      content:
        'UN membership rose from 51 (1945) to 189 (2000), rising every interval. The single largest one-year jump was 1960 (82 -> 99, +17), 16 of the 17 new members newly independent African states (the 17th, Cyprus) — quantitative evidence of decolonization\'s accelerating pace.',
    },
    {
      loId: 'apworld.decolonization',
      kind: 'framework',
      title: 'same cause, different paths',
      content:
        'The SAME broad cause (weakened empires + rising nationalism + a less colonialism-tolerant order) produced sharply different processes depending on whether the colonial power was willing to negotiate, whether a settler population resisted concessions, and whether a Cold War superpower saw strategic stakes.',
    },
    {
      loId: 'apworld.decolonization',
      kind: 'trap',
      title: 'a membership count shows outcome, not process',
      content:
        'The UN membership table proves precisely WHEN and HOW MANY new states joined — powerful evidence of pace — but says nothing about HOW independence was achieved (negotiated vs. violent) in any individual case.',
    },
  ],
  methods: [
    {
      title: 'Read a decolonization-era quantitative document (data table)',
      when_to_use:
        'Use this before making any claim about decolonization\'s pace or causes from a table/roster document (e.g. the UN membership table), rather than a narrative primary source.',
      steps: [
        'IDENTIFY THE DOCUMENT TYPE: a quantitative record (counts over time), not a narrative — it can show scale/timing precisely but nothing about process.',
        'IDENTIFY THE HEADLINE PATTERN: is growth smooth, or concentrated in a spike?',
        'IDENTIFY WHAT DROVE ANY SPIKE: cross-reference the spike\'s date/composition against known historical events (e.g. 1960 and African independence).',
        'WEIGH WHAT THE DOCUMENT CANNOT SHOW: a count proves an outcome occurred, not the process (negotiation vs. violence) that produced it.',
      ],
      example: {
        problem:
          'UN membership: 51 (1945) -> 82 -> 99 (1960, +17, 16 African states + Cyprus) -> 189 (2000). What does this reveal, and what can\'t it prove?',
        solution:
          'The 1960 spike is strong quantitative confirmation that African decolonization accelerated dramatically around 1960 (the "Year of Africa"). It cannot show HOW each of those 16 states achieved independence — some negotiated, like Ghana\'s neighbors; others involved more violence. A count is evidence of outcome, not process.',
      },
      relatedLoIds: ['apworld.decolonization'],
    },
  ],
  pointers: [
    { content: 'Independence did NOT come the same way everywhere — Ghana (negotiated) vs. Algeria/Kenya (violent) vs. Vietnam (Cold-War-entangled) vs. India/Pakistan (negotiated transfer, violent partition). This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Partition (India/Pakistan) and independence itself are distinguishable: the transfer of sovereignty was negotiated, but the accompanying communal violence (~1M deaths, ~15M displaced) was not.', kind: 'tip' },
    { content: 'The Suez Crisis (1956) is a good "imperial decline" answer for an LEQ/DBQ — it shows superpower (not just anti-colonial) pressure ending a colonial-style intervention.', kind: 'tip' },
    { content: 'Gandhi, Nehru, and Nkrumah should be described in your own words on an FRQ, never quoted — none of their speeches/writings are in the public domain.', kind: 'gotcha' },
    { content: 'Keep dates straight: Ghana 1957, Suez 1956, "Year of Africa" 1960, Algerian independence 1962 — Ghana comes BEFORE the big 1960 wave, not after it.', kind: 'tip' },
  ],
};
