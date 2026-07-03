/**
 * Phase 20 physics catalog kinds — canonical physics figures a freehand
 * sketch cannot draw legibly, spanning nuclear physics, electromagnetism and
 * kinematics:
 *
 *   nuclear_decay          — a radioactive decay: parent nuclide → daughter +
 *                            emitted particle, with the A (mass number) and
 *                            Z (atomic number) bookkeeping shown as the
 *                            conservation equations, plus a small half-life
 *                            (N/N₀) decay curve. Modes: alpha, beta-minus,
 *                            beta-plus, gamma.
 *   em_induction           — electromagnetic induction (Faraday / Lenz): a bar
 *                            magnet moving toward or away from a coil, the
 *                            changing flux inducing a current, and a
 *                            galvanometer whose needle deflects.
 *   magnetic_field_current — the magnetic field of a current: either a straight
 *                            wire (current out of the page) with concentric
 *                            circular field lines (right-hand rule), or a
 *                            solenoid with its interior field and N/S poles.
 *   projectile_motion      — a parabolic trajectory with the launch angle, the
 *                            launch velocity decomposed into vₓ / v_y, the apex
 *                            (max height) and the range marked.
 *
 * Each solver is pure: it validates + fills defaults + derives the physically
 * meaningful geometry, so a bare call still renders a clean, correctly labeled
 * textbook figure. The matching renderer (CatalogEMNuclearMotionRenderers.tsx)
 * draws it.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function numOr(v: unknown, dflt: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : dflt;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}
function strEnum<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
}

// ── nuclear_decay ─────────────────────────────────────────────────────────────
export const DECAY_MODES = ['alpha', 'beta_minus', 'beta_plus', 'gamma'] as const;
export type DecayMode = (typeof DECAY_MODES)[number];

/** A nuclide term ᴬ_Z X. `displayA` carries the metastable "m" marker for γ. */
export interface Nuclide {
  symbol: string;
  /** Mass number A (nucleons). */
  A: number;
  /** Atomic number Z (protons). Can be negative/zero for emitted particles. */
  Z: number;
  /** What to print on the top-left (e.g. "99m" for Tc-99m); defaults to A. */
  displayA?: string;
  name?: string;
}

export interface NuclearDecayFigure {
  mode: DecayMode;
  modeLabel: string;
  parent: Nuclide;
  daughter: Nuclide;
  /** The emitted nuclear particle (α, β, γ). */
  particle: Nuclide;
  /** An extra emitted lepton with no A/Z bookkeeping (neutrino / antineutrino). */
  extra?: string;
  /** Draw the small N/N₀ half-life decay curve. */
  showHalfLife: boolean;
  title?: string;
}

const DECAY_SCENARIOS: Record<DecayMode, Omit<NuclearDecayFigure, 'showHalfLife' | 'title'>> = {
  alpha: {
    mode: 'alpha',
    modeLabel: 'α decay',
    parent: { symbol: 'U', A: 238, Z: 92, name: 'Uranium-238' },
    daughter: { symbol: 'Th', A: 234, Z: 90, name: 'Thorium-234' },
    particle: { symbol: 'He', A: 4, Z: 2, name: 'alpha particle' },
  },
  beta_minus: {
    mode: 'beta_minus',
    modeLabel: 'β⁻ decay',
    parent: { symbol: 'C', A: 14, Z: 6, name: 'Carbon-14' },
    daughter: { symbol: 'N', A: 14, Z: 7, name: 'Nitrogen-14' },
    particle: { symbol: 'e', A: 0, Z: -1, name: 'β⁻ (electron)' },
    extra: 'ν̄ₑ (antineutrino)',
  },
  beta_plus: {
    mode: 'beta_plus',
    modeLabel: 'β⁺ decay',
    parent: { symbol: 'C', A: 11, Z: 6, name: 'Carbon-11' },
    daughter: { symbol: 'B', A: 11, Z: 5, name: 'Boron-11' },
    particle: { symbol: 'e', A: 0, Z: 1, name: 'β⁺ (positron)' },
    extra: 'νₑ (neutrino)',
  },
  gamma: {
    mode: 'gamma',
    modeLabel: 'γ decay',
    parent: { symbol: 'Tc', A: 99, Z: 43, displayA: '99m', name: 'Technetium-99m (excited)' },
    daughter: { symbol: 'Tc', A: 99, Z: 43, name: 'Technetium-99' },
    particle: { symbol: 'γ', A: 0, Z: 0, name: 'gamma photon' },
  },
};

