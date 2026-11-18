// Presentation MathML -> unambiguous linear text, so the models read "3/4" and
// "sqrt(2)" rather than the digits and letters left after tags are stripped.
// A small recursive-descent converter: tokenise the tags, build a tree, render.
// No dependencies, no `next/*` imports.

type Node = { name: string; attrs: string; children: (Node | string)[] };

const SPECIAL: Record<string, string> = {
  "−": "-", "×": "×", "⋅": "·", "·": "·", "≤": "≤", "≥": "≥", "≠": "≠",
  "≐": "≈", "≈": "≈", "∞": "∞", "°": "°", "π": "π", " ": " ",
};
const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", minus: "−", times: "×", middot: "·", deg: "°", pi: "π", le: "≤", ge: "≥", ne: "≠", infin: "∞" };

function decode(s: string): string {
  const d = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : all;
    }
    return NAMED[e.toLowerCase()] ?? all;
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
      // close: pop to the matching open element, if any
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].name === name) { stack.length = i; break; }
    } else {
      const n: Node = { name, attrs: m[3], children: [] };
      top.children.push(n);
      if (!m[4]) stack.push(n);
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
const single = (s: string) => /^[\p{L}\p{N}.]+$/u.test(s);
const wrap = (s: string) => (single(s) ? s : `(${s})`);

const OPEN = new Set(["(", "[", "{", "|"]);
const CLOSE = new Set([")", "]", "}"]);
const POSTFIX = new Set(["!", "°", "%", "\u2032", "\u2033"]);
const VEC = new Set(["→", "⃗", "⇀", "->"]);
const BAR = new Set(["¯", "‾", "―", "_", "-", "−", "̅", "─"]);

function moText(n: Node): string {
  return decode(rawText(n)).replace(/\s+/g, " ").trim();
}

function row(nodes: Node[]): string {
  type Piece = { s: string; op: boolean; open?: boolean; close?: boolean; invTimes?: boolean };
  const pieces: Piece[] = [];
  for (const c of nodes) {
    if (c.name === "mo") {
      const raw = decode(rawText(c));
      const t = decode(raw).replace(/⁡|⁣/g, "").trim();
      if (/⁢/.test(raw)) pieces.push({ s: "", op: true, invTimes: true });
      else if (/^\s*⁡\s*$/.test(raw) || /^\s*⁣\s*$/.test(raw) || !t) continue;
      else pieces.push({ s: t, op: true, open: OPEN.has(t), close: CLOSE.has(t) });
    } else pieces.push({ s: render(c), op: false });
  }
  let out = "";
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const prev = pieces[i - 1];
    const next = pieces[i + 1];
    if (!p.op) { out += p.s; continue; }
    if (p.invTimes) { if (prev && next && !prev.op && !next.op) out += "*"; continue; }
    if (p.open || p.close) { out += p.s; continue; }
    if (p.s === "," || p.s === ";") { out += `${p.s} `; continue; }
    const leftOperand = prev && (!prev.op || prev.close);
    if (leftOperand && !POSTFIX.has(p.s)) out += ` ${p.s} `; // a trailing "=" (aligned equations) is still spaced
    else out += p.s; // unary prefix (-3) or postfix (5!, 30°)
  }
  return out;
}

function render(n: Node | string): string {
  if (typeof n === "string") return decode(n).replace(/[ \t\r\n]+/g, (w) => (w.includes(" ") ? " " : " "));
  const k = kids(n);
  const r = (i: number) => (k[i] ? render(k[i]) : "");
  switch (n.name) {
    case "annotation": case "annotation-xml": case "mspace": case "none": case "mprescripts": case "mphantom": return "";
    case "mn": case "mi": case "mtext": return decode(rawText(n));
    case "mo": return row([n]);
    case "mfrac": { const a = r(0), b = r(1); return single(a) && single(b) ? `${a}/${b}` : `(${a})/(${b})`; }
    case "msqrt": return `sqrt(${row(k)})`;
    case "mroot": return `root(${r(0)}, ${r(1)})`;
    case "msup": return `${r(0)}^${wrap(r(1))}`;
    case "msub": return `${r(0)}_${wrap(r(1))}`;
    case "msubsup": return `${r(0)}_${wrap(r(1))}^${wrap(r(2))}`;
    case "mover": case "munder": {
      const base = r(0);
      const mark = k[1] && k[1].name === "mo" ? moText(k[1]) : "";
      if (n.name === "mover" && VEC.has(mark)) return `vec(${base})`;
      if (n.name === "mover" && BAR.has(mark)) return `bar(${base})`;
      return `${base} ${n.name === "mover" ? "over" : "under"} ${r(1)}`;
    }
    case "munderover": return `${r(0)} under ${r(1)} over ${r(2)}`;
    case "mmultiscripts": {
      const base = r(0);
      const split = k.findIndex((c) => c.name === "mprescripts");
      const post = k.slice(1, split < 0 ? undefined : split);
      const pre = split < 0 ? [] : k.slice(split + 1);
      const s = (xs: Node[], i: number) => (xs[i] ? render(xs[i]) : "");
      const preSub = s(pre, 0), preSup = s(pre, 1), postSub = s(post, 0), postSup = s(post, 1);
      const simple = [preSub, base, postSub].every((x) => x === "" || single(x));
      let out = simple ? `${preSub}${base}${postSub}` : `${preSub ? `(${preSub})` : ""}${base}${postSub ? `(${postSub})` : ""}`;
      if (preSup) out = `^${wrap(preSup)}${out}`;
      if (postSup) out += `^${wrap(postSup)}`;
      return out;
    }
    case "mfenced": {
      const open = attr(n, "open") ?? "(", close = attr(n, "close") ?? ")", seps = attr(n, "separators") ?? ",";
      const sepChars = seps.replace(/\s+/g, "");
      const parts = k.map((c, i) => render(c) + (i < k.length - 1 ? (sepChars ? sepChars[Math.min(i, sepChars.length - 1)] + " " : "") : ""));
      return `${open}${parts.join("")}${close}`;
    }
    case "mtable": {
      const rows = k.filter((c) => c.name === "mtr" || c.name === "mlabeledtr").map((tr) => kids(tr).filter((c) => c.name === "mtd").map(render).join(" "));
      return `\n${rows.join("\n")}\n`;
    }
    case "semantics": return k[0] ? render(k[0]) : "";
    default: return row(k.length ? k : []) || (k.length ? "" : decode(rawText(n)));
  }
}

/** Converts one `<math …>…</math>` (or its inner MathML) to linear text. */
export function mathmlToText(mathXml: string): string {
  const root = parse(mathXml);
  const top = kids(root);
  const body = top.length === 1 && top[0].name === "math" ? kids(top[0]) : top;
  const text = body.length === 1 ? render(body[0]) : row(body);
  return text
    .split("\n")
    .map((l) => l.replace(/[ \t ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}
