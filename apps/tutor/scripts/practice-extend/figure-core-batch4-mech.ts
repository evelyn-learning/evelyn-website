/**
 * Batch 4, part "mech" (mechanics_setup: projectile, pulley, spring_mass,
 * pendulum, collision, circular): the TEXT transcription and the deterministic
 * checkers. Conventions: figure-core-batch4-kit.ts.
 *
 * WHAT A CHECKER MAY USE. A quantity is taken from the derivation ARGUMENTS
 * when it is passed there (a value the question's text gives), otherwise from
 * the figure — and from the figure only when it is PRINTED (`show: 'value'`).
 * A "?" is not a value, and neither is a number the spec holds but does not
 * print: the checker refuses, naming the argument to pass. What the drawing
 * itself shows without a number counts as given: a level launch, a launch
 * from the ground, a "frictionless" surface, carts that leave joined.
 * g is the spec's `g` (default 9.8 m/s²) unless the argument `g` is passed.
 * Values are in the figure's own units — nothing is converted.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { mechanicsModel, type MechanicsModel, type Quantity } from '../../src/lib/tutor/practice-figure/kinds/mechanics';
import { BLANK, argIndex, argNum, fail, label, measured, modelOf, pick, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const KIND_PHRASE: Record<MechanicsModel['variant'], string> = {
  projectile: 'a sketch of a projectile and the path it follows',
  pulley: 'a sketch of two blocks joined by a string that passes over a pulley',
  spring_mass: 'a sketch of a block on a coil spring',
  pendulum: 'a sketch of a simple pendulum',
  collision: 'a before-and-after sketch of two carts colliding on a track',
  circular: 'a top-view sketch of an object moving in a circle',
};

/** One printed quantity as a transcription line — nothing when it is not printed. */
function pq(printed: string[], role: string, q: Quantity): string {
  if (q.show === 'none') return '';
  const line = q.show === 'value' ? `"${q.printed}"` : q.symbol ? `"${q.symbol} =" ${BLANK}` : BLANK;
  printed.push(`${role}: ${line}`);
  return line;
}

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, mechanicsModel);
  const q = m.q;
  if (m.title) printed.push(`title: "${m.title}"`);
  if (m.projectile) {
    const pj = m.projectile;
    const from = pj.height > 0 ? (pj.platform === 'cliff' ? 'the top of a cliff' : 'the edge of a table') : 'level ground';
    out.push(`  a ball is launched from ${from}, ${pj.angle === 0 ? 'horizontally' : 'upward at an angle to the horizontal'}; an arrow at the launch point shows the launch velocity`);
    out.push(`  a dashed curve shows its path${pj.angle > 0 ? ', which rises to a highest point and then falls' : ', which curves downward'} to the ground${pj.height > 0 ? ' below' : ''}${m.notToScale ? '' : '; the path is drawn to scale'}`);
    const sp = pq(printed, 'launch speed', q.speed);
    if (sp) out.push(`  the launch velocity arrow is labelled ${sp}`);
    const an = pq(printed, 'launch angle', q.angle);
    if (an) out.push(`  the angle between the launch velocity and the horizontal is marked ${an}`);
    const h = pq(printed, 'launch height', q.height);
    if (h) out.push(`  a dimension line gives the height of the launch point above the ground: ${h}`);
    const mh = pq(printed, 'maximum height', q.maxHeight);
    if (mh) out.push(`  a dimension line from the ground to the highest point of the path is marked ${mh}`);
    const rg = pq(printed, 'horizontal distance', q.range);
    if (rg) out.push(`  a dimension line along the ground from below the launch point to the landing point is marked ${rg}`);
    for (const pt of pj.points) {
      printed.push(`point: "${pt.label}"`);
      const where = pt.at === 'apex' ? 'at the highest point of the path' : pt.at === 'landing' ? 'where the path meets the ground' : pt.t === 0 ? 'at the launch point' : pj.angle > 0 && Math.abs(pt.t - pj.apexTime) < 1e-9 ? 'at the highest point of the path' : pj.angle > 0 && pt.t < pj.apexTime ? 'on the rising part of the path' : 'on the falling part of the path';
      out.push(`  the point "${pt.label}" is ${where}`);
    }
  } else if (m.pulley) {
    const pm = m.pulley;
    const [a, b] = pm.labels;
    printed.push(`block: "${a}"`, `block: "${b}"`);
    if (pm.arrangement === 'atwood') out.push(`  a pulley hangs from a ceiling; a string passes over it and a block hangs from each end — "${a}" on the left, "${b}" on the right`);
    else if (pm.arrangement === 'table') out.push(`  the block "${a}" rests on a level table; a string runs from it over a pulley at the edge of the table to the block "${b}", which hangs beside the table`);
    else out.push(`  the block "${a}" rests on an inclined plane; a string runs from it up the slope, over a pulley at the top, to the block "${b}", which hangs beside the incline`);
    const m1 = pq(printed, 'mass', q.m1);
    if (m1) out.push(`  beside the block "${a}": ${m1}`);
    const m2 = pq(printed, 'mass', q.m2);
    if (m2) out.push(`  beside the block "${b}": ${m2}`);
    const an = pq(printed, 'incline angle', q.angle);
    if (an) out.push(`  the angle between the incline and the ground is marked ${an}`);
    const mu = pq(printed, 'friction coefficient', q.mu);
    if (mu) out.push(`  on the surface under "${a}": ${mu}`);
    if (pm.frictionless) {
      printed.push('surface note: "frictionless"');
      out.push(`  the surface under "${a}" is marked "frictionless"`);
    }
  } else if (m.spring) {
    const sp = m.spring;
    const horizontal = sp.orientation === 'horizontal';
    out.push(horizontal ? '  a block on a level surface is attached to a wall by a horizontal coil spring' : '  a block hangs from a ceiling on a vertical coil spring');
    const marked = sp.state !== 'equilibrium';
    if (marked) {
      printed.push('line label: "equilibrium"');
      out.push(`  a dashed line labelled "equilibrium" marks where the end of the spring is at equilibrium; the spring is drawn ${sp.state === 'stretched' ? 'stretched past' : 'compressed short of'} it (the sketch is not to scale)`);
    }
    const k = pq(printed, 'spring constant', q.k);
    if (k) out.push(`  beside the spring: ${k}`);
    if (q.m.show === 'none') {
      printed.push(`block: "${sp.blockName}"`);
      out.push(`  the block is labelled "${sp.blockName}"`);
    } else out.push(`  in the block: ${pq(printed, 'mass', q.m)}`);
    const x = pq(printed, 'displacement', q.x);
    if (x) out.push(`  a dimension line between the equilibrium line and the end of the spring is marked ${x}`);
  } else if (m.pendulum) {
    const pd = m.pendulum;
    out.push('  a bob hangs on a string from a fixed point on a ceiling; it is drawn pulled to the right of the vertical, the string straight');
    const an = pq(printed, 'angle', q.angle);
    if (an) out.push(`  the angle between the string and the dashed vertical is marked ${an}`);
    const L = pq(printed, 'string length', q.length);
    if (L) out.push(`  beside the string: ${L}`);
    const ms = pq(printed, 'mass', q.mass);
    if (ms) out.push(`  beside the bob: ${ms}`);
    const h = pq(printed, 'height', q.height);
    if (h) out.push(`  a dashed circle shows the bob at its lowest position; a dimension line between the bob's level and that lowest level is marked ${h}`);
    if (pd.showArc || pd.points.length) out.push('  a dotted arc shows the path of the bob');
    for (const pt of pd.points) {
      printed.push(`position: "${pt.label}"`);
      const where = Math.abs(pt.angle - pd.angle) < 1e-9 ? 'where the bob is drawn' : pt.angle === 0 ? 'the lowest point of the path' : `on the path to the ${pt.angle < 0 ? 'left' : 'right'} of the vertical${Math.abs(pt.angle) < pd.angle ? ', lower than the bob is drawn' : Math.abs(pt.angle) === pd.angle ? ', level with the bob' : ', higher than the bob is drawn'}`;
      out.push(`  the position "${pt.label}" is ${where}`);
    }
  } else if (m.collision) {
    const cm = m.collision;
    printed.push('panel: "Before"', 'panel: "After"', `cart: "${cm.labels[0]}"`, `cart: "${cm.labels[1]}"`);
    const motion = (v: Quantity): string => {
      if (v.show === 'none') return 'no velocity is shown';
      if (v.show === 'blank') return `its velocity is a blank ${BLANK} with no arrow`;
      if (v.printed === 'at rest') return 'marked "at rest"';
      return `an arrow pointing ${(v.value as number) > 0 ? 'right' : 'left'} labelled "${v.printed}"`;
    };
    const masses = [pq(printed, 'mass', q.m1), pq(printed, 'mass', q.m2)];
    out.push(`  two carts on a level track, "${cm.labels[0]}" on the left and "${cm.labels[1]}" on the right, drawn twice: a panel "Before" above a panel "After" (arrows show direction only — all are one length)`);
    cm.labels.forEach((l, i) => { if (masses[i]) out.push(`  under cart "${l}": ${masses[i]}`); });
    for (const k of ['u1', 'u2'] as const) if (q[k].show === 'value') printed.push(`velocity before: "${q[k].printed}"`);
    out.push(`  Before — cart "${cm.labels[0]}": ${motion(q.u1)}; cart "${cm.labels[1]}": ${motion(q.u2)}`);
    if (cm.together) {
      if (q.v1.show === 'value') printed.push(`velocity after: "${q.v1.printed}"`);
      out.push(`  After — the two carts are joined and move as one: ${motion(q.v1)}`);
    } else {
      for (const k of ['v1', 'v2'] as const) if (q[k].show === 'value') printed.push(`velocity after: "${q[k].printed}"`);
      out.push(`  After — cart "${cm.labels[0]}": ${motion(q.v1)}; cart "${cm.labels[1]}": ${motion(q.v2)}`);
    }
  } else if (m.circular) {
    const cc = m.circular;
    out.push(`  an object is drawn on a dashed circle${cc.center ? ` round a body at its centre labelled "${cc.center}"` : ', whose centre is marked with a dot'}`);
    if (cc.center) printed.push(`centre: "${cc.center}"`);
    const r = pq(printed, 'radius', q.radius);
    if (r) out.push(`  a line from the centre to the circle is labelled ${r}`);
    for (const k of cc.arrows) {
      if (k === 'velocity') {
        const v = q.speed.show === 'none' ? (printed.push(`arrow label: "${cc.arrowLabels.velocity}"`), `"${cc.arrowLabels.velocity}"`) : pq(printed, 'speed', q.speed);
        out.push(`  an arrow from the object along the tangent to the circle, pointing ${cc.direction === 'clockwise' ? 'clockwise' : 'counter-clockwise'} round it, is labelled ${v}`);
      } else {
        printed.push(`arrow label: "${cc.arrowLabels[k]}"`);
        out.push(`  a${k === 'acceleration' ? ' dashed' : 'n'} arrow from the object toward the centre of the circle is labelled "${cc.arrowLabels[k]}"`);
      }
    }
    const ms = pq(printed, 'mass', q.mass);
    if (ms) out.push(`  beside the object: ${ms}`);
  }
  if (m.notToScale) {
    // Fix f (batch 5): a fixed schematic shape — the angle and the heights cannot be measured off the sketch.
    printed.push('note: "not to scale"');
    out.push('  the words "not to scale" are printed under the sketch: it is a schematic — angles and lengths cannot be measured off it, only the printed values count');
  }
  return KIND_PHRASE[m.variant];
}

