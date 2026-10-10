/**
 * mechanics_setup — the set-up sketch of a mechanics problem (batch 4,
 * 2026-10-14). One kind, six variants; every printed quantity is `'value'`
 * (printed), `'blank'` (a dashed "?" box — the thing asked for) or `'none'`
 * (not printed at all), chosen per quantity in `show`.
 *
 * Common params
 *   { variant: 'projectile' | 'pulley' | 'spring_mass' | 'pendulum' | 'collision' | 'circular';
 *     show?: { <quantity>: 'value' | 'blank' | 'none' };   // default: 'value' for a quantity
 *                                         //   that is given and usually printed, else 'none'
 *     symbols?: { <quantity>: string };   // the letter printed before "=" ("v₀", "m₁", "k" …)
 *     g?: number (9.8);                   // m/s² — never printed; used for the geometry and by the checkers
 *     title?: string }
 *
 * projectile — a true parabola, to scale (same scale on both axes)
 *   { speed: number (m/s, > 0); angle: degrees above the horizontal (0–85; 0 = launched level);
 *     height?: number (m, ≥ 0; 0) — launch height above the landing ground;
 *     platform?: 'cliff' | 'table' ('cliff') — what the launch point stands on when height > 0;
 *     points?: Array<{ at: 'apex' | 'landing' | number (s after launch); label: string }>;   // ≤ 5 lettered dots
 *     lengthUnit?: string ('m'); speedUnit?: string ('m/s') }
 *   quantities: speed ('value'), angle ('value' when > 0), height ('value' when > 0) — and the
 *   COMPUTED ones, drawn as dimension lines only when asked: range, maxHeight (above the ground) —
 *   printed to three significant figures.
 *
 * pulley — two masses on one string over an ideal pulley
 *   { arrangement: 'atwood' | 'table' | 'incline';
 *     m1: number (kg); m2: number (kg);   // atwood: m1 left, m2 right; table / incline: m1 on the surface, m2 hanging
 *     angle?: degrees (incline only, 15–55); mu?: number (≥ 0, table / incline: kinetic friction under m1);
 *     frictionless?: boolean (false) — prints "frictionless" on the surface }
 *   quantities: m1, m2 ('value'), angle ('value'), mu ('value' when given).
 *   The blocks are drawn the same size at fixed heights — the picture never says which is heavier.
 *
 * spring_mass — a block on a coil spring (a schematic: lengths are NOT to scale)
 *   { orientation?: 'horizontal' | 'vertical' ('horizontal');
 *     k?: number (N/m); m?: number (kg);
 *     x?: number (m) — displacement from equilibrium: > 0 stretched, < 0 compressed, 0 / absent at equilibrium;
 *     state?: 'stretched' | 'compressed' | 'equilibrium' — the state to draw when x is not given }
 *   quantities: k, m, x ('value' when given). The dashed line marks the equilibrium position.
 *
 * pendulum — a simple pendulum drawn at its true angle
 *   { angle: degrees from the vertical (3–80); length?: number (m); mass?: number (kg);
 *     showVertical?: boolean (true); showArc?: boolean (false) — the dashed path of the bob;
 *     points?: Array<{ angle: degrees (signed; negative = left of the vertical); label: string }> }   // ≤ 5
 *   quantities: angle ('value'), length, mass ('value' when given), and the COMPUTED height
 *   (the bob's height above its lowest point, L(1 − cos θ); 'none' unless asked — needs `length` for 'value').
 *
 * collision — two carts on a track, "Before" above "After"
 *   { masses: [m1, m2] (kg); before: [u1, u2] (m/s; + is to the right);
 *     after: [v1, v2] | number (one shared velocity — the carts are drawn joined);
 *     labels?: [string, string] (['A', 'B']); explosion?: boolean (false) — kinetic energy may increase;
 *     speedUnit?: string ('m/s') }
 *   quantities: m1, m2, u1, u2, v1, v2 (all 'value'; with a shared final velocity v1 and v2 are one
 *   label — set either). Momentum must be conserved by the numbers given, and kinetic energy must not
 *   increase (unless `explosion`), or the spec is refused. Arrows show direction only (one length);
 *   a cart at rest prints "at rest"; a blank velocity has NO arrow (its direction is part of the answer).
 *
 * circular — top view of an object on a circular path
 *   { radius?: number (m); speed?: number (m/s); mass?: number (kg);
 *     direction?: 'counterclockwise' | 'clockwise' ('counterclockwise'); position?: degrees (40) — where the object is;
 *     arrows?: Array<'velocity' | 'force' | 'acceleration'> (['velocity']);   // omit the one a question asks about
 *     arrowLabels?: { velocity?: string ('v'); force?: string ('F'); acceleration?: string ('a') };
 *     center?: string — a body at the centre ("Earth", "Sun"), drawn as a disc with its name;
 *     lengthUnit?: string ('m') }
 *   quantities: radius, speed, mass ('value' when given). The speed is printed at the velocity arrow.
 *
 * Refusals name the param. Legibility notes: a projectile so flat or so steep that the path is a
 * sliver, a computed dimension too short for its label, more than five lettered points.
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Params, Reader } from '../spec';
import { INK, MUTED, Placer, arcPath, around, arrow, blank, segmentBoxes, text, textBox, titleBlock, type Anchor, type Box } from './draw';
import { SHOWS, facts, lab, numStr, polyPath, seg, stroke, type Notes, type Pt, type Show } from './draw2';

export const MECHANICS_VARIANTS = ['projectile', 'pulley', 'spring_mass', 'pendulum', 'collision', 'circular'] as const;
export type MechanicsVariant = (typeof MECHANICS_VARIANTS)[number];

/** One printable quantity of a set-up. */
export interface Quantity {
  key: string;
  /** The value the spec holds (or the renderer computed); undefined when not given. */
  value?: number;
  show: Show;
  /** The letter printed before "=" — '' for a bare dimension label. */
  symbol: string;
  unit: string;
  /** Exactly what is printed: "v₀ = 20 m/s", "45 m", "v₀ = ?", "?" — '' when nothing is. */
  printed: string;
}

export interface ProjectileModel { speed: number; angle: number; height: number; platform: 'cliff' | 'table'; vx: number; vy: number; time: number; range: number; maxHeight: number; apexTime: number; impactSpeed: number; points: Array<{ t: number; at: string; label: string }> }
export interface PulleyModel { arrangement: 'atwood' | 'table' | 'incline'; frictionless: boolean; labels: [string, string] }
export interface SpringModel { blockName: string; orientation: 'horizontal' | 'vertical'; state: 'stretched' | 'compressed' | 'equilibrium' }
export interface PendulumModel { angle: number; showVertical: boolean; showArc: boolean; points: Array<{ angle: number; label: string }> }
export interface CollisionModel { labels: [string, string]; together: boolean; explosion: boolean }
export interface CircularModel { direction: 'counterclockwise' | 'clockwise'; position: number; arrows: Array<'velocity' | 'force' | 'acceleration'>; arrowLabels: Record<'velocity' | 'force' | 'acceleration', string>; center?: string }

export interface MechanicsModel {
  variant: MechanicsVariant;
  g: number;
  title?: string;
  q: Record<string, Quantity>;
  projectile?: ProjectileModel;
  pulley?: PulleyModel;
  spring?: SpringModel;
  pendulum?: PendulumModel;
  collision?: CollisionModel;
  circular?: CircularModel;
}

const FILL = '#e5e7eb';
const BLUE = SERIES_COLORS[0];

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

