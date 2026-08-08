/**
 * Regenerates every fixture under scripts/fixtures/ that
 * scripts/test-material-extract.ts depends on.
 *
 * Run standalone (no npm entry — this is a one-off content generator, not
 * part of CI or `npm run test:*`):
 *
 *   npx tsx scripts/generate-material-fixtures.ts
 *
 * Safe to re-run any time; it overwrites the committed fixtures in place.
 * Exact byte-for-byte determinism is NOT required — the contract is that
 * every fixture's extractable sentinel/content still survives extraction
 * (verify with `npm run test:material-extract` after regenerating).
 *
 * ---------------------------------------------------------------------
 * KNOWN QUIRK — pdf-parse's bundled pdf.js (v1.10.100) intermittently
 * throws `FormatError: bad XRef entry` when parsing very small (~3-4KB),
 * syntactically-VALID PDFs under this repo's Node version (v23.7.0) —
 * reproduced deterministically with both a hand-built minimal PDF (byte
 * offsets independently verified correct) and a jsPDF-generated one at
 * roughly the same size. Root cause was narrowed down but not fully
 * pinned: Node's Buffer pool byte-offset was the first suspect, but
 * forcing byteOffset=0 via `Buffer.allocUnsafeSlow` + `.copy()` did NOT
 * fix it, so it's some other size/structure-dependent bug in that old
 * bundled pdf.js build. A real ~54-page textbook PDF already checked into
 * this repo (data/ap-source-corpus/.../book 10278-1.pdf) parses fine
 * through the exact same call, so real-world uploads are low risk — they
 * rarely stay this tiny once they carry any embedded font or image data,
 * and `extractPdf` in material-extract.ts degrades any parser throw to a
 * clean `extract_failed` rather than crashing either way.
 *
 * WORKAROUND: every PDF fixture generated below is deliberately sized (or
 * padded with harmless jsPDF metadata) past ~4.5KB, which reliably avoided
 * the quirk across many repeated local runs. Do NOT shrink these fixtures
 * back down without re-verifying against `npm run test:material-extract`.
 * ---------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import sharp from 'sharp';

const OUT_DIR = path.resolve(__dirname, 'fixtures');

// Sentinel strings the corresponding test assertions in
// scripts/test-material-extract.ts search for.
const SENTINEL_PDF = 'SENTINEL_PDF_MATERIAL_9382';
const SENTINEL_DOCX = 'SENTINEL_DOCX_MATERIAL_5521';

/* ------------------------------------------------------------------ */
/* PDF — real text layer (happy path)                                  */
/* ------------------------------------------------------------------ */

function generateTextPdf(): void {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Cellular Respiration Overview', 10, 20);
  doc.text(SENTINEL_PDF, 10, 30);
  doc.text('Glycolysis converts glucose into pyruvate in the cytoplasm.', 10, 40);
  doc.text('The Krebs cycle occurs in the mitochondrial matrix.', 10, 50);
  doc.text('Electron transport chain produces most of the ATP yield.', 10, 60);
  doc.addPage();
  doc.text('Key Vocabulary', 10, 20);
  doc.text('ATP: adenosine triphosphate, the energy currency of the cell.', 10, 30);
  doc.text('Mitochondria: the organelle where aerobic respiration occurs.', 10, 40);
  doc.text('Anaerobic respiration produces far less ATP than aerobic respiration.', 10, 50);

  const out = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(OUT_DIR, 'sample-with-text.pdf'), out);
  console.log(`  sample-with-text.pdf: ${out.length} bytes (2 pages, real text layer)`);
}

/* ------------------------------------------------------------------ */
/* PDF — scanned-style (no text layer)                                 */
/* ------------------------------------------------------------------ */

