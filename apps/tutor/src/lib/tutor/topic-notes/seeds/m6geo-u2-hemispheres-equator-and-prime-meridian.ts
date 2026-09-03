/**
 * Grade 6 World Geography — Unit 2 CED 2.4: Hemispheres, the Equator & the Prime Meridian.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.hemispheres-equator-and-prime-meridian.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U2_HEMISPHERES_EQUATOR_AND_PRIME_MERIDIAN: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.hemispheres-equator-and-prime-meridian.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Hemispheres, the Equator & the Prime Meridian',
  planId: 'evelyn.ms.m6geo.hemispheres-equator-and-prime-meridian.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.hemispheres-equator-and-prime-meridian.v1' }],
  theory: [
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `A HEMISPHERE IS HALF OF EARTH. The word comes apart neatly: hemi means half, and sphere means ball. So a hemisphere is half of the ball. There are four named halves, and they come in two pairs -- a north-south pair and an east-west pair.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `THE EQUATOR MAKES THE NORTH-SOUTH PAIR. The Equator is a line that runs east and west all the way around the widest part of Earth, halfway between the North Pole and the South Pole. Everything north of it is in the NORTHERN HEMISPHERE. Everything south of it is in the SOUTHERN HEMISPHERE.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `THE PRIME MERIDIAN MAKES THE EAST-WEST PAIR. The Prime Meridian is a line that runs from the North Pole to the South Pole, passing through Greenwich, a part of London in England. Going one way from it puts you in the EASTERN HEMISPHERE, and going the other way puts you in the WESTERN HEMISPHERE. The two halves are completed by the line directly opposite the Prime Meridian, on the far side of the globe.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `BOTH LINES ARE AGREED ON, NOT PAINTED ON. Neither line is a stripe you could see from a plane or stand on and photograph. They are imaginary lines that people agreed to draw on maps and globes so that everybody means the same halves. The Equator sits where it does because of the shape of Earth and where the poles are. The Prime Meridian sits where it does because people chose that spot.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `THE TWO QUESTIONS, ALWAYS IN THIS ORDER. Question 1: is the place north or south of the Equator? That gives you Northern or Southern. Question 2: is the place east or west of the Prime Meridian? That gives you Eastern or Western. Say the north-south answer first and the east-west answer second. Almost every place on Earth is in two hemispheres, one from each pair -- never just one. The one exception is a place sitting exactly on one of the two lines, which is on the boundary rather than inside either half of that pair.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', content: `A BIG AREA CAN SPREAD ACROSS A LINE AND SIT IN MORE THAN TWO. One point is in exactly two hemispheres, but a whole continent is not a point. Both lines cross Africa: the Equator runs across the middle of it and the Prime Meridian runs down through its western part, so Africa has land in all four hemispheres. Compare that with Antarctica, which lies entirely south of the Equator, so all of it is in the Southern Hemisphere.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', kind: 'definition', title: 'hemisphere', content: 'half of Earth, made by cutting the globe along an agreed line.' },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', kind: 'definition', title: 'Equator', content: `the imaginary line running around the middle of Earth, halfway between the two poles, that separates the Northern Hemisphere from the Southern Hemisphere.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', kind: 'definition', title: 'Prime Meridian', content: `the imaginary line running from pole to pole through Greenwich, in London, England, that separates the Eastern Hemisphere from the Western Hemisphere.` },
    { loId: 'm6geo.hemispheres-equator-and-prime-meridian', kind: 'definition', title: 'pole', content: `one of the two points at the very top and the very bottom of Earth, called the North Pole and the South Pole.` },
  ],
  methods: [
    {
      title: 'Worked run the two questions',
      steps: [
        `Run question 1 first, every time: is the ship north or south of the Equator? The log says the ship crossed the Equator while sailing north. Crossing a line while heading north puts you on the north side of it, so the ship is now north of the Equator. That means the Northern Hemisphere.`,
        `Now run question 2: is the ship east or west of the Prime Meridian? The log says the ship crossed the Prime Meridian while sailing west. Crossing a line while heading west puts you on the west side of it, so the ship is now west of the Prime Meridian. That means the Western Hemisphere.`,
        `Say the answer in the fixed order, north-south first: the ship is in the Northern Hemisphere and the Western Hemisphere.`,
        `Check the answer by rewinding the log. Before Tuesday morning the ship had not crossed the Equator yet, so it was south of it and therefore in the Southern Hemisphere then. Crossing a line is exactly what changes which half you are in, and that is the only thing that changes it.`,
        `Check the shape of the answer too. There are two hemispheres named, and they come from different pairs -- one from the north-south pair and one from the east-west pair. An answer with two from the same pair, such as Northern and Southern, would be impossible.`,
      ],
      example: { problem: `A ship keeps a log. It reads: "Tuesday morning, sailing north, we crossed the Equator. Friday afternoon, sailing west, we crossed the Prime Meridian." There is no map here -- work only from the words. Which two hemispheres is the ship in on Saturday?`, solution: `The Northern Hemisphere and the Western Hemisphere. The ship crossed the Equator heading north, which put it north of that line, and crossed the Prime Meridian heading west, which put it west of that line.` },
      relatedLoIds: ['m6geo.hemispheres-equator-and-prime-meridian'],
    },
    {
      title: 'Worked two not one',
      steps: [
        `Take the Australia claim first. WRONG: "Australia is in the Southern Hemisphere, so it is not in any other hemisphere." The mistake is stopping after question 1 and never running question 2.`,
        `Run both questions on Australia. Question 1: Australia lies entirely south of the Equator, so it is in the Southern Hemisphere. Question 2: Australia lies east of the Prime Meridian, so it is in the Eastern Hemisphere. CORRECT: Australia is in the Southern Hemisphere and the Eastern Hemisphere.`,
        `State the rule the student was missing. A place is in two hemispheres, one from each pair. An answer that names only one half is an unfinished answer, because it has answered only one of the two questions.`,
        `Now take the Africa claim. The student is right that a single point away from the two lines sits in exactly two hemispheres. The mistake is treating a whole continent as if it were a point.`,
        `Check whether either line crosses Africa. The Equator runs across the middle of Africa, so Africa has land north of it and land south of it. The Prime Meridian runs down through the western part of Africa, so Africa has land east of it and land west of it. CORRECT: Africa has land in all four hemispheres.`,
        `Finish with a contrasting case so the idea is not overlearned. Antarctica lies entirely south of the Equator, with no part of it north of that line, so every bit of Antarctica is in the Southern Hemisphere. Check each line on its own, and only for the pair it decides: the Equator is the line that decides Northern or Southern, and no part of Antarctica lies north of it.`,
      ],
      example: { problem: `A student writes: "Australia is in the Southern Hemisphere, so it is not in any other hemisphere. And Africa must be in exactly two hemispheres, because everywhere is." Both sentences have something wrong with them. Correct each one.`, solution: `Australia is in the Southern Hemisphere AND the Eastern Hemisphere, because a place sits in two hemispheres, one from each pair. Africa is not limited to two: both the Equator and the Prime Meridian cross it, so Africa has land in all four hemispheres.` },
      relatedLoIds: ['m6geo.hemispheres-equator-and-prime-meridian'],
    },
  ],
  pointers: [
    { content: `Students often say "The Prime Meridian separates the Northern Hemisphere from the Southern Hemisphere." — The direction a line RUNS is not the direction it SEPARATES. The Prime Meridian runs from pole to pole, and because it runs that way it has an east side and a west side, so it separates the Eastern Hemisphere from the Western Hemisphere. The Equator runs east and west around the middle of Earth, so it has a north side and a south side, and it is the line that separates the Northern Hemisphere from the Southern Hemisphere. WRONG: "the Prime Meridian separates north from south." CORRECT: "the Equator separates north from south, and the Prime Meridian separates east from west."`, kind: 'common-error' },
    { content: `Students often say "Once you know a place is in the Southern Hemisphere, that is the hemisphere it is in." — The four hemispheres are two separate pairs, not four boxes. A place away from the two lines has to be either north or south of the Equator, and it also has to be either east or west of the Prime Meridian. So it sits in two hemispheres at once, one from each pair. Knowing that a place is in the Southern Hemisphere answers question 1 and leaves question 2 untouched. Australia is in the Southern Hemisphere and the Eastern Hemisphere. Naming only one half is an unfinished answer.`, kind: 'common-error' },
    { content: `A hemisphere is half of Earth. There are four, and they come in two pairs: north-south and east-west.`, kind: 'tip' },
    { content: `The Equator runs east and west around the middle of Earth, halfway between the poles, and it separates the Northern Hemisphere from the Southern Hemisphere.`, kind: 'tip' },
    { content: `The Prime Meridian runs from pole to pole through Greenwich, in London, England, and it separates the Eastern Hemisphere from the Western Hemisphere.`, kind: 'tip' },
    { content: `The routine is two questions, always in this order: north or south of the Equator, then east or west of the Prime Meridian. Name the north-south answer first.`, kind: 'tip' },
    { content: `Almost every place on Earth is in two hemispheres, one from each pair; only a place sitting exactly on one of the lines is not. Naming only one is an unfinished answer.`, kind: 'tip' },
    { content: `A large area can spread across a line. Both lines cross Africa, so Africa has land in all four hemispheres, while Antarctica lies entirely in the Southern Hemisphere.`, kind: 'tip' },
    { content: `Both lines are agreed on rather than painted on. Nobody can see them from a plane.`, kind: 'tip' },
    { content: `Don't confuse which direction a line RUNS with which direction it SEPARATES. The Prime Meridian runs north-south (pole to pole), but it separates EAST from WEST. The Equator runs east-west, but it separates NORTH from SOUTH.`, kind: 'common-error' },
    { content: `Always answer TWO questions in THIS order: (1) North or south of Equator? (2) East or west of Prime Meridian? If you name only one hemisphere, your answer is incomplete. Every place (except points exactly on a line) sits in two hemispheres, one from each pair.`, kind: 'tip' },
    { content: `A continent or country is NOT a point. If BOTH the Equator and Prime Meridian cross Africa, Africa has land in all FOUR hemispheres — not just two. Check each line separately and count all combinations.`, kind: 'edge-case' },
    { content: `An answer like 'Northern AND Southern' is impossible — those come from the same pair. A correct answer always has one from the north-south pair AND one from the east-west pair, like 'Northern AND Western.'`, kind: 'gotcha' },
    { content: `The Equator and Prime Meridian are IMAGINARY — not painted on Earth, not visible from a plane. They exist only on maps and globes because people agreed to draw them there. The Equator's location is fixed by the poles; the Prime Meridian's location was chosen by agreement.`, kind: 'vocab-note' },
    { content: `Crossing a line while heading in one direction puts you on the far side of that line. If you cross the Equator heading north, you end up north of it. If you cross the Prime Meridian heading west, you end up west of it.`, kind: 'tip' },
    { content: `A place sitting EXACTLY on a line (e.g., on the Equator or Prime Meridian) is ON the boundary, not inside a hemisphere. In practice, almost every place is in two hemispheres — the exception proves the rule.`, kind: 'edge-case' },
  ],
};
