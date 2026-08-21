/**
 * Grade 7 World Geography -- South & East Asia: History & Culture.
 *
 * A REGIONAL row, and regional rows in this course are GEOGRAPHY, not
 * history. The frame is National Geography Standard 6: history appears here
 * ONLY as the reason a present-day pattern looks the way it does. There is
 * no timeline in this file, no dynasty list and no dates to memorize. Every
 * historical statement exists to explain something a student could notice
 * today: why several unrelated languages were written with the same
 * characters, why Buddhism is widely practiced far from where it began, why
 * river valleys and deltas hold villages packed close together, and why
 * goods and ideas from this region turn up everywhere else.
 *
 * NOTE FOR FUTURE AUTHORS. This is one of the most sensitive regional rows
 * in the course, and six disciplines of care govern it:
 *   1. NO POLITICS OF ANY KIND. No government, no leader, no party, no
 *      current or recent conflict, and -- this one is absolute -- NO
 *      sovereignty or territorial question anywhere in the region. No
 *      border is described, compared, or even mentioned as unsettled. The
 *      Korean Peninsula is named as a landform region only. Rows 10.1 and
 *      10.3 own their own scope and also stay out of current affairs.
 *   2. RELIGIONS ARE DESCRIBED FROM THE OUTSIDE, factually, with no
 *      evaluation and no comparison for merit. Row 4.3 already taught the
 *      five traditions respectfully; this row references that work and does
 *      NOT re-teach doctrine. Confucian influence is named as a cultural
 *      influence in two sentences and is never graded.
 *   3. NOTHING IS RANKED. No culture, country or tradition in this region
 *      is ahead of, behind, more advanced than, or more traditional than
 *      any other, in either direction. The words advanced, backward,
 *      civilized and primitive appear nowhere.
 *   4. NO MONOLITH, AND NO CHARACTERIZING PEOPLE. The lesson says out loud,
 *      more than once, that no single description covers this region.
 *      Nothing here says what the people of any country are like.
 *   5. CASTE IS NOT TAUGHT HERE. It is contested, easily flattened by a
 *      short treatment, and row 4.3 deliberately left it out. Do not add it.
 *   6. NO STATISTICS. No speaker counts, no adherent numbers, no
 *      percentages. Colonization appears once, factually, in a clause.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U10_SOUTH_AND_EAST_ASIA_CULTURE: LessonPlan = {
  id: 'evelyn.ms.m7geo.south-and-east-asia-culture.v1',
  title: 'South & East Asia: History & Culture',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.south-and-east-asia-culture',
      standard: 'M7GEO-10.2',
      description:
        "Explain why the cultural map of South and East Asia looks the way it does today by tracing present-day language patterns, writing systems, religious practice and settlement back to the contact, trade and farming that put them there (National Geography Standard 6: how culture and experience influence people's perceptions of places and regions).",
    },
  ],
  prerequisites: ['m7geo.asia-physical-geography'],
  followUps: ['m7geo.asia-population-and-economy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open on two present-day patterns a twelve-year-old could notice today, and frame the lesson as explaining patterns rather than marching through dates.',
      script:
        'Look at the back of a snack package, or open the language menu in a game. You may see several ways of writing side by side. One uses characters, where a single sign can stand for a whole word or a piece of one. One mixes those characters with small signs that stand for syllables. One uses an alphabet made of round shapes and straight lines. One uses letters that look a lot like the ones you are reading right now. Here is the strange part. Those writing systems are used for languages that are not closely related to each other at all, and yet several of them trace back to the same starting point. Now hold that next to something else. In the same part of the world, there are river valleys where villages sit almost shoulder to shoulder, and there is land a few hundred miles away where hardly anyone lives at all. Today we take patterns like those, the ones you could go and notice right now, and work out why each one sits exactly where it sits. There is no list of dates in this lesson. The past shows up only when it answers a question that starts with the word why.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-south-east-asia-culture',
      kind: 'concept',
      goal: 'Install the no-single-description rule, the language pattern, the writing-system diffusion story, two-way trade routes, the religious map described from the outside, and wet-rice settlement.',
      keyIdeas: [
        'START WITH THE ONE SENTENCE THAT MATTERS MOST: NO SINGLE DESCRIPTION COVERS THIS REGION. South Asia, East Asia and Southeast Asia together hold dozens of countries, hundreds of languages, religious traditions of every kind, and climates that run from cold northern grassland to high mountain valleys to tropical islands. A village in a mountain valley, a fishing town on an island and a neighborhood in a huge city do not share one way of living. So there is no such thing as one Asian culture, and any sentence that begins with the words people in Asia are is already wrong before it finishes. Everything below is a pattern with a reason, never a rule about everybody. And remember what a regional lesson is for: we are explaining why a present-day pattern sits where it does, not learning a story of the past in order.',
        'THE LANGUAGES, AND WHY THEY SORT THE WAY THEY DO. Back in the language unit you learned that a language family is a group of languages descended from one ancestor language. South Asia holds languages from more than one family at the same time. INDO-EUROPEAN languages, the same family that English and Spanish belong to, are widely spoken across the northern part of South Asia: Hindi in northern India, Bengali in Bangladesh and eastern India, and Urdu in Pakistan are examples. DRAVIDIAN languages, which belong to a completely different family, are widely spoken across the south: Tamil and Telugu in southern India are examples. Two great families in one region, in a broad north and south pattern. East Asia is different again. The Chinese languages, including Mandarin, belong to the Sino-Tibetan family, while Japanese and Korean each belong to a different family of their own. Southeast Asia adds more families still, including the Austronesian family you met in the language unit, which includes Indonesian. Hold on to one point here: being in a different family is not being a lesser language. A family is a family tree, not a scoreboard.',
        'THE BEST STORY IN THIS LESSON: ONE WRITING SYSTEM, FOUR DIFFERENT ANSWERS. A writing system is a set of signs used to put a language on a page, and here is the thing students almost never expect -- a writing system can be borrowed by a language it is not related to at all. The Chinese writing system, whose characters descend from writing used in China thousands of years ago, spread outward to Japan, to the Korean Peninsula and to Vietnam through long contact: traders, travelers, teachers and scholars who read the same books. And in every one of those places it was ADAPTED rather than simply copied. Japanese is written with those characters together with two additional sets of signs, called hiragana and katakana, that were developed in Japan and stand for syllables. Korean today is written mainly with an alphabet developed on the Korean Peninsula in the fourteen hundreds. Vietnamese today is written with an alphabet built from Latin letters, worked out with European missionaries and made the standard script during the period of French colonial rule. Look at what that adds up to. The same starting point produced four different answers. In the words of the globalization lesson, that is CONVERGENCE and DIVERGENCE happening at once: places became more alike in one detail and then went their own ways in the details underneath. And notice how it happened. This was a cultural boundary drawn by CONTACT -- people reading, trading and traveling -- not by anybody conquering a language.',
        'TRADE ROUTES CARRIED IDEAS, AND THEY CARRIED THEM BOTH WAYS. Two great sets of routes tied this region to the rest of the world for a very long time. Overland, the SILK ROADS ran across Central Asia, linking East Asia and South Asia to Southwest Asia and Europe. By sea, ships crossed the Indian Ocean between the coasts of East Africa, Southwest Asia, South Asia and Southeast Asia, and those sailing routes ran on the monsoon: winds that blow one way for part of the year and reverse for the rest, which is exactly the wind pattern you met in the physical geography lesson. Goods moved on those routes, and so did religions and technologies, and this is the part to hold on to -- the movement went in BOTH directions. Ideas that began in South Asia reached East Asia. Papermaking and other technologies developed in China reached Southwest Asia and eventually Europe. Cotton cloth and spices from South and Southeast Asia reached ports in every direction. Influence is not one-directional, and it never was. Ideas about family, education and social order associated with the teaching of Confucius, who lived in China, also spread among societies across East Asia, where they shaped how families, schools and communities were organized. Geographers note where an influence reached and what it touched. Grading it is not a geography question.',
        'THE RELIGIOUS MAP, DESCRIBED PLAINLY AND FROM THE OUTSIDE. You already met these traditions in the religions lesson, so this is about WHERE, not about what anybody should believe. BUDDHISM began in South Asia and spread north and east along the overland routes across Central Asia and the sea routes across the Indian Ocean, into Central, East and Southeast Asia, and different schools of it developed in different places along the way. That is a diffusion story, and it explains a pattern that surprises people: a tradition can be widely practiced very far from the region where it began. HINDUISM remains centered in South Asia, and it is widely practiced in India and Nepal. ISLAM is widely practiced across parts of South Asia and across much of Southeast Asia, including Indonesia. Other traditions are practiced throughout the region as well, among them Sikhism and Jainism, which developed in South Asia, and Shinto in Japan, while Christianity is widely practiced in the Philippines. Many people in the region follow no religion at all. Every sentence in this key idea is a statement about where, and nothing more. We describe beliefs and practices the way the people who hold them describe them, we do not decide whether any of them is right, and we never rank one against another.',
        'RICE AND SETTLEMENT: THE MOST GEOGRAPHIC PATTERN IN THE REGION. WET-RICE FARMING means growing rice in fields that are flooded with a few inches of water for part of the growing season. It needs flat land, plenty of water and a warm season, which is why it fits river valleys and DELTAS -- the flat, fan-shaped land where a river splits into channels as it reaches the sea -- in the monsoon parts of South, Southeast and East Asia. Two consequences follow, and both are things you can see. First, a flooded rice field produces a great deal of food from a small area, so the same land supports far more people than drier farmland nearby. That is why some of these valleys and deltas hold the densest RURAL settlement anywhere on Earth: villages close together, fields worked right up to the edge of the houses, and terraces cut into the hillsides where the flat ground runs out. Second, the work sets the calendar. Planting waits for the rains, the harvest follows months later, and holidays and market days in many places line up with that year. Rice is also the base of the everyday meal across much of the region. But hold the pattern in its place: this is not the whole region. Wheat and millet are grown across the drier north of China, herding is common on high plateaus and dry interiors, and mountains and cold northern lands support few farms of any kind. One kind of farming explains one kind of place.',
      ],
      vocabulary: [
        { term: 'wet-rice farming', definition: 'growing rice in fields flooded with shallow water for part of the growing season; it needs flat land, plenty of water and a warm season.' },
        { term: 'delta', definition: 'the flat, fan-shaped land built up where a river splits into channels as it reaches the sea.' },
        { term: 'monsoon', definition: 'a wind pattern that blows from one direction for part of the year and reverses for the rest, bringing a wet season and a dry season.' },
        { term: 'Silk Roads', definition: 'the network of overland trade routes across Central Asia that linked East and South Asia with Southwest Asia and Europe.' },
        { term: 'writing system', definition: 'the set of signs used to put a language on a page; a language can borrow a writing system from a language it is not related to.' },
        { term: 'adaptation', definition: 'changing something after it arrives so that it fits the place it arrived in; also called cultural divergence.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-writing',
      kind: 'worked_example',
      problem:
        'Here is how four languages are written today. Explain the pattern: what is shared, what is different, and why.\n\nChinese: written with characters, each standing for a word or a piece of a word.\nJapanese: written with those same characters plus two sets of syllable signs developed in Japan.\nKorean: written mainly with an alphabet developed on the Korean Peninsula in the fourteen hundreds.\nVietnamese: written with an alphabet built from Latin letters.',
      steps: [
        'Sort before you explain. Only Chinese and Japanese use the characters today. Korean and Vietnamese each use an alphabet, and the two alphabets are not the same one.',
        'Now find the shared starting point, because the sorted list hides it. All four of these languages were written with Chinese characters at some point. The characters spread outward from China to Japan, to the Korean Peninsula and to Vietnam.',
        'Ask how a writing system travels from one language to a completely different one like that. Not by the languages being related -- Japanese, Korean and Vietnamese are not in the same family as the Chinese languages. It crossed by CONTACT: traders, travelers, teachers and scholars reading the same books over a very long time. A writing system is a tool, and a tool can be picked up by anybody who finds it useful.',
        'Now explain the differences, one at a time. Japanese kept the characters and added two sets of syllable signs developed in Japan, so it writes with both at once. Korean is written mainly with an alphabet developed on the Korean Peninsula in the fourteen hundreds. Vietnamese is written with an alphabet built from Latin letters, worked out with European missionaries and made standard during the period of French colonial rule.',
        'Name what just happened with the vocabulary from the globalization lesson. Something spread and made four places more alike -- that is convergence. Then each place changed it to fit its own language, and they ended up different -- that is divergence, or adaptation. Both are true at the same time, and that is the normal result, not a contradiction.',
        'Say the limit out loud. This explains writing, and writing only. It does not tell you that these places share one culture, and it does not tell you anything at all about what anybody who lives there is like.',
      ],
      answer:
        'All four languages were written at some point with Chinese characters, which spread outward through long contact rather than because the languages are related. Each place then adapted the system its own way: Japanese uses the characters plus two sets of syllable signs developed in Japan, Korean uses an alphabet developed on the Korean Peninsula in the fourteen hundreds, and Vietnamese uses an alphabet built from Latin letters. That is convergence in the starting point and divergence in what each place made of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-a-delta',
      kind: 'worked_example',
      problem:
        'An invented river delta is described below. Explain why each detail is there.\n\nThe land is flat for miles and the river splits into many channels before reaching the sea. Heavy rain falls for several months and then almost none falls for several more. Villages sit close together, each surrounded by flooded fields. Rice appears at nearly every meal. The busiest market days of the year come just after the harvest, and the local holiday falls a few weeks later.',
      steps: [
        'List the details plainly first, without explaining anything. Flat land. A river splitting into channels. A long wet season and a long dry season. Villages close together. Flooded fields. Rice at meals. Markets and a holiday timed to the harvest.',
        'Start with the physical facts, because they come first in the chain. Flat land where a river splits into channels as it meets the sea is a delta. Rain for several months and then almost none is the monsoon pattern from the physical geography lesson.',
        'Put those two together and you get the farming. Wet-rice farming needs flat land, a lot of water and a warm season. A monsoon delta supplies all three, which is why the fields are flooded rather than dry.',
        'Now the settlement, which is the geographic payoff. Flooded rice fields produce a great deal of food from a small area, so a small amount of land can feed a lot of people. That is why the villages sit close together instead of spreading out -- dense RURAL settlement, packed with farms rather than with city blocks.',
        'Then the diet and the calendar, which follow from the same fact. What a place grows in quantity is usually what a place eats, so rice is at nearly every meal. And planting has to wait for the rains, so the harvest lands at a fixed time of year, and the markets and the holiday sit right after it. The year is built around the crop.',
        'Finish with the limit, and it matters. This chain explains a monsoon delta. Travel inland to a dry plateau, north to where wheat and millet grow, or up into the mountains, and every step of it changes. One kind of farming explains one kind of place, never a whole region.',
      ],
      answer:
        'Flat land where a river splits into channels makes a delta, and the wet-then-dry pattern is the monsoon. Together they suit wet-rice farming, which is why the fields are flooded. Flooded rice fields feed many people from a small area, which is why villages sit close together in dense rural settlement. Rice is grown in quantity, so rice is eaten at most meals, and because planting waits for the rains, the harvest, the markets and the holiday all fall at the same point in the year.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-shared-characters',
      kind: 'try_yourself',
      problem:
        'Japanese, Korean and Vietnamese are not in the same language family as the Chinese languages. Even so, all three were written with Chinese characters for a long time. What best explains that?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Sharing a writing system proves the languages are in the same family after all, because every language family uses its own set of signs',
        },
        {
          id: 'b',
          text: 'Each of those languages slowly changed over many generations until it became a form of Chinese',
        },
        {
          id: 'c',
          text: 'The characters were invented separately in each place and only happen to look similar',
        },
        {
          id: 'd',
          text: 'A writing system can be borrowed by a language it is not related to, and this one spread through long contact -- trade, travel and scholars reading the same books -- and was then adapted in each place',
          correct: true,
        }
      ],
      expectedAnswer:
        'A writing system can be borrowed by a language it is not related to, and this one spread through long contact -- trade, travel and scholars reading the same books -- and was then adapted in each place',
      hints: [
        'The question already tells you the languages are not in the same family, so the answer cannot be that they are related. Something other than the language itself traveled from one place to another.',
        'Remember the descent-versus-borrowing test from the language unit. Descent means two things came from the same ancestor. Borrowing means one thing was picked up from somebody else. Which one is a set of signs on a page?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-dense-rural-settlement',
      kind: 'try_yourself',
      problem:
        'In several river valleys and deltas of South and East Asia, the countryside holds far more people per square mile than the drier land nearby, and those people live in farming villages rather than in cities. Which explanation fits that pattern best?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Settlement is only ever dense in cities, so those valleys must actually be city neighborhoods rather than farming villages',
        },
        {
          id: 'b',
          text: 'Wet-rice farming on flat, well-watered land produces a great deal of food from a small area, so the same amount of land supports many more people',
          correct: true,
        },
        {
          id: 'c',
          text: 'Rivers make land flat, and flat land is the only kind of land where a house can be built',
        },
        {
          id: 'd',
          text: 'Wet-rice farming needs very few workers, so most of the land can be used for houses instead of fields',
        }
      ],
      expectedAnswer:
        'Wet-rice farming on flat, well-watered land produces a great deal of food from a small area, so the same amount of land supports many more people',
      hints: [
        'Population density is people divided by area. To get a high number in the countryside, you need a lot of food coming off each acre -- so ask which choice is about how much food the land produces.',
        'Check the other three against what you know. Are all dense places cities? Can houses only stand on flat land? And does a flooded rice field sound like it needs fewer workers or more?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-buddhism-far-from-hearth',
      kind: 'try_yourself',
      problem:
        'Buddhism began in South Asia. Today it is widely practiced in parts of East and Southeast Asia, thousands of miles from where it began. Which explanation best fits how geographers describe that pattern?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It must have begun in East Asia rather than South Asia, because a religion is always most widely practiced in the region where it started',
        },
        {
          id: 'b',
          text: 'A religion can only reach a new region if large numbers of people move there, so most people in East Asia must have migrated from South Asia',
        },
        {
          id: 'c',
          text: 'It spread along the overland routes across Central Asia and the sea routes across the Indian Ocean, carried by travelers, traders and teachers, and different schools developed in the places it reached',
          correct: true,
        },
        {
          id: 'd',
          text: 'It reached East Asia only in recent times, once fast modern travel made long journeys possible',
        }
      ],
      expectedAnswer:
        'It spread along the overland routes across Central Asia and the sea routes across the Indian Ocean, carried by travelers, traders and teachers, and different schools developed in the places it reached',
      hints: [
        'The place something began is called its hearth, and the place it is practiced today can be very far away. Do not let one of those facts overwrite the other.',
        'Think about what else was moving along the trade routes in this lesson. Goods were not the only cargo, and cultural change did not start with engines.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-asia',
      kind: 'misconception_check',
      question:
        'A student writes: "South and East Asia all share one Asian culture, and Japan, Korea and Vietnam basically just copied it from China." Two things have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'South and East Asia all share one Asian culture.',
          misconception:
            'Treating an enormous region as a single unit, because it has one name on a map and gets talked about as one thing.',
          correctsTo:
            'WRONG: there is one Asian culture. CORRECT: no single description covers this region, and saying so is part of the lesson, not a footnote to it. There are dozens of countries and hundreds of languages, drawn from several different language families -- Indo-European and Dravidian in South Asia, Sino-Tibetan and others in East Asia, Austronesian and others in Southeast Asia. Every major religious tradition is practiced here, and many people practice none. The climates run from cold northern grassland to high mountains to tropical islands, and what people grow, eat and build changes with them. A mountain village, an island fishing town and a huge city are not one way of living. Describe the particular place you are actually talking about.',
        },
        {
          answer: 'Japan, Korea and Vietnam basically just copied Chinese culture.',
          misconception:
            'Reading cultural diffusion as copying, and assuming influence only ever runs one way -- from a bigger place to smaller ones.',
          correctsTo:
            'WRONG: they copied it. CORRECT: the Chinese writing system spread through long contact, and every place that received it ADAPTED it. Japanese is written with the characters plus two sets of syllable signs developed in Japan. Korean is written mainly with an alphabet developed on the Korean Peninsula in the fourteen hundreds. Vietnamese is written with an alphabet built from Latin letters. Same starting point, four different answers -- that is convergence and divergence at the same time, exactly as in the globalization lesson. And influence is not one-directional. Ideas that began in South Asia reached East Asia, technologies developed in China reached Southwest Asia and Europe, and goods from South and Southeast Asia reached ports in every direction. Borrowing something is not losing what you had, and it is never evidence that one place ranks above another.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'No single description covers this region. Dozens of countries, hundreds of languages from several different families, every major religious tradition and many people who follow none. Any sentence that begins people in Asia are is already wrong.',
        'South Asia holds Indo-European languages such as Hindi, Bengali and Urdu across the north and Dravidian languages such as Tamil and Telugu across the south. East Asia holds the Chinese languages, which are Sino-Tibetan, plus Japanese and Korean, which are not.',
        'The Chinese writing system spread to Japan, the Korean Peninsula and Vietnam through contact, not conquest, and every place ADAPTED it: characters plus syllable signs in Japan, an alphabet developed on the Korean Peninsula in the fourteen hundreds, and a Latin-based alphabet for Vietnamese today. Convergence and divergence at the same time.',
        'Overland routes across Central Asia and sea routes across the Indian Ocean carried goods, religions and technologies in BOTH directions, and the Indian Ocean routes ran on the monsoon winds.',
        'Buddhism began in South Asia and spread north and east along those routes, developing different schools along the way, which is why it is widely practiced far from where it began. Hinduism remains centered in South Asia, and Islam is widely practiced across parts of South Asia and much of Southeast Asia, including Indonesia. Religions are described from the outside and never ranked.',
        'Wet-rice farming in monsoon valleys and deltas feeds many people from a small area, which is why some of the densest RURAL settlement on Earth is there, and why diet and the yearly calendar are built around the crop. Drier and colder parts of the region grow wheat and millet or support herding instead.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'South & East Asia: History & Culture' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
