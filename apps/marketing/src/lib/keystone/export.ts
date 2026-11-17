import JSZip from "jszip";
import { ITEM_TYPE_LABEL, SECTION_TITLE, answerSeenBy, releasedVersionOf } from "./config";
import { ks, type ItemDoc, type SolutionDoc } from "./db";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR, readAsset } from "./assets";
import { renderForSolaro, toXhtml, type Png } from "./solaro";

// Package of approved solutions for SOLARO (Vance's import format, 2026-10-22/23):
// no MathML, every equation a PNG img.mathml with inline vertical-align and a
// linear alt text, figures as PNG ≤ 240 px, no stylesheet of ours.
//
//   <itemId>/solution.html          XHTML fragment page: div.solution_step > div.step_text > p (section title) + content
//   <itemId>/resources/*.png        equations, figures and images the solution uses
//   <itemId>/item_<itemId>.zip      QTI 2.1 package (items that arrived as QTI): their item with our
//                                   solution as modalFeedback "solution" — one file per question
//   <itemId>/solution.md, item.json source and facts
//   manifest.csv, README.txt

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Built = { html: string; files: Png[]; images: string[] };

/** Renders every section of one solution for SOLARO. */
async function build(item: ItemDoc, sol: SolutionDoc): Promise<{ sections: { title: string; html: string }[]; files: Png[]; images: string[] }> {
  const images = new Set<string>();
  const resolveImage = (src: string) => {
    const f = src.split("/").pop()!;
    images.add(f);
    return `resources/${f}`;
  };
  const files: Png[] = [];
  const sections: { title: string; html: string }[] = [];
  for (const s of sol.sections) {
    const r: Omit<Built, "images"> = await renderForSolaro(s.md, `${item.itemId}-${s.kind}`, resolveImage);
    files.push(...r.files);
    sections.push({ title: SECTION_TITLE[s.kind], html: toXhtml(r.html) });
  }
  return { sections, files, images: [...images] };
}

