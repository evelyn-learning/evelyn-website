/**
 * Grade 7 World Geography — Government & Citizenship: Borders, Boundaries & Conflict.
 *
 * Concept-led row for the m7geo course (National Geography Standard 13).
 * Teaches the STRUCTURAL FRAMEWORK -- natural, geometric and cultural
 * boundaries, territory and sovereignty, why the TYPE of a boundary changes
 * what can go wrong with it, and why most boundaries are managed peacefully
 * by agreement -- and nothing else.
 *
 * NOTE FOR FUTURE AUTHORS, and this file is the sharpest edge in the whole
 * course: this row is about conflict, so it is the single most likely place
 * to assert a contested political claim to a twelve-year-old on a page a
 * search engine will index. The rule that governs this file is fan-out
 * contract rule 6 -- avoid contested political claims.
 *
 * What that means concretely, and what a future edit must preserve:
 *   - NO current or recent territorial dispute, occupied territory, contested
 *     region, separatist movement or ongoing conflict is named. Not one. Not
 *     even as a neutral aside, and not even in a distractor.
 *   - NO sovereignty claim is stated as fact, and no side is taken on
 *     anything. Where a disagreement is described, it is described as a
 *     disagreement, with no blame assigned.
 *   - EVERY scenario uses invented countries and invented places. Aldoria,
 *     Bracken, Verano, Silt, Norlund and Cordia do not exist. That is the
 *     point. A made-up river between two made-up states teaches the concept
 *     exactly as well and cannot be misread as a claim about anybody.
 *   - Reasons boundaries are disputed are taught as CAUSES, never as CASES.
 *     It is safe, and true, to say as a general historical pattern that some
 *     boundaries were drawn by outside powers without regard to the people
 *     living there and that this has caused lasting difficulty. It is not
 *     safe to name which ones. This file says the general thing and stops.
 *   - COOPERATION IS THE OTHER HALF OF THE ROW and is stated explicitly, more
 *     than once. Most boundaries in the world are quiet, and neighboring
 *     states cooperate across them constantly. A version of this lesson that
 *     leaves a twelve-year-old thinking borders equal war has failed, even if
 *     every sentence in it is defensible.
 *   - No casualty figures, no conflict dates, no invented statistics, and no
 *     characterization of the people of any country or region.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U6_BORDERS_AND_CONFLICT: LessonPlan = {
  id: 'evelyn.ms.m7geo.borders-and-conflict.v1',
  title: 'Borders, Boundaries & Conflict',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.borders-and-conflict',
      standard: 'M7GEO-6.3',
      description:
        'Classify boundaries as natural, geometric or cultural, explain how territory and sovereignty work, and analyze both the general causes of boundary disagreements and the ways neighboring states cooperate across boundaries (National Geography Standard 13: how the forces of cooperation and conflict among people influence the division and control of Earth surface).',
    },
  ],
  prerequisites: ['m7geo.citizenship-and-rights'],
  followUps: ['m7geo.international-cooperation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that a boundary is a decision somebody made, not something that was already there.',
      script:
        'You have almost certainly crossed a boundary without noticing it. A road sign goes by, the road keeps going, and nothing under the wheels changes. There is no painted stripe across the fields. And yet on one side of that invisible line one set of laws applies, and on the other side a different set applies. Somebody chose where to put that line. Sometimes they followed a river. Sometimes they drew a straight line with a ruler. Sometimes they tried to follow where one language stopped and another started. Today we work out how boundaries get chosen, why the choice still matters years later, and why the great majority of them are quiet.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-boundary-types',
      kind: 'concept',
      goal: 'Install the three boundary types, territory and sovereignty, the general causes of disagreement, and the cooperation half of the picture.',
      keyIdeas: [
        'A BOUNDARY IS THE LINE WHERE ONE STATE TERRITORY ENDS AND ANOTHER BEGINS. Territory is the area a state controls. Sovereignty means the state makes its own laws inside that territory and no outside state gets to make them for it. That is why the invisible line matters: cross it and you are under a different set of laws, a different currency and a different government, even though the ground looks the same.',
        'A NATURAL BOUNDARY, ALSO CALLED A PHYSICAL BOUNDARY, FOLLOWS A LANDFORM -- a river, a lake, a mountain range, a coastline. It is easy to see and easy to agree on at the start, which is why so many boundaries were drawn this way. But a landform is not a fixed object. A river can slowly shift its channel over many years, and when the feature moves, the two states may end up reading the same old agreement in two different ways.',
        'A GEOMETRIC BOUNDARY FOLLOWS A STRAIGHT LINE, usually a line of latitude or a line of longitude. Straight lines are simple to write down and simple to survey. The weakness is the opposite of the natural boundary: a straight line takes no notice at all of who lives on either side of it, or of which valley, farm or town it happens to run through.',
        'A CULTURAL BOUNDARY FOLLOWS A DIFFERENCE BETWEEN PEOPLE, most often a difference in language or in religion. This sounds like the fairest of the three, and sometimes it is. The difficulty is that people do not sort themselves into neat blocks. Languages blend into one another, families move, and communities live mixed together, so a cultural boundary can leave part of one group on each side of the line.',
        'BOUNDARIES ARE SOMETIMES DISPUTED, AND THE CAUSES ARE PREDICTABLE. Four keep coming up. First, a boundary was drawn without regard to the people living there. Second, a valuable resource such as water, farmland or fish sits across the line, so both states need the same thing. Third, the physical feature the boundary followed has moved. Fourth, two states hold different accounts of history and each reads its own account as giving it the stronger claim. Notice that these are CAUSES, not accusations. When two states disagree about a boundary, a geographer describes that a disagreement exists and does not decide who is right.',
        'MOST BOUNDARIES ARE PEACEFUL, AND COOPERATION IS THE NORMAL CASE. The great majority of the boundaries on Earth are settled, marked and quiet, and they are kept that way by agreement -- treaties, joint commissions that survey the line, and courts the two sides agree to use. Neighboring states cooperate across their boundaries every single day: sharing a river so that both sides get water, keeping roads and rail lines connected, running border crossings so that trade and travel work, and coordinating on floods, wildfires and disease. Borders are not the same thing as war. A border is mostly a place where two states have worked out how to live next to each other.',
      ],
      vocabulary: [
        { term: 'boundary', definition: 'the line that marks where one state territory ends and another begins.' },
        { term: 'territory', definition: 'the area of land and water that a state controls.' },
        { term: 'sovereignty', definition: 'a state authority to make its own laws inside its own territory.' },
        { term: 'natural boundary', definition: 'a boundary that follows a landform such as a river, lake or mountain range. Also called a physical boundary.' },
        { term: 'geometric boundary', definition: 'a boundary that follows a straight line, such as a line of latitude or longitude.' },
        { term: 'cultural boundary', definition: 'a boundary that follows a difference between people, such as a difference in language or religion.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-three-boundaries',
      kind: 'worked_example',
      problem:
        'Classify each of these three boundaries as natural, geometric or cultural, and for each one name the weakness that type is known for.\n\n1. Aldoria and Bracken are separated by a river. The agreement between them says the boundary runs down the middle of the channel.\n2. Norlund and Cordia are separated by a boundary that runs due east and west along a single line of latitude, from one coast to the other.\n3. In a third case, two states were formed so that the boundary between them ran where one widely spoken language gave way to another.',
      steps: [
        'Ask the same question of each one: what is the line following? Not what the line separates -- what it FOLLOWS. That single question does all three classifications.',
        'Case 1 follows a river, and a river is a landform. So it is a NATURAL boundary, sometimes called a physical boundary. Its known weakness is that the feature can move: a river can shift its channel over years, and then the two states may read the same old agreement differently.',
        'Case 2 follows a line of latitude, which is a straight line drawn on the globe rather than anything you could trip over. So it is a GEOMETRIC boundary. Its known weakness is that a straight line pays no attention to who lives on either side, or to which farm or town it cuts through.',
        'Case 3 follows a difference in language, which is a difference between people. So it is a CULTURAL boundary. Its known weakness is that people do not live in neat blocks, so part of a language community can end up on each side of the line.',
        'Watch the common mix-up in case 2. A line of latitude is real in the sense that it can be surveyed and marked, but it is not a landform. Nothing about the ground changes as you cross it. Latitude and longitude lines are always geometric, never natural.',
        'One more thing worth saying out loud: naming the weakness of a type is not the same as predicting trouble. All three of these boundaries can be, and usually are, completely peaceful. The weakness only tells you where a disagreement WOULD start if one ever did.',
      ],
      answer:
        'Case 1 is a natural or physical boundary; its weakness is that the river can shift its channel. Case 2 is a geometric boundary; its weakness is that a straight line ignores who lives on either side. Case 3 is a cultural boundary; its weakness is that a group can be left split across the line.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-shifting-river',
      kind: 'worked_example',
      problem:
        'Verano and Silt agreed many years ago that their boundary would run down the middle of the channel of a river between them. Since then the river has slowly shifted its channel westward, and a strip of farmland that used to sit on the Silt side now sits on the Verano side of the water. Explain how a disagreement could arise here, and then explain how two states in this position would usually settle it.',
      steps: [
        'Start with what actually changed. The agreement did not change. The farmland did not move. The RIVER moved, and the boundary was defined by the river.',
        'Now you can see the two readings, and both are reasonable. Verano can read the agreement as saying the boundary is wherever the channel is today, which would place the strip in Verano. Silt can read it as saying the boundary is where the channel was on the day they signed, which would keep the strip in Silt.',
        'Say clearly what kind of problem this is. It is not a case of one state being dishonest. It is a natural boundary meeting the known weakness of natural boundaries: the feature moved, and the agreement did not say what should happen when it did.',
        'Notice what a geographer does NOT do here. A geographer does not decide that Verano is right or that Silt is right. Describing a disagreement is a geography task. Deciding who owns the strip is not.',
        'Now the settlement, which is the ordinary outcome. Two states in this position normally negotiate a new agreement that spells out the thing the old one left open -- for example, fixing the boundary at surveyed markers on the ground so that it stops depending on where the water happens to run. Many states also set up a joint commission, a permanent team with members from both sides, to survey the line and handle exactly this kind of question as it comes up.',
        'And keep the scale in view. Verano and Silt still share the river. Both sides still want the water, the bridge and the trade across it to keep working, and that shared interest is usually the strongest reason a case like this gets settled rather than left to fester.',
      ],
      answer:
        'The disagreement arises because the boundary was defined by a feature that moved: Verano can read the boundary as the channel today, Silt as the channel at signing, and the original agreement did not say which. It would usually be settled by a new agreement fixing the line at surveyed markers on the ground, often overseen by a joint commission with members from both states.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-identify-boundary-type',
      kind: 'try_yourself',
      problem:
        'The boundary between two states runs exactly along a single line of longitude, straight from the northern coast of the continent to the southern coast, crossing plains, a forest and a range of hills without bending. What type of boundary is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A natural boundary, because a line of longitude is a feature of the Earth' },
        { id: 'b', text: 'A natural boundary, because it crosses plains, a forest and hills' },
        { id: 'c', text: 'A geometric boundary, because it follows a straight line such as a line of longitude', correct: true },
        { id: 'd', text: 'A cultural boundary, because the two states have different governments' }
      ],
      expectedAnswer: 'A geometric boundary, because it follows a straight line such as a line of longitude',
      hints: [
        'The test is what the line FOLLOWS, not what it happens to pass through. Read the problem again and find the one thing the line follows.',
        'A natural boundary follows a landform you could stand on -- a river, a lake, a mountain range. Ask yourself whether a line of longitude is a landform.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-type-matters',
      kind: 'try_yourself',
      problem:
        'Two states set their boundary along the middle of a river. Over many years the river slowly shifts its channel. Which problem is this shift most likely to create?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two states may come to disagree about where the boundary now lies, because the feature it follows has moved', correct: true },
        { id: 'b', text: 'The boundary stops being a natural boundary and becomes a geometric boundary' },
        { id: 'c', text: 'The boundary disappears, and the two states no longer have a boundary at all' },
        { id: 'd', text: 'The boundary becomes a cultural boundary, because people on the two sides are now separated' }
      ],
      expectedAnswer: 'The two states may come to disagree about where the boundary now lies, because the feature it follows has moved',
      hints: [
        'A boundary defined by a feature depends on that feature staying put. Ask what happens to the definition when the feature does not stay put.',
        'Three of these say the boundary changes into something else or vanishes. Moving a river does not rewrite an agreement or erase a line; it just makes the old wording point at two different places.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-analyze-drawn-line',
      kind: 'try_yourself',
      problem:
        'Mapmakers who had never visited the area drew a straight boundary line between Aldoria and Bracken. A community that shares one language now lives on both sides of that line. Which statement best explains the geographic problem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The boundary is a cultural boundary, because a language community is involved' },
        { id: 'b', text: 'The boundary was drawn without regard to the people living there, so one community is now divided between two states', correct: true },
        { id: 'c', text: 'The boundary is not valid, because every boundary must follow a river or a mountain range' },
        { id: 'd', text: 'The two states cannot cooperate, because a divided community always leads to fighting' }
      ],
      expectedAnswer: 'The boundary was drawn without regard to the people living there, so one community is now divided between two states',
      hints: [
        'Sort the type first. The line was drawn straight by mapmakers, so it is geometric -- and the known weakness of a geometric boundary is exactly what the problem describes.',
        'Check the last choice carefully against the concept. Is it true that a divided community ALWAYS leads to fighting, or are most boundaries managed peacefully by agreement?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-borders-equal-war',
      kind: 'misconception_check',
      question:
        'A student writes: "Borders are the places where countries fight, so a country with lots of neighbors is in constant trouble." What is wrong with that, and what is the more accurate picture?',
      commonErrors: [
        {
          answer: 'Borders are the places where countries fight, so a country with lots of neighbors is in constant trouble.',
          misconception:
            'Treating conflict as the normal condition of a boundary. Disagreements are the rare and newsworthy cases, so they are the only ones a student ever hears about, and the quiet boundaries never come up.',
          correctsTo:
            'The great majority of boundaries on Earth are settled, marked and peaceful, and they stay that way through ordinary agreement -- treaties, joint commissions that survey the line, and courts both sides agree to use. Across those boundaries neighboring states cooperate constantly: sharing river water, keeping roads and rail lines connected, running crossings so trade and travel work, and coordinating on floods, wildfires and disease. Having many neighbors mostly means having many agreements to maintain, not many fights. WRONG: "A border is where two countries fight." CORRECT: "A border is where two states have worked out how to live next to each other, and disagreements are the exception rather than the rule."',
        },
        {
          answer: 'A natural boundary is the fairest kind, because nature drew it instead of people.',
          misconception:
            'Assuming that following a landform removes human judgment from the decision, and that a physical feature is permanent.',
          correctsTo:
            'People still chose to use that river or that ridge, and people still chose which side of it the line would run on -- the middle of the channel, one bank, or the crest of the range. Nature did not draw anything. A landform can also move, which is the one weakness a geometric line does not have: a shifting river channel can leave an old agreement pointing at two different places. Every boundary type has a strength and a weakness. None of them is automatically fair.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A boundary marks where one state territory ends and another begins. Sovereignty means a state makes its own laws inside its own territory.',
        'Three types, sorted by asking what the line FOLLOWS: natural follows a landform, geometric follows a straight line such as latitude or longitude, cultural follows a difference such as language or religion.',
        'Each type has its own weakness. A natural feature can move, a straight line ignores who lives there, and a cultural line can leave a group split.',
        'Boundary disagreements have predictable causes: a line drawn without regard to the people living there, a resource sitting across the line, a physical feature that has moved, and different historical claims.',
        'Describing that a disagreement exists is geography. Deciding who is right is not, and this course does not do it.',
        'Most boundaries are quiet. They are managed by treaties and joint commissions, and neighboring states cooperate across them every day on rivers, roads and trade.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Borders, Boundaries & Conflict' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
