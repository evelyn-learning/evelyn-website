/**
 * AP Macroeconomics — CED Unit 3.6: Changes in the AD-AS Model in the
 * Short Run.
 *
 * Demand-pull vs cost-push inflation, AD shifts on equilibrium, SRAS
 * shifts on equilibrium, and how to predict effects on Y, P, and U from
 * a given shock. Heavy diagram practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_CHANGES_SHORT_RUN: LessonPlan = {
  id: 'evelyn.ap.macro.changes-ad-as-short-run.v1',
  title: 'Changes in the AD-AS Model in the Short Run',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.changes-ad-as-short-run',
      description:
        'Predict short-run effects on real GDP, price level, and unemployment from AD shifts and SRAS shifts; distinguish demand-pull from cost-push inflation.',
      standard: 'AP-MACRO-3.6',
    },
  ],
  prerequisites: ['apmacro.equilibrium-ad-as'],
  followUps: ['apmacro.long-run-self-adjustment'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame this plan as the toolkit for predicting effects.',
      script:
        "Every macro shock — a tax cut, an oil shock, a stock market crash, a productivity boom — can be classified as an AD shift or an SRAS shift. Once classified, you can read the short-run effects directly off the AD-AS graph: real GDP, price level, and unemployment all follow predictable patterns. This plan teaches the prediction.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-changes',
      kind: 'concept',
      goal: 'Cover the short-run effects of AD shifts and SRAS shifts in both directions.',
      keyIdeas: [
        'AD SHIFTS RIGHTWARD (e.g. tax cut, lower interest rates, rising consumer confidence): new equilibrium has HIGHER real GDP and HIGHER price level. Cyclical unemployment FALLS. Inflation rises. This is DEMAND-PULL INFLATION — inflation driven by expanding demand.',
        'AD SHIFTS LEFTWARD (e.g. tax hike, rate hike, falling consumer confidence): new equilibrium has LOWER real GDP and LOWER price level. Cyclical unemployment RISES. Inflation falls (or turns into deflation if severe).',
        'SRAS SHIFTS RIGHTWARD (positive supply shock — e.g. productivity boom, falling oil prices, business tax cuts): new equilibrium has HIGHER real GDP and LOWER price level. Cyclical unemployment FALLS. Inflation falls. The "best of both worlds" — more output AND lower prices.',
        'SRAS SHIFTS LEFTWARD (negative supply shock — e.g. oil price spike, supply chain disruption, business tax hike): new equilibrium has LOWER real GDP and HIGHER price level. Cyclical unemployment RISES. Inflation rises. STAGFLATION — inflation rising while output falls. This is COST-PUSH INFLATION.',
        'DEMAND-PULL vs COST-PUSH INFLATION: both result in higher price level. Difference is in real GDP. Demand-pull: P↑ AND Y↑ (along SRAS). Cost-push: P↑ AND Y↓ (along AD, with SRAS shifted left). Distinguishing the source of inflation matters for policy because the appropriate response differs.',
        'AP DIAGRAM CONVENTION for showing a shift: draw the original curve as a solid line, draw the new curve as a dashed line labeled with a prime (AD\', SRAS\'). Mark old equilibrium (E_0) and new equilibrium (E_1). Show new price level (P_1) and new real GDP (Y_1) with reference lines.',
        'PREDICTION ALGORITHM: (1) classify the shock as AD shift or SRAS shift. (2) determine direction (left or right). (3) read off the new equilibrium\'s effects on Y and P from the diagram. (4) infer effects on UR (cyclical) from change in Y. (5) classify inflation as demand-pull (Y↑) or cost-push (Y↓).',
      ],
      vocabulary: [
        { term: 'demand-pull inflation', definition: 'inflation driven by an AD shift to the right; price level and real GDP both rise.' },
        { term: 'cost-push inflation', definition: 'inflation driven by an SRAS shift to the left; price level rises while real GDP falls (stagflation).' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify-shock',
      kind: 'worked_example',
      problem:
        'For each event, identify (i) which curve shifts, (ii) the direction, (iii) the effect on price level, (iv) the effect on real GDP, and (v) classify the resulting inflation (or deflation) as demand-pull, cost-push, or neither. Events: (a) The U.S. enacts a $500B tax cut. (b) OPEC announces a major oil-supply cutback, doubling world oil prices. (c) A stock market crash wipes out 30% of household wealth.',
      steps: [
        'EVENT (a) "Tax cut $500B": tax cut increases disposable income → C rises (and possibly I if business taxes also reduced). AD SHIFTS RIGHTWARD. New equilibrium: P higher, Y higher. UR falls. Inflation: DEMAND-PULL.',
        'EVENT (b) "Oil price doubles": rising input prices → SRAS SHIFTS LEFTWARD. New equilibrium: P higher, Y LOWER. UR rises. Stagflation. Inflation: COST-PUSH.',
        'EVENT (c) "Stock crash, household wealth -30%": households feel poorer → C falls (wealth effect). AD SHIFTS LEFTWARD. New equilibrium: P lower, Y lower. UR rises. Inflation falls (potentially deflation). Neither demand-pull nor cost-push (this is "demand-pull DOWNWARD" or "deflationary contraction"). Some texts call this deflationary, demand-driven; AP usually accepts "leftward AD shift causing falling P and Y" without a specific label.',
        'INTUITION: each shock has a signature (curve + direction). Once you know the signature, the four effects (P, Y, UR, inflation type) follow mechanically.',
      ],
      answer: '(a) AD right; P↑ Y↑ UR↓ demand-pull inflation. (b) SRAS left; P↑ Y↓ UR↑ cost-push inflation (stagflation). (c) AD left; P↓ Y↓ UR↑ demand-driven deflation.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-effects',
      kind: 'try_yourself',
      problem:
        'For each event, complete this 5-cell table: (curve shifted, direction, effect on Y, effect on P, effect on UR). (a) Government doubles spending on defense. (b) A new immigration law reduces the workforce by 5%. (c) A tax credit increases household consumption.',
      expectedAnswer:
        '(a) "Defense spending doubles": G rises → AD shifts RIGHT. Y↑, P↑, UR↓. Demand-pull inflation. (b) "Immigration reduces workforce 5%": loss of labor input → SRAS shifts LEFT (and LRAS also shifts left in the long run; the short-run effect is on SRAS via reduced labor supply). Y↓, P↑, UR... here it gets subtle. Cyclical UR could fall (smaller labor force, fewer unemployed in absolute terms) but actual UR depends on whether laid-off workers exited the labor force. Standard AP simplification: the leftward SRAS shift creates stagflation-like P↑ Y↓ pattern. (c) "Tax credit raises C": C rises → AD shifts RIGHT. Y↑, P↑, UR↓. Demand-pull.',
      responseFormat: 'free',
      hints: [
        'Identify the affected GDP component (or production cost) first.',
        'AD shifts when C, I, G, or NX changes (non-price-level).',
        'SRAS shifts when input prices, productivity, taxes/subsidies, or expectations change.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-inflation',
      kind: 'try_yourself',
      problem:
        'For each scenario, identify whether the resulting inflation is best classified as DEMAND-PULL, COST-PUSH, or NEITHER (i.e., not inflation). Justify each. (a) Real GDP rose 3.5% AND inflation rose to 5%. The economy was at full employment before. (b) Real GDP fell 1% AND inflation rose to 6%. (c) Real GDP fell 2% AND inflation fell to 1%. (d) Real GDP rose 0.5% AND inflation fell to 1.5%.',
      expectedAnswer:
        '(a) DEMAND-PULL. Both Y and P rose. The economy expanded along SRAS, pushing prices up — classic demand-pull (AD shifted right). (b) COST-PUSH. Y fell while P rose — stagflation pattern. SRAS shifted left. (c) NEITHER (or "demand-driven contraction"). Both Y and P fell — AD shifted left (recession with falling prices). Not inflation at all; inflation is falling. (d) NEITHER (or "positive supply shock"). Y rose modestly while P fell — characteristic of a rightward SRAS shift (productivity gains, falling input prices). Not inflation; in fact, P fell.',
      responseFormat: 'free',
      hints: [
        'Inflation = price level rising. Y direction tells you the source.',
        'Demand-pull: Y and P both rise. Cost-push: Y falls, P rises.',
        'Falling P is not inflation at all; it is disinflation or deflation.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-policy-implication',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. Suppose two countries each face 6% inflation. Country A's inflation is demand-pull (recent rapid AD growth). Country B's inflation is cost-push (recent oil shock). (a) Should the Fed/central bank in each country use the SAME response to fight the inflation? Explain. (b) Why is cost-push inflation harder to address with standard monetary tools?",
      expectedAnswer:
        '(a) NO — the appropriate response differs. In COUNTRY A (demand-pull): the inflation came from AD growing too fast. Tightening monetary policy (raising rates) shifts AD LEFT, reducing both inflation AND output back toward potential. Both effects move the economy back toward long-run equilibrium. The trade-off is short-term pain (slower growth, some increase in UR) for inflation control — generally accepted as worthwhile when the economy was overheating. In COUNTRY B (cost-push from supply shock): the inflation came from SRAS shifting left. The economy is ALREADY in recession-like territory (Y is falling while P rises). Tightening monetary policy reduces inflation by shifting AD left further, but DEEPENS the recession and raises UR more. Loosening policy boosts Y but worsens inflation. Either tool worsens one side of stagflation. (b) Standard monetary tools work by shifting AGGREGATE DEMAND (changing interest rates affects I and C). They cannot shift SRAS — they cannot bring back the lost productive capacity from a supply shock. AD-side tools facing SRAS-side problems force a trade-off between inflation control and output. Real solutions require structural / supply-side measures: easing input constraints, productivity gains, alternative energy sources — none of which the central bank can deliver. Strong answers articulate (i) the source-specific diagnosis matters, (ii) AD tools are mismatched against SRAS shocks, (iii) the trade-off is real and policy must pick a priority.',
      responseFormat: 'frq',
      hints: [
        'Diagnose the source of inflation first.',
        'What would tightening monetary policy do in each case?',
        'Why is one of the two cases a forced trade-off?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AD right: Y↑, P↑, UR↓. Demand-pull inflation.',
        'AD left: Y↓, P↓, UR↑. Demand-driven contraction.',
        'SRAS right: Y↑, P↓, UR↓. Positive supply shock.',
        'SRAS left: Y↓, P↑, UR↑. Cost-push inflation = STAGFLATION.',
        'Demand-pull vs cost-push: same P direction, opposite Y direction.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.6',
    cedTitle: 'Changes in the AD-AS Model in the Short Run',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — short-run AD-AS dynamics, demand-pull vs cost-push.' },
    ],
  },
};
