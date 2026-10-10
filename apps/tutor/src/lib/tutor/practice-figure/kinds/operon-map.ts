/**
 * operon_map — batch 5 (2026-10-16): a bacterial operon as a strip of boxes
 * along a DNA line — regulator gene, (CAP site), promoter, operator, the
 * structural genes — with the proteins of ONE state drawn where they sit: the
 * repressor on the operator or off it, the small molecule that switches it
 * on its back, CAP on its site, RNA polymerase on the promoter, and the
 * transcription arrow over the genes (running, weak, or stopped).
 *
 * The STATE IS COMPUTED from the conditions, never given:
 *
 *   { system: 'lac' | 'trp';
 *     lactose?: boolean (false); glucose?: boolean (false);   // lac: the sugars in the medium
 *     tryptophan?: boolean (false);                           // trp
 *     capSite?: boolean (false);          // lac: draw the CAP site, and CAP on it when glucose is absent
 *     genes?: string[];                   // 1–6 names (≤ 6 characters); lacZ lacY lacA / trpE trpD trpC trpB trpA
 *     mutation?: 'regulator' | 'operator' | 'promoter';   // that element has lost its function: marked ✕ under its box
 *                                         //   (no repressor is made / the repressor cannot bind / nothing is transcribed)
 *     showRepressor?: boolean (true);     // false ⇒ no repressor and no small molecule (its place is asked)
 *     transcription?: 'value' | 'blank' | 'none' ('value');  // the arrow over the genes; 'blank' = a "?" box in its place
 *     showPolymerase?: boolean (true);    // drawn only with transcription: 'value', and only when there is transcription
 *     showConditions?: boolean (false);   // "lactose present, glucose absent" printed over the figure
 *     labels?: { regulator?, capSite?, promoter?, operator?: string;   // the text in a DNA box ("1", "X", "?")
 *                genes?: string[];                                     //   (same count as genes)
 *                repressor?, polymerase?, cap?: string;                // the tag on a protein ("R", "RNAP", "CAP");
 *                                                                      //   a tag you give has no key entry
 *                effector?: string | null };                           // the key text of ▲ ("?" asks; null = no key)
 *     title?: string }
 *
 * Proteins are told apart by SHAPE and by a tag (pill "R", ellipse "RNAP",
 * circle "CAP", filled triangle for allolactose / tryptophan), explained in a
 * key under the strip.
 */
import { FIGURE_WIDTH, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, arrow, blank, text, titleBlock } from './draw';
import { SHOWS, ellipseD, facts, lab, seg, stroke, type Notes, type Show } from './draw2';

export type OperonLevel = 'off' | 'low' | 'high' | 'on';
export type OperonElement = 'regulator' | 'capSite' | 'promoter' | 'operator';
export interface OperonModel {
  system: 'lac' | 'trp';
  lactose: boolean;
  glucose: boolean;
  tryptophan: boolean;
  capSite: boolean;
  /** True names of the structural genes, and what each box prints. */
  genes: string[];
  mutation?: 'regulator' | 'operator' | 'promoter';
  labels: { regulator: string; capSite: string; promoter: string; operator: string; genes: string[]; repressor: string; polymerase: string; cap: string; effector: string | null };
  /** Which protein tags are the defaults (they get a key entry). */
  defaultTags: { repressor: boolean; polymerase: boolean; cap: boolean };
  state: {
    /** A working repressor protein exists. */
    repressorMade: boolean;
    repressorBound: boolean;
    /** Allolactose (lac) / tryptophan (trp) is on the repressor. */
    effectorBound: boolean;
    capBound: boolean;
    level: OperonLevel;
  };
  showRepressor: boolean;
  transcription: Show;
  showPolymerase: boolean;
  showConditions: boolean;
  title?: string;
}

const DEFAULT_GENES = { lac: ['lacZ', 'lacY', 'lacA'], trp: ['trpE', 'trpD', 'trpC', 'trpB', 'trpA'] } as const;
export const EFFECTOR_NAME = { lac: 'allolactose', trp: 'tryptophan' } as const;
export const LEVEL_TEXT: Record<OperonLevel, string> = { off: 'no transcription', low: 'low transcription', high: 'transcription', on: 'transcription' };

export function operonConditions(m: Pick<OperonModel, 'system' | 'lactose' | 'glucose' | 'tryptophan'>): string {
  return m.system === 'lac' ? `lactose ${m.lactose ? 'present' : 'absent'}, glucose ${m.glucose ? 'present' : 'absent'}` : `tryptophan ${m.tryptophan ? 'present' : 'absent'}`;
}

