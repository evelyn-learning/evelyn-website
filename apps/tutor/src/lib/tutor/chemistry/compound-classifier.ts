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

// ── Formula → SMILES ─────────────────────────────────────────────────────────
// The tool accepts plain formulas ("NaCl", "CuSO4·5H2O", "H2O"), but the editor
// only understands SMILES: handed "NaCl" it reads N–a–Cl and draws an amine.
// Salts are therefore rebuilt as charged ions, and the everyday molecules that
// are usually written as formulas are mapped to their SMILES.

/** Metals (plus ammonium) that form the cation of a salt. Hydrogen is NOT
 *  here: H2O, HCl, NH3 and the acids are molecules, not ionic lattices. */
const SALT_CATIONS = new Set([
  'Li', 'Na', 'K', 'Rb', 'Cs', 'Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Al',
  'Fe', 'Cu', 'Zn', 'Ag', 'Pb', 'Sn', 'Ni', 'Co', 'Mn', 'Cr', 'Hg', 'Ti',
]);
/** Cations whose charge is the same in every salt — only these are labelled
 *  "ionic compound" automatically and get the ion picture. */
const FIXED_CHARGE: Record<string, number> = {
  Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2,
};
const ANIONS: Record<string, { charge: number; smiles: string }> = {
  F: { charge: -1, smiles: '[F-]' },
  Cl: { charge: -1, smiles: '[Cl-]' },
  Br: { charge: -1, smiles: '[Br-]' },
  I: { charge: -1, smiles: '[I-]' },
  O: { charge: -2, smiles: '[O-2]' },
  S: { charge: -2, smiles: '[S-2]' },
  N: { charge: -3, smiles: '[N-3]' },
  P: { charge: -3, smiles: '[P-3]' },
  OH: { charge: -1, smiles: '[OH-]' },
  NO3: { charge: -1, smiles: '[O-][N+](=O)[O-]' },
  NO2: { charge: -1, smiles: '[O-]N=O' },
  SO4: { charge: -2, smiles: '[O-]S(=O)(=O)[O-]' },
  SO3: { charge: -2, smiles: '[O-]S(=O)[O-]' },
  S2O3: { charge: -2, smiles: '[O-]S(=O)(=S)[O-]' },
  CO3: { charge: -2, smiles: '[O-]C(=O)[O-]' },
  HCO3: { charge: -1, smiles: 'OC(=O)[O-]' },
  PO4: { charge: -3, smiles: '[O-]P(=O)([O-])[O-]' },
  ClO3: { charge: -1, smiles: '[O-]Cl(=O)=O' },
  MnO4: { charge: -1, smiles: '[O-][Mn](=O)(=O)=O' },
  Cr2O7: { charge: -2, smiles: '[O-][Cr](=O)(=O)O[Cr](=O)(=O)[O-]' },
  C2H3O2: { charge: -1, smiles: 'CC(=O)[O-]' },
  CH3COO: { charge: -1, smiles: 'CC(=O)[O-]' },
  CN: { charge: -1, smiles: '[C-]#N' },
};
/** Molecules commonly written as formulas rather than SMILES. */
const MOLECULE_SMILES: Record<string, string> = {
  H2O: 'O', NH3: 'N', CH4: 'C', CO2: 'O=C=O', CO: '[C-]#[O+]', HCl: 'Cl', HF: 'F', HBr: 'Br', HI: 'I',
  H2S: 'S', H2: '[H][H]', O2: 'O=O', N2: 'N#N', Cl2: 'ClCl', F2: 'FF', Br2: 'BrBr', I2: 'II', O3: '[O-][O+]=O',
  H2O2: 'OO', SO2: 'O=S=O', SO3: 'O=S(=O)=O', NO2: '[O-][N+]=O', NO: '[N]=O', N2O: '[N-]=[N+]=O',
  HCN: 'C#N', CH3OH: 'CO', C2H5OH: 'CCO', CH3COOH: 'CC(=O)O', C2H6: 'CC', C2H4: 'C=C', C2H2: 'C#C',
  C3H8: 'CCC', C6H6: 'c1ccccc1', H2SO4: 'OS(=O)(=O)O', HNO3: 'O[N+](=O)[O-]', H3PO4: 'OP(=O)(O)O',
  H2CO3: 'OC(=O)O', PCl3: 'ClP(Cl)Cl', PCl5: 'ClP(Cl)(Cl)(Cl)Cl', SF6: 'FS(F)(F)(F)(F)F', CCl4: 'ClC(Cl)(Cl)Cl',
  BF3: 'FB(F)F', NF3: 'FN(F)F', CH2O: 'C=O', C6H12O6: 'OCC(O)C(O)C(O)C(O)C=O',
};

