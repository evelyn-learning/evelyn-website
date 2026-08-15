/**
 * AP Macroeconomics — CED Unit 1.3: Production Possibilities Curve.
 *
 * Builds on scarcity (1.1) and resource allocation (1.2) by visualizing
 * the trade-off as a curve. The PPC is the workhorse diagram for
 * scarcity, opportunity cost, efficiency, and growth — every later unit
 * uses some variant.
 *
 * Higher-density plan per the AP Plans Initiative Q1 follow-up: PPC
 * carries multiple distinct AP question-types (read points off the
 * curve, compute opportunity cost, interpret shifts, distinguish
 * bowed-out from linear). Four try-yourselfs.
 *
 * Uses the new `production_possibilities` structured diagram kind
 * (catalog/kinds/economics.ts) authored alongside this plan per Q7.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_PPC: LessonPlan = {
  id: 'evelyn.ap.macro.ppc.v1',
  title: 'U1.3 Production Possibilities Curve',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.ppc',
      description:
        'Read points off a production possibilities curve, compute opportunity cost between two points, interpret shifts (growth or contraction), and distinguish bowed-out (increasing OC) from linear (constant OC) curves.',
      standard: 'AP-MACRO-1.3',
    },
  ],
  prerequisites: ['apmacro.scarcity', 'apmacro.resource-allocation'],
  followUps: ['apmacro.comparative-advantage'],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make trade-offs visual and concrete.',
      script:
        "An economy can make computers and wheat. With all its workers, it can make 100 computers OR 200 bushels of wheat OR any combination in between. But not 100 AND 200 — there are not enough workers for both. We can DRAW that constraint. The curve we draw is the most-used picture in macroeconomics: it shows every choice the economy can make, and every choice it can't.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ppc',
      kind: 'concept',
      goal: 'Cover what the PPC is, the three regions (inside/on/outside), opportunity cost reading, shape, and shifts.',
      keyIdeas: [
        'PRODUCTION POSSIBILITIES CURVE (PPC): a graph showing the maximum combinations of two goods an economy can produce given its current resources and technology. X-axis = one good; Y-axis = the other. The endpoints show the maximum of each good if all resources go to that one.',
        'POINTS ON the curve: efficient. The economy is using all its resources fully — it cannot make more of one good without making less of the other.',
        'POINTS INSIDE the curve: INEFFICIENT. The economy is wasting resources — unemployed workers, idle factories, or production inefficiency. It could produce more of BOTH goods just by using existing resources better.',
        'POINTS OUTSIDE the curve: UNATTAINABLE with current resources and technology. Reaching them requires either more resources (workforce growth, capital investment) or better technology.',
        'OPPORTUNITY COST FROM A PPC: moving from one point ON the curve to another. The amount of one good given up is the opportunity cost of the additional units of the other good. Slope of the curve at a point ≈ opportunity cost of the X-good in terms of the Y-good.',
        'BOWED-OUT shape: the typical PPC is concave (bowed out from origin) because resources are NOT EQUALLY SUITED to producing both goods. As you produce more of good X, you must use resources less and less suited to X — opportunity cost RISES. This is the LAW OF INCREASING OPPORTUNITY COST.',
        'LINEAR (straight-line) PPC: occurs when resources ARE equally suited to both goods (or when only one resource matters). Constant opportunity cost. AP problems often use linear PPCs to make the arithmetic clean — be ready for both shapes.',
        'RIGHTWARD SHIFT (whole curve moves out): ECONOMIC GROWTH. Drivers: more resources (population, capital, land), better technology, better human capital. Now points formerly outside the curve become attainable.',
        'LEFTWARD SHIFT (whole curve moves in): contraction. War destruction, natural disaster, mass emigration, capital depreciation outpacing investment.',
        'BIASED SHIFT (one axis stretches, the other does not): a resource or technology improvement specific to one good. E.g. better farming tech shifts the wheat-axis intercept out but not the computer-axis.',
      ],
      vocabulary: [
        { term: 'production possibilities curve', definition: 'a graph showing the maximum output combinations of two goods given fixed resources and technology.' },
        { term: 'productive efficiency', definition: 'producing on the PPC — no wasted resources.' },
        { term: 'increasing opportunity cost', definition: 'the bowed-out shape: as you produce more of one good, the opportunity cost of additional units rises.' },
      ],
      suggestedTools: ['production_possibilities'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ppc-economy',
      kind: 'worked_example',
      problem:
        "An economy produces computers and wheat. Its PPC has these maximum endpoints: 100 computers (if all resources go to computers) or 200 bushels of wheat. The PPC is bowed out (increasing opportunity cost). Three points are observed: A = (40, 150), B = (40, 100), C = (90, 80). Identify each point's region and compute the opportunity cost of moving from A to C (in wheat-per-computer).",
      steps: [
        'STEP 1 — DRAW or visualize the PPC. The curve runs from (0, 200) on the wheat axis to (100, 0) on the computer axis, bowing outward. (The whiteboard tool can render this from xAxis={Computers, 100}, yAxis={Wheat, 200}, curve=bowed-out, points=[A,B,C].)',
        'STEP 2 — CLASSIFY each point. A = (40, 150): is 150 wheat above or below the curve at x=40? For a bowed-out curve, y at x=40 ≈ 200·√(1-(40/100)²) = 200·√0.84 ≈ 183. Since 150 < 183, A is INSIDE the curve — INEFFICIENT.',
        'STEP 3 — Classify B = (40, 100). At x=40 the curve is ≈183. 100 < 183, so B is also INSIDE — even more inefficient than A.',
        'STEP 4 — Classify C = (90, 80). At x=90 the curve is ≈ 200·√(1-0.81) = 200·√0.19 ≈ 87. C\'s y = 80 < 87, so C is also INSIDE (just barely). Note: AP problems often place at least one point ON the curve. Here all three are inside, which is plausible if the economy has unemployment.',
        'STEP 5 — OPPORTUNITY COST FROM A TO C. Moving from A=(40,150) to C=(90,80): computers gained = 90-40 = 50. Wheat lost = 150-80 = 70. Opportunity cost of 50 computers = 70 wheat. Per computer: 70/50 = 1.4 wheat per computer.',
        'STEP 6 — INTERPRET. To gain 50 more computers, the economy gives up 70 wheat — an opportunity cost of 1.4 wheat per computer. (NOTE: this average opportunity cost is a chord between two points; on a bowed-out curve, the marginal opportunity cost VARIES along the curve. AP usually asks for chord-based averages unless the problem specifies otherwise.)',
        'STEP 7 — CHECK FOR EFFICIENCY. Both A and C are inside the curve, so neither is efficient. The economy could move to C\' = (90, 87) on the curve and gain 7 more wheat at the same computer level — a free improvement that exposes the inefficiency.',
      ],
      answer:
        'A, B, C all inside the curve (inefficient). Opportunity cost of moving A→C: 1.4 wheat per computer (50 computers gained costs 70 wheat).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-regions',
      kind: 'try_yourself',
      problem:
        'In one or two sentences each, explain what each of these PPC regions means for an economy: (a) a point ON the curve; (b) a point INSIDE the curve; (c) a point OUTSIDE the curve.',
      expectedAnswer:
        'ON the curve: the economy is productively efficient — using all resources fully. To produce more of one good it must produce less of the other. INSIDE the curve: inefficient — resources are wasted (unemployment, idle capacity). The economy could produce more of BOTH goods without any new resources. OUTSIDE the curve: unattainable with current resources and technology. Reaching outside-points requires either growth (more resources) or better technology.',
      responseFormat: 'free',
      hints: ['Each region tells you something about whether resources are being used fully and whether the combination is currently feasible.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-linear-ppc',
      kind: 'try_yourself',
      problem:
        'A linear (straight-line) PPC has endpoints (0, 60) on the y-axis (wheat) and (30, 0) on the x-axis (computers). (a) What is the opportunity cost of 1 computer? (b) What is the opportunity cost of 1 wheat? (c) Is opportunity cost on this PPC constant or rising as production shifts toward computers?',
      expectedAnswer:
        '(a) Going from 0 computers to 30 computers gives up all 60 wheat → 60/30 = 2 wheat per computer. (b) Reciprocal: 30/60 = 0.5 computers per wheat. (c) CONSTANT. A linear PPC has constant slope, so opportunity cost is constant — every additional computer costs exactly 2 wheat regardless of how many computers are already being produced. This is the special case where resources are equally productive in both goods (or only one undifferentiated resource matters).',
      responseFormat: 'numeric',
      hints: [
        'Slope of a line = rise / run. Compute the trade-off across the full axis.',
        'Constant slope means constant opportunity cost.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-shift',
      kind: 'try_yourself',
      problem:
        "An economy's PPC originally has endpoints (50, 0) computers and (0, 100) wheat. After a productivity-boosting technology is invented for FARMING ONLY, the wheat endpoint rises to 150 but the computer endpoint stays at 50. (a) Sketch (or describe) the new PPC. (b) Has the economy experienced 'growth'? (c) What kind of point — formerly outside the original curve — is now attainable, and what kind is still not?",
      expectedAnswer:
        '(a) New PPC: still passes through (50, 0) on the computer axis but now reaches (0, 150) on the wheat axis. The whole curve in between rotates outward on the wheat side. (b) Yes — this is a BIASED form of growth: only the wheat side improved, not the computer side. The economy can produce more of EVERY combination that involves any wheat, since the wheat-axis endpoint moved out. (c) Now-attainable: any point that was outside the original because it required more wheat than the original max — e.g. (20, 130) was unattainable but is now reachable. Still-not-attainable: anything requiring more than 50 computers, since the computer endpoint did not move.',
      responseFormat: 'free',
      hints: [
        'The shift is asymmetric — only the wheat side moves.',
        'Growth = the curve moves out (in this case partially).',
        'Anything requiring computers > 50 is still impossible.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-shape-why',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why are most PPCs drawn as bowed-out (concave) curves rather than straight lines? Use the concept of resource specialization in your answer.',
      expectedAnswer:
        "PPCs are bowed-out because resources are NOT EQUALLY SUITED to producing both goods. As an economy shifts production from good Y to good X, it first uses the resources BEST suited to X (most productive at X). To produce ever more X, the economy must redirect resources progressively LESS suited to X (better at Y). Each additional unit of X comes at a higher cost in foregone Y — the opportunity cost RISES. This is the LAW OF INCREASING OPPORTUNITY COST. A straight-line (constant-OC) PPC is the special case where all resources are equally productive in both goods — the boundary case rather than the typical case. Strong answers explicitly cite (a) resource heterogeneity, (b) ordering of resource use from best-fit to worst-fit, (c) rising marginal opportunity cost as the geometric consequence.",
      responseFormat: 'frq',
      hints: [
        'Are workers equally good at every job? Is land equally good for every crop?',
        'When you shift production toward more X, which resources do you redirect first?',
        'How does that ordering shape the opportunity cost?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-inside-vs-outside',
      kind: 'misconception_check',
      question:
        'A point INSIDE the PPC is sometimes described as "wasteful" while a point OUTSIDE the PPC is "ambitious." A student says: "Inside means we are doing too little, outside means we are doing too much." Is this right?',
      commonErrors: [
        {
          answer: 'yes — too little vs too much',
          misconception:
            'Treating inside vs outside as a "do less vs do more" axis. The actual distinction is feasibility: inside is feasible-but-wasteful, outside is currently infeasible.',
          correctsTo:
            'NOT QUITE. INSIDE the curve = feasible but NOT EFFICIENT. The economy is producing less of both goods than it COULD given its resources — likely because of unemployment or unused capacity. The fix is using existing resources better, not adding more. OUTSIDE the curve = NOT FEASIBLE right now. The economy literally cannot reach those combinations with current resources and technology. The fix is growth (more resources or better technology). "Doing too much" is the wrong framing — outside-points aren\'t aspirational over-effort, they\'re currently impossible. AP loves to test this distinction; precise language matters.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PPC shows max output combinations of two goods. ON = efficient, INSIDE = inefficient (waste), OUTSIDE = unattainable now.',
        'Opportunity cost between two points = (good given up) / (good gained).',
        'Bowed-out PPC = increasing opportunity cost (resources not equally suited to both goods).',
        'Straight-line PPC = constant opportunity cost (resources equally productive).',
        'Rightward shift = growth. Biased shift = improvement in one good only.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.3',
    cedTitle: 'Production Possibilities Curve',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '2', note: 'OpenStax Ch 2 — PPC framing, increasing opportunity cost, growth via PPC shift.' },
    ],
  },
};
