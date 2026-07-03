/**
 * AP Calculus BC — Unit 4 CED 4.2: Straight-Line Motion (Position, Velocity,
 * Acceleration).
 *
 * Baseline curated from evelyn.ap.calcbc.straight-line-motion.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry
 * carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, a sign, "(", or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.straight-line-motion';

export const BASELINE_AP_CALCBC_STRAIGHT_LINE_MOTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.straight-line-motion.v1',
  course: 'AP Calculus BC',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Straight-Line Motion',
  planId: 'evelyn.ap.calcbc.straight-line-motion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.straight-line-motion.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Position, velocity, acceleration',
      content:
        'Motion along a line is described by the position $s(t)$. Differentiating steps down the chain: VELOCITY $v(t)=s\'(t)$ and ACCELERATION $a(t)=v\'(t)=s\'\'(t)$. Position locates the particle, velocity is the signed rate at which position changes, and acceleration is the rate at which velocity changes. By convention positive $=$ right/up, negative $=$ left/down.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Velocity vs. speed',
      content:
        'VELOCITY $v(t)$ is SIGNED: its sign gives direction ($v>0$ moving right, $v<0$ moving left, $v=0$ momentarily at rest). SPEED is the magnitude $|v(t)|$, always $\\ge 0$ — it says "how fast" with no direction. A particle can have negative velocity but positive speed.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Speeding up vs. slowing down',
      content:
        'A particle is SPEEDING UP when $v$ and $a$ have the SAME sign (both $>0$ or both $<0$) and SLOWING DOWN when they have OPPOSITE signs. Reason: speed $|v|$ grows exactly when velocity moves away from zero, which happens when acceleration pushes in the direction the particle already moves.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'At rest and changing direction',
      content:
        'The particle is at rest where $v(t)=0$ — solve $s\'(t)=0$. It CHANGES DIRECTION at a time where $v(t)=0$ AND $v$ changes SIGN across that time. A zero of $v$ with no sign change (a touch) is a momentary stop but NOT a direction reversal, so always sign-check both sides.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Displacement vs. total distance',
      content:
        'DISPLACEMENT over $[t_1,t_2]$ is $s(t_2)-s(t_1)$ — net change of position, which can be zero even after much travel. TOTAL DISTANCE adds up motion regardless of direction and requires accounting for every sign change of $v$ (formally $\\int_{t_1}^{t_2}|v(t)|\\,dt$, Unit 8). The two agree only when $v$ never changes sign.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'kinematic chain (one-line)',
      content:
        '$v(t)=s\'(t)$ and $a(t)=v\'(t)=s\'\'(t)$; speed $=|v(t)|$.',
    },
  ],
  methods: [
    {
      title: 'Full kinematic analysis of a particle from its position function',
      when_to_use:
        'Given $s(t)$, when asked for velocity/acceleration, when the particle is at rest, when it moves right/left, changes direction, or speeds up / slows down.',
      steps: [
        'DIFFERENTIATE: $v(t)=s\'(t)$ and $a(t)=v\'(t)$. Factor each fully.',
        'AT REST: solve $v(t)=0$; these times partition the domain.',
        'DIRECTION: on each subinterval read the sign of $v$ ($v>0$ right, $v<0$ left); a sign change of $v$ at a zero is a direction reversal.',
        'ACCELERATION SIGN: solve $a(t)=0$ and read the sign of $a$ on each piece.',
        'SPEEDING UP / SLOWING DOWN: compare signs of $v$ and $a$ on each subinterval — same sign $\\Rightarrow$ speeding up, opposite $\\Rightarrow$ slowing down.',
      ],
      example: {
        problem:
          'A particle has $s(t)=t^3-6t^2+9t$ for $t\\ge 0$. When is it at rest, when does it change direction, and when is it speeding up?',
        solution:
          '$v(t)=3t^2-12t+9=3(t-1)(t-3)$, so at rest at $t=1$ and $t=3$. Signs of $v$: positive on $(0,1)$, negative on $(1,3)$, positive on $(3,\\infty)$ — so it changes direction at both $t=1$ and $t=3$. $a(t)=6t-12=6(t-2)$, negative for $t<2$, positive for $t>2$. Matching signs: speeding up on $(1,2)\\cup(3,\\infty)$, slowing down on $(0,1)\\cup(2,3)$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide speeding up / slowing down from given values of $v$ and $a$',
      when_to_use:
        'When a snapshot gives numeric $v$ and $a$ (or their signs) at one instant and asks about direction and whether speed is increasing.',
      steps: [
        'Read the sign of $v$ to get the direction of motion (positive $\\Rightarrow$ right, negative $\\Rightarrow$ left).',
        'Compare the signs of $v$ and $a$: same sign $\\Rightarrow$ speeding up; opposite $\\Rightarrow$ slowing down.',
        'State BOTH the direction and the speeding-up/slowing-down conclusion — do not read acceleration sign alone as "speeding up."',
      ],
      example: {
        problem:
          'At an instant a particle has $v=-2$ m/s and $a=+3$ m/s$^2$. Direction? Speeding up or slowing down?',
        solution:
          'Since $v<0$, the particle moves in the negative direction (left). Signs of $v$ and $a$ are OPPOSITE, so it is SLOWING DOWN — velocity is becoming less negative and heads toward zero, where it will reverse.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Positive acceleration does NOT mean speeding up. With $v<0$ and $a>0$ the particle is slowing down — speeding up depends on the two signs AGREEING, not on $a>0$.', kind: 'common-error' },
    { content: 'Speed is $|v|$, always $\\ge 0$; velocity is signed. When a prompt asks "how fast," give speed; when it asks direction, give the sign of velocity.', kind: 'frq-vocab' },
    { content: 'A zero of $v$ is only a direction change if $v$ CHANGES SIGN there — sign-check both sides, since a double root touches zero without reversing.', kind: 'gotcha' },
    { content: 'Displacement can be zero while total distance is large (the particle returns to start); never equate the two unless $v$ keeps one sign.', kind: 'edge-case' },
    { content: 'Always factor $v(t)$ and $a(t)$ before making a sign chart — the roots are exactly the direction-change and concavity-of-motion candidates.', kind: 'tip' },
  ],
};
