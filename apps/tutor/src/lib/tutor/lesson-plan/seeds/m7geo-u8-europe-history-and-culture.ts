/**
 * Grade 7 World Geography -- Europe & Russia: History & Culture.
 *
 * A REGIONAL row, and regional rows in this course are GEOGRAPHY, not
 * history. The frame is National Geography Standard 6: history appears here
 * ONLY as the reason the cultural map of Europe and Russia looks the way it
 * does today. There is no timeline in this file and there are no dates to
 * memorize. Every historical statement exists to explain a present-day
 * pattern: why Romance languages sit in the southwest and south, why Slavic
 * languages sit in the east, why two different alphabets are in daily use,
 * why the branches of Christianity are concentrated where they are, and why
 * certain regions are still shaped by manufacturing.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters. Four disciplines of care
 * govern this file:
 *   1. NO CURRENT EVENTS. No present-day dispute, no border question, no
 *      conflict, no war, no migration policy, no international organization.
 *      Rows 8.3 and 8.4 own their own scope and also stay out of current
 *      affairs. Countries are named ONLY in settled language, alphabet and
 *      landform statements.
 *   2. RELIGIONS ARE DESCRIBED FROM THE OUTSIDE, factually, with no
 *      evaluation of any kind and no comparison for merit. Branches are
 *      located on the map; they are never judged.
 *   3. NOTHING IS RANKED. Europe is never framed as ahead of, better than,
 *      or more developed than any other world region. The Renaissance and
 *      the Industrial Revolution appear here in a sentence or two each,
 *      purely as the reason a present-day landscape looks as it does, and
 *      the misconception check exists specifically to defuse the ranking
 *      reading a twelve-year-old will otherwise take away.
 *   4. NO MONOLITH, AND NO CHARACTERIZING PEOPLE. Europe is more than forty
 *      countries. Nothing here says what "the people there are like."
 *
 * No invented statistics anywhere: no speaker counts, no percentages, no
 * adherent numbers. There are also NO MAPS AND NO IMAGES in this course.
 * Every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U8_EUROPE_HISTORY_AND_CULTURE: LessonPlan = {
  id: 'evelyn.ms.m7geo.europe-history-and-culture.v1',
  title: 'Europe & Russia: History & Culture',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.europe-history-and-culture',
      standard: 'M7GEO-8.2',
      description:
        "Explain why the cultural map of Europe and Russia looks the way it does today by tracing present-day language branches, alphabets, religious practice and city landscapes back to the events that put them where they are (National Geography Standard 6: how culture and experience influence people's perceptions of places and regions).",
    },
  ],
  prerequisites: ['m7geo.europe-physical-geography'],
  followUps: ['m7geo.europe-economy-and-union'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open on a present-day pattern the student can hear and see, so the lesson is framed as explaining a pattern rather than marching through dates.',
      script:
        'Try saying the word for "night" in a few languages. In Spanish it is noche. In Italian, notte. In French, nuit. In Portuguese, noite. Those four countries sit next to each other in the southwest and south of Europe, and their words for night are practically cousins. Now go northeast. In Polish it is noc, in Russian it is noch -- still similar, but a different sort of similar. And in Russia and Poland the words are not even written with the same letters. Poland writes with the same alphabet you are reading right now. Russia writes with a different one. So here is the question for today. Why do those patterns sit exactly where they sit? We are not going to march through a list of dates. We are going to take the cultural map that is on the ground right now and work back to what put it there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-europe-culture',
      kind: 'concept',
      goal: 'Install the three language branches, the two alphabets and the boundary they mark, the religious map described from the outside, the two movements that explain present-day landscapes, and the no-monolith close.',
      keyIdeas: [
        'THE REGION, AND WHAT THIS LESSON IS ACTUALLY DOING. This unit covers Europe together with Russia, because Russia stretches from eastern Europe across northern Asia, with the Ural Mountains usually taken as the dividing line between the two continents. Europe alone holds more than forty countries. Our job today is not to learn a story of the past in order. Our job is to look at things you could notice right now -- which language people speak, which letters they write with, which buildings stand in the middle of a city -- and explain why each one sits where it sits. History shows up in this lesson only as an answer to a question that starts with the word why.',
        'MOST EUROPEAN LANGUAGES BELONG TO ONE FAMILY, IN THREE BIG BRANCHES, AND ONE BRANCH EXPLAINS ITSELF. Back in the language unit you learned that a language family is a group of languages descended from one ancestor language. Most languages of Europe belong to the Indo-European family, and inside that family they gather into three large branches that sit in different parts of the region. GERMANIC languages are spoken across the north and northwest: English, German, Dutch, Danish, Swedish, Norwegian and Icelandic. ROMANCE languages are spoken across the southwest and south: Spanish, Portuguese, French, Italian and Romanian. SLAVIC languages are spoken across the east: Russian, Polish, Czech, Ukrainian, Bulgarian and Serbian. Those branches are geographic clumps, not a scattering, and the Romance clump is the one with the cleanest explanation. Romance languages are all descended from Latin, the language of the Roman Empire. The empire ran the lands around the western Mediterranean for centuries, and Latin traveled with its soldiers, officials, roads and schools. After the empire ended, the everyday Latin spoken in each area kept changing on its own, and over many generations those local versions drifted far enough apart to become separate languages. That is descent, not borrowing -- the same distinction from the language unit. And the branch is not a neat block: Romanian is a Romance language sitting in eastern Europe, well away from the others, because Latin reached that area too.',
        'TWO ALPHABETS, AND A CULTURAL BOUNDARY YOU CAN SEE ON A SIGN. Much of Europe writes with the LATIN alphabet, the twenty-six letters on your keyboard, which came from the Romans along with Latin itself. Much of eastern and southeastern Europe writes with the CYRILLIC alphabet, a different set of letters. Greece uses a third, the Greek alphabet. Here is the useful part. The alphabet split lines up broadly with which branch of Christianity spread into an area. Where Roman Catholic Christianity spread from Rome, the Latin alphabet came with it. Where Eastern Orthodox Christianity spread from the Greek-speaking Byzantine world, Cyrillic came with it -- the alphabet is named after Cyril, a missionary from that world. That is why Polish and Czech are Slavic languages written in Latin letters while Russian, Ukrainian and Bulgarian are Slavic languages written in Cyrillic. Two neighbors can speak closely related languages and still write them in different letters. In the borders unit this is called a cultural boundary: a line that follows a difference between people rather than a river or a ruler-straight line. It is a boundary you can see on a street sign today, put there by something that happened long ago.',
        'THE RELIGIOUS MAP, DESCRIBED PLAINLY AND FROM THE OUTSIDE. Christianity has been the most widespread religion in Europe historically, and it has three large branches that are concentrated in different parts of the region. ROMAN CATHOLIC Christianity is the historically most widespread branch across southern Europe, including Italy, Spain and Portugal, and also in countries such as Poland and Ireland. PROTESTANT branches, which began with a movement in the fifteen hundreds called the Reformation, took hold mainly across northern Europe, including the Scandinavian countries and parts of Germany and Britain. EASTERN ORTHODOX Christianity is the historically most widespread branch across eastern and southeastern Europe, including Russia, Greece, Bulgaria, Serbia and Romania. Other religions have long and continuing presences here as well: Islam has been present in parts of Europe for many centuries, and Muslim communities live across the region today, and Jewish communities have lived in Europe for many centuries and are part of Europe today. Many people in Europe follow no religion at all. Every sentence in this key idea is a statement about WHERE, and nothing more. We describe beliefs and practices as the people who hold them describe them. We do not decide whether any of them is right, and we never rank one against another. That is not what geography does.',
        'TWO MOVEMENTS THAT EXPLAIN WHAT A CITY LOOKS LIKE, AND ONE WARNING. The RENAISSANCE was a movement in art and learning that began in the Italian city-states in the thirteen and fourteen hundreds and spread across Europe, and it is a large part of why so many European cities have old art museums, painted churches and historic centers that visitors travel to see. Universities in the region are old too: the University of Bologna in Italy has been operating since the ten hundreds. The INDUSTRIAL REVOLUTION was the shift to making goods in factories with powered machines. It began in Britain in the seventeen hundreds and spread across parts of western and central Europe, usually taking hold near coal fields, rivers and ports, because that is where the fuel and the shipping were. That is why regions such as northern England and the Ruhr area of western Germany are still lined with factory towns, canals and old mine works. Now the warning, and it is the most important sentence in this lesson. None of this makes Europe ahead of anywhere else, and geography never makes that kind of claim. Every world region has its own long record of art, learning, building and invention. Explaining WHERE something happened and WHY it happened there is geography. Deciding that it makes one place better than another is not geography at all, and it is not true.',
        'EUROPE AND RUSSIA ARE NOT ONE CULTURE, AND NO SINGLE COUNTRY IS EITHER. Start with the languages the three branches leave out, because not every language here is Indo-European at all. Finnish, Estonian and Hungarian belong to the Uralic family. Basque, spoken in a region on both sides of the border between Spain and France, is not known to be related to any other language on Earth. Add it up: more than forty countries, three large language branches plus languages that belong to no branch at all, several alphabets and many religious traditions do not make one way of living. Look inside a single country and the same thing happens again. Switzerland has four national languages: German, French, Italian and Romansh. Russia is home to many peoples and many languages besides Russian, including Tatar, which belongs to the Turkic family rather than the Indo-European one. People have also moved to Europe from every part of the world, and large European cities are home to communities with roots across Africa, Asia, the Americas and the rest of Europe, which adds more languages, foods and traditions to places that already had many. Any sentence that begins with the words Europeans are is already wrong, because the region contains far too many different people for that sentence to finish honestly.',
      ],
      vocabulary: [
        {
          term: 'language branch',
          definition:
            'a smaller group inside a language family, holding languages that are more closely related to each other than to the rest of the family.',
        },
        {
          term: 'Romance languages',
          definition:
            'the branch of Indo-European languages descended from Latin, including Spanish, Portuguese, French, Italian and Romanian.',
        },
        {
          term: 'Cyrillic alphabet',
          definition:
            'the set of letters used to write Russian and several other languages of eastern and southeastern Europe.',
        },
        {
          term: 'cultural boundary',
          definition:
            'a boundary that follows a difference between people, such as a difference in language, alphabet or religion.',
        },
        {
          term: 'Renaissance',
          definition:
            'a movement in art and learning that began in the Italian city-states in the thirteen and fourteen hundreds and spread across Europe.',
        },
        {
          term: 'Industrial Revolution',
          definition:
            'the shift to making goods in factories with powered machines, which began in Britain in the seventeen hundreds and spread.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-the-language-map',
      kind: 'worked_example',
      problem:
        'Here are six languages and where each is widely spoken. Sort them into branches, then explain why the branches sit where they do.\n\nSwedish: Sweden, in the north. Dutch: the Netherlands, in the northwest. Portuguese: Portugal, in the southwest. Italian: Italy, in the south. Polish: Poland, in the east. Finnish: Finland, in the north.',
      steps: [
        'Sort first, explain second. Swedish and Dutch are Germanic. Portuguese and Italian are Romance. Polish is Slavic. Finnish belongs to none of the three, because Finnish is not an Indo-European language at all.',
        'Now put the sorted list next to the directions given. Germanic is north and northwest. Romance is southwest and south. Slavic is east. The branches are clumps on the map, and each clump sits in one part of the region.',
        'Take the Romance clump, because it is the one with a clean explanation. Portuguese and Italian both descended from Latin, the language of the Roman Empire, which controlled the lands around the western Mediterranean for centuries. Latin traveled with the empire, then kept changing separately in each area after the empire ended, and the local versions became separate languages.',
        'Be careful about what kind of relationship that is. Portuguese and Italian are similar because they DESCENDED from the same ancestor language, not because Portugal and Italy traded words with each other. That is the descent-versus-borrowing test from the language unit.',
        'Now handle Finnish, because a good answer says what does not fit. Finland sits in northern Europe surrounded by Germanic-speaking neighbors, but Finnish belongs to the Uralic family, along with Estonian and Hungarian. A regional pattern is a pattern, not a rule with no exceptions.',
        'State the limit out loud. This is six languages out of a great many. Sorting the big branches is a starting point for reading the map, never a claim that everyone inside a branch shares one way of living.',
      ],
      answer:
        'Germanic in the north and northwest: Swedish and Dutch. Romance in the southwest and south: Portuguese and Italian, both descended from the Latin that spread with the Roman Empire and then changed separately in each area. Slavic in the east: Polish. Finnish fits none of the three, because it is Uralic rather than Indo-European.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-a-city',
      kind: 'worked_example',
      problem:
        'Walk through an invented European city called Vellham and trace each part of it back to what put it there.\n\nIn the center stands a stone cathedral several hundred years old. A few streets away, an art museum holds paintings made during the Renaissance. Down by the river sits a district of long brick buildings that used to be textile factories, beside a canal that once carried coal. On the next street, shops and restaurants are run by families with roots in West Africa, South Asia and eastern Europe.',
      steps: [
        'Do not guess yet. List the four things plainly: an old cathedral, a Renaissance art museum, a brick factory district with a coal canal, and a street of shops and restaurants with roots in several parts of the world.',
        'Take the cathedral. A large old Christian building in the middle of a European city reflects the fact that Christianity has been the most widespread religion in Europe historically. Which branch of Christianity is most widespread nearby depends on which part of the region the city sits in: Roman Catholic across much of the south, Protestant branches across much of the north, Eastern Orthodox across much of the east and southeast. Notice what we just did. We located a pattern. We did not say anything about whether any belief is right, because that is not a geography question.',
        'Take the museum. Renaissance paintings hang there because the Renaissance began in the Italian city-states and spread across Europe as a movement in art and learning. That is why old art museums and painted churches are a common feature of European city centers today. One sentence of past explains one present-day building.',
        'Take the factory district and the canal. Factories with powered machines spread across parts of Europe during the Industrial Revolution, which began in Britain, and they clustered near coal, rivers and ports because that is where the fuel and the shipping were. The canal in this city carried coal, so Vellham is exactly that kind of place, and its brick district is what is left standing.',
        'Take the last street. People have moved to Europe from every part of the world, and large cities hold communities with roots across many continents. Those shops and restaurants are part of the city now, not an addition to it, and they are one of the reasons the cultural map keeps changing.',
        'Say the limit, because it matters. Vellham is one invented city. A town in the Scandinavian north, a village in southern Italy and a city on the Russian plain would each give you a different walk. Explaining one place is not describing a region of more than forty countries, and nothing here tells you what any person who lives there is like.',
      ],
      answer:
        'The cathedral traces to the long presence of Christianity in Europe, with the branch depending on which part of the region the city sits in. The museum traces to the Renaissance, which began in the Italian city-states and spread. The brick factories and coal canal trace to the Industrial Revolution, which began in Britain and took hold near coal, rivers and ports. The shops and restaurants trace to people moving to Europe from many parts of the world. Each is one present-day thing explained by one reason -- and Vellham is a single invented city, not a whole region.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-romance-languages',
      kind: 'try_yourself',
      problem:
        'Spanish, Portuguese, French, Italian and Romanian are similar enough that a speaker of one can often recognize words in another. Which explanation of that pattern is correct?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'They are not actually related; the similar words were borrowed back and forth because those countries trade with each other',
        },
        {
          id: 'b',
          text: 'Latin descended from these five languages, which were already spoken across southern Europe before the Roman Empire existed',
        },
        {
          id: 'c',
          text: 'Each of these countries decided in recent times to make its language more similar to the languages nearby',
        },
        {
          id: 'd',
          text: 'They all descended from Latin, which spread across the Roman Empire, and the everyday Latin in each area changed on its own over many generations into a separate language',
          correct: true,
        }
      ],
      expectedAnswer:
        'They all descended from Latin, which spread across the Roman Empire, and the everyday Latin in each area changed on its own over many generations into a separate language',
      hints: [
        'Two languages can share words for two very different reasons: they descended from the same ancestor language, or they borrowed from each other. Which one produces similarity in ordinary everyday words like night and mother?',
        'Check the direction of time in each choice. One of them has the ancestor language coming AFTER its descendants, and one has languages changing by a recent decision rather than over many generations.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-alphabets',
      kind: 'try_yourself',
      problem:
        'Polish and Russian are both Slavic languages, and they are closely related. Polish is written in the Latin alphabet and Russian is written in the Cyrillic alphabet. What best explains this difference?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Polish and Russian belong to different language families, and each language family uses its own alphabet',
        },
        {
          id: 'b',
          text: 'An alphabet is chosen to match how a language sounds, and Slavic languages in the east sound too different from Slavic languages in the west to share letters',
        },
        {
          id: 'c',
          text: 'The two alphabets spread with different branches of Christianity: the Latin alphabet where Roman Catholic Christianity spread from Rome, and Cyrillic where Eastern Orthodox Christianity spread from the Greek-speaking Byzantine world',
          correct: true,
        },
        {
          id: 'd',
          text: 'Cyrillic is an early form of the Latin alphabet that eastern Europe kept while western Europe replaced it',
        }
      ],
      expectedAnswer:
        'The two alphabets spread with different branches of Christianity: the Latin alphabet where Roman Catholic Christianity spread from Rome, and Cyrillic where Eastern Orthodox Christianity spread from the Greek-speaking Byzantine world',
      hints: [
        'The question already tells you the two languages are closely related, so the answer cannot be that they come from different families. Something OTHER than the language itself arrived and brought a set of letters with it.',
        'A writing system usually spreads the way anything else spreads: somebody carries it into a place. Ask what was being carried into eastern Europe from Rome, and what was being carried in from the Greek-speaking Byzantine world.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-one-culture',
      kind: 'try_yourself',
      problem:
        'Switzerland, a country in western Europe, has four national languages: German, French, Italian and Romansh. Which conclusion does this best support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Switzerland is the only country in Europe where more than one language is spoken',
        },
        {
          id: 'b',
          text: 'A single country can hold several language communities at once, so a country is not the same thing as a single culture',
          correct: true,
        },
        {
          id: 'c',
          text: 'Every person living in Switzerland speaks all four of those languages',
        },
        {
          id: 'd',
          text: 'The four languages show that Switzerland sits inside four different language families',
        }
      ],
      expectedAnswer:
        'A single country can hold several language communities at once, so a country is not the same thing as a single culture',
      hints: [
        'A country is a unit on a political map. Ask whether anything about drawing a border guarantees that everyone inside it lives, speaks and eats the same way.',
        'Check the choice that claims four separate families against the concept. German is Germanic, and French, Italian and Romansh are all Romance, so those four languages sit in two branches of one family, not in four families.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-europe-one-culture',
      kind: 'misconception_check',
      question:
        'A student writes: "Europe is basically one culture -- European. And since the Renaissance and the Industrial Revolution happened there, Europe was ahead of everywhere else." What needs correcting?',
      commonErrors: [
        {
          answer: 'Europe is basically one culture -- European.',
          misconception:
            'Treating a whole region as one culture, because one label on a map has been mistaken for one way of living.',
          correctsTo:
            'WRONG: Europe is one culture. CORRECT: Europe alone holds more than forty countries. Its languages fall into three large branches that sit in different parts of the region -- Germanic, Romance and Slavic -- plus languages that belong to none of them, such as Finnish, Estonian, Hungarian and Basque. Several alphabets are in daily use, including Latin, Cyrillic and Greek. Several branches of Christianity are concentrated in different areas, Islam and Judaism have long and continuing presences, and many people follow no religion. The variety repeats inside single countries too: Switzerland has four national languages, and Russia is home to many peoples and languages besides Russian. A region is an area geographers group together for one reason, never a claim that everyone inside it lives the same way.',
        },
        {
          answer: 'Since the Renaissance and the Industrial Revolution happened there, Europe was ahead of everywhere else.',
          misconception:
            'Turning an explanation of WHERE something happened into a ranking of the places involved -- treating two European movements as a scoreboard rather than as the answer to a geography question.',
          correctsTo:
            'WRONG: those movements mean Europe was ahead of everywhere else. CORRECT: geography explains where something happened and why it happened in that spot, and it stops there. The Industrial Revolution took hold near coal fields, rivers and ports because that is where the fuel and the shipping were -- that is a statement about resources and location, not about people. Every world region has its own long record of art, learning, building and invention, and this course covers several of them. Ranking regions or the people in them is not a geographic finding, it is not measurable, and it is not true. Ask why here and not there. Never ask who is better.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Most European languages are Indo-European and gather into three branches that sit in different parts of the region: Germanic in the north and northwest, Romance in the southwest and south, Slavic in the east. Finnish, Estonian, Hungarian and Basque are not in any of the three.',
        'Romance languages sit where they sit because they all descended from Latin, which spread with the Roman Empire and then changed separately in each area over many generations.',
        'Much of the west writes with the Latin alphabet and much of the east writes with Cyrillic, and that split lines up broadly with where Roman Catholic and Eastern Orthodox Christianity spread. It is a cultural boundary you can see on a street sign today.',
        'Christianity has been the most widespread religion in Europe historically, with Roman Catholic, Protestant and Eastern Orthodox branches concentrated in different areas. Islam and Judaism have long and continuing presences, and many people follow no religion. Geography says where; it never evaluates a religion.',
        'The Renaissance is a large part of why European cities have old art museums and historic centers, and the Industrial Revolution, which began in Britain, is why regions near coal, rivers and ports are still lined with factory towns.',
        'Europe and Russia are not one culture, and neither is any single country in them. Switzerland has four national languages, Russia has many peoples and languages besides Russian, and people from every part of the world live in European cities. Any sentence starting Europeans are is already wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Europe & Russia: History & Culture' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