function quantities(r: Reader, defs: Array<{ key: string; symbol: string; unit: string; value?: number; dflt: Show; angle?: boolean; computed?: boolean }>): Record<string, Quantity> {
  const show = r.p.show === undefined || r.p.show === null ? {} : r.obj(r.p.show, 'show');
  const symbols = r.p.symbols === undefined || r.p.symbols === null ? {} : r.obj(r.p.symbols, 'symbols');
  const keys = defs.map((d) => d.key);
  for (const k of Object.keys(show)) if (!keys.includes(k)) r.fail(`show.${k} is not a quantity of this variant — one of ${keys.join(', ')}`);
  for (const k of Object.keys(symbols)) if (!keys.includes(k)) r.fail(`symbols.${k} is not a quantity of this variant — one of ${keys.join(', ')}`);
  const out: Record<string, Quantity> = {};
  for (const d of defs) {
    let s: Show = d.dflt;
    if (show[d.key] !== undefined && show[d.key] !== null) {
      if (!SHOWS.includes(show[d.key] as Show)) r.fail(`show.${d.key} must be one of ${SHOWS.join(', ')}`);
      s = show[d.key] as Show;
    }
    if (s === 'value' && d.value === undefined) r.fail(`show.${d.key} is "value" but ${d.key} is not given`);
    const symbol = symbols[d.key] === undefined ? d.symbol : symbols[d.key] === '' ? '' : r.str(symbols[d.key], `symbols.${d.key}`, 8);
    const shownValue = d.value !== undefined && d.computed ? Number(d.value.toPrecision(3)) : d.value;
    const val = shownValue === undefined ? '' : d.angle ? `${numStr(shownValue, 1)}°` : `${numStr(Math.abs(shownValue) < 1e-12 ? 0 : shownValue, 3)}${d.unit ? ` ${d.unit}` : ''}`;
    const printed = s === 'none' ? '' : `${symbol ? `${symbol} = ` : ''}${s === 'blank' ? '?' : val}`;
    out[d.key] = { key: d.key, value: d.value, show: s, symbol, unit: d.angle ? '°' : d.unit, printed };
  }
  return out;
}

const given = (v: number | undefined): Show => (v === undefined ? 'none' : 'value');
/** The quantity without its symbol: "3 kg" / "?". */
const bare = (q: Quantity): Quantity => ({ ...q, symbol: '', printed: q.printed.replace(/^.* = /, '') });

