import matter from "gray-matter";
import { SECTIONS, type SectionKind } from "./config";

// Parses one authored item file (docs/whitelabel/castle-rock/keystone/FORMAT.md):
// YAML front matter + "## Question", "## Options", and the five solution
// sections. Rendering happens later (render.ts) so this stays pure.

export type ParsedItem = {
  meta: {
    itemId: string;
    subject: string;
    course: string;
    grade?: number;
    itemType: string;
    key: string;
    evelynAnswer: string;
    keySource: "castle-rock" | "evelyn";
    topic: string;
    standards: string[];
    priorStatus?: string;
    reviewNote?: string;
  };
  questionMd: string;
  options: { label: string; md: string }[];
  sections: { kind: SectionKind; md: string }[];
};

const HEADING_TO_KIND: Record<string, SectionKind | "question" | "options"> = {
  question: "question",
  options: "options",
  "short answer": "short",
  "diploma answer": "diploma",
  "diploma-style answer": "diploma",
  "diploma style answer": "diploma",
  "extended answer": "extended",
  "alternate answer": "alternate",
  "alternate answers": "alternate",
  "alternate answer(s)": "alternate",
  "common errors": "errors",
};

export function parseItemFile(source: string): ParsedItem {
  const { data, content } = matter(source);
  const itemId = String(data.itemId ?? "").trim();
  if (!itemId) throw new Error("itemId missing in front matter");

  // Split on level-2 headings, but not inside fenced blocks.
  const parts: { heading: string; body: string[] }[] = [];
  let fence = false;
  for (const line of content.replace(/\r\n/g, "\n").split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const h = !fence && line.match(/^##\s+(.+?)\s*$/);
    if (h) parts.push({ heading: h[1], body: [] });
    else if (parts.length) parts[parts.length - 1].body.push(line);
  }

  let questionMd = "";
  let options: ParsedItem["options"] = [];
  const found = new Map<SectionKind, string>();
  for (const p of parts) {
    const kind = HEADING_TO_KIND[p.heading.toLowerCase()];
    if (!kind) throw new Error(`${itemId}: unknown section "${p.heading}"`);
    const body = p.body.join("\n").trim();
    if (kind === "question") questionMd = body;
    else if (kind === "options") options = parseOptions(body);
    else if (body) found.set(kind, body);
  }
  if (!questionMd) throw new Error(`${itemId}: no Question section`);

  return {
    meta: {
      itemId,
      subject: String(data.subject ?? ""),
      course: String(data.course ?? ""),
      grade: data.grade != null && data.grade !== "" ? Number(data.grade) : undefined,
      itemType: String(data.itemType ?? ""),
      key: String(data.key ?? ""),
      evelynAnswer: String(data.evelynAnswer ?? ""),
      keySource: data.keySource === "castle-rock" ? "castle-rock" : "evelyn",
      topic: String(data.topic ?? ""),
      standards: Array.isArray(data.standards) ? data.standards.map(String) : [],
      priorStatus: data.priorStatus ? String(data.priorStatus) : undefined,
      reviewNote: data.reviewNote ? String(data.reviewNote) : undefined,
    },
    questionMd,
    options,
    sections: SECTIONS.filter((k) => found.has(k)).map((k) => ({ kind: k, md: found.get(k)! })),
  };
}

function parseOptions(body: string): { label: string; md: string }[] {
  const out: { label: string; md: string }[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*[-*]\s*([A-Z])[).:]\s*(.*)$/);
    if (m) out.push({ label: m[1], md: m[2].trim() });
    else if (out.length && line.trim()) out[out.length - 1].md += `\n${line.trim()}`;
  }
  return out;
}