export function operonModel(r: Reader): OperonModel {
  const p = r.p;
  if (p.system !== 'lac' && p.system !== 'trp') r.fail('system must be "lac" or "trp"');
  const system = p.system as 'lac' | 'trp';
  const other = system === 'lac' ? ['tryptophan'] : ['lactose', 'glucose', 'capSite'];
  for (const k of other) if (p[k] !== undefined && p[k] !== null) r.fail(`${k} does not apply to the ${system} operon`);
  const lactose = r.bool(p.lactose, 'lactose', false);
  const glucose = r.bool(p.glucose, 'glucose', false);
  const tryptophan = r.bool(p.tryptophan, 'tryptophan', false);
  const capSite = r.bool(p.capSite, 'capSite', false);
  const genes = p.genes === undefined || p.genes === null ? [...DEFAULT_GENES[system]] : r.list(p.genes, 'genes', 1, 6).map((g, i) => r.str(g, `genes[${i}]`, 6));
  if (capSite && genes.length > 4) r.fail('genes: at most 4 fit beside a CAP site');
  let mutation: OperonModel['mutation'];
  if (p.mutation !== undefined && p.mutation !== null) {
    if (p.mutation !== 'regulator' && p.mutation !== 'operator' && p.mutation !== 'promoter') r.fail('mutation must be one of regulator, operator, promoter');
    mutation = p.mutation as OperonModel['mutation'];
  }
  const l = p.labels === undefined || p.labels === null ? {} : r.obj(p.labels, 'labels');
  for (const k of Object.keys(l)) if (!['regulator', 'capSite', 'promoter', 'operator', 'genes', 'repressor', 'polymerase', 'cap', 'effector'].includes(k)) r.fail(`labels.${k} is not a label of the figure`);
  if (l.capSite !== undefined && !capSite) r.fail('labels.capSite: the CAP site is not drawn — set capSite: true');
  let geneLabels = genes;
  if (l.genes !== undefined && l.genes !== null) {
    const g = r.list(l.genes, 'labels.genes', genes.length, genes.length);
    geneLabels = g.map((s, i) => r.str(s, `labels.genes[${i}]`, 6));
  }
  const labels = {
    regulator: r.optStr(l.regulator, 'labels.regulator', 6) ?? (system === 'lac' ? 'lacI' : 'trpR'),
    capSite: r.optStr(l.capSite, 'labels.capSite', 8) ?? 'CAP site',
    promoter: r.optStr(l.promoter, 'labels.promoter', 4) ?? 'P',
    operator: r.optStr(l.operator, 'labels.operator', 4) ?? 'O',
    genes: geneLabels,
    repressor: r.optStr(l.repressor, 'labels.repressor', 3) ?? 'R',
    polymerase: r.optStr(l.polymerase, 'labels.polymerase', 4) ?? 'RNAP',
    cap: r.optStr(l.cap, 'labels.cap', 3) ?? 'CAP',
    effector: l.effector === null ? null : r.optStr(l.effector, 'labels.effector', 16) ?? EFFECTOR_NAME[system],
  };
  const boxes = [labels.regulator, ...(capSite ? [labels.capSite] : []), labels.promoter, labels.operator, ...labels.genes].filter((s) => s !== '?');
  if (new Set(boxes).size !== boxes.length) r.fail('labels: two boxes of the strip carry the same text');
  const transcription = ((): Show => {
    const v = p.transcription;
    if (v === undefined || v === null) return 'value';
    if (typeof v !== 'string' || !SHOWS.includes(v as Show)) r.fail(`transcription must be one of ${SHOWS.join(', ')}`);
    return v as Show;
  })();
  // The state, from the conditions.
  const repressorMade = mutation !== 'regulator';
  const effector = system === 'lac' ? lactose : tryptophan;
  // lac: the repressor binds unless allolactose is on it. trp: it binds only with tryptophan on it.
  const active = repressorMade && (system === 'lac' ? !lactose : tryptophan);
  const repressorBound = active && mutation !== 'operator';
  const capBound = system === 'lac' && !glucose;
  const level: OperonLevel = mutation === 'promoter' || repressorBound ? 'off' : system === 'trp' ? 'on' : capBound ? 'high' : 'low';
  return {
    system, lactose, glucose, tryptophan, capSite, genes, mutation, labels,
    defaultTags: { repressor: l.repressor === undefined || l.repressor === null, polymerase: l.polymerase === undefined || l.polymerase === null, cap: l.cap === undefined || l.cap === null },
    state: { repressorMade, repressorBound, effectorBound: repressorMade && effector, capBound, level },
    showRepressor: r.bool(p.showRepressor, 'showRepressor', true), transcription,
    showPolymerase: r.bool(p.showPolymerase, 'showPolymerase', true), showConditions: r.bool(p.showConditions, 'showConditions', false),
    title: r.optStr(p.title, 'title', 160),
  };
}

