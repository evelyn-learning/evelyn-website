/**
 * Practice-figure SVG safety — the ONE validator for a figure's `svg` string.
 *
 * Used twice, on purpose:
 *   - at AUTHORING time (render.ts output, the seed script, the review
 *     gallery) — a figure that fails is never stored;
 *   - at SERVE time (portal/figure-items.ts `servableFigure`) — a stored
 *     figure that fails is withheld together with its item, and logged. The
 *     partner page puts this markup into its own DOM, so nothing that can run
 *     code or fetch a resource may leave the engine, whatever wrote the row.
 *
 * The rule is an ALLOWLIST walked over a strict tokenizer, not a pattern
 * search for known-bad strings: an element or URL shape this file does not
 * name is refused. A figure must be
 *   - one root `<svg>` with a `viewBox`, nothing before or after it;
 *   - well-formed (every tag closed, quoted attributes, no raw `<` in text);
 *   - made only of the drawing elements in `ALLOWED_ELEMENTS` — so no
 *     `<script>`, `<foreignObject>`, `<iframe>`, `<image>`, `<a>`, `<animate>`,
 *     `<set>`, …;
 *   - free of event-handler attributes (`on*=`);
 *   - free of external references: `href` / `xlink:href` may only be a
 *     same-document fragment (`#id`); any `url(...)` may only be `url(#id)`;
 *     no `javascript:` / `data:` / `http(s):` / `//host` anywhere in an
 *     attribute value (the two `xmlns` declarations excepted); no `@import`
 *     or `expression(` in a `<style>` or a `style=""`;
 *   - free of DOCTYPE / entity declarations, processing instructions and
 *     CDATA;
 *   - at most `MAX_FIGURE_SVG_CHARS` characters (the contract's bound).
 *
 * Pure: no DOM, no I/O, no dependency. Never throws.
 */

/** `PracticeFigureSchema.svg` max length (@evelyn/portal-contract v1.21.0). */
export const MAX_FIGURE_SVG_CHARS = 200_000;

/** Why a figure was refused. One code per forbidden construct. */
export type SvgSafetyIssue =
  | 'empty'
  | 'too_large'
  | 'not_single_svg_root'
  | 'missing_viewbox'
  | 'malformed'
  | 'doctype_or_entity'
  | 'processing_instruction'
  | 'cdata'
  | 'script_element'
  | 'foreign_object'
  | 'iframe_element'
  | 'image_element'
  | 'disallowed_element'
  | 'event_handler'
  | 'external_href'
  | 'script_url'
  | 'data_url'
  | 'external_url'
  | 'style_import'
  | 'style_url'
  | 'style_expression';

export type SvgSafetyResult = { ok: true } | { ok: false; issues: SvgSafetyIssue[] };

/** Everything a figure may be drawn with. Lower-cased for the lookup. */
const ALLOWED_ELEMENTS: ReadonlySet<string> = new Set([
  'svg', 'g', 'defs', 'title', 'desc', 'style',
  'path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse',
  'text', 'tspan',
  'marker', 'clippath', 'mask', 'pattern', 'lineargradient', 'radialgradient', 'stop',
  'symbol', 'use',
]);

const ALLOWED_NAMESPACES: ReadonlySet<string> = new Set([
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1999/xlink',
]);

/** Elements named individually so a refusal says what it found. */
const NAMED_REFUSALS: Readonly<Record<string, SvgSafetyIssue>> = {
  script: 'script_element',
  foreignobject: 'foreign_object',
  iframe: 'iframe_element',
  image: 'image_element',
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h: string) => safeCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d: string) => safeCodePoint(parseInt(d, 10)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&colon;/gi, ':')
    .replace(/&newline;/gi, '\n')
    .replace(/&tab;/gi, '\t')
    .replace(/&amp;/gi, '&');
}

function safeCodePoint(n: number): string {
  return Number.isFinite(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
}

/** A value as a browser would read it when deciding whether it is a URL:
 *  entities decoded, control characters and all whitespace removed (both are
 *  skipped inside a scheme name), CSS escapes (`\6a`) undone, lower-cased. */
function squash(value: string): string {
  return decodeEntities(value)
    .replace(/\\([0-9a-f]{1,6})\s?/gi, (_, h: string) => safeCodePoint(parseInt(h, 16)))
    .replace(/\\/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0020\u007f-\u00a0\u200b-\u200f\u2028\u2029\ufeff]/g, '')
    .toLowerCase();
}

