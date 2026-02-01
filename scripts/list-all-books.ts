/**
 * List all books in Dropbox
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

async function listAllInFolder(dbx: Dropbox, folderPath: string): Promise<any[]> {
  const allEntries: any[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  // First call
  const firstResult = await dbx.filesListFolder({ path: folderPath, limit: 2000 });
  allEntries.push(...firstResult.result.entries);
  cursor = firstResult.result.cursor;
  hasMore = firstResult.result.has_more;

  // Continue if there's more
  while (hasMore && cursor) {
    const moreResult = await dbx.filesListFolderContinue({ cursor });
    allEntries.push(...moreResult.result.entries);
    cursor = moreResult.result.cursor;
    hasMore = moreResult.result.has_more;
  }

  return allEntries;
}

async function main() {
  console.log('📚 Listing all books in Dropbox...\n');

  const accessToken = await getAccessToken();
  const dbx = new Dropbox({ accessToken });

  // Check /Books folder
  console.log('=== /Books ===');
  try {
    const entries = await listAllInFolder(dbx, '/Books');
    console.log(`Total items in /Books: ${entries.length}`);

    const folders = entries.filter(e => e['.tag'] === 'folder');
    const numericFolders = folders.filter(f => /^\d+$/.test(f.name));
    const namedFolders = folders.filter(f => !/^\d+$/.test(f.name));

    console.log(`\nNumeric folders (books): ${numericFolders.length}`);
    if (numericFolders.length > 0) {
      const sorted = numericFolders.map(f => f.name).sort((a, b) => parseInt(a) - parseInt(b));
      console.log(`  IDs: ${sorted.join(', ')}`);
    }

    console.log(`\nNamed folders: ${namedFolders.length}`);
    namedFolders.forEach(f => {
      console.log(`  📁 ${f.name}`);
    });

    // Explore named folders for more books
    for (const folder of namedFolders.slice(0, 10)) {
      const subPath = folder.path_display || `/Books/${folder.name}`;
      console.log(`\n  Checking ${folder.name}...`);
      try {
        const subEntries = await listAllInFolder(dbx, subPath);
        const subNumeric = subEntries.filter(e => e['.tag'] === 'folder' && /^\d+$/.test(e.name));
        if (subNumeric.length > 0) {
          console.log(`    ✅ Found ${subNumeric.length} book folders!`);
          const sorted = subNumeric.map(f => f.name).sort((a, b) => parseInt(a) - parseInt(b));
          console.log(`    Sample: ${sorted.slice(0, 10).join(', ')}${sorted.length > 10 ? '...' : ''}`);
        } else {
          const subFolders = subEntries.filter(e => e['.tag'] === 'folder').slice(0, 5);
          console.log(`    Contains: ${subFolders.map(f => f.name).join(', ') || '(files only)'}`);
        }
      } catch (err) {
        console.log(`    Could not access`);
      }
    }
  } catch (err: any) {
    console.log(`Could not access /Books: ${err.message}`);
  }

  // Also check /Public which had 109 items
  console.log('\n\n=== /Public ===');
  try {
    const entries = await listAllInFolder(dbx, '/Public');
    const numericFolders = entries.filter(e => e['.tag'] === 'folder' && /^\d+$/.test(e.name));

    if (numericFolders.length > 0) {
      console.log(`Found ${numericFolders.length} book folders!`);
      const sorted = numericFolders.map(f => f.name).sort((a, b) => parseInt(a) - parseInt(b));
      console.log(`Sample: ${sorted.slice(0, 20).join(', ')}`);
    } else {
      const folders = entries.filter(e => e['.tag'] === 'folder').slice(0, 10);
      console.log(`No numeric folders. Contains: ${folders.map(f => f.name).join(', ')}`);
    }
  } catch (err: any) {
    console.log(`Could not access /Public: ${err.message}`);
  }

  // Check /Public/CD Section which might have books
  console.log('\n\n=== /Public/CD Section ===');
  try {
    const entries = await listAllInFolder(dbx, '/Public/CD Section');
    const numericFolders = entries.filter(e => e['.tag'] === 'folder' && /^\d+$/.test(e.name));

    console.log(`Total items: ${entries.length}`);
    if (numericFolders.length > 0) {
      console.log(`Found ${numericFolders.length} book folders!`);
      const sorted = numericFolders.map(f => f.name).sort((a, b) => parseInt(a) - parseInt(b));
      console.log(`First 20: ${sorted.slice(0, 20).join(', ')}`);
      console.log(`Last 10: ${sorted.slice(-10).join(', ')}`);
    } else {
      const folders = entries.filter(e => e['.tag'] === 'folder').slice(0, 15);
      console.log(`Folders: ${folders.map(f => f.name).join(', ')}`);
    }
  } catch (err: any) {
    console.log(`Could not access: ${err.message}`);
  }

  console.log('\n✅ Done!');
}

main();
