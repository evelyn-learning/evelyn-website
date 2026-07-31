/**
 * Biology — Human Body Systems: Homeostasis & Feedback Loops.
 *
 * The control-systems template for the HS Biology fan-out (NGSS HS-LS1-3).
 * Nearly every error in this unit is a vocabulary error: students read
 * "negative feedback" as "harmful feedback" and "positive feedback" as
 * "helpful feedback". The concept segment is therefore organized around the
 * loop's four parts and around what negative/positive actually describe —
 * the DIRECTION of the response, not its value.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U10_HOMEOSTASIS_FEEDBACK: LessonPlan = {
  id: 'evelyn.hs.bio.homeostasis-feedback.v1',
  title: 'Homeostasis & Feedback Loops',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.homeostasis-feedback',
      standard: 'BIO-10.1',
      description:
        'Explain how negative and positive feedback loops maintain or amplify change in an organism, tracing the stimulus, receptor, control center, effector, and response that keep an internal variable near its set point (NGSS HS-LS1-3).',
    },
  ],
  prerequisites: ['bio.population-community-ecology'],
  followUps: ['bio.circulatory-respiratory'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame homeostasis as the invisible control system that keeps a body alive while the world outside it swings wildly.',
      script:
        'A marathon runner crosses the finish line on a 35°C day drenched in sweat — and her core temperature is 37.4°C, barely off where it started that morning. Step outside into a freezing wind and you shiver; eat a stack of pancakes and your blood sugar spikes, then quietly comes back down within two hours. Your inside stays nearly the same while the outside does whatever it wants. In this lesson you learn the four-part control loop that pulls that off, why it never holds perfectly still, and what happens in diabetes and heatstroke when the loop breaks.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-feedback-loops',
      kind: 'concept',
      goal: 'Homeostasis as dynamic balance, the four parts of a feedback loop, and the real meaning of negative vs positive feedback.',
      keyIdeas: [
        'HOMEOSTASIS IS A STABLE INSIDE, NOT A STILL ONE — it is the maintenance of a stable internal environment despite a changing external one. Body temperature, blood glucose, blood pH, and water balance are all held inside narrow ranges no matter what the outside world does.',
        'DYNAMIC, NOT FROZEN — the value OSCILLATES around a SET POINT rather than sitting on it. Human core temperature drifts roughly between 36.5°C and 37.5°C across a day around a set point near 37°C; blood glucose swings up after a meal and back down between meals. Homeostasis is a thermostat cycling on and off, not a value nailed in place.',
        'THE FOUR-PART LOOP — every feedback loop runs stimulus → receptor → control center → effector → response. The STIMULUS is the change away from the set point, the RECEPTOR detects it, the CONTROL CENTER (usually the hypothalamus, or an endocrine gland) compares it to the set point and decides, and the EFFECTOR (a muscle or gland) carries out the RESPONSE. Naming the wrong effector is the most common trace error: the receptor that senses is rarely the structure that acts.',
        'NEGATIVE FEEDBACK REVERSES THE CHANGE — the response pushes the variable back TOWARD the set point, then shuts itself off once it gets there. This is the loop that maintains homeostasis, and it runs almost everything in the body.',
        'NEGATIVE DOES NOT MEAN BAD — it means OPPOSING. "Negative" describes the direction of the response (against the change), not its value. Negative feedback is the helpful, life-sustaining kind; this single vocabulary trap causes more wrong answers in this unit than anything else.',
        'THE THREE CLASSIC NEGATIVE LOOPS — (1) THERMOREGULATION: too hot → skin and hypothalamic receptors detect it → hypothalamus signals → sweat glands release sweat and skin vessels widen → heat is lost, temperature falls back to 37°C. Too cold → skeletal muscles shiver and vessels narrow → heat is generated and conserved. (2) BLOOD GLUCOSE: high glucose → pancreas releases INSULIN → cells take glucose in and the liver stores it as glycogen → glucose falls. Low glucose → pancreas releases GLUCAGON → liver breaks glycogen back down → glucose rises. Insulin and glucagon are ANTAGONISTIC: they push opposite directions on the same variable. (3) OSMOREGULATION: blood too concentrated → hypothalamus detects it → pituitary releases ADH → kidneys reabsorb more water → blood water content rises and urine is more concentrated.',
        'POSITIVE FEEDBACK AMPLIFIES THE CHANGE — the response pushes the variable FURTHER in the direction it was already going, so the loop accelerates itself until an outside event ends it. In CHILDBIRTH, contractions push the baby against the cervix → stretch receptors fire → oxytocin is released → contractions get stronger → more stretch, and the cycle escalates until delivery stops it. In BLOOD CLOTTING, activated platelets release chemicals that activate more platelets until the break is sealed.',
        'WHY POSITIVE FEEDBACK IS RARE — it is a one-way ratchet with no built-in off switch, so it cannot maintain anything; it only drives a process to COMPLETION. The body uses it for the handful of events that need to finish fast and then stop, and uses negative feedback for everything it needs to hold steady.',
        'WHEN THE LOOP FAILS — in DIABETES the glucose loop breaks (no insulin is made, or cells stop responding to it), so glucose stays dangerously high after meals. In HEATSTROKE the thermoregulation loop is overwhelmed: sweating can no longer shed heat fast enough, core temperature climbs past about 40°C, and enzymes begin to denature. Homeostatic failure is what makes these conditions dangerous.',
      ],
      vocabulary: [
        { term: 'set point', definition: 'the target value a homeostatic variable is regulated around, such as about 37°C for human core temperature.' },
        { term: 'effector', definition: 'the muscle or gland that carries out the response ordered by the control center.' },
        { term: 'negative feedback', definition: 'a loop whose response opposes the original change and returns the variable to its set point.' },
        { term: 'positive feedback', definition: 'a loop whose response amplifies the original change, driving a process to completion.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-glucose-loop',
      kind: 'worked_example',
      problem:
        'A student eats a large plate of pasta. Over the next 30 minutes her blood glucose rises well above its set point of about 90 mg/dL. Trace the loop that brings it back down, naming the stimulus, receptor, control center, effector, and response — and state which kind of feedback it is.',
      steps: [
        'Name the STIMULUS: the change away from the set point. Here it is blood glucose rising above about 90 mg/dL after the meal — not the pasta itself, which is only the cause of the change.',
        'Name the RECEPTOR and CONTROL CENTER: beta cells in the PANCREAS both detect the high glucose and act as the control center, comparing it to the set point and deciding to respond.',
        'Name the EFFECTOR and the signal: the pancreas releases the hormone INSULIN into the blood. Insulin travels to the body cells and the liver, which are the effectors that act on it.',
        'Name the RESPONSE: body cells take glucose out of the blood, and the liver converts the surplus into glycogen for storage. Blood glucose falls back toward 90 mg/dL, and as it does the pancreas slows insulin release — the loop switches itself off.',
        'Classify it: the response OPPOSED the original rise and returned the variable to its set point, so this is NEGATIVE feedback. If glucose later falls too low, the mirror loop runs — the pancreas releases GLUCAGON, the liver breaks glycogen back down, and glucose rises again.',
      ],
      answer:
        'Stimulus: blood glucose above about 90 mg/dL. Receptor/control center: the pancreas. Effector: pancreas releases insulin, acting on body cells and the liver. Response: cells absorb glucose and the liver stores it as glycogen, lowering blood glucose back to the set point. This is negative feedback.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classify-loop',
      kind: 'worked_example',
      problem:
        'You cut your finger. Platelets stick to the damaged vessel wall and release chemicals that attract and activate still more platelets, which release more of the same chemicals — until a plug seals the break. Is this negative or positive feedback, and how can you tell without memorizing the example?',
      steps: [
        'Identify the original change: platelets are being activated at the injury site. That is the variable heading in a direction.',
        'Identify what the response does to that change: each activated platelet recruits MORE platelets. The response pushes the variable further in the direction it was already going.',
        'Apply the test: a response that REVERSES the change is negative feedback; a response that AMPLIFIES it is positive feedback. Amplifying means this is POSITIVE feedback.',
        'Check the tell-tale ending: positive loops have no self-shutoff, so something outside the loop must stop them. Here the loop ends when the vessel is sealed — just as the childbirth loop ends at delivery. A negative loop, by contrast, would have slowed itself down as it approached a set point.',
      ],
      answer:
        'Positive feedback — the response amplifies the original change (more platelets recruit more platelets) and runs until the outside event of sealing the wound ends it, rather than settling back to a set point.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-negative-meaning',
      kind: 'try_yourself',
      problem:
        'In biology, what does the word "negative" in "negative feedback" actually describe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That the loop is harmful to the body and should be avoided' },
        { id: 'b', text: 'That the value of the variable becomes a negative number' },
        { id: 'c', text: 'That the response opposes the original change, pushing the variable back toward its set point', correct: true },
        { id: 'd', text: 'That the loop is switched off and no response is produced' },
      ],
      expectedAnswer: 'That the response opposes the original change, pushing the variable back toward its set point',
      hints: [
        'The word describes the DIRECTION of the response, not whether the response is good or bad for you.',
        'Sweating when you overheat is negative feedback — and it keeps you alive. What does the sweating do to the temperature change that triggered it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-childbirth',
      kind: 'try_yourself',
      problem:
        'During childbirth, each contraction pushes the baby harder against the cervix, stretch receptors fire, more oxytocin is released, and the contractions grow stronger still — until the baby is delivered. Which kind of feedback is this, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Positive feedback — the response amplifies the original change and drives the process to completion', correct: true },
        { id: 'b', text: 'Negative feedback — the contractions eventually stop, so the body returns to its set point' },
        { id: 'c', text: 'Negative feedback — oxytocin is a hormone, and all hormone loops are negative feedback' },
        { id: 'd', text: 'Positive feedback — the process is beneficial, and beneficial loops are called positive' },
      ],
      expectedAnswer: 'Positive feedback — the response amplifies the original change and drives the process to completion',
      hints: [
        'Ask only one question: does each round of the loop make the original change bigger, or does it reverse it?',
        'The loop does not settle back toward any set point — it escalates and is ended by an outside event, delivery. And remember the labels describe direction, not whether the outcome is good.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-effector-thermoregulation',
      kind: 'try_yourself',
      problem:
        'A student walks into a freezing wind and her core temperature starts to slip below its set point of about 37°C. The hypothalamus detects the drop and signals a response. Which structure is acting as the EFFECTOR, and what response does it produce?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The hypothalamus — it produces heat directly by raising the set point to about 39°C' },
        { id: 'b', text: 'The skin temperature receptors — they generate heat as they detect the cold' },
        { id: 'c', text: 'The sweat glands — they release sweat, which warms the skin as it evaporates' },
        { id: 'd', text: 'The skeletal muscles — they shiver, and the rapid contractions generate heat that raises core temperature back toward 37°C', correct: true },
      ],
      expectedAnswer: 'The skeletal muscles — they shiver, and the rapid contractions generate heat that raises core temperature back toward 37°C',
      hints: [
        'The effector is the structure that CARRIES OUT the response, not the one that detects the change or the one that decides.',
        'Sweating sheds heat, so it is the wrong response for being too cold. Which structure actually produces heat when you are cold?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-is-bad',
      kind: 'misconception_check',
      question:
        'A student writes: "Negative feedback is the bad kind — it is what goes wrong in diabetes and heatstroke. Positive feedback is the good kind that keeps your body healthy and balanced." What went wrong?',
      commonErrors: [
        {
          answer: 'Negative feedback is harmful; positive feedback maintains balance',
          misconception: 'Reading "negative" and "positive" as value judgments (bad/good) instead of as directions (opposing/amplifying).',
          correctsTo:
            'The labels describe what the response DOES to the original change. NEGATIVE feedback opposes the change and restores the set point — sweating, shivering, insulin, glucagon, ADH — and it is the loop that keeps you alive. POSITIVE feedback amplifies the change and drives a process to completion, like childbirth contractions or blood clotting; it is rarer precisely because it cannot maintain anything. Diabetes and heatstroke are not examples of negative feedback being harmful — they are cases where a negative feedback loop has FAILED.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Homeostasis = a stable internal environment despite external change, and it is DYNAMIC — the variable oscillates around a set point (about 37°C for core temperature) rather than holding still.',
        'Every loop runs stimulus → receptor → control center → effector → response. The effector acts; it is not the receptor that detected the change.',
        'Negative feedback OPPOSES the change and restores the set point: sweating and shivering, insulin and glucagon, ADH and water balance. Negative means opposing, not bad.',
        'Positive feedback AMPLIFIES the change and runs to completion: childbirth contractions, blood clotting. It is rare because it maintains nothing and needs an outside event to stop it.',
        'When a loop fails, homeostasis fails — diabetes (glucose loop) and heatstroke (temperature loop) are the classic examples.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Homeostasis & Feedback Loops' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
