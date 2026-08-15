/**
 * Compound classifier for show_molecule. Auto-detects whether a
 * SMILES-or-formula string represents a:
 *   - molecular compound (default — H2O, CH4, glucose, etc.)
 *   - hydrate (CuSO4·5H2O, MgSO4·7H2O — ionic salt with water of
 *     crystallization)
 *   - ionic compound (NaCl, MgCl2 — lattice of cations + anions)
 *
 * The brain doesn't have to flag the kind; it just emits whatever
 * formula or SMILES the lesson uses and the renderer adapts:
 *   - hydrate: rewrites the SMILES to include the water molecules
 *     as disconnected components so Ketcher draws them inline with
 *     the primary structure (separated by the standard `.` operator
 *     which Ketcher renders side-by-side).
 *   - ionic: leaves the SMILES alone (Ketcher draws charged atoms
 *     correctly when given [Na+].[Cl-]-style input) but tells the
 *     renderer to ALSO show a unit-cell lattice diagram below.
 *
 * The brain CAN override via an explicit `mode` arg if the auto-
 * detect picks wrong (rare, but escape hatch is good).
 */

export type CompoundKind = 'molecular' | 'hydrate' | 'ionic';

export interface ClassifiedCompound {
  kind: CompoundKind;
  /** SMILES string ready to hand to Ketcher. May be rewritten from
   *  the input (hydrate notation expanded to .H2O molecules). */
  ketcherSmiles: string;
  /** Number of water molecules per formula unit (hydrate only). */
  hydrateCount?: number;
  /** Primary anhydrous formula portion, for display ("CuSO4" out of
   *  "CuSO4·5H2O"). Hydrate only. */
  anhydrousFormula?: string;
  /** Detected ions for the unit-cell diagram (ionic only). */
  ions?: Array<{ symbol: string; charge: number; count: number }>;
  /** Original input as the brain sent it — kept for the info-bar
   *  display so the student sees exactly what was specified. */
  originalInput: string;
}

/** Standard SMILES uses `.` to separate disconnected components.
 *  Hydrates in chemistry notation use `·` (U+00B7 middle dot) or `*`
 *  in some texts. We accept both as INPUT and rewrite to `.` for
 *  Ketcher. The repeat count `nH2O` (n integer) is parsed if present. */
const HYDRATE_RE = /\s*[·\*]\s*(\d+)?\s*H2O\s*$/;

/** SMILES atom-with-charge bracket: [Na+], [Cl-], [Mg+2], [Fe+3]. */
const IONIC_BRACKET_RE = /\[([A-Z][a-z]?)(\+\d*|-\d*)\]/g;

/** Heuristic: ionic detection. The SMILES contains at least two
 *  bracketed charged atoms separated by `.` (disconnected ion pair),
 *  AND no explicit covalent bonds outside the brackets. The brain
 *  occasionally emits `[Cu+2].[O-]S(=O)(=O)[O-]` for copper sulfate
 *  which IS molecular-with-charges (sulfate has covalent bonds), so
 *  we look for "all-atomic ions" specifically. */
function looksIonic(smiles: string): boolean {
  const matches = Array.from(smiles.matchAll(IONIC_BRACKET_RE));
  if (matches.length < 2) return false;
  // Strip every bracketed ion from the SMILES; what's left should be
  // only `.` separators and whitespace if this is a pure ionic compound.
  const remainder = smiles.replace(IONIC_BRACKET_RE, '').replace(/[\s.]+/g, '');
  return remainder === '';
}

/** Parse "CuSO4" / "MgCl2" / "NaCl" formula strings into ions for the
 *  unit-cell. Very lightweight — handles the common K-12 / intro-college
 *  cases (alkali halides, alkaline-earth halides, simple oxides). For
 *  anything more exotic, returns null and the renderer skips the lattice. */
