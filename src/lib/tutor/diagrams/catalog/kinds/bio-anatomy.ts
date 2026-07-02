/**
 * Bio-anatomy catalog kinds — the canonical labeled anatomy/physiology figures
 * that a freehand sketch cannot place or label legibly, spanning middle-school
 * life science, high-school Biology and AP Bio:
 *
 *   leaf_cross_section  — a transverse section of a leaf: waxy cuticle, upper &
 *                         lower epidermis, palisade & spongy mesophyll, the
 *                         vascular bundle (xylem / phloem) and stomata with
 *                         guard cells, plus optional CO₂-in / O₂-out gas-exchange
 *                         arrows.
 *   nephron             — the kidney nephron: Bowman's capsule + glomerulus,
 *                         proximal tubule, loop of Henle (descending / ascending
 *                         limbs), distal tubule and collecting duct, with optional
 *                         filtration / reabsorption arrows.
 *   digestive_system    — the human GI tract in order (mouth → esophagus →
 *                         stomach → small intestine → large intestine) plus the
 *                         accessory organs (liver, gallbladder, pancreas).
 *   circulatory_system  — the double circulation: the four-chambered heart with
 *                         the pulmonary loop (to the lungs) and systemic loop (to
 *                         the body), oxygenated (red) vs deoxygenated (blue) blood
 *                         and the major vessels.
 *
 * Each solver is pure: it validates + fills defaults + normalizes so a bare call
 * still renders a clean, correctly-labeled textbook figure. Parts can be
 * emphasised via `highlight` (a part id or list of ids). The matching renderer
 * (CatalogBioAnatomyRenderers.tsx) draws it.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}
function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
/** Normalise a highlight param (string | string[]) into a deduped list of valid ids via an alias map. */
function resolveHighlight<T extends string>(
  params: Record<string, unknown>,
  aliases: Record<string, T>,
): T[] {
  const raw = Array.isArray(params.highlight)
    ? params.highlight
    : typeof params.highlight === 'string'
      ? [params.highlight]
      : [];
  const ids = raw.map((h) => aliases[slug(String(h))]).filter((h): h is T => Boolean(h));
  return Array.from(new Set(ids));
}
function boolDefault(v: unknown, def: boolean): boolean {
  if (v === true || v === false) return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (s === 'true' || s === 'yes' || s === '1') return true;
    if (s === 'false' || s === 'no' || s === '0') return false;
  }
  return def;
}

// ══════════════════════════════════════════════════════════════════════════
//  leaf_cross_section
// ══════════════════════════════════════════════════════════════════════════

export const LEAF_PARTS = [
  'cuticle',
  'upper_epidermis',
  'palisade_mesophyll',
  'spongy_mesophyll',
  'air_space',
  'vascular_bundle',
  'xylem',
  'phloem',
  'lower_epidermis',
  'stoma',
  'guard_cell',
] as const;
export type LeafPart = (typeof LEAF_PARTS)[number];

const LEAF_ALIASES: Record<string, LeafPart> = {
  cuticle: 'cuticle', wax: 'cuticle', waxy_cuticle: 'cuticle',
  upper_epidermis: 'upper_epidermis', upper_epidermal: 'upper_epidermis',
  palisade_mesophyll: 'palisade_mesophyll', palisade: 'palisade_mesophyll', palisade_layer: 'palisade_mesophyll',
  spongy_mesophyll: 'spongy_mesophyll', spongy: 'spongy_mesophyll', spongy_layer: 'spongy_mesophyll',
  air_space: 'air_space', air_spaces: 'air_space', air_gap: 'air_space',
  vascular_bundle: 'vascular_bundle', vein: 'vascular_bundle', vascular: 'vascular_bundle',
  xylem: 'xylem', phloem: 'phloem',
  lower_epidermis: 'lower_epidermis', lower_epidermal: 'lower_epidermis',
  stoma: 'stoma', stomata: 'stoma', stomate: 'stoma',
  guard_cell: 'guard_cell', guard_cells: 'guard_cell',
};

export interface LeafCrossSectionFigure {
  highlight: LeafPart[];
  /** Draw the CO₂-in / O₂-out / H₂O-out gas-exchange arrows. */
  showGasExchange: boolean;
  title?: string;
}

