/**
 * Batch 3 of the practice-figure kinds (2026-10-12). One list and one
 * dispatcher, as ./batch2.ts; each kind is a pure function of a typed params
 * object documented at the top of its module:
 *   molecular_structure (molecule.ts) · gel_electrophoresis (gel.ts, incl.
 *   the amplification_plot variant) · bio_schematic (bio-schematic.ts: cell,
 *   membrane, division, compartments) · schematic_map (schematic-map.ts).
 * The bar-magnet variant of field_diagram (bar-magnet.ts) is reached through
 * ./field-diagram.ts — it is a variant of a batch-2 kind, not a kind.
 */
import type { Drawn, Reader } from '../spec';
import { renderBioSchematic } from './bio-schematic';
import { renderGel } from './gel';
import { renderMolecule } from './molecule';
import { renderSchematicMap } from './schematic-map';

export const BATCH3_FIGURE_KINDS = ['molecular_structure', 'gel_electrophoresis', 'bio_schematic', 'schematic_map'] as const;
export type Batch3FigureKind = (typeof BATCH3_FIGURE_KINDS)[number];

/** The drawing of a batch-3 kind, or null when `kind` is not one. */
export function renderBatch3(kind: string, r: Reader, uid: string): Drawn | null {
  switch (kind as Batch3FigureKind) {
    case 'molecular_structure': return renderMolecule(r);
    case 'gel_electrophoresis': return renderGel(r);
    case 'bio_schematic': return renderBioSchematic(r);
    case 'schematic_map': return renderSchematicMap(r, uid);
    default: return null;
  }
}

/** A single capital letter as a numeral (A → "1" / "I"); anything else as written. For labels that
 *  would otherwise read as the option letters of a multiple-choice question. */
export type LetterLabels = 'numerals' | 'roman';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI'];
export function letterAs(s: string | undefined, style: LetterLabels | undefined): string | undefined {
  if (!style || s === undefined || !/^[A-Z]$/.test(s)) return s;
  const k = s.charCodeAt(0) - 65;
  return style === 'roman' ? ROMAN[k] : String(k + 1);
}
export function readLetterLabels(r: Reader): LetterLabels | undefined {
  const v = r.p.letterLabels;
  if (v === undefined || v === null) return undefined;
  if (v !== 'numerals' && v !== 'roman') r.fail('letterLabels must be one of numerals, roman');
  return v as LetterLabels;
}
