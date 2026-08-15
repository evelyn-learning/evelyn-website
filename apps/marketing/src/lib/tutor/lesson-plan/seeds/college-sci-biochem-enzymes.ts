/**
 * College Biochemistry — Enzyme Kinetics (Michaelis-Menten).
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_BIOCHEM_ENZYMES: LessonPlan = {
  id: 'evelyn.college.sci.biochem.enzymes.v1',
  title: 'Biochemistry — Enzyme Kinetics and Inhibition',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'biochemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.biochem.enzymes',
      description: 'Apply the Michaelis-Menten equation to interpret Vmax and Km; distinguish competitive, non-competitive, and uncompetitive inhibition by their effect on Vmax and Km.',
      standard: 'COLLEGE-BIOCHEM',
    },
  ],
  prerequisites: ['college.sci.biochem.metabolism'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Most drugs are enzyme inhibitors. Knowing kinetics tells you how to design and dose them.',
      script: 'Statins block HMG-CoA reductase. Aspirin blocks COX. Penicillin blocks transpeptidase. Each is an enzyme inhibitor — and the math of inhibition (Vmax, Km, Ki) tells doctors how potent the drug is and which mechanism it uses. Today: Michaelis-Menten + the three inhibition types.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-enzyme-kinetics',
      kind: 'concept',
      goal: 'M-M equation, Vmax, Km, inhibition types.',
      keyIdeas: [
        'MICHAELIS-MENTEN equation: v = (Vmax × [S]) / (Km + [S]).',
        '  v = initial reaction rate.',
        '  Vmax = MAXIMUM rate (when enzyme is saturated, [S] >> Km).',
        '  Km = substrate concentration at half-Vmax. LOW Km = HIGH affinity (enzyme works at low [S]).',
        'AT [S] = Km: v = Vmax / 2.',
        'AT [S] >> Km: v ≈ Vmax (saturated). Adding more substrate doesn\'t help.',
        'AT [S] << Km: v ≈ (Vmax/Km)[S] — linear in [S].',
        'LINEWEAVER-BURK plot: 1/v vs 1/[S] is a straight line. y-intercept = 1/Vmax. x-intercept = −1/Km. Used historically for visual fitting.',
        'INHIBITION TYPES (memorise effect on Vmax and apparent Km):',
        '  COMPETITIVE: inhibitor binds the active site, competing with substrate. INCREASES apparent Km (need more substrate). Vmax UNCHANGED (high enough [S] outcompetes inhibitor).',
        '  NON-COMPETITIVE: inhibitor binds elsewhere (allosteric), regardless of whether substrate is bound. DECREASES Vmax. Km UNCHANGED.',
        '  UNCOMPETITIVE: inhibitor binds ONLY the enzyme-substrate complex. DECREASES both Vmax and Km (they decrease proportionally).',
        '  MIXED: combines competitive + non-competitive features.',
        'COMPETITIVE inhibitors can be overcome by ↑ [S]. Non-competitive cannot.',
        'IRREVERSIBLE inhibitors covalently bond — kinetics differ entirely (Vmax decreases as more enzyme is killed).',
      ],
      vocabulary: [
        { term: 'Vmax', definition: 'the maximum rate of an enzyme-catalysed reaction, achieved when all enzyme is saturated with substrate.' },
        { term: 'Km', definition: 'substrate concentration at half-Vmax; inversely correlates with enzyme-substrate affinity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Enzyme E has Vmax = 100 μmol/min and Km = 5 mM. What is the reaction rate at [S] = 5 mM, 50 mM, and 0.5 mM?',
      steps: [
        'At [S] = Km = 5 mM: v = Vmax/2 = 50 μmol/min.',
        'At [S] = 50 mM (10× Km): v = (100)(50) / (5 + 50) = 5000/55 ≈ 90.9 μmol/min. Approaching Vmax but not quite saturating.',
        'At [S] = 0.5 mM (Km/10): v = (100)(0.5) / (5 + 0.5) = 50/5.5 ≈ 9.1 μmol/min. Roughly linear regime: v ≈ (Vmax/Km)[S] = 20 × 0.5 = 10. Close to actual 9.1, off slightly because [S] is not negligible.',
        'Pattern: at sub-Km, rate is roughly linear in [S]. At Km, half-max. At 10× Km, ~91% of Vmax.',
      ],
      answer: 'v(5 mM) = 50; v(50 mM) ≈ 90.9; v(0.5 mM) ≈ 9.1 μmol/min.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A drug is added to a reaction. Apparent Km increases from 5 mM to 15 mM, but Vmax stays the same. What kind of inhibitor is it?',
      expectedAnswer: 'Km increases (need more substrate to half-saturate), Vmax unchanged → COMPETITIVE inhibitor. The inhibitor competes with substrate for the active site, but enough substrate can outcompete it (so Vmax is reachable in principle).',
      responseFormat: 'free',
      hints: [
        'Match the Km/Vmax pattern to one of the four inhibitor types.',
        'Competitive: Km up, Vmax same. Non-comp: Vmax down, Km same.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-competitive-vmax',
      kind: 'misconception_check',
      question: 'A student says "competitive inhibitors lower Vmax because they slow the enzyme." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Competitive inhibitor lowers Vmax',
          misconception: 'Confusing the substrate concentration needed to reach Vmax with Vmax itself.',
          correctsTo: 'Competitive inhibitors INCREASE the apparent Km — meaning you need more substrate to reach Vmax. But Vmax itself is UNCHANGED, because at very high [S], substrate outcompetes the inhibitor and saturates the enzyme. Drug effect is qualitatively: same maximum, harder to reach. Non-competitive inhibitors are the ones that lower Vmax (binding elsewhere reduces effective enzyme count regardless of substrate).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'v = Vmax[S] / (Km + [S]). At [S] = Km, v = Vmax/2.',
        'Low Km = high affinity.',
        'Competitive: ↑Km, Vmax unchanged. Outcompete with [S].',
        'Non-competitive: ↓Vmax, Km unchanged.',
        'Uncompetitive: ↓Vmax AND ↓Km.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