function solutionPage(item: ItemDoc, version: number, sections: { title: string; html: string }[]): string {
  const steps = sections
    .map(
      (s) => `<div class="solution_step">
<div class="step_text">
<p><strong>${esc(s.title)}</strong></p>
${s.html.trim()}
</div>
</div>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-CA">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Item ${esc(item.itemId)} solution</title>
</head>
<body>
<!-- Item ${esc(item.itemId)} · ${esc(item.subject)} · ${esc(item.course)} · ${esc(ITEM_TYPE_LABEL[item.itemType] ?? item.itemType)} · Evelyn solution v${version} -->
${steps}
</body>
</html>
`;
}

/** Their QTI item with our solution in modalFeedback "solution" (theirs replaced). */
function qtiItem(apip: string, sections: { title: string; html: string }[]): string {
  // QTI body elements take no style attribute; vertical-align lives in solution.html only.
  const body = sections
    .map((s) => `<div class="step"><div class="text">${esc(s.title)}</div>${s.html.replace(/\sstyle="[^"]*"/g, "").trim()}</div>`)
    .join("");
  const feedback = `<modalFeedback outcomeIdentifier="FEEDBACK" showHide="show" identifier="solution">${body}</modalFeedback>`;
  if (/<modalFeedback\b[^>]*identifier="solution"[\s\S]*?<\/modalFeedback>/.test(apip)) {
    return apip.replace(/<modalFeedback\b[^>]*identifier="solution"[^>]*>[\s\S]*?<\/modalFeedback>/, feedback);
  }
  return apip.replace(/<\/assessmentItem>\s*$/, `${feedback}</assessmentItem>`);
}

function qtiManifest(itemId: string, files: string[]): string {
  const deps = files.map((f) => `<file href="${esc(f)}" />`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><manifest xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" identifier="Manifest_${itemId}"><metadata><schema>QTIv2.1 Package</schema><schemaversion>1.0.0</schemaversion></metadata><organizations /><resources><resource identifier="item_${itemId}" type="imsqti_item_xmlv2p1" href="item_${itemId}_apip.xml"><file href="item_${itemId}_apip.xml" /><file href="item_${itemId}_metadata.xml" />${deps}</resource></resources></manifest>`;
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function buildExport(itemIds: string[]): Promise<Uint8Array> {
  const { Item, Solution, Activity } = await ks();
  const items = await Item.find({ itemId: { $in: itemIds } }).sort({ order: 1 }).lean<ItemDoc[]>();
  const zip = new JSZip();
  const manifest = [["item_id", "subject", "course", "item_type", "key", "evelyn_answer", "version", "approved_at", "sections", "qti_package", "animated"]];

  for (const raw of items) {
    // Only what Castle Rock has seen goes out: the released version and the answer released with it.
    const released = releasedVersionOf(raw);
    if (!released) continue;
    const item: ItemDoc = { ...raw, version: released, evelynAnswer: answerSeenBy(raw, "tech") };
    const sol = await Solution.findOne({ itemId: item.itemId, version: released }).lean<SolutionDoc>();
    if (!sol) continue;
    const approval = await Activity.findOne({ itemId: item.itemId, type: "verdict", verdict: "approved" }).sort({ createdAt: -1 }).lean();
    const approvedAt = approval?.createdAt ? new Date(approval.createdAt).toISOString() : "";
    const dir = zip.folder(item.itemId)!;
    const { sections, files, images } = await build(item, sol);

    dir.file("solution.html", solutionPage(item, sol.version, sections));
    for (const f of files) dir.file(`resources/${f.name}`, f.data);
    for (const f of images) {
      const data = await readAsset(item.itemId, f);
      if (data) dir.file(`resources/${f}`, data);
    }
    // Animated (voiced) version, self-contained: entry html + audio, relative paths.
    let animated = "";
    if (item.player?.entry) {
      const root = path.join(DATA_DIR, "assets", item.itemId, "player");
      const walk = async (rel: string): Promise<void> => {
        for (const e of await readdir(path.join(root, rel), { withFileTypes: true })) {
          const r = rel ? `${rel}/${e.name}` : e.name;
          if (e.name.startsWith(".")) continue;
          if (e.isDirectory()) await walk(r);
          else dir.file(`animated/${r}`, await readFile(path.join(root, r)));
        }
      };
      try {
        await walk("");
        animated = `animated/${item.player.entry}`;
      } catch {
        animated = "";
      }
    }
    dir.file("solution.md", sol.sections.map((s) => `## ${SECTION_TITLE[s.kind]}\n\n${s.md}\n`).join("\n"));

    let qtiName = "";
    if (item.qti?.apip) {
      const q = new JSZip();
      q.file(`item_${item.itemId}_apip.xml`, qtiItem(item.qti.apip, sections));
      q.file(`item_${item.itemId}_metadata.xml`, item.qti.metadata || "<metadata />");
      const resources: string[] = [];
      for (const p of item.qti.passages ?? []) {
        q.file(p.file, p.xml);
        resources.push(p.file);
      }
      for (const ref of item.qti.resources ?? []) {
        const data = await readAsset(item.itemId, ref.split("/").pop()!);
        if (data) {
          q.file(ref, data);
          resources.push(ref);
        }
      }
      for (const f of files) {
        q.file(`resources/${f.name}`, f.data);
        resources.push(`resources/${f.name}`);
      }
      for (const f of images) {
        const data = await readAsset(item.itemId, f);
        if (data && !resources.includes(`resources/${f}`)) {
          q.file(`resources/${f}`, data);
          resources.push(`resources/${f}`);
        }
      }
      q.file("imsmanifest.xml", qtiManifest(item.itemId, resources));
      qtiName = `item_${item.itemId}.zip`;
      dir.file(qtiName, await q.generateAsync({ type: "uint8array", compression: "DEFLATE" }));
    }

    dir.file(
      "item.json",
      JSON.stringify(
        {
          itemId: item.itemId,
          subject: item.subject,
          course: item.course,
          itemType: item.itemType,
          key: item.key,
          evelynAnswer: item.evelynAnswer,
          version: sol.version,
          approvedAt,
          sections: sol.sections.map((s) => s.kind),
          qtiPackage: qtiName || null,
          animated: animated || null,
        },
        null,
        2,
      ),
    );
    manifest.push([
      item.itemId,
      item.subject,
      item.course,
      item.itemType,
      item.key,
      item.evelynAnswer,
      String(sol.version),
      approvedAt,
      sol.sections.map((s) => s.kind).join("/"),
      qtiName,
      animated,
    ]);
  }

  zip.file("manifest.csv", manifest.map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  zip.file(
    "README.txt",
    [
      "Approved AI solutions for SOLARO, from Keystone (Evelyn Learning).",
      "",
      "One folder per item:",
      "  solution.html   the solution as XHTML: each section is",
      "                  div.solution_step > div.step_text > p (section title) followed by its paragraphs.",
      "                  No stylesheet and no MathML. Every equation is a PNG img class=\"mathml\"",
      "                  with an inline vertical-align and a linear alt text for screen readers.",
      "  resources/      the equation PNGs (2x pixels, shown at 12 pt via width/height), figure PNGs",
      "                  (240 px wide or less) and any images. Transparent backgrounds.",
      "  item_<id>.zip   for items that came from a SOLARO QTI export: the same QTI 2.1 package with",
      "                  our solution as modalFeedback \"solution\" (div.step > div.text), one file per question.",
      "  animated/       (some items) the animated, voiced version: a self-contained page + audio,",
      "                  no outside calls; it can be shown in an iframe (height in item.json).",
      "  solution.md     the source text; item.json the key, our answer, version and approval time.",
      "",
      "manifest.csv lists every item in this download.",
      "",
    ].join("\n"),
  );

  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}
