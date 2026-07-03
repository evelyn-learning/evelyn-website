/**
 * Chemistry catalog kinds — the canonical chemistry figures that a freehand
 * sketch cannot draw legibly and that appear across high-school and AP/IB
 * chemistry:
 *
 *   bohr_model       — concentric electron shells around a labeled nucleus
 *                      (protons / neutrons); electrons as dots filling each
 *                      shell per the element (or explicit shell occupancies).
 *   galvanic_cell    — an electrochemical (voltaic) cell: two half-cells with
 *                      electrodes in their solutions, a salt bridge, and an
 *                      external circuit with a voltmeter and the electron-flow
 *                      arrow; anode (−, oxidation) and cathode (+, reduction).
 *   titration_curve  — pH vs. volume-of-titrant sigmoid with the equivalence
 *                      point (and, for a weak-strong titration, the buffer
 *                      region + half-equivalence pKa) marked.
 *   crystal_lattice  — a unit cell (simple cubic / BCC / FCC) drawn in
 *                      pseudo-3D with its lattice points.
 *
 * Each solver is pure: it validates + fills defaults + normalizes / derives
 * the meaningful geometry, so a bare call still renders a clean, correctly
 * labeled textbook figure. The matching renderer (CatalogChemistryRenderers.tsx)
 * draws it.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function numOr(v: unknown, dflt: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : dflt;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}
function strEnum<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
}

// ── bohr_model ────────────────────────────────────────────────────────────────

/** Common elements (Z ≤ 20 plus a few transition metals) with their symbol,
 *  name and the neutron count of the most abundant isotope. Enough to cover
 *  the elements a Bohr diagram is actually drawn for. */
const BOHR_ELEMENTS: Record<string, { symbol: string; name: string; Z: number; neutrons: number }> = {
  H: { symbol: 'H', name: 'Hydrogen', Z: 1, neutrons: 0 },
  He: { symbol: 'He', name: 'Helium', Z: 2, neutrons: 2 },
  Li: { symbol: 'Li', name: 'Lithium', Z: 3, neutrons: 4 },
  Be: { symbol: 'Be', name: 'Beryllium', Z: 4, neutrons: 5 },
  B: { symbol: 'B', name: 'Boron', Z: 5, neutrons: 6 },
  C: { symbol: 'C', name: 'Carbon', Z: 6, neutrons: 6 },
  N: { symbol: 'N', name: 'Nitrogen', Z: 7, neutrons: 7 },
  O: { symbol: 'O', name: 'Oxygen', Z: 8, neutrons: 8 },
  F: { symbol: 'F', name: 'Fluorine', Z: 9, neutrons: 10 },
  Ne: { symbol: 'Ne', name: 'Neon', Z: 10, neutrons: 10 },
  Na: { symbol: 'Na', name: 'Sodium', Z: 11, neutrons: 12 },
  Mg: { symbol: 'Mg', name: 'Magnesium', Z: 12, neutrons: 12 },
  Al: { symbol: 'Al', name: 'Aluminium', Z: 13, neutrons: 14 },
  Si: { symbol: 'Si', name: 'Silicon', Z: 14, neutrons: 14 },
  P: { symbol: 'P', name: 'Phosphorus', Z: 15, neutrons: 16 },
  S: { symbol: 'S', name: 'Sulfur', Z: 16, neutrons: 16 },
  Cl: { symbol: 'Cl', name: 'Chlorine', Z: 17, neutrons: 18 },
  Ar: { symbol: 'Ar', name: 'Argon', Z: 18, neutrons: 22 },
  K: { symbol: 'K', name: 'Potassium', Z: 19, neutrons: 20 },
  Ca: { symbol: 'Ca', name: 'Calcium', Z: 20, neutrons: 20 },
  Fe: { symbol: 'Fe', name: 'Iron', Z: 26, neutrons: 30 },
  Cu: { symbol: 'Cu', name: 'Copper', Z: 29, neutrons: 35 },
  Zn: { symbol: 'Zn', name: 'Zinc', Z: 30, neutrons: 35 },
};

