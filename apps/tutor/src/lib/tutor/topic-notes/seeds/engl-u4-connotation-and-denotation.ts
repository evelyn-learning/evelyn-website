/**
 * HS English — Unit 4 CED 4.2: Connotation & Denotation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.connotation-and-denotation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U4_CONNOTATION_AND_DENOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.connotation-and-denotation.v1',
  course: 'HS English',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Connotation & Denotation',
  planId: 'evelyn.hs.engl.connotation-and-denotation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.connotation-and-denotation.v1' }],
  theory: [
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Denotation', content: `DENOTATION — the literal, dictionary meaning of a word: the definition you would find printed in an entry. "Thrifty," "cheap," and "economical" share almost the same denotation: spending little money.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Connotation', content: `CONNOTATION — the emotional charge a word carries on top of that definition: the approval, disapproval, or neutrality a reader feels. "Thrifty" praises, "cheap" criticizes, "economical" simply reports. Same denotation, three different verdicts.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'The synonym ladder', content: `THE SYNONYM LADDER — near-synonyms line up on a ladder from positive to neutral to negative. Slender / thin / scrawny. Determined / persistent / stubborn. Curious / inquisitive / nosy. Frugal / economical / stingy. Naming the rungs is how a writer chooses instead of guessing.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Neutral is a choice too', content: `NEUTRAL IS A CHOICE TOO — the middle rung is not the absence of a decision. News reporting, lab writing, and formal analysis deliberately climb to the neutral rung so readers judge the facts rather than the wording.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Connotation shifts with context', content: `CONNOTATION SHIFTS WITH CONTEXT — charge is not welded to a word; the surrounding sentence bends it. "Aggressive" is an insult in "an aggressive coworker" and a compliment in "an aggressive treatment plan that saved the patient." Always test the word inside its actual sentence, not alone.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Loaded words steer readers', content: `LOADED WORDS STEER READERS — writers push judgment onto readers by swapping in charged near-synonyms while the facts stay identical. "A crowd gathered outside city hall" and "a mob gathered outside city hall" report the same event and argue opposite things. Spotting the swap is how you read persuasion instead of absorbing it.` },
    { loId: 'engl.connotation-and-denotation', kind: 'framework', title: 'Match the word to the intended effect', content: `MATCH THE WORD TO THE INTENDED EFFECT — the working question is never "is this word correct?" but "what does this word make my reader feel about my subject?" Decide the effect first, then pick the rung that produces it.` },
    { loId: 'engl.connotation-and-denotation', kind: 'definition', title: 'denotation', content: `the literal dictionary meaning of a word, stripped of any feeling attached to it.` },
    { loId: 'engl.connotation-and-denotation', kind: 'definition', title: 'connotation', content: `the positive, neutral, or negative emotional charge a word carries beyond its literal meaning.` },
    { loId: 'engl.connotation-and-denotation', kind: 'definition', title: 'loaded word', content: `a word chosen for its charge in order to push the reader toward a judgment the facts alone would not deliver.` },
  ],
  methods: [
    {
      title: 'Worked ladder choice',
      steps: [
        `Check the denotation first: all four words describe a person who refuses to change position. On dictionary meaning alone, every option is defensible, so denotation cannot decide this.`,
        `Name the intended effect: the writer wants readers to ADMIRE Amara. That means the blank needs a positive rung, not a neutral or negative one.`,
        `Sort the ladder by charge: "steadfast" is positive (loyal to a worthy goal); "stubborn" is mildly negative; "obstinate" is more negative and formal; "pigheaded" is bluntly insulting.`,
        `Select and test the word in the full sentence: "Even after two rejections, Amara remained STEADFAST about the recycling proposal." The sentence now praises her persistence, which is the effect the writer wanted. The three rejected options report the same behavior but blame her for it.`,
      ],
      example: { problem: `A student is writing a profile of a classmate who refused to abandon a recycling proposal after the student council rejected it twice. The student wants readers to admire her. Which word belongs in the blank? "Even after two rejections, Amara remained ___ about the recycling proposal." Options: steadfast, stubborn, obstinate, pigheaded.`, solution: `steadfast — the only positive rung on a ladder whose four words share the denotation "refusing to change position"` },
      relatedLoIds: ['engl.connotation-and-denotation'],
    },
    {
      title: 'Worked wrong charge',
      steps: [
        `Diagnose the error class: the student picked words whose DENOTATION was right and whose CONNOTATION was wrong. "Relentless" and "fanatic" both accurately denote someone who never lets up, so the student heard nothing wrong.`,
        `Test each word for charge in context. "Relentless" describes pressure that does not stop, and applied to a person supervising teenagers it reads as wearing rather than caring. "Fanatic" is stronger still: it denotes intense devotion but connotes loss of proportion, which turns a safety habit into an obsession.`,
        `Name the intended effect: gratitude. The note should make readers hear care and high standards, so both blanks need positive rungs.`,
        `Climb the ladder and revise: relentless becomes "consistent" or "unwavering"; fanatic becomes "meticulous" or "vigilant." Revised: "Coach Ruiz was unwavering about our warm-up routine, and she was meticulous about safety gear." The facts did not change at all — only the verdict the reader hears.`,
      ],
      example: { problem: `A student wants to compliment a coach in a thank-you note and writes: "Coach Ruiz was relentless about our warm-up routine, and she was a fanatic about safety gear." The student is surprised when a reader calls the note unflattering. What went wrong, and how should the sentence be revised?`, solution: `The student chose right-denotation, wrong-charge words; swapping "relentless" for "unwavering" and "fanatic" for "meticulous" keeps the meaning and delivers the intended praise` },
      relatedLoIds: ['engl.connotation-and-denotation'],
    },
  ],
  pointers: [
    { content: `Synonyms share a denotation, not a charge. "Collector" credits the grandmother with care and purpose; "hoarder" implies she cannot let go of things and that the pile is a problem. A thesaurus entry is a list of candidates on a ladder, never a list of equals — test each candidate inside the actual sentence and pick the rung that matches the effect you want.`, kind: 'common-error' },
    { content: `Denotation is the dictionary meaning; connotation is the positive, neutral, or negative charge the word carries on top of it.`, kind: 'tip' },
    { content: `Near-synonyms sit on a ladder — thrifty / economical / cheap — so decide the effect you want first, then pick the rung that produces it.`, kind: 'tip' },
    { content: `Charge shifts with context: test the word inside its actual sentence, because "aggressive coworker" and "aggressive treatment" pull opposite ways.`, kind: 'tip' },
    { content: `Loaded words argue while pretending to report — swapping "crowd" for "mob" changes no facts and changes every verdict, in your writing and in what you read.`, kind: 'tip' },
    { content: `Don't say a word "means" something negative when you mean it *connotes* something negative. Denotation = the dictionary entry; connotation = the verdict the reader hears. "Mob" and "crowd" have the same denotation and opposite connotations.`, kind: 'vocab-note' },
    { content: `A thesaurus lists candidates, not equals. Never swap in a synonym you haven't tested inside your own sentence — "collector" and "hoarder" both fit the definition, only one respects your grandmother.`, kind: 'common-error' },
    { content: `Right denotation + wrong charge is still a wrong word. If your praise reads as an insult ("Coach Ruiz was relentless"), the definition was fine — the rung was not. Ask "what will my reader feel?" not "is this correct?"`, kind: 'gotcha' },
    { content: `Charge is not welded to a word. "Aggressive coworker" insults; "aggressive treatment plan" praises. Judge the word in its actual sentence and subject, never in isolation or from memory.`, kind: 'edge-case' },
    { content: `Neutral is an active choice, not a failure to decide. Reporting, lab writes, and analysis climb *to* the middle rung on purpose. Don't mark a neutral word "boring" or "weak word choice" when precision was the goal.`, kind: 'tip' },
    { content: `When you identify a loaded word, say what judgment it pushes and what the neutral version would be — "'mob' implies violence and disorder; the neutral word is 'crowd.'" Naming the charge without the contrast isn't analysis.`, kind: 'tip' },
    { content: `Ladder rungs are degrees, not two piles. "Stubborn," "obstinate," and "pigheaded" are all negative but escalate in bluntness — pick the one matching how hard you want to hit, not just the right side of the ladder.`, kind: 'edge-case' },
    { content: `Don't change the facts while you change the charge. Revising "fanatic" to "meticulous" keeps every detail identical; if your revision adds new claims, you've rewritten the sentence instead of re-tuning its connotation.`, kind: 'common-error' },
  ],
};