export function mechanicsModel(r: Reader): MechanicsModel {
  const p = r.p;
  if (!MECHANICS_VARIANTS.includes(p.variant as MechanicsVariant)) r.fail(`variant must be one of ${MECHANICS_VARIANTS.join(', ')}`);
  const variant = p.variant as MechanicsVariant;
  const g = p.g === undefined || p.g === null ? 9.8 : r.positive(p.g, 'g');
  const base = { variant, g, title: r.optStr(p.title, 'title', 160) };
  const unitOf = (k: string, d: string): string => (p[k] === undefined || p[k] === null ? d : r.str(p[k], k, 8));
  const oneOf = <T extends string>(k: string, allowed: readonly T[], d: T): T => {
    const v = p[k] === undefined || p[k] === null ? d : p[k];
    if (!allowed.includes(v as T)) r.fail(`${k} must be one of ${allowed.join(', ')}`);
    return v as T;
  };

  switch (variant) {
    case 'projectile': {
      const speed = r.positive(p.speed, 'speed');
      const angle = r.num(p.angle, 'angle');
      if (angle < 0 || angle > 85) r.fail('angle must be between 0 and 85 degrees above the horizontal');
      const height = r.optNum(p.height, 'height') ?? 0;
      if (height < 0) r.fail('height must be 0 or more');
      if (angle === 0 && height === 0) r.fail('a projectile launched level from the ground (angle 0, height 0) never leaves it — give an angle or a height');
      const a = (angle * Math.PI) / 180;
      const vx = speed * Math.cos(a);
      const vy = speed * Math.sin(a);
      const time = (vy + Math.sqrt(vy * vy + 2 * g * height)) / g;
      const range = vx * time;
      const apexTime = vy / g;
      const maxHeight = height + (vy * vy) / (2 * g);
      const L = unitOf('lengthUnit', 'm');
      const q = quantities(r, [
        { key: 'speed', symbol: 'v₀', unit: unitOf('speedUnit', 'm/s'), value: speed, dflt: 'value' },
        { key: 'angle', symbol: '', unit: '°', value: angle, dflt: angle > 0 ? 'value' : 'none', angle: true },
        { key: 'height', symbol: '', unit: L, value: height, dflt: height > 0 ? 'value' : 'none' },
        { key: 'range', symbol: '', unit: L, value: range, dflt: 'none', computed: true },
        { key: 'maxHeight', symbol: '', unit: L, value: maxHeight, dflt: 'none', computed: true },
      ]);
      if (angle === 0 && q.angle.show !== 'none') r.fail('show.angle: a level launch has no angle to mark');
      if (height === 0 && q.height.show !== 'none') r.fail('show.height: the launch is from the ground — there is no height to mark');
      if (angle === 0 && q.maxHeight.show !== 'none') r.fail('show.maxHeight: a level launch is highest at the launch point — mark height instead');
      const raw = p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 12);
      const points = raw.map((e, i) => {
        const o = r.obj(e, `points[${i}]`);
        const label = r.str(o.label, `points[${i}].label`, 12);
        if (o.at === 'apex') {
          if (angle === 0) r.fail(`points[${i}].at: a level launch has no apex after the launch point`);
          return { t: apexTime, at: 'apex', label };
        }
        if (o.at === 'landing') return { t: time, at: 'landing', label };
        const t = r.num(o.at, `points[${i}].at`);
        if (t < 0 || t > time + 1e-9) r.fail(`points[${i}].at must be "apex", "landing" or a time between 0 and the time of flight (${numStr(time, 3)} s)`);
        return { t, at: `${numStr(t, 3)} s after launch`, label };
      });
      return { ...base, q, projectile: { speed, angle, height, platform: oneOf('platform', ['cliff', 'table'] as const, 'cliff'), vx, vy, time, range, maxHeight, apexTime, impactSpeed: Math.hypot(vx, vy - g * time), points } };
    }
    case 'pulley': {
      const arrangement = oneOf('arrangement', ['atwood', 'table', 'incline'] as const, 'atwood');
      if (p.arrangement === undefined) r.fail('arrangement must be one of atwood, table, incline');
      const m1 = r.positive(p.m1, 'm1');
      const m2 = r.positive(p.m2, 'm2');
      let angle: number | undefined;
      if (arrangement === 'incline') {
        angle = r.num(p.angle, 'angle');
        if (angle < 15 || angle > 55) r.fail('angle must be between 15 and 55 degrees');
      } else if (p.angle !== undefined && p.angle !== null) r.fail('angle is for arrangement "incline" only');
      const mu = r.optNum(p.mu, 'mu');
      if (mu !== undefined && (mu < 0 || arrangement === 'atwood')) r.fail(arrangement === 'atwood' ? 'mu is for arrangements "table" and "incline" only' : 'mu must be 0 or more');
      const frictionless = r.bool(p.frictionless, 'frictionless', false);
      if (frictionless && (arrangement === 'atwood' || (mu ?? 0) > 0)) r.fail(arrangement === 'atwood' ? 'frictionless is for arrangements "table" and "incline" only' : 'frictionless and mu > 0 contradict each other');
      const q = quantities(r, [
        { key: 'm1', symbol: 'm₁', unit: 'kg', value: m1, dflt: 'value' },
        { key: 'm2', symbol: 'm₂', unit: 'kg', value: m2, dflt: 'value' },
        { key: 'angle', symbol: '', unit: '°', value: angle, dflt: given(angle), angle: true },
        { key: 'mu', symbol: 'μ', unit: '', value: mu, dflt: given(mu) },
      ]);
      if (arrangement !== 'incline' && q.angle.show !== 'none') r.fail('show.angle is for arrangement "incline" only');
      if (arrangement === 'atwood' && q.mu.show !== 'none') r.fail('show.mu is for arrangements "table" and "incline" only');
      // The symbols name the blocks (printed inside them); the masses are printed beside the blocks, bare.
      const labels: [string, string] = [q.m1.symbol || 'm₁', q.m2.symbol || 'm₂'];
      q.m1 = bare(q.m1);
      q.m2 = bare(q.m2);
      return { ...base, q, pulley: { arrangement, frictionless, labels } };
    }
    case 'spring_mass': {
      const k = p.k === undefined || p.k === null ? undefined : r.positive(p.k, 'k');
      const m = p.m === undefined || p.m === null ? undefined : r.positive(p.m, 'm');
      const x = r.optNum(p.x, 'x');
      const state = x !== undefined ? (x > 0 ? 'stretched' : x < 0 ? 'compressed' : 'equilibrium') : oneOf('state', ['stretched', 'compressed', 'equilibrium'] as const, 'equilibrium');
      if (x !== undefined && p.state !== undefined && p.state !== null && p.state !== state) r.fail(`state "${String(p.state)}" contradicts x (${x > 0 ? 'positive: stretched' : x < 0 ? 'negative: compressed' : 'zero: at equilibrium'})`);
      const q = quantities(r, [
        { key: 'k', symbol: 'k', unit: 'N/m', value: k, dflt: given(k) },
        { key: 'm', symbol: 'm', unit: 'kg', value: m, dflt: given(m) },
        { key: 'x', symbol: '', unit: unitOf('lengthUnit', 'm'), value: x === undefined ? undefined : Math.abs(x), dflt: x ? 'value' : 'none' },
      ]);
      if (state === 'equilibrium' && q.x.show !== 'none') r.fail('show.x: the block is drawn at equilibrium — there is no displacement to mark (give x or state)');
      // The mass is printed inside the block, bare; with nothing to print the block carries the symbol.
      const blockName = q.m.symbol || 'm';
      q.m = bare(q.m);
      return { ...base, q, spring: { blockName, orientation: oneOf('orientation', ['horizontal', 'vertical'] as const, 'horizontal'), state } };
    }
    case 'pendulum': {
      const angle = r.num(p.angle, 'angle');
      if (angle < 3 || angle > 80) r.fail('angle must be between 3 and 80 degrees from the vertical');
      const length = p.length === undefined || p.length === null ? undefined : r.positive(p.length, 'length');
      const mass = p.mass === undefined || p.mass === null ? undefined : r.positive(p.mass, 'mass');
      const L = unitOf('lengthUnit', 'm');
      const q = quantities(r, [
        { key: 'angle', symbol: '', unit: '°', value: angle, dflt: 'value', angle: true },
        { key: 'length', symbol: 'L', unit: L, value: length, dflt: given(length) },
        { key: 'mass', symbol: 'm', unit: 'kg', value: mass, dflt: given(mass) },
        { key: 'height', symbol: 'h', unit: L, value: length === undefined ? undefined : length * (1 - Math.cos((angle * Math.PI) / 180)), dflt: 'none', computed: true },
      ]);
      const raw = p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 12);
      const points = raw.map((e, i) => {
        const o = r.obj(e, `points[${i}]`);
        const a = r.num(o.angle, `points[${i}].angle`);
        if (Math.abs(a) > 80) r.fail(`points[${i}].angle must be between −80 and 80 degrees`);
        return { angle: a, label: r.str(o.label, `points[${i}].label`, 12) };
      });
      return { ...base, q, pendulum: { angle, showVertical: r.bool(p.showVertical, 'showVertical', true), showArc: r.bool(p.showArc, 'showArc', false), points } };
    }
    case 'collision': {
      const masses = r.list(p.masses, 'masses', 2, 2).map((v, i) => r.positive(v, `masses[${i}]`));
      const before = r.list(p.before, 'before', 2, 2).map((v, i) => r.num(v, `before[${i}]`));
      const together = typeof p.after === 'number';
      const after = together ? [r.num(p.after, 'after'), r.num(p.after, 'after')] : r.list(p.after, 'after', 2, 2).map((v, i) => r.num(v, `after[${i}]`));
      const explosion = r.bool(p.explosion, 'explosion', false);
      const pb = masses[0] * before[0] + masses[1] * before[1];
      const pa = masses[0] * after[0] + masses[1] * after[1];
      const scale = Math.max(1e-9, Math.abs(masses[0] * before[0]) + Math.abs(masses[1] * before[1]) + Math.abs(masses[0] * after[0]) + Math.abs(masses[1] * after[1]));
      if (Math.abs(pb - pa) > 1e-6 * scale) r.fail(`after: momentum is not conserved — ${numStr(pb, 4)} kg·m/s before, ${numStr(pa, 4)} kg·m/s after`);
      const ke = (v: number[]) => 0.5 * masses[0] * v[0] * v[0] + 0.5 * masses[1] * v[1] * v[1];
      if (!explosion && ke(after) > ke(before) * (1 + 1e-9) + 1e-12) r.fail(`after: kinetic energy increases (${numStr(ke(before), 4)} J before, ${numStr(ke(after), 4)} J after) — set explosion: true if that is meant`);
      if (before[0] <= before[1] && !(explosion && before[0] === before[1])) r.fail('before: the carts never meet — the left cart must be moving to the right faster than the right cart');
      if (!together && after[0] > after[1] + 1e-12) r.fail('after: the left cart would have to pass through the right cart (after[0] is greater than after[1])');
      const lab2 = p.labels === undefined || p.labels === null ? ['A', 'B'] : r.list(p.labels, 'labels', 2, 2).map((v, i) => r.str(v, `labels[${i}]`, 6));
      if (lab2[0] === lab2[1]) r.fail('labels must be two different names');
      const U = unitOf('speedUnit', 'm/s');
      const q = quantities(r, [
        { key: 'm1', symbol: '', unit: 'kg', value: masses[0], dflt: 'value' },
        { key: 'm2', symbol: '', unit: 'kg', value: masses[1], dflt: 'value' },
        { key: 'u1', symbol: '', unit: U, value: before[0], dflt: 'value' },
        { key: 'u2', symbol: '', unit: U, value: before[1], dflt: 'value' },
        { key: 'v1', symbol: '', unit: U, value: after[0], dflt: 'value' },
        { key: 'v2', symbol: '', unit: U, value: after[1], dflt: 'value' },
      ]);
      // A velocity is printed as a speed beside an arrow; a cart that does not move prints "at rest".
      for (const k of ['u1', 'u2', 'v1', 'v2']) if (q[k].show === 'value') q[k] = { ...q[k], printed: Math.abs(q[k].value as number) < 1e-12 ? 'at rest' : q[k].printed.replace('−', '') };
      if (together) {
        // One label: whichever of v1 / v2 was set decides it.
        const sh = r.p.show && typeof r.p.show === 'object' ? (r.p.show as Params) : {};
        const src = sh.v1 !== undefined ? q.v1 : q.v2;
        q.v1 = { ...src, key: 'v1' };
        q.v2 = { ...src, key: 'v2' };
      }
      return { ...base, q, collision: { labels: lab2 as [string, string], together, explosion } };
    }
    default: {
      const radius = p.radius === undefined || p.radius === null ? undefined : r.positive(p.radius, 'radius');
      const speed = p.speed === undefined || p.speed === null ? undefined : r.positive(p.speed, 'speed');
      const mass = p.mass === undefined || p.mass === null ? undefined : r.positive(p.mass, 'mass');
      const KINDS = ['velocity', 'force', 'acceleration'] as const;
      const arrows = (p.arrows === undefined || p.arrows === null ? ['velocity'] : r.list(p.arrows, 'arrows', 0, 3)).map((v, i) => {
        if (!KINDS.includes(v as (typeof KINDS)[number])) r.fail(`arrows[${i}] must be one of ${KINDS.join(', ')}`);
        return v as (typeof KINDS)[number];
      });
      if (new Set(arrows).size !== arrows.length) r.fail('arrows names an arrow twice');
      if (arrows.includes('force') && arrows.includes('acceleration')) r.fail('arrows: force and acceleration point the same way and would be drawn on top of each other — give one');
      const al = p.arrowLabels === undefined || p.arrowLabels === null ? {} : r.obj(p.arrowLabels, 'arrowLabels');
      const arrowLabels = { velocity: r.optStr(al.velocity, 'arrowLabels.velocity', 8) ?? 'v', force: r.optStr(al.force, 'arrowLabels.force', 8) ?? 'F', acceleration: r.optStr(al.acceleration, 'arrowLabels.acceleration', 8) ?? 'a' };
      const q = quantities(r, [
        { key: 'radius', symbol: 'r', unit: unitOf('lengthUnit', 'm'), value: radius, dflt: given(radius) },
        { key: 'speed', symbol: arrowLabels.velocity, unit: unitOf('speedUnit', 'm/s'), value: speed, dflt: given(speed) },
        { key: 'mass', symbol: 'm', unit: 'kg', value: mass, dflt: given(mass) },
      ]);
      if (q.speed.show !== 'none' && !arrows.includes('velocity')) r.fail('show.speed: the speed is printed at the velocity arrow — add "velocity" to arrows, or set show.speed to "none"');
      const position = r.optNum(p.position, 'position') ?? 40;
      if (position < 0 || position >= 360) r.fail('position must be at least 0 and under 360 degrees');
      return { ...base, q, circular: { direction: oneOf('direction', ['counterclockwise', 'clockwise'] as const, 'counterclockwise'), position, arrows, arrowLabels, center: r.optStr(p.center, 'center', 14) } };
    }
  }
}