/** Distribute Z electrons into Bohr shells using the teaching rule
 *  (capacities 2, 8, 8, 18, 18, 32 — correct for main-group elements up to Ca,
 *  which is the range Bohr diagrams are drawn for). */
function distributeShells(Z: number): number[] {
  const caps = [2, 8, 8, 18, 18, 32];
  const shells: number[] = [];
  let remaining = Z;
  for (const cap of caps) {
    if (remaining <= 0) break;
    const n = Math.min(cap, remaining);
    shells.push(n);
    remaining -= n;
  }
  if (remaining > 0) shells.push(remaining); // safety for very large Z
  return shells;
}

export interface BohrFigure {
  symbol: string;
  name?: string;
  protons: number;
  neutrons: number;
  /** Electron count per shell, innermost first. */
  shells: number[];
  title?: string;
}

export function solveBohrModel(params: Record<string, unknown>): BohrFigure {
  const hasExplicit =
    params.protons !== undefined ||
    params.Z !== undefined ||
    params.z !== undefined ||
    Array.isArray(params.shells);
  // Bare call (no element, no explicit atom spec) → default to carbon.
  const rawEl =
    typeof params.element === 'string' && params.element.trim()
      ? params.element.trim()
      : hasExplicit
        ? ''
        : 'C';
  // normalize e.g. "na" / "NA" → "Na"
  const key = rawEl
    ? Object.keys(BOHR_ELEMENTS).find((k) => k.toLowerCase() === rawEl.toLowerCase())
    : undefined;
  const el = key ? BOHR_ELEMENTS[key] : undefined;

  let protons: number;
  let neutrons: number;
  let symbol: string;
  let name: string | undefined;
  let shells: number[];

  if (el) {
    protons = el.Z;
    neutrons = Math.round(numOr(params.neutrons, el.neutrons));
    symbol = el.symbol;
    name = el.name;
  } else {
    // explicit / fallback path — default to carbon so a bare call still renders
    protons = Math.round(clamp(numOr(params.protons ?? params.Z ?? params.z, 6), 1, 40));
    neutrons = Math.round(clamp(numOr(params.neutrons, protons), 0, 60));
    symbol = typeof params.symbol === 'string' && params.symbol.trim() ? params.symbol.trim() : '';
    name = undefined;
  }

  // Explicit shells override the derived distribution.
  const rawShells = params.shells;
  if (Array.isArray(rawShells) && rawShells.length > 0) {
    shells = rawShells
      .map((s) => Math.round(numOr(s, 0)))
      .filter((s) => s > 0)
      .slice(0, 6);
    if (shells.length === 0) shells = distributeShells(protons);
  } else {
    shells = distributeShells(protons);
  }

  return { symbol, name, protons, neutrons, shells, title: titleOf(params) };
}

export const bohrFeatureNames = {
  figure: 'bohr-model',
  nucleus: 'bohr-nucleus',
  shells: 'bohr-shells',
  valence: 'bohr-valence',
};

