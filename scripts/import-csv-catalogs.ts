/**
 * Import CSV catalogs from downloaded Google Sheets
 */

import * as fs from 'fs';
import * as path from 'path';

interface BookEntry {
  folderId: string;
  title: string;
  author: string;
  discipline: string;
  isbn?: string;
  edition?: string;
  dropboxLink?: string;
  source: string;
}

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

function normalizeDiscipline(disc: string): string {
  const d = disc.toLowerCase().trim();
  const map: Record<string, string> = {
    'adv math': 'Advanced Math',
    'advanced math': 'Advanced Math',
    'math': 'Mathematics',
    'math stat': 'Statistics',
    'computer science': 'Computer Science',
    'cs': 'Computer Science',
    'cse': 'Computer Science',
    'chem': 'Chemistry',
    'bio': 'Biology',
    'econ': 'Economics',
    'precalc': 'Precalculus',
    'calc': 'Calculus',
  };
  return map[d] || disc || 'Unknown';
}

function parseAPMapping(content: string): BookEntry[] {
  const lines = content.split('\n').filter(l => l.trim());
  const books: BookEntry[] = [];

  // Headers: Title,Author,Discipline,National ISBN,Edition,...
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const title = values[0]?.trim();
    if (!title || title.length < 3) continue;

    books.push({
      folderId: '',
      title,
      author: values[1]?.trim() || '',
      discipline: normalizeDiscipline(values[2] || ''),
      isbn: values[3]?.trim() || values[5]?.trim() || undefined,
      edition: values[4]?.trim() || undefined,
      source: 'AP-Mapping',
    });
  }

  return books;
}

function parseCFBooks(content: string): BookEntry[] {
  const lines = content.split('\n').filter(l => l.trim());
  const books: BookEntry[] = [];

  // Headers: Book id,Alternate/Source Book id,ISBN-13,Book name,No. Of CF Sol.,Subject,Available on Server,Dropbox link,...
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const folderId = values[0]?.trim();
    const title = values[3]?.trim();
    if (!title || title.length < 3) continue;

    books.push({
      folderId: folderId || '',
      title,
      author: '', // Not in this file
      discipline: normalizeDiscipline(values[5] || ''),
      isbn: values[2]?.trim() || undefined,
      dropboxLink: values[7]?.trim() || undefined,
      source: 'CF_Books',
    });
  }

  return books;
}

function parseTBSBookDetails(content: string): BookEntry[] {
  const lines = content.split('\n').filter(l => l.trim());
  const books: BookEntry[] = [];

  // Headers: ,Book no.,Alternate/Source Book id,Topic,Problems,Book Name,Author,Available on Server,Ed,ISBN-13,...,Dropbox Book Link,...
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const folderId = values[1]?.trim(); // Book no.
    const title = values[5]?.trim(); // Book Name
    if (!title || title.length < 3) continue;

    // Find Dropbox link column (it's around index 16)
    let dropboxLink = '';
    for (let j = 15; j < Math.min(values.length, 20); j++) {
      const potentialUrl = values[j]?.trim();
      if (potentialUrl) {
        try {
          const url = new URL(potentialUrl);
          if (url.hostname === 'dropbox.com' || url.hostname.endsWith('.dropbox.com')) {
            dropboxLink = potentialUrl;
            break;
          }
        } catch {
          // Not a valid URL, skip
        }
      }
    }

    books.push({
      folderId: folderId || '',
      title,
      author: values[6]?.trim() || '',
      discipline: normalizeDiscipline(values[3] || ''), // Topic column
      isbn: values[9]?.trim() || undefined,
      edition: values[8]?.trim() || undefined,
      dropboxLink: dropboxLink || undefined,
      source: 'TBS_Book_Details',
    });
  }

  return books;
}

