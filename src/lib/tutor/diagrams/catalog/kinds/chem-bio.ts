/** Phase 3 — chemistry + biology solvers. */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

// ── electron_configuration ────────────────────────────────────────────────
const SUBSHELL_CAPACITY: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 };
const FILL_ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
const ELEMENT_Z: Record<string, number> = {
  H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
  Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18,
  K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30,
  Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36,
  Rb: 37, Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48,
  In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, Xe: 54,
};

export interface ElectronConfigurationFigure {
  element: string;
  Z: number;
  config: Array<{ subshell: string; electrons: number }>;
  title?: string;
}
export function solveElectronConfiguration(params: Record<string, unknown>): ElectronConfigurationFigure {
  const element = typeof params.element === 'string' ? params.element : '';
  let Z = ELEMENT_Z[element];
  if (typeof params.Z === 'number' && Number.isFinite(params.Z) && params.Z > 0) Z = params.Z;
  if (!Z) throw new Error('electron_configuration: provide element (symbol) or Z (atomic number)');
  if (Z > 54) throw new Error('electron_configuration: only Z 1-54 supported in this solver');
  let remaining = Z;
  const config: Array<{ subshell: string; electrons: number }> = [];
  for (const ss of FILL_ORDER) {
    if (remaining <= 0) break;
    const cap = SUBSHELL_CAPACITY[ss[1]];
    const fill = Math.min(remaining, cap);
    config.push({ subshell: ss, electrons: fill });
    remaining -= fill;
  }
  return { element: element || `Z=${Z}`, Z, config, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── orbital_diagram ───────────────────────────────────────────────────────
export interface OrbitalDiagramFigure {
  element: string;
  Z: number;
  /** Per-subshell list of orbitals with up/down arrows. */
  shells: Array<{
    subshell: string;
    orbitals: Array<{ up: boolean; down: boolean }>;
  }>;
  title?: string;
}
export function solveOrbitalDiagram(params: Record<string, unknown>): OrbitalDiagramFigure {
  const cfg = solveElectronConfiguration(params);
  const shells = cfg.config.map(({ subshell, electrons }) => {
    const cap = SUBSHELL_CAPACITY[subshell[1]];
    const orbitalCount = cap / 2;
    const orbitals: Array<{ up: boolean; down: boolean }> = Array.from({ length: orbitalCount }, () => ({ up: false, down: false }));
    // Hund's rule: fill all up first, then start pairing.
    let e = electrons;
    for (let i = 0; i < orbitalCount && e > 0; i++) { orbitals[i].up = true; e--; }
    for (let i = 0; i < orbitalCount && e > 0; i++) { orbitals[i].down = true; e--; }
    return { subshell, orbitals };
  });
  return { element: cfg.element, Z: cfg.Z, shells, title: cfg.title };
}

// ── periodic_table_highlight ──────────────────────────────────────────────
export interface PeriodicTableHighlightFigure {
  highlights: Array<{ element: string; color?: string; label?: string }>;
  title?: string;
}
export function solvePeriodicTableHighlight(params: Record<string, unknown>): PeriodicTableHighlightFigure {
  if (!Array.isArray(params.highlights) || params.highlights.length === 0) {
    throw new Error('periodic_table_highlight: highlights must be a non-empty array');
  }
  const highlights = (params.highlights as Array<Record<string, unknown>>).map((h, i) => {
    if (typeof h.element !== 'string' || !h.element.trim()) {
      throw new Error(`periodic_table_highlight: highlights[${i}].element required`);
    }
    return {
      element: h.element,
      color: typeof h.color === 'string' ? h.color : undefined,
      label: typeof h.label === 'string' ? h.label : undefined,
    };
  });
  return { highlights, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── punnett_square ────────────────────────────────────────────────────────
export interface PunnettSquareFigure {
  parentA: string;
  parentB: string;
  alleles: { aGametes: string[]; bGametes: string[] };
  cells: string[][]; // [row][col]
  title?: string;
}
export function solvePunnettSquare(params: Record<string, unknown>): PunnettSquareFigure {
  const a = typeof params.parentA === 'string' ? params.parentA : '';
  const b = typeof params.parentB === 'string' ? params.parentB : '';
  if (!/^[A-Za-z]{2}$/.test(a) || !/^[A-Za-z]{2}$/.test(b)) {
    throw new Error('punnett_square: parentA and parentB must be two-letter genotypes (e.g. "Bb")');
  }
  const aGametes = [a[0], a[1]];
  const bGametes = [b[0], b[1]];
  const cells = aGametes.map((ag) => bGametes.map((bg) => sortAlleles(ag + bg)));
  return {
    parentA: a, parentB: b,
    alleles: { aGametes, bGametes },
    cells,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
function sortAlleles(pair: string): string {
  const a = pair[0], b = pair[1];
  // Capital (dominant) first.
  if (a >= 'a' && b <= 'Z') return b + a;
  return pair;
}

// ── Phase 3 manifests — electron_configuration / orbital_diagram /
//    periodic_table_highlight / punnett_square ──────────────────────────────

export const electronConfigurationFeatureNames = {
  notation: 'notation',
  element: 'element',
  subshell: (i: number): string => `subshell-${i + 1}`,
};

export function buildElectronConfigurationManifest(figure: ElectronConfigurationFigure): FeatureManifestEntry[] {
  const N = electronConfigurationFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.notation,
      kind: 'region',
      description: `electron configuration for ${figure.element} (Z=${figure.Z})`,
      labels: ['notation', 'the notation', 'the configuration', 'the diagram'],
      displayName: figure.title || `${figure.element} configuration`,
      scribbleable: true,
    },
    {
      name: N.element,
      kind: 'label',
      description: `element label: "${figure.element}" (Z=${figure.Z})`,
      labels: ['element', 'the element', figure.element, `Z=${figure.Z}`, `Z = ${figure.Z}`],
      displayName: `${figure.element} (Z=${figure.Z})`,
      scribbleable: true,
    },
  ];
  figure.config.forEach((c, i) => {
    const entryStr = `${c.subshell}${c.electrons}`;
    features.push({
      name: N.subshell(i),
      kind: 'label',
      description: `subshell ${c.subshell} with ${c.electrons} electron${c.electrons === 1 ? '' : 's'}`,
      labels: [
        `subshell ${i + 1}`, `subshell-${i + 1}`,
        c.subshell, `the ${c.subshell}`, `"${c.subshell}"`,
        entryStr, `${c.subshell}^${c.electrons}`,
      ],
      displayName: `${c.subshell} (${c.electrons}e⁻)`,
      scribbleable: true,
    });
  });
  return features;
}

export const orbitalDiagramFeatureNames = {
  orbital: 'orbital-diagram',
  element: 'element',
  shell: (i: number): string => `shell-${i + 1}`,
};

export function buildOrbitalDiagramManifest(figure: OrbitalDiagramFigure): FeatureManifestEntry[] {
  const N = orbitalDiagramFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.orbital,
      kind: 'region',
      description: `orbital diagram for ${figure.element} (Z=${figure.Z})`,
      labels: ['orbital diagram', 'the orbital diagram', 'the diagram', 'orbitals'],
      displayName: figure.title || `${figure.element} orbital diagram`,
      scribbleable: true,
    },
    {
      name: N.element,
      kind: 'label',
      description: `element: "${figure.element}" (Z=${figure.Z})`,
      labels: ['element', 'the element', figure.element, `Z=${figure.Z}`],
      displayName: `${figure.element} (Z=${figure.Z})`,
      scribbleable: true,
    },
  ];
  figure.shells.forEach((sh, i) => {
    features.push({
      name: N.shell(i),
      kind: 'area',
      description: `${sh.subshell} shell (${sh.orbitals.length} orbital${sh.orbitals.length === 1 ? '' : 's'})`,
      labels: [
        `shell ${i + 1}`, `shell-${i + 1}`, `shell-${sh.subshell}`,
        sh.subshell, `the ${sh.subshell}`, `${sh.subshell} shell`, `the ${sh.subshell} shell`,
        `${sh.subshell} orbital`, `${sh.subshell} orbitals`,
      ],
      displayName: `${sh.subshell} shell`,
      scribbleable: true,
    });
  });
  return features;
}

export const periodicTableHighlightFeatureNames = {
  table: 'table',
  element: (sym: string): string => `element-${sym}`,
};

export function buildPeriodicTableHighlightManifest(figure: PeriodicTableHighlightFigure): FeatureManifestEntry[] {
  const N = periodicTableHighlightFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.table,
      kind: 'region',
      description: figure.title ? `periodic table: ${figure.title}` : 'periodic table',
      labels: ['table', 'the table', 'periodic table', 'the periodic table', 'the diagram'],
      displayName: figure.title || 'periodic table',
      scribbleable: true,
    },
  ];
  // Only register MANIFEST entries for highlighted elements — the brain
  // would have no reason to scribble an unhighlighted cell, and 100+
  // unused feature names would bloat the catalog hint list.
  figure.highlights.forEach((h) => {
    const sym = h.element;
    const niceLabel = h.label ? `${sym} (${h.label})` : sym;
    features.push({
      name: N.element(sym),
      kind: 'label',
      description: h.label ? `${sym}: ${h.label}` : `element ${sym}`,
      labels: [
        sym, `the ${sym}`, `element ${sym}`, `"${sym}"`,
        ...(h.label ? [h.label, `the ${h.label}`, `"${h.label}"`] : []),
      ],
      displayName: niceLabel,
      scribbleable: true,
    });
  });
  return features;
}

