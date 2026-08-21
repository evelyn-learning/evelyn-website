/**
 * Grade 7 ELA — Vocabulary: Commonly Confused Words.
 *
 * Procedure-led (CCSS L.7.4, with the spelling half touching L.7.2). The
 * lesson is the TESTS, not the list: the long-form test for it's / you're /
 * they're / who's, the place-or-person test for there / their / they're,
 * "thAn compAres, thEn is timE", and "Affect is the Action, Effect is the
 * End result". Only five families are taught, each with a test a student can
 * actually run mid-sentence.
 *
 * NOTE FOR FUTURE AUTHORS: every incorrect example in this file is labeled
 * WRONG, with the CORRECT version beside it. A tutor reads these aloud, and
 * this row has more wrong sentences in it than any other in the course. Never
 * write a broken example bare. Also: affect and effect both have rarer senses
 * (effect as a verb meaning to bring about, affect as a psychology noun).
 * Those are deliberately NOT taught here, and no item is worded in a way that
 * would let the rare sense rescue a distractor.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U7_COMMONLY_CONFUSED_WORDS: LessonPlan = {
  id: 'evelyn.ms.m7ela.commonly-confused-words.v1',
  title: 'Commonly Confused Words',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.commonly-confused-words',
      standard: 'M7ELA-7.4',
      description:
        'Choose correctly between words that sound alike but mean different things — its/it\'s, your/you\'re, there/their/they\'re, whose/who\'s, then/than, affect/effect — by running a quick meaning or part-of-speech test instead of guessing from sound, and spell the chosen word correctly (CCSS L.7.4; the spelling half also serves L.7.2).',
    },
  ],
  prerequisites: ['m7ela.connotation-and-denotation'],
  followUps: ['m7ela.claims-and-reasons'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that these errors survive spellcheck, and that a two-second test kills them.',
      script:
        'You type a message to the group chat: WRONG: "Your going to love this game." Nothing turns red. No squiggly line. The phone thinks you are fine, and you are not. Here is why. The word "your" is spelled perfectly. It is just the wrong word. CORRECT: "You\'re going to love this game." That is the whole problem with today\'s words. They sound the same out loud, they are all spelled correctly, and the computer cannot help you, because every single one of them is a real word. So we are not going to memorize a list. We are going to learn about five tests you can run inside your own head, in about two seconds, right in the middle of writing a sentence.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-tests',
      kind: 'concept',
      goal: 'Install five runnable tests, and state the its/it\'s apostrophe exception plainly.',
      keyIdeas: [
        'THESE ARE NOT SPELLING MISTAKES. Every word in this lesson is spelled correctly. "Their" and "there" are both real words, and so are "its" and "it\'s". Picking the wrong one is a word-choice mistake, which means spellcheck will never flag it and your ear will never hear it. Only a test catches it.',
        'TEST 1 — THE LONG-FORM TEST. An apostrophe in these words means two words have been squeezed into one. It\'s = it is. You\'re = you are. They\'re = they are. Who\'s = who is. So read the sentence out with the two long words put back in. If it still makes sense, the apostrophe word is right. "It\'s raining" unpacks to "It is raining," which works. WRONG: "The dog wagged it\'s tail." Unpack it and you get "the dog wagged it is tail," which is nonsense. CORRECT: "The dog wagged its tail."',
        'TEST 1 HAS A TWIN THAT SURPRISES PEOPLE. Its, your, their, whose and ours are the possessive ones, and NOT ONE of them takes an apostrophe. Yes, an apostrophe usually shows possession, but only for regular nouns: my sister\'s hoodie, the team\'s bus. Pronouns are a real exception, and it is worth saying out loud: for the word "it", the possessive is the one WITHOUT the apostrophe. WRONG: "Whose hoodie is this? Its my brothers." CORRECT: "Whose hoodie is this? It\'s my brother\'s."',
        'TEST 2 — PLACE, PEOPLE, OR TWO WORDS. There / their / they\'re is three words, so run three quick questions. First try "they are"; if that works, write they\'re. If not, ask whether you could point at a spot, because THERE has HERE hiding inside it and both are places. If it is neither, it belongs to somebody, so write their. WRONG: "Their standing over they\'re with there skateboards." CORRECT: "They\'re standing over there with their skateboards."',
        'TEST 3 — THAN COMPARES, THEN IS TIME. Ask what the sentence is doing. If two things are being measured against each other, you need than: thAn compAres. If the sentence is telling you what happened next, you need then: thEn is timE. WRONG: "My slice was bigger then his, and than he ate it." CORRECT: "My slice was bigger than his, and then he ate it."',
        'TEST 4 — AFFECT IS THE ACTION, EFFECT IS THE END RESULT. Affect is almost always the verb, the thing that happens to something. Effect is almost always the noun, the result you end up with. The fast check is to try putting "the" in front of the blank: if "the ___" sounds natural, you need the noun, effect. WRONG: "The rain effected our game, and we felt the affect all week." CORRECT: "The rain affected our game, and we felt the effect all week."',
      ],
      vocabulary: [
        { term: 'contraction', definition: 'one word made by squeezing two words together, with an apostrophe standing in for the missing letters, as in it is becoming it\'s.' },
        { term: 'possessive', definition: 'the form of a word that shows something belongs to someone, such as its, their, your and whose.' },
        { term: 'homophone', definition: 'a word that sounds exactly like another word but is spelled differently and means something different, such as there and their.' },
        { term: 'verb', definition: 'a word for what someone or something does, such as affected in "the rain affected our game".' },
        { term: 'noun', definition: 'a word for a person, place or thing, such as effect in "we felt the effect".' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-its-vs-it-is',
      kind: 'worked_example',
      problem:
        'Fix both mistakes. WRONG: "Our robot lost it\'s back wheel in the first round, and now its stuck in the repair box."',
      steps: [
        'There are two slots to check, so check them one at a time. Never judge the whole sentence at once.',
        'Slot one is "lost it\'s back wheel". Run the long-form test: put "it is" back in and read it. "Our robot lost it is back wheel." That is nonsense, so the apostrophe word is wrong here.',
        'Ask what the sentence actually means instead. The wheel belongs to the robot, so this slot needs the possessive, and the possessive of "it" is the one with no apostrophe. Slot one should be "its back wheel".',
        'Slot two is "now its stuck". Run the same test: "now it is stuck." That reads perfectly, so this slot really does need the two-word version squeezed together. Slot two should be "it\'s stuck".',
        'Notice that the two errors are mirror images. The writer used the apostrophe exactly where it did not belong and left it out exactly where it did. That is normal, and it is why you test each slot instead of trusting the look of the word.',
        'CORRECT: "Our robot lost its back wheel in the first round, and now it\'s stuck in the repair box."',
      ],
      answer:
        'Our robot lost its back wheel in the first round, and now it\'s stuck in the repair box. (Slot one is possessive, so no apostrophe. Slot two unpacks to "it is", so it takes one.)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-affect-effect',
      kind: 'worked_example',
      problem:
        'Choose the right word for each blank. "A late bus can ___ the whole team, and you can see the ___ in the first five minutes of the game."',
      steps: [
        'Look at what sits right before blank one: the word "can". A helping word like can, will or did is always followed by the action word, the verb.',
        'Affect is the verb, so blank one is "affect". Check it by swapping in a plain word that means the same thing: "A late bus can change the whole team." That fits, and "change" is an action, which confirms you need the verb.',
        'Now look at what sits right before blank two: the word "the". Put "the" in front of a word and you are almost always naming a thing, which means a noun.',
        'Effect is the noun, so blank two is "effect". Check it the same way: "you can see the result in the first five minutes." That fits, and a result is a thing, not an action.',
        'One more pass for the memory hook. Affect is the Action. Effect is the End result. Both hooks start with the same letter as the word they belong to, which is the whole point of them.',
        'CORRECT: "A late bus can affect the whole team, and you can see the effect in the first five minutes of the game."',
      ],
      answer:
        'affect in the first blank, effect in the second. After a helping word like "can" you need the verb affect; after "the" you need the noun effect.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-its-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Our cat knocked over it\'s water bowl, and now its soaking into the rug.' },
        { id: 'b', text: 'Our cat knocked over its water bowl, and now it\'s soaking into the rug.', correct: true },
        { id: 'c', text: 'Our cat knocked over it\'s water bowl, and now it\'s soaking into the rug.' },
        { id: 'd', text: 'Our cat knocked over its water bowl, and now its soaking into the rug.' },
      ],
      expectedAnswer: 'Our cat knocked over its water bowl, and now it\'s soaking into the rug.',
      hints: [
        'Test the two slots separately. Read each one with "it is" put back in and see which one still makes sense.',
        '"The cat knocked over it is water bowl" is nonsense, so that slot needs the possessive with no apostrophe. "Now it is soaking into the rug" works fine, so that slot needs the apostrophe.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-their-blank',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The twins left ___ jerseys on the bus, so Coach drove back to the school to get them."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'they\'re' },
        { id: 'b', text: 'their', correct: true },
        { id: 'c', text: 'there' },
        { id: 'd', text: 'theirs' },
      ],
      expectedAnswer: 'their',
      hints: [
        'Run the three questions in order. Does "they are" fit in the blank? Could you point at the blank like a place?',
        '"The twins left they are jerseys" does not work, and the blank is not a spot you could point at. The jerseys belong to the twins.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mixed-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Your free throws look better than they did in June, and you can see the affect of all that practice.' },
        { id: 'b', text: 'You\'re free throws look better than they did in June, and you can see the effect of all that practice.' },
        { id: 'c', text: 'Your free throws look better than they did in June, and you can see the effect of all that practice.', correct: true },
        { id: 'd', text: 'Your free throws look better then they did in June, and you can see the effect of all that practice.' },
      ],
      expectedAnswer: 'Your free throws look better than they did in June, and you can see the effect of all that practice.',
      hints: [
        'There are three slots to check: the word before "free throws", the word after "better", and the word after "the".',
        'The free throws belong to you, so that slot is possessive. "Better ___ they did in June" is comparing two times, and "the ___" needs a naming word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-apostrophe-means-owns',
      kind: 'misconception_check',
      question:
        'A student writes "The team celebrated it\'s first win of the season." and defends it: "An apostrophe shows that something belongs to somebody, and the win belongs to the team. Anyway, spellcheck did not flag it, so it must be fine." What went wrong?',
      commonErrors: [
        {
          answer: 'it\'s is correct, because the apostrophe shows the win belongs to the team',
          misconception:
            'Taking the apostrophe-shows-possession rule, which is true for ordinary nouns, and stretching it onto the pronoun "it".',
          correctsTo:
            'Run the long-form test first. "The team celebrated it is first win" is nonsense, so the apostrophe word is not the one you want. Here is the part worth saying plainly: for the word "it", the possessive is the one WITHOUT the apostrophe. WRONG: "The team celebrated it\'s first win of the season." CORRECT: "The team celebrated its first win of the season." The original rule is still true for nouns, and you can see both at once in "The team\'s first win was its best game all year." The noun team takes the apostrophe; the pronoun its does not. Your, their, whose and ours work the same way.',
        },
        {
          answer: 'it does not matter much, because spellcheck would have caught a real mistake',
          misconception:
            'Believing this is a spelling error. It is not, so the student trusts a tool that is not looking for this at all.',
          correctsTo:
            'Nothing in that sentence is misspelled. Spellcheck compares your words against a dictionary, and "its" and "it\'s" are both in the dictionary, so both come back clean. The same is true of every pair in this lesson: there, their, they\'re, then, than, affect and effect are all real words. A tool that checks spelling cannot catch a mistake about meaning. The test in your head is the only thing that catches it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'These are word-choice mistakes, not spelling mistakes, so spellcheck will never flag them. Every option is a real word.',
        'The long-form test: it\'s = it is, you\'re = you are, they\'re = they are, who\'s = who is. Put the two words back in and read it.',
        'Its, your, their and whose are the possessive ones and take NO apostrophe. For the word "it", the possessive is the one without the apostrophe.',
        'There has here inside it, so it is a place. Their belongs to people. They\'re unpacks to they are.',
        'ThAn compAres; thEn is timE. WRONG: "bigger then his." CORRECT: "bigger than his."',
        'Affect is the Action, so it is the verb. Effect is the End result, so it is the noun. If "the ___" sounds right, you need effect.',
        'The same move works on other lookalikes you will meet, such as lose and loose: say what you mean in plain words first, then pick the word that carries that meaning.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Commonly Confused Words' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
