/**
 * Biology — Unit 10 CED 10.2: The Circulatory & Respiratory Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.circulatory-respiratory.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U10_CIRCULATORY_RESPIRATORY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.circulatory-respiratory.v1',
  course: 'Biology',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'The Circulatory & Respiratory Systems',
  planId: 'evelyn.hs.bio.circulatory-respiratory.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.circulatory-respiratory.v1' }],
  theory: [
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'The job', content: `THE JOB — every cell in the body runs cellular respiration and needs a steady supply of O2 and a way to dump CO2. The circulatory system is the delivery truck, the respiratory system is the loading dock, and blood is the cargo carrier that connects them.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'The four chambers', content: `THE FOUR CHAMBERS — two atria on top receive blood coming IN; two ventricles below pump blood OUT. The right side handles blood returning from the body; the left side handles blood returning from the lungs. The left ventricle has the thickest wall because it pushes blood to the entire body, not just next door to the lungs.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'The path of blood', content: `THE PATH OF BLOOD — body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body. Learn this as one loop, always in this order: the blood makes a full lap of the lungs before it can be sent to the body.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'Two circuits, one pump', content: `TWO CIRCUITS, ONE PUMP — the PULMONARY circuit is the short trip heart → lungs → heart, where blood picks up O2 and unloads CO2. The SYSTEMIC circuit is the long trip heart → body → heart, where blood delivers O2 and picks up CO2. Blood alternates between them, so it passes through the heart TWICE per complete lap.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'The vessel rule is about direction, not oxygen', content: `THE VESSEL RULE IS ABOUT DIRECTION, NOT OXYGEN — ARTERIES carry blood AWAY from the heart; VEINS carry blood BACK to the heart. That is the entire definition. Because most arteries happen to run in the systemic circuit, students overgeneralize to "arteries are the oxygenated ones" — and then the pulmonary vessels break the pattern.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'The two exceptions that prove the rule', content: `THE TWO EXCEPTIONS THAT PROVE THE RULE — the PULMONARY ARTERY carries DEOXYGENATED blood (it is heading away from the heart, out to the lungs to be reloaded); the PULMONARY VEIN carries OXYGENATED blood (it is heading back to the heart, freshly loaded). This is the single most common error in this lesson. Name the vessel by which way the blood is going, then read off the gas.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'Capillaries are the exchange surface', content: `CAPILLARIES ARE THE EXCHANGE SURFACE — arteries branch into arterioles and finally into capillaries, whose walls are one cell thick. Nothing is exchanged in an artery or a vein; every molecule that enters or leaves the blood crosses a capillary wall. BLOOD COMPONENTS: red blood cells carry O2 on HEMOGLOBIN, white blood cells fight infection, platelets clot, and plasma is the straw-colored liquid carrying everything else, including most of the CO2.` },
    { loId: 'bio.circulatory-respiratory', kind: 'framework', title: 'Air path and gas exchange', content: `AIR PATH AND GAS EXCHANGE — air travels nose/mouth → trachea → bronchi → bronchioles → ALVEOLI, the tiny sacs wrapped in capillaries. Exchange there is passive DIFFUSION down partial-pressure gradients: O2 moves from the high-pressure alveolar air into the low-O2 blood, and CO2 moves from the high-CO2 blood into the alveolar air. The lungs never push oxygen into the blood; the gradient does the work, and about 300 million alveoli provide roughly 70 square meters of surface area — a tennis court folded into your chest — to make that passive process fast enough.` },
    { loId: 'bio.circulatory-respiratory', kind: 'definition', title: 'artery', content: `a vessel that carries blood AWAY from the heart, regardless of how much O2 that blood is carrying.` },
    { loId: 'bio.circulatory-respiratory', kind: 'definition', title: 'vein', content: `a vessel that carries blood BACK toward the heart, regardless of how much O2 that blood is carrying.` },
    { loId: 'bio.circulatory-respiratory', kind: 'definition', title: 'alveolus', content: `a one-cell-thick air sac in the lung, wrapped in capillaries, where O2 and CO2 diffuse between air and blood.` },
    { loId: 'bio.circulatory-respiratory', kind: 'definition', title: 'hemoglobin', content: 'the iron-containing protein in red blood cells that binds and releases O2.' },
  ],
  methods: [
    {
      title: 'Worked trace blood path',
      steps: [
        `Start with direction: the cell is in the body and must return to the heart, so it travels through venules into veins, and the large veins drain into the vena cava.`,
        `The vena cava empties into the RIGHT ATRIUM. The atrium contracts and pushes the blood down into the RIGHT VENTRICLE — the receiving chamber always feeds the pumping chamber directly below it.`,
        `The right ventricle pumps the blood out through the PULMONARY ARTERY to the lungs. Note the name: it is an artery because it leaves the heart, even though the blood inside is still deoxygenated.`,
        `At the alveolar capillaries, CO2 diffuses out into the alveolar air and O2 diffuses in and binds to hemoglobin. The blood is now oxygenated — this completes the pulmonary circuit.`,
        `The blood returns through the PULMONARY VEIN — a vein because it heads back to the heart, and the one vein in the body carrying oxygenated blood — into the LEFT ATRIUM, then down into the LEFT VENTRICLE.`,
        `The left ventricle, the thickest-walled chamber, pumps the blood out through the AORTA. From the aorta it travels through progressively smaller systemic arteries and arterioles down the leg and back into a capillary in the calf muscle, where O2 diffuses out to the cell.`,
      ],
      example: { problem: `A red blood cell has just delivered its oxygen to a muscle cell in your calf and is now sitting in a capillary there, loaded with CO2. Trace its complete route back to that same calf muscle, naming every chamber and major vessel it passes through in order.`, solution: `calf capillary → vena cava → right atrium → right ventricle → pulmonary artery → lungs (drop CO2, pick up O2) → pulmonary vein → left atrium → left ventricle → aorta → calf capillary. Two circuits, two passes through the heart.` },
      relatedLoIds: ['bio.circulatory-respiratory'],
    },
    {
      title: 'Worked artery oxygen trap',
      steps: [
        `Restate the actual definition. Artery and vein are defined by DIRECTION relative to the heart: an artery carries blood away from the heart, a vein carries it back. Neither word says anything about oxygen.`,
        `Locate the pulmonary artery on the path of blood. It leaves the RIGHT VENTRICLE and travels to the lungs — that is away from the heart, so by definition it is an artery.`,
        `Ask what the blood in it has just done. It came from the body, where it gave up its O2 and picked up CO2, and it has not reached the lungs yet — so it is necessarily deoxygenated. Reloading happens downstream, at the alveolar capillaries.`,
        `Check the mirror case for consistency. The PULMONARY VEIN returns from the lungs to the LEFT ATRIUM, so it is a vein by direction — and because it comes straight from the alveoli, it carries the most oxygen-rich blood in the body.`,
        `Diagnose the source of the error: the "arteries are oxygenated" pattern holds only in the systemic circuit, which is most of the diagram, so it looks like a rule. In the pulmonary circuit the pattern flips, which is exactly why direction, not gas content, is the definition.`,
      ],
      example: { problem: `A student claims: "The pulmonary artery must carry oxygenated blood, because arteries always carry oxygen-rich blood." Blood in the pulmonary artery is in fact O2-poor. Explain why the vessel is still correctly called an artery.`, solution: `It is an artery because it carries blood AWAY from the heart, out to the lungs. Direction defines the vessel; oxygen content does not — which is why the pulmonary artery is deoxygenated and the pulmonary vein is oxygenated.` },
      relatedLoIds: ['bio.circulatory-respiratory'],
    },
  ],
  pointers: [
    { content: `Arteries carry blood AWAY from the heart and veins carry it BACK — direction, not gas content. The pulmonary artery leaves the heart carrying deoxygenated blood to the lungs, and the pulmonary vein returns oxygenated blood to the heart, so the two exceptions sit right in the middle of the diagram. Blood is also never actually blue: it is bright red when O2-rich and dark red when O2-poor, and the O2-poor blood still carries plenty of dissolved CO2 rather than being empty.`, kind: 'common-error' },
    { content: `The path of blood: body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body.`, kind: 'tip' },
    { content: `Arteries carry blood AWAY from the heart, veins carry it BACK — that is direction, not oxygen. The pulmonary artery is deoxygenated; the pulmonary vein is oxygenated.`, kind: 'tip' },
    { content: `Pulmonary circuit = heart → lungs → heart; systemic circuit = heart → body → heart. Blood passes through the heart twice per lap.`, kind: 'tip' },
    { content: `All exchange happens across one-cell-thick capillary walls; red blood cells carry O2 on hemoglobin, white cells defend, platelets clot, plasma carries the rest.`, kind: 'tip' },
    { content: `Air path: trachea → bronchi → bronchioles → alveoli. Gas exchange there is passive diffusion down partial-pressure gradients, made fast by roughly 70 square meters of alveolar surface area.`, kind: 'tip' },
    { content: `This whole network exists to serve cellular respiration: it delivers the O2 mitochondria need and hauls away the CO2 they produce.`, kind: 'tip' },
    { content: `Name the vessel by DIRECTION first, then read off the gas — never the reverse. "Artery" = away from heart. If you start from "arteries are red," the pulmonary artery and pulmonary vein will both come out backwards.`, kind: 'common-error' },
    { content: `Right side = deoxygenated, left side = oxygenated. Blood never crosses from right to left inside a healthy heart — it must make the full lung lap first. Writing "right ventricle → aorta" skips an entire circuit.`, kind: 'gotcha' },
    { content: `Atria receive, ventricles pump — and blood always drops from the atrium to the ventricle on the SAME side. Don't write "right atrium → left ventricle."`, kind: 'common-error' },
    { content: `Blue blood doesn't exist. Diagram colors label the blood's O2 content, not the vessel. O2-poor blood is dark red and still carries plenty of dissolved CO2 in plasma — it isn't "empty."`, kind: 'vocab-note' },
    { content: `No exchange happens in arteries or veins — every O2, CO2, nutrient, and waste molecule crosses a one-cell-thick CAPILLARY wall. If your answer has gas leaving the aorta or the vena cava, it's wrong.`, kind: 'common-error' },
    { content: `The lungs do NOT pump O2 into blood. Breathing only refreshes the alveolar air to maintain the gradient; diffusion down a partial-pressure difference does the actual transfer — passively, no ATP.`, kind: 'gotcha' },
    { content: `Say "partial pressure gradient," not just "concentration." O2 diffuses in and CO2 diffuses out at the SAME alveolus, in opposite directions — each gas follows its own gradient independently.`, kind: 'vocab-note' },
    { content: `"Passes through the heart twice per lap" means one trip through the right side and one through the left — not two heartbeats' worth of the same chamber. Count the two circuits, not the beats.`, kind: 'edge-case' },
  ],
};
