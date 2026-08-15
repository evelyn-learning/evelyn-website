/**
 * Test book catalog search
 */

import catalogData from '../apps/marketing/src/lib/data/book-catalog.json';

interface BookEntry {
  folderId: string;
  title: string;
  author: string;
  discipline: string;
  isbn?: string;
  source: string;
}

const books = (catalogData as any).books as BookEntry[];

console.log('📚 Book Catalog Search Test\n');
console.log(`Total books in catalog: ${books.length}`);
console.log(`With folder ID: ${books.filter(b => b.folderId).length}\n`);

// Search for physics books
console.log('🔍 Searching for "physics"...');
const physicsBooks = books.filter(b =>
  b.title.toLowerCase().includes('physics') ||
  b.discipline.toLowerCase().includes('physics')
);
console.log(`Found ${physicsBooks.length} physics-related books:\n`);
physicsBooks.slice(0, 15).forEach(b => {
  console.log(`  📖 ${b.title}`);
  if (b.author) console.log(`     Author: ${b.author}`);
  if (b.folderId) console.log(`     Folder: ${b.folderId}`);
  if (b.isbn) console.log(`     ISBN: ${b.isbn}`);
  console.log('');
});

// Search for calculus books
console.log('\n🔍 Searching for "calculus"...');
const calculusBooks = books.filter(b =>
  b.title.toLowerCase().includes('calculus') ||
  b.discipline.toLowerCase().includes('calculus')
);
console.log(`Found ${calculusBooks.length} calculus books:\n`);
calculusBooks.slice(0, 10).forEach(b => {
  console.log(`  📖 ${b.title}`);
  if (b.author) console.log(`     Author: ${b.author}`);
  if (b.folderId) console.log(`     Folder: ${b.folderId}`);
  console.log('');
});

// Show discipline breakdown
console.log('\n📊 Books by Discipline:');
const byDiscipline: Record<string, number> = {};
for (const book of books) {
  const disc = book.discipline || 'unknown';
  byDiscipline[disc] = (byDiscipline[disc] || 0) + 1;
}
Object.entries(byDiscipline)
  .sort((a, b) => b[1] - a[1])
  .forEach(([disc, count]) => {
    console.log(`  ${disc}: ${count}`);
  });