export function buildBohrManifest(figure: BohrFigure): FeatureManifestEntry[] {
  const N = bohrFeatureNames;
  const label = figure.name ? `${figure.name} (${figure.symbol})` : figure.symbol || 'atom';
  const valence = figure.shells[figure.shells.length - 1] ?? 0;
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Bohr model: ${figure.title}` : `Bohr model of ${label}`,
      labels: ['bohr model', 'the bohr diagram', 'the atom', 'the diagram', 'the figure', label.toLowerCase()],
      displayName: figure.title || `Bohr model — ${label}`,
      scribbleable: true,
    },
    {
      name: N.nucleus,
      kind: 'point',
      description: `the nucleus — ${figure.protons} protons, ${figure.neutrons} neutrons`,
      labels: ['the nucleus', 'nucleus', 'the centre', 'the center', 'the core', 'protons and neutrons'],
      displayName: 'Nucleus',
      scribbleable: true,
    },
    {
      name: N.shells,
      kind: 'area',
      description: `electron shells (${figure.shells.join(', ')})`,
      labels: ['the shells', 'shells', 'the electron shells', 'the energy levels', 'the orbits', 'the rings'],
      displayName: 'Electron shells',
      scribbleable: true,
    },
    {
      name: N.valence,
      kind: 'area',
      description: `the valence (outer) shell — ${valence} electron${valence === 1 ? '' : 's'}`,
      labels: ['the valence shell', 'valence shell', 'the outer shell', 'the outermost shell', 'valence electrons'],
      displayName: 'Valence shell',
      scribbleable: true,
    },
  ];
}

// ── galvanic_cell ─────────────────────────────────────────────────────────────

/** Common electrode metals → their aqueous ion, number of electrons
 *  transferred, solution formula, and a representative colour. */
const CELL_METALS: Record<string, { symbol: string; ion: string; n: number; solution: string; color: string }> = {
  Zn: { symbol: 'Zn', ion: 'Zn²⁺', n: 2, solution: 'ZnSO₄', color: '#cbd5e1' },
  Cu: { symbol: 'Cu', ion: 'Cu²⁺', n: 2, solution: 'CuSO₄', color: '#60a5fa' },
  Ag: { symbol: 'Ag', ion: 'Ag⁺', n: 1, solution: 'AgNO₃', color: '#e2e8f0' },
  Fe: { symbol: 'Fe', ion: 'Fe²⁺', n: 2, solution: 'FeSO₄', color: '#a3b18a' },
  Mg: { symbol: 'Mg', ion: 'Mg²⁺', n: 2, solution: 'MgSO₄', color: '#d1d5db' },
  Pb: { symbol: 'Pb', ion: 'Pb²⁺', n: 2, solution: 'Pb(NO₃)₂', color: '#94a3b8' },
  Ni: { symbol: 'Ni', ion: 'Ni²⁺', n: 2, solution: 'NiSO₄', color: '#86efac' },
  Al: { symbol: 'Al', ion: 'Al³⁺', n: 3, solution: 'Al₂(SO₄)₃', color: '#e5e7eb' },
};

/** Format an electron count as a half-reaction term, e.g. 1 → "e⁻", 2 → "2e⁻". */
export function eTerm(n: number): string {
  return n === 1 ? 'e⁻' : `${n}e⁻`;
}

function resolveMetal(raw: unknown, fallbackKey: string) {
  const s = typeof raw === 'string' ? raw.trim() : '';
  const key = s ? Object.keys(CELL_METALS).find((k) => k.toLowerCase() === s.toLowerCase()) : undefined;
  return CELL_METALS[key ?? fallbackKey];
}

export interface GalvanicHalf {
  symbol: string;
  ion: string;
  /** Electrons transferred in this metal's half-reaction. */
  n: number;
  solution: string;
  color: string;
}
export interface GalvanicFigure {
  /** Left electrode — the anode (oxidation, −). */
  anode: GalvanicHalf;
  /** Right electrode — the cathode (reduction, +). */
  cathode: GalvanicHalf;
  title?: string;
}

export function solveGalvanicCell(params: Record<string, unknown>): GalvanicFigure {
  // Default = the classic Daniell cell: Zn anode ‖ Cu cathode.
  const anode = resolveMetal(params.anodeMetal ?? params.anode, 'Zn');
  const cathode = resolveMetal(params.cathodeMetal ?? params.cathode, 'Cu');
  return { anode, cathode, title: titleOf(params) };
}

export const galvanicFeatureNames = {
  figure: 'galvanic-cell',
  anode: 'galvanic-anode',
  cathode: 'galvanic-cathode',
  saltBridge: 'galvanic-salt-bridge',
  voltmeter: 'galvanic-voltmeter',
};

export function buildGalvanicManifest(figure: GalvanicFigure): FeatureManifestEntry[] {
  const N = galvanicFeatureNames;
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Galvanic cell: ${figure.title}`
        : `Galvanic (voltaic) cell — ${figure.anode.symbol} anode ‖ ${figure.cathode.symbol} cathode`,
      labels: ['galvanic cell', 'voltaic cell', 'the cell', 'the diagram', 'the figure', 'the electrochemical cell'],
      displayName: figure.title || 'Galvanic cell',
      scribbleable: true,
    },
    {
      name: N.anode,
      kind: 'area',
      description: `the anode (−): ${figure.anode.symbol} is oxidized — ${figure.anode.symbol} → ${figure.anode.ion} + ${eTerm(figure.anode.n)}`,
      labels: ['the anode', 'anode', 'the negative electrode', 'the oxidation electrode', 'the left electrode', figure.anode.symbol.toLowerCase()],
      displayName: `Anode (${figure.anode.symbol})`,
      scribbleable: true,
    },
    {
      name: N.cathode,
      kind: 'area',
      description: `the cathode (+): ${figure.cathode.ion} is reduced — ${figure.cathode.ion} + ${eTerm(figure.cathode.n)} → ${figure.cathode.symbol}`,
      labels: ['the cathode', 'cathode', 'the positive electrode', 'the reduction electrode', 'the right electrode', figure.cathode.symbol.toLowerCase()],
      displayName: `Cathode (${figure.cathode.symbol})`,
      scribbleable: true,
    },
    {
      name: N.saltBridge,
      kind: 'area',
      description: 'the salt bridge — completes the circuit and balances charge',
      labels: ['the salt bridge', 'salt bridge', 'the bridge'],
      displayName: 'Salt bridge',
      scribbleable: true,
    },
    {
      name: N.voltmeter,
      kind: 'point',
      description: 'the voltmeter measuring the cell potential (EMF)',
      labels: ['the voltmeter', 'voltmeter', 'the meter', 'the cell potential', 'the emf'],
      displayName: 'Voltmeter',
      scribbleable: true,
    },
  ];
}