/** What the picture shows of the state (after the hide options). */
export function operonDrawn(m: OperonModel): { repressor: boolean; effector: boolean; cap: boolean; polymerase: boolean } {
  const repressor = m.showRepressor && m.state.repressorMade;
  return {
    repressor, effector: repressor && m.state.effectorBound, cap: m.capSite && m.state.capBound,
    polymerase: m.showPolymerase && m.transcription === 'value' && m.state.level !== 'off',
  };
}

const BH = 24;
const FILL = '#eef2f6';
const PROT = '#e5e7eb';

export function renderOperonMap(r: Reader, _uid?: string): Drawn {
  const m = operonModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const d = operonDrawn(m);
  const parts: string[] = [];
  const over: string[] = [];
  let y0 = t.top;
  if (m.showConditions) {
    parts.push(text(W / 2, y0 + 12, operonConditions(m), { fs: TICK_FS + 1, anchor: 'middle' }));
    y0 += 20;
  }
  const floating = d.repressor && !m.state.repressorBound;
  const topRoom = floating ? 74 : d.repressor && d.effector ? 44 : d.cap ? 36 : 30;
  const top = y0 + topRoom;       // the top edge of the boxes
  const dnaY = top + BH / 2;

  // The strip, left to right.
  const X0 = 16;
  const REG_W = 46;
  const BREAK = 26;
  const CAP_W = 58;
  const P_W = 38;
  const O_W = 32;
  const X_END = 342;
  const xReg = X0 + 4;
  const xCtl = xReg + REG_W + BREAK;
  const xP = xCtl + (m.capSite ? CAP_W : 0);
  const xO = xP + P_W;
  const xG = xO + O_W;
  const gw = (X_END - xG) / m.genes.length;
  const breakX = xReg + REG_W + BREAK / 2;
  parts.push(seg(X0, dnaY, breakX - 5, dnaY, INK, 2.2), seg(breakX + 5, dnaY, X_END + 6, dnaY, INK, 2.2));
  parts.push(seg(breakX - 7, dnaY + 7, breakX - 1, dnaY - 7, INK, 1.4), seg(breakX + 1, dnaY + 7, breakX + 7, dnaY - 7, INK, 1.4));
  const box = (x: number, w: number, s: string, o: { fill: string; italic?: boolean; what: string }): void => {
    parts.push(`<rect x="${n2(x)}" y="${n2(top)}" width="${n2(w)}" height="${BH}" fill="${o.fill}" stroke="${INK}" stroke-width="1.5"/>`);
    if (s === '?') parts.push(blank(x + w / 2, dnaY, 19, 16, TICK_FS));
    else {
      if (estWidth(s, TICK_FS) > w - 4) notes.push({ code: 'crowded', message: `${o.what} ("${s}") does not fit its box (${Math.round(w)} units wide) — shorten it` });
      parts.push(text(x + w / 2, dnaY + TICK_FS * 0.36, s, { fs: TICK_FS, anchor: 'middle', italic: o.italic, weight: o.italic ? undefined : 600 }));
    }
  };
  const isGeneName = (s: string): boolean => /^[a-z]{3}[A-Z]?$/.test(s);
  box(xReg, REG_W, m.labels.regulator, { fill: '#ffffff', italic: isGeneName(m.labels.regulator), what: 'labels.regulator' });
  if (m.capSite) box(xCtl, CAP_W, m.labels.capSite, { fill: FILL, what: 'labels.capSite' });
  box(xP, P_W, m.labels.promoter, { fill: FILL, what: 'labels.promoter' });
  box(xO, O_W, m.labels.operator, { fill: FILL, what: 'labels.operator' });
  m.labels.genes.forEach((g, i) => box(xG + i * gw, gw, g, { fill: '#ffffff', italic: isGeneName(g), what: `labels.genes[${i}]` }));

  const cross = (cx: number, cy: number, h: number, w = 2): string => `<path d="M${n2(cx - h)},${n2(cy - h)}L${n2(cx + h)},${n2(cy + h)}M${n2(cx - h)},${n2(cy + h)}L${n2(cx + h)},${n2(cy - h)}" ${stroke(INK, w)}/>`;
  const tri = (cx: number, cy: number, s = 6): string => `<polygon points="${n2(cx)},${n2(cy - s)} ${n2(cx + s)},${n2(cy + s * 0.75)} ${n2(cx - s)},${n2(cy + s * 0.75)}" fill="${INK}"/>`;
  /** A protein's tag: bold text, or the dashed blank box for "?". */
  const tag = (cx: number, cy: number, s: string): string => (s === '?' ? blank(cx, cy, 19, 15, TICK_FS) : text(cx, cy + TICK_FS * 0.36, s, { fs: TICK_FS, anchor: 'middle', weight: 700 }));

  let anyMutation = false;
  if (m.mutation) {
    const [mx, mw] = m.mutation === 'regulator' ? [xReg, REG_W] : m.mutation === 'promoter' ? [xP, P_W] : [xO, O_W];
    parts.push(cross(mx + mw / 2, top + BH + 9, 5, 2.4));
    anyMutation = true;
  }

  // Proteins.
  const oCx = xO + O_W / 2;
  if (d.repressor) {
    const cy = m.state.repressorBound ? top - 10.5 : top - 48;
    over.push(`<rect x="${n2(oCx - 16)}" y="${n2(cy - 10)}" width="32" height="20" rx="7" fill="${PROT}" stroke="${INK}" stroke-width="1.5"/>`, tag(oCx, cy, m.labels.repressor));
    if (d.effector) over.push(tri(oCx, cy - 15.5));
  }
  if (d.cap) over.push(`<circle cx="${n2(xCtl + CAP_W / 2)}" cy="${n2(top - 15.5)}" r="15" fill="${PROT}" stroke="${INK}" stroke-width="1.5"/>`, tag(xCtl + CAP_W / 2, top - 15.5, m.labels.cap));
  if (d.polymerase) over.push(`<path d="${ellipseD(xP + P_W / 2, top - 10.5, 21, 10)}" fill="${PROT}" stroke="${INK}" stroke-width="1.5"/>`, tag(xP + P_W / 2, top - 10.5, m.labels.polymerase));

  // Transcription over the genes.
  const yA = top - 15;
  const ax = xG + 6;
  if (m.transcription === 'value') {
    const lv = m.state.level;
    if (lv === 'off') {
      over.push(`<path d="M${n2(ax)},${n2(top)}V${n2(yA)}H${n2(ax + 14)}" ${stroke(INK, 1.8)}/>`, cross(ax + 21, yA, 4.5, 2));
      over.push(text(ax + 32, yA + TICK_FS * 0.36, LEVEL_TEXT[lv], { fs: TICK_FS }));
    } else {
      over.push(seg(ax, top, ax, yA, INK, lv === 'low' ? 1.4 : 2.2));
      over.push(arrow(ax, yA, X_END - 2, yA, { color: INK, width: lv === 'low' ? 1.4 : 2.2, dash: lv === 'low' ? '5 4' : undefined, head: 9 }));
      over.push(text((ax + X_END) / 2, yA - 7, LEVEL_TEXT[lv], { fs: TICK_FS, anchor: 'middle' }));
    }
  } else if (m.transcription === 'blank') {
    over.push(`<path d="M${n2(ax)},${n2(top)}V${n2(yA)}H${n2(ax + 14)}" ${stroke(INK, 1.8)}/>`, lab(ax + 20, yA + TICK_FS * 0.36, '?', 'start', { fs: TICK_FS }));
    if (!m.showRepressor && !m.showConditions) notes.push({ code: 'ambiguous_blank', message: 'transcription is asked for ("?") but neither the repressor nor the conditions are shown — nothing on the figure decides it' });
  }

  // Key under the strip: one entry per protein tag left at its default, the small molecule, the mutation mark.
  let H = top + BH + (anyMutation ? 20 : 8);
  const entries: Array<{ mark?: 'tri' | 'cross'; s: string }> = [];
  if (d.repressor && m.defaultTags.repressor) entries.push({ s: 'R = repressor' });
  if (d.polymerase && m.defaultTags.polymerase) entries.push({ s: 'RNAP = RNA polymerase' });
  if (d.cap && m.defaultTags.cap) entries.push({ s: 'CAP = activator protein' });
  if (d.effector && m.labels.effector !== null) entries.push({ mark: 'tri', s: `= ${m.labels.effector}` });
  if (anyMutation) entries.push({ mark: 'cross', s: '= mutation (function lost)' });
  if (entries.length) {
    let x = X0;
    let y = H + 14;
    for (const e of entries) {
      const blankEff = e.mark === 'tri' && m.labels.effector === '?';
      const w = (e.mark ? 15 : 0) + (blankEff ? estWidth('= ', TICK_FS) + 22 : estWidth(e.s, TICK_FS));
      if (x > X0 && x + w > W - 12) {
        x = X0;
        y += 17;
      }
      let tx = x;
      if (e.mark === 'tri') { parts.push(tri(x + 6, y - 4, 5)); tx += 15; }
      if (e.mark === 'cross') { parts.push(cross(x + 6, y - 4, 4, 2)); tx += 15; }
      if (blankEff) parts.push(text(tx, y, '=', {}), lab(tx + estWidth('= ', TICK_FS) + 1, y, '?', 'start', {}));
      else parts.push(text(tx, y, e.s, {}));
      x += w + 16;
    }
    H = y + 8;
  }
  return { body: t.svg + parts.join('') + over.join(''), H: H + 2, facts: facts(notes) };
}
