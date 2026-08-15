/**
 * Book Catalog Service
 *
 * Maps Dropbox folder numbers to book metadata from Google Sheets catalog.
 * Supports searching by subject, title, author, and ISBN.
 */

export interface BookEntry {
  folderId: string;
  title: string;
  author: string;
  discipline: string;
  isbn?: string;
  edition?: string;
  dropboxPath?: string;
  source?: string; // Which sheet/tab it came from
}

export interface BookSearchResult {
  book: BookEntry;
  relevanceScore: number;
  matchedOn: string[];
}

// In-memory catalog store
let catalog: BookEntry[] = [];
let catalogLoaded = false;

/**
 * Extract book ID from various folder naming conventions
 * Handles: "7203", "book 10210", "Book-515961", "book-719728"
 */
export function extractBookId(folderName: string): string | null {
  // Direct numeric folder
  if (/^\d+$/.test(folderName)) {
    return folderName;
  }

  // "book 10210" or "Book 7203"
  const spaceMatch = folderName.match(/^book\s+(\d+)/i);
  if (spaceMatch) {
    return spaceMatch[1];
  }

  // "book-719728" or "Book-515961"
  const dashMatch = folderName.match(/^book-(\d+)/i);
  if (dashMatch) {
    return dashMatch[1];
  }

  // "Text book 11459"
  const textbookMatch = folderName.match(/text\s*book\s+(\d+)/i);
  if (textbookMatch) {
    return textbookMatch[1];
  }

  return null;
}

/**
 * Normalize discipline names for consistent searching
 */
function normalizeDiscipline(discipline: string): string {
  const normalized = discipline.toLowerCase().trim();

  // Map common variations to standard names
  const mappings: Record<string, string> = {
    'phy': 'physics',
    'phys': 'physics',
    'chem': 'chemistry',
    'bio': 'biology',
    'math': 'mathematics',
    'maths': 'mathematics',
    'calc': 'mathematics',
    'calculus': 'mathematics',
    'algebra': 'mathematics',
    'stats': 'statistics',
    'stat': 'statistics',
    'econ': 'economics',
    'cs': 'computer science',
    'comp sci': 'computer science',
    'eng': 'engineering',
    'psych': 'psychology',
    'socio': 'sociology',
    'hist': 'history',
  };

  return mappings[normalized] || normalized;
}

/**
 * Add books to the catalog
 */
export function addToCatalog(books: BookEntry[]): void {
  for (const book of books) {
    // Normalize discipline
    book.discipline = normalizeDiscipline(book.discipline);

    // Check for duplicates
    const existing = catalog.find(b => b.folderId === book.folderId);
    if (!existing) {
      catalog.push(book);
    } else {
      // Update with newer info if available
      Object.assign(existing, book);
    }
  }
  catalogLoaded = true;
}

/**
 * Load catalog from a CSV string (exported from Google Sheets)
 */
export function loadCatalogFromCSV(csv: string, source: string = 'unknown'): number {
  const lines = csv.split('\n');
  if (lines.length < 2) return 0;

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Find relevant column indices
  const findColumn = (...names: string[]): number => {
    for (const name of names) {
      const idx = headers.findIndex(h => h.includes(name));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const idCol = findColumn('folder', 'book id', 'id', 'number');
  const titleCol = findColumn('title', 'name', 'book name');
  const authorCol = findColumn('author');
  const disciplineCol = findColumn('discipline', 'subject', 'category');
  const isbnCol = findColumn('isbn');
  const editionCol = findColumn('edition');

  if (titleCol < 0) {
    console.warn(`[BookCatalog] No title column found in ${source}`);
    return 0;
  }

  let added = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const values = parseCSVLine(line);

    const title = values[titleCol]?.trim();
    if (!title) continue;

    const book: BookEntry = {
      folderId: idCol >= 0 ? values[idCol]?.trim() || '' : '',
      title,
      author: authorCol >= 0 ? values[authorCol]?.trim() || '' : '',
      discipline: disciplineCol >= 0 ? values[disciplineCol]?.trim() || '' : '',
      isbn: isbnCol >= 0 ? values[isbnCol]?.trim() : undefined,
      edition: editionCol >= 0 ? values[editionCol]?.trim() : undefined,
      source,
    };

    // Try to extract folder ID from title if not explicitly provided
    if (!book.folderId) {
      const extracted = extractBookId(title);
      if (extracted) book.folderId = extracted;
    }

    if (book.folderId || book.title) {
      addToCatalog([book]);
      added++;
    }
  }

  return added;
}

/**
 * Parse a CSV line handling quoted fields
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

/**
 * Get all books in a discipline/subject
 */
export function getBooksByDiscipline(discipline: string): BookEntry[] {
  const normalized = normalizeDiscipline(discipline);
  return catalog.filter(book =>
    book.discipline.includes(normalized) ||
    normalized.includes(book.discipline)
  );
}

/**
 * Search books by query (searches title, author, discipline, ISBN)
 */
export function searchBooks(query: string, limit: number = 50): BookSearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const results: BookSearchResult[] = [];

  for (const book of catalog) {
    const searchText = `${book.title} ${book.author} ${book.discipline} ${book.isbn || ''}`.toLowerCase();
    let score = 0;
    const matchedOn: string[] = [];

    for (const term of terms) {
      if (book.title.toLowerCase().includes(term)) {
        score += 3;
        matchedOn.push('title');
      }
      if (book.author.toLowerCase().includes(term)) {
        score += 2;
        matchedOn.push('author');
      }
      if (book.discipline.toLowerCase().includes(term)) {
        score += 2;
        matchedOn.push('discipline');
      }
      if (book.isbn?.includes(term)) {
        score += 5; // ISBN is very specific
        matchedOn.push('isbn');
      }
    }

    if (score > 0) {
      results.push({
        book,
        relevanceScore: score,
        matchedOn: [...new Set(matchedOn)],
      });
    }
  }

  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

/**
 * Get book by folder ID
 */
export function getBookByFolderId(folderId: string): BookEntry | undefined {
  return catalog.find(book => book.folderId === folderId);
}

/**
 * Get all unique disciplines in the catalog
 */
export function getAllDisciplines(): string[] {
  const disciplines = new Set(catalog.map(book => book.discipline).filter(d => d));
  return [...disciplines].sort();
}

/**
 * Get catalog statistics
 */
export function getCatalogStats(): {
  totalBooks: number;
  byDiscipline: Record<string, number>;
  withFolderId: number;
  sources: string[];
} {
  const byDiscipline: Record<string, number> = {};

  for (const book of catalog) {
    const disc = book.discipline || 'unknown';
    byDiscipline[disc] = (byDiscipline[disc] || 0) + 1;
  }

  const sources = [...new Set(catalog.map(b => b.source).filter(Boolean))] as string[];

  return {
    totalBooks: catalog.length,
    byDiscipline,
    withFolderId: catalog.filter(b => b.folderId).length,
    sources,
  };
}

/**
 * Clear the catalog
 */
export function clearCatalog(): void {
  catalog = [];
  catalogLoaded = false;
}

/**
 * Check if catalog is loaded
 */
export function isCatalogLoaded(): boolean {
  return catalogLoaded && catalog.length > 0;
}

/**
 * Get all books in catalog
 */
export function getAllBooks(): BookEntry[] {
  return [...catalog];
}
