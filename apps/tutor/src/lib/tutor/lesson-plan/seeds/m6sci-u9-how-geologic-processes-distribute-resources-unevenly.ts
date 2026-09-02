/**
 * Grade 6 Science (Earth & Space Science) — Earth's Resources & Natural
 * Hazards: How Geologic Processes Distribute Resources Unevenly.
 *
 * CONCEPT-LED fan-out row for m6sci Unit 9, Topic 2 (NGSS MS-ESS3-1). The
 * whole lesson runs one move, applied to three named resources: name the
 * specific geologic process that had to happen in a place for a resource to
 * end up there, and explain that a resource shows up only where that process
 * actually occurred, never everywhere. Coal formed where ancient swamp plant
 * material was buried under sediment; oil and natural gas formed where
 * ancient marine sediment buried organic material and a porous layer later
 * trapped it under a sealing layer; copper ore formed where hot,
 * mineral-rich fluids linked to magma near a plate boundary deposited
 * minerals into cracks in the surrounding rock; a strong aquifer exists where
 * a permeable layer of sediment was deposited thickly enough to hold and
 * move groundwater. Four different processes, four different kinds of place.
 *
 * The trap this file is built to kill is treating resource location as
 * random or as purely a matter of digging deep enough. A location holds a
 * given resource only if that location's own geologic history includes the
 * specific process that produces it -- swamp burial, marine burial with a
 * trap, magmatic fluids near a boundary, or thick permeable sediment. A place
 * whose history never included one of those processes will not produce the
 * matching resource no matter how deep anyone digs.
 *
 * Register note: this file names four real regions -- the Appalachian coal
 * fields, the Permian Basin, the Andes copper belt of Chile and Peru, and the
 * Ogallala Aquifer -- solely as places where a well-documented geologic
 * process is known to have produced a well-documented resource. No reserve
 * tonnage, no production figure, no price, and no claim about who owns or
 * should control any resource appears anywhere in this file. The lesson
 * describes geology, not policy: it never states or implies who should have
 * access to a resource, and it never frames a region's resources as a
 * measure of that region's importance or wealth.
 *
 * SCOPE GUARD: this plan explains WHY a named resource occurs in some
 * locations and not others, by tracing the geologic process that formed it
 * there, and stops there. Because the rest of Unit 9 sits very close, the
 * guard states what is deliberately EXCLUDED and also what is deliberately
 * ALLOWED at that edge, and why:
 *   - ROW 9.1 (renewable & nonrenewable resources) owns the RATE-COMPARISON
 *     classification of a resource as renewable or nonrenewable. This file
 *     never classifies a resource that way, and the words "renewable" and
 *     "nonrenewable" appear only in this guard, in the prerequisite loId
 *     naming row 9.1, and nowhere in the lesson's own title, LOs or segments.
 *     Row 9.1 is named once, in the concept segment, only to say that this
 *     lesson asks a different
 *     question about the same resources -- WHERE and WHY, not what rate they
 *     replace at.
 *   - ROWS 9.3 (mapping geologic hazards) and 9.4 (forecasting and preparing
 *     for weather hazards) are not touched at all: no earthquake, volcanic
 *     eruption, tsunami, hurricane, tornado or flood appears anywhere in this
 *     file, and no hazard map or risk assessment of any kind is discussed.
 *   - UNIT 3 (rock types and the rock cycle) is this row's grounding for
 *     sedimentary process, and its vocabulary is used exactly as Unit 3
 *     defined it -- sediment, compaction, cementation and sedimentary rock
 *     describe burial and hardening, never re-defined here. This file adds
 *     no new rock-type vocabulary and never revisits how igneous or
 *     metamorphic rock forms.
 *   - UNIT 4 (plate boundaries and mantle convection) is this row's
 *     grounding for the ore-deposit example, and its vocabulary is used
 *     exactly as Unit 4 defined it -- convergent boundary and subduction name
 *     the setting near the Andes without re-deriving density or motion. This
 *     file never re-teaches how to classify a boundary by direction, and it
 *     never re-explains mantle convection as a mechanism; it only uses the
 *     already-established fact that magma rises where an oceanic plate
 *     subducts beneath a continental plate.
 *   - AQUIFER and RECHARGE are used exactly as row 9.1 defined them, and
 *     PERMEABLE is used exactly as the Unit 7 groundwater row defined it,
 *     without being redefined in this file's own vocabulary list. This file
 *     adds exactly one new idea about aquifers -- that a thick layer of
 *     permeable sediment has to have been DEPOSITED there in the first place
 *     for a strong aquifer to exist -- and it never revisits recharge rate,
 *     runoff, or the water table.
 *   - GRADE 7 LIFE SCIENCE boundary: no ecological content is in scope for
 *     this row, and none appears. Ancient swamp plants and marine organisms
 *     are named only as buried source material for coal and for oil and
 *     natural gas; there is no food web, no ecosystem, no habitat, no
 *     population, and no claim anywhere about how a species changed, adapted
 *     or went extinct.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states THAT heat and
 *     pressure convert buried organic material into coal, oil or natural gas
 *     and THAT magma near a subducting plate carries mineral-rich fluids
 *     upward, because the explanation depends on both facts. It never explains
 *     either process in particle, chemical or energy terms -- no chemical
 *     formula, no heat-transfer mechanism, no conservation-of-energy
 *     reasoning, and no calculation of any kind appears anywhere in this
 *     file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock
 * layer, boundary and region in this file is described in words precisely
 * enough to reason from, and every item is solvable from the text printed
 * inside it. Never write "see the map above", and never assume the student
 * has seen a real oil field, a real mine or a real well.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 9.1 (renewable-and-nonrenewable-resources) -> 9.2 (this row) -> 9.3
 * (mapping-geologic-hazards). Both neighboring rows are authored elsewhere in
 * this same fan-out batch and are registered together with this file, so
 * both arrays below are populated with the real loIds rather than left
 * empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U9_HOW_GEOLOGIC_PROCESSES_DISTRIBUTE_RESOURCES_UNEVENLY: LessonPlan = {
  id: 'evelyn.ms.m6sci.how-geologic-processes-distribute-resources-unevenly.v1',
  title: 'How Geologic Processes Distribute Resources Unevenly',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.how-geologic-processes-distribute-resources-unevenly',
      standard: 'M6SCI-9.2',
      description:
        'Explain why a specific resource (an ore deposit, a fossil-fuel reserve, a productive aquifer) occurs in some locations and not others, by tracing the geologic process (ancient sedimentation, past volcanic activity) that formed it there (NGSS MS-ESS3-1).',
    },
  ],
  prerequisites: ['m6sci.renewable-and-nonrenewable-resources'],
  followUps: ['m6sci.mapping-geologic-hazards'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the process-to-place idea in something the student has probably passed on a drive.',
      script:
        'On a long car trip, you might pass a sign for a coal mine, or a field full of oil pumps slowly nodding up and down, or a water tower for a town that pumps its water from deep underground. Nobody picked those spots by throwing a dart at a map. A mining company does not dig a coal mine in a random field and hope, and a town does not drill a well wherever is convenient and hope water shows up. They look for a very specific kind of place, because a resource like coal, oil, copper ore, or a strong underground water supply only turns up where the right process happened to that ground a very long time ago. Today you learn to read a place\'s geologic history and say what resource it should, or should not, produce.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-process-to-place',
      kind: 'concept',
      goal: 'Tie four named resources to the specific geologic process that concentrates each one, and kill the trap that resource location is random or purely a matter of digging deep enough.',
      keyIdeas: [
        'A RESOURCE SHOWS UP ONLY WHERE THE MATCHING PROCESS HAPPENED. The previous lesson asked a rate question: is a resource replaced about as fast as it is used? This lesson asks a different question about the same resources: WHY does a resource sit in one place and not another? The answer is always the same shape -- a resource is concentrated wherever a specific geologic process acted on that ground, over a very long stretch of time, and it is absent wherever that process never happened. Different resources depend on different processes, so the same patch of ground can hold one resource, several, or none at all, depending on which processes actually touched it.',
        'COAL FORMS WHERE ANCIENT SWAMP PLANT MATERIAL GOT BURIED. A swamp is full of dead plant material piling up in wet, low-oxygen ground, which keeps that material from fully rotting away. Where layer after layer of sediment buried that plant material over an enormous span of time, heat and pressure slowly converted it into coal. The Appalachian coal fields, running through Pennsylvania, West Virginia and neighboring states, sit where ancient swamps existed and were buried this way; a region with no history of ancient swamp burial has no coal to find, no matter how deep anyone digs.',
        'OIL AND NATURAL GAS FORM WHERE MARINE SEDIMENT BURIED ORGANIC MATERIAL AND A LAYER LATER TRAPPED IT. In an ancient shallow sea, tiny marine organisms died and settled onto the sea floor along with mud and sand. Where that organic-rich mud got buried deeper and deeper under more sediment, heat and pressure over an enormous span of time converted the organic material into oil and natural gas. That oil and gas can then seep upward through the pore spaces of a permeable rock layer, called a reservoir, until it reaches an impermeable layer of rock lying above it that it cannot pass through -- and it collects there instead of escaping. The Permian Basin, in West Texas and southeastern New Mexico, holds large oil and natural gas reserves because that region was once covered by such an ancient sea, and its rock layers include both a reservoir and a sealing layer above it. A place that was never covered by that kind of sea, or one whose rock has no sealing layer to hold oil in place, will not have that same reserve.',
        'COPPER ORE FORMS WHERE HOT, MINERAL-RICH FLUIDS RISE NEAR A PLATE BOUNDARY. Where an ocean-floor plate subducts beneath a neighboring plate, part of the sinking plate and the rock around it melts, and that magma works its way upward, exactly as it does where it builds a chain of volcanoes. Along the way, fluids carrying dissolved copper and other metals can separate out of that magma, seep into cracks in the surrounding rock, and deposit minerals there as they cool -- forming a copper ore deposit over an enormous span of time. Along South America\'s west coast, where an ocean-floor plate has long been subducting beneath the continental plate that carries the Andes, Chile and Peru sit above copper ore deposits formed this exact way, and both countries are among the world\'s largest copper producers today. A region with no history of magma rising near a plate boundary has no matching source of mineral-rich fluid, so it has no copper ore deposit of this kind.',
        'A PRODUCTIVE AQUIFER DEPENDS ON A THICK LAYER OF PERMEABLE SEDIMENT HAVING BEEN DEPOSITED THERE. Sand and gravel let water pass through easily; solid, uncracked rock or packed clay does not. A strong aquifer depends on a thick layer of that permeable material existing underground in the first place, and that layer has to have been deposited by some process, the same way any sediment layer is. The Ogallala Aquifer, which lies beneath a wide stretch of the Great Plains from South Dakota down into Texas, sits where ancient rivers, flowing out from the rising Rocky Mountains over a very long span of time, spread thick layers of sand, gravel and silt across the plains. Where the ground beneath a region is instead solid, uncracked rock with no thick permeable layer, no well drilled there will find a strong water supply, no matter how deep it goes.',
        'THE TRAP: DIGGING DEEPER DOES NOT MANUFACTURE A RESOURCE THAT NEVER FORMED THERE. It is tempting to think that any resource could be found anywhere if people just dug far enough down. That is false. Coal depends on a buried ancient swamp having existed there; oil and natural gas depend on buried ancient marine sediment plus a trap; copper ore of this kind depends on mineral-rich fluid having risen near a plate boundary; a strong aquifer depends on a thick layer of permeable sediment having been deposited there. A location that never experienced the matching process will not produce the matching resource, regardless of depth -- depth alone changes nothing about which processes acted on that ground in the past.',
      ],
      vocabulary: [
        { term: 'reservoir rock', definition: 'a permeable rock layer through whose connected pore spaces oil or natural gas can move and collect.' },
        { term: 'ore deposit', definition: 'a concentration of a valuable mineral, such as copper, built up in one place by a geologic process.' },
      ],
      suggestedTools: ['show_map', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-permian-basin-oil',
      kind: 'worked_example',
      problem:
        'The Permian Basin, in West Texas and southeastern New Mexico, holds large reserves of oil and natural gas. Trace the geologic process that put those reserves there, and explain why a region with a different geologic history would not have them.',
      steps: [
        'Start with the source material. Oil and natural gas form from organic material, so the process has to begin with a place that could bury a large amount of it.',
        'Identify the setting. The Permian Basin was once covered by an ancient shallow sea. In that sea, tiny marine organisms died and settled to the sea floor along with mud and sand, building up an organic-rich layer of sediment.',
        'Follow the burial. As more sediment piled on top over an enormous span of time, that organic-rich layer was buried deeper and deeper, and heat and pressure slowly converted the buried organic material into oil and natural gas.',
        'Follow the trap. Oil and gas can seep upward through a permeable reservoir rock until they reach an impermeable layer they cannot pass through, and they collect there instead of escaping to the surface. The Permian Basin\'s rock layers include both a reservoir and a sealing layer above it, which is why the oil and gas that formed there stayed there instead of leaking away over that same enormous span of time.',
        'WRONG: "The Permian Basin has oil because oil can form anywhere underground, given enough time." CORRECT: "The Permian Basin has oil because it was once covered by an ancient sea whose buried organic material was converted to oil and gas, and because its rock layers happened to include a trap that kept the oil and gas from escaping."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The setting clue says an ancient shallow sea covered this region. The mechanism clue says burial, heat and pressure convert organic material into oil and gas over an enormous span of time. The rock-structure clue says a reservoir layer sits under a sealing layer, which is exactly the arrangement needed to trap oil instead of losing it. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Suppose a nearby region had the same ancient sea and the same buried organic material, but its rock layers never included a sealing layer above the reservoir. The oil and gas that formed there would have seeped all the way to the surface and escaped over that same enormous span of time, so that region would not hold a reserve today even though the same organic material was once buried there. The trap is doing just as much work as the burial.',
      ],
      answer:
        'An ancient shallow sea covered the Permian Basin, and marine organic material buried there was converted into oil and natural gas by heat and pressure over an enormous span of time; a reservoir rock layer sealed by an impermeable layer above it kept that oil and gas from escaping. A region without that sea, that burial, or that sealing layer would not hold the same reserve.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-andes-copper',
      kind: 'worked_example',
      problem:
        'Chile and Peru, along South America\'s west coast, sit above some of the largest copper ore deposits in the world. Trace the geologic process that put copper ore there, using what you already know about the plate boundary in that region, and explain why a region far from any plate boundary would not have the same kind of deposit.',
      steps: [
        'Start from the plate boundary already established for this region. Along the Andes, an ocean-floor plate has long been subducting beneath the continental plate -- the same convergent boundary that builds the Andes themselves.',
        'Follow what subduction produces. As the sinking plate goes deeper, part of it and the rock around it melts, and that magma works its way upward through the plate riding above it -- the same process that feeds the volcanoes along a convergent boundary.',
        'Add the mineral step. As that magma rises, fluids carrying dissolved copper and other metals can separate out of it, seep into cracks in the surrounding rock, and deposit minerals there as the fluids cool. Repeated over an enormous span of time, that process builds up a concentrated copper ore deposit.',
        'Connect the process to the place. Chile and Peru sit directly above the stretch of boundary where this subduction has been happening, so their rock has been exposed to that rising, mineral-carrying magma again and again -- which is why this particular stretch of the Andes holds some of the largest copper ore deposits on Earth.',
        'WRONG: "Chile and Peru have copper ore because South America happens to be rich in metal." CORRECT: "Chile and Peru have copper ore because their rock sits directly above a subduction zone that has repeatedly carried mineral-rich fluid upward from rising magma."',
        'Now run the two checks. First, three clues of different kinds that agree: the boundary clue (a known convergent, subducting boundary runs along this coast), the mechanism clue (subduction produces rising magma, and magma can release mineral-rich fluid), and the real-world clue (Chile and Peru are, in fact, among the world\'s largest copper producers, matching what the mechanism predicts for that location). Second, change one thing and check that the answer moves: a region sitting in the middle of a single plate, far from any boundary, has no subducting plate beneath it and no matching source of rising, mineral-carrying magma, so that process cannot deposit the same kind of copper ore there, whatever else might be true of its rock.',
      ],
      answer:
        'Along the Andes, an ocean-floor plate subducts beneath the continental plate, and rising magma from that subduction releases mineral-rich fluids that deposit copper into cracks in the surrounding rock over an enormous span of time. A region far from any plate boundary has no subducting plate and no matching source of rising, mineral-carrying magma, so it will not have the same kind of copper ore deposit.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-coal-from-swamp-burial',
      kind: 'try_yourself',
      problem:
        'A region\'s rock record shows that it was once covered by ancient swamps, and that dead plant material from those swamps was buried under layer after layer of sediment over an enormous span of time. Based on that history alone, which resource is that region most likely to have today?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Copper ore, because any rock buried underground for a long enough time eventually collects metal deposits, no matter what process did the burying.' },
        { id: 'b', text: 'Oil and natural gas, because buried organic material always converts into a liquid or a gas, whatever environment it originally came from.' },
        { id: 'c', text: 'A strong aquifer, because any thick layer of buried sediment holds and supplies groundwater, whether or not that sediment stays permeable.' },
        {
          id: 'd',
          text: 'Coal, because ancient swamp plant material buried under sediment for an enormous span of time is converted into coal by heat and pressure.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Coal, because ancient swamp plant material buried under sediment for an enormous span of time is converted into coal by heat and pressure.',
      hints: [
        'Match the source material in the history to the resource it produces. What did the ancient swamps supply that got buried -- and which resource forms specifically from that kind of buried plant material?',
        'Marine burial and swamp burial are not the same process. This region\'s history describes a swamp, not an ancient sea, so ask which resource the swamp version of burial is known to produce.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ogallala-sediment',
      kind: 'try_yourself',
      problem:
        'Beneath a wide stretch of the Great Plains, ancient rivers flowing out from the rising Rocky Mountains spread thick layers of sand, gravel and silt across the land over a very long span of time. That same layer, the Ogallala Aquifer, today supplies water to wells across several states. Which fact from that history explains why this aquifer is so productive?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A thick layer of permeable sediment -- sand, gravel and silt -- was deposited there, giving groundwater a large amount of connected space to fill and move through.',
          correct: true,
        },
        { id: 'b', text: 'The Rocky Mountains are close by, and mountains are always found above the largest aquifers, since nearby water sources are what keep any aquifer filled.' },
        { id: 'c', text: 'Rivers flowed across the plains for a very long span of time, and any location ancient rivers crossed becomes a strong aquifer, since moving water leaves sediment as it flows.' },
        { id: 'd', text: 'The sediment came from a mountain range, and sediment traced to a mountain range makes an aquifer strong no matter how thick the resulting layer turned out to be.' },
      ],
      expectedAnswer:
        'A thick layer of permeable sediment -- sand, gravel and silt -- was deposited there, giving groundwater a large amount of connected space to fill and move through.',
      hints: [
        'A strong aquifer depends on a specific PROPERTY in the rock or sediment underground, not just a nearby landmark or a long history of rivers passing through. What property does sand and gravel have that lets it hold and move water well?',
        'Being near mountains, or having ancient rivers flow through an area, does not by itself guarantee a strong aquifer. Ask what those rivers actually left behind, and whether that material is the kind that water can move through easily.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-granite-region-no-oil',
      kind: 'try_yourself',
      problem:
        'A geologist is deciding where to search for oil. Region A\'s deep rock has always been solid granite that cooled from magma far underground, with no ancient marine sediment layers anywhere nearby. Region B was covered by an ancient shallow sea whose organic-rich mud was later buried under more sediment. Based on the geologic process that forms oil, what should the geologist conclude about drilling in Region A?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Region A is just as likely to have oil as Region B, because enough time spent buried underground is the only real requirement for oil to form, regardless of whether that rock ever held buried marine organic material.' },
        {
          id: 'b',
          text: 'Region A is unlikely to have oil, because oil forms from buried marine organic material, and granite\'s history includes no ancient sea or buried organic material of that kind.',
          correct: true,
        },
        { id: 'c', text: 'Region A is more likely to have oil than Region B, because granite sits deep underground, and rock spending more time deep underground always accumulates more oil.' },
        { id: 'd', text: 'It is impossible to say anything about either region without drilling a well and checking directly, since geologic history can never predict what resources might be found.' },
      ],
      expectedAnswer:
        'Region A is unlikely to have oil, because oil forms from buried marine organic material, and granite\'s history includes no ancient sea or buried organic material of that kind.',
      hints: [
        'Go back to what oil actually requires: a source of organic material buried in sediment, later converted by heat and pressure. Does Region A\'s history, as described, include that source material at all?',
        'A rock\'s density or how long it has sat underground does not substitute for the specific process oil formation depends on. Compare the two regions\' histories directly against that process before choosing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-resources-are-random',
      kind: 'misconception_check',
      question:
        'A student says: "Resources like oil, coal, and copper are basically scattered randomly across the Earth. If a company just digs deep enough in any location, they should eventually strike one of them." Two separate things have gone wrong in that statement. What are they?',
      commonErrors: [
        {
          answer: 'Resources like oil, coal, and copper are basically scattered randomly across the Earth.',
          misconception:
            'Treating resource location as unpredictable because no visible pattern is obvious at a glance, rather than tracing it to the specific geologic process that had to occur in that location.',
          correctsTo:
            'Resource location is not random. Coal sits where ancient swamp material was buried under sediment; oil and natural gas sit where ancient marine sediment was buried and then trapped by a sealing rock layer; copper ore of the kind found in the Andes sits where mineral-rich fluid rose from magma near a subducting plate boundary. Each resource traces back to a specific process that acted on that ground, which is exactly why resources cluster in some regions and not others.',
        },
        {
          answer: 'If a company just digs deep enough in any location, they should eventually strike one of them.',
          misconception:
            'Assuming that depth alone can substitute for the geologic process a resource actually requires, since digging deeper feels like it should eventually reach anything.',
          correctsTo:
            'Digging deeper does not change what processes acted on a location\'s rock in the past. A region whose deep rock has always been solid granite with no ancient sea nearby has no buried marine organic material, so no depth of drilling will produce oil there. Depth can only reveal what a location\'s geologic history actually put there -- it cannot manufacture a resource whose forming process never happened in that place.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A resource occurs where the geologic process that forms it actually happened, and is absent where that process never happened -- location is not random and depth alone cannot make up for a missing process.',
        'Coal forms where ancient swamp plant material was buried under sediment over an enormous span of time, as in the Appalachian coal fields.',
        'Oil and natural gas form where ancient marine sediment buried organic material, which heat and pressure converted over an enormous span of time -- and they stay in place only where a reservoir rock is sealed by an impermeable layer above it, as in the Permian Basin.',
        'Copper ore of this kind forms where mineral-rich fluid rises from magma near a subducting plate boundary and deposits minerals in cracks in the surrounding rock, as along the Andes in Chile and Peru.',
        'A productive aquifer depends on a thick layer of permeable sediment, such as the sand and gravel spread by ancient rivers beneath the Ogallala Aquifer, not just a long history or a nearby mountain range.',
        'This lesson asks WHY a resource sits where it does; the previous lesson asked whether a resource is replaced about as fast as it is used. Those are two different questions about the same resources.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'How Geologic Processes Distribute Resources Unevenly' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
