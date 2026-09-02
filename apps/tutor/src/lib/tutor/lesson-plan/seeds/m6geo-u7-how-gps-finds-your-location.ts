/**
 * Grade 6 World Geography — Geographic Technology & Data Skills: How GPS
 * Finds Your Location.
 *
 * CONCEPT-LED, m6geo fan-out row 7.2 (National Geography Standard 1). The
 * skill this row installs is one plain idea: a GPS receiver does not simply
 * "know" where it is, and the satellite does not know either -- the receiver
 * works its own location out by combining how far away it is from several
 * satellites at once, because one distance alone only narrows the search to
 * a circle of possible spots, not to one exact place.
 *
 * SCOPE GUARD: this row describes, in plain language, THAT a GPS receiver
 * listens for signals from several satellites, THAT each signal lets the
 * receiver work out its distance from that one satellite, and THAT combining
 * several such distances -- not any single one -- is what narrows the search
 * down to one exact location. It never explains HOW a distance is worked out
 * from a signal. The sentence this file deliberately does not write is the
 * honest engineering account: each satellite signal carries an extremely
 * precise timestamp, the receiver measures the tiny delay between when the
 * signal left the satellite and when it arrived, and multiplies that delay
 * by the speed of light to get the distance. That calculation, the speed of
 * light itself, and the atomic clocks that make the timestamp precise enough
 * to use are never named or implied anywhere in this file.
 *
 * Unit 7 has no Grade 7 counterpart the way most of this course does -- the
 * signed curriculum states plainly that Grade 7 never teaches GIS, satellite
 * imagery, GPS, or thematic-map reading as its own content, so there is no
 * Grade 7 file on this subject and the usual Depth Ceiling Test 5 (open the
 * Grade 7 file and see whether a sentence could be lifted into it unnoticed)
 * is vacuous for this row, exactly as it was for this unit's sibling row 7.1
 * (`m6geo-u7-satellite-images-and-aerial-views.ts`). Because there is no
 * "up" to drift into, the real risk this guard manages is SIDEWAYS drift
 * into a different discipline entirely, and this file is written to stay out
 * of two specific ones: (a) PHYSICS -- signal travel time, the speed of
 * light, and any arithmetic that combines them, which is exactly the
 * sentence named above and is the one this row is built around avoiding; and
 * (b) ENGINEERING -- what altitude the satellites orbit at, how many
 * satellites make up the GPS constellation, how accurate a real receiver is,
 * what an atomic clock is, and how a receiver's antenna or chip works are
 * never stated anywhere in this file. Every one of those is also a
 * checkable, commonly-misstated, and sometimes-changing figure, which is a
 * second, independent reason to leave every one of them out rather than
 * quote a number that could be wrong or go stale.
 *
 * What IS deliberately allowed, because it is the plain functional fact this
 * row exists to teach rather than a mechanism: that a receiver can work out
 * its DISTANCE from a satellite using that satellite's signal (stated as a
 * plain fact of what the signal is FOR, never explained as HOW), and that one
 * distance alone leaves many possible locations while combining distances
 * from more than one satellite at once narrows those possibilities down to a
 * single spot. The worked examples build this second idea using an invented,
 * flat, two-dimensional flag-and-field scenario -- deliberately never claimed
 * to be how satellites are arranged in the real sky -- purely so an
 * eleven-year-old can reason about circles crossing rather than being told a
 * closed-form rule to memorize.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below is answered by
 * DEFINE or IDENTIFY. There is no closed typology of signal types or orbit
 * types, no arithmetic computing a real distance from a real signal, and no
 * causal chain longer than one link ("a receiver needs more than one
 * satellite's distance BECAUSE one distance alone still leaves many possible
 * spots" is the single link this row uses, and it is also the deepest
 * reasoning either worked example asks for).
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a short
 * wrong label, and no key was built to be the longest choice BECAUSE it is
 * the key. Measured as a diagnostic, not as a score to minimize: the key is
 * the strictly longest of its four choices in 2 of the 3 items (see the
 * character counts in the report; both margins are under 25 characters over
 * the next-longest choice, not a wide gap). A count of 2 in a three-item file
 * is weak evidence either way -- chance alone produces 0 or 1 about 84% of
 * the time, so 2 is not treated here as a signal to keep editing down; the
 * real measurement is the course-level rate at registration. Row 7.2:
 * `(7 + 2) mod 4 = 1`, which omits id `b` -- the three correct choices sit at
 * `a`, `c`, and `d`.
 *
 * There are NO MAPS AND NO IMAGES in this course. The flag-and-field scenario
 * in the worked examples, and every satellite scenario in the try_yourself
 * items, are described in words precise enough to reason from without seeing
 * anything drawn.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U7_HOW_GPS_FINDS_YOUR_LOCATION: LessonPlan = {
  id: 'evelyn.ms.m6geo.how-gps-finds-your-location.v1',
  title: 'How GPS Finds Your Location',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.how-gps-finds-your-location',
      standard: 'M6GEO-7.2',
      description:
        'Describe, in plain language, how a GPS receiver uses signals from multiple satellites to determine a location (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.satellite-images-and-aerial-views'],
  followUps: ['m6geo.reading-a-thematic-map'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the "how" question feel real and puzzling before any vocabulary arrives.',
      script:
        'You are in the back seat on a family road trip, and the car has stopped at a gas station in a town nobody in the car has ever visited before. Someone opens a map app on a phone, and for a second it just says "Locating...". Then a small blue dot appears, sitting right on top of the gas station, on the correct street, in the correct town. Nobody typed in an address. Nobody told the phone where it was. The phone simply knew. Today you find out what is actually happening during that one second the screen says "Locating...", and the answer starts hundreds of miles above your head, with a handful of satellites you cannot see or hear.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-signals-and-distances',
      kind: 'concept',
      goal: 'Install what GPS is, what a receiver does with a satellite signal, and why more than one satellite is needed to pin down one exact location.',
      keyIdeas: [
        "GPS IS A SYSTEM OF SATELLITES THAT CONSTANTLY SEND OUT SIGNALS. GPS stands for GLOBAL POSITIONING SYSTEM. It is a system of satellites that circle Earth in the sky, and each satellite constantly sends out a signal -- information traveling as a radio wave -- that a special device called a GPS RECEIVER can pick up.",
        'A RECEIVER ONLY LISTENS; IT DOES NOT SEND ANYTHING UP. A GPS receiver, whether it is built into a phone, a car, or a handheld device, does not transmit anything up to the satellites. It only listens for the signals the satellites are already sending out to anyone in range.',
        "A RECEIVER USES A SATELLITE'S SIGNAL TO WORK OUT ITS DISTANCE FROM THAT SATELLITE. Each signal a receiver picks up lets the receiver figure out how far away it is from that one satellite. This is the one job a satellite signal does for a receiver: it gives the receiver a distance to that satellite, nothing more.",
        'ONE DISTANCE ALONE IS NOT ENOUGH TO PIN DOWN AN EXACT LOCATION. If a receiver knows only that it is a certain distance from a single satellite, that distance is true at many different possible spots -- everywhere that is exactly that far from the satellite -- not just at one place.',
        'COMBINING DISTANCES FROM MORE THAN ONE SATELLITE NARROWS THE LOCATION DOWN TO ONE SPOT. A receiver keeps listening until it has picked up signals from several satellites at the same time and worked out its distance from each one. Combining several distances together -- not any single one alone -- is what narrows the many possible spots down to just one.',
        'THE SATELLITE NEVER LEARNS THE RECEIVER\'S LOCATION. Each satellite sends out the same signal to anyone listening, whether or not a receiver ever picks it up. The satellite has no way of knowing whether a receiver exists nearby or where it is. All of the figuring out happens inside the receiver itself.',
      ],
      vocabulary: [
        { term: 'GPS', definition: 'short for Global Positioning System, a system of satellites circling Earth that constantly send out signals a receiver can use to find a location.' },
        { term: 'satellite', definition: 'an object that circles Earth in the sky, following the same path again and again.' },
        { term: 'receiver', definition: 'a device that listens for and picks up a signal, such as the signals sent by GPS satellites.' },
        { term: 'signal', definition: 'information sent out as a radio wave that a receiver can pick up.' },
        { term: 'distance', definition: 'how far apart two things are; a GPS receiver combines its distance from several satellites at once to find a location.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-flags-on-the-field',
      kind: 'worked_example',
      problem:
        'On a wide, flat practice field, three flags stand at fixed spots: a red flag, a blue flag, and a yellow flag. A player is told: "You are standing exactly a certain distance from the red flag." Can the coach point to the player\'s exact spot on the field yet? What happens once the player is also given the distance from the blue flag, and then from the yellow flag?',
      steps: [
        'Start with just the red flag distance. Every point on the field that sits exactly that distance from the red flag forms a full circle drawn around the red flag. That one distance narrows the player\'s spot from "anywhere on the whole field" down to "somewhere on this one circle" -- but a circle still has many possible points on it, not one.',
        'Add the blue flag\'s distance. Draw a second circle, this time around the blue flag, using the player\'s distance from it. Two different circles usually cross each other at exactly two points. The player must be standing at one of those two crossing points, so the search is narrowed from a whole circle down to just two spots.',
        'Add the yellow flag\'s distance. Draw a third circle around the yellow flag using the player\'s distance from it. Of the two crossing points found in the last step, only one of them will also sit exactly on this third circle. That single matching point is the player\'s exact spot on the field.',
        'Check the answer by working backward. Take that one matching point and measure its distance to all three flags. If it comes out exactly right for the red flag, the blue flag, and the yellow flag, all three distances agree, which confirms the spot.',
        'Now test a contrasting case. Suppose the player had given the coach only the red flag\'s distance and the blue flag\'s distance, and stopped there. The coach would still be stuck choosing between two possible points, because two circles alone leave two crossing points, not one -- it takes a third circle to break the tie.',
        'This is the idea real GPS uses. A receiver in the real world is not standing on a flat field with three flags; it is combining distances from satellites spread through the sky. But the reasoning is the same one this field just showed: one distance is not enough, and a receiver keeps combining distances from several satellites at once until only one location fits every one of them.',
      ],
      answer:
        'A single distance from the red flag alone narrows the player\'s spot to a whole circle of possible points. Adding the blue flag\'s distance narrows that circle down to two possible points. Adding the yellow flag\'s distance narrows those two points down to one exact spot, because only one of them also matches the third distance. A GPS receiver finds a location the same way, by combining distances from several satellites at once.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-wrong-claims',
      kind: 'worked_example',
      problem:
        'A student writes: "A GPS receiver only needs to pick up one very strong satellite signal, and that satellite already knows exactly where the receiver is standing, so it sends the location straight down." Both sentences are wrong. Correct each one.',
      steps: [
        'Take the two claims apart first, since each is a separate mistake. Claim one is about how many satellites a receiver needs. Claim two is about which device actually knows the receiver\'s location.',
        'Test claim one. WRONG: "the receiver only needs to pick up one satellite signal." One distance, no matter how strong or clear the signal is, narrows the receiver\'s location only to a wide circle of possible spots, not to one exact place. CORRECT: the receiver combines distances from several satellites at the same time, and it takes more than one distance to narrow the search down to a single spot.',
        'Notice that signal strength and signal count are two different things. A single very strong, very clear signal from one satellite still leaves every point on that same circle as a possible answer. Strength does not add a second or third distance to combine -- only picking up another satellite\'s signal does that.',
        'Test claim two. WRONG: "the satellite already knows exactly where the receiver is standing." Each satellite sends out the same signal to anyone in range, whether or not a receiver ever exists to pick it up. The satellite has no way of knowing whether a receiver is listening or where that receiver is.',
        'CORRECT: it is the receiver on the ground that does the figuring out, using the distances it works out from the signals it picks up. The satellite\'s only job is to keep sending its signal; every bit of the location-finding work happens inside the receiver.',
      ],
      answer:
        'First error: one satellite\'s signal is not enough, no matter how strong it is, because a single distance narrows the location only to a circle of possible spots. A receiver needs distances from several satellites at once to narrow the search down to one spot. Second error: the satellite does not know the receiver\'s location. It only sends out a signal; the receiver is the device that works out its own location using that signal.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-one-satellite-not-enough',
      kind: 'try_yourself',
      problem:
        'A hiker\'s GPS receiver picks up a signal from exactly one satellite and works out a distance from it. What can the hiker conclude about the exact location so far?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The hiker could be standing anywhere on a whole circle of possible spots that are all that same distance from the satellite, so the exact location is not known yet.', correct: true },
        { id: 'b', text: 'The hiker\'s exact location is already known, because one very clear signal is all a receiver needs to pin down a single spot.' },
        { id: 'c', text: 'The satellite already knows the hiker\'s exact spot on the ground and simply sends that location back down to the receiver in a second signal.' },
        { id: 'd', text: 'The hiker must be standing directly beneath that one satellite, since that would be the closest possible point to it.' },
      ],
      expectedAnswer:
        'The hiker could be standing anywhere on a whole circle of possible spots that are all that same distance from the satellite, so the exact location is not known yet.',
      hints: [
        'Think about every point that could be exactly that same distance from one single satellite -- is that one point, or many?',
        'One distance narrows the search to a whole circle of possible spots, not to one exact place. Narrowing a circle down to one spot takes more than one distance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-satellites-still-two-spots',
      kind: 'try_yourself',
      problem:
        'A boat\'s GPS receiver picks up signals from two satellites and works out its distance from each one. Drawing a circle of possible spots around each satellite, the two circles cross at two different points on the water. What does the receiver still need in order to choose the correct one of those two points?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing more -- whichever of the two points is closer to where the boat started out is always the correct one.' },
        { id: 'b', text: 'A stronger signal from one of the same two satellites, picked up a second time.' },
        { id: 'c', text: 'A distance from at least one more satellite, so that only one of the two points also matches that new distance.', correct: true },
        { id: 'd', text: 'A paper map of the water showing every buoy in the area, since a receiver cannot narrow anything down without one.' },
      ],
      expectedAnswer:
        'A distance from at least one more satellite, so that only one of the two points also matches that new distance.',
      hints: [
        'Two circles crossing gives two possible points, not one. Ask what a distance from a different, third satellite would do to those two points.',
        'Picking up the same satellite\'s signal again does not draw a new circle -- it only redraws the same one. A genuinely new distance has to come from a different satellite.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-satellite-does-not-know',
      kind: 'try_yourself',
      problem:
        'A student says a GPS satellite "watches" the ground and knows exactly where every receiver is standing at all times. Which statement corrects this student?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The student is correct, because that would be the only way a receiver could ever learn its own location.' },
        { id: 'b', text: 'The satellite tracks receivers by sending each one a request signal first and then waiting for a reply.' },
        { id: 'c', text: 'The satellite knows the location of every receiver that is turned on, but not the ones that are turned off.' },
        { id: 'd', text: 'The satellite has no way of knowing where any receiver is; it only sends out its signal, and the receiver does all of the figuring out itself.', correct: true },
      ],
      expectedAnswer:
        'The satellite has no way of knowing where any receiver is; it only sends out its signal, and the receiver does all of the figuring out itself.',
      hints: [
        'Ask which direction the signal actually travels -- from the satellite down, or from the receiver up.',
        'The satellite sends out the same signal whether or not any receiver is listening. It never gets anything back that could tell it who is out there.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-two-way-and-signal-strength',
      kind: 'misconception_check',
      question:
        'A student says: "A GPS receiver has to send a signal up to the satellites so they can find it, the way a walkie-talkie sends and listens. And picking up more satellites just makes the signal stronger, not more exact." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The receiver has to send a signal up to the satellites so they can find it.',
          misconception:
            'Thinking of a GPS receiver like a two-way radio or a walkie-talkie, which does both send and listen, and assuming any device that finds a location must work the same way.',
          correctsTo:
            'A basic GPS receiver only listens. The signal travels one way, from the satellite down to the receiver. The receiver does not need to send anything up to the satellites at all. WRONG: "the receiver sends a signal up to be found." CORRECT: "the receiver only listens for signals coming down."',
        },
        {
          answer: 'Picking up more satellites just makes the signal stronger, not more exact.',
          misconception:
            'Noticing that more satellites are involved and guessing that more must mean a better, stronger version of one signal, rather than realizing that each additional satellite provides a completely separate distance to combine.',
          correctsTo:
            'Each satellite\'s signal gives the receiver one more distance to combine with the others. More satellites are not a stronger version of one signal; they are separate distances, and combining several distances -- not signal strength -- is what narrows the possible location down to one exact spot.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GPS is a system of satellites that circle Earth, each one constantly sending out a signal.',
        'A GPS receiver only listens for signals; it does not send anything up to the satellites.',
        'A signal from one satellite lets a receiver work out its distance from that satellite, and nothing more.',
        'Knowing the distance to just one satellite narrows a location only to a circle of possible spots, not to one exact place.',
        'Combining distances from more than one satellite at the same time narrows the possible spots down, and a receiver keeps adding satellites until only one location fits every distance.',
        'The satellite does not know the receiver\'s location. It only sends its signal; the receiver does all of the figuring out.',
        'More satellites give a receiver more distances to combine, not a stronger version of one signal.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'How GPS Finds Your Location' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
