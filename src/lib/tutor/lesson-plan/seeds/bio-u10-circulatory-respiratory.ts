/**
 * Biology — Human Body Systems: The Circulatory & Respiratory Systems.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS1-2).
 * Almost every error in this lesson is a DIRECTION error: students name
 * vessels by the gas they carry instead of by which way the blood is moving,
 * so the concept segment is organized around the away/back rule and the two
 * circuits it produces.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U10_CIRCULATORY_RESPIRATORY: LessonPlan = {
  id: 'evelyn.hs.bio.circulatory-respiratory.v1',
  title: 'The Circulatory & Respiratory Systems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.circulatory-respiratory',
      standard: 'BIO-10.2',
      description:
        'Trace the path of blood through the four-chambered heart and the pulmonary and systemic circuits, and explain how gas exchange by diffusion at the alveoli supplies the O2 and removes the CO2 that cellular respiration requires (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: ['bio.homeostasis-feedback'],
  followUps: ['bio.digestive-excretory'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the two systems as one delivery network whose failures and adaptations you can already name.',
      script:
        'A heart attack is a plumbing problem: one small artery feeding the heart muscle itself gets blocked, and the muscle downstream starves within minutes. Distance runners fly to Colorado to train because thin mountain air pushes their bodies to make more red blood cells. A smoker coughs because the damaged airways cannot sweep themselves clean. All three stories are about one network — a pump, a set of pipes, and a gas-exchange surface — and by the end of this lesson you will be able to trace a single oxygen molecule through the whole thing without guessing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pump-pipes-exchange',
      kind: 'concept',
      goal: 'The four chambers and the path of blood, the two circuits, the direction rule for vessels, and gas exchange at the alveoli.',
      keyIdeas: [
        'THE JOB — every cell in the body runs cellular respiration and needs a steady supply of O2 and a way to dump CO2. The circulatory system is the delivery truck, the respiratory system is the loading dock, and blood is the cargo carrier that connects them.',
        'THE FOUR CHAMBERS — two atria on top receive blood coming IN; two ventricles below pump blood OUT. The right side handles blood returning from the body; the left side handles blood returning from the lungs. The left ventricle has the thickest wall because it pushes blood to the entire body, not just next door to the lungs.',
        'THE PATH OF BLOOD — body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body. Learn this as one loop, always in this order: the blood makes a full lap of the lungs before it can be sent to the body.',
        'TWO CIRCUITS, ONE PUMP — the PULMONARY circuit is the short trip heart → lungs → heart, where blood picks up O2 and unloads CO2. The SYSTEMIC circuit is the long trip heart → body → heart, where blood delivers O2 and picks up CO2. Blood alternates between them, so it passes through the heart TWICE per complete lap.',
        'THE VESSEL RULE IS ABOUT DIRECTION, NOT OXYGEN — ARTERIES carry blood AWAY from the heart; VEINS carry blood BACK to the heart. That is the entire definition. Because most arteries happen to run in the systemic circuit, students overgeneralize to "arteries are the oxygenated ones" — and then the pulmonary vessels break the pattern.',
        'THE TWO EXCEPTIONS THAT PROVE THE RULE — the PULMONARY ARTERY carries DEOXYGENATED blood (it is heading away from the heart, out to the lungs to be reloaded); the PULMONARY VEIN carries OXYGENATED blood (it is heading back to the heart, freshly loaded). This is the single most common error in this lesson. Name the vessel by which way the blood is going, then read off the gas.',
        'CAPILLARIES ARE THE EXCHANGE SURFACE — arteries branch into arterioles and finally into capillaries, whose walls are one cell thick. Nothing is exchanged in an artery or a vein; every molecule that enters or leaves the blood crosses a capillary wall. BLOOD COMPONENTS: red blood cells carry O2 on HEMOGLOBIN, white blood cells fight infection, platelets clot, and plasma is the straw-colored liquid carrying everything else, including most of the CO2.',
        'AIR PATH AND GAS EXCHANGE — air travels nose/mouth → trachea → bronchi → bronchioles → ALVEOLI, the tiny sacs wrapped in capillaries. Exchange there is passive DIFFUSION down partial-pressure gradients: O2 moves from the high-pressure alveolar air into the low-O2 blood, and CO2 moves from the high-CO2 blood into the alveolar air. The lungs never push oxygen into the blood; the gradient does the work, and about 300 million alveoli provide roughly 70 square meters of surface area — a tennis court folded into your chest — to make that passive process fast enough.',
      ],
      vocabulary: [
        { term: 'artery', definition: 'a vessel that carries blood AWAY from the heart, regardless of how much O2 that blood is carrying.' },
        { term: 'vein', definition: 'a vessel that carries blood BACK toward the heart, regardless of how much O2 that blood is carrying.' },
        { term: 'alveolus', definition: 'a one-cell-thick air sac in the lung, wrapped in capillaries, where O2 and CO2 diffuse between air and blood.' },
        { term: 'hemoglobin', definition: 'the iron-containing protein in red blood cells that binds and releases O2.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-blood-path',
      kind: 'worked_example',
      problem:
        'A red blood cell has just delivered its oxygen to a muscle cell in your calf and is now sitting in a capillary there, loaded with CO2. Trace its complete route back to that same calf muscle, naming every chamber and major vessel it passes through in order.',
      steps: [
        'Start with direction: the cell is in the body and must return to the heart, so it travels through venules into veins, and the large veins drain into the vena cava.',
        'The vena cava empties into the RIGHT ATRIUM. The atrium contracts and pushes the blood down into the RIGHT VENTRICLE — the receiving chamber always feeds the pumping chamber directly below it.',
        'The right ventricle pumps the blood out through the PULMONARY ARTERY to the lungs. Note the name: it is an artery because it leaves the heart, even though the blood inside is still deoxygenated.',
        'At the alveolar capillaries, CO2 diffuses out into the alveolar air and O2 diffuses in and binds to hemoglobin. The blood is now oxygenated — this completes the pulmonary circuit.',
        'The blood returns through the PULMONARY VEIN — a vein because it heads back to the heart, and the one vein in the body carrying oxygenated blood — into the LEFT ATRIUM, then down into the LEFT VENTRICLE.',
        'The left ventricle, the thickest-walled chamber, pumps the blood out through the AORTA. From the aorta it travels through progressively smaller systemic arteries and arterioles down the leg and back into a capillary in the calf muscle, where O2 diffuses out to the cell.',
      ],
      answer:
        'calf capillary → vena cava → right atrium → right ventricle → pulmonary artery → lungs (drop CO2, pick up O2) → pulmonary vein → left atrium → left ventricle → aorta → calf capillary. Two circuits, two passes through the heart.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-artery-oxygen-trap',
      kind: 'worked_example',
      problem:
        'A student claims: "The pulmonary artery must carry oxygenated blood, because arteries always carry oxygen-rich blood." Blood in the pulmonary artery is in fact O2-poor. Explain why the vessel is still correctly called an artery.',
      steps: [
        'Restate the actual definition. Artery and vein are defined by DIRECTION relative to the heart: an artery carries blood away from the heart, a vein carries it back. Neither word says anything about oxygen.',
        'Locate the pulmonary artery on the path of blood. It leaves the RIGHT VENTRICLE and travels to the lungs — that is away from the heart, so by definition it is an artery.',
        'Ask what the blood in it has just done. It came from the body, where it gave up its O2 and picked up CO2, and it has not reached the lungs yet — so it is necessarily deoxygenated. Reloading happens downstream, at the alveolar capillaries.',
        'Check the mirror case for consistency. The PULMONARY VEIN returns from the lungs to the LEFT ATRIUM, so it is a vein by direction — and because it comes straight from the alveoli, it carries the most oxygen-rich blood in the body.',
        'Diagnose the source of the error: the "arteries are oxygenated" pattern holds only in the systemic circuit, which is most of the diagram, so it looks like a rule. In the pulmonary circuit the pattern flips, which is exactly why direction, not gas content, is the definition.',
      ],
      answer:
        'It is an artery because it carries blood AWAY from the heart, out to the lungs. Direction defines the vessel; oxygen content does not — which is why the pulmonary artery is deoxygenated and the pulmonary vein is oxygenated.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-vessel-direction',
      kind: 'try_yourself',
      problem:
        'Which statement correctly describes the blood in the pulmonary artery and the pulmonary vein, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All arteries carry oxygenated blood and all veins carry deoxygenated blood, so the pulmonary artery is oxygenated and the pulmonary vein is deoxygenated' },
        { id: 'b', text: 'Both vessels carry oxygenated blood, because both are part of the lungs' },
        { id: 'c', text: 'The pulmonary artery carries deoxygenated blood away from the heart to the lungs, and the pulmonary vein carries oxygenated blood back to the heart', correct: true },
        { id: 'd', text: 'The pulmonary artery carries oxygenated blood to the body and the pulmonary vein returns deoxygenated blood from the body' },
      ],
      expectedAnswer:
        'The pulmonary artery carries deoxygenated blood away from the heart to the lungs, and the pulmonary vein carries oxygenated blood back to the heart',
      hints: [
        'What do the words artery and vein actually define — the direction the blood is moving, or the gas it is carrying?',
        'The pulmonary artery leaves the right ventricle heading TO the lungs, so the blood in it has not been reloaded with O2 yet.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chamber-order',
      kind: 'try_yourself',
      problem:
        'Blood returning from the body enters the heart through the vena cava. In what order does it pass through the next four structures before it is sent out to the body?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Right atrium → right ventricle → pulmonary artery → lungs, then back to the left side of the heart', correct: true },
        { id: 'b', text: 'Left atrium → left ventricle → pulmonary artery → lungs, then back to the right side of the heart' },
        { id: 'c', text: 'Right ventricle → right atrium → aorta → lungs, then back to the left side of the heart' },
        { id: 'd', text: 'Right atrium → left atrium → right ventricle → left ventricle, then straight out to the body' },
      ],
      expectedAnswer:
        'Right atrium → right ventricle → pulmonary artery → lungs, then back to the left side of the heart',
      hints: [
        'Which side of the heart receives blood coming back from the BODY, and which side receives blood coming back from the LUNGS?',
        'Within one side, the atrium always receives first and hands the blood down to the ventricle, which does the pumping.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-alveolar-diffusion',
      kind: 'try_yourself',
      problem:
        'At the alveoli, O2 moves from the air in the alveolar sac into the blood in the surrounding capillaries. What drives this movement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The lungs actively push O2 into the blood using energy from ATP' },
        { id: 'b', text: 'Hemoglobin reaches out of the red blood cell and pulls O2 across the alveolar wall' },
        { id: 'c', text: 'The muscular walls of the capillaries squeeze O2 inward from the alveolar air' },
        { id: 'd', text: 'Diffusion down a partial-pressure gradient — O2 is at higher partial pressure in the alveolar air than in the arriving blood, so it moves passively into the blood', correct: true },
      ],
      expectedAnswer:
        'Diffusion down a partial-pressure gradient — O2 is at higher partial pressure in the alveolar air than in the arriving blood, so it moves passively into the blood',
      hints: [
        'The blood arriving at the alveoli has just come from the body, so it is low in O2 and high in CO2. How does that compare with fresh air in the alveolar sac?',
        'No cell spends energy moving these gases; both O2 and CO2 simply move from where they are more concentrated to where they are less concentrated.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-artery-equals-oxygenated',
      kind: 'misconception_check',
      question:
        'A student writes: "You can tell the vessels apart by color-coding: arteries are the red ones because they carry oxygen, and veins are the blue ones because they carry carbon dioxide." What went wrong?',
      commonErrors: [
        {
          answer: 'Arteries are defined as the oxygenated vessels and veins as the deoxygenated ones',
          misconception: 'Turning a pattern that only holds in the systemic circuit into the definition, and treating the red/blue coloring on diagrams as a property of the vessel rather than a label for the blood inside it.',
          correctsTo:
            'Arteries carry blood AWAY from the heart and veins carry it BACK — direction, not gas content. The pulmonary artery leaves the heart carrying deoxygenated blood to the lungs, and the pulmonary vein returns oxygenated blood to the heart, so the two exceptions sit right in the middle of the diagram. Blood is also never actually blue: it is bright red when O2-rich and dark red when O2-poor, and the O2-poor blood still carries plenty of dissolved CO2 rather than being empty.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The path of blood: body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body.',
        'Arteries carry blood AWAY from the heart, veins carry it BACK — that is direction, not oxygen. The pulmonary artery is deoxygenated; the pulmonary vein is oxygenated.',
        'Pulmonary circuit = heart → lungs → heart; systemic circuit = heart → body → heart. Blood passes through the heart twice per lap.',
        'All exchange happens across one-cell-thick capillary walls; red blood cells carry O2 on hemoglobin, white cells defend, platelets clot, plasma carries the rest.',
        'Air path: trachea → bronchi → bronchioles → alveoli. Gas exchange there is passive diffusion down partial-pressure gradients, made fast by roughly 70 square meters of alveolar surface area.',
        'This whole network exists to serve cellular respiration: it delivers the O2 mitochondria need and hauls away the CO2 they produce.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'The Circulatory & Respiratory Systems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
