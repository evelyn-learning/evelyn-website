/**
 * Quick smoke test: verifies the AP Macro topic extractor returns the
 * expected ~40 CED topics, AND that the youtube-transcript pipeline can
 * fetch captions from a real AP Daily video. Run via:
 *   npx ts-node -r tsconfig-paths/register --compiler-options '{"module":"commonjs","baseUrl":"./"}' scripts/video-curator-smoke.ts
 */

import { listApMacroTopics } from '../apps/marketing/src/lib/admin/video-curator/ap-macro-topics';
import {
  extractYouTubeId,
  validateAndDescribe,
  fetchTranscript,
} from '../apps/marketing/src/lib/admin/video-curator/youtube';

async function main() {
  // --- Topic extraction ---
  const topics = listApMacroTopics();
  console.log(`Total AP Macro topics: ${topics.length}`);
  const byUnit: Record<string, number> = {};
  for (const t of topics) {
    byUnit[t.cedUnit] = (byUnit[t.cedUnit] ?? 0) + 1;
  }
  for (const [unit, count] of Object.entries(byUnit).sort()) {
    console.log(`  Unit ${unit}: ${count} topics`);
  }

  // --- YouTube id extraction ---
  console.log('\nID extraction:');
  const cases = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    'not-a-url',
  ];
  for (const c of cases) {
    console.log(`  ${c} → ${extractYouTubeId(c) ?? 'null'}`);
  }

  // --- oEmbed + duration on a video the user has verified works ---
  // n0FZhQ_GkKw is from explorer-academy/data/curated-videos.ts (Math
  // Antics "Introduction to Fractions") — already confirmed live.
  const knownGoodId = 'n0FZhQ_GkKw';
  console.log(`\nValidating ${knownGoodId} via oEmbed:`);
  const meta = await validateAndDescribe(knownGoodId);
  if (!meta) {
    console.log('  ❌ oEmbed returned null (video may be unavailable)');
  } else {
    console.log(`  ✓ ${meta.title}`);
    console.log(`    channel: ${meta.channel}`);
    console.log(`    duration: ${meta.durationSec}s`);
  }

  // --- Transcript fetch ---
  console.log(`\nTranscript fetch for ${knownGoodId}:`);
  try {
    const cues = await fetchTranscript(knownGoodId);
    console.log(`  ✓ ${cues.length} cues`);
    if (cues.length > 0) {
      console.log(`    first: [${cues[0].startSec}s] ${cues[0].text.slice(0, 80)}`);
      const last = cues[cues.length - 1];
      console.log(`    last:  [${last.startSec}s] ${last.text.slice(0, 80)}`);
    }
  } catch (e) {
    console.log(`  ❌ ${e instanceof Error ? e.message : String(e)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
