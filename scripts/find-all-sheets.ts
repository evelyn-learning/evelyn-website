/**
 * Brute-force find all sheet GIDs
 * Google Sheets uses large random-ish numbers for GIDs
 */

const SPREADSHEET_ID = '1EehqNbDVuxNjISDb1UXlRmrqyVUhTbnEI4XlqwFsl3g';

async function checkGid(gid: number): Promise<{ gid: number; preview: string; rows: number } | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    });

    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 50 && !text.includes('<!DOCTYPE')) {
        const lines = text.split('\n');
        return { gid, preview: lines[0].slice(0, 120), rows: lines.length };
      }
    }
  } catch {}
  return null;
}

async function main() {
  console.log('🔍 Searching for all sheet GIDs...\n');

  const foundSheets: Array<{ gid: number; preview: string; rows: number }> = [];

  // Known working GIDs
  const knownGids = [0, 1, 4];

  // Try ranges around known GIDs and common patterns
  const gidsToTry = new Set<number>([
    // Known working
    ...knownGids,
    // Sequential 0-20
    ...Array.from({ length: 21 }, (_, i) => i),
    // Around GID 4
    ...Array.from({ length: 20 }, (_, i) => i + 100),
    // Try some common patterns Google uses (timestamp-like)
    1000000000, 1100000000, 1200000000, 1300000000, 1400000000,
    1500000000, 1600000000, 1700000000, 1800000000, 1900000000,
    2000000000,
    // Some other patterns
    ...Array.from({ length: 100 }, (_, i) => 100000000 + i * 10000000),
    // Recent timestamps (GIDs might be based on creation time)
    ...Array.from({ length: 50 }, (_, i) => 1600000000 + i * 50000000),
  ]);

  const gidArray = [...gidsToTry].sort((a, b) => a - b);
  console.log(`Testing ${gidArray.length} potential GIDs...\n`);

  // Test in parallel batches
  const batchSize = 20;
  for (let i = 0; i < gidArray.length; i += batchSize) {
    const batch = gidArray.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkGid));

    for (const result of results) {
      if (result) {
        foundSheets.push(result);
        console.log(`✅ GID ${result.gid}: ${result.rows} rows`);
        console.log(`   ${result.preview}...\n`);
      }
    }

    // Progress indicator
    if ((i + batchSize) % 100 === 0) {
      process.stdout.write(`   Checked ${Math.min(i + batchSize, gidArray.length)}/${gidArray.length}...\r`);
    }
  }

  console.log('\n\n📊 Summary:');
  console.log(`Found ${foundSheets.length} sheets\n`);

  foundSheets.sort((a, b) => a.gid - b.gid);

  for (const sheet of foundSheets) {
    console.log(`GID ${sheet.gid} (${sheet.rows} rows):`);
    console.log(`  ${sheet.preview.slice(0, 80)}...\n`);
  }

  console.log('\n📋 GIDs to use:');
  console.log(JSON.stringify(foundSheets.map(s => s.gid)));
}

main();
