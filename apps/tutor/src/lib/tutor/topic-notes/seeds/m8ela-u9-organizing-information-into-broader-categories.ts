/**
 * Grade 8 English Language Arts — Unit 9 CED 9.1: Organizing Information into Broader Categories.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8ela.organizing-information-into-broader-categories.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8ELA_U9_ORGANIZING_INFORMATION_INTO_BROADER_CATEGORIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8ela.organizing-information-into-broader-categories.v1',
  course: 'Grade 8 English Language Arts',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Organizing Information into Broader Categories',
  planId: 'evelyn.ms.m8ela.organizing-information-into-broader-categories.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8ela.organizing-information-into-broader-categories.v1' }],
  theory: [
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `A BROADER CATEGORY IS A NAMED GROUP OF FACTS ONE LEVEL ABOVE THE PARAGRAPH. You already know to group related facts so that each paragraph does one job. That works until a piece runs past a few paragraphs, and then a reader who arrives with one question has to read the whole thing to be sure of the answer. So group the groups. A broader category is a pile of related paragraphs with a name you could say out loud in a few words, and the names, read in order, are the map of the piece.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `A REAL CATEGORY PASSES TWO TESTS: IT HAS A NAME, AND IT HAS AT LEAST TWO FACTS UNDER IT. If you cannot name a pile in a few words, it is not a category yet, and a name like "Other things" or "More Information" names nothing at all: it tells a reader only that the writer ran out of ideas. If just one fact sits under a name, that is a fact, not a category. Fold it under the neighbor whose question it partly answers, or decide the piece does not need it. And no fact may sit under two names at once. If a fact has two homes, the two names overlap, and one of them has to change.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `SUB-CATEGORIES ARE FOR A CATEGORY THAT HAS GROWN CROWDED. When one category holds five or six facts that split cleanly into two questions, split it into two sub-categories under the same broader name. Do not promote either half to the top level. Every top-level name is a promise to the reader that its section covers about the same amount of ground as the sections beside it, and a slice of one category standing next to the whole of another breaks that promise before the reader has read a word.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `ORDER THE CATEGORIES BY WHAT A READER NEEDS FIRST, NOT BY WHAT YOU FOUND FIRST. A section that another section leans on goes earlier: what a thing IS before how it works, the parts before the steps that use them, the cause before the effect it produces. The order you collected your notes in is an accident of your afternoon, and so is the order of how interesting you find them. Test the order by reading only the category names, from the top, as if they were the whole piece. If a name mentions something the reader has not met yet, that section is too early.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `A HEADING EARNS ITS PLACE WHEN A READER MIGHT WANT TO SKIP STRAIGHT TO ONE SECTION. A heading is a category name made visible, so the number of headings is the number of categories, never the number of paragraphs. A page with a heading over every paragraph is all signposts and no road, and a heading over two sentences is not worth the stop it asks a reader to make. One more rule comes with them: the writing underneath still has to stand on its own, because a heading is a label on the outside of a section and not the first sentence inside it.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', content: `A TABLE EARNS ITS PLACE WHEN THE SAME FEW FACTS REPEAT FOR SEVERAL THINGS. If you catch yourself writing the same two facts about four different bus routes, you are already writing a table in sentences: one row for each route, one column for each fact, and a reader can run a finger down a column and compare in a second. A table is the wrong tool when the information is not parallel. A chain of causes, a single explanation and a story have nothing that repeats, so most of the cells would sit empty and the reader would get less than the sentences already gave them.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', kind: 'definition', title: 'broader category', content: `a named group of related paragraphs, one level above the paragraph; the categories in order are the map of the piece.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', kind: 'definition', title: 'sub-category', content: `one half of a crowded category, split out under the same broader name rather than promoted to stand beside it.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', kind: 'definition', title: 'outline', content: `the ordered list of a piece's category names, written before the drafting starts, so the order can be fixed while it is still cheap.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', kind: 'definition', title: 'heading', content: `a category name printed above its section so a reader can skip to it; a label on the outside of the section, not the first sentence inside it.` },
    { loId: 'm8ela.organizing-information-into-broader-categories', kind: 'definition', title: 'table', content: `rows and columns used when the same few facts repeat for several things, so a reader can compare them down a column instead of across paragraphs.` },
  ],
  methods: [
    {
      title: 'Worked fix the outline',
      steps: [
        `Test each name before you touch the order. A category needs a name you can say in a few words and at least two facts under it. Three of these names pass both tests. "Hours" passes the first and fails the second: one fact sits under it, and one fact is a fact, not a category.`,
        `Fold the lone fact under the neighbor whose question it partly answers. When the room is open is part of how a student gets into it, so the hours move under "Getting in", which now holds three facts: the safety session, the sign-in, and the open afternoons. Nothing was cut. A fact that loses its own heading is still on the page, and it is now where a reader is already looking for it.`,
        `Now look for the opposite problem. "What is in the room" holds five facts, and they split cleanly along one question: which of these needs the safety session, and which can a student simply pick up? The printers and the laser cutter go one way; the hand tools, the sewing machine and the fabric scraps go the other. Split it into two SUB-CATEGORIES under the same broader name: "Machines" and "Tools and supplies".`,
        `Do not promote those two halves to the top level. "Machines" standing beside "Getting in" would promise a reader two sections covering the same amount of ground, and they do not: one is a slice of what is in the room, and the other is the whole of how to use the room. A sub-category stays under its parent, and the parent keeps the name that covers both halves.`,
        `Check that no fact has two homes. The safety session is filed only under "Getting in", even though it is a rule about the machines. The filament is filed only under "Materials", even though the printers live under "Machines". Each fact answers one question better than it answers any other, and that is the pile it belongs in.`,
        `Order the three categories by what a reader needs first. Someone who has never walked into the room needs to know what is in it before any rule about getting in means anything, and the materials only start to matter once a student is inside and using a machine. Order: what is in the room, getting in, materials. Read those three names from the top and nothing arrives before the thing it depends on.`,
        `Last, decide the formatting. There are three categories on a one-page guide, and a student who has been to the room before may want nothing but the open afternoons, so the three names become three headings. The two sub-categories are short and sit side by side under one heading, so they do not need headings of their own. A table would not help here, because no fact repeats for several things: there is one room, and most of the cells would sit empty.`,
      ],
      example: { problem: `A student is writing the one-page guide to the school makerspace that new students pick up at the front office. Here is the first outline, with every note sorted under one of four names. Fix it before anything is drafted.

"What is in the room": two 3D printers; a laser cutter; a wall of hand tools; a sewing machine; a bin of fabric scraps.
"Hours": the room is open Tuesdays and Thursdays from 3:00 to 4:30.
"Getting in": every student finishes a twenty-minute safety session before a first visit; everyone signs in on the tablet by the door.
"Materials": filament for the 3D printers is free for school projects; new plywood is paid for at the front office.`, solution: `Three categories, in this order. "What is in the room", with the sub-categories "Machines" (the two 3D printers and the laser cutter) and "Tools and supplies" (the hand tools, the sewing machine and the fabric scraps). "Getting in", holding the safety session, the sign-in and the open afternoons. "Materials", holding the filament and the plywood. "Hours" disappears as a name, because one fact is not a category, and the fact itself stays. Three headings, no table.` },
      relatedLoIds: ['m8ela.organizing-information-into-broader-categories'],
    },
    {
      title: 'Worked headings and a table',
      steps: [
        `Read only the headings, in order, as if they were the whole page: "Info", "The Paper Bin", "The Can Bin", "The Scraps Bin", "One more thing". Two of the five name nothing a reader could want. WRONG FOR THIS READER: "Info", because every page is information and the word rules nothing in or out. CORRECT: "Why the school sorts its trash", which is the question that paragraph actually answers.`,
        `Repair the first sentence under "The Paper Bin". WRONG: "It sits outside the library door." The word "it" has nothing to point at inside the writing; the only paper bin mentioned is up in the heading. CORRECT: "The paper bin sits outside the library door." A heading is a label on the outside of a section, so the sentences under it have to work with the heading covered up.`,
        `Now read the three bin sections side by side. Each one gives the same three facts in the same order: where the bin is, what goes in it, and who empties it. The same fields repeating for several things is the signal for a table, and here the fields repeat three times.`,
        `Build it and say what it costs the reader. WRONG FOR THIS READER: three paragraphs that spell out the same three fields in prose, so a reader who wants to know who empties the scraps bin has to read to the end of the third paragraph. CORRECT: one table with a row for each bin and three columns, headed "Where it is", "What goes in it" and "Who empties it". A reader runs a finger down one column instead of reading three paragraphs, and three of the five headings come off the page with the prose.`,
        `Deal with the last section. "One more thing" holds a single fact under a name that names nothing, so it fails both tests at once. Lids are part of what goes in the can bin, and that is now a cell in the table, so the sentence moves into the short line that introduces the table. Nothing is lost and one useless heading is gone.`,
        `Read the page back as an outline. Two headings: "Why the school sorts its trash" over the opening paragraph, and "The three bins" over the table. Two categories, two things a reader can find from across the room, and no heading standing over a single sentence.`,
      ],
      example: { problem: `Here is part of a draft of a page about the school's three recycling bins. Decide where a heading or a table helps, and repair what does not work.

Heading "Info", over one paragraph saying the school started sorting its trash into three bins this year.
Heading "The Paper Bin", over: "It sits outside the library door. Paper, cardboard and clean envelopes go in it, and the sixth-grade helpers empty it on Fridays."
Heading "The Can Bin", over: "The can bin sits by the cafeteria doors. Cans and plastic bottles go in it, and the custodians empty it on Fridays."
Heading "The Scraps Bin", over: "The scraps bin sits at the end of the lunch line. Fruit peels and uneaten food go in it, and the garden club empties it every day."
Heading "One more thing", over: "Lids do not go in the can bin."`, solution: `Two headings instead of five: "Why the school sorts its trash" over the opening, and "The three bins" over a table with one row for each bin and three columns, headed "Where it is", "What goes in it" and "Who empties it". The pronoun is repaired to "The paper bin sits outside the library door." The lids sentence moves into the line that introduces the table, because one fact under "One more thing" was never a category.` },
      relatedLoIds: ['m8ela.organizing-information-into-broader-categories'],
    },
  ],
  pointers: [
    { content: `Students often say "I gave every paragraph its own heading, so a reader can find anything on the page." — A heading is a category name made visible, so eleven headings over four categories tells a reader that this guide covers eleven different subjects, which is false. A map with a label on every square inch has stopped being a map. Put a heading on each of the four categories and let the paragraphs inside a section do their work without one. The test is whether a reader might arrive wanting only that section: someone arrives wanting the fees, and nobody arrives wanting the fourth paragraph.`, kind: 'common-error' },
    { content: `Students often say "I made the fee its own section with the heading "Fees", so that it does not get lost." — A category needs at least two facts under it, so a single fact is a fact and not a section. Fold it under the category whose question it partly answers — when the fee is due is part of joining the club, so it belongs in the section about joining — and if no category has a question it answers, ask whether the guide needs it at all. Folding a fact in does not hide it. It puts the fee exactly where a reader who is deciding whether to join is already reading.`, kind: 'common-error' },
    { content: `A broader category is a named group of related paragraphs, one level above the paragraph. The category names, read in order, are the map of the piece.`, kind: 'tip' },
    { content: `A real category passes two tests: a name you can say in a few words, and at least two facts under it. "Other things" fails the first, and a lone fact fails the second, so fold that fact under the neighbor whose question it partly answers.`, kind: 'tip' },
    { content: `No fact may sit under two names. If a fact has two homes, the two categories overlap and one of the names has to change.`, kind: 'tip' },
    { content: `When a category grows crowded, split it into sub-categories under the same broader name. Never promote a slice of one category to stand beside the whole of another.`, kind: 'tip' },
    { content: `Order the categories by what a reader needs first: what a thing is before how it works, the parts before the steps, the cause before the effect. Read only the names, from the top, and check that nothing arrives before the thing it depends on.`, kind: 'tip' },
    { content: `A heading earns its place when a reader might want to skip straight to that section, so the number of headings is the number of categories and not the number of paragraphs. A table earns its place when the same few facts repeat for several things; a story, a chain of causes and a single explanation have nothing that repeats, so a table would leave most of its cells empty.`, kind: 'tip' },
  ],
};
