/**
 * Batch merge helper for topic-notes pointer-gen drafts (first used for
 * Task 7's Algebra 1 backfill, now generalized for any course batch).
 *
 * Reads every `<prefix>*.pointers.draft.json` file in
 * src/lib/tutor/topic-notes/seeds/, drops the `rationale` field (human-
 * review only, not persisted), and appends the remaining `{ content,
 * kind }` entries to the matching baseline's `pointers: [...]` array in
 * the sibling `.ts` file. Deletes the `.draft.json` file once merged.
 *
 * This mirrors the manual step documented in gen-topic-notes-pointers.ts
 * ("paste keepers into the pointers block, drop rationale, delete the
 * draft") — automated here because we're merging a whole course's worth
 * of Opus-generated drafts from one batch pass rather than reviewing+
 * pasting by hand. Quality is expected to have already been sampled via
 * a small smoke pass before the full batch ran — no per-file filtering
 * is applied here; every proposal from the batch is kept.
 *
 * Usage: npx tsx scripts/merge-topic-notes-pointers.ts <filename-prefix>
 * Example: npx tsx scripts/merge-topic-notes-pointers.ts geom-
 */

import * as fs from 'fs';
import * as path from 'path';

const prefix = process.argv[2];
if (!prefix) {
  console.error('Usage: scripts/merge-topic-notes-pointers.ts <filename-prefix>');
  console.error('Example: scripts/merge-topic-notes-pointers.ts geom-');
  process.exit(2);
}

const seedsDir = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'topic-notes', 'seeds');

interface PointerProposal {
  content: string;
  kind: string;
  rationale?: string;
}

function tsString(s: string): string {
  if (s.includes('\n') || s.includes("'") || s.length > 80) {
    return '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
  }
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

const draftFiles = fs
  .readdirSync(seedsDir)
  .filter((f) => f.startsWith(prefix) && f.endsWith('.pointers.draft.json'));

console.log(`Found ${draftFiles.length} draft file(s) to merge.`);

let merged = 0;
let totalPointers = 0;

for (const draftFile of draftFiles) {
  const draftPath = path.join(seedsDir, draftFile);
  const tsFile = draftFile.replace(/\.pointers\.draft\.json$/, '.ts');
  const tsPath = path.join(seedsDir, tsFile);

  if (!fs.existsSync(tsPath)) {
    console.error(`✗ ${tsFile} not found for draft ${draftFile} — skipping`);
    continue;
  }

  const proposals: PointerProposal[] = JSON.parse(fs.readFileSync(draftPath, 'utf-8'));
  if (!Array.isArray(proposals) || proposals.length === 0) {
    console.error(`✗ ${draftFile}: empty or invalid — skipping`);
    continue;
  }

  const newLines = proposals
    .map((p) => `    { content: ${tsString(p.content)}, kind: ${tsString(p.kind)} },`)
    .join('\n');

  let src = fs.readFileSync(tsPath, 'utf-8');
  const closer = '\n  ],\n};\n';
  if (!src.endsWith(closer)) {
    console.error(`✗ ${tsFile}: does not end with expected pointers-array closer — skipping (manual merge needed)`);
    continue;
  }
  src = src.slice(0, -closer.length) + '\n' + newLines + closer;
  fs.writeFileSync(tsPath, src, 'utf-8');
  fs.unlinkSync(draftPath);

  merged++;
  totalPointers += proposals.length;
  console.log(`✓ merged ${proposals.length} pointer(s) into ${tsFile}`);
}

console.log('');
console.log(`Done: ${merged}/${draftFiles.length} files merged, ${totalPointers} pointers added.`);
if (merged < draftFiles.length) process.exit(1);
