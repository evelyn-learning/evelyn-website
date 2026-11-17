import sharp from "sharp";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { SVG } from "mathjax-full/js/output/svg.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages.js";
import { renderMarkdown } from "./render";

// SOLARO import format (Vance Schamehorn, 2026-10-22/23): no MathML anywhere.
// Every equation is a PNG `img.mathml` with an inline vertical-align and a
// linear alt text; text at 12 pt (16 px at 96 dpi); transparent background.
// Equations go TeX → MathJax SVG (glyphs as paths, so no font on the server
// matters) → sharp PNG at 2× for sharp print, displayed at 1× via width/height.
// Figures (inline SVG) are rasterised the same way.

const EM = 16; // 12 pt at 96 dpi
const EX = 7.2; // Arial x-height at 16 px
const SCALE = 2;

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const doc = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "none" }),
});

export type Png = { name: string; data: Buffer; width: number; height: number };

/** One equation → PNG plus the CSS vertical-align (px) that sits it on the text baseline. */
export async function texToPng(tex: string, display: boolean, name: string): Promise<Png & { valign: number }> {
  const node = doc.convert(tex, { display, em: EM, ex: EX, containerWidth: 700 * EM });
  let svg = adaptor.innerHTML(node);
  const exVal = (attr: string) => Number(svg.match(new RegExp(`${attr}="([\\d.]+)ex"`))?.[1] ?? 0);
  const wEx = exVal("width");
  const hEx = exVal("height");
  const vaEx = Number(svg.match(/vertical-align:\s*(-?[\d.]+)ex/)?.[1] ?? 0);
  const width = Math.max(1, Math.ceil(wEx * EX));
  const height = Math.max(1, Math.ceil(hEx * EX));
  svg = svg
    .replace(/width="[\d.]+ex"/, `width="${width * SCALE}"`)
    .replace(/height="[\d.]+ex"/, `height="${height * SCALE}"`)
    .replace(/currentColor/g, "#000000");
  const data = await sharp(Buffer.from(svg), { density: 72 }).png().toBuffer();
  return { name, data, width, height, valign: Math.round(vaEx * EX * 10) / 10 };
}

/** A figure's inline SVG → PNG at its own width (≤ 240 px) × 2. */
export async function svgToPng(svg: string, name: string): Promise<Png> {
  const vb = svg.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
  const w = Number(svg.match(/<svg\b[^>]*\swidth="([\d.]+)"/)?.[1] ?? vb?.[1] ?? 240);
  const width = Math.min(240, Math.round(w));
  const height = vb ? Math.round((width * Number(vb[2])) / Number(vb[1])) : width;
  let s = svg.replace(/\s(width|height)="[^"]*"/g, "").replace(/<svg\b/, `<svg width="${width * SCALE}" height="${height * SCALE}"`);
  if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(s)) s = s.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
  // Liberation Sans is metric-compatible with Arial and is what the server has.
  s = s.replace(/font-family="([^"]*)"/g, (_m, f: string) => `font-family="${/liberation/i.test(f) ? f : `${f}, Liberation Sans`}"`);
  const data = await sharp(Buffer.from(s), { density: 72 }).png().toBuffer();
  return { name, data, width, height };
}

const GREEK: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", theta: "θ", lambda: "λ", mu: "μ", pi: "π",
  rho: "ρ", sigma: "σ", tau: "τ", phi: "φ", varphi: "φ", omega: "ω", Delta: "Δ", Sigma: "Σ", Omega: "Ω", Theta: "Θ", Phi: "Φ",
};
const SYM: Record<string, string> = {
  times: "×", cdot: "·", div: "÷", pm: "±", mp: "∓", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", approx: "≈",
  infty: "∞", to: "→", rightarrow: "→", Rightarrow: "⇒", leftarrow: "←", circ: "°", degree: "°", propto: "∝", in: "∈",
  cdots: "…", ldots: "…", dots: "…", quad: " ", qquad: " ", angle: "∠", perp: "⊥", parallel: "∥", sim: "∼", rightleftharpoons: "⇌",
};

