/**
 * Offline batch curator: walks every AP Macro CED topic, asks Claude
 * (with web search) for the 2 best YouTube videos teaching the topic,
 * fetches the transcript for each, asks Claude for the single best clip
 * inside each video, and writes the results to the drafts file. The
 * admin UI then reads those drafts for review/approval.
 *
 * Run via:
 *   TS_NODE_BASEURL=./ npx ts-node \
 *     -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./","esModuleInterop":true}' \
 *     scripts/curate-ap-macro-videos.ts [--force] [--only=ap-macro-1.1]
 *
 * Flags:
 *   --force           Re-process topics that already have drafts.
 *   --only=<id>       Only process the matching conceptId (or comma list).
 *   --limit=<n>       Stop after n topics (useful for smoke tests).
 */

import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { listApMacroTopics } from '../src/lib/admin/video-curator/ap-macro-topics';
import { findClipsForTopic } from '../src/lib/admin/video-curator/find-clips';
import {
  readDrafts,
  replaceDraftsForConcept,
} from '../src/lib/admin/video-curator/drafts-store';

interface Args {
  force: boolean;
  only: Set<string> | null;
  limit: number | null;
}

function parseArgs(): Args {
  const args: Args = { force: false, only: null, limit: null };
  for (const raw of process.argv.slice(2)) {
    if (raw === '--force') args.force = true;
    else if (raw.startsWith('--only=')) {
      args.only = new Set(raw.slice('--only='.length).split(',').map((s) => s.trim()));
    } else if (raw.startsWith('--limit=')) {
      args.limit = Number(raw.slice('--limit='.length));
    }
  }
  return args;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  const args = parseArgs();
  let topics = listApMacroTopics();
  if (args.only) topics = topics.filter((t) => args.only!.has(t.conceptId));
  if (args.limit !== null) topics = topics.slice(0, args.limit);

  console.log(`Found ${topics.length} AP Macro topics to process${args.force ? ' (--force on)' : ''}.`);

  const existing = await readDrafts();
  // Track how many *valid* clips a concept already has. A draft with
  // `clip: null` (failed segmentation, dead ID, transcript missing) is
  // worth retrying next run — only a successfully-clipped concept should
  // be considered "done" for skip purposes.
  const validClipsByConcept = new Map<string, number>();
  for (const d of existing.drafts) {
    if (d.clip !== null) {
      validClipsByConcept.set(
        d.conceptId,
        (validClipsByConcept.get(d.conceptId) ?? 0) + 1,
      );
    }
  }

  let processed = 0;
  let skipped = 0;
  let totalDrafts = 0;
  let totalErrors = 0;
  const startedAt = Date.now();

  for (const topic of topics) {
    const tag = `[${topic.conceptId}]`;
    const validCount = validClipsByConcept.get(topic.conceptId) ?? 0;
    if (!args.force && validCount > 0) {
      console.log(`${tag} skip — already has ${validCount} valid clip(s) (use --force to re-run)`);
      skipped++;
      continue;
    }
    console.log(`${tag} ${topic.cedTitle} — fetching…`);
    const t0 = Date.now();
    try {
      const { drafts, searchQueries, topLevelErrors } = await findClipsForTopic(topic);
      const dur = ((Date.now() - t0) / 1000).toFixed(1);
      const validClips = drafts.filter((d) => d.clip !== null).length;
      const draftErrors = drafts.reduce((acc, d) => acc + d.errors.length, 0);
      totalDrafts += drafts.length;
      totalErrors += draftErrors + topLevelErrors.length;
      console.log(
        `${tag} ✓ ${dur}s — ${drafts.length} drafts (${validClips} with clip), ` +
          `${searchQueries.length} backup queries, ${draftErrors + topLevelErrors.length} errors`,
      );
      if (topLevelErrors.length > 0) {
        for (const e of topLevelErrors) console.log(`${tag}   ⚠ ${e}`);
      }
      for (const d of drafts) {
        const status = d.clip ? '✓' : d.video ? '∅' : '✗';
        const channel = d.video?.channel ?? '?';
        const title = d.video?.title ?? '?';
        console.log(`${tag}   ${status} [${d.sourceQuality}] ${channel} — ${title}`);
        if (d.clip) {
          console.log(
            `${tag}     clip ${d.clip.startSec}s–${d.clip.endSec}s (${d.clip.endSec - d.clip.startSec}s) ` +
              `conf=${d.clip.confidence.toFixed(2)}`,
          );
        }
        for (const err of d.errors) console.log(`${tag}     ⚠ ${err}`);
      }
      await replaceDraftsForConcept(topic.conceptId, drafts, searchQueries);
      processed++;
    } catch (e) {
      console.error(`${tag} ✗ failed:`, e instanceof Error ? e.message : e);
      totalErrors++;
    }
  }

  const totalDur = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `\nDone in ${totalDur}s. Processed ${processed}, skipped ${skipped}. ` +
      `Total drafts: ${totalDrafts}. Total errors logged: ${totalErrors}.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