export function solveNuclearDecay(params: Record<string, unknown>): NuclearDecayFigure {
  const mode = strEnum(params.mode ?? params.type ?? params.decay, DECAY_MODES) ?? 'alpha';
  const scenario = DECAY_SCENARIOS[mode];
  const showHalfLife = params.showHalfLife !== false && params.showCurve !== false;
  return { ...scenario, showHalfLife, title: titleOf(params) };
}

export const nuclearDecayFeatureNames = {
  figure: 'nuclear-decay',
  parent: 'nuclear-parent',
  daughter: 'nuclear-daughter',
  particle: 'nuclear-particle',
  halfLife: 'nuclear-half-life',
};

export function buildNuclearDecayManifest(figure: NuclearDecayFigure): FeatureManifestEntry[] {
  const N = nuclearDecayFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Nuclear decay: ${figure.title}`
        : `Nuclear decay — ${figure.modeLabel} (${figure.parent.name} → ${figure.daughter.name})`,
      labels: ['nuclear decay', 'the decay', 'the decay diagram', 'the reaction', 'the diagram', 'the figure', figure.modeLabel.toLowerCase()],
      displayName: figure.title || `Nuclear decay (${figure.modeLabel})`,
      scribbleable: true,
    },
    {
      name: N.parent,
      kind: 'point',
      description: `the parent nuclide — ${figure.parent.name} (A = ${figure.parent.A}, Z = ${figure.parent.Z})`,
      labels: ['the parent', 'parent nuclide', 'the parent nucleus', 'the starting nucleus', figure.parent.symbol.toLowerCase()],
      displayName: `Parent (${figure.parent.symbol})`,
      scribbleable: true,
    },
    {
      name: N.daughter,
      kind: 'point',
      description: `the daughter nuclide — ${figure.daughter.name} (A = ${figure.daughter.A}, Z = ${figure.daughter.Z})`,
      labels: ['the daughter', 'daughter nuclide', 'the daughter nucleus', 'the product nucleus', figure.daughter.symbol.toLowerCase()],
      displayName: `Daughter (${figure.daughter.symbol})`,
      scribbleable: true,
    },
    {
      name: N.particle,
      kind: 'point',
      description: `the emitted particle — ${figure.particle.name}`,
      labels: ['the emitted particle', 'the particle', 'the emission', figure.modeLabel.split(' ')[0].toLowerCase(), 'the ray'],
      displayName: `Emitted (${figure.particle.symbol})`,
      scribbleable: true,
    },
  ];
  if (figure.showHalfLife) {
    feats.push({
      name: N.halfLife,
      kind: 'area',
      description: 'the half-life decay curve — N/N₀ halves every half-life (exponential decay)',
      labels: ['the half-life curve', 'half-life curve', 'the decay curve', 'the half life', 'the exponential decay'],
      displayName: 'Half-life curve',
      scribbleable: true,
    });
  }
  return feats;
}

// ── em_induction ──────────────────────────────────────────────────────────────
export interface EMInductionFigure {
  /** true = magnet moving toward the coil (flux increasing); false = away. */
  movingIn: boolean;
  title?: string;
}

export function solveEMInduction(params: Record<string, unknown>): EMInductionFigure {
  const motion = strEnum(params.motion ?? params.direction, ['in', 'out'] as const);
  const movingIn = motion ? motion === 'in' : params.movingOut !== true && params.movingIn !== false;
  return { movingIn, title: titleOf(params) };
}

export const emInductionFeatureNames = {
  figure: 'em-induction',
  magnet: 'em-induction-magnet',
  coil: 'em-induction-coil',
  current: 'em-induction-current',
  galvanometer: 'em-induction-galvanometer',
};

export function buildEMInductionManifest(figure: EMInductionFigure): FeatureManifestEntry[] {
  const N = emInductionFeatureNames;
  const fluxWord = figure.movingIn ? 'increasing (magnet approaching)' : 'decreasing (magnet receding)';
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Electromagnetic induction: ${figure.title}`
        : `Electromagnetic induction (Faraday / Lenz) — bar magnet moving ${figure.movingIn ? 'toward' : 'away from'} a coil`,
      labels: ['electromagnetic induction', 'the induction', 'faraday', 'lenz', 'the diagram', 'the figure', 'the setup'],
      displayName: figure.title || 'Electromagnetic induction',
      scribbleable: true,
    },
    {
      name: N.magnet,
      kind: 'point',
      description: `the bar magnet moving ${figure.movingIn ? 'toward' : 'away from'} the coil — flux is ${fluxWord}`,
      labels: ['the magnet', 'the bar magnet', 'the magnet', 'north pole', 'south pole', 'the moving magnet'],
      displayName: 'Bar magnet',
      scribbleable: true,
    },
    {
      name: N.coil,
      kind: 'area',
      description: 'the coil (solenoid) — the changing flux through it induces an EMF',
      labels: ['the coil', 'coil', 'the solenoid', 'the loops', 'the windings'],
      displayName: 'Coil',
      scribbleable: true,
    },
    {
      name: N.current,
      kind: 'area',
      description: 'the induced current — its direction opposes the change in flux (Lenz\'s law)',
      labels: ['the induced current', 'induced current', 'the current', 'the current direction'],
      displayName: 'Induced current',
      scribbleable: true,
    },
    {
      name: N.galvanometer,
      kind: 'point',
      description: 'the galvanometer — its needle deflects, showing the induced current',
      labels: ['the galvanometer', 'galvanometer', 'the meter', 'the needle', 'the G'],
      displayName: 'Galvanometer',
      scribbleable: true,
    },
  ];
}

