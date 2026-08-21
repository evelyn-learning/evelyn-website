/**
 * Grade 7 Science (Life Science) — Body Systems: Homeostasis.
 *
 * Concept-led, and the closing row of Unit 3 (NGSS MS-LS1-3). The lesson
 * teaches the control loop in plain language -- DETECT a change, RESPOND to
 * it, and the response brings the condition back toward its normal range --
 * and then hands the correcting work back to the organ systems from 3.1 to
 * 3.3, so the unit closes on itself.
 *
 * Two things drive every choice here. First, homeostasis is NOT "nothing
 * changes"; it is constant correction back toward a range, and the whole
 * lesson is built to stop students learning the frozen version. Second, the
 * body does not decide, know, want or try. Detect/respond language is used
 * everywhere, and the intent version is named as an error rather than used
 * as a shortcut.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. If a lesson needs a diagram
 * or a table, write it out in prose -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U3_HOMEOSTASIS: LessonPlan = {
  id: 'evelyn.ms.m7sci.homeostasis.v1',
  title: 'Homeostasis: Staying in Balance',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.homeostasis',
      standard: 'M7SCI-3.4',
      description:
        'Explain how a living thing keeps its internal conditions inside a normal range while outside conditions change, by detecting a change and responding in a way that brings the condition back toward normal, and identify which body systems carry out that correcting (NGSS MS-LS1-3).',
    },
  ],
  prerequisites: ['m7sci.respiratory-and-nervous-systems'],
  followUps: ['m7sci.energy-for-living-things'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea that the inside of a body stays steady while the outside swings around.',
      script:
        'Think about a day when you went from a freezing bus stop into a warm classroom, then out to run around at lunch in the sun. The air around you changed by a huge amount. Now think about how you felt inside. A little cold, then a little sweaty, then normal again. Your insides never came close to matching the air outside. Something was correcting you the whole day, and you did not notice any of it happening. That correcting has a name, and today we take it apart and find out exactly how it works.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-homeostasis',
      kind: 'concept',
      goal: 'Define homeostasis, build the detect-respond-return loop in plain language, kill the frozen version and the intent version, and hand the work back to the organ systems of Unit 3.',
      keyIdeas: [
        'HOMEOSTASIS IS KEEPING THE INSIDE STEADY WHILE THE OUTSIDE CHANGES — the temperature of a body, the amount of water in it, and the amounts of oxygen and carbon dioxide in its blood all stay inside a narrow NORMAL RANGE, even when the weather, the exercise and the last meal keep changing. The word is worth saying slowly: home-ee-oh-STAY-sis.',
        'THE LOOP HAS THREE PARTS — DETECT, RESPOND, RETURN. Something DETECTS that a condition has drifted away from its normal range. The body then RESPONDS with an action. That action pushes the condition back toward normal, and once the condition is back in range the response fades away. Every example in this lesson is that same loop with different parts filled in.',
        'STEADY DOES NOT MEAN UNCHANGING, AND THIS IS THE BIG ONE — the condition wobbles all the time. It drifts up, gets corrected, drifts down, gets corrected again. WRONG: "Homeostasis means your body temperature never changes." CORRECT: "Homeostasis means your body temperature keeps getting pulled back toward its normal range whenever it drifts." Human body temperature sits near an average of about 37 degrees Celsius, or about 98.6 degrees Fahrenheit, but the exact value is a little different from person to person and from morning to evening. Correcting back is the point, not holding still.',
        'FOUR EXAMPLES YOU ALREADY KNOW — (1) TOO HOT: the rise in temperature is detected, sweat glands release sweat, the sweat EVAPORATES from the skin, and evaporation carries heat away, so temperature falls back toward normal. (2) TOO COLD: the drop is detected, muscles shiver, and those fast little contractions release energy from food as heat, warming the body back toward normal. (3) LOW ON WATER: the change is detected in the blood, you feel THIRSTY, you drink, and the water level returns toward normal. (4) EXERCISING: muscles use more oxygen and release more carbon dioxide, the rising carbon dioxide in the blood is detected, breathing and heart rate speed up, the extra carbon dioxide is removed and more oxygen is delivered, and the blood returns toward normal. A fifth quick one: in bright light the pupils get smaller, which keeps the amount of light reaching the back of the eye closer to a workable level.',
        'NOTHING IN THE BODY DECIDES ANYTHING — this is the trap that sounds harmless and is not. WRONG: "Your body knows it is too hot, so it decides to sweat." CORRECT: "The rise in temperature is detected, a signal travels to the sweat glands, and the sweat glands release sweat." There is no thinking step anywhere in that sentence. A thermostat is a fair comparison, because it also detects and then switches something on without any thought. But name the limit of the comparison: a person built the thermostat and set the number, while nothing set your body up on purpose and nothing inside you is watching a dial. Use detect and respond. Never use knows, wants, tries or decides.',
        'THE ORGAN SYSTEMS ARE WHAT DO THE CORRECTING — this is where Unit 3 ties together. The nervous system carries the signals fast. The circulatory system moves heat, water, oxygen and carbon dioxide around to where they are needed. The respiratory system changes how much air comes in and out. The digestive system brings in the water and food the whole thing runs on. The skin and the muscles carry out sweating and shivering. Homeostasis is not a separate system; it is the job all of those systems are doing together, all day.',
      ],
      vocabulary: [
        { term: 'homeostasis', definition: 'keeping the conditions inside a living thing inside a normal range while conditions outside it change.' },
        { term: 'normal range', definition: 'the band of values a condition is kept within, rather than one exact value it must hold.' },
        { term: 'response', definition: 'the action that follows a detected change, which pushes the condition back toward its normal range.' },
        { term: 'evaporation', definition: 'liquid water turning into a gas and leaving a surface, which carries heat away from that surface.' },
        { term: 'shivering', definition: 'fast repeated muscle contractions that release energy from food as heat and warm the body.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-sweating',
      kind: 'worked_example',
      problem:
        'A student plays soccer outside on a hot afternoon and starts sweating heavily. Trace the loop that is running: what is detected, what is the response, and what does that response do to the condition? Then explain how sweat actually cools her.',
      steps: [
        'Name the CONDITION being controlled. It is her body temperature, which is kept near a normal range and has started to drift above it.',
        'Name what is DETECTED. Temperature sensors in her skin and inside her body detect that she is warmer than the normal range. The soccer and the hot air are the causes of the change; the detected change itself is the higher temperature.',
        'Name the RESPONSE. Signals travel through the nervous system to the sweat glands in her skin, and those glands release sweat onto the surface of the skin.',
        'Name the RETURN. The sweat evaporates, evaporation carries heat away from her skin, her temperature drops back toward the normal range, and as it does the sweating eases off. The loop switches itself down.',
        'Now the part most people get wrong. WRONG: "The sweat is cold and wet, so it cools her skin by lying on it." CORRECT: "The sweat cools her as it EVAPORATES, because turning liquid water into gas carries heat away from the skin." This is why a hot sticky day where sweat just sits on you feels so much worse. The sweat is there, but very little of it is evaporating, so very little heat is leaving.',
        'One more check on language. Nothing in this loop knew anything or chose anything. A change was detected, a signal traveled, glands released sweat. Detect and respond, start to finish.',
      ],
      answer:
        'The condition is body temperature. The rise above the normal range is detected by temperature sensors, signals travel to the sweat glands, and the response is the release of sweat. The sweat evaporates, evaporation carries heat away from the skin, and her temperature returns toward its normal range. Sweat cools by evaporating, not by being wet.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trace-exercise-breathing',
      kind: 'worked_example',
      problem:
        'The same student sprints the length of the field and her breathing gets much faster and deeper. A friend says this proves homeostasis has failed, because something about her clearly changed. Is the friend right? Trace the loop and answer.',
      steps: [
        'Start with what her muscles are doing. Working muscle cells release energy from food faster than resting ones do. Doing that uses up more oxygen and releases more carbon dioxide into her blood.',
        'Name the CONDITION that is drifting. The amount of carbon dioxide in her blood is rising above its normal range, and the oxygen is being used up quickly.',
        'Name what is DETECTED and what RESPONDS. The rising carbon dioxide in her blood is detected, and signals go to the muscles that drive breathing. Her breathing gets faster and deeper, and her heart beats faster to move the blood around more quickly.',
        'Name the RETURN. More air moving in and out means more carbon dioxide is removed and more oxygen is taken in, and faster blood flow carries both to where they are needed. The blood conditions come back toward their normal range even while she is still running.',
        'Now answer the friend. Her breathing changed, but that IS the response, not a failure. The whole point of the loop is that something visible changes on the outside in order to keep a condition steady on the inside. WRONG: "She changed, so homeostasis broke." CORRECT: "She changed BECAUSE homeostasis is working."',
        'Watch the ending too. A minute after she stops, her breathing slows back down. The response faded once the condition was back in range, which is exactly what a working loop does.',
      ],
      answer:
        'The friend is wrong. Sprinting made her muscles use more oxygen and release more carbon dioxide, the rise in blood carbon dioxide was detected, and the response was faster deeper breathing and a faster heart rate. That response brought her blood conditions back toward the normal range. The visible change in her breathing is the correction at work, not a failure of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-homeostasis-means',
      kind: 'try_yourself',
      problem: 'Which statement describes homeostasis most accurately?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Conditions inside a living thing are held perfectly still and never change at all.' },
        { id: 'b', text: 'A living thing changes its body permanently so that it fits a new environment.' },
        { id: 'c', text: 'Conditions inside a living thing change to match the conditions outside it.' },
        { id: 'd', text: 'Conditions inside a living thing drift, and responses keep bringing them back toward a normal range.', correct: true },
      ],
      expectedAnswer: 'Conditions inside a living thing drift, and responses keep bringing them back toward a normal range.',
      hints: [
        'Your temperature this morning and your temperature after running are not identical numbers. Does that mean homeostasis was not working?',
        'Think about the word range. A range is a band of values, not one exact value, and something keeps pulling the condition back into that band.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-how-sweat-cools',
      kind: 'try_yourself',
      problem: 'Which sentence best explains how sweating helps cool a person down?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sweat washes heat off the surface of the skin as it runs down the body.' },
        { id: 'b', text: 'The sweat is cold when it comes out, so it cools the skin by lying on it.' },
        { id: 'c', text: 'The sweat evaporates from the skin, and evaporation carries heat away from the body.', correct: true },
        { id: 'd', text: 'Sweating makes the skin heavier, which slows the body down so it produces less heat.' },
      ],
      expectedAnswer: 'The sweat evaporates from the skin, and evaporation carries heat away from the body.',
      hints: [
        'Ask what has to happen to the sweat before any cooling occurs. Does sweat sitting on the skin cool you, or does sweat leaving the skin cool you?',
        'Think about a hot sticky day when your sweat just stays on you and you feel awful, compared with a breezy day when sweat dries quickly and you feel better.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shivering-language',
      kind: 'try_yourself',
      problem:
        'A student writes: "When you get cold, your body knows it needs heat, so it decides to shiver." Which sentence describes what is really happening?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cold air shakes the muscles from the outside, and that shaking cools the body even further.' },
        { id: 'b', text: 'Shivering is only a side effect of being cold and has no effect on body temperature.' },
        { id: 'c', text: 'The body wants to be warm, so it chooses to shiver until it feels comfortable enough to stop.' },
        { id: 'd', text: 'The drop in temperature is detected, signals travel to the muscles, and the fast contractions of shivering release heat that warms the body back toward its normal range.', correct: true },
      ],
      expectedAnswer: 'The drop in temperature is detected, signals travel to the muscles, and the fast contractions of shivering release heat that warms the body back toward its normal range.',
      hints: [
        'Two of these describe the body as if it were thinking. Cross out any answer that uses words like knows, wants or chooses, because nothing in a body does those things.',
        'Of the answers left, ask what shivering actually is. Muscles contracting fast is muscle work, and muscle work releases heat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-frozen-and-human-only',
      kind: 'misconception_check',
      question:
        'A student writes: "Homeostasis means your body stays exactly the same all the time. That is why humans need it and other living things do not." What went wrong here?',
      commonErrors: [
        {
          answer: 'Homeostasis means the conditions inside a body stay exactly the same.',
          misconception:
            'Hearing the words balance and steady as meaning frozen, so any change at all looks like homeostasis failing.',
          correctsTo:
            'Conditions inside you are wobbling constantly. You get warmer, then get corrected. You get low on water, then get thirsty and drink. Homeostasis is not the absence of change; it is the CORRECTING that keeps pulling each condition back toward its normal range. A useful test: if a body really held one exact value with nothing ever drifting, there would be nothing to detect and nothing to respond to, and the whole loop would have no work to do. The change is what starts the loop.',
        },
        {
          answer: 'Only humans keep their internal conditions balanced.',
          misconception:
            'Assuming that because the examples in class come from human bodies, the process itself belongs to humans.',
          correctsTo:
            'Every living thing keeps its internal conditions in workable ranges, using whatever it has. A dog pants, and the water evaporating from its mouth and tongue carries heat away, which is the same evaporation idea as sweating. A lizard moves into the sun when it is cool and into the shade when it is hot, so its behavior is the response. A plant short of water closes the tiny pores on its leaves, which slows the water escaping. Different bodies, different responses, same loop: a change is detected, something responds, and the condition comes back toward its range.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Homeostasis = keeping the conditions inside a living thing inside a normal range while conditions outside it change.',
        'The loop is DETECT, RESPOND, RETURN: a change is detected, something responds, and the response pushes the condition back toward normal, then fades.',
        'Steady does not mean unchanging. Conditions wobble constantly and are corrected constantly -- correcting back is the whole idea.',
        'Sweating cools you as the sweat EVAPORATES, not by being wet. Shivering is fast muscle contractions that release heat.',
        'Nothing in a body knows, wants or decides. Say the change was detected and the gland or muscle responded.',
        'The organ systems from this unit -- nervous, circulatory, respiratory, digestive, plus the skin and muscles -- are what carry out the correcting, and every living thing does some version of it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Homeostasis: Staying in Balance' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
