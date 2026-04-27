/**
 * Lewis structure solver — constructed pattern.
 *
 * Same playbook as geometry-solver.ts: brain emits intent in domain-
 * language (atoms by element, bonds by atom-id pair, optional formal
 * charges), solver computes positions, lone-pair counts, electron
 * accounting, and validates octet / duet rules. The brain never picks
 * pixel positions or counts dots.
 *
 * What we replace from the primitive show_lewis tool:
 *   - explicit (x, y) per atom         → declarative bonding spec, auto-layout
 *   - explicit lonePairs per atom      → derived from valence − bonds − charge
 *   - "octet violation" the brain misses → validator catches it
 *
 * Failures throw with a message naming the offending atom — same shape
 * geometry-solver uses. Caller surfaces the error inline so the brain
 * can self-correct on retry.
 */

// ─── Periodic-table data, K-12 scope ──────────────────────────────────────────
// Number of valence electrons per element. Covers everything K-12 chemistry
// reasonably hits: H, He, Li-Ne, Na-Ar, plus the common transition metal
// counter-cations (Na+, K+, Mg2+, Ca2+, Fe2+/Fe3+) treated by formal charge.
// Group 1: 1, Group 2: 2, Group 13: 3, Group 14: 4, Group 15: 5, Group 16:
// 6, Group 17: 7, Group 18: 8 (He = 2). Transition metals fall back to a
// best-effort group-electron count when present.
const VALENCE: Record<string, number> = {
  H: 1, He: 2,
  Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Br: 7, Kr: 8, I: 7, Xe: 8,
};

/** Octet target — what the atom "wants" in its full shell. H/He target 2. */
const OCTET_TARGET: Record<string, number> = {
  H: 2, He: 2, Li: 2, Be: 4, B: 6,
  // Hypervalent in extension; default 8 covers the main K-12 cases.
};

function valenceOf(element: string): number {
  // Strip charge suffix ("Na+" → "Na", "Cl-" → "Cl"); charge is conveyed
  // separately via formalCharge.
  const sym = element.replace(/[+\-\d]+$/, '');
  const v = VALENCE[sym];
  if (v === undefined) throw new Error(`unknown element "${element}" (Lewis solver covers H–Ar plus K, Ca, Br, Kr, I, Xe)`);
  return v;
}

function octetTargetOf(element: string): number {
  const sym = element.replace(/[+\-\d]+$/, '');
  return OCTET_TARGET[sym] ?? 8;
}

// ─── Public spec ──────────────────────────────────────────────────────────────

export interface ConstructedLewisSpec {
  title?: string;
  /** Optional formula / molecule name shown above the structure. */
  formula?: string;
  /** Optional VSEPR geometry label ("bent", "trigonal planar", …). */
  geometry?: string;
  /** Atoms, by id. Position is auto-computed unless explicit. */
  atoms: Array<{
    id: string;
    element: string;
    /** Optional formal charge: +1, -1, +2, etc. */
    formalCharge?: number;
    /** Optional explicit position override (rare). */
    x?: number;
    y?: number;
    /** Optional explicit lone-pair count override (rare — solver computes
     *  from valence by default). */
    lonePairs?: number;
  }>;
  /** Bonds — order is 1 (single), 2 (double), or 3 (triple). */
  bonds: Array<{
    from: string;
    to: string;
    order: 1 | 2 | 3;
    style?: 'solid' | 'dashed' | 'wedge' | 'dash-wedge';
  }>;
  /** Layout hint: "auto" (default) tries to place atoms on a clean
   *  geometry from the bond graph; "linear" / "trigonal" / "tetrahedral"
   *  pick a shape directly. */
  layout?: 'auto' | 'linear' | 'trigonal' | 'tetrahedral' | 'tetrahedral-around';
  /** When layout="tetrahedral-around", which atom is the central one. */
  centerAtomId?: string;
  /** Skip electron-count validation (e.g. for radicals, expanded octets). */
  skipValidation?: boolean;
}

export interface LewisSolverOutput {
  title?: string;
  formula?: string;
  geometry?: string;
  atoms: Array<{
    id: string;
    element: string;
    x: number;
    y: number;
    lonePairs: number;
    formalCharge?: number;
  }>;
  bonds: Array<{
    from: string;
    to: string;
    order: 1 | 2 | 3;
    style?: 'solid' | 'dashed' | 'wedge' | 'dash-wedge';
  }>;
}

// ─── Solver ───────────────────────────────────────────────────────────────────

