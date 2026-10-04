/**
 * Creation-time answer-key verification for GENERATED lesson plans and review
 * plans — SERVER ONLY.
 *
 * A generated try-yourself (`problem` + `expectedAnswer`) is written by a small
 * model in one call and, until 2026-10-04, was stored and used with no
 * independent check. This module runs the shared blind-solve verifier
 * (portal/key-verify.ts) over every try-yourself that has an `expectedAnswer`
 * and records the outcome ON THE SEGMENT as `keyCheck: { status, checkedAt,
 * model, reason? }`.
 *
 * What the status means downstream is NOT decided here — it is the
 * generalised "key withdrawn" rule in portal/withdrawn-items.ts
 * (`keyCheckUntrusted` / `effectiveSegment`): a segment whose `keyCheck` is
 * present and not `verified` keeps its question but has no trusted key
 * anywhere (session prompt blocks, guards, generator fallback and anchors
 * drop it; practice retrieval does not serve it). Segments with no `keyCheck`
 * (every plan stored earlier) are untouched.
 *
 * TIMING — two budgets:
 *   inlineBudgetMs  how long the CALLER waits. Checks that finish inside it
 *                   are recorded before the plan is stored.
 *   totalBudgetMs   the overall ceiling. Checks still running when the inline
 *                   budget ends are recorded as `unverifiable` (reason
 *                   `pending`) — so the plan can be stored and returned with
 *                   NO trusted key for them — and keep running; `finish()`
 *                   writes each late result onto the stored plan with a
 *                   targeted update. Anything not done at the total budget
 *                   stays `unverifiable` (`budget_exceeded`).
 * An unverified key therefore never grades a student: it is untrusted from
 * the moment the plan exists until (and unless) its own check says `verified`.
 *
 * Session-start (just-in-time) callers pass `inlineBudgetMs: 0` — the check
 * adds no latency to the request (the portal aborts plan-generate at 10 s on
 * some paths); review plans wait up to KEY_VERIFY_REVIEW_INLINE_BUDGET_MS.
 *
 * Flag: TUTOR_KEY_VERIFY_AT_CREATION (default ON; 'off' ⇒ this is a no-op and
 * the plan is returned as the SAME object).
 */
import type { KeyCheck, KeyCheckStatus, LessonPlan, Segment, SegmentTryYourself } from './types';
import {
  keyVerifyEnabled,
  keyVerifyModel,
  verifyAnswerKey,
  type VerifyAnswerKeyInput,
  type VerifyAnswerKeyResult,
} from '../portal/key-verify';

/** Inline wait for a review plan (the portal allows 50 s for that call). */
export const KEY_VERIFY_REVIEW_INLINE_BUDGET_MS = 8_000;
/** Inline wait on session-start plan generation: none — verify in the background. */
export const KEY_VERIFY_JIT_INLINE_BUDGET_MS = 0;
/** Overall ceiling for one plan's checks, inline + background. */
export const KEY_VERIFY_TOTAL_BUDGET_MS = 60_000;
/** Parallel blind solves per plan. */
export const KEY_VERIFY_CONCURRENCY = 6;

/** What `verify` must return — `VerifyAnswerKeyResult`, with usage optional so
 *  a test fake can be one line. */
export type PlanKeyVerifyResult = Pick<VerifyAnswerKeyResult, 'status' | 'reason'> &
  Partial<Pick<VerifyAnswerKeyResult, 'model' | 'usage' | 'solverAnswer'>>;

export type PlanKeyVerifyFn = (
  input: VerifyAnswerKeyInput,
  ctx: { signal: AbortSignal; segmentId: string },
) => Promise<PlanKeyVerifyResult>;

/** Identifies the stored segment a late result belongs to. The problem and key
 *  are part of the match, so a result is never written onto a segment whose
 *  content was replaced in the meantime (a re-expansion reuses segment ids). */
export interface KeyCheckTarget {
  segmentId: string;
  problem: string;
  expectedAnswer: string;
}

