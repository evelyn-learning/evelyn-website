/**
 * Smoke test for compound-classifier. Pure regex/string check.
 *
 * Run: npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' --transpile-only scripts/test-compound-classifier.ts
 */
import { classifyCompound } from '../apps/marketing/src/lib/tutor/chemistry/compound-classifier';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

console.log('\n=== Molecular (default — no special detection) ===');
{
  const c = classifyCompound('CCO');
  check('"CCO" (ethanol) → molecular', c.kind === 'molecular' && c.ketcherSmiles === 'CCO');
}
{
  const c = classifyCompound('c1ccccc1');
  check('"c1ccccc1" (benzene) → molecular', c.kind === 'molecular');
}
{
  const c = classifyCompound('CC(=O)O');
  check('"CC(=O)O" (acetic acid) → molecular', c.kind === 'molecular');
}

console.log('\n=== Hydrate detection ===');
{
  const c = classifyCompound('CuSO4·5H2O');
  check('"CuSO4·5H2O" → hydrate', c.kind === 'hydrate', `kind=${c.kind}`);
  check('hydrate count = 5', c.hydrateCount === 5, `count=${c.hydrateCount}`);
  check('anhydrous = "CuSO4"', c.anhydrousFormula === 'CuSO4', `anhydrous=${c.anhydrousFormula}`);
  check('ketcherSmiles = "CuSO4.O.O.O.O.O"', c.ketcherSmiles === 'CuSO4.O.O.O.O.O', `smiles=${c.ketcherSmiles}`);
}
{
  const c = classifyCompound('MgSO4·7H2O');
  check('"MgSO4·7H2O" (epsom salt) → hydrate', c.kind === 'hydrate' && c.hydrateCount === 7);
}
{
  const c = classifyCompound('CaCl2*2H2O');
  check('"CaCl2*2H2O" (asterisk variant) → hydrate', c.kind === 'hydrate' && c.hydrateCount === 2);
}
{
  const c = classifyCompound('Na2CO3·H2O');
  check('"Na2CO3·H2O" (no count = 1) → hydrate', c.kind === 'hydrate' && c.hydrateCount === 1);
}

console.log('\n=== Ionic detection — bracketed SMILES ===');
{
  const c = classifyCompound('[Na+].[Cl-]');
  check('"[Na+].[Cl-]" → ionic', c.kind === 'ionic', `kind=${c.kind}`);
  check('ions parsed', !!c.ions && c.ions.length === 2, `ions=${JSON.stringify(c.ions)}`);
  check('Na+ charge = 1', c.ions?.find((i) => i.symbol === 'Na')?.charge === 1);
  check('Cl- charge = -1', c.ions?.find((i) => i.symbol === 'Cl')?.charge === -1);
}
{
  const c = classifyCompound('[Mg+2].[Cl-].[Cl-]');
  check('"[Mg+2].[Cl-].[Cl-]" → ionic', c.kind === 'ionic');
}

console.log('\n=== Ionic detection — formula style ===');
{
  const c = classifyCompound('NaCl');
  check('"NaCl" → ionic via formula', c.kind === 'ionic', `kind=${c.kind}`);
  check('NaCl ions parsed', !!c.ions && c.ions.length === 2);
}
{
  const c = classifyCompound('MgCl2');
  check('"MgCl2" → ionic via formula', c.kind === 'ionic');
  check('MgCl2 net charge balances', !!c.ions && c.ions.reduce((s, i) => s + i.charge * i.count, 0) === 0);
}
{
  const c = classifyCompound('K2O');
  check('"K2O" → ionic', c.kind === 'ionic');
}

console.log('\n=== Ionic NEGATIVE — molecular polyatomic compounds ===');
{
  const c = classifyCompound('[Cu+2].[O-]S(=O)(=O)[O-]');
  // Has SMILES bonds outside the brackets (the sulfate covalent S=O bonds)
  // → looksIonic returns false → falls through to molecular.
  check('"[Cu+2].[O-]S(=O)(=O)[O-]" (CuSO4 mixed) → molecular (not pure ionic)',
    c.kind === 'molecular', `kind=${c.kind}`);
}

console.log('\n=== Mode override ===');
{
  const c = classifyCompound('NaCl', 'molecular');
  check('mode override: NaCl → molecular', c.kind === 'molecular');
}
{
  const c = classifyCompound('CCO', 'ionic');
  // Override forces ionic even if SMILES doesn't look ionic.
  check('mode override: CCO → ionic', c.kind === 'ionic');
}

console.log('\n=== Edge cases ===');
{
  // No hydrate marker, no ions parseable → molecular fallback.
  const c = classifyCompound('SomeRandomFormula');
  check('unrecognized formula → molecular fallback', c.kind === 'molecular');
}
{
  // Iron oxides — ambiguous oxidation state, NOT in KNOWN_CHARGES.
  // Should NOT auto-classify as ionic (charge unknown for Fe).
  const c = classifyCompound('Fe2O3');
  check('"Fe2O3" → molecular (Fe charge ambiguous, no auto-ionic)', c.kind === 'molecular');
}

console.log(`\n=== Result: ${pass} pass, ${fail} fail ===`);
process.exit(fail > 0 ? 1 : 0);
