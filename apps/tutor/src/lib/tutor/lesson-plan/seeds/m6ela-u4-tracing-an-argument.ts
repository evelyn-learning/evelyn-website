/**
 * Grade 6 ELA — Text Structure, Author's Purpose & Comparing Accounts:
 * Tracing an Argument.
 *
 * CONCEPT-LED fan-out row for m6ela. The student arrives with no procedure to
 * lean on, so the whole lesson builds one way of reading somebody else's
 * argument: find its MAIN CLAIM and its SPECIFIC CLAIMS, then sort each
 * specific claim into SUPPORTED (a reason and evidence are attached to it) or
 * NOT SUPPORTED (nothing is) (CCSS RI.6.8). This is a binary sort only — the
 * lesson never asks whether a reason is logically sound or whether an
 * already-supported claim's evidence is strong enough, both of which begin
 * at Grade 7 (RI.7.8). Two traps this plan is built to kill: reading
 * confident wording such as "everybody knows" or "obviously" as if it were
 * itself a reason, and supplying a reason from outside knowledge that the
 * text never actually printed.
 *
 * SCOPE GUARD: Grade 6 row 4.3 traces an informational text's argument,
 * names its main claim and its specific claims, and sorts each specific
 * claim into SUPPORTED (a reason and evidence follow it somewhere in the
 * text) or NOT SUPPORTED (nothing does) — a binary sort and nothing more.
 * DELIBERATELY EXCLUDED: judging whether a given reason is logically sound,
 * or whether an already-supported claim's evidence is strong enough or
 * plentiful enough — those are RI.7.8's own evaluative moves at Grade 7,
 * already taught end to end by the shipped `m7ela-u4-tracing-an-argument.ts`,
 * which tests relevance and sufficiency directly; no item or worked example
 * in this file ever asks whether a supported claim's evidence is adequate,
 * only whether a claim has any reason and evidence attached to it at all.
 * Also excluded: the author's own purpose or point of view and how word
 * choice conveys it (row 4.2 owns that; no item here asks why a passage was
 * written or what stance its word choice reveals); comparing how two
 * different authors present the same real event (row 4.4); and composing an
 * argument of the student's own, including introducing a claim or organizing
 * supporting reasons in original writing (Unit 8, W.6.1). DELIBERATELY
 * ALLOWED, because two neighboring skills sit close: (a) every passage in
 * this file is itself a short argument the student did not write and is
 * never asked to revise, since tracing requires an argument to trace — this
 * is reading, never Unit 8's writing; (b) a specific claim's supporting
 * sentence in this file sometimes states why a policy would help (for
 * instance, that it would save energy), which can sound like author's-
 * purpose territory, but no item asks the student to name a passage's
 * purpose or what a word choice reveals about a stance, only whether a
 * reason and evidence are present.
 *
 * NOTE FOR FUTURE AUTHORS: every argument printed in this file is original
 * prose written for the item, set at a familiar middle-school or
 * neighborhood scale. This course carries no passage machinery — no
 * passageId, no shared texts — so every question must be answerable from the
 * sentences printed inside that same item, and no published work is quoted
 * or closely paraphrased anywhere in this file. Every phrase inside
 * quotation marks in a step, hint, or answer appears character-for-character
 * in the excerpt it quotes from; quote your own excerpt exactly, never from
 * memory.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                   | Where               | Grounds
 *   Food scraps in a landfill break down    | worked example 1    | Long-settled environmental
 *   without much oxygen and release methane,| passage              | science: anaerobic
 *   a gas that traps far more heat than                            | decomposition of organic
 *   carbon dioxide does                                            | waste produces methane,
 *                                                                   | which traps far more heat
 *                                                                   | than carbon dioxide; checked.
 *   Refilling and reusing the same bottle   | worked example 2    | Follows directly from the
 *   means fewer new plastic bottles get     | passage              | definition of reusing an
 *   bought or thrown out                                           | item instead of replacing
 *                                                                   | it; not an empirical claim
 *                                                                   | requiring outside sourcing.
 *   Bees and butterflies need flowers to    | try-yourself 2      | Widely documented ecological
 *   feed on, and many kinds of bees have    | passage              | trend, reported by
 *   been declining in number over recent                          | beekeepers and researchers
 *   decades                                                        | for years; stated
 *                                                                   | qualitatively, no invented
 *                                                                   | statistic.
 *   Recycling an aluminum can uses far less | try-yourself 3      | Long-settled materials-
 *   energy than making a new one from raw   | passage              | science fact: recycled
 *   metal                                                          | aluminum takes substantially
 *                                                                   | less energy to produce than
 *                                                                   | new aluminum from ore;
 *                                                                   | checked.
 *   The Fairview bike lot holds twelve      | try-yourself 1      | Invented detail specific to
 *   bikes and had twenty-two chained to its | passage              | this fictional town's bike
 *   fence last fall                                                | lot, stipulated true within
 *                                                                   | the passage the way a
 *                                                                   | story's plot detail is; not
 *                                                                   | a real-world statistic.
 *   The animal shelter downtown has been    | hook script         | Invented detail specific to
 *   full for weeks                                                 | this hook's scenario,
 *                                                                   | stipulated true within it;
 *                                                                   | not a real-world statistic.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U4_TRACING_AN_ARGUMENT: LessonPlan = {
  id: 'evelyn.ms.m6ela.tracing-an-argument.v1',
  title: 'Tracing an Argument',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.tracing-an-argument',
      standard: 'M6ELA-4.3',
      description:
        'Trace an informational text\'s argument and its specific claims, sorting each specific claim into supported by reasons and evidence or not supported — a binary sort that does not yet assess whether the reasoning is sound or the evidence is sufficient (CCSS RI.6.8; that fuller evaluation is RI.7.8).',
    },
  ],
  prerequisites: ['m6ela.authors-purpose'],
  followUps: ['m6ela.comparing-two-authors-accounts'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that sorting supported claims from unsupported ones is a thing the student already notices, then name the skill.',
      script:
        'Your little brother wants a dog. At dinner he makes his case to your parents. He says the animal shelter downtown has been full for weeks, and that walking a dog every day would finally get him outside and moving. Then he adds that dogs are the best pets in the world, and waits for that to land like it settled the whole argument. Two of his points come with a reason attached, right there in the sentence. The third is just a strong opinion, sitting there by itself with nothing under it. You do not need to decide about the dog to notice the difference. Today we read someone else\'s argument the same way: finding the claims inside it, and sorting each one into a claim that has a reason and evidence behind it, and a claim that does not.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tracing-claims',
      kind: 'concept',
      goal: 'Separate a main claim from its specific claims, define what makes a specific claim supported, and warn against mistaking confident wording or outside knowledge for evidence.',
      keyIdeas: [
        'AN ARGUMENT IS BUILT OUT OF CLAIMS. A claim is a sentence the writer wants the reader to accept — an opinion, a recommendation, or a point meant to persuade. Most arguments make one MAIN CLAIM, the big ask the whole piece is arguing for, and then add several SPECIFIC CLAIMS along the way that are supposed to help convince the reader of it.',
        'A SPECIFIC CLAIM COUNTS AS SUPPORTED WHEN A REASON AND EVIDENCE ARE ATTACHED TO IT. A reason explains why the claim should be believed, and evidence is the fact, count, or example that backs the reason up. If a sentence right around the claim is doing that work, sort the claim as supported.',
        'A SPECIFIC CLAIM COUNTS AS NOT SUPPORTED WHEN THE TEXT STATES IT AND MOVES ON. No reason follows it, no fact backs it up, and the argument simply continues to its next point. This happens more often than it seems like it should, and the unsupported claim is not always small — sometimes it sits right where a strong finish is expected.',
        'THIS IS A SORT, NOT A GRADE. The only question today is whether a specific claim has a reason and evidence attached, or does not. Deciding whether that reason truly makes sense, or whether the evidence is strong enough, is a skill for a later grade. For now: supported, or not supported, and nothing in between.',
        'CONFIDENT WORDS ARE NOT EVIDENCE. A sentence can sound completely certain — everybody knows, obviously, clearly, the best choice — and still have no reason or fact anywhere near it. Sounding sure of itself is a tone, not a reason. Check for an actual reason and fact, never for how confident a sentence sounds.',
        'TO SORT A CLAIM, FOLLOW THE SAME TWO STEPS EVERY TIME. Find the claim sentence, then read the sentence or two right around it. Ask: is a reason there, backed by a fact or example that is actually printed? If yes, the claim is supported. If the text has already moved on to its next point, the claim is not supported.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'a sentence in an argument that states something the writer wants the reader to accept, such as an opinion or a recommendation.' },
        { term: 'reason', definition: 'a sentence that explains why a claim should be believed.' },
        { term: 'evidence', definition: 'the specific fact, count, or example that backs up a reason.' },
        { term: 'supported claim', definition: 'a claim that has a reason and evidence attached to it somewhere in the text.' },
        { term: 'unsupported claim', definition: 'a claim that the text states and then leaves alone, with no reason or evidence given for it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-two-claims',
      kind: 'worked_example',
      problem:
        'Trace this argument, then sort each of its two specific claims into SUPPORTED or NOT SUPPORTED.\n\n"Riverbend Middle School should add a compost bin next to the cafeteria trash cans. Composting the cafeteria\'s food scraps would keep them from producing the gas that makes landfills a problem for the planet. Food scraps that end up in a landfill break down without much oxygen around them, and that process releases methane, a gas that traps far more heat than carbon dioxide does. Composting is also the most fun part of taking care of the planet."',
      steps: [
        'Find the main claim first — the big ask, the sentence somebody could disagree with. "Riverbend Middle School should add a compost bin next to the cafeteria trash cans" is the main claim.',
        'Find the first specific claim: "Composting the cafeteria\'s food scraps would keep them from producing the gas that makes landfills a problem for the planet." Check the next sentence for a reason and evidence.',
        'They are there: "Food scraps that end up in a landfill break down without much oxygen around them, and that process releases methane, a gas that traps far more heat than carbon dioxide does." That names a cause and an effect, and it is a real fact about how landfills work, not just a feeling. This claim is SUPPORTED.',
        'Find the second specific claim: "Composting is also the most fun part of taking care of the planet." Look at what comes before and after it in the paragraph — nothing does.',
        'No reason follows this claim, no fact backs it up, and the paragraph simply ends there. This claim is NOT SUPPORTED, and notice it is not a small or careless sentence — it is placed last, right where a strong finish is expected.',
        'Sort both specific claims: the methane claim is supported by a printed reason and fact, and the "most fun" claim has neither.',
      ],
      answer:
        'The specific claim that composting would stop landfill gas is SUPPORTED, backed by the reason that food scraps in a landfill break down without oxygen and release methane, a gas that traps far more heat than carbon dioxide. The specific claim that composting is the most fun part of taking care of the planet is NOT SUPPORTED — no reason or evidence is given for it anywhere in the text.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-confident-words-are-not-evidence',
      kind: 'worked_example',
      problem:
        'Trace this argument. One of its two specific claims sounds backed up because of the words around it — check whether it actually is.\n\n"Westfield Middle School should install a water refill station in the front hallway. A refill station would cut down on the number of plastic bottles the school throws away. Refill stations let students fill the same reusable bottle again and again, so fewer new plastic bottles ever get bought or thrown out in the first place. Everybody knows a refill station is obviously the smartest choice a school could make."',
      steps: [
        'Find the main claim: the school should install a water refill station.',
        'Find the first specific claim: "A refill station would cut down on the number of plastic bottles the school throws away." Check the next sentence for a reason and evidence: "Refill stations let students fill the same reusable bottle again and again, so fewer new plastic bottles ever get bought or thrown out in the first place." That explains the mechanism, so this claim is SUPPORTED.',
        'Find the second specific claim: "Everybody knows a refill station is obviously the smartest choice a school could make." Words like everybody knows and obviously make this sentence sound settled, as though it must already be backed up.',
        'Look for the reason or fact anyway, the same way as before. There is not one — no cause, no example, no count, nothing that explains why it is the smartest choice. The sentence only repeats how sure it sounds.',
        'WRONG way to sort it: "It uses words like \'everybody knows,\' so it must be well established." CORRECT way: check for an actual reason and fact, find none, and sort the claim as not supported no matter how confident it sounds.',
        'Sort both specific claims: the plastic-bottle claim is supported by a printed reason, and the "obviously the smartest choice" claim is not — the confident wording is exactly what could fool a careless reader into thinking otherwise.',
      ],
      answer:
        'The specific claim that a refill station would cut down on plastic bottle waste is SUPPORTED, backed by the reason that the same reusable bottle gets refilled again and again instead of new bottles being bought and thrown out. The specific claim that "everybody knows" it is "obviously the smartest choice" is NOT SUPPORTED — no reason or evidence backs it up, only confident-sounding words.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-unsupported-claim',
      kind: 'try_yourself',
      problem:
        'Read this argument, then choose the sentence that is a specific claim with NO reason or evidence attached to it.\n\n"Fairview should install a bike rack outside the middle school\'s front doors. More students would ride their bikes to school if there were a safe place to lock them up. Last fall the crossing guard counted twenty-two bikes chained to the fence around the bike lot, because the lot only holds twelve bikes and there was no room left. Riding a bike to school is also way cooler than getting dropped off in a car."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'More students would ride their bikes to school if there were a safe place to lock them up.' },
        { id: 'b', text: 'Last fall the crossing guard counted twenty-two bikes chained to the fence around the bike lot, because the lot only holds twelve bikes and there was no room left.' },
        { id: 'c', text: 'Fairview should install a bike rack outside the middle school\'s front doors.' },
        { id: 'd', text: 'Riding a bike to school is also way cooler than getting dropped off in a car.', correct: true },
      ],
      expectedAnswer: 'Riding a bike to school is also way cooler than getting dropped off in a car.',
      hints: [
        'Sort these four sentences by role first: is it the main claim, a specific claim with a reason next to it, the reason itself, or a specific claim standing alone with nothing next to it?',
        'The main claim needs the whole argument behind it, not one sentence of its own. Look for the one specific claim that never gets a reason anywhere in the paragraph.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sort-the-claim-correctly',
      kind: 'try_yourself',
      problem:
        'Read this argument, then choose the statement that correctly sorts one of its specific claims.\n\n"Lincoln Middle School should plant a small pollinator garden in the front courtyard. Planting flowers pollinators can use would give bees and butterflies a place to stop between the neighborhood\'s yards. Bees and butterflies need flowers to feed on, and many kinds of bees have been declining in number over the past few decades, so a garden is one small way people can help them. A pollinator garden would also make the courtyard the prettiest spot in the whole school."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The claim that a garden would give bees and butterflies a place to stop is SUPPORTED, because the text explains that pollinators need flowers to feed on and that many kinds of bees have been declining in number.', correct: true },
        { id: 'b', text: 'The claim that a garden would give bees and butterflies a place to stop is NOT SUPPORTED, because the text never states an exact number for how many bees have declined or how many a garden could actually help, so a careful reader cannot be sure the claim is true.' },
        { id: 'c', text: 'The claim that the courtyard would be the prettiest spot in the school is SUPPORTED, because flowers are naturally one of the nicest and most colorful things anyone could plant in a school courtyard, even without the text saying so directly.' },
        { id: 'd', text: 'The claim that the courtyard would be the prettiest spot in the school is SUPPORTED, because the text itself already says a garden would make the courtyard the prettiest spot in the whole school, and that sentence is right there in the paragraph.' },
      ],
      expectedAnswer: 'The claim that a garden would give bees and butterflies a place to stop is SUPPORTED, because the text explains that pollinators need flowers to feed on and that many kinds of bees have been declining in number.',
      hints: [
        'Two of the choices sort a claim the wrong way, and two sort the OTHER claim as supported for reasons that do not actually work. Start by deciding which claim each choice is even talking about.',
        'A real reason explains why, using words already printed in the text. Restating the claim, or a reason a reader thought of that the text never printed, does not count.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-reason-and-evidence',
      kind: 'try_yourself',
      problem:
        'Read this argument, then choose the sentence that gives the reason and evidence backing up the claim that recycling cans would save energy.\n\n"Jefferson Middle School should set up a separate bin for aluminum cans in the cafeteria. Keeping cans out of the regular trash and into a recycling bin would actually save energy. Recycling an aluminum can uses far less energy than making a brand new can out of raw metal. Recycling is also just a nice habit for everyone in the building to build together."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Recycling is also just a nice habit for everyone in the building to build together.' },
        { id: 'b', text: 'Recycling an aluminum can uses far less energy than making a brand new can out of raw metal.', correct: true },
        { id: 'c', text: 'Jefferson Middle School should set up a separate bin for aluminum cans in the cafeteria.' },
        { id: 'd', text: 'Keeping cans out of the regular trash and into a recycling bin would actually save energy.' },
      ],
      expectedAnswer: 'Recycling an aluminum can uses far less energy than making a brand new can out of raw metal.',
      hints: [
        'Three of these are claims themselves — the main claim, the claim you are asked about restated, or a different specific claim entirely. Only one sentence explains why, with a new fact.',
        'The reason has to be a different sentence from the claim it backs up, and it has to explain a cause, not repeat the result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-reasoning-and-tone',
      kind: 'misconception_check',
      question:
        'A student reads the pollinator-garden argument and says, "The claim about the courtyard looking pretty must be supported — flowers are obviously nice to look at, everybody knows that." Name the two separate mistakes in that sentence.',
      commonErrors: [
        {
          answer: 'Flowers are obviously nice to look at, so the claim must be supported.',
          misconception:
            'Supplying a reason from personal knowledge instead of checking whether the text itself printed one. The reason feels true, so it is easy to mistake for something the text actually said.',
          correctsTo:
            'Sorting a claim only uses words that are actually printed in the text, never a reason the reader supplies. Reread the sentences right around the claim. If no reason and evidence are there, the claim is not supported, no matter how true or obvious the missing reason might seem to a reader.',
        },
        {
          answer: 'Everybody knows that, so it must be supported.',
          misconception:
            'Treating confident, sure-sounding language as if it were the same thing as a reason and evidence.',
          correctsTo:
            'A confident tone is not a reason. Words like everybody knows and obviously describe how sure a sentence sounds, not what backs it up. Check for an actual fact or example next to the claim; if the only thing there is confident wording, the claim is not supported.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A claim is a sentence the writer wants the reader to accept. An argument usually has one main claim, plus several specific claims meant to support it.',
        'A specific claim is SUPPORTED when a reason and evidence are attached to it somewhere in the text — a reason explaining why, backed by a fact or example.',
        'A specific claim is NOT SUPPORTED when the text simply states it and moves on, with no reason and no evidence anywhere near it.',
        'Sorting is not grading. The only question is whether a reason and evidence are attached, not whether they are strong enough — that comes in a later grade.',
        'WRONG: "It sounds certain, so it must be supported." CORRECT: check for an actual reason and evidence right around the claim — a confident tone proves nothing on its own.',
        'To sort any claim, find it, then read the sentences right around it. A printed reason and evidence there means supported; the argument moving on to its next point means not supported.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Tracing an Argument' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
