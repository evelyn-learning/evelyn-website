/**
 * AP Calculus BC — CED Unit 4.4+4.5: Related Rates (combined intro +
 * problem-solving).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_RELATED_RATES: LessonPlan = {
  id: 'evelyn.ap.calcbc.related-rates.v1',
  title: 'U4.4 Related Rates',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.related-rates',
      description:
        'Set up and solve related-rates problems by identifying related quantities, writing an equation relating them, differentiating implicitly with respect to time, and solving for the desired rate.',
      standard: 'AP-CALCBC-4.4-4.5',
    },
  ],
  prerequisites: ['apcalcbc.straight-line-motion'],
  followUps: ['apcalcbc.linearization'],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame related rates as solving for one unknown rate from a known rate.',
      script:
        "If a balloon's volume is increasing at 10 cm³/s, how fast is its radius changing? If a ladder slides down a wall, how fast does the foot move when the top is at a certain height? Both are RELATED RATES problems — and they all follow the same 5-step recipe. AP exam questions test this every year.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-recipe',
      kind: 'concept',
      goal: 'Cover the standard 5-step recipe with examples.',
      keyIdeas: [
        '5-STEP RELATED-RATES RECIPE:',
        '(1) IDENTIFY all relevant variables (and which one\'s rate you know vs which you want). Draw a picture if geometric.',
        '(2) WRITE AN EQUATION relating the variables. Often a geometric formula (Pythagorean, area, volume) or a physical relationship.',
        '(3) DIFFERENTIATE both sides with respect to TIME (t), applying chain rule wherever a variable depends on t. So d/dt[V] = dV/dt, d/dt[r²] = 2r · dr/dt, etc.',
        '(4) PLUG IN the known values for variables and the known rate. CRITICAL: substitute values AFTER differentiating, never before.',
        '(5) SOLVE for the unknown rate.',
        'COMMON SETUP — VOLUME OF A SPHERE. V = (4/3)πr³. dV/dt = 4πr² · dr/dt. Given dV/dt and r, solve for dr/dt.',
        'COMMON SETUP — RIGHT TRIANGLE (sliding ladder). x² + y² = L² (constant L). Differentiate: 2x · dx/dt + 2y · dy/dt = 0. Given dy/dt and current x, y, solve for dx/dt.',
        'COMMON SETUP — SIMILAR TRIANGLES (shadow problems). Set up the proportion, then differentiate.',
        'TYPICAL ERROR: substituting values BEFORE differentiating. If x = 3 is plugged in early, the derivative loses the x-dependence and becomes wrong. Differentiate FIRST, plug in LAST.',
      ],
      vocabulary: [
        { term: 'related rates', definition: 'a problem where the rate of change of one variable is sought, given the rate of change of a related variable.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-balloon',
      kind: 'worked_example',
      problem:
        'A spherical balloon is being inflated at a rate of 100 cm³/sec. How fast is the RADIUS increasing when the radius is 5 cm?',
      steps: [
        'STEP 1 — IDENTIFY. V = volume, r = radius. Known: dV/dt = 100 cm³/s, r = 5 cm. Want: dr/dt at this instant.',
        'STEP 2 — EQUATION. V = (4/3)πr³.',
        'STEP 3 — DIFFERENTIATE w.r.t. t. dV/dt = 4πr² · dr/dt.',
        'STEP 4 — PLUG IN. 100 = 4π(25) · dr/dt = 100π · dr/dt.',
        'STEP 5 — SOLVE. dr/dt = 100/(100π) = 1/π ≈ 0.318 cm/s.',
        'STEP 6 — UNITS check. dr/dt = (cm³/s) / (cm²) = cm/s. ✓',
      ],
      answer: 'dr/dt = 1/π ≈ 0.318 cm/s when r = 5.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-ladder',
      kind: 'try_yourself',
      problem:
        'A 13-foot ladder leans against a wall. The bottom slides AWAY from the wall at 2 ft/s. How fast is the TOP sliding DOWN when the bottom is 5 ft from the wall?',
      expectedAnswer:
        'Let x = distance bottom from wall, y = height of top. x² + y² = 13² = 169. Differentiate: 2x·dx/dt + 2y·dy/dt = 0, or x·dx/dt + y·dy/dt = 0. When x = 5, y = √(169 − 25) = √144 = 12. dx/dt = 2. Solve: 5(2) + 12·dy/dt = 0 → dy/dt = -10/12 = -5/6 ft/s. NEGATIVE means y is decreasing. Top is sliding down at 5/6 ft/s when bottom is 5 ft from wall.',
      responseFormat: 'numeric',
      hints: ['Pythagorean theorem; differentiate w.r.t. t; plug in values; solve.'],
      estimatedMinutes: 5,
    },
    {
      id: 'try-cone',
      kind: 'try_yourself',
      problem:
        'Water is poured into a conical tank (cone pointing down, vertex at bottom) at 4 ft³/min. The cone has height 12 ft and base radius 6 ft. How fast is the water level rising when the water depth is 3 ft? (Hint: by similar triangles, r = h/2 always for water in this cone.)',
      expectedAnswer:
        'V = (1/3)πr²h. Substitute r = h/2: V = (1/3)π(h/2)²h = πh³/12. Differentiate: dV/dt = (π/12)·3h²·dh/dt = (π·h²/4)·dh/dt. Given dV/dt = 4, h = 3: 4 = (π·9/4)·dh/dt → dh/dt = 16/(9π) ≈ 0.566 ft/min.',
      responseFormat: 'numeric',
      hints: ['Express V in one variable using the similar-triangle relationship r = h/2.'],
      estimatedMinutes: 5,
    },
    {
      id: 'try-shadow',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A 6-ft tall person walks away from a 15-ft tall lamppost at 4 ft/s. (a) How fast is the tip of their shadow moving? (b) How fast is the LENGTH of their shadow growing? Use similar triangles.',
      expectedAnswer:
        'Let x = distance from lamppost to person, y = length of shadow, x + y = distance from lamppost to tip of shadow. By similar triangles: 15/(x+y) = 6/y → 15y = 6(x+y) → 15y = 6x + 6y → 9y = 6x → y = 2x/3. (Length of shadow = 2/3 of distance to person.)\nLet z = x + y = position of shadow tip. z = x + 2x/3 = 5x/3.\n(a) dz/dt = (5/3)·dx/dt = (5/3)·4 = 20/3 ft/s. The TIP moves at 20/3 ft/s.\n(b) dy/dt = (2/3)·dx/dt = (2/3)·4 = 8/3 ft/s. The shadow LENGTHENS at 8/3 ft/s.\n(Note: tip-velocity − length-rate = walking velocity: 20/3 − 8/3 = 12/3 = 4 ft/s. ✓ The tip outpaces both the person and the shadow.) Strong answers: (i) similar-triangles equation, (ii) explicit relationship y = 2x/3, (iii) differentiate, (iv) interpret BOTH the tip rate and the length rate.',
      responseFormat: 'frq',
      hints: ['Similar triangles → linear relationship between x and y. Differentiate the relationship.'],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '5 STEPS: identify → equation → differentiate w.r.t. t → plug in → solve.',
        'Differentiate FIRST. Plug in LAST.',
        'For sphere V = (4/3)πr³ → dV/dt = 4πr²·dr/dt.',
        'For triangles: Pythagorean theorem (sliding) or similar-triangles proportion (shadows, cones).',
        'Watch units; verify they match.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.4-4.5',
    cedTitle: 'Related Rates',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard related-rates recipe.' }],
  },
};
