/**
 * Grade 6 World Geography — The World's Regions: Names & Locations: Locating
 * the Americas.
 *
 * PROCEDURE-LED shape for the m6geo fan-out (National Geography Standard 1),
 * following the dispatch steering to use `m6geo-u2-hemispheres-equator-and-
 * prime-meridian.ts` as the model for locating a fixed set of named places in
 * words, with the continents-and-oceans row's own procedure-led adaptation
 * (`m6geo-u2-continents-and-oceans.ts`) as the closer template for locating
 * several named landmasses relative to one another. This row is one of the
 * three rows in this course where the invented-place default is unavailable:
 * its entire job is naming and locating four REAL regions, so every
 * positional claim here is checkable and is carried in the claim ledger.
 *
 * SCOPE GUARD: this row NAMES North America, Central America, the Caribbean,
 * and South America and LOCATES each one relative to the other three and to
 * the Equator, using only relative position (north of, south of, east of,
 * between) and what-touches-what language. It carries NO content about any
 * region's physical or human characteristics: no climate, no landform detail
 * beyond the one word "isthmus" needed to say what kind of connection joins
 * the two continents, no population, no culture, no economy, no history, and
 * no named country anywhere in the file -- this file never says which
 * countries sit inside any of the four regions, only how the four regions sit
 * relative to one another. That is a narrower content set than the region
 * itself would allow, and it is a deliberate choice on top of the scope line,
 * made because naming individual countries is exactly where this course's
 * documented locality error lives (an earlier geography file placed a fossil
 * site "on the coast of" South America when it was inland) and because
 * exact country-to-region membership is itself one more convention this row
 * does not need in order to do its job. The regional content this row leaves
 * out entirely -- physical geography, climate, landforms, rivers, history,
 * culture, economy -- belongs to Grade 7's regional sweep of this same area,
 * `m7geo-u7-latin-america-physical-geography.ts` and its three sibling files
 * (`-history-and-culture`, `-economy-and-cities`, `-environment-issues`), all
 * of it reserved by the signed curriculum's excluded list ("The regional
 * content itself ... of Latin America ... — G7 U7"). No sentence below could
 * be lifted into any of those four files unnoticed: this file only ever says
 * WHERE a region is, never what it is like.
 *
 * What IS deliberately allowed, because this row's own content is entirely
 * real-world locality claims: naming the ISTHMUS that joins North America and
 * South America (a locating fact about the shape of the connection, not a
 * physical-geography lesson on landforms -- Grade 6's own landform-vocabulary
 * rows, 4.1 and 4.2, already own the word and this row simply reuses it to
 * say how two continents connect); naming the CARIBBEAN SEA as the body of
 * water the Caribbean's islands sit in and around, because a sea's name is
 * needed to locate an island region in words with no map in front of the
 * student; and stating OUT LOUD, as a named convention rather than a bare
 * fact, that treating Central America and the Caribbean as separate regions
 * from the continent of North America is one convention among others -- the
 * same move `m6geo-u2-continents-and-oceans.ts` used for the seven-versus-six
 * continent count and `m6geo-u9-continents-subregions-and-how-geographers-
 * group-them.ts` used for a region's border generally. This is the row the
 * dispatch flagged as carrying a genuinely conventional boundary: whether
 * Central America and the Caribbean count as parts of the North American
 * continent or as their own separate regions is a real, documented variance
 * in how geographers group the same land and islands, not a settled fact this
 * row can assert either way.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and item below is
 * answerable by NAME or LOCATE alone. There is no closed typology, no
 * mechanism explaining WHY the regions sit where they do (no plate tectonics,
 * no climate), and no chain of more than one link anywhere. Test 5 target:
 * `m7geo-u7-latin-america-physical-geography.ts`, read in full -- its
 * "Control 1", "Control 2", vertical-climate-zone and plate-boundary
 * reasoning appear nowhere here, and this file states only the small,
 * uncontested slice of that file's own opening "what the region is" sentence
 * (isthmus, Caribbean Sea, ocean sides) that is pure locating rather than
 * physical description.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was built to be the longest choice because it is
 * the key. Measured as a diagnostic, not as a score: choice character counts
 * are item 1 -- a 80, b (key) 72, c 88, d 80; item 2 -- a (key) 96, b 100, c
 * 94, d 85; item 3 -- a 92, b 112, c (key) 65, d 92. The key is the strictly
 * longest choice in zero of the three items, ranking fourth, second, and
 * fourth of four by character count. Zero is not itself the target -- see
 * the note in `m6geo-u3-earths-moving-plates.ts` -- but here it fell out of
 * giving every distractor its own full stated reason, never from trimming a
 * key. The three keys sit at ids b, a, and c, which is the id set
 * `(9 + 2) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON prerequisites/followUps: the fan-out contract directs every
 * fan-out row to populate its real chain now from the signed curriculum's
 * row table, so both arrays below carry row 9.1's and row 9.3's real loIds
 * rather than the exemplars' registration-order-only empty arrays.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U9_LOCATING_THE_AMERICAS: LessonPlan = {
  id: 'evelyn.ms.m6geo.locating-the-americas.v1',
  title: 'Locating the Americas',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.locating-the-americas',
      standard: 'M6GEO-9.2',
      description:
        'Name and locate North America, Central America, the Caribbean, and South America relative to one another and to the Equator, with no content about any region\'s physical or human characteristics (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.continents-subregions-and-how-geographers-group-them'],
  followUps: ['m6geo.locating-europe-africa-and-the-middle-east'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the idea of four stacked, connected regions feel concrete before any name arrives.',
      script:
        'Picture a long line of stepping stones crossing a wide river, laid out so that each stone touches the next one. You could walk the whole line without ever getting your feet wet, as long as you knew which stone came after which. The stretch of the world from the far north of this side of the globe down to its far southern tip works a little like that line of stones. It is not one landmass -- it has a break partway down where islands take over instead of solid ground -- but everything else connects in order, one piece leading straight into the next. Today you learn the four names geographers give to that stretch, and exactly how each one connects to its neighbors, with no map in front of you at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-regions-in-order',
      kind: 'concept',
      goal: 'Install the four region names, which two are continents, how the isthmus and the island region connect them, and where the Equator falls among them.',
      keyIdeas: [
        'FOUR NAMES DIVIDE THIS STRETCH OF THE WORLD, NORTH TO SOUTH. Geographers use four names for this part of the world: NORTH AMERICA, CENTRAL AMERICA, THE CARIBBEAN, and SOUTH AMERICA. North America and South America are two of Earth\'s seven continents, named already in this course\'s own continents lesson. Central America and the Caribbean are not continents on their own -- they are two smaller named regions that sit between the two continents.',
        'NORTH AMERICA IS THE NORTHERNMOST OF THE FOUR, AND SOUTH AMERICA IS THE SOUTHERNMOST. North America stretches from the far north of the globe down to a narrow strip of land in the south. South America stretches from that same narrow strip of land down to the far south of the globe. The other two regions sit between them.',
        'CENTRAL AMERICA IS THE ISTHMUS THAT JOINS THE TWO CONTINENTS. An ISTHMUS is a narrow strip of land connecting two larger areas of land. Central America is the isthmus that connects North America and South America directly: it lies south of North America and north of South America, with no other region of this set of four between it and either continent.',
        'THE CARIBBEAN IS A REGION OF ISLANDS, NOT ONE CONNECTED MAINLAND. A MAINLAND is a large area of land connected all the way across, rather than broken up into separate pieces by water. The Caribbean is made up of many islands lying in and around the CARIBBEAN SEA, a sea bounded by southern North America, Central America, and northern South America. The Caribbean lies east of Central America. Because it is a region of islands rather than a mainland, it is not part of the north-to-south land connection that runs through the other three.',
        'ONLY ONE OF THE FOUR REGIONS HAS LAND ON BOTH SIDES OF THE EQUATOR. The Equator crosses the northern part of South America. North America, Central America, and the Caribbean all lie entirely north of the Equator, in the Northern Hemisphere. South America is the only one of the four with land in both the Northern Hemisphere and the Southern Hemisphere, because the Equator cuts across it rather than staying off to one side.',
        'GEOGRAPHERS DO NOT ALL DRAW THESE FOUR REGIONS THE SAME WAY, SO SAY THAT OUT LOUD. Just as this course\'s own continents lesson found more than one accepted count of continents, some sources treat Central America and the Caribbean as part of the continent of North America rather than as their own separate regions. Neither choice is wrong -- this lesson treats all four as separate named regions because that lets each one be located on its own.',
      ],
      vocabulary: [
        { term: 'isthmus', definition: 'a narrow strip of land connecting two larger areas of land.' },
        { term: 'mainland', definition: 'a large area of land connected all the way across, rather than broken up into separate pieces by water.' },
        { term: 'Caribbean Sea', definition: 'the sea bounded by southern North America, Central America, and northern South America, in and around which the islands of the Caribbean lie.' },
        { term: 'Equator', definition: 'the imaginary line running around the middle of Earth, halfway between the two poles, that separates the Northern Hemisphere from the Southern Hemisphere.' },
        { term: 'region', definition: 'a named group of neighboring countries, or neighboring islands, that geographers study together.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-drive-the-connected-land',
      kind: 'worked_example',
      problem:
        'A delivery van drives the whole way over land, starting at a warehouse near the northern edge of North America and ending at a warehouse near the southern tip of South America. The van never crosses open ocean and never drives onto an island. Name the regions the van passes through, in order, and explain why the Caribbean is not on that list.',
      steps: [
        'Start at the beginning of the route. The van starts in North America, the northernmost of the four regions.',
        'Ask what stands between North America and South America. The only strip of land connecting the two continents is Central America, the isthmus. To reach South America over land, the van has no choice but to cross it.',
        'After crossing Central America, the van reaches South America, the southernmost of the four regions, and the route ends there.',
        'Put the route together: North America, then Central America, then South America -- three regions, not four.',
        'Now explain the one missing from that list. The Caribbean is a region of islands, not a mainland. A van that never crosses open ocean and never drives onto an island cannot reach an island region at all, so the Caribbean cannot appear on an overland route no matter where that route starts or ends.',
        'Check move: rewind the route. Starting instead at the southern tip of South America and driving north, the van would cross Central America before it could ever reach North America. Running the route backward gives the same middle region in the same place, which confirms Central America sits directly between the two continents in both directions.',
      ],
      answer:
        'North America, then Central America, then South America. The Caribbean is left off the list because it is a region of islands rather than a connected mainland, and a route that never crosses open ocean or drives onto an island cannot pass through it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-equator-and-continent-claims',
      kind: 'worked_example',
      problem:
        'A student writes: "All four American regions have land south of the Equator, since South America does. And Central America is one of Earth\'s continents, the same as North America and South America." Both sentences are wrong. Correct each one.',
      steps: [
        'Take the Equator claim first. WRONG: "All four regions have land south of the Equator." Test each region against the Equator one at a time instead of assuming neighbors must match.',
        'North America lies entirely north of the Equator -- none of it reaches the south side of that line.',
        'Central America also lies entirely north of the Equator, since it sits north of South America and the Equator does not run that far north.',
        'The Caribbean\'s islands lie in the Caribbean Sea, which sits north of the point where the Equator crosses South America, so the Caribbean also lies entirely in the Northern Hemisphere.',
        'Only South America has land on both sides, because the Equator cuts across its northern part rather than running along one of its edges. CORRECT: "Of the four regions, only South America has land south of the Equator; the other three lie entirely in the Northern Hemisphere."',
        'Now take the continent claim. WRONG: "Central America is one of Earth\'s continents." This course\'s own continents lesson names seven continents, and Central America is not one of them -- it is a narrow isthmus joining two continents, not a continent of its own. CORRECT: "North America and South America are two of Earth\'s seven continents. Central America is a named region, not a continent."',
        'Check move: test the correction against a contrasting case. The Caribbean is not a continent either, but for a different reason -- it was never one connected landmass at all, only a set of islands, so being small is not the only way to fail to be a continent.',
      ],
      answer:
        'Only South America has land south of the Equator; North America, Central America, and the Caribbean lie entirely in the Northern Hemisphere. North America and South America are two of Earth\'s seven continents, but Central America is not a continent -- it is the isthmus joining the two continents -- and neither is the Caribbean, which is a set of islands rather than one connected landmass.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-the-connecting-strip',
      kind: 'try_yourself',
      problem:
        'A narrow strip of land lies south of North America and north of South America, connecting the two continents directly, with no other region between it and either one. Which of the four American regions is being described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'North America, because it is the region that lies farthest north among the four.' },
        { id: 'b', text: 'Central America, the isthmus that joins North America and South America.', correct: true },
        { id: 'c', text: 'The Caribbean, a region made up of many islands rather than one connected strip of land.' },
        { id: 'd', text: 'South America, because it is the region that lies farthest south among the four.' },
      ],
      expectedAnswer: 'Central America, the isthmus that joins North America and South America.',
      hints: [
        'Ask which of the four regions is a narrow strip of land, rather than one of the two continents or a set of islands.',
        'The region described sits directly between the two continents, so it cannot be the farthest-north one, the farthest-south one, or a group of islands.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-only-one-crosses',
      kind: 'try_yourself',
      problem: 'Which of the four American regions is the only one with land in both the Northern Hemisphere and the Southern Hemisphere?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'South America, because the Equator crosses its northern part rather than running along one edge.', correct: true },
        { id: 'b', text: 'North America, because it stretches all the way from the far north down to the isthmus in the south.' },
        { id: 'c', text: 'Central America, because it connects two continents that sit on opposite sides of the Equator.' },
        { id: 'd', text: 'The Caribbean, because its many islands are spread across a very wide stretch of sea.' },
      ],
      expectedAnswer: 'South America, because the Equator crosses its northern part rather than running along one edge.',
      hints: [
        'Check each region against the Equator one at a time: does any part of it actually lie south of that line?',
        'Three of the four regions lie entirely north of the Equator. Only one has the line cutting through it rather than sitting off to one side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-islands-not-mainland',
      kind: 'try_yourself',
      problem:
        'Which of the four American regions is made up of many islands lying in and around a named sea, rather than being part of one connected mainland?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'North America, one of Earth\'s seven continents, stretching down to the isthmus in the south.' },
        { id: 'b', text: 'Central America, the narrow strip of land connecting the continent to its north with the continent to its south.' },
        { id: 'c', text: 'The Caribbean, whose islands lie in and around the Caribbean Sea.', correct: true },
        { id: 'd', text: 'South America, one of Earth\'s seven continents, with the Equator crossing its northern part.' },
      ],
      expectedAnswer: 'The Caribbean, whose islands lie in and around the Caribbean Sea.',
      hints: [
        'Ask which of the four regions is not one connected stretch of land at all, but a group of separate landmasses.',
        'The region described sits in a sea bounded by parts of North America, Central America, and South America -- it is not one of the two continents and it is not the isthmus.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-continents-and-neighboring-hemispheres',
      kind: 'misconception_check',
      question:
        'A student says: "Central America and the Caribbean are both continents, just smaller than North America and South America. And since South America has land south of the Equator, North America must too, since the two are neighbors." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'Central America and the Caribbean are both continents, just smaller than North America and South America.',
          misconception:
            'Assuming that any large named landmass or region must be a continent, rather than recognizing that a continent is one specific kind of grouping -- named already in this course\'s own continents lesson -- and that a region can sit at a different size or be made of separate islands entirely.',
          correctsTo:
            'North America and South America are two of Earth\'s seven continents. Central America is a narrow isthmus that joins those two continents, not a continent of its own, and the Caribbean is a region of islands, also not one of the seven continents. WRONG: "Central America and the Caribbean are smaller continents." CORRECT: "Central America and the Caribbean are named regions that are not continents at all."',
        },
        {
          answer: 'Since South America has land south of the Equator, North America must too, since the two are neighbors.',
          misconception:
            'Assuming that being next to a region decides that region\'s position relative to the Equator, rather than checking each region\'s own land against the line on its own.',
          correctsTo:
            'Whether a region has land south of the Equator depends on where that region\'s own land actually sits, not on which region it happens to connect to. North America lies entirely north of the Equator even though it connects directly to South America, which does have land south of the Equator. Each region has to be checked against the Equator on its own, the same way this row\'s worked example checked North America, Central America, and the Caribbean one at a time rather than assuming they all matched their neighbor.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four names divide this stretch of the world, north to south: North America, Central America, the Caribbean, and South America.',
        'North America and South America are two of Earth\'s seven continents. North America is the northernmost of the four regions, and South America is the southernmost.',
        'Central America is the isthmus -- a narrow strip of land -- that joins North America and South America directly, lying south of North America and north of South America.',
        'The Caribbean is a region of islands, not one connected mainland. Its islands lie in and around the Caribbean Sea, east of Central America, so it is not part of the north-to-south overland connection running through the other three regions.',
        'The Equator crosses the northern part of South America. North America, Central America, and the Caribbean lie entirely north of the Equator; South America is the only one of the four with land on both sides of it.',
        'Geographers do not all draw these four regions the same way -- some sources count Central America and the Caribbean as parts of the continent of North America rather than as separate regions. Neither convention is wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Locating the Americas' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