function generateScannedPdf(): void {
  const doc = new jsPDF();
  // Padding — see header comment: pushes this well past the ~4KB quirk
  // threshold without adding any visible/extractable text, so it still
  // correctly exercises the scanned_pdf (avg chars/page < 40) path.
  doc.setProperties({ keywords: 'x'.repeat(4000) });
  doc.setFillColor(230, 230, 230);
  doc.rect(10, 10, 100, 50, 'F');
  doc.addPage();
  doc.rect(10, 10, 80, 40, 'F');

  const out = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(OUT_DIR, 'scanned-no-text.pdf'), out);
  console.log(`  scanned-no-text.pdf: ${out.length} bytes (2 pages, no text operators)`);
}

/* ------------------------------------------------------------------ */
/* PDF — many pages (page-count limit)                                 */
/* ------------------------------------------------------------------ */

function generateManyPagesPdf(): void {
  const doc = new jsPDF();
  for (let i = 0; i < 31; i++) {
    if (i > 0) doc.addPage();
    doc.text(`Filler page ${i + 1} of a many-page pagination test document.`, 10, 20);
  }

  const out = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(path.join(OUT_DIR, 'many-pages.pdf'), out);
  console.log(`  many-pages.pdf: ${out.length} bytes (31 pages)`);
}

/* ------------------------------------------------------------------ */
/* DOCX — minimal hand-built OOXML zip                                 */
/* ------------------------------------------------------------------ */

async function generateDocx(): Promise<void> {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Photosynthesis Study Guide</w:t></w:r></w:p>
    <w:p><w:r><w:t>${SENTINEL_DOCX}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Light-dependent reactions occur in the thylakoid membrane.</w:t></w:r></w:p>
    <w:p><w:r><w:t>The Calvin cycle fixes carbon dioxide into glucose.</w:t></w:r></w:p>
    <w:sectPr/>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypesXml);
  zip.file('_rels/.rels', relsXml);
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', documentRelsXml);

  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(OUT_DIR, 'sample.docx'), buf);
  console.log(`  sample.docx: ${buf.length} bytes`);
}

/* ------------------------------------------------------------------ */
/* DOCX — well-formed but textless (I2: all-empty-materials -> extract_failed) */
/* ------------------------------------------------------------------ */

async function generateEmptyDocx(): Promise<void> {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  // A valid document with a body but no <w:t> text runs at all (just an
  // empty paragraph) — mammoth.extractRawText legitimately returns '' for
  // this, same shape as a student uploading a template/cover-page-only
  // DOCX with no body content. This is what exercises material-extract.ts's
  // "materials present, combinedText.trim() === ''" -> extract_failed
  // branch deterministically, with NO live LLM call.
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p/>
    <w:sectPr/>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypesXml);
  zip.file('_rels/.rels', relsXml);
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', documentRelsXml);

  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(OUT_DIR, 'empty.docx'), buf);
  console.log(`  empty.docx: ${buf.length} bytes (valid DOCX, no text runs)`);
}

/* ------------------------------------------------------------------ */
/* PNG — printed text, rasterized from SVG via sharp                   */
/* ------------------------------------------------------------------ */

async function generateTextPng(): Promise<void> {
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160">
       <rect width="100%" height="100%" fill="white"/>
       <text x="10" y="40" font-size="26" font-family="Helvetica, Arial, sans-serif" fill="black">Photosynthesis Notes</text>
       <text x="10" y="80" font-size="20" font-family="Helvetica, Arial, sans-serif" fill="black">Light reactions: thylakoid</text>
       <text x="10" y="110" font-size="20" font-family="Helvetica, Arial, sans-serif" fill="black">Calvin cycle: stroma</text>
     </svg>`,
  );
  const info = await sharp(svg).png().toFile(path.join(OUT_DIR, 'sample-text.png'));
  console.log(`  sample-text.png: ${info.size} bytes`);
}

/* ------------------------------------------------------------------ */
/* main                                                                 */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Regenerating scripts/fixtures/ ...\n');
  generateTextPdf();
  generateScannedPdf();
  generateManyPagesPdf();
  await generateDocx();
  await generateEmptyDocx();
  await generateTextPng();

  console.log('\nDone. Verify with: npm run test:material-extract');
}

main().catch((err) => {
  console.error('Fixture generation failed:', err);
  process.exit(1);
});
