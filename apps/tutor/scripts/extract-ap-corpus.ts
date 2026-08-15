/**
 * AP Source Corpus Extract
 *
 * Downloads primary+secondary textbook PDFs for an AP course from Dropbox
 * and runs pdftotext on each to produce searchable text. Output:
 *
 *   data/ap-source-corpus/<course>/raw/<book-slug>/<filename>.pdf
 *   data/ap-source-corpus/<course>/text/<book-slug>/<filename>.txt
 *
 * The text/ tree is what plan-authoring greps against (no Dropbox in hot path).
 *
 * Usage: npx ts-node scripts/extract-ap-corpus.ts <course>
 *   e.g. npx ts-node scripts/extract-ap-corpus.ts macro
 *
 * Add new courses to COURSE_CONFIGS below as their turn comes up in the
 * AP plan ship order (see project_ap_plans_initiative.md memory).
 */

import { Dropbox } from 'dropbox';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

interface BookEntry {
  slug: string;
  folderId: string;
  label: string;
}

const COURSE_CONFIGS: Record<string, { books: BookEntry[] }> = {
  macro: {
    books: [
      {
        slug: 'openstax-macro-ap',
        folderId: '715616',
        label: 'OpenStax — Principles of Macroeconomics for AP Courses',
      },
      {
        slug: 'hubbard-macro-6e',
        folderId: '719674',
        label: "Hubbard / O'Brien — Macroeconomics, 6e",
      },
    ],
  },
  calcbc: {
    books: [
      {
        // catalog has dupes 200, 10278; the 5-digit folderId is the one
        // that exists in Dropbox /Books/book NNNN/ (same pattern as the
        // Macro books which also used 6-digit ids).
        slug: 'larson-calc-ap-ed',
        folderId: '10278',
        label: 'Larson / Hostetler / Edwards — Calculus AP ED',
      },
      {
        // catalog has 105 / 128 / 10265; 10265 is the 5-digit Dropbox-resolvable id.
        slug: 'hughes-hallett-calc',
        folderId: '10265',
        label: 'Hughes-Hallett et al. — Calculus',
      },
    ],
  },
};

/**
 * Books in our Dropbox live under `/Books/book <folderId>/` (folder name
 * is literally "book " + the catalog folderId, lowercase b). Inside, PDFs
 * are typically named `book <id>-<N>.pdf` (one per chapter) plus
 * Index/Appendix/Answers. Some books also have a nested `/New Book/`
 * subfolder with higher-resolution scans — we ignore those for v1; if
 * pdftotext fails on the top-level versions we'd revisit. "blank files"
 * sibling folders are placeholder noise and are skipped.
 */
const BOOK_PATH_PATTERNS = (id: string): string[] => [
  `/Books/book ${id}`,
  `/Books/Book ${id}`,
];

async function getAccessToken(): Promise<string> {
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  if (!refreshToken || !appKey || !appSecret) {
    throw new Error('Missing DROPBOX_REFRESH_TOKEN / DROPBOX_APP_KEY / DROPBOX_APP_SECRET in .env.local');
  }
  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: appKey,
      client_secret: appSecret,
    }).toString(),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function findBookFolder(dbx: Dropbox, folderId: string): Promise<string | null> {
  for (const candidate of BOOK_PATH_PATTERNS(folderId)) {
    try {
      await dbx.filesGetMetadata({ path: candidate });
      return candidate;
    } catch {
      // try next pattern
    }
  }
  return null;
}

interface PdfEntry {
  name: string;
  path: string;
  size: number;
}

async function listPdfs(dbx: Dropbox, folderPath: string): Promise<PdfEntry[]> {
  const result: PdfEntry[] = [];
  let res = await dbx.filesListFolder({ path: folderPath, limit: 1000 });
  while (true) {
    for (const e of res.result.entries) {
      if (e['.tag'] === 'file' && e.name.toLowerCase().endsWith('.pdf')) {
        result.push({
          name: e.name,
          path: (e as { path_display?: string }).path_display ?? `${folderPath}/${e.name}`,
          size: (e as { size?: number }).size ?? 0,
        });
      }
    }
    if (!res.result.has_more) break;
    res = await dbx.filesListFolderContinue({ cursor: res.result.cursor });
  }
  return result;
}

