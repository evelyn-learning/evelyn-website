/**
 * Grade 6 World Geography — Place & Perception: Comparing Two Places.
 *
 * PROCEDURE-LED fan-out row for the m6geo course (National Geography Standard
 * 4). THE ROUTINE, in the order it is always run:
 *   1. Pick one kind of characteristic to compare -- a physical one (built by
 *      nature, such as a landform or a climate) or a human one (built by
 *      people, such as a building style or a main activity).
 *   2. Find that SAME kind of characteristic in the other place. Never match a
 *      physical characteristic in one place to a human characteristic in the
 *      other -- that is not a comparison at all.
 *   3. Decide: do the two places share it (a similarity) or not (a
 *      difference)?
 *   4. State the similarity or the difference. Never say one place is
 *      "better" or "worse" because of it -- a difference is not a rank.
 * Two traps this plan is built to kill: treating any two facts about two
 * places as a comparison even when they are different kinds of
 * characteristics, and turning a genuine difference into a rank of which
 * place is superior.
 *
 * SPLIT FROM THIS COURSE'S OWN NEIGHBORS (read before editing this file):
 * Row 8.1, `what-makes-a-place-unique`, describes ONE place using both its
 * physical and its human characteristics -- it never compares two places
 * against each other. This row assumes a student can already describe a
 * single place that way, and its whole job is the comparison ACROSS two
 * places: matching characteristic to characteristic, and calling out a
 * similarity or a difference. Row 8.2, `how-people-perceive-places-
 * differently`, is about two PEOPLE describing the SAME place differently
 * because of who they are; this row never mentions a resident, a visitor, an
 * opinion, or a perception -- every similarity and difference here comes from
 * the two places' own described characteristics, not from who is looking at
 * them.
 *
 * SCOPE GUARD: this row teaches a student to compare two described places by
 * matching a physical characteristic of one to the SAME kind of physical
 * characteristic of the other, and a human characteristic of one to the same
 * kind of human characteristic of the other, naming a genuine similarity or a
 * genuine difference each time. It names no closed typology of place or
 * region. The formal/functional/perceptual region typology and the
 * adapt/modify/depend human-environment-interaction framework are Grade 7
 * (`m7geo-u1-regions-and-place.ts`) and do not appear anywhere in this file --
 * this row never classifies WHY a region is defined the way it is or how
 * people relate to their environment, it only compares two places' already-
 * described characteristics side by side. What IS deliberately allowed,
 * because the risk on this row runs in two directions at once: (a) this file
 * explicitly teaches, as direct in-lesson content rather than a silent
 * omission, that matching a physical characteristic of one place to a human
 * characteristic of the other produces no comparison at all -- worked example
 * one ends by testing exactly that failing case, and every try_yourself item
 * offers a mismatched-category choice as a distractor; and (b) this file
 * explicitly teaches, also as direct content, that a genuine difference is
 * never a rank -- worked example two and the misconception check both correct
 * a "better town" claim outright, the same direct-correction move the sibling
 * `m6geo-u6-resource-distribution-and-its-effects.ts` row uses for the same
 * risk. Every place in this file is invented and described in its own text;
 * no real place, region, or country appears anywhere, which removes both the
 * locality risk this course has previously gotten wrong and the ranking risk
 * a real place invites.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea, step, and item below is
 * answered by IDENTIFY or CLASSIFY -- identify which kind of characteristic a
 * fact is, and classify a pairing as a genuine comparison or not, and a
 * genuine comparison as a similarity or a difference. Nothing here explains
 * WHY two places ended up with the characteristics they have, and no
 * explanation in this file runs more than one plain-language link.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason rather than a short wrong
 * label, and no key was built to be the longest choice BECAUSE it is the key.
 * Measured as a diagnostic, not a score to minimize: the key is the strictly
 * longest choice in 1 of the 3 items (item 3, `try-genuine-difference`, where
 * the key at 99 characters leads the next choice at 95 by 4 characters -- a
 * margin close to the tie this course's own guidance describes, not a strong
 * signal). The other two items' keys are not the longest: item 1's key ranks
 * third of four choices (89 characters, behind 97 and 92), and item 2's key
 * ranks second of four (90 characters, behind 127). See the note in
 * `m6geo-u3-earths-moving-plates.ts` for why zero is not the target either --
 * the meaningful measurement is the 120-item course rate taken at
 * registration, which should land near a quarter. The three keys sit at ids
 * a, b, and c -- the id set `(8 + 3) mod 4 = 3` requires, omitting d.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U8_COMPARING_TWO_PLACES: LessonPlan = {
  id: 'evelyn.ms.m6geo.comparing-two-places.v1',
  title: 'Comparing Two Places',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.comparing-two-places',
      standard: 'M6GEO-8.3',
      description:
        'Compare and contrast two described places using their shared physical and human characteristics, identifying genuine similarities and differences rather than ranking one place as simply "better" (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m6geo.how-people-perceive-places-differently'],
  followUps: ['m6geo.mapping-your-own-community'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make a mismatched comparison feel obviously broken before any vocabulary arrives.',
      script:
        'Imagine a friend tells you: "My cousin lives somewhere with huge mountains, and my other cousin lives somewhere that grows a lot of corn, so those two places are totally different." Something about that feels off, even if you cannot say why yet. It is not really comparing the two places at all -- it is comparing a mountain to a cornfield, which is like comparing the color of one bike to the size of a completely different bike. A real comparison has to line up the same kind of thing on both sides. Today you learn the two moves that make a comparison actually work: matching the right kind of characteristic on both sides, and telling a true difference apart from an opinion about which place is better.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-matching-characteristics',
      kind: 'concept',
      goal: 'Install the match-the-same-kind rule, the similarity/difference split, the mismatched-comparison trap, and the no-ranking correction.',
      keyIdeas: [
        'TO COMPARE TWO PLACES, LOOK AT THE SAME KIND OF CHARACTERISTIC FOR BOTH. Every place has physical characteristics, built by nature, such as its landforms and its climate, and human characteristics, built by people, such as its buildings and its main activities. A genuine comparison always matches physical with physical or human with human on both sides.',
        'MATCHING A PHYSICAL CHARACTERISTIC OF ONE PLACE TO A HUMAN CHARACTERISTIC OF THE OTHER IS NOT A COMPARISON AT ALL. Saying "Place A has tall mountains, while Place B grows wheat" does not tell you how the two places are alike or different, because a landform and an activity are not the same kind of characteristic. Fix it by finding Place A\'s main activity or Place B\'s landform, and comparing that instead.',
        'A GENUINE COMPARISON NAMES EITHER A SIMILARITY OR A DIFFERENCE. If the two places share the same kind of characteristic -- both have cold winters, say -- that is a similarity. If their same kind of characteristic is not alike -- one has cold winters, the other warm winters -- that is a difference. Two real places usually turn up some of each.',
        'A DIFFERENCE IS NOT A RANK. Saying two places differ in climate, landform, buildings, or activities is a geography statement. Saying that difference makes one place "better" or "worse" is not -- it is an opinion this course does not ask for. Two places can have very different characteristics without either one being the better place.',
        'CHECK A COMPARISON AGAINST WHAT EACH PLACE WAS ACTUALLY SAID TO HAVE. A comparison can match the right kind of characteristic on both sides and still be wrong, if it gets a detail backward or swaps which place has which fact. Reread each place\'s own description before accepting a comparison as true.',
      ],
      vocabulary: [
        { term: 'physical characteristic', definition: "a feature of a place created by nature, such as its landforms or its climate." },
        { term: 'human characteristic', definition: 'a feature of a place created by people, such as its buildings or the activities people do there.' },
        { term: 'similarity', definition: 'a way in which two places share the same kind of characteristic.' },
        { term: 'difference', definition: "a way in which two places' same kind of characteristic is not alike." },
        { term: 'comparison', definition: 'describing two places side by side by matching the same kind of characteristic for both.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Cliffwater sits at the foot of tall, rocky mountains and has cold winters and cool summers. Its buildings are made of thick stone with steep roofs, and most residents work as ski guides or run mountain lodges. Marshdell sits on wide, flat grassland and also has cold winters and cool summers. Its buildings are wooden farmhouses with wide porches, and most residents grow wheat and raise cattle. Compare the two towns\' climates, and then compare the two towns\' buildings.',
      steps: [
        'Pick the first kind of characteristic to compare: climate, a physical characteristic. Read what each town\'s own description says about climate: Cliffwater has cold winters and cool summers; Marshdell also has cold winters and cool summers.',
        'Decide whether the two towns share this characteristic or not. Both descriptions say the same thing, so this is a similarity, and it matches physical with physical.',
        'Pick the second kind of characteristic to compare: buildings, a human characteristic. Read what each town\'s own description says about buildings: Cliffwater\'s are thick stone with steep roofs; Marshdell\'s are wooden farmhouses with wide porches.',
        'Decide whether the two towns share this characteristic or not. The two descriptions are not alike, so this is a difference, and it matches human with human.',
        'Test the routine against a case that should fail, so the rule is not overlearned as always producing an answer. Try comparing Cliffwater\'s mountains to Marshdell\'s wheat growing: a landform is a physical characteristic and growing wheat is a human characteristic, so putting them side by side is not a genuine comparison at all -- it says nothing about how the two towns are alike or different.',
      ],
      answer:
        'Climate is a genuine similarity: both towns have cold winters and cool summers. Buildings are a genuine difference: Cliffwater builds with stone and steep roofs, while Marshdell builds with wood and wide porches. Comparing Cliffwater\'s mountains to Marshdell\'s wheat growing would not be genuine, since a landform and an activity are different kinds of characteristics.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-mismatch-and-the-rank',
      kind: 'worked_example',
      problem:
        'A student compares Cliffwater and Marshdell and writes: "Cliffwater has tall, rocky mountains, and Marshdell grows wheat, so Cliffwater\'s landforms are very different from Marshdell\'s farming. Also, Marshdell must be the better town, since it grows food that people need." Find what is wrong with each sentence and correct it.',
      steps: [
        'Take the first sentence. WRONG: "Cliffwater\'s landforms are very different from Marshdell\'s farming." This matches a physical characteristic, Cliffwater\'s mountains, to a human characteristic, Marshdell\'s farming, so it is not a genuine comparison at all.',
        'Find the matching characteristic to compare instead. Cliffwater\'s landform is tall, rocky mountains. Marshdell\'s landform is wide, flat grassland. CORRECT: "Cliffwater sits among tall, rocky mountains, while Marshdell sits on wide, flat grassland" -- a genuine difference, landform matched with landform.',
        'Now take the second sentence. WRONG: "Marshdell must be the better town, since it grows food that people need." This turns a difference in activity into a rank of the whole town.',
        'Test whether the same mistake could run the other way, so the correction is not one-directional: could someone just as wrongly say Cliffwater is the better town because ski guiding brings visitors to spend money there? Yes -- that is the identical mistake, only pointed in the other direction. Neither direction is correct.',
        'CORRECT: "Cliffwater\'s main activity is ski guiding and running mountain lodges. Marshdell\'s main activity is growing wheat and raising cattle. The two towns simply have different activities, and neither one is the better town because of it."',
      ],
      answer:
        'First correction: compare landform with landform instead -- Cliffwater\'s mountains and Marshdell\'s flat grassland are the genuine difference. Second correction: growing food does not make Marshdell the better town; the two towns\' activities are simply different, not ranked.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-genuine-comparison',
      kind: 'try_yourself',
      problem:
        'Brookvale sits along a wide river valley and has hot, humid summers. Most families there build their houses on tall stilts and fish the river for a living. Highridge sits on top of a rocky plateau and has cool, dry summers. Most families there build houses with thick, low walls and herd sheep for a living. Which sentence is a genuine comparison between Brookvale and Highridge?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Brookvale sits along a wide river valley, while Highridge sits on top of a rocky plateau.', correct: true },
        { id: 'b', text: "Brookvale's houses are built on tall stilts, while Highridge sits on top of a rocky plateau." },
        { id: 'c', text: "Brookvale has hot, humid summers, while Highridge's families herd sheep for a living." },
        { id: 'd', text: 'Highridge is a better place to live than Brookvale, because herding sheep is easier than fishing.' },
      ],
      expectedAnswer: 'Brookvale sits along a wide river valley, while Highridge sits on top of a rocky plateau.',
      hints: [
        'A genuine comparison matches the same kind of characteristic on both sides -- a landform with a landform, not a landform with a building or an activity.',
        'Two of these choices mix a physical characteristic from one town with a human characteristic from the other, and one choice ranks the towns instead of comparing them. Only one choice matches landform with landform.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-genuine-similarity',
      kind: 'try_yourself',
      problem:
        'Riverbend lies on a flat coastal plain and has warm, humid summers. Most families there fish the coastal waters for food to eat and sell. Sandhaven also lies on a flat coastal plain and also has warm, humid summers, but most families there run boat tours for visitors instead of fishing for food. Which sentence is a genuine similarity between Riverbend and Sandhaven?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Riverbend and Sandhaven both fish the coastal waters for food to eat and sell.' },
        { id: 'b', text: 'Riverbend and Sandhaven are both located on a flat coastal plain with warm, humid summers.', correct: true },
        { id: 'c', text: 'Riverbend fishes for food, while Sandhaven lies on a flat coastal plain.' },
        { id: 'd', text: 'Riverbend is a better place to live than Sandhaven, because fishing for food is a more useful activity than running boat tours.' },
      ],
      expectedAnswer: 'Riverbend and Sandhaven are both located on a flat coastal plain with warm, humid summers.',
      hints: [
        'Reread what each town\'s own description says its families actually do -- do not assume the two towns do the same human activity just because they share a physical characteristic.',
        'A true similarity has to be true of BOTH towns. Sandhaven\'s families run boat tours, not fish for food, so only the shared physical characteristic, the coastal plain and its climate, is a genuine similarity here.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-genuine-difference',
      kind: 'try_yourself',
      problem:
        'Oakford sits in a wide, flat valley and has mild, rainy winters. Its downtown is built from red brick, and its stores stay open all year. Cinderpeak sits high on a steep mountainside and has cold, snowy winters. Its downtown is built from heavy timber, and its stores close for several months when snow blocks the roads. Which sentence is a genuine difference between the two towns?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Oakford's downtown is built from red brick, while Cinderpeak sits high on a steep mountainside." },
        { id: 'b', text: "Cinderpeak is a worse place for a store to succeed, since Oakford's stores never have to close." },
        { id: 'c', text: "Oakford's downtown is built from red brick, while Cinderpeak's downtown is built from heavy timber.", correct: true },
        { id: 'd', text: 'Oakford has cold, snowy winters, while Cinderpeak has mild, rainy winters.' },
      ],
      expectedAnswer: "Oakford's downtown is built from red brick, while Cinderpeak's downtown is built from heavy timber.",
      hints: [
        'Reread each town\'s winter description carefully before choosing -- one choice has the two towns\' climates swapped.',
        'A genuine difference matches the same kind of characteristic on both sides. Only one choice compares a building material with a building material using the facts exactly as they were described.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mismatch-and-rank',
      kind: 'misconception_check',
      question:
        'A student compares Cliffwater and Marshdell and says: "Cliffwater has tall mountains, and Marshdell grows wheat, so the two towns are very different." The student also says: "Marshdell must be the better town, since growing wheat feeds people, and that matters more than skiing." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: 'Cliffwater has tall mountains, and Marshdell grows wheat, so the two towns are very different.',
          misconception:
            'Believing that any two facts about two different places count as a comparison, as long as the facts are not alike, without checking whether the two facts are even the same kind of characteristic.',
          correctsTo:
            'A genuine comparison always matches the same kind of characteristic on both sides -- a landform with a landform, or an activity with an activity. Cliffwater\'s mountains are a physical characteristic and Marshdell\'s wheat growing is a human characteristic, so putting them side by side says nothing about how the two towns compare. WRONG: "Cliffwater\'s mountains are very different from Marshdell\'s farming." CORRECT: "Cliffwater\'s landform is tall, rocky mountains, while Marshdell\'s landform is wide, flat grassland" -- a genuine difference, landform matched with landform.',
        },
        {
          answer: 'Marshdell must be the better town, since growing wheat feeds people, and that matters more than skiing.',
          misconception:
            'Treating a difference between two places\' activities as proof that one place is more valuable or more important than the other.',
          correctsTo:
            'Growing wheat and guiding skiers are simply two different activities, each suited to its own town\'s landform and climate. Neither activity makes its town the better one. A genuine comparison states what is different between two places; it never ranks which place is better.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A genuine comparison always matches the same kind of characteristic on both sides: physical with physical, such as landform or climate, or human with human, such as buildings or activities.',
        'Matching a physical characteristic of one place to a human characteristic of the other is not a comparison at all -- it says nothing about how the two places are alike or different.',
        'A genuine comparison names either a similarity, where both places share the same kind of characteristic, or a difference, where they do not.',
        'A difference is not a rank. Two places can have very different characteristics without either one being the better place.',
        'Always check a comparison against what each place was actually described as having, since a comparison can match the right kind of characteristic and still get a detail backward.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Comparing Two Places' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
