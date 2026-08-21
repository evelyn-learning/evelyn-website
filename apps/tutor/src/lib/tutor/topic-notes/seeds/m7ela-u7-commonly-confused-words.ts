/**
 * Grade 7 English Language Arts — Unit 7 CED 7.4: Commonly Confused Words.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.commonly-confused-words.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U7_COMMONLY_CONFUSED_WORDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.commonly-confused-words.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Commonly Confused Words',
  planId: 'evelyn.ms.m7ela.commonly-confused-words.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.commonly-confused-words.v1' }],
  theory: [
    { loId: 'm7ela.commonly-confused-words', content: `THESE ARE NOT SPELLING MISTAKES. Every word in this lesson is spelled correctly. "Their" and "there" are both real words, and so are "its" and "it's". Picking the wrong one is a word-choice mistake, which means spellcheck will never flag it and your ear will never hear it. Only a test catches it.` },
    { loId: 'm7ela.commonly-confused-words', kind: 'framework', title: 'Test 1', content: `TEST 1 — THE LONG-FORM TEST. An apostrophe in these words means two words have been squeezed into one. It's = it is. You're = you are. They're = they are. Who's = who is. So read the sentence out with the two long words put back in. If it still makes sense, the apostrophe word is right. "It's raining" unpacks to "It is raining," which works. WRONG: "The dog wagged it's tail." Unpack it and you get "the dog wagged it is tail," which is nonsense. CORRECT: "The dog wagged its tail."` },
    { loId: 'm7ela.commonly-confused-words', content: `TEST 1 HAS A TWIN THAT SURPRISES PEOPLE. Its, your, their, whose and ours are the possessive ones, and NOT ONE of them takes an apostrophe. Yes, an apostrophe usually shows possession, but only for regular nouns: my sister's hoodie, the team's bus. Pronouns are a real exception, and it is worth saying out loud: for the word "it", the possessive is the one WITHOUT the apostrophe. WRONG: "Whose hoodie is this? Its my brothers." CORRECT: "Whose hoodie is this? It's my brother's."` },
    { loId: 'm7ela.commonly-confused-words', kind: 'framework', title: 'Test 2', content: `TEST 2 — PLACE, PEOPLE, OR TWO WORDS. There / their / they're is three words, so run three quick questions. First try "they are"; if that works, write they're. If not, ask whether you could point at a spot, because THERE has HERE hiding inside it and both are places. If it is neither, it belongs to somebody, so write their. WRONG: "Their standing over they're with there skateboards." CORRECT: "They're standing over there with their skateboards."` },
    { loId: 'm7ela.commonly-confused-words', kind: 'framework', title: 'Test 3', content: `TEST 3 — THAN COMPARES, THEN IS TIME. Ask what the sentence is doing. If two things are being measured against each other, you need than: thAn compAres. If the sentence is telling you what happened next, you need then: thEn is timE. WRONG: "My slice was bigger then his, and than he ate it." CORRECT: "My slice was bigger than his, and then he ate it."` },
    { loId: 'm7ela.commonly-confused-words', kind: 'framework', title: 'Test 4', content: `TEST 4 — AFFECT IS THE ACTION, EFFECT IS THE END RESULT. Affect is almost always the verb, the thing that happens to something. Effect is almost always the noun, the result you end up with. The fast check is to try putting "the" in front of the blank: if "the ___" sounds natural, you need the noun, effect. WRONG: "The rain effected our game, and we felt the affect all week." CORRECT: "The rain affected our game, and we felt the effect all week."` },
    { loId: 'm7ela.commonly-confused-words', kind: 'definition', title: 'contraction', content: `one word made by squeezing two words together, with an apostrophe standing in for the missing letters, as in it is becoming it's.` },
    { loId: 'm7ela.commonly-confused-words', kind: 'definition', title: 'possessive', content: `the form of a word that shows something belongs to someone, such as its, their, your and whose.` },
    { loId: 'm7ela.commonly-confused-words', kind: 'definition', title: 'homophone', content: `a word that sounds exactly like another word but is spelled differently and means something different, such as there and their.` },
    { loId: 'm7ela.commonly-confused-words', kind: 'definition', title: 'verb', content: `a word for what someone or something does, such as affected in "the rain affected our game".` },
    { loId: 'm7ela.commonly-confused-words', kind: 'definition', title: 'noun', content: 'a word for a person, place or thing, such as effect in "we felt the effect".' },
  ],
  methods: [
    {
      title: 'Worked its vs it is',
      steps: [
        `There are two slots to check, so check them one at a time. Never judge the whole sentence at once.`,
        `Slot one is "lost it's back wheel". Run the long-form test: put "it is" back in and read it. "Our robot lost it is back wheel." That is nonsense, so the apostrophe word is wrong here.`,
        `Ask what the sentence actually means instead. The wheel belongs to the robot, so this slot needs the possessive, and the possessive of "it" is the one with no apostrophe. Slot one should be "its back wheel".`,
        `Slot two is "now its stuck". Run the same test: "now it is stuck." That reads perfectly, so this slot really does need the two-word version squeezed together. Slot two should be "it's stuck".`,
        `Notice that the two errors are mirror images. The writer used the apostrophe exactly where it did not belong and left it out exactly where it did. That is normal, and it is why you test each slot instead of trusting the look of the word.`,
        `CORRECT: "Our robot lost its back wheel in the first round, and now it's stuck in the repair box."`,
      ],
      example: { problem: `Fix both mistakes. WRONG: "Our robot lost it's back wheel in the first round, and now its stuck in the repair box."`, solution: `Our robot lost its back wheel in the first round, and now it's stuck in the repair box. (Slot one is possessive, so no apostrophe. Slot two unpacks to "it is", so it takes one.)` },
      relatedLoIds: ['m7ela.commonly-confused-words'],
    },
    {
      title: 'Worked affect effect',
      steps: [
        `Look at what sits right before blank one: the word "can". A helping word like can, will or did is always followed by the action word, the verb.`,
        `Affect is the verb, so blank one is "affect". Check it by swapping in a plain word that means the same thing: "A late bus can change the whole team." That fits, and "change" is an action, which confirms you need the verb.`,
        `Now look at what sits right before blank two: the word "the". Put "the" in front of a word and you are almost always naming a thing, which means a noun.`,
        `Effect is the noun, so blank two is "effect". Check it the same way: "you can see the result in the first five minutes." That fits, and a result is a thing, not an action.`,
        `One more pass for the memory hook. Affect is the Action. Effect is the End result. Both hooks start with the same letter as the word they belong to, which is the whole point of them.`,
        `CORRECT: "A late bus can affect the whole team, and you can see the effect in the first five minutes of the game."`,
      ],
      example: { problem: `Choose the right word for each blank. "A late bus can ___ the whole team, and you can see the ___ in the first five minutes of the game."`, solution: `affect in the first blank, effect in the second. After a helping word like "can" you need the verb affect; after "the" you need the noun effect.` },
      relatedLoIds: ['m7ela.commonly-confused-words'],
    },
  ],
  pointers: [
    { content: `Students often say "it's is correct, because the apostrophe shows the win belongs to the team" — Run the long-form test first. "The team celebrated it is first win" is nonsense, so the apostrophe word is not the one you want. Here is the part worth saying plainly: for the word "it", the possessive is the one WITHOUT the apostrophe. WRONG: "The team celebrated it's first win of the season." CORRECT: "The team celebrated its first win of the season." The original rule is still true for nouns, and you can see both at once in "The team's first win was its best game all year." The noun team takes the apostrophe; the pronoun its does not. Your, their, whose and ours work the same way.`, kind: 'common-error' },
    { content: `Students often say "it does not matter much, because spellcheck would have caught a real mistake" — Nothing in that sentence is misspelled. Spellcheck compares your words against a dictionary, and "its" and "it's" are both in the dictionary, so both come back clean. The same is true of every pair in this lesson: there, their, they're, then, than, affect and effect are all real words. A tool that checks spelling cannot catch a mistake about meaning. The test in your head is the only thing that catches it.`, kind: 'common-error' },
    { content: `These are word-choice mistakes, not spelling mistakes, so spellcheck will never flag them. Every option is a real word.`, kind: 'tip' },
    { content: `The long-form test: it's = it is, you're = you are, they're = they are, who's = who is. Put the two words back in and read it.`, kind: 'tip' },
    { content: `Its, your, their and whose are the possessive ones and take NO apostrophe. For the word "it", the possessive is the one without the apostrophe.`, kind: 'tip' },
    { content: `There has here inside it, so it is a place. Their belongs to people. They're unpacks to they are.`, kind: 'tip' },
    { content: `ThAn compAres; thEn is timE. WRONG: "bigger then his." CORRECT: "bigger than his."`, kind: 'tip' },
    { content: `Affect is the Action, so it is the verb. Effect is the End result, so it is the noun. If "the ___" sounds right, you need effect.`, kind: 'tip' },
    { content: `The same move works on other lookalikes you will meet, such as lose and loose: say what you mean in plain words first, then pick the word that carries that meaning.`, kind: 'tip' },
    { content: `Spellcheck will never save you here. "Its" and "it's" are both real words, so a clean spellcheck means nothing. Test every slot yourself.`, kind: 'common-error' },
    { content: `Don't stretch the apostrophe-shows-possession rule onto pronouns. Nouns take it (my sister's hoodie), pronouns don't (its, your, their, whose, ours). Both live in one sentence: "The team's first win was its best game."`, kind: 'gotcha' },
    { content: `Check one blank at a time, not the whole sentence. Writers often swap the pair both ways in one line: "lost it's wheel... now its stuck" has two mistakes that are mirror images of each other.`, kind: 'tip' },
    { content: `Say "homophone," not "misspelling." There/their/they're sound identical and are each spelled right — the error is choosing the wrong meaning. Calling it a spelling error sends you looking for the wrong fix.`, kind: 'vocab-note' },
    { content: `Than and then are NOT homophones — they have different vowels and different jobs. If your sentence measures two things, use thAn (compAres). If it tells what happened next, use thEn (timE).`, kind: 'edge-case' },
    { content: `For affect/effect, look at the word right before the blank. After "the," "an," or "this," you need the noun effect. After a helping word like can, will, or did, you need the verb affect.`, kind: 'tip' },
    { content: `"They're" always unpacks to "they are" — never "there is" or "their." If "they are" makes the sentence nonsense, you needed there (a place, with HERE inside) or their (belongs to people).`, kind: 'common-error' },
    { content: `Whose = belongs to whom; who's = who is. "Whose hoodie is this?" takes no apostrophe. Same trick as its/it's — unpack it and listen.`, kind: 'gotcha' },
  ],
};
