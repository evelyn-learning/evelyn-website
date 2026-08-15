/**
 * SMILES canonicalization + comparison via RDKit WASM.
 *
 * Loads RDKit once per Node process and caches the module. Used to:
 *   1. Canonicalize a SMILES string so we can compare two inputs for
 *      structural equality (different SMILES can represent the same
 *      molecule — e.g. "CCO" and "OCC" are both ethanol).
 *   2. Verify a claimed name against a canonical lookup for common
 *      molecules students work with in AP Chem / O Chem.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RDKitMod = { get_mol(s: string): RDKitMol | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RDKitMol = { get_smiles(): string; is_valid(): boolean; delete(): void };

let rdkitPromise: Promise<RDKitMod> | null = null;

async function getRDKit(): Promise<RDKitMod> {
  if (rdkitPromise) return rdkitPromise;
  rdkitPromise = (async () => {
    // Dynamic import keeps the WASM load out of cold-start / non-chemistry paths.
    // @rdkit/rdkit exports a factory that returns a Promise<module>.
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const initRDKitModule: any = require('@rdkit/rdkit');
    const factory = initRDKitModule.default || initRDKitModule;
    const mod = await factory();
    return mod as RDKitMod;
  })().catch((err) => {
    console.error('[SMILES] RDKit initialization failed:', err);
    rdkitPromise = null;
    throw err;
  });
  return rdkitPromise;
}

/**
 * Return the canonical SMILES for an input string. Returns null if the
 * input is not a parseable SMILES.
 */
export async function canonicalize(smiles: string): Promise<string | null> {
  if (!smiles || typeof smiles !== 'string') return null;
  try {
    const rd = await getRDKit();
    const mol = rd.get_mol(smiles);
    if (!mol) return null;
    if (!mol.is_valid()) { mol.delete(); return null; }
    const canonical = mol.get_smiles();
    mol.delete();
    return canonical || null;
  } catch (err) {
    console.error('[SMILES] canonicalize threw:', err);
    return null;
  }
}

/**
 * Compare two SMILES for structural equivalence by canonicalizing both.
 * Returns { equivalent, canonicalA, canonicalB }.
 */
export async function smilesEquivalent(a: string, b: string): Promise<{
  equivalent: boolean;
  canonicalA: string | null;
  canonicalB: string | null;
}> {
  const [canonicalA, canonicalB] = await Promise.all([canonicalize(a), canonicalize(b)]);
  return {
    equivalent: canonicalA !== null && canonicalB !== null && canonicalA === canonicalB,
    canonicalA,
    canonicalB,
  };
}