// ---------------------------------------------------------------------------
// Drawing pieces
// ---------------------------------------------------------------------------

/** A quantity's label with its baseline at (x, y): the text, or "sym =" and a "?" box. */
function qLabel(q: Quantity, x: number, y: number, anchor: Anchor, o: { fs?: number; halo?: boolean } = {}): { svg: string; box: Box } {
  const fs = o.fs ?? TICK_FS;
  if (q.show === 'none') return { svg: '', box: { x0: x, y0: y, x1: x, y1: y } };
  if (q.show === 'value') return { svg: text(x, y, q.printed, { fs, anchor, halo: o.halo }), box: textBox(x, y, q.printed, fs, anchor) };
  if (!q.symbol) {
    const cx = anchor === 'middle' ? x : anchor === 'start' ? x + 10 : x - 10;
    return { svg: lab(x, y, '?', anchor, { fs }), box: { x0: cx - 10, y0: y - fs * 0.36 - (fs + 5) / 2, x1: cx + 10, y1: y - fs * 0.36 + (fs + 5) / 2 } };
  }
  const lead = `${q.symbol} =`;
  const w1 = estWidth(lead, fs) + 5;
  const total = w1 + 20;
  const left = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
  return {
    svg: text(left, y, lead, { fs, anchor: 'start', halo: o.halo }) + blank(left + w1 + 10, y - fs * 0.36, 19, fs + 5, fs),
    box: { x0: left, y0: y - fs * 0.36 - (fs + 5) / 2, x1: left + total, y1: y - fs * 0.36 + (fs + 5) / 2 },
  };
}
const qWidth = (q: Quantity, fs: number = TICK_FS): number => { const b = qLabel(q, 0, 0, 'start', { fs }).box; return b.x1 - b.x0; };

/** A surface line with hatching on one side: `side` is the unit vector pointing INTO the solid. */
function hatchLine(x1: number, y1: number, x2: number, y2: number, sx: number, sy: number): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  let d = '';
  for (let s = 4; s < len - 1; s += 8) {
    const px = x1 + ux * s;
    const py = y1 + uy * s;
    d += `M${n2(px)},${n2(py)}l${n2(sx * 6 - ux * 4)},${n2(sy * 6 - uy * 4)}`;
  }
  return `<path d="${d}" ${stroke(MUTED, 1)}/>` + seg(x1, y1, x2, y2, INK, 1.8);
}

/** White paper under a label that sits on a line. */
const backing = (b: Box): string => `<path d="M${n2(b.x0 - 3)},${n2(b.y0 - 1)}H${n2(b.x1 + 3)}V${n2(b.y1 + 1)}H${n2(b.x0 - 3)}z" fill="#ffffff"/>`;

/** A vertical dimension line at x from y1 to y2, end ticks, the label centred on a white gap (or beside it). */
function vDim(x: number, y1: number, y2: number, q: Quantity, side: 'on' | 'left' | 'right' = 'on'): { svg: string; box: Box } {
  const mid = (y1 + y2) / 2;
  const line = `<path d="M${n2(x)},${n2(y1)}V${n2(y2)}M${n2(x - 4)},${n2(y1)}h8M${n2(x - 4)},${n2(y2)}h8" ${stroke(MUTED, 1)}/>`;
  const l = side === 'on' ? qLabel(q, x, mid + TICK_FS * 0.36, 'middle') : qLabel(q, side === 'left' ? x - 7 : x + 7, mid + TICK_FS * 0.36, side === 'left' ? 'end' : 'start');
  return { svg: line + (side === 'on' ? backing(l.box) : '') + l.svg, box: l.box };
}
function hDimQ(x1: number, x2: number, y: number, q: Quantity, below = false): { svg: string; box: Box } {
  const line = `<path d="M${n2(x1)},${n2(y)}H${n2(x2)}M${n2(x1)},${n2(y - 4)}v8M${n2(x2)},${n2(y - 4)}v8" ${stroke(MUTED, 1)}/>`;
  // A span too short to carry its label: the label goes under the line.
  const l = qLabel(q, (x1 + x2) / 2, y + (below ? (q.show === 'blank' ? 19 : 17) : TICK_FS * 0.36), 'middle');
  return { svg: line + (below ? '' : backing(l.box)) + l.svg, box: l.box };
}

const rectD = (x: number, y: number, w: number, h: number): string => `M${n2(x)},${n2(y)}h${n2(w)}v${n2(h)}h${n2(-w)}z`;
const block = (x: number, y: number, w: number, h: number): string => `<path d="${rectD(x, y, w, h)}" fill="${FILL}" stroke="${INK}" stroke-width="1.6"/>`;
const disc = (cx: number, cy: number, rad: number, fill: string = INK, strokeColor: string = INK, w = 1.6, dash?: string): string =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(rad)}" fill="${fill}" stroke="${strokeColor}" stroke-width="${n2(w)}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

/** A coil spring from a to b: straight leads and a zigzag between them. */
function coil(ax: number, ay: number, bx: number, by: number, turns = 9, amp = 8): string {
  const len = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  const lead = Math.min(9, len * 0.12);
  const pts: Pt[] = [[ax, ay], [ax + ux * lead, ay + uy * lead]];
  const body = len - 2 * lead;
  for (let i = 0; i < turns * 2; i++) {
    const s = lead + (body * (i + 0.5)) / (turns * 2);
    const side = i % 2 === 0 ? 1 : -1;
    pts.push([ax + ux * s - uy * amp * side, ay + uy * s + ux * amp * side]);
  }
  pts.push([bx - ux * lead, by - uy * lead], [bx, by]);
  return `<path d="${polyPath(pts)}" ${stroke(INK, 1.5)} stroke-linejoin="round"/>`;
}

// ---------------------------------------------------------------------------
// The variants
// ---------------------------------------------------------------------------

