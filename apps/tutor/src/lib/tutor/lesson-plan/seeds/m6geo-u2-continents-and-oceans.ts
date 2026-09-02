/**
 * Grade 6 World Geography — Reading & Using Maps: Continents & Oceans.
 *
 * PROCEDURE-LED shape for the m6geo fan-out (National Geography Standard 1),
 * following the dispatch steering to use the procedure-led exemplar
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts` as the model for
 * handling global position in words with no globe in front of the student.
 * This row is not on either named list in the fan-out contract's exemplar
 * split (it is not "identifying map parts" and it is not "locating world
 * regions"), but it is the same kind of task as both: naming a fixed set of
 * places and describing where each one sits relative to the others, with
 * nothing to explain and nothing to compute. The routine below -- what does
 * it touch, and in which direction -- is this row's equivalent of the
 * hemispheres exemplar's two-question routine.
 *
 * SCOPE GUARD: this row NAMES the seven continents and four major ocean
 * basins and LOCATES each one relative to the others using only compass
 * direction and what-touches-what language. It never uses a latitude or
 * longitude coordinate or a degree measurement of any kind -- that is Grade
 * 7's `m7geo-u1-latitude-longitude-and-location.ts`. It never discusses a map
 * projection or how a flat map distorts size or shape -- that is Grade 7's
 * `m7geo-u1-maps-globes-and-projections.ts`. It never explains WHY the
 * continents sit where they do -- no plate tectonics, no continental drift
 * mechanism; this course's own row 3.2 (`m6geo-u3-earths-moving-plates.ts`)
 * owns THAT the plates move and once carried the continents together, and
 * this row only locates today's continents as they now stand. Sideways
 * inside Grade 6: this row does not teach the parts of a map (row 2.1,
 * `parts-of-a-map`) or the political/physical/thematic distinction (row 2.2,
 * `types-of-maps`), and the words "hemisphere," "Equator," and "Prime
 * Meridian" appear nowhere in this file's LO description or any segment --
 * the only occurrence in the body is the `followUps` array's LO id, which
 * names the next row (2.4, `m6geo-u2-hemispheres-equator-and-prime-
 * meridian.ts`) as data, not as lesson content. It
 * also does not name any sub-region such as Central America or the Caribbean,
 * which is Unit 9's job.
 *
 * What IS deliberately allowed, because this row's own content is entirely
 * locality claims: naming that Europe and Asia share one landmass with no
 * ocean between them, and that Africa is joined to Asia by a narrow strip of
 * land -- both are what-touches-what facts, not a mechanism, and both are
 * needed to answer honestly which continents stand alone. Also deliberately
 * allowed, and required by this row's own hazard: stating OUT LOUD, as a
 * named convention rather than a bare fact, that the seven-continent and
 * four-ocean count is one convention among others (a six-continent Eurasia
 * model, a five-ocean model that names the Southern Ocean). Continent and
 * ocean boundaries are exactly the kind of real convention variance this
 * course's own past error (a fossil site once mis-described as "on the
 * coast" when it was inland) warns against asserting as settled fact.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: there is no Grade 7 seed that teaches
 * naming the continents and oceans from zero, because Grade 7 assumes that
 * knowledge already. Test 5 (open the matching Grade 7 file and read your
 * sentences next to it) therefore does not have a direct target for this row
 * the way it does for a row with a named Grade 7 counterpart lesson; the
 * closest neighbors checked instead were `m7geo-u1-latitude-longitude-and-
 * location.ts` (to confirm no coordinate or degree language leaked in) and
 * `m7geo-u1-maps-globes-and-projections.ts` (to confirm no projection-
 * distortion language leaked in). Every keyIdea and item here is answerable
 * by NAME or LOCATE alone.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was built to be the longest choice because it is
 * the key. Measured as a diagnostic, not as a score: choice character counts
 * are item 1 -- a (key) 86, b 96, c 87, d 63; item 2 -- a 108, b 78, c (key)
 * 91, d 73; item 3 -- a 62, b 95, c 78, d (key) 60. The key is the strictly
 * longest choice in zero of the three items. Zero is not itself the target --
 * see the note in `m6geo-u3-earths-moving-plates.ts` -- but here it fell out
 * of giving every distractor a full stated reason rather than a bare label,
 * not from trimming any key. The three keys sit at ids a, c, and d, which is
 * the id set `(2 + 3) mod 4 = 1` requires, omitting b.
 *
 * NOTE ON prerequisites/followUps: the fan-out contract (unlike the two
 * exemplars, which were registered alone before their neighbors existed)
 * directs every fan-out row to populate its real chain now from the signed
 * curriculum's row table, so both arrays below are populated rather than
 * left empty.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U2_CONTINENTS_AND_OCEANS: LessonPlan = {
  id: 'evelyn.ms.m6geo.continents-and-oceans.v1',
  title: 'Continents & Oceans',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.continents-and-oceans',
      standard: 'M6GEO-2.3',
      description:
        "Name and locate Earth's seven continents and its major ocean basins relative to one another on a globe (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).",
    },
  ],
  prerequisites: ['m6geo.types-of-maps'],
  followUps: ['m6geo.hemispheres-equator-and-prime-meridian'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Motivate naming and locating continents and oceans through a real route a real object travels.',
      script:
        'Imagine you order a soccer ball online from a shop on the other side of the world. The tracking page shows the ball leaving a warehouse, crossing an ocean by ship for weeks, and finally arriving at a port near your home before it gets delivered to your door. Whoever set up that shipping route had to know exactly which ocean the ball would cross and which lands it left from and arrived at. Today you learn the seven big pieces of land and the four big pieces of ocean that cover the whole planet, and how to say where each one sits compared to the others -- with no map in front of you at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-seven-continents-four-oceans',
      kind: 'concept',
      goal: 'Install the seven continents, the four oceans, which continents are joined to a neighbor, and the two-question routine for locating any of them in words.',
      keyIdeas: [
        "A CONTINENT IS ONE OF EARTH'S LARGEST CONTINUOUS AREAS OF LAND, AND AN OCEAN IS ONE OF ITS LARGEST CONTINUOUS AREAS OF SALT WATER. This lesson uses the convention most commonly taught in the United States: seven continents (Africa, Antarctica, Asia, Australia, Europe, North America, South America) and four major oceans (the Pacific, the Atlantic, the Indian, and the Arctic). A convention is simply the way a group of people has agreed to divide something up so they can talk about it clearly.",
        'THREE OF THE SEVEN CONTINENTS SIT ON ONE CONTINUOUS LANDMASS, EVEN THOUGH THEY ARE COUNTED SEPARATELY. There is no ocean or sea between Europe and Asia at all -- the two sit on one connected landmass. Africa is joined to Asia by a narrow strip of land. Geographers still count Africa, Europe, and Asia as three separate continents even though they touch. North America and South America are also joined to each other, by a different narrow strip of land. Australia and Antarctica are the only two continents that stand alone, surrounded entirely by ocean, with no land connection to any other continent. Antarctica sits at the far southern end of the globe, opposite the Arctic Ocean at the far northern end.',
        'THE FOUR OCEANS ARE REALLY ONE CONNECTED BODY OF WATER, DIVIDED BY NAME RATHER THAN BY ANY WALL OR LINE IN THE WATER ITSELF. The Pacific Ocean is the largest of the four, lying between the Americas on one side and Asia and Australia on the other. The Atlantic Ocean is the second largest, lying between the Americas on one side and Europe and Africa on the other. The Indian Ocean lies south of Asia, with Africa to its west and Australia to its east. The Arctic Ocean is the smallest and coldest of the four, sitting at the far northern end of the globe, bordered by North America, Europe, and Asia.',
        'DESCRIBE A LOCATION BY ASKING TWO QUESTIONS, SINCE THERE IS NO MAP TO POINT AT. Question one: what does this continent or ocean touch along its edges? Question two: in which direction -- north, south, east, or west -- does each of those neighbors lie? Answering both questions in words gives a full, checkable description of where something is, the same way spoken directions describe a route without needing a picture.',
        'A POSITION STATEMENT WORKS IN BOTH DIRECTIONS, WHICH IS A WAY TO CHECK IT. If the Atlantic Ocean lies east of North America, then North America must lie west of the Atlantic Ocean -- the same relationship, read from the other side, comes out flipped but never contradicted. Checking a location statement this way catches a direction that was written backward.',
        "GEOGRAPHERS DO NOT ALL DIVIDE THE WORLD THE SAME WAY, SO THIS LESSON'S COUNT IS A CONVENTION, NOT THE ONLY TRUE ANSWER. Some sources combine Europe and Asia into one continent, giving six continents instead of seven. Some sources also name a fifth ocean, the Southern Ocean, for the ring of water that circles Antarctica, instead of counting that water as the southern edges of the Pacific, Atlantic, and Indian. Both counts are used by real geographers; this lesson states which one it is using rather than treating it as the only fact in the world.",
      ],
      vocabulary: [
        { term: 'continent', definition: "one of Earth's largest continuous areas of land." },
        { term: 'ocean', definition: "one of Earth's largest continuous areas of salt water." },
        { term: 'landmass', definition: 'a continuous area of land, which may be shared by more than one continent, such as the single connected landmass that Africa, Europe, and Asia together form.' },
        { term: 'convention', definition: 'a way of doing or naming something that a group of people has agreed on, which could reasonably have been done a different way.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-locate-a-continent',
      kind: 'worked_example',
      problem:
        "A student wants to describe where North America is without pointing at a map. Using the two-question routine, describe North America's position: what does it touch along its edges, and in which direction does each neighbor lie?",
      steps: [
        'Ask question one: what touches North America along its edges? The Arctic Ocean lies along the north. The Atlantic Ocean lies along the east. The Pacific Ocean lies along the west. South America connects to it by a narrow strip of land along the south.',
        'Ask question two: match each neighbor to its direction, which step one has already done -- Arctic to the north, Atlantic to the east, Pacific to the west, South America to the south.',
        'Combine both questions into one full description: North America has the Arctic Ocean to its north, the Atlantic Ocean to its east, the Pacific Ocean to its west, and South America connected to its south by a strip of land.',
        'Check the description by flipping it. If the Atlantic Ocean lies east of North America, then North America has to lie west of the Atlantic Ocean. That flip matches what is true, so the direction in the original description was not written backward.',
        'Check the shape of the answer too. North America borders three different oceans plus one land connection. A large continent can have several neighbors of different kinds; nothing says a continent must touch only one ocean or only one type of neighbor.',
      ],
      answer:
        'North America has the Arctic Ocean to its north, the Atlantic Ocean to its east, the Pacific Ocean to its west, and South America connected to its south by a strip of land. Flipping the Atlantic Ocean statement confirms it: North America lies west of the Atlantic Ocean, which matches.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-joined-or-alone',
      kind: 'worked_example',
      problem:
        'A student writes: "Europe and Asia are separated by an ocean, the same way North America and Europe are. And Australia is connected to Asia by a strip of land, the same way North America is connected to South America." Both sentences are wrong. Correct each one.',
      steps: [
        'Take the Europe-Asia claim first. WRONG: "Europe and Asia are separated by an ocean." The mistake is assuming every pair of continents must have water between them, because that is true for some pairs, such as North America and Europe, which have the Atlantic Ocean between them.',
        'Check what is actually between Europe and Asia. There is no ocean and no sea filling any gap, because the two sit on one single continuous landmass. CORRECT: Europe and Asia are joined -- there is no water between them at all -- even though geographers still count them as two separate continents.',
        'Now take the Australia claim. WRONG: "Australia is connected to Asia by a strip of land." The mistake is assuming every continent has a land connection to some other continent, because that is true for North America and South America.',
        'Check what actually surrounds Australia. The Indian Ocean lies along its western and southern coasts, and the Pacific Ocean lies along its eastern coast, with no strip of land reaching any other continent anywhere. CORRECT: Australia is an island continent, surrounded entirely by ocean.',
        'Check the shape of both corrections together. Some continents are joined to a neighbor, either by sharing one landmass with no water between them at all (Europe and Asia), or by a narrow strip of land (Africa and Asia, and North America and South America). Other continents stand alone, with ocean on every side (Australia and Antarctica). Knowing which group a continent belongs to is exactly what the routine\'s first question checks.',
      ],
      answer:
        'Europe and Asia are joined on one landmass with no ocean between them, even though they are counted as two continents. Australia has no land connection to Asia or to any other continent; it is an island continent surrounded entirely by ocean.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ocean-between-africa-and-south-america',
      kind: 'try_yourself',
      problem: 'Which ocean lies between the western coast of Africa and the eastern coast of South America?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Atlantic Ocean, which lies between those two continents on that side of the globe.', correct: true },
        { id: 'b', text: 'The Pacific Ocean, because it is the largest of the four oceans and this looks like a large gap.' },
        { id: 'c', text: 'The Indian Ocean, because Africa also touches that ocean, just along a different coast.' },
        { id: 'd', text: 'The Arctic Ocean, because it is the coldest of the four oceans.' },
      ],
      expectedAnswer: 'The Atlantic Ocean, which lies between those two continents on that side of the globe.',
      hints: [
        "Start with the routine's first question: which ocean actually touches both of these coastlines at once, not just one of them?",
        'Size and temperature are not the test. Ask specifically which ocean borders Africa\'s west coast and South America\'s east coast at the same time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-the-isolated-southern-continent',
      kind: 'try_yourself',
      problem:
        'Which continent has no land connection to any other continent and lies at the far southern end of the globe, surrounded on every side by ocean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Greenland, a large ice-covered island that people sometimes confuse with the icy continent at the far south.' },
        { id: 'b', text: 'Australia, an island continent with no land connection to any other continent.' },
        { id: 'c', text: 'Antarctica, a continent surrounded entirely by ocean, at the far southern end of the globe.', correct: true },
        { id: 'd', text: 'The Arctic Ocean, a body of water that also lies at one end of the globe.' },
      ],
      expectedAnswer: 'Antarctica, a continent surrounded entirely by ocean, at the far southern end of the globe.',
      hints: [
        'Two things both have to be true at once: no land connection to any other continent, and location at the far southern end of the globe, not the northern end.',
        'One choice is not a continent at all, one is an island rather than a continent, and one is a continent that is isolated but sits at the wrong end of the globe.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ocean-bounded-by-three-continents',
      kind: 'try_yourself',
      problem: "Which ocean has Africa along its western edge, Asia along its northern edge, and Australia along its eastern edge?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Atlantic Ocean, since it also touches the coast of Africa.' },
        { id: 'b', text: 'The Pacific Ocean, since it lies between Asia and Australia, two of the three continents named.' },
        { id: 'c', text: 'The Southern Ocean, the ring of water some geographers name around Antarctica.' },
        { id: 'd', text: 'The Indian Ocean, which sits between those three continents.', correct: true },
      ],
      expectedAnswer: 'The Indian Ocean, which sits between those three continents.',
      hints: [
        'Check each of the three borders one at a time -- west, north, and east -- against the ocean you are considering, rather than stopping at the first one that fits a single border.',
        'Touching one of the three continents is not enough; the correct ocean has to border all three named edges at once, and it is not the ocean named for the ring of water around Antarctica alone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-oceans-walled-off-and-count-is-universal',
      kind: 'misconception_check',
      question:
        'A student says: "The four oceans are actually four separate bodies of water with empty space between them, like four different swimming pools. And there are exactly seven continents everywhere in the world -- every source agrees on that." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The four oceans are four separate bodies of water with empty space between them, like four different swimming pools.',
          misconception:
            'Thinking that because the oceans have four different names, they must be four separate, disconnected pools of water, the way four countries on a political map have a hard line between them.',
          correctsTo:
            'The world\'s oceans are all one connected body of salt water. There is no wall, no gap, and no line drawn in the water itself separating the Pacific from the Atlantic or the Atlantic from the Indian. The four names are a convention for talking about different regions of that one connected ocean, not a description of four separate pools. WRONG: "the oceans are separate, walled-off bodies of water." CORRECT: "the oceans are one connected body of water, divided by name rather than by any physical wall."',
        },
        {
          answer: 'There are exactly seven continents everywhere in the world, and every source agrees on that.',
          misconception:
            'Treating the convention taught in one lesson as though it were the only fact in the world, rather than one accepted way of dividing up something that could reasonably be divided a different way.',
          correctsTo:
            'This lesson uses the seven-continent, four-ocean convention most commonly taught in the United States, but it is not the only one used by real geographers. Some sources combine Europe and Asia into one continent, giving six continents instead of seven. Some sources also name a fifth ocean, the Southern Ocean, for the ring of water around Antarctica. Both counts are used; this lesson states which one it is using rather than treating it as the only true count.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth\'s land is divided into seven continents by convention: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.',
        'The world\'s salt water is divided into four major oceans by convention: the Pacific, the Atlantic, the Indian, and the Arctic.',
        'Europe and Asia sit on one continuous landmass with no ocean between them, even though they are counted as two continents. Africa is joined to Asia by a narrow strip of land, and North America is joined to South America by a different narrow strip of land. Australia and Antarctica each stand alone, surrounded entirely by ocean.',
        'The Pacific Ocean lies between the Americas and Asia and Australia. The Atlantic Ocean lies between the Americas and Europe and Africa. The Indian Ocean lies between Africa, Asia, and Australia. The Arctic Ocean sits at the far northern end of the globe, bordered by North America, Europe, and Asia.',
        'Describe any location with two questions: what does it touch along its edges, and in which direction does each neighbor lie? A position statement should hold up when flipped and read from the other side.',
        'This lesson\'s seven-continent, four-ocean count is a convention, not the only one used by real geographers; some sources count six continents by combining Europe and Asia, or five oceans by adding the Southern Ocean.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Continents & Oceans' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