async function downloadFile(dbx: Dropbox, dbxPath: string, localPath: string): Promise<void> {
  const result = await dbx.filesDownload({ path: dbxPath });
  const buffer = (result.result as { fileBinary?: Buffer }).fileBinary;
  if (!buffer) throw new Error('Download returned no file binary');
  fs.writeFileSync(localPath, buffer);
}

function safeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
}

async function main(): Promise<void> {
  const course = process.argv[2];
  if (!course || !COURSE_CONFIGS[course]) {
    console.error('Usage: npx ts-node scripts/extract-ap-corpus.ts <course>');
    console.error(`Available courses: ${Object.keys(COURSE_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  const config = COURSE_CONFIGS[course];
  const baseDir = path.join(__dirname, '..', 'data', 'ap-source-corpus', course);
  fs.mkdirSync(path.join(baseDir, 'raw'), { recursive: true });
  fs.mkdirSync(path.join(baseDir, 'text'), { recursive: true });

  console.log(`📚 Extracting AP ${course.toUpperCase()} corpus`);
  console.log(`   target: ${baseDir}\n`);

  const accessToken = await getAccessToken();
  const dbx = new Dropbox({ accessToken });

  for (const book of config.books) {
    console.log(`\n🔎 ${book.label}`);
    console.log(`   folderId=${book.folderId}  slug=${book.slug}`);

    const folderPath = await findBookFolder(dbx, book.folderId);
    if (!folderPath) {
      console.log(`   ❌ folder ${book.folderId} not found under any of: ${BOOK_PATH_PATTERNS(book.folderId).join(', ')}`);
      continue;
    }
    console.log(`   📂 found at ${folderPath}`);

    const pdfs = await listPdfs(dbx, folderPath);
    if (pdfs.length === 0) {
      console.log(`   ⚠️  no PDFs in folder`);
      continue;
    }
    console.log(`   ${pdfs.length} PDF file(s):`);

    const rawBookDir = path.join(baseDir, 'raw', book.slug);
    const textBookDir = path.join(baseDir, 'text', book.slug);
    fs.mkdirSync(rawBookDir, { recursive: true });
    fs.mkdirSync(textBookDir, { recursive: true });

    for (const pdf of pdfs) {
      const sizeMb = (pdf.size / 1024 / 1024).toFixed(1);
      const safeName = safeFilename(pdf.name);
      const localPath = path.join(rawBookDir, safeName);
      const textPath = path.join(textBookDir, safeName.replace(/\.pdf$/i, '.txt'));

      if (fs.existsSync(textPath) && fs.statSync(textPath).size > 1024) {
        console.log(`     ✓ cached: ${pdf.name} (${sizeMb} MB)`);
        continue;
      }

      console.log(`     ⬇  ${pdf.name} (${sizeMb} MB)...`);
      try {
        if (!fs.existsSync(localPath) || fs.statSync(localPath).size !== pdf.size) {
          await downloadFile(dbx, pdf.path, localPath);
        }
        execSync(`pdftotext -layout "${localPath}" "${textPath}"`, { stdio: 'pipe' });
        const textSize = fs.statSync(textPath).size;
        if (textSize < 1024) {
          console.log(`     ⚠️  pdftotext produced only ${textSize} bytes — likely scanned PDF (OCR fallback not yet wired)`);
        } else {
          console.log(`     ✅ ${(textSize / 1024).toFixed(0)} KB text extracted`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`     ❌ ${msg.slice(0, 200)}`);
      }
    }
  }

  console.log(`\n✅ Done. Corpus root: ${baseDir}`);
  console.log(`   Grep example: rg -i "spending multiplier" ${path.join(baseDir, 'text')}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
