/**
 * HS English — Unit 7 CED 7.3: Nonfiction Text Structures.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.text-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U7_TEXT_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.text-structure.v1',
  course: 'HS English',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Nonfiction Text Structures',
  planId: 'evelyn.hs.engl.text-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.text-structure.v1' }],
  theory: [
    { loId: 'engl.text-structure', kind: 'framework', title: 'Chronological / sequence', content: `CHRONOLOGICAL / SEQUENCE — ideas are arranged by time or by order of steps. Signal words: first, then, next, later, in 1998, by the following spring, finally. Relationship test: does each idea come AFTER the one before it in time or in procedure? Recipes, histories, and process explanations live here.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'Cause and effect', content: `CAUSE AND EFFECT — one thing produces another. Signal words: because, since, therefore, as a result, consequently, led to. Relationship test: could you rewrite the passage as "X happened, so Y happened" without lying about it? If the second idea would still be true had the first never occurred, the relationship is not cause and effect.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'Compare and contrast', content: `COMPARE AND CONTRAST — two or more subjects are held up against each other. Signal words: however, both, unlike, whereas, similarly, on the other hand. Relationship test: are the same categories applied to two subjects? Watch for the block pattern (all of subject A, then all of subject B) as well as the point-by-point pattern, which alternates.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'Problem and solution', content: `PROBLEM AND SOLUTION — a difficulty is named, then a fix is proposed or reported. Signal words: the challenge, one difficulty, to address this, the answer, resolved. Relationship test: is there something clearly broken or unmet in the first part, and does the second part act on it? A text can describe a problem without this structure; the fix has to actually appear.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'Description', content: `DESCRIPTION — a single subject is expanded through its features, examples, or parts, with no time order, no comparison, and no fix. Signal words are the weakest here: for example, such as, characteristics, in addition. Relationship test: are the ideas siblings, each adding another detail about one subject, rather than leading into one another? Description is the default when nothing else fits.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'The relationship test beats signal words', content: `THE RELATIONSHIP TEST BEATS SIGNAL WORDS — signal words are a hint, never a verdict. "Because" can appear inside a supporting detail of a compare and contrast piece; a date can appear inside a description. Read for how the IDEAS relate across the whole excerpt, and when the words and the relationships disagree, trust the relationships.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'The signal-word-only error', content: `THE SIGNAL-WORD-ONLY ERROR — the most common mistake is scanning for one word, spotting "because" or "however," and labeling the whole text from it. That is reading one tile and naming the mosaic. A single connective describes the link between two sentences; structure describes the link between the parts of the whole.` },
    { loId: 'engl.text-structure', kind: 'framework', title: 'Structure serves purpose', content: `STRUCTURE SERVES PURPOSE — writers do not pick a shape at random. Comparison exists to help a reader choose or judge; problem and solution exists to move a reader toward action; chronology exists to make a process repeatable or a history followable; cause and effect exists to explain why. Naming the structure is step one; step two is asking what that choice does for the writer.` },
    { loId: 'engl.text-structure', kind: 'definition', title: 'text structure', content: `the organizational pattern a writer uses to arrange the ideas in a nonfiction text.` },
    { loId: 'engl.text-structure', kind: 'definition', title: 'signal words', content: `transition words that hint at a structure (because, however, first, to address this) — evidence, but not proof.` },
    { loId: 'engl.text-structure', kind: 'definition', title: 'dominant structure', content: `the pattern that organizes a text as a whole, even when smaller patterns appear inside its parts.` },
  ],
  methods: [
    {
      title: 'Worked relationships over words',
      steps: [
        `Do not start with the words — start by labeling what each sentence DOES. S1 names something broken (a third of the water lost). S2 reports an action taken on it. S3 reports the result of that action.`,
        `Now check the tempting label. There are two dates, 2021 and "within two years," which pulls toward chronological. But test it: is the passage ABOUT a sequence of events, or is the sequence just how a fix gets reported? Remove the dates and the excerpt still holds together as broken-thing, fix, outcome. That means time is a detail here, not the organizing idea.`,
        `Test cause and effect the same way. The tubing does cause the drop, so there is a causal link inside the passage. But the excerpt does not exist to explain why pipes crack; it exists to present a difficulty and what was done about it.`,
        `Apply the problem and solution test directly: is something clearly unmet in the first part, and does a later part act on it? Yes to both, and the outcome sentence confirms the fix worked.`,
        `Label it problem and solution, with chronological and causal details serving inside that frame.`,
      ],
      example: { problem: `Identify the structure of this excerpt, using the relationship test rather than the signal words: "For years the town of Ridgeline lost nearly a third of its drinking water to pipes that cracked every summer. In 2021 the water district began replacing the oldest mains with flexible tubing that expands in heat. Losses fell below five percent within two years."`, solution: `Problem and solution — S1 states the water loss, S2 gives the fix, S3 reports the result; the dates are supporting detail, not the organizing pattern` },
      relatedLoIds: ['engl.text-structure'],
    },
    {
      title: 'Worked because trap',
      steps: [
        `Find where the signal word actually sits. "Because" appears in the middle of sentence two, linking one garden type to one mechanism. It governs a detail, not the excerpt.`,
        `Now label the parts. S1 announces two subjects and states that they share an outcome but differ in method. S2 covers subject A. S3 covers subject B, and the word "instead" marks the pivot.`,
        `Ask the compare and contrast relationship test: are the same categories applied to two subjects? Yes — how each garden cools, treated one after the other. That is the block pattern.`,
        `The student read one tile and named the mosaic. The cause and effect link inside S2 is real, but it is nested inside a comparison; the comparison is what holds the three sentences together.`,
        `Correct the label and keep the nuance: the dominant structure is compare and contrast, and the causal detail is doing work for subject A only.`,
      ],
      example: { problem: `A student reads this excerpt, sees "because," and labels it cause and effect: "Rooftop gardens and ground-level gardens both cool a building, but they do it in different ways. A rooftop garden lowers the roof temperature directly, because the soil layer absorbs sunlight before it ever reaches the roof membrane. A ground-level garden instead cools the air around the building, which the vents then draw inside." What did the student miss?`, solution: `The excerpt is compare and contrast overall — "because" governs only a detail inside sentence two, while S1 sets up two subjects and S2 and S3 treat them in matching terms` },
      relatedLoIds: ['engl.text-structure'],
    },
  ],
  pointers: [
    { content: `Dates are signal words, and signal words are hints, not verdicts. Chronological structure means TIME is what orders the parts: remove the sequence and the text falls apart. In a profile, the dates are simply two more facts about one subject, sitting alongside its span, its color, and its traffic count. Those facts are siblings rather than a chain, which makes the structure description.`, kind: 'common-error' },
    { content: `Five patterns: chronological, cause and effect, compare and contrast, problem and solution, and description.`, kind: 'tip' },
    { content: `Signal words are evidence, not proof — when the words and the idea-relationships disagree, trust the relationships.`, kind: 'tip' },
    { content: `One connective describes a link between two sentences; structure describes how the whole text is put together, so never label a text from a single "because" or "however."`, kind: 'tip' },
    { content: `Most real nonfiction mixes patterns; name the dominant one and treat the rest as detail work inside it.`, kind: 'tip' },
    { content: `Finish the job by asking why: comparison helps a reader judge, problem and solution pushes toward action, chronology makes a process followable, cause and effect explains.`, kind: 'tip' },
    { content: `Never label a whole text from one connective. "Because" in sentence two governs a detail; structure governs the parts of the whole. Ask what each sentence *does* before you name the pattern.`, kind: 'common-error' },
    { content: `Dates ≠ chronological. If you can delete the dates and the passage still holds together, time is a supporting detail, not the organizing pattern. Chronological means removing the sequence makes the text fall apart.`, kind: 'gotcha' },
    { content: `Say "dominant structure," not "the structure." Real nonfiction nests patterns — a causal link can live inside a comparison, a timeline inside a problem-solution. Name the frame, then note what the smaller patterns do inside it.`, kind: 'vocab-note' },
    { content: `A text that only complains isn't problem and solution. The fix has to actually appear in the passage. If a difficulty is named and expanded with examples but never acted on, that's description.`, kind: 'edge-case' },
    { content: `Compare and contrast comes in two shapes: **block** (all of A, then all of B) and **point-by-point** (alternating by category). Block-pattern texts get misread as description because subject A's paragraph looks like a list of features.`, kind: 'gotcha' },
    { content: `Use the cause-and-effect counterfactual: if the second idea would still be true even if the first had never happened, it isn't cause and effect — it's just two things in a row.`, kind: 'tip' },
    { content: `Description is the default, not the throwaway. Pick it when ideas are *siblings* — each adding another detail about one subject — rather than leading into one another. Its signal words (for example, such as, in addition) are the weakest, so lean on the relationship test.`, kind: 'vocab-note' },
    { content: `Naming the structure is only half the answer. Finish with *why*: comparison helps a reader judge, problem and solution pushes toward action, chronology makes a process repeatable, cause and effect explains.`, kind: 'tip' },
  ],
};
