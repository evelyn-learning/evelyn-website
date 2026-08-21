/**
 * Grade 7 ELA — Argument Writing: Evidence & Elaboration.
 *
 * Row 8.2 (CCSS W.7.1b), procedure-led. One idea runs the whole lesson:
 * evidence does not speak for itself. The three-part move is reason,
 * evidence, ELABORATION, and the elaboration is the sentence students
 * leave out. The traps it is built to kill are the quote bomb, elaboration
 * that only restates the evidence, and evidence that is true but irrelevant
 * to the reason it sits under.
 *
 * NOTE FOR FUTURE AUTHORS: every weak student sentence in this file is
 * labeled WEAK, with the STRONG version beside it, so a tutor reading aloud
 * can never present a quote bomb as a model. All excerpts are original prose
 * written for this lesson. No invented statistics anywhere — where a number
 * would be tempting, the text says "many students in our grade" instead.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U8_EVIDENCE_AND_ELABORATION: LessonPlan = {
  id: 'evelyn.ms.m7ela.evidence-and-elaboration.v1',
  title: 'Evidence & Elaboration',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.evidence-and-elaboration',
      standard: 'M7ELA-8.2',
      description:
        'Support each reason in an argument with relevant evidence — a fact, an example, an observation, an expert\'s statement or a fitting comparison — and then elaborate, writing the sentence that explains how that evidence proves that reason (CCSS W.7.1b).',
    },
  ],
  prerequisites: ['m7ela.claims-and-reasons'],
  followUps: ['m7ela.counterclaims'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a fact dropped in front of a listener does nothing until someone explains it.',
      script:
        'Try this at home tonight. Walk up to whoever decides your bedtime, say "my science project is due Thursday," and then stop talking. Just stand there. Nothing happens, because you have not said what that fact is supposed to prove. Now say it again and add one more sentence: "so if I go to bed at nine, I lose the only two evenings I have left to build it." That second sentence is the whole lesson. The fact never argued for you. You had to explain it. Writers forget this constantly. They drop a fact into a paragraph, feel finished, and walk away from the exact sentence where the argument was going to happen.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-and-elaboration',
      kind: 'concept',
      goal: 'Install the three-part move, define elaboration against restating, list what counts as evidence, and set the relevance test.',
      keyIdeas: [
        'EVIDENCE DOES NOT SPEAK FOR ITSELF. Every body paragraph you write runs the same three-part move, in this order. One: state the REASON, which is why your claim is true. Two: give the EVIDENCE, the real thing you can point at. Three: ELABORATE, meaning you explain how that evidence proves that reason. Reason, evidence, elaboration. Miss the third part and you have handed the reader a fact and asked them to build your argument for you.',
        'ELABORATION IS THE SENTENCE PEOPLE SKIP, and it is where the argument actually happens. It feels unnecessary while you write it, because you already believe your own point. The reader does not. Useful ways to start it: "This shows that ...", "This matters because ...", "The reason this proves my point is ...". Then finish the thought instead of trailing off.',
        'ELABORATING IS NOT REPEATING. Saying the evidence again in different words adds nothing. WEAK: "Six people had wet notebooks. This shows that six people had wet notebooks in their bags." STRONG: "Those notebooks were dry when the bags were packed that morning, so the rain got in while the bags sat on the wet ground." The strong version tells you something the evidence did not say out loud.',
        'FIVE THINGS COUNT AS EVIDENCE at your level, and you already have all five. A FACT you can check ("the late bus leaves at 4:15"). An EXAMPLE ("last Thursday the fifth-period line ran past the door"). An OBSERVATION you made yourself ("I counted eleven bikes and four spaces"). An EXPERT\'S STATEMENT ("our school nurse says most sprains happen on that stairwell"). A COMPARISON that fits ("the middle school across town gives its clubs thirty minutes and still ends at the same time"). Mix them. Do not invent numbers you did not count.',
        'EVIDENCE MUST BE ABOUT THE REASON IT SITS UNDER. This is the relevance test, and it takes five seconds. Say the reason out loud. Say the evidence out loud. Ask: does this make that reason more likely to be true? A fact can be completely true and still belong nowhere near your paragraph. If the reason is that the cafeteria is too loud, the number of tables in it is true and useless.',
        'STRONG FEELING IS NOT EVIDENCE, AND MORE IS NOT STRONGER. "Everyone hates it" and "this is so unfair" report how you feel, not what happened, so a reader who feels differently has nothing to answer. And stacking five facts under one reason is not five times as convincing. Two pieces of relevant evidence, each with a real elaboration sentence, beat six facts sitting there in a pile.',
      ],
      vocabulary: [
        { term: 'reason', definition: 'a statement of why your claim is true; each reason gets its own paragraph.' },
        { term: 'evidence', definition: 'the checkable thing you point at to back up a reason — a fact, an example, an observation, an expert\'s statement or a fitting comparison.' },
        { term: 'elaboration', definition: 'the sentence that explains how a piece of evidence proves the reason it sits under.' },
        { term: 'relevant', definition: 'actually about the reason being made, not just about the same general topic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-the-move',
      kind: 'worked_example',
      problem:
        'Build the three-part move. Claim: "Our grade should be allowed to eat lunch in the courtyard on dry days." Reason: "The cafeteria is too loud to hold a conversation in."',
      steps: [
        'Start with the reason, written as one plain sentence: "The cafeteria is too loud to hold a conversation in." That is the thing this paragraph has to prove. Everything after it works for that sentence.',
        'Pick evidence that is about THAT reason. An observation works well here, because you were there: "Last Tuesday my table gave up talking about five minutes in, and we sat four feet apart."',
        'Run the relevance test before going further. Reason: the cafeteria is too loud to talk in. Evidence: a table four feet wide stopped talking. Does the evidence make the reason more likely to be true? Yes. Compare a piece that fails the test: "The cafeteria has sixteen tables." True, checkable, and it proves nothing about noise.',
        'Now elaborate, which means explaining the part the reader cannot see. WEAK: "This shows the cafeteria is loud." That only says the reason over again. STRONG: "Four feet is close enough to hear a whisper in a normal room. If people that close have to stop trying, the noise is not a small annoyance — it is loud enough to shut down an ordinary conversation."',
        'Read the three sentences back in order and check that each one does a different job. Reason, then evidence, then elaboration. If the third sentence could be deleted without losing anything, it was a repeat, not an elaboration.',
      ],
      answer:
        'Reason: The cafeteria is too loud to hold a conversation in. Evidence: Last Tuesday my table gave up talking about five minutes in, and we sat four feet apart. Elaboration: Four feet is close enough to hear a whisper in a normal room, so if people that close have to stop trying, the noise is loud enough to shut down an ordinary conversation.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-quote-bomb',
      kind: 'worked_example',
      problem:
        'Repair this paragraph. "Our library should stay open for thirty minutes after the last bell. One reason is that students who wait for the late bus have nowhere quiet to go. Many students in our grade ride the late bus. The library has twelve tables and a printer."',
      steps: [
        'Find the reason. It is sentence two: students who wait for the late bus have nowhere quiet to go. Underline it in your head. The rest of the paragraph works for that sentence or it does not belong.',
        'Find the evidence. Sentence three, "Many students in our grade ride the late bus," is a real piece of evidence for that reason, but it is dropped in bare and then abandoned. That is a quote bomb: the writer puts the fact down and walks away.',
        'Run the relevance test on sentence four. Reason: late-bus students have nowhere quiet to go. Evidence: the library has twelve tables and a printer. Does that make the reason more likely to be true? No. It describes the room, not the need. It is true and irrelevant here, so it goes — it could support a different reason in a different paragraph, such as one about the library being big enough.',
        'Sharpen the evidence so it can be pointed at: "Many students in our grade ride the late bus, and it does not pull up until twenty-five minutes after the last bell."',
        'Now write the missing elaboration, the sentence that connects that wait to the reason. WEAK: "This shows that a lot of people ride the late bus." STRONG: "For twenty-five minutes those students have no assigned room, so they end up standing in the front hallway, which is the loudest place in the building at that hour."',
        'Read the repaired paragraph back: claim, reason, evidence, elaboration, and no stray facts. It is one sentence shorter than the original and it argues something, which the original did not.',
      ],
      answer:
        'Our library should stay open for thirty minutes after the last bell. One reason is that students who wait for the late bus have nowhere quiet to go. Many students in our grade ride the late bus, and it does not pull up until twenty-five minutes after the last bell. For twenty-five minutes those students have no assigned room, so they end up standing in the front hallway, which is the loudest place in the building at that hour. (The twelve tables and the printer are true, but they do not support this reason, so they are cut.)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-elaboration',
      kind: 'try_yourself',
      problem:
        'Reason: "Backpacks left on the ground outside the gym doors get soaked." Evidence: "After the rain last Thursday, six people in my gym class pulled damp notebooks out of their bags." Which sentence best elaborates — which one explains how the evidence proves the reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Six people in my gym class found damp notebooks in their bags after it rained last Thursday.' },
        { id: 'b', text: 'The gym doors are also the busiest doors in the whole building at the end of the day.' },
        { id: 'c', text: 'Those notebooks were dry when the bags were packed that morning, so the water reached them while the bags sat on the wet ground.', correct: true },
        { id: 'd', text: 'A rack would also keep the hallway clear, because people would stop piling their bags against the lockers.' },
      ],
      expectedAnswer: 'Those notebooks were dry when the bags were packed that morning, so the water reached them while the bags sat on the wet ground.',
      hints: [
        'Elaboration tells the reader something the evidence did not already say. Read each choice and ask whether it adds a new link or just repeats what you were told.',
        'Choice (a) says the evidence over again, (b) brings in a brand-new idea about crowded doors, and (d) argues for a different reason — a tidy hallway, not wet bags.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-evidence',
      kind: 'try_yourself',
      problem:
        'Reason: "The morning announcements are hard to follow because they are read too fast." Which piece of evidence actually supports THIS reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The announcements are read at 8:05 every morning, right after the second bell.' },
        { id: 'b', text: 'I asked eight people at my lunch table what time Friday\'s game started, and only one of them had caught it.', correct: true },
        { id: 'c', text: 'The announcements are honestly so annoying, and nobody in my grade likes sitting through them.' },
        { id: 'd', text: 'The speaker in our classroom crackles every time the heat comes on.' },
      ],
      expectedAnswer: 'I asked eight people at my lunch table what time Friday\'s game started, and only one of them had caught it.',
      hints: [
        'Say the reason out loud, then each choice out loud, and ask whether the choice makes that reason more likely to be true.',
        'Choice (a) is true but tells you nothing about speed, (c) reports a feeling instead of something that happened, and (d) supports a different reason about bad sound, not fast reading.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-finish-the-paragraph',
      kind: 'try_yourself',
      problem:
        'A student wrote: "Our club should meet on Wednesdays instead of Mondays. One reason is that Monday meetings keep half of our members from coming. Two of our four members have band rehearsal during the Monday meeting hour." Which sentence best finishes the paragraph?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Many students in our grade join two or three different clubs each year.' },
        { id: 'b', text: 'Band rehearsal cannot be moved and our meeting can, so the day we picked is what keeps those members away, not a lack of interest.', correct: true },
        { id: 'c', text: 'So two of our four members have band rehearsal at the same time as the Monday meeting.' },
        { id: 'd', text: 'Wednesday meetings would also let us use the bigger room, since the choir has Mondays in there.' },
      ],
      expectedAnswer: 'Band rehearsal cannot be moved and our meeting can, so the day we picked is what keeps those members away, not a lack of interest.',
      hints: [
        'The paragraph already has a reason and a piece of evidence. What is missing is the sentence that explains how the evidence proves the reason.',
        'Choice (c) restates the evidence, (a) introduces a new idea about joining clubs, and (d) argues for a different reason about room size.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-quote-bomb',
      kind: 'misconception_check',
      question:
        'A student defends a paragraph: "I put the fact in right after my reason, and it is a strong fact. The fact speaks for itself. Explaining it after that would just be repeating myself, and anyway I fit four facts in there, so it is a strong paragraph." What went wrong?',
      commonErrors: [
        {
          answer: 'The fact speaks for itself, so no explanation is needed.',
          misconception:
            'The quote bomb — dropping evidence into a paragraph and walking away, because the connection is obvious to the writer, who already agrees.',
          correctsTo:
            'Evidence never speaks for itself. It sits there being true while the reader decides what it means, and a reader who disagrees will decide it means nothing. You have to write the elaboration sentence that says how the evidence proves the reason. WEAK: "The late bus leaves at 4:15." STRONG: "The late bus leaves at 4:15, so those students spend twenty-five minutes with nowhere to go, which is exactly the gap an open library would fill." That second sentence is the argument. Without it there is no argument, only a fact.',
        },
        {
          answer: 'Four facts in one paragraph makes it stronger than two.',
          misconception:
            'Counting evidence instead of testing it — treating quantity as strength, and skipping the relevance test on every extra piece.',
          correctsTo:
            'Stacking facts does not multiply proof. Each piece has to pass the relevance test on its own: does this make THIS reason more likely to be true? A true fact that is not about the reason is dead weight, and it makes the paragraph harder to follow. Two relevant pieces, each with a real elaboration sentence, beat four facts in a pile every time.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The three-part move, in order: state the reason, give the evidence, then elaborate.',
        'Evidence does not speak for itself. The elaboration sentence is the one people skip, and it is where the argument actually happens.',
        'Elaborating is not repeating. If your sentence could be deleted without losing anything, it was a repeat.',
        'Five things count as evidence: a fact, an example, an observation you made, an expert\'s statement, and a comparison that fits.',
        'Run the relevance test on every piece: say the reason, say the evidence, and ask whether it makes that reason more likely to be true.',
        'Strong feeling is not evidence, and more evidence is not stronger than well-explained evidence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Evidence & Elaboration' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
