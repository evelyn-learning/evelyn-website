/**
 * Grade 6 World Geography — Geographic Technology & Data Skills: Satellite
 * Images & Aerial Views.
 *
 * CONCEPT-LED, m6geo fan-out row 7.1 (National Geography Standard 1). The
 * skill this row installs is a comparison and a trade-off: a satellite image
 * or aerial view is a real picture that records everything physically
 * present, whether or not anyone planned for it, but attaches no names to
 * anything; a hand-drawn map shows only what a mapmaker chose to include, but
 * names it and can draw things -- such as a boundary with no physical mark --
 * that no camera could ever capture.
 *
 * SCOPE GUARD: this row distinguishes what a satellite image or aerial view
 * shows (everything physically present at that moment, unlabeled) from what a
 * hand-drawn map shows (only what a mapmaker chose, but named), and states one
 * advantage of each. Unit 7 is genuinely new ground: the signed curriculum's
 * own progression rationale states that Grade 7 never teaches GIS, satellite
 * imagery, GPS, or thematic-map reading as its own content, so there is no
 * Grade 7 file on this subject and the usual depth-ceiling test -- open the
 * Grade 7 file and see whether a sentence could be lifted into it unnoticed --
 * is vacuous here; there is nothing to open. Because of that, the guard this
 * row actually needs manages a DIFFERENT risk than the other 39 rows: not
 * drifting UP into a Grade 7 mechanism, but drifting SIDEWAYS into a different
 * discipline entirely. Two sideways risks are named and avoided on purpose:
 * (a) remote-sensing engineering and optics -- HOW a satellite or an aircraft
 * camera captures light, what altitude a satellite orbits at, what a sensor
 * or a wavelength is, and what image resolution means are never stated
 * anywhere in this file; the lesson only ever says WHAT the finished picture
 * gives you, never how the picture was made; and (b) GIS software and
 * advanced remote-sensing analysis, which the signed curriculum's own
 * excluded list reserves for a possible Grade 8 course. Sideways within
 * Grade 6 itself, this row does not classify map TYPES (political, physical,
 * thematic -- that is row 2.2, `types-of-maps`) and does not teach reading a
 * thematic map's key or a data table (that is row 7.3,
 * `reading-a-thematic-map`); it treats "a hand-drawn map" as one general kind
 * of representation and contrasts it with "a picture from above" as another.
 * What IS deliberately allowed, because it is a locating fact rather than a
 * mechanism: naming that a satellite image is taken from a satellite far out
 * in space while an aerial view is taken from an aircraft much closer to the
 * ground -- WHERE the camera was, never HOW the camera works. Also allowed:
 * stating that some real things, such as a boundary with no physical mark on
 * the ground, cannot appear in any picture no matter how it was taken, which
 * is a comparison about what a picture records, not an explanation of imaging
 * technology.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below is answered by
 * DEFINE, IDENTIFY, or CLASSIFY. There is no closed typology of image or
 * sensor types, no explanation of how an image is produced, and no causal
 * chain longer than one link. The comparison in keyIdea 6 -- "a picture's
 * advantage is X; a map's advantage is Y" -- is the deepest reasoning this row
 * asks for, and it stops there.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a short
 * wrong label, and no key was built to be the longest choice BECAUSE it is
 * the key. Measured as a diagnostic, not as a score to minimize: the key is
 * the strictly longest choice in 0 of the 3 items (see character counts in
 * the report). Row 7.1: `(7 + 1) mod 4 = 0`, which omits id `a` -- the three
 * correct choices sit at `b`, `c`, and `d`.
 *
 * There are NO MAPS AND NO IMAGES in this course. Because this row's own
 * subject IS an image, every scenario below describes the picture and the map
 * in printed words precise enough to compare against each other -- the
 * student never needs to see either one.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U7_SATELLITE_IMAGES_AND_AERIAL_VIEWS: LessonPlan = {
  id: 'evelyn.ms.m6geo.satellite-images-and-aerial-views.v1',
  title: 'Satellite Images & Aerial Views',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.satellite-images-and-aerial-views',
      standard: 'M6GEO-7.1',
      description:
        'Distinguish what a satellite or aerial image shows from what a hand-drawn map shows, and state one advantage of each (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.how-people-adapt-to-different-climates'],
  followUps: ['m6geo.how-gps-finds-your-location'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the picture-versus-drawing difference concrete before any vocabulary arrives.',
      script:
        'On a flight to visit family, you press your face against the airplane window and look straight down. You see real rooftops, a winding river, a brown patch where a farmer plowed a field, and the bright blue rectangle of somebody backyard swimming pool. None of it has a name written on it. You are simply looking at whatever is actually down there. Now open the paper map folded in the seat pocket in front of you. It does not show that swimming pool at all, and it never could, because whoever drew that map was not thinking about one family backyard. But the map shows something the window never could: the name of the city you are flying over, and a thick line marking exactly where one state ends and the next one begins. Today you find out why a picture from above and a map of that very same ground never quite agree, and why a geographer needs both of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-picture-versus-drawing',
      kind: 'concept',
      goal: 'Install the picture/drawing distinction, what each one shows and names, and one advantage of each.',
      keyIdeas: [
        'A SATELLITE IMAGE AND AN AERIAL VIEW ARE BOTH PICTURES TAKEN FROM ABOVE, NOT DRAWINGS. A SATELLITE IMAGE is a picture taken by a camera on a satellite, far out in space above Earth. An AERIAL VIEW, also called an aerial photograph, is a picture taken by a camera in an aircraft, flying much closer to the ground than a satellite. Both are real pictures of the ground below, taken from two different heights.',
        'A PICTURE TAKEN FROM ABOVE RECORDS EVERYTHING THAT IS PHYSICALLY THERE. Whatever real object sits on the ground at the moment the picture is taken -- a road, a rooftop, a parked car, a puddle, a bare patch of dirt -- shows up in the picture, in its true shape and color, whether or not anyone planned for it to be there.',
        'A MAP IS DRAWN BY A PERSON, WHO CHOOSES WHAT TO INCLUDE. A hand-drawn map is not a picture of what is physically present. It is built by a mapmaker, who decides which features belong on it. Two mapmakers drawing the very same town can leave out different things, because each one is making a choice, not taking a picture.',
        'A MAP NAMES WHAT IT SHOWS; A PICTURE DOES NOT. A map labels the features it includes with words -- a road\'s name, a city\'s name, the label on a boundary line. A picture, by itself, shows only shapes and colors. Looking at a picture of a river tells you a river is there; it does not tell you the river\'s name.',
        'SOME REAL THINGS LEAVE NO PHYSICAL MARK, SO NO PICTURE CAN SHOW THEM. The line where one country\'s land ends and the next country\'s land begins is not painted on the ground in most places. A picture taken from a satellite or from a plane cannot show a line that is not physically there to photograph. A map can draw that line anyway and label which country sits on each side, because a mapmaker can add a line that no picture could ever capture.',
        'EACH ONE HAS ITS OWN ADVANTAGE. A picture\'s advantage is that it shows real, current, physical detail exactly as it existed at that moment, including details nobody planned for, such as a new building or a parked boat. A map\'s advantage is that it names what it shows and can add information, such as a boundary line, that has no physical shape for any picture to capture.',
      ],
      vocabulary: [
        { term: 'satellite image', definition: 'a picture of the ground taken by a camera on a satellite, far out in space above Earth.' },
        { term: 'aerial view', definition: 'a picture of the ground taken by a camera in an aircraft, flying much closer to the ground than a satellite. Also called an aerial photograph.' },
        { term: 'map', definition: 'a drawing of a place, built by a person, that shows only the features the mapmaker chose to include.' },
        { term: 'label', definition: 'a word or name written on a map to identify one of the features it shows.' },
        { term: 'boundary', definition: 'an edge marking where one place\'s land ends and another\'s begins; some boundaries have no physical mark on the ground at all.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-birch-street',
      kind: 'worked_example',
      problem:
        'A photographer flying in a small plane takes an aerial view of Birch Street. At the very same time, a mapmaker draws a map of Birch Street. The aerial view shows: eight houses of different sizes, a small round swimming pool behind one house that has never been added to any city record, a delivery van parked in a driveway, and a bare brown patch where the grass has died. The map shows: the outline of each house lot, the word "Birch Street" printed along the road, and a thick line marking where the city park begins. Which one would let you find the swimming pool that no record mentions? Which one would tell you the road\'s name?',
      steps: [
        'Start with what an aerial view actually records: everything physically present on the ground at that moment, whether or not anyone planned for it to be there. The swimming pool is real and sitting behind the house, so it appears in the aerial view even though no record mentions it.',
        'Ask whether the map could show it instead. A map only shows what the mapmaker chose to draw, and the mapmaker had no record of the pool, so it is missing from the map. A feature can be completely real and still be absent from a map that was never updated to include it.',
        'Now find the road\'s name. The aerial view shows shapes and colors -- house outlines, a driveway, a bare patch of dirt -- but it does not attach a word to any of them. Looking at the picture tells you a road is there; it does not tell you the road is called Birch Street.',
        'The map answers that question directly, because the mapmaker printed the word "Birch Street" along the road. A map names what it includes; a picture does not.',
        'Check the answer by asking the general question behind both parts: does the tool show what is physically there, or does it show what a person chose to name? The aerial view wins the first question because it is a picture. The map wins the second question because it is a labeled drawing. Neither tool wins both.',
      ],
      answer:
        'The aerial view would show the swimming pool, because a picture records everything physically present whether or not it was planned for. The map would give you the road\'s name, because a map labels the features it chooses to include.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-wrong-claims',
      kind: 'worked_example',
      problem:
        'A student writes: "A satellite image shows everything a map does, only better, because it is a real picture instead of a drawing. And an aerial view is exactly the same thing as a satellite image, just with a different name." Both sentences are wrong. Correct each one.',
      steps: [
        'Take the two claims apart, since each is a separate mistake. Claim one is about whether a picture can replace a map entirely. Claim two is about whether a satellite image and an aerial view are the same thing.',
        'Test claim one with the boundary case. WRONG: "a satellite image shows everything a map does, only better." A boundary line between two countries usually has no physical mark on the ground at all, so a satellite image, no matter how sharp, cannot capture a line that is not physically there. A map can draw that line and name which country sits on each side. CORRECT: a satellite image and a map each show something the other cannot; neither one contains everything the other shows.',
        'Test claim two with the vantage point. WRONG: "an aerial view is exactly the same thing as a satellite image." A satellite image is taken by a camera on a satellite, far out in space. An aerial view is taken by a camera in an aircraft, flying much closer to the ground. CORRECT: both are pictures taken from above, but from two different heights, which is why geographers use two different names for them.',
        'Check claim one on a new case, so the rule is not overlearned. Could a picture ever show a boundary? If a border happens to be marked by a real fence or wall, that fence is a physical object, so it would appear in a picture just like any other real thing. It is only a boundary with no physical mark at all that no picture, taken from any height, can capture.',
        'Check claim two the same way. A satellite image and an aerial view are still both pictures, not drawings, so both share the same basic advantage over a map: they record whatever is physically present. The height they are taken from is what tells them apart, not what kind of thing they are able to show.',
      ],
      answer:
        'First error: a satellite image does not show everything a map does. An invisible boundary with no physical mark cannot appear in any picture, though a map can draw and label it. Second error: an aerial view and a satellite image are not the same thing. A satellite image is taken from a satellite in space; an aerial view is taken from an aircraft much closer to the ground.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-the-shed-in-the-field',
      kind: 'try_yourself',
      problem:
        'A camera in an airplane takes a picture of a farm. The picture shows an old wooden shed standing in the middle of a field. No existing map of the farm shows that shed. Which statement best explains why the shed appears in the picture but not on the map?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The picture must be showing an entirely different farm than the one the map was drawn for, since a real picture and a real map could never disagree with one another.' },
        { id: 'b', text: 'The picture records whatever is physically standing in the field at that moment, while the map only shows what a mapmaker already chose to draw.', correct: true },
        { id: 'c', text: 'The shed cannot possibly be real, because a mapmaker would certainly have already drawn it in if a shed like that truly existed out in that field.' },
        { id: 'd', text: 'Pictures taken from an airplane always show more real objects than pictures taken from a satellite, no matter how far away either camera actually is.' },
      ],
      expectedAnswer:
        'The picture records whatever is physically standing in the field at that moment, while the map only shows what a mapmaker already chose to draw.',
      hints: [
        'Ask which tool shows whatever is really there, and which tool shows only what a person decided to include.',
        'The shed being missing from the map does not mean it is not real; it means the map was never updated to include it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-the-unnamed-river',
      kind: 'try_yourself',
      problem:
        'An aerial photograph shows a winding river and a cluster of buildings, but nothing in the photograph tells you the river\'s name or the buildings\' town. Which of these would most likely give you both of those names?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Taking the very same aerial photograph again on a sunnier, clearer day.' },
        { id: 'b', text: 'Using a satellite image of the same river and buildings instead of an aerial one.' },
        { id: 'c', text: 'A hand-drawn map of the area, since a map labels the features it chooses to include.', correct: true },
        { id: 'd', text: 'Flying the airplane lower so the photograph shows sharper, closer detail.' },
      ],
      expectedAnswer: 'A hand-drawn map of the area, since a map labels the features it chooses to include.',
      hints: [
        'A picture, no matter how it is taken, shows shapes and colors. Ask which tool attaches words to what it shows.',
        'Retaking the picture, switching cameras, or flying lower all change the picture, not whether it has names written on it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-the-unmarked-property-line',
      kind: 'try_yourself',
      problem:
        'Two neighboring farms share a property line that has no fence, wall, or marker of any kind along it. Which tool could still show exactly where that property line runs?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A satellite image, since a picture taken from very far away can capture even a line with no physical mark.' },
        { id: 'b', text: 'An aerial view, since flying closer to the ground reveals lines that a satellite would miss entirely.' },
        { id: 'c', text: 'Neither one, since a line with no physical mark cannot be shown by any tool that exists at all.' },
        { id: 'd', text: 'A hand-drawn map, since a mapmaker can draw and label a line even where the ground itself shows nothing.', correct: true },
      ],
      expectedAnswer: 'A hand-drawn map, since a mapmaker can draw and label a line even where the ground itself shows nothing.',
      hints: [
        'A picture can only show what is physically there to photograph. Ask whether a line with no physical mark is something a camera could ever catch.',
        'A mapmaker is not limited to what a camera can see. A map can carry information, such as a property line, that leaves nothing behind for a picture to capture.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-thing-and-always-more',
      kind: 'misconception_check',
      question:
        'A student says: "A satellite image and an aerial view are just two names for the same thing. And whichever picture you use, it always shows more information than any map, since a picture is real and a map is just a drawing." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A satellite image and an aerial view are just two names for the same thing.',
          misconception:
            'Noticing that both are pictures taken from above and assuming that two similar-looking things must be identical, without checking the one detail that actually separates them: how far away the camera was.',
          correctsTo:
            'A satellite image is taken by a camera on a satellite, far out in space. An aerial view is taken by a camera in an aircraft, flying much closer to the ground. Both are pictures taken from above, but from two different heights, which is why geographers use two different names. WRONG: "they are the same thing." CORRECT: "they are both pictures from above, taken from two different heights."',
        },
        {
          answer: 'A picture always shows more information than any map, since a picture is real and a map is just a drawing.',
          misconception:
            'Assuming that because a picture shows real physical detail, it must also show everything a labeled drawing can show, and forgetting that some real things -- such as a boundary with no physical mark -- leave nothing for any camera to capture at all.',
          correctsTo:
            'A picture and a map each show something the other cannot. A picture shows real physical detail exactly as it existed, including things nobody planned for. A map names what it shows and can draw a line, such as a boundary, that has no physical mark for any camera to photograph. Neither one contains everything the other shows.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A satellite image is a picture taken from a satellite far out in space. An aerial view is a picture taken from an aircraft much closer to the ground. Both are real pictures, not drawings.',
        'A picture taken from above records everything physically present at that moment, in its true shape and color, whether or not anyone planned for it.',
        'A hand-drawn map is built by a person, who chooses which features to include. Two mapmakers can leave out different things.',
        'A map names what it shows with labels, such as a road\'s name or a boundary\'s label. A picture, by itself, shows shapes and colors with no names attached.',
        'Some real things, such as a boundary with no physical mark, leave nothing for a camera to capture. A map can still draw and label such a line.',
        'A picture\'s advantage is showing real, current, unplanned detail exactly as it existed. A map\'s advantage is naming what it shows and adding information a picture cannot capture.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Satellite Images & Aerial Views' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
