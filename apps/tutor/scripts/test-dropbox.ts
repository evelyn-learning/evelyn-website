/**
 * Test script for Dropbox integration
 *
 * Run with: npx tsx scripts/test-dropbox.ts
 */

import { Dropbox } from 'dropbox';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function getAccessToken(): Promise<string> {
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;

  if (refreshToken && appKey && appSecret) {
    // Use refresh token to get new access token
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: appKey,
        client_secret: appSecret,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${await response.text()}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  // Fall back to static access token
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('No Dropbox credentials found');
  }
  return accessToken;
}

async function main() {
  console.log('🔗 Testing Dropbox connection...\n');

  try {
    const accessToken = await getAccessToken();
    const dbx = new Dropbox({ accessToken });

    // Test 1: Get account info
    console.log('1️⃣ Getting account info...');
    const account = await dbx.usersGetCurrentAccount();
    console.log(`   ✅ Connected as: ${account.result.name.display_name}`);
    console.log(`   📧 Email: ${account.result.email}\n`);

    // Test 2: Get storage info
    console.log('2️⃣ Getting storage info...');
    const space = await dbx.usersGetSpaceUsage();
    const usedGB = (space.result.used / (1024 * 1024 * 1024)).toFixed(2);
    const allocatedGB = ((space.result.allocation as any).allocated / (1024 * 1024 * 1024)).toFixed(2);
    console.log(`   💾 Storage: ${usedGB} GB / ${allocatedGB} GB\n`);

    // Test 3: List root folder
    console.log('3️⃣ Listing root folder...');
    const rootContents = await dbx.filesListFolder({ path: '' });
    console.log(`   📁 Found ${rootContents.result.entries.length} items in root:`);
    rootContents.result.entries.slice(0, 15).forEach((entry) => {
      const icon = entry['.tag'] === 'folder' ? '📁' : '📄';
      console.log(`      ${icon} ${entry.name}`);
    });
    if (rootContents.result.entries.length > 15) {
      console.log(`      ... and ${rootContents.result.entries.length - 15} more`);
    }
    console.log('');

    // Test 4: Find numeric folders (book IDs)
    console.log('4️⃣ Looking for book folders (numeric names)...');
    const numericFolders = rootContents.result.entries
      .filter((e) => e['.tag'] === 'folder' && /^\d+$/.test(e.name))
      .map((e) => e.name)
      .sort((a, b) => parseInt(a) - parseInt(b));

    if (numericFolders.length > 0) {
      console.log(`   📚 Found ${numericFolders.length} book folders in root:`);
      console.log(`      First 10: ${numericFolders.slice(0, 10).join(', ')}`);
      if (numericFolders.length > 10) {
        console.log(`      Last 5: ${numericFolders.slice(-5).join(', ')}`);
      }

      // Look inside first book folder
      const firstBook = numericFolders[0];
      console.log(`\n   📂 Contents of folder ${firstBook}:`);
      const bookContents = await dbx.filesListFolder({ path: `/${firstBook}` });
      bookContents.result.entries.slice(0, 5).forEach((entry) => {
        const icon = entry['.tag'] === 'folder' ? '📁' : '📄';
        const size = entry['.tag'] === 'file'
          ? ` (${((entry as any).size / 1024 / 1024).toFixed(1)} MB)`
          : '';
        console.log(`      ${icon} ${entry.name}${size}`);
      });
    } else {
      console.log('   ⚠️ No numeric folders found in root. Checking subfolders...');

      // Check subfolders
      const subfolders = rootContents.result.entries
        .filter((e) => e['.tag'] === 'folder')
        .slice(0, 5);

      for (const folder of subfolders) {
        console.log(`\n   📂 Checking ${folder.name}...`);
        try {
          const subContents = await dbx.filesListFolder({
            path: folder.path_display || `/${folder.name}`
          });
          const subNumericFolders = subContents.result.entries
            .filter((e) => e['.tag'] === 'folder' && /^\d+$/.test(e.name))
            .map((e) => e.name);

          if (subNumericFolders.length > 0) {
            console.log(`      ✅ Found ${subNumericFolders.length} book folders here!`);
            console.log(`      Sample: ${subNumericFolders.slice(0, 5).join(', ')}`);
            console.log(`      📍 Books are in: ${folder.path_display || `/${folder.name}`}`);
          } else {
            const itemCount = subContents.result.entries.length;
            const sampleItems = subContents.result.entries.slice(0, 3).map(e => e.name);
            console.log(`      ${itemCount} items: ${sampleItems.join(', ')}${itemCount > 3 ? '...' : ''}`);
          }
        } catch (err) {
          console.log(`      ❌ Could not access`);
        }
      }
    }
    console.log('');

    // Test 5: Search for physics books
    console.log('5️⃣ Searching for "physics" files...');
    try {
      const searchResults = await dbx.filesSearchV2({
        query: 'physics',
        options: { max_results: 10 },
      });
      console.log(`   🔍 Found ${searchResults.result.matches.length} matches:`);
      searchResults.result.matches.slice(0, 5).forEach((match) => {
        const metadata = (match.metadata as any).metadata;
        console.log(`      📄 ${metadata.name}`);
        console.log(`         Path: ${metadata.path_display}`);
      });
    } catch (err) {
      console.log(`   ⚠️ Search not available or no results`);
    }

    console.log('\n✅ Dropbox integration test complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
