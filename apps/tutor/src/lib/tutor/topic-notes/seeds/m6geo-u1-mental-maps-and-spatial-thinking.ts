/**
 * Grade 6 World Geography — Unit 1 CED 1.2: Mental Maps & Spatial Thinking.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.mental-maps-and-spatial-thinking.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U1_MENTAL_MAPS_AND_SPATIAL_THINKING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.mental-maps-and-spatial-thinking.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Mental Maps & Spatial Thinking',
  planId: 'evelyn.ms.m6geo.mental-maps-and-spatial-thinking.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.mental-maps-and-spatial-thinking.v1' }],
  theory: [
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `WHAT A MENTAL MAP IS. A mental map is the picture of a familiar place that a person carries around after moving through that place many times. Nobody hands a person a mental map. A person builds one just by using a space regularly -- a home, a classroom, a route walked often.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `IT DOES NOT HAVE TO BE PRECISE TO BE USEFUL. A printed map is drawn to a fixed scale so that anyone can measure a true distance from it. A mental map does not work that way. Distances and shapes inside a mental map can be stretched or squeezed and even come out wrong, and the mental map can still do its job perfectly well.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `TWO PEOPLE WHO KNOW THE SAME SPACE CAN CARRY DIFFERENT MENTAL MAPS. A mental map is personal -- it is built from one person's own trips through a space, not copied from a shared document. Someone who always enters a building from the north door and someone who always enters from the south door can end up with two different mental maps of the very same building, and both can still work.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `WHAT A MENTAL MAP IS BUILT FROM. A mental map connects landmarks -- things that stand out enough to be recognized, such as a particular doorway, a tree, or a store -- by the routes a person actually travels between them. Naming the landmarks in the order they are passed, along with the turns between them, is what lets a mental map guide someone from one place to another.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `WHAT A MENTAL MAP IS FOR. A mental map lets a person choose a way to go, recognize a landmark as a sign that a turn or a destination is close, and get from one familiar place to another without checking a printed map or asking for directions.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', content: `IT ONLY COVERS SPACE A PERSON HAS ACTUALLY MOVED THROUGH. A mental map does not reach past the space a person has experienced. A person can have a detailed mental map of a route walked every day and no mental map at all of a place never visited.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', kind: 'definition', title: 'mental map', content: `the personal picture of a place a person carries in their head, built from actually moving through that place many times.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', kind: 'definition', title: 'landmark', content: `a feature in a familiar space that stands out enough to be easily recognized and used as a fixed point along a route.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', kind: 'definition', title: 'route', content: `the path a person actually travels between two familiar places, described by the landmarks passed and the turns made along the way.` },
    { loId: 'm6geo.mental-maps-and-spatial-thinking', kind: 'definition', title: 'familiar space', content: `a place a person has visited and moved through often enough to have built a mental map of it.` },
  ],
  methods: [
    {
      title: 'Worked describe the route aloud',
      steps: [
        `Start by naming the two ends of the route: the front door is the starting landmark and the kitchen is the ending landmark.`,
        `Walk through the space in order and name each landmark passed along the way, such as a coat closet, a staircase, or a hallway table -- only the ones actually on this route.`,
        `Between each pair of landmarks, name the route: which way to turn, or which direction to keep going, to reach the next landmark.`,
        `Put it together and say the whole description once, start to finish: out the front door, past the coat closet, turn right at the staircase, straight down the hallway past the table, into the kitchen.`,
        `CHECK: describe the very same walk backward, landmark by landmark, in reverse order, with the turns reversed: out of the kitchen, past the hallway table, turn left at the staircase, straight past the coat closet, to the front door.`,
        `If the reversed description still makes sense and lands back at the front door, the mental map holds together in both directions. A route description that only works one way is missing a landmark or a turn somewhere.`,
      ],
      example: { problem: `Describe, out loud, a mental map for the walk from the front door of a house to the kitchen, naming the landmarks along the way and the route between them. Then check the description by describing the same walk backward, from the kitchen to the front door.`, solution: `Out the front door, past the coat closet, turn right at the staircase, straight down the hallway past the table, into the kitchen -- and the same route said backward, landmark by landmark with the turns reversed, lands back at the front door.` },
      relatedLoIds: ['m6geo.mental-maps-and-spatial-thinking'],
    },
    {
      title: 'Worked scale does not decide it',
      steps: [
        `Start with what a mental map is actually for: helping the person find the way through a space he already knows, not giving an exact scaled distance to someone else.`,
        `Compare that job to a measured drawing's job. A measured, scaled drawing is built so that anyone can read a true distance from it. A mental map only has to put the landmarks in the right order and show the right turns between them.`,
        `Test the description itself rather than the distance: does it still name the same landmarks in the same order, with the same turns, from the classroom door to the pencil sharpener?`,
        `WRONG: "the mental map is useless because it is not the correct scale." CORRECT: "the mental map still works because it correctly shows the order of the landmarks and the turns between them; a mental map does not need to be measured accurately to help someone find the way."`,
        `CHECK: run the described route in your head from the classroom door to the pencil sharpener, confirming that each landmark and each turn still appears in the right order. The exact length never has to enter the check at all.`,
      ],
      example: { problem: `A student draws his mental map of the walk from the classroom door to the pencil sharpener. A classmate measures the real distance with a tape measure and says the drawing is stretched to twice the true length, so the mental map is useless. Is the classmate right?`, solution: `The classmate is not right. A mental map does not need to be drawn to scale to be useful. As long as it names the landmarks in the correct order and shows the correct turns between them, it still does its job, even if the distances inside it are stretched.` },
      relatedLoIds: ['m6geo.mental-maps-and-spatial-thinking'],
    },
  ],
  pointers: [
    { content: `Students often say "A mental map has to be exactly to scale to count as correct." — A printed map is drawn to a fixed scale so that a true distance can be measured from it. A mental map does not have to meet that standard. WRONG: "a mental map that is not to scale is not a real mental map." CORRECT: "a mental map still works if it puts the landmarks in the right order and shows the right turns between them, even if the distances inside it are stretched or squeezed."`, kind: 'common-error' },
    { content: `Students often say "If my friend's mental map of the same hallway is different from mine, one of us has to be wrong." — A mental map is personal. Two people who both know the same hallway well can build two different mental maps of it, based on which door each of them usually enters from or which landmarks stand out to them. Neither mental map has to be wrong -- each one can still correctly guide the person who built it from one end of the hallway to the other.`, kind: 'common-error' },
    { content: `A mental map is the personal picture of a familiar place that a person builds just by moving through it again and again.`, kind: 'tip' },
    { content: `A mental map does not have to be drawn to scale to work. It can have stretched or squeezed distances and still guide someone correctly.`, kind: 'tip' },
    { content: `A mental map connects landmarks -- things that stand out and are easy to recognize -- by the routes a person actually travels between them, named in order along with the turns.`, kind: 'tip' },
    { content: `Two people who both know the same space well can build two different mental maps of it, and neither one has to be wrong.`, kind: 'tip' },
    { content: `A mental map lets a person choose a way to go, recognize a landmark as a sign of what comes next, and get from one familiar place to another without a printed map.`, kind: 'tip' },
    { content: `A mental map only covers a space a person has actually moved through. It does not reach into a place a person has never visited.`, kind: 'tip' },
    { content: `A mental map is NOT a drawing you make once and memorize. It's the picture your brain builds gradually by moving through a space many times. You don't copy it from anywhere — you create it yourself.`, kind: 'vocab-note' },
    { content: `Don't check if a mental map is "correct" by measuring the distances. Check it by asking: Are the landmarks in the right order? Are the turns right? If yes, the mental map works—even if distances are stretched or squeezed.`, kind: 'common-error' },
    { content: `When you describe your mental map out loud, always name landmarks IN ORDER along the route, with the turns between them. Don't just list all the landmarks in a place.`, kind: 'gotcha' },
    { content: `Two people can walk the same hallway every day and end up with different mental maps—both correct. Their maps depend on which door they use, which landmarks catch their eye, and their own paths through the space.`, kind: 'edge-case' },
    { content: `Your mental map ends where your real experience ends. You can't have a detailed mental map of a place you've never actually walked through, no matter how well you studied a picture of it.`, kind: 'tip' },
    { content: `To test your mental map, describe the walk backward—landmark by landmark, turns reversed. If it still makes sense and lands back where you started, your mental map is solid.`, kind: 'tip' },
  ],
};
