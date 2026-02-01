/**
 * Sync Book Catalog from Google Sheets
 *
 * Fetches book metadata from the Google Sheets catalog and saves it locally.
 * Run with: npx tsx scripts/sync-book-catalog.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SPREADSHEET_ID = '1EehqNbDVuxNjISDb1UXlRmrqyVUhTbnEI4XlqwFsl3g';

// Known sheet GIDs (we'll discover these)
// Format: https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID}
const SHEETS_TO_FETCH = [
  { name: 'Sheet1', gid: 0 }, // Default first sheet
];

interface BookEntry {
  folderId: string;
  title: string;
  author: string;
  discipline: string;
  isbn?: string;
  edition?: string;
  source: string;
}

/**
 * Fetch a Google Sheet as CSV
 */
async function fetchSheetCSV(gid: number): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet (gid=${gid}): ${response.status}`);
  }

  return await response.text();
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

/**
 * Extract book ID from various formats
 */
function extractBookId(value: string): string {
  if (!value) return '';

  // Direct number
  if (/^\d+$/.test(value.trim())) {
    return value.trim();
  }

  // "book 10210" or "Book-719728"
  const match = value.match(/\b(\d{3,})\b/);
  return match ? match[1] : '';
}

/**
 * Parse a CSV into book entries
 */
function parseCSV(csv: string, sheetName: string): BookEntry[] {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  console.log(`  Headers: ${headers.slice(0, 8).join(', ')}${headers.length > 8 ? '...' : ''}`);

  // Find column indices - try multiple possible names
  const findCol = (...names: string[]): number => {
    for (const name of names) {
      const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const idCol = findCol('folder', 'book id', 'bookid', 'id', 'number', 'no.', 'no', 'sr');
  const titleCol = findCol('title', 'book name', 'bookname', 'name');
  const authorCol = findCol('author');
  const disciplineCol = findCol('discipline', 'subject', 'category', 'dept', 'stream');
  const isbnCol = findCol('isbn', 'isbn-13', 'isbn13');
  const editionCol = findCol('edition', 'ed.');

  console.log(`  Columns found - ID:${idCol}, Title:${titleCol}, Author:${authorCol}, Discipline:${disciplineCol}`);

  const books: BookEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    // Try to get title
    let title = titleCol >= 0 ? values[titleCol] : '';

    // If no title column, try to find a meaningful value
    if (!title) {
      // Look for the first non-empty, non-numeric column
      for (let j = 0; j < Math.min(values.length, 5); j++) {
        if (values[j] && !/^\d+$/.test(values[j]) && values[j].length > 3) {
          title = values[j];
          break;
        }
      }
    }

    if (!title) continue;

    // Get folder ID
    let folderId = idCol >= 0 ? extractBookId(values[idCol]) : '';
    if (!folderId) {
      folderId = extractBookId(title);
    }

    const book: BookEntry = {
      folderId,
      title,
      author: authorCol >= 0 ? values[authorCol] || '' : '',
      discipline: disciplineCol >= 0 ? values[disciplineCol] || '' : '',
      isbn: isbnCol >= 0 ? values[isbnCol] : undefined,
      edition: editionCol >= 0 ? values[editionCol] : undefined,
      source: sheetName,
    };

    // Only add if we have meaningful data
    if (book.title && book.title.length > 2) {
      books.push(book);
    }
  }

  return books;
}

/**
 * Try to discover all sheet GIDs by fetching the HTML
 */
async function discoverSheets(): Promise<Array<{ name: string; gid: number }>> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });

    const html = await response.text();

    // Look for sheet names and GIDs in the HTML
    // Pattern: "sheet-button-{gid}" or similar
    const sheets: Array<{ name: string; gid: number }> = [];

    // Try common GIDs
    const commonGids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (const gid of commonGids) {
      try {
        const csv = await fetchSheetCSV(gid);
        if (csv && csv.length > 50) {
          const firstLine = csv.split('\n')[0];
          sheets.push({ name: `Sheet_${gid}`, gid });
          console.log(`  Found sheet gid=${gid}: ${firstLine.slice(0, 80)}...`);
        }
      } catch {
        // Sheet doesn't exist
      }
    }

    return sheets;
  } catch (err) {
    console.log('Could not discover sheets, using defaults');
    return SHEETS_TO_FETCH;
  }
}

async function main() {
  console.log('📚 Syncing Book Catalog from Google Sheets\n');
  console.log(`Spreadsheet: ${SPREADSHEET_ID}\n`);

  const allBooks: BookEntry[] = [];
  const seenIds = new Set<string>();

  // Try to fetch multiple sheet GIDs
  console.log('🔍 Discovering sheets...');

  // Common sheet GIDs to try (0 is usually the first sheet)
  const gidsToTry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    // Some spreadsheets use larger GIDs
    1234567890, 2000000000];

  let sheetsFound = 0;

  for (const gid of gidsToTry) {
    try {
      console.log(`\n📄 Trying sheet gid=${gid}...`);
      const csv = await fetchSheetCSV(gid);

      if (!csv || csv.length < 50) {
        console.log('  Empty or too small, skipping');
        continue;
      }

      sheetsFound++;
      const sheetName = `Sheet_${gid}`;

      // Check first line to identify the sheet
      const firstLine = csv.split('\n')[0].toLowerCase();
      console.log(`  First row: ${firstLine.slice(0, 100)}...`);

      const books = parseCSV(csv, sheetName);
      console.log(`  Parsed ${books.length} book entries`);

      // Add unique books
      let added = 0;
      for (const book of books) {
        const key = book.folderId || book.title;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          allBooks.push(book);
          added++;
        }
      }
      console.log(`  Added ${added} new unique entries`);

    } catch (err: any) {
      if (!err.message?.includes('404')) {
        console.log(`  Error: ${err.message?.slice(0, 50)}`);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Sheets found: ${sheetsFound}`);
  console.log(`  Total unique books: ${allBooks.length}`);

  // Count by discipline
  const byDiscipline: Record<string, number> = {};
  const withFolderId = allBooks.filter(b => b.folderId).length;

  for (const book of allBooks) {
    const disc = book.discipline || 'unknown';
    byDiscipline[disc] = (byDiscipline[disc] || 0) + 1;
  }

  console.log(`  With folder ID: ${withFolderId}`);
  console.log(`  By discipline:`);
  Object.entries(byDiscipline)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([disc, count]) => {
      console.log(`    ${disc}: ${count}`);
    });

  // Save to file
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'book-catalog.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify({
    syncedAt: new Date().toISOString(),
    totalBooks: allBooks.length,
    withFolderId,
    byDiscipline,
    books: allBooks,
  }, null, 2));

  console.log(`\n✅ Saved catalog to: ${outputPath}`);

  // Also save a summary
  const summaryPath = path.join(outputDir, 'book-catalog-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    syncedAt: new Date().toISOString(),
    totalBooks: allBooks.length,
    withFolderId,
    byDiscipline,
    sampleBooks: allBooks.slice(0, 20),
  }, null, 2));

  console.log(`📋 Saved summary to: ${summaryPath}`);
}

main().catch(console.error);