// ── titration_curve ───────────────────────────────────────────────────────────
export const TITRATION_TYPES = ['strong_strong', 'weak_strong'] as const;
export type TitrationType = (typeof TITRATION_TYPES)[number];

export interface TitrationFigure {
  type: TitrationType;
  /** Sampled curve points, [volume(mL), pH]. */
  curve: [number, number][];
  /** Volume of titrant at the equivalence point (mL). */
  equivVolume: number;
  /** pH at the equivalence point. */
  equivPH: number;
  /** Weak-strong only: the buffer region [fromVol, toVol] (mL). */
  bufferRegion?: [number, number];
  /** Weak-strong only: half-equivalence point where pH = pKa. */
  halfEquiv?: { volume: number; pH: number };
  /** Total titrant volume axis max (mL). */
  vMax: number;
  title?: string;
}

// Model a 25 mL, 0.1 M analyte titrated with 0.1 M titrant (equiv at 25 mL).
const V_ANALYTE = 25;
const C = 0.1;
const EQUIV_V = 25;
const PKA = 4.75; // acetic acid, for the weak-strong case

function phStrongStrong(vb: number): number {
  const nAcid = C * V_ANALYTE; // mmol
  const nBase = C * vb; // mmol
  const vTot = V_ANALYTE + vb;
  if (Math.abs(nAcid - nBase) < 1e-9) return 7;
  if (nBase < nAcid) {
    const h = (nAcid - nBase) / vTot; // mol/L
    return -Math.log10(h);
  }
  const oh = (nBase - nAcid) / vTot;
  return 14 + Math.log10(oh);
}

