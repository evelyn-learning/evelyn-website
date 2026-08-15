/**
 * Explore Dropbox to find book folders
 */

import { Dropbox } from 'dropbox';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function getAccessToken(): Promise<string> {
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;

  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken!,
      client_id: appKey!,
      client_secret: appSecret!,
    }).toString(),
  });

  const data = await response.json();
  return data.access_token;
}

async function exploreFolder(dbx: Dropbox, path: string, depth: number = 0): Promise<void> {
  const indent = '  '.repeat(depth);

  try {
    const result = await dbx.filesListFolder({ path, limit: 50 });
    const entries = result.result.entries;

    // Check for numeric folders
    const numericFolders = entries.filter(e => e['.tag'] === 'folder' && /^\d+$/.test(e.name));

    if (numericFolders.length > 0) {
      console.log(`${indent}📚 FOUND ${numericFolders.length} BOOK FOLDERS in ${path || '/'}`);
      console.log(`${indent}   Sample: ${numericFolders.slice(0, 10).map(f => f.name).join(', ')}`);

      // Look inside first book
      if (numericFolders.length > 0) {
        const firstBook = numericFolders[0];
        const bookPath = firstBook.path_display || `${path}/${firstBook.name}`;
        console.log(`${indent}   📂 Contents of ${firstBook.name}:`);
        const bookContents = await dbx.filesListFolder({ path: bookPath });
        bookContents.result.entries.forEach(e => {
          const size = e['.tag'] === 'file' ? ` (${((e as any).size / 1024 / 1024).toFixed(1)} MB)` : '';
          console.log(`${indent}      - ${e.name}${size}`);
        });
      }
      return;
    }

    // List folders and check promising ones
    const folders = entries.filter(e => e['.tag'] === 'folder');
    const promisingNames = ['books', 'textbook', 'school', 'content', 'library', 'pdfs', 'ebooks'];

    for (const folder of folders) {
      const isPromising = promisingNames.some(n => folder.name.toLowerCase().includes(n));
      const icon = isPromising ? '📁' : '📂';
      console.log(`${indent}${icon} ${folder.name}`);

      if (isPromising && depth < 3) {
        const folderPath = folder.path_display || `${path}/${folder.name}`;
        await exploreFolder(dbx, folderPath, depth + 1);
      }
    }
  } catch (err: any) {
    console.log(`${indent}❌ Could not access ${path}: ${err.message}`);
  }
}

async function main() {
  console.log('🔍 Exploring Dropbox for book folders...\n');

  const accessToken = await getAccessToken();
  const dbx = new Dropbox({ accessToken });

  // Start from root
  await exploreFolder(dbx, '');

  // Also check specific paths that might contain books
  const pathsToCheck = [
    '/School textbooks',
    '/Books',
    '/Public',
    '/tmp',
  ];

  console.log('\n📍 Checking specific paths...\n');

  for (const checkPath of pathsToCheck) {
    console.log(`\n=== ${checkPath} ===`);
    try {
      const result = await dbx.filesListFolder({ path: checkPath, limit: 100 });
      const numericFolders = result.result.entries
        .filter(e => e['.tag'] === 'folder' && /^\d+$/.test(e.name))
        .map(e => e.name)
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (numericFolders.length > 0) {
        console.log(`✅ Found ${numericFolders.length} book folders!`);
        console.log(`   First 15: ${numericFolders.slice(0, 15).join(', ')}`);
        console.log(`   Last 5: ${numericFolders.slice(-5).join(', ')}`);

        // Sample one book
        const sampleBook = numericFolders[Math.floor(numericFolders.length / 2)];
        console.log(`\n   Sample book folder ${sampleBook}:`);
        const bookContents = await dbx.filesListFolder({ path: `${checkPath}/${sampleBook}` });
        bookContents.result.entries.forEach(e => {
          const size = e['.tag'] === 'file' ? ` (${((e as any).size / 1024 / 1024).toFixed(1)} MB)` : '';
          console.log(`   - ${e.name}${size}`);
        });
      } else {
        const folders = result.result.entries.filter(e => e['.tag'] === 'folder').slice(0, 10);
        console.log(`No numeric folders. Contains: ${folders.map(f => f.name).join(', ')}`);
      }
    } catch (err: any) {
      console.log(`Could not access: ${err.message?.slice(0, 100)}`);
    }
  }

  console.log('\n✅ Exploration complete!');
}

main();
