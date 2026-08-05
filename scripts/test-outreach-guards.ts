/**
 * Structural guards for the outreach console — two static invariants that
 * must hold regardless of what any individual file's tests exercise.
 * Run: npm run test:outreach-guards
 *
 * (a) No "use client" file under src/app/admin/outreach/ may have a
 *     non-type-only import from "@/models". That barrel imports mongoose
 *     at module scope (`mongoose.models.Lead || mongoose.model(...)`, etc.
 *     for every model in the app). A client component pulling a *value*
 *     from it drags the mongoose browser build into the client bundle,
 *     which has no `models` property — the module throws
 *     `TypeError: Cannot read properties of undefined (reading 'BlogPost')`
 *     the moment React requires the chunk during hydration, and the whole
 *     console goes dead in the browser (this happened; see
 *     src/lib/outreach/enums.ts for the mongoose-free replacement client
 *     components import instead). Type-only imports (`import type { ... }`,
 *     or every specifier in a named import prefixed with `type`) are erased
 *     by the TS compiler and are fine — this guard only blocks imports that
 *     survive into the emitted JS.
 *
 * (b) No file under src/lib/outreach/ may contain the literal substrings
 *     `threads.list`, `messages.list`, or `messages.search`. The reply
 *     watcher is deliberately scoped to only ever read Gmail threads
 *     already recorded on a lead (`lead.gmailThreadIds`, fetched by id via
 *     `threads.get`) — it must never list or search the wider inbox. That's
 *     a privacy/scope boundary the owner cares about; this guard makes a
 *     regression (e.g. "just list recent threads to find replies faster")
 *     fail loudly instead of silently widening what the console can read.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ok - ${name}`);
  } else {
    failed++;
    console.error(`  FAIL - ${name}${detail ? `\n    ${detail}` : ""}`);
  }
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// True if every specifier this import statement pulls in is type-only
// (i.e. erased by the compiler, never reaching the emitted client bundle).
function isTypeOnlyModelsImport(line: string): boolean {
  if (/^\s*import\s+type\s/.test(line)) return true; // `import type { ... } from "@/models"`
  const braced = line.match(/import\s+\{([^}]*)\}\s+from/);
  if (!braced) return false; // default/namespace import of a value — not type-only
  const specifiers = braced[1].split(",").map((s) => s.trim()).filter(Boolean);
  if (specifiers.length === 0) return false;
  return specifiers.every((s) => /^type\s+/.test(s));
}

(async () => {
  console.log("outreach guards");

  // --- (a) mongoose barrel out of the client bundle ---
  const outreachDir = "src/app/admin/outreach";
  const files = walk(outreachDir).filter((f) => /\.(tsx|ts)$/.test(f));
  let clientFilesChecked = 0;
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const isClient = /^\s*["']use client["'];?\s*$/m.test(src.split("\n").slice(0, 5).join("\n"));
    if (!isClient) continue;
    clientFilesChecked++;

    const modelsImportLines = src
      .split("\n")
      .filter((line) => /from\s+["']@\/models(?:\/[^"']*)?["']/.test(line));

    const badLines = modelsImportLines.filter((line) => !isTypeOnlyModelsImport(line));
    check(
      `${file}: no value import from @/models`,
      badLines.length === 0,
      badLines.length ? `offending line(s):\n      ${badLines.join("\n      ")}` : undefined
    );
  }
  check("at least one 'use client' file was actually checked (guard isn't vacuous)", clientFilesChecked > 0);

  // --- (b) reply watcher never touches the wider inbox ---
  const libOutreachDir = "src/lib/outreach";
  const libFiles = walk(libOutreachDir).filter((f) => /\.ts$/.test(f) && !f.endsWith(".test.ts"));
  const forbidden = ["threads.list", "messages.list", "messages.search"];
  let libFilesChecked = 0;
  for (const file of libFiles) {
    libFilesChecked++;
    const src = readFileSync(file, "utf8");
    const hits = forbidden.filter((needle) => src.includes(needle));
    check(`${file}: no wide-inbox Gmail calls (${forbidden.join(", ")})`, hits.length === 0, hits.length ? `found: ${hits.join(", ")}` : undefined);
  }
  check("at least one src/lib/outreach file was actually checked (guard isn't vacuous)", libFilesChecked > 0);

  console.log(`passed: ${passed}, failed: ${failed}`);
  if (failed > 0) process.exit(1);
})();