export function solveLeafCrossSection(params: Record<string, unknown>): LeafCrossSectionFigure {
  return {
    highlight: resolveHighlight(params, LEAF_ALIASES),
    showGasExchange: boolDefault(params.showGasExchange ?? params.gasExchange ?? params.arrows, true),
    title: titleOf(params),
  };
}

const LEAF_LABELS: Record<LeafPart, string> = {
  cuticle: 'Waxy cuticle',
  upper_epidermis: 'Upper epidermis',
  palisade_mesophyll: 'Palisade mesophyll',
  spongy_mesophyll: 'Spongy mesophyll',
  air_space: 'Air space',
  vascular_bundle: 'Vascular bundle (vein)',
  xylem: 'Xylem',
  phloem: 'Phloem',
  lower_epidermis: 'Lower epidermis',
  stoma: 'Stoma',
  guard_cell: 'Guard cell',
};
const LEAF_DESC: Record<LeafPart, string> = {
  cuticle: 'the waxy cuticle — a waterproof layer that reduces water loss',
  upper_epidermis: 'the upper epidermis — a transparent protective cell layer that lets light through',
  palisade_mesophyll: 'the palisade mesophyll — tall column cells packed with chloroplasts; most photosynthesis happens here',
  spongy_mesophyll: 'the spongy mesophyll — loosely packed cells with air spaces for gas exchange',
  air_space: 'the air spaces between spongy mesophyll cells that allow gases to diffuse',
  vascular_bundle: 'the vascular bundle (vein) — carries water in and sugars out',
  xylem: 'the xylem — carries water and minerals up into the leaf',
  phloem: 'the phloem — carries sugars made in photosynthesis out of the leaf',
  lower_epidermis: 'the lower epidermis — the bottom cell layer containing the stomata',
  stoma: 'a stoma — a pore that lets CO₂ in and O₂ / water vapour out',
  guard_cell: 'the guard cells — bean-shaped cells that open and close the stoma',
};

export const leafFeatureNames = {
  figure: 'leaf-cross-section',
  part: (id: string): string => `leaf-${id.replace(/_/g, '-')}`,
};

