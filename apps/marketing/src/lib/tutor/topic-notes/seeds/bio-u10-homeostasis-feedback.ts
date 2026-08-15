/**
 * Biology — Unit 10 CED 10.1: Homeostasis & Feedback Loops.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.homeostasis-feedback.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U10_HOMEOSTASIS_FEEDBACK: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.homeostasis-feedback.v1',
  course: 'Biology',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Homeostasis & Feedback Loops',
  planId: 'evelyn.hs.bio.homeostasis-feedback.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.homeostasis-feedback.v1' }],
  theory: [
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Homeostasis is a stable inside, not a still one', content: `HOMEOSTASIS IS A STABLE INSIDE, NOT A STILL ONE — it is the maintenance of a stable internal environment despite a changing external one. Body temperature, blood glucose, blood pH, and water balance are all held inside narrow ranges no matter what the outside world does.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Dynamic, not frozen', content: `DYNAMIC, NOT FROZEN — the value OSCILLATES around a SET POINT rather than sitting on it. Human core temperature drifts roughly between 36.5°C and 37.5°C across a day around a set point near 37°C; blood glucose swings up after a meal and back down between meals. Homeostasis is a thermostat cycling on and off, not a value nailed in place.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'The four-part loop', content: `THE FOUR-PART LOOP — every feedback loop runs stimulus → receptor → control center → effector → response. The STIMULUS is the change away from the set point, the RECEPTOR detects it, the CONTROL CENTER (usually the hypothalamus, or an endocrine gland) compares it to the set point and decides, and the EFFECTOR (a muscle or gland) carries out the RESPONSE. Naming the wrong effector is the most common trace error: the receptor that senses is rarely the structure that acts.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Negative feedback reverses the change', content: `NEGATIVE FEEDBACK REVERSES THE CHANGE — the response pushes the variable back TOWARD the set point, then shuts itself off once it gets there. This is the loop that maintains homeostasis, and it runs almost everything in the body.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Negative does not mean bad', content: `NEGATIVE DOES NOT MEAN BAD — it means OPPOSING. "Negative" describes the direction of the response (against the change), not its value. Negative feedback is the helpful, life-sustaining kind; this single vocabulary trap causes more wrong answers in this unit than anything else.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'The three classic negative loops', content: `THE THREE CLASSIC NEGATIVE LOOPS — (1) THERMOREGULATION: too hot → skin and hypothalamic receptors detect it → hypothalamus signals → sweat glands release sweat and skin vessels widen → heat is lost, temperature falls back to 37°C. Too cold → skeletal muscles shiver and vessels narrow → heat is generated and conserved. (2) BLOOD GLUCOSE: high glucose → pancreas releases INSULIN → cells take glucose in and the liver stores it as glycogen → glucose falls. Low glucose → pancreas releases GLUCAGON → liver breaks glycogen back down → glucose rises. Insulin and glucagon are ANTAGONISTIC: they push opposite directions on the same variable. (3) OSMOREGULATION: blood too concentrated → hypothalamus detects it → pituitary releases ADH → kidneys reabsorb more water → blood water content rises and urine is more concentrated.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Positive feedback amplifies the change', content: `POSITIVE FEEDBACK AMPLIFIES THE CHANGE — the response pushes the variable FURTHER in the direction it was already going, so the loop accelerates itself until an outside event ends it. In CHILDBIRTH, contractions push the baby against the cervix → stretch receptors fire → oxytocin is released → contractions get stronger → more stretch, and the cycle escalates until delivery stops it. In BLOOD CLOTTING, activated platelets release chemicals that activate more platelets until the break is sealed.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'Why positive feedback is rare', content: `WHY POSITIVE FEEDBACK IS RARE — it is a one-way ratchet with no built-in off switch, so it cannot maintain anything; it only drives a process to COMPLETION. The body uses it for the handful of events that need to finish fast and then stop, and uses negative feedback for everything it needs to hold steady.` },
    { loId: 'bio.homeostasis-feedback', kind: 'framework', title: 'When the loop fails', content: `WHEN THE LOOP FAILS — in DIABETES the glucose loop breaks (no insulin is made, or cells stop responding to it), so glucose stays dangerously high after meals. In HEATSTROKE the thermoregulation loop is overwhelmed: sweating can no longer shed heat fast enough, core temperature climbs past about 40°C, and enzymes begin to denature. Homeostatic failure is what makes these conditions dangerous.` },
    { loId: 'bio.homeostasis-feedback', kind: 'definition', title: 'set point', content: `the target value a homeostatic variable is regulated around, such as about 37°C for human core temperature.` },
    { loId: 'bio.homeostasis-feedback', kind: 'definition', title: 'effector', content: 'the muscle or gland that carries out the response ordered by the control center.' },
    { loId: 'bio.homeostasis-feedback', kind: 'definition', title: 'negative feedback', content: `a loop whose response opposes the original change and returns the variable to its set point.` },
    { loId: 'bio.homeostasis-feedback', kind: 'definition', title: 'positive feedback', content: `a loop whose response amplifies the original change, driving a process to completion.` },
  ],
  methods: [
    {
      title: 'Worked trace glucose loop',
      steps: [
        `Name the STIMULUS: the change away from the set point. Here it is blood glucose rising above about 90 mg/dL after the meal — not the pasta itself, which is only the cause of the change.`,
        `Name the RECEPTOR and CONTROL CENTER: beta cells in the PANCREAS both detect the high glucose and act as the control center, comparing it to the set point and deciding to respond.`,
        `Name the EFFECTOR and the signal: the pancreas releases the hormone INSULIN into the blood. Insulin travels to the body cells and the liver, which are the effectors that act on it.`,
        `Name the RESPONSE: body cells take glucose out of the blood, and the liver converts the surplus into glycogen for storage. Blood glucose falls back toward 90 mg/dL, and as it does the pancreas slows insulin release — the loop switches itself off.`,
        `Classify it: the response OPPOSED the original rise and returned the variable to its set point, so this is NEGATIVE feedback. If glucose later falls too low, the mirror loop runs — the pancreas releases GLUCAGON, the liver breaks glycogen back down, and glucose rises again.`,
      ],
      example: { problem: `A student eats a large plate of pasta. Over the next 30 minutes her blood glucose rises well above its set point of about 90 mg/dL. Trace the loop that brings it back down, naming the stimulus, receptor, control center, effector, and response — and state which kind of feedback it is.`, solution: `Stimulus: blood glucose above about 90 mg/dL. Receptor/control center: the pancreas. Effector: pancreas releases insulin, acting on body cells and the liver. Response: cells absorb glucose and the liver stores it as glycogen, lowering blood glucose back to the set point. This is negative feedback.` },
      relatedLoIds: ['bio.homeostasis-feedback'],
    },
    {
      title: 'Worked classify loop',
      steps: [
        `Identify the original change: platelets are being activated at the injury site. That is the variable heading in a direction.`,
        `Identify what the response does to that change: each activated platelet recruits MORE platelets. The response pushes the variable further in the direction it was already going.`,
        `Apply the test: a response that REVERSES the change is negative feedback; a response that AMPLIFIES it is positive feedback. Amplifying means this is POSITIVE feedback.`,
        `Check the tell-tale ending: positive loops have no self-shutoff, so something outside the loop must stop them. Here the loop ends when the vessel is sealed — just as the childbirth loop ends at delivery. A negative loop, by contrast, would have slowed itself down as it approached a set point.`,
      ],
      example: { problem: `You cut your finger. Platelets stick to the damaged vessel wall and release chemicals that attract and activate still more platelets, which release more of the same chemicals — until a plug seals the break. Is this negative or positive feedback, and how can you tell without memorizing the example?`, solution: `Positive feedback — the response amplifies the original change (more platelets recruit more platelets) and runs until the outside event of sealing the wound ends it, rather than settling back to a set point.` },
      relatedLoIds: ['bio.homeostasis-feedback'],
    },
  ],
  pointers: [
    { content: `The labels describe what the response DOES to the original change. NEGATIVE feedback opposes the change and restores the set point — sweating, shivering, insulin, glucagon, ADH — and it is the loop that keeps you alive. POSITIVE feedback amplifies the change and drives a process to completion, like childbirth contractions or blood clotting; it is rarer precisely because it cannot maintain anything. Diabetes and heatstroke are not examples of negative feedback being harmful — they are cases where a negative feedback loop has FAILED.`, kind: 'common-error' },
    { content: `Homeostasis = a stable internal environment despite external change, and it is DYNAMIC — the variable oscillates around a set point (about 37°C for core temperature) rather than holding still.`, kind: 'tip' },
    { content: `Every loop runs stimulus → receptor → control center → effector → response. The effector acts; it is not the receptor that detected the change.`, kind: 'tip' },
    { content: `Negative feedback OPPOSES the change and restores the set point: sweating and shivering, insulin and glucagon, ADH and water balance. Negative means opposing, not bad.`, kind: 'tip' },
    { content: `Positive feedback AMPLIFIES the change and runs to completion: childbirth contractions, blood clotting. It is rare because it maintains nothing and needs an outside event to stop it.`, kind: 'tip' },
    { content: `When a loop fails, homeostasis fails — diabetes (glucose loop) and heatstroke (temperature loop) are the classic examples.`, kind: 'tip' },
    { content: `"Negative" and "positive" name the DIRECTION of the response, not its value. Negative = opposes the change (life-sustaining, runs almost everything). Positive = amplifies it. Never write "negative feedback is the bad kind."`, kind: 'vocab-note' },
    { content: `Diabetes and heatstroke are NOT examples of negative feedback harming you — they are cases where a negative feedback loop has FAILED (no insulin/unresponsive cells; sweating overwhelmed past ~40°C). Say "loop failure," not "bad feedback."`, kind: 'common-error' },
    { content: `The stimulus is the CHANGE in the variable, not the outside event that caused it. Write "blood glucose rose above ~90 mg/dL," not "she ate pasta." Same for cold wind vs. core temperature dropping below ~37°C.`, kind: 'common-error' },
    { content: `The effector ACTS; it is not the structure that detected the change. In shivering, the hypothalamus detects and signals but skeletal muscles are the effector. Sweat glands, blood vessels, liver, and kidneys are effectors — not receptors.`, kind: 'gotcha' },
    { content: `The pancreas is a legitimate double-duty answer: beta cells both DETECT high glucose and act as control center, releasing insulin. Don't assume every loop needs a separate brain-based control center — the hypothalamus isn't in every trace.`, kind: 'edge-case' },
    { content: `Classify by mechanism, not by memory: ask "does the response reverse or amplify the original change?" Then check the ending — negative loops slow themselves near the set point; positive loops need an OUTSIDE event (delivery, sealed vessel) to stop.`, kind: 'tip' },
    { content: `Homeostasis is dynamic, not frozen. Core temperature drifts ~36.5–37.5°C and glucose swings after meals — that's the loop working, not failing. Don't describe a healthy variable as "constant" or "stays exactly at the set point."`, kind: 'vocab-note' },
    { content: `Insulin and glucagon are antagonistic — opposite directions on the same variable. Insulin LOWERS glucose (cells absorb, liver stores glycogen); glucagon RAISES it (liver breaks glycogen down). Mixing the names inverts your whole trace.`, kind: 'gotcha' },
  ],
};
