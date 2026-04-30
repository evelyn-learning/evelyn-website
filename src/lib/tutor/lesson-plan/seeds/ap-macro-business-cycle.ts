/**
 * AP Macro — Business Cycle and Phillips Curve.
 *
 * Phases of the cycle, output gap, short-run vs long-run Phillips curve.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MACRO_BUSINESS_CYCLE: LessonPlan = {
  id: 'evelyn.ap.macro.business-cycle.v1',
  title: 'Business Cycle and Phillips Curve',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.business-cycle',
      description: 'Identify business cycle phases, distinguish output gaps, and apply the short-run and long-run Phillips curve to inflation-unemployment tradeoffs.',
      standard: 'AP-MACRO-4',
    },
  ],
  prerequisites: ['apmacro.ad-as'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the cycle and the unemployment-inflation tradeoff.',
      script: 'Economies don\'t grow steadily. They expand, peak, contract, trough, then expand again. That\'s the business cycle. And in the short run, fighting one problem (unemployment) often makes the other worse (inflation). The Phillips curve names this tradeoff — and explains why it might disappear in the long run.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cycle-phillips',
      kind: 'concept',
      goal: 'Phases, output gaps, short-run vs long-run Phillips.',
      keyIdeas: [
        'BUSINESS CYCLE PHASES: EXPANSION (rising GDP, falling unemployment), PEAK (top), CONTRACTION / RECESSION (falling GDP, rising unemployment), TROUGH (bottom). RECESSION officially: 2+ quarters of declining real GDP.',
        'OUTPUT GAP: actual GDP minus potential GDP. POSITIVE (boom, above potential, inflation pressure) or NEGATIVE (recession, below potential, unemployment).',
        'NATURAL RATE OF UNEMPLOYMENT: frictional (between jobs) + structural (skill mismatch). The level when economy is at potential. CYCLICAL UNEMPLOYMENT (extra unemployment from a recession) is what fiscal/monetary policy can fix.',
        'FULL EMPLOYMENT does NOT mean zero unemployment — it means natural rate. Currently estimated at ~4-5% for the US.',
        'SHORT-RUN PHILLIPS CURVE (SRPC): downward-sloping. Lower unemployment ↔ higher inflation. Tradeoff exists in the short run because expansionary policy raises both AD-driven inflation and employment.',
        'LONG-RUN PHILLIPS CURVE (LRPC): VERTICAL at the natural rate. No long-run tradeoff. In the long run, expectations adjust and inflation no longer "buys" lower unemployment.',
        'STAGFLATION: high inflation + high unemployment together (1970s). Caused by adverse SUPPLY SHOCKS (oil crisis). Shifts SRAS LEFT, raising both inflation and unemployment. Phillips curve SHIFTS — doesn\'t move along.',
        'EXPECTATIONS: if workers expect inflation, they demand higher wages, raising costs and inflation regardless of policy. This is the mechanism by which the long-run Phillips curve becomes vertical.',
      ],
      vocabulary: [
        { term: 'output gap', definition: 'difference between actual GDP and potential GDP.' },
        { term: 'natural rate of unemployment', definition: 'frictional plus structural unemployment — the rate when the economy is at potential.' },
        { term: 'stagflation', definition: 'simultaneous high inflation and high unemployment, typically from a supply shock.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-phillips',
      kind: 'worked_example',
      problem: 'The economy is at the natural rate of unemployment (5%) with inflation at 2%. The central bank lowers interest rates aggressively. Trace the short-run and long-run effects on the Phillips curve.',
      steps: [
        'SHORT RUN: lower interest rates → AD shifts right → real GDP rises, unemployment FALLS below 5%, but inflation RISES above 2%. Move LEFT and UP along the SRPC.',
        'INTUITION: tight labor market raises wages; firms raise prices to keep margins.',
        'LONG RUN: workers and firms ADJUST EXPECTATIONS. If they expect 4% inflation, they demand 4% wage increases, which firms pay and pass through to prices. SRAS shifts LEFT. SRPC SHIFTS UP.',
        'NEW LR EQUILIBRIUM: unemployment back at 5% (natural rate) but inflation now elevated (say 4%).',
        'CONCLUSION: in the long run, lower unemployment was NOT bought — only inflation was generated. Phillips curve is vertical at natural rate.',
      ],
      answer: 'Short run: tradeoff (unemployment ↓, inflation ↑). Long run: SRPC shifts up; unemployment returns to natural rate; only inflation persists.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A negative supply shock (e.g., oil price spike) hits the economy. What happens to inflation, unemployment, and the SRPC?',
      expectedAnswer: 'Inflation rises AND unemployment rises (stagflation). The SRPC shifts UP and to the right — at every unemployment level, inflation is higher than before.',
      responseFormat: 'free',
      hints: [
        'Supply shock affects which curve in AD-AS?',
        'Both pressures move in the BAD direction simultaneously.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tradeoff-permanent',
      kind: 'misconception_check',
      question: 'Can a country permanently reduce unemployment by accepting moderately higher inflation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating short-run Phillips tradeoff as permanent.',
          correctsTo: 'No — only in the SHORT RUN. In the long run, expectations adjust. Workers demand wages reflecting the higher expected inflation, costs rise, and firms cut hiring back. The long-run Phillips curve is vertical at the natural rate of unemployment. Trying to push below the natural rate for the long run produces accelerating inflation, not lasting low unemployment. This was the lesson of the 1970s.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cycle: expansion → peak → contraction → trough.',
        'Natural rate = frictional + structural. Cyclical unemployment is what policy targets.',
        'SRPC: downward (tradeoff). LRPC: vertical at natural rate (no long-run tradeoff).',
        'Stagflation = supply shock; SRPC shifts up.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does central-bank credibility matter so much for inflation expectations?',
      hint: 'If workers and firms believe the central bank will fight inflation, they don\'t bake high inflation into wage and price expectations. Inflation stays low. If they don\'t trust the bank, expectations drift up and become self-fulfilling. Volcker breaking US inflation in the 1980s was as much about credibility as about interest rates. Central banks publish targets to anchor expectations.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