// ── magnetic_field_current ────────────────────────────────────────────────────
export const CONDUCTOR_TYPES = ['wire', 'solenoid'] as const;
export type ConductorType = (typeof CONDUCTOR_TYPES)[number];

export interface MagneticFieldFigure {
  conductor: ConductorType;
  title?: string;
}

export function solveMagneticFieldCurrent(params: Record<string, unknown>): MagneticFieldFigure {
  const conductor = strEnum(params.conductor ?? params.type ?? params.mode, CONDUCTOR_TYPES) ?? 'wire';
  return { conductor, title: titleOf(params) };
}

export const magneticFieldFeatureNames = {
  figure: 'magnetic-field',
  conductor: 'magnetic-field-conductor',
  fieldLines: 'magnetic-field-lines',
  poles: 'magnetic-field-poles',
};

export function buildMagneticFieldManifest(figure: MagneticFieldFigure): FeatureManifestEntry[] {
  const N = magneticFieldFeatureNames;
  const isWire = figure.conductor === 'wire';
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Magnetic field of a current: ${figure.title}`
        : isWire
          ? 'Magnetic field around a straight current-carrying wire — concentric circular field lines (right-hand rule)'
          : 'Magnetic field of a solenoid — uniform interior field, N/S poles (right-hand rule)',
      labels: ['magnetic field', 'the magnetic field', 'the field', 'the diagram', 'the figure', isWire ? 'the wire' : 'the solenoid'],
      displayName: figure.title || (isWire ? 'Field around a wire' : 'Field of a solenoid'),
      scribbleable: true,
    },
    {
      name: N.conductor,
      kind: 'point',
      description: isWire ? 'the current-carrying wire (current out of the page, ⊙)' : 'the solenoid — a coil carrying the current',
      labels: isWire
        ? ['the wire', 'wire', 'the conductor', 'the current', 'the current out of the page']
        : ['the solenoid', 'solenoid', 'the coil', 'the conductor', 'the current'],
      displayName: isWire ? 'Wire' : 'Solenoid',
      scribbleable: true,
    },
    {
      name: N.fieldLines,
      kind: 'area',
      description: isWire
        ? 'the concentric circular field lines — the field circles the wire (right-hand rule)'
        : 'the field lines — uniform and parallel inside the solenoid, looping around outside',
      labels: ['the field lines', 'field lines', 'the magnetic field lines', 'the B field', 'the loops'],
      displayName: 'Field lines',
      scribbleable: true,
    },
  ];
  if (!isWire) {
    feats.push({
      name: N.poles,
      kind: 'point',
      description: 'the N and S poles of the solenoid (field exits at N)',
      labels: ['the poles', 'the north pole', 'the south pole', 'N pole', 'S pole', 'the ends'],
      displayName: 'Poles (N / S)',
      scribbleable: true,
    });
  }
  return feats;
}

// ── projectile_motion ─────────────────────────────────────────────────────────
export interface ProjectileFigure {
  /** Launch angle above the horizontal, in degrees. */
  angle: number;
  /** Draw the vₓ / v_y velocity-component decomposition at launch. */
  showComponents: boolean;
  title?: string;
}

export function solveProjectileMotion(params: Record<string, unknown>): ProjectileFigure {
  const angle = clamp(Math.round(numOr(params.angle ?? params.theta ?? params.launchAngle, 45)), 15, 75);
  const showComponents = params.showComponents !== false && params.components !== false;
  return { angle, showComponents, title: titleOf(params) };
}

export const projectileFeatureNames = {
  figure: 'projectile-motion',
  trajectory: 'projectile-trajectory',
  velocity: 'projectile-velocity',
  apex: 'projectile-apex',
  range: 'projectile-range',
};

export function buildProjectileManifest(figure: ProjectileFigure): FeatureManifestEntry[] {
  const N = projectileFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Projectile motion: ${figure.title}`
        : `Projectile motion — parabolic trajectory launched at ${figure.angle}° above the horizontal`,
      labels: ['projectile motion', 'the projectile', 'the trajectory', 'the diagram', 'the figure', 'the parabola'],
      displayName: figure.title || `Projectile motion (${figure.angle}°)`,
      scribbleable: true,
    },
    {
      name: N.trajectory,
      kind: 'area',
      description: 'the parabolic trajectory (path) of the projectile',
      labels: ['the trajectory', 'the path', 'the parabola', 'the curve', 'the arc'],
      displayName: 'Trajectory',
      scribbleable: true,
    },
    {
      name: N.apex,
      kind: 'point',
      description: 'the apex — maximum height, where the vertical velocity v_y = 0',
      labels: ['the apex', 'the peak', 'the top', 'the maximum height', 'the highest point'],
      displayName: 'Apex (max height)',
      scribbleable: true,
    },
    {
      name: N.range,
      kind: 'area',
      description: 'the range R — the horizontal distance the projectile travels',
      labels: ['the range', 'range', 'the horizontal distance', 'R', 'how far'],
      displayName: 'Range',
      scribbleable: true,
    },
  ];
  if (figure.showComponents) {
    feats.push({
      name: N.velocity,
      kind: 'point',
      description: `the launch velocity v decomposed into vₓ = v·cos(${figure.angle}°) and v_y = v·sin(${figure.angle}°)`,
      labels: ['the velocity', 'the launch velocity', 'the velocity vector', 'the components', 'vx and vy', 'the horizontal and vertical velocity'],
      displayName: 'Launch velocity (vₓ, v_y)',
      scribbleable: true,
    });
  }
  return feats;
}
