/**
 * Grade 6 World Geography — Thinking Like a Geographer & Spatial Skills: Site
 * & Situation.
 *
 * CONCEPT-LED fan-out row for the m6geo course (National Geography Standard
 * 3, row 1.4, closing Unit 1). The student has no procedure to run here, so
 * the lesson installs one picture: every place has two separate kinds of
 * facts about it -- what the exact ground is like (its SITE) and what lies
 * around it (its SITUATION) -- and a settlement tends to grow where both
 * help. This row closes Unit 1, and its site/situation split is the reasoning
 * Unit 10's `geographic-reasoning-in-everyday-decisions` (10.1) explicitly
 * reuses, so the distinction is built to be sorted, not just recited: every
 * try_yourself item requires classifying a described feature rather than
 * recalling which word means which.
 *
 * SCOPE GUARD: this row says THAT a place's site (the exact ground it sits
 * on) and its situation (its position relative to what surrounds it) are two
 * separate kinds of facts, and THAT a settlement tends to grow where a
 * useful site meets a useful situation. It names NO closed list of the
 * reasons cities form and NO settlement-pattern typology. Grade 7's
 * `m7geo-u3-urbanization-and-settlement.ts` teaches both: a four-item closed
 * typology of site reasons (water, a defensible or central site, a
 * break-of-bulk point, a resource) and the linear/clustered/dispersed
 * settlement-pattern typology, plus the two-step reasoning chain connecting
 * physical geography to settlement density. None of that appears here. The
 * sentence this file does not write is Grade 7's: "cities form at sites that
 * solve a problem, and four reasons cover most of them." This file only ever
 * gives ONE link of reasoning at a time -- a site offers something useful, so
 * it is easier to live on; a situation connects a place usefully, so it is
 * easier to use -- and never chains those into a mechanism or names a
 * category of reasons beyond site and situation themselves.
 *
 * Sideways, this row is easy to blur with row 1.3
 * (`absolute-and-relative-location`), because situation and relative location
 * both describe a place using what is near it. They are not the same job.
 * Relative location is a LOCATING description -- naming a nearby place so
 * someone can find the spot, the way "the store is two blocks from the
 * school" locates the store. Situation is a REASONING description -- asking
 * whether what surrounds a spot is useful for living, trading, or traveling,
 * regardless of whether that helps anyone find it. The same nearby river can
 * be used either way, and this file never re-teaches the locating job; it
 * only asks the reasoning question. Three of this file's try_yourself
 * choices name "absolute location" and "relative location" as distractors
 * precisely at this boundary, briefly glossed inline so the item stays
 * solvable on its own -- this reuses row 1.3's already-taught terms as a
 * foil, and teaches nothing new about them.
 *
 * What IS deliberately allowed: one real, physical, long-settled anchor. The
 * concept segment names that New York City sits where the Hudson River meets
 * a large, sheltered natural harbor before the water opens onto the Atlantic
 * Ocean, and says the harbor is part of the site while the river's reach
 * inland and the ocean's reach outward are part of the situation. This is
 * used only to show one real case where a useful site met a useful
 * situation, phrased as "part of why" rather than the single named cause --
 * no population figure, no ranking claim, no claim about when or by whom it
 * was settled, and no boundary-type or landform-building mechanism. Every
 * other place in this file (Millbrook, Fairview, the mountain cabin, the
 * weather-station-style facts in try_yourself) is invented, per the course's
 * invented-place default.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: read every keyIdea below and notice
 * what never appears -- no named category of settlement site beyond "site"
 * and "situation" themselves, no settlement-pattern shape, and no chain
 * longer than one link. If a sentence here would sit comfortably inside
 * `m7geo-u3-urbanization-and-settlement.ts`, it does not belong in this file.
 *
 * CHECK-MOVE NOTE: this row's worked examples do not fit either standardized
 * geography check variant cleanly (there is no rewindable procedure and no
 * three-clues-of-different-kinds evidence chain), so this file uses an
 * adapted, equivalent move named explicitly in-lesson: THE MOVE-IT TEST --
 * picture picking up the exact patch of ground and setting it down somewhere
 * else; any fact that would travel with it is site, and any fact that
 * depends on what happens to be nearby is situation, because it would change
 * if the ground moved. The first worked example introduces and applies it;
 * the second worked example re-applies it to a contrasting case (a strong
 * site paired with a poor situation) so the student cannot overlearn that the
 * two always travel together.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, 94% at difficulty 4; chance with four choices is 25%). Every
 * distractor below states a full wrong reason rather than a bare label, and
 * no key was built to be the longest choice BECAUSE it is the key -- see the
 * character counts in the authoring report. The three keys sit at ids a, c
 * and d, which is the id set `(1 + 4) mod 4 = 1` requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U1_SITE_AND_SITUATION: LessonPlan = {
  id: 'evelyn.ms.m6geo.site-and-situation.v1',
  title: 'Site & Situation',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.site-and-situation',
      standard: 'M6GEO-1.4',
      description:
        "Distinguish a place's site (its exact physical spot) from its situation (its position relative to surrounding places) and use both to reason about why a settlement tends to form where it does (National Geography Standard 3: how to analyze the spatial organization of people, places and environments).",
    },
  ],
  prerequisites: ['m6geo.absolute-and-relative-location'],
  followUps: ['m6geo.parts-of-a-map'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the two-questions-at-once feeling concrete through a relatable choice, before any vocabulary arrives.',
      script:
        'Picture your family arriving at a campground with three empty campsites left. Campsite one is flat, dry ground under thick shade, but it sits all the way at the far end of the campground, a long walk from the bathrooms and the lake. Campsite two is lumpy and half-swampy, but it sits right next to the lake and two minutes from the bathrooms. Campsite three is flat and dry, and it is also close to the lake and the bathrooms. Your family is not just picking a dot. You are weighing two different questions at once: what is the ground right here actually like, and what is nearby and useful once you are set up. Geographers ask those same two questions about every place people have ever settled, from a single campsite to a huge city, and today you get the two words for them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-site-and-situation',
      kind: 'concept',
      goal: 'Install the site/situation definitions, the split from relative location, the sorting test, and one real anchor showing both together.',
      keyIdeas: [
        "SITE IS THE EXACT PHYSICAL SPOT A PLACE SITS ON. Site describes the ground itself: is it flat or hilly, high or low, dry or wet, solid rock or soft mud, on an island or on the mainland, with fresh water right there or not. Site answers one question only -- what is true about this one exact patch of ground -- without looking anywhere else.",
        'SITUATION IS A PLACE\'S POSITION RELATIVE TO WHAT SURROUNDS IT. Situation describes how a place sits compared to the larger area around it: whether it is near a coast, along a river that leads somewhere, between two mountain ranges, or along a route that connects it to other places. Situation looks outward from the spot instead of down at it.',
        'SITUATION IS NOT THE SAME JOB AS RELATIVE LOCATION. Naming a nearby place to help someone find a spot is relative location -- it answers "where is this." Situation answers a different question: does what surrounds this place make it useful for living, trading, or traveling. The same nearby river can do either job: saying "the town by the river" locates the town, while saying the river lets boats reach the town from far away describes its situation.',
        'EVERY DESCRIBED FEATURE SORTS INTO SITE OR SITUATION, NOT BOTH. Ask one question of it: does this fact describe the ground the place sits on, or does it describe what lies around that ground. Flat land, dry or wet ground, solid rock, and water right there are all site. A nearby mountain range, a route to another region, and distance to another settlement are all situation.',
        'A SETTLEMENT TENDS TO GROW WHERE A USEFUL SITE MEETS A USEFUL SITUATION. A site that offers something people need right there -- flat ground, fresh water, solid ground to build on -- makes a spot easier to live on. A situation that connects a place usefully to what surrounds it -- a route through, closeness to other places -- makes a spot easier to use once people are living there. Neither one by itself decides where a settlement grows; both play a part together.',
        'MANY REAL SETTLEMENTS GREW WHERE A GOOD SITE MET A GOOD SITUATION. New York City sits where the Hudson River meets a large, sheltered natural harbor, before the water opens onto the Atlantic Ocean. The sheltered, deep water right at that spot is part of the site -- good for ships to anchor. The river reaching far inland, and the ocean reaching outward, are part of the situation -- connecting that harbor to places both upriver and across the sea. A useful site and a useful situation together, not just one of them, are part of why a settlement grows large in a place like this.',
      ],
      vocabulary: [
        { term: 'site', definition: 'the exact physical spot a place occupies, described by the ground itself -- things like elevation, flatness, and what is right there.' },
        { term: 'situation', definition: 'a place\'s position relative to what surrounds it -- nearby features, routes, and other places -- described by looking outward from the spot rather than at the spot itself.' },
        { term: 'settlement', definition: 'a place where people build homes and live together, ranging from a small village to a large city.' },
        { term: 'harbor', definition: 'an area of water along a coast that is sheltered enough for ships to anchor safely.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-millbrook-sort-and-reason',
      kind: 'worked_example',
      problem:
        'An invented town called Millbrook has these four facts about it:\n1. The ground is flat and dry, with solid rock underneath, good for building.\n2. A freshwater spring rises right at the edge of the town.\n3. Millbrook sits at the only pass through a mountain range, on the route between two large regions.\n4. Millbrook is a two-day walk from the region\'s biggest market town.\n\nSort each fact into site or situation, then explain why Millbrook is a place a settlement would tend to grow.',
      steps: [
        'Use the move-it test on each fact. Picture picking up this exact patch of ground and setting it down somewhere else entirely, keeping the ground itself unchanged. Any fact that would travel with that patch of ground is site. Any fact that depends on what happens to be nearby is situation, because it would change if the ground moved.',
        'Fact 1: flat, dry ground with solid rock underneath. This describes the ground itself, so it would travel with the patch if moved. Site.',
        'Fact 2: a freshwater spring right at the edge of town. Also a property of this exact ground. Site.',
        'Fact 3: the mountain pass and the route between two regions. If this patch of ground were set down somewhere else, the mountains and the route would not come with it -- this fact depends on what lies around the spot. Situation.',
        'Fact 4: distance to the region\'s biggest market town. Again this depends on where another place happens to be, not on the ground itself. Situation.',
        'Put it together. Millbrook\'s site (facts 1 and 2) offers flat, solid, well-watered ground -- something people need right where they build. Millbrook\'s situation (facts 3 and 4) places it on the only route through the mountains, connecting two regions. A site with something useful, meeting a situation with a useful connection, is why a settlement would tend to grow at Millbrook.',
      ],
      answer:
        'Facts 1 and 2 (flat, solid, dry ground with a spring at the edge) are site, because they describe the ground itself. Facts 3 and 4 (the mountain pass route and the distance to the market town) are situation, because they describe what lies around Millbrook. Millbrook\'s site gives it good ground to build on, and its situation connects it usefully to another region, and together those are why a settlement would tend to grow there.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cabin-strong-site-poor-situation',
      kind: 'worked_example',
      problem:
        'A cabin sits high on a remote mountain. The ground under it is flat, dry, and solid, and a clear freshwater spring is right beside it. But the cabin is a full week of travel from the nearest other settlement in any direction, and no trade route or path passes anywhere near it. A student says: "This is a great site, so it must also have a great situation." Use the move-it test to check whether that is true.',
      steps: [
        'Re-apply the move-it test to each fact. The flat, dry, solid ground and the spring beside it would travel with the patch of ground if it were moved, so they are site facts -- and they are genuinely good ones.',
        'Now the distance and the missing route: a week of travel to the nearest settlement, and no route passing nearby. These depend entirely on what lies around the cabin, not on the ground itself, so they are situation facts.',
        'Check whether those situation facts are good or poor. Being a week from anywhere, with no route nearby, makes the cabin very hard to reach and very hard to supply or trade from. That is a poor situation.',
        'Correct the student\'s claim. WRONG: "A great site means the situation must also be great." CORRECT: "Site and situation are separate facts about a place, and one can be strong while the other is weak." This cabin has an excellent site and a poor situation at the same time.',
        'Check the idea the other way too, so it is not overlearned in only one direction: a marshy, hard-to-build-on patch of ground -- a poor site -- can still sit exactly where an important route crosses, giving it a strong situation. Good or poor travels separately with each one.',
        'The check to remember: deciding whether a settlement is likely to grow somewhere means asking both questions on their own -- what is the ground here like, and what does this spot connect to -- and neither answer can be guessed from the other.',
      ],
      answer:
        'No, that is not true. The move-it test shows the flat, dry, solid ground and the spring are site facts, and they are strong. But the distance to the nearest settlement and the missing route are situation facts, and they are poor. A place can have an excellent site and a poor situation at the same time, so each one must be checked separately.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sort-a-site-fact',
      kind: 'try_yourself',
      problem:
        'A description says: "The ground at this spot is high and dry, safe from flooding." Which category does this fact fit?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Site -- a fact about the exact ground this spot sits on', correct: true },
        { id: 'b', text: 'Absolute location -- a fixed address or coordinate that names this exact spot' },
        { id: 'c', text: 'Situation -- a fact about what lies around this spot and connects it to other places' },
        { id: 'd', text: 'Relative location -- a description of this spot using the name of one nearby place' },
      ],
      expectedAnswer: 'Site -- a fact about the exact ground this spot sits on',
      hints: [
        'Ask whether this fact describes the ground itself, or describes something nearby that the ground is compared to or connected to.',
        'Being high and dry is true of the ground right where it sits, no matter what else is around it -- it would still be true if you pictured that exact patch of ground somewhere else entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sort-a-situation-fact',
      kind: 'try_yourself',
      problem:
        'A description says: "This town lies along the only route that connects two mountain valleys." Which category does this fact fit?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Relative location -- a description of this spot using the name of one nearby place, mainly to help someone find it' },
        { id: 'b', text: 'Absolute location -- a fixed address or coordinate that names this exact spot, with no reference to anything nearby' },
        { id: 'c', text: 'Situation -- a fact about what lies around this spot and connects it to other places', correct: true },
        { id: 'd', text: 'Site -- a fact about the exact ground this spot sits on, regardless of what happens to be nearby' },
      ],
      expectedAnswer: 'Situation -- a fact about what lies around this spot and connects it to other places',
      hints: [
        'Ask whether this fact would still be true if you pictured this exact patch of ground moved somewhere else entirely.',
        'Being on a route between two valleys depends on what surrounds the spot, not on the ground itself -- move the ground and the route would not come with it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pair-a-reason',
      kind: 'try_yourself',
      problem:
        'A geographer explains why an invented town named Fairview grew into a large settlement. Which pair of reasons gives ONE fact about site and ONE fact about situation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The town lies along a route between two large regions, and it is also a short walk from the region\'s biggest market town.' },
        { id: 'b', text: 'The ground here is flat and solid, and the soil nearby is also excellent for growing crops.' },
        { id: 'c', text: 'The town is close to the region\'s biggest market, and traders can reach two other towns within a day\'s walk.' },
        { id: 'd', text: 'The ground here is flat and dry, and the town lies along a route that connects two large regions.', correct: true },
      ],
      expectedAnswer: 'The ground here is flat and dry, and the town lies along a route that connects two large regions.',
      hints: [
        'Check each half of every pair separately: is it a fact about the ground itself, or a fact about what lies around the ground?',
        'Three of these pairs give two facts of the SAME kind -- either both about the ground, or both about what surrounds it. Only one pair gives one of each kind.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-situation-is-relative-location-and-they-always-match',
      kind: 'misconception_check',
      question:
        'A student says: "Fernwood\'s situation is that it is next to Cedar River, and that is the same thing as saying Fernwood\'s relative location is next to Cedar River. And since Riverbend has an excellent site, it must also have an excellent situation." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: "Fernwood's situation is that it is next to Cedar River, and that is the same thing as its relative location.",
          misconception:
            'Noticing that both phrases name a nearby feature and concluding they must be the same idea, without checking what job each phrase is doing.',
          correctsTo:
            'The same nearby river can do two different jobs, and they are not the same job. Saying "Fernwood is next to Cedar River" to help someone find Fernwood is relative location -- it answers where is this. Saying that the river lets boats travel between Fernwood and other places far away is situation -- it answers whether what surrounds Fernwood is useful for living, trading, or traveling. Naming a nearby place and reasoning about what that nearby place makes possible are two different questions, even when they mention the same river.',
        },
        {
          answer: 'Riverbend has an excellent site, so it must also have an excellent situation.',
          misconception:
            'Treating site and situation as a pair that always comes together, so that once one is known to be good, the other is assumed to be good too.',
          correctsTo:
            'Site and situation are separate facts about a place, and one can be strong while the other is weak. A place can have flat, dry, well-watered ground -- an excellent site -- while sitting far from every other settlement with no useful route nearby -- a poor situation. The reverse is also possible: a marshy, hard-to-build-on patch of ground can sit exactly where an important route crosses, giving it a poor site but a strong situation. Each one has to be checked on its own; a good answer for one is never evidence for the other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Site is the exact physical spot a place sits on -- its own ground, described by things like elevation, flatness, dryness, and what resources are right there.',
        'Situation is a place\'s position relative to what surrounds it -- nearby features, routes, and other places -- described by looking outward from the spot rather than down at it.',
        'The move-it test tells them apart: if a fact would travel with the exact patch of ground when it is moved elsewhere, it is site; if the fact depends on what happens to be nearby, it is situation.',
        'Situation is not the same as relative location. Relative location uses a nearby place to help find a spot. Situation asks whether what surrounds a spot is useful for living, trading, or traveling.',
        'Site and situation are independent facts. A place can have an excellent site and a poor situation, or a poor site and an excellent situation, at the same time.',
        'A settlement tends to grow where the site offers something useful right there and the situation connects the place usefully to what surrounds it -- both together, not just one.',
        'Many real settlements have grown up next to a natural harbor at a river\'s mouth, like New York City: the sheltered harbor water is part of the site, and the river\'s reach inland and the ocean\'s reach outward are part of the situation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Site & Situation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
