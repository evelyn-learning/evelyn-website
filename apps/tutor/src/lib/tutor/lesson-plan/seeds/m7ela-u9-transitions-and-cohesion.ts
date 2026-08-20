/**
 * Grade 7 ELA — Informative Writing: Transitions & Cohesion.
 *
 * Procedure-led (CCSS W.7.2c). The whole lesson is one move: NAME the
 * relationship between two ideas in plain words first, then pick a word from
 * that family. The traps it is built to kill are the belief that any
 * transition is better than none, the belief that every sentence needs one,
 * and the idea that however and therefore are interchangeable fancy words.
 *
 * NOTE FOR FUTURE AUTHORS: every badly connected example in this file is
 * labeled WRONG with the CORRECT version beside it, because a tutor reads
 * these aloud. Never leave a mis-signaled pair bare. Every MCQ pair is
 * written so that exactly ONE relationship family fits the two printed
 * sentences — check that before changing any wording here.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U9_TRANSITIONS_AND_COHESION: LessonPlan = {
  id: 'evelyn.ms.m7ela.transitions-and-cohesion.v1',
  title: 'Transitions & Cohesion',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.transitions-and-cohesion',
      standard: 'M7ELA-9.3',
      description:
        'Name the relationship between two ideas first — adding, contrast, cause and effect, example, sequence, emphasis or conclusion — then choose a transition from that family, and hold sentences together with repeated key nouns and pronouns that point at one clear noun (CCSS W.7.2c).',
    },
  ],
  prerequisites: ['m7ela.paragraph-development'],
  followUps: ['m7ela.narrative-technique'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a transition as a signal to the reader, using a set of directions with a missing connection.',
      script:
        'Imagine a friend texts you how to get to their house. "Walk past the pizza place. Turn at the blue mailbox." You can follow that. Now imagine they send you "Walk past the pizza place. However, turn at the blue mailbox." You stop. That word "however" promised you a surprise, a change of plan, and then nothing changed. Your brain spends a second hunting for a turn that is not there. That is what a wrong transition does to a reader. A transition is a small signal that tells your reader what is coming next: one more point, a turn, a result, an example. Today you learn to say the connection out loud first, and pick the word second.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-relationship-first',
      kind: 'concept',
      goal: 'Install the relationship-first method, the seven transition families, and the two quiet ways sentences stick together.',
      keyIdeas: [
        'SAY THE RELATIONSHIP FIRST, PICK THE WORD SECOND. Before you reach for a transition, finish this sentence in plain language: "the second sentence ____ the first one." It adds another point. It turns against it. It is what happened because of it. It gives one example of it. Once you can say the relationship, the word is easy. Writers who grab the word first end up picking whatever sounds smart.',
        'THE FAMILIES, AND THE WORDS INSIDE THEM. ADDING, another point on the same side: also, in addition, another. CONTRAST, a turn against what you just said: however, but, on the other hand, although. CAUSE AND EFFECT, the first idea made the second one happen: because, so, as a result, therefore. EXAMPLE, one real case of the thing you just named: for example, for instance. SEQUENCE, the order things happen in: first, next, finally. EMPHASIS, the point that matters most: most importantly. CONCLUSION, the wrap-up: overall, in short.',
        'A WRONG TRANSITION IS WORSE THAN NO TRANSITION. It does not just fail to help; it actively lies to your reader. WRONG: "The garden club waters the beds every morning. However, they pull weeds every Friday." Both sentences say the club works hard, so "however" promises a turn that never comes and the reader has to back up. CORRECT: "The garden club waters the beds every morning. In addition, they pull weeds every Friday."',
        'HOWEVER AND THEREFORE ARE NOT THE SAME WORD. They are not two fancy ways of saying "and next". However means a turn is coming. Therefore means a result is coming. Swapping them tells your reader the opposite of what you mean. And not every sentence needs one of them. If two sentences already sit together clearly, adding a connector to the front just slows the reader down. Over-connected writing is harder to read than plain writing.',
        'COHESION IS THE QUIET HALF, AND IT IS NOT MADE OF CONNECTOR WORDS. Most of the stickiness in a good paragraph comes from REPEATING THE KEY NOUN. Name the thing, then name it again: "Yeast makes the bubbles in bread dough. The yeast feeds on sugar in the flour." Hunting for a fresh synonym every single sentence looks varied and reads like a brand new topic each time.',
        'A PRONOUN IS A THREAD BACK TO ONE NOUN. Words such as it, they, this and those only work when there is exactly one noun they could point to. WRONG: "The librarians met the volunteers, and they picked the new books." Who picked them? CORRECT: "The librarians met the volunteers, and the librarians picked the new books." Starting a sentence with a bare "This" or "It" is the most common way a seventh-grade paragraph comes apart.',
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word or phrase that tells the reader how two ideas are related, such as also, however, as a result or for example.' },
        { term: 'cohesion', definition: 'the feeling that sentences belong together in one paragraph, built mostly from repeated key nouns and clear pronouns.' },
        { term: 'antecedent', definition: 'the noun that a pronoun points back to; a pronoun is only clear when exactly one noun could be its antecedent.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-then-pick',
      kind: 'worked_example',
      problem:
        'Choose the best transition for the blank. "Bread dough is full of yeast, and yeast gives off tiny bubbles of gas while it feeds on the sugar in the flour. ___ the dough puffs up and grows before it ever goes in the oven." (a) However, (b) For example, (c) As a result, (d) Meanwhile,',
      steps: [
        'Cover the four choices with your hand. Do not look at them yet. Read only the sentence before the blank and the sentence after it, both all the way to the period.',
        'Now say the relationship in plain language: the bubbles of gas are the reason the dough puffs up. The first idea MADE the second one happen.',
        'That is the cause and effect family. Uncover the choices and test the other three against the families. "However" is contrast, but the second sentence does not turn against the first one at all; it agrees with it. WRONG: "However, the dough puffs up."',
        '"For example" is the example family. It would have to mean that puffing up is one instance of giving off gas, and it is not. It is what the gas DOES to the dough. WRONG: "For example, the dough puffs up."',
        '"Meanwhile" is the sequence family. It marks two things happening at the same time and says nothing about one causing the other. It would hide the reason, which is the whole point of the sentence.',
        'Only "As a result" belongs to cause and effect. CORRECT: "As a result, the dough puffs up and grows before it ever goes in the oven."',
      ],
      answer:
        '(c) As a result, — the gas from the yeast is what makes the dough puff up, so the relationship is cause and effect.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-relationship',
      kind: 'worked_example',
      problem:
        'A student writes: "The garden club waters the raised beds every morning before first period. However, they pull the weeds along the fence every Friday." It sounds fine when you read it out loud. Is the transition right?',
      steps: [
        'Do not trust your ear. A transition can sound smooth and grown-up and still name the wrong relationship, because words like however carry a serious, finished tone that hides their meaning.',
        'Take the word out and say the connection yourself. Sentence one: the club waters the beds. Sentence two: the club also pulls the weeds. The second sentence names one more job the club does. It is another point on the same side.',
        'That is the ADDING family. Now check what "however" actually signals: contrast, a turn against the point you just made. It tells the reader to expect the club to stop working, or to skip something, and then no turn arrives. WRONG: "The garden club waters the raised beds every morning before first period. However, they pull the weeds along the fence every Friday."',
        'Swap in a word from the family you named. CORRECT: "The garden club waters the raised beds every morning before first period. In addition, they pull the weeds along the fence every Friday."',
        'One more check, on the quiet half. The pronoun "they" points back to "the garden club", and the garden club is the only group named in either sentence, so the thread is clear. If a second group had been named, "they" would have to be replaced with the noun.',
        'The lesson: smooth is not the same as correct. Name the relationship, then make sure the word belongs to that family.',
      ],
      answer:
        'No. The relationship is adding, not contrast, so "However" should be "In addition": "The garden club waters the raised beds every morning before first period. In addition, they pull the weeds along the fence every Friday."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cause-and-effect',
      kind: 'try_yourself',
      problem:
        'Which transition best fills the blank? "Nobody watered the raised beds during the whole week of spring break. ___ the bean plants were drooping over the soil when we came back."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For example,' },
        { id: 'b', text: 'As a result,', correct: true },
        { id: 'c', text: 'However,' },
        { id: 'd', text: 'In addition,' },
      ],
      expectedAnswer: 'As a result,',
      hints: [
        'Say the connection in plain words before you look at the choices. Did the drooping just happen to come after the dry week, or did the dry week make it happen?',
        'Going without water is the reason the beans drooped, so you need a word from the cause and effect family, not an example, a turn, or one more point on a list.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-contrast',
      kind: 'try_yourself',
      problem:
        'Which transition best fills the blank? "Most of the robins in our town fly south before the first snow. ___ a few of them stay all winter and feed on the berries left on the bushes."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Therefore,' },
        { id: 'b', text: 'For instance,' },
        { id: 'c', text: 'However,', correct: true },
        { id: 'd', text: 'In short,' },
      ],
      expectedAnswer: 'However,',
      hints: [
        'Name the relationship first. The first sentence is about the robins that leave. The second sentence is about the ones that do not. Is that another point on the same side, or a turn?',
        'The birds that stay are the exception to the ones that go, so you need a contrast word. Nothing here is a result of anything, the staying birds are not an example of flying south, and one sentence is far too early to wrap up.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cohesion-no-connector',
      kind: 'try_yourself',
      problem:
        'A draft reads: "Last fall the library started asking students to suggest books it should order. That has helped." Which revision of the SECOND sentence improves cohesion without adding a transition word?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Those student suggestions now fill a whole shelf near the front door.', correct: true },
        { id: 'b', text: 'In addition, that has helped.' },
        { id: 'c', text: 'Therefore, it has helped the library.' },
        { id: 'd', text: 'This has been a big help, and it is something everybody likes.' },
      ],
      expectedAnswer: 'Those student suggestions now fill a whole shelf near the front door.',
      hints: [
        'Cohesion comes from repeating the key noun from the sentence before, not from bolting a connector onto a vague sentence.',
        'Two of these choices add a transition word, which the question rules out. One of those two also picks the wrong family. The last choice piles up "This" and "it" with no noun behind either one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-any-transition-helps',
      kind: 'misconception_check',
      question:
        'A student writes: "The library buys new books twice a year. However, librarians also take suggestions from students all year long." They say the paragraph flows better now because it has a transition in it. Are they right?',
      commonErrors: [
        {
          answer: 'Yes, because any transition is better than none.',
          misconception:
            'Treating a transition as decoration that gets sprinkled on top, instead of as a signal that names one specific relationship. The student checks whether a connector is present, not whether it is true.',
          correctsTo:
            'A wrong transition is worse than no transition, because it actively misleads. Both sentences here say the same kind of thing: the library adds books in more than one way. That is the ADDING family. "However" promises a turn against the first sentence, so the reader braces for a change that never comes and has to read the pair twice. WRONG: "The library buys new books twice a year. However, librarians also take suggestions from students all year long." CORRECT: "The library buys new books twice a year. In addition, librarians take suggestions from students all year long."',
        },
        {
          answer: 'Yes, and every sentence should start with a transition.',
          misconception:
            'Turning a helpful move into a rule, so a connector goes on the front of every sentence and on the front of every paragraph whether or not any relationship needs marking.',
          correctsTo:
            'A transition earns its place only when the link between two ideas would be unclear without it. When you put one in front of every sentence, they all sound equally important and the reader can no longer tell which links actually matter. Over-connected writing is harder to read than plain writing. There is also no rule that a paragraph has to open with a transition; plenty of strong paragraphs begin with the plain statement of their main idea. Carry the rest of the flow the quiet way, by repeating the key noun and keeping every pronoun pointed at one clear noun.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Say the relationship out loud in plain words FIRST, then pick a word from that family.',
        'The families: ADDING (also, in addition, another), CONTRAST (however, but, on the other hand, although), CAUSE AND EFFECT (because, so, as a result, therefore), EXAMPLE (for example, for instance), SEQUENCE (first, next, finally), EMPHASIS (most importantly), CONCLUSION (overall, in short).',
        'A wrong transition is worse than none. WRONG: "The garden club waters the beds every morning. However, they pull weeds every Friday." CORRECT: "In addition, they pull weeds every Friday."',
        'However signals a turn and therefore signals a result. They are not two fancy words for the same thing.',
        'Not every sentence needs a transition, and no rule says a paragraph must start with one. Over-connected writing is harder to read than plain writing.',
        'Most cohesion is quiet: repeat the key noun instead of hunting for a new synonym, and make sure every pronoun points at exactly one noun.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Transitions & Cohesion' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