export type PersistKeyCheckFn = (planId: string, target: KeyCheckTarget, keyCheck: KeyCheck) => Promise<boolean>;

export interface PlanKeyVerifyOptions {
  /** Which creation path this is — printed in the log line. */
  label: string;
  /** How long the caller waits for checks before the plan is returned. */
  inlineBudgetMs: number;
  totalBudgetMs?: number;
  concurrency?: number;
  /** Drop an `ill_posed` try-yourself from the returned plan when its learning
   *  objective still has another try-yourself that is not ill-posed. Applies
   *  only to checks that finished INLINE (the plan is not yet stored or in use). */
  dropIllPosed?: boolean;
  /** Injectable verifier (tests). Default: the real blind-solve verifier. */
  verify?: PlanKeyVerifyFn;
  /** Writes a late result onto the stored plan. Default: store.ts
   *  `setSegmentKeyCheck` (loaded lazily — it opens the database). */
  persist?: PersistKeyCheckFn;
  now?: () => Date;
  log?: (line: string) => void;
}

export interface PlanKeyVerifySummary {
  planId: string;
  label: string;
  /** Try-yourselves with an `expectedAnswer` (the ones checked). */
  tryYourselves: number;
  verified: number;
  mismatch: number;
  ill_posed: number;
  unverifiable: number;
  /** Of `unverifiable`: still running when this summary was taken. */
  pending: number;
  /** Of `unverifiable`: not finished within the total budget. */
  budgetExceeded: number;
  /** Ill-posed segments removed from the plan. */
  dropped: number;
  /** Late results written onto the stored plan by `finish()`. */
  stored: number;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  ms: number;
}

export interface PlanKeyVerifyOutcome {
  /** The plan to store: every checked try-yourself carries a `keyCheck`.
   *  The SAME object as the input when the flag is off or nothing was checked. */
  plan: LessonPlan;
  /** State when the inline budget ended; null when nothing was checked. */
  summary: PlanKeyVerifySummary | null;
  /** Non-null when checks were still running at return. Call it AFTER the plan
   *  has been stored: it waits for them (bounded by the total budget), writes
   *  each late `keyCheck` onto the stored plan, logs the plan's one summary
   *  line and resolves with the final summary. Never rejects. */
  finish: (() => Promise<PlanKeyVerifySummary>) | null;
}

function isCheckable(seg: Segment): seg is SegmentTryYourself & { expectedAnswer: string } {
  return (
    seg.kind === 'try_yourself' &&
    typeof seg.problem === 'string' &&
    seg.problem.trim().length > 0 &&
    typeof seg.expectedAnswer === 'string' &&
    seg.expectedAnswer.trim().length > 0
  );
}

/** The LO a generated segment belongs to: the longest LO id that prefixes the
 *  segment id ("<loId>-try", "<loId>-try2"). Null when unattributable. */
function ownerLoId(los: ReadonlyArray<{ id: string }>, segmentId: string): string | null {
  let owner: string | null = null;
  for (const lo of los) {
    if (segmentId.startsWith(`${lo.id}-`) && (owner === null || lo.id.length > owner.length)) owner = lo.id;
  }
  return owner;
}

export function formatKeyVerifySummary(s: PlanKeyVerifySummary): string {
  return (
    `[key-verify] plan=${s.planId} path=${s.label} tryYourselves=${s.tryYourselves}` +
    ` verified=${s.verified} mismatch=${s.mismatch} ill_posed=${s.ill_posed} unverifiable=${s.unverifiable}` +
    ` (pending=${s.pending} budgetExceeded=${s.budgetExceeded}) dropped=${s.dropped} storedLate=${s.stored}` +
    ` calls=${s.calls} inputTokens=${s.inputTokens} outputTokens=${s.outputTokens} model=${s.model} ms=${s.ms}`
  );
}

const defaultVerify: PlanKeyVerifyFn = (input, ctx) => verifyAnswerKey(input, { signal: ctx.signal });