/** Checks shared by every attribute value and by `<style>` text. */
function checkValue(raw: string, issues: Set<SvgSafetyIssue>, isCss: boolean): void {
  const v = squash(raw);
  if (v.includes('javascript:') || v.includes('vbscript:')) issues.add('script_url');
  if (v.includes('data:')) issues.add('data_url');
  if (/(?:https?|ftp|file|blob|ws|wss):/.test(v) || v.includes('//')) issues.add('external_url');
  // url(...) — only a same-document fragment.
  const urlRe = /url\(([^)]*)\)?/g;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(v)) !== null) {
    const target = m[1].replace(/^["']|["']$/g, '');
    if (!/^#[\w.:-]+$/.test(target)) issues.add(isCss ? 'style_url' : 'external_url');
  }
  if (v.includes('@import')) issues.add('style_import');
  if (v.includes('expression(')) issues.add('style_expression');
}

interface OpenTag {
  name: string;
  attrs: Array<{ name: string; value: string }>;
  selfClosing: boolean;
}

/** Parse the inside of `<…>` for an opening tag. Null when it is not
 *  strictly `name (attr="value" | attr='value')* [/]`. */
function parseOpenTag(inner: string): OpenTag | null {
  const nameMatch = /^([A-Za-z][\w:.-]*)/.exec(inner);
  if (!nameMatch) return null;
  let rest = inner.slice(nameMatch[1].length);
  let selfClosing = false;
  if (rest.endsWith('/')) {
    selfClosing = true;
    rest = rest.slice(0, -1);
  }
  const attrs: OpenTag['attrs'] = [];
  const attrRe = /^\s+([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/;
  for (;;) {
    const m = attrRe.exec(rest);
    if (!m) break;
    attrs.push({ name: m[1], value: m[2] ?? m[3] ?? '' });
    rest = rest.slice(m[0].length);
  }
  if (rest.trim().length > 0) return null; // unquoted / valueless / stray text
  return { name: nameMatch[1], attrs, selfClosing };
}

/** The index of the `>` that closes the tag opened at `from` (quotes respected), or -1. */
function tagEnd(svg: string, from: number): number {
  let quote: string | null = null;
  for (let i = from; i < svg.length; i++) {
    const c = svg[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '<') {
      return -1;
    } else if (c === '>') {
      return i;
    }
  }
  return -1;
}

/**
 * Is this string safe to hand to a partner page as a figure? See the module
 * header for the rule. Returns every issue found (deduplicated), so an
 * authoring tool can show them all.
 */
export function validateFigureSvg(svg: unknown): SvgSafetyResult {
  if (typeof svg !== 'string' || svg.trim().length === 0) return { ok: false, issues: ['empty'] };
  if (svg.length > MAX_FIGURE_SVG_CHARS) return { ok: false, issues: ['too_large'] };
  const issues = new Set<SvgSafetyIssue>();
  const stack: string[] = [];
  let roots = 0;
  let rootHasViewBox = false;
  let malformed = false;
  let i = 0;
  const n = svg.length;

  while (i < n && !malformed) {
    const lt = svg.indexOf('<', i);
    const text = svg.slice(i, lt < 0 ? n : lt);
    if (text.length > 0) {
      if (stack.length === 0) {
        // Only whitespace may sit outside the root.
        if (text.trim().length > 0) issues.add('not_single_svg_root');
      } else if (stack[stack.length - 1] === 'style') {
        checkValue(text, issues, true);
      }
    }
    if (lt < 0) break;

    if (svg.startsWith('<!--', lt)) {
      const end = svg.indexOf('-->', lt + 4);
      if (end < 0) { malformed = true; break; }
      i = end + 3;
      continue;
    }
    if (svg.startsWith('<![CDATA[', lt)) {
      issues.add('cdata');
      const end = svg.indexOf(']]>', lt);
      if (end < 0) { malformed = true; break; }
      i = end + 3;
      continue;
    }
    if (svg.startsWith('<!', lt)) {
      issues.add('doctype_or_entity');
      const end = svg.indexOf('>', lt);
      if (end < 0) { malformed = true; break; }
      i = end + 1;
      continue;
    }
    if (svg.startsWith('<?', lt)) {
      issues.add('processing_instruction');
      const end = svg.indexOf('?>', lt);
      if (end < 0) { malformed = true; break; }
      i = end + 2;
      continue;
    }

    const gt = tagEnd(svg, lt + 1);
    if (gt < 0) { malformed = true; break; }
    const inner = svg.slice(lt + 1, gt);
    i = gt + 1;

    if (inner.startsWith('/')) {
      const name = inner.slice(1).trim().toLowerCase();
      if (stack.length === 0 || stack[stack.length - 1] !== name) { malformed = true; break; }
      stack.pop();
      continue;
    }

    const tag = parseOpenTag(inner);
    if (!tag) { malformed = true; break; }
    const name = tag.name.toLowerCase();

    if (stack.length === 0) {
      roots++;
      if (name !== 'svg' || roots > 1) issues.add('not_single_svg_root');
      else rootHasViewBox = tag.attrs.some((a) => a.name === 'viewBox' && /^\s*-?[\d.]+[\s,]+-?[\d.]+[\s,]+[\d.]+[\s,]+[\d.]+\s*$/.test(a.value));
    }

    if (NAMED_REFUSALS[name]) issues.add(NAMED_REFUSALS[name]);
    else if (!ALLOWED_ELEMENTS.has(name)) issues.add('disallowed_element');

    for (const a of tag.attrs) {
      const an = a.name.toLowerCase();
      // Namespace declarations are the one place an absolute URI is expected;
      // only the SVG / XLink ones are accepted, and they fetch nothing.
      if (an === 'xmlns' || an.startsWith('xmlns:')) {
        if (!ALLOWED_NAMESPACES.has(a.value)) issues.add('external_url');
        continue;
      }
      if (/^on/.test(an)) issues.add('event_handler');
      if (an === 'href' || an.endsWith(':href') || an === 'src') {
        // Same-document fragment only — whatever the scheme checks below say.
        if (!/^#[\w.:-]+$/.test(decodeEntities(a.value).trim())) issues.add('external_href');
      }
      checkValue(a.value, issues, an === 'style');
    }

    if (!tag.selfClosing) stack.push(name);
  }

  if (malformed || stack.length > 0) issues.add('malformed');
  if (roots === 0) issues.add('not_single_svg_root');
  if (roots === 1 && !issues.has('not_single_svg_root') && !rootHasViewBox) issues.add('missing_viewbox');
  return issues.size === 0 ? { ok: true } : { ok: false, issues: [...issues] };
}

/** `validateFigureSvg(svg).ok`. */
export function isSafeFigureSvg(svg: unknown): svg is string {
  return validateFigureSvg(svg).ok;
}
