/** Round 4 (E3): top an end-of-session assignment up to PRACTICE_TARGET items by
 *  generating the shortfall for its FIRST LO. generatePracticeItems enforces the
 *  PRACTICE_GEN kill switch (anything but 'on' → []) and the daily counters, and
 *  generates ≤2 per call. The shortfall (≤ target, so ≤3) is split into ≤2
 *  PARALLEL calls of ≤2 slots each (e.g. 3 → 2 + 1), so at most 3 counter slots
 *  are reserved per top-up and each slot is one generate + verify (+ one retry).
 *  Fix round 1 (latency): the calls run in parallel under TOP_UP_BUDGET_MS — this
 *  runs inside the session-result emit (the academy sweep times out at 20 s and
 *  the student's End/Pause waits on it). On timeout we keep what is retrieved
 *  plus whatever calls already returned; a late call may still bank rows (the
 *  generator's own side effect) but its items are dropped here and never throw.
 *  Anchors (retrieved items, plus a homework plan's worksheet problems) seed a
 *  SIMILAR problem; the generator prompt forbids reusing numbers/context. */
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { generatePracticeItems, type GeneratePracticeItemsOptions } from '@/lib/tutor/portal/practice-gen';

export const PRACTICE_TARGET = 3;
export const TOP_UP_BUDGET_MS = 12_000;
const MAX_GEN_CALLS = 2;
const PER_CALL = 2; // = practice-gen's MAX_GENERATIONS_PER_REQUEST

export interface ResolvedLo { loId: string; title: string; items: PracticeItem[] }
export interface TopUpInput { studentId: string; topic: string; target?: number; anchorsFor(loId: string): PracticeItem[] }

/** Split a shortfall into ≤MAX_GEN_CALLS parallel requests of ≤PER_CALL. Pure. */
export function splitShortfall(need: number): number[] {
  const out: number[] = [];
  let left = Math.max(0, need);
  while (left > 0 && out.length < MAX_GEN_CALLS) {
    const n = Math.min(PER_CALL, left);
    out.push(n);
    left -= n;
  }
  return out;
}

export async function topUpPractice(
  resolved: ResolvedLo[],
  want: Array<{ loId: string; title: string }>,
  input: TopUpInput,
  gen: (o: GeneratePracticeItemsOptions) => Promise<PracticeItem[]> = (o) => generatePracticeItems(o),
  budgetMs: number = TOP_UP_BUDGET_MS,
): Promise<ResolvedLo[]> {
  const target = input.target ?? PRACTICE_TARGET;
  const out = resolved.map((l) => ({ ...l, items: [...l.items] }));
  const total = out.reduce((n, l) => n + l.items.length, 0);
  const first = want[0];
  if (!first || total >= target) return out;
  let slot = out.find((l) => l.loId === first.loId);
  if (!slot) {
    slot = { loId: first.loId, title: first.title, items: [] };
    out.unshift(slot);
  }
  const need = target - total;
  const anchorItems = [...input.anchorsFor(first.loId), ...slot.items];
  // Each call's result lands here as it arrives; on timeout we take a snapshot.
  const arrived: PracticeItem[][] = [];
  const calls = splitShortfall(need).map((shortfall) =>
    gen({ studentId: input.studentId, loId: first.loId, topic: input.topic, topicId: input.topic, shortfall, anchorItems })
      .catch(() => [] as PracticeItem[])
      .then((got) => { arrived.push(got); }),
  );
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timedOut = await Promise.race([
    Promise.all(calls).then(() => false),
    new Promise<boolean>((resolve) => { timer = setTimeout(() => resolve(true), budgetMs); }),
  ]);
  if (timer) clearTimeout(timer);
  const seen = new Set(out.flatMap((l) => l.items.map((i) => i.id)));
  const fresh: PracticeItem[] = [];
  for (const got of [...arrived]) {
    for (const it of got) {
      if (fresh.length >= need || seen.has(it.id)) continue;
      seen.add(it.id);
      fresh.push(it);
    }
  }
  slot.items.push(...fresh);
  const result = out.filter((l) => l.items.length > 0);
  if (timedOut) {
    console.warn(`[practice-emit] top-up timed out; assigned ${result.reduce((n, l) => n + l.items.length, 0)} items`);
  }
  return result;
}
