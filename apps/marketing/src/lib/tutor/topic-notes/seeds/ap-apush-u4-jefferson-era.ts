/**
 * AP US History — Unit 4 CED 4.2-4.4: The Age of Jefferson.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.jefferson-era.v1`. Covers the Revolution of 1800,
 * Jefferson's strict-constructionist creed against his actual governing
 * record, the Marshall Court, the Louisiana Purchase, the embargo, the
 * War of 1812, the Era of Good Feelings, the Monroe Doctrine, and the
 * Missouri Compromise.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_JEFFERSON_ERA: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.jefferson-era.v1',
  course: 'AP United States History',
  cedUnit: 4,
  cedTopic: '4.2-4.4',
  cedTitle: 'The Age of Jefferson',
  planId: 'evelyn.ap.apush.jefferson-era.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.jefferson-era.v1' }],
  theory: [
    {
      loId: 'apush.jefferson-era',
      kind: 'event',
      title: 'the "Revolution of 1800"',
      content:
        "Jefferson's election over incumbent John Adams marked the first peaceful transfer of power between rival political parties. His inaugural address downplayed the campaign's bitterness, insisting \"We are all Republicans, we are all Federalists\" — framing the transition as a return to union rather than a partisan conquest.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'definition',
      title: 'strict construction',
      content:
        "the interpretive view that the federal government may exercise only powers explicitly granted by the Constitution — Jefferson's stated creed as a candidate, though his own presidency (especially the Louisiana Purchase) departed from it in practice.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'framework',
      title: "creed vs. practice",
      content:
        'Jefferson\'s inaugural stated an ideal of restrained, "frugal Government"; his actual record shows that ideal repeatedly bending to pragmatic decisions once he held office — the single most testable tension in this topic.',
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'definition',
      title: 'judicial review',
      content:
        "power established by Marbury v. Madison (1803): the Supreme Court can strike down acts of Congress or the executive it finds unconstitutional. Ironically decided against the Jefferson administration's immediate interest while cementing the Court's long-term authority.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'event',
      title: 'McCulloch v. Maryland (1819)',
      content:
        "Marshall Court ruling upholding the national bank's constitutionality under loose construction and holding states could not tax federal institutions — reinforcing federal supremacy over the states.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'event',
      title: 'the Louisiana Purchase (1803)',
      content:
        "Jefferson bought the Louisiana Territory from France for roughly $15 million, doubling U.S. territory and securing the Mississippi River and New Orleans. No explicit constitutional provision authorized acquiring foreign territory; Jefferson privately acknowledged the problem but proceeded given the strategic opportunity.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'cause',
      title: 'the embargo and the War of 1812',
      content:
        "the Embargo Act (1807) tried to punish Britain and France by halting American exports — it devastated the American economy (especially New England) far more than it hurt Europe. Continued British impressment and trade interference led to the War of 1812 (1812-1815), which ended in stalemate (Treaty of Ghent, 1814, restored prewar boundaries) but produced a surge of American nationalism.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'event',
      title: 'the Era of Good Feelings and the Monroe Doctrine',
      content:
        "the postwar collapse of the Federalist Party left Monroe's Democratic-Republicans dominant (1817-1825), reducing overt partisan conflict. In 1823, Monroe's annual message declared the Americas closed to future European colonization and warned that European interference in the hemisphere would be viewed as a threat to the United States — despite the young nation's still-limited military power to enforce it.",
    },
    {
      loId: 'apush.jefferson-era',
      kind: 'event',
      title: 'the Missouri Compromise (1820)',
      content:
        'Henry Clay\'s compromise admitted Missouri as a slave state and Maine as a free state (preserving the Senate\'s balance) and prohibited slavery north of 36°30\' latitude in the remaining Louisiana Territory. Jefferson, by then retired, privately called the crisis "a fire bell in the night" — a warning of deeper sectional conflict the compromise only postponed.',
    },
  ],
  methods: [
    {
      title: "Check a leader's stated creed against their governing record",
      when_to_use:
        'Use whenever a question asks you to evaluate consistency between a politician\'s stated philosophy (as a candidate or in a founding speech) and their actual policy decisions in office.',
      steps: [
        'STATE THE CREED — name the specific stated principle (e.g. strict construction, frugal government).',
        'FIND A CONCRETE DECISION that tests the creed — a specific policy or purchase the leader actually made.',
        'CHECK WHETHER THE DECISION FOLLOWED OR DEPARTED FROM THE CREED, and note any acknowledgment (public or private) of the tension.',
        'EXPLAIN WHY THE LEADER MADE THE CHOICE THEY DID — usually a practical or strategic reason that outweighed the stated principle in that specific case.',
      ],
      example: {
        problem: "Did Jefferson govern as a strict constructionist?",
        solution:
          "Jefferson campaigned on strict construction but purchased the Louisiana Territory (1803) with no explicit constitutional authorization for acquiring foreign land — a decision he privately doubted was authorized but pursued because of its strategic value (doubling U.S. territory, securing the Mississippi and New Orleans). Creed and practice diverged once the presidency's practical demands took over.",
      },
      relatedLoIds: ['apush.jefferson-era'],
    },
  ],
  pointers: [
    { content: 'Do not assume a candidate\'s stated philosophy predicts every decision in office — the Louisiana Purchase is the textbook counterexample to Jefferson\'s strict-construction creed.', kind: 'trap' },
    { content: 'Marbury v. Madison (1803) established judicial review; McCulloch v. Maryland (1819) upheld the bank and federal supremacy over states — keep the two Marshall Court rulings and their distinct holdings straight.', kind: 'tip' },
    { content: 'The War of 1812 ended in a stalemate (status quo boundaries), not a decisive American victory — but it still produced a nationalist surge that shaped the Era of Good Feelings.', kind: 'trap' },
    { content: 'The Monroe Doctrine (1823) was a bold declaration the U.S. could not yet fully enforce militarily — know it as an assertion of principle, not evidence of American military dominance at the time.', kind: 'tip' },
    { content: 'The Missouri Compromise (1820) preserved Senate balance and drew the 36°30\' line — treat it as a postponement of the slavery conflict, not a resolution.', kind: 'tip' },
  ],
};
