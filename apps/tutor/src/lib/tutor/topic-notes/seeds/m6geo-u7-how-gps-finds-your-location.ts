/**
 * Grade 6 World Geography — Unit 7 CED 7.2: How GPS Finds Your Location.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.how-gps-finds-your-location.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U7_HOW_GPS_FINDS_YOUR_LOCATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.how-gps-finds-your-location.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'How GPS Finds Your Location',
  planId: 'evelyn.ms.m6geo.how-gps-finds-your-location.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.how-gps-finds-your-location.v1' }],
  theory: [
    { loId: 'm6geo.how-gps-finds-your-location', content: `GPS IS A SYSTEM OF SATELLITES THAT CONSTANTLY SEND OUT SIGNALS. GPS stands for GLOBAL POSITIONING SYSTEM. It is a system of satellites that circle Earth in the sky, and each satellite constantly sends out a signal -- information traveling as a radio wave -- that a special device called a GPS RECEIVER can pick up.` },
    { loId: 'm6geo.how-gps-finds-your-location', content: `A RECEIVER ONLY LISTENS; IT DOES NOT SEND ANYTHING UP. A GPS receiver, whether it is built into a phone, a car, or a handheld device, does not transmit anything up to the satellites. It only listens for the signals the satellites are already sending out to anyone in range.` },
    { loId: 'm6geo.how-gps-finds-your-location', content: `A RECEIVER USES A SATELLITE'S SIGNAL TO WORK OUT ITS DISTANCE FROM THAT SATELLITE. Each signal a receiver picks up lets the receiver figure out how far away it is from that one satellite. This is the one job a satellite signal does for a receiver: it gives the receiver a distance to that satellite, nothing more.` },
    { loId: 'm6geo.how-gps-finds-your-location', content: `ONE DISTANCE ALONE IS NOT ENOUGH TO PIN DOWN AN EXACT LOCATION. If a receiver knows only that it is a certain distance from a single satellite, that distance is true at many different possible spots -- everywhere that is exactly that far from the satellite -- not just at one place.` },
    { loId: 'm6geo.how-gps-finds-your-location', content: `COMBINING DISTANCES FROM MORE THAN ONE SATELLITE NARROWS THE LOCATION DOWN TO ONE SPOT. A receiver keeps listening until it has picked up signals from several satellites at the same time and worked out its distance from each one. Combining several distances together -- not any single one alone -- is what narrows the many possible spots down to just one.` },
    { loId: 'm6geo.how-gps-finds-your-location', content: `THE SATELLITE NEVER LEARNS THE RECEIVER'S LOCATION. Each satellite sends out the same signal to anyone listening, whether or not a receiver ever picks it up. The satellite has no way of knowing whether a receiver exists nearby or where it is. All of the figuring out happens inside the receiver itself.` },
    { loId: 'm6geo.how-gps-finds-your-location', kind: 'definition', title: 'GPS', content: `short for Global Positioning System, a system of satellites circling Earth that constantly send out signals a receiver can use to find a location.` },
    { loId: 'm6geo.how-gps-finds-your-location', kind: 'definition', title: 'satellite', content: `an object that circles Earth in the sky, following the same path again and again.` },
    { loId: 'm6geo.how-gps-finds-your-location', kind: 'definition', title: 'receiver', content: `a device that listens for and picks up a signal, such as the signals sent by GPS satellites.` },
    { loId: 'm6geo.how-gps-finds-your-location', kind: 'definition', title: 'signal', content: 'information sent out as a radio wave that a receiver can pick up.' },
    { loId: 'm6geo.how-gps-finds-your-location', kind: 'definition', title: 'distance', content: `how far apart two things are; a GPS receiver combines its distance from several satellites at once to find a location.` },
  ],
  methods: [
    {
      title: 'Worked three flags on the field',
      steps: [
        `Start with just the red flag distance. Every point on the field that sits exactly that distance from the red flag forms a full circle drawn around the red flag. That one distance narrows the player's spot from "anywhere on the whole field" down to "somewhere on this one circle" -- but a circle still has many possible points on it, not one.`,
        `Add the blue flag's distance. Draw a second circle, this time around the blue flag, using the player's distance from it. Two different circles usually cross each other at exactly two points. The player must be standing at one of those two crossing points, so the search is narrowed from a whole circle down to just two spots.`,
        `Add the yellow flag's distance. Draw a third circle around the yellow flag using the player's distance from it. Of the two crossing points found in the last step, only one of them will also sit exactly on this third circle. That single matching point is the player's exact spot on the field.`,
        `Check the answer by working backward. Take that one matching point and measure its distance to all three flags. If it comes out exactly right for the red flag, the blue flag, and the yellow flag, all three distances agree, which confirms the spot.`,
        `Now test a contrasting case. Suppose the player had given the coach only the red flag's distance and the blue flag's distance, and stopped there. The coach would still be stuck choosing between two possible points, because two circles alone leave two crossing points, not one -- it takes a third circle to break the tie.`,
        `This is the idea real GPS uses. A receiver in the real world is not standing on a flat field with three flags; it is combining distances from satellites spread through the sky. But the reasoning is the same one this field just showed: one distance is not enough, and a receiver keeps combining distances from several satellites at once until only one location fits every one of them.`,
      ],
      example: { problem: `On a wide, flat practice field, three flags stand at fixed spots: a red flag, a blue flag, and a yellow flag. A player is told: "You are standing exactly a certain distance from the red flag." Can the coach point to the player's exact spot on the field yet? What happens once the player is also given the distance from the blue flag, and then from the yellow flag?`, solution: `A single distance from the red flag alone narrows the player's spot to a whole circle of possible points. Adding the blue flag's distance narrows that circle down to two possible points. Adding the yellow flag's distance narrows those two points down to one exact spot, because only one of them also matches the third distance. A GPS receiver finds a location the same way, by combining distances from several satellites at once.` },
      relatedLoIds: ['m6geo.how-gps-finds-your-location'],
    },
    {
      title: 'Worked two wrong claims',
      steps: [
        `Take the two claims apart first, since each is a separate mistake. Claim one is about how many satellites a receiver needs. Claim two is about which device actually knows the receiver's location.`,
        `Test claim one. WRONG: "the receiver only needs to pick up one satellite signal." One distance, no matter how strong or clear the signal is, narrows the receiver's location only to a wide circle of possible spots, not to one exact place. CORRECT: the receiver combines distances from several satellites at the same time, and it takes more than one distance to narrow the search down to a single spot.`,
        `Notice that signal strength and signal count are two different things. A single very strong, very clear signal from one satellite still leaves every point on that same circle as a possible answer. Strength does not add a second or third distance to combine -- only picking up another satellite's signal does that.`,
        `Test claim two. WRONG: "the satellite already knows exactly where the receiver is standing." Each satellite sends out the same signal to anyone in range, whether or not a receiver ever exists to pick it up. The satellite has no way of knowing whether a receiver is listening or where that receiver is.`,
        `CORRECT: it is the receiver on the ground that does the figuring out, using the distances it works out from the signals it picks up. The satellite's only job is to keep sending its signal; every bit of the location-finding work happens inside the receiver.`,
      ],
      example: { problem: `A student writes: "A GPS receiver only needs to pick up one very strong satellite signal, and that satellite already knows exactly where the receiver is standing, so it sends the location straight down." Both sentences are wrong. Correct each one.`, solution: `First error: one satellite's signal is not enough, no matter how strong it is, because a single distance narrows the location only to a circle of possible spots. A receiver needs distances from several satellites at once to narrow the search down to one spot. Second error: the satellite does not know the receiver's location. It only sends out a signal; the receiver is the device that works out its own location using that signal.` },
      relatedLoIds: ['m6geo.how-gps-finds-your-location'],
    },
  ],
  pointers: [
    { content: `Students often say "The receiver has to send a signal up to the satellites so they can find it." — A basic GPS receiver only listens. The signal travels one way, from the satellite down to the receiver. The receiver does not need to send anything up to the satellites at all. WRONG: "the receiver sends a signal up to be found." CORRECT: "the receiver only listens for signals coming down."`, kind: 'common-error' },
    { content: `Students often say "Picking up more satellites just makes the signal stronger, not more exact." — Each satellite's signal gives the receiver one more distance to combine with the others. More satellites are not a stronger version of one signal; they are separate distances, and combining several distances -- not signal strength -- is what narrows the possible location down to one exact spot.`, kind: 'common-error' },
    { content: `GPS is a system of satellites that circle Earth, each one constantly sending out a signal.`, kind: 'tip' },
    { content: `A GPS receiver only listens for signals; it does not send anything up to the satellites.`, kind: 'tip' },
    { content: `A signal from one satellite lets a receiver work out its distance from that satellite, and nothing more.`, kind: 'tip' },
    { content: `Knowing the distance to just one satellite narrows a location only to a circle of possible spots, not to one exact place.`, kind: 'tip' },
    { content: `Combining distances from more than one satellite at the same time narrows the possible spots down, and a receiver keeps adding satellites until only one location fits every distance.`, kind: 'tip' },
    { content: `The satellite does not know the receiver's location. It only sends its signal; the receiver does all of the figuring out.`, kind: 'tip' },
    { content: `More satellites give a receiver more distances to combine, not a stronger version of one signal.`, kind: 'tip' },
    { content: `A GPS receiver only **listens**—it never sends anything up to satellites. Don't confuse it with a walkie-talkie, which sends and receives both ways.`, kind: 'common-error' },
    { content: `One satellite signal = one distance = a whole circle of possible spots, not one exact location. You need **at least 3 satellites** to find one exact spot.`, kind: 'gotcha' },
    { content: `Signal **strength** and signal **count** are different. A very strong signal from one satellite still leaves you on a circle. You need signals from *more satellites*, not stronger ones.`, kind: 'vocab-note' },
    { content: `The **satellite never knows** where the receiver is. The satellite just broadcasts the same signal to everyone. The **receiver** does all the figuring out.`, kind: 'common-error' },
    { content: `Two circles cross at two points. To pick the right one, you need a **third distance** from a third satellite—two distances alone leave you stuck between two spots.`, kind: 'edge-case' },
    { content: `The receiver **combines distances at the same time**—not one after another. It listens to multiple satellites and uses all their distances together to find one spot.`, kind: 'vocab-note' },
  ],
};
