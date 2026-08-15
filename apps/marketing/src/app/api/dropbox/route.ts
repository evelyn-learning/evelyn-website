/**
 * Dropbox API Routes
 *
 * Endpoints for testing connection, browsing books, and downloading content.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  testConnection,
  listFolder,
  listBookFolders,
  getBookFolder,
  searchFiles,
  getDownloadLink,
  getStorageInfo,
} from '@/lib/services/dropbox';

/**
 * GET /api/dropbox - Test connection and get account info
 * GET /api/dropbox?action=list&path=/folder - List folder contents
 * GET /api/dropbox?action=books&path=/base - List book folders
 * GET /api/dropbox?action=book&id=4679&path=/base - Get specific book folder
 * GET /api/dropbox?action=search&q=physics - Search files
 * GET /api/dropbox?action=link&path=/file.pdf - Get download link
 * GET /api/dropbox?action=storage - Get storage info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'test';
    const path = searchParams.get('path') || '';

    switch (action) {
      case 'test': {
        const result = await testConnection();
        return NextResponse.json(result);
      }

      case 'list': {
        const contents = await listFolder(path);
        return NextResponse.json({
          path: path || '/',
          count: contents.length,
          contents,
        });
      }

      case 'books': {
        const books = await listBookFolders(path);
        return NextResponse.json({
          basePath: path || '/',
          count: books.length,
          bookFolders: books,
        });
      }

      case 'book': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
        }
        const book = await getBookFolder(id, path);
        return NextResponse.json(book);
      }

      case 'search': {
        const query = searchParams.get('q');
        if (!query) {
          return NextResponse.json({ error: 'Search query required' }, { status: 400 });
        }
        const results = await searchFiles(query, path);
        return NextResponse.json({
          query,
          count: results.length,
          results,
        });
      }

      case 'link': {
        const filePath = searchParams.get('file');
        if (!filePath) {
          return NextResponse.json({ error: 'File path required' }, { status: 400 });
        }
        const link = await getDownloadLink(filePath);
        return NextResponse.json({ path: filePath, downloadLink: link });
      }

      case 'storage': {
        const storage = await getStorageInfo();
        return NextResponse.json(storage);
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Dropbox API] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