function drawProjectile(m: MechanicsModel, top: number, notes: Notes): { svg: string; bottom: number } {
  const pj = m.projectile as ProjectileModel;
  const q = m.q;
  const a = (pj.angle * Math.PI) / 180;
  const ARROW = 46;
  const elevated = pj.height > 0;
  // Room on the left for the speed label (it sits on the far side of the arrow from the path) and the height dimension.
  const leftEdge = Math.max(elevated ? 88 : 40, pj.angle > 0 && q.speed.show !== 'none' ? qWidth(q.speed) + 4 : 0);
  const availW = 328 - leftEdge;
  const availH = 176;
  const s = Math.min(availW / pj.range, availH / pj.maxHeight);
  const left = leftEdge + Math.min(40, (availW - pj.range * s) / 2);
  const arrowTop = pj.height * s + ARROW * Math.sin(a) + (q.speed.show === 'none' ? 6 : 20);
  const gy = top + Math.max(pj.maxHeight * s + 12, arrowTop + 2);
  const X = (x: number): number => left + x * s;
  const Y = (y: number): number => gy - y * s;
  if (pj.range * s < 60 || pj.maxHeight * s < 26) notes.push({ code: 'crowded', message: `the path is ${Math.round(pj.range * s)} × ${Math.round(pj.maxHeight * s)} units when drawn to scale — too thin a sliver to read at 340 px; change speed, angle or height` });

  let svg = '';
  const placer = new Placer({ x0: 4, y0: top - 4, x1: FIGURE_WIDTH - 4, y1: gy + 40 });
  // Ground and what the launch point stands on.
  svg += hatchLine(elevated ? X(0) - (pj.platform === 'cliff' ? 30 : 48) : 10, gy, 350, gy, 0, 1);
  if (elevated) {
    if (pj.platform === 'cliff') {
      svg += `<path d="${rectD(X(0) - 30, Y(pj.height), 30, pj.height * s)}" fill="${FILL}" stroke="${INK}" stroke-width="1.4"/>`;
    } else {
      svg += seg(X(0) - 36, Y(pj.height) + 2, X(0), Y(pj.height) + 2, INK, 4) + seg(X(0) - 20, Y(pj.height) + 4, X(0) - 20, gy, INK, 2.4);
    }
  }
  // The path.
  const path: Pt[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = (pj.time * i) / 60;
    path.push([X(pj.vx * t), Y(pj.height + pj.vy * t - 0.5 * m.g * t * t)]);
  }
  svg += `<path d="${polyPath(path)}" ${stroke(BLUE, 1.8, '5 4')}/>`;
  for (const [x, y] of path) placer.block({ x0: x - 3, y0: y - 3, x1: x + 3, y1: y + 3 });
  const lx = X(0);
  const ly = Y(pj.height);
  // Angle: a dashed level line, an arc, the label.
  if (q.angle.show !== 'none') {
    if (elevated) svg += seg(lx, ly, lx + 56, ly, MUTED, 1, '4 3');
    svg += `<path d="${arcPath(lx, ly, 26, 0, a)}" ${stroke(INK, 1.1)}/>`;
    const wide = pj.angle >= 38;
    // A narrow angle has no room inside: its label goes under the dashed level line (a launch from a height) or past the arc along the ground.
    const backLevel = ((2 * pj.vx * pj.vy) / m.g) * s;
    const al = wide ? qLabel(q.angle, lx + 40 * Math.cos(a / 2), ly - 40 * Math.sin(a / 2) + 4, 'start')
      : elevated ? qLabel(q.angle, lx + 30, ly + (q.angle.show === 'blank' ? 16 : 14), 'start') : qLabel(q.angle, lx + 60, ly - 4, 'start');
    if (!wide && elevated && backLevel < 52) notes.push({ code: 'labels_overlap', message: 'the path drops back through the place of the launch-angle label — use a larger angle or speed, or set show.angle to "none"' });
    svg += al.svg;
    placer.block(al.box);
  }
  // Launch velocity.
  const tx = lx + ARROW * Math.cos(a);
  const ty = ly - ARROW * Math.sin(a);
  svg += arrow(lx, ly, tx, ty, { width: 2.2 });
  placer.block({ x0: Math.min(lx, tx) - 3, y0: Math.min(ly, ty) - 3, x1: Math.max(lx, tx) + 3, y1: Math.max(ly, ty) + 3 });
  if (q.speed.show !== 'none') {
    // Level launch: over the arrow. Angled: beside the arrow's middle, on the side away from the path.
    const sl = pj.angle === 0 ? qLabel(q.speed, lx + 6, ly - 10, 'start') : qLabel(q.speed, (lx + tx) / 2 - Math.sin(a) * 9 - 3, (ly + ty) / 2 - Math.cos(a) * 9 + 2, 'end');
    svg += sl.svg;
    placer.block(sl.box);
  }
  svg += disc(lx, ly, 4.6);
  // Dimensions.
  let bottom = gy + 14;
  if (q.height.show !== 'none') {
    const d = vDim(X(0) - 58, Y(pj.height), gy, q.height);
    svg += d.svg;
    placer.block(d.box);
    if (pj.height * s < 24) notes.push({ code: 'crowded', message: `the launch height is ${Math.round(pj.height * s)} units tall when drawn to scale — too short for its label` });
  }
  if (q.maxHeight.show !== 'none') {
    const ax = X(pj.vx * pj.apexTime);
    const d = vDim(ax, Y(pj.maxHeight), gy, q.maxHeight);
    svg += d.svg;
    placer.block(d.box, ...segmentBoxes(ax, Y(pj.maxHeight), ax, gy, 5));
    if (pj.maxHeight * s < 30) notes.push({ code: 'crowded', message: `the maximum height is ${Math.round(pj.maxHeight * s)} units tall when drawn to scale — too short for its label` });
  }
  if (q.range.show !== 'none') {
    const d = hDimQ(X(0), X(pj.range), gy + 22, q.range);
    svg += d.svg;
    bottom = gy + 38;
  }
  // Lettered points.
  if (pj.points.length > 5) notes.push({ code: 'too_many_elements', message: `${pj.points.length} lettered points on one path — more than five crowd it at 340 px` });
  for (const pt of pj.points) {
    const px = X(pj.vx * pt.t);
    const py = Y(pj.height + pj.vy * pt.t - 0.5 * m.g * pt.t * pt.t);
    svg += disc(px, py, 5.6, '#ffffff', '#ffffff', 0) + disc(px, py, 3.6);
    // The letter goes on the OUTSIDE of the path (along its upward normal), so it cannot be read as
    // the name of a neighbouring point further along the curve.
    const vyt = pj.vy - m.g * pt.t;
    const sp = Math.hypot(pj.vx, vyt) || 1;
    const c = placer.place(pt.label, LABEL_FS, around(px, py, LABEL_FS, -vyt / sp, -pj.vx / sp, [10, 14, 20]));
    svg += text(c.x, c.y, pt.label, { fs: LABEL_FS, anchor: c.anchor, weight: 600 });
    if (!c.clean) notes.push({ code: 'labels_overlap', message: `there is no clear place for the point label "${pt.label}"` });
  }
  return { svg, bottom };
}

