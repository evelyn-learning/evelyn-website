/**
 * Tutor brain v2 — board items written inline in the reply.
 *
 * A model writes its words first and its tool calls after. For the board that order is wrong: the
 * tutor chose what to draw after it had finished talking, so items appeared at the wrong moment,
 * showed things it never said, or were forgotten (Praveen, embed-1794342128162). The everyday board
 * items are therefore written IN the reply, at the point where a tutor would pick up the pen:
 *
 *   <board equation label="…">LaTeX</board>
 *   <board note style="highlight">one point per line, $maths$ inline</board>
 *   <board problem difficulty="medium">the problem, $maths$ inline</board>
 *   <board table|timeline|compare|steps|quote|chart …>plain lines, cells separated by "|"</board>
 *   <board code lang="java">program code as typed</board>   <board sketch labels="a | b">what to draw</board>
 *
 * The runtime lifts the blocks out of the stream: the words go to the student, each block becomes a
 * board call at that position (turn.ts), and the voice client paints it as the sentence before it
 * begins (TutorVoiceV2). The stored reply keeps the blocks, so the history shows a tutor who writes
 * while talking. `with="opening words"` is for the board pass only, whose blocks arrive after the words.
 */
import { isCodeBody, typesetMaths, unfoldCode } from './rich-text';
import { toolFigureCall } from './figure-catalogue';

export type InlineKind = 'equation' | 'note' | 'problem' | 'table' | 'timeline' | 'compare' | 'steps' | 'quote' | 'forces' | 'numberline' | 'graph' | 'cycle' | 'web' | 'map' | 'chart' | 'ranks' | 'code' | 'sketch' | 'figure' | 'page';
export interface InlineBlock { kind: InlineKind; attrs: Record<string, string>; body: string; raw: string }
/** `opening`: a block has begun and its content is still arriving (the client holds the sentence before it). */
export type InlinePart = { text: string } | { block: InlineBlock } | { opening: true };

