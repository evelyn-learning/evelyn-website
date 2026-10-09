/**
 * pedigree — a family chart in the standard symbols, laid out automatically.
 *
 * { individuals: Array<{                 // 2–20
 *     id: string;                        // unique; used only to name parents
 *     sex: 'M' | 'F' | 'U';              // square · circle · diamond (not known)
 *     father?: id; mother?: id;          // both or neither
 *     affected?: boolean (false);        // filled symbol
 *     carrier?: boolean (false);         // half-filled symbol (only when the chart states it)
 *     unknown?: boolean (false);         // a "?" inside the symbol: status not given —
 *                                        //   the individual the question asks about
 *     label?: string }>;                 // printed under the symbol instead of its number
 *   matings?: Array<[id, id]>;           // couples without children on the chart
 *   legend?: boolean (true);             // "affected" / "carrier" key under the chart
 *   title?: string }
 *
 * Generations are numbered I, II, III … down the left; individuals 1, 2, 3 …
 * from the left within each generation (the usual "II-3"). A married-in
 * partner is placed in the partner's generation. Partners are always side by
 * side, joined by a mating line; a sibship hangs from one bar under it.
 *
 * Limits (a spec outside them is refused or reported): partners must be in
 * the same generation; nobody has more than two partners; at most 10
 * individuals fit across one generation at 340 px (a warning beyond that),
 * and never more than 14.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, text, titleBlock } from './draw';

export interface PedigreeIndividual {
  id: string;
  sex: 'M' | 'F' | 'U';
  father?: string;
  mother?: string;
  affected: boolean;
  carrier: boolean;
  unknown: boolean;
  label?: string;
  /** 0 = generation I. */
  generation: number;
  /** "II-3": generation and position from the left. */
  number: string;
  /** What is printed under the symbol. */
  shown: string;
}

