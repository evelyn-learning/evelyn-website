/**
 * Discover all sheet GIDs in a Google Spreadsheet
 */

const SPREADSHEET_ID = '1EehqNbDVuxNjISDb1UXlRmrqyVUhTbnEI4XlqwFsl3g';

async function fetchSheetCSV(gid: number): Promise<string | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    });

    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 20) {
        return text;
      }
    }
  } catch {}
  return null;
}

async function main() {
  console.log('🔍 Discovering sheet GIDs...\n');

  const foundSheets: Array<{ gid: number; preview: string; rows: number }> = [];

  // Try a wide range of GIDs
  // Google Sheets GIDs can be any number, but there are some common patterns
  const gidsToTry = [
    // Sequential from 0
    ...Array.from({ length: 20 }, (_, i) => i),
    // Common larger values
    100, 200, 500, 1000, 2000,
    // Try some random larger numbers that might be auto-generated
    111111111, 222222222, 333333333,
    1234567890, 987654321,
    // Powers of 2 based
    256, 512, 1024, 2048,
  ];

  console.log(`Testing ${gidsToTry.length} potential GIDs...\n`);

  for (const gid of gidsToTry) {
    const csv = await fetchSheetCSV(gid);
    if (csv) {
      const lines = csv.split('\n');
      const preview = lines[0].slice(0, 100);
      foundSheets.push({ gid, preview, rows: lines.length });
      console.log(`✅ GID ${gid}: ${lines.length} rows`);
      console.log(`   ${preview}...\n`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`Found ${foundSheets.length} sheets`);
  console.log('\nUse these GIDs in sync-book-catalog.ts:');
  console.log(JSON.stringify(foundSheets.map(s => s.gid)));
}

main();
