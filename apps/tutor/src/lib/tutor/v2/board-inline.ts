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
 *
 * The runtime lifts the blocks out of the stream: the words go to the student, each block becomes a
 * board call at that position (turn.ts), and the voice client paints it as the sentence before it
 * begins (TutorVoiceV2). The stored reply keeps the blocks, so the history shows a tutor who writes
 * while talking. `with="opening words"` is for the board pass only, whose blocks arrive after the words.
 */
export type InlineKind = 'equation' | 'note' | 'problem' | 'table' | 'timeline' | 'compare' | 'steps' | 'quote' | 'forces' | 'numberline' | 'graph' | 'cycle' | 'web' | 'map' | 'chart' | 'ranks' | 'page';
export interface InlineBlock { kind: InlineKind; attrs: Record<string, string>; body: string; raw: string }
/** `opening`: a block has begun and its content is still arriving (the client holds the sentence before it). */
export type InlinePart = { text: string } | { block: InlineBlock } | { opening: true };

const OPEN = '<board';
const CLOSE = '</board>';
const BLOCK_RE = /<board\s+(equation|note|problem|table|timeline|compare|steps|quote|forces|numberline|graph|cycle|web|map|chart|ranks|page)((?:\s+[a-z_]+="[^"]*")*)\s*>([\s\S]*?)<\/board>/g;

function parseBlock(raw: string): InlineBlock | null {
  BLOCK_RE.lastIndex = 0;
  const m = BLOCK_RE.exec(raw);
  if (!m) return null;
  const attrs: Record<string, string> = {};
  for (const a of m[2].matchAll(/([a-z_]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
  return { kind: m[1] as InlineKind, attrs, body: m[3].trim(), raw: m[0] };
}

/** The reply as the student gets it: the blocks removed, the gaps closed. */
export function stripBoardBlocks(text: string): string {
  return text.replace(/<board\b[\s\S]*?<\/board>/g, ' ').replace(/<board\b[\s\S]*$/, ' ').replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/** Every well-formed block in a finished text, in order. */
export function boardBlocksIn(text: string): InlineBlock[] {
  return [...text.matchAll(/<board\b[\s\S]*?<\/board>/g)].map((m) => parseBlock(m[0])).filter((b): b is InlineBlock => !!b);
}

/** Whether the bars in a one-line note separate points (each a phrase of its own). A bar is also notation:
 *  "6 | 2 6" is a row of a stemplot and "4 | 7 means 47" its key, and splitting those wrote "Your rows so far: 6"
 *  on one line and "2, and 7" on the next (embed-1794425631023). Points are phrases of three words or more. */
function pipedPoints(body: string): boolean {
  const parts = body.split('|').map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 && parts.every((x) => x.split(/\s+/).length >= 3 && !/^\d/.test(x));
}

/** The board tool call a block stands for. */
export function inlineToolCall(b: InlineBlock): { name: string; args: Record<string, unknown> } {
  if (b.kind === 'equation') return { name: 'show_equation', args: { latex: b.body, ...(b.attrs.label ? { label: b.attrs.label } : {}) } };
  // One point per line; a tutor who has just written a table sometimes separates the points with "|" instead.
  if (b.kind === 'note') return { name: 'annotate', args: { text: b.body.includes('\n') || b.body.includes('$') || !pipedPoints(b.body) ? b.body : b.body.split(/(?<=[^|\s])\s*\|\s*(?=[^|\s])/).filter(Boolean).join('\n'), ...(b.attrs.style ? { style: b.attrs.style } : {}) } };
  // The structured kinds are written as plain lines, cells separated by "|", so that a table or a timeline
  // costs the tutor no more than a note: a lesson in words was otherwise a stack of text cards
  // (Praveen, AP US Government, embed-1794355900794).
  const lines = b.body.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const cells = (l: string) => l.split('|').map((c) => c.trim());
  if (b.kind === 'table') return { name: 'show_table', args: { headers: cells(lines[0] ?? ''), rows: lines.slice(1).map(cells) } };
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
  if (b.kind === 'page') return { name: 'new_page', args: { title: b.body.replace(/\s+/g, ' ').slice(0, 80) } };
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
    return { name: 'show_map', args: { ...(b.attrs.title ? { title: b.attrs.title } : {}), background: regions.includes(b.attrs.region ?? '') ? b.attrs.region : 'world', pins } };
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
    const num = (v: string | undefined) => Number(String(v ?? '').replace(/−/g, '-').replace(/[^0-9.\-]/g, ''));
    const rows = lines.map(cells).filter((c) => c[0] !== '' && Number.isFinite(num(c[0])));
    const values = rows.map((c) => num(c[0]));
    const lo = b.attrs.min !== undefined ? num(b.attrs.min) : Math.floor(Math.min(0, ...values) - 4);
    const hi = b.attrs.max !== undefined ? num(b.attrs.max) : Math.ceil(Math.max(0, ...values) + 4);
    const open = (c: string[]) => /open|hollow|not included|[<>](?!=)/i.test(c[1] ?? '') && !/closed|filled|included\b(?<!not included)/i.test(c[1] ?? '');
    return { name: 'show_number_line', args: {
      ...(b.attrs.title ? { title: b.attrs.title } : {}), min: lo, max: hi, step: 1,
      points: rows.map((c) => ({ value: num(c[0]), label: c[0], style: open(c) ? 'open' : 'filled' })),
      intervals: rows.filter((c) => /right|left|greater|less|above|below/i.test(c[2] ?? '')).map((c) => (/right|greater|above/i.test(c[2]) ? { from: num(c[0]), to: hi, fromInclusive: !open(c), toInclusive: true, color: 'blue' } : { from: lo, to: num(c[0]), fromInclusive: true, toInclusive: !open(c), color: 'blue' })),
    } };
  }
  if (b.kind === 'graph') {
    const range = (v: string | undefined) => { const m = String(v ?? '').replace(/−/g, '-').match(/(-?\d+(?:\.\d+)?)\s*(?:\.\.|to|,)\s*(-?\d+(?:\.\d+)?)/); return m ? [Number(m[1]), Number(m[2])] : undefined; };
    const x = range(b.attrs.x); const y = range(b.attrs.y);
    return { name: 'show_function_graph', args: {
      ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(x ? { xRange: x } : {}), ...(y ? { yRange: y } : {}),
      // A line that is a pair of numbers is a marked point (a centre, a vertex, a focus); any other line is a
      // curve: an expression in x, or an equation in x and y (a circle, an ellipse, a hyperbola).
      ...(lines.some((l) => SEGMENT_RE.test(l)) ? { segments: lines.filter((l) => SEGMENT_RE.test(l)).map((l) => { const m = l.replace(/−/g, '-').match(SEGMENT_RE)!; const label = cells(l)[1]; return { from: { x: Number(m[1]), y: Number(m[2]) }, to: { x: Number(m[3]), y: Number(m[4]) }, ...(label ? { label } : {}) }; }) } : {}),
      functions: lines.filter((l) => !POINT_RE.test(l) && !SEGMENT_RE.test(l)).map((l) => { const [expr, label] = cells(l); return { expr: expr.replace(/^\$|\$$/g, '').replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*=\s*(?![^=]*=)/i, ''), ...(label ? { label } : {}) }; }).filter((f) => f.expr),
      ...(lines.some((l) => POINT_RE.test(l)) ? { points: lines.filter((l) => POINT_RE.test(l)).map((l) => { const m = l.replace(/−/g, '-').match(POINT_RE)!; const label = cells(l)[1]; return { x: Number(m[1]), y: Number(m[2]), ...(label ? { label } : {}) }; }) } : {}),
    } };
  }
  if (b.kind === 'quote') return { name: 'show_passage', args: { text: b.body, ...(b.attrs.source ? { source: b.attrs.source } : {}), ...(b.attrs.title ? { title: b.attrs.title } : {}) } };
  return { name: 'show_problem', args: { statement: b.body, format: 'free-response', ...(b.attrs.title ? { title: b.attrs.title } : {}), ...(b.attrs.difficulty ? { difficulty: b.attrs.difficulty } : {}) } };
}

/** A straight segment between two points: "(0, 0) to (3, 0) | horizontal leg". */
const SEGMENT_RE = /^\s*\$?\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\s*(?:to|--+|—|–|->|→)\s*\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\$?\s*(?:\||$)/i;
const POINT_RE = /^\s*\$?\(\s*([-−]?\d+(?:\.\d+)?)\s*,\s*([-−]?\d+(?:\.\d+)?)\s*\)\$?\s*(?:\||$)/;

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
      const close = this.buf.indexOf(CLOSE);
      if (close < 0) { if (final) this.buf = ''; else if (!this.announced) { this.announced = true; out.push({ opening: true }); } return out; }
      this.announced = false;
      const raw = this.buf.slice(0, close + CLOSE.length);
      this.buf = this.buf.slice(close + CLOSE.length);
      const block = parseBlock(raw);
      if (block) out.push({ block });
    }
  }
}

const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** Put a block into a finished reply right after the sentence that opens with `withWords`; at the end when
 *  that sentence is not found. Used to store the board pass's blocks where they belong. */
export function insertBlock(text: string, raw: string, withWords?: string): string {
  const want = words(withWords ?? '').slice(0, 4);
  if (want.length >= 2) {
    const re = /[^\s<][^.!?\n<]*(?:[.!?]+|\n|$)/g;
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