/** Linear text for an equation's alt attribute, readable by a screen reader. */
export function texToLinear(tex: string): string {
  let s = tex;
  for (let i = 0; i < 6; i++) {
    s = s
      .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "($1)/($2)")
      .replace(/\\sqrt\s*\[([^\]]*)\]\s*\{([^{}]*)\}/g, "root $1 of ($2)")
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√($1)")
      .replace(/\\(?:text|mathrm|textrm|mathit|mathbf|operatorname|textbf|textit)\s*\{([^{}]*)\}/g, "$1")
      .replace(/\\(?:overline|vec|bar|hat)\s*\{([^{}]*)\}/g, "$1")
      .replace(/\^\{([^{}]*)\}/g, "^($1)")
      .replace(/_\{([^{}]*)\}/g, "_($1)");
  }
  s = s
    .replace(/\\left|\\right|\\big|\\Big|\\bigl|\\bigr/g, "")
    .replace(/\\begin\{[^}]*\}|\\end\{[^}]*\}/g, " ")
    .replace(/\\\\/g, "; ")
    .replace(/&/g, "")
    .replace(/\\([a-zA-Z]+)/g, (_m, w: string) => GREEK[w] ?? SYM[w] ?? (["sin", "cos", "tan", "log", "ln", "lim", "sec", "csc", "cot"].includes(w) ? w : ""))
    .replace(/\\[,;:! ]/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\^\(([^()\s]{1})\)/g, "^$1")
    .replace(/_\(([^()\s]{1,3})\)/g, "_$1")
    .replace(/~/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Renders one section's Markdown for SOLARO: equations and figures become
 * PNGs in resources/, images keep their file names. Returns the HTML and the
 * files to ship next to it.
 */
export async function renderForSolaro(
  md: string,
  prefix: string,
  resolveImage: (src: string) => string,
): Promise<{ html: string; files: Png[] }> {
  const jobs: { kind: "math" | "fig"; tex?: string; display?: boolean; svg?: string; alt?: string; caption?: string }[] = [];
  const token = (i: number) => `KSPNG${i}KS`;
  const html = renderMarkdown(md, {
    resolveImage,
    math: (tex, display) => {
      const t = tex.trim();
      if (!display && /^[A-Za-z]$/.test(t)) return `<i>${t}</i>`;
      if (!display && /^-?[\d.,]+$/.test(t)) return t.replace(/^-/, "−");
      return token(jobs.push({ kind: "math", tex: t, display }) - 1);
    },
    figure: (svg, alt, caption) => token(jobs.push({ kind: "fig", svg, alt, caption }) - 1),
  });

  const files: Png[] = [];
  const out: string[] = [];
  let n = 0;
  for (const j of jobs) {
    n++;
    if (j.kind === "math") {
      const png = await texToPng(j.tex!, !!j.display, `${prefix}-eq${n}.png`);
      files.push(png);
      const img = `<img class="mathml" src="resources/${png.name}" width="${png.width}" height="${png.height}" style="vertical-align: ${png.valign}px;" alt="${escAttr(texToLinear(j.tex!))}" />`;
      out.push(j.display ? `<p class="es-equation">${img}</p>` : img);
    } else {
      const png = await svgToPng(j.svg!, `${prefix}-fig${n}.png`);
      files.push(png);
      out.push(
        `<p class="es-figure"><img src="resources/${png.name}" width="${png.width}" height="${png.height}" alt="${escAttr(j.alt ?? "")}" /></p>` +
          (j.caption ? `<p class="es-caption">${escAttr(j.caption)}</p>` : ""),
      );
    }
  }
  const final = html
    .replace(/<div class="ks-math">(KSPNG\d+KS)<\/div>/g, "$1")
    .replace(/<figure class="ks-fig">(KSPNG\d+KS)<\/figure>/g, "$1")
    .replace(/KSPNG(\d+)KS/g, (_m, i: string) => out[Number(i)]);
  return { html: final, files };
}

const NAMED: Record<string, string> = { nbsp: "#160", ndash: "#8211", mdash: "#8212", minus: "#8722", times: "#215", deg: "#176", hellip: "#8230", rsquo: "#8217", lsquo: "#8216", rdquo: "#8221", ldquo: "#8220" };

/** HTML → well-formed XHTML for QTI (void elements closed, named entities numeric). */
export function toXhtml(html: string): string {
  return html
    .replace(/<(img|br|hr|col|input)\b([^>]*?)\s*\/?>/g, "<$1$2 />")
    .replace(/&([a-zA-Z]+);/g, (m, n: string) => (["amp", "lt", "gt", "quot", "apos"].includes(n) ? m : NAMED[n] ? `&${NAMED[n]};` : ""));
}
