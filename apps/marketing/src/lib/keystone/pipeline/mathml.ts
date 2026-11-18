// Presentation MathML -> UNAMBIGUOUS linear text, so the models read "3/4" and
// "sqrt(2)" rather than the digits and letters left after tags are stripped.
// Rule: ugly-but-unambiguous is correct, compact-but-ambiguous is a bug. When two
// operands meet, digits are never merged and a product gets an explicit "*".
// A small recursive-descent converter: tokenise the tags, build a tree, render.
// No dependencies, no `next/*` imports. Never throws: falls back to the plain text.

type Node = { name: string; attrs: string; children: (Node | string)[] };
type Kind = "num" | "id" | "word" | "fenced" | "frac" | "fn" | "post" | "bigop" | "compound";
type Piece = { s: string; kind: Kind; numfrac?: boolean };

const MAX_INPUT = 100_000;
const MAX_DEPTH = 200;

const GREEK = "alpha α beta β gamma γ delta δ epsilon ε zeta ζ eta η theta θ iota ι kappa κ lambda λ mu μ nu ν xi ξ omicron ο pi π rho ρ sigma σ tau τ upsilon υ phi φ chi χ psi ψ omega ω".split(" ");
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", minus: "−", times: "×", divide: "÷", plusmn: "±", middot: "·",
  deg: "°", le: "≤", ge: "≥", ne: "≠", asymp: "≈", infin: "∞", rarr: "→", rightarrow: "→", harr: "↔", sum: "∑", prod: "∏", int: "∫",
};
for (let i = 0; i < GREEK.length; i += 2) {
  NAMED[GREEK[i]] = GREEK[i + 1];
  NAMED[GREEK[i][0].toUpperCase() + GREEK[i].slice(1)] = GREEK[i + 1].toUpperCase();
}
const SPECIAL: Record<string, string> = {
  "−": "-", "×": "×", "⋅": "·", "·": "·", "≤": "≤", "≥": "≥", "≠": "≠",
  "≐": "≈", "≈": "≈", "∞": "∞", "°": "°", "π": "π", " ": " ",
};

function decode(s: string): string {
  const d = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (all, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : all;
    }
    return NAMED[e] ?? NAMED[e.toLowerCase()] ?? all;
  });
  return d.replace(/[−×⋅·≤≥≠≐≈∞°π ]/g, (c) => SPECIAL[c]);
}

function parse(xml: string): Node {
  const root: Node = { name: "#root", attrs: "", children: [] };
  const stack: Node[] = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([A-Za-z_][\w:.-]*)\b([^>]*?)(\/?)>|([^<]+)|</g;
  for (let m = re.exec(xml); m; m = re.exec(xml)) {
    const top = stack[stack.length - 1];
    if (m[5] !== undefined) { top.children.push(m[5]); continue; }
    if (!m[2]) continue;
    const name = m[2].replace(/^.*:/, "").toLowerCase();
    if (m[1]) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].name === name) { stack.length = i; break; }
    } else {
      const n: Node = { name, attrs: m[3], children: [] };
      top.children.push(n);
      if (!m[4]) {
        if (stack.length > MAX_DEPTH) throw new Error("too deep");
        stack.push(n);
      }
    }
  }
  return root;
}

