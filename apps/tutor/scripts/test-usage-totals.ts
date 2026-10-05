/** Session token totals + cost from the stored usage entries (2026-10-04).
 *  Usage: npx tsx scripts/test-usage-totals.ts */
import { MODEL_RATES, lookupModelRate } from '../src/lib/tutor/ai/model-rates';
import {
  computeUsageTotals, dedupeUsageEntries, usageEntryKey, usageTotalsBehind, clientTotalsMax, countedUsageEntries, usageSaveWindow,
  FALLBACK_PRICING, REALTIME_PRICING, REALTIME_2_PRICING, type UsageEntry,
} from '../src/lib/tutor/ai/usage-totals';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''}`); }
}

// ── The page's arithmetic as it stood before this change (app/tutor/page.tsx
//    saveSessionUsage, lines 664-699 + the constants at 152-179), FROZEN here
//    verbatim. The shared function must reproduce it exactly — bit for bit —
//    for one sitting. Do not "fix" this copy; it is the reference.
interface OldTokenUsage {
  inputTokens: number; outputTokens: number; operation: string; timestamp: Date;
  inputAudioTokens?: number; outputAudioTokens?: number; inputTextTokens?: number; outputTextTokens?: number;
  inputCachedTokens?: number; cacheReadTokens?: number; cacheCreationTokens?: number; model?: string;
}
const OLD_BRAIN_RATE = MODEL_RATES['claude-sonnet-5'];
const OLD_PRICING = {
  input: OLD_BRAIN_RATE.input,
  output: OLD_BRAIN_RATE.output,
  cacheRead: OLD_BRAIN_RATE.cacheRead ?? OLD_BRAIN_RATE.input * 0.1,
  cacheWrite: OLD_BRAIN_RATE.cacheWrite1h ?? OLD_BRAIN_RATE.input * 2,
};
const OLD_REALTIME_PRICING = { audioInput: 100.0, audioOutput: 200.0, textInput: 5.0, textOutput: 20.0 };
const OLD_REALTIME_2_PRICING = { audioInput: 32.0, audioInputCached: 0.40, audioOutput: 64.0, textInput: 4.0, textOutput: 24.0 };
function oldClientTotals(tokenUsage: OldTokenUsage[], voiceEngine: string) {
  const totalIn = tokenUsage.reduce((s, u) => s + u.inputTokens + (u.cacheReadTokens ?? 0) + (u.cacheCreationTokens ?? 0), 0);
  const totalOut = tokenUsage.reduce((s, u) => s + u.outputTokens, 0);
  let cost = 0;
  for (const u of tokenUsage) {
    if (u.operation === 'realtime-response') {
      const rt = voiceEngine === 'realtime-2' ? OLD_REALTIME_2_PRICING : OLD_REALTIME_PRICING;
      const audioIn = u.inputAudioTokens || 0;
      const audioOut = u.outputAudioTokens || 0;
      const textIn = u.inputTextTokens || 0;
      const textOut = u.outputTextTokens || 0;
      cost += (audioIn / 1_000_000) * rt.audioInput
            + (audioOut / 1_000_000) * rt.audioOutput
            + (textIn / 1_000_000) * rt.textInput
            + (textOut / 1_000_000) * rt.textOutput;
    } else {
      const r = lookupModelRate(u.model);
      cost += (u.inputTokens / 1_000_000) * (r?.input ?? OLD_PRICING.input)
            + (u.outputTokens / 1_000_000) * (r?.output ?? OLD_PRICING.output)
            + ((u.cacheReadTokens ?? 0) / 1_000_000) * (r ? (r.cacheRead ?? r.input * 0.1) : OLD_PRICING.cacheRead)
            + ((u.cacheCreationTokens ?? 0) / 1_000_000) * (r ? (r.cacheWrite1h ?? 0) : OLD_PRICING.cacheWrite);
    }
  }
  return { totalInputTokens: totalIn, totalOutputTokens: totalOut, estimatedCost: Math.round(cost * 10000) / 10000 };
}

const T0 = Date.parse('2026-10-04T15:00:00.000Z');
const at = (sec: number) => new Date(T0 + sec * 1000);
const brain = (sec: number, i: number, o: number, cr: number, cw: number, model?: string): OldTokenUsage =>
  ({ operation: 'brain-turn', timestamp: at(sec), inputTokens: i, outputTokens: o, ...(cr ? { cacheReadTokens: cr } : {}), ...(cw ? { cacheCreationTokens: cw } : {}), ...(model ? { model } : {}) });

// Sitting 1 — the shape of the live report: 1,127 output tokens, one
// 126,600-token cache write, ~380K cache reads.
const sitting1: OldTokenUsage[] = [
  brain(5, 312, 214, 0, 126_600, 'claude-sonnet-5'),
  brain(40, 96, 301, 126_600, 0, 'claude-sonnet-5'),
  brain(90, 143, 288, 126_600, 0, 'claude-sonnet-5'),
  brain(150, 77, 324, 126_829, 0, 'claude-sonnet-5'),
];
// Sitting 2 — after the reload: mixed operations and models.
const sitting2: OldTokenUsage[] = [
  brain(600, 204, 190, 0, 9_800, 'claude-sonnet-5-20260801'),          // prefix-matched model
  brain(640, 88, 412, 136_400, 0, 'claude-sonnet-5'),
  brain(700, 1500, 600, 30_000, 0, 'deepseek-chat'),                    // no cache-write rate → 0
  { operation: 'greeting', timestamp: at(601), inputTokens: 900, outputTokens: 120 },            // no model → fallback
  { operation: 'chat', timestamp: at(720), inputTokens: 450, outputTokens: 95, model: 'some-unknown-model' }, // unknown → fallback
  { operation: 'realtime-response', timestamp: at(730), inputTokens: 0, outputTokens: 0, inputAudioTokens: 1800, outputAudioTokens: 2400, inputTextTokens: 300, outputTextTokens: 150, inputCachedTokens: 900 },
];
const asStored = (list: OldTokenUsage[]): UsageEntry[] => JSON.parse(JSON.stringify(list)) as UsageEntry[]; // ISO timestamps, as posted
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

console.log('\nsingle sitting = the page\'s own totals:');
for (const [name, list] of [['sitting 1', sitting1], ['sitting 2', sitting2], ['both lists as one sitting', [...sitting1, ...sitting2]]] as const) {
  for (const engine of ['claude-brain', 'realtime', 'realtime-2']) {
    const old = oldClientTotals([...list], engine);
    check(`${name}, ${engine}: page list (Date timestamps, dedupe off) is bit-identical to the old loop`, same(computeUsageTotals(list, engine, { dedupe: false }), old), { got: computeUsageTotals(list, engine, { dedupe: false }), old });
    check(`${name}, ${engine}: the STORED form of the same entries (server, dedupe on) gives the same figures`, same(computeUsageTotals(asStored([...list]), engine), old), { got: computeUsageTotals(asStored([...list]), engine), old });
  }
}
{
  const s1 = computeUsageTotals(sitting1, 'claude-brain');
  check('sitting 1 fixture is the reported shape (1,127 out · 126,600 written · ~380K read)', s1.totalOutputTokens === 1127 && sitting1.reduce((s, u) => s + (u.cacheCreationTokens ?? 0), 0) === 126_600 && sitting1.reduce((s, u) => s + (u.cacheReadTokens ?? 0), 0) === 380_029, s1);
  // Hand-priced, Sonnet 5: in 628 @2, out 1127 @10, read 380,029 @0.2, write 126,600 @4.
  const hand = (628 * 2 + 1127 * 10 + 380_029 * 0.2 + 126_600 * 4) / 1_000_000;
  check('sitting 1 cost matches a hand calculation from the rate card', s1.estimatedCost === Math.round(hand * 10000) / 10000 && s1.estimatedCost === 0.5949, { got: s1.estimatedCost, hand });
}

console.log('\ntwo sittings = the sum:');
{
  const a = oldClientTotals(sitting1, 'claude-brain');
  const b = oldClientTotals(sitting2, 'claude-brain');
  const all = computeUsageTotals(asStored([...sitting1, ...sitting2]), 'claude-brain');
  check('tokens: stored entries of both sittings = sitting 1 + sitting 2', all.totalInputTokens === a.totalInputTokens + b.totalInputTokens && all.totalOutputTokens === a.totalOutputTokens + b.totalOutputTokens, { all, a, b });
  check('cost: = sitting 1 + sitting 2 (to the stored 4 decimals)', Math.abs(all.estimatedCost - (a.estimatedCost + b.estimatedCost)) <= 0.0001 + 1e-9, { all: all.estimatedCost, sum: a.estimatedCost + b.estimatedCost });
  check('…and is NOT the last sitting alone (the defect)', all.estimatedCost > b.estimatedCost && all.totalOutputTokens > b.totalOutputTokens);
  const doc = { tokenUsage: asStored([...sitting1, ...sitting2]), voiceEngine: 'claude-brain', ...b }; // what the old route left stored
  check('usageTotalsBehind: a document holding the last sitting\'s totals is raised to the sum, all three fields', same(usageTotalsBehind(doc), all), usageTotalsBehind(doc));
  check('usageTotalsBehind: a document already at the sum → null (no second write)', usageTotalsBehind({ ...doc, ...all }) === null);
  check('usageTotalsBehind: single sitting, page totals stored → null (unchanged session)', usageTotalsBehind({ tokenUsage: asStored(sitting1), voiceEngine: 'claude-brain', ...a }) === null);
  check('usageTotalsBehind: only the field that is behind is raised', same(usageTotalsBehind({ ...doc, ...all, estimatedCost: b.estimatedCost }), { estimatedCost: all.estimatedCost }));
  check('usageTotalsBehind: stored totals ABOVE the entries (an append lost to a failed save) are never lowered', usageTotalsBehind({ tokenUsage: asStored(sitting1), totalInputTokens: 9e9, totalOutputTokens: 9e9, estimatedCost: 99 }) === null);
  check('usageTotalsBehind: no entries (embed sessions send totals only) → null, the stored totals stand', usageTotalsBehind({ tokenUsage: [], totalInputTokens: 5, totalOutputTokens: 5, estimatedCost: 0.01 }) === null && usageTotalsBehind({}) === null && usageTotalsBehind(null) === null);
  check('usageTotalsBehind: missing stored totals count as behind', same(usageTotalsBehind({ tokenUsage: asStored(sitting1), voiceEngine: 'claude-brain' }), a));
  check('usageTotalsBehind: prices realtime entries by the DOCUMENT\'s voiceEngine', usageTotalsBehind({ tokenUsage: asStored(sitting2), voiceEngine: 'realtime-2' })!.estimatedCost === oldClientTotals(sitting2, 'realtime-2').estimatedCost && oldClientTotals(sitting2, 'realtime-2').estimatedCost !== oldClientTotals(sitting2, 'realtime').estimatedCost);
}

console.log('\nduplicates:');
{
  const once = computeUsageTotals(asStored(sitting2), 'claude-brain');
  const resent = asStored([...sitting2, sitting2[1]!, sitting2[5]!, sitting2[1]!]); // the same calls stored again
  check('an entry stored twice (same operation, millisecond, counts, model) is counted once', same(computeUsageTotals(resent, 'claude-brain'), once), computeUsageTotals(resent, 'claude-brain'));
  check('dedupe keeps order and the first copy', dedupeUsageEntries(resent).length === sitting2.length && same(dedupeUsageEntries(resent), asStored(sitting2)));
  check('a Date and its ISO string are the same instant', usageEntryKey({ ...sitting2[0]! }) === usageEntryKey(asStored([sitting2[0]!])[0]!));
  const twoCalls = asStored([brain(10, 100, 50, 0, 0, 'claude-sonnet-5'), { ...brain(10, 100, 50, 0, 0, 'claude-sonnet-5'), timestamp: at(10.001) }]);
  check('two calls with equal counts one millisecond apart are two calls', computeUsageTotals(twoCalls).totalOutputTokens === 100);
  const differ = asStored([brain(10, 100, 50, 0, 0, 'claude-sonnet-5'), brain(10, 100, 51, 0, 0, 'claude-sonnet-5'), brain(10, 100, 50, 0, 0, 'deepseek-chat'), { ...brain(10, 100, 50, 0, 0, 'claude-sonnet-5'), operation: 'chat' }]);
  check('same millisecond but a different count, model or operation → all counted', computeUsageTotals(differ).totalOutputTokens === 201);
  const noTs = [{ operation: 'chat', inputTokens: 10, outputTokens: 5 }, { operation: 'chat', inputTokens: 10, outputTokens: 5 }, { operation: 'chat', inputTokens: 10, outputTokens: 5, timestamp: 'not a date' }];
  check('entries without a usable timestamp are never merged', usageEntryKey(noTs[0]!) === null && computeUsageTotals(noTs).totalOutputTokens === 15);
  check('dedupe off (the page\'s own list) sums everything it is given', computeUsageTotals(resent, 'claude-brain', { dedupe: false }).totalOutputTokens === once.totalOutputTokens + 412 * 2);
}

// ── Review 5d: de-duplication is incoming-vs-stored, never within a batch ──
console.log('\nduplicates, by save (incoming vs stored):');
{
  // What the route holds after its write: the stored array (earlier saves +
  // this request's entries appended at the tail) and the request's own batch.
  // `stored` mimics the schema: an entry sent without a timestamp is stamped
  // with the write's millisecond.
  const WRITE_MS = T0 + 5_000_000;
  const stamp = (batch: unknown[]): UsageEntry[] => (JSON.parse(JSON.stringify(batch)) as UsageEntry[]).map((e) => (e.timestamp === undefined ? { ...e, timestamp: new Date(WRITE_MS).toISOString() } : e));
  const after = (earlier: unknown[][], incoming: unknown[]) => ({ stored: [...earlier.flatMap(stamp), ...stamp(incoming)], incoming: JSON.parse(JSON.stringify(incoming)) as unknown[] });
  const out = (earlier: unknown[][], incoming: unknown[]) => { const a = after(earlier, incoming); return computeUsageTotals(countedUsageEntries(a), 'claude-brain', { dedupe: false }).totalOutputTokens; };
  const call = brain(10, 100, 50, 0, 0, 'claude-sonnet-5');

  check('two REAL calls in the same millisecond with identical counts, sent in ONE save → two calls (was one)', out([], [call, call]) === 100);
  check('…the whole-array rule (no batch knowledge) still reads them as one — the defect this replaces', computeUsageTotals(asStored([call, call])).totalOutputTokens === 50);
  const bare = { operation: 'chat', inputTokens: 1000, outputTokens: 100 };
  check('three identical entries WITHOUT a timestamp in one save → three calls (was one: the schema stamps them with one millisecond)', out([], [bare, bare, bare]) === 300);
  check('…the whole-array rule read those three stored entries as one', computeUsageTotals(stamp([bare, bare, bare])).totalOutputTokens === 100);
  check('an entry with NO client timestamp is never a duplicate — not even of an identical stored entry of an earlier save in the same millisecond', out([[{ ...bare, timestamp: new Date(WRITE_MS) }]], [bare]) === 200);
  check('an entry re-sent in a LATER save (client timestamp, identical in every field) → counted once', out([[call]], [call]) === 50);
  check('a later save re-sending two earlier entries plus one new one → only the new one adds', out([sitting1], [sitting1[2]!, sitting1[3]!, call]) === 1127 + 50);
  check('a re-sent real pair is never four calls', out([[call, call]], [call, call]) < 200);
  // KNOWN LIMIT (documented on countedUsageEntries): save boundaries of EARLIER saves are not stored, so a
  // same-key pair from an earlier save reads as one call in later saves; the route's raise-only $max keeps
  // the two-call figure stored when the pair arrived.
  check('known limit: a same-key pair from an EARLIER save reads as one call later (raise-only totals keep the earlier figure)', out([[call, call]], []) === 50 && out([[call, call]], [call, call]) === 50);
  check('stored once, then a save carrying it twice → the second copy is a new call', out([[call]], [call, call]) === 100);
  check('same millisecond but a different count / model / operation in a later save → new calls', out([[call]], [{ ...call, outputTokens: 51 }, { ...call, model: 'deepseek-chat' }, { ...call, operation: 'chat' }]) === 50 + 51 + 50 + 50);
  check('no incoming entries → the stored array as before', out([sitting1, [sitting1[0]!]], []) === 1127);
  check('incoming longer than stored / junk → never throws, never negative',
    countedUsageEntries({ stored: asStored([call]), incoming: [call, call, call] }).length === 1
    && countedUsageEntries({ stored: undefined, incoming: undefined }).length === 0
    && countedUsageEntries({ stored: [null, 7, ...asStored([call])], incoming: 'x' }).length === 1);

  // usageTotalsBehind with the batch: raises to the batch-aware sum.
  const a = after([sitting1], [call, call]);
  const behind = usageTotalsBehind({ tokenUsage: a.stored, voiceEngine: 'claude-brain', totalInputTokens: 0, totalOutputTokens: 0, estimatedCost: 0 }, { incoming: a.incoming });
  check('usageTotalsBehind({…}, { incoming }) counts both same-millisecond calls of this save', behind?.totalOutputTokens === 1127 + 100, behind);
  const b = after([sitting1], [sitting1[1]!]);
  check('usageTotalsBehind({…}, { incoming }): a pure re-send raises nothing', usageTotalsBehind({ tokenUsage: b.stored, voiceEngine: 'claude-brain', ...computeUsageTotals(asStored(sitting1), 'claude-brain') }, { incoming: b.incoming }) === null);
  check('usageTotalsBehind without `incoming` is unchanged (whole-array rule)', same(usageTotalsBehind({ tokenUsage: asStored([...sitting1, sitting1[1]!]), voiceEngine: 'claude-brain' }), computeUsageTotals(asStored(sitting1), 'claude-brain')));
}

// ── Review 5c: the page's "sent up to here" marker ────────────────────────
console.log('\nsave marker:');
{
  check('first save: everything, marker at the end', same(usageSaveWindow(0, 3), { from: 0, marker: 3 }));
  check('nothing new: empty window, marker stays', same(usageSaveWindow(3, 3), { from: 3, marker: 3 }));
  check('list grew: only the new entries', same(usageSaveWindow(3, 5), { from: 3, marker: 5 }));
  // setTokenUsage([{greeting}]) replaced a 7-entry list after a save put the marker at 7.
  check('list SHRANK below the marker (it was replaced): start over from 0 for this list', same(usageSaveWindow(7, 1), { from: 0, marker: 1 }));
  check('…so entries added to the new list afterwards are sent (they sat below the old marker and never were)', same(usageSaveWindow(usageSaveWindow(7, 1).marker, 4), { from: 1, marker: 4 }));
  check('junk → a safe window', same(usageSaveWindow(NaN, 2), { from: 0, marker: 2 }) && same(usageSaveWindow(-1, 2), { from: 0, marker: 2 }) && same(usageSaveWindow(2, NaN), { from: 0, marker: 0 }));
}

console.log('\nrates:');
{
  const e = { operation: 'brain-turn', timestamp: at(1), inputTokens: 1_000_000, outputTokens: 1_000_000, cacheReadTokens: 1_000_000, cacheCreationTokens: 1_000_000 };
  const fb = FALLBACK_PRICING.input + FALLBACK_PRICING.output + FALLBACK_PRICING.cacheRead + FALLBACK_PRICING.cacheWrite;
  check('missing model → the existing fallback rate (Sonnet 5: 2 / 10 / 0.2 / 4 per 1M)', computeUsageTotals([e]).estimatedCost === fb && fb === 16.2 && same(FALLBACK_PRICING, { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 4 }), computeUsageTotals([e]).estimatedCost);
  check('unknown model → the same fallback', computeUsageTotals([{ ...e, model: 'no-such-model' }]).estimatedCost === fb);
  check('non-string model → the same fallback', computeUsageTotals([{ ...e, model: 42 }]).estimatedCost === fb);
  check('known model → its own rates, 1h cache write (Sonnet 4.6: 3 + 15 + 0.3 + 6)', computeUsageTotals([{ ...e, model: 'claude-sonnet-4-6' }]).estimatedCost === 24.3);
  check('known model without cache rates → read at 0.1× input, write 0 (gpt-4o-mini: 0.15 + 0.6 + 0.015 + 0)', computeUsageTotals([{ ...e, model: 'gpt-4o-mini' }]).estimatedCost === 0.765);
  check('date-suffixed model id → longest-prefix rate', computeUsageTotals([{ ...e, model: 'claude-haiku-4-5-20251001' }]).estimatedCost === computeUsageTotals([{ ...e, model: 'claude-haiku-4-5' }]).estimatedCost);
  const rt = { operation: 'realtime-response', timestamp: at(2), inputTokens: 5, outputTokens: 7, inputAudioTokens: 1_000_000, outputAudioTokens: 1_000_000, inputTextTokens: 1_000_000, outputTextTokens: 1_000_000 };
  check('realtime entry: audio/text rate card; realtime-2 has its own', computeUsageTotals([rt], 'realtime').estimatedCost === 325 && computeUsageTotals([rt], 'realtime-2').estimatedCost === 124 && computeUsageTotals([rt]).estimatedCost === 325
    && REALTIME_PRICING.audioInput === 100 && REALTIME_2_PRICING.audioOutput === 64);
  check('realtime entry still counts its input/output tokens in the totals', computeUsageTotals([rt]).totalInputTokens === 5 && computeUsageTotals([rt]).totalOutputTokens === 7);
  check('totalInputTokens = input + cache read + cache write', computeUsageTotals([e]).totalInputTokens === 3_000_000);
  check('junk in → zeros, never NaN', same(computeUsageTotals(undefined), { totalInputTokens: 0, totalOutputTokens: 0, estimatedCost: 0 }) && same(computeUsageTotals([null, 7, 'x', { operation: 'chat', inputTokens: 'NaN', outputTokens: NaN }]), { totalInputTokens: 0, totalOutputTokens: 0, estimatedCost: 0 }));
}

console.log('\nwhat the route takes from the client:');
{
  check('finite non-negative numbers are $max operands', same(clientTotalsMax({ totalInputTokens: 10, totalOutputTokens: 0, estimatedCost: 0.5 }), { totalInputTokens: 10, totalOutputTokens: 0, estimatedCost: 0.5 }));
  check('strings, negatives, NaN, null and absent fields are ignored', same(clientTotalsMax({ totalInputTokens: '10', totalOutputTokens: -1, estimatedCost: NaN }), {}) && same(clientTotalsMax({ estimatedCost: null }), {}) && same(clientTotalsMax(null), {}));
}

// Wiring (source checks — the route itself needs MongoDB: scripts/dbcheck-session-usage.ts).
{
  const fs = require('node:fs') as typeof import('node:fs'); const path = require('node:path') as typeof import('node:path');
  const route = fs.readFileSync(path.join(__dirname, '..', 'src/app/api/tutor/session-usage/route.ts'), 'utf8');
  check('route: the client totals are never $set verbatim any more', !/updateFields\.(totalInputTokens|totalOutputTokens|estimatedCost)\s*=/.test(route));
  check('route: totals are reconciled from the written document (usageTotalsBehind → $max)', /usageTotalsBehind\(/.test(route) && /clientTotalsMax\(body\)/.test(route));
  const page = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/page.tsx'), 'utf8');
  check('route: the reconcile is told which entries THIS request appended (incoming vs stored)', /usageTotalsBehind\(\{[\s\S]{0,1500}?\bincoming: Array\.isArray\(body\.tokenUsage\)/.test(route));
  check('page: the save marker goes through usageSaveWindow (no Math.max pin)', /usageSaveWindow\(lastSavedTokenCountRef\.current, tokenUsage\.length\)/.test(fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/page.tsx'), 'utf8')) && !/lastSavedTokenCountRef\.current = Math\.max\(/.test(fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/page.tsx'), 'utf8')));
  check('page: prices through the shared function (no private copy of the loop)', /computeUsageTotals\(tokenUsage, voiceEngine, \{ dedupe: false \}\)/.test(page) && !/const REALTIME_PRICING\s*=/.test(page) && !/const PRICING\s*=/.test(page));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
