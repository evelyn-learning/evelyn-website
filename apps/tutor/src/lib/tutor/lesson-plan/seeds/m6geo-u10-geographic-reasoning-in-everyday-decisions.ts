/**
 * Grade 6 World Geography — Applying Geography to the World Today: Geographic
 * Reasoning in Everyday Decisions.
 *
 * PROCEDURE-LED fan-out row for the m6geo course (National Geography Standard
 * 3, row 10.1, opening Unit 10). This is the course's capstone application:
 * it does not teach a new mental model, it re-runs the site-and-situation
 * routine from row 1.4 on a new kind of question -- not "why did a settlement
 * grow here" but "which of these lots should a town pick, and which stated
 * reason actually justifies that pick." The routine is unchanged; only the
 * question asked of it is new.
 *
 * SCOPE GUARD: this row applies the site-and-situation reasoning already
 * taught in row 1.4 (`m6geo-u1-site-and-situation.ts`) to a new decision --
 * choosing where to put one new facility (a park, a school, a skate park, a
 * community garden, or a library branch) -- and asks the student to recognize
 * which STATED reason genuinely justifies a siting choice. It reuses Unit 1's
 * two categories (site, situation) and its move-it test unchanged; it invents
 * NO new named category, no new typology of justification errors, and no
 * closed list of criteria for siting any particular kind of facility. The
 * mechanism this row stops short of is Grade 7's
 * `m7geo-u3-urbanization-and-settlement.ts`, which teaches a closed four-item
 * typology of the reasons cities form (water, a defensible or central site, a
 * break-of-bulk point, a resource) and a linear/clustered/dispersed
 * settlement-pattern typology; neither appears here, and no item asks what
 * SHAPE a settlement takes or WHY people historically clustered somewhere.
 * Sideways, this row also stops short of row 10.4's
 * `using-geography-to-plan-a-community`: every scenario here is ONE facility
 * on ONE lot, decided by the ONE family of reasoning already taught, never a
 * planner balancing roads, parks, farms and housing together across a whole
 * community. What IS deliberately allowed: every worked example and item
 * still uses only the ONE-link reasoning already licensed in row 1.4 (a good
 * site offers something useful, so it is easier to build on or live near; a
 * good situation connects a spot usefully, so it is easier to reach or use),
 * applied to five entirely new invented scenarios -- Elm Hollow, Cross Timber,
 * Driftwood Bend, Foxglove, and Sparrow Creek -- none of which reuses a name,
 * a lot, or a fact from row 1.4's Millbrook, Fairview, the mountain cabin, or
 * New York City, so no item here is answerable from memory of that lesson's
 * own cases.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item stem here
 * is answered by IDENTIFY or CLASSIFY -- sort a fact into site or situation,
 * recognize whether a stated reason is genuinely grounded, spot which lot a
 * fact actually belongs to. Nothing asks WHY a particular kind of facility
 * needs a particular kind of site beyond the one-link reasoning row 1.4
 * already licensed, and nothing enumerates a closed list of siting criteria
 * for schools, parks, or any other facility. If a sentence here would sit
 * comfortably inside `m7geo-u3-urbanization-and-settlement.ts`, it has
 * drifted into the settlement-typology mechanism and does not belong.
 *
 * CHECK-MOVE NOTE: this row reuses row 1.4's already-licensed adapted check
 * move, THE MOVE-IT TEST, rather than inventing a new one -- the underlying
 * reasoning pair (site, situation) is unchanged from that row, so the same
 * check applies without alteration. Worked example 1 uses it to sort four new
 * facts and build a two-part justification; worked example 2 re-applies it to
 * a contrasting case (a strong site paired with a poor situation) and
 * corrects a student who judged by site alone, echoing row 1.4's own second
 * worked example so the capstone stays coherent with the lesson it is built
 * on.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, 94% at difficulty 4; chance with four choices is 25%). Every
 * distractor below states a full wrong reason rather than a bare label, and
 * no key was built to be the longest choice BECAUSE it is the key. Measured
 * as a diagnostic, not as a score: of the three items, the key is the
 * strictly longest choice in NONE of them (character counts and per-item
 * rank are in the authoring report). Zero is not the target -- see the note
 * in `m6geo-u3-earths-moving-plates.ts` -- but it is what this file measured.
 * DF-1: the three keys sit at ids a, c and b -- the id set
 * `(10 + 1) mod 4 = 3` requires, omitting d.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U10_GEOGRAPHIC_REASONING_IN_EVERYDAY_DECISIONS: LessonPlan = {
  id: 'evelyn.ms.m6geo.geographic-reasoning-in-everyday-decisions.v1',
  title: 'Geographic Reasoning in Everyday Decisions',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.geographic-reasoning-in-everyday-decisions',
      standard: 'M6GEO-10.1',
      description:
        'Apply the site-and-situation reasoning from Unit 1 to a new, described scenario (such as choosing a location for a school or a park) and justify the choice using geographic factors (National Geography Standard 3: how to analyze the spatial organization of people, places and environments).',
    },
  ],
  prerequisites: ['m6geo.locating-asia-and-oceania'],
  followUps: ['m6geo.map-based-problem-solving'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the two-part reasoning feel like a live decision before any new vocabulary arrives.',
      script:
        'Your town announces that it is building one new thing this year -- maybe a park, maybe a school, maybe a library -- and it is asking students for ideas about where it should go. Your friend says, "Just put it wherever there is empty space." But empty space is not enough by itself. A soccer field on a muddy hill is a bad soccer field no matter how much empty space sits around it, and a perfectly flat, dry court that nobody can walk to is not much of a court either. Choosing where to put something new means checking two different things at once: what the ground itself is like, and what is nearby that would make the spot useful. That is exactly the site-and-situation reasoning from earlier in this course. Today you use it to help decide where new places in a town should go, and to tell a real reason for a choice apart from a fact that just happens to be true.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-applying-site-and-situation-to-a-choice',
      kind: 'concept',
      goal: 'Install that site-and-situation reasoning also drives new siting decisions, that both categories must be good at once, and what makes a stated reason a genuine justification.',
      keyIdeas: [
        'WHEN A COMMUNITY CHOOSES WHERE TO PUT SOMETHING NEW, IT USES THE SAME TWO QUESTIONS. Site-and-situation reasoning is not only for explaining why an old settlement grew somewhere -- it also helps decide where to put something new today, such as a school, a park, or a library. The same two questions still apply: what is the ground itself like right here (site), and what does this spot connect to (situation).',
        'A GOOD DECISION NEEDS A GOOD SITE AND A GOOD SITUATION, NOT JUST ONE. A large, flat, dry lot is a strong site, but if hardly anyone can reach it, that strong site alone does not make it the right choice. A spot close to many homes is a strong situation, but if the ground there floods or leaves no room to build, that strong situation alone does not make it the right choice either. The best option is the one where both are good at once.',
        'A JUSTIFICATION IS A STATED REASON, GROUNDED IN A REAL SITE OR SITUATION FACT. Choosing a location is only half the job; the other half is saying why. A real justification names an actual fact about the ground, or about what surrounds it -- not just any true statement about the place. A true fact that has nothing to do with the ground or its surroundings, such as what color a fence is painted, gives no site or situation reason at all, even though it is true.',
        'A JUSTIFICATION CAN BE WRONG EVEN WHEN THE FACT INSIDE IT IS TRUE. A stated reason might name a fact that really belongs to a different location, not the one being chosen. Or it might name a true fact that has nothing to do with the ground or its surroundings. Checking a justification means asking whether the fact is really about this place, and whether it is really a site or situation reason -- not just whether it happens to be true.',
        'COUNTING FACTS IS NOT THE SAME AS WEIGHING THEM. A location with a long list of facts written about it is not automatically the better choice, and a location with only two or three facts is not automatically the worse one. What matters is whether the site is genuinely good, whether the situation is genuinely good, and whether each stated reason is a true, relevant site or situation fact -- not how many facts got written down.',
      ],
      vocabulary: [
        { term: 'site', definition: 'the exact physical spot a place occupies, described by the ground itself -- things like flatness, dryness, and what is right there.' },
        { term: 'situation', definition: "a place's position relative to what surrounds it -- nearby features, routes, and other places -- described by looking outward from the spot rather than at the spot itself." },
        { term: 'justification', definition: 'a stated reason, grounded in a real fact about a place, that explains why a choice is a good one.' },
        { term: 'siting', definition: 'the process of deciding where to place something, such as a school, a park, or a library.' },
        { term: 'candidate site', definition: 'a location being considered for a purpose, but not yet chosen.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-elm-hollow-park',
      kind: 'worked_example',
      problem:
        'The town of Elm Hollow is choosing between two empty lots for a new neighborhood park.\nLot Chestnut: the ground is flat and well-drained, and it sits two blocks from a row of houses and directly across the street from the elementary school.\nLot Sable: the ground is low and turns to mud whenever it rains hard, and it sits next to the highway on-ramp, far from any houses.\nWhich lot should Elm Hollow choose, and what is the correct justification for that choice?',
      steps: [
        'Sort each fact using the move-it test from earlier in this course: picture picking up the exact patch of ground and setting it down somewhere else. A fact that would travel with the ground is site. A fact that depends on what happens to be nearby is situation.',
        "Lot Chestnut's ground being flat and well-drained would travel with that patch of ground if it were moved, so that is a site fact, and it is a good one.",
        'Lot Chestnut sitting two blocks from houses and across from the school depends on what is nearby, so that is a situation fact, and it is also a good one.',
        "Lot Sable's ground turning to mud would also travel with the ground, so that is a site fact too, and this one is poor.",
        'Lot Sable sitting next to the highway on-ramp, far from houses, depends on what is nearby, so that is a situation fact, and it is poor as well.',
        'Compare the two lots. Lot Chestnut has a good site and a good situation. Lot Sable has a poor site and a poor situation. Elm Hollow should choose Lot Chestnut.',
        "Check that the justification names one fact from each category, not just one. WRONG justification: \"Choose Lot Chestnut because it is close to the school.\" That names only a situation fact and leaves the ground itself out. CORRECT justification: \"Choose Lot Chestnut because its ground is flat and well-drained, and it sits close to the houses and the school that would use it.\"",
      ],
      answer:
        "Elm Hollow should choose Lot Chestnut. Its site is good (flat, well-drained ground) and its situation is good (close to houses and the school), while Lot Sable is poor on both. A complete justification names one site fact and one situation fact, not just one of the two.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cross-timber-school',
      kind: 'worked_example',
      problem:
        "The Cross Timber school district is choosing between two properties for a new school.\nProperty Larkspur: an enormous flat parcel with solid ground and plenty of room for a building and playing fields, but it is an hour's drive from the nearest neighborhood, and no road yet connects it to town.\nProperty Hazelbrook: a smaller but still ample flat parcel with solid ground, within walking distance of the two biggest neighborhoods, and directly on the existing school bus route.\nA student says: \"Property Larkspur has the biggest, flattest lot, so it must be the best choice for the new school.\" Use the move-it test to check whether that is true, and decide which property the district should choose.",
      steps: [
        "Apply the move-it test to Property Larkspur's facts. The flat ground, the solid ground, and the large size would all travel with that patch of ground if it were moved, so they are site facts -- and they are genuinely strong ones.",
        "Now test the rest of Larkspur's facts. The hour's drive from the nearest neighborhood, and the missing road, depend entirely on what lies around the property, not on the ground itself, so they are situation facts -- and they are poor ones.",
        'Correct the student\'s claim. WRONG: "The biggest, flattest lot must be the best choice." A strong site does not decide the choice by itself. CORRECT: "A good site is only half the reasoning. The situation has to be checked separately, and Property Larkspur\'s situation is poor."',
        "Now run both questions on Property Hazelbrook. Its flat, solid ground is a site fact, and it is good, even though the parcel is smaller. Being within walking distance of the two biggest neighborhoods and on the existing bus route are situation facts, and they are also good.",
        'Compare the two properties. Larkspur has a good site and a poor situation. Hazelbrook has a good site and a good situation. Cross Timber should choose Property Hazelbrook.',
        'State the justification with one fact from each category: "Choose Property Hazelbrook because its ground is flat and solid, and it is within walking distance of the students it would serve." Naming only the size of a lot, the way the student did, is never a complete justification.',
      ],
      answer:
        "No, the student's claim is not correct. Property Larkspur has a strong site but a poor situation -- it is an hour from the nearest neighborhood with no road built yet. Property Hazelbrook has a good site and a good situation, so Cross Timber should choose Hazelbrook. A complete justification always names one site fact and one situation fact, never the size of a lot alone.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-driftwood-bend-skate-park',
      kind: 'try_yourself',
      problem:
        'The town of Driftwood Bend is choosing between two lots for a new skate park.\nLot A sits near downtown, has a paved, flat surface, and is close to the bus stop that most teens in town already use to get around.\nLot B sits out past the old mill, also has a flat gravel surface, but has no bus route nearby and is a forty-minute walk from the nearest neighborhood.\nWhich statement gives a reason that actually supports choosing Lot A for the new skate park?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Lot A is close to the bus stop many teens already use, so it will be easy for skaters to reach.', correct: true },
        { id: 'b', text: 'Lot B is close to the bus stop many teens already use, so it will be easy for skaters to reach.' },
        { id: 'c', text: 'Skateboarding is a popular activity for kids this age, so Lot A is the right choice.' },
        { id: 'd', text: 'Lot A has flat, paved ground, which is a situation fact that makes it a good place to skate.' },
      ],
      expectedAnswer: 'Lot A is close to the bus stop many teens already use, so it will be easy for skaters to reach.',
      hints: [
        'Ask which lot the sentence is actually describing, and whether the reason given is really about the ground or about what is nearby.',
        'A valid reason has to name a true site or situation fact about the SAME lot the item is asking about -- not a fact about the other lot, not an unrelated true statement, and not a fact mislabeled into the wrong category.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-foxglove-garden',
      kind: 'try_yourself',
      problem:
        'The town of Foxglove is choosing a lot for a new community garden. Lot Marigold has soil that is rich and well-drained, and its ground is flat and easy to dig raised garden beds into. Lot Marigold is also a short walk from three different neighborhoods, and there is a bike path connecting it to the rest of town.\nWhich pair of facts gives ONE correct site reason and ONE correct situation reason for choosing Lot Marigold?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The soil is rich and well-drained, and the ground is flat and easy to dig raised beds into.' },
        { id: 'b', text: 'The lot is a short walk from three neighborhoods, and it is also connected to the rest of town by a bike path.' },
        { id: 'c', text: 'The soil is rich and well-drained, and the lot is a short walk from three neighborhoods.', correct: true },
        { id: 'd', text: 'The soil is rich and well-drained, and many families in town enjoy growing vegetables.' },
      ],
      expectedAnswer: 'The soil is rich and well-drained, and the lot is a short walk from three neighborhoods.',
      hints: [
        'Check each half of every pair separately: is it a fact about the ground itself, or a fact about what lies around the ground?',
        'Three of these pairs give two facts of the same kind -- either both about the ground, both about what surrounds it, or one fact that is not a site or situation fact at all. Only one pair gives exactly one of each kind.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sparrow-creek-library',
      kind: 'try_yourself',
      problem:
        "Sparrow Creek is opening a new library branch on a piece of land called the Grange lot. The Grange lot has enough flat, solid ground for the building and a parking area, its fence is painted white, and it sits within walking distance of most of the town's neighborhoods. A different lot nearby, once home to an old feed store, sits along the town's main highway.\nWhich of these facts is a genuine reason that supports building the new library on the Grange lot?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "The old feed store lot sits within walking distance of most of the town's neighborhoods." },
        { id: 'b', text: 'The Grange lot sits within walking distance of most of the town\'s neighborhoods, so residents could easily reach the new library there.', correct: true },
        { id: 'c', text: "The Grange lot's fence has just been painted white, and a tidy-looking fence is nice for a neighborhood." },
        { id: 'd', text: 'The Grange lot is within walking distance of most neighborhoods, which is a site fact about the ground itself.' },
      ],
      expectedAnswer: 'The Grange lot sits within walking distance of most of the town\'s neighborhoods, so residents could easily reach the new library there.',
      hints: [
        'Ask whether the fact is actually about the Grange lot itself, and whether it is a fact about the ground or a fact about what is nearby.',
        'A true fact only counts as a reason if it is really about this location and really is a site or situation fact -- not a fact about a different place, not an unrelated true detail, and not a fact from the wrong category.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fact-count-and-any-true-fact',
      kind: 'misconception_check',
      question:
        "A student says: \"Location Falcon has six good facts listed about it, so it must be the best choice. Also, the fact that Location Falcon's mailbox is painted red is a good reason to pick it, since it is true.\" What is wrong with each half of that?",
      commonErrors: [
        {
          answer: 'Location Falcon has six good facts listed about it, so it must be the best choice.',
          misconception:
            'Treating the number of facts written down as the measure of a good choice, instead of checking whether the site is genuinely good and the situation is genuinely good.',
          correctsTo:
            'The number of facts listed does not decide anything. A location could have many small facts written about it and still have a poor site or a poor situation, and a location with only two facts -- one strong site fact and one strong situation fact -- can be the better choice. What matters is whether the site itself is good and whether the situation itself is good, not how long the list is.',
        },
        {
          answer: "The fact that Location Falcon's mailbox is painted red is a good reason to pick it, since it is true.",
          misconception:
            'Assuming that any true statement about a place counts as a reason to choose it, without checking whether the fact is actually about the ground (a site fact) or about what surrounds it (a situation fact).',
          correctsTo:
            'Being true is not enough. A real justification has to be a site fact or a situation fact -- something about the ground itself, or something about what the spot connects to. The color of a mailbox is true, but it is not a fact about the ground and not a fact about what surrounds the spot, so it gives no reason at all to choose that location over another one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Site-and-situation reasoning works the same way for choosing where to put something new as it does for explaining why an old settlement grew somewhere: check the ground itself, and check what is nearby.',
        'A good choice needs a good site AND a good situation. A strong site with a poor situation, or a poor site with a strong situation, is not enough on its own.',
        'A justification is a stated reason grounded in a real site or situation fact -- not just any true statement about the place.',
        'A justification can go wrong even when its fact is true: the fact might belong to a different location, or it might have nothing to do with the ground or its surroundings, or it might mix up which category it belongs to.',
        'The move-it test still works here: a fact that would travel with the ground if it were moved is a site fact; a fact that depends on what happens to be nearby is a situation fact.',
        'Counting how many facts are listed about a location does not decide which one is better. A short list with a genuinely good site fact and a genuinely good situation fact beats a long list that is weak on one or both.',
        'The best answer to a siting question always names one site reason and one situation reason together, not one of the two alone.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Geographic Reasoning in Everyday Decisions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
