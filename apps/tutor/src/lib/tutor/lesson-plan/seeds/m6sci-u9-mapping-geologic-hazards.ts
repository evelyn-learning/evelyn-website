/**
 * Grade 6 Science (Earth & Space Science) — Earth's Resources & Natural
 * Hazards: Mapping Geologic Hazards.
 *
 * PROCEDURE-LED fan-out row for m6sci (NGSS MS-ESS3-2). This topic is
 * normally taught from a world hazard map the student cannot see, so the
 * whole lesson is built around one substitute for the picture: read a
 * historical record described in words, use the Unit 4 boundary
 * classification it already reports, and match that classification to the
 * hazard mix it has repeatedly produced elsewhere. The routine runs the
 * same way in both worked examples -- read the record, identify the
 * boundary type from the motion evidence already given, match boundary type
 * AND geography (coastal or inland) to the hazard mix, then check the
 * answer two ways -- so the pattern is unmistakable by the third
 * try_yourself item.
 *
 * The two traps this row is built to kill are (a) treating "elevated risk"
 * as a prediction of when, or even whether, a specific future event will
 * happen to a specific person, and (b) assuming every convergent boundary
 * builds the same hazard mix, when a continent-to-continent collision (the
 * Himalayas) produces intense earthquakes without the volcanic arc that an
 * oceanic-continental subduction zone (the Andes, the Cascades) produces,
 * and an inland convergent boundary carries no tsunami risk at all.
 *
 * SCOPE GUARD: this plan LOCATES elevated-risk regions for earthquakes,
 * volcanic eruptions and tsunamis from their historical geographic pattern,
 * matched to the boundary classification Unit 4 already taught how to
 * derive. Where a boundary's type matters, this file either states it
 * directly (the Himalayas, the San Andreas Fault) or gives the same
 * direction-and-distance motion evidence Unit 4 taught how to read (Region
 * A, Region X) and applies that reading in a single step -- it never
 * explains, re-teaches, or walks back through HOW to tell convergent,
 * divergent and transform apart from motion data; that instruction belongs
 * to Unit 4 and is assumed complete before this lesson begins. It also
 * never touches preparedness or mitigation. Because two rows sit very
 * close on either side, the guard states what is deliberately EXCLUDED and
 * also what is deliberately ALLOWED at that edge, and why:
 *   - ROW 9.2 (how geologic processes distribute resources unevenly) is
 *     this row's prerequisite and is about resource formation -- ore
 *     deposits, fossil fuels, aquifers -- not hazards. Nothing about
 *     resource distribution appears in this file.
 *   - ROW 9.4 (forecasting and preparing for weather hazards) is this
 *     row's follow-up and owns weather hazards (hurricanes, tornadoes,
 *     floods) and human response to any hazard -- preparedness kits,
 *     evacuation, mitigation actions. This file names no weather hazard of
 *     any kind and recommends no action a person or a community should
 *     take. It ends at IDENTIFYING where risk is elevated, not at
 *     responding to it.
 *   - Unit 4 (evidence for continental drift, plates and mantle convection,
 *     types of plate boundaries, landforms built by plate motion) is where
 *     "convergent," "divergent," "transform," and the direction-and-distance
 *     method for telling them apart were taught. This file reuses those
 *     words exactly as Unit 4 defined them and reuses two of its own named
 *     examples (the Andes, the Himalayas), applying the classification
 *     rule in one line where needed rather than re-teaching it; the skill
 *     this row adds is reading the hazard pattern that classification
 *     predicts, not re-deriving or re-explaining the classification rule
 *     itself.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: no heat-transfer mechanism, no
 *     force law, no density comparison, and no explanation of WHY an
 *     oceanic plate melts into magma appears anywhere in this file. The
 *     difference between an oceanic-continental and a continent-to-continent
 *     convergent boundary is stated only as an observed contrast in what
 *     each has historically produced (an earthquake-and-volcano mix versus
 *     an earthquake-only mix), never as a particle-level or energy-based
 *     mechanism.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * hazard pattern in this file is written out in words -- named regions, the
 * boundary classification already given for each, and the reasoning that
 * connects one to the other -- and every item is solvable from the text
 * printed inside it. Never write "see the hazard map above", and never
 * assume the student has a globe or a world seismicity map in front of
 * them.
 *
 * NOTE ON claim grounding: every named real-world region and event in this
 * file (the Pacific Ring of Fire pattern, the Andes, the Cascade volcanic
 * arc, the Himalayas, California's San Andreas Fault, the 2004 tsunami
 * near Sumatra and the 2011 tsunami near Japan) is a stable, settled
 * geographic fact, not an invented statistic -- no magnitude, casualty
 * figure, or exact date-of-next-event is stated or implied anywhere in
 * this file, in keeping with the risk-language care this topic requires
 * for an eleven- or twelve-year-old audience.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 9.2 -> 9.3 -> 9.4, populated from the lesson brief.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U9_MAPPING_GEOLOGIC_HAZARDS: LessonPlan = {
  id: 'evelyn.ms.m6sci.mapping-geologic-hazards.v1',
  title: 'Mapping Geologic Hazards',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.mapping-geologic-hazards',
      standard: 'M6SCI-9.3',
      description:
        'Use the geographic pattern of past earthquakes, volcanic eruptions, and tsunamis -- clustered largely along the plate boundaries classified in Unit 4 -- to identify locations at elevated risk today, without predicting when or whether a specific future event will occur (NGSS MS-ESS3-2).',
    },
  ],
  prerequisites: ['m6sci.how-geologic-processes-distribute-resources-unevenly'],
  followUps: ['m6sci.forecasting-and-preparing-for-weather-hazards'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Notice a repeating pattern in something the student has already half-noticed, and turn it into a question.',
      script:
        'If you have ever watched a news report about an earthquake or a volcano, you may have noticed something odd: the reports seem to come from the same handful of places over and over. California. Japan. Chile. Indonesia. Alaska. It is almost never a report from the middle of a large, calm continent. Is that a coincidence, or are those places unlucky, or is something about where they sit on the planet making this happen again and again? Today you learn to read that pattern the way a geologist does -- using what has already happened in a place, going back a long time, to say where the ground itself carries a higher chance of doing it again.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-pattern',
      kind: 'concept',
      goal: 'Read the historical hazard pattern from named regions and their already-classified boundary type, kill the same-mix-everywhere trap, and kill the risk-as-prediction trap.',
      keyIdeas: [
        'THE HISTORICAL RECORD IS THE EVIDENCE. A single earthquake or eruption could happen almost anywhere by chance. What separates an elevated-risk location from anywhere else is a REPEATED pattern over a long stretch of time, tied to a cause that does not go away: an active plate boundary sitting right there. Unit 4 already showed how to tell a convergent, divergent, or transform boundary apart from how the two sides are moving. This lesson starts from a boundary already classified that way and asks a new question: given that classification and the record of what has happened there before, what hazards does this location carry an elevated risk for?',
        'THE PACIFIC RING OF FIRE. Described in words: a band of frequent earthquakes and active volcanoes runs almost all the way around the rim of the Pacific Ocean, matching a near-continuous chain of convergent boundaries there. Along the west coast of South America, an oceanic plate closing in on the continent has built the volcanic Andes mountains. Farther north, the same kind of boundary under the Pacific Northwest of the United States and Alaska has built the volcanic Cascade mountains and the Aleutian Islands. Across the ocean, Japan, the Philippines, and Indonesia all sit on more of this same ring of convergent boundaries. Nearly all of it traces convergent boundaries; almost none of the world\'s active volcanoes sit in the calm interior of a continent, far from any boundary.',
        'NOT EVERY CONVERGENT BOUNDARY BUILDS THE SAME HAZARD MIX. At the Andes and the Cascades, an OCEANIC plate is being forced beneath a continental plate, and that combination builds a chain of volcanoes -- a volcanic arc -- on top of frequent earthquakes. At the Himalayas, the plate carrying India has been closing the distance with the plate carrying the rest of Asia for tens of millions of years, and that boundary is also convergent, but no oceanic plate is being forced under the other one there. The result is a historical record of intense, repeated earthquakes with no active volcanic arc. Convergent tells you the plates are closing in; it does not by itself tell you whether volcanoes come with that.',
        'TRANSFORM AND DIVERGENT BOUNDARIES HAVE THEIR OWN PATTERNS. California\'s San Andreas Fault is a transform boundary: the two sides slide past each other and the distance between them stays about the same. Its historical record is frequent earthquakes and, along that fault itself, no volcanic activity. Divergent boundaries mostly sit hidden on the ocean floor, out of sight, so most of one produces no hazard anyone notices from land. Iceland is the exception worth knowing: it sits directly on top of the Mid-Atlantic Ridge, one of the few places a divergent boundary rises above the ocean surface, and its historical record is frequent earthquakes together with frequent volcanic eruptions, because there the usually-hidden boundary is exposed.',
        'TSUNAMIS FOLLOW A MORE SPECIFIC PATTERN. A large tsunami is most often triggered by a big earthquake on a coastal, undersea convergent boundary, where a sudden shift of the seafloor pushes the whole column of ocean water above it. In 2004, a tsunami that began near Sumatra, Indonesia, and in 2011, a tsunami that began near the coast of Japan, both started this way, on two different coastal convergent boundaries. An inland convergent boundary, like the one under the Himalayas, has repeatedly produced strong earthquakes but carries no tsunami risk at all, because there is no ocean above it to displace.',
        'ELEVATED RISK IS NOT A PREDICTION. Saying a region carries an elevated risk means its historical record and its boundary type give it a higher chance of a future earthquake, eruption, or tsunami than a region with no such boundary nearby. It does not say WHEN the next event will happen, and it does not mean one is certain to happen during any particular person\'s lifetime. It also does not mean a region\'s risk goes down after an event has already happened there, because the boundary that caused it has not gone anywhere. Millions of people live their whole lives in elevated-risk regions without ever experiencing a major earthquake or eruption.',
      ],
      vocabulary: [
        { term: 'hazard record', definition: 'a description of where a kind of natural event -- an earthquake, a volcanic eruption, or a tsunami -- has actually been observed happening in the past, in a particular place.' },
        { term: 'subduction zone', definition: 'a convergent boundary where one plate is forced down beneath another.' },
        { term: 'volcanic arc', definition: 'a chain of volcanoes that forms on the plate that is not sinking, above a subduction zone.' },
        { term: 'tsunami', definition: 'a series of ocean waves triggered when the seafloor is suddenly shifted, most often by a large undersea earthquake along a subduction zone.' },
        { term: 'elevated risk', definition: 'a higher-than-average chance that a kind of hazard occurs in a location, based on what has repeatedly happened there before; it is not a prediction of when, or even whether, the next event happens.' },
      ],
      suggestedTools: ['show_map', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-coastal-subduction-mix',
      kind: 'worked_example',
      problem:
        'Geologists studying the coastline of Region A find that, over the last two hundred years, the coast has repeatedly recorded strong earthquakes and several volcanic eruptions in a narrow band along the shore. Using the Unit 4 method, surveys of the boundary running under that coast show an oceanic plate has been moving steadily toward the continental plate beneath Region A, and the distance between the two plates has been shrinking the whole time. Region A sits right on the ocean. Based on this pattern, what hazards should Region A be understood to carry an elevated risk for?',
      steps: [
        'Start with the boundary type, already given by the motion evidence: the two plates are closing the distance between them, so this is a convergent boundary, and because one plate is oceanic and the other carries the continent, it is specifically a subduction zone.',
        'Match the boundary type to the hazard mix it has historically produced elsewhere. An oceanic-continental subduction zone, like the one under the Andes or the Cascade mountains, has repeatedly built a volcanic arc on top of frequent earthquakes.',
        'Add the coastal detail. Because this subduction zone runs along the coast and out under the ocean, a large earthquake there can suddenly shift the seafloor and displace the ocean water above it -- the mechanism behind a tsunami. An identical convergent boundary running through the middle of a continent, far from any coast, would not carry this specific risk, because there is no ocean above it to displace.',
        'WRONG: "Two hundred years of repeated earthquakes and eruptions means a major one is now due any year now." CORRECT: "The record shows that Region A sits on a boundary type that has repeatedly produced these hazards elsewhere, which raises its chance compared with a place with no such boundary -- it does not say in which year the next event happens."',
        'Put the pieces together: the two-hundred-year record of repeated earthquakes and eruptions matches the pattern expected at a coastal, oceanic-continental subduction zone, so Region A carries an elevated risk of earthquakes, volcanic eruptions, and tsunamis.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The motion evidence says the boundary is convergent and oceanic-continental. The historical pattern at other subduction zones like the Andes and the Cascades says that combination builds a volcanic arc and frequent earthquakes. The coastal geometry says an undersea earthquake there can displace the ocean above it. Three different kinds of evidence, one answer. Second, change one thing and check that the answer moves with it: move this same convergent, oceanic-continental boundary far inland, away from any coast. The earthquake and volcano risk would stay, because those come from the boundary type, but the tsunami risk would disappear, because there would be no ocean left to displace. The answer moves when the coastal detail moves, which is how you know that detail is doing real work.',
      ],
      answer:
        'Elevated risk of earthquakes, volcanic eruptions, and tsunamis, because the boundary is a coastal, oceanic-continental subduction zone -- the combination that has produced all three hazards elsewhere, such as along the Andes and the Cascades.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inland-collision-no-arc',
      kind: 'worked_example',
      problem:
        'The mountain region around the Himalayas sits on a convergent boundary where the plate carrying India has been closing the distance with the plate carrying the rest of Asia for tens of millions of years. Historical records show this region has repeatedly produced strong earthquakes. It sits hundreds of kilometers inland, far from any coastline, and it has no chain of active volcanoes. Explain the hazard pattern here, and say why it looks different from the pattern at an oceanic-continental subduction zone like the Andes, even though both are convergent boundaries.',
      steps: [
        'Start with what the historical record shows directly: repeated strong earthquakes over a long stretch of time, and no active volcanic arc.',
        'Both the Himalayas and the Andes are convergent boundaries, so the direction of motion alone does not explain the difference between them. The difference is in WHAT is converging. At the Andes, an oceanic plate is being forced beneath a continental plate. At the Himalayas, two plates each carrying a continent are colliding with each other, so no oceanic plate is currently being forced beneath the other one there.',
        'WRONG: "Every convergent boundary builds a chain of volcanoes, so the Himalayas must have some that have not been found yet." CORRECT: "Not every convergent boundary builds a volcanic arc. A continent-to-continent convergent boundary, like the one under the Himalayas, has historically produced intense, repeated earthquakes from the collision without the volcanic arc that an oceanic-continental subduction zone produces."',
        'Add the coastal detail again. Because this boundary sits hundreds of kilometers inland, there is no ocean above it to be displaced by an earthquake, so this region does not carry the tsunami risk that a coastal subduction zone like Region A\'s does.',
        'Now run the two checks. First, three clues of different kinds that agree: the historical record itself (many earthquakes, no eruptions), the plate-versus-continent detail that distinguishes this boundary from the Andes, and the inland geography that rules out a tsunami risk. All three point to an earthquake-dominant hazard pattern with no volcano and no tsunami risk. Second, change one thing and check the answer moves: replace one of the two continental plates in this collision with an oceanic plate, keeping the same convergent, closing-distance motion. That single change would begin producing a volcanic arc too, the way the Andes has one, which shows it is specifically WHAT is converging -- not just the fact that the boundary is convergent -- that decides whether a volcanic arc appears.',
      ],
      answer:
        'Elevated risk of earthquakes, but not volcanic eruptions or a tsunami. The two colliding plates each carry a continent, so the collision builds mountains and drives frequent earthquakes without an oceanic plate being subducted to build a volcanic arc, and the region is too far inland to carry any tsunami risk.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-coastal-subduction-mix',
      kind: 'try_yourself',
      problem:
        'Historical records show that a coastal region has experienced many earthquakes and several volcanic eruptions over the last two hundred years. Using the Unit 4 method, surveys show an oceanic plate has been moving steadily toward the continental plate beneath this coastline, and the distance between the two plates has been shrinking the whole time. Based on this pattern, what should this region be understood to have?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'An elevated risk of future earthquakes, volcanic eruptions, and -- because it sits on the coast -- a possible tsunami, without knowing in which year any of them might happen.',
          correct: true,
        },
        {
          id: 'b',
          text: 'A guarantee that a major earthquake will strike within the next few years, since two hundred years of repeated activity means the region is now overdue for one.',
        },
        {
          id: 'c',
          text: 'No unusual risk at all, since earthquakes and eruptions have already happened there many times before and are unlikely to repeat again so soon.',
        },
        {
          id: 'd',
          text: 'Only a volcano risk, because a convergent boundary produces volcanoes, and earthquakes only happen at transform boundaries like the San Andreas Fault.',
        },
      ],
      expectedAnswer:
        'An elevated risk of future earthquakes, volcanic eruptions, and -- because it sits on the coast -- a possible tsunami, without knowing in which year any of them might happen.',
      hints: [
        'Two hundred years of repeated earthquakes and eruptions is evidence about where the underlying cause -- the boundary -- sits, not a countdown clock. What does that evidence say about the CHANCE of a future event, compared with a place that has no such boundary?',
        'Check the boundary type against the hazard mix it has produced elsewhere: does a coastal, oceanic-continental convergent boundary produce only one kind of hazard, or can it combine several at once?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transform-no-volcanoes',
      kind: 'try_yourself',
      problem:
        'For over a hundred years, the region along California\'s San Andreas Fault has recorded frequent earthquakes. In that same stretch of time, this transform boundary has not produced a single volcanic eruption. What does the historical record show about the hazard pattern at a transform boundary like this one?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'This fault must actually be a convergent boundary in disguise, since a hundred years of frequent earthquakes without a single eruption would be impossible at a true transform boundary.',
        },
        {
          id: 'b',
          text: 'Transform boundaries carry an elevated risk of earthquakes, but historically they are not associated with the volcanic activity that many convergent boundaries produce.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Frequent earthquakes are always an early warning sign that a volcano is about to form, so this region should expect one to appear soon.',
        },
        {
          id: 'd',
          text: 'Since no eruption has happened there in a hundred years, this stretch of the fault must not actually sit on a plate boundary at all.',
        },
      ],
      expectedAnswer:
        'Transform boundaries carry an elevated risk of earthquakes, but historically they are not associated with the volcanic activity that many convergent boundaries produce.',
      hints: [
        'Go back to what actually defines this as a transform boundary in Unit 4: the two sides sliding past each other with the distance between them staying about the same. That definition does not depend on volcanoes at all.',
        'A hundred years without an eruption is data about what this particular boundary type has produced, not a sign that something is missing or about to change. What hazard has this boundary repeatedly produced instead?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-coastal-versus-inland-convergent',
      kind: 'try_yourself',
      problem:
        'Region X sits on the coast, right where an oceanic plate has been closing the distance with the continental plate beneath it for millions of years, and the coast has a long historical record of both strong earthquakes and volcanic eruptions. Region Y sits hundreds of kilometers inland, on a convergent boundary formed by two plates that each carry a continent, similar to the Himalayas, and has a long historical record of strong earthquakes with no volcanic eruptions. Do Region X and Region Y carry the same tsunami risk?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Yes, because both regions sit on convergent boundaries, and any convergent boundary carries the same tsunami risk no matter where it is located.',
        },
        {
          id: 'b',
          text: 'No, Region Y actually carries the higher tsunami risk, because the strong shaking from a continent-to-continent collision like the one under the Himalayas eventually reaches a coastline through the ground and forms a tsunami there.',
        },
        {
          id: 'c',
          text: 'No, Region X carries the higher tsunami risk, because an earthquake on its coastal boundary can shift the seafloor and displace the ocean above it, while an earthquake on Region Y\'s inland boundary has no ocean above it to displace.',
          correct: true,
        },
        {
          id: 'd',
          text: 'It cannot be determined without knowing the exact strength of each region\'s earthquakes, because tsunami risk depends only on how strong an earthquake is, not on where it happens.',
        },
      ],
      expectedAnswer:
        'No, Region X carries the higher tsunami risk, because an earthquake on its coastal boundary can shift the seafloor and displace the ocean above it, while an earthquake on Region Y\'s inland boundary has no ocean above it to displace.',
      hints: [
        'Both regions already have a strong earthquake record, so the tsunami answer cannot come from comparing WHICH region has bigger earthquakes. Look instead at what is sitting on top of each boundary -- open ocean, or hundreds of kilometers of dry land.',
        'A tsunami starts with the seafloor itself being shifted, which pushes the ocean water sitting above it. Shaking that travels through solid ground to a distant coastline is not the same mechanism, and does not displace any seafloor on the way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-risk-as-fear-or-countdown',
      kind: 'misconception_check',
      question:
        'A student reads that a region has an elevated earthquake risk and says, "People who live somewhere like that must live in constant danger, and it is only a matter of time before something terrible happens to them." A second student, looking at a different region that just had a large earthquake, says, "That region already had its big earthquake, so its risk is used up and it will not have another one for a long time." What is wrong with each claim?',
      commonErrors: [
        {
          answer: 'People who live in an elevated-risk region live in constant danger, and something terrible is bound to happen to them.',
          misconception:
            'Treating "elevated risk" as a guaranteed, imminent, personal disaster rather than a longer-run comparison between one location and another.',
          correctsTo:
            'Elevated risk means a region has a higher-than-average chance of a hazard happening there, based on what has repeatedly happened in that same place over a long stretch of time. It does not say when, or even whether, the next event happens during any one person\'s lifetime. Many people live their entire lives in an elevated-risk region without ever experiencing a major earthquake or eruption.',
        },
        {
          answer: 'A region that already had a big earthquake has now used up its risk and will not have another one for a long time.',
          misconception:
            'Treating a hazard like a lottery that has already been won, so the same place is now "safe" for a while, instead of understanding that the elevated risk comes from an ongoing feature of that location -- the plate boundary -- which has not gone anywhere.',
          correctsTo:
            'The plate boundary that produced the earthquake is a permanent feature of that location; one event does not use it up. The whole reason a historical record is useful for identifying elevated risk is that these hazards repeat again and again over long stretches of time in the same handful of places -- exactly the pattern this lesson uses to find them in the first place, not evidence that the pattern has ended.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The historical record -- where earthquakes, volcanic eruptions, and tsunamis have actually happened before -- is the evidence used to identify which locations carry an elevated risk today.',
        'Most of the world\'s active volcanoes and a large share of its earthquakes cluster in a band running around the rim of the Pacific Ocean, matching the convergent boundaries that ring it: along the west coast of South America, the Pacific Northwest and Alaska, Japan, the Philippines, and Indonesia.',
        'An oceanic-continental subduction zone, like the one under the Andes or the Cascade mountains, has historically built a volcanic arc on top of frequent earthquakes.',
        'A continent-to-continent convergent boundary, like the one under the Himalayas, has historically produced intense, repeated earthquakes without a volcanic arc, because no oceanic plate is being forced beneath the other one there.',
        'A transform boundary, like California\'s San Andreas Fault, has historically produced frequent earthquakes but no volcanic activity.',
        'A large tsunami is most often triggered by a big earthquake on a coastal, undersea convergent boundary, which suddenly shifts the seafloor and displaces the ocean above it, as happened near Sumatra, Indonesia in 2004 and near Japan in 2011. An inland convergent boundary carries no such risk, because there is no ocean above it.',
        'Elevated risk means a higher chance compared with a place with no such boundary, based on a long historical pattern -- it is not a prediction of when, or even whether, the next event happens, and it does not run out after one event occurs.',
        'Which hazards a region actually carries depends on both the boundary type and its geography -- coastal or inland, oceanic-continental or continent-to-continent -- not on boundary type alone.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Mapping Geologic Hazards' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
