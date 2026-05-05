/**
 * High School (9-10) Anatomy & Physiology.
 *
 * Body systems, homeostasis, structure-function relationship.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_ANATOMY_PHYSIOLOGY: LessonPlan = {
  id: 'evelyn.science.9-10.anatomy-physiology.v1',
  title: 'Anatomy & physiology — systems and homeostasis',
  curriculum: 'NGSS',
  grade: '10',
  subject: 'science',
  topic: 'anatomy-physiology',
  locale: 'en',
  los: [
    {
      id: 'hsanat.systems',
      description: 'Identify the major body systems and how they cooperate to maintain homeostasis.',
      standard: 'HS-LS1-3',
    },
  ],
  prerequisites: ['g6-8.human-body'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame body as a coordinated set of systems.',
      script: 'Your body is a living machine running 11 systems in parallel — circulating, breathing, digesting, defending, sensing, moving — all coordinated so closely you don\'t notice unless something breaks. The miracle isn\'t any one system; it\'s how they cooperate to keep your internal world stable while the outside world changes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-systems',
      kind: 'concept',
      goal: 'Major systems + structure-function + homeostasis.',
      keyIdeas: [
        'CIRCULATORY: heart pumps blood through arteries, capillaries, veins. Carries oxygen, nutrients, hormones.',
        'RESPIRATORY: lungs exchange O₂ in / CO₂ out at alveoli. Diaphragm muscle drives breathing.',
        'DIGESTIVE: mouth → esophagus → stomach → small intestine (most absorption) → large intestine (water reabsorption).',
        'NERVOUS: brain + spinal cord + nerves. Electrical signals; neurotransmitters at synapses.',
        'MUSCULOSKELETAL: bones (frame, calcium store, blood-cell production), joints, three muscle types.',
        'IMMUNE: innate (rapid, generic) + adaptive (slow, specific, remembers).',
        'STRUCTURE FOLLOWS FUNCTION: alveoli are tiny + thin-walled to maximize gas exchange. Small intestine has folds + villi to maximize absorption surface.',
        'HOMEOSTASIS: body maintains stable internals (temperature, pH, glucose, water) via FEEDBACK LOOPS — usually negative feedback.',
      ],
      vocabulary: [
        { term: 'homeostasis', definition: 'maintenance of stable internal conditions despite external change.' },
        { term: 'negative feedback', definition: 'a regulatory loop where the response opposes the change; stabilizing.' },
        { term: 'alveoli', definition: 'tiny air sacs in the lungs where oxygen and CO₂ exchange with blood.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-shiver',
      kind: 'worked_example',
      problem: 'Body temperature drops below 37°C in cold weather. Trace the homeostatic response.',
      steps: [
        'SENSORS: skin and brain (hypothalamus) detect lower temperature.',
        'CONTROL CENTER: hypothalamus signals "warm up".',
        'EFFECTORS: ',
        '  - Skeletal muscles contract rapidly → SHIVERING generates heat.',
        '  - Skin blood vessels constrict → less heat loss.',
        '  - Hairs stand up (in mammals; goosebumps in humans).',
        'RESULT: body temperature returns to ~37°C. Sensors detect normal → response stops.',
        'This is NEGATIVE feedback: the response opposes the change.',
      ],
      answer: 'Sensors → hypothalamus → shiver + vasoconstrict → temp restored.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'After a meal, blood glucose rises. The pancreas releases insulin, which causes cells to absorb glucose. What kind of feedback is this and why?',
      expectedAnswer: 'negative feedback — insulin lowers the elevated glucose back toward normal',
      responseFormat: 'free',
      hints: [
        'The response (insulin → absorption) OPPOSES the change (rising glucose).',
        'This restores stability rather than amplifying.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-systems-isolated',
      kind: 'misconception_check',
      question: 'A student says: "The respiratory system handles oxygen; the circulatory system doesn\'t need to know about it." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because they\'re different systems',
          misconception: 'Treating body systems as independent.',
          correctsTo: 'Body systems are deeply COUPLED. Lungs only get oxygen INTO the body; the circulatory system carries it to every cell. If your heart fails, your lungs work fine but you suffocate. Cells need oxygen — both systems together deliver it. Same coupling for digestive (absorbs nutrients) + circulatory (delivers them), nervous (signals to muscles) + musculoskeletal (executes), and so on.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '11 organ systems; they cooperate, not operate in isolation.',
        'Structure follows function — folds, villi, branching maximize surface area.',
        'Homeostasis = stable internals via negative feedback loops.',
        'Sensor → control center → effector → response loop.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
