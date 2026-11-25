import katex from "katex";
import { marked } from "marked";

// Markdown + LaTeX → HTML, done once when a solution is saved so review pages
// only send stored HTML (Julie reviews at ~40 s an item; nothing renders in
// the browser). KaTeX emits MathML alongside its HTML, so screen readers get
// every glyph.
//
// Supported beyond GitHub Markdown:
//   $…$ inline math, $$…$$ display math (\$ is a literal dollar sign)
//   ```figure alt="…" caption="…"  <svg>…</svg>  ```   inline SVG figure
//   "Table: caption" on the line directly above a table → <caption>

export type RenderOptions = {
  /** Rewrites relative image paths (e.g. "images/301823-1.png"). */
  resolveImage?: (src: string) => string;
  /** Replaces KaTeX (the SOLARO export renders equations to PNG). */
  math?: (tex: string, display: boolean) => string;
  /** Replaces the inline-SVG figure markup. */
  figure?: (svg: string, alt: string, caption: string) => string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function attr(attrs: string, name: string): string {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : "";
}

function tex(src: string, display: boolean): string {
  return katex.renderToString(src.trim(), {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "htmlAndMathml",
  });
}

/** Removes script, event handlers and javascript: URLs. Content comes from signed-in users only. */
export function sanitize(html: string): string {
  return html
    .replace(/<(script|iframe|object|embed|style)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?(script|iframe|object|embed|style|link|meta|base|form)\b[^>]*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src|xlink:href)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function renderMarkdown(md: string, opts: RenderOptions = {}): string {
  const slots: string[] = [];
  const slot = (html: string) => `KSSLOT${slots.push(html) - 1}KS`;

  let s = md.replace(/\r\n/g, "\n");

  // 1. Figures (raw SVG must not pass through the Markdown parser).
  s = s.replace(/```figure([^\n]*)\n([\s\S]*?)\n```/g, (_m, attrs: string, body: string) => {
    const alt = attr(attrs, "alt");
    const caption = attr(attrs, "caption");
    if (opts.figure) return `\n\n${slot(`<figure class="ks-fig">${opts.figure(body.trim(), alt, caption)}</figure>`)}\n\n`;
    const svg = body
      .trim()
      .replace(/<svg\b/, `<svg role="img" aria-label="${esc(alt)}"`);
    const cap = caption ? `<figcaption>${esc(caption)}</figcaption>` : "";
    return `\n\n${slot(`<figure class="ks-fig">${svg}${cap}</figure>`)}\n\n`;
  });

  // 2. Code spans/blocks are left alone; protect them from the math pass.
  s = s.replace(/```[\s\S]*?```|`[^`\n]+`/g, (m) => slot(marked.parse(m, { async: false }) as string));

  // 3. Math.
  // An escaped dollar is set aside so it cannot open or close math. Inside math it goes back in as \$ before the
  // maths is typeset: left as its slot name, "$\$316032$" was typeset as the letters K S S L O T 0 K S 316032.
  const dollars: string[] = [];
  s = s.replace(/\\\$/g, () => {
    const name = slot("$");
    dollars.push(name);
    return name;
  });
  const inMath = (t: string) => dollars.reduce((acc, name) => acc.split(name).join("\\$"), t);
  const m = opts.math ?? tex;
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, t: string) => `\n\n${slot(`<div class="ks-math">${m(inMath(t), true)}</div>`)}\n\n`);
  s = s.replace(/\$([^$\n]+?)\$/g, (_m, t: string) => slot(m(inMath(t), false)));

  // 4. Table captions.
  s = s.replace(/^Table:\s*(.+)$/gm, (_m, c: string) => `KSCAP${slot(esc(c.trim()))}`);

  let html = marked.parse(s, { async: false, gfm: true, breaks: false }) as string;

  html = html.replace(/<p>KSCAP(KSSLOT\d+KS)<\/p>\s*<table>/g, (_m, t: string) => `<table><caption>${t}</caption>`);
  html = html.replace(/<p>KSCAP(KSSLOT\d+KS)<\/p>/g, (_m, t: string) => `<p class="ks-cap">${t}</p>`);

  // A slot alone in a paragraph (figure, display math) should not sit inside <p>.
  html = html.replace(/<p>(KSSLOT\d+KS)<\/p>/g, "$1");
  for (let pass = 0; pass < 3 && /KSSLOT\d+KS/.test(html); pass++) {
    html = html.replace(/KSSLOT(\d+)KS/g, (_m, i: string) => slots[Number(i)]);
  }

  if (opts.resolveImage) {
    const r = opts.resolveImage;
    html = html.replace(/(<img\b[^>]*\bsrc=")([^"]+)"/g, (_m, pre: string, src: string) => `${pre}${r(src)}"`);
  }
  html = html.replace(/<table>/g, '<div class="ks-table"><table>').replace(/<\/table>/g, "</table></div>");
  return sanitize(html);
}

/** Inline render for short strings (MC options): no wrapping <p>. */
export function renderInline(md: string, opts: RenderOptions = {}): string {
  const html = renderMarkdown(md, opts).trim();
  const m = html.match(/^<p>([\s\S]*)<\/p>$/);
  return m && !m[1].includes("<p>") ? m[1] : html;
}