// ── checkers ────────────────────────────────────────────────────────────────

const NAMES: Record<string, string> = {
  speed: 'the speed', angle: 'the angle', height: 'the launch height', m1: 'the first mass', m2: 'the second mass', mu: 'the friction coefficient', k: 'the spring constant', m: 'the mass', x: 'the displacement from equilibrium',
  length: 'the string length', mass: 'the mass', radius: 'the radius', u1: "the first cart's velocity before", u2: "the second cart's velocity before", v1: "the first cart's velocity after", v2: "the second cart's velocity after",
};
/** A quantity as a checker may use it: the argument when passed, else the PRINTED value; otherwise a refusal. */
function val(m: MechanicsModel, a: P, key: string, visibleAnyway = false): number {
  if (a[key] !== undefined) return argNum(a, key);
  const q = m.q[key];
  if (q && q.value !== undefined && (q.show === 'value' || visibleAnyway)) return q.value;
  return fail(`${NAMES[key] ?? key} is not printed on the figure${q?.show === 'blank' ? ' (it is the "?")' : ''} — pass it as the derivation argument "${key}" if the question's text gives it`);
}
const gOf = (m: MechanicsModel, a: P): number => {
  const g = a.g === undefined ? m.g : argNum(a, 'g');
  if (!(g > 0)) return fail('derivation argument "g" must be greater than 0');
  return g;
};
function variantOf(spec: PracticeFigureSpec, variant: MechanicsModel['variant']): MechanicsModel {
  const m = modelOf(spec, mechanicsModel);
  if (m.variant !== variant) return fail(`this checker is for the ${variant} variant of mechanics_setup, not ${m.variant}`);
  return m;
}
const positive = (v: number, what: string): number => (v > 0 ? v : fail(`${what} must be greater than 0`));
const G_NOTE = "g = the spec's g (default 9.8 m/s²) unless the argument g is passed";
const USE_NOTE = 'each quantity is the argument of its name when passed, else the value PRINTED on the figure — refused when it is neither';

