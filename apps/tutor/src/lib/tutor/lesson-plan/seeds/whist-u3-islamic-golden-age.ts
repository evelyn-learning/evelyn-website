/**
 * World History — Postclassical Networks: The Islamic Golden Age.
 *
 * The centuries when Baghdad was the most important city on Earth for
 * learning: translation, algebra, medicine, and optics — and the road
 * that carried all of it into Europe. Salvaged factual spine from the
 * legacy world-history Dar al-Islam seed, reframed subject-first around
 * knowledge as something that travels with trade and empire.
 * C3 D2.His.1.9-12, D2.His.14.9-12, D2.His.16.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U3_ISLAMIC_GOLDEN_AGE: LessonPlan = {
  id: 'evelyn.hs.whist.islamic-golden-age.v1',
  title: 'The Islamic Golden Age',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.islamic-golden-age',
      standard: 'WHIST-3.2',
      description:
        'Explain how Abbasid Baghdad and the wider Islamic world gathered, translated, and advanced Greek, Indian, and Persian learning between roughly 750 and 1258 CE, and trace how that scholarship reached later Europe (C3 D2.His.1.9-12, D2.His.14.9-12, D2.His.16.9-12).',
    },
  ],
  prerequisites: ['whist.rise-of-islam'],
  followUps: ['whist.tang-song-china'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the numbers, the word "algebra," and the medical textbook of medieval Europe all trace back to one city — and that ideas travel the same roads as goods.',
      script:
        'Write the number 2026. You just used a system invented in India, carried west by Arabic-speaking scholars, and handed to Europe so late that Europeans still call the digits "Arabic numerals." The word "algebra" comes from the title of a book written in Baghdad around 820 CE. The word "algorithm" is a mangled version of that author\'s name. For roughly five hundred years, the single best place on Earth to study medicine, astronomy, or mathematics was a city on the Tigris River — and European universities later grew up reading translations of what was written there. So here is the question this lesson answers: why did that explosion of learning happen HERE, and how did it end up in your math class?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-islamic-golden-age',
      kind: 'concept',
      goal: 'The Abbasid setting, the translation movement, the major scholars and fields, the transmission routes into Europe, and the classic confusions students bring.',
      keyIdeas: [
        'THE SETTING — the Abbasid dynasty took power in 750 CE and built a new capital, Baghdad, on the Tigris. It sat where trade routes from the Mediterranean, the Indian Ocean, and the Silk Roads met. Within a century it was one of the largest cities in the world, and its wealth came from taxing and supplying that trade.',
        'TRADE PAID FOR SCHOLARSHIP — this is the engine of the whole story. Merchant and tax wealth funded caliphs, courts, and libraries; paper-making (learned from China in the 700s) made books cheap enough to copy at scale. Knowledge production is expensive, and Baghdad could afford it.',
        'THE TRANSLATION MOVEMENT — from roughly 800 to 1000 CE, scholars centered on Baghdad\'s House of Wisdom systematically translated Greek, Persian, Sanskrit, and Syriac works into Arabic: Aristotle, Euclid, Ptolemy, Galen, Indian mathematics and astronomy. Christian, Jewish, and Muslim scholars worked side by side. Much Greek science survives today ONLY because it was translated in this period.',
        'NOT JUST COPYING — the classic student error. Translators became critics and builders. Al-Khwarizmi (c. 780-850) wrote the book that gives us the word "algebra," treating equation-solving as a general method rather than a set of one-off puzzles; the Latin version of his name gives us "algorithm."',
        'MEDICINE BECAME A SYSTEM — Ibn Sina (Avicenna, c. 980-1037) compiled the Canon of Medicine, an organized encyclopedia of diagnosis and treatment that was translated into Latin and used as a standard textbook in European medical schools for roughly five hundred years. Al-Zahrawi (c. 936-1013), working in Islamic Spain, wrote an illustrated surgical text describing instruments still recognizable today.',
        'ASTRONOMY, OPTICS, AND EVIDENCE — Ibn al-Haytham (Alhazen, c. 965-1040) attacked the Greek idea that eyes emit rays, argued that light travels TO the eye, and insisted that claims be tested by controlled experiment — a method later European scientists inherited. Observatories corrected Ptolemy\'s star tables; the astrolabe made navigation and prayer-timing precise.',
        'THE NUMERALS ARE INDIAN — the digits 0-9 with place value were developed in India. Arabic-speaking scholars adopted, explained, and spread them; Europeans met them through Arabic texts and named them after the messenger, not the source. Zero as a working number came with them, and it made everything from bookkeeping to algebra faster.',
        'THE ROAD TO EUROPE — Islamic Spain (al-Andalus) was the main bridge. Cordoba, with its enormous library, was one of Europe\'s largest cities in the 900s. After Christian kingdoms took Toledo in 1085, translators there turned Arabic works — including Ibn Rushd (Averroes, 1126-1198) and his commentaries on Aristotle — into Latin. Sicily and Crusader contact were secondary channels. Those Latin translations are what Europe\'s new universities read, and they feed directly into the later Renaissance and Scientific Revolution.',
        'THE BOOKEND — in 1258 CE a Mongol army sacked Baghdad and killed the last Abbasid caliph there. It was a genuine catastrophe for that city. But it did not switch off Islamic scholarship: work continued at Cairo, Samarkand, Isfahan, and elsewhere, and by then the translations had already begun moving into Europe.',
      ],
      vocabulary: [
        { term: 'House of Wisdom', definition: 'the library and translation center in Abbasid Baghdad where Greek, Persian, and Indian works were rendered into Arabic and built upon.' },
        { term: 'al-Andalus', definition: 'Muslim-ruled Spain and Portugal — home to Cordoba and Toledo, and the main route by which Arabic scholarship reached Latin Europe.' },
        { term: 'astrolabe', definition: 'a precision instrument for measuring the position of stars and the sun, refined by Islamic astronomers and used for navigation, timekeeping, and prayer times.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-baghdad',
      kind: 'worked_example',
      problem:
        'Build the causal chain: why did a burst of scientific and mathematical work happen in Abbasid Baghdad specifically, rather than somewhere else, in the 800s and 900s CE?',
      steps: [
        'Reject the single-cause answer first. "They valued learning" explains nothing on its own — plenty of societies valued learning without producing an Ibn al-Haytham. Look for conditions that stacked up in one place.',
        'Start with geography: Baghdad sat at the junction of routes running to the Mediterranean, down the Persian Gulf to the Indian Ocean, and east along the Silk Roads. Goods moved through — and so did books, scholars, and techniques from Greek, Persian, and Indian traditions.',
        'Follow the money: taxing and supplying that trade made the Abbasid state and its elite extremely wealthy. Caliphs and wealthy patrons could pay translators, buy manuscripts, and fund observatories. Scholarship is a luxury an economy has to be able to afford.',
        'Add the technology: paper-making, learned from Chinese contacts in the 700s, replaced expensive parchment. Cheap paper means cheap books, and cheap books mean libraries, copies, and scholars who can actually read each other.',
        'Add the language and the policy: Arabic worked as a shared scholarly language from Spain to Central Asia, so a translated text could be read across thousands of miles. Rulers deliberately sponsored the translation project, and Christian, Jewish, and Muslim scholars worked together on it.',
        'Close the chain: crossroads location → inherited texts from several civilizations → trade wealth to fund the work → cheap paper to spread it → a shared language to read it. Any one of those alone produces little; together they produce the House of Wisdom.',
      ],
      answer:
        'No single cause. Baghdad combined a crossroads location that delivered Greek, Persian, and Indian texts, trade wealth that paid for translation and research, cheap paper, and Arabic as a shared scholarly language — a stack of conditions, not a national character.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-numerals-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "Muslim scholars invented Arabic numerals, but otherwise they just copied and stored Greek books until Europe was ready for them." Untangle the two separate errors in that sentence.',
      steps: [
        'Take the numerals first, and notice the sentence gets the direction backwards. The digits with place value and a working zero were developed in INDIA. Al-Khwarizmi and others adopted them, wrote explanations of how to calculate with them, and spread them west.',
        'Ask why the name stuck anyway: Europeans first encountered these digits in Arabic-language texts, so they named them after the people who handed them over rather than the people who created them. The label records a transmission route, not an origin — a useful habit to keep for the rest of this course.',
        'Now the second error: "just copied and stored." Translation in Baghdad came with correction and extension. Ibn al-Haytham tested and overturned the Greek theory of vision. Astronomers found errors in Ptolemy\'s tables and remeasured. Al-Khwarizmi generalized problem-solving into algebra, which no Greek text contained.',
        'Check the direction of influence on medicine: Ibn Sina\'s Canon of Medicine was not a Greek book preserved, it was a new synthesis — and European medical schools then taught from its Latin translation for centuries. Europe was the receiver here, not the owner waiting for a delivery.',
        'State the corrected version: Indian numerals transmitted through Arabic scholarship, and a translation movement that preserved Greek learning while also criticizing, correcting, and going beyond it — original work that later Europe learned FROM.',
      ],
      answer:
        'Two errors: the numerals were Indian in origin and Arabic in transmission, not Arabic in origin; and Islamic scholars did far more than preserve Greek texts — they tested, corrected, and extended them, producing algebra, the Canon of Medicine, and experimental optics.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translation-purpose',
      kind: 'try_yourself',
      problem:
        'A scholar working in Baghdad around 900 CE described his method this way (paraphrased): "We took the books of the Greeks and the Indians, put them into Arabic, then measured for ourselves what they claimed, and wrote down where they had erred." What does this description best show about the translation movement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Translated works were tested and corrected, so the movement produced new knowledge rather than only preserving old texts', correct: true },
        { id: 'b', text: 'Scholars copied Greek and Indian books exactly and added nothing of their own' },
        { id: 'c', text: 'Arabic scholars rejected all Greek and Indian learning as unreliable' },
        { id: 'd', text: 'The translations were made mainly so that European universities could read them' },
      ],
      expectedAnswer: 'Translated works were tested and corrected, so the movement produced new knowledge rather than only preserving old texts',
      hints: [
        'Focus on the last clause: what is he doing AFTER the translation is finished?',
        '"Measured for ourselves" and "where they had erred" describe checking claims against evidence — that is research, not copying.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numerals-origin',
      kind: 'try_yourself',
      problem: 'Why are the digits 0 through 9 commonly called "Arabic numerals" even though they were developed in India?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Europeans first learned them from Arabic-language texts, so the name records how they arrived rather than where they began', correct: true },
        { id: 'b', text: 'Al-Khwarizmi invented the digits in Baghdad in the 800s CE' },
        { id: 'c', text: 'Indian mathematicians borrowed the digits from Arabic scholars and later returned them' },
        { id: 'd', text: 'The Romans created the digits and Arabic scholars renamed them' },
      ],
      expectedAnswer: 'Europeans first learned them from Arabic-language texts, so the name records how they arrived rather than where they began',
      hints: [
        'Separate two different questions: who created the system, and who handed it to Europe?',
        'Names given by the receiving culture usually record the messenger, not the inventor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transmission-route',
      kind: 'try_yourself',
      problem:
        'European universities in the 1200s were teaching Aristotle, Ibn Sina\'s Canon of Medicine, and algebra. What best explains how that material reached them?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Arabic texts were translated into Latin in places like Toledo in Islamic Spain, then circulated through Europe', correct: true },
        { id: 'b', text: 'Mongol armies carried the books to Europe after sacking Baghdad in 1258 CE' },
        { id: 'c', text: 'The works had been preserved continuously in western European monasteries since Roman times' },
        { id: 'd', text: 'European scholars independently rediscovered all of it without outside contact' },
      ],
      expectedAnswer: 'Arabic texts were translated into Latin in places like Toledo in Islamic Spain, then circulated through Europe',
      hints: [
        'The material was in Arabic and European scholars read Latin — someone had to bridge the two languages, and in a place where both were spoken.',
        'Think about the frontier zone: Cordoba, and Toledo after 1085, where Christian, Muslim, and Jewish scholars overlapped.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-1258-ended-everything',
      kind: 'misconception_check',
      question:
        'A student says: "The Mongols sacked Baghdad in 1258, so Islamic science ended and Europe took over as the world\'s center of learning." What needs correcting?',
      commonErrors: [
        {
          answer: 'Islamic science ended in 1258 and Europe immediately replaced it',
          misconception:
            'Treating the destruction of one city as the shutdown of an entire civilization\'s scholarship, and imagining a clean handoff to a Europe that was actually still learning from Arabic translations.',
          correctsTo:
            'The 1258 sack was a real catastrophe for Baghdad, its libraries, and the Abbasid caliphate there. But scholarship was never confined to one city: work continued at Cairo, Damascus, Isfahan, and later at Samarkand, where the observatory of Ulugh Beg produced star tables in the 1400s that were still respected in Europe. And Europe did not "take over" in 1258 — its universities were at that moment busy reading Latin translations of Ibn Sina and Ibn Rushd. Centers of learning shift gradually and overlap; they do not switch off on a date.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Abbasid Baghdad (founded 762 CE) sat where Mediterranean, Indian Ocean, and Silk Road routes met — trade wealth and cheap paper paid for the House of Wisdom and its translation movement.',
        'Translation was the starting point, not the product: al-Khwarizmi generalized algebra, Ibn al-Haytham argued for experiment and fixed the theory of vision, Ibn Sina wrote the Canon of Medicine, al-Zahrawi systematized surgery.',
        'The digits 0-9 and place value came from India and traveled west through Arabic scholarship — "Arabic numerals" names the route, not the origin.',
        'Islamic Spain was the bridge: Cordoba and, after 1085, Toledo produced the Latin translations that Europe\'s universities read and that later fed the Renaissance and Scientific Revolution.',
        'The 1258 Mongol sack of Baghdad devastated that city but did not end Islamic scholarship, which continued at Cairo, Isfahan, and Samarkand.',
        'The big theme: knowledge travels the same roads as trade and empire, and civilizations build on borrowed learning far more than they like to admit.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'The Islamic Golden Age' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
