/**
 * World History — Industry, Nationalism & Empire: The New Imperialism.
 *
 * Picks up exactly where 8.1 left off: industrial resource hunger loads the
 * gun, and between roughly 1870 and 1914 nearly all of Africa and much of
 * Asia passes under direct European political rule. The unit's payoff is a
 * map students still live on — borders drawn in Berlin in 1884-85 by people
 * who had never been to the places they were dividing. Salvaged factual
 * spine from the legacy world-history imperialism seeds, reframed
 * subject-first. C3 D2.His.14.9-12, D2.His.1.9-12, D2.Geo.6.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U8_NEW_IMPERIALISM: LessonPlan = {
  id: 'evelyn.hs.whist.new-imperialism.v1',
  title: 'The New Imperialism',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.new-imperialism',
      standard: 'WHIST-8.4',
      description:
        'Explain what made the imperialism of roughly 1870 to 1914 new — direct political rule over most of Africa and much of Asia — by analyzing its industrial, nationalist, and ideological causes, the technologies that enabled it, and the resistance it met (C3 D2.His.14.9-12, D2.Geo.6.9-12).',
    },
  ],
  prerequisites: ['whist.nationalism-unification'],
  followUps: ['whist.world-war-i'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the speed and the still-visible consequences of the partition land: a map redrawn in thirty years by people who had never seen the land they were dividing.',
      script:
        'Look at a map of Africa and you will notice something odd: a lot of the borders are straight lines. Rivers bend, mountain ranges wander, but those lines run dead straight for hundreds of miles, cutting through deserts, languages, and families. They are straight because they were drawn with rulers on a table in Berlin in the winter of 1884-85, by European diplomats, with not one African present. In 1870, Europeans directly ruled maybe a tenth of Africa, mostly coastal trading posts. By 1914 they ruled all of it but two countries. Thirty years. Today: how a continent changed hands that fast, why the industrial revolution you just studied made it almost inevitable, and why those straight lines are still on the news.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-new-imperialism',
      kind: 'concept',
      goal: 'What was NEW about it, the enabling technologies, the braided motives, the partition and its case studies, and the resistance that met it everywhere.',
      keyIdeas: [
        'WHAT MADE IT "NEW" — Europeans had traded with Africa and Asia for four centuries, but from coastal footholds: forts, harbors, and trading companies dealing with African and Asian states as states. After about 1870 they took DIRECT POLITICAL CONTROL of the interiors — governors, tax collectors, drawn borders, garrisons, courts. Old empires wanted trading posts; the new imperialism wanted territory and the people on it.',
        'THE ENABLING STACK — three technologies removed the three old barriers. QUININE (from cinchona bark) made malaria survivable, ending the disease wall that had kept Europeans pinned to the coast. STEAMSHIPS, railroads, and the TELEGRAPH moved troops and orders inland in days instead of months. The MAXIM GUN (1884), the first practical machine gun, made small forces lethal against large armies — the writer Hilaire Belloc summed the asymmetry up with brutal accuracy: whatever happens, we have got the Maxim gun, and they have not.',
        'THE MOTIVES WERE BRAIDED, NOT SINGLE — (1) ECONOMIC: industrial factories needed rubber, cotton, palm oil, copper, and tin coming in, and buyers for finished goods going out — the resource hunger 8.1 ended on, plus coaling stations and canals to protect the routes. (2) NATIONALIST PRESTIGE: after the unifications of 8.3, newly unified Germany (1871) and Italy (1871) arrived late to a table Britain and France had been sitting at for centuries, and colonies became scoreboard — a great power was a power with colonies. (3) IDEOLOGY, which made the first two sayable in public: SOCIAL DARWINISM misapplied Darwin\'s biology to nations and "races," recasting conquest as proof the conqueror was naturally fitter, while the CIVILIZING MISSION claimed Europeans had a duty to govern, convert, and "improve" people held incapable of governing themselves. Treat both as the self-justifying ideology they were — racist in their premises, built to make a taking sound like a gift. They are evidence about the people who made the arguments, not descriptions of the people they described.',
        'THE SCRAMBLE AND THE BERLIN CONFERENCE (1884-85) — hosted by Bismarck, fourteen powers attended and NO African ruler was present or consulted. The conference colonized nothing itself; it set rules among the Europeans, chiefly "effective occupation" — a claim counted only if you actually put administrators on the ground. That rule turned claim-staking into a race, and the borders it produced ignored the nations, languages, and kingdoms already there, packing rivals together and splitting peoples apart. Those borders survived independence and still shape conflicts today.',
        'CASE ONE, THE CONGO FREE STATE — from 1885 King Leopold II of Belgium held roughly a million square miles as his PERSONAL property, not Belgium\'s colony. Rubber quotas were enforced by hostage-taking, mutilation, and killing; population loss over the period is estimated at around 10 million. Journalist E. D. Morel and British consul Roger Casement documented it, and the Congo Reform Association that followed became arguably the first international human-rights campaign — public outrage forced Leopold to hand the territory to the Belgian state in 1908.',
        'CASE TWO, BRITISH INDIA — the East India Company, a private company, ruled much of India until the SEPOY REBELLION of 1857, a mass uprising of Indian soldiers and civilians. Britain crushed it and then dissolved the Company, ruling India directly from 1858 (the Raj). The famous railway network was laid to move raw cotton and grain OUT to ports, not to knit the country together; meanwhile machine-made British cloth destroyed India\'s handloom weaving, the deindustrialization 8.1 traced.',
        'CASE THREE, CHINA CARVED AND JAPAN THE EXCEPTION — China was never formally colonized, yet after losing the Opium Wars (1839-1842 and 1856-1860) it signed unequal treaties surrendering ports, tariffs, and jurisdiction over foreigners, and by the 1890s Britain, France, Germany, Russia, and Japan each held a "sphere of influence" inside a country still nominally its own. The Boxer Rebellion (1900) against foreign presence was crushed by an eight-nation force. JAPAN went the other way: it industrialized deliberately after 1868, then defeated Russia in 1905 — the first modern defeat of a European power by an Asian one, and a shockwave of encouragement through every colonized society watching.',
        'RESISTANCE WAS EVERYWHERE, AND SOMETIMES WON — Ethiopia under Menelik II destroyed an invading Italian army at ADWA in 1896 and kept its independence. The Zulu smashed a British column at Isandlwana in 1879 before being overwhelmed. Samory Toure fought France in West Africa for sixteen years. German forces answered the Herero and Nama uprisings in South West Africa with a campaign of extermination from 1904 to 1908, now recognized as genocide. The tally by 1914: in all of Africa, only Ethiopia and Liberia remained independent.',
      ],
      vocabulary: [
        { term: 'New Imperialism', definition: 'the wave of direct European territorial rule over Africa and Asia, roughly 1870-1914 — distinct from the older pattern of coastal trading posts.' },
        { term: 'sphere of influence', definition: 'a zone inside a still-sovereign country where one foreign power holds exclusive economic privileges (railways, mines, trade) without annexing it.' },
        { term: 'Social Darwinism', definition: 'the misapplication of natural selection to nations and "races," used to argue that conquest proved the conqueror was naturally superior.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-1870',
      kind: 'worked_example',
      problem:
        'Europeans had been sailing to Africa since the 1400s, but held only coastal strips for four hundred years. Build the chain that explains why the interior was taken between about 1870 and 1914 — and not earlier.',
      steps: [
        'Ask what was actually stopping them before 1870. Three walls: DISEASE (malaria killed European expeditions at catastrophic rates), DISTANCE (moving inland meant months on foot, with no way to resupply or send word), and FIREPOWER (muzzle-loading muskets gave no decisive edge over large, organized African armies).',
        'Knock down each wall with an industrial-era tool. Quinine defeats the disease wall. Steamboats on the Congo and Niger, railroads, and the telegraph defeat the distance wall. The Maxim gun of 1884 defeats the firepower wall. Notice the dates cluster: the toolkit finishes assembling in exactly the decades the Scramble begins.',
        'Now add the MOTIVE, because ability is not desire. Industrial factories needed rubber for tires and belting, palm oil for machine lubricant and soap, cotton, copper, and tin — plus customers. Colonies promised guaranteed supply and captive markets. This is 8.1 handing the story forward.',
        'Add the ACCELERANT from 8.3: Germany and Italy had just become countries, and in an age of nationalist competition a colony was a claim to great-power status. Once Germany began claiming in 1884, Britain and France claimed defensively so as not to be shut out — a rush that fed itself.',
        'Close with the RULE that turned a rush into a race: Berlin\'s "effective occupation" standard meant flags on maps counted for nothing without administrators on the ground. Every power now had to physically occupy or lose the claim. Chain complete: tools make it possible, industry makes it profitable, nationalism makes it urgent, and Berlin makes it fast.',
      ],
      answer:
        'Not one cause: industrial technology removed the disease, distance, and firepower barriers at the same moment industrial economies needed raw materials and markets, nationalist rivalry made colonies a prestige contest for newly unified Germany and Italy, and the Berlin Conference\'s effective-occupation rule turned claiming into a physical race.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ferry-argument',
      kind: 'worked_example',
      problem:
        'In 1885 a leading French politician defended colonial expansion to his parliament, arguing (paraphrased): "The higher races have a right over the lower races, and with that right comes a duty — the duty to civilize them. And let us be plain: our industry is choked with goods our own markets can no longer absorb." Take this argument apart: what is being claimed, and what does the second sentence do to the first?',
      steps: [
        'Source it before you judge it. This is a governing politician speaking to his own legislature in 1885 — the year after Berlin — trying to persuade skeptical lawmakers to fund expansion. He is making the strongest public case he has, which tells us what arguments were expected to WORK on that audience.',
        'Name argument one: the civilizing mission, resting on a claim of racial hierarchy. Note what kind of claim it is. It is asserted, not demonstrated — no evidence is offered that any population is "lower," because the hierarchy is the premise the rest of the sentence stands on. That premise was false then and is false now; our job is to identify it as the era\'s ideology, not to weigh it as a finding.',
        'Name argument two: overproduction. Industrial output exceeded what domestic buyers could absorb, so colonies are pitched as guaranteed markets. This one is an economic interest, stated plainly, and it lines up exactly with the industrial pressures of 8.1.',
        'Now read the two together, because the pairing is the point. If the mission is a selfless duty performed for others, why does it need a profit argument to close the sale? The second sentence exposes the first as the presentable face of a material interest — the duty language is what makes the market-seeking sayable in public.',
        'Test the ideology against the record. The same decade produced Leopold\'s rubber quotas in the Congo and railways in India built to carry goods to ports. Where "civilizing" and extraction pointed in different directions, extraction won — which is the strongest evidence for which motive was actually steering.',
      ],
      answer:
        'The speaker braids two claims: a civilizing-mission duty resting on an asserted, false racial hierarchy, and a plain economic need for markets. The economic sentence undercuts the moral one — it reveals the "duty" as the public justification for a material interest, and the colonial record of extraction rather than uplift confirms which motive actually drove policy.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-was-new',
      kind: 'try_yourself',
      problem:
        'Europeans had traded along African coasts since the 1400s. What best describes what was NEW about imperialism after roughly 1870?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Europeans took direct political control of vast interior territories instead of trading from coastal footholds', correct: true },
        { id: 'b', text: 'Europeans made contact with Africa and Asia for the first time' },
        { id: 'c', text: 'European trade with Africa and Asia began for the first time' },
        { id: 'd', text: 'European powers agreed to stop competing with one another overseas' },
      ],
      expectedAnswer: 'Europeans took direct political control of vast interior territories instead of trading from coastal footholds',
      hints: [
        'The word "new" is doing comparison work — compare 1600s coastal forts with 1900 colonial governors and drawn borders.',
        'Ask what changed: not WHETHER Europeans were there, but WHAT they were doing there — trading versus ruling.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-quinine',
      kind: 'try_yourself',
      problem:
        'For centuries European expeditions into the African interior collapsed from disease, keeping European presence on the coast. Which development most directly removed that barrier?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Quinine, which made malaria survivable for outsiders moving inland', correct: true },
        { id: 'b', text: 'The Maxim gun, which gave small forces overwhelming firepower' },
        { id: 'c', text: 'The Berlin Conference, which assigned territory to each power' },
        { id: 'd', text: 'The discovery of gold and diamonds in southern Africa' },
      ],
      expectedAnswer: 'Quinine, which made malaria survivable for outsiders moving inland',
      hints: [
        'Match the tool to the specific barrier named in the question — the barrier here is disease, not firepower or motive.',
        'Two of these are real parts of the story but answer different questions: one is about winning battles, one is about wanting the land.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-berlin',
      kind: 'try_yourself',
      problem: 'What did the Berlin Conference of 1884-85 actually do, and why do its effects still matter?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'European powers set rules among themselves for claiming African territory, with no Africans present — producing borders that ignored existing peoples and still shape conflicts today', correct: true },
        { id: 'b', text: 'African rulers negotiated with European powers to fix fair boundaries between their kingdoms' },
        { id: 'c', text: 'European powers agreed to grant independence to their African colonies within thirty years' },
        { id: 'd', text: 'The conference abolished the Atlantic slave trade and ended European involvement in Africa' },
      ],
      expectedAnswer: 'European powers set rules among themselves for claiming African territory, with no Africans present — producing borders that ignored existing peoples and still shape conflicts today',
      hints: [
        'Start with who was in the room — and who was not.',
        'The conference was about managing competition between rivals, not about the people whose land was on the table.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-resistance',
      kind: 'misconception_check',
      question:
        'A student writes: "Europeans took over Africa so easily because Africans had no organized states and did not really resist." What needs correcting?',
      commonErrors: [
        {
          answer: 'Africans were unorganized and did not resist',
          misconception: 'Reading the outcome backward into the process — assuming that because conquest succeeded, it must have been unopposed, and erasing the states and armies that fought it.',
          correctsTo:
            'Resistance was constant, organized, and sometimes victorious. Ethiopia under Menelik II destroyed an Italian army at Adwa in 1896 and stayed independent; the Zulu wiped out a British column at Isandlwana in 1879; Samory Toure held off France for sixteen years; the Herero and Nama fought German rule so hard that Germany answered with an extermination campaign from 1904 to 1908, now recognized as genocide. Africa was full of organized states — Asante, Sokoto, Ethiopia, Zulu, Buganda. Conquest succeeded not through African passivity but through the Maxim-gun firepower gap, European exploitation of rivalries between neighboring states, and the sheer depth of industrial resupply.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'What was NEW: direct political rule over interiors, roughly 1870-1914, replacing four centuries of coastal trading posts.',
        'The enabling stack: quinine beat disease, steamships and rail and telegraph beat distance, the Maxim gun beat numbers.',
        'The motives braid together: industrial raw materials and markets (8.1), nationalist prestige for latecomers Germany and Italy (8.3), and Social Darwinism plus the civilizing mission as self-justifying ideology.',
        'Berlin 1884-85 set European rules with no Africans present; "effective occupation" turned claiming into a race, and its borders still shape conflicts today.',
        'Cases: Leopold\'s Congo (rubber terror, around 10 million dead, the first international human-rights campaign), British India (1857 rebellion into Crown rule, extraction railways, ruined weaving), China carved into spheres after the Opium Wars, and Japan the exception that became an imperial power and beat Russia in 1905.',
        'Resistance everywhere — Adwa 1896 won; by 1914 only Ethiopia and Liberia remained independent in Africa.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'The New Imperialism' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
