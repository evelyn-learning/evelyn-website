/**
 * AP Macroeconomics — CED Unit 3.7: Long-Run Self-Adjustment.
 *
 * How the economy returns to LRAS without policy intervention via SRAS
 * adjustment. Recessionary gaps close as wages fall (SRAS right);
 * inflationary gaps close as wages rise (SRAS left). The mechanism, the
 * timeline, and the policy debate it generates.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_LONG_RUN_SELF_ADJUST: LessonPlan = {
  id: 'evelyn.ap.macro.long-run-self-adjustment.v1',
  title: 'Long-Run Self-Adjustment',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.long-run-self-adjustment',
      description:
        'Trace the long-run self-adjustment process by which an economy returns to LRAS via SRAS shifts (recessionary gap → wages fall → SRAS right; inflationary gap → wages rise → SRAS left), and articulate the policy debate over whether to wait for self-adjustment or use active stabilization.',
      standard: 'AP-MACRO-3.7',
    },
  ],
  prerequisites: ['apmacro.changes-ad-as-short-run'],
  followUps: ['apmacro.fiscal-policy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame self-adjustment as a real but slow mechanism.',
      script:
        "If the economy enters a recession and the government does NOTHING, what happens? Eventually — as wages fall, prices reset, and expectations catch up — SRAS shifts right and the economy returns to potential GDP. Self-adjustment IS real. But it takes years, sometimes a decade. The policy debate: wait for self-adjustment, or actively shift AD to speed things up?",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-self-adjustment',
      kind: 'concept',
      goal: 'Cover the self-adjustment mechanism for both gap types and the policy implications.',
      keyIdeas: [
        'SELF-ADJUSTMENT FROM A RECESSIONARY GAP: economy at AD ∩ SRAS to the LEFT of LRAS. Cyclical unemployment is high; workers compete for scarce jobs and accept lower wages. Lower wages reduce firms\' costs → SRAS shifts RIGHTWARD. New equilibrium emerges where new SRAS intersects unchanged AD on LRAS. Real GDP returns to potential; price level falls below original.',
        'SELF-ADJUSTMENT FROM AN INFLATIONARY GAP: economy at AD ∩ SRAS to the RIGHT of LRAS. Labor is scarce; workers demand higher wages; firms grant them; firms\' costs rise → SRAS shifts LEFTWARD. New equilibrium emerges where new SRAS intersects unchanged AD on LRAS. Real GDP returns to potential; price level rises above original.',
        'KEY ASYMMETRY: in self-adjustment, real GDP always returns to LRAS. The PRICE LEVEL is what changes. From a recessionary gap, price level falls (deflation in the adjustment). From an inflationary gap, price level rises (further inflation during adjustment).',
        'TIMING: self-adjustment can take years. Sticky wages don\'t adjust quickly downward (workers resist nominal wage cuts); contracts span multiple years; expectations are slow to update. The Great Depression saw real GDP below potential for nearly a decade.',
        'POLICY DEBATE — KEYNESIAN view: self-adjustment is too slow. Workers and businesses suffer in the gap. Active fiscal/monetary policy to shift AD back toward LRAS shortens the adjustment, reducing the human cost. "In the long run, we are all dead" (Keynes).',
        'POLICY DEBATE — CLASSICAL / MONETARIST view: self-adjustment works if given time. Active policy may misfire (lags, political distortions, crowding out, inflation). Better to commit to stable monetary policy and let the economy heal. Some argue active policy creates moral hazard or worsens long-run growth.',
        'AP usually presents both views; questions ask students to TRACE the self-adjustment process accurately and to ARTICULATE the policy trade-off without endorsing one side.',
        'CRITICAL DIAGRAM SKILL: when tracing self-adjustment, draw the SRAS shift (not AD). AD stays put unless policy intervenes. The SRAS shift is the mechanism that closes the gap. New equilibrium is where new SRAS meets unchanged AD on LRAS.',
      ],
      vocabulary: [
        { term: 'long-run self-adjustment', definition: 'the process by which the economy returns to LRAS without policy intervention via SRAS shifts driven by wage and price adjustment.' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-self-adjust-recession',
      kind: 'worked_example',
      problem:
        'An economy enters a deep recessionary gap: AD ∩ SRAS at $14T, with potential GDP = $16T. Trace the long-run self-adjustment process step by step. Describe what happens to wages, SRAS, real GDP, and the price level. Compare to where the economy would land with active policy.',
      steps: [
        'STEP 1 — SHORT-RUN EQUILIBRIUM. AD ∩ SRAS at Y=$14T, output gap = -$2T. Cyclical UE high. Inflation pressure DOWNWARD.',
        'STEP 2 — WAGE ADJUSTMENT BEGINS. With high cyclical unemployment, workers compete for scarce jobs. Wage growth slows; eventually nominal wages fall (slow because of sticky-wage frictions). This may take 1-3 years to show meaningful adjustment.',
        'STEP 3 — SRAS SHIFTS RIGHT. As wages fall, firms\' production costs decline. At any given price level, firms can profitably supply more output. SRAS shifts rightward.',
        'STEP 4 — NEW SHORT-RUN EQUILIBRIUM. New SRAS intersects unchanged AD at higher real GDP and lower price level. The economy moves rightward and downward along the AD curve.',
        'STEP 5 — CONVERGENCE TO LRAS. SRAS keeps shifting right until the new short-run equilibrium reaches LRAS at $16T (potential). At that point, cyclical UE = 0, output = potential. Self-adjustment complete.',
        'STEP 6 — RESULT: real GDP back to $16T. Price level LOWER than the original short-run equilibrium\'s price level. The recession is "paid for" with a lower price level — a difficult outcome for debtors but a relief for cash-holders.',
        'STEP 7 — COMPARISON WITH ACTIVE POLICY. If the government had instead shifted AD right (fiscal stimulus) at the start, the economy would have returned to $16T more quickly and at a HIGHER price level than self-adjustment alone. The trade-off: speed and inflation up vs slow adjustment and lower price level.',
      ],
      answer: 'Self-adjustment via SRAS rightward shift. Final outcome: Y back to potential ($16T), P below original short-run level. Slower than active policy but no inflation cost.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-self-adjust-inflationary',
      kind: 'try_yourself',
      problem:
        'An economy is in an inflationary gap: actual GDP = $5.5T, potential GDP = $5.0T. Trace the long-run self-adjustment process. Describe what happens to wages, SRAS, real GDP, and price level. State the final long-run equilibrium.',
      expectedAnswer:
        'Initial state: AD ∩ SRAS at $5.5T, RIGHT of LRAS at $5.0T. Inflationary gap. Cyclical UE < 0; labor is scarce. Wage adjustment: workers demand higher wages because they are scarce; firms grant them because the alternative is losing workers to competitors. Wages rise. SRAS SHIFTS LEFTWARD as firms\' costs rise. New short-run equilibrium: at lower real GDP and higher price level. SRAS keeps shifting left until the new short-run equilibrium reaches LRAS at $5.0T. Final long-run equilibrium: real GDP = $5.0T (potential). Price level HIGHER than the original short-run equilibrium price. The "self-correction" closes the inflationary gap by raising the price level — output returns to potential, but inflation paid the cost. This is why central banks usually prefer to actively curb inflationary gaps via monetary tightening rather than wait — left alone, the price level keeps rising during adjustment.',
      responseFormat: 'free',
      hints: [
        'Inflationary gap: which direction does SRAS shift in self-adjustment?',
        'What happens to wages first?',
        'Final outcome: what is the relationship of new price level to original?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-direction',
      kind: 'try_yourself',
      problem:
        'For each starting point, state which direction SRAS shifts during long-run self-adjustment AND the resulting price-level change. (a) Recessionary gap. (b) Inflationary gap. (c) Long-run equilibrium (no gap).',
      expectedAnswer:
        '(a) Recessionary gap: SRAS shifts RIGHT. Wages fall (high unemployment forces wage concessions); falling wages reduce production costs; firms supply more at any price; SRAS rightward. Resulting price level: FALLS below original. (b) Inflationary gap: SRAS shifts LEFT. Wages rise (labor scarcity bids up wages); rising wages raise production costs; firms supply less at any price; SRAS leftward. Resulting price level: RISES above original. (c) Long-run equilibrium: NO SHIFT in SRAS. Cyclical UE = 0; wage pressures balanced; SRAS is stable. The economy is already at LRAS.',
      responseFormat: 'free',
      hints: [
        'Self-adjustment moves SRAS in the direction that brings the economy TOWARD LRAS.',
        'In a recession, SRAS must shift right to push real GDP up to potential.',
        'In overheating, SRAS must shift left to pull real GDP down to potential.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-policy-debate',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Country A enters a deep recessionary gap. The Keynesian view says government should act now with stimulus. The Classical view says government should wait for self-adjustment. (a) Articulate the Keynesian argument. (b) Articulate the Classical argument. (c) Identify ONE specific consideration that a real-world policymaker would weigh in deciding between the two approaches.',
      expectedAnswer:
        '(a) KEYNESIAN: self-adjustment via SRAS rightward shift takes years (Great Depression: nearly a decade). During that time, real human suffering accumulates: unemployed workers lose savings and dignity; output below potential is permanently lost; potential output may even fall (long-term unemployment erodes skills, hysteresis). Active fiscal/monetary stimulus shifts AD right, returning the economy to potential MUCH faster. The cost (slightly higher price level / inflation) is small relative to the gain in output and reduced unemployment. Keynes: "in the long run, we are all dead" — meaning waiting for self-adjustment without action ignores the present cost. (b) CLASSICAL: self-adjustment WORKS if given time. Active policy may MISFIRE due to (i) lags — by the time stimulus hits, the economy may have already self-corrected, causing overshoot and inflation; (ii) political distortions — once the precedent is set, governments overuse stimulus, causing chronic deficits and inflation; (iii) crowding out — government borrowing drives up rates, reducing private I and offsetting the stimulus; (iv) moral hazard — bailouts encourage risk-taking. Better to maintain stable monetary policy and let markets clear. (c) ONE SPECIFIC CONSIDERATION: depth and persistence of the recession; whether financial markets are functioning (a banking crisis dramatically slows self-adjustment, strengthening the Keynesian case); the political viability of running a fiscal deficit; the central bank\'s inflation credibility; whether structural problems are present that AD policies cannot fix. Strong answers explicitly state both views, give a specific real-world consideration, and note that the right answer is context-dependent — not universally Keynesian or Classical.',
      responseFormat: 'frq',
      hints: [
        'Both views recognize self-adjustment exists; they differ on speed and policy choice.',
        'What are the costs of waiting? What are the costs of acting?',
        'Real-world considerations: depth, financial system, lags, credibility.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Self-adjustment works through SRAS shifts (NOT AD).',
        'Recessionary gap → wages fall → SRAS right → return to LRAS at LOWER P.',
        'Inflationary gap → wages rise → SRAS left → return to LRAS at HIGHER P.',
        'Real GDP always returns to potential. Only the price level changes.',
        'Keynesian: self-adjust too slow, intervene. Classical: self-adjustment works, wait.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.7',
    cedTitle: 'Long-Run Self-Adjustment',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — long-run self-adjustment via wage flexibility.' },
    ],
  },
};