const attr = (n: Node, name: string): string | undefined => {
  const m = n.attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`));
  return m ? decode(m[1] ?? m[2] ?? "") : undefined;
};
const kids = (n: Node): Node[] => n.children.filter((c): c is Node => typeof c !== "string");
const rawText = (n: Node): string => n.children.map((c) => (typeof c === "string" ? c : rawText(c))).join("");

const ATOM = /^(?:\d+\.?\d*|\.\d+|\p{L}+)$/u; // one number or one run of letters: never "2a" or "kt"
const NUMBER = /^-?(?:\d+[.,]?\d*|\.\d+)$/;
const SIMPLE = /^(?:\d+\.?\d*|\.\d+|\p{L}+)(?:[_^](?:\d+\.?\d*|\p{L}+|\([^()]*\)))?$/u; // x, 3, s^2, a_i: binds tighter than "/"
const OPEN = new Set(["(", "[", "{", "|"]);
const CLOSER: Record<string, string> = { "(": ")", "[": "]", "{": "}", "|": "|" };
const POSTFIX = new Set(["!", "°", "%", "′", "″"]);
const UNARY = new Set(["+", "-", "±", "∓", "¬"]);
const VEC = new Set(["→", "⃗", "⇀", "->"]);
const BAR = new Set(["¯", "‾", "―", "_", "-", "−", "̅", "─"]);
const BIGOP: Record<string, string> = { "∑": "sum", "∏": "prod", "∫": "int" };

/** True when s starts with an opening bracket whose matching close is its last character. */
function isFenced(s: string): boolean {
  if (s.length < 2 || !OPEN.has(s[0]) || s[s.length - 1] !== CLOSER[s[0]]) return false;
  if (s[0] === "|") return !s.slice(1, -1).includes("|");
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (OPEN.has(s[i]) && s[i] !== "|") depth++;
    else if (s[i] === ")" || s[i] === "]" || s[i] === "}") { depth--; if (depth === 0 && i < s.length - 1) return false; }
  }
  return depth === 0;
}

/** name(...) / name^(..)(...) / name_2(...): self-delimiting, so safe as a script base. */
function isCall(s: string): boolean {
  if (!s.endsWith(")")) return false;
  let depth = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ")") depth++;
    else if (s[i] === "(") { depth--; if (depth === 0) return i > 0 && /^[\p{L}][\p{L}\p{N}]*(?:[_^](?:[\p{L}\p{N}.]+|\([^()]*\)))*(?:\([^()]*\))?$/u.test(s.slice(0, i)) && !/[+\-*/ ]$/.test(s.slice(0, i)); }
  }
  return false;
}

const wrapBase = (s: string) => (ATOM.test(s) || isFenced(s) || isCall(s) ? s : `(${s})`);
const wrapArg = (s: string) => (ATOM.test(s) ? s : `(${s})`);
const wrapSide = (s: string) => (SIMPLE.test(s) || isFenced(s) || isCall(s) ? s : `(${s})`);

function kindOfString(s: string): Kind {
  if (NUMBER.test(s)) return "num";
  if ([...s].length === 1 && !/\d/.test(s)) return POSTFIX.has(s) ? "post" : "id";
  if (isFenced(s)) return "fenced";
  return "compound";
}

type Tok = { t: "op"; s: string; sp: boolean; inv?: boolean; bare?: boolean } | { t: "p"; p: Piece; sp: boolean; noSep?: boolean };

let depth = 0;

function leafKind(s: string): Kind {
  if (POSTFIX.has(s)) return "post";
  if (NUMBER.test(s)) return "num";
  if ([...s].length === 1 && !/\d/.test(s)) return "id";
  return "word";
}

function tokens(children: (Node | string)[]): Tok[] {
  const out: Tok[] = [];
  let sp = false;
  let noSep = false;
  const addPiece = (p: Piece) => { out.push({ t: "p", p, sp, noSep }); sp = false; noSep = false; };
  for (const c of children) {
    if (typeof c === "string") {
      const d = decode(c);
      if (!/\S/.test(d)) { if (d) sp = true; continue; }
      if (/^\s/.test(d)) sp = true;
      const t = d.trim();
      addPiece({ s: t, kind: leafKind(t) });
      if (/\s$/.test(d)) sp = true;
      continue;
    }
    if (c.name === "mspace") { sp = true; continue; }
    if (c.name === "mo") {
      const raw = decode(rawText(c));
      if (/⁢/.test(raw)) { out.push({ t: "op", s: "", sp, inv: true }); sp = false; continue; }
      if (/⁡|⁣/.test(raw) && !raw.replace(/[⁡⁣\s]/g, "")) { noSep = true; continue; }
      const t = raw.replace(/[⁡⁣]/g, "").trim();
      if (!t) { if (raw) sp = true; continue; }
      if (BIGOP[t]) { addPiece({ s: BIGOP[t], kind: "bigop" }); continue; }
      if (POSTFIX.has(t)) { addPiece({ s: t, kind: "post" }); continue; }
      out.push({ t: "op", s: t, sp }); sp = false;
      continue;
    }
    const p = piece(c);
    if (!p) continue;
    const lead = /^\s/.test(p.s), trail = /\s$/.test(p.s);
    if (!p.s.trim()) { if (p.s) sp = true; continue; }
    if (lead) sp = true;
    addPiece({ ...p, s: p.s.trim() });
    if (trail) sp = true;
  }
  return out;
}

/** Brackets in the token stream become one FENCED piece each; unmatched ones stay literal. */
function group(toks: Tok[]): Tok[] {
  type Frame = { open: Tok & { t: "op" }; items: Tok[] };
  const frames: Frame[] = [{ open: null as never, items: [] }];
  const flatten = (f: Frame, into: Tok[]) => { into.push({ ...f.open, bare: true }, ...f.items); };
  for (const tok of toks) {
    const top = frames[frames.length - 1];
    if (tok.t === "op" && !tok.inv && OPEN.has(tok.s) && !(tok.s === "|" && frames.length > 1 && top.open.s === "|")) {
      frames.push({ open: tok, items: [] });
    } else if (tok.t === "op" && !tok.inv && frames.length > 1 && CLOSER[top.open.s] === tok.s) {
      frames.pop();
      const inner = assemble(top.items, {});
      frames[frames.length - 1].items.push({ t: "p", p: { s: `${top.open.s}${inner}${tok.s}`, kind: "fenced" }, sp: top.open.sp });
    } else if (tok.t === "op" && !tok.inv && (tok.s === ")" || tok.s === "]" || tok.s === "}")) {
      top.items.push({ ...tok, bare: true });
    } else top.items.push(tok);
  }
  while (frames.length > 1) { const f = frames.pop()!; flatten(f, frames[frames.length - 1].items); }
  return frames[0].items;
}

function joinSep(a: Piece, b: Piece, sp: boolean, noSep: boolean): string {
  if (noSep) return "";
  if (b.kind === "post") return sp ? " " : "";
  if (sp || a.kind === "bigop" || a.kind === "post") return " ";
  if (a.kind === "word" || b.kind === "word") return a.kind === "word" && b.kind === "fenced" ? "" : " "; // sin (x) reads as the call sin(x)
  if (a.kind === "fn" && b.kind === "fenced") return "";
  const simpleA = a.kind === "num" || a.kind === "id";
  if (simpleA && b.kind === "num") return a.kind === "num" ? " " : " * ";
  if (simpleA && (b.kind === "id" || b.kind === "fenced")) return "";
  return " * ";
}

function assemble(toksIn: Tok[], opts: { script?: boolean; cell?: boolean }): string {
  // mixed number: a whole number directly followed by a fraction of two plain numbers
  const toks: Tok[] = [];
  for (const t of group(toksIn)) {
    const prev = toks[toks.length - 1];
    if (t.t === "p" && t.p.kind === "frac" && t.p.numfrac && !t.sp && prev && prev.t === "p" && prev.p.kind === "num" && !prev.p.s.includes("/")) {
      toks[toks.length - 1] = { t: "p", p: { s: `(${prev.p.s} + ${t.p.s})`, kind: "fenced" }, sp: prev.sp, noSep: prev.noSep };
    } else toks.push(t);
  }
  const sep: string[] = toks.map(() => "");
  const wrap: boolean[] = toks.map(() => false);
  for (let i = 1; i < toks.length; i++) {
    const a = toks[i - 1], b = toks[i];
    if (a.t === "p" && b.t === "p") {
      sep[i] = joinSep(a.p, b.p, b.sp, !!b.noSep);
      if (sep[i] === " * ") { if (a.p.kind === "frac") wrap[i - 1] = true; if (b.p.kind === "frac") wrap[i] = true; }
    }
  }
  let out = "";
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.t === "p") { out += sep[i] + (wrap[i] ? `(${t.p.s})` : t.p.s); continue; }
    const prev = toks[i - 1], next = toks[i + 1];
    if (t.inv) { if (prev?.t === "p" && next?.t === "p") out += "*"; continue; }
    if (t.bare) { out += t.s; continue; }
    if (t.s === "," || t.s === ";") { out += `${t.s} `; continue; }
    const left = (prev !== undefined && (prev.t === "p" || !!prev.bare)) || (opts.cell && i === 0);
    if (left) { out += opts.script && !next ? t.s : ` ${t.s} `; continue; }
    out += UNARY.has(t.s) ? t.s : ` ${t.s} `;
  }
  return out;
}

const row = (children: (Node | string)[], opts: { script?: boolean; cell?: boolean } = {}) => assemble(tokens(children), opts);

/** A script argument: rows get charge-style signs ("2+", "-1") and are bracketed unless a single atom. */
function scriptArg(n: Node | undefined): string {
  if (!n) return "";
  const s = (n.name === "mrow" ? row(n.children, { script: true }) : render(n)).trim();
  return wrapArg(s);
}

function bigName(n: Node | undefined): string | null {
  if (!n || n.name !== "mo") return null;
  return BIGOP[decode(rawText(n)).trim()] ?? null;
}

function bigOp(name: string, lo: Node | undefined, hi: Node | undefined): Piece {
  const l = lo ? render(lo).trim() : "", h = hi ? render(hi).trim() : "";
  return { s: `${name}(${l}${l && h ? " to " : h ? "to " : ""}${h})`, kind: "bigop" };
}

function render(n: Node): string {
  return piece(n)?.s ?? "";
}

function piece(n: Node): Piece | null {
  if (++depth > MAX_DEPTH) { depth = 0; throw new Error("too deep"); }
  try {
    return piece1(n);
  } finally { depth = Math.max(0, depth - 1); }
}

function piece1(n: Node): Piece | null {
  const k = kids(n);
  const r = (i: number) => (k[i] ? render(k[i]).trim() : "");
  const done = (s: string, kind?: Kind): Piece => ({ s, kind: kind ?? kindOfString(s.trim()) });
  switch (n.name) {
    case "annotation": case "annotation-xml": case "mspace": case "none": case "mprescripts": case "mphantom": return null;
    case "mn": case "mi": case "mtext": {
      const raw = decode(rawText(n));
      const t = raw.trim();
      if (!t) return { s: raw ? " " : "", kind: "word" };
      return { s: raw.replace(/\s+/g, (w) => w), kind: leafKind(t) };
    }
    case "mo": return done(row([n]));
    case "mfrac": {
      const a = r(0), b = r(1);
      return { s: `${wrapSide(a)}/${wrapSide(b)}`, kind: "frac", numfrac: NUMBER.test(a) && NUMBER.test(b) && !a.startsWith("-") };
    }
    case "msqrt": return { s: `sqrt(${row(n.children)})`, kind: "compound" };
    case "mroot": return { s: `root(${r(0)}, ${r(1)})`, kind: "compound" };
    case "msup": case "msub": case "msubsup": {
      const big = bigName(k[0]);
      if (big) return bigOp(big, n.name === "msup" ? undefined : k[1], n.name === "msup" ? k[1] : n.name === "msubsup" ? k[2] : undefined);
      const base = r(0);
      const sub = n.name !== "msup" ? `_${scriptArg(k[1])}` : "";
      const sup = n.name === "msup" ? `^${scriptArg(k[1])}` : n.name === "msubsup" ? `^${scriptArg(k[2])}` : "";
      const word = /^\p{L}{2,}$/u.test(base);
      return { s: `${wrapBase(base)}${sub}${sup}`, kind: word && n.name !== "msubsup" ? "fn" : "compound" };
    }
    case "mover": case "munder": case "munderover": {
      const big = bigName(k[0]);
      if (big) return bigOp(big, n.name === "mover" ? undefined : k[1], n.name === "munderover" ? k[2] : n.name === "mover" ? k[1] : undefined);
      const base = r(0);
      const mark = k[1] && k[1].name === "mo" ? decode(rawText(k[1])).trim() : "";
      if (n.name === "mover" && VEC.has(mark)) return { s: `vec(${base})`, kind: "compound" };
      if (n.name === "mover" && BAR.has(mark)) return { s: `bar(${base})`, kind: "compound" };
      if (n.name === "munderover") return { s: `${base} under ${r(1)} over ${r(2)}`, kind: "compound" };
      return { s: `${base} ${n.name === "mover" ? "over" : "under"} ${r(1)}`, kind: "compound" };
    }
    case "mmultiscripts": {
      const base = r(0);
      const split = k.findIndex((c) => c.name === "mprescripts");
      const post = k.slice(1, split < 0 ? undefined : split);
      const pre = split < 0 ? [] : k.slice(split + 1);
      const s = (xs: Node[], i: number) => (xs[i] ? render(xs[i]).trim() : "");
      const preSub = s(pre, 0), preSup = s(pre, 1), postSub = s(post, 0), postSup = s(post, 1);
      const simple = [preSub, base, postSub].every((x) => x === "" || ATOM.test(x));
      let out = simple ? `${preSub}${base}${postSub}` : `${preSub ? `(${preSub})` : ""}${base}${postSub ? `(${postSub})` : ""}`;
      if (preSup) out = `^${wrapArg(preSup)}${out}`;
      if (postSup) out += `^${wrapArg(postSup)}`;
      return { s: out, kind: "compound" };
    }
    case "mfenced": {
      const open = attr(n, "open") ?? "(", close = attr(n, "close") ?? ")", seps = (attr(n, "separators") ?? ",").replace(/\s+/g, "");
      let inner: string;
      if (k.length === 1 || k.some((c) => c.name === "mo")) inner = row(n.children).trim();
      else inner = k.map((c, i) => render(c).trim() + (i < k.length - 1 ? (seps ? seps[Math.min(i, seps.length - 1)] + " " : " ") : "")).join("");
      return { s: `${open}${inner}${close}`, kind: "fenced" };
    }
    case "mtable": {
      const rows = k.filter((c) => c.name === "mtr" || c.name === "mlabeledtr").map((tr) =>
        kids(tr).filter((c) => c.name === "mtd").map((td, i) => row(td.children, { cell: i > 0 })).join(" "));
      return { s: `\n${rows.join("\n")}\n`, kind: "compound" };
    }
    case "semantics": {
      const first = k.find((c) => c.name !== "annotation" && c.name !== "annotation-xml");
      return first ? piece(first) : null;
    }
    default: {
      const s = row(n.children).trim();
      return done(s);
    }
  }
}

function fallback(xml: string): string {
  return decode(xml.slice(0, MAX_INPUT).replace(/<(annotation|annotation-xml)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/[ \t\r\n ]+/g, " ").trim();
}

/** Converts one `<math …>…</math>` (or its inner MathML) to linear text. Never throws. */
export function mathmlToText(mathXml: string): string {
  if (mathXml.length > MAX_INPUT) return fallback(mathXml);
  try {
    depth = 0;
    const root = parse(mathXml);
    const top = kids(root).length === 1 && root.children.length === 1 && kids(root)[0].name === "math" ? kids(root)[0].children : root.children;
    return row(top)
      .split("\n")
      .map((l) => l.replace(/[ \t ]+/g, " ").trim())
      .filter(Boolean)
      .join("\n")
      .trim();
  } catch {
    return fallback(mathXml);
  } finally {
    depth = 0;
  }
}
