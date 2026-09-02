/**
 * Grade 6 Science (Earth & Space Science) — Earth's Resources & Natural
 * Hazards: Forecasting & Preparing for Weather Hazards.
 *
 * PROCEDURE-LED row in the m6sci fan-out (NGSS MS-ESS3-2), named explicitly
 * as procedure-led by the fan-out contract's exemplar-assignment list. This
 * file follows the shape of the procedure-led exemplar
 * (`m6sci-u5-relative-dating-and-rock-layers.ts`): one fixed routine runs
 * both worked examples and every item -- read the forecast data, read the
 * historical-track data, compare a PROPOSED preparedness or mitigation
 * action against both, and judge whether the action fits the evidence or is
 * too weak, too broad, or aimed at the wrong hazard or the wrong location.
 * This is a judgment routine rather than a recall routine: every worked
 * example and every try_yourself item gives data plus a proposed action and
 * asks whether the action fits, never "what is a hurricane" or "what is a
 * watch" in isolation.
 *
 * The two traps this file is built to kill are (a) treating a forecast track
 * (the "cone") as a guaranteed exact path rather than a likely range, with
 * hazards able to reach beyond it, and (b) treating a location's past luck
 * -- or a storm's dropping wind category -- as proof that no serious action
 * is needed this time, when the specific forecast and historical-track
 * evidence for THIS event says otherwise.
 *
 * SCOPE GUARD: this plan evaluates a proposed preparedness or mitigation
 * action for a hurricane, tornado, or flood risk against forecast data and
 * historical storm-track evidence. It never explains how a hurricane,
 * tornado, or thunderstorm forms, and it never locates a geologic hazard.
 * Because several close boundaries sit right next to this row, the guard
 * states what is deliberately EXCLUDED and what is deliberately ALLOWED at
 * each edge, and why:
 *   - ROW 9.3 (mapping geologic hazards) owns using the geographic pattern
 *     of past earthquakes, volcanic eruptions, and tsunamis to identify
 *     locations at elevated risk today. No earthquake, volcano, tsunami,
 *     fault line, or plate boundary appears anywhere in this file; every
 *     hazard here is a hurricane, a tornado, or a flood, and every piece of
 *     historical evidence here is a weather record, not a geologic one.
 *   - ROW 6.4 (how air-mass interactions produce severe weather) owns
 *     explaining thunderstorms, tornadoes, and hurricanes as the outcome of
 *     specific air-mass conditions -- wind shear, a supercell's rotating
 *     updraft, warm ocean water organizing a hurricane's eye and eyewall.
 *     None of that mechanism is re-taught here. This file assumes a
 *     hurricane, a tornado, and a flood are already-familiar named hazards
 *     from that row and uses each only as the subject of a forecast and a
 *     response, never re-deriving why any of them forms.
 *   - ROW 6.3 (reading weather maps) owns interpreting a drawn map's fronts,
 *     pressure centers, and symbols. No map symbol, pressure center, or
 *     map-reading routine appears anywhere in this file; every forecast and
 *     every historical record is written out in words, as data, never as a
 *     map to be read.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states which actions fit
 *     the evidence and which do not, and it never explains a hazard's
 *     physical mechanism (no wind-force calculation, no density argument for
 *     why a storm weakens over cooler water, no particle-level account of
 *     anything). Where a mechanism is mentioned at all, it is only to name
 *     that a trend is real (a storm's wind strength dropping after
 *     landfall), never to explain the physics behind it.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - Exact wind-speed thresholds, official intensity-category names, an
 *     exact rainfall total, an exact storm-surge height, and any real named
 *     storm or real place are never used. Every town, county, and river in
 *     this file is unnamed and invented for the item, and every quantity is
 *     a qualitative comparison ("a day or two", "well above its banks"),
 *     never an invented precise figure.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * forecast, every historical-track record, and every proposed action in this
 * file is written out in words, and every item is solvable from the text
 * printed inside it. Never write "see the forecast map above", and never
 * assume the student can see a track cone, a radar image, or a damage map.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 9.3 (mapping-geologic-hazards) -> 9.4 (this row) -> 10.1
 * (the-carbon-cycle-in-rocks-ocean-and-air), per the fan-out contract's
 * chain table and this row's lesson brief. Both are populated below with the
 * real previous-row and next-row loIds rather than left empty, because all
 * 40 rows in this batch are registered together and both neighbors will
 * exist by then.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U9_FORECASTING_AND_PREPARING_FOR_WEATHER_HAZARDS: LessonPlan = {
  id: 'evelyn.ms.m6sci.forecasting-and-preparing-for-weather-hazards.v1',
  title: 'Forecasting & Preparing for Weather Hazards',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.forecasting-and-preparing-for-weather-hazards',
      standard: 'M6SCI-9.4',
      description:
        'Use weather-forecast data and historical storm tracks to evaluate a proposed preparedness or mitigation action for a hurricane, tornado, or flood risk (shares MS-ESS3-2 with Topic 3: that lesson locates geologic hazards, this one addresses weather hazards and human response) (NGSS MS-ESS3-2).',
    },
  ],
  prerequisites: ['m6sci.mapping-geologic-hazards'],
  followUps: ['m6sci.the-carbon-cycle-in-rocks-ocean-and-air'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the idea that a forecast is evidence to be checked against a plan, not a guarantee to be obeyed blindly or ignored.',
      script:
        'You have probably seen a weather map on the news with a shaded, cone-shaped area showing where a storm might go over the next few days. Somebody in your house may have looked at that shape and said something like, "It looks like it is headed right for the edge of the shaded area, so we are probably fine," or, "It missed us the last two times, so it will probably miss us again." Both of those are guesses dressed up as conclusions. A forecast is not a promise, and a place\'s past luck is not a shield. What actually tells you whether a plan makes sense -- boarding up windows, packing a bag, choosing which room to shelter in -- is reading the forecast and the historical record together and asking whether the plan matches what they actually show. Today you learn that routine.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evaluating-a-proposed-action',
      kind: 'concept',
      goal: 'Install the two kinds of evidence, the preparedness/mitigation distinction, and the routine for judging whether a proposed action fits the evidence.',
      keyIdeas: [
        'A FORECAST TRACK SHOWS A RANGE, NOT A GUARANTEED PATH. A hurricane forecast often includes a shaded cone, built from how accurate past forecasts have been, showing the range of positions the storm\'s center is likely to occupy over the next several days. It is not the size of the storm and it is not a promise of exactly where the storm will go. Wind, heavy rain, and storm surge -- an abnormal rise of ocean water pushed onto land by the storm -- can all reach well beyond the shaded area, so a place just outside the cone is not automatically a place with nothing to prepare for.',
        'HISTORICAL STORM-TRACK DATA IS EVIDENCE ABOUT A SPECIFIC LOCATION, NOT A GENERAL RULE. When past storms that followed a similar track are checked against what actually happened where they passed, the record often shows a pattern: the same low-lying neighborhood floods from storm surge each time, or the same stretch of river overflows the same bridge once rainfall passes a certain point. That pattern is real evidence for judging the next storm on a similar track, but only for that specific place and that specific kind of track. A location that has been lucky before is not protected; it may simply be that no storm has yet matched the track that has caused trouble at other similar places.',
        'A WATCH MEANS "GET READY"; A WARNING MEANS "ACT NOW." A watch is issued when conditions are favorable for a hazard to develop, and it gives time to prepare. A warning is issued when the hazard is already happening or is expected very soon, and it means to act immediately rather than to keep watching and waiting. Reading which one is in effect is part of reading the forecast data, alongside the track and the intensity trend.',
        'PREPAREDNESS AND MITIGATION ARE TWO DIFFERENT KINDS OF ACTION. A PREPAREDNESS action is something done to get ready before a specific hazard arrives -- packing emergency supplies, agreeing on an evacuation route, deciding in advance which room to shelter in. A MITIGATION action is something done ahead of time, often long before any specific storm is forecast, to reduce damage or risk over the long term -- reinforcing a building, elevating a home above a known flood line, keeping a low bridge closed whenever the river reaches a level with a history of overflow. A proposed action can be evaluated as either kind, and the same evidence -- the forecast plus the historical record -- is what decides whether it fits.',
        'THE ROUTINE FOR EVALUATING A PROPOSED ACTION, IN ORDER -- (1) Read the forecast data: what does the track, the intensity trend, and the watch-or-warning status say. (2) Read the historical data: what has actually happened at this location, or on a similar track, before. (3) Compare the proposed action to both: does it target the specific hazard and the specific place the evidence points to, or does it treat every situation the same regardless of what the evidence shows. (4) Judge the fit: does the action match the level and location of risk, or is it too weak, too broad, aimed at the wrong hazard, or aimed at the wrong part of the place. A plan can fail this check by doing too little for a real risk, or by treating every location or every storm identically when the evidence says the risk is concentrated somewhere specific.',
        'A DROPPING WIND CATEGORY DOES NOT MEAN A DROPPING OVERALL RISK. A storm can weaken in wind strength after landfall while still producing dangerous rain and flooding for an extended time, especially if the historical pattern shows storms on a similar track slowing down and stalling once they reach land. Judging a plan by the wind category alone, and ignoring what the historical rainfall-and-flooding pattern shows, is exactly the kind of mismatch this routine is built to catch.',
      ],
      vocabulary: [
        { term: 'forecast track', definition: 'a prediction of the path a storm\'s center is likely to follow, often shown as a cone whose width reflects how accurate past forecasts have been.' },
        { term: 'storm surge', definition: 'an abnormal rise of ocean water pushed onto land by a storm\'s wind, and a major cause of coastal flooding during a hurricane.' },
        { term: 'watch', definition: 'a forecast alert meaning conditions are favorable for a hazard to develop, issued to give time to prepare.' },
        { term: 'warning', definition: 'a forecast alert meaning a hazard is occurring or expected very soon, issued to mean act immediately.' },
        { term: 'preparedness action', definition: 'an action taken to get ready before a specific forecast hazard arrives, such as packing supplies or planning an evacuation route.' },
        { term: 'mitigation action', definition: 'an action taken ahead of time, independent of any one forecast, to reduce damage or risk over the long term, such as reinforcing a building or keeping a flood-prone road closed above a known river level.' },
      ],
      suggestedTools: ['show_table', 'show_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-coastal-town-evacuation-plan',
      kind: 'worked_example',
      problem:
        'A coastal town receives an updated forecast: a hurricane\'s track shows it moving directly toward the coast within about two days, and forecasters expect it to strengthen before it arrives. Local records show that three past hurricanes that followed a very similar track each caused serious flooding from storm surge in the town\'s low-lying waterfront neighborhood, while the neighborhood a few kilometers inland on higher ground stayed dry each time. The town\'s proposed plan is: "Post a general reminder on social media asking all residents, town-wide, to keep a few days of emergency supplies on hand. No evacuation order is issued for any specific neighborhood." Evaluate this plan against the forecast and the historical pattern.',
      steps: [
        'Step 1, read the forecast data. The track points directly at this coast, arrival is about two days away, and the storm is expected to strengthen, not weaken, before it gets there. That is a rising level of risk with some lead time to act on it.',
        'Step 2, read the historical data. Three past storms on a similar track each caused serious storm-surge flooding specifically in the low-lying waterfront neighborhood, and each time the neighborhood on higher ground a few kilometers inland stayed dry. This is not a "the whole town floods" pattern; it is a pattern tied to one specific, low-lying part of town.',
        'Step 3, compare the proposed plan to both. The plan is a single, general reminder sent to every resident equally, with no stronger action -- such as an evacuation order -- aimed at the one neighborhood the historical record repeatedly singles out.',
        'Step 4, judge the fit. The plan does not fit the evidence. A strengthening storm on a track matching three past flood events calls for a targeted response in the waterfront neighborhood specifically, not a uniform, general reminder that treats every part of town the same.',
        'WRONG: "The forecast track only shows where the storm might go, so it cannot be used to single out one neighborhood." CORRECT: "The forecast track, combined with the historical record for that same track, gives specific evidence about which part of town is actually at elevated risk, and a sound plan uses that evidence rather than treating the whole town identically."',
        'Now run the two checks a judgment answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree: the forecast track pointing at this coast, the strengthening trend, and the repeated historical flooding in one specific neighborhood are three different kinds of evidence, and all three point toward the same conclusion -- extra action is needed there, specifically. Second, change one thing and check that the answer moves: if the historical record instead showed that past similar-track storms flooded different, unpredictable parts of town each time, with no consistent pattern, then a general town-wide reminder would fit the evidence far better, because there would be no specific neighborhood the data pointed to.',
      ],
      answer:
        'The plan does not fit the evidence. Because three previous storms on a similar track each caused serious flooding only in the low-lying waterfront neighborhood, the plan should target that neighborhood with a stronger action, such as an evacuation order, rather than sending one general reminder to the whole town.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-school-tornado-shelter-plan',
      kind: 'worked_example',
      problem:
        'A tornado watch is issued for a county in the morning, meaning conditions are favorable for tornadoes to form later that day. By early afternoon, the watch is upgraded to a tornado warning for the part of the county containing a school, meaning a tornado has been indicated nearby and is expected soon. County damage records show that, for tornadoes that have touched down nearby over the past several decades, the worst injuries usually came from flying debris and broken glass, whether or not the tornado\'s path passed directly over a given building. The school\'s current plan is: when a tornado warning is issued, gather every class in the gym, because it is the only room large enough to hold the whole school at once -- and one wall of the gym is lined with tall windows. Evaluate this plan against the forecast information and the county\'s damage record.',
      steps: [
        'Step 1, read the forecast data. The watch, issued that morning, meant conditions were favorable and there was time to prepare. The warning, issued in early afternoon, means a tornado is indicated nearby and expected soon -- there is little time left to change plans once a warning is issued, so the plan itself needs to already be sound.',
        'Step 2, read the historical data. Nearby tornadoes\' worst damage has come from flying debris and broken glass, even in buildings the tornado did not pass directly over. So the danger from windows is not limited to a direct hit; it applies to any building near a tornado\'s path.',
        'Step 3, compare the plan to both. The plan sends the entire school to the one room with a wall of tall windows, chosen for its size rather than for how sheltered it is.',
        'Step 4, judge the fit. The plan does not fit the evidence. Official guidance for a tornado warning is to move to a small interior room on the lowest floor, away from windows, and the county\'s own damage record explains why: a nearby tornado does not need to hit a building directly for flying debris and broken glass to be the danger. Room size does not decide safety here; distance from windows and being on the lowest floor do.',
        'WRONG: "The gym is the safest choice because it is the biggest room, so it can shelter the most people at once, out of the weather." CORRECT: "Room size does not determine shelter safety during a tornado warning; being on the lowest floor, in an interior space, away from windows does -- and the county\'s own damage record confirms why windows are the specific hazard to avoid."',
        'Now run the two checks. First, three different kinds of clues agree: the official shelter guidance, the county\'s own damage record, and the plan\'s stated reason for choosing the gym (size, not safety) all point the same way -- toward the gym\'s windows being the problem, not its size. Second, change one thing and check that the answer moves: if the gym had no windows and were located on the school\'s lowest, most interior floor, the same plan -- gathering everyone in the gym -- would fit both the official guidance and the county\'s damage record.',
      ],
      answer:
        'The plan does not fit the evidence. It should instead direct students to a small interior room on the lowest floor, away from windows, because the county\'s damage record shows flying debris and broken glass -- not a direct hit -- as the main hazard, and the gym\'s wall of windows works directly against that guidance.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-forecast-cone-and-weakening-track',
      kind: 'try_yourself',
      problem:
        'A hurricane\'s forecast track shows it curving away from a city within the next day, and forecasters expect it to weaken as it moves away from the coast. Historical records show that storms curving away on a similar track have, in the past, dropped in wind strength within about a day after the turn, though some still brought heavy rain and rough surf to the coast as they passed. The city\'s preparedness plan calls for boarding up windows and opening an emergency shelter, the same full response used for a storm expected to make direct landfall. Evaluate this response against the forecast and the historical pattern.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, because a storm forecast to curve away and weaken is guaranteed to bring no rain, wind, or rough surf at all to the coast, the same way a storm that misses a location completely leaves nothing at all to prepare for.' },
        { id: 'b', text: 'No, the historical pattern shows storms on this curving-away track dropping in strength within about a day, so the full direct-landfall response is more than the current evidence supports, even though watching for heavy rain and rough surf may still be worth doing.', correct: true },
        { id: 'c', text: 'Yes, because any hurricane close enough to be tracked at all should always receive the full direct-landfall response, since treating every close storm the same way avoids the risk of being caught unprepared if a later track update turns out to be wrong.' },
        { id: 'd', text: 'Yes, because forecast tracks change too often to be trusted, so a plan should stay at its most cautious setting no matter what an update says, rather than risk relaxing preparation only for the storm to turn back toward the coast later.' },
      ],
      expectedAnswer:
        'No, the historical pattern shows storms on this curving-away track dropping in strength within about a day, so the full direct-landfall response is more than the current evidence supports, even though watching for heavy rain and rough surf may still be worth doing.',
      hints: [
        'Read the forecast and the historical pattern together before judging the plan: what does the track say is now most likely, and what has happened before to storms on this same curving-away track?',
        'A response can be too strong for the evidence just as easily as it can be too weak. Ask whether the full direct-landfall plan matches what a weakening, curving-away track and its historical pattern actually show, rather than assuming either "nothing will happen" or "nothing has changed."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-flood-prone-bridge-guidance',
      kind: 'try_yourself',
      problem:
        'A river town\'s forecast calls for several days of heavy rain, and forecasters expect the river to rise well above its banks by the next night. Historical flood records show that this river has repeatedly overflowed a low bridge on the edge of town whenever rainfall reached this range, covering the roadway with moving water that looked shallow from inside a car. The town\'s proposed guidance is: "If the bridge road looks passable, drivers may decide for themselves whether to cross it." Evaluate this guidance against the forecast and the historical record.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The guidance is sound, because a driver can reliably judge how deep and how fast moving water over a road is just by looking at it from inside a car, the same way a driver can judge the depth of an ordinary puddle in a parking lot.' },
        { id: 'b', text: 'The guidance is sound, because a bridge with a history of flooding is safer to cross than one that has never flooded before, since a repeated flooding pattern shows that other drivers have already gotten across it safely each time.' },
        { id: 'c', text: 'The guidance does not fit the evidence: floodwater depth cannot be judged by looking at it, and this bridge has a track record of flooding at this rainfall level, so the sound action is to close the road and route drivers another way rather than leaving the decision to each driver.', correct: true },
        { id: 'd', text: 'The guidance does not fit the evidence, but only because the forecast rainfall total has not yet been reached, so the bridge\'s flooding history only becomes relevant once that exact rainfall number is crossed, and drivers may decide for themselves until then.' },
      ],
      expectedAnswer:
        'The guidance does not fit the evidence: floodwater depth cannot be judged by looking at it, and this bridge has a track record of flooding at this rainfall level, so the sound action is to close the road and route drivers another way rather than leaving the decision to each driver.',
      hints: [
        'Consider what a driver can and cannot actually tell about moving water over a road just by looking at it, and weigh that against what the bridge\'s own flood history at this rainfall level already shows.',
        'A plan that reaches the right conclusion for the wrong reason still has a problem. Ask whether waiting for a specific rainfall number to be reached is really what makes this bridge unsafe to leave to a driver\'s judgment.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-inland-flooding-after-weakening',
      kind: 'try_yourself',
      problem:
        'Historical tracks show that hurricanes approaching a stretch of coast typically slow down and stall for a day or two after landfall, dropping heavy rain on the same inland areas for an extended time rather than moving through quickly. This year\'s forecast shows a hurricane on a similar landfall track, expected to weaken from a strong hurricane to a much weaker tropical storm within a day after landfall. A county\'s proposed mitigation plan focuses entirely on reinforcing coastal buildings against high wind, with no separate plan for inland flooding once the storm weakens. Evaluate this plan.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plan is sound, because once a hurricane weakens to a tropical storm its rain and flooding stop being dangerous, in the same way that the storm\'s category number is treated as the single measure of how much danger it still poses.' },
        { id: 'b', text: 'The plan is sound, because coastal wind damage always causes more overall harm than inland flooding does, regardless of how slowly a storm moves after landfall, since wind is the hazard most associated with a hurricane\'s name and its category rating.' },
        { id: 'c', text: 'The plan does not fit the evidence, but only because the storm\'s exact wind speed at landfall cannot be predicted precisely enough, treating the plan as unjudgeable until that one precise number is available rather than judgeable using the trend already given.' },
        { id: 'd', text: 'The plan does not fit the evidence: the historical pattern of storms slowing and stalling after landfall, combined with a forecast that keeps heavy rain in place even as the wind weakens, both point to inland flooding as a major risk the plan leaves unaddressed.', correct: true },
      ],
      expectedAnswer:
        'The plan does not fit the evidence: the historical pattern of storms slowing and stalling after landfall, combined with a forecast that keeps heavy rain in place even as the wind weakens, both point to inland flooding as a major risk the plan leaves unaddressed.',
      hints: [
        'A dropping wind category is not the same question as a dropping overall risk. Check what the historical pattern says happens to RAIN, not just wind, once a storm on this track reaches land.',
        'Look for a choice that actually uses both pieces of evidence -- the historical stalling pattern and the forecast\'s weakening trend -- rather than one that dismisses the evidence or explains away the plan\'s gap with an unrelated reason.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cone-and-past-luck',
      kind: 'misconception_check',
      question:
        'One student looks at a hurricane forecast map and says: "The shaded cone shows exactly where the storm will go, so anyone outside the shaded area has nothing to worry about." A second student says: "Our town has never taken a direct hit in the last few storms, so we probably will not this time either." What is wrong with each statement?',
      commonErrors: [
        {
          answer: 'The shaded cone shows exactly where the storm will go, so anyone outside it has nothing to worry about.',
          misconception:
            'Treating a probability range built from past forecast accuracy as if it were a guaranteed, exact path, because a single solid-looking shape on a map feels more definite than an uncertain range.',
          correctsTo:
            'The cone shows the likely range of positions for the storm\'s center, not a guaranteed path and not the size of the storm. Wind, heavy rain, and storm surge can all extend well beyond the shaded area, so a location just outside the cone can still need to prepare, and the cone alone is never enough evidence to decide that a place is safe.',
        },
        {
          answer: 'Our town has never taken a direct hit in the last few storms, so we probably will not this time either.',
          misconception:
            'Treating a place\'s past luck as if it were protection going forward, rather than checking whether the current storm\'s specific forecast track and historical-track evidence actually support that expectation.',
          correctsTo:
            'A location\'s past record does not guarantee its future outcome, especially when the current storm\'s track differs from the tracks of storms that missed before. The sound approach is to compare this storm\'s specific forecast and the historical record for a similar track, not to assume that a pattern of missing will continue on its own.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A forecast track shows a likely RANGE for a storm\'s center, not a guaranteed exact path, and hazards such as wind, rain, and storm surge can extend beyond the shaded area.',
        'Historical storm-track data is evidence about a specific location and a specific kind of track -- it tells you what actually happened there before, not what always happens everywhere.',
        'A watch means conditions are favorable and there is time to prepare; a warning means the hazard is occurring or expected very soon, meaning act now.',
        'A preparedness action gets ready for one forecast hazard; a mitigation action reduces damage or risk over the long term, independent of any single storm.',
        'The routine: read the forecast, read the historical record, compare the proposed action to both, then judge whether it fits -- too weak, too broad, or aimed at the wrong hazard or location are all ways a plan can fail that check.',
        'A dropping wind category does not mean a dropping overall risk; a weakening storm on a track with a history of slowing and stalling can still bring dangerous, extended rain and flooding.',
        'Floodwater depth cannot be judged by looking at it, and a site with a track record of flooding at a given rainfall level should be closed, not left to case-by-case judgment.',
        'During a tornado warning, official guidance is to move to a small interior room on the lowest floor, away from windows, because flying debris and broken glass are the danger even without a direct hit.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Forecasting & Preparing for Weather Hazards' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
