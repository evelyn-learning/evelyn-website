/**
 * HS English — Unit 3 CED 3.3: Apostrophes & Possessives.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.apostrophes-and-possessives.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U3_APOSTROPHES_AND_POSSESSIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.apostrophes-and-possessives.v1',
  course: 'HS English',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Apostrophes & Possessives',
  planId: 'evelyn.hs.engl.apostrophes-and-possessives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.apostrophes-and-possessives.v1' }],
  theory: [
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'The ownership test', content: `THE OWNERSHIP TEST — before writing an apostrophe, flip the phrase around with "of". "The drivers license" becomes "the license OF the driver," which makes sense, so an apostrophe is needed. If the of-flip produces nonsense, the word is a plain plural and takes NO apostrophe at all.` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'Singular possessive', content: `SINGULAR POSSESSIVE — one owner takes apostrophe plus s, whatever letter the word ends in: "the writer's notebook," "the class's schedule," "the boss's office." Attach the mark to the end of the whole singular word; never slide it inside the word.` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'Plural possessive', content: `PLURAL POSSESSIVE — pluralize FIRST, then punctuate. A regular plural already ends in -s, so it takes an apostrophe alone: writer becomes writers becomes "the writers' notebooks" (several writers own them). WRONG: "the writers's notebooks." CORRECT: "the writers' notebooks."` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'Irregular plurals', content: `IRREGULAR PLURALS — plurals that do NOT end in -s take a normal apostrophe plus s: child becomes children becomes "the children's books"; woman becomes women becomes "the women's team"; person becomes people becomes "the people's choice." WRONG: "the childrens' books." CORRECT: "the children's books."` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'Plain plurals take no apostrophe', content: `PLAIN PLURALS TAKE NO APOSTROPHE — this is the storefront error. WRONG: "Fresh Bagel's Sold Here." CORRECT: "Fresh Bagels Sold Here." Nothing belongs to the bagels and no letters are missing, so no mark belongs there. The same goes for decades and acronyms in modern usage: "the 1990s," "three DVDs."` },
    { loId: 'engl.apostrophes-and-possessives', content: `CONTRACTION vs POSSESSIVE PRONOUN — three pairs cause most of the damage: its/it's, their/they're, and whose/who's. Expand the apostrophe form to test it. "It's" unpacks to "it is" or "it has," "they're" unpacks to "they are," "who's" unpacks to "who is" or "who has." If the expansion reads correctly, the apostrophe form belongs; if it collapses, use the possessive.` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'framework', title: 'Possessive pronouns never take apostrophes', content: `POSSESSIVE PRONOUNS NEVER TAKE APOSTROPHES — its, theirs, hers, ours, yours, and whose already show ownership on their own, exactly the way "his" does. WRONG: "The team lost it's captain." CORRECT: "The team lost its captain." And "there" is the outsider of its trio: it marks a place or opens a sentence, as in "There are two drafts on the desk."` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'definition', title: 'possessive', content: `a noun or pronoun form that shows ownership (the writer's draft, the writers' drafts, its, whose).` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'definition', title: 'contraction', content: `two words shortened into one, with an apostrophe standing in for the missing letters ("it's" = "it is").` },
    { loId: 'engl.apostrophes-and-possessives', kind: 'definition', title: 'plain plural', content: `a noun meaning simply more than one, owning nothing — it takes an -s and no apostrophe.` },
  ],
  methods: [
    {
      title: 'Worked plural possessive',
      steps: [
        `Run the ownership test: "the signatures OF the volunteers" makes sense, so "volunteers" does need a possessive apostrophe. This is not a plain plural.`,
        `Count the owners. A whole page of signatures came from many people, so the owner is PLURAL: volunteers.`,
        `Pluralize first, then punctuate: volunteer becomes volunteers. That plural already ends in -s, so add the apostrophe after the existing -s and stop there.`,
        `CORRECT: "The volunteers' signatures filled the entire back page." Two WRONG alternatives worth naming: "volunteer's" would claim a single volunteer signed the page over and over, and "volunteers" with no mark leaves the ownership unpunctuated.`,
      ],
      example: { problem: `Fix the punctuation in this newsletter line: "The volunteers signatures filled the entire back page." Where does the apostrophe belong, and why?`, solution: `volunteers' — a plural owner, so pluralize first and place the apostrophe after the -s already there` },
      relatedLoIds: ['engl.apostrophes-and-possessives'],
    },
    {
      title: 'Worked its backward',
      steps: [
        `Start with the first slot. Expand the contraction: "it's" unpacks to "it is," which turns the sentence into "The museum reopened it is east wing." That collapses, so the contraction is WRONG here.`,
        `What the writer means is the east wing belonging to the museum — ownership by a single "it." The possessive pronoun is "its," with no apostrophe, exactly the way "his" and "her" carry none.`,
        `Now the second slot. "Going to stay open late" needs a subject and a verb in front of it: "it is going to stay open late." The expansion reads perfectly, so this slot needs the CONTRACTION "it's."`,
        `CORRECT: "The museum reopened its east wing on Saturday, and the staff says it's going to stay open late all summer." Why the ear fails here: both forms sound identical aloud, so sound cannot decide. The expansion test decides.`,
      ],
      example: { problem: `A student turns in this sentence: "The museum reopened it's east wing on Saturday, and the staff says its going to stay open late all summer." Both apostrophe decisions are backward. Fix them.`, solution: `"The museum reopened its east wing on Saturday, and the staff says it's going to stay open late all summer." — possessive "its" first, contraction "it's" second` },
      relatedLoIds: ['engl.apostrophes-and-possessives'],
    },
  ],
  pointers: [
    { content: `An apostrophe has only two jobs: ownership and missing letters. Nothing belongs to the bagels and no letters are missing, so the sign needs the bare plural. WRONG: "Fresh Bagel's Sold Every Friday." CORRECT: "Fresh Bagels Sold Every Friday." The mark would return only if the bagels owned something, as in "the bagels' warm smell filled the hallway."`, kind: 'common-error' },
    { content: `An apostrophe marks ownership or missing letters — never a plain plural: bagels (plural), the bagel's crust (one owner), the bagels' smell (many owners).`, kind: 'tip' },
    { content: `Singular owner takes apostrophe plus s. For plurals, pluralize FIRST, then add just an apostrophe (writers'), unless the plural does not end in -s (children's, women's).`, kind: 'tip' },
    { content: `Expand to test: it's = it is/has, they're = they are, who's = who is/has. If the expansion collapses, you want its, their, or whose.`, kind: 'tip' },
    { content: `Possessive pronouns carry no apostrophe at all — its, theirs, hers, ours, yours, whose — and "there" marks a place, not ownership.`, kind: 'tip' },
    { content: `Pluralize *before* you punctuate. Write the plural (writers, actors, volunteers), then add the apostrophe after the existing -s. Never build "writers's" or slide the mark inside the word: "writer's notebooks" for several owners claims one writer owns them all.`, kind: 'common-error' },
    { content: `Irregular plurals break the pattern: if the plural does NOT end in -s (children, women, people, men), treat it like a singular and add 's. WRONG: childrens', womens'. CORRECT: children's books, women's team, people's choice.`, kind: 'edge-case' },
    { content: `An apostrophe has exactly two jobs: ownership or missing letters. It is never a plural marker. "Fresh Bagel's Sold Here" is wrong — nothing belongs to the bagels. Same for decades and acronyms: the 1990s, three DVDs, two CEOs.`, kind: 'gotcha' },
    { content: `Your ear cannot decide its/it's, their/they're, or whose/who's — they sound identical. Expand the apostrophe form out loud: it's = it is/has, they're = they are, who's = who is/has. If the expansion collapses into nonsense, use the possessive.`, kind: 'tip' },
    { content: `Possessive pronouns never take an apostrophe: its, theirs, hers, ours, yours, whose. Think of "his" — nobody writes "hi's." WRONG: "The team lost it's captain," "the book is her's."`, kind: 'common-error' },
    { content: `"There" is the odd one out — it marks a place or opens a sentence ("There are two drafts"), and it shows no ownership at all. Don't lump it into the possessive/contraction choice with their and they're.`, kind: 'vocab-note' },
    { content: `Use the of-flip before you write any apostrophe: "the drivers license" → "the license OF the driver" makes sense, so punctuate it. If the flip produces nonsense, you have a plain plural and it takes no mark.`, kind: 'tip' },
    { content: `Singular nouns already ending in -s or -ss still take 's: the class's schedule, the boss's office, Chris's essay. Don't drop to a bare apostrophe just because the word ends in an s sound.`, kind: 'edge-case' },
  ],
};
