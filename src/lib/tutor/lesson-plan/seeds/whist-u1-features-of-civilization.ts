/**
 * World History — Unit 1: What Makes a Civilization?
 *
 * The historian's toolkit lesson. Farming surplus is the hinge that lets
 * cities, governments, scribes, and monuments exist at all — and the word
 * "civilization" itself is a judgment call historians argue about. Students
 * also meet the question behind every later unit: how do we know?
 * C3 D2.His.11.9-12, D2.Geo.4.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U1_FEATURES_OF_CIVILIZATION: LessonPlan = {
  id: 'evelyn.hs.whist.features-of-civilization.v1',
  title: 'What Makes a Civilization?',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.features-of-civilization',
      standard: 'WHIST-1.2',
      description:
        'Identify the common features of the world’s earliest civilizations, explain how agricultural surplus made those features possible, evaluate why "civilization" is a debated label, and distinguish primary from secondary sources when judging how historians know what they claim (C3 D2.His.11.9-12, D2.Geo.4.9-12).',
    },
  ],
  prerequisites: ['whist.neolithic-revolution'],
  followUps: ['whist.mesopotamia-egypt'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the surplus-to-city chain, and make the word "civilization" itself feel like a contested claim rather than a compliment.',
      script:
        'Somebody had to grow the food for the first poet. That is the whole story of this unit in one sentence. For most of human history, nearly everyone spent nearly every day getting calories. Then farmers in a few river valleys started producing more grain than their own families ate — and suddenly a society could afford people who did not farm at all: priests, soldiers, potters, tax collectors, scribes. Cities, kings, temples, and writing all sit on top of that extra grain. But here is the trap: for two hundred years, Europeans used the word "civilized" to mean "people like us," and used it to justify conquering everyone else. So today you learn the checklist historians use, and you learn why they argue about it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-features-of-civilization',
      kind: 'concept',
      goal: 'The surplus engine, the standard feature checklist, why the label is contested, and how historians know any of it.',
      keyIdeas: [
        'SURPLUS COMES FIRST — after the Neolithic Revolution, irrigated river-valley farming (the Tigris and Euphrates, the Nile, the Indus, the Yellow River) produced more grain than the growers needed. Surplus is the precondition for everything else on this list: it buys the labor of people who do not grow food.',
        'THE STANDARD CHECKLIST — historians usually look for eight features: cities, organized government, an organized religion, job specialization, social classes, writing or record-keeping, public works, and distinctive art and architecture. They appear together because each one depends on stored surplus and on the others.',
        'A CITY IS NOT JUST A BIG VILLAGE — Uruk in Mesopotamia held perhaps 40,000 people by about 3100 BCE, and most of them were strangers to each other. Strangers living densely need something a village does not: written rules, courts, markets, and officials. Density drives institutions.',
        'WRITING WAS INVENTED FOR ACCOUNTING, NOT LITERATURE — the earliest cuneiform tablets from Sumer (c. 3200 BCE) are receipts for barley, beer, and sheep. Epics and law codes such as Hammurabi’s (c. 1750 BCE) come centuries later. Common student error: assuming writing started with stories. It started with somebody counting other people’s grain.',
        'SPECIALIZATION PRODUCES CLASSES, NOT EQUALITY — once surplus can be stored, it can be controlled. Whoever controlled the granary and the temple — priests, then kings — sat at the top; scribes and merchants in the middle; farmers, laborers, and enslaved people at the bottom. Rising complexity in early civilizations went hand in hand with rising inequality and, in most cases, tightening patriarchy.',
        'PUBLIC WORKS PROVE ORGANIZED GOVERNMENT — irrigation canals, city walls, ziggurats, the Egyptian pyramids (c. 2560 BCE). None of these are built by volunteers on a weekend. They require someone who can command thousands of workers, feed them from stored surplus, and plan for years. Monuments are evidence of authority, not just of art.',
        'THE WORD "CIVILIZATION" IS LOADED AND DEBATED — plenty of complex societies fail the standard checklist and were absolutely not simple. Great Zimbabwe (c. 1100 to 1450 CE) built massive mortarless stone enclosures and ran gold trade to the Indian Ocean while keeping its history in oral tradition rather than script. The Inca (1438 to 1533 CE) governed roughly twelve million people across the Andes using quipu — knotted, colored cords — instead of alphabetic writing. Mongol and Bantu-speaking societies moved rather than urbanized. Many historians now prefer the neutral phrase "complex society."',
        'HOW HISTORIANS KNOW ANY OF THIS — a primary source is made at the time by a participant or witness: a tax tablet, a tomb painting, a law code, a pot. A secondary source is a later account that interprets primaries, like your textbook. Before writing, archaeology carries the whole load. And beware the built-in bias: written sources were produced by literate elites, so kings and priests are loud in the record while farmers and women are nearly silent.',
      ],
      vocabulary: [
        { term: 'surplus', definition: 'food produced beyond what the producers themselves need — the stored margin that pays for everyone who does not farm.' },
        { term: 'job specialization', definition: 'people working at one trade full time (potter, scribe, soldier) instead of everyone doing every task.' },
        { term: 'primary source', definition: 'evidence created at the time of the event by someone present, as opposed to a later interpretation of it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-surplus-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a change in FARMING in Mesopotamia end up producing WRITING? Trace it step by step.',
      steps: [
        'Start at the ground: farmers along the Tigris and Euphrates dug irrigation canals, watering land the rains alone could not support. Yields rose above what the farming families ate.',
        'Follow the extra grain: surplus has to be stored somewhere central and guarded — temple and palace storehouses. Storage is what converts a good harvest into lasting social power.',
        'Follow the storage: whoever controls a granary can pay people who grow nothing. That funds full-time specialists — priests, soldiers, metalworkers, officials — and it pulls people together into dense settlements like Uruk.',
        'Follow the administration: now an official must track thousands of transactions across years. Who delivered barley, how much, when, still owed by whom? Human memory cannot hold it, and the parties are strangers rather than neighbors.',
        'Close the chain: scribes pressed marks into clay to record those quantities, and that accounting system (cuneiform, c. 3200 BCE) is the earliest writing we have. Only later did the same tool get used for law codes, prayers, and the Epic of Gilgamesh.',
      ],
      answer:
        'Irrigation raised yields, surplus was stored centrally, storage funded specialists and cities, cities generated too many transactions to memorize — so writing was invented as bookkeeping and only afterward became literature.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-source-analysis',
      kind: 'worked_example',
      problem:
        'A clay tablet excavated at Uruk in southern Mesopotamia, dated to roughly 3100 BCE, has been paraphrased by historians as: "A total of 29,086 measures of barley, received over 37 months into the temple storehouse. Signed, Kushim." What can a historian legitimately claim from this one object, and what can they NOT claim?',
      steps: [
        'Classify the source first. It was made at the time, by someone directly involved in the transaction, so it is a PRIMARY source — not a later account of the past.',
        'Read what the object proves directly: a very large quantity of grain existed beyond immediate consumption (surplus), and it was collected into one central institution (the temple). That is organized authority, not just a family pantry.',
        'Read what the FORM proves: the record spans 37 months and uses a written numerical system, so somebody was doing sustained bookkeeping. A person named Kushim signed it, meaning a full-time administrative specialist existed — job specialization in one line.',
        'Now the limits. The tablet says nothing about whether farmers handed over the barley willingly, as a tax, as rent, or as an offering. It does not tell us what those farmers ate, believed, or thought of the temple.',
        'Name the bias: this survives because writing was an elite accounting tool, so the record preserves the institution’s view of the transaction. To recover the farmers, historians must turn to archaeology — house sizes, skeletal evidence of diet and labor, and grave goods — and to later written sources read against the grain.',
      ],
      answer:
        'It is a primary source proving surplus, centralized temple control, sustained record-keeping, and a specialist scribe by about 3100 BCE — but it cannot show consent, daily life, or the farmers’ own perspective, because the surviving record is an elite accounting record.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-surplus-precondition',
      kind: 'try_yourself',
      problem:
        'Historians treat agricultural surplus as the precondition for the earliest civilizations. Which statement best explains WHY surplus matters so much?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Stored extra food allows some people to stop farming and work full time as priests, soldiers, scribes, and builders', correct: true },
        { id: 'b', text: 'Surplus food was the main good traded between Mesopotamia and China before 3000 BCE' },
        { id: 'c', text: 'Growing extra grain taught early farmers how to write and count' },
        { id: 'd', text: 'Surplus made early societies more equal, because there was finally enough food for everyone' },
      ],
      expectedAnswer: 'Stored extra food allows some people to stop farming and work full time as priests, soldiers, scribes, and builders',
      hints: [
        'Ask who feeds the people who are not growing food. Where do a temple priest’s meals come from?',
        'Surplus is not valuable here as a product to trade or export — it is valuable as a way to buy other people’s labor and time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-earliest-writing',
      kind: 'try_yourself',
      problem:
        'The oldest cuneiform tablets from Sumer, dating to about 3200 BCE, mostly record quantities of barley, beer, and livestock. What does that fact tell historians about why writing was invented?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Writing developed to solve an administrative problem: tracking stored surplus and obligations that were too numerous to memorize', correct: true },
        { id: 'b', text: 'Writing developed so that priests could record religious epics and hymns for worship' },
        { id: 'c', text: 'Writing developed because Sumerian kings wanted their military victories remembered by later generations' },
        { id: 'd', text: 'Writing developed in Egypt first and was copied by Sumerian merchants around 3200 BCE' },
      ],
      expectedAnswer: 'Writing developed to solve an administrative problem: tracking stored surplus and obligations that were too numerous to memorize',
      hints: [
        'Let the evidence lead. If the OLDEST tablets are receipts and the epics come many centuries later, which purpose came first?',
        'Literature, royal boasting, and law codes are all real uses of cuneiform — they are just later uses, layered onto a tool built for bookkeeping.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-contested-label',
      kind: 'try_yourself',
      problem:
        'Great Zimbabwe built enormous mortarless stone enclosures and ran long-distance gold trade between roughly 1100 and 1450 CE, but preserved its history through oral tradition rather than writing. The Inca governed millions across the Andes using knotted quipu cords instead of an alphabet. What is the strongest conclusion a historian draws from these two cases?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The standard feature checklist is a useful rough guide, not a test of worth — complex societies can be highly organized without alphabetic writing', correct: true },
        { id: 'b', text: 'Neither society was truly complex, because record-keeping in writing is required for real political organization' },
        { id: 'c', text: 'Both societies must have had writing systems that archaeologists simply have not discovered yet' },
        { id: 'd', text: 'Oral tradition and quipu prove that these societies had no government, taxation, or social classes' },
      ],
      expectedAnswer: 'The standard feature checklist is a useful rough guide, not a test of worth — complex societies can be highly organized without alphabetic writing',
      hints: [
        'Look at what these societies actually accomplished — a stone city, an Indian Ocean trade network, an empire of millions with roads and censuses.',
        'If a checklist labels those achievements "not a civilization," the honest move is to question the checklist rather than the achievements.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-primary-vs-secondary',
      kind: 'misconception_check',
      question:
        'A student says: "My textbook chapter on ancient Egypt is a primary source, because it is about ancient Egypt and it has photos of real artifacts in it." What needs correcting?',
      commonErrors: [
        {
          answer: 'A source counts as primary if it is ABOUT the ancient period',
          misconception: 'Sorting sources by their topic instead of by when and by whom they were created — and assuming reproduced images make the containing book primary.',
          correctsTo:
            'Primary versus secondary is about ORIGIN, not subject. A tomb painting made around 1400 BCE, a cuneiform tax tablet, or Hammurabi’s law code are primary: created at the time by people involved. A textbook written in 2024 is secondary — a modern historian interpreting those primaries. The photographed artifact is a primary source; the chapter around it is not. And note the reverse trap: a primary source is not automatically more truthful, just closer. Its maker still had a purpose and an audience.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Surplus is the engine: irrigated farming produced stored extra grain, which paid for everyone who did not farm — and every other feature follows from that.',
        'The usual checklist: cities, organized government, organized religion, job specialization, social classes, writing or record-keeping, public works, and distinctive art and architecture.',
        'Writing began as accounting (cuneiform receipts, c. 3200 BCE), and specialization brought inequality, not equality — surplus that can be stored can be controlled.',
        '"Civilization" is a contested label: Great Zimbabwe and the Inca were highly complex without alphabetic writing, so many historians say "complex society" instead.',
        'How we know: primary sources are made at the time by participants, secondary sources interpret them later — and because writing belonged to elites, farmers and women are underrepresented in the written record.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'What Makes a Civilization?' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
