/**
 * Grade 7 World Geography -- Latin America: History & Culture.
 *
 * A REGIONAL row, and regional rows in this course are GEOGRAPHY, not
 * history. The frame is National Geography Standard 6: history appears here
 * ONLY as the reason the cultural map of the region looks the way it does
 * today. There is no timeline in this file, and there are no dates to
 * memorize. Every historical statement exists to explain a present-day
 * pattern: why Spanish is spoken across much of the region and Portuguese in
 * Brazil, why Roman Catholicism is widespread, why African-rooted music and
 * food are central in the Caribbean and coastal Brazil, and why indigenous
 * languages are still everyday languages in the Andes and in Paraguay.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters. Three disciplines of care
 * govern this file:
 *   1. INDIGENOUS PEOPLES ARE PRESENT TENSE. Every mention of the Maya, the
 *      Aztec (Mexica), the Inca or any indigenous people is paired with the
 *      fact that indigenous peoples and languages are part of the region
 *      today. Past-tense-only writing about living peoples is the single
 *      worst failure this row can commit.
 *   2. COLONIZATION AND THE TRANSATLANTIC SLAVE TRADE ARE STATED PLAINLY,
 *      without euphemism and without minimizing -- and without graphic
 *      detail, because the audience is twelve.
 *   3. INTERNAL DIVERSITY IS THE POINT. The region is many countries, many
 *      languages, many climates and many ways of living. Nothing here
 *      describes what "the people there are like," ranks any culture against
 *      another, or evaluates any religion. Religions are described from the
 *      outside, as adherents describe them.
 *
 * No invented statistics anywhere: no speaker counts, no percentages.
 * There are also NO MAPS AND NO IMAGES in this course. Every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U7_LATIN_AMERICA_HISTORY_AND_CULTURE: LessonPlan = {
  id: 'evelyn.ms.m7geo.latin-america-history-and-culture.v1',
  title: 'Latin America: History & Culture',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.latin-america-history-and-culture',
      standard: 'M7GEO-7.2',
      description:
        "Explain why the cultural geography of Latin America looks the way it does today by tracing present-day languages, religious practice, food and music back to indigenous peoples who have lived in the region for thousands of years, to Spanish and Portuguese colonization, and to the forced migration of Africans through the transatlantic slave trade (National Geography Standard 6: how culture and experience influence people's perceptions of places and regions).",
    },
  ],
  prerequisites: ['m7geo.latin-america-physical-geography'],
  followUps: ['m7geo.latin-america-economy-and-cities'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with a present-day puzzle about which languages are spoken where, so the lesson is framed as explaining a pattern rather than marching through dates.',
      script:
        'Here is something odd. Brazil and Argentina share a border. You can drive across it. But most people on one side of that border speak Portuguese, and most people on the other side speak Spanish. Go north to the Andes and you will hear families speaking Quechua at home. Go out to the islands of the Caribbean and you will hear French, and English, and Dutch, and drums in the music with rhythms that came from West Africa. All of that is one region. So what happened? Today we are not going to march through a list of dates. We are going to do something geographers do: look at the pattern that is on the ground right now, and work backward to what put it there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-latin-america-culture',
      kind: 'concept',
      goal: 'Explain the present-day cultural pattern of the region through three sources -- indigenous, European and African -- and close hard on internal diversity.',
      keyIdeas: [
        'THE REGION, AND WHERE ITS NAME CAME FROM. Latin America is the name for Mexico, Central America, the Caribbean islands and South America taken together, which is the same region you studied in the last lesson. The name points at the languages: Spanish, Portuguese and French all grew out of Latin, so the whole region was named Latin America after those languages, and the name stuck. That is worth noticing, because it is how region names usually work. A region name is a label people chose, and it highlights one part of a place while leaving other parts out. This name says nothing about the indigenous languages of the region or about its African heritage, and both are here.',
        'INDIGENOUS PEOPLES CAME FIRST AND ARE STILL HERE. Indigenous peoples have lived in this region for thousands of years, and they live here now. Long before any European ship arrived, large states had already been built: the MAYA in parts of what is now southern Mexico and Central America, the AZTEC, who called themselves the MEXICA, in central Mexico, and the INCA along the Andes in western South America. The Mexica capital, Tenochtitlan, stood on an island in a lake, and Mexico City stands on that same ground today. Cusco, the Inca capital high in the Andes of Peru, is a working city right now. And the languages did not stop: Quechua and Aymara are spoken in the Andes, Nahuatl and Mayan languages in Mexico and Central America, and Paraguay has two official languages, Spanish and Guarani, which is an indigenous language of the region.',
        'COLONIZATION IS WHY THE LANGUAGES ARE WHERE THEY ARE TODAY. Starting in the late 1400s, European countries took control of land and people across the region. That is what colonization means: one country taking control of another place, its resources and the people living there. Spain took control of most of the mainland. Portugal took control of what is now Brazil. That single fact is the reason Spanish is the most widely spoken language across much of the region today and Portuguese is the language of Brazil. It is also why Roman Catholicism, the form of Christianity the Spanish and Portuguese brought, became the most widespread religion in the region. Other European countries colonized parts of the Caribbean and the northern coast of South America, which is why French is spoken in Haiti, English in Jamaica, and Dutch in Suriname.',
        'AFRICANS WERE BROUGHT HERE BY FORCE. Over several hundred years, millions of people were captured in Africa, carried across the Atlantic Ocean against their will, and sold into slavery in the Americas. This was the TRANSATLANTIC SLAVE TRADE, and in the language of the migration unit it is forced migration -- these people had no choice at any point. Most of them were made to work on plantations growing sugar and other crops, and the largest numbers were taken to the Caribbean islands and to the coast of Brazil. That is exactly where communities of African descent are largest in the region today, and it is why African heritage is central to the culture of those places.',
        'THE RESULT IS CULTURAL BLENDING, AND YOU CAN TASTE IT AND HEAR IT. Three sets of traditions ended up in the same places, and over generations they combined. Food: corn, beans, chili peppers, potatoes and cacao were grown in the Americas long before contact, while cattle, pigs, wheat and cheese arrived with Europeans, and dishes across the region use both. Music: in Brazil, samba grew out of communities of African descent, and its drumming and rhythms have roots in West and Central Africa, while many instruments in the same bands came from Europe and some, such as the maraca, were already in use in the Americas. Religious practice blends too. In Mexico, Day of the Dead falls at the start of November on days that also sit on the Roman Catholic calendar, and families remember relatives who have died with altars, flowers, photographs and foods that person liked -- an observance that joins Catholic practice with traditions that were in the region long before.',
        'THE REGION IS NOT ONE CULTURE, AND SAYING SO IS THE POINT. Latin America holds many different countries and territories, several major languages plus many indigenous languages, and climates that run from the Amazon rainforest to high cold Andean valleys to Caribbean islands to the dry far south. The blend is different everywhere: a highland Andean town, a city neighborhood in Sao Paulo, a Caribbean island and a village in southern Mexico do not share one way of living. Anything that begins with the words people in Latin America are is already wrong, because the region contains far too many different people for that sentence to finish honestly.',
      ],
      vocabulary: [
        {
          term: 'indigenous peoples',
          definition:
            'the peoples who were living in a region first and whose communities and languages continue there today.',
        },
        {
          term: 'colonization',
          definition:
            'one country taking control of another place, its resources and the people who live there, and settling its own people there.',
        },
        {
          term: 'transatlantic slave trade',
          definition:
            'the forced movement of millions of people from Africa across the Atlantic Ocean, where they were sold into slavery in the Americas.',
        },
        {
          term: 'cultural blending',
          definition:
            'what happens when traditions from different sources come together in one place over generations and combine into new languages, foods, music and customs.',
        },
        {
          term: 'official language',
          definition: 'a language a country names for use in its government, its courts and its schools.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-language-pattern',
      kind: 'worked_example',
      problem:
        'Here is the language most widely spoken in six places in the region. Explain the pattern -- why each language ended up where it did.\n\nMexico: Spanish. Colombia: Spanish. Brazil: Portuguese. Haiti: Haitian Creole, with French also an official language. Jamaica: English. Suriname: Dutch.',
      steps: [
        'Start by sorting, not explaining. Five European languages appear in this short list: Spanish, Portuguese, French, English and Dutch. Haitian Creole is the sixth language named, and it is not European. Five European languages, all in one region.',
        'Ask the geographer question: what do the places sharing a language have in common? Mexico and Colombia are both on the mainland, and Spain took control of most of the mainland. So Spanish is there because Spanish colonizers settled there and ran the government and the schools in Spanish.',
        'Brazil breaks the pattern for one reason. Portugal, not Spain, colonized what is now Brazil. Same mechanism, different colonizing country, so a different language. Brazil is not an exception to the rule -- it is the rule working exactly as stated.',
        'Now the three smaller cases. France, Britain and the Netherlands colonized different islands and stretches of coast, and each left its own language behind in the places it controlled. Haiti was colonized by France, Jamaica by Britain, Suriname by the Netherlands.',
        'Look harder at Haiti, because it shows the next step. Haitian Creole is the everyday language of Haiti. Much of its vocabulary comes from French, but it developed in Haiti among people who had been brought there by force from Africa, and it is a language in its own right, not a version of French. A blended history produced a language that belongs to that place.',
        'Last, say what the list leaves out. None of these is an indigenous language, but indigenous languages are spoken across the region every day: Quechua and Aymara in the Andes, Nahuatl and Mayan languages in Mexico and Central America, and Guarani, which is an official language of Paraguay alongside Spanish. A list of the biggest languages is not a list of all the languages.',
      ],
      answer:
        'Each European language sits where the country that spoke it took colonial control: Spain across most of the mainland, Portugal in Brazil, France in Haiti, Britain in Jamaica, the Netherlands in Suriname. Haitian Creole shows the blending that followed, and indigenous languages such as Quechua, Aymara, Nahuatl, Mayan languages and Guarani are still everyday languages the list does not show.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trace-the-blend',
      kind: 'worked_example',
      problem:
        'A street festival in a coastal city in Brazil has drum groups playing samba, singers using guitars and brass instruments, and food stalls selling black beans cooked with pork, served with rice and slices of orange. Trace each part back to where it came from, and name what the whole scene shows.',
      steps: [
        'Do not guess yet. List the parts plainly: drums and samba rhythms, guitars and brass instruments, black beans, pork, rice, oranges.',
        'Take the music first. Samba grew out of communities of African descent in Brazil, and its drumming and rhythms have roots in West and Central Africa. Ask why those communities are on this coast at all, and the answer is the transatlantic slave trade: people were taken there by force, and the largest numbers went to the Caribbean and to coastal Brazil.',
        'Now the instruments beside the drums. Guitars and brass instruments came from Europe, arriving with Portuguese colonization and staying. The same band is playing two histories at once.',
        'Now the food. Beans were grown in the Americas long before European contact. Pigs came with Europeans. Oranges and rice are not native to the Americas either, and both arrived after European contact. One plate, more than one source.',
        'Name the idea. This is cultural blending: elements from indigenous, European and African sources combining over generations into something that belongs to this place and is not any one of the three by itself.',
        'Finish with the limit, because it matters. This scene is a coastal Brazilian festival. It is not Latin America in general. A highland Andean town or a village in southern Mexico blends a different set of sources in a different way, and no single festival stands in for a region of many different countries.',
      ],
      answer:
        'The drums and samba rhythms trace to African heritage carried to coastal Brazil by the forced migration of the transatlantic slave trade; the guitars, brass and pork came with European colonization, and oranges and rice also arrived after European contact; the beans were grown in the Americas long before contact. Together they are cultural blending -- and they describe one coastal city, not a whole region.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-portuguese-in-brazil',
      kind: 'try_yourself',
      problem:
        'Most people in Brazil speak Portuguese, while most people in the countries bordering Brazil speak Spanish. Which explanation of that pattern is correct?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Portugal colonized what is now Brazil while Spain colonized most of the surrounding mainland, and the language of each colonizing country spread where it took control',
          correct: true,
        },
        { id: 'b', text: 'Brazil chose Portuguese and its neighbors chose Spanish after they became independent countries' },
        { id: 'c', text: 'Portuguese and Spanish are the two indigenous languages of South America' },
        { id: 'd', text: 'Portuguese reached Brazil only through trade contact, without Portuguese speakers ever settling there' }
      ],
      expectedAnswer:
        'Portugal colonized what is now Brazil while Spain colonized most of the surrounding mainland, and the language of each colonizing country spread where it took control',
      hints: [
        'A language usually ends up somewhere because the people who spoke it moved there and ran the government and the schools in it. Ask which European country controlled which piece of land.',
        'Two of these treat Spanish and Portuguese as if they started in the Americas or arrived without anybody settling. Both of those languages came from Europe, carried by settlers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-indigenous-today',
      kind: 'try_yourself',
      problem:
        'In parts of the Andes today, many families speak Quechua at home and Spanish at school and in government offices. What does this pattern show?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Indigenous languages are still everyday languages in the region, spoken alongside the languages that arrived with colonization',
          correct: true,
        },
        { id: 'b', text: 'Quechua is a regional form of Spanish that developed in the mountains' },
        { id: 'c', text: 'The Andes were first settled after Spanish colonization began' },
        { id: 'd', text: 'Everyone in the Andes speaks the same language, so the region has a single culture' }
      ],
      expectedAnswer:
        'Indigenous languages are still everyday languages in the region, spoken alongside the languages that arrived with colonization',
      hints: [
        'Read the tense in the question. It says families speak Quechua at home today, not that they once did.',
        'Indigenous peoples have lived in this region for thousands of years and live here now. Check each choice against that, and against the fact that the families in the question use two languages, not one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-blended-meal',
      kind: 'try_yourself',
      problem:
        'A common meal in Mexico is a tortilla made from corn, which was grown in the region for thousands of years before European contact, filled with beef and cheese, which come from cattle that Europeans brought across the Atlantic. Which idea does this meal best illustrate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The meal shows that the region had no food traditions before Europeans arrived' },
        { id: 'b', text: 'Cultural blending: an everyday practice that combines elements from different sources into something belonging to that place', correct: true },
        { id: 'c', text: 'The meal shows that the culture of the region was completely replaced by European culture' },
        { id: 'd', text: 'The meal shows that corn was brought to the Americas from Europe' }
      ],
      expectedAnswer:
        'Cultural blending: an everyday practice that combines elements from different sources into something belonging to that place',
      hints: [
        'Count the sources in the meal. The question tells you where the corn came from and where the cattle came from, and they are not the same place.',
        'If one source had replaced the other, only one would be left on the plate. Both are on the plate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-culture',
      kind: 'misconception_check',
      question:
        'A student writes: "Latin America is one culture. Everybody there speaks Spanish, and the indigenous peoples of the region are all in the past." What needs correcting?',
      commonErrors: [
        {
          answer: 'Latin America is one culture and everybody there speaks Spanish.',
          misconception:
            'Treating a whole region as a single culture with a single language, because one label for a whole region has been mistaken for one way of living.',
          correctsTo:
            'WRONG: Latin America is one culture and everybody speaks Spanish. CORRECT: the region holds many different countries and territories. Portuguese is the language of Brazil, the most populous country in the region. Haitian Creole and French are spoken in Haiti, English in Jamaica, Dutch in Suriname, and indigenous languages such as Quechua, Aymara, Nahuatl, Mayan languages and Guarani are spoken every day. The climates run from Amazon rainforest to high Andean valleys to Caribbean islands to the dry far south, and the way traditions blend is different in each. A region is an area geographers group together for one reason, never a claim that everyone inside it lives the same way.',
        },
        {
          answer: 'The indigenous peoples of the region are all in the past.',
          misconception:
            'Hearing about the Maya, the Aztec and the Inca only in past-tense stories, and concluding that indigenous peoples of the region no longer exist.',
          correctsTo:
            'WRONG: indigenous peoples of the region belong to the past. CORRECT: indigenous peoples have lived in this region for thousands of years and live here now, in every part of it. Mayan languages are spoken in Guatemala and southern Mexico, Quechua and Aymara in the Andes, Nahuatl in Mexico, and Guarani is an official language of Paraguay alongside Spanish. States such as the Maya kingdoms, the Mexica state and the Inca empire ended, but the peoples did not. Say what actually happened -- a state ended -- and keep the people in the present tense, where they are.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Indigenous peoples have lived in this region for thousands of years and live here today. The Maya, the Mexica or Aztec, and the Inca built large states before any European arrived, and indigenous languages such as Quechua, Aymara, Nahuatl, Mayan languages and Guarani are spoken now.',
        'Spanish is the most widely spoken language across much of the region and Portuguese is the language of Brazil because Spain colonized most of the mainland and Portugal colonized what is now Brazil. Roman Catholicism became widespread the same way.',
        'French, English and Dutch appear in parts of the Caribbean and the northern coast of South America for the same reason: France, Britain and the Netherlands colonized those places.',
        'Millions of Africans were taken across the Atlantic by force through the transatlantic slave trade, most of them to the Caribbean and coastal Brazil. African heritage is central to the culture of those places today.',
        'Cultural blending is the result: food, music, language and religious practice that combine indigenous, European and African elements into something that belongs to the place it grew in.',
        'The region is not one culture. Many different countries and territories, several major languages plus many indigenous languages, and climates from rainforest to high mountains to islands. Any sentence that starts people in Latin America are is already wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Latin America: History & Culture' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
