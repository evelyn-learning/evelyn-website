/**
 * Books API - Browse and search textbook library
 *
 * GET /api/books - Get catalog stats
 * GET /api/books?action=search&q=physics - Search books
 * GET /api/books?action=discipline&d=physics - Get books by discipline
 * GET /api/books?action=browse&path=/Books - Browse Dropbox folders
 * GET /api/books?action=book&id=7203 - Get specific book details
 * GET /api/books?action=chapters&id=7203 - List chapters in a book
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchBooks,
  getBooksByDiscipline,
  getBookByFolderId,
  getCatalogStats,
  getAllDisciplines,
  isCatalogLoaded,
  addToCatalog,
  type BookEntry,
} from '@/lib/services/book-catalog';
import {
  listFolder,
  getBookFolder,
  searchFiles,
  getDownloadLink,
  testConnection,
} from '@/lib/services/dropbox';
import { initializeCatalog } from '@/lib/services/catalog-loader';

// Base path where books are stored in Dropbox
const BOOKS_BASE_PATH = '/Books';

/**
 * Extract book ID from folder name
 */
function extractBookId(name: string): string | null {
  if (/^\d+$/.test(name)) return name;
  const match = name.match(/book\s*[-]?\s*(\d+)/i);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  // Ensure catalog is loaded
  initializeCatalog();

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';

    switch (action) {
      case 'stats': {
        // Test Dropbox connection
        const dropboxStatus = await testConnection();

        // Get catalog stats
        const catalogStats = getCatalogStats();

        return NextResponse.json({
          dropbox: dropboxStatus,
          catalog: catalogStats,
          basePath: BOOKS_BASE_PATH,
        });
      }

      case 'search': {
        const query = searchParams.get('q');
        if (!query) {
          return NextResponse.json({ error: 'Search query required' }, { status: 400 });
        }

        // Search in catalog
        const catalogResults = searchBooks(query, 20);

        // Also search in Dropbox
        let dropboxResults: any[] = [];
        try {
          const files = await searchFiles(query, BOOKS_BASE_PATH, 20);
          dropboxResults = files.map(f => ({
            name: f.name,
            path: f.path,
            bookId: extractBookId(f.path.split('/').slice(-2)[0] || ''),
          }));
        } catch (err) {
          console.error('Dropbox search error:', err);
        }

        return NextResponse.json({
          query,
          catalog: catalogResults,
          dropbox: dropboxResults,
        });
      }

      case 'discipline': {
        const discipline = searchParams.get('d');
        if (!discipline) {
          // Return list of all disciplines
          const disciplines = getAllDisciplines();
          return NextResponse.json({ disciplines });
        }

        const books = getBooksByDiscipline(discipline);
        return NextResponse.json({
          discipline,
          count: books.length,
          books,
        });
      }

      case 'browse': {
        const path = searchParams.get('path') || BOOKS_BASE_PATH;

        const contents = await listFolder(path);

        // Categorize contents
        const bookFolders: any[] = [];
        const otherFolders: any[] = [];
        const files: any[] = [];

        for (const item of contents) {
          if (item.isFolder) {
            const bookId = extractBookId(item.name);
            if (bookId) {
              const catalogEntry = getBookByFolderId(bookId);
              bookFolders.push({
                ...item,
                bookId,
                metadata: catalogEntry,
              });
            } else {
              otherFolders.push(item);
            }
          } else {
            files.push(item);
          }
        }

        return NextResponse.json({
          path,
          bookFolders: bookFolders.sort((a, b) => parseInt(a.bookId) - parseInt(b.bookId)),
          otherFolders,
          files,
          totalItems: contents.length,
        });
      }

      case 'book': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
        }

        // Get from catalog
        const catalogEntry = getBookByFolderId(id);

        // Get from Dropbox
        let dropboxInfo = null;
        try {
          // Try different path patterns
          const pathsToTry = [
            `${BOOKS_BASE_PATH}/${id}`,
            `${BOOKS_BASE_PATH}/book ${id}`,
            `${BOOKS_BASE_PATH}/Book ${id}`,
            `${BOOKS_BASE_PATH}/book-${id}`,
          ];

          for (const path of pathsToTry) {
            try {
              const folder = await getBookFolder(id, '');
              dropboxInfo = folder;
              break;
            } catch {
              // Try next path
            }
          }

          // If not found, try direct path
          if (!dropboxInfo) {
            dropboxInfo = await getBookFolder(id, BOOKS_BASE_PATH);
          }
        } catch (err) {
          console.error(`Could not find book ${id} in Dropbox`);
        }

        return NextResponse.json({
          id,
          catalog: catalogEntry,
          dropbox: dropboxInfo,
        });
      }

      case 'chapters': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
        }

        // Get book folder contents
        const bookFolder = await getBookFolder(id, BOOKS_BASE_PATH);

        // Parse chapter information from filenames
        const chapters = bookFolder.files
          .filter(f => f.name.endsWith('.pdf'))
          .map(f => {
            // Parse chapter number from filename like "book 7203-1.pdf"
            const match = f.name.match(/-(\d+|[A-Za-z]+)\.pdf$/i);
            const chapterNum = match ? match[1] : f.name;

            return {
              name: f.name,
              path: f.path,
              chapter: chapterNum,
              size: f.size,
              sizeFormatted: f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : undefined,
            };
          })
          .sort((a, b) => {
            // Sort numerically if possible, otherwise alphabetically
            const aNum = parseInt(a.chapter);
            const bNum = parseInt(b.chapter);
            if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
            return a.chapter.localeCompare(b.chapter);
          });

        const catalogEntry = getBookByFolderId(id);

        return NextResponse.json({
          id,
          title: catalogEntry?.title || `Book ${id}`,
          author: catalogEntry?.author,
          discipline: catalogEntry?.discipline,
          chapterCount: chapters.length,
          chapters,
        });
      }

      case 'download-link': {
        const path = searchParams.get('path');
        if (!path) {
          return NextResponse.json({ error: 'File path required' }, { status: 400 });
        }

        const link = await getDownloadLink(path);
        return NextResponse.json({ path, downloadLink: link });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Books API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books - Add books to catalog
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.books && Array.isArray(body.books)) {
      addToCatalog(body.books as BookEntry[]);
      return NextResponse.json({
        success: true,
        added: body.books.length,
        totalCatalog: getCatalogStats().totalBooks,
      });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
