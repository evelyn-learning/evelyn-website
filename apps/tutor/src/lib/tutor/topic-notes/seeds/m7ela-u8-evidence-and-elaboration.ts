/**
 * Grade 7 English Language Arts — Unit 8 CED 8.2: Evidence & Elaboration.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.evidence-and-elaboration.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U8_EVIDENCE_AND_ELABORATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.evidence-and-elaboration.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Evidence & Elaboration',
  planId: 'evelyn.ms.m7ela.evidence-and-elaboration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.evidence-and-elaboration.v1' }],
  theory: [
    { loId: 'm7ela.evidence-and-elaboration', content: `EVIDENCE DOES NOT SPEAK FOR ITSELF. Every body paragraph you write runs the same three-part move, in this order. One: state the REASON, which is why your claim is true. Two: give the EVIDENCE, the real thing you can point at. Three: ELABORATE, meaning you explain how that evidence proves that reason. Reason, evidence, elaboration. Miss the third part and you have handed the reader a fact and asked them to build your argument for you.` },
    { loId: 'm7ela.evidence-and-elaboration', content: `ELABORATION IS THE SENTENCE PEOPLE SKIP, and it is where the argument actually happens. It feels unnecessary while you write it, because you already believe your own point. The reader does not. Useful ways to start it: "This shows that ...", "This matters because ...", "The reason this proves my point is ...". Then finish the thought instead of trailing off.` },
    { loId: 'm7ela.evidence-and-elaboration', content: `ELABORATING IS NOT REPEATING. Saying the evidence again in different words adds nothing. WEAK: "Six people had wet notebooks. This shows that six people had wet notebooks in their bags." STRONG: "Those notebooks were dry when the bags were packed that morning, so the rain got in while the bags sat on the wet ground." The strong version tells you something the evidence did not say out loud.` },
    { loId: 'm7ela.evidence-and-elaboration', content: `FIVE THINGS COUNT AS EVIDENCE at your level, and you already have all five. A FACT you can check ("the late bus leaves at 4:15"). An EXAMPLE ("last Thursday the fifth-period line ran past the door"). An OBSERVATION you made yourself ("I counted eleven bikes and four spaces"). An EXPERT'S STATEMENT ("our school nurse says most sprains happen on that stairwell"). A COMPARISON that fits ("the middle school across town gives its clubs thirty minutes and still ends at the same time"). Mix them. Do not invent numbers you did not count.` },
    { loId: 'm7ela.evidence-and-elaboration', content: `EVIDENCE MUST BE ABOUT THE REASON IT SITS UNDER. This is the relevance test, and it takes five seconds. Say the reason out loud. Say the evidence out loud. Ask: does this make that reason more likely to be true? A fact can be completely true and still belong nowhere near your paragraph. If the reason is that the cafeteria is too loud, the number of tables in it is true and useless.` },
    { loId: 'm7ela.evidence-and-elaboration', content: `STRONG FEELING IS NOT EVIDENCE, AND MORE IS NOT STRONGER. "Everyone hates it" and "this is so unfair" report how you feel, not what happened, so a reader who feels differently has nothing to answer. And stacking five facts under one reason is not five times as convincing. Two pieces of relevant evidence, each with a real elaboration sentence, beat six facts sitting there in a pile.` },
    { loId: 'm7ela.evidence-and-elaboration', kind: 'definition', title: 'reason', content: 'a statement of why your claim is true; each reason gets its own paragraph.' },
    { loId: 'm7ela.evidence-and-elaboration', kind: 'definition', title: 'evidence', content: `the checkable thing you point at to back up a reason — a fact, an example, an observation, an expert's statement or a fitting comparison.` },
    { loId: 'm7ela.evidence-and-elaboration', kind: 'definition', title: 'elaboration', content: `the sentence that explains how a piece of evidence proves the reason it sits under.` },
    { loId: 'm7ela.evidence-and-elaboration', kind: 'definition', title: 'relevant', content: 'actually about the reason being made, not just about the same general topic.' },
  ],
  methods: [
    {
      title: 'Worked build the move',
      steps: [
        `Start with the reason, written as one plain sentence: "The cafeteria is too loud to hold a conversation in." That is the thing this paragraph has to prove. Everything after it works for that sentence.`,
        `Pick evidence that is about THAT reason. An observation works well here, because you were there: "Last Tuesday my table gave up talking about five minutes in, and we sat four feet apart."`,
        `Run the relevance test before going further. Reason: the cafeteria is too loud to talk in. Evidence: a table four feet wide stopped talking. Does the evidence make the reason more likely to be true? Yes. Compare a piece that fails the test: "The cafeteria has sixteen tables." True, checkable, and it proves nothing about noise.`,
        `Now elaborate, which means explaining the part the reader cannot see. WEAK: "This shows the cafeteria is loud." That only says the reason over again. STRONG: "Four feet is close enough to hear a whisper in a normal room. If people that close have to stop trying, the noise is not a small annoyance — it is loud enough to shut down an ordinary conversation."`,
        `Read the three sentences back in order and check that each one does a different job. Reason, then evidence, then elaboration. If the third sentence could be deleted without losing anything, it was a repeat, not an elaboration.`,
      ],
      example: { problem: `Build the three-part move. Claim: "Our grade should be allowed to eat lunch in the courtyard on dry days." Reason: "The cafeteria is too loud to hold a conversation in."`, solution: `Reason: The cafeteria is too loud to hold a conversation in. Evidence: Last Tuesday my table gave up talking about five minutes in, and we sat four feet apart. Elaboration: Four feet is close enough to hear a whisper in a normal room, so if people that close have to stop trying, the noise is loud enough to shut down an ordinary conversation.` },
      relatedLoIds: ['m7ela.evidence-and-elaboration'],
    },
    {
      title: 'Worked repair quote bomb',
      steps: [
        `Find the reason. It is sentence two: students who wait for the late bus have nowhere quiet to go. Underline it in your head. The rest of the paragraph works for that sentence or it does not belong.`,
        `Find the evidence. Sentence three, "Many students in our grade ride the late bus," is a real piece of evidence for that reason, but it is dropped in bare and then abandoned. That is a quote bomb: the writer puts the fact down and walks away.`,
        `Run the relevance test on sentence four. Reason: late-bus students have nowhere quiet to go. Evidence: the library has twelve tables and a printer. Does that make the reason more likely to be true? No. It describes the room, not the need. It is true and irrelevant here, so it goes — it could support a different reason in a different paragraph, such as one about the library being big enough.`,
        `Sharpen the evidence so it can be pointed at: "Many students in our grade ride the late bus, and it does not pull up until twenty-five minutes after the last bell."`,
        `Now write the missing elaboration, the sentence that connects that wait to the reason. WEAK: "This shows that a lot of people ride the late bus." STRONG: "For twenty-five minutes those students have no assigned room, so they end up standing in the front hallway, which is the loudest place in the building at that hour."`,
        `Read the repaired paragraph back: claim, reason, evidence, elaboration, and no stray facts. It is one sentence shorter than the original and it argues something, which the original did not.`,
      ],
      example: { problem: `Repair this paragraph. "Our library should stay open for thirty minutes after the last bell. One reason is that students who wait for the late bus have nowhere quiet to go. Many students in our grade ride the late bus. The library has twelve tables and a printer."`, solution: `Our library should stay open for thirty minutes after the last bell. One reason is that students who wait for the late bus have nowhere quiet to go. Many students in our grade ride the late bus, and it does not pull up until twenty-five minutes after the last bell. For twenty-five minutes those students have no assigned room, so they end up standing in the front hallway, which is the loudest place in the building at that hour. (The twelve tables and the printer are true, but they do not support this reason, so they are cut.)` },
      relatedLoIds: ['m7ela.evidence-and-elaboration'],
    },
  ],
  pointers: [
    { content: `Students often say "The fact speaks for itself, so no explanation is needed." — Evidence never speaks for itself. It sits there being true while the reader decides what it means, and a reader who disagrees will decide it means nothing. You have to write the elaboration sentence that says how the evidence proves the reason. WEAK: "The late bus leaves at 4:15." STRONG: "The late bus leaves at 4:15, so those students spend twenty-five minutes with nowhere to go, which is exactly the gap an open library would fill." That second sentence is the argument. Without it there is no argument, only a fact.`, kind: 'common-error' },
    { content: `Students often say "Four facts in one paragraph makes it stronger than two." — Stacking facts does not multiply proof. Each piece has to pass the relevance test on its own: does this make THIS reason more likely to be true? A true fact that is not about the reason is dead weight, and it makes the paragraph harder to follow. Two relevant pieces, each with a real elaboration sentence, beat four facts in a pile every time.`, kind: 'common-error' },
    { content: `The three-part move, in order: state the reason, give the evidence, then elaborate.`, kind: 'tip' },
    { content: `Evidence does not speak for itself. The elaboration sentence is the one people skip, and it is where the argument actually happens.`, kind: 'tip' },
    { content: `Elaborating is not repeating. If your sentence could be deleted without losing anything, it was a repeat.`, kind: 'tip' },
    { content: `Five things count as evidence: a fact, an example, an observation you made, an expert's statement, and a comparison that fits.`, kind: 'tip' },
    { content: `Run the relevance test on every piece: say the reason, say the evidence, and ask whether it makes that reason more likely to be true.`, kind: 'tip' },
    { content: `Strong feeling is not evidence, and more evidence is not stronger than well-explained evidence.`, kind: 'tip' },
    { content: `Don't mix up **reason** and **evidence**. A reason is *why your claim is true* ("the cafeteria is too loud to talk in"). Evidence is the checkable thing you point at ("my table gave up talking four feet apart"). If you can't check it, it's a reason, not evidence.`, kind: 'vocab-note' },
    { content: `Delete-test your last sentence. If you can cross out your elaboration and the paragraph loses nothing, you repeated the evidence instead of explaining it. "This shows the cafeteria is loud" fails. Say something the evidence did NOT say out loud.`, kind: 'tip' },
    { content: `"This shows that..." is a starter, not a finish line. Half the class writes "This shows that a lot of people ride the late bus" and stops. Keep going until you've said what that FACT MEANS for the reason — the part the reader can't see.`, kind: 'common-error' },
    { content: `A fact can be 100% true and still not belong. "The library has twelve tables" is true; under a reason about needing a quiet place, it proves nothing. Don't defend an irrelevant fact by saying "but it's true." Cut it or move it to a paragraph it fits.`, kind: 'gotcha' },
    { content: `"Everyone hates it," "it's so unfair," and "nobody likes Mondays" are feelings, not evidence. A reader who feels the opposite has nothing to answer. Swap in something countable: what you saw, who said it, what happened last Thursday.`, kind: 'common-error' },
    { content: `An observation counts as evidence — but only if you actually observed it. "I counted eleven bikes and four spaces" is fine. Inventing "about 80% of students" because it sounds official is not. Don't make up numbers you didn't count.`, kind: 'edge-case' },
    { content: `More evidence isn't stronger evidence. Four bare facts in a row is a quote-bomb pile, not an argument. Two pieces, each with its own real elaboration sentence, wins — and every extra piece must pass the relevance test on its own.`, kind: 'gotcha' },
    { content: `Keep the order: reason, evidence, elaboration. Leading with a quote or fact and adding the reason later leaves the reader guessing what the fact is doing there. Read your three sentences back and check each one does a different job.`, kind: 'tip' },
  ],
};
