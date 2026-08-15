/**
 * World History — The Americas: The Inca & Peoples of North America.
 *
 * The unit's second half of the pre-contact Americas: an Andean empire
 * that governed 2,500 miles with knots and runners instead of writing and
 * wheels, and a North America that was plural — mound cities, canyon
 * astronomers, and a five-nation confederacy — rather than empty.
 * Factual spine salvaged from the legacy Americas state-building seed and
 * rewritten subject-first. C3 D2.His.14.9-12, D2.Geo.5.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U5_INCA_NORTH_AMERICA: LessonPlan = {
  id: 'evelyn.hs.whist.inca-north-america.v1',
  title: 'The Inca & Peoples of North America',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.inca-north-america',
      standard: 'WHIST-5.4',
      description:
        'Explain how the Inca governed the largest empire in the pre-contact Americas without writing or wheeled transport, and compare that centralized Andean model with the diverse societies of North America — Cahokia, the Ancestral Puebloans, and the Haudenosaunee Confederacy (C3 D2.His.14.9-12, D2.Geo.5.9-12).',
    },
  ],
  prerequisites: ['whist.maya-aztec'],
  followUps: ['whist.renaissance'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle: an empire the size of the US West Coast, run with no alphabet and no wheels — and a North America that was never empty.',
      script:
        'Try running a country of ten million people across 2,500 miles of the highest mountains outside Asia. Now do it with no alphabet, no wheeled carts, no horses, and no money. The Inca did exactly that — and their tax collectors, census takers, and army supply officers all worked, because the Inca built different tools: knotted cords that stored numbers, a road system longer than the modern US interstate spine, and relay runners who carried a message a thousand miles in about a week. Meanwhile, north of Mexico, there was no single empire at all — there was a mound city near modern St. Louis bigger than London at the same date, canyon builders tracking the moon, and a five-nation confederacy whose peace treaty later got quoted by the men writing the United States Constitution. Today we test a habit of mind that historians rely on: never confuse "different toolkit" with "no government."',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inca-north-america',
      kind: 'concept',
      goal: 'The Inca machinery of empire (roads, quipu, terraces, labor tax, resettlement) and the plural political world of North America.',
      keyIdeas: [
        'TAWANTINSUYU — THE FOUR PARTS TOGETHER — beginning about 1438 under the ruler Pachacuti and his successors, the Inca expanded from the valley of Cusco into an empire running roughly 2,500 miles down the Andes, from modern Ecuador through Peru and Bolivia into Chile — around ten million people, the largest state ever built in the Americas before European contact. It lasted until the Spanish invasion of 1533.',
        'RECORDS WITHOUT WRITING — the Inca had no alphabet. They had the QUIPU: bundles of dyed, knotted cords in which knot type and position encoded numbers. Trained specialists (quipucamayocs) used them to hold the census, storehouse inventories, tribute-labor rosters, and calendar data. Confusion to kill early: a society with no writing is not a society with no records.',
        'ROADS WITHOUT WHEELS — about 25,000 miles of engineered road (the Qhapaq Nan), with rope suspension bridges over gorges, waystations (tambos) stocked with food, and CHASQUI relay runners who sprinted short legs and handed off, moving messages roughly 150 miles a day. The Inca knew the wheel as a concept but had no draft animals for it and no flat ground worth using it on; llamas carried the freight, and stairways worked better than ramps.',
        'FARMING A VERTICAL WORLD — Andean geography stacks climates on top of each other, so Inca communities practiced the VERTICAL ARCHIPELAGO: holding fields at several altitudes at once — maize low, potatoes high, herds higher still — so one frost could not starve a village. Stone TERRACES (andenes) turned mountainsides into flat, irrigated, frost-buffered farmland. Freeze-dried potatoes (CHUNO), made by alternating night frost with day sun, kept for years in state storehouses (qollqas) and fed armies and work crews.',
        "A TAX PAID IN LABOR, NOT GOODS — the MIT'A required every household to give the state a rotation of work: building roads and terraces, farming state fields, mining, weaving, or serving in the army. The state fed and supplied the workers while they served. This is the sharpest contrast with the Aztec model of the previous topic, which extracted tribute in GOODS from conquered city-states. Same goal, opposite mechanism.",
        'INTEGRATION BY MOVING PEOPLE AND SPREADING A LANGUAGE — the Inca broke up resistant populations by mandatory resettlement (mitmaq), transplanting whole communities far from home and settling loyal groups among them, and pushed QUECHUA as the administrative language. Cusco was the ceremonial and political center; the mountain estate at Machu Picchu (built c. 1450) was a royal retreat, not the capital. Quechua is still spoken by roughly eight to ten million people today — the empire outlived itself in the language.',
        'NORTH AMERICA WAS PLURAL, NOT SINGULAR — no single empire spanned it; hundreds of distinct societies did. CAHOKIA (c. 1050-1350), a Mississippian mound city on the Mississippi floodplain near modern St. Louis, held some 10,000 to 20,000 people — larger than London at the same date — and built Monks Mound, the largest earthen structure in the Americas. The ANCESTRAL PUEBLOANS at Chaco Canyon (c. 850-1150) raised multi-story great houses like Pueblo Bonito, cut straight roads across the desert to outlying settlements, and aligned buildings to solar and lunar cycles. The HAUDENOSAUNEE (Iroquois) CONFEDERACY united five nations — Mohawk, Oneida, Onondaga, Cayuga, and Seneca — under the GREAT LAW OF PEACE, governing by consensus of a council of chiefs chosen and removable by clan mothers; American founders including Benjamin Franklin studied and cited it while arguing for colonial union.',
        'DIFFERENT TOOLKITS, EQUALLY REAL STATECRAFT — compare the two models honestly: the Andes produced one tightly centralized empire; North America produced mound cities, desert astronomers, farming villages, and a durable federal confederacy. Judging either by whether it had an alphabet, wheels, or iron mistakes the TOOLS for the ACHIEVEMENT — feeding, defending, taxing, and holding together large numbers of people.',
      ],
      vocabulary: [
        { term: 'quipu', definition: 'knotted, dyed cords the Inca used to record numbers — census counts, storehouse inventories, labor rosters — in place of writing.' },
        { term: "mit'a", definition: 'the Inca tax paid in rotating labor (roads, terraces, state fields, army service) rather than in goods, with the state supplying the workers.' },
        { term: 'vertical archipelago', definition: 'the Andean practice of a single community holding fields and herds at several different altitudes at once, so no single climate failure starves it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-govern-the-andes',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did Andean geography push the Inca toward roads, storehouses, and a labor tax — rather than toward the goods-tribute empire the Aztecs built?',
      steps: [
        'Start with the terrain. The Andes are long, narrow, steep, and vertically stacked: a village can walk from frost-line potato fields to warm maize valleys in a day. Distance is measured in climbing, not in miles.',
        'First consequence — hold several altitudes at once. Communities farm the vertical archipelago and terrace the slopes, so surplus arrives as bulky, perishable food from scattered elevations rather than as compact luxury goods.',
        'Second consequence — preserve and store it. Freeze-dried chuno, made with the same night frost that threatens the crop, keeps for years in state qollqas. The empire now holds calories it can move and spend.',
        'Third consequence — you cannot cart it. No draft animals, no flat roads; llama trains and human porters carry loads over stairways and rope bridges. So the state invests in 25,000 miles of engineered road and chasqui relays instead of wheels.',
        "Fourth consequence — tax the labor, not the goods. With food already in state storehouses, what the government actually lacks is WORK: roads to cut, terraces to build, armies to march. So the mit'a takes rotations of labor and pays workers in the stored food.",
        'Close the chain, then compare. Vertical terrain to stacked farming to stored calories to road-and-runner logistics to a labor tax. The Aztecs, ruling dense lowland city-states with rich portable surpluses at short distances, could simply demand tribute in goods. Two empires, two geographies, two tax systems — each fitted to what its land actually produced.',
      ],
      answer:
        "Andean verticality produced bulky food surpluses at many altitudes; storing them (chuno in qollqas) plus the absence of wheeled transport pushed the Inca toward roads, relay runners, and the mit'a labor tax, while the Aztecs' compact, portable lowland surpluses supported a tribute-in-goods empire instead.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-quipu-account',
      kind: 'worked_example',
      problem:
        'A Spanish official writing from Peru around 1560 reported (paraphrased): "These people keep no letters, and yet when we asked what had been taken from the storehouse of one valley, an old keeper of the cords read back to us the count of every blanket, every pair of sandals, and every measure of maize, and when we checked the store the reckoning did not err." What does this account let a historian conclude — and what should the historian be careful about?',
      steps: [
        'Identify the speaker and the moment. A Spanish colonial official, writing roughly a generation after the 1533 invasion, describing an Inca system already under foreign rule. He is an outsider, hostile in principle, and writing for a Spanish audience.',
        'Separate observation from judgment. His judgment is dismissive ("these people keep no letters"). His OBSERVATION is that a quipucamayoc read exact quantities off knotted cords and the physical stock matched. The observation survives even if the judgment is prejudiced.',
        'Note who is corroborating whom. This is a witness with no motive to flatter the Inca confirming that their record-keeping was accurate — which makes it stronger evidence, not weaker. Hostile testimony in favor of the subject is the most reliable kind.',
        'State the historical conclusion. Literacy and record-keeping are different technologies. The quipu handled numerical administration — inventories, censuses, labor rosters — well enough to run an empire, so "no writing" cannot be read as "no bureaucracy."',
        'Now the caution. One valley, one storehouse, one moment, seen by an untrained observer through a translator. It does not tell us whether quipus could encode narrative or history as well as numbers — a question historians still argue over — and by 1560 Spanish rule had already disrupted the system he is describing.',
      ],
      answer:
        'A hostile outside witness confirms that quipu record-keeping was accurate enough to audit a state storehouse — strong evidence that the Inca ran a real bureaucracy without writing — but it is a single, secondhand, post-invasion snapshot that says nothing about whether quipus could record more than numbers.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-quipu',
      kind: 'try_yourself',
      problem:
        'The Inca had no alphabet, yet they maintained a census of millions, tracked the contents of storehouses spread over 2,500 miles, and scheduled labor duties village by village. Which conclusion best fits this evidence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Record-keeping does not require an alphabet — the quipu stored numerical and administrative data in knotted cords', correct: true },
        { id: 'b', text: 'The Inca must have borrowed an alphabet from Maya scribes to run their census' },
        { id: 'c', text: 'Inca administration ran on memory and guesswork and mostly failed' },
        { id: 'd', text: 'Spanish officials created the first Andean census after 1533' },
      ],
      expectedAnswer: 'Record-keeping does not require an alphabet — the quipu stored numerical and administrative data in knotted cords',
      hints: [
        'Ask what the task actually demanded: these are counts and quantities, not stories. What kind of information does an inventory need to hold?',
        'Knot type and cord position encoded numbers; trained quipucamayocs read them back. Different medium, same job as a ledger.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mita',
      kind: 'try_yourself',
      problem:
        'An Andean village under Inca rule sends twenty men for three months to rebuild a mountain road, and the state feeds them from its storehouses the whole time. Which institution is this, and how did it differ from the Aztec system?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "The mit'a — a rotating tax paid in labor, whereas the Aztec empire collected tribute in goods from conquered city-states", correct: true },
        { id: 'b', text: 'The encomienda — a Spanish labor grant the Inca adopted in the 1400s' },
        { id: 'c', text: 'Chuno — an annual tax paid in freeze-dried potatoes, identical to the Aztec system' },
        { id: 'd', text: 'The chasqui — a yearly payment of gold and feathers owed to Cusco' },
      ],
      expectedAnswer: "The mit'a — a rotating tax paid in labor, whereas the Aztec empire collected tribute in goods from conquered city-states",
      hints: [
        'Look at what actually changes hands here. The village hands over time and effort; the state hands back food.',
        'One empire taxed WORK, the other taxed THINGS. Match each mechanism to the empire that used it — and watch for the option that is Spanish, not Inca.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-haudenosaunee',
      kind: 'try_yourself',
      problem:
        'The Haudenosaunee (Iroquois) Confederacy joined five nations under the Great Law of Peace: a shared council decided matters affecting all of them by consensus, while each nation kept control of its own internal affairs. Which comparison with the Inca is most accurate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both organized many communities into a lasting political order, but the Inca concentrated authority in one ruler at Cusco while the Haudenosaunee distributed it among member nations', correct: true },
        { id: 'b', text: 'Both were centralized empires ruled by a single hereditary emperor' },
        { id: 'c', text: 'Neither society had any form of government before European contact' },
        { id: 'd', text: 'French colonial officials created the Confederacy in the 1600s to manage the fur trade' },
      ],
      expectedAnswer: 'Both organized many communities into a lasting political order, but the Inca concentrated authority in one ruler at Cusco while the Haudenosaunee distributed it among member nations',
      hints: [
        'Both are answers to the same problem — how do many communities act as one? — so look at WHERE each one puts the final say.',
        'Empire versus confederacy: one commands from a center, the other negotiates among equals. Both are real government.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-empty-north-america',
      kind: 'misconception_check',
      question:
        'A student writes: "Before Europeans arrived, North America was empty wilderness — just small nomadic bands with no cities and no real government." What needs correcting?',
      commonErrors: [
        {
          answer: 'North America had no cities or governments before European contact',
          misconception:
            'Treating the absence of stone palaces, alphabets, and European-style monarchy as the absence of urban life and political organization — and generalizing one lifeway (mobile hunting) across an entire continent of very different societies.',
          correctsTo:
            'North America held hundreds of distinct societies, many of them farming, urban, or federated. Cahokia (c. 1050-1350), near modern St. Louis, housed roughly 10,000 to 20,000 people — more than London at the same date — around Monks Mound, the largest earthen structure in the Americas. The Ancestral Puebloans at Chaco Canyon (c. 850-1150) built multi-story great houses, straight desert roads, and buildings aligned to solar and lunar cycles. The Haudenosaunee Confederacy bound five nations under the Great Law of Peace with consensus decision-making and clan mothers who chose and could remove chiefs — a constitution studied by Benjamin Franklin and others. Mobile hunting societies did exist, especially on the Plains, but they were one pattern among many, not the whole continent.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tawantinsuyu (c. 1438-1533) ran roughly 2,500 miles from Ecuador to Chile — the largest empire in the pre-contact Americas, governed from Cusco.',
        'The Inca toolkit: quipu knot-records instead of writing, 25,000 miles of road with chasqui relay runners instead of wheels, terraces and the vertical archipelago instead of flat farmland, chuno in state storehouses instead of coin.',
        "The mit'a taxed LABOR and fed the workers; the Aztec empire taxed GOODS from conquered city-states — different geographies, different mechanisms, same goal.",
        'Integration tools: mandatory resettlement of restive populations and the spread of Quechua, which roughly eight to ten million people still speak.',
        'North America was plural: Cahokia the mound city, Chaco Canyon great houses and astronomy, and the five-nation Haudenosaunee Confederacy under the Great Law of Peace — later cited by American founders.',
        'The habit of mind: different toolkits, equally real statecraft. Judge a society by what it accomplished, not by whether it used the tools you expected.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'The Inca & Peoples of North America' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