// Canonical SMILES for common molecules students encounter. The LLM may
// claim "CCO is methanol" — we can cross-check quickly against this map
// without invoking RDKit for every call.
// eslint-disable-next-line @typescript-eslint/prefer-as-const
export const COMMON_MOLECULES: Record<string, { smiles: string; aliases: string[] }> = {
  water:               { smiles: 'O',               aliases: ['h2o'] },
  methane:             { smiles: 'C',               aliases: ['ch4'] },
  ethane:              { smiles: 'CC',              aliases: ['c2h6'] },
  propane:             { smiles: 'CCC',             aliases: ['c3h8'] },
  butane:              { smiles: 'CCCC',            aliases: ['c4h10'] },
  ethylene:            { smiles: 'C=C',             aliases: ['ethene', 'c2h4'] },
  acetylene:           { smiles: 'C#C',             aliases: ['ethyne', 'c2h2'] },
  methanol:            { smiles: 'CO',              aliases: ['methyl alcohol', 'ch3oh'] },
  ethanol:             { smiles: 'CCO',             aliases: ['ethyl alcohol', 'c2h5oh'] },
  isopropanol:         { smiles: 'CC(C)O',          aliases: ['2-propanol', 'isopropyl alcohol', 'ipa'] },
  acetaldehyde:        { smiles: 'CC=O',            aliases: ['ethanal'] },
  acetone:             { smiles: 'CC(=O)C',         aliases: ['propanone'] },
  aceticacid:          { smiles: 'CC(=O)O',         aliases: ['acetic acid', 'ethanoic acid', 'vinegar'] },
  formaldehyde:        { smiles: 'C=O',             aliases: ['methanal'] },
  formicacid:          { smiles: 'C(=O)O',          aliases: ['formic acid', 'methanoic acid'] },
  benzene:             { smiles: 'c1ccccc1',        aliases: ['c6h6'] },
  toluene:             { smiles: 'Cc1ccccc1',       aliases: ['methylbenzene'] },
  phenol:              { smiles: 'Oc1ccccc1',       aliases: ['carbolic acid'] },
  aniline:             { smiles: 'Nc1ccccc1',       aliases: ['aminobenzene'] },
  glucose:             { smiles: 'OCC1OC(O)C(O)C(O)C1O', aliases: ['d-glucose', 'dextrose'] },
  ammonia:             { smiles: 'N',               aliases: ['nh3'] },
  carbondioxide:       { smiles: 'O=C=O',           aliases: ['carbon dioxide', 'co2'] },
  hydrogencyanide:     { smiles: 'C#N',             aliases: ['hydrogen cyanide', 'hcn'] },
  urea:                { smiles: 'NC(=O)N',         aliases: ['carbamide'] },
  caffeine:            { smiles: 'Cn1cnc2c1c(=O)n(C)c(=O)n2C', aliases: [] },
  aspirin:             { smiles: 'CC(=O)Oc1ccccc1C(=O)O', aliases: ['acetylsalicylic acid'] },
};

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[\s\-_']/g, '');
}

/**
 * Look up a molecule by common name. Returns canonical SMILES or null if
 * not in the dictionary.
 */
export function smilesForName(name: string): string | null {
  const n = normalizeName(name);
  if (COMMON_MOLECULES[n]) return COMMON_MOLECULES[n].smiles;
  for (const [, info] of Object.entries(COMMON_MOLECULES)) {
    if (info.aliases.some(a => normalizeName(a) === n)) return info.smiles;
  }
  return null;
}

/**
 * Verify a "SMILES X = name Y" claim. Returns match + canonical forms.
 * If the name is known, compares claimed SMILES against the canonical name
 * SMILES. If the name is unknown, returns correct=true (can't refute).
 */
export async function validateSmilesName(smilesClaim: string, name: string): Promise<{
  correct: boolean;
  expected?: string;
  canonical?: string;
  issues?: string[];
}> {
  // Parseability check first: an unparseable SMILES is wrong regardless of whether
  // the name is in our lookup. Catches valence errors like CC[H](S(C)CC)C where
  // [H] is given three bonds, or CCO(S(C)CC)C where O carries three bonds.
  const canonical = await canonicalize(smilesClaim);
  if (canonical === null) {
    return {
      correct: false,
      issues: [`SMILES "${smilesClaim}" is not a valid molecular structure — it fails to parse (usually a valence violation).`],
    };
  }
  const expected = smilesForName(name);
  if (!expected) {
    return {
      correct: true,
      canonical,
      issues: [`Structure parses cleanly but name "${name}" is not in the canonical lookup — name not verified.`],
    };
  }
  const cmp = await smilesEquivalent(smilesClaim, expected);
  if (cmp.equivalent) {
    return {
      correct: true,
      canonical: cmp.canonicalA ?? undefined,
      expected: cmp.canonicalB ?? undefined,
    };
  }
  return {
    correct: false,
    canonical: cmp.canonicalA ?? undefined,
    expected: cmp.canonicalB ?? undefined,
    issues: [`SMILES "${smilesClaim}" (canonical "${cmp.canonicalA}") does not match "${name}" (canonical "${cmp.canonicalB}").`],
  };
}
