/**
 * Grade 6 World Geography — Unit 4 CED 4.3: Major Water Feature Vocabulary.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.major-water-feature-vocabulary.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U4_MAJOR_WATER_FEATURE_VOCABULARY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.major-water-feature-vocabulary.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Major Water Feature Vocabulary',
  planId: 'evelyn.ms.m6geo.major-water-feature-vocabulary.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.major-water-feature-vocabulary.v1' }],
  theory: [
    { loId: 'm6geo.major-water-feature-vocabulary', content: `FIVE WATER WORDS, ONE QUESTION EACH TIME. River, lake, sea, gulf, and strait are five different water features, and each one is defined by exactly one thing: the relationship between the water and the land around it, and whether the water is moving or holding still. None of the five is defined by how big it is or by what a map happens to call it.` },
    { loId: 'm6geo.major-water-feature-vocabulary', content: `A RIVER IS WATER THAT MOVES THROUGH A CHANNEL CUT ACROSS THE LAND. It flows from higher ground toward lower ground, the way water always runs downhill, and it usually ends where it empties into another body of water, such as a lake, a sea, or an ocean. The moving-downhill relationship is what makes a river a river, not how wide or how long it is.` },
    { loId: 'm6geo.major-water-feature-vocabulary', content: `A LAKE IS WATER WITH LAND COMPLETELY AROUND IT, AND NO OPENING TO THE OCEAN. Land surrounds a lake on every side, so a lake has no edge that opens onto an ocean or a sea. A river can flow into a lake or out of it, but that river is a separate channel through the land -- the lake itself stays closed in. The water in a lake is usually fresh water, not salty.` },
    { loId: 'm6geo.major-water-feature-vocabulary', content: `A SEA AND A GULF ARE BOTH SALT WATER THAT LAND WRAPS AROUND ONLY PARTLY, KEEPING ONE OPENING TO THE OCEAN. Both are pockets: water goes in and comes back out through the very same opening, unlike a river, which runs straight through, or a lake, which has no opening at all. A SEA keeps a broad, open connection to the ocean, with land bordering only part of its edge. A GULF is more closed in: land curves around most of its edge, and the connection onward to the ocean or a sea is comparatively narrow.` },
    { loId: 'm6geo.major-water-feature-vocabulary', content: `A STRAIT IS A PASSAGE, NOT A POCKET. It is a narrow stretch of water with land on both sides, but instead of one opening you enter and leave through, a strait joins two larger bodies of water end to end. A ship can sail in from one larger body of water and sail all the way through, coming out into a different larger body of water on the far side. That through-passage relationship is what separates a strait from a sea or a gulf, which are both entered and exited from the same side.` },
    { loId: 'm6geo.major-water-feature-vocabulary', content: `THE LINE BETWEEN A SEA AND A GULF IS THE FUZZIEST ONE IN THIS LESSON, AND IT IS PARTLY A MATTER OF NAMING HISTORY. Many real bodies of water were named long before anyone wrote down a strict rule for telling a sea from a gulf, so a real body of water called a sea sometimes fits this lesson's definition of a gulf better, and one called a gulf sometimes fits the definition of a sea better. This lesson teaches the property that is supposed to separate them -- how much of the edge is land, and how narrow the remaining opening is -- but it does not promise that every real name lines up with that property perfectly.` },
    { loId: 'm6geo.major-water-feature-vocabulary', kind: 'definition', title: 'river', content: `water that flows through a channel across the land, moving from higher ground toward lower ground.` },
    { loId: 'm6geo.major-water-feature-vocabulary', kind: 'definition', title: 'lake', content: `water with land completely around it on every side, with no opening onto an ocean or a sea.` },
    { loId: 'm6geo.major-water-feature-vocabulary', kind: 'definition', title: 'sea', content: `salt water that land borders along part of its edge, while the rest stays broadly open to a larger ocean it connects with.` },
    { loId: 'm6geo.major-water-feature-vocabulary', kind: 'definition', title: 'gulf', content: `salt water that land curves around on most of its edge, connecting onward to a sea or ocean through a comparatively narrow opening.` },
    { loId: 'm6geo.major-water-feature-vocabulary', kind: 'definition', title: 'strait', content: `a narrow passage of water with land on both sides, joining two larger bodies of water end to end.` },
  ],
  methods: [
    {
      title: 'Worked run the routine',
      steps: [
        `Ask question 1 first, every time: does the water flow in a channel across the land, moving from higher ground toward lower ground? The description says exactly this -- it flows from a hillside down to lower ground. Question 1 is answered yes.`,
        `Stop as soon as question 1 is answered yes. The routine assigns river the moment this is true, because moving-downhill-through-a-channel is a river's one defining relationship. Questions 2 and 3, about enclosure and about passage-versus-pocket, only matter for water that does not move this way, so there is no need to ask them here.`,
        `Check the answer by rereading the description backward: it says the water ends lower than it starts, so the high-to-low direction is stated consistently and does not contradict itself.`,
        `Check the shape of the answer too. A river is defined by moving water in a channel, not by being enclosed on every side or by staying salty or fresh. Enclosure and salt water only become the deciding questions once question 1 has already answered no.`,
        `Test a contrasting case so the idea is not overlearned. If the description instead said "water rests inside a bowl-shaped stretch of land, with no place along its edge that opens onto an ocean or a sea," question 1 would answer no, since nothing there is flowing across land from high to low ground, and the routine would move on to question 2, landing on lake instead.`,
      ],
      example: { problem: `A description for a class project reads: "Water moves in a channel across the land, flowing from a hillside down to lower ground, and it empties into a larger body of water at the end of its path." Run the three-question routine. Which water feature is this, and why?`, solution: `This is a river: water moving in a channel across the land from higher ground to lower ground, ending where it empties into another body of water. Question 1 of the routine settles it immediately, since the flowing-downhill relationship is a river's defining property.` },
      relatedLoIds: ['m6geo.major-water-feature-vocabulary'],
    },
    {
      title: 'Worked hallway vs pocket',
      steps: [
        `Take Water Feature One first. WRONG: "This must be a strait, since the opening is narrow." The mistake is judging the feature only by how narrow its opening is, rather than by what that opening actually connects to.`,
        `Run question 3's real test on Water Feature One: could a ship enter from one larger body of water and sail all the way through, coming out into a DIFFERENT larger body of water on the far side? No -- Water Feature One is entered and exited through the very same narrow opening. A strait is a hallway you pass through and come out somewhere else. This is a pocket you go into and come back out of the same way. CORRECT: Water Feature One is a gulf, since land curves around it on three sides and it connects to the ocean through one narrower opening.`,
        `Now take Water Feature Two. WRONG: "This must be a gulf, since it is mostly surrounded by land." The mistake is stopping at "surrounded by land" without checking whether any opening onto the ocean or a sea is left at all.`,
        `Run the enclosure test on Water Feature Two: does any part of its edge open onto an ocean or a sea? The description says no part of it does -- land surrounds it completely, with no opening anywhere. A gulf always keeps exactly one such opening; it never closes off completely. CORRECT: Water Feature Two is a lake, since it is fully enclosed by land with no opening onto the ocean or a sea at all.`,
        `Check the shape of both corrections together. A gulf is a pocket with one remaining opening to the ocean or a sea. A lake is a pocket with no opening at all. A strait is not a pocket in the first place -- it is a passage all the way through. Three different relationships between the water and the land around it, and each has its own test.`,
        `Test a contrasting case: if Water Feature One's single opening instead connected all the way through to a second, different large body of open water on its far side, the answer would change to strait, since it would then be a through-passage rather than a pocket.`,
      ],
      example: { problem: `A student writes two descriptions. Water Feature One: "Salt water reaches in from the ocean, with land curving around it on three sides and only a narrower stretch of open water at one end connecting it back to the ocean beyond. This must be a strait, since the opening is narrow." Water Feature Two: "A body of water sits inside a stretch of land, with no part of its edge opening onto an ocean or a sea. Land surrounds it on every side. This must be a gulf, since it is mostly surrounded by land." Both are wrong. Correct each one.`, solution: `Water Feature One is a gulf, not a strait: it is entered and exited through the same opening rather than passing through to a different body of water on the far side. Water Feature Two is a lake, not a gulf: it has no opening onto an ocean or a sea at all, while a gulf always keeps one.` },
      relatedLoIds: ['m6geo.major-water-feature-vocabulary'],
    },
  ],
  pointers: [
    { content: `Students often say "A strait is just a small gulf, since both are narrow." — Width is not the test. WRONG: "a strait is just a small gulf." CORRECT: a gulf is a pocket -- a ship enters and leaves through the very same opening, because land curves around the rest of its edge. A strait is a passage -- a ship enters from one larger body of water and comes out into a different larger body of water on the far side. A strait and a gulf can be exactly the same width and still be two completely different water features, because the difference is what lies at the far end, not how narrow the water is.`, kind: 'common-error' },
    { content: `Students often say "A body of water called a gulf must always be more closed in by land than a body of water called a sea, because a strict rule decides which word real places get." — Many real bodies of water were named long before anyone wrote down a strict rule for telling a sea from a gulf. WRONG: "the sea or gulf name always matches how enclosed the water actually is." CORRECT: this lesson's definitions describe the property that is supposed to separate a sea from a gulf, but a real name does not always follow it -- some water called a sea is more closed in by land than some water called a gulf, and the other way around. Knowing the property is still worth learning: it is exactly how you would classify a water feature that has no name attached to it at all.`, kind: 'common-error' },
    { content: `Five water words, one question each time: what is the relationship between the water and the land around it, and does the water move or hold still?`, kind: 'tip' },
    { content: `A river is water that flows through a channel across the land, from higher ground toward lower ground, usually ending where it empties into another body of water.`, kind: 'tip' },
    { content: `A lake is water with land completely around it on every side, with no opening onto an ocean or a sea. The water in a lake is usually fresh, not salty.`, kind: 'tip' },
    { content: `A sea and a gulf are both salt water pockets, entered and left through one opening. A sea keeps a broad, open connection to the ocean. A gulf is more closed in, with land curving around most of its edge and a comparatively narrow opening left.`, kind: 'tip' },
    { content: `A strait is a passage, not a pocket: a narrow stretch of water with land on both sides that joins two larger bodies of water end to end, so a ship enters from one side and comes out into a different larger body of water on the other.`, kind: 'tip' },
    { content: `The line between a sea and a gulf is partly a matter of naming history. This lesson teaches the property the words are supposed to track, but a real name does not always match it perfectly.`, kind: 'tip' },
  ],
};