const defaultPersist: PersistKeyCheckFn = async (planId, target, keyCheck) => {
  // Lazy: store.ts pulls in the database layer, which a caller that injects
  // `persist` (every test) must never load.
  const { setSegmentKeyCheck } = await import('./store');
  return setSegmentKeyCheck(planId, target, keyCheck);
};

/**
 * Verify every try-yourself key of a freshly generated plan. See the module
 * doc for the budget semantics. Never throws: a verifier failure is an
 * `unverifiable` segment, not a failed plan.
 */
export async function verifyPlanKeys(plan: LessonPlan, opts: PlanKeyVerifyOptions): Promise<PlanKeyVerifyOutcome> {
  if (!keyVerifyEnabled()) return { plan, summary: null, finish: null };
  const targets = plan.segments.filter(isCheckable);
  if (targets.length === 0) return { plan, summary: null, finish: null };

  const verify = opts.verify ?? defaultVerify;
  const now = opts.now ?? (() => new Date());
  const log = opts.log ?? ((line: string) => console.log(line));
  const totalBudgetMs = Math.max(0, opts.totalBudgetMs ?? KEY_VERIFY_TOTAL_BUDGET_MS);
  const inlineBudgetMs = Math.max(0, Math.min(opts.inlineBudgetMs, totalBudgetMs));
  const concurrency = Math.max(1, opts.concurrency ?? KEY_VERIFY_CONCURRENCY);
  const startedAt = Date.now();
  let fallbackModel = '';
  try {
    fallbackModel = keyVerifyModel();
  } catch {
    fallbackModel = '';
  }

  // ── run the checks: concurrency-capped, every one bounded by the total budget
  const abort = new AbortController();
  const aborted = new Promise<'aborted'>((resolve) => {
    abort.signal.addEventListener('abort', () => resolve('aborted'), { once: true });
  });
  const totalTimer = setTimeout(() => abort.abort(), totalBudgetMs);
  const results = new Map<string, PlanKeyVerifyResult>();
  const budgetExceededIds = new Set<string>();

  const runOne = async (seg: SegmentTryYourself & { expectedAnswer: string }): Promise<void> => {
    const overBudget = (): void => {
      budgetExceededIds.add(seg.id);
      results.set(seg.id, { status: 'unverifiable', reason: 'budget_exceeded' });
    };
    if (abort.signal.aborted) return overBudget();
    try {
      const outcome = await Promise.race([
        verify(
          {
            question: seg.problem,
            claimedAnswer: seg.expectedAnswer,
            choices: Array.isArray(seg.choices) && seg.choices.length > 0 ? seg.choices : undefined,
            answerFormat: seg.responseFormat ?? undefined,
          },
          { signal: abort.signal, segmentId: seg.id },
        ),
        aborted,
      ]);
      if (outcome === 'aborted') return overBudget();
      results.set(seg.id, outcome);
    } catch (e) {
      // The real verifier never throws; an injected one may. Fail closed.
      results.set(seg.id, { status: 'unverifiable', reason: `verifier error: ${e instanceof Error ? e.message : String(e)}`.slice(0, 200) });
    }
  };

  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < targets.length) await runOne(targets[cursor++]);
  };
  const allDone = Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, worker)).then(() => {
    clearTimeout(totalTimer);
  });

  // ── wait at most the inline budget
  if (inlineBudgetMs > 0) {
    let inlineTimer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      allDone,
      new Promise<void>((resolve) => {
        inlineTimer = setTimeout(resolve, inlineBudgetMs);
      }),
    ]);
    if (inlineTimer) clearTimeout(inlineTimer);
  }

  const keyCheckOf = (segId: string): KeyCheck => {
    const r = results.get(segId);
    const checkedAt = now().toISOString();
    if (!r) return { status: 'unverifiable', checkedAt, model: fallbackModel, reason: 'pending' };
    return {
      status: r.status,
      checkedAt,
      model: r.model || fallbackModel,
      ...(r.reason ? { reason: r.reason.slice(0, 240) } : {}),
    };
  };

  const pendingIds = new Set(targets.filter((t) => !results.has(t.id)).map((t) => t.id));
  const checks = new Map<string, KeyCheck>(targets.map((t) => [t.id, keyCheckOf(t.id)]));

  // ── an ill-posed try-yourself is not presented when its LO has another one
  const dropIds = new Set<string>();
  if (opts.dropIllPosed) {
    const tries = plan.segments.filter((s) => s.kind === 'try_yourself');
    for (const t of targets) {
      if (checks.get(t.id)?.status !== 'ill_posed') continue;
      const lo = ownerLoId(plan.los, t.id);
      if (lo === null) continue;
      const hasSibling = tries.some(
        (o) => o.id !== t.id && !dropIds.has(o.id) && ownerLoId(plan.los, o.id) === lo && checks.get(o.id)?.status !== 'ill_posed',
      );
      if (hasSibling) dropIds.add(t.id);
    }
  }

  const summarise = (stored: number): PlanKeyVerifySummary => {
    const count = (st: KeyCheckStatus) => targets.filter((t) => (results.get(t.id)?.status ?? 'unverifiable') === st).length;
    let calls = 0;
    let inputTokens = 0;
    let outputTokens = 0;
    for (const r of results.values()) {
      calls += r.usage?.calls ?? 0;
      inputTokens += r.usage?.inputTokens ?? 0;
      outputTokens += r.usage?.outputTokens ?? 0;
    }
    return {
      planId: plan.id,
      label: opts.label,
      tryYourselves: targets.length,
      verified: count('verified'),
      mismatch: count('mismatch'),
      ill_posed: count('ill_posed'),
      unverifiable: count('unverifiable'),
      pending: targets.filter((t) => !results.has(t.id)).length,
      budgetExceeded: budgetExceededIds.size,
      dropped: dropIds.size,
      stored,
      calls,
      inputTokens,
      outputTokens,
      model: [...results.values()].find((r) => r.model)?.model ?? fallbackModel,
      ms: Date.now() - startedAt,
    };
  };

  const segments = plan.segments
    .filter((s) => !dropIds.has(s.id))
    .map((s) => (checks.has(s.id) ? ({ ...s, keyCheck: checks.get(s.id)! } as Segment) : s));
  const outPlan: LessonPlan = { ...plan, segments };
  const summary = summarise(0);

  if (pendingIds.size === 0) {
    // Everything settled inline — this plan's one log line.
    log(formatKeyVerifySummary(summary));
    return { plan: outPlan, summary, finish: null };
  }

  const persist = opts.persist ?? defaultPersist;
  let finishing: Promise<PlanKeyVerifySummary> | null = null;
  const finish = (): Promise<PlanKeyVerifySummary> => {
    finishing ??= (async () => {
      let stored = 0;
      try {
        await allDone;
        for (const t of targets) {
          if (!pendingIds.has(t.id)) continue;
          try {
            const ok = await persist(plan.id, { segmentId: t.id, problem: t.problem, expectedAnswer: t.expectedAnswer }, keyCheckOf(t.id));
            if (ok) stored++;
          } catch (e) {
            // The stored segment keeps `unverifiable (pending)` — still untrusted.
            console.warn(`[key-verify] plan=${plan.id} segment=${t.id} late result not stored:`, e instanceof Error ? e.message : e);
          }
        }
      } catch (e) {
        console.warn(`[key-verify] plan=${plan.id} background check failed:`, e instanceof Error ? e.message : e);
      }
      const final = summarise(stored);
      log(formatKeyVerifySummary(final));
      return final;
    })();
    return finishing;
  };
  return { plan: outPlan, summary, finish };
}

/** Run `finish()` detached, after the plan has been stored. The engine is a
 *  long-lived Node process (pm2 + `next start`), so work started here outlives
 *  the response. If the process restarts first, the affected segments simply
 *  stay `unverifiable` (no trusted key). */
export function finishKeyVerifyInBackground(outcome: Pick<PlanKeyVerifyOutcome, 'finish'>): void {
  if (!outcome.finish) return;
  void outcome.finish().catch(() => undefined);
}
