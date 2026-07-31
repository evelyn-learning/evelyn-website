/**
 * World History — Industry, Nationalism & Empire: Nationalism & Unification.
 *
 * The century's most powerful idea, and its double edge: the same claim
 * that welds Italy and Germany together tears the Ottoman and Habsburg
 * empires apart — assembling the Balkan tinderbox and the French grudge
 * that detonate in Unit 9. Factual spine salvaged from the legacy
 * world-history nationalism seed, reframed subject-first.
 * C3 D2.His.14.9-12, D2.Civ.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U8_NATIONALISM_UNIFICATION: LessonPlan = {
  id: 'evelyn.hs.whist.nationalism-unification.v1',
  title: 'Nationalism & Unification',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.nationalism-unification',
      standard: 'WHIST-8.3',
      description:
        'Explain how 19th-century nationalism grew out of the revolutionary era, unified Italy and Germany while fracturing the multiethnic Ottoman and Austro-Hungarian empires, and reshaped states from Europe to Meiji Japan (C3 D2.His.14.9-12, D2.Civ.14.9-12).',
    },
  ],
  prerequisites: ['whist.industrial-society-reform'],
  followUps: ['whist.new-imperialism'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the world map students think of as permanent is younger than the light bulb — and that one idea drew most of its lines.',
      script:
        'Look at a map of Europe. Italy and Germany look as permanent as the Alps. They are not. In 1850 there was no country called Italy — the peninsula was a patchwork of kingdoms, duchies, and Austrian-run provinces. There was no country called Germany either, just dozens of German-speaking states arguing with each other. Both were built from scratch inside a single decade, by men who were very clear about what they were doing. The idea that built them — that people who share a language and a history deserve their own state — is the most powerful political idea of the last two hundred years. It made two countries. It also blew two empires apart, and the wreckage of that is where the First World War starts. Today you learn the idea, and both of its edges.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nationalism-unification',
      kind: 'concept',
      goal: 'The nationalist claim, its revolutionary origin, the 1848 wave, the Italian and German unifications, and the empires it shattered.',
      keyIdeas: [
        'THE CLAIM ITSELF — nationalism says a "nation" (people sharing language, culture, history, often religion) should govern itself in ONE state, and that the state\'s legitimacy comes from that people rather than from a royal family\'s inherited claim to land. Note what this makes obsolete: an emperor ruling a dozen peoples because his great-grandfather married well.',
        'BORN IN 1789, SPREAD BY NAPOLEON — the French Revolution invented the nation-in-arms: citizens who fought for France because it was THEIRS, not for a king who owned it. Napoleon then marched that army across Europe — and the peoples he conquered (Germans, Italians, Spaniards, Russians) discovered their own national feeling by resisting him. Conquest exported the very idea that would defeat the conqueror.',
        'THE 1848 REVOLUTIONS — the turning point that failed to turn. A liberal-nationalist wave swept Paris, Vienna, Berlin, Budapest, Milan, and the Frankfurt Parliament in a single year: constitutions, elected assemblies, national self-rule. By 1849, monarchs and armies had crushed nearly all of it. But the demands did not die — within twenty years, conservative statesmen delivered the NATIONAL half of the 1848 program (unification) while withholding the LIBERAL half (democracy).',
        "ITALY — TWO ROADS, ONE KINGDOM. Camillo di Cavour, prime minister of Piedmont-Sardinia, worked by realpolitik: he allied with France to beat Austria out of the north (1859) and traded territory for advantage. Giuseppe Garibaldi worked from below: in 1860 his roughly thousand volunteer Red Shirts took Sicily and marched up the mainland — then handed his conquests to the Piedmontese king instead of ruling them. Kingdom of Italy proclaimed 1861; Rome taken and made the capital in 1870.",
        'GERMANY — BLOOD AND IRON. Otto von Bismarck, minister-president of Prussia, said the great questions of the age would be settled not by speeches and majority votes but by iron and blood — and then did it, engineering three short wars: against Denmark (1864), against Austria (1866, which shoved Austria out of German affairs), and against France (1870-1871). The German Empire was proclaimed in January 1871 in the Hall of Mirrors at Versailles — in the palace of the defeated French. France never forgot that humiliation, or the lost provinces of Alsace and Lorraine; keep it in mind for Unit 9.',
        'THE DOUBLE EDGE — the same idea that GLUED Italy and Germany together SHREDDED empires made of many peoples. The Ottoman Empire, nicknamed "the sick man of Europe," lost nation after nation in the Balkans: Greek independence (1830), then Serbian and Bulgarian self-rule. Austria split the difference with the Compromise of 1867, becoming Austria-Hungary and promoting Hungarians to co-rulers — which satisfied Hungarians briefly and enraged the Czechs, Croats, Serbs, Poles, and Romanians who got nothing. Every new Balkan border left a minority on the wrong side of it. That is the tinderbox.',
        'NOT ONLY A EUROPEAN STORY — Japan\'s Meiji Restoration (1868) is defensive nationalism: after Western warships forced the ports open, reformers overthrew the shogun, restored the emperor as a national symbol, and industrialized at emergency speed on the reasoning that a country must modernize or be colonized. It worked — Japan became the one Asian state to join the imperial powers rather than be carved up by them (see 8.4).',
        'CIVIC VS ETHNIC — TWO ANSWERS TO "WHO BELONGS?" Civic nationalism defines the nation by shared citizenship, laws, and loyalty (anyone who joins and obeys is in). Ethnic nationalism defines it by descent, language, and ancestry (you are born in or you never get in). The first can absorb newcomers; the second, in a region where peoples live mixed together, has no peaceful answer for the neighbors — which is precisely the Balkan problem.',
      ],
      vocabulary: [
        {
          term: 'nationalism',
          definition:
            'the belief that a people sharing language, culture, and history should govern themselves in a single independent state.',
        },
        {
          term: 'realpolitik',
          definition:
            "politics run on cold calculation of power and interest rather than ideals — Bismarck's trademark method.",
        },
        {
          term: 'multiethnic empire',
          definition:
            'a state ruling many different peoples under one dynasty (Ottoman, Austro-Hungarian, Russian) — the exact structure nationalism attacks.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-napoleon-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did Napoleon — a French conqueror trying to dominate Europe — help create the German nation that would crush France in 1871?',
      steps: [
        'Start at the source: the French Revolution redefined the army as citizens fighting for their own nation. That army was bigger, more motivated, and more expendable than any king\'s professional force — which is how Napoleon won so much so fast.',
        'Follow the conquest: between 1803 and 1812 Napoleon overran the German lands, abolished the ancient Holy Roman Empire (1806), and merged hundreds of tiny states into a few dozen larger ones. He simplified the map for his own convenience — and left German unification a far shorter step than it had been.',
        'Follow the humiliation: occupation, requisitions, and conscription into French service taught German-speakers something they had not felt before — that they were GERMANS, and that a foreign nation was ruling them. Writers, students, and soldiers turned that feeling into a movement.',
        'Follow the idea forward: the 1848 revolutionaries tried to build a united Germany from below through the Frankfurt Parliament and failed. Bismarck then built it from above with the Prussian army — but he was harvesting national feeling that Napoleon had helped plant.',
        'Close the chain at Versailles: in 1871 the German Empire is proclaimed inside a French royal palace, and France loses Alsace and Lorraine. French conquest → German national awakening → German unification → French defeat. Ideas do not stay where you send them.',
      ],
      answer:
        'Napoleon exported revolutionary nationalism by force: his conquests consolidated the German states and provoked a German national identity, which 1848 tried and failed to organize and Bismarck then forged into an empire that defeated France.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-blood-and-iron',
      kind: 'worked_example',
      problem:
        'In 1862 the Prussian minister-president told a committee of legislators (paraphrased): "Prussia\'s strength must be gathered and held ready for the right moment, which we have already missed more than once. The great questions of our day will not be decided by speeches and majority votes — that was the great mistake of 1848 — but by iron and blood." Unpack what this statement is arguing, and what it predicts.',
      steps: [
        'Identify the speaker and the moment: Bismarck, newly in charge of Prussia in 1862, is talking to legislators who want to control the military budget. He is telling elected representatives that their votes are not where power lives.',
        'Decode "iron and blood": iron means industry and weapons (Prussia had coal, steel, and Krupp artillery); blood means willingness to fight wars. Together: a state is made by armies and industry, not by debate.',
        'Read the insult in "the great mistake of 1848": he is dismissing the liberal nationalists who tried to unify Germany by writing a constitution and voting on it in the Frankfurt Parliament. His claim is that they had the goal right and the METHOD hopelessly wrong.',
        'Notice what he is NOT rejecting — the nation itself. Bismarck is a conservative Prussian aristocrat who has no love for democracy, yet he intends to deliver the nationalists\' prize. That is realpolitik: adopt your rivals\' goal when it strengthens your state.',
        'Check the prediction against events: within nine years he fought Denmark (1864), Austria (1866), and France (1870-1871), and Germany was unified — by armies, exactly as advertised. Unification came without the liberal constitution of 1848; Germans got a nation but not self-government, and that unbalanced bargain shapes German politics into the 20th century.',
      ],
      answer:
        'Bismarck is arguing that unification will be achieved by Prussian military and industrial power rather than by parliaments — dismissing the 1848 liberals\' method while stealing their goal. The three wars of 1864-1871 delivered exactly that: a German nation-state built from above, without the democracy the revolutionaries had wanted.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1848',
      kind: 'try_yourself',
      problem:
        'The revolutions of 1848 were almost all defeated within a year. Why do historians still call 1848 a turning point in the history of nationalism?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The revolutions failed, but their national demands survived and were later carried out from above by conservative statesmen like Cavour and Bismarck',
          correct: true,
        },
        { id: 'b', text: 'The revolutions succeeded, creating unified Italy and Germany in 1848 itself' },
        { id: 'c', text: 'They were protests against factory conditions with no political program' },
        { id: 'd', text: 'They ended monarchy permanently across Europe' },
      ],
      expectedAnswer:
        'The revolutions failed, but their national demands survived and were later carried out from above by conservative statesmen like Cavour and Bismarck',
      hints: [
        'Separate the OUTCOME of 1848 from the IDEAS of 1848 — one was crushed, the other was not.',
        'Italy is unified in 1861 and Germany in 1871 — who delivered the nationalists\' goal, and by what method?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unification-methods',
      kind: 'try_yourself',
      problem:
        'Which statement best captures how Italian unification differed from German unification?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: "Italy combined top-down diplomacy (Cavour) with a genuine popular volunteer movement (Garibaldi's Red Shirts), while Germany was engineered almost entirely from above by Bismarck and the Prussian army",
          correct: true,
        },
        { id: 'b', text: 'Italy unified peacefully by treaty while Germany unified through war' },
        { id: 'c', text: "Garibaldi unified Germany while Bismarck's volunteers unified Italy" },
        { id: 'd', text: 'Both unified through popular elections in which citizens voted to merge their states' },
      ],
      expectedAnswer:
        "Italy combined top-down diplomacy (Cavour) with a genuine popular volunteer movement (Garibaldi's Red Shirts), while Germany was engineered almost entirely from above by Bismarck and the Prussian army",
      hints: [
        'Both used war — so the difference is not war versus peace. Ask instead WHO was doing the unifying.',
        'One country had a thousand volunteers marching up the peninsula; the other had a chancellor and a general staff.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-double-edge',
      kind: 'try_yourself',
      problem:
        'Nationalism built new states in Italy and Germany but threatened the Ottoman and Austro-Hungarian empires with collapse. What explains the opposite effects?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Italy and Germany were many small states sharing one language, so nationalism gathered them; the empires ruled many different peoples, so the same principle gave each people a reason to break away',
          correct: true,
        },
        { id: 'b', text: 'The Ottoman and Austrian rulers had never heard of nationalism' },
        { id: 'c', text: 'Nationalism only appealed to industrialized societies, and the empires had no industry at all' },
        { id: 'd', text: 'The empires collapsed because their populations were shrinking' },
      ],
      expectedAnswer:
        'Italy and Germany were many small states sharing one language, so nationalism gathered them; the empires ruled many different peoples, so the same principle gave each people a reason to break away',
      hints: [
        'Apply the rule "one people, one state" to a land with one people — then to a land with a dozen.',
        'Greek independence in 1830, then Serbia and Bulgaria: subtraction from an empire, not addition to a nation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ancient-nations',
      kind: 'misconception_check',
      question:
        'A student writes: "Italy and Germany are ancient nations that finally reunited in the 1800s after being divided." What needs correcting?',
      commonErrors: [
        {
          answer: 'They were ancient nations that reunited',
          misconception:
            'Projecting today\'s map backward and treating nation-states as natural, permanent units that occasionally get broken and repaired — rather than recent political constructions.',
          correctsTo:
            'Neither had ever been a single state before. "Italy" was a geographic term for a peninsula of rival kingdoms and Austrian provinces; "Germany" was dozens of separate states, and many of their people spoke mutually difficult dialects and felt loyal to their own duke, city, or church long before they felt "Italian" or "German." Cavour, Garibaldi, and Bismarck did not restore old nations — they built new ones, then taught people to belong to them through schools, armies, railroads, and a standardized national language.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The nationalist claim: a people sharing language, culture, and history should rule itself in one state — legitimacy from the nation, not the dynasty.',
        'Born of the French Revolution (the nation-in-arms) and spread by Napoleon, whose conquests provoked the national feeling that later defeated France.',
        '1848: a liberal-nationalist wave crushed within a year, but its national demands were delivered from above two decades later — nation without democracy.',
        'Italy 1861 (Rome 1870) = Cavour\'s realpolitik plus Garibaldi\'s Red Shirts; Germany 1871 = Bismarck\'s "blood and iron" and three engineered wars, proclaimed at Versailles.',
        'The double edge: nationalism unified Italy and Germany but dismembered the Ottoman Empire (Greece 1830, Serbia, Bulgaria) and destabilized Austria-Hungary after the 1867 Compromise — assembling the Balkan tinderbox.',
        'Outside Europe, Meiji Japan (1868) used nationalism defensively — modernize fast or be colonized — and became a power instead of a colony.',
        'Civic nationalism (shared citizenship) can include newcomers; ethnic nationalism (shared descent) cannot — the difference between a nation that grows and a border that has to be fought over.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Nationalism & Unification' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
