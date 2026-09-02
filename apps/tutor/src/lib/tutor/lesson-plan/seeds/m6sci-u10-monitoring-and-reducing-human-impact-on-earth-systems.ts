/**
 * Grade 6 Science (Earth & Space Science) — Human Activity & Earth's
 * Systems: Monitoring & Reducing Human Impact on Earth's Systems.
 *
 * PROCEDURE-LED plan for the m6sci fan-out (NGSS MS-ESS3-3). One routine runs
 * the whole lesson: name the specific impact and the mechanism causing it,
 * check whether the proposed design's own mechanism intervenes on that same
 * step, separate a MONITORING claim from a REDUCING claim, ask what matched
 * before-and-after measurement would count as evidence, and check for
 * displacement -- an impact that has only moved, not gone away. Both worked
 * examples run that same routine so the pattern is unmistakable.
 *
 * The two traps it is built to kill are (a) judging a design by whether it
 * sounds like the responsible thing to do rather than by whether its
 * mechanism and its evidence hold up, and (b) treating a stated efficiency
 * number as settled proof instead of a claim that needs its own source.
 *
 * SCOPE GUARD: this plan evaluates a proposed design or policy for
 * monitoring or reducing a specific human impact on the land, water or
 * atmosphere, using the mechanism-match / monitor-vs-reduce / matched-
 * evidence / displacement routine above -- and it stops there. It never
 * argues that a particular design, technology or policy is the right choice;
 * every item is built so the correct choice is the one with sound reasoning
 * and sufficient evidence, never the one with the more popular position, and
 * no distractor in this file is wrong because of what it favors rather than
 * how it reasons.
 *   - ROW 10.2 (evidence for rising global temperatures) owns the warming
 *     trend and the temperature/CO2 graph evidence. This file does not use a
 *     temperature record, a CO2 record, or the word "warming", and its air
 *     example is a smokestack releasing soot -- a local, physical particulate
 *     impact -- rather than a greenhouse-gas impact, on purpose.
 *   - ROW 10.4 (population growth and resource demand) owns human population
 *     and per-person consumption as the DRIVER of impact. This file starts
 *     from an impact that is already happening and evaluates a response to
 *     it; it never discusses population size, growth, or per-person demand,
 *     and the word "population" does not appear anywhere in this file.
 *   - ROW 9.1 (renewable and nonrenewable resources) owns classifying a
 *     resource by replacement rate. This file never classifies a resource as
 *     renewable or nonrenewable, and those words do not appear here.
 *   - GRADE 7 LIFE SCIENCE boundary: every example in this file is framed at
 *     the Earth-systems level -- particles in air, sediment and nutrients in
 *     water, soil on a slope. No food web, ecosystem, habitat, biodiversity,
 *     species, or population-of-organisms framing appears anywhere; a farm
 *     field and a creek are described only as land and water, never as a
 *     habitat.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: mechanisms are described at the
 *     level of "particles too large to pass through gaps in a mesh are
 *     caught" and "moving water slowed by plant roots drops the sediment it
 *     was carrying" -- observable size- and motion-based descriptions, never
 *     a force calculation, an energy value, a chemical reaction, or the
 *     physics of why a particle settles under gravity. No number in this
 *     file states or implies a specific efficiency percentage or a specific
 *     cost for any technology, because those figures change as technology
 *     improves and are exactly the kind of claim this lesson teaches a
 *     student to be skeptical of rather than repeat.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every device,
 * slope, and stretch of creek in this file is written out in words, and
 * every item is solvable from the text printed inside it. Never write "see
 * the diagram above", and never assume the student can watch a demonstration
 * or read a data table that is not printed in the item itself.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U10_MONITORING_AND_REDUCING_HUMAN_IMPACT_ON_EARTH_SYSTEMS: LessonPlan = {
  id: 'evelyn.ms.m6sci.monitoring-and-reducing-human-impact-on-earth-systems.v1',
  title: 'Monitoring & Reducing Human Impact on Earth\'s Systems',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.monitoring-and-reducing-human-impact-on-earth-systems',
      standard: 'M6SCI-10.3',
      description:
        'Evaluate a proposed design or policy solution for monitoring or minimizing a specific human impact on the land, water, or atmosphere (for example, an emissions filter, a water-treatment step, or a land-reclamation plan) by checking whether its mechanism addresses the impact it claims to and identifying what matched before-and-after evidence would show whether it worked (NGSS MS-ESS3-3).',
    },
  ],
  prerequisites: ['m6sci.evidence-for-rising-global-temperatures'],
  followUps: ['m6sci.population-growth-and-resource-demand'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the evaluation routine in a fix the student has plausibly already seen and never had to judge.',
      script:
        'Maybe you have walked past a construction site after a hard rain. Bare dirt with no grass on it turns into thick, muddy water running toward the street, and sometimes straight into a storm drain that leads to a creek. At some sites, before the bulldozers even start, somebody stakes a strip of black fabric fencing along the low edge of the dirt. It looks flimsy. It is there for a reason: to catch soil before it reaches the water. Here is the question this lesson is built around, and it applies to every fix like that one -- a fence at a construction site, a filter on a smokestack, a rule a town passes. Somebody proposes a fix for a problem. How do you tell, using evidence rather than a good feeling about the idea, whether it actually does what it claims to do?',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evaluating-a-proposed-solution',
      kind: 'concept',
      goal: 'Install the mechanism-match, monitor-vs-reduce, matched-evidence and displacement checks, and kill the good-intentions trap and the stated-number trap.',
      keyIdeas: [
        'MATCH THE MECHANISM, NOT THE INTENTION. Evaluating a proposed design or policy starts by naming the specific impact and the exact mechanism causing it -- what activity, doing what, to which part of Earth\'s systems: the land, the water, or the air. Then check whether the proposed fix\'s own mechanism intervenes on that same step. A design can be expensive and impressive and still miss the actual cause, and a design can look plain and still intervene exactly where it needs to.',
        'MONITORING AND REDUCING ARE TWO DIFFERENT CLAIMS. Monitoring means taking the same measurement repeatedly over time to track whether a condition is changing -- a sensor in a creek, a program that samples air downwind of a plant, a survey of a hillside after a storm. Reducing means changing the process itself so that less of the impact happens in the first place -- a filter, a buffer strip, a regraded slope. A single plan can include one, the other, or both, and evaluating it means checking each part separately. A sensor that records how cloudy a creek is does not, by itself, make the creek any less cloudy.',
        'THE RIGHT EVIDENCE IS THE SAME QUANTITY, MEASURED UNDER MATCHING CONDITIONS. To know whether a reducing step worked, measure the same specific quantity the impact is defined by -- the same kind of particle, the same stretch of creek, a similar season or storm size -- both before the change and after it, or with the change in place and without it nearby. If the two measurements are not taken under matching conditions, a difference between them might come from something else entirely, such as a bigger storm, rather than from the design being evaluated.',
        'WATCH FOR DISPLACEMENT. A design can appear to remove an impact from one place while it is actually moving that same impact somewhere else -- captured material dumped where it can wash into a stream, or runoff slowed on one field that floods the field next door harder instead. A fix that relocates an impact instead of reducing or safely containing it has not actually solved the problem it claims to.',
        'A GOOD-SOUNDING IDEA IS NOT EVIDENCE THAT IT WORKED. WRONG: "The plan must work, because installing a pollution control is always the responsible thing to do." CORRECT: "Whether a plan seems like a good idea and whether its mechanism actually changes the measured impact are two separate questions, and only measurement answers the second one." Evaluating a plan is a reasoning skill that ends in a specific comparison, never in an opinion about which option feels better.',
        'AN EFFECTIVENESS NUMBER IS A CLAIM, NOT SETTLED EVIDENCE. WRONG: "The company said the filter removes almost all of it, so the problem is fixed." CORRECT: "A stated percentage or cost for a specific technology is exactly the kind of figure that changes as the technology improves and gets repeated long after it is out of date, so it needs its own source and date attached -- and even then it describes that technology in general, not what actually happened at this particular site." When you are not sure a number is current and specific to the case, describe how the design works instead of repeating a number for how well it works.',
      ],
      vocabulary: [
        { term: 'mitigation', definition: 'a design or policy meant to reduce a harmful impact that is already happening.' },
        { term: 'monitoring', definition: 'taking the same measurement repeatedly over time in order to track whether a condition is changing.' },
        { term: 'baseline', definition: 'a measurement taken before a change is made, used for comparison with a later measurement.' },
        { term: 'displacement', definition: 'a case in which an impact is not actually removed, but instead moved to a different place or a different part of Earth\'s systems.' },
      ],
      suggestedTools: ['show_diagram', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-emissions-filter-for-soot',
      kind: 'worked_example',
      problem:
        'A factory\'s smokestack releases exhaust containing soot, fine particles from burning fuel, into the air. Nearby residents notice heavy dark dust on parked cars. The company installs a fabric filter inside the smokestack: hot exhaust gas is forced through a fine woven cloth mesh, and particles too large to pass through the weave are caught while the cleaned gas continues out the stack. The captured soot is collected in a sealed bin and trucked to a landfill built with a plastic liner underneath it, so the soot cannot soak into the ground. Does this design address the impact it claims to, and what evidence would show whether it worked?',
      steps: [
        'Name the specific impact and its mechanism. Soot particles are carried along inside the moving exhaust gas, ride out of the stack into the air, and settle on nearby surfaces, including parked cars. The mechanism is: solid particles suspended in a moving gas.',
        'Check the fix against that exact mechanism. The mesh is woven with gaps smaller than the soot particles, so forcing the gas through it physically catches the particles before the gas exits. That is a direct match: the filter intervenes on the very step -- particles riding along with the gas -- that causes the impact.',
        'Separate monitoring from reducing. Installing the mesh is a REDUCING step: it changes the process so less soot leaves the stack. On its own, the plan as described does not include a MONITORING step, so nothing here yet measures whether the change actually shows up in the air.',
        'Name the matched evidence that would show it worked. Measure the amount of soot settling on surfaces (or suspended in the air) downwind of the plant, at the same locations and in a similar season, before the filter is installed and again after it. Comparing the same quantity, in matching conditions, is what turns "we installed a filter" into "the filter worked."',
        'Check for displacement. The filter does not destroy the soot -- it collects it. The plan states the collected soot goes into a sealed bin and then a lined landfill, which keeps it from soaking into the ground or washing into a stream: the impact is contained, not relocated. WRONG: "The soot is gone once it is caught in the filter." CORRECT: "The soot still exists after it is caught; whether the impact is truly reduced depends on where it goes next." If the same soot were instead dumped loose near a creek, it could later blow back into the air or wash into the water, and the plan would have moved the impact rather than reduced it.',
        'Run the two-part check a design like this always needs, since there is no single number to redo. First, look for clues of DIFFERENT KINDS that agree: the mesh-gap reasoning says particles this size should be caught; a before-and-after measurement, taken at the same downwind locations in a similar season, would say whether less soot is actually arriving; and the landfill lining is a separate, physical answer to where the captured material goes. Three different kinds of evidence, one conclusion. Second, change one condition and check that the answer moves with it: if the landfill had no liner and sat next to a creek, the reasoning above would flip from "contained" to "likely displaced," even though the filter inside the stack works exactly the same way.',
      ],
      answer:
        'Yes, the mesh\'s size-based mechanism matches the soot impact, and matched before-and-after measurements of soot downwind would show whether it worked. Calling the plan a full success also depends on the lined landfill actually containing the captured soot -- if it did not, the plan would be displacing the impact rather than removing it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-buffer-strip-runoff-policy',
      kind: 'worked_example',
      problem:
        'A town requires every farm field that borders a creek to leave a strip of grass unplowed along the water\'s edge, meant to reduce the amount of soil and fertilizer that washes off the field into the creek during rain. Evaluate whether this policy\'s design addresses the impact it claims to, and describe evidence that would show whether it worked.',
      steps: [
        'Name the specific impact and its mechanism. During a rainstorm, water runs across bare, plowed soil, picks up loose soil particles and dissolved fertilizer, and carries both into the creek, clouding the water and adding nutrients it did not have before.',
        'Check the policy\'s mechanism against that. A strip of grass is rooted in the ground and covered in stems, which slows the sheet of moving water crossing it and lets the soil particles it is carrying settle out before reaching the creek. That intervenes directly on the "moving water carrying soil" step of the impact.',
        'Separate monitoring from reducing. The buffer strip itself is a REDUCING design: it changes what happens to the runoff before the water reaches the creek. The policy as stated does not include any plan to measure the creek, so on its own it cannot yet be called a proven success or failure.',
        'Name the matched evidence that would show it worked. Measure the cloudiness (how much sediment is suspended) and the fertilizer-nutrient level of the creek at a fixed point downstream of a buffered field, and compare it either to the same point before the rule took effect, or to a similar stretch of creek next to a field without a buffer -- matched for storm size, because a bigger rainstorm alone moves more soil regardless of any buffer.',
        'Check for a confound, which is a different kind of trap than displacement. WRONG: "The buffered field\'s creek looked clearer than the unbuffered field\'s creek after one storm, so the policy is proven to work." CORRECT: "That single comparison ignores whether the two fields also differed in storm size, slope, or soil type, any of which could explain the difference on its own." Only a comparison that matches those other conditions -- or the same field checked before and after -- isolates what the buffer itself is doing.',
        'Run the two-part check. First, look for clues of different kinds that agree: the mechanism (roots and stems slow water and trap soil), a matched before-and-after or paired-field measurement of creek cloudiness, and repeating that comparison across several storms rather than trusting one. Second, change one condition and check the answer moves with it: if the buffer strip were removed and paved over instead, the water would speed back up and carry sediment again, so the cloudiness should rise back toward its earlier level -- confirming that the buffer\'s presence, not something else, was doing the work.',
      ],
      answer:
        'The buffer strip\'s mechanism matches the impact it targets. Evidence that it worked would be a drop in downstream creek cloudiness and nutrient level, measured at matched storm sizes, either before-and-after the rule or against a similar unbuffered field -- a single unmatched comparison is not enough evidence either way.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-settling-tank-wastewater',
      kind: 'try_yourself',
      problem:
        'A river runs alongside a factory that discharges wastewater into it. Nearby residents have noticed that the water downstream looks cloudy on days the factory is running. The factory responds by installing a large tank: incoming wastewater sits in the tank for several hours before release, giving the particles suspended in it time to sink to the bottom, where they are removed, before the remaining water flows out into the river. Which statement best evaluates whether this design addresses the specific impact it claims to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The tank will not help, because settling tanks are normally built for treating household drinking water, not factory wastewater, so the same design cannot be trusted to do anything useful once it is used somewhere else.' },
        { id: 'b', text: 'The tank\'s mechanism matches the impact: given enough still time, particles heavier than water sink out of a liquid that was carrying them, which is the same process making the river cloudy -- so measuring how cloudy the released water is, before and after the tank is added, would show whether it worked.', correct: true },
        { id: 'c', text: 'The tank definitely solves the problem, because water that is left sitting still always becomes completely clear no matter what is dissolved or suspended in it, so no further testing would even be needed.' },
        { id: 'd', text: 'This cannot be evaluated at all, since choosing how to treat wastewater is a policy decision, and any question about whether a technical fix works always comes down to opinion rather than to a measurement anyone could take.' },
      ],
      expectedAnswer:
        'The tank\'s mechanism matches the impact: given enough still time, particles heavier than water sink out of a liquid that was carrying them, which is the same process making the river cloudy -- so measuring how cloudy the released water is, before and after the tank is added, would show whether it worked.',
      hints: [
        'Start by naming exactly what is making the river cloudy, and what physically happens to particles in water that is left sitting still.',
        'A claim that something "always" or "definitely" happens, or that a question "cannot be evaluated," should make you look for the choice that instead points to a specific, testable measurement.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reclamation-monitor-vs-reduce',
      kind: 'try_yourself',
      problem:
        'A mining company proposes a reclamation plan for a hillside strip mine. After mining ends, the bare slope will be regraded to a gentler angle and replanted with fast-growing grass, intended to slow rainwater running down the hillside and reduce the amount of loose soil it carries into the creek at the bottom. The company also proposes installing a sensor in the creek that continuously records how cloudy the water is. Which statement best distinguishes what each part of this plan does?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both parts reduce the erosion problem equally, since they are both listed as part of the same reclamation plan and anything included in an official plan must be pulling equal weight toward the same result.' },
        { id: 'b', text: 'The sensor is the part that actually reduces the erosion, because continuous monitoring catches any new problem the moment it starts, and catching a problem the moment it starts is treated here as the same thing as stopping it from happening.' },
        { id: 'c', text: 'The regrading and replanting are the part meant to reduce the erosion, by slowing the water and holding soil in place with roots; the sensor only measures how cloudy the creek is and would show whether the erosion is still happening -- it does not by itself change anything on the hillside.', correct: true },
        { id: 'd', text: 'Neither part of the plan matters unless the company also stops mining every other hillside nearby, since any erosion still happening somewhere else would count as this specific plan having failed.' },
      ],
      expectedAnswer:
        'The regrading and replanting are the part meant to reduce the erosion, by slowing the water and holding soil in place with roots; the sensor only measures how cloudy the creek is and would show whether the erosion is still happening -- it does not by itself change anything on the hillside.',
      hints: [
        'Ask what each part of the plan physically changes on the hillside itself, versus what each part only records.',
        'A device that records a condition is not the same as a change to the land that produces the condition -- check whether the sensor moves any soil at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reclamation-displacement-outcome',
      kind: 'try_yourself',
      problem:
        'Several years after the reclamation plan above is finished, creek records show far less cloudiness after storms than while the mine was active. At the same time, a farmer downstream reports that a drainage ditch on the far side of his field -- fed by a pipe that was rerouted during the reclamation project -- now runs muddy after every storm, though it never did before. Which statement best evaluates the reclamation plan as a whole?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plan is a complete success, because the creek measurement shows a clear drop in cloudiness, and that is the only evidence that matters here since the ditch problem was never named as part of the original reclamation plan.' },
        { id: 'b', text: 'The plan is a complete failure, because any new muddy water anywhere nearby proves the original erosion was never actually fixed, even though the specific creek the plan targeted is now measurably less cloudy than it was before.' },
        { id: 'c', text: 'The two reports cannot be evaluated together, because they describe two different bodies of water, and a change measured in one waterway can never be relevant to what is happening in a separate one.' },
        { id: 'd', text: 'The plan reduced the impact it targeted in the creek, but the new muddy ditch is a possible case of displacement, since the rerouted pipe connects the two -- the ditch needs its own before-and-after evidence before the whole plan can be called a full success.', correct: true },
      ],
      expectedAnswer:
        'The plan reduced the impact it targeted in the creek, but the new muddy ditch is a possible case of displacement, since the rerouted pipe connects the two -- the ditch needs its own before-and-after evidence before the whole plan can be called a full success.',
      hints: [
        'The creek and the ditch are two separate measurements. Decide first whether they could plausibly share a cause, given what changed during the project.',
        'Being right about one measurement is not the same as being right about the whole plan; check whether an extreme answer is using all of the evidence given, or only part of it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-good-intentions-and-stated-numbers',
      kind: 'misconception_check',
      question:
        'A student writes: "The new filter has to be working, because the company cares about the environment, and they said on their website that it removes almost all of the soot." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The filter has to be working because the company cares about the environment.',
          misconception:
            'Judging whether a design works by whether the people or company behind it seem well-intentioned, instead of by whether the design\'s mechanism addresses the impact and whether a measurement shows a change.',
          correctsTo:
            'Whether a design is a good idea and whether it actually works are two different questions. A caring company can still install a design that misses the real cause of an impact, and an indifferent one can happen to install a design that works perfectly. Evaluating the design means checking its mechanism against the specific impact and finding a matched before-and-after measurement -- not judging the motive of whoever installed it.',
        },
        {
          answer: 'The website says it removes almost all of the soot, so that settles it.',
          misconception:
            'Treating a stated efficiency figure from whoever built or sold the design as settled proof, without an independent, matched before-and-after measurement of what actually happened at this specific site.',
          correctsTo:
            'A stated efficiency number is a claim, not evidence on its own. Figures like that describe a technology in general, change as the technology improves, and are easy to repeat long after they are out of date -- so a specific percentage should always come with its own source and date attached, and it is never a substitute for measuring the actual before-and-after change in the specific impact the design targets.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Evaluating a proposed solution starts by naming the specific impact and the mechanism causing it, then checking whether the solution\'s own mechanism intervenes on that same step.',
        'MONITORING (measuring a condition over time) and REDUCING (changing the process that causes an impact) are two different claims; a plan may do one, the other, or both, and each part needs its own check.',
        'The right evidence is the SAME quantity the impact is defined by, measured before and after, or with and without, the change -- under matching conditions such as similar storm size or season.',
        'DISPLACEMENT: a design can appear to remove an impact from one place while actually moving it to a different location or a different part of Earth\'s systems -- always ask what happens to whatever was captured, filtered, or diverted.',
        'A confound -- a difference in storm size, season, or location between two measurements -- can produce a difference that has nothing to do with the design being evaluated; a fair comparison matches those conditions.',
        'Whether a design sounds responsible is not evidence that it worked, and a stated efficiency number from whoever built the design is a claim to check, not settled evidence, especially because such figures go out of date quickly.',
        'Evaluation is a reasoning skill that ends in a specific comparison, never in an opinion about which option seems better.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: {
    cedUnit: '10',
    cedTopic: '10.3',
    cedTitle: 'Monitoring & Reducing Human Impact on Earth\'s Systems',
  },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
