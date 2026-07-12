/**
 * AP World History — Unit 6 CED 6.1-6.2: Ideologies and Tools of Imperial
 * Expansion.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.imperial-expansion.v1`. Covers the civilizing-mission
 * and Social Darwinist ideologies used to justify formal imperial
 * expansion, the technological tools (quinine, steamships, the Maxim gun)
 * that enabled it, the Scramble for Africa and the Berlin Conference's
 * regulatory role, and India's transition from Company rule to the Raj,
 * 1750-1900.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U6_IMPERIAL_EXPANSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.imperial-expansion.v1',
  course: 'AP World History',
  cedUnit: 6,
  cedTopic: '6.1-6.2',
  cedTitle: 'Ideologies and Tools of Imperial Expansion',
  planId: 'evelyn.ap.apworld.imperial-expansion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.imperial-expansion.v1' }],
  theory: [
    {
      loId: 'apworld.imperial-expansion',
      kind: 'definition',
      title: 'civilizing mission',
      content:
        'The ideological claim that colonizing powers had a paternalistic duty to govern, Christianize, and "improve" colonized peoples — reframing conquest and rule as a service performed FOR, not a taking from, the colonized. Kipling\'s "The White Man\'s Burden" (1899) is the era\'s most widely read statement of this argument.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'definition',
      title: 'Social Darwinism',
      content:
        'A misapplication of Darwin\'s biological theory of natural selection to nations and "races," framing imperial conquest as evidence of the conquering power\'s natural fitness to dominate — a pseudo-scientific gloss on what was, in reality, a political choice.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'definition',
      title: 'effective occupation',
      content:
        "The Berlin Conference's requirement (Chapter VI, Articles 34-35, 1885) that a European power's claim to African coastal territory be recognized by other signatory powers only if backed by actual, notified administrative presence — not merely a declared claim on paper.",
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'event',
      title: 'Kipling, "The White Man\'s Burden" (1899)',
      content:
        'A primary source OF civilizing-mission ideology, not an endorsement of it: urges the reader to "Take up the White Man\'s burden" and "seek another\'s profit, / And work another\'s gain," while describing colonized peoples as "new-caught, sullen peoples, / Half-devil and half-child." Written to urge the United States to take up colonial rule in the Philippines after the Spanish-American War. Read critically as evidence of the era\'s paternalistic, racialized ideology.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'event',
      title: 'tools of empire',
      content:
        'Quinine (from cinchona bark) let Europeans survive prolonged malaria exposure, removing the disease barrier that had confined earlier presence to African coasts; steamships (including shallow-draft river steamers) enabled inland penetration along rivers like the Congo and Niger; the Maxim gun (1880s, the first practical rapid-fire machine gun) gave small European forces a decisive firepower advantage over much larger armies.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'event',
      title: 'Scramble for Africa (c. 1881-1914)',
      content:
        'The rapid partition of nearly the entire African continent among European powers — by 1914 only Ethiopia and Liberia remained outside formal European control. Driven by industrial-era competition for materials/markets, national prestige rivalries, and the civilizing-mission/Social-Darwinist ideologies providing public justification.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'event',
      title: 'Berlin Conference (1884-85)',
      content:
        'Hosted by Bismarck; NO African ruler or representative was present or party to it. Set rules AMONG European powers: Article 5 barred trade monopolies in the Congo basin; Articles 34-35 required "effective occupation" (real, notified administrative presence) before a new African coastal claim would be recognized by rivals — regulating the pace and manner of the Scramble, not authorizing it morally.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'event',
      title: 'India: Company to Raj',
      content:
        "The British East India Company ruled large parts of India as a chartered commercial company for a century before the 1857 Sepoy Rebellion. In 1858 the British Crown dissolved Company rule and assumed direct governmental control — the Raj — illustrating one path to \"new imperialism\": a commercial presence hardening into direct formal rule.",
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'framework',
      title: 'colonies of rule vs. settler colonies',
      content:
        'Colonies of rule (India, most of tropical Africa) were administered/extractive with limited permanent European settlement. Settler colonies (e.g. French Algeria, British Kenya highlands) saw substantial permanent European populations settle on and often expropriate land, marginalizing indigenous populations beyond administrative extraction alone.',
    },
    {
      loId: 'apworld.imperial-expansion',
      kind: 'trap',
      title: 'technology was necessary, not sufficient',
      content:
        "Tools of empire (quinine, steamships, the Maxim gun) explain HOW small forces could conquer quickly, but not the full story: African/Asian political fragmentation and local alliances with European forces (for rivalry or advantage of their own) were just as essential to how conquest actually proceeded region by region.",
    },
  ],
  methods: [
    {
      title: 'Source and analyze a treaty/regulatory document (HIPP, no African/Asian party)',
      when_to_use:
        'Use this on any imperial-era regulatory document (e.g. the Berlin Act) before claiming what it shows about relations between colonizers and the colonized.',
      steps: [
        'H — HISTORICAL CONTEXT: who signed it, when, and who was NOT present or party to it?',
        'I — INTENDED AUDIENCE: who is the document addressed to or binding upon?',
        'P — PURPOSE: state the purpose as a verb (regulate, notify, recognize) — what the document does among its signatories.',
        'P — POINT OF VIEW / SCOPE: what can this document tell you, and what can it NOT tell you (e.g. consent or awareness of parties excluded from it)?',
        'CONNECT TO A CAUSE: tie the clause back to the ideological or competitive dynamic it regulates (e.g. inter-European rivalry, not colonizer-colonized relations).',
      ],
      example: {
        problem:
          'Analyze the Berlin Act\'s Article 5 (free trade in the Congo basin) and Articles 34-35 ("effective occupation"). What does this reveal, and what can it NOT tell you?',
        solution:
          'Historical context: signed 1885 by fourteen powers including the Ottoman Empire; no African government present. Purpose: to regulate competition AMONG signatories (free trade rule, notification-and-real-presence requirement for new claims). Scope: the document cannot show African consent or participation, since no African polity was party to it. Connecting to cause: "effective occupation" explains why the Scramble accelerated so sharply after 1885 — unbacked claims no longer held against rivals.',
      },
      relatedLoIds: ['apworld.imperial-expansion'],
    },
  ],
  pointers: [
    { content: 'Kipling\'s "White Man\'s Burden" is a primary source OF imperial ideology (critical distance) — never cite it as an accurate description of colonized peoples or of what colonial rule actually did.', kind: 'trap' },
    { content: '"Technology alone" is an incomplete explanation for the speed of conquest — always pair tools of empire (quinine, steamships, Maxim gun) with political fragmentation/local alliances on an FRQ.', kind: 'trap' },
    { content: 'The Berlin Conference regulated European powers AMONG THEMSELVES — no African ruler or state was present. Don\'t describe it as governing colonizer-colonized relations.', kind: 'tip' },
    { content: 'India\'s Company-to-Raj shift (1857-58) is a clean example of "new imperialism" hardening from commercial presence into direct formal rule — useful for a comparative/causation prompt.', kind: 'tip' },
    { content: 'Distinguish colonies of rule (administrative/extractive, e.g. India) from settler colonies (large permanent European populations, e.g. Algeria, Kenya highlands) — different mechanisms of dispossession.', kind: 'tip' },
  ],
};