export interface PedigreeModel {
  individuals: PedigreeIndividual[];
  /** Each generation's individuals, left to right. */
  generations: PedigreeIndividual[][];
  /** Every couple on the chart (parents of someone, or listed in `matings`). */
  matings: Array<[string, string]>;
  legend: boolean;
  title?: string;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function pedigreeModel(r: Reader): PedigreeModel {
  const p = r.p;
  const byId = new Map<string, PedigreeIndividual>();
  const individuals = r.list(p.individuals, 'individuals', 2, 20).map((raw, i): PedigreeIndividual => {
    const o = r.obj(raw, `individuals[${i}]`);
    const at = `individuals[${i}]`;
    const id = r.str(o.id, `${at}.id`, 24);
    if (byId.has(id)) r.fail(`individuals: the id "${id}" is used twice`);
    if (o.sex !== 'M' && o.sex !== 'F' && o.sex !== 'U') r.fail(`${at}.sex must be 'M', 'F' or 'U'`);
    const father = r.optStr(o.father, `${at}.father`, 24);
    const mother = r.optStr(o.mother, `${at}.mother`, 24);
    if ((father === undefined) !== (mother === undefined)) r.fail(`${at} ("${id}"): give both parents or neither`);
    const affected = r.bool(o.affected, `${at}.affected`, false);
    const carrier = r.bool(o.carrier, `${at}.carrier`, false);
    const unknown = r.bool(o.unknown, `${at}.unknown`, false);
    if ((affected ? 1 : 0) + (carrier ? 1 : 0) + (unknown ? 1 : 0) > 1) r.fail(`${at} ("${id}"): at most one of affected, carrier, unknown`);
    const ind: PedigreeIndividual = { id, sex: o.sex, father, mother, affected, carrier, unknown, label: r.optStr(o.label, `${at}.label`, 8), generation: -1, number: '', shown: '' };
    byId.set(id, ind);
    return ind;
  });
  const get = (id: string): PedigreeIndividual => byId.get(id) as PedigreeIndividual;
  for (const ind of individuals) {
    if (ind.father === undefined) continue;
    for (const role of ['father', 'mother'] as const) {
      const pid = ind[role] as string;
      if (!byId.has(pid)) r.fail(`individuals: the ${role} "${pid}" is not in the list (named by "${ind.id}")`);
      const want = role === 'father' ? 'M' : 'F';
      if (get(pid).sex !== want) r.fail(`individuals: the ${role} "${pid}" must be ${want === 'M' ? 'male' : 'female'}`);
    }
  }
  // Nobody is their own ancestor.
  const state = new Map<string, number>();
  const visit = (id: string): void => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) r.fail(`individuals: "${id}" would be their own ancestor`);
    state.set(id, 1);
    const ind = get(id);
    if (ind.father) {
      visit(ind.father);
      visit(ind.mother as string);
    }
    state.set(id, 2);
  };
  individuals.forEach((ind) => visit(ind.id));

  // Couples.
  const matings: Array<[string, string]> = [];
  const addMating = (a: string, b: string) => {
    if (!matings.some((m) => (m[0] === a && m[1] === b) || (m[0] === b && m[1] === a))) matings.push([a, b]);
  };
  for (const ind of individuals) if (ind.father) addMating(ind.father, ind.mother as string);
  if (p.matings !== undefined && p.matings !== null) {
    r.list(p.matings, 'matings', 0, 10).forEach((raw, i) => {
      if (!Array.isArray(raw) || raw.length !== 2 || typeof raw[0] !== 'string' || typeof raw[1] !== 'string') r.fail(`matings[${i}] must be [id, id]`);
      const [a, b] = raw as [string, string];
      if (!byId.has(a) || !byId.has(b) || a === b) r.fail(`matings[${i}]: both must be different individuals of the list`);
      addMating(a, b);
    });
  }
  const partners = new Map<string, string[]>();
  for (const [a, b] of matings) {
    partners.set(a, [...(partners.get(a) ?? []), b]);
    partners.set(b, [...(partners.get(b) ?? []), a]);
  }
  for (const [id, list] of partners) if (list.length > 2) r.fail(`individuals: "${id}" has ${list.length} partners — at most two can be drawn side by side`);

  // Generations: one below the parents; a married-in partner joins the partner's generation.
  const gen = new Map<string, number>();
  const depth = (id: string): number => {
    const ind = get(id);
    if (!ind.father) return -1;
    if (gen.has(id)) return gen.get(id) as number;
    const g = Math.max(depthOrFounder(ind.father), depthOrFounder(ind.mother as string)) + 1;
    gen.set(id, g);
    return g;
  };
  const founderGen = new Map<string, number>();
  const depthOrFounder = (id: string): number => (get(id).father ? depth(id) : founderGen.get(id) ?? 0);
  for (let pass = 0; pass < individuals.length + 2; pass++) {
    gen.clear();
    individuals.forEach((ind) => depth(ind.id));
    let changed = false;
    for (const ind of individuals) {
      if (ind.father) continue;
      const mates = partners.get(ind.id) ?? [];
      const want = Math.max(0, ...mates.map((mid) => depthOrFounder(mid)));
      if ((founderGen.get(ind.id) ?? 0) !== want) {
        founderGen.set(ind.id, want);
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const ind of individuals) ind.generation = depthOrFounder(ind.id);
  for (const [a, b] of matings) if (get(a).generation !== get(b).generation) r.fail(`individuals: the partners "${a}" and "${b}" are in different generations — that cannot be drawn on this chart`);
  const nGen = Math.max(...individuals.map((i) => i.generation)) + 1;
  if (nGen > ROMAN.length) r.fail(`individuals: ${nGen} generations — at most ${ROMAN.length}`);

  // Order within each generation: sibships under their parents, partners side by side.
  const inputIndex = new Map(individuals.map((ind, i) => [ind.id, i]));
  const pos = new Map<string, number>();
  const generations: PedigreeIndividual[][] = [];
  for (let g = 0; g < nGen; g++) {
    const members = individuals.filter((ind) => ind.generation === g);
    const key = (ind: PedigreeIndividual): number | null => (ind.father ? ((pos.get(ind.father) as number) + (pos.get(ind.mother as string) as number)) / 2 : null);
    // Mating chains (paths) among this generation.
    const seen = new Set<string>();
    const blocks: Array<{ ids: string[]; key: number; first: number }> = [];
    for (const ind of members) {
      if (seen.has(ind.id)) continue;
      const comp: string[] = [];
      const stack = [ind.id];
      while (stack.length) {
        const id = stack.pop() as string;
        if (seen.has(id)) continue;
        seen.add(id);
        comp.push(id);
        for (const mate of partners.get(id) ?? []) if (!seen.has(mate)) stack.push(mate);
      }
      let chain = comp;
      if (comp.length > 1) {
        const ends = comp.filter((id) => (partners.get(id) ?? []).length === 1);
        if (ends.length !== 2) r.fail(`individuals: the couples around "${ind.id}" form a ring — that cannot be drawn in one row`);
        // Start from the end that belongs furthest left (smallest key; a married-in end goes last).
        const endKey = (id: string) => key(get(id)) ?? Infinity;
        ends.sort((a, b) => endKey(a) - endKey(b) || (inputIndex.get(a) as number) - (inputIndex.get(b) as number));
        chain = [ends[0]];
        while (chain.length < comp.length) {
          const last = chain[chain.length - 1];
          chain.push((partners.get(last) ?? []).find((mate) => !chain.includes(mate)) as string);
        }
      }
      const keys = chain.map((id) => key(get(id))).filter((k): k is number => k !== null);
      blocks.push({ ids: chain, key: keys.length ? keys.reduce((a, b) => a + b, 0) / keys.length : Infinity, first: Math.min(...chain.map((id) => inputIndex.get(id) as number)) });
    }
    blocks.sort((a, b) => (g === 0 ? a.first - b.first : a.key - b.key || a.first - b.first));
    // A born-in member with a married-in partner who is the FIRST of the sibship: the partner
    // goes on the outside (left), so the siblings stay next to one another.
    blocks.forEach((b, i) => {
      if (b.ids.length !== 2 || get(b.ids[1]).father || !get(b.ids[0]).father) return;
      const sibsAfter = blocks[i + 1] && blocks[i + 1].key === b.key;
      const sibsBefore = i > 0 && blocks[i - 1].key === b.key;
      if (sibsAfter && !sibsBefore) b.ids.reverse();
    });
    const row = blocks.flatMap((b) => b.ids).map(get);
    row.forEach((ind, i) => pos.set(ind.id, i));
    generations.push(row);
  }
  generations.forEach((row, g) => row.forEach((ind, i) => {
    ind.number = `${ROMAN[g]}-${i + 1}`;
    ind.shown = ind.label ?? String(i + 1);
  }));
  return { individuals, generations, matings, legend: r.bool(p.legend, 'legend', true), title: r.optStr(p.title, 'title', 160) };
}

export interface PedigreeLayout {
  /** Position from the left within the generation (0-based). */
  order: Record<string, number>;
  /** Horizontal position in slots (1 slot = one symbol and its gap). */
  slot: Record<string, number>;
  /** Slots across the widest part of the chart. */
  width: number;
}

/** Horizontal positions: parents centred over their children, children under
 *  their parents, nobody closer than one slot. Pure arithmetic on the model. */
export function pedigreeLayout(m: PedigreeModel): PedigreeLayout {
  const order: Record<string, number> = {};
  const slot: Record<string, number> = {};
  m.generations.forEach((row) => row.forEach((ind, i) => {
    order[ind.id] = i;
    slot[ind.id] = i;
  }));
  const childrenOf = (a: string, b: string) => m.individuals.filter((c) => (c.father === a && c.mother === b) || (c.father === b && c.mother === a));
  const withKids = m.matings.map(([a, b]) => ({ a, b, kids: childrenOf(a, b) })).filter((c) => c.kids.length > 0);
  const mid = (ids: string[]) => (Math.min(...ids.map((id) => slot[id])) + Math.max(...ids.map((id) => slot[id]))) / 2;
  const spread = (row: PedigreeIndividual[]) => {
    for (let i = 1; i < row.length; i++) slot[row[i].id] = Math.max(slot[row[i].id], slot[row[i - 1].id] + 1);
  };
  for (let pass = 0; pass < 4; pass++) {
    // Bottom-up: a couple moves right until it is centred over its children.
    for (let g = m.generations.length - 2; g >= 0; g--) {
      const row = m.generations[g];
      for (const c of withKids) {
        if (m.generations[g].every((ind) => ind.id !== c.a)) continue;
        const delta = mid(c.kids.map((k) => k.id)) - (slot[c.a] + slot[c.b]) / 2;
        if (delta > 1e-9) {
          const from = Math.min(order[c.a], order[c.b]);
          for (let i = from; i < row.length; i++) slot[row[i].id] += delta;
        }
      }
      spread(row);
    }
    // Top-down: a sibship moves right until it is centred under its parents.
    for (let g = 1; g < m.generations.length; g++) {
      const row = m.generations[g];
      for (const c of withKids) {
        if (row.every((ind) => ind.id !== c.kids[0].id)) continue;
        const delta = (slot[c.a] + slot[c.b]) / 2 - mid(c.kids.map((k) => k.id));
        if (delta > 1e-9) {
          const from = Math.min(...c.kids.map((k) => order[k.id]));
          for (let i = from; i < row.length; i++) slot[row[i].id] += delta;
        }
      }
      spread(row);
    }
  }
  const all = Object.values(slot);
  const lo = Math.min(...all);
  for (const id of Object.keys(slot)) slot[id] = Number((slot[id] - lo).toFixed(4));
  return { order, slot, width: Math.max(...all) - lo + 1 };
}

export function renderPedigree(r: Reader): Drawn {
  const m = pedigreeModel(r);
  const lay = pedigreeLayout(m);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: NonNullable<FigureFacts['notes']> = [];
  if (lay.width > 14) r.fail(`individuals: the chart is ${Math.ceil(lay.width)} symbols wide — at most 14 fit (fewer individuals per generation)`);
  const left = 30;
  const pitch = Math.min(46, (W - left - 8) / lay.width);
  if (pitch < 30) notes.push({ code: 'too_many_elements', message: `the chart is ${Math.ceil(lay.width)} symbols wide — more than 10 across leave symbols under 19 units at 340 px` });
  const size = Math.max(14, Math.min(24, pitch * 0.62));
  const half = size / 2;
  const rowGap = size + 46;
  const used = lay.width * pitch;
  const xOff = left + Math.max(0, (W - left - 8 - used) / 2) + pitch / 2;
  const X = (id: string) => xOff + lay.slot[id] * pitch;
  const Yc = (g: number) => t.top + 6 + half + g * rowGap;
  const byId = new Map(m.individuals.map((i) => [i.id, i]));
  const lines: string[] = [];
  const shapes: string[] = [];
  const labels: string[] = [];
  m.generations.forEach((_, g) => labels.push(text(6, Yc(g) + LABEL_FS * 0.36, ROMAN[g], { fs: LABEL_FS, weight: 700, fill: MUTED })));
  for (const [a, b] of m.matings) {
    const ia = byId.get(a) as PedigreeIndividual;
    const y = Yc(ia.generation);
    const [xl, xr] = X(a) < X(b) ? [X(a), X(b)] : [X(b), X(a)];
    const between = m.generations[ia.generation].some((o) => X(o.id) > xl + 1 && X(o.id) < xr - 1);
    if (between) r.fail(`individuals: the partners "${a}" and "${b}" cannot be placed side by side on this chart`);
    lines.push(`M${n2(xl + half)},${n2(y)}H${n2(xr - half)}`);
    const kids = m.individuals.filter((c) => (c.father === a && c.mother === b) || (c.father === b && c.mother === a));
    if (kids.length === 0) continue;
    const mx = (xl + xr) / 2;
    const ky = Yc(kids[0].generation);
    const bar = ky - half - 13;
    const xs = kids.map((k) => X(k.id));
    lines.push(`M${n2(mx)},${n2(y)}V${n2(bar)}`);
    lines.push(`M${n2(Math.min(mx, ...xs))},${n2(bar)}H${n2(Math.max(mx, ...xs))}`);
    for (const x of xs) lines.push(`M${n2(x)},${n2(bar)}V${n2(ky - half)}`);
  }
  const symbol = (ind: PedigreeIndividual, cx: number, cy: number, s: number): string => {
    const h = s / 2;
    const fill = ind.affected ? INK : '#ffffff';
    const stroke = `stroke="${INK}" stroke-width="1.8"`;
    let out: string;
    if (ind.sex === 'M') {
      out = `<rect x="${n2(cx - h)}" y="${n2(cy - h)}" width="${n2(s)}" height="${n2(s)}" fill="${fill}" ${stroke}/>`;
      if (ind.carrier) out += `<rect x="${n2(cx - h)}" y="${n2(cy - h)}" width="${n2(h)}" height="${n2(s)}" fill="${INK}"/>`;
    } else if (ind.sex === 'F') {
      out = `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(h)}" fill="${fill}" ${stroke}/>`;
      if (ind.carrier) out += `<path d="M${n2(cx)},${n2(cy - h)}A${n2(h)},${n2(h)} 0 0 0 ${n2(cx)},${n2(cy + h)}z" fill="${INK}"/>`;
    } else {
      const d = h * 1.15;
      out = `<polygon points="${n2(cx)},${n2(cy - d)} ${n2(cx + d)},${n2(cy)} ${n2(cx)},${n2(cy + d)} ${n2(cx - d)},${n2(cy)}" fill="${fill}" ${stroke} stroke-linejoin="round"/>`;
      if (ind.carrier) out += `<polygon points="${n2(cx)},${n2(cy - d)} ${n2(cx)},${n2(cy + d)} ${n2(cx - d)},${n2(cy)}" fill="${INK}"/>`;
    }
    if (ind.unknown) out += text(cx, cy + 4.3, '?', { fs: 12, anchor: 'middle', weight: 700 });
    return out;
  };
  for (const ind of m.individuals) {
    const cx = X(ind.id);
    const cy = Yc(ind.generation);
    shapes.push(symbol(ind, cx, cy, size));
    labels.push(text(cx, cy + half + TICK_FS + 2, ind.shown, { anchor: 'middle', fill: INK }));
  }
  let H = Yc(m.generations.length - 1) + half + TICK_FS + 12;
  if (m.legend) {
    const entries: Array<[PedigreeIndividual, string]> = [];
    const proto = (o: Partial<PedigreeIndividual>): PedigreeIndividual => ({ id: '', sex: 'M', affected: false, carrier: false, unknown: false, generation: 0, number: '', shown: '', ...o });
    entries.push([proto({ sex: 'M' }), 'male'], [proto({ sex: 'F' }), 'female'], [proto({ sex: 'M', affected: true }), 'affected']);
    if (m.individuals.some((i) => i.carrier)) entries.push([proto({ sex: 'F', carrier: true }), 'carrier']);
    if (m.individuals.some((i) => i.unknown)) entries.push([proto({ sex: 'M', unknown: true }), 'not known']);
    let x = 12;
    let y = H + 4;
    shapes.push(`<line x1="8" y1="${n2(H - 2)}" x2="${n2(W - 8)}" y2="${n2(H - 2)}" stroke="#cbd5e1" stroke-width="1"/>`);
    for (const [ind, label] of entries) {
      const w = 14 + 5 + label.length * TICK_FS * 0.58 + 12;
      if (x > 12 && x + w > W - 6) {
        x = 12;
        y += 20;
      }
      shapes.push(symbol(ind, x + 7, y + 8, 13));
      labels.push(text(x + 19, y + 12, label, { fill: INK }));
      x += w;
    }
    H = y + 24;
  }
  return { body: t.svg + `<path d="${lines.join('')}" fill="none" stroke="${INK}" stroke-width="1.4"/>` + shapes.join('') + labels.join(''), H, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
