/**
 * Grade 6 ELA — Vocabulary in Context & Word Study: Context Clues.
 *
 * PROCEDURE-LED fan-out row for the m6ela course. One repeatable move runs
 * the whole lesson: read past an unfamiliar word to the rest of its sentence
 * (and the next one, if needed), use the word's own job in the sentence to
 * narrow what kind of thing it could mean, then hunt for a definition,
 * restatement, contrast or example clue among the words actually printed,
 * and confirm the guess by substituting it back in (CCSS L.6.4a). This is
 * the GENERAL case: any unfamiliar word, in a text of any kind, using only
 * sentence- and paragraph-level context. It is deliberately not row 3.3's
 * case — a technical or domain-specific term inside an informational text —
 * and the two rows must not blur.
 *
 * SCOPE GUARD: Grade 6 row 7.1 uses the overall meaning of a sentence or
 * paragraph, and a word's position or function within it, as a clue to an
 * unfamiliar word's meaning, in a text of any kind. DELIBERATELY EXCLUDED:
 * determining the meaning of a technical or domain-specific word or phrase
 * inside an informational text (row 3.3, RI.6.4, already written) — every
 * target word in this file is ordinary vocabulary a student could meet in a
 * story or an everyday paragraph, never a field-specific term, and no item
 * here asks what field a word belongs to; deriving a word's meaning from a
 * Greek or Latin root, prefix or suffix (row 7.2, L.6.4b) — no worked
 * example or item in this file breaks a word into word parts, every clue
 * here comes from the sentence around the word, never from the word's own
 * spelling; the shades of feeling that separate a word from a more neutral
 * word with a similar meaning (row 7.3, connotation and denotation, L.6.5c);
 * and analogies or other word-to-word relationships (row 7.4, L.6.5b).
 * DELIBERATELY ALLOWED: this row and the shipped Grade 7 file
 * m7ela-u7-context-clues.ts teach the same context-clue-hunting skill under
 * the same repeated CCSS code family (L.6.4a here, L.7.4a there) — the
 * difference this file makes is register and item design, not the
 * underlying skill. In particular, no item in this file asks a student to
 * name or classify which TYPE of clue an excerpt used; every item asks only
 * what the flagged word means and lets the hints point at the mechanism.
 * Naming the four clue types is something this lesson teaches the student to
 * look for, never something an item asks the student to label, because a
 * "what kind of clue is this" question tests taxonomy memorization instead
 * of reading.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item, and every target word is a real English word used
 * with its real dictionary meaning. This course carries no passage
 * machinery — no passageId, no shared texts — so each question must be
 * solvable from the sentences printed inside it, and no published work may
 * be quoted or closely paraphrased. If you add an item, check the target
 * word in a dictionary first; an invented word, or a real word given a wrong
 * definition, is the one unrecoverable defect a context-clues lesson can
 * have. Target words used here: audacious, somber, skeptical, diligent,
 * tentative, vigorous.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3 and
 * 4, and any other row needing nonfiction) must carry the three-column claim
 * ledger described in the fan-out contract instead of this line.
 *
 * NOTE ON prerequisites/followUps: this row's chain is
 * m6ela.maintaining-consistent-style-and-tone -> m6ela.context-clues ->
 * m6ela.greek-and-latin-roots-and-affixes, per the lesson brief.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U7_CONTEXT_CLUES: LessonPlan = {
  id: 'evelyn.ms.m6ela.context-clues.v1',
  title: 'Context Clues',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.context-clues',
      standard: 'M6ELA-7.1',
      description:
        'Use the overall meaning of a sentence or paragraph, or a word\'s position and function within it, as a clue to an unfamiliar word\'s meaning, drawing on the definitions, restatements, contrasts and examples a text supplies and confirming a guess by substituting it back into the sentence (CCSS L.6.4a).',
    },
  ],
  prerequisites: ['m6ela.maintaining-consistent-style-and-tone'],
  followUps: ['m6ela.greek-and-latin-roots-and-affixes'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already read around unknown words without noticing, so the lesson names a habit rather than installing a new one.',
      script:
        'Your little brother\'s hamster escapes its cage, and he sends a message to the family group chat: "Whiskers is loose! Do not chase her, or she will bolt under the couch, and we will need to coax her back out with a piece of banana." Nobody in your family has ever used the word coax in a sentence before, but everyone already knows exactly what to do: move slowly, hold out food, and wait. That is coaxing. The message never defined the word. The situation around it — a scared hamster that has to be gently persuaded, not grabbed — did the defining instead. That is the whole move for today: using the sentence a hard word sits in, and the job that word is doing inside it, to build a meaning that fits.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-context-clue-types',
      kind: 'concept',
      goal: 'Install the read-past habit, the position/function narrowing move, the four clue types to look for, and the substitute-back check.',
      keyIdeas: [
        'READ PAST THE HARD WORD BEFORE YOU GUESS. Finish the whole sentence it sits in, and read the next sentence too if the first one gives you nothing. The clue is almost never the word itself — it is the sentences sitting around it, and sometimes it is one sentence away.',
        'THE WORD\'S JOB IN THE SENTENCE NARROWS THE MEANING BEFORE YOU EVEN FIND A CLUE. Ask what the word is doing: naming a person or thing, describing one, or performing an action. A word that follows was, felt, seemed or looked is almost always describing a feeling or a state, which already rules out an entire category of wrong guesses.',
        'A DEFINITION CLUE HANDS YOU THE MEANING DIRECTLY, usually right where the word appears. Watch for a comma followed by "or," the word "means," or a phrase set off by a dash. "The trail was arduous, or so steep and rocky that even the guide needed a break," defines arduous the instant it uses the word.',
        'A RESTATEMENT CLUE SAYS THE SAME IDEA AGAIN, LATER, IN EASIER WORDS, with no signal word announcing it. Nothing marks it as a definition — you notice that a sentence nearby describes the same thing you were unsure about, just in plainer language.',
        'A CONTRAST CLUE GIVES YOU THE OPPOSITE, SO YOU HAVE TO FLIP IT. Watch for but, however, although, unlike, instead and on the other hand. Whatever the other half of the sentence says, the hard word means something close to the reverse of it.',
        'AN EXAMPLE CLUE SHOWS WHAT A WORD COVERS THROUGH SPECIFIC CASES, introduced by such as, like, for instance or including — ask what every example in the list has in common. Then, whichever clue you used, TEST YOUR GUESS by substituting it back into the sentence. If the sentence still makes sense with your meaning in place of the hard word, keep it; if it does not, the guess is wrong, no matter how confident it felt.',
      ],
      vocabulary: [
        { term: 'context clue', definition: 'a detail in the words and sentences around an unfamiliar word that points to its meaning.' },
        { term: 'definition clue', definition: 'a clue that renames the word directly, often set off by a comma and the word "or" right where the word appears.' },
        { term: 'restatement', definition: 'the same idea said again, later, in easier or more familiar words, with no signal word announcing it.' },
        { term: 'contrast clue', definition: 'a clue that gives the opposite of a word\'s meaning, so a reader has to flip it. Signals: but, however, although, unlike, instead.' },
        { term: 'example clue', definition: 'specific cases that show what a word covers, introduced by words such as "such as" or "like."' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-definition-clue-audacious',
      kind: 'worked_example',
      problem:
        'Figure out what the underlined word means, using only the words printed in the passage.\n\n"Every camper wanted extra pudding from the counselors\' kitchen, but nobody had the nerve to actually sneak in and take it, until Priya walked in at midnight and grabbed the whole tray. The rest of the cabin called her plan audacious, or bold enough to border on reckless, and they still bring up that night at every campfire."\n\nWhat does audacious mean, as used in this passage?',
      steps: [
        'Find the hard word first: audacious. It comes right after "called her plan", so its job is to describe the plan — that alone tells you the word names some quality, not a person or an action.',
        'Read immediately past the word for a signal. Right after audacious there is a comma, then the signal word "or", then the definition itself: "bold enough to border on reckless". A comma followed by "or" is a definition clue announcing itself as clearly as this course ever gets.',
        'Take the definition at its word: audacious means bold enough to border on reckless.',
        'Swap the guess back into the sentence to check it: "The rest of the cabin called her plan bold enough to border on reckless, and they still bring up that night at every campfire." The sentence still makes complete sense, so the guess holds.',
      ],
      answer:
        'Audacious means bold enough to border on reckless. The comma followed by "or" right after the word signals a definition clue that renames audacious directly.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-somber',
      kind: 'worked_example',
      problem:
        'A student was asked what the underlined word means in this passage, and answered wrong. Find the mistake and repair it.\n\n"The whole team walked off the field somber after the championship game, heads down and nobody talking the entire bus ride home. Even the coach, who usually cracked a joke before they even reached the parking lot, stayed quiet the whole way."\n\nStudent\'s answer: "Somber means worn out, because playing a whole game is exhausting."\n\nWhat went wrong, and what does somber actually mean here?',
      steps: [
        'Notice the word\'s job first. Somber sits right after "walked off the field", describing how the team walked, which means it names a feeling or a state, not an action.',
        'The student\'s guess, worn out, is a real feeling after a game, which is exactly why it seems safe. But nothing printed in the passage ties the word to being tired — the guess was never checked against the sentence at all.',
        'Look at what is actually printed: "heads down and nobody talking the entire bus ride home." A tired team can still joke around on a bus. Heads down and silence describe something heavier than exhaustion.',
        'Read into the second sentence too. The coach, who "usually cracked a joke", stayed quiet instead. That detail rules out simple tiredness and points toward something serious and sad.',
        'Swap the repaired guess back in: "The whole team walked off the field serious and sad after the championship game, heads down and nobody talking the entire bus ride home." Every detail in the passage now fits.',
        'WRONG: "Somber means worn out, because playing a whole game is exhausting." CORRECT: "Somber means very serious and sad, shown by the silence, the heads down, and the coach who stayed quiet instead of joking."',
      ],
      answer:
        'Somber means very serious and sad. Nothing in the passage points toward tired — the silence, the heads down, and the coach who stayed quiet instead of joking all point toward sadness instead.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-contrast-clue-skeptical',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined word.\n\n"Malik was skeptical about the shortcut through the woods, but his sister marched ahead without a shred of doubt, certain it would save them ten minutes."\n\nAs used in this passage, what does skeptical mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Doubtful, and not at all convinced that something is going to work out the way somebody claims it will.', correct: true },
        { id: 'b', text: 'Completely confident that a plan will work, which is the trait his sister is showing instead of the trait Malik is showing.' },
        { id: 'c', text: 'Curious enough about a new path through the woods to want to try it out immediately, without a moment of hesitation.' },
        { id: 'd', text: 'Annoyed that someone else suggested the shortcut before Malik had a chance to suggest a different route himself.' },
      ],
      expectedAnswer: 'Doubtful, and not at all convinced that something is going to work out the way somebody claims it will.',
      hints: [
        'Find the contrast signal in the sentence. It tells you that Malik and his sister felt opposite things about the shortcut.',
        'His sister is described as having no doubt at all and feeling certain it would work — flip that feeling to find what Malik felt instead.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-example-clue-diligent',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined word.\n\n"Every Saturday morning, Talia was diligent about her chores, wiping every windowsill, sorting the recycling by type, and double-checking that the dog\'s water bowl was full before breakfast."\n\nAs used in this passage, what does diligent mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Impatient to rush through a task as fast as possible so she could get outside and do something more fun.' },
        { id: 'b', text: 'Careful and hardworking, putting steady effort into finishing every small task all the way through.', correct: true },
        { id: 'c', text: 'Forgetful about small details, often skipping a step in a chore without ever noticing she had skipped it.' },
        { id: 'd', text: 'Uninterested in chores, only doing them slowly because somebody was standing there checking on her.' },
      ],
      expectedAnswer: 'Careful and hardworking, putting steady effort into finishing every small task all the way through.',
      hints: [
        'Look at the list right after the word. Each item in that list is an example of something Talia does — ask what the three examples have in common.',
        'Wiping every windowsill, sorting the recycling by type, and double-checking the water bowl are not things a rushed or careless person bothers doing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-versions-tentative',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the meaning of the underlined word.\n\n"Grandpa\'s plan for the tree house was tentative at first, penciled onto the back of an envelope with question marks next to the ladder and the roof. By the time he taped the third version to the garage wall, every measurement was final and the question marks were gone."\n\nAs used in this passage, what does tentative mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Drawn by hand on the back of an envelope instead of typed up or printed with a computer program.' },
        { id: 'b', text: 'Impossible for anyone else in the family to understand because the handwriting was too messy to read.' },
        { id: 'c', text: 'Not yet settled, and likely to change one or more times before anything about it becomes final.', correct: true },
        { id: 'd', text: 'Finished and exact, with every measurement decided and nothing left open to question anymore.' },
      ],
      expectedAnswer: 'Not yet settled, and likely to change one or more times before anything about it becomes final.',
      hints: [
        'Notice that this passage describes two different versions of the plan — the first one on the envelope, and the finished one taped to the garage wall much later. The word describes only the first one.',
        'The question marks next to the ladder and the roof are the real clue. Do they belong to a plan that is finished, or to one still being worked out?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-contrast-clue-not-flipped',
      kind: 'misconception_check',
      question:
        'A student reads this: "Coach expected the team to be exhausted after two hours of drills, but they looked surprisingly vigorous, jogging off the field and racing each other to the water cooler." The student says vigorous means exhausted and worn out, since two hours of drills would tire anyone out. What has gone wrong?',
      commonErrors: [
        {
          answer: 'Vigorous means exhausted and worn out.',
          misconception:
            'Reading straight through a contrast clue without flipping it. The sentence describes exactly what a tired team would look like, and the student borrows that description for the wrong word instead of noticing the signal but, which announces that the second half of the sentence is the opposite of the first.',
          correctsTo:
            'The word but signals a contrast: the team was expected to be exhausted, but they looked like something else instead. Flip the expected feeling to its opposite: vigorous means full of energy, the reverse of worn out. The jogging and the racing that follow confirm an energetic team, not a tired one.',
        },
        {
          answer: 'Vigorous means competitive, always trying to beat somebody else.',
          misconception:
            'Grabbing one detail, racing each other, and building a whole meaning around it instead of using every detail together. Racing sounds like competition, so the guess feels reasonable on its own, even though the sentence gives a second detail right beside it.',
          correctsTo:
            'Read both details as one pair, not one at a time: jogging off the field and racing each other to the water cooler. Jogging is not a competition at all, so the two details together describe one thing, a team with plenty of energy left. Vigorous means full of energy and strength, which fits jogging and racing equally well.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read past the hard word to the end of its sentence, and into the next sentence if the first one gives nothing. The clue is almost never the word itself.',
        'The word\'s job in the sentence — naming, describing or doing — narrows the meaning before you even find a signal.',
        'A definition clue renames the word directly, often right after a comma and the word "or."',
        'A restatement clue says the same idea again, later, in plainer words, with no signal announcing it.',
        'A contrast clue gives you the opposite. Signals: but, however, although, unlike, instead. Flip whatever the other half of the sentence says.',
        'An example clue shows what a word covers through specific cases introduced by such as, like or for instance. Whichever clue you use, test your guess by substituting it back into the sentence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Context Clues' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
