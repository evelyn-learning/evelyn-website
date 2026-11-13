/**
 * Pure geometry for the historical_timeline renderer — the single source of
 * truth shared by CatalogHistoricalTimelineRenderer (drawing) and
 * solveHistoricalTimeline (collision-driven evenSpace decision). Exercised
 * by scripts/test-timeline-layout.ts.
 *
 * Why it exists (2026-08-17 triage, portal-35b9a5d8): proportional-by-year
 * placement squeezes dense spans — 5 events across 1781-1788, two sharing a
 * year — into overlapping 156px boxes. The layout is deterministic, so the
 * brain re-rendering the same events could never fix it, and evenSpace was
 * only set for unparseable dates. shouldEvenSpaceTimeline runs the actual
 * box geometry and flips to even spacing whenever proportional placement
 * collides.
 */

export interface TimelineLayoutBox {
  /** Dot position on the axis. */
  x: number;
  /** Left edge of the label box (already clamped into the viewBox). */
  boxX: number;
  /** Vertical center of the label box (already clamped). */
  labelY: number;
}

export const TIMELINE_GEOM = {
  W: 760,
  H: 320,
  PAD: 40,
  BOX_W: 156,
  BOX_H: 52,
  BASE_Y: 200,
  ALT_OFFSETS: [-100, 70, -70, 100, -80, 80],
} as const;

/** Mirrors the renderer's placement exactly, degenerate cases included:
 *  a single event or a zero-year span always falls back to even spacing. */
export function layoutTimelineEvents(
  events: Array<{ year: number }>,
  evenSpace: boolean,
): TimelineLayoutBox[] {
  const { W, H, PAD, BOX_W, BOX_H, BASE_Y, ALT_OFFSETS } = TIMELINE_GEOM;
  const usableW = W - PAD * 2;
  const years = events.map((e) => e.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const span = maxY - minY || 1;
  const even = evenSpace || maxY <= minY || events.length === 1;
  return events.map((e, i) => {
    const x = even
      ? PAD + (events.length === 1 ? usableW / 2 : (i / (events.length - 1)) * usableW)
      : PAD + ((e.year - minY) / span) * usableW;
    const labelYRaw = BASE_Y + ALT_OFFSETS[i % ALT_OFFSETS.length];
    const labelY = Math.max(BOX_H / 2 + 4, Math.min(H - BOX_H / 2 - 4, labelYRaw));
    const boxX = Math.max(4, Math.min(W - BOX_W - 4, x - BOX_W / 2));
    return { x, boxX, labelY };
  });
}

/** True when any two label boxes strictly overlap under the given spacing
 *  mode. Touching edges do not count — only real overlap. */
export function timelineHasCollisions(
  events: Array<{ year: number }>,
  evenSpace: boolean,
): boolean {
  const { BOX_W, BOX_H } = TIMELINE_GEOM;
  const boxes = layoutTimelineEvents(events, evenSpace);
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const xOverlap = a.boxX < b.boxX + BOX_W && b.boxX < a.boxX + BOX_W;
      const yOverlap = a.labelY - BOX_H / 2 < b.labelY + BOX_H / 2 && b.labelY - BOX_H / 2 < a.labelY + BOX_H / 2;
      if (xOverlap && yOverlap) return true;
    }
  }
  return false;
}

/** The solver's rule: flip to even spacing when proportional placement
 *  collides. Even spacing is never worse — same boxes, maximal separation
 *  — so a still-colliding even layout (very high event counts) keeps the
 *  flag too. */
export function shouldEvenSpaceTimeline(events: Array<{ year: number }>): boolean {
  return timelineHasCollisions(events, false);
}

// ═══════════════════════════════════════════════════════════════════
// Card layout (2026-11-13 figure audit). The functions above are kept for the
// solver's legacy `evenSpace` flag; what is DRAWN comes from here, for both
// the catalogue `historical_timeline` and the plain `show_timeline` tool.
//
// The old drawing put every label at one of six fixed heights: eleven events
// printed their cards on top of each other, leaders ran slanted through the
// text, and long titles were cut with "…". Here each event gets a card sized
// to its wrapped text, cards sit in lanes above and below the axis, and a
// card moves one lane out instead of touching a neighbour or a leader.
// ═══════════════════════════════════════════════════════════════════