function drawPulley(m: MechanicsModel, top: number): { svg: string; bottom: number } {
  const pm = m.pulley as PulleyModel;
  const q = m.q;
  const name = (cx: number, cy: number, s: string): string => text(cx, cy + LABEL_FS * 0.36, s, { fs: LABEL_FS, anchor: 'middle', weight: 600 });
  const wheel = (cx: number, cy: number, rad: number): string => disc(cx, cy, rad, '#ffffff', INK, 1.8) + disc(cx, cy, 2.4);
  let svg = '';
  if (pm.arrangement === 'atwood') {
    const cx = 180;
    const cy = top + 44;
    const R = 24;
    svg += hatchLine(120, top + 6, 240, top + 6, 0, -1) + seg(cx, top + 6, cx, cy, INK, 2);
    const yl = cy + 92;
    const yr = cy + 132;
    svg += seg(cx - R, cy, cx - R, yl, INK, 1.4) + seg(cx + R, cy, cx + R, yr, INK, 1.4) + wheel(cx, cy, R);
    svg += block(cx - R - 24, yl, 48, 38) + name(cx - R, yl + 19, pm.labels[0]);
    svg += block(cx + R - 24, yr, 48, 38) + name(cx + R, yr + 19, pm.labels[1]);
    svg += qLabel({ ...q.m1, symbol: '', printed: q.m1.printed.replace(/^.* = /, '') }, cx - R - 32, yl + 19 + 4, 'end').svg;
    svg += qLabel({ ...q.m2, symbol: '', printed: q.m2.printed.replace(/^.* = /, '') }, cx + R + 32, yr + 19 + 4, 'start').svg;
    return { svg, bottom: yr + 38 + 12 };
  }
  const bare = (k: 'm1' | 'm2'): Quantity => ({ ...q[k], symbol: '', printed: q[k].printed.replace(/^.* = /, '') });
  const surfaceNote = (x: number, y: number, anchor: Anchor): string => (q.mu.show !== 'none' ? qLabel(q.mu, x, y, anchor).svg : pm.frictionless ? text(x, y, 'frictionless', { anchor, fill: MUTED }) : '');
  if (pm.arrangement === 'table') {
    const ty = top + 70; // table top
    const ex = 236; // table edge
    const R = 14;
    const bh = 40;
    const ropeY = ty - bh / 2;
    const pcx = ex + 14;
    const pcy = ropeY + R;
    svg += `<path d="${rectD(34, ty, ex - 34, 16)}" fill="${FILL}" stroke="${INK}" stroke-width="1.6"/>` + seg(60, ty + 16, 60, ty + 150, INK, 2.4) + seg(ex - 22, ty + 16, ex - 22, ty + 150, INK, 2.4);
    svg += hatchLine(20, ty + 150, 340, ty + 150, 0, 1);
    svg += seg(ex - 2, ty + 4, pcx, pcy, INK, 3);
    svg += block(92, ty - bh, 56, bh) + name(120, ty - bh / 2, pm.labels[0]);
    svg += seg(148, ropeY, pcx, ropeY, INK, 1.4) + seg(pcx + R, pcy, pcx + R, ty + 70, INK, 1.4) + wheel(pcx, pcy, R);
    svg += block(pcx + R - 24, ty + 70, 48, 38) + name(pcx + R, ty + 89, pm.labels[1]);
    svg += qLabel(bare('m1'), 120, ty - bh - 8, 'middle').svg;
    svg += qLabel(bare('m2'), pcx + R + 32, ty + 93, 'start').svg;
    svg += surfaceNote(120, ty + 34, 'middle');
    return { svg, bottom: ty + 150 + 16 };
  }
  // incline
  const th = ((q.angle.value as number) * Math.PI) / 180;
  const base = Math.min(230, 150 / Math.tan(th));
  const rise = base * Math.tan(th);
  const gy = top + rise + 32;
  const ax0 = base > 200 ? 26 : 50;
  const A: Pt = [ax0, gy];
  const B: Pt = [ax0 + base, gy];
  const C: Pt = [ax0 + base, gy - rise];
  const u: Pt = [Math.cos(th), -Math.sin(th)];
  const nrm: Pt = [-Math.sin(th), -Math.cos(th)];
  const bw = 50;
  const bh = 34;
  const R = 12;
  svg += hatchLine(20, gy, 340, gy, 0, 1);
  svg += `<path d="${polyPath([A, B, C], true)}" fill="${FILL}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const slope = Math.hypot(base, rise);
  const mid = slope * 0.46;
  const bc: Pt = [A[0] + u[0] * mid + nrm[0] * (bh / 2), A[1] + u[1] * mid + nrm[1] * (bh / 2)];
  const corner = (du: number, dn: number): Pt => [bc[0] + u[0] * du + nrm[0] * dn, bc[1] + u[1] * du + nrm[1] * dn];
  // The pulley stands far enough past the top of the slope for the hanging block to clear the wedge's upright side.
  const along = (27 - R + Math.sin(th) * (bh / 2 - R)) / Math.cos(th);
  const pc: Pt = [C[0] + u[0] * along + nrm[0] * (bh / 2 - R), C[1] + u[1] * along + nrm[1] * (bh / 2 - R)];
  svg += seg(C[0] - u[0] * 4, C[1] - u[1] * 4, pc[0], pc[1], INK, 3);
  const ropeStart = corner(bw / 2, 0);
  const tangent: Pt = [pc[0] + nrm[0] * R, pc[1] + nrm[1] * R];
  const hy = Math.max(pc[1] + R + 10, Math.min(Math.max(pc[1] + 46, gy - 96), gy - 38 - 6));
  svg += seg(ropeStart[0], ropeStart[1], tangent[0], tangent[1], INK, 1.4) + seg(pc[0] + R, pc[1], pc[0] + R, hy, INK, 1.4) + wheel(pc[0], pc[1], R);
  svg += `<path d="${polyPath([corner(-bw / 2, -bh / 2), corner(bw / 2, -bh / 2), corner(bw / 2, bh / 2), corner(-bw / 2, bh / 2)], true)}" fill="${FILL}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>` + name(bc[0], bc[1], pm.labels[0]);
  svg += block(pc[0] + R - 24, hy, 48, 38) + name(pc[0] + R, hy + 19, pm.labels[1]);
  const m1l = bare('m1');
  svg += qLabel(m1l, bc[0] + nrm[0] * (bh / 2 + 10) - 4, bc[1] + nrm[1] * (bh / 2 + 10), 'end').svg;
  svg += qLabel(bare('m2'), pc[0] + R + 32, hy + 23, 'start').svg;
  if (q.angle.show !== 'none') {
    // The label stands inside the wedge where the wedge is tall enough for it; the arc ends just before it.
    const lx = Math.max(36, (q.angle.show === 'blank' ? 23 : 15) / Math.tan(th));
    svg += `<path d="${arcPath(A[0], A[1], lx - 6, 0, th)}" ${stroke(INK, 1.1)}/>` + qLabel(q.angle, A[0] + lx, A[1] - (q.angle.show === 'blank' ? 6 : 4), 'start').svg;
  }
  // Inside the wedge when it is wide enough to hold the note beside the angle; otherwise under the ground line.
  const inside = base >= 170;
  svg += inside ? surfaceNote(B[0] - 8, gy - 9, 'end') : surfaceNote(A[0] + base * 0.55, gy + 18, 'middle');
  return { svg, bottom: gy + (!inside && (q.mu.show !== 'none' || pm.frictionless) ? 28 : 16) };
}

