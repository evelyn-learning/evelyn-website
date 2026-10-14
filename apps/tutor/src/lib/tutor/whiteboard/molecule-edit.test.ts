/**
 * Molecule edits: silent note vs a turn the tutor answers, and the
 * "could not check" outcome of the structure checker (2026-10-13 — with RDKit
 * failing to load in production every molecule was reported unparseable, and
 * the tutor was told the student's structure was invalid).
 * Run: npx tsx src/lib/tutor/whiteboard/molecule-edit.test.ts
 */
import { strict as assert } from 'node:assert';
import { checkSmiles, smilesEquivalent, validateSmilesName, type RDKitMod } from '../validation/smiles';
import {
  readMoleculeCheck,
  isMoleculeEdit,
  decideMoleculeEditDelivery,
  buildMoleculeEditNote,
  buildMoleculeEditMessage,
} from './molecule-edit';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

const engineDown = (): Promise<RDKitMod> => Promise.reject(new Error('wasm not found'));

async function main(): Promise<void> {
  // The engine-down cases log the failure by design; keep the output readable.
  const realError = console.error;
  console.error = () => {};

  await test('engine down ⇒ unavailable, not invalid', async () => {
    assert.deepEqual(await checkSmiles('CCO', engineDown), { status: 'unavailable' });
  });
  await test('engine crash mid-check ⇒ unavailable, not invalid', async () => {
    const crashing = async (): Promise<RDKitMod> => ({ get_mol() { throw new Error('Aborted()'); } });
    assert.deepEqual(await checkSmiles('CCO', crashing), { status: 'unavailable' });
  });
  await test('engine down ⇒ comparison reports unavailable', async () => {
    const r = await smilesEquivalent('CCO', 'OCC', engineDown);
    assert.equal(r.unavailable, true);
  });
  await test('engine down ⇒ name check is unchecked and never "wrong"', async () => {
    const r = await validateSmilesName('CCO', 'ethanol', engineDown);
    assert.equal(r.checked, false);
    assert.equal(r.correct, true);
  });

  console.error = realError;

  // Real RDKit (plain Node; no network, no database).
  await test('valid SMILES canonicalize', async () => {
    for (const s of ['O', 'CCO', 'c1ccccc1']) {
      const r = await checkSmiles(s);
      assert.equal(r.status, 'valid', s);
    }
  });
  await test('unparseable SMILES is invalid', async () => {
    assert.deepEqual(await checkSmiles('C(C'), { status: 'invalid' });
  });
  await test('two spellings of one structure are equivalent', async () => {
    const r = await smilesEquivalent('CCO', 'OCC');
    assert.equal(r.equivalent, true);
    assert.equal(r.unavailable, undefined);
  });

  await test('could-not-check result ⇒ unchecked, change unknown', () => {
    assert.deepEqual(readMoleculeCheck({ correct: true, checked: false }), { check: 'unchecked', change: 'unknown' });
    assert.deepEqual(readMoleculeCheck(null), { check: 'unchecked', change: 'unknown' });
  });
  await test('same structure re-spelled is not a change', () => {
    const r = readMoleculeCheck({ correct: true, data: { canonicalA: 'CCO', canonicalB: 'CCO' } });
    assert.deepEqual(r, { check: 'valid', change: 'same' });
    assert.equal(isMoleculeEdit(r.change, false), false);
  });
  await test('different structure is an edit; unparseable is an invalid edit', () => {
    assert.deepEqual(readMoleculeCheck({ correct: false, data: { canonicalA: 'CC=O', canonicalB: 'CCO' } }), { check: 'valid', change: 'edited' });
    const bad = readMoleculeCheck({ correct: false, data: { canonicalA: null, canonicalB: 'CCO' } });
    assert.equal(bad.check, 'invalid');
    assert.equal(bad.change, 'edited');
  });
  await test('original that is not SMILES ⇒ valid, change unknown', () => {
    assert.deepEqual(readMoleculeCheck({ correct: false, data: { canonicalA: 'O', canonicalB: null } }), { check: 'valid', change: 'unknown' });
  });
  await test('with nothing to compare, only the first change is taken as the load re-spelling', () => {
    assert.equal(isMoleculeEdit('unknown', true), false);
    assert.equal(isMoleculeEdit('unknown', false), true);
  });

  await test('default: an edit is a silent note', () => {
    assert.equal(decideMoleculeEditDelivery({ silentEdits: true, requestedAtCall: null, currentCall: 7 }), 'note');
  });
  await test('the tutor answers when its latest turn handed over the editable molecule', () => {
    assert.equal(decideMoleculeEditDelivery({ silentEdits: true, requestedAtCall: 7, currentCall: 7 }), 'respond');
  });
  await test('a later turn ends the request', () => {
    assert.equal(decideMoleculeEditDelivery({ silentEdits: true, requestedAtCall: 7, currentCall: 8 }), 'note');
  });
  await test('flag off ⇒ every edit is answered, as before', () => {
    assert.equal(decideMoleculeEditDelivery({ silentEdits: false, requestedAtCall: null, currentCall: 7 }), 'respond');
  });

  await test('an unchecked edit carries no verdict sentence', () => {
    const note = buildMoleculeEditNote({ smiles: 'CC=O', originalSmiles: 'CCO', title: 'Ethanol', check: 'unchecked' });
    assert.ok(note.startsWith('[') && note.endsWith('.'));
    assert.ok(note.includes('CC=O') && note.includes('CCO'));
    assert.ok(!/checker/.test(note));
    const msg = buildMoleculeEditMessage({ smiles: 'CC=O', check: 'unchecked' }, 'check-button');
    assert.ok(!/checker/.test(msg));
  });
  await test('an invalid edit says so; both answered messages are bracketed', () => {
    const edit = { smiles: 'C(C', originalSmiles: 'CCO', check: 'invalid' as const, issue: 'it does not parse as a molecular structure' };
    assert.ok(/rejects/.test(buildMoleculeEditNote(edit)));
    for (const why of ['requested', 'check-button'] as const) {
      const msg = buildMoleculeEditMessage(edit, why).trim();
      assert.ok(msg.startsWith('[') && msg.endsWith(']'), why);
      assert.ok(/rejects/.test(msg), why);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

void main();
