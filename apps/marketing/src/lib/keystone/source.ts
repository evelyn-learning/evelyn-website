// Castle Rock's own source file for an item (item_<id>_original.txt, sent in each QTI zip since 2026-11-23).
//
// It is the XML their QTI exporter starts from: Preamble, QuestionStem, Postamble, the choices (Distractor
// Identifier="A" Correct="true|false") or a numerical answer, and their solution. Two uses:
//   1. checkAgainstSource: what reached us through the QTI export is compared with it (text, choices, key, the
//      images a student sees). A difference is a finding shown on the item page and stops the pipeline at intake.
//   2. recoverChoices: when the exporter dropped a multiple-choice item's choices (it writes "Unknown
//      Tech-Enchanced Item" and no interaction), the choices and key are taken from here (Praveen, 2026-11-23).
// Localised variants (<localization><defaulttext>…</defaulttext><translation region="…">…</translation>) are read as
// their default text, which is what the QTI export uses.

import { decodeHTML } from "entities";
import { toHtml } from "./qti";

export type SourceChoice = { label: string; correct: boolean; html: string };
export type SourceItem = {
  /** Student-facing parts as HTML (images point at resources/<file> in the zip when the file is there). */
  preamble: string;
  stem: string;
  postamble: string;
  choices: SourceChoice[];
  /** Numerical response answer, when the item is one. */
  numeric?: string;
  /** Base names (Image_123) of the images a student sees, default text only. */
  images: string[];
};

const XML_KEEP = new Set(["lt", "gt", "amp", "quot", "apos"]);

/** Named entities (the file's own DOCTYPE first, then HTML5's) as numeric references; the five XML ones are left. */
function resolveEntities(xml: string): string {
  const declared = new Map<string, string>();
  for (const m of xml.matchAll(/<!ENTITY\s+(\w+)\s+"([^"]*)"\s*>/g)) declared.set(m[1], m[2]);
  return xml.replace(/&([A-Za-z][A-Za-z0-9]*);/g, (all, name: string) => {
    if (XML_KEEP.has(name)) return all;
    const d = declared.get(name);
    if (d !== undefined) return d;
    const ch = decodeHTML(all);
    return ch === all ? all : [...ch].map((c) => `&#x${c.codePointAt(0)!.toString(16)};`).join("");
  });
}

