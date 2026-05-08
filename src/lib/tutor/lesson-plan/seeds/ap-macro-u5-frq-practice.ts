/**
 * AP Macroeconomics — Unit 5 FRQ Practice.
 *
 * Three multi-part FRQs covering Phillips Curve dynamics, money growth
 * + inflation, and long-run crowding-out + supply-side policy.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u5-frq-practice.v1',
  title: 'U5 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u5-frq-practice',
      description:
        'Apply Unit 5 concepts (Phillips Curve, Quantity Theory, debt sustainability, long-run crowding-out, growth drivers, supply-side policies) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-MACRO-5-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.phillips-curve',
    'apmacro.money-growth-inflation',
    'apmacro.deficits-debt',
    'apmacro.crowding-out-long-run',
    'apmacro.economic-growth',
    'apmacro.public-policy-growth',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 5 FRQ stakes — long-run thinking is the focus.',
      script:
        "Unit 5 FRQs test long-run thinking: how do policies that look attractive in the short run play out over decades? Three problems: a Phillips Curve dynamics question, a Quantity Theory inflation calculation, and a synthesis question on long-run growth.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on Unit 5 calculation conventions.',
      keyIdeas: [
        'PHILLIPS CURVE FRQs: SRPC slopes DOWN; LRPC is VERTICAL at NAIRU. Inflation expectations shift SRPC up/down. Long-run equilibrium always at NAIRU.',
        'QUANTITY THEORY FRQs: %ΔP ≈ %ΔM − %ΔQ (assuming V constant). Inflation = money growth − real GDP growth.',
        'DEBT-TO-GDP FRQs: ratio = debt / GDP × 100. Sustainable if debt growth ≤ GDP growth.',
        'GROWTH FRQs: name the source (K, L, H, T) the policy affects. LRAS shift direction follows from the source.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-phillips',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 1 — Phillips Curve Dynamics. The economy is initially at long-run equilibrium with NAIRU = 5% and inflation = 2%. The central bank attempts to lower unemployment to 3% via expansionary monetary policy. (a) On the Phillips Curve, identify the SHORT-RUN movement. (b) Identify what happens to inflation expectations as the policy continues. (c) Identify the new SHORT-RUN Phillips Curve position after expectations adjust. (d) Identify the LONG-RUN equilibrium unemployment rate and the long-run inflation rate. (e) Briefly explain why this episode illustrates 'no long-run trade-off' between unemployment and inflation.",
      expectedAnswer:
        '(a) SHORT-RUN: expansionary monetary policy shifts AD right; on the SRPC the economy moves UP-LEFT. UR falls to 3%; inflation rises (above 2%, moving along the existing SRPC consistent with 2% expected inflation). (1.5 points)\n(b) Inflation EXPECTATIONS RISE. Workers and firms see actual inflation rising and adjust their expectations upward. (1 point)\n(c) NEW SRPC: shifts UP/RIGHT. At every UR, inflation is higher than before. The SRPC re-anchors at the higher inflation expectations. (1.5 points)\n(d) LONG-RUN: unemployment returns to NAIRU at 5% (because LRPC is vertical at 5%). Inflation is permanently HIGHER than original 2% (the price level was raised during the disequilibrium and expectations re-anchored at the higher level). Specific number depends on policy details, but greater than 2%. (2 points: 1 for UR back to NAIRU, 1 for higher long-run inflation)\n(e) NO long-run trade-off: the central bank achieved a temporary 2-point reduction in UR (from 5% to 3%) at the cost of permanently higher inflation. Once expectations adjusted, UR returned to NAIRU. The policy bought temporary UR reduction with permanent inflation increase — a net loss in the long run. The vertical LRPC mechanically forces UR back to NAIRU regardless of monetary policy choices in the long run. Strong answers explicitly: (i) note the temporary UR gain, (ii) note the permanent inflation cost, (iii) connect to the LRPC verticality. (2 points)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Move along SRPC for short-run answer; SRPC shifts up as expectations adjust.',
        'LRPC is vertical at NAIRU — long-run UR returns there.',
        'Long-run cost of the policy is permanent inflation.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-quantity-theory',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — Quantity Theory + Inflation. Country Y's central bank reports the following long-run conditions: nominal GDP grows 8% per year. Real GDP grows 2% per year. (a) Compute the country's long-run inflation rate. (b) State the equation of exchange and the assumption needed to derive part (a). (c) Suppose velocity (V) UNEXPECTEDLY increases by 4% over the next year while M grows 6% and Q grows 2%. Compute the resulting inflation rate. (d) Describe the policy implications for a central bank trying to achieve a stable 2% inflation target.",
      expectedAnswer:
        '(a) Inflation = nominal GDP growth − real GDP growth = 8% − 2% = 6%. (1 point)\n(b) M × V = P × Q. Growth-rate version: %ΔM + %ΔV ≈ %ΔP + %ΔQ. ASSUMPTION needed for (a): velocity is approximately CONSTANT (%ΔV ≈ 0). With this assumption, %ΔP ≈ %ΔM − %ΔQ. (2 points: 1 for equation, 1 for assumption)\n(c) %ΔP ≈ %ΔM + %ΔV − %ΔQ = 6% + 4% − 2% = 8% inflation. The unexpected V increase boosts inflation by 4 pp above what M growth alone would predict. (2 points: 1 for setup, 1 for correct number)\n(d) POLICY IMPLICATIONS: (i) the central bank needs to monitor V, not just M. If V rises unexpectedly, M growth becomes more inflationary than the simple Quantity Theory predicts. (ii) The CB may need to target inflation directly rather than money growth — adjust M growth in response to observed inflation, not pre-set rules. (iii) MODERN CENTRAL BANKING: most modern central banks target an inflation rate (e.g., 2%) rather than a money-growth rate, partly because V instability has made simple money-growth rules unreliable. (iv) BLUNT INSTRUMENT: even with inflation targeting, V shocks make precise control difficult; central banks aim for "approximately on target" over multi-year windows. Strong answers cite both the limitation of simple money-growth rules AND the modern shift to inflation targeting. (2 points)\nTotal: 7 points.',
      responseFormat: 'numeric',
      hints: [
        'Inflation = M growth + V growth − Q growth (general form).',
        'Assumption: V constant for simple version.',
        'Modern CBs target inflation directly, not M.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-growth-policy',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — Long-Run Growth + Policy. Country Z is considering two budget-equivalent policies to promote long-run growth: (i) a $200B per year tax cut targeting business investment, OR (ii) $200B per year additional spending on R&D, university research, and STEM education. Both are deficit-financed for the next 10 years. (a) Identify the GROWTH SOURCE each policy primarily targets. (b) Predict the effect on LRAS for each. (c) Predict the LONG-RUN CROWDING-OUT effect of the deficit financing for each. (d) State which policy has a HIGHER expected return and justify your choice using one specific argument.",
      expectedAnswer:
        '(a) (i) "Business tax cut": primarily targets PHYSICAL CAPITAL (firms invest more in equipment / facilities) and possibly TECHNOLOGY (firms can afford R&D). (ii) "R&D + university + STEM": primarily targets TECHNOLOGY (basic research, applied innovations) and HUMAN CAPITAL (skilled workforce). (1.5 points)\n(b) BOTH shift LRAS RIGHT, but at DIFFERENT speeds. (i) Tax cut: faster effect on K (2-5 years for firms to deploy investments); LRAS shifts right gradually. (ii) R&D + education: SLOWER effect (basic research takes 10+ years to commercialize; education effects on workforce take 15-25 years), but typically larger eventual TFP and human-capital gains. (1.5 points)\n(c) BOTH policies are deficit-financed; both produce long-run crowding-out via the loanable funds market. (i) The tax cut\'s direct effect is to encourage MORE private investment via lower after-tax returns; the deficit-financing CROWDS OUT some private I via higher real rates. The two effects partially OFFSET each other; net effect on private I is uncertain — could be net positive or negative. (ii) The R&D/education spending does not directly compete with private I; the deficit-financing does crowd out some I via rates. Net effect on private I: unambiguously negative in the short-medium run, but the long-run TFP gains may produce LARGER GDP than would have happened with the displaced I — depending on relative productivity. (2 points)\n(d) HIGHER EXPECTED RETURN: this is a judgment call. Strong arguments for either side: ARGUMENT FOR R&D + EDUCATION: TFP is the largest source of long-run growth in advanced economies (~50% of growth historically); R&D and education target this source directly. Empirical literature on returns to public R&D and education investment shows high social returns. Tax cuts at typical U.S. rates have weaker empirical track record (don\'t pay for themselves; mostly benefit existing capital owners). LONG LAG of education-investment effects is offset by very long-lived benefits (workforce contribution over 40+ years). ARGUMENT FOR TAX CUT: faster effect; markets allocate capital better than government; less prone to political distortions. Strong answers explicitly choose ONE, justify with at least one specific argument (cite empirical literature, mechanism, or growth-accounting logic), and acknowledge the trade-off. (3 points)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Identify which growth source each policy targets.',
        'Both shift LRAS but at different speeds.',
        'Crowding-out: deficit financing matters for both.',
        'Empirical track record: tax cuts vs R&D/education.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Phillips Curve: SRPC down, LRPC vertical at NAIRU. Long run, no UE-inflation tradeoff.',
        'Quantity Theory: inflation ≈ M growth − Q growth (V constant).',
        'Debt-to-GDP sustainability: debt growth ≤ GDP growth.',
        'Long-run crowding-out: persistent deficits → I down → capital stock smaller → LRAS slower.',
        'Growth sources: K, L, H, T. TFP is the biggest driver in advanced economies.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-FRQ',
    cedTitle: 'Unit 5 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on past AP Macro Unit-5 patterns.' },
    ],
  },
};