function parseIonsFromFormula(formula: string): Array<{ symbol: string; charge: number; count: number }> | null {
  // Strip whitespace + the optional anhydrous-formula prefix when the
  // brain wrote "CuSO4·5H2O" — we want just "CuSO4".
  const f = formula.replace(HYDRATE_RE, '').trim();
  // Match each capital-letter element + optional lowercase + optional digit count.
  const tokens = Array.from(f.matchAll(/([A-Z][a-z]?)(\d*)/g))
    .filter((m) => m[1])
    .map((m) => ({ symbol: m[1], count: m[2] ? parseInt(m[2], 10) : 1 }));
  if (tokens.length < 2) return null;
  // Common-ion table: known charges for elements we care about. The
  // brain might give us a less-common element; we return null in that
  // case rather than guess.
  const KNOWN_CHARGES: Record<string, number> = {
    // Group 1 (always +1)
    H: 1, Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1,
    // Group 2 (always +2)
    Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2,
    // Group 17 (always -1 in binary salts)
    F: -1, Cl: -1, Br: -1, I: -1,
    // Group 16 (-2 in binary salts)
    O: -2, S: -2,
    // Group 15 (-3 in binary salts — phosphides, nitrides)
    N: -3, P: -3,
    // Common transition-metal +2/+3 — ambiguous, skip in auto-detect
  };
  const out = tokens.map((t) => ({
    symbol: t.symbol,
    count: t.count,
    charge: KNOWN_CHARGES[t.symbol] ?? NaN,
  }));
  if (out.some((i) => Number.isNaN(i.charge))) return null;
  // Net charge must balance for it to be a real ionic compound.
  const net = out.reduce((sum, i) => sum + i.count * i.charge, 0);
  if (net !== 0) return null;
  return out;
}

export function classifyCompound(input: string, modeOverride?: 'auto' | CompoundKind): ClassifiedCompound {
  const original = input.trim();
  const mode = modeOverride && modeOverride !== 'auto' ? modeOverride : null;

  // 1. Hydrate detection (or override).
  const hydrateMatch = original.match(HYDRATE_RE);
  if (mode === 'hydrate' || (!mode && hydrateMatch)) {
    const count = hydrateMatch?.[1] ? parseInt(hydrateMatch[1], 10) : 1;
    const anhydrous = original.replace(HYDRATE_RE, '').trim();
    // Append `.O` `count` times to the SMILES so Ketcher draws the
    // water molecules inline as disconnected components. If the
    // anhydrous part isn't valid SMILES (e.g., the brain sent a plain
    // formula like "CuSO4"), Ketcher's parser will surface the error
    // — that's a tutor-side mistake, not ours to silently fix.
    const waterUnits = Array.from({ length: count }, () => 'O').join('.');
    const ketcherSmiles = `${anhydrous}.${waterUnits}`;
    return {
      kind: 'hydrate',
      ketcherSmiles,
      hydrateCount: count,
      anhydrousFormula: anhydrous,
      originalInput: original,
    };
  }

  // 2. Ionic detection (or override). Two signals: bracketed-ion SMILES
  // OR a known-formula like "NaCl" we can decompose into ions.
  if (mode === 'ionic') {
    const ions = parseIonsFromFormula(original);
    return {
      kind: 'ionic',
      ketcherSmiles: original,
      ions: ions ?? undefined,
      originalInput: original,
    };
  }
  if (!mode && looksIonic(original)) {
    // Try to also extract ion info for the lattice (parses brackets).
    const matches = Array.from(original.matchAll(IONIC_BRACKET_RE));
    const ions = matches.map((m) => {
      const symbol = m[1];
      const sign = m[2].startsWith('+') ? 1 : -1;
      const magStr = m[2].slice(1);
      const magnitude = magStr ? parseInt(magStr, 10) : 1;
      return { symbol, charge: sign * magnitude, count: 1 };
    });
    return { kind: 'ionic', ketcherSmiles: original, ions, originalInput: original };
  }
  if (!mode) {
    const formulaIons = parseIonsFromFormula(original);
    if (formulaIons) {
      return { kind: 'ionic', ketcherSmiles: original, ions: formulaIons, originalInput: original };
    }
  }

  // 3. Default — molecular.
  return { kind: 'molecular', ketcherSmiles: original, originalInput: original };
}
