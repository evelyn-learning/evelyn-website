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
export type RDKitMod = { get_mol(s: string): RDKitMol | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RDKitMol = { get_smiles(): string; is_valid(): boolean; delete(): void };

let rdkitPromise: Promise<RDKitMod> | null = null;

async function getRDKit(): Promise<RDKitMod> {
  if (rdkitPromise) return rdkitPromise;
  rdkitPromise = (async () => {
    // Dynamic import keeps the WASM load out of cold-start / non-chemistry paths.
    // @rdkit/rdkit exports a factory that returns a Promise<module>.
    // The package is listed in next.config.ts `serverExternalPackages`, and
    // must stay there: its loader finds RDKit_minimal.wasm next to itself via
    // __dirname, and a BUNDLED copy has __dirname rewritten to a placeholder
    // ("/ROOT/node_modules/…"), so in a production build the wasm was never
    // found and every molecule was reported unparseable (2026-10-13).
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
 * Outcome of checking one SMILES string. `unavailable` means the checker
 * itself could not run (RDKit failed to load or crashed) — it says NOTHING
 * about the molecule, and callers must not report the structure as wrong on
 * it: with the engine down, "invalid" was returned for every valid molecule.
 */
export type SmilesCheck =
  | { status: 'valid'; canonical: string }
  | { status: 'invalid' }
  | { status: 'unavailable' };

/**
 * Parse + canonicalize a SMILES string. `loadRDKit` is injectable for tests.
 */
export async function checkSmiles(
  smiles: string,
  loadRDKit: () => Promise<RDKitMod> = getRDKit,
): Promise<SmilesCheck> {
  if (!smiles || typeof smiles !== 'string') return { status: 'invalid' };
  try {
    const rd = await loadRDKit();
    const mol = rd.get_mol(smiles);
    if (!mol) return { status: 'invalid' };
    if (!mol.is_valid()) { mol.delete(); return { status: 'invalid' }; }
    const canonical = mol.get_smiles();
    mol.delete();
    return canonical ? { status: 'valid', canonical } : { status: 'invalid' };
  } catch (err) {
    // RDKit answers an unparseable string with null / is_valid() === false;
    // it does not throw. A throw is the engine failing, not the molecule.
    console.error('[SMILES] check could not run:', err);
    return { status: 'unavailable' };
  }
}

/**
 * Compare two SMILES for structural equivalence by canonicalizing both.
 * Returns { equivalent, canonicalA, canonicalB }; a null canonical form means
 * that input does not parse. `unavailable` ⇒ nothing was compared.
 */
export async function smilesEquivalent(a: string, b: string, loadRDKit?: () => Promise<RDKitMod>): Promise<{
  equivalent: boolean;
  canonicalA: string | null;
  canonicalB: string | null;
  unavailable?: true;
}> {
  const [checkA, checkB] = await Promise.all([checkSmiles(a, loadRDKit), checkSmiles(b, loadRDKit)]);
  if (checkA.status === 'unavailable' || checkB.status === 'unavailable') {
    return { equivalent: false, canonicalA: null, canonicalB: null, unavailable: true };
  }
  const canonicalA = checkA.status === 'valid' ? checkA.canonical : null;
  const canonicalB = checkB.status === 'valid' ? checkB.canonical : null;
  return {
    equivalent: canonicalA !== null && canonicalB !== null && canonicalA === canonicalB,
    canonicalA,
    canonicalB,
  };
}

/** The one `issues` line of a could-not-check result (see SmilesCheck). */
export const SMILES_UNCHECKED_ISSUE = 'The structure checker is unavailable — this SMILES was NOT checked.';

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
 * `checked: false` ⇒ the checker could not run; `correct` is then true only
 * so that a caller reading `correct` alone does not act on it.
 */
export async function validateSmilesName(smilesClaim: string, name: string, loadRDKit?: () => Promise<RDKitMod>): Promise<{
  correct: boolean;
  checked?: false;
  expected?: string;
  canonical?: string;
  issues?: string[];
}> {
  // Parseability check first: an unparseable SMILES is wrong regardless of whether
  // the name is in our lookup. Catches valence errors like CC[H](S(C)CC)C where
  // [H] is given three bonds, or CCO(S(C)CC)C where O carries three bonds.
  const check = await checkSmiles(smilesClaim, loadRDKit);
  if (check.status === 'unavailable') {
    return { correct: true, checked: false, issues: [SMILES_UNCHECKED_ISSUE] };
  }
  if (check.status === 'invalid') {
    return {
      correct: false,
      issues: [`SMILES "${smilesClaim}" is not a valid molecular structure — it fails to parse (usually a valence violation).`],
    };
  }
  const canonical = check.canonical;
  const expected = smilesForName(name);
  if (!expected) {
    return {
      correct: true,
      canonical,
      issues: [`Structure parses cleanly but name "${name}" is not in the canonical lookup — name not verified.`],
    };
  }
  const cmp = await smilesEquivalent(smilesClaim, expected, loadRDKit);
  if (cmp.unavailable) {
    return { correct: true, checked: false, issues: [SMILES_UNCHECKED_ISSUE] };
  }
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