function drawSpring(m: MechanicsModel, top: number): { svg: string; bottom: number } {
  const sp = m.spring as SpringModel;
  const q = m.q;
  const shift = sp.state === 'stretched' ? 48 : sp.state === 'compressed' ? -48 : 0;
  const massIn = (cx: number, cy: number): string => (q.m.show === 'none' ? text(cx, cy + LABEL_FS * 0.36, sp.blockName, { fs: LABEL_FS, anchor: 'middle', weight: 600 }) : qLabel({ ...q.m, symbol: '', printed: q.m.printed.replace(/^.* = /, '') }, cx, cy + TICK_FS * 0.36, 'middle').svg);
  let svg = '';
  if (sp.orientation === 'horizontal') {
    const wx = 40;
    const fy = top + 106;
    const L0 = 128;
    const eq = wx + L0;
    const end = eq + shift;
    const sy = fy - 27;
    svg += hatchLine(wx, top + 22, wx, fy, -1, 0) + hatchLine(wx, fy, 344, fy, 0, 1);
    // The equilibrium line first: a compressed block covers the part of it that would cross the block.
    if (sp.state !== 'equilibrium' || q.x.show !== 'none') {
      svg += seg(eq, top + 22, eq, fy + (q.x.show !== 'none' ? 30 : 8), MUTED, 1.1, '5 3') + text(eq, top + 15, 'equilibrium', { anchor: 'middle', fill: MUTED });
    }
    svg += coil(wx, sy, end, sy, 9, 9) + block(end, fy - 54, 60, 54) + massIn(end + 30, fy - 27);
    if (q.k.show !== 'none') svg += sp.state === 'compressed' ? qLabel(q.k, wx + 8, fy - 54 - 9, 'start').svg : qLabel(q.k, wx + L0 / 2 + 4, sy - 16, 'middle').svg;
    if (q.x.show !== 'none') {
      svg += seg(end, fy, end, fy + 30, MUTED, 1.1, '5 3') + hDimQ(Math.min(eq, end), Math.max(eq, end), fy + 22, q.x, true).svg;
      return { svg, bottom: fy + 54 };
    }
    return { svg, bottom: fy + 18 };
  }
  const cx = 170;
  const cyTop = top + 8;
  const L0 = 96;
  const eq = cyTop + L0;
  const end = eq + shift;
  svg += hatchLine(110, cyTop, 230, cyTop, 0, -1);
  if (sp.state !== 'equilibrium' || q.x.show !== 'none') {
    svg += seg(cx - 78, eq, cx + 70, eq, MUTED, 1.1, '5 3') + text(cx + 76, eq + 4, 'equilibrium', { anchor: 'start', fill: MUTED });
  }
  svg += coil(cx, cyTop, cx, end, 9, 9) + block(cx - 30, end, 60, 40) + massIn(cx, end + 20);
  if (q.k.show !== 'none') svg += qLabel(q.k, cx + 20, cyTop + Math.min(L0, L0 + shift) / 2 + (sp.state === 'compressed' ? -6 : 0), 'start').svg;
  if (q.x.show !== 'none') {
    svg += seg(cx - 78, end, cx - 30, end, MUTED, 1.1, '5 3') + vDim(cx - 64, Math.min(eq, end), Math.max(eq, end), q.x, 'left').svg;
  }
  return { svg, bottom: Math.max(end + 40, eq) + 14 };
}

function drawPendulum(m: MechanicsModel, top: number, notes: Notes): { svg: string; bottom: number } {
  const pd = m.pendulum as PendulumModel;
  const q = m.q;
  const th = (pd.angle * Math.PI) / 180;
  const rad = (deg: number): number => (deg * Math.PI) / 180;
  const arc = pd.showArc || pd.points.length > 0;
  const leftSwing = pd.showArc ? pd.angle : Math.max(0, ...pd.points.filter((p) => p.angle < 0).map((p) => -p.angle));
  const rightSwing = Math.max(pd.angle, ...pd.points.map((p) => p.angle));
  // What stands to the right of the bob and to the left of the swing; the string is as long as the width allows.
  const padR = 14 + Math.max(q.mass.show !== 'none' ? 6 + qWidth(q.mass) : 0, q.height.show !== 'none' ? 34 + qWidth(q.height) : 0, pd.points.length ? 8 : 0);
  const padL = leftSwing > 0 ? 26 : 60;
  const L = Math.min(156, (FIGURE_WIDTH - 8 - padR - padL) / (Math.sin(rad(rightSwing)) + Math.sin(rad(leftSwing))));
  if (L < 96) notes.push({ code: 'crowded', message: `the swing and its labels leave room for a string only ${Math.round(L)} units long — drop a label, or use smaller angles` });
  const lo = 4 + padL + L * Math.sin(rad(leftSwing));
  const hi = FIGURE_WIDTH - 4 - padR - L * Math.sin(rad(rightSwing));
  const px = Math.max(lo, Math.min(hi, 170));
  const py = top + 8;
  const at = (deg: number, r0: number = L): Pt => [px + r0 * Math.sin(rad(deg)), py + r0 * Math.cos(rad(deg))];
  const [bx, by] = at(pd.angle);
  const lowY = py + L;
  let svg = hatchLine(px - 56, py, px + 56, py, 0, -1);
  if (pd.showVertical || q.angle.show !== 'none' || q.height.show !== 'none') svg += seg(px, py, px, lowY + 16, MUTED, 1.1, '5 3');
  if (arc) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 48; i++) pts.push(at(-leftSwing + ((rightSwing + leftSwing) * i) / 48));
    svg += `<path d="${polyPath(pts)}" ${stroke(MUTED, 1.1, '2 4')}/>`;
  }
  svg += seg(px, py, bx, by, INK, 1.6);
  if (q.angle.show !== 'none') {
    svg += `<path d="${arcPath(px, py, 38, -Math.PI / 2, -Math.PI / 2 + th)}" ${stroke(INK, 1.1)}/>`;
    if (pd.angle >= 28) {
      const [ax, ay] = at(pd.angle / 2, 54);
      svg += qLabel(q.angle, ax, ay + 4, 'middle').svg;
    } else {
      const [ax, ay] = at(pd.angle, 46);
      svg += qLabel(q.angle, ax + 7, ay + 2, 'start').svg;
    }
  }
  if (q.length.show !== 'none') {
    const [mx, my] = at(pd.angle, L * 0.6);
    svg += qLabel(q.length, mx + 9, my - 3, 'start').svg;
  }
  let bottom = lowY + 24;
  if (q.height.show !== 'none') {
    // The bob's lowest position, dashed, and a dimension line to the right of the bob between the two levels.
    const dx = bx + 26;
    svg += disc(px, lowY, 11, '#ffffff', MUTED, 1.2, '3 3') + seg(px + 12, lowY, dx + 6, lowY, MUTED, 1.1, '5 3') + seg(bx + 12, by, dx + 6, by, MUTED, 1.1, '5 3');
    svg += vDim(dx, by, lowY, q.height, 'right').svg;
    if (lowY - by < 22) notes.push({ code: 'crowded', message: `at ${numStr(pd.angle, 1)}° the bob is only ${Math.round(lowY - by)} units above its lowest point — the height dimension is too short to read; use a larger angle` });
  }
  svg += disc(px, py, 2.6) + disc(bx, by, 11, FILL, INK, 1.8);
  if (q.mass.show !== 'none') svg += qLabel(q.mass, bx + 16, by - (q.height.show !== 'none' ? 10 : -4), 'start').svg;
  const marks = [...pd.points.map((p) => p.angle), ...(pd.points.some((p) => Math.abs(p.angle - pd.angle) < 1e-9) ? [] : [pd.angle])].sort((x, y) => x - y);
  for (let i = 1; i < marks.length; i++) {
    if (L * rad(marks[i] - marks[i - 1]) < 26) {
      notes.push({ code: 'crowded', message: `two marked positions of the bob (${numStr(marks[i - 1], 1)}° and ${numStr(marks[i], 1)}°) are only ${Math.round(L * rad(marks[i] - marks[i - 1]))} units apart on the path — their dots and letters run together` });
      break;
    }
  }
  if (pd.points.length > 5) notes.push({ code: 'too_many_elements', message: `${pd.points.length} lettered positions on one swing — more than five crowd it at 340 px` });
  for (const pt of pd.points) {
    const [x, y] = at(pt.angle);
    const onBob = Math.abs(pt.angle - pd.angle) < 1e-9;
    const onGhost = pt.angle === 0 && q.height.show !== 'none';
    if (!onBob && !onGhost) svg += disc(x, y, 5.4, '#ffffff', '#ffffff', 0) + disc(x, y, 3.4);
    // Under the bob (or the dashed lowest position) when the point is there; otherwise just outside the path.
    const [tx, ty] = onBob || onGhost ? [x, y + 11 + 14 - LABEL_FS * 0.36] : at(pt.angle, L + 16);
    svg += text(tx, ty + LABEL_FS * 0.36, pt.label, { fs: LABEL_FS, anchor: 'middle', weight: 600 });
    bottom = Math.max(bottom, ty + 16);
  }
  return { svg, bottom };
}

