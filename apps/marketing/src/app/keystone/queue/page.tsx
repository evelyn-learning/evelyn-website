import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, STAGE_LABEL } from "@/lib/keystone/config";
import { ownerQueue, type QueueRow } from "@/lib/keystone/queries";
import { pacificTime } from "@/lib/keystone/pipeline/status";
import { TopBar } from "../_components/TopBar";
import { DoneNote, HeldControls, HoldControl } from "../_components/OwnerControls";
import { listAnimations, toAnimate, type ToAnimate } from "@/lib/keystone/animreview/store";
import { ANIMATION_STATUS_LABEL } from "@/lib/keystone/animreview/pure";
import { buildBudget, type BuildBudget } from "@/lib/keystone/animated/buildstate";
import { AutoRefresh } from "../_components/AutoRefresh";
import { setAnimateRouteAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your queue" };

// Praveen's final look before Castle Rock sees a solution. Evelyn only: any other role is sent to the
// overview by requireUser (on the server), and ownerQueue returns nothing for any other role either.

function Facts({ r }: { r: QueueRow }) {
  return (
    <div className="ks-q-facts">
      {r.solvers.length ? (
        r.solvers.map((s) => (
          <span key={s.who} className={s.ok ? "" : "bad"}>
            {s.who} <b>{s.answer}</b>
          </span>
        ))
      ) : (
        <span>No solver answers recorded</span>
      )}
      <span>
        Key <b>{r.key}</b>
      </span>
      <span>{r.findings === null ? "No run" : `${r.findings} finding${r.findings === 1 ? "" : "s"}`}</span>
      {r.checksFailed > 0 && <span className="bad">{r.checksFailed} check{r.checksFailed === 1 ? "" : "s"} could not run</span>}
    </div>
  );
}

type AnimNote = Map<string, string>;
const ROUTE_WORDS = { undecided: "Not decided", api: "Queued for API credits", hand: "Queued for a by-hand build", none: "No animation needed" } as const;

const usd = (n: number) => `$${n.toFixed(2)}`;

/** Where the server's own build of an API item stands, in the owner's words. Nothing when the server build is switched off. */
function buildWords(t: ToAnimate, budget: BuildBudget): string {
  if (t.route !== "api" || !budget.on) return "";
  const b = t.build;
  if (b?.state === "building") return ` · Building since ${b.startedAt ? pacificTime(new Date(b.startedAt)) : "just now"}${(b.attempts ?? 1) > 1 ? " (second try: the first was interrupted)" : ""}`;
  if (budget.capReached) return ` · Waiting: today's limit for builds is reached (${usd(budget.spent)} of ${usd(budget.cap)}); it is built tomorrow`;
  return " · The server builds it by itself, one item at a time";
}

function Head({ r, base, anim }: { r: QueueRow; base: string; anim?: AnimNote }) {
  return (
    <div className="ks-q-head">
      <Link href={`${base}/item/${encodeURIComponent(r.itemId)}${r.stage === "ready" ? "?stage=ready" : ""}`}>
        <b>Item {r.itemId}</b>
      </Link>
      <span className="ks-q-meta">
        {r.course || "No course"} · {ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}
        {r.stage !== "ready" ? ` · ${STAGE_LABEL[r.stage]}` : ""}
      </span>
      {anim?.has(r.itemId) && <span className="ks-q-meta">· {anim.get(r.itemId)}</span>}
      {r.seenAt && <span className="ks-q-seen">Seen {pacificTime(new Date(r.seenAt))}</span>}
    </div>
  );
}

function Why({ reasons }: { reasons: string[] }) {
  if (!reasons.length) return null;
  return (
    <ul className="ks-q-why">
      {reasons.map((w, i) => (
        <li key={i}>{w}</li>
      ))}
    </ul>
  );
}

export default async function QueuePage({ searchParams }: { searchParams: Promise<{ done?: string }> }) {
  const user = await requireUser((r) => r === "evelyn");
  const base = await ksBase();
  const { done } = await searchParams;
  const q = await ownerQueue(user.role);
  if (!q) return null; // unreachable: requireUser sent any other role to the overview
  const [anims, todo, budget] = await Promise.all([listAnimations(user.role), toAnimate(user.role), buildBudget()]);
  const anim: AnimNote = new Map(
    (anims ?? []).map((a) => [a.itemId, `Animation v${a.latest}: ${ANIMATION_STATUS_LABEL[a.status]}${a.openFlags ? `, ${a.openFlags} open flag${a.openFlags === 1 ? "" : "s"}` : ""}`]),
  );
  const build = (todo ?? []).filter((t) => t.route !== "none");
  const skipped = (todo ?? []).filter((t) => t.route === "none");
  // A build is running or about to: the list follows it without a reload by hand.
  const live = budget.on && build.some((t) => t.route === "api" && (t.build?.state === "building" || !budget.capReached));
  const open = (id: string, ready = true) => `${base}/item/${encodeURIComponent(id)}${ready ? "?stage=ready" : ""}`;

  return (
    <>
      <TopBar user={user} on="queue" />
      <main className="ks-main ks-queue">
        <h1>Your queue</h1>
        <p className="ks-sub">Solutions held for your look before Castle Rock sees them. Castle Rock never sees this page.</p>
        <DoneNote done={done} />

        {q.blocked.length > 0 && (
          <section className="ks-card ks-q-sec ks-q-blocked">
            <h2>Blocked batches · {q.blocked.length}</h2>
            <ul className="ks-q-list">
              {q.blocked.map((b) => (
                <li key={b.batchId} className="ks-q-row">
                  <div className="ks-q-head">
                    <b>Batch {b.batchId}</b>
                    {b.since && <span className="ks-q-meta">since {pacificTime(new Date(b.since))}</span>}
                  </div>
                  <div>{b.why}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="ks-card ks-q-sec" id="waiting">
          <h2>Waiting for you · {q.waiting.length}</h2>
          {q.waiting.length ? (
            <ul className="ks-q-list">
              {q.waiting.map((r) => (
                <li key={r.itemId} className={`ks-q-row${r.seenAt ? " seen" : ""}`} data-item={r.itemId}>
                  <Head r={r} base={base} anim={anim} />
                  <Why reasons={r.reasons} />
                  <Facts r={r} />
                  <HeldControls itemId={r.itemId} back="queue" openHref={open(r.itemId, r.stage === "ready")} canSend={r.canSend} canSendBack={r.canSendBack} canClear={r.canClear} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="ks-empty">Nothing is waiting for you.</div>
          )}
        </section>

        <section className="ks-card ks-q-sec" id="before">
          <h2>Held before a solution · {q.beforeSolution.length}</h2>
          {q.beforeSolution.length ? (
            <ul className="ks-q-list">
              {q.beforeSolution.map((r) => (
                <li key={r.itemId} className="ks-q-row" data-item={r.itemId}>
                  <Head r={r} base={base} anim={anim} />
                  <Why reasons={r.reasons} />
                  <Facts r={r} />
                  <div className="ks-q-ctl">
                    <Link className="ks-btn" href={open(r.itemId, r.stage === "ready")}>
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ks-empty">No item is stuck before its solution.</div>
          )}
        </section>

        <section className="ks-card ks-q-sec" id="going">
          <h2>Going out by itself · {q.going.length}</h2>
          {q.going.length ? (
            <ul className="ks-q-list">
              {q.going.map((r) => (
                <li key={r.itemId} className="ks-q-row" data-item={r.itemId}>
                  <Head r={r} base={base} anim={anim} />
                  <div className="ks-q-when">{r.releaseAt ? `Goes to review ${pacificTime(new Date(r.releaseAt))}` : "No release time yet"}</div>
                  <Why reasons={r.reasons} />
                  <Facts r={r} />
                  <HoldControl itemId={r.itemId} back="queue" openHref={open(r.itemId)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="ks-empty">Nothing is due to go out by itself.</div>
          )}
        </section>

        <section className="ks-card ks-q-sec" id="animate">
          <h2>To animate · {build.length}</h2>
          <p className="ks-sub">Items with a written solution and no animation yet. Items that need no animation are sorted out automatically, with the reason Castle Rock reads; you can put any of them back. Tick items here, then choose how each is built.</p>
          {live && <AutoRefresh seconds={10} />}
          {build.length ? (
            <form action={setAnimateRouteAction}>
              <ul className="ks-q-list">
                {build.map((t) => (
                  <li key={t.itemId} className="ks-q-row" data-item={t.itemId}>
                    <div className="ks-q-head">
                      <input type="checkbox" name="itemId" value={t.itemId} aria-label={`Item ${t.itemId}`} />
                      <Link href={open(t.itemId, false)}>
                        <b>Item {t.itemId}</b>
                      </Link>
                      <span className="ks-q-meta">
                        {t.course || "No course"} · {STAGE_LABEL[t.stage as keyof typeof STAGE_LABEL] ?? t.stage} · <b>{ROUTE_WORDS[t.route]}</b>
                        {t.requestedAt && t.route !== "undecided" ? ` since ${pacificTime(new Date(t.requestedAt))}` : ""}
                        {buildWords(t, budget)}
                        {t.askedBy ? <b className="bad"> · Asked for by Castle Rock ({t.askedBy})</b> : ""}
                      </span>
                    </div>
                    {t.route === "hand" && t.build?.state === "failed" && (
                      <div className="ks-q-why">
                        <b className="bad">Failed: {t.build.failure || "no reason recorded"}</b> It is now on the by-hand list.
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="ks-q-ctl">
                <button className="ks-btn ok" name="route" value="api">
                  Build with API credits
                </button>
                <button className="ks-btn ok" name="route" value="hand">
                  Build by hand
                </button>
                <button className="ks-btn" name="route" value="none">
                  No animation needed
                </button>
                <input type="text" name="reason" maxLength={240} placeholder="Reason Castle Rock will read (optional)" style={{ flex: "1 1 260px", minWidth: 0 }} />
                <button className="ks-btn" name="route" value="undecided">
                  Clear the choice
                </button>
              </div>
            </form>
          ) : (
            <div className="ks-empty">No item is waiting for an animation.</div>
          )}
          {skipped.length > 0 && (
            <form action={setAnimateRouteAction} style={{ marginTop: 16 }}>
              <h3>No animation needed · {skipped.length}</h3>
              <ul className="ks-q-list">
                {skipped.map((t) => (
                  <li key={t.itemId} className="ks-q-row" data-item={t.itemId}>
                    <div className="ks-q-head">
                      <input type="checkbox" name="itemId" value={t.itemId} aria-label={`Item ${t.itemId}`} />
                      <Link href={open(t.itemId, false)}>
                        <b>Item {t.itemId}</b>
                      </Link>
                      <span className="ks-q-meta">
                        {t.course || "No course"}
                        {t.requestedAt ? ` · decided ${pacificTime(new Date(t.requestedAt))}` : ""}
                        {t.by === "auto" ? " automatically" : t.by ? ` by ${t.by}` : ""}
                      </span>
                    </div>
                    <div className="ks-q-why">{t.reason || "No reason recorded: Castle Rock sees the standard sentence."}</div>
                  </li>
                ))}
              </ul>
              <div className="ks-q-ctl">
                <button className="ks-btn" name="route" value="undecided">
                  Put back on the list
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
