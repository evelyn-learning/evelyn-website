/**
 * Extract content from AP Physics textbook for knowledge base
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import { listFolder, searchFiles, getDownloadLink, downloadFile } from '../src/lib/services/dropbox';
import catalogData from '../src/lib/data/book-catalog.json';

interface BookEntry {
  folderId: string;
  title: string;
  author: string;
  discipline: string;
  isbn?: string;
  dropboxLink?: string;
  source: string;
}

const books = (catalogData as any).books as BookEntry[];

async function findAPPhysicsBook(): Promise<BookEntry | null> {
  console.log('🔍 Searching for AP Physics textbooks...\n');

  const physicsBooks = books.filter(b => {
    const title = b.title.toLowerCase();
    const discipline = b.discipline.toLowerCase();
    return (
      (title.includes('physics') || discipline.includes('physics')) &&
      b.folderId // Must have a folder ID
    );
  });

  console.log(`Found ${physicsBooks.length} physics books with folder IDs\n`);

  // Priority order for AP-level books
  const priorityPatterns = [
    /college physics.*ap/i,
    /ap.*physics/i,
    /university physics/i,
    /college physics/i,
    /conceptual physics/i,
    /fundamentals of physics/i,
  ];

  for (const pattern of priorityPatterns) {
    const match = physicsBooks.find(b => pattern.test(b.title));
    if (match) {
      console.log(`✅ Selected: ${match.title}`);
      console.log(`   Folder ID: ${match.folderId}`);
      console.log(`   Author: ${match.author || 'Unknown'}`);
      return match;
    }
  }

  // Fall back to first physics book
  if (physicsBooks.length > 0) {
    const fallback = physicsBooks[0];
    console.log(`📚 Using: ${fallback.title}`);
    return fallback;
  }

  return null;
}

async function exploreBookFolder(folderId: string): Promise<void> {
  console.log(`\n📂 Exploring folder ${folderId}...\n`);

  // Try different path patterns
  const pathPatterns = [
    `/Books/${folderId}`,
    `/Books/book ${folderId}`,
    `/Books/book-${folderId}`,
  ];

  for (const folderPath of pathPatterns) {
    try {
      console.log(`Trying: ${folderPath}`);
      const files = await listFolder(folderPath);

      if (files.length > 0) {
        console.log(`\n✅ Found ${files.length} items in ${folderPath}:\n`);

        for (const file of files) {
          const sizeStr = file.size ? ` (${(file.size / 1024 / 1024).toFixed(1)} MB)` : '';
          console.log(`  ${file.isFolder ? '📁' : '📄'} ${file.name}${sizeStr}`);
        }

        // Look for PDF files
        const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
        if (pdfFiles.length > 0) {
          console.log(`\n📕 PDF files found: ${pdfFiles.length}`);

          // Get download link for the first/main PDF
          const mainPdf = pdfFiles[0];
          console.log(`\n📥 Getting download link for: ${mainPdf.name}`);

          try {
            const link = await getDownloadLink(mainPdf.path);
            console.log(`   Download link: ${link.substring(0, 100)}...`);
          } catch (err) {
            console.log(`   Could not get download link: ${err}`);
          }
        }

        return;
      }
    } catch (err: any) {
      console.log(`   Not found: ${err.message?.substring(0, 50) || err}`);
    }
  }

  // Try searching for the folder ID
  console.log(`\n🔎 Searching Dropbox for folder ${folderId}...`);
  try {
    const searchResults = await searchFiles(folderId, '/Books', 10);
    if (searchResults.length > 0) {
      console.log(`\nFound ${searchResults.length} matching files:`);
      searchResults.forEach(f => {
        console.log(`  📄 ${f.path}`);
      });
    }
  } catch (err) {
    console.log(`   Search failed: ${err}`);
  }
}

async function listPhysicsBooksInDropbox(): Promise<void> {
  console.log('\n📚 Listing available physics books in Dropbox...\n');

  try {
    // Search for physics PDFs in Dropbox
    const physicsFiles = await searchFiles('physics', '/Books', 50);

    console.log(`Found ${physicsFiles.length} physics-related files:\n`);

    // Group by folder
    const byFolder: Record<string, typeof physicsFiles> = {};
    for (const file of physicsFiles) {
      const pathParts = file.path.split('/');
      const folder = pathParts[2] || 'root'; // /Books/FOLDER/file.pdf
      if (!byFolder[folder]) byFolder[folder] = [];
      byFolder[folder].push(file);
    }

    Object.entries(byFolder).slice(0, 20).forEach(([folder, files]) => {
      console.log(`📁 ${folder}:`);
      files.forEach(f => {
        const sizeStr = f.size ? ` (${(f.size / 1024 / 1024).toFixed(1)} MB)` : '';
        console.log(`   📄 ${f.name}${sizeStr}`);
      });
      console.log('');
    });

  } catch (err) {
    console.log(`Search error: ${err}`);
  }
}

async function main() {
  console.log('📖 AP Physics Content Extraction\n');
  console.log('=' .repeat(50) + '\n');

  // Find the best AP Physics book
  const book = await findAPPhysicsBook();

  if (!book) {
    console.log('❌ No suitable AP Physics book found');
    await listPhysicsBooksInDropbox();
    return;
  }

  // Explore the book folder
  await exploreBookFolder(book.folderId);

  // Also search Dropbox directly
  await listPhysicsBooksInDropbox();
}

main().catch(console.error);
