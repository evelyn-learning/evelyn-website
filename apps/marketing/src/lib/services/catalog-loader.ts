/**
 * Catalog Loader
 *
 * Loads the book catalog from the synced JSON file and initializes the catalog service.
 */

import { addToCatalog, isCatalogLoaded, getCatalogStats, type BookEntry } from './book-catalog';

// Import the catalog data
import catalogData from '../data/book-catalog.json';

let initialized = false;

/**
 * Initialize the book catalog from the synced JSON file
 */
export function initializeCatalog(): void {
  if (initialized || isCatalogLoaded()) {
    return;
  }

  try {
    const books = (catalogData as any).books as BookEntry[];
    if (books && books.length > 0) {
      addToCatalog(books);
      initialized = true;
      console.log(`[CatalogLoader] Loaded ${books.length} books from catalog`);
    }
  } catch (err) {
    console.error('[CatalogLoader] Failed to load catalog:', err);
  }
}

/**
 * Get catalog info
 */
export function getCatalogInfo(): {
  loaded: boolean;
  syncedAt: string;
  totalBooks: number;
  withFolderId: number;
  byDiscipline: Record<string, number>;
} {
  initializeCatalog();

  return {
    loaded: isCatalogLoaded(),
    syncedAt: (catalogData as any).syncedAt || 'unknown',
    ...(getCatalogStats()),
  };
}

// Auto-initialize when module is imported
initializeCatalog();
