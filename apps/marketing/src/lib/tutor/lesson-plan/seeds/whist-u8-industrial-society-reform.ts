/**
 * World History — Industry, Nationalism & Empire: Industrial Society &
 * Reform Movements.
 *
 * Part two of the industrial story: what the factory city did to people,
 * and the whole spectrum of answers it provoked — laissez-faire, reform,
 * unions, socialism. This is where the modern political spectrum and the
 * modern reform playbook are born; it feeds Unit 8.3's nationalism and,
 * later, the revolutions of Units 9-10. Salvaged factual spine from the
 * legacy world-history U5/U6 industrial and reform seeds, reframed
 * subject-first. C3 D2.His.14.9-12, D2.Civ.14.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U8_INDUSTRIAL_SOCIETY_REFORM: LessonPlan = {
  id: 'evelyn.hs.whist.industrial-society-reform.v1',
  title: 'Industrial Society & Reform Movements',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.industrial-society-reform',
      standard: 'WHIST-8.2',
      description:
        'Analyze how industrial cities remade class, work, and family life, and compare the competing responses those conditions provoked — laissez-faire economics, reform legislation and public health, trade unionism, and socialism — including the organizing toolkit later reform movements inherited (C3 D2.His.14.9-12, D2.Civ.14.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.industrial-revolution'],
  followUps: ['whist.nationalism-unification'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that almost every protection students take for granted at work was won in this fight — and that the political labels they argue with today were invented here.',
      script:
        'Weekends. A minimum age for working. Inspectors who can shut down an unsafe workplace. Sewers. Public schools. Every one of those is an answer to a question first asked in the smoke of industrial Manchester and Liverpool: when a new economy makes some people rich and grinds others down, what — if anything — should anyone do about it? People in the 1800s gave wildly different answers. Leave the market alone, it will sort itself out. No — pass laws and inspect the mills. No — workers should organize and shut the machines off until they are paid. No — the whole system has to go. Those four answers hardened into the words we still fight with: conservative, liberal, socialist. Today you learn where they came from, and the protest playbook that came with them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-industrial-society',
      kind: 'concept',
      goal: 'The new class map and its human cost, then the full spectrum of responses — laissez-faire, reform, public health, unions, socialism — and the reform toolkit they leave behind.',
      keyIdeas: [
        'A NEW CLASS MAP — industrial society reorganized people not by birth rank but by their relationship to capital: an industrial MIDDLE CLASS that owned the factories, mines, banks, and shops, and a far larger WORKING CLASS that owned nothing to sell but its own labor, priced by the hour. The old landed aristocracy did not vanish, but wealth and political weight steadily shifted toward manufacturers.',
        'WHO ACTUALLY WORKED THE MACHINES — women and children were employed heavily because they could be paid far less. A British parliamentary committee investigating the mines reported in 1842 that children were working underground hauling coal, some from a very young age, in passages too low for adults. Its findings shocked a public that had not seen the work with its own eyes — the report itself became the argument.',
        "THE DOUBLE BURDEN — factory work pulled wage labor out of the home, but housework did not follow it out. Working-class women commonly did a full mill shift AND the cooking, laundry, childcare, and water-hauling in crowded housing without plumbing. Meanwhile, middle-class households increasingly treated a wife's staying out of paid work as the marker of respectability — one industrial economy, two very different female experiences.",
        'ANSWER ONE — LAISSEZ-FAIRE: leave it alone. Economic liberals argued that markets left free of interference coordinate themselves through self-interest, and that wage laws or hour limits would only destroy jobs. Adam Smith was invoked constantly, often past what he actually wrote — he had also argued for public works and schooling. Thomas Malthus (population outruns food) and David Ricardo (wages tend back down to subsistence) supplied the pessimism: suffering was a law of nature, and charity or regulation only postponed it.',
        'ANSWER TWO — REFORM FROM ABOVE: use the state, but keep the system. Britain passed the Factory Act of 1833, which mattered less for its hour limits than for creating a small corps of PAID GOVERNMENT INSPECTORS — for the first time, the law could actually be checked. The Mines Act of 1842 barred women and young children from underground work; the Ten Hours Act of 1847 capped the working day for women and youths in textile mills; later education acts pushed toward schooling for all children, producing the first mass literate publics.',
        'ANSWER THREE — PUBLIC HEALTH: Edwin Chadwick\'s 1842 sanitary report argued that filth and disease were not just cruel but EXPENSIVE, since sick workers cost employers and taxpayers money. Cholera epidemics helped, in a grim way, because contaminated water crossed class lines. In 1854 the London physician John Snow mapped cholera deaths street by street and found them clustered around a single public water pump — evidence that the disease traveled in water, not bad air, and a decisive argument for spending public money on sewers and clean supply.',
        'ANSWER FOUR — WORKERS ORGANIZE: British Combination Acts had made workers\' associations illegal in the early 1800s; unions were built anyway, gained legal footing over decades, and won solid legal protection in the 1870s. Their leverage was simple and new: one worker was replaceable, but ALL the workers stopping at once shut down machinery that cost a fortune to sit idle. The strike converted numbers into bargaining power.',
        'ANSWER FIVE — SOCIALISM, IN TWO FLAVORS: the "utopian" socialists tried to build the alternative and show it worked — Robert Owen ran his New Lanark mill in Scotland with shorter hours, no young children, decent housing, and a school, then promoted planned cooperative communities. Karl Marx and Friedrich Engels rejected persuasion: their Communist Manifesto (1848) argued that all history is a struggle between classes, that industry had simplified it to owners versus workers, and that the workers would eventually overthrow the system rather than be granted relief from it. Marx expected that revolution in the MOST industrial countries; the revolutions carried out in his name came instead in largely agrarian Russia (1917) and China (1949) — a puzzle Units 9 and 10 take up.',
        'REFORM IS NOT THE SAME AS SOCIALISM — and the toolkit outlives both. Factory acts and sewers were designed to STABILIZE industrial capitalism; socialism proposed to replace it. What the era standardized was a method of pressure: mass petitions, boycotts, investigative reports, public meetings, and pamphlets. The campaign that ended slavery in the British Empire in 1833 refined that method; women\'s rights organizers used it (the Seneca Falls convention of 1848 is an early marker in the United States), and so did later suffrage, labor, and civil-rights movements everywhere.',
      ],
      vocabulary: [
        { term: 'laissez-faire', definition: 'the view that the economy works best when government leaves markets and employers largely alone.' },
        { term: 'trade union', definition: 'an organization of workers that bargains collectively over wages, hours, and conditions, with the strike as its ultimate leverage.' },
        { term: 'proletariat', definition: "Marx's term for the industrial working class — people who own no productive property and live by selling their labor." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-how-britain-started-regulating',
      kind: 'worked_example',
      problem:
        'In 1830 the ruling opinion in Britain was that government had no business telling a factory owner how to run his mill. Within about forty years Britain was inspecting factories, banning children from the mines, and spending public money on sewers. Build the causal chain that got a laissez-faire country to regulate itself.',
      steps: [
        'Start with visibility. Conditions inside mills and mines were invisible to the voting public until parliamentary committees went and asked. The 1842 mines committee reporting children hauling coal underground did something no speech could: it made the cost of cheap coal concrete, in testimony, to people who had never been down a shaft.',
        'Follow the outrage into law — but notice WHICH law worked. Earlier child-labor rules existed and were widely ignored, because nobody checked. The Factory Act of 1833 added paid inspectors, and the Mines Act of 1842 followed the report directly. Enforcement, not good intentions, is the hinge.',
        'Add the disease argument, which converted opponents. Chadwick argued in 1842 that filth was a financial drain, not merely a moral scandal — an argument aimed straight at ratepayers. Then cholera crossed into respectable neighborhoods, and self-interest and reform pointed the same way.',
        "Add proof. Snow's 1854 map tied cholera deaths to one water pump, turning sanitation from a matter of opinion into a matter of evidence. Public money for water and sewers now had a demonstrable payoff.",
        'Now close the chain and note the trick in it. Each measure was sold as a narrow exception for people presumed unable to bargain for themselves — children, women underground, the water everyone drinks. But exceptions accumulated: inspectors, hour limits, sanitary boards, school acts. Investigate, publicize, legislate, ENFORCE — that sequence built the modern regulatory state without anyone announcing they were building it.',
      ],
      answer:
        'Investigation made conditions public, public outrage produced laws, inspectors made the laws real, and the shared threat of disease plus hard evidence justified public spending — a chain of narrow exceptions that added up to systematic regulation.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-manifesto-paraphrase',
      kind: 'worked_example',
      problem:
        'A political pamphlet published by two German writers in 1848 argued, in paraphrase: "The history of every society so far has been the history of struggles between classes. Modern industry has simplified that struggle into two great camps — those who own the factories and those who own only their labor. The workers have nothing to lose but their chains." Analyze what this argument claims, how it differs from the reformers of the same decade, and how its prediction turned out.',
      steps: [
        'Source it first. This is Marx and Engels in the Communist Manifesto (1848) — a political program written to persuade, not a neutral description of conditions. Read it as one competing answer among several, and check its claims against evidence rather than accepting or dismissing it on reputation.',
        'Identify the claims. Three of them: (1) conflict between classes is the ENGINE of history, not an occasional breakdown; (2) industry has simplified older, layered hierarchies into a two-camp structure, owners versus workers; (3) the workers therefore have no stake in preserving the arrangement — the "chains" line is a claim about interest, not just a slogan.',
        'Contrast with the reformers working at the same moment. The Ten Hours Act passed in 1847, one year before this pamphlet. Reformers accepted the factory system and tried to make it survivable; the Manifesto argues that improvements granted from above leave the underlying ownership of the machines untouched, so the conflict returns. Same conditions, incompatible diagnoses — this is why "reformer" and "socialist" are not synonyms.',
        'Test the prediction against what happened. Marx expected revolution first where industry was most advanced — Britain, Belgium, Germany. It did not happen there. Industrial Britain went the other route: legal unions, expanding voting rights, factory law, and eventually social insurance. The revolutions made in Marx\'s name came in largely agrarian Russia (1917) and China (1949), and you will examine why in Units 9 and 10.',
        'State what the source can and cannot tell you. It is excellent evidence for how industrial conditions were being interpreted in 1848 and for the birth of an ideology that shaped the next century and a half. It is not evidence about what any particular mill actually paid — for that you want the investigative reports, wage records, and testimony.',
      ],
      answer:
        'The Manifesto claims class conflict drives history, that industry reduced it to owners versus workers, and that workers have no stake in the system — a revolutionary alternative to reformers who wanted to make the factory system tolerable. Its prediction misfired geographically: industrial Britain reformed, while revolutions in its name came in agrarian Russia and China.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-inspectors',
      kind: 'try_yourself',
      problem:
        'Britain had passed child-labor rules before 1833, but they changed little in practice. What made the Factory Act of 1833 different?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It created paid government inspectors, so the law could actually be checked and enforced', correct: true },
        { id: 'b', text: 'It abolished child labor completely across the entire British economy' },
        { id: 'c', text: 'It was the first law in British history to mention children at all' },
        { id: 'd', text: 'It transferred ownership of the textile mills to the government' },
      ],
      expectedAnswer: 'It created paid government inspectors, so the law could actually be checked and enforced',
      hints: [
        'Ask why the EARLIER rules failed — the words were on the page, so what was missing?',
        'A rule nobody verifies is a suggestion. What did 1833 add that made it verifiable?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-snow-pump',
      kind: 'try_yourself',
      problem:
        'In 1854 a London physician mapped cholera deaths street by street and found them clustered tightly around one public water pump. Why did this matter so much for reform?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It gave hard evidence that the disease traveled in water, justifying public spending on sewers and clean supply', correct: true },
        { id: 'b', text: 'It confirmed that foul air was the cause of epidemic disease' },
        { id: 'c', text: 'It proved that cholera struck only the poor, so the wealthy could safely ignore it' },
        { id: 'd', text: 'It led Britain to ban factories from operating inside city limits' },
      ],
      expectedAnswer: 'It gave hard evidence that the disease traveled in water, justifying public spending on sewers and clean supply',
      hints: [
        'Think about what a MAP does to an argument — it turns an opinion about causes into something you can point at.',
        'If deaths cluster around a pump rather than a smell, which theory of transmission survives, and what does the city have to build?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-marx-prediction',
      kind: 'try_yourself',
      problem:
        'Marx and Engels expected workers\' revolution to break out first in the most heavily industrialized countries. What actually happened in the century that followed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Industrial Britain reformed through unions, voting rights, and factory law, while revolutions in Marx\'s name came in largely agrarian Russia and China', correct: true },
        { id: 'b', text: 'Britain became the first communist state, in 1848' },
        { id: 'c', text: 'Every industrialized country underwent a workers\' revolution at roughly the same time' },
        { id: 'd', text: 'No government anywhere ever claimed to be following Marx and Engels' },
      ],
      expectedAnswer: 'Industrial Britain reformed through unions, voting rights, and factory law, while revolutions in Marx\'s name came in largely agrarian Russia and China',
      hints: [
        'Ask where the twentieth century\'s most famous communist revolutions actually took place, and how industrial those places were.',
        'Britain had the most factories and the least revolution — the prediction landed in the wrong kind of country.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reform-equals-socialism',
      kind: 'misconception_check',
      question:
        'A student writes: "Anyone in the 1800s who wanted to help factory workers was a socialist — the Factory Acts were socialism." What needs correcting?',
      commonErrors: [
        {
          answer: 'Reform legislation and socialism were the same movement',
          misconception: 'Collapsing every response to industrial misery into one "pro-worker" side, and missing the sharp split between fixing the system and replacing it.',
          correctsTo:
            'They were rival answers, not one movement. Factory and mines acts, sanitary boards, and school acts were written mostly by aristocrats, evangelicals, and middle-class reformers who ACCEPTED private ownership of industry and wanted to make it survivable — several were sold explicitly as ways to protect capitalism from unrest. Socialists argued the opposite: that relief granted from above leaves ownership untouched, so the conflict returns. Unions sit in between — bargaining hard within the system, and often hostile to both the laissez-faire employers and the revolutionaries. Three positions, one set of conditions.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Industrial cities remade the class map — an owning middle class and a much larger working class — and ran on the cheap labor of women and children, with working-class women carrying wage work and household work at once.',
        'Laissez-faire (Smith invoked past what he wrote, plus Malthus and Ricardo) said leave it alone; reform said legislate and INSPECT — the 1833 Factory Act inspectors, the Mines Act of 1842, the Ten Hours Act of 1847, and later education acts.',
        'Public health turned opinion into evidence: Chadwick\'s 1842 cost argument, then Snow\'s 1854 pump map, justified public money for sewers and clean water.',
        'Unions moved from illegal under the Combination Acts to legally protected in the 1870s; the strike turned worker numbers into bargaining power.',
        'Socialism had two flavors: Owen\'s New Lanark and the utopian communities tried to demonstrate an alternative; Marx and Engels\'s Manifesto (1848) predicted revolution instead — which arrived in agrarian Russia and China, not industrial Britain.',
        'Reform is not socialism, and the toolkit outlasted both: petitions, boycotts, investigative reports, and mass meetings — refined in the campaign that abolished slavery in the British Empire in 1833 and reused by women\'s rights organizers (Seneca Falls, 1848) and every movement after.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Industrial Society & Reform Movements' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
