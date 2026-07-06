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

// ══════════════════════════════════════════════════════════════════════════
//  respiratory_system
// ══════════════════════════════════════════════════════════════════════════

export const RESPIRATORY_PARTS = [
  'nasal_cavity',
  'pharynx',
  'larynx',
  'trachea',
  'bronchi',
  'bronchioles',
  'left_lung',
  'right_lung',
  'alveoli',
  'diaphragm',
] as const;
export type RespiratoryPart = (typeof RESPIRATORY_PARTS)[number];

const RESPIRATORY_ALIASES: Record<string, RespiratoryPart> = {
  nasal_cavity: 'nasal_cavity', nose: 'nasal_cavity', nasal_passage: 'nasal_cavity',
  pharynx: 'pharynx', throat: 'pharynx',
  larynx: 'larynx', voice_box: 'larynx',
  trachea: 'trachea', windpipe: 'trachea',
  bronchi: 'bronchi', bronchus: 'bronchi', primary_bronchi: 'bronchi',
  bronchioles: 'bronchioles', bronchiole: 'bronchioles',
  left_lung: 'left_lung', right_lung: 'right_lung', lungs: 'left_lung',
  alveoli: 'alveoli', alveolus: 'alveoli', air_sacs: 'alveoli',
  diaphragm: 'diaphragm',
};

export interface RespiratorySystemFigure {
  highlight: RespiratoryPart[];
  title?: string;
}

export function solveRespiratorySystem(params: Record<string, unknown>): RespiratorySystemFigure {
  return {
    highlight: resolveHighlight(params, RESPIRATORY_ALIASES),
    title: titleOf(params),
  };
}

const RESPIRATORY_LABELS: Record<RespiratoryPart, string> = {
  nasal_cavity: 'Nasal cavity',
  pharynx: 'Pharynx',
  larynx: 'Larynx',
  trachea: 'Trachea',
  bronchi: 'Bronchi',
  bronchioles: 'Bronchioles',
  left_lung: 'Left lung',
  right_lung: 'Right lung',
  alveoli: 'Alveoli',
  diaphragm: 'Diaphragm',
};
const RESPIRATORY_DESC: Record<RespiratoryPart, string> = {
  nasal_cavity: 'the nasal cavity — warms, moistens and filters incoming air',
  pharynx: 'the pharynx (throat) — shared passage for air and food',
  larynx: 'the larynx (voice box) — holds the vocal cords; the epiglottis guards it',
  trachea: 'the trachea (windpipe) — C-shaped cartilage rings keep it open',
  bronchi: 'the two primary bronchi — carry air from the trachea into each lung',
  bronchioles: 'the bronchioles — the airways branch finer and finer inside the lungs',
  left_lung: 'the left lung — two lobes (smaller, makes room for the heart)',
  right_lung: 'the right lung — three lobes',
  alveoli: 'the alveoli — tiny air sacs where O₂/CO₂ exchange with the blood happens',
  diaphragm: 'the diaphragm — the dome muscle that contracts to pull air in (inhalation)',
};

export const respiratoryFeatureNames = {
  figure: 'respiratory-system',
  part: (id: string): string => `resp-${id.replace(/_/g, '-')}`,
};

