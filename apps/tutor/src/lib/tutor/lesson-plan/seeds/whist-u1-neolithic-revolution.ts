/**
 * World History — Unit 1: From Foragers to Farmers, the Neolithic Revolution.
 *
 * This is the course's origin story: the single shift that makes cities,
 * kings, writing, armies, taxes, and epidemics possible. Every later unit
 * is downstream of a grain surplus sitting in a storeroom.
 * C3 D2.His.14.9-12, D2.Geo.2.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U1_NEOLITHIC_REVOLUTION: LessonPlan = {
  id: 'evelyn.hs.whist.neolithic-revolution.v1',
  title: 'From Foragers to Farmers: The Neolithic Revolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.neolithic-revolution',
      standard: 'WHIST-1.1',
      description:
        'Explain how the domestication of plants and animals after c. 10,000 BCE produced food surpluses, permanent settlement, and social hierarchy, and evaluate the costs and benefits of that shift across several independent world regions (C3 D2.His.14.9-12, D2.Geo.2.9-12).',
    },
  ],
  prerequisites: [],
  followUps: ['whist.features-of-civilization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame farming as the decision every later unit is built on — and as a trade, not an upgrade.',
      script:
        'For roughly two hundred thousand years, every human being on Earth ate wild food. No fields, no herds, no landlords, no tax collectors — because there was nothing stored worth taxing. Then, in a few scattered river valleys, people started planting seeds instead of only gathering them. Within a few thousand years their descendants were living in walled towns, buried with jewelry other people could never afford, and dying of diseases their grandparents had never met. Everything that comes next in this course — pharaohs, empires, plagues, revolutions — grows out of that one change. And here is the strange part: by almost every measure of individual health, the first farmers were WORSE off than the foragers they replaced. So why did farming win?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-neolithic-revolution',
      kind: 'concept',
      goal: 'Domestication, its independent origins, the surplus chain, and the trade-offs it forced.',
      keyIdeas: [
        'FORAGING WAS THE HUMAN NORM, NOT A FAILURE — for the vast majority of human history people lived in small mobile bands, hunting and gathering a wide variety of wild foods. That life supported few people per square mile but tended toward broad diets, shared food, and relatively flat social structures — nobody can hoard what nobody can store.',
        'DOMESTICATION WAS A SLOW SELECTION PROCESS, NOT AN INVENTION — as the last Ice Age ended around 12,000–10,000 BCE and climates warmed, people harvesting wild stands of grain kept and replanted the seeds that stayed on the stalk and grew large. Over hundreds of generations wild plants and animals became dependent on humans. Nobody woke up one morning and "invented farming."',
        'IT HAPPENED INDEPENDENTLY IN MANY PLACES — Southwest Asia\'s Fertile Crescent (wheat, barley, lentils, sheep, goats, c. 10,000 BCE); China (rice in the Yangzi valley, millet in the north, pigs); Mesoamerica (maize, beans, squash, turkeys); the Andes (potatoes, quinoa, llamas); West Africa (sorghum, yams); New Guinea (taro, bananas). These regions had no contact with one another. Farming was not exported from one birthplace — a very common student error.',
        'SURPLUS IS THE HINGE — a farm village that grows more food than it eats can store the extra. Storage lets people stay in one place year-round (sedentism), and it means not everyone has to produce food. That frees full-time potters, weavers, metalworkers, priests, and soldiers. Specialization is the direct ancestor of cities, writing, and states.',
        'SURPLUS ALSO CREATES INEQUALITY — stored grain and owned land are wealth: countable, defendable, inheritable. Some families accumulate more, and differences harden into permanent classes. Archaeologists read this in burials — some graves with imported beads and metal, others with nothing. Organized warfare, taxation, and enslavement all follow the storeroom.',
        'THE TRADE-OFF WAS REAL AND MEASURABLE — skeletons from early farming villages are on average SHORTER than nearby foragers, with more tooth decay, more anemia, and more signs of childhood hunger. Narrow grain-based diets meant famine when one crop failed; crowding together with livestock let diseases like measles, smallpox, and influenza jump from animals to humans. Farming is also harder physical labor than foraging.',
        'SO WHY DID FARMING WIN? MORE PEOPLE PER ACRE — a farmed field feeds far more people than the same land foraged. Farming communities out-reproduced and out-expanded forager neighbors even while individuals lived sicker, shorter lives. Farming won on population, not on comfort — a distinction students often miss.',
        'EARLY SETTLEMENTS SHOW THE TRANSITION IN PROGRESS — Jericho, in the Jordan River valley, had a stone wall and tower by roughly 8000 BCE. Çatalhöyük, in what is now Turkey, held perhaps 5,000–8,000 people around 7000 BCE in mud-brick houses packed wall to wall and entered through holes in the roof — no streets, no palace, no obvious temple district. Big permanent settlements came BEFORE kings and writing, not after.',
      ],
      vocabulary: [
        {
          term: 'domestication',
          definition:
            'the gradual genetic reshaping of a wild plant or animal, over many generations of human selection, into a form that depends on people — and feeds them more reliably.',
        },
        {
          term: 'surplus',
          definition:
            'food produced beyond what the producers need to survive; it can be stored, traded, taxed, or fought over.',
        },
        {
          term: 'sedentism',
          definition:
            'living permanently in one place year-round instead of moving with the seasons and the food supply.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-surplus-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how does a field of wheat end up producing kings, tax collectors, and armies? Trace it step by step.',
      steps: [
        'Start with domestication: selected grains yield far more calories per acre than wild plants, and herded animals give predictable meat, milk, and wool. A family can now grow more than it eats.',
        'Follow the extra food: a surplus can be stored in jars and granaries. But you cannot carry a granary — so people settle permanently next to their fields. Foraging bands become villages.',
        'Follow the freed labor: if a portion of the village can feed everyone, the rest do not have to farm. That produces full-time specialists — potters, weavers, metalworkers, builders, priests, soldiers — and specialists get better at their crafts fast.',
        'Follow the storeroom: stored grain is wealth that can be counted, owned, inherited, and stolen. Families that control more of it gain lasting advantage; the flat social structure of a forager band hardens into ranked classes.',
        'Close the chain: whoever guards and distributes the surplus gains authority — and needs records (early writing begins as accounting), enforcers (soldiers), and a claim on everyone\'s harvest (taxation). Surplus → settlement → specialization → inequality → the state.',
      ],
      answer:
        'Domesticated crops create storable surplus; surplus creates permanent settlement and non-farming specialists; controlling the stored surplus creates permanent inequality, record-keeping, armies, and eventually rulers.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-origins-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "Farming was invented in the Fertile Crescent around 10,000 BCE and spread from there to the rest of the world, and people everywhere adopted it quickly because it was easier than hunting." Three separate errors are packed into that sentence. Untangle them.',
      steps: [
        'Error one — "invented." Domestication was not a single act by an inventor. It was thousands of years of people replanting the seeds they liked best, gradually changing the plants themselves. The Fertile Crescent transition unfolded over roughly two to three thousand years.',
        'Error two — "spread from there to the rest of the world." Agriculture arose independently in at least seven or eight regions with no contact between them: Southwest Asia, China, Mesoamerica, the Andes, West Africa, New Guinea, and more. Maize was not a Fertile Crescent crop carried west; it was domesticated from a wild Mexican grass by people who had never heard of wheat.',
        'Error three — "easier." Farmers worked longer hours than foragers and ate a narrower diet. The skeletal evidence points the other way: shorter bodies, worse teeth, more disease. Foragers did not sit around waiting to be rescued by agriculture.',
        'Now replace the wrong causal claim with the right one. Farming did not spread because it was pleasant; it spread because it fed more people per acre. Farming populations grew, expanded into neighboring land, and gradually absorbed or displaced foraging neighbors.',
        'Rewrite the sentence honestly: "Between roughly 10,000 and 3,000 BCE, people in several unconnected world regions gradually domesticated local plants and animals. Farming spread because it supported far larger populations, not because it made individual lives easier."',
      ],
      answer:
        'Domestication was gradual, not invented; it began independently in many regions rather than radiating from one; and it spread by supporting more people per acre, not by being easier or healthier.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-independent-origins',
      kind: 'try_yourself',
      problem:
        'Maize, beans, and squash were domesticated from wild species native to Mesoamerica. Rice and millet were domesticated from wild species native to China. Wheat, barley, sheep, and goats were domesticated from wild species native to Southwest Asia. None of these regions was in contact with the others at the time. What does this pattern best support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Agriculture developed independently in several separate world regions, each using the wild species available locally',
          correct: true,
        },
        { id: 'b', text: 'Farming was invented once in the Fertile Crescent and carried worldwide by traders' },
        { id: 'c', text: 'All of these crops descend from a single ancestral plant spread by early migrations' },
        { id: 'd', text: 'Agriculture began only after the first cities and writing systems appeared' },
      ],
      expectedAnswer:
        'Agriculture developed independently in several separate world regions, each using the wild species available locally',
      hints: [
        'Look at WHICH species each region domesticated — are they the same crops, or different ones?',
        'People domesticate what grows wild around them. Different wild species in unconnected regions means separate beginnings.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-skeletal-evidence',
      kind: 'try_yourself',
      problem:
        'An archaeologist summarizing burials at one early farming village reports the following: adults buried after the village shifted to grain farming were on average shorter than the foragers buried in the same valley a few centuries earlier, and their teeth show far more decay and more marks left by childhood hunger. Over those same centuries, the village\'s population grew steadily. Which conclusion do these findings best support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Farming supported many more people even though the health of the average individual got worse',
          correct: true,
        },
        { id: 'b', text: 'Farming improved individual nutrition, which is why the population grew' },
        { id: 'c', text: 'The village was conquered, and the shorter skeletons belong to captives' },
        { id: 'd', text: 'Foraging had stopped producing enough food to keep anyone alive' },
      ],
      expectedAnswer: 'Farming supported many more people even though the health of the average individual got worse',
      hints: [
        'Two facts are pulling in opposite directions here: bodies got worse, numbers went up. A good conclusion has to hold both.',
        'Population growth measures how many people the LAND can feed, not how well any one person eats.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-specialization',
      kind: 'try_yourself',
      problem:
        'Which development most directly explains how a Neolithic community could support full-time potters, metalworkers, and priests who grew no food of their own?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Farming produced a storable surplus, so feeding everyone no longer required everyone to farm',
          correct: true,
        },
        { id: 'b', text: 'The invention of writing let leaders assign people to different jobs' },
        { id: 'c', text: 'The domestication of horses opened long-distance trade routes for buying food' },
        { id: 'd', text: 'The end of the last Ice Age made wild food so abundant that farming became optional' },
      ],
      expectedAnswer: 'Farming produced a storable surplus, so feeding everyone no longer required everyone to farm',
      hints: [
        'A potter who never plants anything still has to eat. Where does that food come from?',
        'Writing and long-distance trade come LATER — they are consequences of settled surplus societies, not causes of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sudden-switch',
      kind: 'misconception_check',
      question:
        'A student says: "The Neolithic Revolution was a sudden event around 10,000 BCE when humans stopped hunting and gathering and started farming." What needs correcting?',
      commonErrors: [
        {
          answer: 'Humans switched from foraging to farming in one sudden change around 10,000 BCE',
          misconception:
            'Reading the word "revolution" as a single dated event, and assuming foraging ended everywhere once farming began.',
          correctsTo:
            'It is called a revolution for its EFFECTS, not its speed. Domestication unfolded over two to three thousand years in each region, and the regions started at different times — Southwest Asia around 10,000 BCE, Mesoamerica later. Foraging never simply stopped: many communities farmed part-time and foraged the rest, and foraging peoples still lived across large parts of the world thousands of years after the first farms. Think overlap and gradual shift, not a switch being flipped.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Domestication was gradual selection over many generations, beginning around 10,000 BCE as the last Ice Age ended — and it began independently in the Fertile Crescent, China, Mesoamerica, the Andes, West Africa, and New Guinea.',
        'The chain to remember: surplus → sedentism → specialization → inequality → record-keeping, armies, and states.',
        'It was a trade, not an upgrade: more people per acre and food security, bought with harder labor, narrower diets, new animal-borne diseases, and permanent social hierarchy.',
        'Jericho (walls by c. 8000 BCE) and Çatalhöyük (thousands of people around 7000 BCE) show large permanent settlements arriving BEFORE kings, temples, and writing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'From Foragers to Farmers: The Neolithic Revolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