interface ParsedSalt {
  cation: string;        // "Na", "Cu", "NH4"
  cationCount: number;
  cationCharge: number;
  anion: string;         // key of ANIONS
  anionCount: number;
  smiles: string;
}

/** "Na2SO4" / "Ca(OH)2" / "(NH4)2CO3" / "MgCl2" → its ions, or null when the
 *  string is not a salt formula we recognise (including every real SMILES). */
function parseSalt(formula: string): ParsedSalt | null {
  const f = formula.replace(/\s+/g, '');
  let m = /^\(NH4\)(\d*)(.+)$/.exec(f) || /^(NH4)()(.+)$/.exec(f);
  let cation: string;
  let cationCount: number;
  let rest: string;
  if (m) {
    cation = 'NH4';
    cationCount = m[1] && /^\d+$/.test(m[1]) ? parseInt(m[1], 10) : 1;
    rest = m[3] ?? m[2];
  } else {
    m = /^([A-Z][a-z]?)(\d*)(.+)$/.exec(f);
    if (!m || !SALT_CATIONS.has(m[1])) return null;
    cation = m[1];
    cationCount = m[2] ? parseInt(m[2], 10) : 1;
    rest = m[3];
  }
  let anion: string;
  let anionCount: number;
  const paren = /^\(([A-Za-z0-9]+)\)(\d*)$/.exec(rest);
  if (paren && ANIONS[paren[1]]) {
    anion = paren[1];
    anionCount = paren[2] ? parseInt(paren[2], 10) : 1;
  } else if (ANIONS[rest]) {
    anion = rest;
    anionCount = 1;
  } else {
    const mono = /^([A-Z][a-z]?)(\d*)$/.exec(rest);
    if (!mono || !ANIONS[mono[1]]) return null;
    anion = mono[1];
    anionCount = mono[2] ? parseInt(mono[2], 10) : 1;
  }
  const negative = -ANIONS[anion].charge * anionCount;
  const cationCharge = negative / cationCount;
  if (!Number.isInteger(cationCharge) || cationCharge < 1 || cationCharge > 4) return null;
  if (cation === 'NH4' && cationCharge !== 1) return null;
  if (FIXED_CHARGE[cation] !== undefined && FIXED_CHARGE[cation] !== cationCharge) return null;
  const cationSmiles = cation === 'NH4' ? '[NH4+]' : `[${cation}+${cationCharge === 1 ? '' : cationCharge}]`;
  const parts = [
    ...Array.from({ length: cationCount }, () => cationSmiles),
    ...Array.from({ length: anionCount }, () => ANIONS[anion].smiles),
  ];
  return { cation, cationCount, cationCharge, anion, anionCount, smiles: parts.join('.') };
}

/** What to hand the editor for a plain-formula input; SMILES passes through. */
function formulaToSmiles(input: string): string {
  const salt = parseSalt(input);
  if (salt) return salt.smiles;
  return MOLECULE_SMILES[input.replace(/\s+/g, '')] ?? input;
}

/** Ions of a BINARY salt of a fixed-charge metal ("NaCl", "MgCl2", "K2O"), for
 *  the ion picture under the structure. Anything else (polyatomic ions,
 *  transition metals, molecules such as H2O or NH3) returns null. */
function parseIonsFromFormula(formula: string): Array<{ symbol: string; charge: number; count: number }> | null {
  const salt = parseSalt(formula.replace(HYDRATE_RE, '').trim());
  if (!salt || FIXED_CHARGE[salt.cation] === undefined) return null;
  if (!/^[A-Z][a-z]?$/.test(salt.anion)) return null;
  return [
    { symbol: salt.cation, charge: salt.cationCharge, count: salt.cationCount },
    { symbol: salt.anion, charge: ANIONS[salt.anion].charge, count: salt.anionCount },
  ];
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
    // A formula such as "CuSO4" is rebuilt as its ions first (the editor
    // cannot read formulas); real SMILES passes through unchanged.
    const ketcherSmiles = `${formulaToSmiles(anhydrous)}.${waterUnits}`;
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
      ketcherSmiles: formulaToSmiles(original),
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
      return { kind: 'ionic', ketcherSmiles: formulaToSmiles(original), ions: formulaIons, originalInput: original };
    }
  }

  // 3. Default — molecular.
  return { kind: 'molecular', ketcherSmiles: formulaToSmiles(original), originalInput: original };
}