const CHECKERS: Record<string, Batch4CheckerDef> = {
  projectile_value: {
    kinds: ['mechanics_setup'], args: '{ want: time_of_flight | time_to_apex | range | max_height | impact_speed | vx | vy_launch | vy_impact, speed?, angle?, height?, g? }',
    returns: `one quantity of the flight, from the launch speed, angle (degrees) and height: time of flight (s), time to the highest point, horizontal range, greatest height above the ground, speed on landing, the horizontal velocity, the vertical velocity at launch, or at landing (negative = downward); ${USE_NOTE} (a level launch and a launch from the ground need no number); ${G_NOTE}`,
    run: (s, a) => {
      const m = variantOf(s, 'projectile');
      const pj = m.projectile as NonNullable<MechanicsModel['projectile']>;
      const want = pick(a, 'want', ['time_of_flight', 'time_to_apex', 'range', 'max_height', 'impact_speed', 'vx', 'vy_launch', 'vy_impact'] as const);
      const v = positive(val(m, a, 'speed'), 'speed');
      const deg = val(m, a, 'angle', pj.angle === 0);
      const h = val(m, a, 'height', pj.height === 0);
      if (deg < 0 || deg >= 90 || h < 0) return fail('angle must be from 0 to under 90 degrees and height 0 or more');
      const g = gOf(m, a);
      const vx = v * Math.cos((deg * Math.PI) / 180);
      const vy = v * Math.sin((deg * Math.PI) / 180);
      const t = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
      if (!(t > 0)) return fail('the projectile never leaves the ground');
      switch (want) {
        case 'time_of_flight': return measured(t);
        case 'time_to_apex': return measured(vy / g);
        case 'range': return measured(vx * t);
        case 'max_height': return measured(h + (vy * vy) / (2 * g));
        case 'impact_speed': return measured(Math.hypot(vx, vy - g * t));
        case 'vx': return measured(vx);
        case 'vy_launch': return measured(vy);
        default: return measured(vy - g * t);
      }
    },
  },
  pulley_value: {
    kinds: ['mechanics_setup'], args: '{ want: acceleration | tension, m1?, m2?, angle?, mu?, g? }',
    returns: `the magnitude of the blocks' acceleration (m/s²) or the tension in the string (N) for an ideal string and pulley — Atwood machine, block on a table, or block on an incline, with kinetic friction μ under the block on the surface; ${USE_NOTE} (a surface marked "frictionless" is μ = 0; with no note and no μ printed, pass mu); refused when friction would hold the system at rest; ${G_NOTE}`,
    run: (s, a) => {
      const m = variantOf(s, 'pulley');
      const pm = m.pulley as NonNullable<MechanicsModel['pulley']>;
      const want = pick(a, 'want', ['acceleration', 'tension'] as const);
      const m1 = positive(val(m, a, 'm1'), 'm1');
      const m2 = positive(val(m, a, 'm2'), 'm2');
      const g = gOf(m, a);
      if (pm.arrangement === 'atwood') return measured(want === 'acceleration' ? (Math.abs(m1 - m2) * g) / (m1 + m2) : (2 * m1 * m2 * g) / (m1 + m2));
      const mu = a.mu !== undefined ? argNum(a, 'mu') : pm.frictionless ? 0 : m.q.mu.show === 'value' ? (m.q.mu.value as number) : fail('the figure does not say whether the surface has friction — pass the derivation argument "mu" (0 for a frictionless surface)');
      if (mu < 0) return fail('mu must be 0 or more');
      const th = pm.arrangement === 'incline' ? (val(m, a, 'angle') * Math.PI) / 180 : 0;
      const along = pm.arrangement === 'incline' ? m1 * g * Math.sin(th) : 0; // weight of m1 down the slope
      const friction = mu * m1 * g * Math.cos(th);
      const drive = m2 * g - along; // > 0: m2 falls
      const net = Math.abs(drive) - friction;
      if (!(net > 1e-12)) return fail('with these values friction holds the blocks at rest (or they are balanced) — there is no acceleration to ask for');
      const acc = net / (m1 + m2);
      return measured(want === 'acceleration' ? acc : drive > 0 ? m2 * (g - acc) : m2 * (g + acc));
    },
  },
  spring_value: {
    kinds: ['mechanics_setup'], args: '{ want: force | elastic_pe | period | frequency | max_speed, k?, m?, x? }',
    returns: `for a spring obeying Hooke's law: the magnitude of the spring force k·x (N), the elastic potential energy ½k·x² (J), the period 2π√(m/k) (s), the frequency (Hz), or the greatest speed x·√(k/m) of the block released from rest at displacement x; ${USE_NOTE}`,
    run: (s, a) => {
      const m = variantOf(s, 'spring_mass');
      const want = pick(a, 'want', ['force', 'elastic_pe', 'period', 'frequency', 'max_speed'] as const);
      const k = positive(val(m, a, 'k'), 'k');
      const x = want === 'period' || want === 'frequency' ? 0 : Math.abs(val(m, a, 'x'));
      const mass = want === 'force' || want === 'elastic_pe' ? 1 : positive(val(m, a, 'm'), 'm');
      switch (want) {
        case 'force': return measured(k * x);
        case 'elastic_pe': return measured(0.5 * k * x * x);
        case 'period': return measured(2 * Math.PI * Math.sqrt(mass / k));
        case 'frequency': return measured(Math.sqrt(k / mass) / (2 * Math.PI));
        default: return measured(x * Math.sqrt(k / mass));
      }
    },
  },
  pendulum_value: {
    kinds: ['mechanics_setup'], args: '{ want: period | frequency | rise_height | bottom_speed, length?, angle?, g? }',
    returns: `for a simple pendulum: the small-angle period 2π√(L/g) (s), the frequency (Hz), the height of the bob above its lowest point L(1 − cos θ), or its speed at the lowest point after release from rest at the angle drawn, √(2gL(1 − cos θ)); ${USE_NOTE}; ${G_NOTE}`,
    run: (s, a) => {
      const m = variantOf(s, 'pendulum');
      const want = pick(a, 'want', ['period', 'frequency', 'rise_height', 'bottom_speed'] as const);
      const L = positive(val(m, a, 'length'), 'length');
      const g = gOf(m, a);
      if (want === 'period') return measured(2 * Math.PI * Math.sqrt(L / g));
      if (want === 'frequency') return measured(Math.sqrt(g / L) / (2 * Math.PI));
      const deg = val(m, a, 'angle');
      if (!(deg > 0 && deg <= 90)) return fail('angle must be between 0 and 90 degrees');
      const h = L * (1 - Math.cos((deg * Math.PI) / 180));
      return measured(want === 'rise_height' ? h : Math.sqrt(2 * g * h));
    },
  },
  collision_value: {
    kinds: ['mechanics_setup'], args: '{ want: final_velocity | total_momentum | ke_before | ke_after | ke_lost | type, cart?: index (0 = left; for final_velocity), m1?, m2?, u1?, u2?, v1?, v2? }',
    returns: `final_velocity: the velocity after the collision of the cart named by \`cart\` (or of the joined carts), by conservation of momentum from the OTHER values — right is positive, left negative; total_momentum (kg·m/s, right positive); the total kinetic energy before, after, or lost (J); type: "elastic", "inelastic" or "perfectly inelastic" (carts drawn joined). ${USE_NOTE}; a printed speed takes its sign from its arrow`,
    run: (s, a) => {
      const m = variantOf(s, 'collision');
      const cm = m.collision as NonNullable<MechanicsModel['collision']>;
      const want = pick(a, 'want', ['final_velocity', 'total_momentum', 'ke_before', 'ke_after', 'ke_lost', 'type'] as const);
      if (want === 'type' && cm.together) return label('perfectly inelastic');
      const m1 = positive(val(m, a, 'm1'), 'm1');
      const m2 = positive(val(m, a, 'm2'), 'm2');
      const before = (): [number, number] => [val(m, a, 'u1'), val(m, a, 'u2')];
      const after = (): [number, number] => {
        if (!cm.together) return [val(m, a, 'v1'), val(m, a, 'v2')];
        const v = a.v1 !== undefined ? argNum(a, 'v1') : val(m, a, 'v2');
        return [v, v];
      };
      const ke = ([p, r]: [number, number]): number => 0.5 * m1 * p * p + 0.5 * m2 * r * r;
      switch (want) {
        case 'final_velocity': {
          const [u1, u2] = before();
          const p = m1 * u1 + m2 * u2;
          if (cm.together) return measured(p / (m1 + m2));
          const i = argIndex(a, 'cart', 2, 'cart');
          return measured(i === 0 ? (p - m2 * val(m, a, 'v2')) / m1 : (p - m1 * val(m, a, 'v1')) / m2);
        }
        case 'total_momentum': {
          // Before the collision when both of those velocities can be used; otherwise after it (the two are equal).
          let pair: [number, number];
          try { pair = before(); } catch (e) { try { pair = after(); } catch { throw e; } }
          return measured(m1 * pair[0] + m2 * pair[1]);
        }
        case 'ke_before': return measured(ke(before()));
        case 'ke_after': return measured(ke(after()));
        case 'ke_lost': return measured(ke(before()) - ke(after()));
        default: {
          const kb = ke(before());
          const ka = ke(after());
          return label(Math.abs(kb - ka) <= 1e-9 * Math.max(1, kb) ? 'elastic' : 'inelastic');
        }
      }
    },
  },
  circular_value: {
    kinds: ['mechanics_setup'], args: '{ want: acceleration | force | period | angular_speed | speed, radius?, speed?, mass?, force? }',
    returns: `for uniform circular motion, in the figure's own units (nothing is converted): the centripetal acceleration v²/r, the centripetal force m·v²/r, the period 2πr/v, the angular speed v/r, or — from the argument force (the centripetal force), the mass and the radius — the speed √(F·r/m); ${USE_NOTE}`,
    run: (s, a) => {
      const m = variantOf(s, 'circular');
      const want = pick(a, 'want', ['acceleration', 'force', 'period', 'angular_speed', 'speed'] as const);
      const r = positive(val(m, a, 'radius'), 'radius');
      if (want === 'speed') {
        if (a.force === undefined) return fail('derivation argument "force" (the centripetal force the question gives) is needed to find the speed');
        return measured(Math.sqrt((positive(argNum(a, 'force'), 'force') * r) / positive(val(m, a, 'mass'), 'mass')));
      }
      const v = positive(val(m, a, 'speed'), 'speed');
      switch (want) {
        case 'acceleration': return measured((v * v) / r);
        case 'force': return measured((positive(val(m, a, 'mass'), 'mass') * v * v) / r);
        case 'period': return measured((2 * Math.PI * r) / v);
        default: return measured(v / r);
      }
    },
  },
};

export const PART: Batch4Part = {
  kinds: ['mechanics_setup'],
  describe,
  checkers: CHECKERS,
};
