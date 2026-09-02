/**
 * Grade 6 ELA — Reading Literature: Plot, Character & Structure: Text
 * Evidence & Inference.
 *
 * CONCEPT-LED lesson in the m6ela fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: some
 * claims about a text are EXPLICIT (the words say it directly, and you can
 * point to the sentence), and some are INFERENCES (the words never say it,
 * but the details lead you there) — and either kind of claim has to be
 * proven with the exact words from the text, not a gesture at "the story"
 * (CCSS RL.6.1). Three traps this plan is built to kill: mistaking a
 * restated explicit line for something inferred, building an inference out
 * of an outside belief or assumption instead of the text's own details, and
 * pointing to evidence that is true but does not actually support the claim
 * being made.
 *
 * SCOPE GUARD: Grade 6 row 1.1 asks the student to cite textual evidence —
 * the exact words printed in a passage — to support both an explicit
 * statement made in the text and an inference drawn from it, and to tell the
 * two kinds of claim apart. DELIBERATELY EXCLUDED: naming or explaining the
 * stages of a plot (exposition, rising action, climax, resolution), which is
 * row 1.2; describing how a character responds to events or changes, which
 * is row 1.3; analyzing how one scene or chapter fits a story's overall
 * structure, which is row 1.4; and determining a text's theme or central
 * idea, which is row 2.1 — this lesson never asks what a story means or how
 * it is built, only whether a given claim about it is stated outright or has
 * to be inferred, and what words prove it. Also excluded: requiring several
 * corroborating pieces of evidence for one inference, or judging which of
 * multiple pieces of evidence most strongly supports a claim — that
 * escalation is RL.7.1's "several pieces of textual evidence," taught by the
 * shipped m7ela-u1-text-evidence-and-inference.ts, and this lesson asks for
 * one piece of evidence at a time. DELIBERATELY ALLOWED, because every
 * reading-literature row in this unit necessarily uses a short narrative
 * excerpt with characters and events: this lesson's excerpts contain
 * ordinary story action (a girl checking a mailbox, a boy signing up for a
 * talent show), but no item asks the student to sequence that action into
 * plot stages or track how a character changes — the only question asked of
 * any excerpt here is whether a claim about it is explicit or inferred, and
 * what evidence proves it.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U1_TEXT_EVIDENCE_AND_INFERENCE: LessonPlan = {
  id: 'evelyn.ms.m6ela.text-evidence-and-inference.v1',
  title: 'Text Evidence & Inference',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.text-evidence-and-inference',
      standard: 'M6ELA-1.1',
      description:
        'Cite specific textual evidence to support both an explicit statement made in a text and an inference drawn from it, and distinguish a claim the text states directly from a conclusion the reader has to build from its details (CCSS RL.6.1).',
    },
  ],
  prerequisites: [],
  followUps: ['m6ela.how-a-storys-plot-unfolds'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already reason from evidence, and connect that habit to reading a text.',
      script:
        'Your little sister says she did not touch your comic books, but three of them are lying open on her bed, and there is a peanut butter fingerprint on the corner of the newest one. She never said, "I touched them." You do not need her to say it — the evidence makes the case for you. Readers do the exact same thing with a story. Sometimes the text states a fact straight out, and sometimes it leaves clues instead, and your job is to find the exact words that prove each one. Today we practice telling the two apart, and pointing to the evidence that backs up each answer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-explicit-and-inference',
      kind: 'concept',
      goal: 'Separate explicit statements from inferences, define textual evidence, and install the test for a good inference.',
      keyIdeas: [
        'EXPLICIT MEANS THE TEXT SAYS IT IN PLAIN WORDS. If a fact is explicit, you can point to the exact sentence that states it, and nothing needs figuring out. "Marisol was thrilled when she saw her grade" explicitly states how Marisol felt.',
        'INFERENCE MEANS THE TEXT DOES NOT SAY IT DIRECTLY, BUT THE DETAILS LEAD YOU THERE. An inference is a conclusion you build by combining two or more details in the text. It is not a guess pulled from nowhere, and it is not something stated outright either.',
        'TEXTUAL EVIDENCE IS THE EXACT WORDS YOU POINT TO AS PROOF. Citing evidence means quoting or naming the specific detail from the text, not saying something vague like "the story shows it."',
        'IF THE TEXT ALREADY SAYS IT, RESTATING IT IS NOT AN INFERENCE. Explicit fact: "Jamal told his sister he wanted to sign up." Repeating that same idea in different words is not an inference, because nothing needed to be figured out.',
        'A GOOD INFERENCE STAYS INSIDE THE TEXT\'S OWN DETAILS. An idea that depends on something the text never says — a rule you already believed, or a fact from outside the passage — is an assumption, not an inference.',
        'TEST EVERY INFERENCE BY POINTING AT THE EVIDENCE. Before you trust an inference, name at least one exact phrase from the text that supports it. If you cannot point to anything, the inference is a guess.',
      ],
      vocabulary: [
        { term: 'explicit', definition: 'stated in the text in plain words, with nothing left for the reader to figure out.' },
        { term: 'inference', definition: 'a conclusion the reader builds by combining details the text gives, without the text stating that conclusion directly.' },
        { term: 'textual evidence', definition: 'the exact words or details from the text used to prove a claim about it.' },
        { term: 'cite', definition: 'to point to or quote the specific words from the text that back up an answer.' },
        { term: 'assumption', definition: 'an idea a reader adds from outside the text — an outside belief or a rule — rather than something the text\'s details actually support.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-explicit-vs-inference',
      kind: 'worked_example',
      problem:
        'Read the passage, then answer two questions about it: what does the text state EXPLICITLY, and what is a valid INFERENCE it supports?\n\n"Marcus set his lunch tray down at the end of the table, three seats away from his usual friends. He did not look up when they called his name. When Priya asked if he wanted to trade her chips for his fruit cup, he said \'no thank you\' and kept staring at his tray. He had aced the science quiz that morning, and it was tucked face-down under his tray, one corner sticking out."',
      steps: [
        'Read the passage once for what happens, without deciding anything yet.',
        'Look for a sentence you could point to word for word, with nothing left to figure out. "Marcus set his lunch tray down at the end of the table, three seats away from his usual friends" states a fact directly. That is explicit.',
        'Notice what the passage never says: it never states how Marcus feels. That gap is the sign an inference is needed.',
        'Collect every detail that touches on his mood: he "did not look up when they called his name," he turned down a trade he would normally take, and he kept his passing quiz "tucked face-down under his tray, one corner sticking out."',
        'Combine those details into one sentence: something is bothering Marcus, even though the passage never says so directly.',
        'Name the exact evidence that supports it: "did not look up when they called his name," he "said \'no thank you\'," and the quiz "tucked face-down under his tray, one corner sticking out."',
        'Test the inference against the explicit-restatement trap: does any sentence in the passage already say Marcus is upset? No. So this is a real inference, built from clues, not a repeated fact.',
      ],
      answer:
        'Explicit: Marcus set his lunch tray down three seats away from his usual friends and did not look up when they called his name. Inference: something is bothering Marcus, even though the passage never says so. Evidence: he turned down Priya\'s trade and said "no thank you," and he kept a quiz he had aced "tucked face-down under his tray, one corner sticking out."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-an-inference',
      kind: 'worked_example',
      problem:
        'Repair this inference so that it uses only evidence from the passage.\n\n"Every afternoon at exactly four o\'clock, Bailey the dog walked to the back door and sat down, even if no one was home to let him in. On the days Grandma visited, she always arrived at four fifteen with a biscuit in her coat pocket."\n\nA student wrote: "Bailey knows how to tell time, because dogs are smart animals."',
      steps: [
        'Check the reason first. "Dogs are smart animals" is not something the passage says or shows. It is an idea the student already believed before reading, brought in from outside the text.',
        'Separate the claim from the reason. The claim, that Bailey knows something about four o\'clock, might still be worth keeping. The reason behind it is what needs to go.',
        'Look for what the passage actually shows about Bailey and four o\'clock. He "walked to the back door and sat down" at "exactly four o\'clock," every afternoon, even with nobody home to let him in.',
        'Look for the detail that explains why four o\'clock might matter to him. Grandma "always arrived at four fifteen with a biscuit in her coat pocket."',
        'Rebuild the inference using only those two details. WRONG: "Bailey knows how to tell time, because dogs are smart animals." CORRECT: "Bailey has learned that four o\'clock means a visitor with a treat is coming soon, since he waits at the door at that exact time every day, right before Grandma arrives with a biscuit."',
        'Test the repaired inference: point to the exact words that support it. "Walked to the back door and sat down" at "exactly four o\'clock," and Grandma "arrived at four fifteen with a biscuit in her coat pocket," are both in the passage. No outside belief is needed anywhere in the repaired sentence.',
      ],
      answer:
        'WRONG: "Bailey knows how to tell time, because dogs are smart animals." CORRECT: "Bailey has learned that four o\'clock means a visitor with a treat is coming soon, since he waits at the door at that exact time every day, right before Grandma arrives with a biscuit." Evidence: he "walked to the back door and sat down" at "exactly four o\'clock," and Grandma "always arrived at four fifteen with a biscuit in her coat pocket."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-explicit-statement',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the sentence that states something EXPLICITLY.\n\n"Leah checked the mailbox three times after school on Tuesday, even though the mail carrier never comes until four. When she finally saw the envelope with her name on it, she ran inside without shutting the door behind her."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Leah was nervous about what was inside the envelope while she waited.' },
        { id: 'b', text: 'Leah has been waiting for this letter for several weeks.' },
        { id: 'c', text: 'Leah checked the mailbox three times after school on Tuesday.', correct: true },
        { id: 'd', text: 'Leah\'s parents were not home yet.' },
      ],
      expectedAnswer: 'Leah checked the mailbox three times after school on Tuesday.',
      hints: [
        'An explicit statement is something the passage says in plain words. It does not need any figuring out.',
        'Reread the passage and look for a sentence you could point to word for word. Three of these choices are ideas the passage never actually states.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-valid-inference',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the statement that is a valid INFERENCE the passage supports.\n\n"Every time the fire drill bell rang, Mr. Alvarez\'s classroom was the first to line up outside, coats already zipped. The other classrooms usually straggled out half a minute later, some kids still holding pencils."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mr. Alvarez\'s classroom is always first to line up outside during a fire drill, with coats already zipped.' },
        { id: 'b', text: 'Mr. Alvarez must be the strictest teacher in the school.' },
        { id: 'c', text: 'The fire drill bell always rings twice.' },
        { id: 'd', text: 'Mr. Alvarez\'s class has practiced its fire-drill routine more than the other classes have.', correct: true },
      ],
      expectedAnswer: 'Mr. Alvarez\'s class has practiced its fire-drill routine more than the other classes have.',
      hints: [
        'One choice just repeats a sentence the passage already states. One brings in an idea the passage never mentions at all. Rule those out first.',
        'An inference has to be built from the details given: first every time, coats already zipped, and other classrooms still holding pencils. Which choice explains those details without adding anything the passage does not support?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-the-evidence',
      kind: 'try_yourself',
      problem:
        'Read the passage. A reader concludes: "Consistent watering helped Mr. Diallo\'s tomato plants grow taller than the plot next to his." Which sentence from the passage BEST supports that inference?\n\n"The tomato plants in Mr. Diallo\'s community garden plot were the tallest in the whole row, and he was the only gardener who watered his plot every single morning before school, rain or shine. The plot next to his, which belongs to Ms. Ortiz, had pale, drooping leaves by July."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He was the only gardener who watered his plot every single morning before school, rain or shine.', correct: true },
        { id: 'b', text: 'The tomato plants in Mr. Diallo\'s community garden plot were the tallest in the whole row.' },
        { id: 'c', text: 'The plot next to his had pale, drooping leaves by July.' },
        { id: 'd', text: 'The plot next to his belongs to Ms. Ortiz.' },
      ],
      expectedAnswer: 'He was the only gardener who watered his plot every single morning before school, rain or shine.',
      hints: [
        'The best evidence names the CAUSE behind the inference, not just the result. Ask which choice explains why one plot did better, not only that it did.',
        'Three of these choices are true statements from the passage, but only one describes what Mr. Diallo actually did every day. Find that sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-restating-and-assuming',
      kind: 'misconception_check',
      question:
        'A student reads this passage: "Jamal read the flyer for the school talent show twice and told his older sister he wanted to sign up before Friday. That night, she found him in the garage, practicing his card tricks in the mirror instead of doing his math homework." Then the student writes: "I can infer that Jamal wants to sign up for the talent show, since the text says he told his sister he wanted to sign up before Friday. I can also infer that Jamal will win the whole show, because kids who practice really hard always win." Two different things went wrong. What are they?',
      commonErrors: [
        {
          answer: 'I can infer that Jamal wants to sign up for the talent show, since the text says he told his sister he wanted to sign up before Friday.',
          misconception:
            'Calling a restated explicit line an inference. The student even points to the exact place the text says it, which is proof that nothing was actually figured out — the passage states this fact in plain words.',
          correctsTo:
            'Before calling something an inference, check whether the text already says it directly. Here, the passage states outright that Jamal "told his older sister he wanted to sign up before Friday," so repeating that idea is not an inference, it is a restatement of an explicit line. A real inference from this passage would use clues the text does not state directly — for instance, "practicing his card tricks in the mirror instead of doing his math homework" supports the inference that Jamal cares more about the talent show right now than about his other schoolwork.',
        },
        {
          answer: 'I can also infer that Jamal will win the whole show, because kids who practice really hard always win.',
          misconception:
            'Building the inference from an outside belief instead of the text\'s own evidence. "Kids who practice really hard always win" is an assumption brought in from outside the passage, and the passage never mentions a contest result at all.',
          correctsTo:
            'An inference has to be built only from details that are actually in the text, combined with logic, not from an outside rule the reader already believed. This passage never says anything about who wins the talent show, so no inference about winning can be drawn from it at all. Practicing hard is real evidence for something narrower: that Jamal is serious about doing well, not that he is guaranteed to win.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Explicit means the text states it directly, in words you can point to. Nothing needs figuring out.',
        'Inference means the text does not say it directly, but the details lead you there.',
        'Citing evidence means quoting or pointing to the exact words that prove your answer, not gesturing at "the story."',
        'If the text already says something outright, restating it is not an inference — it is an explicit fact repeated.',
        'A good inference stays inside the text\'s own details. An idea built from an outside belief or rule is an assumption, not an inference.',
        'Test every inference: name at least one exact phrase from the text that supports it. If you cannot, it is a guess.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Text Evidence & Inference' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
