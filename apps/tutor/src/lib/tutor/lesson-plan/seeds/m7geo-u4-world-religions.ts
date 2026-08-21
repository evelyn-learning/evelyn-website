/**
 * Grade 7 World Geography — Culture: Major World Religions.
 *
 * NOTE FOR FUTURE AUTHORS, and this is the most sensitive row in the course:
 * a twelve-year-old reading this page may be an adherent of any tradition
 * named in it, or of none. So this file describes beliefs and practices
 * FROM THE OUTSIDE, the way adherents themselves describe them, and it
 * NEVER evaluates a religion as true or false and NEVER compares religions
 * for merit. No tradition here is older-and-therefore-purer, newer-and-
 * therefore-derivative, simpler, more advanced or more rational than any
 * other. If a sentence in this file could be read by a believer as a verdict
 * on their faith rather than a description of it, that sentence is a defect.
 *
 * It is also a GEOGRAPHY row, not a theology row. The subject is spatial:
 * where each tradition began (its hearth), how it spread (diffusion), and
 * where it is widely practiced today. Doctrine appears only in the one
 * sentence needed to identify a tradition, phrased as what adherents hold,
 * and no further. The universalizing/ethnic pair is the analytical frame,
 * because it is descriptive -- it classifies how a religion SPREADS, not how
 * good it is.
 *
 * Three hard lines were drawn while writing it, and they should hold:
 * (1) no adherent counts and no ranking of religions by size -- the lesson
 * says "widely practiced in", never "the largest"; (2) no contested
 * political, territorial or sectarian material of any kind -- no conflicts,
 * no holy-site disputes, no doctrinal controversies, and hearths are given
 * as REGIONS ("the eastern Mediterranean region of Southwest Asia") rather
 * than as modern states; (3) internal diversity is stated out loud for every
 * tradition, because the monolith error is the one most likely to hurt a
 * student in the room.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U4_WORLD_RELIGIONS: LessonPlan = {
  id: 'evelyn.ms.m7geo.world-religions.v1',
  title: 'Major World Religions',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.world-religions',
      standard: 'M7GEO-4.3',
      description:
        'Describe where five major world religions began, how they spread from those hearths, and where they are widely practiced today, and distinguish universalizing religions from ethnic religions (National Geography Standard 10: the characteristics, distribution and complexity of Earth cultural mosaics).',
    },
  ],
  prerequisites: ['m7geo.language-families-and-diffusion'],
  followUps: ['m7geo.cultural-change-and-globalization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open the spatial question -- how did all of these get here -- and say out loud, before anything else, that this lesson does not judge anybody.',
      script:
        'Walk through almost any large town and you will pass buildings where different groups of people gather: a church on one street, a mosque a few blocks over, a temple or a synagogue near the shops. Look at a school calendar and you will find holidays that come from several different traditions. Here is what a geographer notices. None of those buildings appeared out of nowhere. Every one of them is the end of a long journey that began somewhere else, often thousands of miles away and a very long time ago. Today we follow those journeys. We are not asking which religion is right. That is not a geography question, and it is not what this lesson is for. We are asking where each one began, how it traveled, and where people follow it now.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-hearths-and-diffusion',
      kind: 'concept',
      goal: 'Install hearth, diffusion, and the universalizing/ethnic pair, then place five traditions on that frame factually and from the outside.',
      keyIdeas: [
        'THIS IS A GEOGRAPHY LESSON ABOUT RELIGION, NOT A LESSON ABOUT WHO IS RIGHT. Geographers ask three questions about any religion: where did it begin, how did it spread, and where is it widely practiced today. We describe what each tradition teaches the way the people who follow it describe it, and we do not judge any religion as true or false, and we do not rank them against each other. Those are not geography questions. Everybody in this course is described with the same respect.',
        'EVERY RELIGION HAS A HEARTH, AND EVERY RELIGION SPREADS BY DIFFUSION. A hearth is the area where something began. Diffusion is the movement of an idea or a practice from its hearth out to new places. Religions have diffused with traders, travelers, teachers, missionaries and with ordinary families who moved and carried their traditions along. That is why a tradition that began in one region can be part of daily life on the other side of the world today.',
        'TWO WAYS A RELIGION SPREADS, AND GEOGRAPHERS HAVE NAMES FOR BOTH. A UNIVERSALIZING RELIGION teaches a message that its adherents understand as meant for all people, so members share it wherever they go, and it ends up practiced far from its hearth. An ADHERENT is a person who follows a religion. An ETHNIC RELIGION is closely tied to one particular people and place. It usually does not send out missionaries looking for new members, so it spreads mainly when families migrate. Be careful with the word ethnic here: it describes HOW a religion spreads, not a rule about who is allowed to join. People do join these traditions.',
        'THE THREE MOST OFTEN DESCRIBED AS UNIVERSALIZING. CHRISTIANITY began about two thousand years ago in the eastern Mediterranean region of Southwest Asia; Christians believe in one God and follow the teachings of Jesus, and their scripture is the Bible. It is widely practiced today in Europe, in North and South America, in many parts of Africa south of the Sahara, in the Philippines and across much of Oceania. ISLAM began about fourteen hundred years ago on the Arabian Peninsula, in and around the city of Mecca; Muslims believe in one God and follow the teachings brought by the Prophet Muhammad, and their scripture is the Quran. It is widely practiced today across Southwest Asia and North Africa, in much of West Africa and Central Asia, and in South and Southeast Asia, including Indonesia. BUDDHISM began about twenty five hundred years ago in South Asia, in the area of present day Nepal and northern India, with the teachings of Siddhartha Gautama, who is called the Buddha; Buddhists follow his teachings about the causes of suffering and a path that leads beyond it. It is widely practiced today in parts of South, Southeast and East Asia.',
        'THE TWO MOST OFTEN DESCRIBED AS ETHNIC. HINDUISM developed in South Asia over thousands of years. It has no single founder and no single founding moment; it grew out of many older traditions, and its oldest sacred texts are the Vedas. It is widely practiced today in India and Nepal, and by communities in many other countries where families from South Asia settled. JUDAISM began more than three thousand years ago in the eastern Mediterranean region of Southwest Asia, among the ancestors of the Jewish people; Jews believe in one God, and Jewish teaching and law are centered on the Torah. Jewish communities live in many parts of the world today, including Southwest Asia, Europe and North America.',
        'NO TRADITION IS ONE SINGLE THING, AND NO COUNTRY IS ONE SINGLE RELIGION. Each of these five contains many branches, many communities and many ways of practicing, and adherents do not all believe or practice in identical ways. Two people who name the same religion may keep different holidays, hear a different language at their services and follow different customs at home, and both are part of that tradition. There are also many religions beyond these five, including Sikhism, Jainism, Shinto and traditional religions followed by communities in every world region, and a great many people follow no religion at all. Almost every country on Earth is home to people of several religions and to people of none.',
      ],
      vocabulary: [
        { term: 'hearth', definition: 'the area where something began. The hearth of a religion is the region where it first developed.' },
        { term: 'diffusion', definition: 'the spread of an idea or a practice from where it began out to new places.' },
        { term: 'adherent', definition: 'a person who follows a particular religion.' },
        { term: 'universalizing religion', definition: 'a religion whose adherents understand its message as meant for all people and share it widely, so it is often practiced far from its hearth.' },
        { term: 'ethnic religion', definition: 'a religion closely tied to a particular people and place, which spreads mainly when families migrate rather than by seeking new members.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-buddhism-diffusion',
      kind: 'worked_example',
      problem:
        'Buddhism began in South Asia. Today it is widely practiced in parts of East and Southeast Asia, thousands of miles from where it started. Walk through how a geographer explains that pattern.',
      steps: [
        'Start with the hearth. Buddhism began about twenty five hundred years ago in South Asia, in the area of present day Nepal and northern India, with the teachings of Siddhartha Gautama, who is called the Buddha. That is question one answered: where did it begin.',
        'Ask question two: how did it spread? Buddhism is a universalizing religion, which means its adherents understand its teachings as meant for anyone. A message meant for anyone travels with whoever carries it.',
        'Follow the routes. Traders, travelers and teachers moved along the overland trade roads across Central Asia and along the sea routes of the Indian Ocean. Buddhist teachings moved with them into Central Asia, China, Korea, Japan, Sri Lanka and mainland Southeast Asia.',
        'Notice what happened on arrival, because this is the part students miss. As Buddhism settled into different places over many centuries, different schools and different ways of practicing developed. Buddhist practice in one country is not identical to Buddhist practice in another, and adherents in both are Buddhists.',
        'Now answer question three: where is it widely practiced today? Parts of South, Southeast and East Asia. Note that this is a different list from the hearth, and that is the whole point.',
        'One last thing worth saying plainly. A religion can spread far from its hearth while most people living in the hearth region today follow other traditions. Hinduism is the tradition of most people in India today, and India is also home to many Muslims, Christians, Sikhs, Buddhists, Jains, people of other religions and people of none.',
      ],
      answer:
        'Buddhism is a universalizing religion. It began in South Asia, and adherents carried its teachings along overland and sea trade routes into Central, East and Southeast Asia, where it took root and developed different schools. Where a religion began and where it is widely practiced today are two separate questions with two different answers.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-hearth-is-not-a-boundary',
      kind: 'worked_example',
      problem:
        'A student writes: "Islam is the religion of the Arabian Peninsula, and Hinduism is the religion of India." Sort out what is right in that sentence and what is wrong.',
      steps: [
        'Grant what is right first, because there is something right in it. Islam did begin on the Arabian Peninsula. Hinduism did develop in South Asia. Naming a hearth is good geography, and the student has the hearths in the correct regions.',
        'Now find the error. The student has turned a hearth into a boundary. A hearth tells you where a tradition STARTED. It does not tell you where its adherents live now, and it does not hand ownership of a religion to one country.',
        'Test it on Islam. Islam is a universalizing religion, and it diffused far from its hearth: it is widely practiced across Southwest Asia and North Africa, in much of West Africa and Central Asia, and in South and Southeast Asia. Muslims live on every inhabited continent and speak many different first languages.',
        'Test it on Hinduism. Hinduism spread mainly the other way, through migration, so Hindu communities are found where families from South Asia settled -- Nepal, Mauritius, Fiji, parts of the Caribbean, the United Kingdom, Canada and the United States, among others. That is a wide spread produced by families moving, not by seeking new members.',
        'Then turn the sentence around and check it from the other side. India is home to Hindus, Muslims, Christians, Sikhs, Buddhists, Jains, people of other traditions and people of none. Naming one religion as the religion OF a country erases everybody else who lives there.',
        'WRONG way to say it: "Islam is the religion of the Arabian Peninsula." CORRECT way to say it: "The hearth of Islam is the Arabian Peninsula, and Islam is widely practiced across many regions today."',
      ],
      answer:
        'The hearths are correct, but a hearth is not a boundary and a country is not a religion. Islam began on the Arabian Peninsula and is widely practiced far beyond it; Hinduism developed in South Asia and is practiced by communities in many countries; and every country, India included, is home to people of several religions and to people of none.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hearth-region',
      kind: 'try_yourself',
      problem:
        'Buddhism began with the teachings of Siddhartha Gautama and later spread along trade routes, so that today it is widely practiced in parts of East and Southeast Asia. In which region did Buddhism begin?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'East Asia, because that is where many Buddhists live today' },
        { id: 'b', text: 'Southwest Asia, because every major religion began there' },
        { id: 'c', text: 'Southeast Asia, because Buddhist temples are found there today' },
        { id: 'd', text: 'South Asia', correct: true }
      ],
      expectedAnswer: 'South Asia',
      hints: [
        'The question tells you where Buddhism is widely practiced today. That is a different question from where it began.',
        'Siddhartha Gautama taught in the area of present day Nepal and northern India. Which world region is that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-universalizing-or-ethnic',
      kind: 'try_yourself',
      problem:
        'A religion teaches a message that its adherents understand as meant for all people, and members have carried it far from the region where it began, so that adherents now live on several continents. How would a geographer describe this religion, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An ethnic religion, because it started in one particular region' },
        { id: 'b', text: 'An ethnic religion, because its adherents now live in many different countries' },
        { id: 'c', text: 'A universalizing religion, because it seeks adherents everywhere and so has spread widely', correct: true },
        { id: 'd', text: 'A universalizing religion, because everyone in the region where it began follows it' }
      ],
      expectedAnswer: 'A universalizing religion, because it seeks adherents everywhere and so has spread widely',
      hints: [
        'Every religion started in one particular region, so having a hearth cannot by itself decide the label.',
        'The label describes HOW a religion spreads: does it share its message with everyone, or does it move mainly when families migrate?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-internal-diversity',
      kind: 'try_yourself',
      problem:
        'Two families in different countries both say they follow the same religion. When they describe their holidays, the language used at their services and the customs in their homes, the details are not the same. What is the best explanation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two families must actually follow two different religions' },
        { id: 'b', text: 'Every religion includes many branches and communities, and adherents do not all practice in identical ways', correct: true },
        { id: 'c', text: 'A religion never changes once it begins, so one family must be remembering it wrong' },
        { id: 'd', text: 'A religion belongs to the country where it began, so only one family really follows it' }
      ],
      expectedAnswer: 'Every religion includes many branches and communities, and adherents do not all practice in identical ways',
      hints: [
        'Think about how far a tradition travels and how long it has existed. What happens to a tradition carried to many places over many centuries?',
        'Check whether a choice treats a religion as one single unchanging thing. That assumption is the mistake this question is about.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-country-one-religion',
      kind: 'misconception_check',
      question:
        'A student writes: "Each country has its own religion, so if you know where somebody lives, you know what they believe." What needs correcting?',
      commonErrors: [
        {
          answer: 'Each country has its own religion, so knowing where somebody lives tells you what they believe.',
          misconception:
            'Treating a country as a single block of people who all believe the same thing, because a country is often labeled with whichever religion is most common there.',
          correctsTo:
            'Almost every country on Earth is home to people of several religions and to people of no religion. WRONG: "People in that country are all X." CORRECT: "X is the most common religion in that country, and people there also follow several other religions or none." And the diversity does not stop at the country line. Within any one tradition there are many branches and many ways of practicing, so two adherents of the same religion may keep different holidays and different customs. Knowing where a person lives never tells you what that person believes.',
        },
        {
          answer: 'An ethnic religion must be a religion that only one ethnic group is allowed to practice.',
          misconception:
            'Reading the word ethnic as a rule about who is permitted to join, rather than as a label geographers use for how a religion spreads.',
          correctsTo:
            'Ethnic religion is a description of DIFFUSION. It means a religion closely tied to one particular people and place, which usually does not send out missionaries and so spreads mainly when families migrate and carry their traditions with them. It is not a fence. People can and do join these traditions. Compare it with a universalizing religion, which actively shares its message with everyone and therefore turns up far from its hearth. The pair tells you how a religion travels, and nothing at all about whether a religion is good, true or better than another.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Geographers ask three questions about a religion: where it began (its hearth), how it spread (diffusion), and where it is widely practiced today. Whether a religion is true is not a geography question, and religions are never ranked against each other.',
        'Universalizing religions share their message with everyone and so spread far from the hearth: Christianity, Islam and Buddhism.',
        'Ethnic religions are closely tied to a particular people and place and spread mainly through migration: Judaism and Hinduism. Ethnic describes how a religion travels, not who is allowed to join.',
        'The hearths: Christianity and Judaism in the eastern Mediterranean region of Southwest Asia, Islam on the Arabian Peninsula, Hinduism and Buddhism in South Asia.',
        'A hearth is not a boundary. Where a religion began and where it is practiced today are two separate questions.',
        'Every tradition holds many branches and many ways of practicing, there are many religions beyond these five, many people follow none, and almost every country is home to people of several religions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Major World Religions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
