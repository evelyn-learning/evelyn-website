/**
 * World History — Postclassical Connections: Tang & Song China.
 *
 * The course's clearest case of an economy running centuries ahead of
 * everyone else's: fast rice, paper money, printed books, gunpowder, and
 * a bureaucracy chosen by tested learning. It sets up the Mongol conquest
 * (3.4) and, much later, the "why didn't industry start here?" question
 * (8.1). Factual spine salvaged from the legacy East Asia seed and
 * rewritten subject-first. C3 D2.His.14.9-12, D2.Eco.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U3_TANG_SONG_CHINA: LessonPlan = {
  id: 'evelyn.hs.whist.tang-song-china.v1',
  title: 'Tang & Song China: An Economic Revolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.tang-song-china',
      standard: 'WHIST-3.3',
      description:
        'Explain how Tang cosmopolitanism and the Song agricultural, commercial, and technological revolution made China the world\'s most advanced economy by about 1200 CE, and analyze who gained and who lost under its merit-based bureaucracy and changing social order (C3 D2.His.14.9-12, D2.Eco.1.9-12).',
    },
  ],
  prerequisites: ['whist.islamic-golden-age'],
  followUps: ['whist.mongol-empire'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the scale of Song achievement concrete — and plant the puzzle that pays off twice later in the course.',
      script:
        'Around the year 1200, a shopper in the Chinese city of Hangzhou could pay for dinner with printed paper money, read a mass-produced printed book on the way home, and watch ships leave the harbor steered by a magnetic compass — while the soldiers on the wall carried weapons that used gunpowder. Every one of those things reached Europe centuries later, if at all. So China around 1200 was almost certainly the richest, most technologically advanced society on the planet. Hold that fact, because this course asks you about it twice: first when a Mongol army conquers it anyway, and much later when the machine age begins somewhere else entirely. Today you learn how China got there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tang-song',
      kind: 'concept',
      goal: 'The Tang cosmopolitan empire, the Song economic revolution, the bureaucracy that ran it, and the social costs.',
      keyIdeas: [
        "THE TANG OPENED THE DOORS (618-907 CE) — the Tang rebuilt a unified empire and revived the Silk Road. Their capital Chang'an, with roughly a million people, was probably the largest city on earth: Persian, Sogdian, Arab, Korean, and Japanese merchants and students lived there, and Buddhism, Islam, Judaism, and Christianity all had communities inside the walls.",
        'BUDDHISM ROSE, THEN WAS SUPPRESSED — Buddhism had entered China from India centuries earlier and flourished under Tang patronage; monasteries collected huge tax-exempt landholdings. In 845 CE Emperor Wuzong, pressed by Confucian officials who called Buddhism foreign and financially parasitic, ordered thousands of monasteries closed and their land and metal seized. Buddhism survived in China but never regained that institutional wealth — a reminder that religions rise and fall on politics and taxes, not only on belief.',
        'THE SONG WERE MILITARILY SQUEEZED BUT ECONOMICALLY BOOMING (960-1279) — the Song reunified China but never controlled the northern steppe frontier. They bought peace with silver and silk tribute to the Khitan Liao and later the Jurchen Jin, lost the north in 1127, and ruled from Hangzhou as the Southern Song. Classic student trap: weak armies did NOT mean a weak country. The Southern Song was probably richer than the Northern.',
        "CHAMPA RICE CHANGED THE MATH — a fast-ripening, drought-resistant rice imported from Champa (in today's Vietnam) ripened quickly enough for two harvests a year on the same land, and grew on hillsides earlier rice could not use. Harvests roughly doubled in many regions; China's population passed 100 million by about 1100 CE — no society had ever been that large.",
        'A COMMERCIAL REVOLUTION FOLLOWED — surplus food freed people from farming. Market towns multiplied, the Grand Canal moved southern rice to northern cities in bulk, and merchants traded across regions. Copper coin was too heavy for the volume, so merchants issued deposit notes and the government took over, printing the world\'s first state-backed paper money in the 1020s CE.',
        "THE TECHNOLOGY CLUSTER — gunpowder weapons (fire lances and bombs, used against Jurchen and Mongol armies); printing, first woodblock under the Tang (the Diamond Sutra of 868 CE is the oldest dated printed book) and then movable type by Bi Sheng around 1040 CE, roughly four centuries before Gutenberg's press; the magnetic compass adapted for navigation; and ocean junks with watertight compartments and stern-mounted rudders.",
        'THE EXAM BUREAUCRACY EXPANDED — the Song hugely enlarged the civil service examination system: candidates were tested on the Confucian classics, and passing was the road into office. Cheap printed books made study possible for more families, and Neo-Confucianism, systematized by Zhu Xi, became the tested curriculum. The ideal was merit over birth, and it produced real mobility — but years of classical study still cost money, so wealthy families dominated the results.',
        'THE SOCIAL COUNTERPOINT — as opportunity widened for some men, it narrowed for women. Foot binding began among elite Song families and later spread more widely: girls\' feet were bound to shape them, permanently limiting mobility, and the practice became a marker of status and respectability. Neo-Confucian emphasis on family hierarchy reinforced women\'s subordinate legal and social position even as the economy boomed.',
      ],
      vocabulary: [
        { term: 'Champa rice', definition: 'a fast-ripening, drought-resistant rice brought from Champa (modern Vietnam) that allowed two harvests a year and fueled a population boom past 100 million.' },
        { term: 'civil service examination system', definition: 'government offices filled by candidates who passed tests on the Confucian classics rather than by inheritance — a merit ideal, in practice easier for wealthy families to reach.' },
        { term: 'paper money', definition: 'printed notes accepted as currency; issued first by Song merchants as deposit receipts, then by the government in the 1020s CE — the world\'s first.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rice-to-money',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did importing a new strain of rice end with the world\'s first paper money?',
      steps: [
        'Start with the seed: Champa rice ripened in far fewer days than older varieties and tolerated drought, so a field could yield two harvests a year and hillside land could be farmed at all.',
        'Follow the food: more food per acre supported more people. China\'s population passed 100 million by about 1100 CE, and — crucially — not everyone was needed in the fields.',
        'Follow the freed labor: people who did not have to farm became artisans, miners, shopkeepers, boatmen, and officials. Cities like Kaifeng and Hangzhou swelled past a million; market towns filled the countryside between them.',
        'Follow the trade: specialists must BUY their food, so long-distance exchange became routine. The Grand Canal hauled southern rice north in bulk, and regions specialized in tea, silk, iron, and porcelain.',
        'Close the chain: that volume of buying and selling broke the money supply. Copper and iron coin was too heavy to carry in trade-sized amounts, so merchants (in Sichuan first) issued paper deposit notes, and the government standardized and printed them in the 1020s CE. New rice to new money in about a century.',
      ],
      answer:
        'Champa rice doubled harvests, which grew the population and freed labor for crafts and commerce; large-scale trade outgrew heavy metal coin, so deposit notes became government-printed paper money.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hangzhou-account',
      kind: 'worked_example',
      problem:
        'A resident of Hangzhou wrote around 1250 CE (paraphrased): "Along the imperial avenue the shops scarcely close — the night markets run until nearly dawn and open again at first light. One may buy ice in summer and coal in winter, and buyers settle up with printed notes as often as with strings of copper coin." What does this account tell us about the Song economy, and what should a careful reader hold back on?',
      steps: [
        'Source it first: a city dweller describing his own capital, written after the Song had already lost the north — fond, possibly nostalgic, and about the single richest city in the empire.',
        'Read the hours: markets running most of the night mean a large population with cash income and time to spend it, plus enough oil and coal to light and heat the work. Round-the-clock commerce is expensive; only a surplus economy can afford it.',
        'Read the goods: ice in summer and coal in winter are not local, seasonal, subsistence items. They imply storage, bulk transport (canal and river), and specialists who do nothing but haul, cut, and sell them.',
        'Read the payment: "printed notes as often as copper coin" tells us paper money was ordinary, not experimental — everyday people trusted a government-backed piece of paper enough to accept it for dinner.',
        'Now hold back: Hangzhou was the capital, not a typical village, and the writer is describing his own city admiringly. Use it as strong evidence for URBAN commercialization; check tax records, canal traffic, and coin output before claiming every peasant lived this way.',
      ],
      answer:
        'It shows a monetized, specialized, city-scale market economy — nightlong trade, long-distance goods, and paper money in daily use — but as a proud account of the richest city, it cannot stand alone as a picture of the whole country.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-buddhism-suppression',
      kind: 'try_yourself',
      problem:
        'In 845 CE, the Tang government closed thousands of Buddhist monasteries and seized their land and metal. What best explains this policy?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Monasteries had amassed enormous tax-exempt wealth, and Confucian officials pushed the state to reclaim the revenue and land', correct: true },
        { id: 'b', text: 'Buddhism had only just arrived in China and was unknown to Chinese rulers' },
        { id: 'c', text: 'Mongol rulers ordered the closures after conquering the Tang' },
        { id: 'd', text: 'Buddhist monks had introduced Champa rice, which ruined Chinese farming' },
      ],
      expectedAnswer: 'Monasteries had amassed enormous tax-exempt wealth, and Confucian officials pushed the state to reclaim the revenue and land',
      hints: [
        'Follow the money before the theology: what did the state actually confiscate?',
        'A rich institution that pays no taxes is a target for a government short of revenue — and rivals at court supplied the argument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-printing-timeline',
      kind: 'try_yourself',
      problem:
        'Which statement about the history of printing is accurate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chinese printers produced printed books for centuries before Gutenberg\'s press appeared in Europe around 1450 CE', correct: true },
        { id: 'b', text: 'Printing spread from Europe to China along the Silk Road in the 1200s CE' },
        { id: 'c', text: 'The Mongols invented printing and introduced it to China after 1279 CE' },
        { id: 'd', text: 'Song printers used presses only for religious images, never for books' },
      ],
      expectedAnswer: 'Chinese printers produced printed books for centuries before Gutenberg\'s press appeared in Europe around 1450 CE',
      hints: [
        'Anchor two dates: the Diamond Sutra was printed in 868 CE; Bi Sheng made movable type around 1040 CE.',
        'Put those beside Gutenberg around 1450 CE and count the centuries — and note which direction the technology traveled.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exam-system',
      kind: 'try_yourself',
      problem:
        'The Song expanded the civil service examination system so that officials were selected by tested mastery of the Confucian classics. What was its actual effect on Chinese society?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It created a bureaucracy of scholar-officials with real mobility for talented men, though wealthy families could best afford the years of study', correct: true },
        { id: 'b', text: 'It opened government office equally to women and men throughout the empire' },
        { id: 'c', text: 'It abolished the emperor and replaced imperial rule with an elected assembly' },
        { id: 'd', text: 'It replaced Confucian learning with Buddhist scripture as the tested curriculum' },
      ],
      expectedAnswer: 'It created a bureaucracy of scholar-officials with real mobility for talented men, though wealthy families could best afford the years of study',
      hints: [
        'Separate the IDEAL (office by merit, not birth) from the PRACTICE (who could pay for a decade of classical tutoring?).',
        'Two things are true at once: more mobility than hereditary aristocracy allowed, and still far from open to everyone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-song-weakness',
      kind: 'misconception_check',
      question:
        'A student writes: "The Song was a weak, declining dynasty — it paid tribute to nomads, lost northern China, and was finally conquered." What needs correcting?',
      commonErrors: [
        {
          answer: 'The Song was weak and in decline',
          misconception: 'Treating military and territorial setbacks as proof of overall decline — measuring a society only by its army and its map.',
          correctsTo:
            'Military weakness and economic strength coexisted. The Song never held the northern steppe frontier and did pay tribute to the Liao and Jin — but tribute was cheap next to the revenue its economy produced, and the Southern Song after 1127 CE was probably richer than the Northern: bigger harvests from Champa rice, paper money, booming canal and ocean trade, and a population past 100 million. When the Mongols finally took it in 1279 CE, they were conquering the wealthiest state in the world, not a spent one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Tang China (618-907 CE) was cosmopolitan: Chang'an near a million people, a revived Silk Road, and Buddhism flourishing — until the 845 CE suppression stripped the monasteries of tax-free wealth.",
        'The Song chain: Champa rice → double harvests → population past 100 million → freed labor → market towns, Grand Canal trade, and the world\'s first paper money in the 1020s CE.',
        "Song technology ran centuries ahead: gunpowder weapons, movable-type printing around 1040 CE (about 400 years before Gutenberg), the navigational compass, and watertight-compartment ships.",
        'The expanded civil service examination system built a scholar-official bureaucracy on a merit ideal — real mobility, but tilted toward families who could fund years of study; foot binding shows the same era narrowing women\'s lives.',
        'Militarily squeezed, economically dominant: by about 1200 CE Song China was arguably the world\'s most advanced economy — which is exactly what makes the Mongol conquest, and the later industrial question, worth asking.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Tang & Song China: An Economic Revolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
