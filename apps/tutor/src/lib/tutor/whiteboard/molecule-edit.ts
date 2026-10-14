/**
 * Student edits to an editable molecule on the whiteboard (Ketcher).
 *
 * Until 2026-10-13 every edit was sent to the tutor as a student message
 * ("Identify what changed and discuss it"), so the tutor talked at length
 * about each stroke. Now an edit is a SILENT note that rides the next brain
 * turn, and the tutor answers an edit only when it asked for one or the
 * student pressed "Check my molecule". Pure — the component owns the refs.
 */

/** What the structure checker said about the edited molecule. `unchecked` =
 *  the checker could not run; it carries no verdict and adds no sentence. */
export type MoleculeCheck = 'valid' | 'invalid' | 'unchecked';

export interface MoleculeEdit {
  smiles: string;
  originalSmiles?: string;
  title?: string;
  check: MoleculeCheck;
  /** The checker's own reason, when `check` is 'invalid'. */
  issue?: string;
}

/** Shape of POST /api/tutor/validate for domain `chemistry-smiles`. */
export interface SmilesValidateResult {
  correct?: boolean;
  checked?: boolean;
  issues?: string[];
  data?: { canonicalA?: string | null; canonicalB?: string | null };
}

/**
 * Read a `{ smiles, compareTo: originalSmiles }` validate result.
 *
 * `change` — did the STRUCTURE change? Ketcher re-spells a molecule when it
 * loads it (same structure, different SMILES text) and reports that as a
 * change, so text inequality is not an edit:
 *   'same'    both parse to one canonical form → not an edit
 *   'edited'  the new one does not parse, or parses to a different structure
 *   'unknown' nothing to compare against (checker down, no result, or the
 *             original is not SMILES — a formula such as a hydrate)
 */
export function readMoleculeCheck(result: SmilesValidateResult | null | undefined): {
  check: MoleculeCheck;
  issue?: string;
  change: 'same' | 'edited' | 'unknown';
} {
  if (!result || result.checked === false || !result.data) return { check: 'unchecked', change: 'unknown' };
  const { canonicalA, canonicalB } = result.data;
  if (!canonicalA) return { check: 'invalid', issue: 'it does not parse as a molecular structure', change: 'edited' };
  if (!canonicalB) return { check: 'valid', change: 'unknown' };
  return { check: 'valid', change: canonicalA === canonicalB ? 'same' : 'edited' };
}

/**
 * Is this change event a student edit at all? With no structural comparison
 * to go on, the first change reported for a molecule is taken to be the
 * editor's own re-spelling on load (the pre-existing heuristic).
 */
export function isMoleculeEdit(change: 'same' | 'edited' | 'unknown', firstChangeForMolecule: boolean): boolean {
  if (change === 'same') return false;
  if (change === 'edited') return true;
  return !firstChangeForMolecule;
}

/**
 * Does the tutor answer this edit, or is it only told about it?
 *
 * 'respond' only while the tutor's most recent turn is the one that handed
 * the student an editable molecule (show_molecule with `interactive: true` —
 * the tool's own "the student is to edit this" switch): `requestedAtCall` is
 * the brain-call ordinal of that turn, and it is still the latest turn while
 * no later brain call has started. The caller clears `requestedAtCall` when
 * it responds, so one request buys one answer. Decided from the tool call,
 * never from what the tutor said.
 */
export function decideMoleculeEditDelivery(input: {
  silentEdits: boolean;
  requestedAtCall: number | null;
  currentCall: number;
}): 'respond' | 'note' {
  if (!input.silentEdits) return 'respond';
  return input.requestedAtCall !== null && input.requestedAtCall === input.currentCall ? 'respond' : 'note';
}

function describe(edit: MoleculeEdit): string {
  const was = edit.originalSmiles
    ? ` It was ${edit.title ? `"${edit.title}" ` : ''}(${edit.originalSmiles}).`
    : '';
  const verdict = edit.check === 'invalid'
    ? ` The structure checker rejects the new one${edit.issue ? ` — ${edit.issue}` : ''}, so do not describe it as a real compound.`
    : edit.check === 'valid'
      ? ' The structure checker accepts it as a valid structure.'
      : '';
  return `${was} It is now: ${edit.smiles}.${verdict}`;
}

/** Silent note: prepended to the next brain turn, never a turn of its own. */
export function buildMoleculeEditNote(edit: MoleculeEdit): string {
  return (
    `[molecule-edit note — not from the student] The student has edited the molecule on the ` +
    `whiteboard since your last turn.${describe(edit)} This is only so you know what the board ` +
    `shows now: you did not ask for this change and the student has not asked about it, so do ` +
    `not comment on it unless what they say next is about the molecule.`
  );
}

/** A turn the tutor does answer: it asked for the edit, the student pressed
 *  "Check my molecule", or ('unprompted') the silent-edits flag is off and
 *  every edit is answered as it was before. */
export function buildMoleculeEditMessage(
  edit: MoleculeEdit,
  why: 'requested' | 'check-button' | 'unprompted',
): string {
  if (why === 'check-button') {
    return (
      `[The student pressed "Check my molecule" — they are asking you to look at the molecule ` +
      `on the whiteboard as it stands.${describe(edit)} Tell them whether it is what the task ` +
      `calls for and, if it is not, what to change.]`
    );
  }
  const lead = why === 'requested'
    ? 'The student changed the molecule on the whiteboard, as you asked in your last turn.'
    : 'The student just modified the molecule on the whiteboard.';
  return `[${lead}${describe(edit)} Identify what changed and respond to it.]`;
}
