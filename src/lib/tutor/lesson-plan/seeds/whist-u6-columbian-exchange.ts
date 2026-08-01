/**
 * World History — Global Encounters: The Columbian Exchange & the Atlantic World.
 *
 * The moment two hemispheres that had evolved apart for ten thousand years
 * were stitched into one system — food, animals, silver, disease, and forced
 * migration — and the wildly unequal way the costs were distributed. Runs
 * forward from the Age of Exploration (6.1-6.3) and sets up the wealth,
 * curiosity, and inequality of the centuries that follow. Factual spine
 * salvaged from the legacy world-history global-encounters seeds, reframed
 * subject-first. C3 D2.His.14.9-12, D2.Geo.7.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U6_COLUMBIAN_EXCHANGE: LessonPlan = {
  id: 'evelyn.hs.whist.columbian-exchange.v1',
  title: 'The Columbian Exchange & the Atlantic World',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.columbian-exchange',
      standard: 'WHIST-6.4',
      description:
        'Explain the two-way transfer of crops, animals, and epidemic disease that followed 1492 and evaluate how demographic collapse, silver-driven global trade, and the transatlantic slave trade bound the hemispheres into a single, deeply unequal system (C3 D2.His.14.9-12, D2.Geo.7.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.age-of-exploration'],
  followUps: ['whist.scientific-revolution'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the two-way, planet-sized scale of the post-1492 exchange visible — and set up that its benefits and its costs landed on very different people.',
      script:
        "Try to picture Italian cooking without tomatoes, Irish history without potatoes, Swiss chocolate without cacao, or a Plains buffalo hunt without horses. None of those pairings existed before 1492 — the plants and animals were on the wrong side of the ocean. For roughly ten thousand years the Americas and Afro-Eurasia had evolved in near-total isolation from each other, growing different crops, raising different animals, and carrying different germs. Then a few ships crossed, and the two halves of the planet were sewn permanently together. Within a century, diets on every continent had changed, silver from a mountain in the Andes was paying taxes in China, and the population of the Americas had collapsed by as much as ninety percent. One event, wildly different bills. Today we follow who got what — and who paid.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-columbian-exchange',
      kind: 'concept',
      goal: 'The two-way biological transfer, the disease catastrophe and why it was so one-sided, colonial extraction, and the rise of the transatlantic slave trade.',
      keyIdeas: [
        'TWO HEMISPHERES, TWO SHOPPING LISTS — after 1492 living things moved both directions. From the Americas: potatoes, maize (corn), tomatoes, cacao, chili peppers, tobacco, vanilla. To the Americas: horses, cattle, pigs, sheep, wheat, rice, sugarcane, coffee. Almost every "traditional" national dish you can name on either side is younger than 1492.',
        'AMERICAN CROPS FED A GLOBAL POPULATION BOOM — potatoes and maize produce more calories per acre than most Old World staples and grow on land wheat and rice reject: cold Northern European soil, dry African uplands, Chinese hillsides. Historians link them to major population growth in Europe, China, and West Africa over the following centuries. Ireland became so dependent on the potato that a crop disease in the 1840s produced a catastrophic famine.',
        'DISEASE WAS THE DEADLIEST CARGO — smallpox, measles, influenza, typhus, and malaria crossed with the ships. Indigenous American populations had never encountered them and carried no acquired immunity, so entire communities fell sick at once: "virgin-soil epidemics." Estimates vary by region, but many put the loss at up to 90 percent of the pre-contact population within about a century. This is the single largest demographic catastrophe in human history, and it deserves to be stated plainly, not softened.',
        'WHY THE ASYMMETRY — GERMS FOLLOW LIVESTOCK — most Afro-Eurasian killers began as diseases of domesticated herd animals (cattle, pigs, chickens) that then jumped to the humans crowded alongside them for millennia. The Americas domesticated far fewer herd animals — llamas and alpacas, not kept in dense mixed herds — so that disease pool never developed. The traffic went one way because the germ pool was one-sided, not because of anything about the people.',
        'DISEASE + ALLIES EXPLAIN THE CONQUESTS, NOT "SUPERIOR" EUROPEANS — Cortés took Tenochtitlan in 1521 with a few hundred Spaniards and tens of thousands of Indigenous allies, above all the Tlaxcalans, who had their own long grievance against Aztec tribute demands (see 5.3). A smallpox epidemic swept the city during the siege, killing the emperor Cuitlahuac. Pizarro reached Peru in 1533 after smallpox had already run ahead of him and helped touch off an Inca civil war between Atahualpa and Huascar. Both conquests were the collapse of empires already reeling, plus the skilled exploitation of existing local rivalries.',
        'EXTRACTION: SILVER AND FORCED LABOR — the silver mountain at Potosí (in present-day Bolivia, mined from 1545) made Spanish America the world\'s dominant silver source. Under the encomienda system, colonists were granted the labor of Indigenous communities — forced labor with a legal wrapper — and later drafts sent rotating crews into the mines, where mortality was severe.',
        'SILVER MADE THE FIRST TRULY GLOBAL TRADE LOOP — Ming China had converted its taxes to silver payment, creating enormous demand. From 1571 the Manila galleons carried American silver west across the Pacific to Manila, where it bought Chinese silk and porcelain; more silver crossed the Atlantic to Spain, where the flood of money drove long-running inflation. Goods and money now circled the entire planet.',
        'AS INDIGENOUS LABOR COLLAPSED, THE SLAVE TRADE EXPANDED — with the Indigenous population devastated, colonizers turned to enslaved Africans. Over roughly four centuries about 12.5 million people were forcibly transported from Africa across the Atlantic; roughly 10.7 million survived the Middle Passage, the weeks-long crossing spent chained below deck. American slavery was chattel slavery: people defined in law as property, with that status inherited by their children — harsher and more permanent than most earlier forms of bondage. The sugar plantation of Brazil and the Caribbean was the template, and it consumed lives so fast it demanded constant replacement.',
      ],
      vocabulary: [
        {
          term: 'Columbian Exchange',
          definition:
            'the two-way transfer of plants, animals, people, and diseases between the Americas and Afro-Eurasia after 1492.',
        },
        {
          term: 'virgin-soil epidemic',
          definition:
            'an outbreak in a population with no prior exposure and therefore no acquired immunity, so nearly everyone sickens at once and even caregiving collapses.',
        },
        {
          term: 'encomienda',
          definition:
            'the Spanish colonial grant giving a colonist the forced labor and tribute of an Indigenous community, in theory in exchange for protection and religious instruction.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-labor-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did the arrival of European ships in the Caribbean lead, within a few decades, to millions of Africans being forcibly transported across the Atlantic?',
      steps: [
        'Start with what the colonizers wanted: exportable wealth. Silver from Andean and Mexican mines, and sugar from Caribbean and Brazilian plantations. Both are brutally labor-hungry — sugar especially, since cane must be cut and boiled within hours of harvest.',
        'Identify the first labor source: the Indigenous population already living there, compelled through the encomienda system and later mining drafts. On paper, colonists thought their labor problem was solved.',
        'Now add the disease shock: smallpox, measles, and influenza tore through communities with no immunity, and the deaths compounded with forced labor, malnutrition, and displacement. On some Caribbean islands the Indigenous population was nearly extinguished within a generation; across the hemisphere losses reached as high as 90 percent.',
        'Follow the consequence the colonizers saw: the labor force they had planned to exploit was gone, while European demand for sugar and silver kept climbing. They needed workers who could be moved in, held permanently, and legally owned.',
        'Close the chain: Portuguese and later English, French, and Dutch traders expanded an existing Atlantic trade in enslaved Africans into an industrial-scale system — roughly 12.5 million people embarked over four centuries, the large majority to Brazil and the Caribbean sugar colonies, not to North America. Demography plus cash crops plus law equals the largest forced migration in history.',
      ],
      answer:
        'Cash-crop and mining profits demanded mass labor; epidemic disease destroyed the Indigenous labor force colonizers had planned to coerce; so they replaced it with enslaved Africans, building a permanent, inheritable system of chattel slavery around the sugar plantation.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-nahua-account',
      kind: 'worked_example',
      problem:
        'Nahua elders in central Mexico later described the 1520 epidemic to Spanish chroniclers. A paraphrase of their account: "A great sickness spread over us. Sores broke out on our faces and chests until we could not walk or turn in bed. Many died of the disease, and many more died of hunger, because there was no one left well enough to bring food or water." What does this account let a historian conclude about the conquest of the Aztec Empire — and what does it not?',
      steps: [
        "Source it first. This is Indigenous testimony recorded a generation or so after the events, from survivors describing their own communities — close to the experience, but a memory, not a same-day record. That is normal for this period and does not make it unreliable; it makes it a recollection.",
        'Read what it directly documents: an epidemic that struck nearly everyone at once. The detail that matters most is the second cause of death — hunger, because too few people were well enough to fetch food. That is the signature of a virgin-soil epidemic, where simultaneous mass illness destroys ordinary care.',
        'Connect it to the military story. The siege of Tenochtitlan ran into 1521, with a smallpox outbreak sweeping the city and killing the emperor Cuitlahuac. A defending population that cannot walk, farm, or organize is not a population that can hold a city under siege.',
        'Now the limit: this account says nothing about weapons, tactics, or alliances. On its own it cannot explain why Tlaxcalan warriors — furious over years of Aztec tribute demands — fought alongside Cortés in tens of thousands, and that alliance is essential to the outcome. One source, one piece of the causation.',
        'Put the pieces together: epidemic collapse plus Indigenous allies with their own reasons to fight plus Spanish steel, horses, and firearms. The account is powerful evidence for the first factor and silent on the second — which is exactly why historians never rest a conquest explanation on a single document.',
      ],
      answer:
        'It is strong firsthand evidence for the disease catastrophe — mass simultaneous illness plus starvation from collapsed caregiving — and helps explain why Tenochtitlan fell in 1521; it says nothing about Tlaxcalan alliances or Spanish weaponry, so it explains part of the conquest, not all of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-disease-asymmetry',
      kind: 'try_yourself',
      problem:
        'Afro-Eurasian diseases like smallpox devastated Indigenous American populations, but no comparable American disease devastated Europe. What best explains this one-way traffic?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Afro-Eurasians had lived for millennia beside dense herds of domesticated animals, breeding a large pool of diseases the Americas never developed',
          correct: true,
        },
        { id: 'b', text: 'Europeans were biologically stronger than Indigenous Americans' },
        { id: 'c', text: 'The Americas had no infectious diseases of any kind before 1492' },
        { id: 'd', text: 'Europeans deliberately engineered smallpox as a weapon before crossing the Atlantic' },
      ],
      expectedAnswer:
        'Afro-Eurasians had lived for millennia beside dense herds of domesticated animals, breeding a large pool of diseases the Americas never developed',
      hints: [
        'Ask where these particular germs came from originally — smallpox, measles, and influenza all have animal origins.',
        'Compare the livestock: cattle, pigs, sheep, and chickens crowded together for thousands of years, versus llamas and alpacas that were never herded that way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-slave-trade-cause',
      kind: 'try_yourself',
      problem:
        'Which development most directly caused colonizers in Spanish and Portuguese America to turn to the mass importation of enslaved Africans?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Epidemic disease and forced labor destroyed the Indigenous population colonizers had been exploiting, while demand for sugar and silver kept rising',
          correct: true,
        },
        { id: 'b', text: 'Indigenous Americans refused to farm crops they had never grown before' },
        { id: 'c', text: 'African kingdoms conquered Caribbean territory and settled it themselves' },
        { id: 'd', text: 'The invention of the steam engine made long ocean voyages profitable for the first time' },
      ],
      expectedAnswer:
        'Epidemic disease and forced labor destroyed the Indigenous population colonizers had been exploiting, while demand for sugar and silver kept rising',
      hints: [
        'The question is about a labor shortage — ask what happened to the workforce colonizers were already coercing.',
        'Check the centuries too: the sugar-and-silver boom runs from the 1500s, while steam power belongs to the late 1700s and after.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-silver-loop',
      kind: 'try_yourself',
      problem:
        'Silver mined at Potosí from 1545 was carried west across the Pacific on the Manila galleons from 1571. Why did so much American silver end up in China?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Ming China required taxes to be paid in silver, creating huge demand that American mines were uniquely able to supply',
          correct: true,
        },
        { id: 'b', text: 'China had conquered the Philippines and taxed Spanish shipping directly' },
        { id: 'c', text: 'Spain sent silver to China as payment for military assistance against the Ottomans' },
        { id: 'd', text: 'Chinese merchants had no goods Europeans wanted, so silver was sent as a gift' },
      ],
      expectedAnswer:
        'Ming China required taxes to be paid in silver, creating huge demand that American mines were uniquely able to supply',
      hints: [
        'Silver flows toward whoever needs it most — ask what a Chinese household in the 1500s had to hand over to the tax collector.',
        'Follow the return cargo: the galleons sailed back east loaded with Chinese silk and porcelain, so this was trade, not tribute or a gift.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-superior-europeans',
      kind: 'misconception_check',
      question:
        'A student writes: "A few hundred Spaniards with guns and horses conquered the Aztec Empire because European technology and soldiers were simply superior." What needs correcting?',
      commonErrors: [
        {
          answer: 'Superior European weapons and soldiers defeated the Aztec Empire',
          misconception:
            'Treating the conquest as a straight military contest between a small European force and a whole empire, which erases both the epidemic and the tens of thousands of Indigenous people who chose to fight alongside Cortés for their own reasons.',
          correctsTo:
            'Cortés never fought alone: the Tlaxcalans and other peoples resentful of Aztec tribute demands supplied the bulk of the army besieging Tenochtitlan in 1521, pursuing their own political goals. Meanwhile smallpox swept the city mid-siege, killing the emperor Cuitlahuac and much of the defending population. Pizarro likewise arrived in 1533 after disease had already helped trigger an Inca civil war. Steel, horses, and firearms mattered, but the decisive factors were epidemic collapse and existing local rivalries — not superior people.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The exchange ran both ways: potatoes, maize, tomatoes, cacao, and tobacco out of the Americas; horses, cattle, pigs, wheat, and sugarcane in — reshaping diets worldwide.',
        'American crops fueled population booms in Europe, China, and Africa; potatoes and maize thrive on land older staples cannot use.',
        'Disease was the deadliest transfer: virgin-soil epidemics of smallpox, measles, and influenza killed up to 90 percent of Indigenous Americans — the largest demographic catastrophe in human history. The asymmetry came from Afro-Eurasia\'s herd-animal disease pool, nothing else.',
        'Cortés (1521) and Pizarro (1533) succeeded because of epidemic collapse plus Indigenous allies with their own grievances — not European superiority.',
        'Potosí silver plus the Manila galleons (from 1571) plus Ming tax demand created the first genuinely global trade loop; encomienda labor and later mining drafts paid for it in Indigenous lives.',
        'As that labor force collapsed, about 12.5 million Africans were forcibly transported across the Atlantic over four centuries into inheritable chattel slavery, with the sugar plantation as the model — 1492 made one world, and the costs of building it fell on the people who had the least say in it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'The Columbian Exchange & the Atlantic World' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
