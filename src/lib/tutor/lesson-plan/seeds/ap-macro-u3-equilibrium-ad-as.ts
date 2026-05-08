/**
 * AP Macroeconomics — CED Unit 3.5: Equilibrium in the AD-AS Model.
 *
 * Short-run vs long-run equilibrium, recessionary vs inflationary gaps,
 * and how to read all this off an AD-SRAS-LRAS diagram.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_EQUILIBRIUM_AD_AS: LessonPlan = {
  id: 'evelyn.ap.macro.equilibrium-ad-as.v1',
  title: 'U3.5 Equilibrium in the AD-AS Model',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.equilibrium-ad-as',
      description:
        'Identify short-run and long-run equilibrium in the AD-AS model, distinguish recessionary gap from inflationary gap, and connect these to cyclical unemployment.',
      standard: 'AP-MACRO-3.5',
    },
  ],
  prerequisites: ['apmacro.long-run-aggregate-supply'],
  followUps: ['apmacro.changes-ad-as-short-run'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the three-curve diagram as a snapshot of the entire economy.',
      script:
        "When economists talk about \"the macroeconomy\" they usually have a specific picture in mind: AD intersecting SRAS to set short-run output and price level, with LRAS lurking nearby to mark where things SHOULD settle in the long run. The relative positions of these three curves tell you whether the economy is in recession, overheating, or balanced.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equilibrium',
      kind: 'concept',
      goal: 'Cover short-run and long-run equilibrium, recessionary and inflationary gaps.',
      keyIdeas: [
        'SHORT-RUN EQUILIBRIUM: where AD intersects SRAS. Determines short-run real GDP and short-run price level. The economy is at this point right now, but it may not be at long-run equilibrium.',
        'LONG-RUN EQUILIBRIUM: where AD, SRAS, and LRAS all intersect at the SAME point. Real GDP equals potential GDP; price level fully reflects all costs and expectations. The economy "wants" to settle here.',
        'THREE POSSIBLE STATES based on the short-run equilibrium\'s relationship to LRAS:',
        '(1) AT LRAS — short-run equilibrium real GDP equals potential. AD ∩ SRAS sits exactly on the LRAS line. The economy is in long-run equilibrium. Cyclical unemployment is zero; actual UR = natural rate.',
        '(2) RECESSIONARY GAP — short-run equilibrium is to the LEFT of LRAS. Actual GDP < potential GDP. Negative output gap. Cyclical unemployment > 0. Actual UR > natural rate. Examples: 2008-09 recession, COVID early 2020.',
        '(3) INFLATIONARY GAP (or expansionary gap) — short-run equilibrium is to the RIGHT of LRAS. Actual GDP > potential GDP. Positive output gap. Cyclical unemployment < 0 (i.e., actual UR < natural rate, economy "running hot"). Inflation pressure builds. Examples: late 1990s tech boom, 2022 post-pandemic.',
        'GAP = ACTUAL GDP − POTENTIAL GDP. Negative in recession, positive in overheating, zero at long-run equilibrium.',
        'IMPORTANT: a recessionary gap does NOT mean GDP is shrinking. It means GDP is BELOW potential. GDP could be growing slowly while still in a recessionary gap. Likewise, an inflationary gap does not require runaway inflation — just operating ABOVE potential capacity, which builds inflationary pressure.',
        'CYCLICAL UE = ACTUAL UR − NATURAL UR. Tracks the same idea on the labor side. Positive in recessionary gap; negative in inflationary gap; zero at long-run equilibrium.',
      ],
      vocabulary: [
        { term: 'short-run equilibrium', definition: 'where AD intersects SRAS — determines current real GDP and price level.' },
        { term: 'long-run equilibrium', definition: 'where AD, SRAS, and LRAS all intersect at the same point.' },
        { term: 'recessionary gap', definition: 'short-run equilibrium below potential GDP; actual GDP < potential.' },
        { term: 'inflationary gap', definition: 'short-run equilibrium above potential GDP; actual GDP > potential.' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-gap',
      kind: 'worked_example',
      problem:
        'An economy reports: potential GDP = $20T, actual GDP = $19.4T, actual UR = 6%, natural UR = 4%. Identify the macroeconomic situation: which type of gap, magnitude in dollars and as a percent of potential, cyclical unemployment, and predicted direction of inflation pressure.',
      steps: [
        'STEP 1 — COMPARE actual to potential: $19.4T vs $20T. Actual < potential → RECESSIONARY GAP.',
        'STEP 2 — GAP MAGNITUDE: actual − potential = $19.4T − $20T = −$0.6T (or $600B below potential).',
        'STEP 3 — AS PERCENT: −$0.6T / $20T × 100 = −3%. The economy is producing 3% below its potential.',
        'STEP 4 — CYCLICAL UNEMPLOYMENT: actual UR − natural UR = 6% − 4% = +2 percentage points. Two percentage points of unemployment beyond what is structural.',
        'STEP 5 — INFLATION PRESSURE: with a NEGATIVE output gap, demand is weaker than long-run supply capacity. Inflation pressure is DOWNWARD. Inflation may slow, plateau, or even turn into deflation if the gap is severe and persistent.',
        'STEP 6 — DIAGRAM (mentally or on the board). AD intersects SRAS at ($19.4T, P_short_run). LRAS is the vertical line at $20T, to the RIGHT of the short-run equilibrium. The horizontal distance from short-run eq to LRAS is the recessionary gap.',
      ],
      answer: 'Recessionary gap. Magnitude: −$0.6T (−3% of potential). Cyclical UE: +2 pp. Inflation pressure: downward.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-three-states',
      kind: 'try_yourself',
      problem:
        'Describe the three possible macroeconomic states (long-run equilibrium, recessionary gap, inflationary gap) in terms of: (i) actual vs potential GDP, (ii) actual vs natural unemployment rate, (iii) inflation pressure direction.',
      expectedAnswer:
        'LONG-RUN EQUILIBRIUM: actual GDP = potential GDP. Actual UR = natural UR (cyclical UE = 0). Inflation pressure: STABLE (no pressure either direction). Economy is at the "right" output level. RECESSIONARY GAP: actual GDP < potential GDP. Actual UR > natural UR (cyclical UE > 0). Inflation pressure: DOWNWARD. Demand is weaker than long-run supply capacity. INFLATIONARY GAP: actual GDP > potential GDP. Actual UR < natural UR (cyclical UE < 0). Inflation pressure: UPWARD. Demand exceeds long-run supply capacity; firms bid up wages and input prices.',
      responseFormat: 'free',
      hints: [
        'For each state, three characteristics: GDP, unemployment, inflation.',
        'They move together in the way you\'d intuit: weak demand → recession + UE up + inflation pressure down.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-graph',
      kind: 'try_yourself',
      problem:
        "An economy is described by: AD ∩ SRAS at real GDP = $5.4T, price level = 110. LRAS sits vertical at $5.0T. (a) Identify the type of gap. (b) State whether the economy is overheating or in recession. (c) Identify the direction of expected long-run self-adjustment in SRAS, and explain why.",
      expectedAnswer:
        '(a) Short-run actual GDP ($5.4T) > potential GDP ($5.0T). Positive output gap → INFLATIONARY GAP. (b) The economy is OVERHEATING — running above potential. Cyclical unemployment is below natural rate; firms are competing aggressively for scarce labor and inputs. (c) SRAS will shift LEFT in long-run self-adjustment. Why? Because at output above potential, labor is scarce → workers demand wage increases → firms\' input costs rise → SRAS shifts left. The new long-run equilibrium emerges where the new SRAS intersects unchanged AD at LRAS — i.e., real GDP returns to $5.0T (potential), but at a HIGHER price level than the original short-run equilibrium. This is how an inflationary gap "self-corrects" without policy intervention, at the cost of higher long-run prices.',
      responseFormat: 'free',
      hints: [
        'Compare actual GDP to potential to identify the gap type.',
        'Overheating means output is above sustainable capacity.',
        'Long-run self-adjustment moves SRAS in the direction that closes the gap toward LRAS.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-policy-relevance',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why does the AD-AS model use BOTH SRAS and LRAS instead of just one supply curve? What policy decisions depend on the distinction?',
      expectedAnswer:
        'The AD-AS model uses both because the SHORT-RUN economy and the LONG-RUN economy behave differently, and policy decisions hinge on which time horizon matters. SRAS captures the short run when wages, prices, and expectations are STICKY — AD shifts can move real GDP because the price-level adjustment doesn\'t fully feed through immediately. LRAS captures the long run when all sticky elements have adjusted — real GDP returns to potential regardless of price-level shifts. Policy implications: (1) FISCAL/MONETARY STIMULUS WORKS in the short run because we are operating along SRAS — AD shifts move real GDP. But in the long run, real GDP returns to LRAS and only the price level remains elevated. So stimulus is appropriate when there is a recessionary gap (LR equilibrium not yet realized) and counterproductive at potential (only causes inflation). (2) STRUCTURAL POLICIES (productivity, education, R&D, deregulation) shift LRAS — they raise potential GDP itself. These are the only policies that produce long-run growth. (3) DIAGNOSING the current gap (SR vs LR) is essential before choosing a tool — a politically attractive stimulus may be exactly wrong if the economy is already at potential. Strong answers articulate the time-horizon distinction, why AD-side and SRAS-side tools are short-run-only, and why structural reforms target LRAS for long-run effects.',
      responseFormat: 'frq',
      hints: [
        'What role does each curve play in the SR vs LR?',
        'Why might a policy that "works" in the short run be useless or harmful in the long run?',
        'Which policies move LRAS, and why are those the long-run-relevant ones?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Short-run equilibrium: AD ∩ SRAS. Long-run equilibrium: AD ∩ SRAS ∩ LRAS.',
        'Recessionary gap: AD∩SRAS LEFT of LRAS. Actual GDP < potential. UR > natural rate.',
        'Inflationary gap: AD∩SRAS RIGHT of LRAS. Actual GDP > potential. UR < natural rate.',
        'AD-side / SRAS-side policies → SR effects only. LRAS shifts → LR growth.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.5',
    cedTitle: 'Equilibrium in the AD-AS Model',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — equilibrium in AD-AS, gap definitions.' },
    ],
  },
};
