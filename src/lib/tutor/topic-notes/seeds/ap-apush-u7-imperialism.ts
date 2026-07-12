/**
 * AP US History — Unit 7 CED 7.2-7.3: American Imperialism.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.imperialism.v1`. Covers the motives for expansion, the
 * Spanish-American and Philippine-American Wars, the Platt Amendment,
 * anti-imperialist opposition, the Open Door Policy, and the Panama Canal
 * — anchored by the Roosevelt Corollary (1904).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_IMPERIALISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.imperialism.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.2-7.3',
  cedTitle: 'American Imperialism',
  planId: 'evelyn.ap.apush.imperialism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.imperialism.v1' }],
  theory: [
    {
      loId: 'apush.imperialism',
      kind: 'framework',
      title: 'three motives for expansion',
      content:
        'Economic (new overseas markets and raw materials for mature American industry), strategic (Alfred Thayer Mahan\'s argument that great-power status required a modern navy and overseas coaling stations/bases), and ideological (social-Darwinist/Anglo-Saxonist "civilizing mission" rhetoric plus missionary impulse) combined to drive American overseas expansion.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'event',
      title: 'Hawaii (1893, 1898)',
      content:
        'American businessmen, backed by U.S. Marines, overthrew Queen Liliuokalani in 1893; the U.S. formally annexed Hawaii in 1898, gaining a valuable mid-Pacific naval and coaling station.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'event',
      title: 'the Spanish-American War (1898)',
      content:
        'A Cuban revolt against Spanish rule, sensationalized ("yellow") press coverage, and the unexplained explosion of the USS Maine in Havana harbor (February 1898) triggered a short war ending in decisive American victory within months.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'event',
      title: 'the Treaty of Paris (1898) and the Platt Amendment (1901)',
      content:
        'The peace treaty transferred Puerto Rico and Guam to the U.S. and ceded the Philippines for $20 million. Cuba was granted nominal independence but forced to accept the Platt Amendment, allowing U.S. intervention in Cuban affairs and a permanent U.S. naval base at Guantanamo Bay — real but sharply limited sovereignty.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'event',
      title: 'the Philippine-American War (1899-1902)',
      content:
        'Filipino nationalists under Emilio Aguinaldo, who had fought Spain expecting independence, fought a prolonged guerrilla war against American occupation. The U.S. prevailed and governed the Philippines as a colony until independence in 1946.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'framework',
      title: 'anti-imperialist opposition',
      content:
        'The American Anti-Imperialist League (Mark Twain, Andrew Carnegie, Samuel Gompers) argued colonial rule without the consent of the governed contradicted American founding principles. The Treaty of Paris passed the Senate narrowly in 1899 after a genuine political fight.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'definition',
      title: 'Open Door Policy (1899-1900)',
      content:
        'Secretary of State John Hay\'s notes asking other powers to preserve equal trading access to China (and later its territorial integrity), rather than the U.S. carving out its own formal Chinese colony — a preference for commercial access over direct colonial rule.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'event',
      title: 'Panama and the canal (1903, opened 1914)',
      content:
        'The U.S. backed a 1903 Panamanian revolt against Colombia (which had rejected canal terms), quickly recognized the new government, and secured rights to build the Panama Canal, opened in 1914.',
    },
    {
      loId: 'apush.imperialism',
      kind: 'definition',
      title: 'the Roosevelt Corollary (1904)',
      content:
        'TR\'s extension of the Monroe Doctrine, asserting the U.S. could exercise an "international police power" in the Western Hemisphere when "chronic wrongdoing" by a nation threatened stability — transforming a doctrine of exclusion (keeping Europe out) into one of assertive U.S. intervention.',
    },
  ],
  methods: [
    {
      title: 'Distinguish a document\'s stated rationale from what it enables in practice',
      when_to_use:
        'Use this when analyzing a policy document (like the Roosevelt Corollary) that frames an assertive or coercive power in careful, restrained-sounding language.',
      steps: [
        'Identify the specific power or authority the document claims.',
        'Note the restrained framing used to describe it (e.g. "however reluctantly," "in flagrant cases").',
        'Ask what earlier policy this extends or departs from, and in which direction (more restrictive or more assertive).',
        'State both the claimed rationale and the practical effect — do not accept the restrained framing as the whole story.',
      ],
      example: {
        problem: 'Roosevelt Corollary: "international police power" framed as a reluctant last resort.',
        solution:
          'The corollary transforms the Monroe Doctrine from exclusion (keeping Europe out) into assertive intervention (the U.S. stepping in), despite its restrained language — the U.S. invoked it repeatedly in the Caribbean and Central America afterward.',
      },
      relatedLoIds: ['apush.imperialism'],
    },
  ],
  pointers: [
    { content: 'Imperialism was NOT universally popular — the American Anti-Imperialist League (Twain, Carnegie, Gompers) organized real opposition, and the Treaty of Paris passed the Senate only narrowly (1899).', kind: 'common-error' },
    { content: 'The Platt Amendment (1901) limited, but did not eliminate, Cuban sovereignty — do not describe Cuba as either a full U.S. colony or a fully independent nation after 1901.', kind: 'edge-case' },
    { content: 'The Open Door Policy sought equal trading ACCESS to China, not a formal U.S. colony there — contrast with the Philippines, which WAS a formal U.S. colony.', kind: 'frq-vocab' },
    { content: 'Sequence: Spanish-American War (1898) -> Treaty of Paris/Platt Amendment (1898/1901) -> Philippine-American War (1899-1902) -> Open Door Notes (1899-1900) -> Panama (1903) -> Roosevelt Corollary (1904).', kind: 'tip' },
    { content: 'The Roosevelt Corollary extended the Monroe Doctrine from EXCLUDING Europe to justifying U.S. INTERVENTION — do not describe it as a simple restatement of the 1823 doctrine.', kind: 'tip' },
  ],
};
