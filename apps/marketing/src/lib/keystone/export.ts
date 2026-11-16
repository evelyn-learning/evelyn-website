import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { ITEM_TYPE_LABEL, SECTION_TITLE } from "./config";
import { ks, type ItemDoc, type SolutionDoc } from "./db";
import { ASSET_ROUTE, readAsset } from "./assets";

// Package of approved solutions for SOLARO. One folder per item:
//   <itemId>/solution.html   the five sections as div.solution_step > div.step_text (Vance's markup)
//   <itemId>/resources/*     figures and images the solution uses
//   <itemId>/solution.md     the source, for re-use
//   <itemId>/item.json       id, key, our answer, course, version, approval date
// plus manifest.csv and katex/ (stylesheet + fonts the equations need).

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function solutionHtml(item: ItemDoc, sol: SolutionDoc): { html: string; assets: string[] } {
  const assets = new Set<string>();
  const fix = (h: string) =>
    h.replace(new RegExp(`${ASSET_ROUTE}/${item.itemId}/([A-Za-z0-9._-]+)`, "g"), (_m, f: string) => {
      assets.add(f);
      return `resources/${f}`;
    });
  const steps = sol.sections
    .map(
      (s) => `<div class="solution_step">
  <div class="step_text"><p>${esc(SECTION_TITLE[s.kind])}</p></div>
  ${fix(s.html)}
</div>`,
    )
    .join("\n");
  const html = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-CA">
<head>
<meta charset="utf-8" />
<title>Item ${esc(item.itemId)} — solution</title>
<link rel="stylesheet" href="../katex/katex.min.css" />
</head>
<body>
<!-- Item ${esc(item.itemId)} · ${esc(item.subject)} · ${esc(item.course)} · ${esc(ITEM_TYPE_LABEL[item.itemType] ?? item.itemType)} · Evelyn solution v${sol.version} -->
${steps}
</body>
</html>
`;
  return { html, assets: [...assets] };
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function buildExport(itemIds: string[]): Promise<Uint8Array> {
  const { Item, Solution, Activity } = await ks();
  const items = await Item.find({ itemId: { $in: itemIds } }).sort({ order: 1 }).lean<ItemDoc[]>();
  const zip = new JSZip();
  const manifest = [["item_id", "subject", "course", "item_type", "key", "evelyn_answer", "version", "approved_at", "sections"]];

  for (const item of items) {
    const sol = await Solution.findOne({ itemId: item.itemId, version: item.version }).lean<SolutionDoc>();
    if (!sol) continue;
    const approval = await Activity.findOne({ itemId: item.itemId, type: "verdict", verdict: "approved" }).sort({ createdAt: -1 }).lean();
    const dir = zip.folder(item.itemId)!;
    const { html, assets } = solutionHtml(item, sol);
    dir.file("solution.html", html);
    dir.file(
      "solution.md",
      sol.sections.map((s) => `## ${SECTION_TITLE[s.kind]}\n\n${s.md}\n`).join("\n"),
    );
    for (const f of assets) {
      const data = await readAsset(item.itemId, f);
      if (data) dir.file(`resources/${f}`, data);
    }
    const approvedAt = approval?.createdAt ? new Date(approval.createdAt).toISOString() : "";
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
    ]);
  }

  zip.file("manifest.csv", manifest.map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  zip.file(
    "README.txt",
    [
      "Approved AI solutions for SOLARO, from Keystone (Evelyn Learning).",
      "",
      "One folder per item. solution.html holds the five sections, each as",
      "div.solution_step > div.step_text > p (section title) followed by the content.",
      "Equations are KaTeX HTML with MathML; they need katex/katex.min.css (included).",
      "Figures are inline SVG or files in resources/.",
      "manifest.csv lists every item, its key, our answer, the version and the approval time.",
      "",
    ].join("\n"),
  );

  // KaTeX stylesheet + woff2 fonts so solution.html renders offline.
  try {
    const candidates = ["node_modules/katex/dist", "../node_modules/katex/dist", "../../node_modules/katex/dist"].map((p) =>
      path.resolve(process.cwd(), p),
    );
    let kdir = candidates[0];
    for (const c of candidates) {
      try {
        await readFile(path.join(c, "katex.min.css"));
        kdir = c;
        break;
      } catch {}
    }
    zip.file("katex/katex.min.css", await readFile(path.join(kdir, "katex.min.css")));
    for (const f of (await readdir(path.join(kdir, "fonts"))).filter((f) => f.endsWith(".woff2"))) {
      zip.file(`katex/fonts/${f}`, await readFile(path.join(kdir, "fonts", f)));
    }
  } catch {
    // Fonts are a convenience; the package is still complete without them.
  }

  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}
