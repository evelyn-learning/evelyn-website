/**
 * World History — The Renaissance.
 *
 * The unit's compounding-machine lesson: trade money + recovered ideas +
 * one new machine (the printing press) multiply each other, and the
 * product is an information revolution that blows straight into the
 * Reformation. C3 D2.His.14.9-12, D2.His.16.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U6_RENAISSANCE: LessonPlan = {
  id: 'evelyn.hs.whist.renaissance.v1',
  title: 'The Renaissance',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.renaissance',
      standard: 'WHIST-6.1',
      description:
        'Explain why the Renaissance began in the Italian city-states and analyze how humanism, patronage wealth, and the printing press combined to transform European art, learning, and the spread of ideas (C3 D2.His.14.9-12, D2.His.16.9-12).',
    },
  ],
  prerequisites: ['whist.inca-north-america'],
  followUps: ['whist.protestant-reformation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Renaissance as money, ideas, and a machine compounding into an information explosion.',
      script:
        'In the year 1400, a book was a luxury item — hand-copied by someone for months, priced like a small farm. By 1500, you could buy one in a city square for about what a laborer earned in a week. Nothing about human intelligence changed in those hundred years. What changed was that merchant money, rediscovered ancient learning, and one new machine all landed on the same continent at the same time and multiplied each other. That combination gave us Leonardo, Michelangelo, and — within one more generation — a religious revolution nobody could stop. Today you trace how those three forces compounded.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-renaissance',
      kind: 'concept',
      goal: 'Why Italy first, what humanism actually claimed, who paid, what changed in art, and why the press was the multiplier.',
      keyIdeas: [
        'WHY ITALY FIRST — Italian cities sat on the Mediterranean trade routes that the Crusades (c. 1095–1291) had reopened and that Venice and Genoa then dominated. Money from spices, silk, cloth, and banking piled up in cities, not in the countryside — and cities are where scholars, artists, and workshops can be paid.',
        'COMPETING CITY-STATES — Italy was NOT a country. Florence, Venice, Milan, Rome, and Naples were rival states, each ruled by its own merchants, dukes, or popes, each trying to out-build and out-dazzle the others. Rivalry turned art into a competitive sport, which meant commissions and steady work for artists.',
        'THE PAST WAS UNDERFOOT — Italians walked past Roman aqueducts, arches, and ruined forums every day, and the fall of Constantinople in 1453 (Unit 4) pushed Byzantine scholars west carrying Greek manuscripts of Plato, Aristotle, Euclid, and Archimedes. Recovered texts plus visible ruins made "the ancients did it better" a believable claim.',
        'HUMANISM — a program of study, not a rebellion against faith. Petrarch (1304–1374) hunted down forgotten Latin manuscripts and argued that classical literature, history, rhetoric, and moral philosophy should train people to live well in THIS world. Most humanists stayed devout Christians; many were priests. Their target was narrow scholastic argument, not God.',
        'PATRONAGE — art was purchased, not spontaneous. The Medici, a Florentine banking family with no noble blood, spent fortunes on chapels, sculpture, and libraries because art converted money into prestige and political legitimacy. Cosimo and later Lorenzo de\' Medici effectively ran Florence while holding no crown. Popes, dukes, guilds, and merchant families all competed as buyers.',
        'THE ART REVOLUTION — medieval painting sized figures by holy importance and used gold backgrounds for a heavenly world. Renaissance artists built realistic three-dimensional space: linear perspective, anatomy studied from real bodies, light and shadow. Brunelleschi solved the perspective problem and engineered the enormous dome of the Florence cathedral (completed 1436); Leonardo da Vinci (1452–1519) and Michelangelo (1475–1564) pushed realism further. Note the subjects stayed mostly religious — the technique changed, not the faith.',
        'THE PRINTING PRESS AS ACCELERANT — Johannes Gutenberg began printing with movable metal type around 1450 in Mainz. Movable type itself was older: China had it by the 1000s and Korea cast it in metal in the 1200s. What Gutenberg assembled was a package suited to Europe — a small alphabet, durable metal type, oil-based ink, a screw press adapted from winemaking, and cheap rag paper. Books fell from luxury to commodity within a generation, and every idea in this lesson could now travel faster than any authority could chase it — including, after 1517, the Reformation (Topic 6.2).',
        'THE NORTHERN RENAISSANCE AND THE "REBIRTH" LABEL — printed books carried the movement north, where it took a more religious turn: Erasmus (c. 1466–1536) applied humanist textual scholarship to the Bible, producing a corrected Greek New Testament and satirizing corrupt clergy. And "rebirth" was the era\'s own branding. Renaissance writers invented the insult "Dark Ages" for the centuries before them — unfair to a medieval Europe that founded universities (Bologna c. 1088, Paris, Oxford) and raised Gothic cathedrals (Topic 4.4).',
      ],
      vocabulary: [
        { term: 'humanism', definition: 'the study of classical texts — literature, history, rhetoric, moral philosophy — to understand and improve human life in this world.' },
        { term: 'patronage', definition: 'wealthy individuals or institutions paying artists and scholars to produce work, usually buying prestige along with it.' },
        { term: 'movable type', definition: 'individual reusable letter blocks that can be arranged into any page, replacing hand-copying and single carved woodblocks.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-why-italy',
      kind: 'worked_example',
      problem:
        'Build the causal chain: why did the Renaissance begin in the Italian city-states around 1350–1450 rather than in England, Poland, or Scandinavia?',
      steps: [
        'Start with geography and trade: Italy juts into the Mediterranean, and after the Crusades reopened eastern trade, Venice and Genoa controlled the routes carrying spices, silk, and luxury goods into Europe.',
        'Follow the money: that trade produced merchant and banking fortunes concentrated in cities. Northern Europe in this period was still mostly rural and land-based, where wealth sat in estates rather than in urban cash.',
        'Follow the politics: Italy had no king. Florence, Venice, Milan, and Rome were competing states whose rulers needed visible glory to justify power they had bought rather than inherited — so they bid against each other for artists.',
        'Add the raw material: Roman ruins stood in these same cities, and after 1453 Byzantine scholars fleeing the Ottoman capture of Constantinople arrived carrying Greek manuscripts that western Europe had largely lost.',
        'Close the chain: urban money + competitive patrons + surviving classical models + recovered Greek texts all met in one place. Wealth alone would not have done it, and manuscripts alone would not have done it — the combination did.',
      ],
      answer:
        'Mediterranean trade wealth concentrated in independent, competing Italian cities, where rival patrons could spend it — and where Roman ruins and newly arrived Greek manuscripts gave artists and scholars classical models to imitate.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-humanist-source',
      kind: 'worked_example',
      problem:
        'A Florentine humanist writes to a friend, in a paraphrase of his own words: "I have spent three years recovering a lost letter of Cicero from a cathedral library, and I tell you plainly — this dead Roman teaches me more about serving my city and raising my sons than a hundred pages of hair-splitting argument about angels. God gave us this life too, and He did not give it to us to waste." What does this source reveal about humanism, and what does it NOT say?',
      steps: [
        'Identify the writer\'s activity: he is hunting down and restoring a classical Latin text found in a church library. That is the core humanist project — recovering the ancient past, and doing it inside Christian institutions, which were the ones holding the manuscripts.',
        'Identify what he values in the text: guidance for serving his city and raising his children. Humanists read the classics for practical, ethical, civic instruction — how to live and govern now, not just how to reason abstractly.',
        'Identify his target: "hair-splitting argument about angels" is a jab at scholastic method, the highly technical logical theology of medieval universities. His complaint is about a style of scholarship.',
        'Now read the last line carefully: "God gave us this life too." The word "too" concedes the afterlife exists and matters. He is arguing that earthly life ALSO deserves serious attention — an addition to Christian belief, not a substitute for it.',
        'State the limit of the evidence: nothing here rejects the Church, doubts God, or claims religion is false. Reading this as evidence of a turn toward atheism goes far beyond what the source supports.',
      ],
      answer:
        'It shows humanism as classical recovery aimed at practical civic and moral life, criticizing scholastic method — but it does NOT show a rejection of Christianity; the writer explicitly assumes God and the afterlife.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-italy',
      kind: 'try_yourself',
      problem:
        'Which condition best explains why the Renaissance took hold in Florence, Venice, and Milan before it did elsewhere in Europe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Trade and banking wealth concentrated in independent cities whose rival rulers competed to fund artists and scholars', correct: true },
        { id: 'b', text: 'Italy had been unified into a single powerful kingdom that funded the arts from one royal treasury' },
        { id: 'c', text: 'The Roman Empire was still governing western Europe from the city of Rome at this time' },
        { id: 'd', text: 'Italy was cut off from foreign trade, forcing Italians to invent everything themselves' },
      ],
      expectedAnswer: 'Trade and banking wealth concentrated in independent cities whose rival rulers competed to fund artists and scholars',
      hints: [
        'Ask who was actually paying the artists — and whether that payer had any competitors nearby watching what they bought.',
        'Italy in the 1400s was a set of rival city-states, not one kingdom, and its money came from Mediterranean commerce.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-gutenberg',
      kind: 'try_yourself',
      problem:
        'Movable type existed in China by the 1000s and was cast in metal in Korea in the 1200s. What, then, was Gutenberg\'s actual contribution around 1450?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He combined metal movable type with a screw press, oil-based ink, cheap paper, and a small alphabet into a system that made mass printing practical in Europe', correct: true },
        { id: 'b', text: 'He was the first person anywhere to print text using movable type' },
        { id: 'c', text: 'He invented paper, which had not existed in Europe before his workshop' },
        { id: 'd', text: 'He invented the Latin alphabet so that European languages could be written down' },
      ],
      expectedAnswer: 'He combined metal movable type with a screw press, oil-based ink, cheap paper, and a small alphabet into a system that made mass printing practical in Europe',
      hints: [
        'The question already tells you he was not first with movable type — so look for an answer about assembling parts rather than inventing one.',
        'An alphabet of about two dozen letters, reusable metal type, and a wine press together turn printing from possible into cheap.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-patronage',
      kind: 'try_yourself',
      problem:
        'The Medici, a banking family with no noble title, spent enormous sums commissioning chapels, sculpture, and libraries in Florence. What best explains this spending?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Public art converted merchant money into prestige and political influence that their family lacked by birth', correct: true },
        { id: 'b', text: 'Church law of the period required all bankers to donate half their profits to artists' },
        { id: 'c', text: 'Renaissance artists worked without payment, so commissioning art cost the family nothing' },
        { id: 'd', text: 'The king of Italy ordered wealthy families to fund public monuments' },
      ],
      expectedAnswer: 'Public art converted merchant money into prestige and political influence that their family lacked by birth',
      hints: [
        'Think about what a rich family without noble ancestry most needs in a city that respects old bloodlines.',
        'The Medici ran Florence for decades while holding no crown — the chapels and statues were part of how they did it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dark-ages',
      kind: 'misconception_check',
      question:
        'A student says: "The Renaissance was when Europe finally rejected religion and woke up from a thousand years of ignorance called the Dark Ages." What needs correcting here?',
      commonErrors: [
        {
          answer: 'The Renaissance replaced religion with reason and ended a blank, ignorant medieval period',
          misconception: 'Treating humanism as anti-religious, and accepting the Renaissance\'s own marketing of the preceding centuries as "dark."',
          correctsTo:
            'Two corrections. First, humanism was not anti-religious: the Church and devout patrons paid for most Renaissance art, most of its subjects were religious, and leading humanists like Erasmus were churchmen using classical scholarship to study scripture more carefully. Humanists added attention to this life; they did not subtract God. Second, "Dark Ages" is a label Renaissance writers invented to flatter themselves. The centuries they dismissed produced universities (Bologna c. 1088, Paris, Oxford), Gothic cathedrals, and the monastic copying that preserved the very Latin texts Petrarch went hunting for.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Italy first because three things overlapped there: Mediterranean trade wealth in cities, rival city-states competing to buy glory, and classical models close at hand — Roman ruins plus Greek manuscripts arriving with Byzantine scholars after 1453.',
        'Humanism meant studying classical texts for guidance in THIS life; it criticized scholastic method, not Christian faith. Patronage — above all the Medici bank money — is what actually paid for the art.',
        'The art revolution was technical: linear perspective, anatomy, light and shadow, and engineering like Brunelleschi\'s Florence dome (1436) replaced medieval symbolic scale, while the subjects stayed largely religious.',
        'Gutenberg\'s press around 1450 was the multiplier — not the first movable type (China and Korea were earlier) but the first practical European system. Cheap books spread humanism north to Erasmus and made the Reformation after 1517 impossible to contain.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'The Renaissance' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
