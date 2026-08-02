/**
 * World History — Unit 1 CED 1.1: From Foragers to Farmers: The Neolithic Revolution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.whist.neolithic-revolution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_WHIST_U1_NEOLITHIC_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.whist.neolithic-revolution.v1',
  course: 'World History',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'From Foragers to Farmers: The Neolithic Revolution',
  planId: 'evelyn.hs.whist.neolithic-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.whist.neolithic-revolution.v1' }],
  theory: [
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'Foraging was the human norm, not a failure', content: `FORAGING WAS THE HUMAN NORM, NOT A FAILURE — for the vast majority of human history people lived in small mobile bands, hunting and gathering a wide variety of wild foods. That life supported few people per square mile but tended toward broad diets, shared food, and relatively flat social structures — nobody can hoard what nobody can store.` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'Domestication was a slow selection process, not an invention', content: `DOMESTICATION WAS A SLOW SELECTION PROCESS, NOT AN INVENTION — as the last Ice Age ended around 12,000–10,000 BCE and climates warmed, people harvesting wild stands of grain kept and replanted the seeds that stayed on the stalk and grew large. Over hundreds of generations wild plants and animals became dependent on humans. Nobody woke up one morning and "invented farming."` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'It happened independently in many places', content: `IT HAPPENED INDEPENDENTLY IN MANY PLACES — Southwest Asia's Fertile Crescent (wheat, barley, lentils, sheep, goats, c. 10,000 BCE); China (rice in the Yangzi valley, millet in the north, pigs); Mesoamerica (maize, beans, squash, turkeys); the Andes (potatoes, quinoa, llamas); West Africa (sorghum, yams); New Guinea (taro, bananas). These regions had no contact with one another. Farming was not exported from one birthplace — a very common student error.` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'Surplus is the hinge', content: `SURPLUS IS THE HINGE — a farm village that grows more food than it eats can store the extra. Storage lets people stay in one place year-round (sedentism), and it means not everyone has to produce food. That frees full-time potters, weavers, metalworkers, priests, and soldiers. Specialization is the direct ancestor of cities, writing, and states.` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'Surplus also creates inequality', content: `SURPLUS ALSO CREATES INEQUALITY — stored grain and owned land are wealth: countable, defendable, inheritable. Some families accumulate more, and differences harden into permanent classes. Archaeologists read this in burials — some graves with imported beads and metal, others with nothing. Organized warfare, taxation, and enslavement all follow the storeroom.` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'The trade-off was real and measurable', content: `THE TRADE-OFF WAS REAL AND MEASURABLE — skeletons from early farming villages are on average SHORTER than nearby foragers, with more tooth decay, more anemia, and more signs of childhood hunger. Narrow grain-based diets meant famine when one crop failed; crowding together with livestock let diseases like measles, smallpox, and influenza jump from animals to humans. Farming is also harder physical labor than foraging.` },
    { loId: 'whist.neolithic-revolution', content: `SO WHY DID FARMING WIN? MORE PEOPLE PER ACRE — a farmed field feeds far more people than the same land foraged. Farming communities out-reproduced and out-expanded forager neighbors even while individuals lived sicker, shorter lives. Farming won on population, not on comfort — a distinction students often miss.` },
    { loId: 'whist.neolithic-revolution', kind: 'framework', title: 'Early settlements show the transition in progress', content: `EARLY SETTLEMENTS SHOW THE TRANSITION IN PROGRESS — Jericho, in the Jordan River valley, had a stone wall and tower by roughly 8000 BCE. Çatalhöyük, in what is now Turkey, held perhaps 5,000–8,000 people around 7000 BCE in mud-brick houses packed wall to wall and entered through holes in the roof — no streets, no palace, no obvious temple district. Big permanent settlements came BEFORE kings and writing, not after.` },
    { loId: 'whist.neolithic-revolution', kind: 'definition', title: 'domestication', content: `the gradual genetic reshaping of a wild plant or animal, over many generations of human selection, into a form that depends on people — and feeds them more reliably.` },
    { loId: 'whist.neolithic-revolution', kind: 'definition', title: 'surplus', content: `food produced beyond what the producers need to survive; it can be stored, traded, taxed, or fought over.` },
    { loId: 'whist.neolithic-revolution', kind: 'definition', title: 'sedentism', content: `living permanently in one place year-round instead of moving with the seasons and the food supply.` },
  ],
  methods: [
    {
      title: 'Worked surplus chain',
      steps: [
        `Start with domestication: selected grains yield far more calories per acre than wild plants, and herded animals give predictable meat, milk, and wool. A family can now grow more than it eats.`,
        `Follow the extra food: a surplus can be stored in jars and granaries. But you cannot carry a granary — so people settle permanently next to their fields. Foraging bands become villages.`,
        `Follow the freed labor: if a portion of the village can feed everyone, the rest do not have to farm. That produces full-time specialists — potters, weavers, metalworkers, builders, priests, soldiers — and specialists get better at their crafts fast.`,
        `Follow the storeroom: stored grain is wealth that can be counted, owned, inherited, and stolen. Families that control more of it gain lasting advantage; the flat social structure of a forager band hardens into ranked classes.`,
        `Close the chain: whoever guards and distributes the surplus gains authority — and needs records (early writing begins as accounting), enforcers (soldiers), and a claim on everyone's harvest (taxation). Surplus → settlement → specialization → inequality → the state.`,
      ],
      example: { problem: `Build the causal chain: how does a field of wheat end up producing kings, tax collectors, and armies? Trace it step by step.`, solution: `Domesticated crops create storable surplus; surplus creates permanent settlement and non-farming specialists; controlling the stored surplus creates permanent inequality, record-keeping, armies, and eventually rulers.` },
      relatedLoIds: ['whist.neolithic-revolution'],
    },
    {
      title: 'Worked origins confusion',
      steps: [
        `Error one — "invented." Domestication was not a single act by an inventor. It was thousands of years of people replanting the seeds they liked best, gradually changing the plants themselves. The Fertile Crescent transition unfolded over roughly two to three thousand years.`,
        `Error two — "spread from there to the rest of the world." Agriculture arose independently in at least seven or eight regions with no contact between them: Southwest Asia, China, Mesoamerica, the Andes, West Africa, New Guinea, and more. Maize was not a Fertile Crescent crop carried west; it was domesticated from a wild Mexican grass by people who had never heard of wheat.`,
        `Error three — "easier." Farmers worked longer hours than foragers and ate a narrower diet. The skeletal evidence points the other way: shorter bodies, worse teeth, more disease. Foragers did not sit around waiting to be rescued by agriculture.`,
        `Now replace the wrong causal claim with the right one. Farming did not spread because it was pleasant; it spread because it fed more people per acre. Farming populations grew, expanded into neighboring land, and gradually absorbed or displaced foraging neighbors.`,
        `Rewrite the sentence honestly: "Between roughly 10,000 and 3,000 BCE, people in several unconnected world regions gradually domesticated local plants and animals. Farming spread because it supported far larger populations, not because it made individual lives easier."`,
      ],
      example: { problem: `A student writes: "Farming was invented in the Fertile Crescent around 10,000 BCE and spread from there to the rest of the world, and people everywhere adopted it quickly because it was easier than hunting." Three separate errors are packed into that sentence. Untangle them.`, solution: `Domestication was gradual, not invented; it began independently in many regions rather than radiating from one; and it spread by supporting more people per acre, not by being easier or healthier.` },
      relatedLoIds: ['whist.neolithic-revolution'],
    },
  ],
  pointers: [
    { content: `It is called a revolution for its EFFECTS, not its speed. Domestication unfolded over two to three thousand years in each region, and the regions started at different times — Southwest Asia around 10,000 BCE, Mesoamerica later. Foraging never simply stopped: many communities farmed part-time and foraged the rest, and foraging peoples still lived across large parts of the world thousands of years after the first farms. Think overlap and gradual shift, not a switch being flipped.`, kind: 'common-error' },
    { content: `Domestication was gradual selection over many generations, beginning around 10,000 BCE as the last Ice Age ended — and it began independently in the Fertile Crescent, China, Mesoamerica, the Andes, West Africa, and New Guinea.`, kind: 'tip' },
    { content: `The chain to remember: surplus → sedentism → specialization → inequality → record-keeping, armies, and states.`, kind: 'tip' },
    { content: `It was a trade, not an upgrade: more people per acre and food security, bought with harder labor, narrower diets, new animal-borne diseases, and permanent social hierarchy.`, kind: 'tip' },
    { content: `Jericho (walls by c. 8000 BCE) and Çatalhöyük (thousands of people around 7000 BCE) show large permanent settlements arriving BEFORE kings, temples, and writing.`, kind: 'tip' },
    { content: `Never write that farming "spread from the Fertile Crescent to the world." Maize, rice, potatoes, sorghum, and taro were each domesticated from *local* wild species by regions with no contact. Say "independent origins" and name at least two non-Fertile-Crescent regions.`, kind: 'common-error' },
    { content: `"Revolution" here describes the *effects*, not the speed. Each region's transition took roughly 2,000–3,000 years, and regions started at different dates. Avoid phrasing like "in 10,000 BCE humans stopped foraging."`, kind: 'vocab-note' },
    { content: `Domestication is not invention. It's generations of selective replanting/breeding that genetically reshaped the species. Don't credit an inventor or a moment of discovery — describe selection over time.`, kind: 'vocab-note' },
    { content: `Farming won on population, not comfort. Skeletons show early farmers were shorter, with more cavities, anemia, and childhood hunger marks. If your answer says farming spread because it was easier or healthier, it's wrong — say "more people per acre."`, kind: 'gotcha' },
    { content: `Keep the causal chain in order: surplus → sedentism → specialization → inequality → records/armies/states. Specialists exist *because* stored surplus feeds non-farmers — don't jump straight from "they farmed" to "they had kings."`, kind: 'tip' },
    { content: `Jericho and Çatalhöyük had thousands of residents, walls, and mud-brick houses — but no palace, no temple district, no writing. Big permanent settlement came *before* kings and states, not after. Don't call them cities or civilizations.`, kind: 'edge-case' },
    { content: `Foraging didn't end. Many communities farmed part-time and foraged the rest, and foraging peoples persisted across large regions for thousands of years afterward. Write "overlap and gradual shift," not "replaced."`, kind: 'edge-case' },
    { content: `Distinguish surplus from sedentism: surplus is extra food beyond survival needs; sedentism is staying put year-round. Surplus is storable, and you can't carry a granary — that's *why* it produces sedentism. They're linked, not synonyms.`, kind: 'vocab-note' },
  ],
};
