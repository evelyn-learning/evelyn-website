/**
 * Grade 6 World Geography — Natural Resources & Human Adaptation: Conserving
 * Natural Resources.
 *
 * CONCEPT-LED fan-out row for m6geo Unit 6, Topic 3 (National Geography
 * Standard 16). The lesson installs one picture -- every resource is drawn
 * from some kind of supply, and how fast that supply gets used up depends on
 * choices people make -- and then names four specific practices that slow
 * that draw down: reduce, reuse, recycle, and repair. The four are taught as
 * four different MECHANISMS, not four names for one idea: reduce acts before
 * anything is used, reuse keeps a still-working item doing a job again,
 * recycle remakes used material into new material, and repair restores a
 * broken item to its original job. The two traps this plan is built to kill
 * are (a) treating reduce/reuse/recycle/repair as interchangeable labels for
 * "handling trash the right way," and (b) believing conservation changes how
 * fast nature replaces a resource, when what it actually changes is how fast
 * people draw from it.
 *
 * REGISTER NOTE, per the hazard this row is built to avoid: this file
 * describes what each practice DOES and WHY it works, and never tells the
 * student what they ought to do. No item's correct choice is the "virtuous"
 * option -- every correct choice is the one that names the right mechanism or
 * reasons correctly about a use rate, and every distractor is wrong because
 * of a mechanism mix-up, never because it "cares less." The word "should"
 * does not appear anywhere in this file's authored prose. Recycling and
 * conservation effectiveness figures are checkable, frequently misstated, and
 * often out of date, so this file states no reserve figure, no percentage,
 * and no efficiency number anywhere -- every comparison is qualitative (a
 * town's can-making draws less newly mined ore than another town's, not by
 * how much), and the two invented numbers in the hook (tokens in a jar,
 * tokens per visit) are simple, invented, and used only to compare two rates
 * against each other, never as a real-world figure.
 *
 * SCOPE GUARD: this row describes reduce, reuse, recycle, and repair as four
 * distinct mechanisms for slowing how fast a resource is drawn on, and
 * explains that conserving a resource matters because slowing the draw makes
 * a supply last longer -- and it stops there.
 *   - ROW 6.1 (renewable-and-nonrenewable-resources) owns classifying a named
 *     resource as renewable or nonrenewable by comparing its replacement rate
 *     with its use rate. This file never classifies a resource that way, and
 *     the words "renewable" and "nonrenewable" do not appear anywhere in it.
 *     What this file DOES borrow, because the two rows sit close and the line
 *     needs to be drawn precisely: the general fact that conserving changes
 *     the USE side of a rate, never the REPLACEMENT side -- stated once, in
 *     the abstract, with no named resource sorted into either category.
 *   - ROW 6.2 (resource-distribution-and-its-effects) owns where resources
 *     occur and how their uneven distribution shapes what a place can do.
 *     This file never discusses where a resource is found or how much of it
 *     a place has; every scenario here is about how fast a resource already
 *     in use gets drawn down, not where it comes from.
 *   - GRADE 7 boundary: economic systems, trade, and development levels built
 *     on resources are Grade 7 (`m7geo-u5-resources-and-economic-activity.ts`)
 *     and do not appear here -- no market, no price, no trade, no country's
 *     development level is named or implied anywhere in this file. This row
 *     stays at the level of a single household, a single family, or a single
 *     town's practice, never a national or global economic system.
 *   - The causal reasoning in this file never runs more than one link: a
 *     practice slows how fast a resource is used, and a resource used more
 *     slowly lasts longer. No item builds a chain of distinct mechanisms on
 *     top of that one link.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every scenario below is
 * invented and described in words; no real place, company, or product is
 * named anywhere in this file.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason rather than a short wrong
 * label, and no key was built to be the longest choice BECAUSE it is the key.
 * Character counts and the longest-key count are reported in the authoring
 * report, not tuned here to hit a target -- see the note in
 * `m6geo-u3-earths-moving-plates.ts` for why zero is not the goal. The three
 * keys sit at ids a, c and d -- the id set `(6 + 3) mod 4 = 1` requires,
 * omitting b.
 *
 * `prerequisites`/`followUps` are wired to this row's real chain neighbors
 * (6.2 and 6.4) per the fan-out contract; unlike the two hand-written
 * exemplars, this row is part of the batch the controller registers together,
 * so the chain does not need to stay empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U6_CONSERVING_NATURAL_RESOURCES: LessonPlan = {
  id: 'evelyn.ms.m6geo.conserving-natural-resources.v1',
  title: 'Conserving Natural Resources',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.conserving-natural-resources',
      standard: 'M6GEO-6.3',
      description:
        'Describe reduce, reuse, and recycle plus one additional conservation practice, and explain why conserving a given resource matters (National Geography Standard 16: the changes that occur in the meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m6geo.resource-distribution-and-its-effects'],
  followUps: ['m6geo.how-people-adapt-to-different-climates'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that slowing down how fast a supply is used, not the supply itself, is what makes it last -- before any vocabulary arrives.',
      script:
        'Imagine a jar of arcade tokens sits on your shelf. It came with sixty tokens, and no more tokens are coming until your birthday, months away. Spend ten tokens every time you visit the arcade, and the jar is empty after six visits, long before your birthday gets close. Spend only two or three tokens a visit instead, and the same sixty tokens stretch across many more visits, lasting all the way until new tokens finally arrive. Nothing about the jar changed. The only thing that changed is how fast the tokens were spent. Earth\'s resources work the same way. Wood, water, metal, and everything else people use comes from some kind of supply, and how long that supply lasts depends on how fast it gets drawn on. Today you find out four different ways people slow down how fast a supply gets used, and why slowing it down is the part that actually matters.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-ways-to-slow-the-draw',
      kind: 'concept',
      goal: 'Install the rate idea behind conservation and the four distinct mechanisms -- reduce, reuse, recycle, repair -- that slow it, each contrasted against its nearest neighbor.',
      keyIdeas: [
        'CONSERVING A RESOURCE MEANS SLOWING DOWN HOW FAST PEOPLE USE IT. A resource can be drawn on quickly or slowly. Conserving a resource does not change how nature makes or replaces it -- it changes how fast people draw from it. A resource used more slowly lasts longer, over more time, for more people. That one idea is the reason every practice in this lesson matters, even though each practice works in a different way.',
          'REDUCE MEANS USING LESS OF SOMETHING FROM THE VERY START. Reducing happens before anything is thrown away, reused, recycled, or repaired -- it means choosing to use a smaller amount of a resource in the first place. If less is used to begin with, there is less that ever needs to be replaced or made again.',
        'REUSE MEANS USING THE SAME ITEM AGAIN FOR A JOB, INSTEAD OF GETTING A NEW ONE. Reuse takes an item that still works and gives it another turn at its job, or a new job, rather than the item being thrown away and a fresh one made or bought to replace it. Because the same item keeps working, one new item\'s worth of raw material is not needed yet.',
        'RECYCLE MEANS TURNING USED MATERIAL BACK INTO RAW MATERIAL FOR A NEW ITEM. In recycling, an item that has already been used is collected, broken down, and remade into material for a new product, instead of that new product being made from freshly taken material. Recycling is different from reuse: reuse keeps the same item doing a job, while recycling changes the used item into material for a different, new item.',
        'REPAIR MEANS FIXING SOMETHING BROKEN SO IT KEEPS DOING ITS JOB. Repair applies only to an item that has already stopped working properly. Fixing the broken part lets the same item keep doing its same job, so a full replacement is not made or bought yet. Repair is different from reduce, because reduce means using less from the very start, before anything breaks. Repair is also different from reuse, because reuse takes an item that still works and gives it another job, while repair takes an item that stopped working and restores its original job.',
      ],
      vocabulary: [
        { term: 'conserve', definition: 'to use a resource more slowly so that the same supply lasts longer.' },
        { term: 'reduce', definition: 'to use a smaller amount of a resource from the very start, before anything is thrown away or replaced.' },
        { term: 'reuse', definition: 'to use the same item again for a job, instead of throwing it away and getting a new one.' },
        { term: 'recycle', definition: 'to collect used material and remake it into new material for a different product, instead of using freshly taken material.' },
        { term: 'repair', definition: 'to fix a broken item so it keeps doing its job, instead of replacing it with a new one.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reuse-not-recycle',
      kind: 'worked_example',
      problem:
        'A student fills the same water bottle from the tap every morning instead of getting a new bottled drink each day. A classmate says, "That is the same as recycling." Name the correct practice, and explain one reason it matters.',
      steps: [
        'Name what is actually happening. The same bottle is filled and used again for its same job, morning after morning, rather than being thrown away after one use.',
        'Test the classmate\'s label against the definition. Recycling means used material is collected, broken down, and remade into material for a new product. Nothing here is broken down or remade -- the same bottle just keeps doing its same job. WRONG: "refilling the same bottle is recycling." CORRECT: "refilling the same bottle is reuse, because the identical item is used again instead of a new one being made or bought for the same job."',
        'Explain why it matters, using the rate idea from the concept segment. Each new disposable bottle needs its own new amount of raw material to be made. Refilling the same bottle instead of getting a new one each day lowers how many new bottles have to be made over the same stretch of time.',
        'Check the reasoning against a contrasting case so the idea is not overlearned. Compare a student who reuses a plastic bag once before throwing it away with a student who reuses the same lunch box every school day for a whole year. Does reuse always lower material use by the same amount? No. The mechanism is identical in both cases -- the same item doing a job again -- but how much it lowers material use depends on how many new items that same item ends up replacing. One reuse replaces one new item. A whole year of reuse replaces a whole year of new items.',
      ],
      answer:
        'This is reuse, not recycle -- recycling remakes used material into something new, while this is the same bottle doing its same job again. It matters because each refill avoids the raw material a new disposable bottle would need, so refilling the same bottle repeatedly lowers how much new material is drawn over time.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-not-reduce',
      kind: 'worked_example',
      problem:
        'A bicycle tire goes flat. A family patches the small hole in the tube and keeps riding the same bike for another two years. A neighbor says, "That family just avoided buying anything new, so that counts as reducing." Is the neighbor\'s label correct?',
      steps: [
        'Name what actually happened. The tube broke, it was fixed, and the same tube kept doing its job after the fix -- nothing was avoided before anything broke.',
        'Test the neighbor\'s label against the definition. WRONG: "avoiding a purchase counts as reduce." CORRECT: reduce means using less of something from the very start, before anything is bought, used, or broken -- choosing a bike route that needs fewer tire changes to begin with would be reduce. Patching a tube that already broke is a different practice: repair, which fixes something already broken so it can keep doing its job.',
        'Explain why repair matters for the same reason as the other three practices. A new tube is not made from new material during those two years, because the repair let the old one keep working instead. Like reduce, reuse, and recycle, repair lowers how much new material has to be made over that stretch of time -- it does this by keeping an already-made item in service longer, not by using less from the start or remaking used material.',
        'Check the reasoning against a contrasting case. Compare the patched tube to a cracked plastic water bottle that cannot be patched and has to be thrown away. Does repair work the same way for both? No. Repair only slows down material use for something that can actually be fixed. For the bottle that cannot be fixed, the family would need reduce, reuse, or recycle instead -- repair is not available for every broken item.',
      ],
      answer:
        'The neighbor\'s label is wrong. This is repair, not reduce, because something already broken was fixed rather than less being used from the start. Like reduce, reuse, and recycle, repair matters because it lowers how much new material must be made over the same stretch of time, in this case by keeping an existing item working rather than needing a new one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-box-reuse',
      kind: 'try_yourself',
      problem:
        'A family gets a cardboard box in the mail from an online order. Instead of throwing the box away, they keep it and use it again the next month to store old winter clothes. Which conservation practice is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reuse -- the same box does another job instead of being thrown away and a new box being made.', correct: true },
        { id: 'b', text: 'Recycle -- cardboard is a material that recycling programs are generally able to accept and process.' },
        { id: 'c', text: 'Reduce -- the family did not have to buy a brand new storage box for the winter clothes.' },
        { id: 'd', text: 'Repair -- the box still works exactly the way it always did when it first arrived.' },
      ],
      expectedAnswer: 'Reuse -- the same box does another job instead of being thrown away and a new box being made.',
      hints: [
        'Ask whether the box was broken down into new material, fixed after breaking, or simply used for a job a second time.',
        'Nothing was melted down or remade into new material, and nothing about the box was broken and fixed. The same box just took on another job.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-jeans-repair',
      kind: 'try_yourself',
      problem:
        'A pair of jeans rips at the knee. Instead of throwing them away, a student sews the rip closed by hand and keeps wearing the same pair. Which conservation practice is this, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reuse -- the same jeans are simply being given a second turn of everyday wear after the rip appeared.' },
        { id: 'b', text: 'Recycle -- the torn fabric is being broken down and remade into brand new material for a different product.' },
        { id: 'c', text: 'Repair -- fixing the torn spot lets the same pair keep doing its job, so a new pair does not have to be made from new material yet.', correct: true },
        { id: 'd', text: 'Reduce -- sewing the rip by hand uses a smaller amount of thread than the fabric a whole new pair of jeans would require.' },
      ],
      expectedAnswer:
        'Repair -- fixing the torn spot lets the same pair keep doing its job, so a new pair does not have to be made from new material yet.',
      hints: [
        'Ask whether something already broken was fixed so it could keep doing its original job, or whether a still-working item was simply given another use.',
        'The jeans stopped working properly once they ripped. Fixing the rip restores the same jeans to their same original job, rather than giving a still-working item a new one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cans-recycle',
      kind: 'try_yourself',
      problem:
        'Two towns get canned vegetables in metal cans. In Town A, people recycle their used cans: the metal is melted down and remade into new cans. In Town B, every used can is thrown in the regular trash, and every new can is made from freshly mined metal ore. Which town\'s can-making draws less newly mined ore from the ground, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Town B, because a can made from freshly mined ore is stronger and keeps food safe for longer than a recycled can.' },
        { id: 'b', text: 'Neither town, because making the same number of cans always takes the same amount of newly mined ore no matter what happens to the used ones.' },
        { id: 'c', text: 'Both towns equally, because melting down a used can and remaking it takes just as much newly mined ore as mining ore for a brand new can.' },
        { id: 'd', text: 'Town A, because melting down used cans into new ones lowers how much newly mined ore has to be mined for the same number of cans.', correct: true },
      ],
      expectedAnswer:
        'Town A, because melting down used cans into new ones lowers how much newly mined ore has to be mined for the same number of cans.',
      hints: [
        'Ask which town\'s can-making step skips mining brand-new ore for cans that get remade out of metal that was already mined once.',
        'Melting down a used can and shaping it into a new can reuses metal that has already been mined, instead of new ore being mined again for that same can.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-four-names-one-idea-and-repair-doubt',
      kind: 'misconception_check',
      question:
        'A student says: "Reduce, reuse, and recycle are just three names for doing the same thing: getting rid of trash the right way. And fixing something broken does not really conserve anything, since nothing new gets made either way." What is wrong with each part?',
      commonErrors: [
        {
          answer: 'Reduce, reuse, and recycle are three names for doing the same thing.',
          misconception:
            'Hearing the three words said together so often that they blur into one idea about handling trash, rather than noticing that each one names a different point where a resource can be slowed down: before anything is used, by using the same item again, or by remaking used material into something new.',
          correctsTo:
            'The three practices work at different points. Reduce lowers how much is used before anything is thrown away at all. Reuse keeps the very same item doing a job again. Recycle takes used material and remakes it into a new item\'s raw material. WRONG: "they are three names for the same practice." CORRECT: "they are three different mechanisms for lowering how much new material gets used, and each one acts at a different point."',
        },
        {
          answer: 'Fixing something broken does not conserve anything, since nothing new gets made either way.',
          misconception:
            'Assuming that conserving a resource only counts at the moment a new item is bought, rather than noticing that a repaired item is still doing the job a brand new item would otherwise have had to do.',
          correctsTo:
            'Repair does conserve a resource. Before the repair, the broken item was about to need a full replacement made from new material. Fixing it lets the same item keep doing that job, so the replacement is not made yet. The resource being conserved is the material a new item would have needed -- even though the repaired item itself is not new.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Conserving a resource means slowing down how fast people use it, not changing how fast nature replaces it. A supply used more slowly lasts longer.',
        'Reduce means using less of something from the very start, before anything is thrown away, reused, recycled, or repaired.',
        'Reuse means the same still-working item keeps doing a job again, instead of a new item being made or bought to replace it.',
        'Recycle means used material is broken down and remade into new material for a different item, instead of that item being made from freshly taken material.',
        'Repair means fixing something already broken so it keeps doing its original job, instead of replacing it with a new one.',
        'All four practices matter for the same reason: each one lowers how much new material has to be taken over the same stretch of time, even though each one works at a different point.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Conserving Natural Resources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
