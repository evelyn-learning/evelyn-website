/**
 * Grade 7 World Geography -- Africa: History & Culture.
 *
 * A REGIONAL row, and regional rows in this course are GEOGRAPHY, not
 * history. The frame is National Geography Standard 6: history appears here
 * ONLY as the reason the cultural map of the continent looks the way it does
 * today. There is no timeline in this file and there are no dates to
 * memorize. Every historical statement exists to explain a present-day
 * pattern: why Swahili carries Arabic words, why French, English and
 * Portuguese are official languages in many countries, why Islam is
 * widespread in the north and the Sahel and Christianity across much of the
 * area south of the Sahara, and why so many borders on the continent are
 * long straight lines.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters more here than anywhere else
 * in the course. Africa is the place students are most often taught as one
 * undifferentiated thing. Two rules govern this file above all others:
 *   1. NO MONOLITH. The first key idea says that Africa is more than fifty
 *      countries and more languages than any other continent, and every
 *      later section says out loud that it is describing one part of the
 *      continent, never all of it. If you add anything to this file, add the
 *      qualifier with it.
 *   2. NEVER CHARACTERIZE THE PEOPLE OF ANYWHERE. Nothing here says what
 *      "people there are like." It describes trade systems, winds, deserts,
 *      languages, religions and boundary lines.
 * Colonization and the transatlantic slave trade are stated plainly, without
 * euphemism and without graphic detail, because the audience is twelve and
 * because other rows carry their own share of that subject.
 *
 * No statistics anywhere: no language counts, no adherent numbers, no
 * population figures. No current conflict, government or leader is named --
 * this row teaches settled geography, not the news.
 * There are also NO MAPS AND NO IMAGES in this course. Every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U9_AFRICA_HISTORY_AND_CULTURE: LessonPlan = {
  id: 'evelyn.ms.m7geo.africa-history-and-culture.v1',
  title: 'Africa: History & Culture',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.africa-history-and-culture',
      standard: 'M7GEO-9.2',
      description:
        "Describe the cultural diversity of Africa as a continent of many countries and many languages, and explain present-day patterns -- the spread of Bantu languages, Arabic in the north, European official languages, the distribution of Islam, Christianity and indigenous religious traditions, and the straight-line borders left by colonial partition -- by tracing each one back to the trade systems and outside forces that produced it (National Geography Standard 6: how culture and experience influence people's perceptions of places and regions).",
    },
  ],
  prerequisites: ['m7geo.africa-physical-geography'],
  followUps: ['m7geo.middle-east-geography-and-resources'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Break the single-Africa habit in the first ten seconds, using a question the student can already tell is broken.',
      script:
        'Suppose somebody asked you to describe European food in one sentence. You would probably say the question does not work. Food in Greece is not food in Norway. Now notice something. People ask that exact question about Africa all the time. What is African food? What is African music? What is African culture? Africa is a continent, far larger than Europe, and it holds more than fifty countries. More languages are spoken there than on any other continent. So the honest answer to what is African culture is another question: which country, which part of it, and which family? Today we are going to look at real patterns you can find on that continent right now -- the languages people speak, the religions people follow, the shape of some of the borders -- and work backward to what put each one there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-africa-culture',
      kind: 'concept',
      goal: 'Install diversity as the spine, then explain four present-day patterns -- language, religion, borders, and the wealth of the old trade states -- as effects with geographic and historical causes.',
      keyIdeas: [
        'AFRICA IS A CONTINENT, NOT A COUNTRY, AND NOT ONE CULTURE. Africa holds more than fifty countries. More languages are spoken there than on any other continent, and religion, food, music, clothing and daily life vary enormously from one country to the next and inside every one of those countries. A family in Morocco, on the northern edge of the Sahara, and a family in Zambia, far to the south, do not share one way of living, any more than a family in Norway and a family in Greece do. Hold on to this, because it is the spine of the whole lesson. The phrase African culture, in the singular, is not a description of anything. Everything below is an example from one part of the continent, never a description of all of it.',
        'LARGE AND WEALTHY STATES EXISTED IN AFRICA LONG BEFORE EUROPEAN COLONIZATION, AND GEOGRAPHY EXPLAINS THEM. In West Africa, three of them followed one after another: GHANA, then MALI, then SONGHAI. All three grew rich the same way. North of them lay the Sahara, and the Sahara worked less like a wall than like a sea to be crossed. Camels made the crossing possible, because a camel carries a heavy load and can go days without water. Gold was mined in the south and was scarce in the north. Salt was cut from the desert and was scarce in the south, and salt keeps food from spoiling in a hot climate. So caravans crossed in both directions, and the states sitting between the goldfields and the desert routes taxed everything that passed. That is the TRANS-SAHARAN TRADE. Cities grew where the routes met. The best known is TIMBUKTU, in what is now the country of Mali, where trade wealth paid for markets, mosques, schools and large collections of handwritten books, and made the city a famous center of Islamic scholarship. One caution: the old empire of Ghana was not in the same place as the modern country called Ghana, which took that name much later.',
        'ON THE EAST COAST THE HIGHWAY WAS THE OCEAN, AND YOU CAN STILL HEAR THE RESULT. Along the coast of East Africa stood the SWAHILI CITY-STATES: independent port towns, each with its own ruler, trading across the Indian Ocean with Arabia, India and places beyond. Geography explains this one too. The winds over that ocean are MONSOON winds, which blow from one direction for part of the year and then reverse for the rest of it. A trader could sail out on the wind of one season and come home on the reversed wind of the next, which turned a long voyage into something a person could plan. Centuries of that contact left a mark you can still hear today. SWAHILI is a Bantu language, African in its grammar and in its everyday core words, and it took in a large number of words from Arabic. Remember the rule from the language lesson: borrowing words is not the same as being related. Swahili borrowed heavily from Arabic and is still an African language, not a form of Arabic.',
        'THE LANGUAGE PATTERN TODAY HAS THREE BIG PIECES. First, the BANTU LANGUAGES, a large group that spread across much of central, eastern and southern Africa as people migrated over a long period. Swahili is one of them. Second, ARABIC, which is widely spoken across North Africa. Third, EUROPEAN LANGUAGES -- chiefly French, English and Portuguese -- which are official languages in many African countries. That third piece has a historical cause, and it should be said plainly: those languages are there because European countries colonized those places and ran the government and the schools in their own language. None of this erased what was already spoken. In most of those countries an official European language is used for government business while one or more African languages are used at home, in the market and with friends.',
        'RELIGION VARIES BY REGION, AND NO COUNTRY IS ONE RELIGION. ISLAM is widespread across North Africa and across the SAHEL, the belt of dry grassland just south of the Sahara. It arrived along the same trade routes that carried gold and salt, and along the trading coast in the east. CHRISTIANITY is widespread across much of the continent south of the Sahara, and it is not new to the continent either: it has been practiced in Ethiopia since ancient times, long before Europeans arrived. INDIGENOUS RELIGIOUS TRADITIONS, meaning religious practices that developed in Africa itself and have been followed for a very long time, are practiced as well, and often alongside Islam or Christianity in the same community. Describe every one of these the way the people who follow it describe it. Do not rank them, and do not turn a region into a religion: countries across the continent are home to people of more than one faith and to people of none.',
        'TWO THINGS DONE TO AFRICA FROM OUTSIDE STILL SHOW IN THE PRESENT, AND BOTH SHOULD BE SAID PLAINLY. The first is the TRANSATLANTIC SLAVE TRADE: over roughly four hundred years, millions of people were captured in Africa, carried across the Atlantic Ocean against their will and sold into slavery in the Americas. The second is COLONIAL PARTITION. In the late 1800s European powers divided almost the whole continent among themselves and drew the boundaries between their holdings, sometimes in meetings held in Europe. Those lines were drawn for the convenience of the countries drawing them, and they often ignored where peoples actually lived. That is the reason so many borders in Africa are GEOMETRIC boundaries, the long straight lines you sorted in the borders lesson, and the reason a single ETHNIC GROUP can have its home area split across two or three countries. When African countries became independent, most kept the boundaries that had been left to them.',
      ],
      vocabulary: [
        {
          term: 'trans-Saharan trade',
          definition:
            'the camel caravan routes that crossed the Sahara, carrying gold north out of West Africa and salt south into it.',
        },
        {
          term: 'Sahel',
          definition: 'the belt of dry grassland that runs across Africa just south of the Sahara.',
        },
        {
          term: 'monsoon winds',
          definition:
            'a wind system that blows from one direction for part of the year and reverses for the rest, which let Indian Ocean traders plan a round trip.',
        },
        {
          term: 'Bantu languages',
          definition:
            'a large group of related African languages, including Swahili, spoken across much of central, eastern and southern Africa.',
        },
        {
          term: 'colonization',
          definition:
            'one country taking control of another place, its resources and the people who live there, and running it from outside.',
        },
        {
          term: 'ethnic group',
          definition:
            'a group of people who share things such as a language, a history or a set of traditions, and who identify with each other.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-trade-systems',
      kind: 'worked_example',
      problem:
        'Two trading systems made parts of Africa wealthy long before any European colony existed. One crossed a desert. The other crossed an ocean. For each one, work out what made it possible and what it left behind that can still be found today.',
      steps: [
        'Start with what each system had to beat. The Sahara is enormous and dry, so the problem there was carrying enough water and enough cargo. The Indian Ocean is enormous and open, so the problem there was getting home again.',
        'Solve the desert problem. Camels carry heavy loads and can go days without water, so caravans could cross on known routes. Then ask why anyone would bother: gold was mined south of the desert and was scarce north of it, and salt was cut from the desert and was scarce south of it. Two shortages facing each other is a trade waiting to happen.',
        'Solve the ocean problem. The monsoon winds reverse with the seasons. Sail out on one season, do business while you wait, and ride the reversed wind home. The advantage was not speed. It was that the trip could be PLANNED.',
        'Now follow where the money piled up in each case. In West Africa it piled up at the places every caravan had to stop -- the market cities where routes met, such as Timbuktu -- and the states of Ghana, Mali and Songhai grew by taxing what passed. On the east coast it piled up in the port towns of the Swahili city-states, which handled goods coming down from the interior and going out across the water.',
        'Last, ask what each system left that is still there. In the west, Timbuktu became a center of Islamic scholarship with large collections of handwritten books, and Islam spread along those trade routes into the Sahel. In the east, Swahili is a Bantu language carrying a large layer of Arabic words -- the sound of centuries of Indian Ocean trading, still in everyday speech.',
        'One limit before you move on. Two trade systems on one enormous continent do not describe the whole continent. They explain two regions, and there are many more.',
      ],
      answer:
        'The Sahara trade was made possible by the camel and driven by opposite shortages, gold in the south and salt in the north; it built Ghana, Mali and Songhai on taxes collected where caravan routes met, and left Timbuktu as a center of trade and Islamic scholarship. The Indian Ocean trade was made possible by monsoon winds that reverse with the seasons, which let traders plan a round trip; it built the Swahili city-states and left Swahili, a Bantu language carrying many Arabic loanwords.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-language-pattern',
      kind: 'worked_example',
      problem:
        'Here is the language situation in four African countries. Explain why each one looks the way it does.\n\nMorocco, in the far north: Arabic is the most widely spoken language, and Amazigh languages are spoken there as well.\nSenegal, in West Africa: French is the official language, and Wolof is widely used in everyday life.\nKenya, in East Africa: Swahili and English are both official languages.\nAngola, in southern Africa: Portuguese is the official language, and Bantu languages such as Umbundu and Kimbundu are spoken as well.',
      steps: [
        'Sort before you explain. Which of these languages came from outside the continent, and which are African? French, English and Portuguese came from Europe. Arabic came from the Arabian Peninsula. Amazigh languages, Wolof, Swahili, Umbundu and Kimbundu are African languages.',
        'Take Morocco first. Morocco sits in North Africa, and Arabic is widely spoken across North Africa, having spread there long ago and stayed. Amazigh languages were spoken in the region before that and are spoken there now. So Morocco shows two layers, not one.',
        'Now Senegal and Angola together, because they share a mechanism. France colonized Senegal and Portugal colonized Angola. In each place the colonizing country ran the government and the schools in its own language, and that language stayed on as the official language after independence. Different colonizer, different European language, same cause.',
        'Now Kenya, which is the interesting one, because it has two official languages from two different sources. English is there because Britain colonized Kenya -- the same mechanism again. Swahili is there for a completely different reason: it is a Bantu language of the East African coast that spread inland as a shared language for trade, so people from different first languages could do business.',
        'Say the general rule you just used four times. Where a European language is official in Africa, the cause is almost always colonization. It tells you which European country controlled that place, and nothing else.',
        'Now the correction that matters most. In every one of these four countries, African languages are what people actually speak with each other day to day. An official language is a language a government names for its own business. It is not a list of what is spoken at home.',
        'And the limit: this is four countries out of more than fifty. A four-line list is a sample, not a description of a continent.',
      ],
      answer:
        'Arabic is widely spoken in Morocco because it spread across North Africa long ago, alongside Amazigh languages that were there before it. French is official in Senegal and Portuguese in Angola because France and Portugal colonized those places and ran government and schools in their own language. Kenya has two official languages from two sources: English from British colonization, and Swahili, a Bantu language that spread inland from the coast as a shared trading language. In all four, African languages are the everyday languages people use with each other.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-swahili-loanwords',
      kind: 'try_yourself',
      problem:
        'Swahili is built on Bantu grammar and Bantu everyday words, and it also contains a large number of words borrowed from Arabic. Which explanation of that pattern is correct?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Traders crossing the Indian Ocean did business on the East African coast for centuries, and Arabic words entered an African language through that contact',
          correct: true,
        },
        { id: 'b', text: 'Swahili is a form of Arabic that changed after it reached Africa' },
        { id: 'c', text: 'The two languages belong to the same language family, which is why so many words match' },
        { id: 'd', text: 'European colonizers brought the Arabic words to East Africa along with their own languages' }
      ],
      expectedAnswer:
        'Traders crossing the Indian Ocean did business on the East African coast for centuries, and Arabic words entered an African language through that contact',
      hints: [
        'Look at what the language IS underneath the borrowed words. The question tells you the grammar and the everyday core words are Bantu.',
        'Go back to the rule from the language lesson: borrowing words is not the same as being related. Two of these choices confuse borrowing with descent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-straight-border',
      kind: 'try_yourself',
      problem:
        'Two neighboring African countries share a border that runs dead straight for hundreds of miles across dry, flat land. There is no river along it and no mountain range near it, and the home area of one ethnic group lies partly in each country. Which explanation of that border is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The border follows a river that dried up and left its old straight channel behind' },
        { id: 'b', text: 'The border marks the line where one language stops being spoken and another begins' },
        {
          id: 'c',
          text: 'European powers divided the continent among themselves and drew boundaries that often ignored where peoples were living',
          correct: true,
        },
        { id: 'd', text: 'Borders in dry regions are always drawn straight because the land there is flat' }
      ],
      expectedAnswer:
        'European powers divided the continent among themselves and drew boundaries that often ignored where peoples were living',
      hints: [
        'Sort the boundary type first, the way you did in the borders lesson. A line that follows no landform at all is a geometric boundary, and the known weakness of a geometric boundary is that it takes no notice of who lives on either side.',
        'One detail in the question rules out the cultural-boundary answer on its own: the question says one group has its home area split by the line, so the line clearly does not follow where a group begins and ends.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trading-city',
      kind: 'try_yourself',
      problem:
        'A city grew up in the grassland just south of a great desert, at a place where several camel caravan routes met. Traders arriving from the south brought gold, traders arriving from the north brought salt, and both had to stop there. In time the city held busy markets, schools and large libraries of handwritten books. Why did a city grow at that particular spot?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It was built on top of the goldfields, so the gold did not have to be carried anywhere' },
        { id: 'b', text: 'It sat where the trade routes met, so goods and the money made from them passed through it', correct: true },
        { id: 'c', text: 'It stood on the coast, where ships could unload cargo straight into its markets' },
        { id: 'd', text: 'It was founded by European colonizers who built a railroad through the desert' }
      ],
      expectedAnswer: 'It sat where the trade routes met, so goods and the money made from them passed through it',
      hints: [
        'Read the question again for what it says about location. It gives you the position of the city, not what is buried under it.',
        'Two of these choices contradict the question itself: it says the gold arrived from the south, and it says the city is in grassland south of a desert rather than on a coast.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-africa',
      kind: 'misconception_check',
      question:
        'A student writes: "African culture is mostly the same everywhere, and before Europeans came there were no cities, no writing and no real countries in Africa." What needs correcting?',
      commonErrors: [
        {
          answer: 'African culture is mostly the same everywhere.',
          misconception:
            'Treating a whole continent as one culture, because one word covers the whole landmass on a globe and because Africa is often talked about as though it were a single place.',
          correctsTo:
            'WRONG: Africa has one culture. CORRECT: Africa is a continent of more than fifty countries, and more languages are spoken there than on any other continent. The languages alone show it: Arabic across the north, Bantu languages such as Swahili across much of central, eastern and southern Africa, Wolof in Senegal, Amazigh languages in the north, and French, English or Portuguese as official languages in many countries. Religion varies by region too, with Islam widespread in the north and the Sahel, Christianity across much of the area south of the Sahara, and indigenous religious traditions practiced as well, often alongside them. Add climates that run from the Sahara to rainforest to high mountains to the cooler far south. Any sentence that starts people in Africa are cannot finish honestly, because there are far too many different people inside it.',
        },
        {
          answer: 'Before Europeans came there were no cities, no writing and no real countries in Africa.',
          misconception:
            'Treating the arrival of Europeans as the moment history starts, and mistaking the absence of European records for the absence of anything to record.',
          correctsTo:
            'WRONG: nothing was there before Europeans arrived. CORRECT: large and wealthy states ran on African trade long before any European colony existed. Ghana, then Mali, then Songhai grew rich in West Africa by taxing the trans-Saharan trade in gold and salt. Timbuktu was a city of markets, mosques, schools and large collections of handwritten books, and a famous center of Islamic scholarship. On the east coast, the Swahili city-states were busy ports trading across the Indian Ocean with Arabia and India. That is cities, writing and organized states, all of it African, and all of it there first.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Africa is a continent of more than fifty countries, with more languages spoken than on any other continent and enormous variation in religion, food, music and daily life. The phrase African culture, in the singular, describes nothing.',
        'Large, wealthy states existed in Africa long before European colonization. Ghana, Mali and Songhai grew on the trans-Saharan trade in gold and salt, because camels made the desert crossable, and cities such as Timbuktu grew where the routes met.',
        'The Swahili city-states traded across the Indian Ocean using monsoon winds that reverse with the seasons. That contact is why Swahili, a Bantu language, carries many Arabic words -- borrowing, not relatedness.',
        'Bantu languages spread across much of central, eastern and southern Africa through migration over a long period. Arabic is widely spoken in the north. French, English and Portuguese are official in many countries because of colonization, and African languages are what people use day to day.',
        'Islam is widespread in North Africa and the Sahel, Christianity across much of the area south of the Sahara, and indigenous religious traditions are practiced too, often alongside them. No country is one religion.',
        'European powers divided the continent among themselves in the late 1800s and drew boundaries that often ignored where peoples lived. That is why so many African borders are long straight geometric lines, and why an ethnic group can be split across two or three countries.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Africa: History & Culture' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