function drawCollision(m: MechanicsModel, top: number): { svg: string; bottom: number } {
  const cm = m.collision as CollisionModel;
  const q = m.q;
  const CW = 62;
  const CH = 28;
  const cart = (cx: number, ty: number, name: string): string =>
    block(cx - CW / 2, ty - 8 - CH, CW, CH) + disc(cx - 18, ty - 5, 5, '#ffffff', INK, 1.5) + disc(cx + 18, ty - 5, 5, '#ffffff', INK, 1.5)
    + text(cx, ty - 8 - CH / 2 + LABEL_FS * 0.36, name, { fs: LABEL_FS, anchor: 'middle', weight: 600 });
  const velocity = (cx: number, ty: number, v: Quantity): string => {
    const y = ty - 8 - CH - 14;
    if (v.show === 'none') return '';
    if (v.show === 'blank') return qLabel(v, cx, y + 2, 'middle').svg;
    if (Math.abs(v.value as number) < 1e-12) return text(cx, y + 2, 'at rest', { anchor: 'middle', fill: MUTED });
    const dir = (v.value as number) > 0 ? 1 : -1;
    const lbl = { ...v, printed: v.printed.replace('−', '') };
    return arrow(cx - dir * 22, y, cx + dir * 22, y, { width: 2.2, color: BLUE }) + qLabel(lbl, cx, y - 9, 'middle').svg;
  };
  const panel = (ty: number, title: string, xs: [number, number], v: [Quantity, Quantity], joined: boolean): string => {
    let s = text(12, ty - 8 - CH - 30, title, { fs: LABEL_FS, weight: 600 }) + hatchLine(12, ty, 348, ty, 0, 1);
    s += cart(xs[0], ty, cm.labels[0]) + cart(xs[1], ty, cm.labels[1]);
    s += qLabel(q.m1, xs[0], ty + 20, 'middle').svg + qLabel(q.m2, xs[1], ty + 20, 'middle').svg;
    s += joined ? velocity((xs[0] + xs[1]) / 2, ty, v[0]) : velocity(xs[0], ty, v[0]) + velocity(xs[1], ty, v[1]);
    return s;
  };
  const t1 = top + 84;
  const t2 = t1 + 122;
  // Carts that start together (an explosion from one shared velocity) are drawn touching, each with its own label.
  const startJoined = cm.explosion && q.u1.value === q.u2.value;
  const svg = panel(t1, 'Before', startJoined ? [180 - CW / 2, 180 + CW / 2] : [104, 256], [q.u1, q.u2], startJoined)
    + seg(12, t1 + 36, 348, t1 + 36, '#d1d5db', 1)
    + panel(t2, 'After', cm.together ? [180 - CW / 2, 180 + CW / 2] : [104, 256], [q.v1, q.v2], cm.together);
  return { svg, bottom: t2 + 32 };
}

function drawCircular(m: MechanicsModel, top: number): { svg: string; bottom: number } {
  const cc = m.circular as CircularModel;
  const q = m.q;
  const R = 84;
  const cx = 180;
  const cy = top + R + 44;
  const ph = (cc.position * Math.PI) / 180;
  const ox = cx + R * Math.cos(ph);
  const oy = cy - R * Math.sin(ph);
  const sgn = cc.direction === 'counterclockwise' ? 1 : -1;
  // Screen unit vectors: tangent (direction of travel) and inward.
  const tx = -Math.sin(ph) * sgn;
  const ty = -Math.cos(ph) * sgn;
  const ix = -Math.cos(ph);
  const iy = Math.sin(ph);
  let svg = disc(cx, cy, R, 'none', MUTED, 1.3, '6 4');
  // Direction of travel: a small arrowhead on the path, a quarter turn behind the object.
  if (cc.center) svg += disc(cx, cy, 15, FILL, INK, 1.6) + text(cx, cy + 15 + 14, cc.center, { anchor: 'middle' });
  else svg += disc(cx, cy, 2.4);
  // The radius: a level line to the side of the circle away from the object, its label outside the circle at the line's end.
  if (q.radius.show !== 'none') {
    const side = Math.cos(ph) >= 0 ? -1 : 1;
    svg += seg(cx + side * (cc.center ? 15 : 0), cy, cx + side * R, cy, INK, 1.2);
    svg += qLabel(q.radius, cx + side * (R + 7), cy + 4, side > 0 ? 'start' : 'end').svg;
  }
  for (const k of cc.arrows) {
    if (k === 'velocity') {
      const ex = ox + tx * 56;
      const ey = oy + ty * 56;
      svg += arrow(ox, oy, ex, ey, { width: 2.2, color: BLUE });
      const vq: Quantity = q.speed.show === 'none' ? { ...q.speed, show: 'value', printed: cc.arrowLabels.velocity } : q.speed;
      // Beyond the tip, on the side away from the circle.
      const hx = -ix * 0.9 + tx * 0.5;
      const anchor: Anchor = hx > 0.3 ? 'start' : hx < -0.3 ? 'end' : 'middle';
      const vy2 = -iy * 0.9 + ty * 0.5;
      svg += qLabel(vq, ex + tx * 4 - ix * 7, ey + ty * 4 - iy * 7 + (vy2 > 0.3 ? 9 : vy2 < -0.3 ? -2 : 4), anchor).svg;
    } else {
      const ex = ox + ix * 48;
      const ey = oy + iy * 48;
      svg += arrow(ox, oy, ex, ey, { width: 2.2, color: SERIES_COLORS[1], dash: k === 'acceleration' ? '5 3' : undefined });
      // Beside the arrow's middle, on the side the object came from (clear of the velocity arrow).
      const lx = ox + ix * 26 - tx * 13;
      const ly = oy + iy * 26 - ty * 13;
      svg += text(lx, ly + 4, cc.arrowLabels[k], { fs: LABEL_FS, anchor: 'middle', weight: 600 });
    }
  }
  svg += disc(ox, oy, 7.5, INK, INK, 1);
  if (q.mass.show !== 'none') {
    // Outside the circle, on the side the object came from.
    const lx = ox - ix * 14 - tx * 12;
    const ly = oy - iy * 14 - ty * 12;
    svg += qLabel(q.mass, lx, ly + 4, -ix - tx * 0.8 > 0.2 ? 'start' : -ix - tx * 0.8 < -0.2 ? 'end' : 'middle').svg;
  }
  return { svg, bottom: cy + R + 40 };
}

export function renderMechanicsSetup(r: Reader, _uid?: string): Drawn {
  const m = mechanicsModel(r);
  const notes: Notes = [];
  const t = titleBlock(m.title, FIGURE_WIDTH);
  const top = t.top + 6;
  const d = m.variant === 'projectile' ? drawProjectile(m, top + 10, notes)
    : m.variant === 'pulley' ? drawPulley(m, top)
      : m.variant === 'spring_mass' ? drawSpring(m, top)
        : m.variant === 'pendulum' ? drawPendulum(m, top, notes)
          : m.variant === 'collision' ? drawCollision(m, top - 8)
            : drawCircular(m, top - 14);
  return { body: t.svg + d.svg, H: Math.round(d.bottom), facts: facts(notes) };
}
