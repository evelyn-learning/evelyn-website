/**
 * HS English — Unit 4 CED 4.1: Precise & Concise Wording.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.precision-and-concision.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U4_PRECISION_AND_CONCISION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.precision-and-concision.v1',
  course: 'HS English',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Precise & Concise Wording',
  planId: 'evelyn.hs.engl.precision-and-concision.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.precision-and-concision.v1' }],
  theory: [
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Two different jobs', content: `TWO DIFFERENT JOBS — PRECISE means the words name exactly what you mean; CONCISE means no word is doing nothing. A sentence can be short and still vague ("It went badly"), or long and still exact. Good revision does both jobs at once.` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Redundant pairs', content: `REDUNDANT PAIRS — two words repeating one idea: "each and every", "end result", "past history", "unexpected surprise", "close proximity", "merged together", "final outcome", "basic essentials", "free gift". Keep one half, delete the other. WORDY: "The end result of each and every rehearsal was exhaustion." TIGHT: "Every rehearsal ended in exhaustion."` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Empty throat-clearing openers', content: `EMPTY THROAT-CLEARING OPENERS — phrases that warm up the sentence without saying anything: "due to the fact that" becomes "because"; "in order to" becomes "to"; "at this point in time" becomes "now"; "the reason why is because" becomes "because"; "it is important to note that" and "in my personal opinion" can usually be deleted whole.` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Padding and weak intensifiers', content: `PADDING AND WEAK INTENSIFIERS — "very", "really", "quite", "somewhat", "basically", "actually", "the fact that" rarely add meaning. WORDY: "The plan was very unique and really quite effective." TIGHT: "The plan was unique and effective." When an intensifier feels necessary, the fix is usually a stronger word, not a bigger booster.` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Vague verb plus noun, one precise verb', content: `VAGUE VERB PLUS NOUN, ONE PRECISE VERB — English hides strong verbs inside noun phrases. "Made a decision" becomes "decided"; "gave an explanation of" becomes "explained"; "conducted an investigation into" becomes "investigated"; "has the ability to" becomes "can". The precise verb is shorter AND clearer, which is why this is the highest-value single move in revision.` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'Vague nouns and adjectives', content: `VAGUE NOUNS AND ADJECTIVES — "thing", "stuff", "aspect", "factor", "good", "bad", "interesting", "a lot" ask the reader to guess. VAGUE: "The article had some interesting things about the water problem." PRECISE: "The article explained how the reservoir lost a third of its capacity."` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'The shortest-option principle', content: `THE SHORTEST-OPTION PRINCIPLE — when two versions are both grammatical and mean the same thing, the shorter one is almost always better. This is a strong default, not a law.` },
    { loId: 'engl.precision-and-concision', kind: 'framework', title: 'The limit on that principle', content: `THE LIMIT ON THAT PRINCIPLE — shorter wins only while the meaning survives. A cut is too deep when it drops a fact the reader needs (a number, a date, a name, a qualifier like "after the storm"), when it flattens a specific claim into a general one, or when what is left is no longer a complete, correct sentence. Check grammar first, meaning second, length third.` },
    { loId: 'engl.precision-and-concision', kind: 'definition', title: 'redundancy', content: `saying the same thing twice in different words, as in "end result" or "unexpected surprise".` },
    { loId: 'engl.precision-and-concision', kind: 'definition', title: 'wordiness', content: 'using more words than the idea requires, even when nothing is outright repeated.' },
    { loId: 'engl.precision-and-concision', kind: 'definition', title: 'precision', content: `choosing words that name exactly what is meant, so the reader does not have to guess.` },
  ],
  methods: [
    {
      title: 'Worked wordy to tight',
      steps: [
        `Sweep for empty openers first: "Due to the fact that" is throat-clearing. Replace it with "Because" and four words become one.`,
        `Sweep for the buried verb: "made a decision to start" is a vague verb plus a noun hiding the real action. It becomes "decided to start", or simply "started earlier" if the deciding is not the point.`,
        `Sweep for redundant pairs: "the end result" repeats itself, and "the whole entire riverbank" stacks two words that both mean all of it. Keep "the result" and "the entire riverbank" — or cut both down further.`,
        `Sweep for vague wording: "a lot of trash got picked up" is imprecise and passive. Name who acted and what changed: "the volunteers cleared the entire riverbank".`,
        `Assemble the tight version: "Because the volunteers started earlier, they cleared trash from the entire riverbank." Thirty-two words become thirteen, and every surviving word carries meaning.`,
        `Verify nothing required was lost: the cause (an earlier start), the actor (the volunteers), the action (clearing trash), and the scope (the entire riverbank) all remain.`,
      ],
      example: { problem: `Revise this sentence for precision and concision: "Due to the fact that the volunteers made a decision to start earlier, the end result of the cleanup was that a lot of trash got picked up along the whole entire riverbank."`, solution: `Because the volunteers started earlier, they cleared trash from the entire riverbank.` },
      relatedLoIds: ['engl.precision-and-concision'],
    },
    {
      title: 'Worked over cutting trap',
      steps: [
        `Check the grammar of the short version. "The club won." is a complete, correct sentence, so it passes the first test. Shortness alone is not the problem here.`,
        `Now check the meaning, item by item. The original names WHICH club (debate), the history that makes the win surprising (only two rounds in three years), the result (first place), the event (regional tournament), and the time (March).`,
        `The proposed revision keeps one of those five and deletes four. "The club won." does not tell the reader which club, what it won, or why the win matters. This is the OVER-CUT error: the sentence got shorter by dropping the content, not the padding.`,
        `Ask the real revision question instead: which words are doing no work? Scan the original — "which had won only two rounds in three years" carries the contrast, "regional tournament" identifies the event, "in March" fixes the time. None of it is filler, so there is little to cut.`,
        `A defensible tightening trims structure without losing facts: "After winning only two rounds in three years, the debate club took first place at March's regional tournament." That is shorter than the original AND keeps every fact.`,
        `State the principle the student misapplied: shortest wins only among versions that are equally correct and equally complete in meaning. "The club won." is shorter but says less, so it never entered the competition.`,
      ],
      example: { problem: `A student is revising this sentence: "The debate club, which had won only two rounds in three years, took first place at the regional tournament in March." Applying the rule "shortest is best", the student proposes: "The club won." Is that the better revision?`, solution: `No — "The club won." is over-cut. It drops four required facts. A revision like "After winning only two rounds in three years, the debate club took first place at March's regional tournament." is shorter than the original while keeping the meaning.` },
      relatedLoIds: ['engl.precision-and-concision'],
    },
  ],
  pointers: [
    { content: `Concision cuts words that do no work — it never cuts facts. WRONG: "The storm caused problems" deletes the damage, the scale, and the time, and replaces the precise "knocked out power" with the vague "caused problems", which is a loss of precision on top of a loss of information. CORRECT: keep the facts and trim only padding, as in "Tuesday night's storm cut power to nine hundred homes." Grammar first, meaning second, length third.`, kind: 'common-error' },
    { content: `Precise and concise are two jobs: name exactly what you mean, and make every word earn its place.`, kind: 'tip' },
    { content: `Cut on sight — redundant pairs ("end result", "each and every"), empty openers ("due to the fact that" becomes "because"), and filler intensifiers ("very", "really", "basically").`, kind: 'tip' },
    { content: `Collapse a vague verb plus noun into one precise verb: "made a decision" becomes "decided", "conducted an investigation into" becomes "investigated".`, kind: 'tip' },
    { content: `Shorter wins only among versions that are equally grammatical and equally complete: if a cut drops a fact, a qualifier, or a specific claim, the longer version is the right one.`, kind: 'tip' },
    { content: `Don't treat *precise* and *concise* as synonyms. "It went badly" is concise but vague; a 30-word sentence can be perfectly precise. Ask two separate questions: does each word name exactly what I mean, and is any word doing nothing?`, kind: 'vocab-note' },
    { content: `Cutting a fact is not concision. Numbers, dates, names, and qualifiers like "after the storm" or "last spring" are content, not padding. If your revision deletes information the reader needs, the longer version wins.`, kind: 'common-error' },
    { content: `Run the check in this order every time: **grammar first, meaning second, length third.** A revision that is shortest but a fragment, or shortest but says less, never even enters the comparison.`, kind: 'tip' },
    { content: `Hunt for a noun that's hiding a verb: "made a decision" → *decided*, "conducted an investigation into" → *investigated*, "has the ability to" → *can*, "gave an explanation of" → *explained*. This one move usually fixes precision and length together.`, kind: 'tip' },
    { content: `"Very unique", "really essential", "somewhat perfect" — if a word feels like it needs a booster, swap in a stronger word instead of stacking an intensifier. Absolute adjectives can't be scaled at all.`, kind: 'edge-case' },
    { content: `Redundant pairs sound normal because we say them out loud: "end result", "past history", "each and every", "close proximity", "whole entire", "free gift". Keep one half, delete the other — being familiar doesn't make a phrase earn its space.`, kind: 'gotcha' },
    { content: `Vague nouns and adjectives — "thing", "stuff", "aspect", "factor", "good", "interesting", "a lot" — are a precision problem, not a length problem. Replacing them usually makes the sentence *more* specific, sometimes with the same word count.`, kind: 'common-error' },
    { content: `Some sentences are already tight. If every phrase carries a fact, the correct answer may be to leave the wording alone or only rearrange it. Don't invent cuts to prove you revised.`, kind: 'edge-case' },
  ],
};
