/**
 * AP World History — Unit 1 CED 1.6: Developments in Medieval Europe.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.medieval-europe.v1`. Covers feudalism, manorialism,
 * Church-vs-monarch competition, the Magna Carta (1215) as a narrow
 * baronial limit on royal power, and the revival of towns/universities.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_MEDIEVAL_EUROPE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.medieval-europe.v1',
  course: 'AP World History: Modern',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Developments in Medieval Europe',
  planId: 'evelyn.ap.apworld.medieval-europe.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.medieval-europe.v1' }],
  theory: [
    {
      loId: 'apworld.medieval-europe',
      kind: 'definition',
      title: 'feudalism',
      content:
        'A decentralized system of reciprocal political and military obligation in which monarchs granted land (fiefs) to nobles in exchange for military service and loyalty, who could in turn grant land to lesser lords. Power radiated outward from a weak center rather than through a centrally-appointed bureaucracy.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'definition',
      title: 'manorialism',
      content:
        'A localized economic system in which peasants (many legally bound as serfs) worked a lord\'s manor land in exchange for protection and the right to farm a portion of land for themselves — a largely self-sufficient agrarian unit.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'definition',
      title: 'Magna Carta',
      content:
        'A 1215 charter English barons forced King John to accept, limiting royal power over taxation and justice. Primarily protected the feudal nobility ("freemen") and the Church, not the unfree peasantry or common population.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'event',
      title: 'political fragmentation by 1200',
      content:
        'Medieval Europe was politically fragmented into many competing, often small monarchies and principalities — a sharp contrast to the centralized bureaucratic states covered elsewhere in this unit (Song/Yuan China, the Mamluk and Delhi sultanates).',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'event',
      title: 'monarchs vs. the Church',
      content:
        'The medieval Catholic Church, headed by the Pope, held enormous independent political, economic (vast landholding), and cultural authority that rivaled and often checked royal power — kings and the Church repeatedly contested authority over appointments, taxation, and law.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'event',
      title: 'Magna Carta clause 12 (Avalon translation, quoted exactly)',
      content:
        '"No scutage not aid shall be imposed on our kingdom, unless by common counsel of our kingdom, except for ransoming our person, for making our eldest son a knight, and for once marrying our eldest daughter; and for these there shall not be levied more than a reasonable aid." Quoted exactly, including the source\'s own apparent transcription slip ("not" rather than "nor") — never silently corrected.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'event',
      title: 'revival of towns and universities',
      content:
        'From roughly the 11th-12th century onward, expanding trade grew merchant/artisan towns that won charters of self-governance. Universities (Paris, Oxford, Bologna) emerged as organized centers of higher learning, training clergy, lawyers, and administrators — Europe\'s own institutional counterpart to the madrasa networks and Confucian exam culture covered elsewhere in this unit.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'framework',
      title: 'comparison to centralized states',
      content:
        "Unlike Song/Yuan China's exam-selected bureaucracy and unified currency, or the Islamic world's shared ulama/madrasa network, medieval Europe's political power stayed fragmented among competing kings, nobles, and the Church — a genuinely different model, not a \"less advanced\" one, since towns and universities gave Europe its own distinct institutional track.",
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'trap',
      title: 'Magna Carta protected barons, not "the people"',
      content:
        'The "common counsel of our kingdom" clause 12 requires refers to the kingdom\'s great lords and higher clergy, not the peasantry bound under manorialism. Clause 39\'s "freemen" protection likewise excluded the unfree peasantry. Magna Carta is a baronial charter, not a declaration of universal rights.',
    },
    {
      loId: 'apworld.medieval-europe',
      kind: 'trap',
      title: 'Magna Carta did not establish democracy',
      content:
        'Magna Carta was a narrow, negotiated bargain between a king and his barons over taxation and justice — it said nothing about elections, representation, or rights for the common population. Broader rights developed centuries later as later generations reinterpreted specific clauses.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze a Magna Carta clause (HIPP), quoting exactly',
      when_to_use:
        'Use this on any Magna Carta clause before making a claim about what it limits or who it protects.',
      steps: [
        'H — HISTORICAL CONTEXT: a 1215 charter forced on King John by rebellious barons at Runnymede.',
        'Quote the clause EXACTLY as the source reads, including any apparent transcription slip — never silently correct wording.',
        'Identify precisely WHO is protected (e.g. "freemen," "common counsel of our kingdom" = barons/clergy) versus who is excluded (the unfree peasantry).',
        'Connect the specific limit (on taxation or justice) to the concept\'s claim about fragmented, negotiated royal power.',
        'Weigh reliability: a negotiated legal-political bargain, not a philosophical rights statement.',
      ],
      example: {
        problem: 'What does clause 12\'s "no scutage not aid... unless by common counsel of our kingdom" limit, and who benefits?',
        solution:
          'It limits King John\'s ability to impose scutage/feudal aids without the consent of the kingdom\'s barons and higher clergy ("common counsel") except for three named traditional occasions. The beneficiaries are the feudal nobility, not the general population — direct evidence of a fragmented, negotiated model of royal power.',
      },
      relatedLoIds: ['apworld.medieval-europe'],
    },
  ],
  pointers: [
    { content: 'Quote Magna Carta clause 12 EXACTLY as the Avalon translation reads — "No scutage not aid" — never silently correct it to "nor."', kind: 'gotcha' },
    { content: 'Magna Carta protected "freemen" and the baronial/clerical "common counsel" — not the unfree peasantry bound under manorialism. Never call it a democratic document.', kind: 'trap' },
    { content: 'Feudalism (political/military obligation) and manorialism (local economic organization) are DIFFERENT systems — don\'t conflate them on an SAQ.', kind: 'tip' },
    { content: 'The Church\'s independent authority is a THIRD source of fragmentation alongside feudal nobles — don\'t forget it when explaining why no European monarch was as centralized as a Yuan emperor.', kind: 'tip' },
    { content: 'Towns and universities are Europe\'s own institutional revival — a good comparison point to the madrasa network (Dar al-Islam) or the exam system (China) on a complexity-focused FRQ.', kind: 'frq-vocab' },
  ],
};
