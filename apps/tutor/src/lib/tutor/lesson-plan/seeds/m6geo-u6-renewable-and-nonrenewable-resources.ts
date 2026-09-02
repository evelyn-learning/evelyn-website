/**
 * Grade 6 World Geography — Natural Resources & Human Adaptation: Renewable
 * & Nonrenewable Resources.
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 16).
 * The fan-out contract lists "classifying a resource" as a procedure-led row
 * by name, so this file follows the shape of
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts`: the concept segment
 * installs a single repeatable test, the first worked example runs that test
 * straight through on a contrasting pair, and the second worked example
 * repairs a wrong answer that overgeneralizes from the first, then checks it
 * against a third case.
 *
 * THE TEST, in the order it is always run: ask ONE question about the named
 * resource -- once it is used, can nature supply a new amount of it again
 * within a person's lifetime? Yes means RENEWABLE. No, because making more of
 * it takes far longer than a person's lifetime, means NONRENEWABLE.
 *
 * SCOPE GUARD: this row classifies a named resource as renewable or
 * nonrenewable using the single test above, and gives one plain-language
 * reason for each classification. It never asks the student to compare how
 * fast a resource is USED against how fast it is replaced -- that RATE
 * comparison, and the resulting fact that a renewable resource can still run
 * short if it is used faster than it is replaced, is the headline idea of
 * `m7geo-u5-resources-and-economic-activity.ts` ("RENEWABLE DOES NOT MEAN
 * UNLIMITED, AND THIS IS THE MOST IMPORTANT IDEA IN THE LESSON" in that
 * file) and must not appear here. That is also why this file never names
 * groundwater or timber: both are resources whose classification genuinely
 * depends on the use-rate-versus-replacement-rate comparison, which is
 * exactly the reserved mechanism, so no version of them can be classified
 * correctly at this row's depth. Every resource named in this file --
 * sunlight, wind, geothermal energy, coal, petroleum, natural gas, and
 * mineral ore -- classifies the same way regardless of how fast it is used,
 * which is what makes it safe to classify with the single lifetime-based
 * test and nothing more. What IS deliberately allowed, because the
 * neighboring row sits close: naming that fossil fuels and mineral ore take
 * a very long time to form underground, as the one reason nature cannot
 * resupply them -- stated as a fact about TIME only, with no mention of the
 * geologic process (heat, pressure, buried material, mineral-rich fluids)
 * that produces them, which would be a second causal link this course does
 * not take.
 *
 * CROSS-COURSE NOTE ON THE SIBLING SCIENCE ROW: the Grade 6 Science course's
 * `m6sci-u9-renewable-and-nonrenewable-resources.ts` teaches this same pair
 * of words as exactly that rate comparison -- replacement rate against use
 * rate -- and uses it to explain why groundwater and timber can sit on
 * either side of the line depending on how they are used. This file does not
 * contradict that: it never states or implies that a renewable resource is
 * unlimited, never says a resource "can never run out," and stays silent on
 * use rate entirely rather than asserting anything about it. The two files
 * teach the same vocabulary at two different depths in two different
 * subjects, which is the intended relationship between this Grade 6
 * geography row and Grade 7 economics, applied one grade earlier by the
 * science course.
 *
 * Register note, matching the fan-out contract's non-negotiable accuracy
 * rules: no reserve figures, no energy-mix percentages, and no ranking of
 * one resource, one country or one energy source as better than another
 * appears anywhere in this file. Every comparison is the one qualitative
 * test above, and the register stays descriptive throughout -- this lesson
 * explains how the classification works and never tells the student what a
 * person, a company or a country ought to do about it. That normative
 * question belongs to row 6.3 (`conserving-natural-resources`), not this
 * one. Distribution (row 6.2) and climate adaptation (row 6.4) are likewise
 * untouched: no claim here says where any resource is more or less common,
 * and no claim here matches a climate to a human adaptation.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item is
 * answered by CLASSIFY or DEFINE. The only "because" in this file is one
 * link long every time: renewable because nature resupplies it inside a
 * lifetime; nonrenewable because that takes far longer than a lifetime. No
 * sentence in this file compares two rates, and no sentence names how a
 * fossil fuel or an ore actually forms underground.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason -- a plausible
 * category error about the SKILL (location, cost, distribution, equipment
 * life, one instance of a resource) rather than a false fact about the
 * WORLD -- and no key was built to be the longest choice BECAUSE it is the
 * key. The three keys sit at ids b, c and a, which is the id set
 * `(6 + 1) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON prerequisites/followUps: unlike the two exemplars (registered
 * alone, before this fan-out existed), this row's neighbors are authored in
 * this same batch and registered together with it, so both arrays below
 * carry the real chain loIds rather than staying empty.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U6_RENEWABLE_AND_NONRENEWABLE_RESOURCES: LessonPlan = {
  id: 'evelyn.ms.m6geo.renewable-and-nonrenewable-resources.v1',
  title: 'Renewable & Nonrenewable Resources',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.renewable-and-nonrenewable-resources',
      standard: 'M6GEO-6.1',
      description:
        'Classify a named natural resource as renewable or nonrenewable and explain the reasoning behind the classification, choosing correctly among both categories rather than recalling one description (National Geography Standard 16: the changes that occur in the meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m6geo.ecosystems-and-habitats'],
  followUps: ['m6geo.resource-distribution-and-its-effects'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student questioning whether where a resource comes from tells you anything about whether it runs out, before any vocabulary arrives.',
      script:
        'Picture a video game where you dig up materials to build things. In some games, a block of stone or ore you mine reappears in that same spot after a day passes. In other games, once you mine out a vein of ore, that exact spot stays empty forever, no matter how long you wait or how many times you come back. The person who designed the game decided, for each material, whether it comes back or not. Earth works in a similar way for real natural resources, except nobody designed it -- nature itself either makes more of something within a length of time that matters to a person, or it does not. Today you learn the one question that sorts any natural resource into the group that comes back and the group that does not.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-one-question-test',
      kind: 'concept',
      goal: 'Install the definition of a natural resource, the single lifetime-based test that sorts it, the renewable and nonrenewable resource lists it produces, and the location trap that the test is built to survive.',
      keyIdeas: [
        'A NATURAL RESOURCE IS SOMETHING FROM THE NATURAL WORLD THAT PEOPLE USE. It can be a solid material, such as ore or coal, or a source of energy, such as sunlight or wind. Geographers sort every natural resource into one of two groups: renewable or nonrenewable.',
        "ONE QUESTION SORTS A RESOURCE INTO ONE OF THE TWO GROUPS. Ask: once this resource is used, can nature supply a new amount of it again within a person's lifetime? Answer yes, and the resource is RENEWABLE. Answer no -- because making more of it takes far longer than a person's lifetime -- and the resource is NONRENEWABLE.",
        "SUNLIGHT, WIND, AND GEOTHERMAL ENERGY ARE RENEWABLE RESOURCES. The sun keeps shining and the wind keeps blowing, and deep inside Earth, heat is being produced right now, the same way it always has been. Because nature keeps supplying each of these within a timescale a person can live through, sunlight, wind, and GEOTHERMAL ENERGY -- heat energy from deep inside Earth -- are all classified as renewable.",
        "COAL, PETROLEUM, NATURAL GAS, AND MINERAL ORE ARE NONRENEWABLE RESOURCES. Coal, petroleum (also called oil), and natural gas are FOSSIL FUELS, and a MINERAL ORE is rock that contains a mineral such as iron or copper. All of them take an amount of time far longer than a person's lifetime for nature to form. Since nature cannot supply a new amount of any of them within a person's lifetime, they are classified as nonrenewable.",
        "WHERE A RESOURCE IS FOUND DOES NOT DECIDE ITS CLASSIFICATION. A resource is not automatically nonrenewable just because it comes from underground, and it is not automatically renewable just because it is easy to see above ground. Geothermal energy comes from deep underground and is renewable. Coal and mineral ore also come from underground and are nonrenewable. The one-question test, not the location, decides every time.",
        'RENEWABLE AND NONRENEWABLE ARE A DESCRIPTION, NOT A JUDGMENT. Calling a resource renewable or nonrenewable describes how long nature takes to resupply it. It does not say that one group is better, cleaner, or more useful than the other.',
      ],
      vocabulary: [
        { term: 'natural resource', definition: 'something from the natural world, either a material or a source of energy, that people use.' },
        { term: 'renewable resource', definition: "a natural resource that nature can supply a new amount of within a person's lifetime." },
        { term: 'nonrenewable resource', definition: "a natural resource that takes far longer than a person's lifetime for nature to supply a new amount of." },
        { term: 'fossil fuel', definition: "a nonrenewable resource, such as coal, petroleum, or natural gas, that takes far longer than a person's lifetime for nature to form underground." },
        { term: 'mineral ore', definition: "rock that contains a mineral, such as iron or copper, and that takes far longer than a person's lifetime for nature to form underground." },
        { term: 'geothermal energy', definition: 'heat energy from deep inside Earth that people can use, for example, to heat buildings or produce electricity.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-underground-pair',
      kind: 'worked_example',
      problem:
        'Both geothermal energy and copper ore come from underground. Use the one-question test to classify each one, and explain why they end up in different groups even though both are found in the same general place -- under the ground.',
      steps: [
        "State the test before doing anything else: can nature supply a new amount of this resource within a person's lifetime, or does that take far longer?",
        'Apply it to geothermal energy first. Earth keeps producing heat deep inside it right now, the same way it always has. That heat is available again and again within any person\'s lifetime. Answer: yes. Classification: renewable.',
        "Apply it to copper ore next. Copper ore takes an amount of time far longer than a person's lifetime for nature to form underground. Once a deposit is mined, nature cannot supply a new deposit within a lifetime. Answer: no. Classification: nonrenewable.",
        "WRONG: 'copper ore and geothermal energy should be classified the same way, since both come from underground.' CORRECT: 'the one-question test looks at how long nature takes to resupply each resource, not at where the resource is found, so two underground resources can land in different groups.'",
        'Check the answer by rewinding to the question itself for each resource. Nothing about location was ever part of the test -- only the length of time nature takes to make more.',
        'Geothermal energy and copper ore are the contrasting case to remember: found in the same general place, sorted into opposite groups, because only the one-question test decided it.',
      ],
      answer:
        "Geothermal energy is renewable, because Earth keeps producing that heat within a timescale a person can live through. Copper ore is nonrenewable, because it takes far longer than a person's lifetime for nature to form a new deposit. Both come from underground, so location does not decide the classification -- only how long nature takes to resupply the resource does.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-and-recheck',
      kind: 'worked_example',
      problem:
        "A student looks back at the worked example above and writes: \"Since geothermal energy turned out to be renewable, any resource found deep underground must actually be renewable, once you know the real answer.\" Explain what is wrong with this new claim, then classify coal to check it.",
      steps: [
        'Take the claim apart first. It generalizes from a single example, geothermal energy, into a rule about every underground resource -- the same mistake the worked example above warned against, just flipped to the opposite wrong direction.',
        "WRONG: 'any resource found underground must be renewable.' CORRECT: 'being found underground does not decide the classification either way -- only how long nature takes to resupply the resource does.'",
        "Check the claim against coal. Coal is found underground. Run the one-question test: can nature supply a new amount of coal within a person's lifetime? Coal takes an amount of time far longer than a person's lifetime for nature to form, so the answer is no.",
        'Classification: coal is nonrenewable, even though it is found underground, exactly like copper ore in the worked example above and unlike geothermal energy.',
        'Rewind and check across all three cases looked at so far. Copper ore and coal are both underground and both nonrenewable. Geothermal energy is also underground and is renewable. If location decided the classification, all three would have to match. They do not, so the one-question test, not the location, is doing the real work.',
        'This is the check to remember: when a claim uses the word "any" or "every," test it against a case from your own lesson that could break it. One matching case does not prove a rule; one contrasting case is enough to disprove a wrong one.',
      ],
      answer:
        'The new claim is wrong. Coal is found underground and is nonrenewable, because coal takes far longer than a person\'s lifetime to form -- the same reason copper ore was nonrenewable in the worked example above. Being found underground never decided the classification; only how long nature takes to resupply the resource does.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-natural-gas',
      kind: 'try_yourself',
      problem:
        'A power plant burns natural gas that comes from underground. Use the one-question test to classify natural gas. Which statement gives both the correct classification and the correct reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Renewable, because pipelines can carry natural gas to any place that needs it, no matter how far away.' },
        { id: 'b', text: "Nonrenewable, because nature cannot supply a new amount of natural gas within a person's lifetime.", correct: true },
        { id: 'c', text: 'Nonrenewable, because natural gas must be burned before its energy can be used.' },
        { id: 'd', text: 'Renewable, because burning natural gas can generate electricity that reaches many different homes and machines.' },
      ],
      expectedAnswer: "Nonrenewable, because nature cannot supply a new amount of natural gas within a person's lifetime.",
      hints: [
        "Ask the one question the lesson gives you: can nature supply a brand new amount of natural gas within a person's lifetime, or does that take far longer?",
        'How easily a resource can be moved, or what people do with the energy it produces once it is burned, does not answer the one question. Only how long nature takes to resupply it does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-wind',
      kind: 'try_yourself',
      problem:
        'A community sets up turbines to capture energy from wind blowing across an open plain. Use the one-question test to classify wind. Which statement gives both the correct classification and the correct reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nonrenewable, because a single gust of wind cannot be captured a second time once it has passed.' },
        { id: 'b', text: 'Renewable, because turbines can be built in many different places around the world.' },
        { id: 'c', text: "Renewable, because nature keeps producing new wind, without a wait anywhere near as long as a person's lifetime.", correct: true },
        { id: 'd', text: 'Nonrenewable, because a turbine wears out after years of use and eventually needs to be replaced.' },
      ],
      expectedAnswer: "Renewable, because nature keeps producing new wind, without a wait anywhere near as long as a person's lifetime.",
      hints: [
        'The one-question test asks about the resource itself, not about one single gust of wind and not about the machine that captures it.',
        "Ask whether nature keeps making more wind, and how long that takes compared with a person's lifetime. Where turbines are built, and how long a turbine lasts, do not answer that question.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-petroleum',
      kind: 'try_yourself',
      problem:
        'An oil company pumps petroleum up from underground. Use the one-question test to classify petroleum. Which statement gives both the correct classification and the correct reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Nonrenewable, because nature cannot supply a new amount of petroleum within a person's lifetime.", correct: true },
        { id: 'b', text: 'Nonrenewable, but only because pumping petroleum out of the ground is costly and difficult.' },
        { id: 'c', text: 'Renewable, because new petroleum deposits can still be discovered in different parts of the world.' },
        { id: 'd', text: 'Renewable, because petroleum can be refined into many different products.' },
      ],
      expectedAnswer: "Nonrenewable, because nature cannot supply a new amount of petroleum within a person's lifetime.",
      hints: [
        "Ask the one question: can nature supply a new amount of petroleum within a person's lifetime, or does that take far longer?",
        'Finding petroleum somewhere new, or turning it into different products, tells you about supply and use. Neither one answers how long nature takes to make more of it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-location-and-solid-material',
      kind: 'misconception_check',
      question:
        'A student says: "Anything found underground, like coal or ore, must be nonrenewable, and anything found above ground, like sunlight and wind, must be renewable, because that is where each type is found. Also, wind cannot really be a natural resource anyway, since you cannot see it or hold it in your hand." What is wrong with each part of that?',
      commonErrors: [
        {
          answer:
            'Anything found underground must be nonrenewable, and anything found above ground must be renewable, because that is where each type is found.',
          misconception:
            'Assuming that WHERE a resource is found decides its classification, because most nonrenewable examples a student has seen happen to be underground and most renewable examples happen to be visible above ground.',
          correctsTo:
            "Location never decides the classification. Geothermal energy comes from deep underground and is still renewable, because Earth keeps producing that heat within a timescale a person can live through. Copper ore and coal also come from underground, and both are nonrenewable, because nature takes far longer than a person's lifetime to form either one. WRONG: 'underground means nonrenewable, above ground means renewable.' CORRECT: 'only how long nature takes to resupply the resource decides the classification, no matter where it is found.'",
        },
        {
          answer: 'Wind cannot really be a natural resource, since you cannot see it or hold it in your hand.',
          misconception:
            'Assuming a natural resource must be a solid material a person can physically hold, because the clearest everyday examples, such as ore or coal, are solid.',
          correctsTo:
            "A natural resource is something from the natural world that people use, and that includes sources of energy as well as solid material. Sunlight and wind cannot be held in a hand, but people use both of them, so both count as natural resources -- and both happen to be renewable ones. WRONG: 'only solid material can be a natural resource.' CORRECT: 'a natural resource can be a solid material or a source of energy; wind and sunlight are natural resources even though neither one is solid.'",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A natural resource is something from the natural world that people use -- a solid material, such as ore or coal, or a source of energy, such as sunlight or wind.',
        "The one-question test sorts every natural resource: can nature supply a new amount of it within a person's lifetime? Yes means renewable; no means nonrenewable.",
        'Sunlight, wind, and geothermal energy (heat from deep inside Earth) are renewable, because nature keeps producing each of them within a timescale a person can live through.',
        "Coal, petroleum, and natural gas are fossil fuels, and mineral ore, such as iron ore or copper ore, is also nonrenewable -- all of them take far longer than a person's lifetime for nature to form.",
        'Where a resource is found does not decide its classification. Geothermal energy and copper ore both come from underground, yet one is renewable and the other is nonrenewable.',
        'How a resource is used, how far it can be shipped, or how costly it is to obtain, does not decide its classification either. Only how long nature takes to resupply it does.',
        'Renewable and nonrenewable describe how long nature takes to resupply a resource. They are not a judgment about which group is better.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Renewable & Nonrenewable Resources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
