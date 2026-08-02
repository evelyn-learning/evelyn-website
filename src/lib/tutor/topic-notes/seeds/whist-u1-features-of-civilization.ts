/**
 * World History — Unit 1 CED 1.2: What Makes a Civilization?.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.whist.features-of-civilization.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_WHIST_U1_FEATURES_OF_CIVILIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.whist.features-of-civilization.v1',
  course: 'World History',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'What Makes a Civilization?',
  planId: 'evelyn.hs.whist.features-of-civilization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.whist.features-of-civilization.v1' }],
  theory: [
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'Surplus comes first', content: `SURPLUS COMES FIRST — after the Neolithic Revolution, irrigated river-valley farming (the Tigris and Euphrates, the Nile, the Indus, the Yellow River) produced more grain than the growers needed. Surplus is the precondition for everything else on this list: it buys the labor of people who do not grow food.` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'The standard checklist', content: `THE STANDARD CHECKLIST — historians usually look for eight features: cities, organized government, an organized religion, job specialization, social classes, writing or record-keeping, public works, and distinctive art and architecture. They appear together because each one depends on stored surplus and on the others.` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'A city is not just a big village', content: `A CITY IS NOT JUST A BIG VILLAGE — Uruk in Mesopotamia held perhaps 40,000 people by about 3100 BCE, and most of them were strangers to each other. Strangers living densely need something a village does not: written rules, courts, markets, and officials. Density drives institutions.` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'Writing was invented for accounting, not literature', content: `WRITING WAS INVENTED FOR ACCOUNTING, NOT LITERATURE — the earliest cuneiform tablets from Sumer (c. 3200 BCE) are receipts for barley, beer, and sheep. Epics and law codes such as Hammurabi’s (c. 1750 BCE) come centuries later. Common student error: assuming writing started with stories. It started with somebody counting other people’s grain.` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'Specialization produces classes, not equality', content: `SPECIALIZATION PRODUCES CLASSES, NOT EQUALITY — once surplus can be stored, it can be controlled. Whoever controlled the granary and the temple — priests, then kings — sat at the top; scribes and merchants in the middle; farmers, laborers, and enslaved people at the bottom. Rising complexity in early civilizations went hand in hand with rising inequality and, in most cases, tightening patriarchy.` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'Public works prove organized government', content: `PUBLIC WORKS PROVE ORGANIZED GOVERNMENT — irrigation canals, city walls, ziggurats, the Egyptian pyramids (c. 2560 BCE). None of these are built by volunteers on a weekend. They require someone who can command thousands of workers, feed them from stored surplus, and plan for years. Monuments are evidence of authority, not just of art.` },
    { loId: 'whist.features-of-civilization', content: `THE WORD "CIVILIZATION" IS LOADED AND DEBATED — plenty of complex societies fail the standard checklist and were absolutely not simple. Great Zimbabwe (c. 1100 to 1450 CE) built massive mortarless stone enclosures and ran gold trade to the Indian Ocean while keeping its history in oral tradition rather than script. The Inca (1438 to 1533 CE) governed roughly twelve million people across the Andes using quipu — knotted, colored cords — instead of alphabetic writing. Mongol and Bantu-speaking societies moved rather than urbanized. Many historians now prefer the neutral phrase "complex society."` },
    { loId: 'whist.features-of-civilization', kind: 'framework', title: 'How historians know any of this', content: `HOW HISTORIANS KNOW ANY OF THIS — a primary source is made at the time by a participant or witness: a tax tablet, a tomb painting, a law code, a pot. A secondary source is a later account that interprets primaries, like your textbook. Before writing, archaeology carries the whole load. And beware the built-in bias: written sources were produced by literate elites, so kings and priests are loud in the record while farmers and women are nearly silent.` },
    { loId: 'whist.features-of-civilization', kind: 'definition', title: 'surplus', content: `food produced beyond what the producers themselves need — the stored margin that pays for everyone who does not farm.` },
    { loId: 'whist.features-of-civilization', kind: 'definition', title: 'job specialization', content: `people working at one trade full time (potter, scribe, soldier) instead of everyone doing every task.` },
    { loId: 'whist.features-of-civilization', kind: 'definition', title: 'primary source', content: `evidence created at the time of the event by someone present, as opposed to a later interpretation of it.` },
  ],
  methods: [
    {
      title: 'Worked surplus chain',
      steps: [
        `Start at the ground: farmers along the Tigris and Euphrates dug irrigation canals, watering land the rains alone could not support. Yields rose above what the farming families ate.`,
        `Follow the extra grain: surplus has to be stored somewhere central and guarded — temple and palace storehouses. Storage is what converts a good harvest into lasting social power.`,
        `Follow the storage: whoever controls a granary can pay people who grow nothing. That funds full-time specialists — priests, soldiers, metalworkers, officials — and it pulls people together into dense settlements like Uruk.`,
        `Follow the administration: now an official must track thousands of transactions across years. Who delivered barley, how much, when, still owed by whom? Human memory cannot hold it, and the parties are strangers rather than neighbors.`,
        `Close the chain: scribes pressed marks into clay to record those quantities, and that accounting system (cuneiform, c. 3200 BCE) is the earliest writing we have. Only later did the same tool get used for law codes, prayers, and the Epic of Gilgamesh.`,
      ],
      example: { problem: `Build the causal chain: how did a change in FARMING in Mesopotamia end up producing WRITING? Trace it step by step.`, solution: `Irrigation raised yields, surplus was stored centrally, storage funded specialists and cities, cities generated too many transactions to memorize — so writing was invented as bookkeeping and only afterward became literature.` },
      relatedLoIds: ['whist.features-of-civilization'],
    },
    {
      title: 'Worked source analysis',
      steps: [
        `Classify the source first. It was made at the time, by someone directly involved in the transaction, so it is a PRIMARY source — not a later account of the past.`,
        `Read what the object proves directly: a very large quantity of grain existed beyond immediate consumption (surplus), and it was collected into one central institution (the temple). That is organized authority, not just a family pantry.`,
        `Read what the FORM proves: the record spans 37 months and uses a written numerical system, so somebody was doing sustained bookkeeping. A person named Kushim signed it, meaning a full-time administrative specialist existed — job specialization in one line.`,
        `Now the limits. The tablet says nothing about whether farmers handed over the barley willingly, as a tax, as rent, or as an offering. It does not tell us what those farmers ate, believed, or thought of the temple.`,
        `Name the bias: this survives because writing was an elite accounting tool, so the record preserves the institution’s view of the transaction. To recover the farmers, historians must turn to archaeology — house sizes, skeletal evidence of diet and labor, and grave goods — and to later written sources read against the grain.`,
      ],
      example: { problem: `A clay tablet excavated at Uruk in southern Mesopotamia, dated to roughly 3100 BCE, has been paraphrased by historians as: "A total of 29,086 measures of barley, received over 37 months into the temple storehouse. Signed, Kushim." What can a historian legitimately claim from this one object, and what can they NOT claim?`, solution: `It is a primary source proving surplus, centralized temple control, sustained record-keeping, and a specialist scribe by about 3100 BCE — but it cannot show consent, daily life, or the farmers’ own perspective, because the surviving record is an elite accounting record.` },
      relatedLoIds: ['whist.features-of-civilization'],
    },
  ],
  pointers: [
    { content: `Primary versus secondary is about ORIGIN, not subject. A tomb painting made around 1400 BCE, a cuneiform tax tablet, or Hammurabi’s law code are primary: created at the time by people involved. A textbook written in 2024 is secondary — a modern historian interpreting those primaries. The photographed artifact is a primary source; the chapter around it is not. And note the reverse trap: a primary source is not automatically more truthful, just closer. Its maker still had a purpose and an audience.`, kind: 'common-error' },
    { content: `Surplus is the engine: irrigated farming produced stored extra grain, which paid for everyone who did not farm — and every other feature follows from that.`, kind: 'tip' },
    { content: `The usual checklist: cities, organized government, organized religion, job specialization, social classes, writing or record-keeping, public works, and distinctive art and architecture.`, kind: 'tip' },
    { content: `Writing began as accounting (cuneiform receipts, c. 3200 BCE), and specialization brought inequality, not equality — surplus that can be stored can be controlled.`, kind: 'tip' },
    { content: `"Civilization" is a contested label: Great Zimbabwe and the Inca were highly complex without alphabetic writing, so many historians say "complex society" instead.`, kind: 'tip' },
    { content: `How we know: primary sources are made at the time by participants, secondary sources interpret them later — and because writing belonged to elites, farmers and women are underrepresented in the written record.`, kind: 'tip' },
    { content: `Primary vs. secondary is about **origin, not subject**. A 2024 textbook chapter on Egypt is secondary even if it's packed with artifact photos. Ask "who made this, and when?" — not "what is it about?"`, kind: 'common-error' },
    { content: `Primary ≠ true. Kushim's tablet is closer to the event, not more honest — every maker had a purpose and an audience. Say "closer to the event," not "more reliable."`, kind: 'vocab-note' },
    { content: `Don't say writing began with stories or religion. The oldest cuneiform (c. 3200 BCE) is barley, beer, and sheep receipts; Hammurabi's code (c. 1750 BCE) and Gilgamesh come **centuries** later. Bookkeeping first, literature second.`, kind: 'common-error' },
    { content: `Complexity did NOT mean equality or progress. Storable surplus is controllable surplus: it produced social classes, enslavement, and tightening patriarchy. Never write that civilization "improved life for everyone."`, kind: 'gotcha' },
    { content: `Treat the 8-feature checklist as a rough guide, not a scorecard of worth. Great Zimbabwe (oral tradition) and the Inca (quipu) fail the "writing" box while running gold trade and governing millions. Prefer "complex society" when the label is contested.`, kind: 'edge-case' },
    { content: `"Record-keeping" is broader than "alphabetic writing." Quipu cords recorded a twelve-million-person empire. Don't equate "no alphabet" with "no records."`, kind: 'vocab-note' },
    { content: `Keep the causal order straight: irrigation → surplus → central storage → specialists and cities → too many transactions → writing. Don't start the chain with cities or government; both are *funded by* stored surplus, not the cause of it.`, kind: 'tip' },
    { content: `Watch the limits of a single source. The Uruk tablet proves surplus, temple control, and a scribe — it cannot prove farmers gave grain willingly, or as tax vs. rent vs. offering. Separate "what it shows" from "what I'm assuming."`, kind: 'gotcha' },
  ],
};
