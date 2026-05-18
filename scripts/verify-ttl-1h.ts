/**
 * Stage 1 item-1 verification — does cache_control {type:'ephemeral',
 * ttl:'1h'} keep a prompt-cache entry alive PAST the 5-minute default?
 *
 * Isolated single-variable test. TTL is a property of the cache_control
 * field, NOT of our 64K brain prompt — so a minimal ~1.5K-token cached
 * block proves the same behavior at ~$0.02 instead of ~$0.40. Voice-free,
 * frozen-baseline-safe.
 *
 * Method: call 1 writes the block to a 1h-TTL cache; sleep ~6 min (well
 * past the 5m default, far under 1h); call 2 reuses the SAME block.
 *   - 1h TTL working  → call 2: cache_read ≈ block, cache_creation ≈ 0
 *   - only 5m (broken) → call 2: cache_creation ≈ block, cache_read ≈ 0
 *
 * Run: npx ts-node -r tsconfig-paths/register \
 *   --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *   scripts/verify-ttl-1h.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-6';
const SLEEP_MS = 370_000; // 6m10s: > 5m default, << 1h

// ~1.5–2K tokens of stable filler (must exceed the ~1024-tok minimum
// cacheable block for Sonnet). Content is irrelevant; it just needs to
// be byte-identical across both calls and large enough to cache.
const block = Array.from({ length: 90 }, (_, i) =>
  `Paragraph ${i}: This is stable filler text used solely to occupy a ` +
  `cacheable prompt prefix for a time-to-live experiment. It carries no ` +
  `task meaning and is identical on every call so the prefix hashes the ` +
  `same. The only variable under test is the cache_control ttl field.`
).join('\n');

async function call(label: string) {
  const r = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8,
    system: [{ type: 'text', text: block, cache_control: { type: 'ephemeral', ttl: '1h' } }],
    messages: [{ role: 'user', content: 'Reply with exactly: ok' }],
  });
  const u = r.usage;
  console.log(
    `  [${label}] in=${u.input_tokens} out=${u.output_tokens} ` +
    `cache_creation=${u.cache_creation_input_tokens ?? 0} ` +
    `cache_read=${u.cache_read_input_tokens ?? 0}`,
  );
  return u;
}

async function main() {
  console.log(`\n=== verify ttl:'1h' survives past the 5m default (${MODEL}) ===\n`);
  console.log(`call 1 (cold — writes cache)…`);
  const u1 = await call('call 1');
  const created = u1.cache_creation_input_tokens ?? 0;
  if (created === 0) {
    console.log(`\n⚠ call 1 wrote 0 cache tokens — block under the min cacheable size or already warm. Result inconclusive.`);
    process.exit(2);
  }
  const wakeAt = new Date(Date.now() + SLEEP_MS).toLocaleTimeString();
  console.log(`\nsleeping ${SLEEP_MS / 1000}s (> 5m default, << 1h) — resumes ~${wakeAt}…\n`);
  await new Promise((res) => setTimeout(res, SLEEP_MS));

  console.log(`call 2 (after >5m gap — reuses same block)…`);
  const u2 = await call('call 2');
  const read2 = u2.cache_read_input_tokens ?? 0;
  const created2 = u2.cache_creation_input_tokens ?? 0;

  console.log(`\n--- VERDICT ---`);
  if (read2 >= created * 0.8 && created2 < created * 0.2) {
    console.log(`✅ ttl:'1h' WORKS. After a ${SLEEP_MS / 1000}s gap (>5m), call 2 READ`);
    console.log(`   the cache (${read2} tok) and re-created almost nothing (${created2}).`);
    console.log(`   Under the 5m default this entry would have expired → item 1 confirmed.`);
  } else if (created2 >= created * 0.8 && read2 < created * 0.2) {
    console.log(`❌ ttl:'1h' did NOT take effect. Call 2 RE-CREATED the cache`);
    console.log(`   (${created2} tok) and read ~0 (${read2}) — entry expired like a 5m default.`);
  } else {
    console.log(`⚠ AMBIGUOUS. call1 created=${created}; call2 read=${read2} created=${created2}.`);
    console.log(`   Inspect manually (possible partial expiry / API change).`);
  }
  console.log(`\n=== done ===\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
