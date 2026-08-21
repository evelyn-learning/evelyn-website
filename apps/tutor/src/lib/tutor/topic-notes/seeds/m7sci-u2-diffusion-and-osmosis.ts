/**
 * Grade 7 Science — Unit 2 CED 2.4: Moving Materials: Diffusion & Osmosis.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.diffusion-and-osmosis.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U2_DIFFUSION_AND_OSMOSIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.diffusion-and-osmosis.v1',
  course: 'Grade 7 Science',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Moving Materials: Diffusion & Osmosis',
  planId: 'evelyn.ms.m7sci.diffusion-and-osmosis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.diffusion-and-osmosis.v1' }],
  theory: [
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'The membrane is the gatekeeper, and it is picky', content: `THE MEMBRANE IS THE GATEKEEPER, AND IT IS PICKY — last lesson the cell membrane was the boundary that controls what gets in and out. The proper name for that pickiness is SELECTIVELY PERMEABLE: some things cross the membrane easily, some cross slowly, and some do not cross at all. Water and small particles like oxygen cross easily. Big particles and many dissolved salts do not. The whole lesson rests on that split, because what CANNOT cross decides what happens to what CAN.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'Diffusion is spreading out', content: `DIFFUSION IS SPREADING OUT — every particle is always moving, jiggling in random directions. If a substance starts out crowded in one spot, that random jiggling carries more particles away from the crowded spot than back into it, simply because there are more of them there to begin with. The result is DIFFUSION: the substance spreads from where it is more crowded to where it is less crowded, until it is evenly spread. That is the popcorn smell reaching your room, and it is how oxygen gets into a cell.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'Nothing is deciding anything', content: `NOTHING IS DECIDING ANYTHING — this is the sentence to get right. WRONG: "The particles want to spread out." WRONG: "The particles know that the other side is emptier." CORRECT: "The particles move randomly, and spreading out is the result." A particle has no goal and no information. Saying it wants to spread is like saying a rolling marble wants to go downhill. Use the comparison if it helps you picture it, then drop it, because nothing in a cell wants, knows or tries.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'Osmosis is diffusion of water', content: `OSMOSIS IS DIFFUSION OF WATER — when the word applies to WATER moving across a membrane, we call it OSMOSIS. Osmosis is not a different force; it is the same spreading, tracked for water only. The direction rule for a twelve-year-old is exactly this: WATER MOVES FROM WHERE THERE IS MORE WATER TOWARD WHERE THERE IS LESS WATER. Salty water counts as having LESS water, because some of what is in the cup is salt rather than water. So a cell sitting in salty water loses water and shrinks, and the same cell sitting in pure water gains water and swells. That is the limp celery and the fat raisin.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'Both are passive, which means free', content: `BOTH ARE PASSIVE, WHICH MEANS FREE — diffusion and osmosis are PASSIVE. The cell spends no energy on either one. The movement happens because particles were already moving; the cell does not have to push. WRONG: "The cell uses energy to let oxygen diffuse in." CORRECT: "Oxygen diffuses in on its own, and the cell spends nothing." The contrast is ACTIVE TRANSPORT, where a cell moves something the OTHER way, from less crowded toward more crowded. That never happens on its own, so the cell has to pay energy for it. You do not need to know how the cell does that yet. You only need the test: moving WITH the spreading is free, and moving AGAINST the spreading costs energy.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'framework', title: 'Evenly spread does not mean stopped', content: `EVENLY SPREAD DOES NOT MEAN STOPPED — once the food coloring looks the same everywhere, it is tempting to say the particles have finished and parked. They have not. They keep jiggling forever. What changed is the bookkeeping: about as many particles now wander each way across any line you draw, so the amounts balance and the color stays even. Motion never stops; only the lopsidedness does.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'definition', title: 'selectively permeable', content: 'describes a membrane that lets some substances cross while blocking others.' },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'definition', title: 'diffusion', content: `the spreading of particles from where they are more crowded to where they are less crowded, caused by their random motion.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'definition', title: 'osmosis', content: `the diffusion of water across a membrane, from where there is more water toward where there is less water.` },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'definition', title: 'passive', content: 'describes movement that costs the cell no energy, because it happens on its own.' },
    { loId: 'm7sci.diffusion-and-osmosis', kind: 'definition', title: 'active transport', content: `movement of a substance the opposite way, toward where it is already more crowded, which does cost the cell energy.` },
  ],
  methods: [
    {
      title: 'Worked food coloring',
      steps: [
        `Start with where things are crowded. At the very start, all of the coloring particles are packed into one small blue blob at the bottom, and the rest of the glass has none.`,
        `Remember what the particles are doing. They are jiggling in random directions, all the time. So are the water particles around them.`,
        `Now count. A particle at the edge of the blob is just as likely to jiggle outward as inward. But there are many particles inside the blob and almost none outside it, so far more of them wander OUT of the blob than wander back in.`,
        `That imbalance is the whole explanation. The blue spreads, the blob fades, and after a few hours the color looks the same everywhere in the glass. This spreading is diffusion.`,
        `WRONG way to say it: "The coloring wants to spread out evenly." CORRECT way: "The coloring particles move randomly, and because they started crowded in one place, the random movement spreads them out." Nothing in the glass has a goal.`,
        `Now the energy question. Nobody stirred, nobody heated, nothing pushed. The particles were already moving before the drop went in. So the answer is that no energy had to be spent to make this happen -- diffusion is passive.`,
        `One last check. Once the glass is evenly blue, the particles have NOT stopped. They keep jiggling, and roughly as many cross any imaginary line each way, so the color simply stays even.`,
      ],
      example: { problem: `A student places one drop of blue food coloring at the bottom of a tall glass of still water. Nobody stirs it and nobody heats it. Describe what happens over the next few hours, explain why it happens, and say whether anything had to spend energy to make it happen.`, solution: `The blue spreads through the whole glass until the color is even. It happens because the coloring particles move randomly and started out crowded in one spot, so more of them wander out of the blob than back into it. No energy had to be spent, because diffusion is passive, and the particles keep moving even after the color looks even.` },
      relatedLoIds: ['m7sci.diffusion-and-osmosis'],
    },
    {
      title: 'Worked raisin and celery',
      steps: [
        `Say what the rule is before touching either cup. Water moves across a membrane from where there is MORE water toward where there is LESS water. That movement of water is called osmosis.`,
        `Cup 1, the raisin. A raisin is a grape that has been dried, so its cells hold very little water. The plain water in the cup is almost all water. So there is more water outside the raisin than inside it.`,
        `Apply the rule to cup 1. Water moves from outside the raisin into its cells. The raisin swells up overnight and looks plump and grape-like in the morning.`,
        `Cup 2, the celery. Now compare the same way. Inside the celery cells is mostly water. In the cup, a lot of the space is taken up by dissolved salt, so the cup counts as having LESS water than the celery cells do.`,
        `Apply the rule to cup 2. Water moves from inside the celery cells out into the salty cup. The cells lose water, so the celery goes limp and floppy instead of snapping when you bend it.`,
        `Notice that the rule never changed. Only which side had more water changed, and that flipped the direction. This is also why a limp piece of lettuce goes crisp again in a bowl of cold plain water -- water moves back in.`,
        `WRONG way to say cup 2: "The salt moved into the celery and pushed the water out." Osmosis moves WATER, and the salt is not doing anything on purpose. CORRECT way: "Water moved out of the celery cells toward the side that had less water."`,
      ],
      example: { problem: `Two cups sit on a counter. Cup 1 holds plain water, and a dried raisin is dropped into it. Cup 2 holds water with a large spoonful of salt stirred in, and a crisp stick of celery is stood up in it. Both are left overnight. Predict what each one looks like in the morning, and explain both results with the same rule.`, solution: `The raisin is plump, because the plain water has more water than the raisin cells do, so water moved into it. The celery is limp, because the salty water has less water than the celery cells do, so water moved out of it. Both results come from the same rule: water moves toward the side with less water.` },
      relatedLoIds: ['m7sci.diffusion-and-osmosis'],
    },
  ],
  pointers: [
    { content: `Students often say "The particles know where to go and want to even things out." — Particles have no goals and no information. Each one jiggles in a random direction. The evening-out happens for a counting reason: where particles are crowded there are simply more of them available to wander away, so more leave than arrive until the two sides match. WRONG: "They want to spread out." CORRECT: "They move randomly, and spreading out is what that adds up to." Watch for this everywhere in biology -- words like wants, tries, knows and decides almost always signal an explanation that has skipped the real cause.`, kind: 'common-error' },
    { content: `Students often say "Osmosis is the salt moving across the membrane." — Osmosis is the diffusion of WATER, and only water. The membrane is selectively permeable, and in this setup water crosses it while the salt largely does not. So the salt stays put and the water does the moving instead: it leaves the cell and goes toward the salty side, which is the side with less water. The cell shrinks. Any substance spreading out is diffusion; call it osmosis only when the substance is water.`, kind: 'common-error' },
    { content: `The cell membrane is selectively permeable -- some things cross it, some do not, and what cannot cross decides what happens to what can.`, kind: 'tip' },
    { content: `Diffusion is particles spreading from where they are more crowded to where they are less crowded, until they are evenly spread.`, kind: 'tip' },
    { content: `Particles do not want or know anything. They move randomly, and spreading out is the result of that randomness.`, kind: 'tip' },
    { content: `Osmosis is diffusion of WATER across a membrane, and water moves toward the side that has less water. Salty water counts as having less water.`, kind: 'tip' },
    { content: `A cell in salty water loses water and shrinks; the same cell in pure water gains water and swells.`, kind: 'tip' },
    { content: `Diffusion and osmosis are passive and cost the cell nothing. Moving something the other way, toward where it is already crowded, is active transport and does cost energy.`, kind: 'tip' },
    { content: `Evenly spread does not mean stopped -- the particles keep moving, and the amounts crossing each way just balance out.`, kind: 'tip' },
    { content: `Never write that particles "want," "know," "try," or "decide" to spread out. Say: "They move randomly, and because they started crowded, more wander away than come back." If a wants/knows word sneaks into your sentence, rewrite it before you turn it in.`, kind: 'common-error' },
    { content: `Osmosis is the word for **water only**. Oxygen spreading into a cell is diffusion, not osmosis. Every osmosis is a diffusion, but not every diffusion is osmosis.`, kind: 'vocab-note' },
    { content: `In salty water, the salt is NOT pushing or pulling anything, and it usually can't even cross the membrane. Don't write "the salt went into the cell." Write "water moved out of the cell toward the side with less water."`, kind: 'gotcha' },
    { content: `Salty water = LESS water. It feels backwards because there's more *stuff* in the cup. Before you predict a direction, say out loud which side has more actual water — then move the water toward the other side.`, kind: 'tip' },
    { content: `"Evenly spread" does not mean "stopped." The particles keep jiggling forever. What balances is the traffic: about as many cross each way, so the amounts stay even.`, kind: 'gotcha' },
    { content: `Don't say the cell "uses energy to let things diffuse in" or "opens the membrane" for water. Diffusion and osmosis are passive — the cell pays nothing. Energy is only needed for active transport, which pushes stuff toward the crowded side.`, kind: 'common-error' },
    { content: `Quick energy test: is the substance moving WITH the spreading (crowded → less crowded)? Free. Moving AGAINST it (less crowded → more crowded)? That's active transport and costs energy.`, kind: 'tip' },
    { content: `A cell in pure water doesn't swell forever in real life — plant cells have a stiff cell wall that stops them, which is why celery goes crisp instead of bursting. Animal cells, with no wall, really can burst.`, kind: 'edge-case' },
  ],
};
