/**
 * Grade 7 World Geography — Culture: Language Families & Diffusion.
 *
 * Concept-led row 4.2 (National Geography Standard 10). Teaches ONE idea and
 * its consequences: a language family is a group of languages descended from
 * a common ancestor language, and relatedness is shown by SYSTEMATIC
 * similarities, not by single words that happen to sound alike. Then how
 * languages spread -- migration, trade, administration -- and what a lingua
 * franca is.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters: language is tied up with
 * identity and politics. This file names only family memberships that are
 * long settled and uncontroversial in linguistics. It states NO speaker
 * counts and ranks NO language by number of speakers. It describes NO group
 * of people by any trait. It takes NO side in any dispute over what counts as
 * a separate language. Every family claim below was checked one at a time:
 *   Indo-European -- English, Spanish, Hindi, Russian, Persian, German,
 *     Italian, French
 *   Sino-Tibetan  -- Mandarin
 *   Afro-Asiatic  -- Arabic, Hebrew
 *   Niger-Congo   -- Swahili, Yoruba
 *   Austronesian  -- Indonesian, Tagalog
 * If you extend this file, add only memberships you can verify to the same
 * standard, and drop anything you are unsure about.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U4_LANGUAGE_FAMILIES_AND_DIFFUSION: LessonPlan = {
  id: 'evelyn.ms.m7geo.language-families-and-diffusion.v1',
  title: 'Language Families & Diffusion',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.language-families-and-diffusion',
      standard: 'M7GEO-4.2',
      description:
        'Explain what a language family is, tell the difference between languages that are related and languages that have merely borrowed words from each other, and describe how languages spread through migration, trade and administration, including the role of a lingua franca (National Geography Standard 10: the characteristics, distribution and complexity of Earth cultural mosaics).',
    },
  ],
  prerequisites: ['m7geo.what-culture-is'],
  followUps: ['m7geo.world-religions'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice a family resemblance between words before any technical vocabulary arrives.',
      script:
        'Here is the word for night in five languages. English says night. German says Nacht. Spanish says noche. Italian says notte. Russian says noch. Say them out loud, one after another. They are not the same word, but they are clearly not strangers either -- there is an n at the front and a hard sound in the middle of every one. That is not luck, and it is not copying. Those five languages are relatives, the way cousins are relatives, and geographers and linguists can trace the family they all came from. Today we work out how anyone can tell.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-language-families',
      kind: 'concept',
      goal: 'Install language family, cognate, the systematic-pattern test, diffusion and lingua franca, plus the two traps.',
      keyIdeas: [
        'A LANGUAGE FAMILY IS A GROUP OF LANGUAGES DESCENDED FROM ONE ANCESTOR LANGUAGE. Long ago people speaking one language spread out. Groups lost touch. Each group kept changing the way it spoke, a little at a time, until the groups could no longer understand each other. Those separated versions became separate languages -- and they are all in one family, the way branches belong to one tree.',
        'RELATED LANGUAGES SHARE COGNATES. A cognate is a word in two languages that came down from the same ancestor word. English night, German Nacht, Spanish noche, Italian notte and Russian noch are cognates. So are English mother, Spanish madre, Russian mat, Hindi mata and Persian madar. All of those languages sit in the INDO-EUROPEAN family, which is why the same shapes keep showing up.',
        'THE TEST IS A SYSTEMATIC PATTERN, NOT ONE WORD. Two languages count as related when the matches run through the everyday core of the vocabulary -- numbers, family members, body parts, night and day -- and when the sounds line up the same way again and again, and when the grammar is built along the same lines. One matching word proves nothing at all. Hundreds of matching words that shift in the same regular way prove a great deal.',
        'THERE ARE MANY FAMILIES, AND NO FAMILY IS BETTER THAN ANOTHER. Indo-European includes English, Spanish, Hindi, Russian and Persian. Sino-Tibetan includes Mandarin. Afro-Asiatic includes Arabic and Hebrew. Niger-Congo includes Swahili and Yoruba. Austronesian includes Indonesian and Tagalog. A family is a family tree, not a scoreboard. Every one of these languages does the full job of a language: it can express anything its speakers need to say.',
        'LANGUAGES SPREAD, AND THEY KEEP CHANGING. A language moves when its speakers move, when traders carry it along a route, and when a government or a school system runs on it. That is diffusion. Spanish and Portuguese reached the Americas that way, carried by people crossing an ocean. And a language never stops changing once it arrives: the English spoken today is not the English of a thousand years ago, and it is not identical from one region to the next.',
        'A LINGUA FRANCA IS A SHARED LANGUAGE BETWEEN GROUPS WITH DIFFERENT FIRST LANGUAGES. Pilots and air traffic controllers around the world use English to talk to each other, even when it is the first language of neither. Swahili is used the same way across parts of East Africa. A lingua franca is a bridge people pick up in addition to the language of home -- it does not replace it, and using one says nothing about who anybody is.',
      ],
      vocabulary: [
        { term: 'language family', definition: 'a group of languages that all descended from one earlier ancestor language.' },
        { term: 'cognate', definition: 'a word in two languages that came down from the same ancestor word, such as English night and Spanish noche.' },
        { term: 'diffusion', definition: 'the spread of something cultural, such as a language, from one place or group to another.' },
        { term: 'lingua franca', definition: 'a language used to communicate between groups who have different first languages.' },
        { term: 'dialect', definition: 'a regional or social variety of a language, with its own words, sounds or grammar.' },
        { term: 'multilingual', definition: 'using or containing more than one language.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-related-or-borrowed',
      kind: 'worked_example',
      problem:
        'Two pairs of languages are described below. Decide which pair is RELATED, which pair only BORROWED, and say how you can tell.\n\nPair 1 -- Spanish and Hindi. The Spanish word for mother is madre. The Hindi word for mother is mata. Spanish for three is tres; Hindi for three is teen. Spanish for two is dos; Hindi for two is do.\n\nPair 2 -- Arabic and Swahili. Swahili uses a large number of words that came from Arabic, most of them for things that traveled along trading routes: goods, tools, and ideas that arrived with traders.',
      steps: [
        'Start with Pair 1 and look at WHICH words match. Mother, two, three. Those are core, everyday words -- the words a small child learns first. Languages almost never swap out words like these by borrowing.',
        'Check whether the matching is a pattern rather than an accident. It is not one word. It repeats across a family word and across two different numbers, and the shapes shift in a regular way. That is the systematic pattern the concept asked for.',
        'Conclusion for Pair 1: Spanish and Hindi are RELATED. Both are in the Indo-European family. They are distant cousins, which is why the words are similar without being identical.',
        'Now Pair 2, and look at which words match here. The shared words are goods, tools and ideas -- exactly the things that move along a trade route. The core everyday vocabulary of Swahili did not come from Arabic, and neither did its grammar.',
        'Conclusion for Pair 2: Swahili BORROWED from Arabic. Borrowing is completely normal and it happens wherever people meet, but it is not descent. Swahili belongs to the Niger-Congo family and Arabic belongs to the Afro-Asiatic family. They are neighbors in history, not branches of one tree.',
        'WRONG way to decide: "These two languages share words, so they must be in the same family." CORRECT way: "Which words do they share, and does the sharing run through the core vocabulary and the grammar in a regular pattern?"',
      ],
      answer:
        'Pair 1 is related: Spanish and Hindi are both Indo-European, and the matches sit in core vocabulary -- mother, two, three -- in a repeating pattern. Pair 2 is borrowing: Swahili took many words from Arabic through trade contact, but Swahili is Niger-Congo and Arabic is Afro-Asiatic, and the core vocabulary and grammar of Swahili did not come from Arabic.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-how-a-language-spreads',
      kind: 'worked_example',
      problem:
        'Name the way each language spread in the three cases below -- migration, trade, or administration and schooling -- and then say which case describes a lingua franca.\n\nCase A: Families cross an ocean and settle a new region. Their children grow up speaking the language the families brought with them.\n\nCase B: Merchants sail the same coast for centuries. Along that coast, people who speak different first languages come to share one language for doing business.\n\nCase C: A country runs its courts, its offices and its schools in one particular language. Over time nearly everyone who goes to school there can use that language, whatever they speak at home.',
      steps: [
        'Case A. The language moves because the SPEAKERS move and stay. That is diffusion by migration. This is how Spanish and Portuguese came to be widely spoken across the Americas.',
        'Case B. Nobody has to move permanently. Contact along a route is enough, and the language spreads by TRADE.',
        'Case C. The language spreads because official life runs on it: government offices, courts and schools. That is diffusion by administration and schooling.',
        'Now the second question. A lingua franca is a shared language between groups whose first languages differ. Case B says exactly that: people with different first languages come to share one language for business.',
        'Check Case A and Case C against the definition before finishing. In Case A the settlers already share a first language, so there are not two groups bridging a gap. Case C is close, and a language of administration often BECOMES a lingua franca -- but as written, Case C is about official use, while Case B is about people who could not otherwise understand each other.',
        'One last thing worth saying out loud: in every one of these cases, the languages people already spoke did not vanish. Adding a language is far more common than swapping one out, which is why most countries have several languages in use inside their borders.',
      ],
      answer:
        'Case A spread by migration, Case B by trade, and Case C by administration and schooling. Case B is the clearest description of a lingua franca, because it names groups with different first languages sharing one language in order to communicate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-same-family',
      kind: 'try_yourself',
      problem:
        'Which pair of languages belongs to the SAME language family, and gives the right reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Arabic and Swahili, because Swahili uses many words that came from Arabic' },
        { id: 'b', text: 'English and Japanese, because English uses words such as karaoke and sushi' },
        { id: 'c', text: 'Spanish and Tagalog, because Tagalog uses many words that came from Spanish' },
        { id: 'd', text: 'English and Spanish, because both descended from the ancestor language of the Indo-European family', correct: true }
      ],
      expectedAnswer: 'English and Spanish, because both descended from the ancestor language of the Indo-European family',
      hints: [
        'Read the REASON in each choice, not just the two language names. Only one reason talks about descent from a shared ancestor.',
        'Three of these reasons describe borrowed words. Borrowing happens whenever people meet, and it never puts two languages in the same family.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lingua-franca',
      kind: 'try_yourself',
      problem:
        'A pilot from one country is talking to an air traffic controller in another country. Neither of them grew up speaking English at home, but they use English so they can understand each other. Which term best describes how English is being used here?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A lingua franca, because it is a shared language between people with different first languages', correct: true },
        { id: 'b', text: 'A cognate, because the two people are using matching words' },
        { id: 'c', text: 'A dialect, because it is a regional variety of the languages they speak at home' },
        { id: 'd', text: 'A language family, because two languages are involved' }
      ],
      expectedAnswer: 'A lingua franca, because it is a shared language between people with different first languages',
      hints: [
        'Go back to the definitions one at a time. A cognate is a WORD. A dialect is a variety of ONE language. A language family is a group of related languages.',
        'The key detail in the case is that their first languages are different and they still need to understand each other. Which term is built out of exactly that situation?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-country-one-language',
      kind: 'try_yourself',
      problem:
        'A student writes: "Each country has one language, and that is the language everybody there speaks." Which statement corrects this best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Most countries have several languages spoken inside their borders, even when one or two are used for government and schools', correct: true },
        { id: 'b', text: 'Only very large countries have more than one language spoken inside them' },
        { id: 'c', text: 'A country has one real language, and every other way of speaking there is a simpler version of it' },
        { id: 'd', text: 'The language of a country is decided by which continent the country sits on' }
      ],
      expectedAnswer: 'Most countries have several languages spoken inside their borders, even when one or two are used for government and schools',
      hints: [
        'A language used in government offices and schools is not the only language people use. Think about what families speak at home.',
        'Check each choice for a hidden ranking. Calling one way of speaking simpler than another is not a description, and no language is a simpler version of any other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sounds-alike',
      kind: 'misconception_check',
      question:
        'A student notices that a word in two languages sounds almost the same and concludes that the two languages must be in the same family. Where does that reasoning break down, and what would settle the question instead?',
      commonErrors: [
        {
          answer: 'These two languages have a word that sounds the same, so they are related.',
          misconception:
            'Treating a single matching word as proof of descent. Words travel between unrelated languages constantly through trade, food, technology and everyday contact, and a few pairs also match by pure coincidence.',
          correctsTo:
            'WRONG: "One word matches, so the languages are related." CORRECT: "Relatedness is shown by a systematic pattern." Ask three questions instead. First, WHICH words match -- core everyday words such as numbers, mother and night, or words for traded goods and new technology? Borrowed words cluster in the second group. Second, does the matching repeat, with the same sounds shifting the same way across hundreds of words? Third, is the grammar built along the same lines? Swahili holds many words that came from Arabic through trade, and the two languages still sit in different families, Niger-Congo and Afro-Asiatic, because the core vocabulary and the grammar of Swahili did not come from Arabic.',
        },
        {
          answer: 'The way people speak in that region is just a bad version of the real language.',
          misconception:
            'Hearing a dialect as an error rather than as a variety, usually because one variety is the one used in schoolbooks and official documents.',
          correctsTo:
            'A dialect is a regional or social variety of a language, with its own words, sounds and grammar rules -- and it follows those rules consistently, which is exactly what makes it a variety rather than a mistake. Everybody speaks some dialect, including the people who write the schoolbooks. The line between a dialect and a separate language is often drawn for social and political reasons rather than linguistic ones, which is why two varieties whose speakers understand each other fairly well are sometimes called separate languages, while two that are hard to understand across are sometimes called one language. No variety is simpler, lesser, or less developed than any other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A language family is a group of languages descended from one ancestor language. Indo-European, Sino-Tibetan, Afro-Asiatic, Niger-Congo and Austronesian are five of them.',
        'Cognates are words that came down from the same ancestor word: English night, Spanish noche, Russian noch.',
        'One matching word proves nothing. Relatedness is shown by a systematic pattern across core vocabulary and grammar. Borrowing is not descent.',
        'Languages spread by migration, by trade, and by administration and schooling -- and they keep changing after they arrive.',
        'A lingua franca is a shared language between groups with different first languages. It is added to the language of home, not swapped in for it.',
        'Most countries are multilingual, and no language or dialect is simpler, better, or more developed than another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Language Families & Diffusion' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