function phWeakStrong(vb: number): number {
  const nAcid = C * V_ANALYTE;
  const nBase = C * vb;
  const vTot = V_ANALYTE + vb;
  if (vb <= 0) {
    // pure weak acid: pH = ½(pKa − log C)
    return 0.5 * (PKA - Math.log10(C));
  }
  if (nBase < nAcid - 1e-9) {
    // buffer region: Henderson–Hasselbalch
    return PKA + Math.log10(nBase / (nAcid - nBase));
  }
  if (Math.abs(nBase - nAcid) < 1e-9) {
    // equivalence: conjugate base hydrolysis
    const cA = nAcid / vTot; // [A⁻]
    const pKb = 14 - PKA;
    const pOH = 0.5 * (pKb - Math.log10(cA));
    return 14 - pOH;
  }
  // past equivalence: excess strong base dominates
  const oh = (nBase - nAcid) / vTot;
  return 14 + Math.log10(oh);
}

export function solveTitrationCurve(params: Record<string, unknown>): TitrationFigure {
  const type = strEnum(params.type ?? params.mode, TITRATION_TYPES) ?? 'strong_strong';
  const vMax = 50;
  const STEPS = 240;
  const ph = type === 'weak_strong' ? phWeakStrong : phStrongStrong;
  const curve: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const v = (i / STEPS) * vMax;
    const p = clamp(ph(v), 0, 14);
    curve.push([v, p]);
  }
  const equivPH = clamp(ph(EQUIV_V), 0, 14);
  const fig: TitrationFigure = {
    type,
    curve,
    equivVolume: EQUIV_V,
    equivPH,
    vMax,
    title: titleOf(params),
  };
  if (type === 'weak_strong') {
    fig.bufferRegion = [0.1 * EQUIV_V, 0.9 * EQUIV_V];
    fig.halfEquiv = { volume: EQUIV_V / 2, pH: PKA };
  }
  return fig;
}

export const titrationFeatureNames = {
  figure: 'titration-curve',
  equivalence: 'titration-equivalence',
  buffer: 'titration-buffer',
  halfEquiv: 'titration-half-equiv',
};

