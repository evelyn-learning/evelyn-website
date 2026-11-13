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
//
// Coordinates are abstract (the renderer fits and centres them); one bond is
// BOND units long. The auto layout walks the bond graph outward from the most
// connected atom and gives every atom the textbook Lewis arrangement for its
// number of neighbours: straight for two (bent when the centre carries lone
// pairs), a cross for four, branches at right angles along a chain — so a
// chain molecule such as ethanol comes out as H–C–C–O–H with the other
// hydrogens above and below, and bonds never cross.

const BOND = 20;
type LayoutAtom = { id: string; x?: number; y?: number; bonds: number; lonePairs?: number; element?: string };
type Pt = { x: number; y: number };

function computeLayout(spec: ConstructedLewisSpec, atoms: LayoutAtom[]): Map<string, Pt> {
  const out = new Map<string, Pt>();

  // 1. Every atom with an explicit (x, y): keep them as given.
  if (atoms.every((a) => typeof a.x === 'number' && typeof a.y === 'number')) {
    for (const a of atoms) out.set(a.id, { x: a.x as number, y: a.y as number });
    return out;
  }

  const layout = spec.layout ?? 'auto';
  const ids = atoms.map((a) => a.id);

  // 2. Explicit shape hints.
  if (layout === 'linear') {
    // Follow the bond chain end to end when there is one, so the atoms come
    // out in bonded order whatever order they were declared in.
    const order = chainOrder(ids, spec.bonds) ?? ids;
    order.forEach((id, i) => out.set(id, { x: i * BOND, y: 50 }));
    return out;
  }
  if (layout === 'trigonal' && !findCentralAtom(atoms, spec.bonds)) {
    return circularLayout(ids, 50, 50, BOND);
  }

  // 3. Graph walk (auto, trigonal, tetrahedral, tetrahedral-around).
  const forcedCenter = layout === 'tetrahedral-around' || layout === 'tetrahedral' ? spec.centerAtomId : undefined;
  const placed = graphLayout(atoms, spec.bonds, forcedCenter, layout === 'trigonal');

  // Atoms that came with their own (x, y) keep them only when ALL did (case 1);
  // mixing hand-placed and computed positions puts atoms on top of each other.
  return placed;
}

/** Atom ids in bonded order when the molecule is a simple unbranched chain. */
function chainOrder(ids: string[], bonds: ConstructedLewisSpec['bonds']): string[] | undefined {
  const adj = adjacency(ids, bonds);
  const ends = ids.filter((id) => (adj.get(id) ?? []).length === 1);
  if (ends.length !== 2 || ids.some((id) => (adj.get(id) ?? []).length > 2)) return undefined;
  const order: string[] = [];
  let prev: string | undefined;
  let cur: string | undefined = ends[0];
  while (cur) {
    order.push(cur);
    const next: string | undefined = (adj.get(cur) ?? []).find((n) => n !== prev);
    prev = cur;
    cur = next;
  }
  return order.length === ids.length ? order : undefined;
}

function adjacency(ids: string[], bonds: ConstructedLewisSpec['bonds']): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const id of ids) adj.set(id, []);
  for (const b of bonds) {
    if (b.from === b.to) continue;
    if (!adj.get(b.from)!.includes(b.to)) adj.get(b.from)!.push(b.to);
    if (!adj.get(b.to)!.includes(b.from)) adj.get(b.to)!.push(b.from);
  }
  return adj;
}

function findCentralAtom(
  atoms: Array<{ id: string; bonds: number }>,
  bonds: ConstructedLewisSpec['bonds'],
): string | undefined {
  // The atom bonded to the most OTHER ATOMS is the centre (a double bond is
  // still one neighbour). Tie → the one with more bonding electrons → first.
  const adj = adjacency(atoms.map((a) => a.id), bonds);
  const deg = (id: string) => (adj.get(id) ?? []).length;
  const sorted = [...atoms].sort((a, b) => deg(b.id) - deg(a.id) || b.bonds - a.bonds);
  if (sorted.length && deg(sorted[0].id) > 1) return sorted[0].id;
  return undefined;
}

const DEG = Math.PI / 180;

/** Directions (radians, screen coords: +y is down) for the neighbours of the
 *  root atom, in the order they are handed out. */
function rootAngles(n: number, lonePairs: number, trigonalHint: boolean): number[] {
  if (n === 1) return [0];
  if (n === 2) {
    // Lone pairs on the centre bend the molecule (water, SO₂); none → linear (CO₂, HCN).
    return lonePairs >= 1 ? [(90 + 52.25) * DEG, (90 - 52.25) * DEG] : [180 * DEG, 0];
  }
  if (n === 3) {
    // A lone pair takes the top position (ammonia); none → trigonal planar.
    return lonePairs >= 1 && !trigonalHint ? [180 * DEG, 0, 90 * DEG] : [-90 * DEG, 150 * DEG, 30 * DEG];
  }
  if (n === 4) return [0, 180 * DEG, -90 * DEG, 90 * DEG];
  return Array.from({ length: n }, (_, i) => -90 * DEG + (i * 2 * Math.PI) / n);
}