/** Rough advance width of a string in the board's sans face. Slightly generous, so text never spills. */
export function estTextWidth(text: string, fontSize: number, bold = false): number {
  let em = 0;
  for (const ch of text) {
    if (/[iljI.,;:'!|]/.test(ch)) em += 0.29;
    else if (/[ftr()\[\]\- ]/.test(ch)) em += 0.37;
    else if (/[mwMW@%]/.test(ch)) em += 0.88;
    else if (/[A-Z]/.test(ch)) em += 0.68;
    else if (/[0-9]/.test(ch)) em += 0.62;
    else if (/[—–]/.test(ch)) em += 0.8;
    else em += 0.56;
  }
  return em * fontSize * (bold ? 1.06 : 1);
}

/** Word-wrap to a pixel width. Nothing is cut unless `maxLines` is exceeded (then the last line ends in "…");
 *  a single word wider than the line is left whole rather than split. */
export function wrapTextToWidth(text: string, maxWidth: number, fontSize: number, maxLines = 99, bold = false): string[] {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && estTextWidth(next, fontSize, bold) > maxWidth) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = `${kept[maxLines - 1]} ${lines.slice(maxLines).join(' ')}`;
  while (last.length > 1 && estTextWidth(`${last}…`, fontSize, bold) > maxWidth) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.replace(/[\s,;:.]+$/, '')}…`;
  return kept;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** A date string as a (fractional) year: "500 BCE" → −500, "44 BC" → −44, "AD 79" → 79, "July 14, 1789" → 1789.54.
 *  null when no year can be read ("Today", "Paleozoic Era"). */
export function parseTimelineYear(date: string): number | null {
  const s = String(date ?? '').replace(/−/g, '-').trim();
  const bce = s.match(/(\d[\d,]*)\s*(?:BCE|BC|B\.C\.E\.|B\.C\.)(?![a-z])/i);
  if (bce) return -Math.abs(parseInt(bce[1].replace(/,/g, ''), 10));
  const neg = s.match(/^-\s*(\d+)/);
  if (neg) return -parseInt(neg[1], 10);
  const ce = s.match(/(\d{1,4})\s*(?:CE|AD|C\.E\.|A\.D\.)(?![a-z])/i) ?? s.match(/(?:AD|A\.D\.)\s*(\d{1,4})\b/i);
  const plain = s.match(/(?<![\d.])(\d{3,4})(?!\d)/);
  const year = ce ? parseInt(ce[1], 10) : plain ? parseInt(plain[1], 10) : null;
  if (year === null) return null;
  // A named month (and day) orders events within one year.
  const mon = s.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\b/);
  if (!mon) return year;
  const m = MONTHS.indexOf(mon[1]);
  const dayM = s.match(/(?<!\d)(\d{1,2})(?:st|nd|rd|th)?(?!\d)/);
  const day = dayM ? Math.min(31, Math.max(1, parseInt(dayM[1], 10))) : 1;
  return year + (m + (day - 1) / 31) / 12;
}

/** Round tick years for an axis from `min` to `max` (no year 0). */
export function timelineTicks(min: number, max: number, maxTicks = 7): number[] {
  const span = max - min;
  if (!(span >= 3)) return [];
  const raw = span / maxTicks;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? 10 * pow);
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) if (Math.round(t) !== 0) out.push(Math.round(t));
  return out;
}

/** Axis label of a year; the era is written only on a timeline that crosses it. */
export function formatTimelineYear(year: number, crossesEra: boolean): string {
  if (year < 0) return `${-year} BCE`;
  return crossesEra ? `${year} CE` : String(year);
}

export interface TimelineCardInput { date: string; title: string; description?: string; year: number | null }
export interface TimelineCard {
  /** Index into the input array. */
  index: number;
  /** Dot position on the axis. */
  x: number;
  side: 'above' | 'below';
  lane: number;
  boxX: number;
  boxW: number;
  boxH: number;
  /** Distance from the axis to the near edge of the card. */
  near: number;
  dateLines: string[];
  titleLines: string[];
  descLines: string[];
}
export interface TimelineCardLayout {
  cards: TimelineCard[];
  /** Height needed above / below the axis (leaders + lanes). */
  topHeight: number;
  bottomHeight: number;
  /** True when dots are placed by year; false when evenly, in order. */
  proportional: boolean;
  /** Round tick marks (proportional layouts spanning 3+ years). */
  ticks: Array<{ x: number; year: number }>;
  crossesEra: boolean;
}

export const TIMELINE_CARD = {
  W: 152, PAD_X: 9, PAD_Y: 7, DATE_FS: 11.5, TITLE_FS: 12, DESC_FS: 10.5, DATE_LH: 15, TITLE_LH: 15, DESC_LH: 13.5,
  STEM: 26, LANE_GAP: 10, GAP_X: 8, LEADER_CLEAR: 7, MIN_DOT_GAP: 16,
} as const;

function cardText(e: TimelineCardInput, cardW: number) {
  const C = TIMELINE_CARD;
  const inner = cardW - C.PAD_X * 2;
  const dateLines = wrapTextToWidth(e.date, inner, C.DATE_FS, 2, true);
  const titleLines = wrapTextToWidth(e.title, inner, C.TITLE_FS, 4);
  const descLines = e.description ? wrapTextToWidth(e.description, inner, C.DESC_FS, 4) : [];
  const h = C.PAD_Y * 2 + dateLines.length * C.DATE_LH + titleLines.length * C.TITLE_LH + (descLines.length ? 3 + descLines.length * C.DESC_LH : 0);
  return { dateLines, titleLines, descLines, h };
}

function packLanes(xs: number[], texts: Array<{ h: number }>, cardW: number, left: number, right: number) {
  // Two ways of packing, the better one kept. Sliding a card sideways under its dot fits clustered dots into
  // fewer lanes; with evenly spaced dots it closes the corridors the outer lanes' leaders need, and centred
  // cards alternating between two lanes are tidier.
  const centred = packLanesWith(xs, texts, cardW, left, right, false);
  const slid = packLanesWith(xs, texts, cardW, left, right, true);
  return slid.maxLane < centred.maxLane ? slid : centred;
}

function packLanesWith(xs: number[], texts: Array<{ h: number }>, cardW: number, left: number, right: number, allowSlide: boolean) {
  const C = TIMELINE_CARD;
  type Placed = { i: number; x: number; boxX: number; lane: number; side: 'above' | 'below' };
  const placed: Placed[] = [];
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x || a.i - b.i);
  const half = cardW / 2;
  const slide = half - 16;
  const offsets = allowSlide ? [0, -slide * 0.5, slide * 0.5, -slide, slide] : [0];
  let lastSide: 'above' | 'below' = 'below';
  const fit = (side: 'above' | 'below', x: number): { lane: number; boxX: number } => {
    const mine = placed.filter((p) => p.side === side);
    for (let lane = 0; lane < 12; lane++) {
      // The leader of a card in this lane passes every nearer lane: it must miss their cards.
      if (mine.some((p) => p.lane < lane && x > p.boxX - C.LEADER_CLEAR && x < p.boxX + cardW + C.LEADER_CLEAR)) continue;
      for (const off of offsets) {
        const boxX = Math.max(left, Math.min(right - cardW, x - half + off));
        if (x < boxX + 10 || x > boxX + cardW - 10) continue;
        const hitsCard = mine.some((p) => p.lane === lane && boxX < p.boxX + cardW + C.GAP_X && p.boxX < boxX + cardW + C.GAP_X);
        const hitsLeader = mine.some((p) => p.lane > lane && p.x > boxX - C.LEADER_CLEAR && p.x < boxX + cardW + C.LEADER_CLEAR);
        if (!hitsCard && !hitsLeader) return { lane, boxX };
      }
    }
    // Nothing fits cleanly (far more events than the width can hold): one lane beyond the outermost.
    return { lane: Math.max(-1, ...mine.map((p) => p.lane)) + 1, boxX: Math.max(left, Math.min(right - cardW, x - half)) };
  };
  for (const { x, i } of order) {
    const first: 'above' | 'below' = lastSide === 'above' ? 'below' : 'above';
    const second: 'above' | 'below' = first === 'above' ? 'below' : 'above';
    const a = fit(first, x);
    const b = fit(second, x);
    const side: 'above' | 'below' = b.lane < a.lane ? second : first;
    const got = side === first ? a : b;
    placed.push({ i, x, boxX: got.boxX, lane: got.lane, side });
    lastSide = side;
  }
  const laneH = { above: [] as number[], below: [] as number[] };
  for (const p of placed) laneH[p.side][p.lane] = Math.max(laneH[p.side][p.lane] ?? 0, texts[p.i].h);
  const nearOf = (side: 'above' | 'below', lane: number) => {
    let d: number = C.STEM;
    for (let k = 0; k < lane; k++) d += (laneH[side][k] ?? 0) + C.LANE_GAP;
    return d;
  };
  const total = (side: 'above' | 'below') => (laneH[side].length ? nearOf(side, laneH[side].length - 1) + (laneH[side][laneH[side].length - 1] ?? 0) : 0);
  return { placed, nearOf, topHeight: total('above'), bottomHeight: total('below'), maxLane: Math.max(-1, ...placed.map((p) => p.lane)) };
}

/**
 * Cards for a horizontal timeline between x = `left` and x = `right`.
 * Dots are placed by year when every event has one and the dots stay apart and the cards fit in three lanes a
 * side; otherwise the events are spaced evenly in chronological (or, without years, given) order, and the dates
 * on the cards carry the time.
 */
export function layoutTimelineCards(
  events: TimelineCardInput[],
  opts: { left: number; right: number; forceEven?: boolean; cardW?: number },
): TimelineCardLayout {
  const C = TIMELINE_CARD;
  const n = events.length;
  const { left, right } = opts;
  const usable = right - left;
  // Many events: slimmer cards, so the lanes stay few.
  const cardW = opts.cardW ?? (n > 12 ? 132 : C.W);
  const texts = events.map((e) => cardText(e, cardW));
  const years = events.map((e) => e.year);
  const allYears = n > 0 && years.every((y) => y !== null && Number.isFinite(y));
  const minY = allYears ? Math.min(...(years as number[])) : 0;
  const maxY = allYears ? Math.max(...(years as number[])) : 0;
  const crossesEra = allYears && minY < 0 && maxY > 0;
  const inset = Math.min(cardW / 2 - 6, usable / 6);
  const lo = left + inset;
  const hi = right - inset;

  const build = (xs: number[], proportional: boolean): TimelineCardLayout & { maxLane: number } => {
    const packed = packLanes(xs, texts, cardW, left, right);
    const cards: TimelineCard[] = packed.placed.map((p) => ({
      index: p.i, x: p.x, side: p.side, lane: p.lane, boxX: p.boxX, boxW: cardW, boxH: texts[p.i].h, near: packed.nearOf(p.side, p.lane),
      dateLines: texts[p.i].dateLines, titleLines: texts[p.i].titleLines, descLines: texts[p.i].descLines,
    })).sort((a, b) => a.index - b.index);
    const ticks = proportional ? timelineTicks(minY, maxY).map((year) => ({ year, x: lo + ((year - minY) / (maxY - minY)) * (hi - lo) })) : [];
    return { cards, topHeight: packed.topHeight, bottomHeight: packed.bottomHeight, proportional, ticks, crossesEra, maxLane: packed.maxLane };
  };

  if (n === 0) return { cards: [], topHeight: 0, bottomHeight: 0, proportional: false, ticks: [], crossesEra: false };
  if (allYears && !opts.forceEven && n > 1 && maxY > minY) {
    const xs = (years as number[]).map((y) => lo + ((y - minY) / (maxY - minY)) * (hi - lo));
    const sorted = [...xs].sort((a, b) => a - b);
    const apart = sorted.every((x, i) => i === 0 || x - sorted[i - 1] >= C.MIN_DOT_GAP);
    if (apart) {
      const out = build(xs, true);
      if (out.maxLane <= 2) return out;
    }
  }
  // Even spacing: chronological when the years are known (ties keep the given order), else as given.
  const rank = events.map((_, i) => i);
  if (allYears && !opts.forceEven) rank.sort((a, b) => (years[a] as number) - (years[b] as number) || a - b);
  const xs = new Array<number>(n);
  rank.forEach((evIdx, pos) => { xs[evIdx] = n === 1 ? (left + right) / 2 : lo + (pos / (n - 1)) * (hi - lo); });
  return build(xs, false);
}
