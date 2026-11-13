/** fraction_comparison — solver. Compare multiple fractions side-by-side. */

export interface Fraction { numerator: number; denominator: number; label?: string; color?: string }
export interface FractionComparisonFigure {
  fractions: Fraction[];
  style: 'bar' | 'circle';
  title?: string;
}

export function solveFractionComparison(params: Record<string, unknown>): FractionComparisonFigure {
  if (!Array.isArray(params.fractions) || params.fractions.length === 0) {
    throw new Error('fraction_comparison: fractions must be a non-empty array');
  }
  const fractions: Fraction[] = (params.fractions as Array<Record<string, unknown>>).map((f, i) => {
    const n = f.numerator;
    const d = f.denominator;
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) {
      throw new Error(`fraction_comparison: fractions[${i}].numerator must be a non-negative number`);
    }
    if (typeof d !== 'number' || !Number.isFinite(d) || d <= 0 || !Number.isInteger(d)) {
      throw new Error(`fraction_comparison: fractions[${i}].denominator must be a positive integer`);
    }
    // An improper fraction is drawn as whole shapes plus a part. Past a
    // handful of wholes the picture stops being readable, so that is refused.
    if (n / d > 6) {
      throw new Error(`fraction_comparison: fractions[${i}] (${n}/${d}) is more than 6 wholes; too large to draw`);
    }
    return {
      numerator: n,
      denominator: d,
      label: typeof f.label === 'string' ? f.label : undefined,
      color: typeof f.color === 'string' ? f.color : undefined,
    };
  });
  const style = params.style === 'circle' ? 'circle' : 'bar';
  return {
    fractions,
    style,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
