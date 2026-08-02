/**
 * HS English — Unit 9 CED 9.3: Transitions & Cohesion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.transitions-and-cohesion.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U9_TRANSITIONS_AND_COHESION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.transitions-and-cohesion.v1',
  course: 'HS English',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Transitions & Cohesion',
  planId: 'evelyn.hs.engl.transitions-and-cohesion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.transitions-and-cohesion.v1' }],
  theory: [
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'Relationship first', content: `RELATIONSHIP FIRST — before you reach for a word, say the connection out loud in plain language: "the second sentence adds another reason", "the second sentence pushes back", "the second sentence is what happened because of the first." Name the relationship, THEN pick the transition. Writers who pick the word first end up choosing whatever sounds impressive.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'The transition families', content: `THE TRANSITION FAMILIES — ADDITION (also, in addition, furthermore, moreover) stacks another point on the same side. CONTRAST (however, but, on the other hand, in contrast) turns against the point just made. CAUSE AND EFFECT (therefore, as a result, consequently, so) says the first idea produced the second. EXAMPLE (for example, for instance, specifically) narrows to one concrete case. SEQUENCE AND TIME (first, next, meanwhile, later, finally) orders events on a clock, not on a logic chain. CONCESSION (although, granted, admittedly) gives ground before pivoting back.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'Sequence is not cause', content: `SEQUENCE IS NOT CAUSE — "later" means it happened after; "therefore" means it happened because. Two events can share a timeline without one producing the other, and swapping these two families invents a cause the writing never proved.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'The sprinkle error', content: `THE SPRINKLE ERROR — transitions cannot repair a paragraph whose ideas are in the wrong order. If a reader gets lost, the first question is whether the sentences are sequenced correctly, not which connector is missing. Sprinkling "moreover" and "furthermore" over scrambled ideas is like labeling the doors of a house you built backwards.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'Cohesion beyond transition words', content: `COHESION BEYOND TRANSITION WORDS — most of a paragraph's flow comes from REPEATED KEY NOUNS. Name the thing, then name it again: "The mural took three weekends. The mural now covers the north wall of the gym." Swapping in a fresh synonym every sentence looks varied and reads like a new topic each time.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'Pronoun threads', content: `PRONOUN THREADS — a pronoun is a thread back to a noun the reader already holds. That thread only works when there is exactly one noun it could point to. "The coaches met the referees, and they apologized" snaps the thread; "the referees apologized" repairs it. Vague "this" and "it" openers are the most common cohesion break in student writing.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'The fancy-word trap', content: `THE FANCY-WORD TRAP — "moreover" is the word writers reach for when they want a sentence to sound finished. It means ADDITION. If the next sentence actually turns against the one before it, the honest word is "but" or "however", and the fancier word quietly tells the reader the opposite of what you meant.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'framework', title: 'Read both sides', content: `READ BOTH SIDES — a transition sits between two sentences and belongs to both. Read the full sentence before it and the full sentence after it, all the way to the period, because a qualifier late in the second sentence often flips the relationship you thought you had.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'definition', title: 'transition', content: `a word or phrase that names the logical relationship between two ideas — addition, contrast, cause, example, or sequence.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'definition', title: 'cohesion', content: `the sense that sentences belong to one paragraph, built mainly from repeated key nouns and clear pronoun threads.` },
    { loId: 'engl.transitions-and-cohesion', kind: 'definition', title: 'pronoun thread', content: `the link from a pronoun back to the one noun it stands for; it breaks when more than one noun could fit.` },
  ],
  methods: [
    {
      title: 'Worked name the relationship',
      steps: [
        `Cover the choices. Read only the sentence before and the sentence after the blank, all the way to the period.`,
        `Say the relationship in plain language: the second sentence lists jobs the staff does, and the blank sentence names one more job they do. That is another item on the same side — ADDITION.`,
        `Now check the families. "However" is contrast, but nothing turns against the list. "For example" would need ad-selling to be an instance of writing, shooting, and laying out, and it is a separate job instead. "Therefore" would claim the layout work caused the ad sales, which the passage never says.`,
        `Only "In addition" belongs to the addition family: "In addition, they sell the ads that pay for the printing."`,
      ],
      example: { problem: `Choose the best transition for the blank: "The school newspaper prints a short issue every month. The staff writes every article, shoots every photo, and lays out every page. ___, they sell the ads that pay for the printing." (a) However (b) In addition (c) For example (d) Therefore`, solution: `(b) In addition — the blank sentence adds one more job to the list, so the relationship is addition.` },
      relatedLoIds: ['engl.transitions-and-cohesion'],
    },
    {
      title: 'Worked wrong relationship',
      steps: [
        `Resist the ear. A transition can sound perfectly natural and still name the wrong relationship, because "moreover" carries a finished, formal tone that masks its meaning.`,
        `Name the relationship without the word: sentence one sets up an expectation (a kiln in January, projects fired on time). Sentence two reports the opposite outcome (the kiln showed up in the final week). The second sentence turns against the first.`,
        `That is CONTRAST. Check what "moreover" actually signals: addition — another point on the SAME side. It tells the reader that the late delivery agrees with the plan, which is the reverse of the truth.`,
        `Replace it with a contrast-family word: "However, the kiln did not arrive until the last week of school." The rhythm is identical and the logic is now honest.`,
        `The lesson: a smooth-sounding transition is not a correct one. Name the relationship, then confirm the word belongs to that family.`,
      ],
      example: { problem: `A student writes: "The ceramics class ordered a new kiln in January so that everyone could fire final projects on time. Moreover, the kiln did not arrive until the last week of school." The sentence reads smoothly out loud. Is the transition right?`, solution: `No — the relationship is contrast, not addition, so "Moreover" should be "However": "However, the kiln did not arrive until the last week of school."` },
      relatedLoIds: ['engl.transitions-and-cohesion'],
    },
  ],
  pointers: [
    { content: `A transition earns its place only when the relationship between two ideas would otherwise be unclear. Stacking connectors makes every sentence sound equally emphatic and hides which links actually matter, and a transition can never fix ideas that are in the wrong order. Cut the ones that mark nothing, verify that each remaining word matches its relationship, and carry the rest of the flow with repeated key nouns and clear pronoun threads.`, kind: 'common-error' },
    { content: `Name the logical relationship in plain language FIRST — addition, contrast, cause and effect, example, sequence, concession — then pick a word from that family.`, kind: 'tip' },
    { content: 'Sequence is not cause: "later" marks time, "therefore" claims a result.', kind: 'tip' },
    { content: `A transition cannot fix an order problem, and more transitions do not mean better flow.`, kind: 'tip' },
    { content: `Most cohesion is quiet: repeat the key noun instead of hunting for synonyms, and keep every pronoun pointing at exactly one noun.`, kind: 'tip' },
    { content: `Read the full sentence on BOTH sides of a transition — a late qualifier often flips the relationship.`, kind: 'tip' },
    { content: `"Moreover" and "furthermore" mean ADDITION, not "and now my big point." If the next sentence turns against the one before it, write **however** or **but**. A formal-sounding word that names the wrong relationship tells the reader the opposite of what you meant.`, kind: 'common-error' },
    { content: `Don't let "therefore" or "as a result" do the work of "later" or "then." Two events on the same timeline aren't automatically cause and effect — using a cause word invents a claim your paragraph never proved.`, kind: 'gotcha' },
    { content: `Read the full sentence on BOTH sides of the blank, all the way to the period. A qualifier tucked at the end of the second sentence ("...but only in the fall") can flip addition into contrast after you've already picked a word.`, kind: 'tip' },
    { content: `A pronoun thread breaks when two nouns could fit. "The coaches met the referees, and they apologized" — who apologized? Name the noun: "the referees apologized." Sentence-opening "This" and "It" with no clear antecedent are the top cohesion break.`, kind: 'common-error' },
    { content: `Repeating a key noun is not a style flaw. Swapping in a fresh synonym each sentence (mural → artwork → piece → installation) reads like four different topics. Repeat the noun; vary the sentence instead.`, kind: 'gotcha' },
    { content: `If a paragraph feels confusing, check the ORDER of the sentences before you add a connector. No transition can rescue ideas arranged backwards — you'd just be labeling the doors of a badly built house.`, kind: 'tip' },
    { content: `"For example" requires the second sentence to be an INSTANCE of the first, not just a related fact. Selling ads isn't an example of writing articles — it's an additional job, so it takes an addition word.`, kind: 'edge-case' },
    { content: `A transition earns its place only when the relationship would otherwise be unclear. Fronting every sentence with "Moreover... Furthermore... Additionally..." makes all links sound equally loud and hides the ones that matter. Cut the ones marking nothing.`, kind: 'common-error' },
  ],
};
