/**
 * Dropbox Integration Service
 *
 * Connects to Dropbox to browse and download textbooks for the knowledge base.
 * Books are stored in numbered folders (e.g., 4679, 10210) with metadata
 * mapped via Google Sheets catalog.
 */

import { Dropbox, files } from 'dropbox';

// Cache for the access token
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;

  if (!refreshToken || !appKey || !appSecret) {
    throw new Error('DROPBOX_REFRESH_TOKEN, DROPBOX_APP_KEY, and DROPBOX_APP_SECRET required for token refresh');
  }

  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: appKey,
      client_secret: appSecret,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  // Set expiry 5 minutes before actual expiry for safety
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

  return data.access_token;
}

/**
 * Get a valid access token, refreshing if necessary
 */
async function getValidAccessToken(): Promise<string> {
  // If we have a cached token that's still valid, use it
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // If we have a refresh token, use it to get a new access token
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  if (refreshToken) {
    return await refreshAccessToken();
  }

  // Fall back to the static access token (may be expired)
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('DROPBOX_ACCESS_TOKEN or DROPBOX_REFRESH_TOKEN not configured');
  }

  return accessToken;
}

// Initialize Dropbox client with auto-refresh
async function getDropboxClient(): Promise<Dropbox> {
  const accessToken = await getValidAccessToken();
  return new Dropbox({ accessToken });
}

// Types for our book catalog
export interface BookMetadata {
  folderNumber: string;
  title: string;
  author: string;
  discipline: string; // Physics, Chemistry, Math, Biology, etc.
  isbn?: string;
  edition?: string;
  dropboxPath?: string;
}

export interface DropboxFileInfo {
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
  modified?: string;
}

export interface BookFolder {
  folderNumber: string;
  path: string;
  files: DropboxFileInfo[];
  metadata?: BookMetadata;
}

/**
 * Test the Dropbox connection and return account info
 */
export async function testConnection(): Promise<{
  connected: boolean;
  accountName?: string;
  email?: string;
  error?: string;
}> {
  try {
    const dbx = await getDropboxClient();
    const response = await dbx.usersGetCurrentAccount();
    return {
      connected: true,
      accountName: response.result.name.display_name,
      email: response.result.email,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List contents of a folder
 */
export async function listFolder(path: string = ''): Promise<DropboxFileInfo[]> {
  const dbx = await getDropboxClient();
  const response = await dbx.filesListFolder({ path });

  return response.result.entries.map((entry) => ({
    name: entry.name,
    path: entry.path_display || entry.path_lower || '',
    isFolder: entry['.tag'] === 'folder',
    size: entry['.tag'] === 'file' ? (entry as files.FileMetadata).size : undefined,
    modified: entry['.tag'] === 'file' ? (entry as files.FileMetadata).server_modified : undefined,
  }));
}

/**
 * List all book folders (numeric folder names)
 */
export async function listBookFolders(basePath: string = ''): Promise<string[]> {
  const contents = await listFolder(basePath);

  // Filter for folders with numeric names (book IDs)
  return contents
    .filter((item) => item.isFolder && /^\d+$/.test(item.name))
    .map((item) => item.name)
    .sort((a, b) => parseInt(a) - parseInt(b));
}

/**
 * Get details of a specific book folder
 */
export async function getBookFolder(
  folderNumber: string,
  basePath: string = ''
): Promise<BookFolder> {
  const folderPath = basePath ? `${basePath}/${folderNumber}` : `/${folderNumber}`;
  const files = await listFolder(folderPath);

  return {
    folderNumber,
    path: folderPath,
    files,
  };
}

/**
 * Search for files by name or content
 */
export async function searchFiles(
  query: string,
  path: string = '',
  maxResults: number = 100
): Promise<DropboxFileInfo[]> {
  const dbx = await getDropboxClient();

  const response = await dbx.filesSearchV2({
    query,
    options: {
      path: path || undefined,
      max_results: maxResults,
      file_extensions: ['pdf', 'PDF'],
    },
  });

  return response.result.matches
    .filter((match) => match.metadata && (match.metadata as any).metadata)
    .map((match) => {
      const metadata = (match.metadata as any).metadata as files.FileMetadata;
      return {
        name: metadata.name,
        path: metadata.path_display || metadata.path_lower || '',
        isFolder: false,
        size: metadata.size,
        modified: metadata.server_modified,
      };
    });
}

/**
 * Search for books by discipline/subject
 */
export async function searchBooksBySubject(
  subject: string,
  catalog: BookMetadata[]
): Promise<BookMetadata[]> {
  const normalizedSubject = subject.toLowerCase();

  return catalog.filter((book) =>
    book.discipline.toLowerCase().includes(normalizedSubject) ||
    book.title.toLowerCase().includes(normalizedSubject)
  );
}

/**
 * Download a file from Dropbox
 */
export async function downloadFile(path: string): Promise<Buffer> {
  const dbx = await getDropboxClient();
  const response = await dbx.filesDownload({ path });

  // The file content is in the 'fileBinary' property
  const fileData = response.result as any;
  if (fileData.fileBinary) {
    return Buffer.from(fileData.fileBinary);
  }

  throw new Error('No file data received');
}

/**
 * Get a temporary download link for a file
 */
export async function getDownloadLink(path: string): Promise<string> {
  const dbx = await getDropboxClient();
  const response = await dbx.filesGetTemporaryLink({ path });
  return response.result.link;
}

/**
 * Get thumbnail/preview of first page (for PDFs)
 */
export async function getThumbnail(
  path: string,
  size: 'w32h32' | 'w64h64' | 'w128h128' | 'w256h256' | 'w480h320' | 'w640h480' | 'w960h640' | 'w1024h768' = 'w256h256'
): Promise<Buffer | null> {
  try {
    const dbx = await getDropboxClient();
    const response = await dbx.filesGetThumbnailV2({
      resource: { '.tag': 'path', path },
      size: { '.tag': size },
      format: { '.tag': 'png' },
    });

    const data = response.result as any;
    if (data.fileBinary) {
      return Buffer.from(data.fileBinary);
    }
    return null;
  } catch {
    // Thumbnails may not be available for all files
    return null;
  }
}

/**
 * Build a catalog from the folder structure
 * This scans Dropbox and creates a mapping of folder numbers to their contents
 */
export async function buildFolderIndex(basePath: string = ''): Promise<Map<string, BookFolder>> {
  const index = new Map<string, BookFolder>();
  const folderNumbers = await listBookFolders(basePath);

  // Process in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < folderNumbers.length; i += batchSize) {
    const batch = folderNumbers.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((num) => getBookFolder(num, basePath))
    );
    results.forEach((folder) => index.set(folder.folderNumber, folder));
  }

  return index;
}

/**
 * Get storage usage information
 */
export async function getStorageInfo(): Promise<{
  used: number;
  allocated: number;
  usedFormatted: string;
  allocatedFormatted: string;
  percentUsed: number;
}> {
  const dbx = await getDropboxClient();
  const response = await dbx.usersGetSpaceUsage();

  const used = response.result.used;
  const allocated = (response.result.allocation as any).allocated || 0;

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return {
    used,
    allocated,
    usedFormatted: formatBytes(used),
    allocatedFormatted: formatBytes(allocated),
    percentUsed: allocated > 0 ? (used / allocated) * 100 : 0,
  };
}