export function buildTitrationManifest(figure: TitrationFigure): FeatureManifestEntry[] {
  const N = titrationFeatureNames;
  const typeWord = figure.type === 'weak_strong' ? 'weak acid – strong base' : 'strong acid – strong base';
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Titration curve: ${figure.title}`
        : `Titration curve — ${typeWord} (pH vs. volume of titrant)`,
      labels: ['titration curve', 'the titration curve', 'the curve', 'the diagram', 'the figure', 'the graph'],
      displayName: figure.title || `Titration curve (${typeWord})`,
      scribbleable: true,
    },
    {
      name: N.equivalence,
      kind: 'point',
      description: `the equivalence point (pH ≈ ${figure.equivPH.toFixed(1)}) — moles of titrant = moles of analyte`,
      labels: ['the equivalence point', 'equivalence point', 'the equivalence', 'the endpoint', 'the steep part', 'the vertical jump'],
      displayName: 'Equivalence point',
      scribbleable: true,
    },
  ];
  if (figure.type === 'weak_strong') {
    feats.push(
      {
        name: N.buffer,
        kind: 'area',
        description: 'the buffer region — pH resists change (flat plateau)',
        labels: ['the buffer region', 'buffer region', 'the buffer', 'the plateau', 'the flat part'],
        displayName: 'Buffer region',
        scribbleable: true,
      },
      {
        name: N.halfEquiv,
        kind: 'point',
        description: `the half-equivalence point where pH = pKa ≈ ${PKA}`,
        labels: ['the half-equivalence point', 'half-equivalence point', 'the half equivalence', 'where ph equals pka', 'the pka point'],
        displayName: 'Half-equivalence (pH = pKa)',
        scribbleable: true,
      },
    );
  }
  return feats;
}

// ── crystal_lattice ───────────────────────────────────────────────────────────
export const LATTICE_TYPES = ['sc', 'bcc', 'fcc'] as const;
export type LatticeType = (typeof LATTICE_TYPES)[number];

export interface LatticeAtom {
  /** Fractional unit-cell coordinates, each in [0,1]. */
  x: number;
  y: number;
  z: number;
  role: 'corner' | 'body' | 'face';
}
export interface LatticeFigure {
  type: LatticeType;
  atoms: LatticeAtom[];
  /** Number of atoms per unit cell (accounting for sharing). */
  atomsPerCell: number;
  title?: string;
}

const LATTICE_NAMES: Record<LatticeType, string> = {
  sc: 'Simple cubic',
  bcc: 'Body-centred cubic',
  fcc: 'Face-centred cubic',
};

function cornerAtoms(): LatticeAtom[] {
  const pts: LatticeAtom[] = [];
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) {
    pts.push({ x, y, z, role: 'corner' });
  }
  return pts;
}

export function solveCrystalLattice(params: Record<string, unknown>): LatticeFigure {
  const type = strEnum(params.type ?? params.lattice ?? params.mode, LATTICE_TYPES) ?? 'sc';
  const atoms = cornerAtoms();
  let atomsPerCell = 1; // 8 corners × ⅛
  if (type === 'bcc') {
    atoms.push({ x: 0.5, y: 0.5, z: 0.5, role: 'body' });
    atomsPerCell = 2; // 8×⅛ + 1
  } else if (type === 'fcc') {
    // six face centres
    const faces: [number, number, number][] = [
      [0.5, 0.5, 0], [0.5, 0.5, 1],
      [0.5, 0, 0.5], [0.5, 1, 0.5],
      [0, 0.5, 0.5], [1, 0.5, 0.5],
    ];
    for (const [x, y, z] of faces) atoms.push({ x, y, z, role: 'face' });
    atomsPerCell = 4; // 8×⅛ + 6×½
  }
  return { type, atoms, atomsPerCell, title: titleOf(params) };
}

export function latticeName(type: LatticeType): string {
  return LATTICE_NAMES[type];
}

export const latticeFeatureNames = {
  figure: 'crystal-lattice',
  cornerAtoms: 'lattice-corner-atoms',
  interiorAtoms: 'lattice-interior-atoms',
};

export function buildLatticeManifest(figure: LatticeFigure): FeatureManifestEntry[] {
  const N = latticeFeatureNames;
  const name = LATTICE_NAMES[figure.type];
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Crystal lattice: ${figure.title}`
        : `Crystal lattice — ${name} unit cell (${figure.atomsPerCell} atom${figure.atomsPerCell === 1 ? '' : 's'} per cell)`,
      labels: ['crystal lattice', 'the unit cell', 'the lattice', 'the diagram', 'the figure', name.toLowerCase()],
      displayName: figure.title || `${name} unit cell`,
      scribbleable: true,
    },
    {
      name: N.cornerAtoms,
      kind: 'area',
      description: 'the corner atoms — each shared between 8 unit cells (⅛ each)',
      labels: ['the corner atoms', 'corner atoms', 'the corners', 'the corner lattice points'],
      displayName: 'Corner atoms',
      scribbleable: true,
    },
  ];
  if (figure.type === 'bcc') {
    feats.push({
      name: N.interiorAtoms,
      kind: 'point',
      description: 'the body-centre atom — wholly inside the cell (1 atom)',
      labels: ['the body-centre atom', 'body centre atom', 'the center atom', 'the middle atom', 'the interior atom'],
      displayName: 'Body-centre atom',
      scribbleable: true,
    });
  } else if (figure.type === 'fcc') {
    feats.push({
      name: N.interiorAtoms,
      kind: 'area',
      description: 'the face-centre atoms — each shared between 2 cells (½ each)',
      labels: ['the face-centre atoms', 'face centre atoms', 'the face atoms', 'the face lattice points'],
      displayName: 'Face-centre atoms',
      scribbleable: true,
    });
  }
  return feats;
}
