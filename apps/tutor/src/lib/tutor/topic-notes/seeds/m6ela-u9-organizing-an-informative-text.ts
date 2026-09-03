/**
 * Grade 6 English Language Arts — Unit 9 CED 9.1: Organizing an Informative Text.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.organizing-an-informative-text.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U9_ORGANIZING_AN_INFORMATIVE_TEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.organizing-an-informative-text.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Organizing an Informative Text',
  planId: 'evelyn.ms.m6ela.organizing-an-informative-text.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.organizing-an-informative-text.v1' }],
  theory: [
    { loId: 'm6ela.organizing-an-informative-text', content: `AN INFORMATIVE PIECE NEEDS ONE ORGANIZING STRATEGY, CHOSEN BEFORE YOU DRAFT ANY SUPPORTING SENTENCES. The strategy decides which sentence belongs next, so picking it first keeps every sentence pointed at the same job instead of wandering.` },
    { loId: 'm6ela.organizing-an-informative-text', content: `DEFINITION STRATEGY explains what something is by naming its key features one at a time. It fits a topic the reader has probably never heard explained before, such as a new school policy or an unfamiliar object.` },
    { loId: 'm6ela.organizing-an-informative-text', content: `CLASSIFICATION STRATEGY sorts a topic into two or more groups or kinds and explains each group in turn. It fits a topic that naturally splits into kinds, such as the different categories of prizes in a raffle.` },
    { loId: 'm6ela.organizing-an-informative-text', content: `COMPARISON/CONTRAST STRATEGY sets two specific things side by side and explains how they are alike and different. It fits a topic that is really about two named things, not about one thing alone or a topic sorted into several kinds.` },
    { loId: 'm6ela.organizing-an-informative-text', content: `CAUSE/EFFECT STRATEGY explains why something happens or what happens as a result of it. It fits a topic that is really an explanation of why something is true, not a list of what is true.` },
    { loId: 'm6ela.organizing-an-informative-text', content: `THE TOPIC DECIDES THE STRATEGY, AND ONE PIECE USES ONLY ONE. Ask what kind of information you actually gathered, then pick the strategy built for that kind of information, and never switch strategies partway through. WRONG: an opening that sorts a topic into groups, classification, followed by a sentence that suddenly weighs two of those groups against each other with no signal that the strategy changed. CORRECT: pick classification and describe every group the same way, or pick comparison/contrast and never introduce a third group at all. Using two strategies at once does not cover more ground; it forces the reader to guess which idea is actually organizing the piece.` },
    { loId: 'm6ela.organizing-an-informative-text', kind: 'definition', title: 'organizing strategy', content: `the one shape a writer chooses to arrange an informative piece's ideas, carried through from the opening to the last supporting sentence.` },
    { loId: 'm6ela.organizing-an-informative-text', kind: 'definition', title: 'definition strategy', content: `organizing a piece around naming what something is and describing its key features.` },
    { loId: 'm6ela.organizing-an-informative-text', kind: 'definition', title: 'classification strategy', content: 'organizing a piece around sorting a topic into two or more groups or kinds.' },
    { loId: 'm6ela.organizing-an-informative-text', kind: 'definition', title: 'comparison/contrast strategy', content: `organizing a piece around setting two specific things side by side to show how they are alike and different.` },
    { loId: 'm6ela.organizing-an-informative-text', kind: 'definition', title: 'cause/effect strategy', content: `organizing a piece around explaining why something happens or what happens as a result.` },
  ],
  methods: [
    {
      title: 'Worked classification draft',
      steps: [
        `Look at the notes as a whole before picking a strategy. Six prizes, but they cluster into three kinds: two gift cards, two pieces of gear a winner keeps, and two prizes the whole class shares. A topic that splits into kinds like this is built for classification.`,
        `Rule out the other three strategies before committing. Definition would fit if nobody knew what a "book fair raffle" was, but everyone already does. Comparison/contrast needs exactly two things to weigh against each other, and this topic has three kinds, not two. Cause/effect would need one prize to be making another one happen, and nothing here does that. Classification is the strategy that fits.`,
        `Draft the opening sentence aloud: name the topic and signal that groups are coming. DRAFT: "This year's book fair raffle has three kinds of prizes, and every student has a chance to win one of each kind."`,
        `Draft one supporting sentence per group, in the same pattern each time, so the reader can tell a new group has started. DRAFT: "The first kind is a gift card, either to the corner bookstore or to the ice cream shop." DRAFT: "The second kind is something to keep, like the inflatable pool float or the scooter helmet." DRAFT: "The third kind is a prize the whole class shares, either a pizza party or an extra recess period."`,
        `Check the finished draft against the one-strategy rule. Every sentence names one kind and stops there, with no sentence weighing one kind against another or explaining why a prize was chosen, so classification carries the whole piece from open to close.`,
      ],
      example: { problem: `You are writing a short piece for the school newsletter about the prizes in this year's book fair raffle. Your notes: a gift card to the corner bookstore, a gift card to the ice cream shop, an inflatable pool float, a scooter helmet, a class pizza party, an extra recess period. Choose a strategy, then draft the opening and the supporting sentences.`, solution: `Classification. "This year's book fair raffle has three kinds of prizes, and every student has a chance to win one of each kind. The first kind is a gift card, either to the corner bookstore or to the ice cream shop. The second kind is something to keep, like the inflatable pool float or the scooter helmet. The third kind is a prize the whole class shares, either a pizza party or an extra recess period."` },
      relatedLoIds: ['m6ela.organizing-an-informative-text'],
    },
    {
      title: 'Worked repair a blended strategy',
      steps: [
        `Name the strategy the paragraph starts with. Sentence one sorts the club's instruments into three groups, strings, brass and percussion, so the piece opens as classification.`,
        `Check the next sentence against that same strategy. Sentence two compares the tuba's weight to the trumpet's weight and explains why fewer students choose the tuba. That is a cause/effect idea sitting inside a classification piece; it does not sort anything into a group.`,
        `Name what went wrong precisely. WRONG: "The tuba is heavier than the trumpet, which is why fewer students choose it." This sentence answers "why," which is cause/effect's job, not classification's job, so the paragraph now asks the reader to follow two different organizing ideas at once.`,
        `Decide the fix. Two of the three sentences already build classification, so keep that strategy and replace the sentence that breaks it with one that stays inside it. DRAFT / CORRECT: "The percussion group has the most open spots, since the drums and the xylophone are shared instruments that stay at school."`,
        `Read the repaired paragraph straight through and confirm every sentence now does the same job, naming a group or something true about a group, so classification carries the whole piece.`,
      ],
      example: { problem: `A student drafts this paragraph about signing up for the Music Club's instruments. Find the sentence that breaks the one-strategy rule, then fix it.

"The Music Club sorts its instruments into three groups: strings, like the violin and the cello; brass, like the trumpet and the tuba; and percussion, like the drums and the xylophone. The tuba is heavier than the trumpet, which is why fewer students choose it. Every group has at least one open spot this year."`, solution: `"The Music Club sorts its instruments into three groups: strings, like the violin and the cello; brass, like the trumpet and the tuba; and percussion, like the drums and the xylophone. The percussion group has the most open spots, since the drums and the xylophone are shared instruments that stay at school. Every group has at least one open spot this year." The sentence comparing the tuba's weight to the trumpet's weight was cut because it explained a cause rather than naming a group.` },
      relatedLoIds: ['m6ela.organizing-an-informative-text'],
    },
  ],
  pointers: [
    { content: `Students often say "Using classification and comparison/contrast together covers more information than one strategy alone." — Pick the one strategy the gathered information actually calls for and stay inside it. If the recycling bins split into kinds, such as paper bins and bottle bins, classification alone can carry the whole piece: name each kind and describe it the same way every time. WRONG: "The paper bins are near the classroom door, and unlike the bottle bins, they get emptied twice a week." (This sentence starts sorting into kinds, then suddenly weighs one kind against another, blending classification and comparison/contrast in the same breath.) CORRECT: "The paper bins are near the classroom door and get emptied twice a week. The bottle bins sit by the cafeteria and get emptied once a week." Two plain classification sentences, each naming one kind and one fact about it, are clearer than one blended sentence trying to do both jobs.`, kind: 'common-error' },
    { content: `Students often say "Every classroom should have a recycling bin. (as the opening sentence)" — An informative opening states the topic and signals the strategy coming next; it does not ask the reader to take a side. Taking a side and defending it with reasons is Unit 8's job, not this one. WRONG: "Every classroom should have a recycling bin." (A reader could disagree with this.) CORRECT: "The school sorts its recycling into two kinds of bins, paper and bottles, and each kind follows its own pickup schedule." Nobody disagrees with that; they read on to find out how the two kinds differ.`, kind: 'common-error' },
    { content: `An informative piece needs one organizing strategy, chosen before you draft any supporting sentences, so every sentence is pointed at the same job.`, kind: 'tip' },
    { content: `Definition names what something is by describing its key features. Classification sorts a topic into two or more groups. Comparison/contrast sets two specific things side by side. Cause/effect explains why something happens or what results from it.`, kind: 'tip' },
    { content: `One piece uses only one strategy, start to finish. WRONG: sorting a topic into groups, then suddenly weighing two of those groups against each other with no signal the strategy changed. CORRECT: pick one strategy and describe every part of the topic the same way.`, kind: 'tip' },
    { content: `Using two strategies at once does not cover more information; it removes the one signal that tells a reader what kind of sentence is coming next.`, kind: 'tip' },
    { content: `An informative opening states the topic and signals the strategy coming next. It never asks a reader to agree or disagree with anything — that is Unit 8's job, not this one.`, kind: 'tip' },
    { content: `A sentence that only names an unstated reason for a fact, without the notes actually saying that reason, is an invented cause, not a fact the piece can organize around.`, kind: 'tip' },
    { content: `Don't switch strategies mid-piece. If you open with classification (sorting into groups), every supporting sentence must name a group or describe one group — never suddenly compare two groups or explain why something happened.`, kind: 'common-error' },
    { content: `Cause/effect is not "because something is true." It's "because X happens, then Y happens" — a chain of events. If your notes don't show one thing making another happen, cause/effect is not your strategy.`, kind: 'vocab-note' },
    { content: `Comparison/contrast needs exactly two named things, not three or more. If your topic splits into three kinds, you have classification, not comparison/contrast.`, kind: 'gotcha' },
    { content: `Your opening sentence must signal the strategy, not argue a side. Never write "The school should have more recycling bins." Write "The school has two kinds of recycling bins" or "The gym floor gets slippery on rainy days because..."`, kind: 'common-error' },
    { content: `Pick your strategy before you write any supporting sentences. The strategy you pick decides which sentence comes next, so choosing it first keeps you from wandering.`, kind: 'tip' },
    { content: `Definition strategy fits a topic the reader has never seen explained before. If your audience already knows what the thing is, definition is not your strategy — look for classification or cause/effect instead.`, kind: 'edge-case' },
    { content: `In classification, describe every group the same way — same facts, same pattern each time. If you give three facts about the first group and one fact about the second, the reader cannot tell if you switched strategies or just got lazy.`, kind: 'tip' },
  ],
};