export const punnettSquareFeatureNames = {
  punnett: 'punnett',
  parentA: 'parent-a',
  parentB: 'parent-b',
  aGamete: (i: number): string => `a-gamete-${i + 1}`,
  bGamete: (i: number): string => `b-gamete-${i + 1}`,
  cell: (r: number, c: number): string => `cell-r${r + 1}-c${c + 1}`,
};

export function buildPunnettSquareManifest(figure: PunnettSquareFigure): FeatureManifestEntry[] {
  const N = punnettSquareFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.punnett,
      kind: 'region',
      description: figure.title ? `Punnett square: ${figure.title}` : `Punnett square ${figure.parentA} × ${figure.parentB}`,
      labels: ['punnett', 'the punnett', 'punnett square', 'the punnett square', 'the diagram', 'the square'],
      displayName: figure.title || `${figure.parentA} × ${figure.parentB}`,
      scribbleable: true,
    },
    {
      name: N.parentA,
      kind: 'label',
      description: `Parent A: "${figure.parentA}"`,
      labels: ['parent A', 'parent-a', 'parent a', figure.parentA, `parent ${figure.parentA}`, 'top parent', 'first parent'],
      displayName: `Parent ${figure.parentA}`,
      scribbleable: true,
    },
    {
      name: N.parentB,
      kind: 'label',
      description: `Parent B: "${figure.parentB}"`,
      labels: ['parent B', 'parent-b', 'parent b', figure.parentB, `parent ${figure.parentB}`, 'side parent', 'second parent'],
      displayName: `Parent ${figure.parentB}`,
      scribbleable: true,
    },
  ];
  figure.alleles.aGametes.forEach((g, i) => {
    features.push({
      name: N.aGamete(i),
      kind: 'label',
      description: `Parent A gamete ${i + 1}: "${g}"`,
      labels: [
        `A gamete ${i + 1}`, `a-gamete-${i + 1}`,
        `parent A's ${g}`, `parent A ${g}`, g, `"${g}" from parent A`,
      ],
      displayName: `A gamete ${g}`,
      scribbleable: true,
    });
  });
  figure.alleles.bGametes.forEach((g, i) => {
    features.push({
      name: N.bGamete(i),
      kind: 'label',
      description: `Parent B gamete ${i + 1}: "${g}"`,
      labels: [
        `B gamete ${i + 1}`, `b-gamete-${i + 1}`,
        `parent B's ${g}`, `parent B ${g}`, g, `"${g}" from parent B`,
      ],
      displayName: `B gamete ${g}`,
      scribbleable: true,
    });
  });
  figure.cells.forEach((row, r) => {
    row.forEach((genotype, c) => {
      features.push({
        name: N.cell(r, c),
        kind: 'label',
        description: `offspring cell (row ${r + 1}, col ${c + 1}): "${genotype}"`,
        labels: [
          `cell ${r + 1} ${c + 1}`, `cell-r${r + 1}-c${c + 1}`,
          `row ${r + 1} column ${c + 1}`,
          `row ${r + 1} col ${c + 1}`,
          genotype, `the ${genotype}`, `"${genotype}"`,
          `${genotype} offspring`, `${genotype} genotype`,
        ],
        displayName: genotype,
        scribbleable: true,
      });
    });
  });
  return features;
}

