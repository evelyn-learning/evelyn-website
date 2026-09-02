/**
 * Grade 6 World Geography — Natural Resources & Human Adaptation: How People
 * Adapt to Different Climates.
 *
 * PROCEDURE-LED row in the m6geo fan-out (National Geography Standard 14).
 * The routine is a matching-and-check task rather than a mental model: given
 * a described climate, name the toughest condition it creates, check whether
 * a proposed clothing, housing, food, or transportation choice actually
 * solves that condition, and then test the same choice against a different
 * climate to confirm it stops working there. Every climate in this lesson is
 * INVENTED and described only by its temperature and precipitation pattern --
 * no real place and no real named group of people appears anywhere in this
 * file. That is a deliberate choice, not an oversight: this is the one row in
 * the course where a careless sentence could cast a real group's way of
 * living as exotic, primitive, or unfortunate, and the invented-climate
 * default this course already prefers removes that risk by construction
 * while keeping the matching skill fully intact.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Name the toughest condition the described climate creates (too much
 *      cold, too much heat, too much rain, or too little rain).
 *   2. Check a proposed adaptation -- in clothing, housing, food, or
 *      transportation -- against that condition: does each feature of it
 *      actually solve the condition, or work against it?
 *   3. Test the same adaptation against a different described climate to
 *      confirm it stops working there, and say the one plain reason why.
 *
 * SCOPE GUARD: this row matches a described climate to the human adaptation
 * (clothing, housing, food, or transportation) that suits it, and states one
 * plain reason why that same adaptation would not suit a different described
 * climate. It never names the formal three-part framework of adapting to,
 * modifying, and depending on surroundings, and the phrase "human-environment
 * interaction" never appears anywhere in this file -- both belong to Grade
 * 7's `m7geo-u1-regions-and-place.ts`, which teaches all three parts of that
 * framework together with formal/functional/perceptual regions and absolute
 * versus relative location. What IS deliberately allowed, because that Grade 7 row
 * sits directly across the line: this lesson names specific concrete
 * adaptations -- a steep roof shedding snow, loose light clothing releasing
 * heat -- in the same plain register Grade 7 uses for its own single
 * illustrative examples. The difference is depth of treatment, not the raw
 * facts involved: Grade 7 names one such example per idea as one case of a
 * named framework applied across many contexts, while this row runs the same
 * two or three concrete comparisons through an explicit check every time and
 * never gives the pattern a name broader than "adaptation." Sideways, this
 * row does not re-teach the weather-versus-climate distinction (Grade 6 row
 * 5.1, `weather-vs-climate`) or biome matching (Grade 6 row 5.3,
 * `what-is-a-biome`); it treats "climate" as already understood and asks only
 * for a match between a described temperature-and-precipitation pattern and
 * an adaptation that suits it.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by
 * CLASSIFY -- sorting a proposed adaptation as fitting or not fitting a
 * described climate -- never by explaining a mechanism. The four categories
 * named in the scope line (clothing, housing, food, transportation) are a
 * plain vocabulary set of everyday domains, not a closed typology belonging
 * to a mechanism, so naming all four is not a Test 2 breach. The closest of
 * the five tests to a real risk was Test 5, the Grade 7 file test: the same
 * physical facts this row uses (a steep roof sheds snow, thick walls slow
 * heat transfer) also appear inside Grade 7's own key ideas, because both
 * grades are teaching genuinely the same subject area. What keeps this row
 * under the ceiling is that it never generalizes those facts into a named
 * three-part framework and never uses the phrase Grade 7 uses to unify them;
 * each comparison here stands alone as a described-climate-to-adaptation
 * match with its own one-line check.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below states a full wrong reason
 * rather than a short wrong label, and no key was built to be the longest
 * choice BECAUSE it is the key. Measured as a diagnostic, not as a score: of
 * the three items, the key is the strictly longest choice in one of them
 * (the food item, where the key runs 117 characters against a next-longest
 * distractor at 111 -- a six-character margin, not a wide one). In the other
 * two items the key is the second-longest of four. One of three is well
 * inside the chance band (chance alone produces 0 or 1 about 84% of the
 * time), so this was left as authored rather than padded down -- see the
 * note in `m6geo-u3-earths-moving-plates.ts` about why forcing a whole-course
 * result toward zero is the same tell inverted. The three keys sit at ids a,
 * d, and b, which is the id set `(6 + 4) mod 4 = 2` requires, omitting c.
 *
 * NOTE ON prerequisites/followUps: populated for real from this row's brief
 * and the signed chain table (row 6.3 -> 6.4 -> 7.1), not left empty --
 * unlike the two exemplars, this row is authored after the chain's LO ids are
 * already fixed by the fan-out contract, so both arrays resolve once the
 * controller registers the full 40-row batch.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U6_HOW_PEOPLE_ADAPT_TO_DIFFERENT_CLIMATES: LessonPlan = {
  id: 'evelyn.ms.m6geo.how-people-adapt-to-different-climates.v1',
  title: 'How People Adapt to Different Climates',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.how-people-adapt-to-different-climates',
      standard: 'M6GEO-6.4',
      description:
        'Match a described climate to the human adaptations (clothing, housing, food, or transportation) that suit it, and explain why that same adaptation would not suit a different climate (National Geography Standard 14: how human actions modify the physical environment).',
    },
  ],
  prerequisites: ['m6geo.conserving-natural-resources'],
  followUps: ['m6geo.satellite-images-and-aerial-views'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that different smart packing lists come from different climates, before any vocabulary arrives.',
      script:
        'Imagine packing two suitcases on the same afternoon: one for a trip to a place with deep snow and freezing wind, and one for a trip to a place that is hot and sunny nearly every day. You would not pack the same bag twice. One bag needs thick coats, boots, and warm layers. The other needs light, loose clothes and sunglasses. Neither bag is the smarter bag overall -- each one is smart for its own trip, and the wrong bag in the wrong place would actually cause you trouble. People make choices like this everywhere they live, not just when they travel: what to wear, what kind of house to build, what food to plan for, and how to get around. Today you practice matching those choices to the climate that makes them the right choice.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-matching-adaptations-to-climate',
      kind: 'concept',
      goal: 'Install the idea that an adaptation is a smart fit for a climate, plus how clothing, housing, food, and transportation each adapt, and the check that the same choice can fail elsewhere.',
      keyIdeas: [
        "AN ADAPTATION IS A SMART CHOICE THAT FITS A CLIMATE, NOT A SIGN OF HOW A PLACE RANKS. An adaptation is a change in what people wear, build, eat, or use to get around so that it fits the specific climate they live in. A house, a coat, or a meal built for a tough climate is a good match for that climate's conditions -- it does not mean the place is poor, old-fashioned, or behind the times. The same climate that makes one choice smart can make a different choice a poor fit.",
        'CLOTHING ADAPTS TO HOLDING BODY HEAT IN OR LETTING IT OUT. In a climate with long, cold winters, clothing worn in layers traps warm air between the layers and keeps body heat from escaping. In a climate that is hot and sunny with little rain, loose, lightweight, light-colored clothing lets air move against the skin and reflects sunlight instead of holding heat in.',
        "HOUSING ADAPTS TO THE CLIMATE'S BIGGEST PROBLEM WITH HEAT AND WATER. In a climate with long, cold, snowy winters, thick walls and small windows hold heat inside, and a steep roof lets heavy snow slide off before it piles up. In a climate that is hot and humid with heavy seasonal rain, open sides, wide roof overhangs, and floors raised above the ground let air move through and let water drain away, instead of trapping heat and flooding the inside.",
        'FOOD ADAPTS TO WHAT A CLIMATE ALLOWS TO GROW OR REQUIRES BEING STORED. A climate with a long growing season and steady rain lets fresh food be grown across most months of the year. A climate with a long season when little grows -- because it is too cold or too dry -- needs food that can be stored for months, such as dried food, so there is enough to last.',
        'TRANSPORTATION ADAPTS TO THE GROUND AND WATER CONDITIONS A CLIMATE CREATES. A climate with deep, packed snow for months needs vehicles and equipment built to move over snow and ice. A climate with heavy seasonal rain and flooding needs transportation built for water and mud, such as boats and raised walkways, so travel does not stop when the ground floods.',
        'THE SAME ADAPTATION CAN FIT ONE CLIMATE AND FAIL IN ANOTHER -- ALWAYS CHECK WHY IT WORKS. Thick walls and small windows hold heat inside a cold climate, but the same design would trap unwanted heat inside a hot, humid one. Loose, light clothing releases heat in a hot climate, but the same clothing would let too much heat escape in a freezing one. Matching an adaptation to a climate means checking what problem it solves, not assuming it solves every climate.',
      ],
      vocabulary: [
        { term: 'adaptation', definition: 'a change in what people wear, build, eat, or use to get around so that it fits the climate of the place they live in.' },
        { term: 'climate', definition: 'the long-term pattern of weather a place has, such as how hot, cold, wet, or dry it usually is.' },
        { term: 'insulation', definition: 'material or a building design that slows heat from moving between the inside of a space and the outside air.' },
        { term: 'growing season', definition: "the part of the year when a climate's temperature and rainfall allow crops to grow." },
        { term: 'layering', definition: 'wearing several pieces of clothing at once so that warm air becomes trapped between them.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-housing-cold-and-humid',
      kind: 'worked_example',
      problem:
        'A described climate has long, bitterly cold winters, with deep snow covering the ground for months, and short, mild summers. Two house designs are offered. House A has thick walls, small windows, and a steep roof. House B has thin walls, wide window openings left open for airflow, and a flat roof. Which house design fits this climate, and why does the other one fail?',
      steps: [
        'Run step one of the routine: name the toughest condition. Long, bitterly cold winters with deep, heavy snow create two problems at once -- losing body heat, and heavy snow piling up on a roof.',
        'Run step two on House A. Thick walls slow heat from escaping, small windows lose less heat than large open ones, and a steep roof lets heavy snow slide off before it piles up and becomes too heavy for the roof to hold. Every feature answers the cold-and-snow problem.',
        'Run step two on House B. Thin walls let heat escape quickly, open window gaps let cold air pour straight in, and a flat roof lets snow pile up instead of sliding off. Every feature works against this climate instead of for it.',
        'Conclude step two: House A fits this climate, and House B does not.',
        'Run step three, the check: test the same two designs against a different described climate -- one that is hot and humid almost all year, with heavy rain many months and no winter at all. In that climate, thick walls and small windows would trap heat inside instead of losing it, making House A feel hotter, not cooler. Open sides and gaps that let air move would now be the better fit, so House B, which failed in the cold climate, would work well in the hot, humid one.',
      ],
      answer:
        'House A (thick walls, small windows, a steep roof) fits the cold, snowy climate, because it holds heat inside and sheds heavy snow. House B (thin walls, open windows, a flat roof) would fail there, but it would fit a hot, humid climate instead, because House A\'s sealed, heat-holding design would trap unwanted heat in a climate that is never cold.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-clothing-hot-and-dry',
      kind: 'worked_example',
      problem:
        'A student writes: "For a climate that is hot and sunny most days, with very little rain and cool nights, the best clothing is heavy, dark-colored, and tightly fitted, because dark clothes look sharpest in bright sun." Two things in that sentence are wrong for this climate. Find both and correct them.',
      steps: [
        'Take the two claims apart, because they are separate mistakes about separate features: the color of the clothing, and how tight and heavy it is.',
        'WRONG: dark-colored clothing is best for a hot, sunny climate. CORRECT: light-colored clothing is better, because light colors reflect sunlight and absorb less heat than dark colors do, so the body stays cooler.',
        'WRONG: tightly fitted, heavy clothing is best. CORRECT: loose-fitting, lightweight clothing is better, because it lets air move against the skin, which helps a body release heat, while tight, heavy clothing traps heat close to the skin instead.',
        'Check the detail the description gives that the student ignored: nights turn cool. The best plan also includes a light layer that can be added after sunset, not one outfit for the whole day and night.',
        'Run the routine\'s check step: test this same loose, light clothing against a different described climate -- one with long, cold, snowy winters. In that climate the toughest condition is losing body heat, and loose, thin clothing would let warm air escape instead of trapping it. Many snug layers that trap warm air between them are what actually works there, which is the opposite plan.',
      ],
      answer:
        'Loose-fitting, light-colored, lightweight clothing fits the hot, sunny, dry climate, with a layer added after sunset for the cool nights. Dark, heavy, tight clothing would trap in heat the body needs to release. That same loose, light clothing would fail in a long, cold, snowy climate, where several snug layers that trap warm air are the better fit instead.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-food-long-growing-season',
      kind: 'try_yourself',
      problem:
        'A described climate has a long, warm growing season and steady rain through most of the year, so crops keep growing across most months. Which food-related choice fits this climate best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Eating a wide variety of fresh fruits and vegetables through most of the year, since the growing season rarely stops.', correct: true },
        { id: 'b', text: 'Relying mainly on food dried and stored months ahead of time, since fresh food is hard to find in this climate.' },
        { id: 'c', text: 'Building large underground rooms to keep food frozen through a long, cold winter.' },
        { id: 'd', text: 'Traveling long distances by boat to bring in food, since nothing can be grown in this climate.' },
      ],
      expectedAnswer: 'Eating a wide variety of fresh fruits and vegetables through most of the year, since the growing season rarely stops.',
      hints: [
        'Reread the climate: a long growing season with steady rain does not mean food is scarce. Ask which choice fits a climate where fresh food is easy to grow, not hard.',
        'Dried, stored food and underground cold rooms answer a climate where fresh food stops growing for part of the year. This described climate never stops growing food, so that problem does not apply here.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transportation-heavy-rain-and-flooding',
      kind: 'try_yourself',
      problem:
        'A described climate brings heavy rain for several months each year, and many rivers and low areas flood and turn to mud during that time. Which transportation choice fits this climate best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Roads and vehicles built to handle deep, packed snow and ice for most of the year.' },
        { id: 'b', text: 'Vehicles with wide, deep-tread tires built only for loose, dry desert sand.' },
        { id: 'c', text: 'No real change to transportation, since flooding only affects housing and food, not how people travel.' },
        { id: 'd', text: 'Boats and raised walkways that carry people and goods over the water and mud when the ground floods.', correct: true },
      ],
      expectedAnswer: 'Boats and raised walkways that carry people and goods over the water and mud when the ground floods.',
      hints: [
        'Ask what condition this climate creates for travel: heavy rain and flooding, not deep snow and not dry sand.',
        'A choice built for snow or for dry sand answers a different climate\'s problem. A choice that says transportation would not need to change ignores that flooding blocks roads and paths.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-housing-mismatch',
      kind: 'try_yourself',
      problem:
        'A type of housing has thick walls, small windows, and a steep roof, built for a climate with long, cold winters and heavy snowfall. For which of these described climates would this same housing design fit poorly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A climate with a long winter, heavy snow, and temperatures often well below freezing.' },
        { id: 'b', text: 'A climate that stays hot and humid all year, with heavy rain and no winter season at all.', correct: true },
        { id: 'c', text: 'A climate with a short, cold season and moderate snowfall most winters.' },
        { id: 'd', text: 'A climate with a long, very cold winter, though less snow falls most years than in the original description.' },
      ],
      expectedAnswer: 'A climate that stays hot and humid all year, with heavy rain and no winter season at all.',
      hints: [
        'Ask what this housing design actually does: it holds heat inside, and it lets heavy snow slide off. Find the described climate where neither job is needed.',
        'A climate that is still cold, even with less snow or a shorter winter, still needs a design that holds heat in. Only a climate with no cold season and no snow removes both reasons for this design.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-status-and-one-best-choice',
      kind: 'misconception_check',
      question:
        'A student says: "A house with thick walls and small windows must belong to a poor place with old-fashioned ways of living. And once you find one good clothing choice, like heavy layers, it should work for every climate." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A house with thick walls and small windows must belong to a poor place with old-fashioned ways of living.',
          misconception:
            'Assuming that an adaptation built for a tough climate says something about how developed or how wealthy a place is, rather than recognizing it as a deliberate choice matched to a real condition.',
          correctsTo:
            'Thick walls and small windows are not a sign of a place being behind the times. They are a deliberate choice that solves a real problem: holding heat inside during a long, cold winter. WRONG: "this house design shows the place is poor or old-fashioned." CORRECT: "this house design shows the place has long, cold winters, and the design solves that problem well." A house built to handle heat, cold, rain, or dryness is a smart match for its own climate, not a sign of anything else about the place.',
        },
        {
          answer: 'Once you find one good clothing choice, like heavy layers, it should work for every climate.',
          misconception:
            'Treating a single adaptation as the best choice everywhere, rather than checking it against the specific climate it was matched to.',
          correctsTo:
            'An adaptation is matched to one climate, not to every climate. Heavy, layered clothing traps warm air, which helps in a long, cold winter, but the same heavy layers would trap unwanted heat in a hot, sunny climate with little rain, where loose, lightweight, light-colored clothing works instead. Always check an adaptation against the specific climate it is meant for, because a choice that helps in one climate can work against a person in another.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An adaptation is a smart choice that fits the specific condition a climate creates -- not a sign that a place is poor, old-fashioned, or unusual.',
        'To match a climate to an adaptation, first name the toughest condition the climate creates (too cold, too hot, too wet, or too dry), then check whether the adaptation actually solves that condition.',
        'Clothing adapts by holding body heat in or letting it out. Housing adapts to the climate\'s biggest problem with heat and water. Food adapts to what a climate allows to grow or requires being stored. Transportation adapts to the ground and water conditions a climate creates.',
        'Thick walls, small windows, and a steep roof fit a long, cold, snowy climate. The same design would trap unwanted heat in a hot, humid climate instead.',
        'Loose, light-colored, lightweight clothing fits a hot, sunny, dry climate. The same clothing would let too much body heat escape in a long, cold, snowy climate.',
        'A climate with a long growing season and steady rain supports fresh food through most of the year. A climate with a long food-scarce season needs food that can be stored.',
        'The same adaptation can fit one climate well and fail in another -- always check why an adaptation works before assuming it works everywhere.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'How People Adapt to Different Climates' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