/** Image_123_456789012_high.tif → Image_123 */
export const imageBase = (file: string) => file.split(/[?#]/)[0].split("/").pop()!.replace(/(_\d{8,})?(_high)?\.[a-z0-9]+$/i, "");

const part = (xml: string, tag: string) => xml.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";

/** A source fragment as the same HTML the QTI reader makes: default text only, no wrappers, images on resources/. */
function fragment(xml: string, zipFiles: string[]): string {
  const byBase = new Map(zipFiles.map((f) => [imageBase(f), f]));
  const html = xml
    .replace(/<localization>\s*<defaulttext>([\s\S]*?)<\/defaulttext>[\s\S]*?<\/localization>/g, "$1")
    .replace(/<\/?html\b[^>]*>/g, "")
    .replace(/<\/?mathml>/g, "")
    .replace(/\sasciimath="[^"]*"/g, "")
    .replace(/<(\/?)aligncenter\b/g, '<$1div class="aligncenter"')
    .replace(/<img\b([^>]*)>/g, (_all, attrs: string) => {
      const src = attrs.match(/\bsrc="([^"]*)"/)?.[1] ?? attrs.match(/\bid="([^"]*)"/)?.[1] ?? "";
      const file = byBase.get(imageBase(src));
      const rest = attrs.replace(/\s(src|highresSrc|highresWidth|highresHeight)="[^"]*"/g, "");
      return file ? `<img src="resources/${file}"${rest}>` : `<img data-missing="${imageBase(src)}"${rest}>`;
    });
  return toHtml(html);
}

/** Reads the source file. Returns null when it is not Castle Rock's item source (no <Item_ID>). */
export function readSource(text: string, zipFiles: string[] = []): SourceItem | null {
  const xml = resolveEntities(text);
  if (!/<Item_ID>/.test(xml)) return null;
  const visible = ["Preamble", "QuestionStem", "Postamble"].map((t) => part(xml, t));
  const choices: SourceChoice[] = [...xml.matchAll(/<Distractor\b[^>]*\bIdentifier="([^"]+)"[^>]*\bCorrect="([^"]+)"[^>]*>([\s\S]*?)<\/Distractor>/g)].map((m) => ({
    label: m[1],
    correct: m[2].toLowerCase() === "true",
    html: fragment(part(m[3], "DistractorContent"), zipFiles),
  }));
  const numeric = part(part(xml, "Numerical_Response"), "Answer").trim();
  // Images a student sees: in the default text of the visible parts and the choices.
  const shown = [...visible, ...[...xml.matchAll(/<DistractorContent>([\s\S]*?)<\/DistractorContent>/g)].map((m) => m[1])]
    .join("\n")
    .replace(/<localization>\s*<defaulttext>([\s\S]*?)<\/defaulttext>[\s\S]*?<\/localization>/g, "$1");
  const images = [...new Set([...shown.matchAll(/<img\b[^>]*>/g)].map((m) => imageBase(m[0].match(/\bsrc="([^"]*)"/)?.[1] ?? m[0].match(/\bid="([^"]*)"/)?.[1] ?? "")).filter(Boolean))];
  return {
    preamble: fragment(visible[0], zipFiles),
    stem: fragment(visible[1], zipFiles),
    postamble: fragment(visible[2], zipFiles),
    choices,
    ...(numeric ? { numeric: decodeHTML(numeric) } : {}),
    images,
  };
}

const plain = (html: string) =>
  decodeHTML(html.replace(/<annotation\b[\s\S]*?<\/annotation>/g, "").replace(/<[^>]+>/g, " "))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export type QtiView = {
  questionHtml: string;
  options: { label: string; html: string }[];
  /** Interactions as stored (their HTML is searched for text and images). */
  interactions: unknown[];
  key: string;
  itemType: string;
};

/**
 * What differs between the item as the QTI export gave it and Castle Rock's source. Each finding is one plain
 * sentence for the item page. Empty: they agree.
 */
export function checkAgainstSource(q: QtiView, src: SourceItem): string[] {
  const out: string[] = [];
  const shownHtml = [q.questionHtml, ...q.options.map((o) => o.html), JSON.stringify(q.interactions ?? [])].join("\n");
  const shownText = plain(shownHtml);
  const names: [string, string][] = [["preamble", src.preamble], ["question", src.stem], ["text after the question", src.postamble]];
  for (const [name, html] of names) {
    const t = plain(html);
    if (t && !shownText.includes(t)) out.push(`The ${name} differs from Castle Rock's source.`);
  }
  if (src.choices.length) {
    if (q.options.length !== src.choices.length) out.push(`The source has ${src.choices.length} choices; the QTI export has ${q.options.length}.`);
    else
      for (const c of src.choices) {
        const o = q.options.find((x) => x.label === c.label);
        if (!o) out.push(`Choice ${c.label} is in the source but not in the QTI export.`);
        else if (plain(o.html) !== plain(c.html)) out.push(`Choice ${c.label} differs from the source.`);
      }
    const correct = src.choices.filter((c) => c.correct).map((c) => c.label).join(",");
    if (correct && q.key && q.key !== correct) out.push(`The key is ${q.key} in the QTI export but ${correct} in the source.`);
  }
  if (src.numeric && q.key && q.key.trim() !== src.numeric.trim()) out.push(`The answer is ${q.key} in the QTI export but ${src.numeric} in the source.`);
  const shownImages = new Set([...shownHtml.matchAll(/<img\b[^>]*\bsrc=\\?"([^"\\]+)/g)].map((m) => imageBase(m[1])));
  const lost = src.images.filter((b) => !shownImages.has(b));
  if (lost.length) out.push(`The source shows ${lost.length === 1 ? "an image" : "images"} the QTI export does not: ${lost.join(", ")}.`);
  return out;
}

/** Multiple choice whose choices the exporter dropped: the choices and key from the source, or null when it cannot help. */
export function recoverChoices(src: SourceItem): { options: { label: string; html: string }[]; key: string; itemType: string } | null {
  if (src.choices.length < 2) return null;
  if (src.choices.some((c) => /data-missing=/.test(c.html))) return null; // an image a choice needs is not in the zip
  const correct = src.choices.filter((c) => c.correct).map((c) => c.label);
  if (!correct.length) return null;
  return { options: src.choices.map((c) => ({ label: c.label, html: c.html })), key: correct.join(","), itemType: correct.length > 1 ? "MS" : "MC" };
}