// ── life_cycle / water_cycle / rock_cycle ─────────────────────────────────
export interface CycleStagesFigure {
  stages: Array<{ label: string; description?: string; color?: string }>;
  title?: string;
}
export function solveCycleStages(params: Record<string, unknown>): CycleStagesFigure {
  if (!Array.isArray(params.stages) || params.stages.length < 2) {
    throw new Error('cycle: stages must be an array of at least 2');
  }
  const stages = (params.stages as Array<Record<string, unknown>>).map((s, i) => {
    if (typeof s.label !== 'string' || !s.label.trim()) {
      throw new Error(`cycle: stages[${i}].label required`);
    }
    return {
      label: s.label,
      description: typeof s.description === 'string' ? s.description : undefined,
      color: typeof s.color === 'string' ? s.color : undefined,
    };
  });
  return { stages, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── body_system ───────────────────────────────────────────────────────────
export interface BodySystemFigure {
  system: string; // e.g. "digestive", "circulatory"
  parts: Array<{ label: string; description?: string }>;
  title?: string;
}
export function solveBodySystem(params: Record<string, unknown>): BodySystemFigure {
  const system = typeof params.system === 'string' ? params.system : '';
  if (!system) throw new Error('body_system: system is required');
  const parts = Array.isArray(params.parts)
    ? (params.parts as Array<Record<string, unknown>>).map((p, i) => {
        if (typeof p.label !== 'string' || !p.label.trim()) {
          throw new Error(`body_system: parts[${i}].label required`);
        }
        return { label: p.label, description: typeof p.description === 'string' ? p.description : undefined };
      })
    : [];
  return { system, parts, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── cycle_stages manifest (Phase 2b — life_cycle / water_cycle / rock_cycle)
export const cycleStagesFeatureNames = {
  cycle: 'cycle',
  stage: (i: number): string => `stage-${i + 1}`,
};

/** Slug helper for semantic stage aliases. The brain often refers to a
 *  water_cycle stage as `stage-precipitation` rather than `stage-3`; we
 *  add the semantic form as an extra label so both resolve. */
function stageSlug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function buildCycleStagesManifest(figure: CycleStagesFigure): FeatureManifestEntry[] {
  const N = cycleStagesFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.cycle,
      kind: 'region',
      description: figure.title ? `cycle: ${figure.title}` : 'cycle',
      labels: ['cycle', 'the cycle', 'the diagram'],
      displayName: figure.title || 'cycle',
      scribbleable: true,
    },
  ];
  figure.stages.forEach((s, i) => {
    const label = String(s.label ?? '').trim();
    const slug = stageSlug(label);
    features.push({
      name: N.stage(i),
      kind: 'area',
      description: label ? `stage ${i + 1}: "${label}"` : `stage ${i + 1}`,
      labels: [
        `stage ${i + 1}`, `stage-${i + 1}`,
        ...(label ? [
          label, `the ${label}`, `"${label}"`,
          `${label} stage`, `the ${label} stage`,
          // Verbose form the brain emits when echoing the
          // boardSnapshot's description ("stage 1: \"Evaporation\"").
          // Without these the catalog returns no_match and the
          // scribble silent-drops — observed 2026-05-13 session #16
          // image #59: brain emitted target="stage 1: \"Evaporation\""
          // twice, both rejected.
          `stage ${i + 1}: "${label}"`, `stage ${i + 1}: ${label}`,
          `stage-${i + 1}: "${label}"`,
        ] : []),
        ...(slug ? [`stage-${slug}`] : []),
      ],
      displayName: label || `stage ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── body_system manifest (Phase 2b — HTML-mode organizer) ─────────────────
export const bodySystemFeatureNames = {
  system: 'system',
  part: (i: number): string => `part-${i + 1}`,
};

export function buildBodySystemManifest(figure: BodySystemFigure): FeatureManifestEntry[] {
  const N = bodySystemFeatureNames;
  const sys = String(figure.system ?? '').trim();
  const features: FeatureManifestEntry[] = [
    {
      name: N.system,
      kind: 'region',
      description: sys ? `body system: ${sys}` : 'body system',
      labels: [
        'system', 'the system', 'the diagram',
        ...(sys ? [`${sys} system`, `the ${sys} system`, sys] : []),
      ],
      displayName: sys ? `${sys} system` : 'body system',
      scribbleable: true,
    },
  ];
  figure.parts.forEach((p, i) => {
    const label = String(p.label ?? '').trim();
    features.push({
      name: N.part(i),
      kind: 'label',
      description: label ? `part ${i + 1}: "${label}"` : `part ${i + 1}`,
      labels: [
        `part ${i + 1}`, `part-${i + 1}`,
        ...(label ? [label, `the ${label}`, `"${label}"`] : []),
      ],
      displayName: label || `part ${i + 1}`,
      scribbleable: true,
    });
  });
  return features;
}
