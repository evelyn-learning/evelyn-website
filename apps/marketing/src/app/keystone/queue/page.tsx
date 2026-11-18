import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, STAGE_LABEL } from "@/lib/keystone/config";
import { ownerQueue, type QueueRow } from "@/lib/keystone/queries";
import { pacificTime } from "@/lib/keystone/pipeline/status";
import { TopBar } from "../_components/TopBar";
import { DoneNote, HeldControls, HoldControl } from "../_components/OwnerControls";

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

function Head({ r, base }: { r: QueueRow; base: string }) {
  return (
    <div className="ks-q-head">
      <Link href={`${base}/item/${encodeURIComponent(r.itemId)}${r.stage === "ready" ? "?stage=ready" : ""}`}>
        <b>Item {r.itemId}</b>
      </Link>
      <span className="ks-q-meta">
        {r.course || "No course"} · {ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}
        {r.stage !== "ready" ? ` · ${STAGE_LABEL[r.stage]}` : ""}
      </span>
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
                  <Head r={r} base={base} />
                  <Why reasons={r.reasons} />
                  <Facts r={r} />
                  <HeldControls itemId={r.itemId} back="queue" openHref={open(r.itemId)} />
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
                  <Head r={r} base={base} />
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
                  <Head r={r} base={base} />
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
      </main>
    </>
  );
}
