/**
 * Fold the re-check's follow-up patches into the writers' patches — PURE
 * (no file, network or database access).
 *
 * The result holds ONE final change per field and one patch per segment:
 *   - a follow-up change with base "after-existing-patch" whose field the
 *     writer's patch already changes must continue it (follow-up.old ===
 *     writer.new); the final change keeps the writer's `old` (the stored
 *     value) and takes the follow-up's `new`;
 *   - the same base on a field the writer's patch does not touch, or with no
 *     writer's patch at all, is simply added (its `old` is then the stored
 *     value; validation checks that);
 *   - base "original" is added, and may not collide with a writer's change;
 *   - a follow-up named in `replaceExisting` REPLACES the writer's patch for
 *     that segment outright.
 * A broken chain or a collision leaves BOTH out (the writer's whole patch
 * for that segment and the follow-up) and is reported — never guessed.
 */
import type { Change, Patch, PatchFile } from './core';

export interface FollowUpChange extends Change {
  base?: string;
}

export interface FollowUpPatch extends Omit<Patch, 'changes'> {
  item?: string;
  subject?: string;
  optional?: boolean;
  changes: FollowUpChange[];
}

export interface MergeNote {
  item: string;
  pack: string;
  planId: string;
  segmentId: string;
  path?: string;
  action: 'chained' | 'added-field' | 'new-patch' | 'replaced-existing' | 'net-no-op' | 'chain-broken' | 'conflict' | 'no-target-file' | 'bad-base';
  detail: string;
}

export interface MergeOptions {
  /** Follow-ups that replace the writer's patch for their segment. */
  replaceExisting?: ReadonlyArray<{ planId: string; segmentId: string; reason: string }>;
}

export interface MergeResult {
  files: PatchFile[];
  notes: MergeNote[];
  problems: MergeNote[];
}

type AnyPatch = Patch & Record<string, unknown>;

function joinText(a: unknown, b: unknown, label: string): string | undefined {
  const x = typeof a === 'string' ? a.trim() : '';
  const y = typeof b === 'string' ? b.trim() : '';
  if (x && y) return `${x} | ${label}: ${y}`;
  return x || (y ? `${label}: ${y}` : undefined);
}

function asList(v: unknown): unknown[] {
  return Array.isArray(v) ? v : v === undefined ? [] : [v];
}

export function mergeFollowUps(
  writerFiles: readonly PatchFile[],
  followUps: readonly FollowUpPatch[],
  opts: MergeOptions = {},
): MergeResult {
  const files = JSON.parse(JSON.stringify(writerFiles)) as PatchFile[];
  const notes: MergeNote[] = [];
  const problems: MergeNote[] = [];

  const locate = (planId: string, segmentId: string): { file: PatchFile; at: number } | null => {
    for (const file of files) {
      const at = file.patches.findIndex((p) => p.planId === planId && p.segmentId === segmentId);
      if (at >= 0) return { file, at };
    }
    return null;
  };

  for (const f of followUps) {
    const item = f.item ?? '?';
    const id = { item, pack: f.pack, planId: f.planId, segmentId: f.segmentId };
    const stripped = (): Change[] => f.changes.map((c) => ({ path: c.path, old: c.old, new: c.new }));
    const target = (): PatchFile | undefined =>
      files.find((x) => x.patches.some((p) => p.pack === f.pack && p.planId === f.planId))
      ?? files.find((x) => typeof f.subject === 'string' && x.subject === f.subject);
    const addNew = (action: MergeNote['action'], detail: string): void => {
      const file = target();
      if (!file) {
        problems.push({ ...id, action: 'no-target-file', detail: `no patch file for subject ${JSON.stringify(f.subject)} / lesson ${f.pack} — follow-up left out` });
        return;
      }
      const patch: AnyPatch = {
        pack: f.pack, planId: f.planId, segmentId: f.segmentId, findings: f.findings, changes: stripped(),
        ...(typeof f.check === 'string' ? { check: f.check } : {}),
        ...(typeof f.confidence === 'string' ? { confidence: f.confidence } : {}),
        fromFollowUp: item,
        ...(f.optional ? { followUpMarkedOptional: true } : {}),
      };
      file.patches.push(patch);
      notes.push({ ...id, action, detail });
    };

    const badBase = f.changes.find((c) => c.base !== 'original' && c.base !== 'after-existing-patch');
    if (badBase) {
      problems.push({ ...id, path: badBase.path, action: 'bad-base', detail: `base is ${JSON.stringify(badBase.base)} — follow-up left out` });
      continue;
    }

    const found = locate(f.planId, f.segmentId);
    const replace = opts.replaceExisting?.find((r) => r.planId === f.planId && r.segmentId === f.segmentId);
    if (replace) {
      if (found) found.file.patches.splice(found.at, 1);
      addNew('replaced-existing', `${found ? "the writer's patch for this segment was removed" : 'no writer patch to remove'}; the follow-up stands alone. ${replace.reason}`);
      continue;
    }
    if (!found) {
      addNew('new-patch', 'no writer patch for this segment — follow-up added as its own patch');
      continue;
    }

    const existing = found.file.patches[found.at] as AnyPatch;
    const merged = JSON.parse(JSON.stringify(existing.changes)) as Change[];
    const local: MergeNote[] = [];
    let broken: MergeNote | null = null;
    for (const c of f.changes) {
      const prior = c.path.endsWith('[+]') ? undefined : merged.find((m) => m.path === c.path);
      if (c.base === 'after-existing-patch') {
        if (!prior) {
          merged.push({ path: c.path, old: c.old, new: c.new });
          local.push({ ...id, path: c.path, action: 'added-field', detail: "field not touched by the writer's patch — added" });
        } else if (c.old !== prior.new) {
          broken = { ...id, path: c.path, action: 'chain-broken', detail: `follow-up "old" ${JSON.stringify(c.old)} is not the writer's "new" ${JSON.stringify(prior.new)} — both left out` };
          break;
        } else if (c.new === prior.old) {
          merged.splice(merged.indexOf(prior), 1);
          local.push({ ...id, path: c.path, action: 'net-no-op', detail: 'the follow-up returns the field to its stored value — change dropped' });
        } else {
          prior.new = c.new;
          local.push({ ...id, path: c.path, action: 'chained', detail: "final change keeps the stored \"old\" and takes the follow-up's \"new\"" });
        }
      } else if (prior) {
        broken = { ...id, path: c.path, action: 'conflict', detail: "follow-up is based on the original but the writer's patch changes the same field — both left out" };
        break;
      } else {
        merged.push({ path: c.path, old: c.old, new: c.new });
        local.push({ ...id, path: c.path, action: 'added-field', detail: 'based on the original; field not touched by the writer — added' });
      }
    }
    if (broken) {
      found.file.patches.splice(found.at, 1);
      problems.push(broken);
      continue;
    }
    notes.push(...local);
    if (merged.length === 0) {
      found.file.patches.splice(found.at, 1);
      continue;
    }
    existing.changes = merged;
    existing.findings = [...asList(existing.findings), ...asList(f.findings)];
    const check = joinText(existing.check, f.check, 'Re-check');
    if (check) existing.check = check;
    existing.mergedFollowUp = [...asList(existing.mergedFollowUp), item];
    if (f.optional) existing.followUpMarkedOptional = true;
  }
  return { files, notes, problems };
}