export function buildRespiratorySystemManifest(figure: RespiratorySystemFigure): FeatureManifestEntry[] {
  const N = respiratoryFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Respiratory system: ${figure.title}` : 'The human respiratory system',
      labels: ['the respiratory system', 'the respiratory tract', 'the airways', 'the lungs', 'the diagram', 'the figure'],
      displayName: figure.title || 'Respiratory system',
      scribbleable: true,
    },
  ];
  for (const part of RESPIRATORY_PARTS) {
    const isArea = part === 'left_lung' || part === 'right_lung' || part === 'diaphragm';
    feats.push({
      name: N.part(part),
      kind: isArea ? 'area' : 'point',
      description: RESPIRATORY_DESC[part],
      labels: [RESPIRATORY_LABELS[part], `the ${RESPIRATORY_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: RESPIRATORY_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  flower_structure
// ══════════════════════════════════════════════════════════════════════════

export const FLOWER_PARTS = [
  'petal',
  'sepal',
  'anther',
  'filament',
  'stigma',
  'style',
  'ovary',
  'ovule',
  'receptacle',
] as const;
export type FlowerPart = (typeof FLOWER_PARTS)[number];

const FLOWER_ALIASES: Record<string, FlowerPart> = {
  petal: 'petal', petals: 'petal', corolla: 'petal',
  sepal: 'sepal', sepals: 'sepal', calyx: 'sepal',
  anther: 'anther',
  filament: 'filament',
  stamen: 'anther', // stamen = anther + filament; map to anther for emphasis
  stigma: 'stigma',
  style: 'style',
  ovary: 'ovary',
  ovule: 'ovule', ovules: 'ovule', egg: 'ovule',
  carpel: 'ovary', pistil: 'ovary', // pistil/carpel = stigma+style+ovary; map to ovary
  receptacle: 'receptacle', thalamus: 'receptacle',
};

export interface FlowerStructureFigure {
  highlight: FlowerPart[];
  title?: string;
}

export function solveFlowerStructure(params: Record<string, unknown>): FlowerStructureFigure {
  return {
    highlight: resolveHighlight(params, FLOWER_ALIASES),
    title: titleOf(params),
  };
}

const FLOWER_LABELS: Record<FlowerPart, string> = {
  petal: 'Petal',
  sepal: 'Sepal',
  anther: 'Anther',
  filament: 'Filament',
  stigma: 'Stigma',
  style: 'Style',
  ovary: 'Ovary',
  ovule: 'Ovule',
  receptacle: 'Receptacle',
};
const FLOWER_DESC: Record<FlowerPart, string> = {
  petal: 'a petal — the (often colourful) part that attracts pollinators; together the corolla',
  sepal: 'a sepal — the leaf-like part that protected the bud; together the calyx',
  anther: 'the anther — the top of the stamen (male part) that produces pollen',
  filament: 'the filament — the stalk that holds up the anther (part of the stamen)',
  stigma: 'the stigma — the sticky top of the carpel (female part) that catches pollen',
  style: 'the style — the stalk connecting the stigma down to the ovary',
  ovary: 'the ovary — the base of the carpel that holds the ovules and becomes the fruit',
  ovule: 'an ovule — inside the ovary; after fertilisation it becomes a seed',
  receptacle: 'the receptacle — the thickened tip of the stalk that bears the flower parts',
};

export const flowerFeatureNames = {
  figure: 'flower-structure',
  part: (id: string): string => `flower-${id.replace(/_/g, '-')}`,
};

export function buildFlowerStructureManifest(figure: FlowerStructureFigure): FeatureManifestEntry[] {
  const N = flowerFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Flower structure: ${figure.title}` : 'The parts of a flower (longitudinal section)',
      labels: ['the flower', 'the flower structure', 'the flower parts', 'the diagram', 'the figure'],
      displayName: figure.title || 'Flower structure',
      scribbleable: true,
    },
  ];
  for (const part of FLOWER_PARTS) {
    feats.push({
      name: N.part(part),
      kind: part === 'ovary' ? 'area' : 'point',
      description: FLOWER_DESC[part],
      labels: [FLOWER_LABELS[part], `the ${FLOWER_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: FLOWER_LABELS[part],
      scribbleable: true,
    });
  }
  // stamen + carpel/pistil are composite aliases worth surfacing.
  feats.push(
    { name: N.part('anther'), kind: 'point', description: 'the stamen — the male part (anther + filament)', labels: ['stamen', 'the stamen', 'male part'], displayName: 'Stamen', scribbleable: true },
    { name: N.part('ovary'), kind: 'area', description: 'the carpel / pistil — the female part (stigma + style + ovary)', labels: ['carpel', 'the carpel', 'pistil', 'the pistil', 'female part'], displayName: 'Carpel (pistil)', scribbleable: true },
  );
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  energy_pyramid  (trophic levels, ~10% energy transfer)
// ══════════════════════════════════════════════════════════════════════════

export interface EnergyPyramidLevel {
  label: string;
  organisms?: string;
  energy: number;   // computed energy at this level (bottom→top)
}

export interface EnergyPyramidFigure {
  levels: EnergyPyramidLevel[]; // ordered bottom (producers) → top
  showEnergy: boolean;
  efficiency: number;           // fraction transferred per level (default 0.1)
  units: string;
  title?: string;
}

const DEFAULT_TROPHIC = [
  { label: 'Producers', organisms: 'grasses, plants' },
  { label: 'Primary consumers', organisms: 'herbivores' },
  { label: 'Secondary consumers', organisms: 'carnivores' },
  { label: 'Tertiary consumers', organisms: 'top carnivores' },
];

/** Trophic energy pyramid. Widest tier (producers) at the bottom; each level
 *  up keeps `efficiency` (default 10%) of the energy below it, the rest lost as
 *  heat. Pass custom `levels` or accept the default 4-level chain. */
export function solveEnergyPyramid(params: Record<string, unknown>): EnergyPyramidFigure {
  const efficiency = typeof params.efficiency === 'number' && params.efficiency > 0 && params.efficiency < 1
    ? params.efficiency : 0.1;
  const startEnergy = typeof params.startEnergy === 'number' && params.startEnergy > 0
    ? params.startEnergy : 10000;
  const units = typeof params.units === 'string' && params.units.trim() ? params.units.trim() : 'kcal/m²/yr';

  const raw: Array<{ label: string; organisms?: string }> = Array.isArray(params.levels) && params.levels.length >= 2
    ? (params.levels as Array<Record<string, unknown>>).map((l, i) => ({
        label: typeof l.label === 'string' && l.label.trim() ? l.label.trim() : `Level ${i + 1}`,
        organisms: typeof l.organisms === 'string' ? l.organisms : undefined,
      }))
    : DEFAULT_TROPHIC;

  const levels: EnergyPyramidLevel[] = raw.slice(0, 6).map((l, i) => ({
    label: l.label,
    organisms: l.organisms,
    energy: Math.round(startEnergy * Math.pow(efficiency, i)),
  }));

  return {
    levels,
    showEnergy: params.showEnergy !== false,
    efficiency,
    units,
    title: titleOf(params),
  };
}

export const energyPyramidFeatureNames = {
  figure: 'energy-pyramid',
  tier: (i: number): string => `trophic-level-${i}`,
};

export function buildEnergyPyramidManifest(figure: EnergyPyramidFigure): FeatureManifestEntry[] {
  const N = energyPyramidFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Energy pyramid: ${figure.title}` : 'A trophic energy pyramid (~10% transfer between levels)',
      labels: ['the energy pyramid', 'the trophic pyramid', 'the pyramid', 'the diagram', 'the figure'],
      displayName: figure.title || 'Energy pyramid',
      scribbleable: true,
    },
  ];
  figure.levels.forEach((lvl, i) => {
    feats.push({
      name: N.tier(i),
      kind: 'area',
      description: `${lvl.label}${lvl.organisms ? ` (${lvl.organisms})` : ''} — ${lvl.energy} ${figure.units}`,
      labels: [lvl.label, `the ${lvl.label.toLowerCase()}`, ...(lvl.organisms ? [lvl.organisms] : [])],
      displayName: lvl.label,
      scribbleable: true,
    });
  });
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  eye_cross_section  (horizontal section of the human eye)
// ══════════════════════════════════════════════════════════════════════════

export const EYE_PARTS = [
  'cornea',
  'aqueous_humor',
  'iris',
  'pupil',
  'lens',
  'ciliary_body',
  'suspensory_ligaments',
  'sclera',
  'choroid',
  'retina',
  'fovea',
  'optic_nerve',
  'blind_spot',
  'vitreous_humor',
] as const;
export type EyePart = (typeof EYE_PARTS)[number];

const EYE_ALIASES: Record<string, EyePart> = {
  cornea: 'cornea',
  aqueous_humor: 'aqueous_humor', aqueous_humour: 'aqueous_humor', aqueous: 'aqueous_humor',
  iris: 'iris',
  pupil: 'pupil',
  lens: 'lens',
  ciliary_body: 'ciliary_body', ciliary_muscle: 'ciliary_body', ciliary: 'ciliary_body',
  suspensory_ligaments: 'suspensory_ligaments', suspensory_ligament: 'suspensory_ligaments', zonules: 'suspensory_ligaments',
  sclera: 'sclera',
  choroid: 'choroid',
  retina: 'retina',
  fovea: 'fovea', fovea_centralis: 'fovea', yellow_spot: 'fovea', macula: 'fovea',
  optic_nerve: 'optic_nerve',
  blind_spot: 'blind_spot', optic_disc: 'blind_spot', optic_disk: 'blind_spot',
  vitreous_humor: 'vitreous_humor', vitreous_humour: 'vitreous_humor', vitreous: 'vitreous_humor',
};

export interface EyeCrossSectionFigure {
  highlight: EyePart[];
  showLightPath: boolean;
  title?: string;
}

/** Horizontal section of the human eye. Light enters from the left. Structure
 *  is fixed; `highlight` emphasises parts and `showLightPath` toggles the
 *  incoming-ray path that converges on the retina. */
export function solveEyeCrossSection(params: Record<string, unknown>): EyeCrossSectionFigure {
  return {
    highlight: resolveHighlight(params, EYE_ALIASES),
    showLightPath: boolDefault(params.showLightPath, true),
    title: titleOf(params),
  };
}

const EYE_LABELS: Record<EyePart, string> = {
  cornea: 'Cornea',
  aqueous_humor: 'Aqueous humour',
  iris: 'Iris',
  pupil: 'Pupil',
  lens: 'Lens',
  ciliary_body: 'Ciliary body',
  suspensory_ligaments: 'Suspensory ligaments',
  sclera: 'Sclera',
  choroid: 'Choroid',
  retina: 'Retina',
  fovea: 'Fovea',
  optic_nerve: 'Optic nerve',
  blind_spot: 'Blind spot',
  vitreous_humor: 'Vitreous humour',
};
const EYE_DESC: Record<EyePart, string> = {
  cornea: 'the cornea — the transparent front dome that does most of the light bending (refraction)',
  aqueous_humor: 'the aqueous humour — the watery fluid in the front chamber, between cornea and lens',
  iris: 'the iris — the coloured ring of muscle that adjusts the pupil size to control light',
  pupil: 'the pupil — the central opening that light passes through',
  lens: 'the lens — fine-focuses light onto the retina by changing shape (accommodation)',
  ciliary_body: 'the ciliary body — the muscle that changes the lens shape',
  suspensory_ligaments: 'the suspensory ligaments (zonules) — hold the lens and transmit ciliary-muscle tension',
  sclera: 'the sclera — the tough white outer coat that protects and shapes the eyeball',
  choroid: 'the choroid — the dark middle layer with blood vessels that nourishes the eye and absorbs stray light',
  retina: 'the retina — the inner light-sensitive layer of rods and cones where the image forms',
  fovea: 'the fovea (yellow spot) — the retina’s point of sharpest, most detailed vision',
  optic_nerve: 'the optic nerve — carries the visual signals from the retina to the brain',
  blind_spot: 'the blind spot (optic disc) — where the optic nerve leaves; it has no photoreceptors',
  vitreous_humor: 'the vitreous humour — the clear jelly that fills the large chamber behind the lens',
};

export const eyeFeatureNames = {
  figure: 'eye-cross-section',
  part: (id: string): string => `eye-${id.replace(/_/g, '-')}`,
};

export function buildEyeCrossSectionManifest(figure: EyeCrossSectionFigure): FeatureManifestEntry[] {
  const N = eyeFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Eye cross-section: ${figure.title}` : 'A horizontal section of the human eye',
      labels: ['the eye', 'the eye diagram', 'the eyeball', 'the cross-section', 'the diagram', 'the figure'],
      displayName: figure.title || 'Eye cross-section',
      scribbleable: true,
    },
  ];
  for (const part of EYE_PARTS) {
    const isArea = part === 'sclera' || part === 'choroid' || part === 'retina' || part === 'vitreous_humor' || part === 'aqueous_humor';
    feats.push({
      name: N.part(part),
      kind: isArea ? 'area' : 'point',
      description: EYE_DESC[part],
      labels: [EYE_LABELS[part], `the ${EYE_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: EYE_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}

// ══════════════════════════════════════════════════════════════════════════
//  ear_cross_section  (frontal section of the human ear)
// ══════════════════════════════════════════════════════════════════════════

export const EAR_PARTS = [
  'pinna',
  'ear_canal',
  'eardrum',
  'malleus',
  'incus',
  'stapes',
  'oval_window',
  'semicircular_canals',
  'cochlea',
  'auditory_nerve',
  'eustachian_tube',
] as const;
export type EarPart = (typeof EAR_PARTS)[number];

const EAR_ALIASES: Record<string, EarPart> = {
  pinna: 'pinna', auricle: 'pinna', outer_ear: 'pinna',
  ear_canal: 'ear_canal', auditory_canal: 'ear_canal', external_auditory_meatus: 'ear_canal', ear_hole: 'ear_canal',
  eardrum: 'eardrum', tympanic_membrane: 'eardrum', tympanum: 'eardrum',
  malleus: 'malleus', hammer: 'malleus',
  incus: 'incus', anvil: 'incus',
  stapes: 'stapes', stirrup: 'stapes',
  oval_window: 'oval_window',
  semicircular_canals: 'semicircular_canals', semicircular_canal: 'semicircular_canals', balance_canals: 'semicircular_canals',
  cochlea: 'cochlea',
  auditory_nerve: 'auditory_nerve', vestibulocochlear_nerve: 'auditory_nerve', cochlear_nerve: 'auditory_nerve', eighth_nerve: 'auditory_nerve',
  eustachian_tube: 'eustachian_tube', auditory_tube: 'eustachian_tube', pharyngotympanic_tube: 'eustachian_tube',
};

export interface EarCrossSectionFigure {
  highlight: EarPart[];
  showRegions: boolean; // outer / middle / inner region bands + labels
  title?: string;
}

/** Frontal section of the human ear. Structure is fixed; `highlight`
 *  emphasises parts and `showRegions` toggles the outer/middle/inner bands. */
export function solveEarCrossSection(params: Record<string, unknown>): EarCrossSectionFigure {
  return {
    highlight: resolveHighlight(params, EAR_ALIASES),
    showRegions: boolDefault(params.showRegions, true),
    title: titleOf(params),
  };
}

const EAR_LABELS: Record<EarPart, string> = {
  pinna: 'Pinna (auricle)',
  ear_canal: 'Ear canal',
  eardrum: 'Eardrum',
  malleus: 'Malleus (hammer)',
  incus: 'Incus (anvil)',
  stapes: 'Stapes (stirrup)',
  oval_window: 'Oval window',
  semicircular_canals: 'Semicircular canals',
  cochlea: 'Cochlea',
  auditory_nerve: 'Auditory nerve',
  eustachian_tube: 'Eustachian tube',
};
const EAR_DESC: Record<EarPart, string> = {
  pinna: 'the pinna (auricle) — the outer flap that funnels sound waves into the ear canal',
  ear_canal: 'the ear canal — carries sound waves inward to the eardrum',
  eardrum: 'the eardrum (tympanic membrane) — vibrates when sound waves hit it',
  malleus: 'the malleus (hammer) — the first ossicle; attached to the eardrum',
  incus: 'the incus (anvil) — the middle ossicle, between the malleus and stapes',
  stapes: 'the stapes (stirrup) — the last and smallest ossicle; pushes on the oval window',
  oval_window: 'the oval window — the membrane where the stapes passes vibrations into the cochlea',
  semicircular_canals: 'the semicircular canals — three fluid-filled loops that sense balance and head rotation',
  cochlea: 'the cochlea — the fluid-filled spiral that converts vibrations into nerve signals (hearing)',
  auditory_nerve: 'the auditory nerve — carries the signals from the cochlea to the brain',
  eustachian_tube: 'the Eustachian tube — connects the middle ear to the throat and equalises pressure',
};

export const earFeatureNames = {
  figure: 'ear-cross-section',
  part: (id: string): string => `ear-${id.replace(/_/g, '-')}`,
};

export function buildEarCrossSectionManifest(figure: EarCrossSectionFigure): FeatureManifestEntry[] {
  const N = earFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Ear cross-section: ${figure.title}` : 'A frontal section of the human ear',
      labels: ['the ear', 'the ear diagram', 'the cross-section', 'the diagram', 'the figure'],
      displayName: figure.title || 'Ear cross-section',
      scribbleable: true,
    },
  ];
  for (const part of EAR_PARTS) {
    const isArea = part === 'pinna' || part === 'cochlea' || part === 'semicircular_canals';
    feats.push({
      name: N.part(part),
      kind: isArea ? 'area' : 'point',
      description: EAR_DESC[part],
      labels: [EAR_LABELS[part], `the ${EAR_LABELS[part].toLowerCase()}`, part.replace(/_/g, ' ')],
      displayName: EAR_LABELS[part],
      scribbleable: true,
    });
  }
  return feats;
}