async function main() {
  console.log('📚 Importing CSV Catalogs\n');

  const allBooks: BookEntry[] = [];
  const seenKeys = new Set<string>();

  // Load existing catalog
  const existingCatalogPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'book-catalog.json');
  if (fs.existsSync(existingCatalogPath)) {
    const existing = JSON.parse(fs.readFileSync(existingCatalogPath, 'utf-8'));
    console.log(`📖 Loading existing catalog: ${existing.books?.length || 0} books`);
    for (const book of existing.books || []) {
      const key = book.folderId || book.title;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        allBooks.push(book);
      }
    }
  }

  // Import AP-Mapping
  const apMappingPath = '/Users/luke/Downloads/Books Received - AP-Mapping.csv';
  if (fs.existsSync(apMappingPath)) {
    console.log('\n📄 Importing AP-Mapping.csv...');
    const content = fs.readFileSync(apMappingPath, 'utf-8');
    const books = parseAPMapping(content);
    console.log(`   Parsed ${books.length} entries`);

    let added = 0;
    for (const book of books) {
      const key = book.folderId || book.title;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        allBooks.push(book);
        added++;
      }
    }
    console.log(`   Added ${added} new books`);
  }

  // Import CF_Books
  const cfBooksPath = '/Users/luke/Downloads/Books Received - CF_Books.csv';
  if (fs.existsSync(cfBooksPath)) {
    console.log('\n📄 Importing CF_Books.csv...');
    const content = fs.readFileSync(cfBooksPath, 'utf-8');
    const books = parseCFBooks(content);
    console.log(`   Parsed ${books.length} entries`);

    let added = 0;
    let updated = 0;
    for (const book of books) {
      const key = book.folderId || book.title;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        allBooks.push(book);
        added++;
      } else if (book.folderId) {
        // Update existing book with folder ID
        const existing = allBooks.find(b => b.title === book.title && !b.folderId);
        if (existing) {
          existing.folderId = book.folderId;
          if (book.dropboxLink) existing.dropboxLink = book.dropboxLink;
          updated++;
        }
      }
    }
    console.log(`   Added ${added} new books, updated ${updated}`);
  }

  // Import TBS Book details
  const tbsPath = '/Users/luke/Downloads/Books Received - TBS Book details.csv';
  if (fs.existsSync(tbsPath)) {
    console.log('\n📄 Importing TBS Book details.csv...');
    const content = fs.readFileSync(tbsPath, 'utf-8');
    const books = parseTBSBookDetails(content);
    console.log(`   Parsed ${books.length} entries`);

    let added = 0;
    let updated = 0;
    for (const book of books) {
      const key = book.folderId || book.title;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        allBooks.push(book);
        added++;
      } else if (book.folderId) {
        // Update existing book with folder ID and other info
        const existing = allBooks.find(b =>
          (b.folderId === book.folderId) ||
          (b.title.toLowerCase() === book.title.toLowerCase() && !b.folderId)
        );
        if (existing) {
          if (!existing.folderId) existing.folderId = book.folderId;
          if (!existing.author && book.author) existing.author = book.author;
          if (book.dropboxLink) existing.dropboxLink = book.dropboxLink;
          if (!existing.discipline || existing.discipline === 'Unknown') {
            existing.discipline = book.discipline;
          }
          updated++;
        }
      }
    }
    console.log(`   Added ${added} new books, updated ${updated}`);
  }

  // Calculate stats
  const withFolderId = allBooks.filter(b => b.folderId).length;
  const withDropboxLink = allBooks.filter(b => b.dropboxLink).length;
  const byDiscipline: Record<string, number> = {};
  const bySources: Record<string, number> = {};

  for (const book of allBooks) {
    const disc = book.discipline || 'Unknown';
    byDiscipline[disc] = (byDiscipline[disc] || 0) + 1;
    const src = book.source || 'unknown';
    bySources[src] = (bySources[src] || 0) + 1;
  }

  console.log('\n📊 Final Catalog Summary:');
  console.log(`   Total books: ${allBooks.length}`);
  console.log(`   With folder ID: ${withFolderId}`);
  console.log(`   With Dropbox link: ${withDropboxLink}`);

  console.log('\n   By Discipline:');
  Object.entries(byDiscipline)
    .sort((a, b) => b[1] - a[1])
    .forEach(([disc, count]) => {
      console.log(`     ${disc}: ${count}`);
    });

  console.log('\n   By Source:');
  Object.entries(bySources)
    .sort((a, b) => b[1] - a[1])
    .forEach(([src, count]) => {
      console.log(`     ${src}: ${count}`);
    });

  // Save updated catalog
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'book-catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    syncedAt: new Date().toISOString(),
    totalBooks: allBooks.length,
    withFolderId,
    withDropboxLink,
    byDiscipline,
    bySources,
    books: allBooks,
  }, null, 2));

  console.log(`\n✅ Saved catalog to: ${outputPath}`);

  // Show sample physics books
  const physicsBooks = allBooks.filter(b =>
    b.title.toLowerCase().includes('physics') ||
    b.discipline.toLowerCase().includes('physics')
  );
  console.log(`\n🔬 Physics books found: ${physicsBooks.length}`);
  physicsBooks.slice(0, 10).forEach(b => {
    console.log(`   📖 ${b.title}`);
    if (b.folderId) console.log(`      Folder: ${b.folderId}`);
    if (b.author) console.log(`      Author: ${b.author}`);
  });
}

main().catch(console.error);