export function buildLeafCrossSectionManifest(figure: LeafCrossSectionFigure): FeatureManifestEntry[] {
  const N = leafFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Leaf cross-section: ${figure.title}` : 'A cross-section of a leaf',
      labels: ['the leaf', 'the leaf cross-section', 'leaf cross section', 'the leaf diagram', 'the diagram', 'the figure'],
      displayName: figure.title || 'Leaf cross-section',
      scribbleable: true,
    },
  ];
  for (const part of LEAF_PARTS) {
    const isThin = part === 'stoma' || part === 'guard_cell' || part === 'xylem' || part === 'phloem';
    feats.push({
      name: N.part(part),
      kind: isThin ? 'point' : 'area',
      description: LEAF_DESC[part],
      labels: [LEAF_LABELS[part], `the ${LEAF_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: LEAF_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  nephron
// ══════════════════════════════════════════════════════════════════════════

export const NEPHRON_PARTS = [
  'glomerulus',
  'bowmans_capsule',
  'proximal_tubule',
  'descending_limb',
  'ascending_limb',
  'loop_of_henle',
  'distal_tubule',
  'collecting_duct',
] as const;
export type NephronPart = (typeof NEPHRON_PARTS)[number];

const NEPHRON_ALIASES: Record<string, NephronPart> = {
  glomerulus: 'glomerulus', glomerular_capillaries: 'glomerulus',
  bowmans_capsule: 'bowmans_capsule', bowman_s_capsule: 'bowmans_capsule', bowman_capsule: 'bowmans_capsule',
  bowmans: 'bowmans_capsule', renal_corpuscle: 'bowmans_capsule',
  proximal_tubule: 'proximal_tubule', proximal_convoluted_tubule: 'proximal_tubule', pct: 'proximal_tubule', proximal: 'proximal_tubule',
  descending_limb: 'descending_limb', descending: 'descending_limb', descending_loop: 'descending_limb',
  ascending_limb: 'ascending_limb', ascending: 'ascending_limb', ascending_loop: 'ascending_limb',
  loop_of_henle: 'loop_of_henle', loop: 'loop_of_henle', henle: 'loop_of_henle', nephron_loop: 'loop_of_henle',
  distal_tubule: 'distal_tubule', distal_convoluted_tubule: 'distal_tubule', dct: 'distal_tubule', distal: 'distal_tubule',
  collecting_duct: 'collecting_duct', collecting: 'collecting_duct', duct: 'collecting_duct',
};

export interface NephronFigure {
  highlight: NephronPart[];
  /** Draw the filtration / reabsorption / secretion arrows. */
  showFlow: boolean;
  title?: string;
}

export function solveNephron(params: Record<string, unknown>): NephronFigure {
  return {
    highlight: resolveHighlight(params, NEPHRON_ALIASES),
    showFlow: boolDefault(params.showFlow ?? params.flow ?? params.arrows, true),
    title: titleOf(params),
  };
}

const NEPHRON_LABELS: Record<NephronPart, string> = {
  glomerulus: 'Glomerulus',
  bowmans_capsule: "Bowman's capsule",
  proximal_tubule: 'Proximal tubule',
  descending_limb: 'Descending limb',
  ascending_limb: 'Ascending limb',
  loop_of_henle: 'Loop of Henle',
  distal_tubule: 'Distal tubule',
  collecting_duct: 'Collecting duct',
};
const NEPHRON_DESC: Record<NephronPart, string> = {
  glomerulus: 'the glomerulus — a ball of capillaries where blood is filtered under pressure',
  bowmans_capsule: "Bowman's capsule — the cup that collects the filtrate from the glomerulus",
  proximal_tubule: 'the proximal (convoluted) tubule — most reabsorption of glucose, ions and water happens here',
  descending_limb: 'the descending limb of the loop of Henle — permeable to water, which leaves by osmosis',
  ascending_limb: 'the ascending limb of the loop of Henle — pumps out salt (Na⁺/Cl⁻); impermeable to water',
  loop_of_henle: 'the loop of Henle — sets up the salt gradient that concentrates urine',
  distal_tubule: 'the distal (convoluted) tubule — fine-tunes ions and pH by selective secretion / reabsorption',
  collecting_duct: 'the collecting duct — water is reabsorbed here (ADH-controlled); carries urine to the renal pelvis',
};

export const nephronFeatureNames = {
  figure: 'nephron',
  part: (id: string): string => `nephron-${id.replace(/_/g, '-')}`,
  filtration: 'nephron-filtration',
  reabsorption: 'nephron-reabsorption',
};

export function buildNephronManifest(figure: NephronFigure): FeatureManifestEntry[] {
  const N = nephronFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Nephron: ${figure.title}` : 'The kidney nephron',
      labels: ['the nephron', 'the nephron diagram', 'the diagram', 'the figure'],
      displayName: figure.title || 'Nephron',
      scribbleable: true,
    },
  ];
  for (const part of NEPHRON_PARTS) {
    const isPoint = part === 'glomerulus';
    feats.push({
      name: N.part(part),
      kind: isPoint ? 'point' : 'area',
      description: NEPHRON_DESC[part],
      labels: [NEPHRON_LABELS[part], `the ${NEPHRON_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: NEPHRON_LABELS[part],
      scribbleable: true,
    });
  }
  if (figure.showFlow) {
    feats.push(
      {
        name: N.filtration,
        kind: 'point',
        description: "filtration — water and small solutes pass from the glomerulus into Bowman's capsule",
        labels: ['filtration', 'the filtration', 'the filtration arrow'],
        displayName: 'Filtration',
        scribbleable: true,
      },
      {
        name: N.reabsorption,
        kind: 'point',
        description: 'reabsorption — useful substances (water, glucose, ions) move back into the blood',
        labels: ['reabsorption', 'the reabsorption', 'the reabsorption arrows'],
        displayName: 'Reabsorption',
        scribbleable: true,
      },
    );
  }
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  digestive_system
// ══════════════════════════════════════════════════════════════════════════

export const DIGESTIVE_PARTS = [
  'mouth',
  'esophagus',
  'stomach',
  'liver',
  'gallbladder',
  'pancreas',
  'small_intestine',
  'large_intestine',
  'rectum',
] as const;
export type DigestivePart = (typeof DIGESTIVE_PARTS)[number];

const DIGESTIVE_ALIASES: Record<string, DigestivePart> = {
  mouth: 'mouth', oral_cavity: 'mouth', mouth_salivary_glands: 'mouth',
  esophagus: 'esophagus', oesophagus: 'esophagus', gullet: 'esophagus',
  stomach: 'stomach',
  liver: 'liver',
  gallbladder: 'gallbladder', gall_bladder: 'gallbladder',
  pancreas: 'pancreas',
  small_intestine: 'small_intestine', small_bowel: 'small_intestine',
  large_intestine: 'large_intestine', colon: 'large_intestine', large_bowel: 'large_intestine',
  rectum: 'rectum', anus: 'rectum', rectum_anus: 'rectum',
};

export interface DigestiveSystemFigure {
  highlight: DigestivePart[];
  title?: string;
}

export function solveDigestiveSystem(params: Record<string, unknown>): DigestiveSystemFigure {
  return {
    highlight: resolveHighlight(params, DIGESTIVE_ALIASES),
    title: titleOf(params),
  };
}

const DIGESTIVE_LABELS: Record<DigestivePart, string> = {
  mouth: 'Mouth',
  esophagus: 'Esophagus',
  stomach: 'Stomach',
  liver: 'Liver',
  gallbladder: 'Gallbladder',
  pancreas: 'Pancreas',
  small_intestine: 'Small intestine',
  large_intestine: 'Large intestine',
  rectum: 'Rectum / anus',
};
const DIGESTIVE_DESC: Record<DigestivePart, string> = {
  mouth: 'the mouth — chewing and salivary amylase begin breaking down food',
  esophagus: 'the esophagus — muscular tube that pushes food to the stomach by peristalsis',
  stomach: 'the stomach — churns food with acid and pepsin into chyme',
  liver: 'the liver — makes bile, which emulsifies fats (an accessory organ)',
  gallbladder: 'the gallbladder — stores and releases bile into the small intestine (accessory organ)',
  pancreas: 'the pancreas — secretes digestive enzymes and bicarbonate into the small intestine (accessory organ)',
  small_intestine: 'the small intestine — most digestion and nutrient absorption happens here (duodenum, jejunum, ileum)',
  large_intestine: 'the large intestine (colon) — absorbs water and forms feces',
  rectum: 'the rectum and anus — store and eliminate feces',
};

export const digestiveFeatureNames = {
  figure: 'digestive-system',
  part: (id: string): string => `digestive-${id.replace(/_/g, '-')}`,
};

export function buildDigestiveSystemManifest(figure: DigestiveSystemFigure): FeatureManifestEntry[] {
  const N = digestiveFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Digestive system: ${figure.title}` : 'The human digestive system',
      labels: ['the digestive system', 'the digestive tract', 'the gi tract', 'the diagram', 'the figure'],
      displayName: figure.title || 'Digestive system',
      scribbleable: true,
    },
  ];
  for (const part of DIGESTIVE_PARTS) {
    const isPoint = part === 'gallbladder' || part === 'pancreas';
    feats.push({
      name: N.part(part),
      kind: isPoint ? 'point' : 'area',
      description: DIGESTIVE_DESC[part],
      labels: [DIGESTIVE_LABELS[part], `the ${DIGESTIVE_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: DIGESTIVE_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  circulatory_system
// ══════════════════════════════════════════════════════════════════════════

export const CIRCULATORY_PARTS = [
  'heart',
  'lungs',
  'body',
  'right_atrium',
  'right_ventricle',
  'left_atrium',
  'left_ventricle',
  'vena_cava',
  'pulmonary_artery',
  'pulmonary_vein',
  'aorta',
  'pulmonary_loop',
  'systemic_loop',
] as const;
export type CirculatoryPart = (typeof CIRCULATORY_PARTS)[number];

const CIRCULATORY_ALIASES: Record<string, CirculatoryPart> = {
  heart: 'heart',
  lungs: 'lungs', lung: 'lungs',
  body: 'body', tissues: 'body', body_tissues: 'body',
  right_atrium: 'right_atrium', ra: 'right_atrium',
  right_ventricle: 'right_ventricle', rv: 'right_ventricle',
  left_atrium: 'left_atrium', la: 'left_atrium',
  left_ventricle: 'left_ventricle', lv: 'left_ventricle',
  vena_cava: 'vena_cava', venacava: 'vena_cava', vena_cavae: 'vena_cava',
  pulmonary_artery: 'pulmonary_artery', pulmonary_arteries: 'pulmonary_artery',
  pulmonary_vein: 'pulmonary_vein', pulmonary_veins: 'pulmonary_vein',
  aorta: 'aorta',
  pulmonary_loop: 'pulmonary_loop', pulmonary_circulation: 'pulmonary_loop', pulmonary: 'pulmonary_loop',
  systemic_loop: 'systemic_loop', systemic_circulation: 'systemic_loop', systemic: 'systemic_loop',
};

export interface CirculatorySystemFigure {
  highlight: CirculatoryPart[];
  title?: string;
}

export function solveCirculatorySystem(params: Record<string, unknown>): CirculatorySystemFigure {
  return {
    highlight: resolveHighlight(params, CIRCULATORY_ALIASES),
    title: titleOf(params),
  };
}

const CIRCULATORY_LABELS: Record<CirculatoryPart, string> = {
  heart: 'Heart',
  lungs: 'Lungs',
  body: 'Body',
  right_atrium: 'Right atrium',
  right_ventricle: 'Right ventricle',
  left_atrium: 'Left atrium',
  left_ventricle: 'Left ventricle',
  vena_cava: 'Vena cava',
  pulmonary_artery: 'Pulmonary artery',
  pulmonary_vein: 'Pulmonary vein',
  aorta: 'Aorta',
  pulmonary_loop: 'Pulmonary circulation',
  systemic_loop: 'Systemic circulation',
};
const CIRCULATORY_DESC: Record<CirculatoryPart, string> = {
  heart: 'the heart — a double pump: the right side handles deoxygenated blood, the left side oxygenated blood',
  lungs: 'the lungs — where blood drops off CO₂ and picks up O₂ (turns blue → red)',
  body: 'the body tissues — where oxygenated blood delivers O₂ and picks up CO₂ (turns red → blue)',
  right_atrium: 'the right atrium — receives deoxygenated blood from the body via the vena cava',
  right_ventricle: 'the right ventricle — pumps deoxygenated blood to the lungs',
  left_atrium: 'the left atrium — receives oxygenated blood from the lungs',
  left_ventricle: 'the left ventricle — pumps oxygenated blood to the whole body (thickest wall)',
  vena_cava: 'the vena cava — the large vein returning deoxygenated blood from the body to the heart',
  pulmonary_artery: 'the pulmonary artery — carries deoxygenated blood from the heart to the lungs',
  pulmonary_vein: 'the pulmonary vein — carries oxygenated blood from the lungs back to the heart',
  aorta: 'the aorta — the main artery carrying oxygenated blood from the heart to the body',
  pulmonary_loop: 'the pulmonary circulation — the loop between the heart and the lungs',
  systemic_loop: 'the systemic circulation — the loop between the heart and the rest of the body',
};

export const circulatoryFeatureNames = {
  figure: 'circulatory-system',
  part: (id: string): string => `circ-${id.replace(/_/g, '-')}`,
};

export function buildCirculatorySystemManifest(figure: CirculatorySystemFigure): FeatureManifestEntry[] {
  const N = circulatoryFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Circulatory system: ${figure.title}` : 'The double circulatory system',
      labels: ['the circulatory system', 'the circulation', 'the double circulation', 'the diagram', 'the figure'],
      displayName: figure.title || 'Circulatory system',
      scribbleable: true,
    },
  ];
  for (const part of CIRCULATORY_PARTS) {
    const isArea = part === 'heart' || part === 'lungs' || part === 'body' || part === 'pulmonary_loop' || part === 'systemic_loop';
    feats.push({
      name: N.part(part),
      kind: isArea ? 'area' : 'point',
      description: CIRCULATORY_DESC[part],
      labels: [CIRCULATORY_LABELS[part], `the ${CIRCULATORY_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: CIRCULATORY_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}