/** Directions for the k onward neighbours of an atom reached along `dir`. */
function branchAngles(k: number, dir: number, totalNeighbours: number): number[] {
  if (k === 1) return [dir];
  if (k === 2) {
    // Three neighbours in all → a Y (120° apart); otherwise at right angles.
    const spread = totalNeighbours === 3 ? 60 * DEG : 90 * DEG;
    return [dir - spread, dir + spread];
  }
  if (k === 3) return [dir, dir - 90 * DEG, dir + 90 * DEG];
  // Many branches: fan them over the 240° facing away from the parent.
  return Array.from({ length: k }, (_, i) => dir - 120 * DEG + (i * 240 * DEG) / (k - 1));
}

function graphLayout(
  atoms: LayoutAtom[],
  bonds: ConstructedLewisSpec['bonds'],
  forcedCenter: string | undefined,
  trigonalHint: boolean,
): Map<string, Pt> {
  const ids = atoms.map((a) => a.id);
  const byId = new Map(atoms.map((a) => [a.id, a]));
  const adj = adjacency(ids, bonds);
  const deg = (id: string) => (adj.get(id) ?? []).length;
  const out = new Map<string, Pt>();
  let offsetX = 0;

  const remaining = new Set(ids);
  while (remaining.size > 0) {
    // Component root: forced centre (first component), else most-connected atom.
    const pool = ids.filter((id) => remaining.has(id));
    let root = forcedCenter && remaining.has(forcedCenter) ? forcedCenter : pool[0];
    if (root === pool[0]) {
      for (const id of pool) {
        if (deg(id) > deg(root) || (deg(id) === deg(root) && (byId.get(id)!.bonds > byId.get(root)!.bonds))) root = id;
      }
    }
    // Collect the component.
    const comp: string[] = [];
    const seen = new Set<string>([root]);
    const queue = [root];
    while (queue.length) {
      const cur = queue.shift()!;
      comp.push(cur);
      for (const n of adj.get(cur) ?? []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
    }
    const compBonds = bonds.filter((b) => seen.has(b.from) && seen.has(b.to) && b.from !== b.to);
    const uniquePairs = new Set(compBonds.map((b) => [b.from, b.to].sort().join('|')));
    const cyclic = uniquePairs.size >= comp.length && comp.length >= 3;

    const local = new Map<string, Pt>();
    if (cyclic) {
      // Ring (benzene, cyclohexane…): ring atoms on a regular polygon, their
      // substituents pointing straight out from the ring centre.
      const ring = comp.filter((id) => deg(id) >= 2);
      const ordered = ringOrder(ring, adj) ?? ring;
      const R = BOND / (2 * Math.sin(Math.PI / Math.max(3, ordered.length)));
      ordered.forEach((id, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / ordered.length;
        local.set(id, { x: R * Math.cos(a), y: R * Math.sin(a) });
      });
      for (const id of comp) {
        if (local.has(id)) continue;
        const parent = (adj.get(id) ?? []).find((n) => local.has(n));
        const p = parent ? local.get(parent)! : { x: 0, y: 0 };
        const len = Math.hypot(p.x, p.y) || 1;
        local.set(id, { x: p.x + (p.x / len) * BOND, y: p.y + (p.y / len) * BOND });
      }
    } else {
      // Tree walk. Chain-continuing (non-terminal) neighbours are served
      // first, so the backbone takes the straight-on / horizontal slots.
      const order = (list: string[]) => [...list].sort((a, b) => Number(deg(b) > 1) - Number(deg(a) > 1));
      local.set(root, { x: 0, y: 0 });
      const walk: Array<{ id: string; dir: number | null }> = [{ id: root, dir: null }];
      while (walk.length) {
        const { id, dir } = walk.shift()!;
        const here = local.get(id)!;
        const kids = order((adj.get(id) ?? []).filter((n) => !local.has(n)));
        if (kids.length === 0) continue;
        const angles = dir === null
          ? rootAngles(kids.length, byId.get(id)!.lonePairs ?? 0, trigonalHint)
          : branchAngles(kids.length, dir, deg(id));
        kids.forEach((kid, i) => {
          const a = angles[i];
          local.set(kid, { x: here.x + BOND * Math.cos(a), y: here.y + BOND * Math.sin(a) });
          walk.push({ id: kid, dir: a });
        });
      }
    }
    // Place the component to the right of what is already laid out.
    const xs = [...local.values()].map((p) => p.x);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    for (const [id, p] of local) out.set(id, { x: p.x - minX + offsetX, y: p.y + 50 });
    offsetX += maxX - minX + BOND * 1.5;
    for (const id of comp) remaining.delete(id);
  }
  return out;
}

/** Ring atoms in bonded order (walk round the ring), when they form one ring. */
function ringOrder(ring: string[], adj: Map<string, string[]>): string[] | undefined {
  if (ring.length < 3) return undefined;
  const inRing = new Set(ring);
  const order: string[] = [ring[0]];
  let prev: string | undefined;
  let cur = ring[0];
  for (let i = 1; i < ring.length; i++) {
    const next = (adj.get(cur) ?? []).find((n) => inRing.has(n) && n !== prev && !order.includes(n));
    if (!next) return undefined;
    order.push(next);
    prev = cur;
    cur = next;
  }
  return order;
}

function circularLayout(ids: string[], cx: number, cy: number, r: number): Map<string, Pt> {
  const out = new Map<string, Pt>();
  ids.forEach((id, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ids.length;
    out.set(id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  });
  return out;
}
