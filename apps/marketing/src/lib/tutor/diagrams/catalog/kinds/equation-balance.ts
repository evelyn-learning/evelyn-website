/**
 * equation_balance — solver.
 *
 * A balance scale used as a metaphor for equality. Two pans, a beam,
 * a fulcrum. Each pan holds labeled items (numbers, variables, or
 * blocks). Whether the scale renders level or tilted is computed from
 * the items' weights, NOT supplied by the brain — so the brain can't
 * draw a "balanced" scale that isn't actually balanced.
 *
 * Use cases: solving algebraic equations as "what to do to keep the
 * scale balanced" (4-9), introducing the equals sign as balance (3-5),
 * inequalities as tilted scales (6-9).
 */

export interface BalanceItem {
  /** Numeric weight for balance computation. If omitted (e.g. variable
   *  "x"), this item is treated as the unknown — it must be on at most
   *  one side, and the scale is shown level by definition. */
  weight?: number;
  /** Display label — could be a number ("5"), a variable ("x"), or a
   *  word ("apple"). Rendered on the item block. */
  label: string;
  color?: string;
}

export interface BalanceFigure {
  left: BalanceItem[];
  right: BalanceItem[];
  /** Computed by the solver: 'level' | 'tilt_left' | 'tilt_right'. */
  state: 'level' | 'tilt_left' | 'tilt_right';
  /** Sum of numeric weights on each side (unknowns excluded). */
  leftSum: number;
  rightSum: number;
  /** Whether either side has an unknown. When true, state is 'level'
   *  by convention (we're showing the equation, not a physical fact). */
  hasUnknown: boolean;
  title?: string;
  /** Optional caption underneath the scale (e.g. "x + 3 = 8"). */
  caption?: string;
}

function parseItems(arr: unknown, side: 'left' | 'right'): BalanceItem[] {
  if (!Array.isArray(arr)) {
    throw new Error(`equation_balance: ${side} must be an array of items`);
  }
  return arr.map((raw, i) => {
    if (!raw || typeof raw !== 'object') {
      throw new Error(`equation_balance: ${side}[${i}] must be an object`);
    }
    const it = raw as Record<string, unknown>;
    if (typeof it.label !== 'string' || !it.label.trim()) {
      throw new Error(`equation_balance: ${side}[${i}].label is required`);
    }
    const weight = typeof it.weight === 'number' && Number.isFinite(it.weight)
      ? it.weight
      : undefined;
    return {
      label: it.label,
      weight,
      color: typeof it.color === 'string' ? it.color : undefined,
    };
  });
}

export function solveEquationBalance(params: Record<string, unknown>): BalanceFigure {
  const left = parseItems(params.left, 'left');
  const right = parseItems(params.right, 'right');
  if (left.length === 0 && right.length === 0) {
    throw new Error('equation_balance: at least one side must have items');
  }

  const leftHasUnknown = left.some((it) => it.weight === undefined);
  const rightHasUnknown = right.some((it) => it.weight === undefined);
  const hasUnknown = leftHasUnknown || rightHasUnknown;

  const leftSum = left.reduce((s, it) => s + (it.weight ?? 0), 0);
  const rightSum = right.reduce((s, it) => s + (it.weight ?? 0), 0);

  let state: BalanceFigure['state'];
  if (hasUnknown) {
    // Equation form: show level. Solving for the unknown is the lesson.
    state = 'level';
  } else if (Math.abs(leftSum - rightSum) < 1e-9) {
    state = 'level';
  } else if (leftSum > rightSum) {
    state = 'tilt_left';
  } else {
    state = 'tilt_right';
  }

  return {
    left,
    right,
    state,
    leftSum,
    rightSum,
    hasUnknown,
    title: typeof params.title === 'string' ? params.title : undefined,
    caption: typeof params.caption === 'string' ? params.caption : undefined,
  };
}