const OPEN = '<board';
const CLOSE = '</board>';
const BLOCK_RE = /<board\s+(equation|note|problem|table|timeline|compare|steps|quote|forces|numberline|graph|cycle|web|map|chart|ranks|code|sketch|figure|page)((?:\s+[a-z_]+="[^"]*")*)\s*>([\s\S]*?)<\/board>/g;

function parseBlock(raw: string): InlineBlock | null {
  BLOCK_RE.lastIndex = 0;
  const m = BLOCK_RE.exec(raw);
  if (!m) return null;
  const attrs: Record<string, string> = {};
  for (const a of m[2].matchAll(/([a-z_]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
  return { kind: m[1] as InlineKind, attrs, body: m[3].trim(), raw: m[0] };
}

/** Where the block opened at `start` ends: just after its own closing tag, counting blocks opened inside it;
 *  -1 while that tag has not arrived. A figure written inside a problem block closed the problem at the figure's
 *  tag: the figure was lost into the card as code and the problem's own "</board>" was said aloud (demo check,
 *  2026-11-13). */
function blockEnd(text: string, start: number): number {
  let depth = 0; let i = start;
  for (;;) {
    const o = text.indexOf(OPEN, i); const c = text.indexOf(CLOSE, i);
    if (c < 0) return -1;
    if (o >= 0 && o < c) { depth += 1; i = o + OPEN.length; continue; }
    depth -= 1; i = c + CLOSE.length;
    if (depth <= 0) return i;
  }
}
/** A block, and the blocks written inside it lifted out to follow it. */
function flatten(raw: string): InlineBlock[] {
  const head = raw.match(/^<board\s+[a-z]+(?:\s+[a-z_]+="[^"]*")*\s*>/);
  if (!head || !raw.endsWith(CLOSE)) return [parseBlock(raw)].filter((b): b is InlineBlock => !!b);
  let inner = raw.slice(head[0].length, raw.length - CLOSE.length);
  const lifted: InlineBlock[] = [];
  for (let at = inner.indexOf(OPEN); at >= 0; at = inner.indexOf(OPEN)) {
    const end = blockEnd(inner, at);
    if (end < 0) { inner = inner.slice(0, at); break; }
    lifted.push(...flatten(inner.slice(at, end)));
    inner = `${inner.slice(0, at)}${inner.slice(end)}`;
  }
  const outer = inner.trim() ? parseBlock(`${head[0]}${inner}${CLOSE}`) : null;
  return [...(outer ? [outer] : []), ...lifted];
}

/** The reply as the student gets it: the blocks removed, the gaps closed. */
export function stripBoardBlocks(text: string): string {
  let out = ''; let i = 0;
  for (let at = text.indexOf(OPEN); at >= 0; at = text.indexOf(OPEN, i)) {
    out += `${text.slice(i, at)} `;
    const end = blockEnd(text, at);
    if (end < 0) { i = text.length; break; }
    i = end;
  }
  out += text.slice(i);
  // A closing tag with no block before it is markup, never words.
  return out.replace(/<\/board>/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/** Every well-formed block in a finished text, in order (a block written inside another follows it). */
export function boardBlocksIn(text: string): InlineBlock[] {
  const out: InlineBlock[] = [];
  for (let at = text.indexOf(OPEN), end = 0; at >= 0; at = text.indexOf(OPEN, end)) {
    end = blockEnd(text, at);
    if (end < 0) break;
    out.push(...flatten(text.slice(at, end)));
  }
  return out;
}

/** Whether the bars in a one-line note separate points (each a phrase of its own). A bar is also notation:
 *  "6 | 2 6" is a row of a stemplot and "4 | 7 means 47" its key, and splitting those wrote "Your rows so far: 6"
 *  on one line and "2, and 7" on the next (embed-1794425631023). Points are phrases of three words or more. */
function pipedPoints(body: string): boolean {
  const parts = body.split('|').map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 && parts.every((x) => x.split(/\s+/).length >= 3 && !/^\d/.test(x));
}

/** The board tool call a block stands for. */
/** The language of a listing nobody named: enough to head the card, never shown as fact about syntax. */
function codeLanguage(code: string): string {
  return /\b(?:public|private|static|void|String|System\.)\b|\bint\s+\w+\s*[(=;]/.test(code) ? 'java' : /^\s*def\s|:\s*$|\bprint\(/m.test(code) ? 'python' : /\b(?:const|let|function)\b|=>/.test(code) ? 'javascript' : 'code';
}

export function inlineToolCall(b: InlineBlock): { name: string; args: Record<string, unknown> } {
  // Program code keeps its shape: one fixed-width listing, whether it was written as code or as a note
  // (a method written as a note came out in the board's prose font, AP CS A recursion, 2026-11-11).
  if (b.kind === 'code' || (b.kind === 'note' && isCodeBody(b.body))) return { name: 'show_code', args: { code: unfoldCode(b.body), language: b.attrs.lang || codeLanguage(b.body), ...(b.attrs.title ? { label: b.attrs.title } : {}) } };
  // An exact figure from the board's catalogue (figure-catalogue.ts): its kind, and its parameters as JSON.
  if (b.kind === 'figure') {
    let params: Record<string, unknown> = {};
    try { const parsed: unknown = JSON.parse(b.body.replace(/^```(?:json)?\s*|\s*```$/g, '')); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) params = parsed as Record<string, unknown>; } catch { /* boardMisfit reports the figure as unreadable */ params = { unreadable: b.body.slice(0, 80) }; }
    if (b.attrs.title && params.title === undefined) params.title = b.attrs.title;
    const kind = (b.attrs.kind ?? '').trim();
    return toolFigureCall(kind, params) ?? { name: 'show_diagram', args: { type: kind, params } };
  }
  // A rough picture of a real thing or scene (a wrench on a bolt, a skater's arms). NOT OFFERED to the tutor yet
  // (it is in neither the constitution nor the board check): the drawing service drew a push "down" as an arrow
  // pointing up in its first trial (AP Physics 1 probe, 2026-11-11). The form stays so a better one can be tried.
  if (b.kind === 'sketch') return { name: 'show_sketch', args: { concept: b.body.replace(/\s+/g, ' '), ...(b.attrs.labels ? { labels: b.attrs.labels.split('|').map((x) => x.trim()).filter(Boolean) } : {}), ...(b.attrs.title ? { title: b.attrs.title } : {}) } };
  if (b.kind === 'equation') return { name: 'show_equation', args: { latex: b.body, ...(b.attrs.label ? { label: b.attrs.label } : {}) } };
  // One point per line; a tutor who has just written a table sometimes separates the points with "|" instead.
  if (b.kind === 'note') return { name: 'annotate', args: { text: b.body.includes('\n') || b.body.includes('$') || !pipedPoints(b.body) ? b.body : b.body.split(/(?<=[^|\s])\s*\|\s*(?=[^|\s])/).filter(Boolean).join('\n'), ...(b.attrs.style ? { style: b.attrs.style } : {}), rich: true } };
  // The structured kinds are written as plain lines, cells separated by "|", so that a table or a timeline
  // costs the tutor no more than a note: a lesson in words was otherwise a stack of text cards
  // (Praveen, AP US Government, embed-1794355900794).
  const lines = b.body.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const cells = (l: string) => l.split('|').map((c) => c.trim());
  // A heading such as "dogs walked (x)" carries a variable: it is set as one, like the cards (grade 7, 2026-11-11).
  if (b.kind === 'table') return { name: 'show_table', args: { headers: cells(lines[0] ?? '').map(typesetMaths), rows: lines.slice(1).map((l) => cells(l).map(typesetMaths)) } };
  if (b.kind === 'timeline') return { name: 'show_timeline', args: { ...(b.attrs.title ? { title: b.attrs.title } : {}), events: lines.map(cells).filter((c) => c[0] && c[1]).map((c) => ({ date: c[0], title: c[1], ...(c[2] ? { description: c[2] } : {}) })) } };
  // Two sides, row by row. A table sizes itself to its words; the fixed-size chart clipped a two-line
  // heading and left half the card empty (embed-1794376295543).
  // A row may open with what it compares ("Who holds the labor | one colonist | colonial officials"): then the
  // table has a first column for it. With two cells only, a tutor who meant that wrote the row's name in the
  // left side's column and left the right side empty (browser run, AP US History, 2026-11-11).
  if (b.kind === 'compare') {
    const rows = lines.map(cells);
    const named = rows.length > 0 && rows.every((r) => r.length >= 3);
    return { name: 'show_table', args: named ? { headers: ['', b.attrs.left ?? '', b.attrs.right ?? ''], rows: rows.map((r) => [r[0], r[1], r[2]]) } : { headers: [b.attrs.left ?? '', b.attrs.right ?? ''], rows: rows.map((r) => [r[0] ?? '', r[1] ?? '']) } };
  }
  // A page of the board, with its heading.
  // The board numbers its pages itself: "Page 2: What makes a light turn on?" printed the number twice (demo check, 2026-11-13).
  if (b.kind === 'page') return { name: 'new_page', args: { title: b.body.replace(/\s+/g, ' ').trim().replace(/^page\s*\d+\s*[:.\-–—]\s*/i, '').slice(0, 80) } };
  // Things that go round, things that connect, places (a nitrogen-cycle lesson had only lists to draw with,
  // embed-1794376956230).
  if (b.kind === 'cycle') return { name: 'show_cycle_diagram', args: { ...(b.attrs.title ? { title: b.attrs.title } : {}), // Captions sit beside small circles: a long one runs over its neighbours, so only a short one is drawn.
    stages: lines.map(cells).filter((c) => c[0]).map((c) => ({ label: c[0], ...(c[1] && c[1].length <= 28 ? { description: c[1] } : {}) })) } };
  if (b.kind === 'web') {
    const rows = lines.map(cells).filter((c) => c[0] && c[c.length - 1] && c.length >= 2);
    const ids = new Map<string, string>();
    // "an encomendero" and "encomendero" are one thing: without this the map drew it twice, in two halves
    // (embed-1794426544316).
    const same = (label: string) => label.toLowerCase().replace(/^(?:an?|the)\s+/, '').replace(/\s+/g, ' ').trim();
    const id = (label: string) => { const k = same(label); if (!ids.has(k)) ids.set(k, `n${ids.size + 1}`); return ids.get(k)!; };
    const labels: string[] = [];
    const edges = rows.map((c) => { const from = c[0]; const to = c[c.length - 1]; for (const l of [from, to]) if (!ids.has(same(l))) labels.push(l.replace(/^(?:an?|the)\s+/i, '')); return { from: id(from), to: id(to), ...(c.length >= 3 && c[1] ? { label: c[1] } : {}), directed: true }; });
    // Two links between the same pair are one arrow carrying both: drawn apart, their labels sat on top of
    // each other and of the arrows.
    const merged: typeof edges = [];
    for (const e of edges) { const twin = merged.find((m) => m.from === e.from && m.to === e.to); if (twin) { if (e.label) twin.label = twin.label ? `${twin.label}; ${e.label}` : e.label; } else merged.push({ ...e }); }
    return { name: 'show_concept_map', args: { ...(b.attrs.title ? { title: b.attrs.title } : {}), nodes: labels.map((label, i) => ({ id: id(label), label, ...(i === 0 ? { level: 0 } : {}) })), edges: merged } };
  }
  if (b.kind === 'map') {
    const deg = (v: string | undefined, neg: RegExp) => { const m = String(v ?? '').replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/); if (!m) return NaN; const n = Number(m[0]); return neg.test(String(v)) ? -Math.abs(n) : n; };
    const pins = lines.map(cells).map((c) => ({ label: c[0], lat: deg(c[1], /s\b/i), lon: deg(c[2], /w\b/i) })).filter((pin) => pin.label && Number.isFinite(pin.lat) && Number.isFinite(pin.lon));
    const regions = ['world', 'north-america', 'south-america', 'europe', 'asia', 'africa', 'australia', 'usa', 'india', 'china', 'middle-east', 'mediterranean'];
    return { name: 'show_map', args: { ...(b.attrs.title ? { title: b.attrs.title } : {}), background: regions.includes(b.attrs.region ?? '') ? b.attrs.region : 'world', pins, fit: true, ...(/^(?:yes|true|on|1)$/i.test(b.attrs.route ?? '') ? { route: true } : {}) } };
  }
  // A plot of data: the values as they stand, or named bars (a lesson on histograms had bins listed in notes
  // and no histogram, embed-1794416884500).
  if (b.kind === 'chart') {
    const type = ['dotplot', 'histogram', 'bar'].includes(b.attrs.type ?? '') ? b.attrs.type : 'dotplot';
    const num = (v: string) => Number(v.replace(/−/g, '-').replace(/[^0-9.\-]/g, ''));
    const labels = { ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(b.attrs.x ? { xLabel: b.attrs.x } : {}), ...(b.attrs.y ? { yLabel: b.attrs.y } : {}) };
    if (type === 'bar') { const rows = lines.map(cells).filter((c) => c[0] && Number.isFinite(num(c[1] ?? ''))); return { name: 'show_stats', args: { type, ...labels, bar: { categories: rows.map((c) => c[0]), values: rows.map((c) => num(c[1])) } } }; }
    // Bins already counted, one per line: "60 | 70 | 2" or "60 to 70 | 2" (flattened into values, a pre-binned
    // histogram drew nine bars of nonsense, browser run 2026-11-11).
    const binRows = lines.map((l) => (l.replace(/−/g, '-').match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number));
    if (type === 'histogram' && lines.length >= 2 && lines.every((l) => l.includes('|')) && binRows.every((r) => r.length === 3 && r[1] > r[0])) return { name: 'show_stats', args: { type, ...labels, bins: binRows, showCounts: true } };
    const data = b.body.split(/[\s,;|]+/).filter((v) => /\d/.test(v)).map(num).filter(Number.isFinite);
    const width = num(b.attrs.width ?? '');
    return { name: 'show_stats', args: { type, ...labels, data, ...(type === 'histogram' && width > 0 ? { binWidth: width, showCounts: true } : {}) } };
  }
  // Things ranked one above another: a social order, levels of a food chain, a chain of command (the casta
  // ranking went up as a list in a text card, embed-1794426544316).
  if (b.kind === 'ranks') return { name: 'show_diagram', args: { type: 'hierarchy_pyramid', params: { ...(b.attrs.title ? { title: b.attrs.title } : {}), baseFirst: false, tiers: lines.map(cells).filter((c) => c[0]).map((c) => ({ label: c[0], ...(c[1] ? { description: c[1] } : {}) })) } } };
  if (b.kind === 'steps') return { name: 'show_graphic_organizer', args: { kind: 'sequence', ...(b.attrs.title ? { title: b.attrs.title } : {}), steps: lines.map((l) => cells(l).filter(Boolean).join(': ')) } };
  // Figures, written as plain lines too. A tutor who has to fill in a structured tool call draws far less often
  // than one who can write three lines (a grade 8 forces lesson was all text cards, embed-1794363148240).
  if (b.kind === 'forces') {
    const DIR: Record<string, string> = { east: 'right', west: 'left', north: 'up', south: 'down', rightward: 'right', leftward: 'left', upward: 'up', downward: 'down', forward: 'right', backward: 'left', forwards: 'right', backwards: 'left' };
    const rows = lines.map(cells).filter((c) => c[0] && c[1]);
    const size = (c: string[]) => Number((c[2] ?? '').replace(/[^0-9.]/g, '')) || 0;
    const biggest = Math.max(0, ...rows.map(size));
    const dir = (d: string) => { const k = d.toLowerCase().trim(); return DIR[k] ?? k; };
    const vertical = rows.some((c) => /^(up|down)/.test(dir(c[1])));
    return { name: 'show_free_body_diagram', args: {
      // A long name does not fit inside the box: it becomes the title, and the box stays plain.
      ...(b.attrs.title || (b.attrs.object ?? '').length > 9 ? { title: b.attrs.title ?? `Forces on ${b.attrs.object}` } : {}),
      object: { shape: 'box', label: (b.attrs.object ?? '').length > 9 ? '' : b.attrs.object ?? '' },
      surface: { type: b.attrs.surface === 'none' || (vertical && !b.attrs.surface) ? 'none' : 'horizontal' },
      forces: rows.map((c) => ({ name: c[0], direction: dir(c[1]), ...(c[2] ? { magnitude: c[2] } : {}), ...(biggest && size(c) ? { scale: Math.max(0.5, Math.min(1.6, 0.5 + 1.1 * size(c) / biggest)) } : {}) })),
      ...(b.attrs.note ? { notes: b.attrs.note } : {}),
    } };
  }
  if (b.kind === 'numberline') {
    // A value may be a fraction ("1/2", "-3/4") or a mixed number ("1 1/2"). Read digit by digit, "1/2" was 12, and a
    // probability scale from 0 to 1 went up from -4 to 16 with its half near 12 (demo check, 2026-11-13).
    const num = (v: string | undefined) => {
      const t = String(v ?? '').replace(/−/g, '-').replace(/\$|\\[a-z]+\{|[{}]/g, ' ').trim();
      const mixed = t.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)/);
      if (mixed) return (mixed[1] ? -1 : 1) * (Number(mixed[2]) + Number(mixed[3]) / Number(mixed[4]));
      const frac = t.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
      if (frac) return Number(frac[1]) / Number(frac[2]);
      return Number(t.replace(/[^0-9.\-]/g, ''));
    };
    const denominator = (v: string) => { const m = v.match(/\/\s*(\d+)/); return m ? Number(m[1]) : 1; };
    const rows = lines.map(cells).filter((c) => c[0] !== '' && Number.isFinite(num(c[0])));
    const values = rows.map((c) => num(c[0]));
    // A short line (a 0-to-1 scale) is drawn as it is; a longer one gets room either side, as before.
    const span = Math.max(0, ...values) - Math.min(0, ...values);
    const pad = span <= 2 ? 0 : 4;
    const lo = b.attrs.min !== undefined ? num(b.attrs.min) : Math.floor(Math.min(0, ...values) - pad);
    const hiRaw = b.attrs.max !== undefined ? num(b.attrs.max) : Math.ceil(Math.max(0, ...values) + pad);
    const hi = hiRaw > lo ? hiRaw : lo + 1;
    // Ticks fall on the fractions used (halves, quarters, ...) when they fit; whole numbers otherwise.
    const den = Math.max(1, ...rows.map((c) => denominator(c[0])));
    const step = den > 1 && (hi - lo) * den <= 16 ? 1 / den : (hi - lo) <= 2 ? 0.25 : 1;
    const open = (c: string[]) => /open|hollow|not included|[<>](?!=)/i.test(c[1] ?? '') && !/closed|filled|included\b(?<!not included)/i.test(c[1] ?? '');
    return { name: 'show_number_line', args: {
      ...(b.attrs.title ? { title: b.attrs.title } : {}), min: lo, max: hi, step,
      points: rows.map((c) => ({ value: num(c[0]), label: c[0], style: open(c) ? 'open' : 'filled' })),
      intervals: rows.filter((c) => /right|left|greater|less|above|below/i.test(c[2] ?? '')).map((c) => (/right|greater|above/i.test(c[2]) ? { from: num(c[0]), to: hi, fromInclusive: !open(c), toInclusive: true, color: 'blue' } : { from: lo, to: num(c[0]), fromInclusive: true, toInclusive: !open(c), color: 'blue' })),
    } };
  }
  if (b.kind === 'graph') {
    const range = (v: string | undefined) => { const m = String(v ?? '').replace(/−/g, '-').match(/(-?\d+(?:\.\d+)?)\s*(?:\.\.|to|,)\s*(-?\d+(?:\.\d+)?)/); return m ? [Number(m[1]), Number(m[2])] : undefined; };
    const x = range(b.attrs.x); const y = range(b.attrs.y);
    return { name: 'show_function_graph', args: {
      ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(x ? { xRange: x } : {}), ...(y ? { yRange: y } : {}),
      // What each axis measures, when it measures something: a charging curve went up on bare axes and the
      // student had to ask what they were (AP Physics, embed-1794493438983).
      ...(b.attrs.xname ? { xLabel: b.attrs.xname } : {}), ...(b.attrs.yname ? { yLabel: b.attrs.yname } : {}),
      // A line that is a pair of numbers is a marked point (a centre, a vertex, a focus); any other line is a
      // curve: an expression in x, or an equation in x and y (a circle, an ellipse, a hyperbola).
      ...(lines.some((l) => SEGMENT_RE.test(l)) ? { segments: lines.filter((l) => SEGMENT_RE.test(l)).map((l) => { const m = l.replace(/−/g, '-').match(SEGMENT_RE)!; const label = cells(l)[1]; return { from: { x: Number(m[1]), y: Number(m[2]) }, to: { x: Number(m[3]), y: Number(m[4]) }, ...(label ? { label } : {}) }; }) } : {}),
      // The area between two curves over an interval: "shade between x^2 and 2x from 0 to 2" (under one curve: "… and 0 …").
      ...(lines.some((l) => SHADE_RE.test(l)) ? (() => { const m = lines.find((l) => SHADE_RE.test(l))!.replace(/−/g, '-').match(SHADE_RE)!; const clean = (e: string) => e.replace(/^\$|\$$/g, '').replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*=\s*/i, '').replace(/^the x-?axis$/i, '0').trim(); return { shadedRegion: { axis: 'x', between: [clean(m[1]), clean(m[2])], from: Number(m[3]), to: Number(m[4]) } }; })() : {}),
      functions: lines.filter((l) => !POINT_RE.test(l) && !SEGMENT_RE.test(l) && !SHADE_RE.test(l)).map((l) => {
        const [expr, label, ...more] = cells(l);
        // Further cells say how the curve is drawn: dashed (an asymptote, a boundary), and over which stretch of x (a
        // piece of a piecewise function). Without them a rational function went up with no asymptote to be seen and a
        // piecewise one could not be drawn at all (audit, 2026-11-13).
        const how = more.join(' ').replace(/−/g, '-'); const num = String.raw`(-?\d+(?:\.\d+)?)`;
        const span = how.match(new RegExp(`${num}\\s*(?:to|\\.\\.|<=?\\s*x\\s*<=?)\\s*${num}`)); const side = span ? null : how.match(new RegExp(`x\\s*(<=?|>=?)\\s*${num}`));
        const lo = x?.[0] ?? -50; const hi = x?.[1] ?? 50;
        const domain = span ? [Number(span[1]), Number(span[2])] : side ? (side[1].startsWith('<') ? [lo, Number(side[2])] : [Number(side[2]), hi]) : undefined;
        return { expr: expr.replace(/^\$|\$$/g, '').replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*=\s*(?![^=]*=)/i, ''), ...(label ? { label } : {}), ...(/dash|dotted/i.test(how) || /asymptote/i.test(`${label ?? ''} ${how}`) ? { lineStyle: 'dashed', color: '#64748b' } : {}), ...(domain && domain[0] < domain[1] ? { domain } : {}) };
      }).filter((f) => f.expr),
      ...(lines.some((l) => POINT_RE.test(l)) ? { points: lines.filter((l) => POINT_RE.test(l)).map((l) => { const m = l.replace(/−/g, '-').match(POINT_RE)!; const label = cells(l)[1]; return { x: Number(m[1]), y: Number(m[2]), ...(label ? { label } : {}), ...(/open|hollow/i.test(m[3] ?? '') || (!m[3] && OPEN_POINT.test(label ?? '')) ? { open: true } : {}) }; }) } : {}),
    } };
  }
  if (b.kind === 'quote') return { name: 'show_passage', args: { text: b.body, ...(b.attrs.source ? { source: b.attrs.source } : {}), ...(b.attrs.title ? { title: b.attrs.title } : {}) } };
  return { name: 'show_problem', args: { statement: b.body, format: 'free-response', rich: true, ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(b.attrs.difficulty ? { difficulty: b.attrs.difficulty } : {}) } };
}

/** A straight segment between two points: "(0, 0) to (3, 0) | horizontal leg". */
/** "shade between <one bound> and <the other> from a to b". */
const SHADE_RE = /^\s*shaded?\b\s*(?:the\s+(?:area|region)\s+)?(?:between\s+)?(.+?)\s+and\s+(.+?)\s+from\s+(?:x\s*=\s*)?([-−]?\d+(?:\.\d+)?)\s+to\s+(?:x\s*=\s*)?([-−]?\d+(?:\.\d+)?)\s*$/i;
const SEGMENT_RE = /^\s*\$?\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\s*(?:to|--+|—|–|->|→)\s*\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\$?\s*(?:\||$)/i;
const POINT_RE = /^\s*\$?\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\$?\s*(open|hollow|closed|filled)?\s*(?:\||$)/i;
/** A point the curve leaves out is drawn hollow: written `open`, or named as a hole or an excluded value. A hole
 *  at x = −2 went up as a solid dot (algebra, embed-1794595194384). */
const OPEN_POINT = /\b(?:hole|excluded|not included|open circle|removed|undefined|not defined)\b/i;

/** Splits streamed text into words and blocks, holding back anything that may be the start of a block. */
export class BoardInlineStream {
  private buf = '';
  private announced = false;

  push(delta: string): InlinePart[] {
    this.buf += delta;
    return this.drain(false);
  }

  /** The stream has ended: an unfinished block is dropped (it never reaches the student as text). */
  flush(): InlinePart[] {
    return this.drain(true);
  }

  private drain(final: boolean): InlinePart[] {
    const out: InlinePart[] = [];
    for (;;) {
      const open = this.buf.indexOf(OPEN);
      if (open < 0) {
        // Keep back a tail that could be the first characters of "<board".
        let keep = 0;
        if (!final) for (let n = Math.min(OPEN.length - 1, this.buf.length); n > 0; n--) if (OPEN.startsWith(this.buf.slice(-n))) { keep = n; break; }
        const text = this.buf.slice(0, this.buf.length - keep);
        this.buf = this.buf.slice(this.buf.length - keep);
        if (text) out.push({ text });
        return out;
      }
      if (open > 0) { out.push({ text: this.buf.slice(0, open) }); this.buf = this.buf.slice(open); }
      const end = blockEnd(this.buf, 0);
      if (end < 0) { if (final) this.buf = ''; else if (!this.announced) { this.announced = true; out.push({ opening: true }); } return out; }
      this.announced = false;
      const raw = this.buf.slice(0, end);
      this.buf = this.buf.slice(end);
      for (const block of flatten(raw)) out.push({ block });
    }
  }
}

const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** Put a block into a finished reply right after the sentence that opens with `withWords`; at the end when
 *  that sentence is not found. Used to store the board pass's blocks where they belong. */
export function insertBlock(text: string, raw: string, withWords?: string): string {
  const want = words(withWords ?? '').slice(0, 4);
  if (want.length >= 2) {
    // A point between digits is a decimal, not the end of a sentence: "sin 30° is 0.5" was cut at "0." and the
    // block stored in the middle of the number (optics, embed-1794593747478).
    const re = /[^\s<](?:[^.!?\n<]|\.(?=\d))*(?:[.!?]+|\n|$)/g;
    let m: RegExpExecArray | null;
    let depth = 0; let last = 0;
    // Sentence starts outside existing blocks only.
    const outside = (at: number) => { for (const b of text.slice(last, at).matchAll(/<board\b|<\/board>/g)) depth += b[0] === '</board>' ? -1 : 1; last = at; return depth <= 0; };
    while ((m = re.exec(text))) {
      if (!outside(m.index)) continue;
      const got = words(m[0]).slice(0, want.length);
      if (got.length === want.length && got.every((w, i) => w === want[i])) { const end = m.index + m[0].trimEnd().length; return `${text.slice(0, end)} ${raw}${text.slice(end)}`; }
      if (!m[0]) re.lastIndex += 1;
    }
  }
  return `${text.trimEnd()}\n${raw}`;
}
