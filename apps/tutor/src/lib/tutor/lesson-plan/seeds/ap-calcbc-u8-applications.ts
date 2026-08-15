/**
 * AP Calculus BC — CED Unit 8.1+8.2+8.3: Applications (avg value, motion
 * from rates, accumulation contexts).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_APPLICATIONS: LessonPlan = {
  id: 'evelyn.ap.calcbc.integral-applications.v1', title: 'U8.1 Average Value, Motion, and Accumulation Applications',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.integral-applications', description: 'Compute the average value of a function via (1/(b-a))·∫_a^b f(x) dx; find total displacement and distance from velocity functions; apply accumulation functions to real-world contexts.', standard: 'AP-CALCBC-8.1-8.3' }],
  prerequisites: ['apcalcbc.logistic-models'], followUps: ['apcalcbc.area-between-curves'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame integrals as accumulators of total quantity.', script: "Want average temperature over a day? Total distance from a velocity function? Net change in population? All three are integrals — averaged or accumulated. Today: integral applications beyond just \"area\".", estimatedMinutes: 2 },
    { id: 'concept-applications', kind: 'concept', goal: 'Cover average value, motion from velocity, accumulation in context.',
      keyIdeas: [
        'AVERAGE VALUE of f on [a, b]: f_avg = (1/(b-a))·∫_a^b f(x) dx.',
        'MEAN VALUE THEOREM FOR INTEGRALS: there exists c in [a, b] with f(c) = f_avg, provided f is continuous.',
        'MOTION: position s, velocity v = s\', acceleration a = v\'.',
        'DISPLACEMENT (signed) from t = a to t = b: ∫_a^b v(t) dt = s(b) − s(a).',
        'TOTAL DISTANCE traveled: ∫_a^b |v(t)| dt. Sum of absolute distances traveled in each direction.',
        'KEY DIFFERENCE: displacement is signed (can be negative); distance is non-negative; they\'re equal only when the particle never reverses direction.',
        'ACCUMULATION FUNCTIONS in context: F(x) = ∫_a^x f(t) dt accumulates the total of f from a to x. f might be a rate (gallons/min), so F is a total (gallons).',
        'INTERPRETATION: ∫_a^b R(t) dt = total amount accumulated from time a to time b at rate R. Critical to include UNITS in answer.',
      ],
      vocabulary: [
        { term: 'average value', definition: '(1/(b-a))·∫_a^b f(x) dx — the constant value with the same total integral.' },
        { term: 'displacement', definition: '∫ v dt — net change in position.' },
        { term: 'total distance', definition: '∫ |v| dt — total path length traveled.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-displacement-distance', kind: 'worked_example', problem: 'A particle moves with v(t) = t² − 4 (m/s) on [0, 3]. (a) Find the displacement. (b) Find the total distance.',
      steps: [
        'STEP 1 — Displacement: ∫_0^3 (t² − 4) dt = [t³/3 − 4t]_0^3 = 9 − 12 = -3 m.',
        'STEP 2 — Total distance: where does v change sign? v = 0 at t² = 4, t = 2 (since t ≥ 0). v < 0 on [0, 2]; v > 0 on [2, 3]. Distance = ∫_0^2 |v| dt + ∫_2^3 v dt = ∫_0^2 (4 − t²) dt + ∫_2^3 (t² − 4) dt. = [4t − t³/3]_0^2 + [t³/3 − 4t]_2^3 = (8 − 8/3) + (9 − 12) − (8/3 − 8) = 16/3 + (-3) + 16/3 = 32/3 − 3 = 32/3 − 9/3 = 23/3 m.',
      ],
      answer: 'Displacement = -3 m; Distance = 23/3 m.', estimatedMinutes: 5 },
    { id: 'try-avg-value', kind: 'try_yourself', problem: 'Find the average value of f(x) = x² + 1 on [0, 3].',
      expectedAnswer: 'f_avg = (1/3)·∫_0^3 (x² + 1) dx = (1/3)·[x³/3 + x]_0^3 = (1/3)·(9 + 3) = (1/3)·12 = 4.',
      responseFormat: 'numeric', hints: ['(1/(b-a))·integral.'], estimatedMinutes: 3 },
    { id: 'try-motion', kind: 'try_yourself', problem: 'A car has v(t) = 4t − t² (mph) on [0, 6]. (a) Displacement; (b) Total distance.',
      expectedAnswer: '(a) ∫_0^6 (4t − t²) dt = [2t² − t³/3]_0^6 = 72 − 72 = 0. Displacement 0 (returns to start). (b) v = 0 at t = 0, 4. v > 0 on (0, 4); v < 0 on (4, 6). Distance = ∫_0^4 v dt + ∫_4^6 -v dt = [2t² − t³/3]_0^4 + [-(2t² − t³/3)]_4^6 = (32 − 64/3) + 0 − (32 − 64/3) − (-72 + 72) ... let me redo: ∫_0^4 (4t − t²) dt = 32 − 64/3 = 96/3 − 64/3 = 32/3. ∫_4^6 (4t − t²) dt = (72 − 72) − (32 − 64/3) = 0 − 32/3 = -32/3. So |∫_4^6| = 32/3. Total distance = 32/3 + 32/3 = 64/3. ≈ 21.33 mi.',
      responseFormat: 'numeric', hints: ['Displacement is the signed integral. Distance breaks at sign changes of v.'], estimatedMinutes: 4 },
    { id: 'try-rate', kind: 'try_yourself', problem: 'AP-style synthesis. Water flows into a tank at rate R(t) = 6t + 2 (gal/hr) for 0 ≤ t ≤ 4. (a) How much water enters in 4 hours? (b) What is the average flow rate over the 4 hours?',
      expectedAnswer: '(a) Total water = ∫_0^4 R dt = ∫_0^4 (6t + 2) dt = [3t² + 2t]_0^4 = 48 + 8 = 56 gal. (b) Avg rate = (1/4)·56 = 14 gal/hr.',
      responseFormat: 'frq', hints: ['Total = ∫ R. Average = total/time.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Avg value: (1/(b-a))·∫_a^b f.',
      'Displacement: ∫ v dt. Total distance: ∫ |v| dt.',
      'Distance = displacement only if v doesn\'t change sign.',
      'Rate × time = total accumulated (with proper units).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8.1-8.3', cedTitle: 'Applications of Integration', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Standard integral applications.' }] },
};
