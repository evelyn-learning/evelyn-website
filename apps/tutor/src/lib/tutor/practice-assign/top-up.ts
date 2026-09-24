/** Round 4 (E3): top an end-of-session assignment up to PRACTICE_TARGET items by
 *  generating the shortfall for its FIRST LO. generatePracticeItems enforces the
 *  PRACTICE_GEN kill switch (anything but 'on' → []) and the daily counters, and
 *  generates ≤2 per call — so at most 2 calls, ≤3 generations per session.
 *  Anchors (retrieved items, plus a homework plan's worksheet problems) seed a
 *  SIMILAR problem; the generator prompt forbids reusing numbers/context. */
import type { PracticeItem } from '@evelyn/portal-contract/v1';
import { generatePracticeItems, type GeneratePracticeItemsOptions } from '@/lib/tutor/portal/practice-gen';

export const PRACTICE_TARGET = 3;
const MAX_GEN_CALLS = 2;

export interface ResolvedLo { loId: string; title: string; items: PracticeItem[] }
export interface TopUpInput { studentId: string; topic: string; target?: number; anchorsFor(loId: string): PracticeItem[] }

export async function topUpPractice(
  resolved: ResolvedLo[],
  want: Array<{ loId: string; title: string }>,
  input: TopUpInput,
  gen: (o: GeneratePracticeItemsOptions) => Promise<PracticeItem[]> = (o) => generatePracticeItems(o),
): Promise<ResolvedLo[]> {
  const target = input.target ?? PRACTICE_TARGET;
  const out = resolved.map((l) => ({ ...l, items: [...l.items] }));
  let total = out.reduce((n, l) => n + l.items.length, 0);
  const first = want[0];
  if (!first || total >= target) return out;
  let slot = out.find((l) => l.loId === first.loId);
  if (!slot) {
    slot = { loId: first.loId, title: first.title, items: [] };
    out.unshift(slot);
  }
  for (let call = 0; call < MAX_GEN_CALLS && total < target; call++) {
    const need = target - total;
    let got: PracticeItem[] = [];
    try {
      got = await gen({ studentId: input.studentId, loId: first.loId, topic: input.topic, topicId: input.topic, shortfall: need, anchorItems: [...input.anchorsFor(first.loId), ...slot.items] });
    } catch {
      got = [];
    }
    const seen = new Set(out.flatMap((l) => l.items.map((i) => i.id)));
    const fresh = got.filter((i) => !seen.has(i.id)).slice(0, need);
    if (fresh.length === 0) break;
    slot.items.push(...fresh);
    total += fresh.length;
  }
  return out.filter((l) => l.items.length > 0);
}
