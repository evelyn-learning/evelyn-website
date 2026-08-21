/**
 * Grade 7 Science — Unit 5 CED 5.1: Cell Division & Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.cell-division-and-growth.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U5_CELL_DIVISION_AND_GROWTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.cell-division-and-growth.v1',
  course: 'Grade 7 Science',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Cell Division & Growth',
  planId: 'evelyn.ms.m7sci.cell-division-and-growth.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.cell-division-and-growth.v1' }],
  theory: [
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'Growing means more cells, not bigger cells', content: `GROWING MEANS MORE CELLS, NOT BIGGER CELLS — this is the headline, and it is the thing almost everyone gets backwards. When you grow taller, your cells do not puff up. Your body makes MORE of them. A cell in your finger is about the same size as a cell in an elephant leg; the elephant simply has far more of them. WRONG: "I grew because my cells got bigger." CORRECT: "I grew because my body made more cells."` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'What cell division produces', content: `WHAT CELL DIVISION PRODUCES — one cell splits into TWO new cells, and both carry the SAME genetic information as the cell they came from. That only works because the DNA is COPIED FIRST. The cell makes a complete second set of instructions before it splits, so each new cell walks away with a full set rather than half of one. For the ordinary cells of your body, the name of this process is MITOSIS. You do not need the stages of it yet; you need the result.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'Division is also repair and replacement', content: `DIVISION IS ALSO REPAIR AND REPLACEMENT — growth is only part of the job. When you scrape your knee, the cells at the edge of the scrape divide until the gap is filled. Your body also keeps replacing cells that wear out, such as the cells of your skin, your blood and the lining of your gut. That replacement never stops. Adults are not finished; they are simply replacing at about the same rate they lose, so their size holds steady instead of increasing.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'Why cells stay small', content: `WHY CELLS STAY SMALL — a cell takes in food and oxygen and pushes out waste, and all of that traffic has to cross the cell membrane, which is the outer surface. Now imagine the cell growing. The INSIDE of the cell grows faster than the OUTSIDE surface does. So a big cell has a huge amount of inside to feed and only a little more membrane to feed it through. The membrane cannot keep up. Dividing solves the problem: two smaller cells have more total surface for the same amount of inside.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'New cells are built from material the organism took in', content: `NEW CELLS ARE BUILT FROM MATERIAL THE ORGANISM TOOK IN — a new cell does not appear out of nothing. Its material comes from the food the organism ate, the water it drank and the air it took in, exactly as you traced in the last lesson. Matter is not created here either. It is rearranged. That is why an organism that stops eating also stops growing.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'framework', title: 'The photocopy comparison, and where it breaks', content: `THE PHOTOCOPY COMPARISON, AND WHERE IT BREAKS — thinking of cell division as copying a page then handing out both copies is useful, because it keeps the order right: copy first, hand out second. But no real cell decides to make a copy, and there is no operator standing at the machine. The steps happen because of chemistry inside the cell, not because anything chose them.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'definition', title: 'cell division', content: 'the process in which one cell splits into two new cells.' },
    { loId: 'm7sci.cell-division-and-growth', kind: 'definition', title: 'mitosis', content: `the kind of cell division that body cells use, producing two cells with the same genetic information as the original.` },
    { loId: 'm7sci.cell-division-and-growth', kind: 'definition', title: 'DNA', content: 'the molecule that carries the instructions for building and running a cell.' },
    { loId: 'm7sci.cell-division-and-growth', kind: 'definition', title: 'genetically identical', content: 'carrying the same genetic instructions as another cell.' },
    { loId: 'm7sci.cell-division-and-growth', kind: 'definition', title: 'cell membrane', content: `the thin outer boundary a cell must move all of its food, oxygen and waste across.` },
  ],
  methods: [
    {
      title: 'Worked mouse and elephant',
      steps: [
        `First decide what would settle the argument. If you put a piece of mouse skin and a piece of elephant skin under the same microscope at the same magnification, the two students predict different things.`,
        `The student predicts elephant cells would look far bigger in the eyepiece. Her partner predicts the two would look about the same, and that the elephant sample would simply contain many more cells in the same amount of space.`,
        `When biologists actually do this, the partner is right. Skin cells from a mouse and skin cells from an elephant are close to the same size. The elephant is bigger because it is built from a far greater NUMBER of cells.`,
        `Ask why it has to work that way. A cell can only feed itself through its membrane, so cells of every animal run into the same size limit. Making a bigger animal out of giant cells is not an option; making one out of more cells is.`,
        `Now apply the same reasoning to yourself. WRONG: "I got taller because my cells stretched." CORRECT: "I got taller because my cells divided again and again, so my body has more of them."`,
        `Notice what the argument turned on. Neither student needed to know anything about elephants. They needed the rule that cells stay small, and the rule that division makes more of them.`,
      ],
      example: { problem: `A student says: "An elephant is enormous and a mouse is tiny, so elephant cells must be enormous and mouse cells must be tiny." Her lab partner disagrees. Who is right, and how could you settle it?`, solution: `The lab partner is right. Mouse and elephant cells are about the same size; the elephant is larger because it is made of many more cells. Body size comes from cell NUMBER, not cell size, and you could check it by comparing skin samples under the same microscope.` },
      relatedLoIds: ['m7sci.cell-division-and-growth'],
    },
    {
      title: 'Worked why cells stay small',
      steps: [
        `Name the two things that matter. The OUTSIDE is the membrane, and every bit of food and oxygen coming in and every bit of waste going out has to cross it. The INSIDE is everything that has to be fed and cleaned.`,
        `Now double every side of the cube. The outside surface does grow. Each flat face becomes four times as large as it was, so the whole outside is four times what it was.`,
        `The inside grows too, but it grows faster. The inside of the doubled cube is eight times what it was, because it grew in all three directions at once.`,
        `Put those side by side. Eight times as much inside to supply, and only four times as much membrane to supply it through. The traffic has doubled per unit of surface, and materials also have farther to travel once they are in.`,
        `So the cell starves in the middle. It cannot pull food in fast enough or push waste out fast enough to keep the whole inside working.`,
        `Dividing fixes it. Two smaller cells hold the same total amount of inside but have more total membrane, so every part of both is close enough to a surface. This is why cells across nearly all living things stay small rather than growing large.`,
      ],
      example: { problem: `Imagine a cell shaped like a small cube. Now imagine that cube growing until every side is twice as long, without ever dividing. Explain why that cell would run into trouble.`, solution: `Its inside grows faster than its outside surface. The doubled cube has eight times as much inside but only four times as much membrane, so the membrane cannot move materials in and out fast enough to keep up. Splitting into two smaller cells restores a workable amount of surface for the amount of inside.` },
      relatedLoIds: ['m7sci.cell-division-and-growth'],
    },
  ],
  pointers: [
    { content: `Students often say "You grow because your cells get bigger." — Cells cannot grow much. As a cell gets larger, its inside grows faster than its membrane does, and the membrane can no longer move food in and waste out fast enough. So bodies grow by cell DIVISION instead: one cell becomes two, again and again, and the body ends up with more cells rather than bigger ones. That is why cells in a mouse and cells in an elephant are close to the same size. If you catch yourself saying a cell got bigger, swap it for "the body made more cells."`, kind: 'common-error' },
    { content: `Students often say "Only growing children make new cells; adults do not." — Division never stops. Skin cells, blood cells and the cells lining your gut wear out and are lost throughout life, and division replaces them. Division is also how any body closes a cut or rebuilds damaged tissue. An adult is not finished dividing; an adult is replacing at roughly the same rate as the losses, so the total stays steady instead of increasing. Stopping would not hold a person at the same size. It would mean nothing was left to repair or replace them.`, kind: 'common-error' },
    { content: `Organisms grow mainly by making MORE cells, not by their cells getting bigger. Elephant cells and mouse cells are about the same size.`, kind: 'tip' },
    { content: `Cell division makes TWO new cells carrying the SAME genetic information as the original, because the DNA is copied before the cell splits. In body cells this process is called mitosis.`, kind: 'tip' },
    { content: `Division also repairs damage and replaces worn-out cells, and it keeps doing that for a whole lifetime, not just during childhood.`, kind: 'tip' },
    { content: `Cells stay small because a growing cell gains inside faster than it gains membrane, and the membrane then cannot move materials in and out fast enough.`, kind: 'tip' },
    { content: `New cells are built from material the organism took in as food, water and air. Nothing is created out of nothing.`, kind: 'tip' },
    { content: `Copying then splitting is a useful picture, but nothing inside a cell decides to divide. The steps happen through chemistry.`, kind: 'tip' },
    { content: `Don't say "my cells got bigger." Say "my body made more cells." Growth = more cells, not swollen ones. If a sentence you wrote has a cell stretching or puffing up, rewrite it.`, kind: 'common-error' },
    { content: `Order matters: **copy the DNA first, then split.** If you describe the cell splitting and then copying, each new cell would only get half the instructions. Always mention the copying step before the splitting step.`, kind: 'gotcha' },
    { content: `"Genetically identical" means the two new cells carry the SAME instructions as the original — not half each, and not that they look identical or do the same job. A new skin cell and its parent share the same DNA.`, kind: 'vocab-note' },
    { content: `Adults still divide cells every day. Skin, blood and gut lining wear out constantly. An adult isn't finished — they're replacing at about the same rate they lose, so size holds steady.`, kind: 'edge-case' },
    { content: `In the cube example, keep the numbers straight: doubling each side makes the outside **4 times** bigger but the inside **8 times** bigger. The inside wins, which is exactly why the membrane can't keep up.`, kind: 'gotcha' },
    { content: `New cells aren't made from nothing. Their material comes from food, water and air the organism took in. If someone stops eating, growth stops — there's no matter to build with.`, kind: 'tip' },
    { content: `Nothing in a cell *decides* to divide. Avoid "the cell wants to" or "the cell knows it's too big." Say the division happens through chemistry inside the cell.`, kind: 'common-error' },
    { content: `Use *mitosis* only for ordinary body cells dividing into two same-DNA cells. Don't use it as a general word for any cell change or for growth itself — growth is the result of many mitoses, not the process.`, kind: 'vocab-note' },
  ],
};
