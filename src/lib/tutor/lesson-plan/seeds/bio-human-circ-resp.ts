/**
 * HS Biology — Human Circulatory and Respiratory Systems.
 * NGSS HS-LS1-2: hierarchical organization of interacting systems.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_HUMAN_CIRC_RESP: LessonPlan = {
  id: 'evelyn.hs.science.biology.human-circ-resp.v1',
  title: 'Human Circulatory and Respiratory Systems',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'human-body', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-2', description: 'Develop and use a model to illustrate the hierarchical organization of interacting systems that provide specific functions within multicellular organisms.', standard: 'NGSS.HS-LS1-2' }],
  prerequisites: ['hs.bio.cell-theory-structure'], followUps: [], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'Your heart pumps about 7,500 liters of blood EVERY DAY. Through 100,000 km of blood vessels — enough to wrap around Earth 2.5 times. And every drop carries oxygen from your lungs to your toes and back. Two systems, perfectly synced.', estimatedMinutes: 2 },
    { id: 'concept-circulatory', kind: 'concept', goal: 'The circulatory system delivers oxygen, nutrients, and removes waste via blood.', keyIdeas: [
      'COMPONENTS: heart (pump), blood vessels (pipes), blood (cargo).',
      'HEART: 4 chambers — right atrium, right ventricle, left atrium, left ventricle.',
      'TWO CIRCUITS:',
      '  · PULMONARY: heart → lungs → heart (picks up O₂, drops CO₂).',
      '  · SYSTEMIC: heart → body → heart (delivers O₂, picks up CO₂).',
      'BLOOD VESSELS:',
      '  · Arteries: away from heart. Thick walls, high pressure.',
      '  · Veins: toward heart. Thinner walls, valves prevent backflow.',
      '  · Capillaries: tiny, one-cell-thick — where O₂/CO₂/nutrients exchange with tissues.',
      'BLOOD: red cells (carry O₂ via hemoglobin), white cells (immunity), platelets (clotting), plasma (liquid).',
    ], vocabulary: [{ term: 'artery', definition: 'vessel carrying blood AWAY from heart.' }, { term: 'vein', definition: 'vessel returning blood to heart.' }, { term: 'hemoglobin', definition: 'O₂-carrying protein in red blood cells.' }], estimatedMinutes: 5 },
    { id: 'concept-respiratory', kind: 'concept', goal: 'Breathing brings O₂ in and CO₂ out; gas exchange happens in alveoli.', keyIdeas: [
      'PATH OF AIR: nose/mouth → trachea → bronchi → bronchioles → ALVEOLI (tiny air sacs).',
      'ALVEOLI: 300+ million in human lungs. Wrapped in capillaries.',
      'GAS EXCHANGE (in alveoli, by DIFFUSION):',
      '  · O₂ diffuses from alveoli → blood (high concentration → low).',
      '  · CO₂ diffuses from blood → alveoli (high → low).',
      'BREATHING MECHANICS: diaphragm contracts → chest expands → low pressure → air flows IN. Relax → air OUT.',
      'Total alveolar surface area: ~70 m² (size of a tennis court) — packed into your chest.',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'worked-trace-O2', kind: 'worked_example', problem: 'Trace an O₂ molecule from the air outside your nose all the way to a muscle cell in your big toe.', steps: [
      'Inhale: O₂ enters nose → trachea → bronchi → bronchioles → alveoli.',
      'In alveolus: O₂ diffuses across thin wall into capillary blood.',
      'Binds to HEMOGLOBIN inside a red blood cell.',
      'Blood enters pulmonary VEIN → left atrium → left ventricle of heart.',
      'Heart pumps blood out via the AORTA → systemic arteries.',
      'Travels down body via large arteries → smaller arterioles → capillaries in toe.',
      'In toe capillary: O₂ releases from hemoglobin → diffuses into muscle cell.',
      'Muscle cell uses O₂ for cellular respiration → makes ATP for movement.',
    ], answer: 'Nose → alveolus → blood → heart → aorta → toe capillary → muscle cell. Two systems coordinated.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why does running fast make you breathe harder AND heart beat faster — both at once?', expectedAnswer: 'Muscles need MORE O₂ for cellular respiration. Heart pumps faster to deliver blood faster. Lungs breathe faster + deeper to load more O₂ and dump more CO₂. The two systems are coupled — you can\'t increase one without the other. Both controlled by the brainstem responding to blood CO₂ levels.', responseFormat: 'free', hints: ['What does muscle metabolism need more of?', 'How are circulation and respiration linked?'], estimatedMinutes: 3 },
    { id: 'misconception-veins-blue', kind: 'misconception_check', question: 'A friend says "veins look blue under the skin because deoxygenated blood is blue." Right?', commonErrors: [{ answer: 'Yes — deoxygenated blood is blue.', misconception: 'Believing blood is ever blue.', correctsTo: 'Blood is ALWAYS RED — bright red when O₂-rich, dark red when O₂-poor. Veins look blue because of how light scatters through skin (longer wavelengths absorbed, blue scattered back). When you cut a vein, the blood is dark red, not blue.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Heart pumps blood; arteries carry away, veins return.', 'Alveoli are where O₂ enters blood and CO₂ leaves.', 'Hemoglobin carries O₂ in red blood cells.', 'Circulatory + respiratory systems are tightly coupled.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
