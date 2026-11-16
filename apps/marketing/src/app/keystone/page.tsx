import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { STAGE_LABEL, type Stage } from "@/lib/keystone/config";
import { latestVerdicts, listItems, recentActivity, recentUploads, stageCounts } from "@/lib/keystone/queries";
import { TopBar } from "./_components/TopBar";
import { Feed, ItemsTable, ago } from "./_components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

function Stats({ counts, base, stages }: { counts: Record<Stage, number>; base: string; stages: Stage[] }) {
  return (
    <div className="ks-stats">
      {stages.map((s) => (
        <Link key={s} href={`${base}/items?stage=${s}`} className="ks-stat">
          <b>{counts[s]}</b>
          <span>{STAGE_LABEL[s]}</span>
        </Link>
      ))}
    </div>
  );
}

export default async function Overview({ searchParams }: { searchParams: Promise<{ done?: string }> }) {
  const user = await requireUser();
  const base = await ksBase();
  const { done } = await searchParams;
  const counts = await stageCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (user.role === "reviewer") {
    const waiting = await listItems({ stage: "in_review" });
    const feed = await recentActivity({ roles: ["evelyn"], types: ["revision", "comment"], limit: 8 });
    return (
      <>
        <TopBar user={user} on="home" />
        <main className="ks-main">
          {done && <div className="ks-note info">That was the last item waiting. Thank you — nothing else is waiting for review.</div>}
          <div className="ks-card ks-hero">
            <div>
              <div className="ks-big">{waiting.length}</div>
              <div>{waiting.length === 1 ? "solution is" : "solutions are"} waiting for your review</div>
            </div>
            {waiting.length > 0 && (
              <Link className="ks-btn primary" href={`${base}/item/${waiting[0].itemId}`}>
                Start reviewing →
              </Link>
            )}
          </div>
          <Stats counts={counts} base={base} stages={["in_review", "changes_requested", "approved", "delivered"]} />
          <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)" }}>
            <section className="ks-card">
              <h2>Waiting for review</h2>
              <ItemsTable rows={waiting} base={base} showStage={false} />
            </section>
            <section className="ks-card">
              <h2>Latest from Evelyn</h2>
              <Feed rows={feed} base={base} />
            </section>
          </div>
          <p className="ks-sub" style={{ marginTop: 14 }}>
            On an item: <b>A</b> approves, <b>C</b> asks for changes (write the change in the box first), <b>J</b>/<b>K</b> move to the next or previous item.
          </p>
        </main>
      </>
    );
  }

  if (user.role === "tech") {
    const approved = await listItems({ stage: "approved" });
    const uploads = await recentUploads(6);
    const feed = await recentActivity({ limit: 8, types: ["verdict", "stage", "upload"] });
    return (
      <>
        <TopBar user={user} on="home" />
        <main className="ks-main">
          <div className="ks-card ks-hero">
            <div>
              <div className="ks-big">{approved.length}</div>
              <div>approved {approved.length === 1 ? "solution is" : "solutions are"} ready to import into SOLARO</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="ks-btn primary" href={`${base}/export`}>
                Review and download →
              </Link>
              <Link className="ks-btn" href={`${base}/upload`}>
                Upload items
              </Link>
            </div>
          </div>
          <Stats counts={counts} base={base} stages={["received", "in_review", "approved", "delivered"]} />
          <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
            <section className="ks-card">
              <h2>Recent uploads</h2>
              {uploads.length ? (
                <ul className="ks-feed">
                  {uploads.map((u, i) => (
                    <li key={i}>
                      <b>{u.filename}</b> <span className="when">· {u.username} · {ago(u.createdAt)}</span>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>
                        {u.itemIds.length} item{u.itemIds.length === 1 ? "" : "s"}
                        {u.itemIds.length ? `: ${u.itemIds.slice(0, 8).join(", ")}${u.itemIds.length > 8 ? "…" : ""}` : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="ks-empty">No uploads yet.</div>
              )}
            </section>
            <section className="ks-card">
              <h2>Activity</h2>
              <Feed rows={feed} base={base} />
            </section>
          </div>
        </main>
      </>
    );
  }

  // Evelyn: what needs us, and what Castle Rock has said.
  const todo = await listItems({ stage: ["received", "drafting", "changes_requested"] });
  const verdicts = await latestVerdicts(todo.map((t) => t.itemId));
  const crFeed = await recentActivity({ roles: ["reviewer", "tech"], limit: 12 });
  return (
    <>
      <TopBar user={user} on="home" />
      <main className="ks-main">
        <div className="ks-card ks-hero">
          <div>
            <div className="ks-big">{todo.length}</div>
            <div>
              {todo.length === 1 ? "item needs" : "items need"} Evelyn · {counts.changes_requested} with change requests, {counts.received} new
              {counts.drafting ? `, ${counts.drafting} drafting` : ""}
            </div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{total} items in all · {counts.approved + counts.delivered} approved</div>
        </div>
        <Stats counts={counts} base={base} stages={["received", "drafting", "in_review", "changes_requested", "approved", "delivered"]} />
        <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}>
          <section className="ks-card">
            <h2>Needs Evelyn</h2>
            <ItemsTable rows={todo} base={base} verdicts={verdicts} />
          </section>
          <section className="ks-card">
            <h2>From Castle Rock</h2>
            <Feed rows={crFeed} base={base} empty="Nothing from Castle Rock yet." />
          </section>
        </div>
      </main>
    </>
  );
}