export function solveLewis(spec: ConstructedLewisSpec): LewisSolverOutput {
  if (!spec.atoms?.length) throw new Error('lewis: at least one atom required');
  // 1. Validate atom ids unique.
  const idSet = new Set<string>();
  for (const a of spec.atoms) {
    if (idSet.has(a.id)) throw new Error(`lewis: duplicate atom id "${a.id}"`);
    idSet.add(a.id);
  }
  // 2. Build adjacency for bond-count + layout.
  const bondCount = new Map<string, number>();
  for (const a of spec.atoms) bondCount.set(a.id, 0);
  for (const b of spec.bonds) {
    if (!idSet.has(b.from)) throw new Error(`lewis: bond references unknown atom "${b.from}"`);
    if (!idSet.has(b.to)) throw new Error(`lewis: bond references unknown atom "${b.to}"`);
    bondCount.set(b.from, (bondCount.get(b.from) ?? 0) + b.order);
    bondCount.set(b.to, (bondCount.get(b.to) ?? 0) + b.order);
  }
  // 3. Derive lone pairs per atom from valence.
  //    bondingElectrons = bondsAtAtom × 2 (we count shared pairs)
  //    nonBondingElectrons = valence − bondsAtAtom + formalCharge_term
  //    For a neutral atom: lonePairs = (valence − bondsAtAtom) / 2.
  //    Formal charge q shifts: each +1 reduces electrons by 1, each -1 adds 1.
  //    So effective electrons = valence − q. Then lonePairs = (effective − bondsAtAtom) / 2.
  const resolvedAtoms = spec.atoms.map((a) => {
    const bonds = bondCount.get(a.id) ?? 0;
    const valence = valenceOf(a.element);
    const q = a.formalCharge ?? 0;
    const effective = valence - q;
    const remaining = effective - bonds;
    let lonePairs: number;
    if (typeof a.lonePairs === 'number') {
      lonePairs = a.lonePairs;
    } else if (remaining < 0) {
      // Over-bonded — flag it but render zero lone pairs so we still draw.
      lonePairs = 0;
    } else {
      lonePairs = Math.floor(remaining / 2);
    }
    return { ...a, lonePairs, bonds, valence, q };
  });
  // 4. Octet check unless skipped.
  if (!spec.skipValidation) {
    for (const a of resolvedAtoms) {
      const target = octetTargetOf(a.element);
      const total = a.bonds * 2 + a.lonePairs * 2;
      if (total > target + 1e-6) {
        throw new Error(
          `lewis: atom "${a.id}" (${a.element}) has ${total} electrons in its valence shell — exceeds the octet target ${target}. ` +
            `Reduce a bond order, drop a lone pair, or set skipValidation: true if expanded octet is intended.`,
        );
      }
      if (total < target - 2 && a.element !== 'H' && a.element !== 'He') {
        // Severely incomplete — suggest the brain reconsider.
        throw new Error(
          `lewis: atom "${a.id}" (${a.element}) has only ${total} valence electrons — ${target - total} short of an octet. Add a lone pair or increase a bond order.`,
        );
      }
    }
  }
  // 5. Layout. Use brain-supplied (x,y) when present; otherwise auto-place.
  const positions = computeLayout(spec, resolvedAtoms);
  // 6. Build output.
  return {
    title: spec.title,
    formula: spec.formula,
    geometry: spec.geometry,
    atoms: resolvedAtoms.map((a) => ({
      id: a.id,
      element: a.element,
      x: positions.get(a.id)!.x,
      y: positions.get(a.id)!.y,
      lonePairs: a.lonePairs,
      formalCharge: a.formalCharge,
    })),
    bonds: spec.bonds.map((b) => ({ from: b.from, to: b.to, order: b.order, style: b.style })),
  };
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function computeLayout(
  spec: ConstructedLewisSpec,
  atoms: Array<{ id: string; x?: number; y?: number; bonds: number }>,
): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();

  // 1. Atoms with explicit (x, y) keep them.
  for (const a of atoms) {
    if (typeof a.x === 'number' && typeof a.y === 'number') {
      out.set(a.id, { x: a.x, y: a.y });
    }
  }
  if (out.size === atoms.length) return out;

  // 2. Layout chosen by hint.
  const layout = spec.layout ?? 'auto';

  if (layout === 'linear') {
    const ids = atoms.map((a) => a.id);
    const dx = 100 / Math.max(1, ids.length - 1);
    ids.forEach((id, i) => out.set(id, { x: i * dx, y: 50 }));
    return out;
  }

  if (layout === 'trigonal') {
    // 3 outer atoms around a center if 4 atoms; else circular.
    return circularLayout(atoms.map((a) => a.id), 50, 50, 38);
  }

  if (layout === 'tetrahedral' || layout === 'tetrahedral-around') {
    const centerId = spec.centerAtomId ?? findCentralAtom(atoms, spec.bonds);
    if (!centerId) return circularLayout(atoms.map((a) => a.id), 50, 50, 38);
    return centeredLayout(atoms.map((a) => a.id), centerId);
  }

  // Auto: pick the most-connected atom as the center; arrange the rest
  // in a circle around it. Falls back to circular for chains.
  const autoCenter = findCentralAtom(atoms, spec.bonds);
  if (!autoCenter) return circularLayout(atoms.map((a) => a.id), 50, 50, 38);
  return centeredLayout(atoms.map((a) => a.id), autoCenter);
}

function findCentralAtom(
  atoms: Array<{ id: string; bonds: number }>,
  _bonds: ConstructedLewisSpec['bonds'],
): string | undefined {
  // The atom with the most bonds is the center. Tie → first.
  const sorted = [...atoms].sort((a, b) => b.bonds - a.bonds);
  if (sorted.length && sorted[0].bonds > 1) return sorted[0].id;
  return undefined;
}

function centeredLayout(ids: string[], centerId: string): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  out.set(centerId, { x: 50, y: 50 });
  const others = ids.filter((id) => id !== centerId);
  const N = others.length;
  if (N === 0) return out;
  const radius = N <= 2 ? 30 : N <= 4 ? 36 : 40;
  // For 2 outer atoms, use linear (left/right of center) — common for H2O,
  // CO2 if you wanted bent vs linear, etc. We bias to bent (≈ 105°) as the
  // default since it's more visually informative; truly linear molecules
  // can pass layout: 'linear'.
  if (N === 2) {
    const angle = (105 * Math.PI) / 180;
    out.set(others[0], { x: 50 - radius * Math.sin(angle / 2), y: 50 + radius * Math.cos(angle / 2) });
    out.set(others[1], { x: 50 + radius * Math.sin(angle / 2), y: 50 + radius * Math.cos(angle / 2) });
    return out;
  }
  // N ≥ 3: evenly distributed around the center, rotated so the first
  // atom is at the top.
  for (let i = 0; i < N; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    out.set(others[i], { x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) });
  }
  return out;
}

function circularLayout(ids: string[], cx: number, cy: number, r: number): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  ids.forEach((id, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ids.length;
    out.set(id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  });
  return out;
}
