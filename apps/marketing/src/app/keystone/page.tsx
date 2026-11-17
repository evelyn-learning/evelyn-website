import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, STAGE_LABEL, type Stage } from "@/lib/keystone/config";
import { latestVerdicts, listItems, recentActivity, recentUploads, stageCounts } from "@/lib/keystone/queries";
import { TopBar } from "./_components/TopBar";
import { Feed, ItemsTable, ago } from "./_components/ui";

export const dynamic = "force-dynamic";

/** Rows shown in each overview table; the rest are a click away. */
const CAP = 15;
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
  const counts = await stageCounts(user.role);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (user.role === "reviewer") {
    const waiting = await listItems({ stage: "in_review", role: user.role });
    const keyQueries = await listItems({ stage: "key_query", role: user.role });
    const feed = await recentActivity({ roles: ["evelyn"], types: ["revision", "comment"], limit: 8, viewer: user.role });
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
              <Link className="ks-btn primary" href={`${base}/item/${waiting[0].itemId}?stage=in_review`}>
                Start reviewing →
              </Link>
            )}
          </div>
          <Stats counts={counts} base={base} stages={["in_review", "changes_requested", "item_data", "key_query", "approved", "delivered", "rejected"]} />
          {keyQueries.length > 0 && (
            <section className="ks-card ks-keyqueries" style={{ marginBottom: 16 }}>
              <h2>Key queries waiting on you · {keyQueries.length}</h2>
              <p className="ks-sub" style={{ marginBottom: 8 }}>
                Our working reaches a different answer from your key. Open each item to see our answer, your key and our working, then
                confirm the key (<b>R</b>), flag the item data (<b>D</b>) or reject the item (<b>X</b>).
              </p>
              <ItemsTable rows={keyQueries.slice(0, CAP)} base={base} showStage={false} linkQuery="?stage=key_query" />
              {keyQueries.length > CAP && (
                <Link className="ks-more" href={`${base}/items?stage=key_query`}>
                  See all {keyQueries.length} key queries →
                </Link>
              )}
            </section>
          )}
          <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)" }}>
            <section className="ks-card">
              <h2>Waiting for review</h2>
              <ItemsTable rows={waiting.slice(0, CAP)} base={base} showStage={false} linkQuery="?stage=in_review" />
              {waiting.length > CAP && (
                <Link className="ks-more" href={`${base}/items?stage=in_review`}>
                  See all {waiting.length} waiting →
                </Link>
              )}
            </section>
            <section className="ks-card">
              <h2>Latest from Evelyn</h2>
              <Feed rows={feed} base={base} />
            </section>
          </div>
          <p className="ks-sub" style={{ marginTop: 14 }}>
            On an item: <b>A</b> approves. To send it back, write the reason in the box first, then <b>C</b> when the solution needs
            changes (goes to Evelyn), <b>D</b> when the question is incomplete or wrong as exported (goes to Castle Rock technical), or{" "}
            <b>X</b> to reject the item itself. On a key query, <b>R</b> confirms the key (with the reason in the box).{" "}
            <b>J</b>/<b>K</b> move to the next or previous item.
          </p>
        </main>
      </>
    );
  }

  if (user.role === "tech") {
    const approved = await listItems({ stage: "approved", role: user.role });
    const needData = await listItems({ stage: "item_data", role: user.role });
    const dataAsks = await latestVerdicts(needData.map((r) => r.itemId));
    const uploads = await recentUploads(6);
    const feed = await recentActivity({ limit: 8, types: ["verdict", "stage", "upload"], viewer: user.role });
    return (
      <>
        <TopBar user={user} on="home" />
        <main className="ks-main">
          <div className="ks-card ks-hero">
            <div>
              <div className="ks-big">{approved.length}</div>
              <div>approved {approved.length === 1 ? "solution is" : "solutions are"} ready to import into SOLARO</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                One zip, a folder per item: solution.html in the solution_step markup with every equation as a PNG, its images, and a QTI
                package for items that came from a QTI export.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {approved.length > 0 ? (
                <a className="ks-btn primary" href="/api/keystone/export">
                  ⬇ Download all {approved.length} for SOLARO
                </a>
              ) : (
                <span className="ks-btn" aria-disabled="true" style={{ opacity: 0.5 }}>Nothing to download yet</span>
              )}
              <Link className="ks-btn" href={`${base}/upload`}>
                Upload items
              </Link>
            </div>
          </div>
          <Stats counts={counts} base={base} stages={["item_data", "received", "in_review", "approved", "delivered"]} />
          {needData.length > 0 && (
            <section className="ks-card ks-waiting" style={{ marginBottom: 16 }}>
              <h2>Waiting on you: item data needed · {needData.length}</h2>
              <p className="ks-sub" style={{ marginBottom: 8 }}>
                The reviewer found these questions incomplete or wrong as exported. Re-send each item on{" "}
                <Link href={`${base}/upload`}>Upload items</Link>; it then returns to Evelyn by itself.
              </p>
              <ItemsTable rows={needData.slice(0, CAP)} base={base} verdicts={dataAsks} showStage={false} linkQuery="?stage=item_data" />
              {needData.length > CAP && (
                <Link className="ks-more" href={`${base}/items?stage=item_data`}>
                  See all {needData.length} →
                </Link>
              )}
            </section>
          )}
          <section className="ks-card" style={{ marginBottom: 16 }}>
            <div className="ks-hero" style={{ marginBottom: 6 }}>
              <h2 style={{ margin: 0 }}>Ready for SOLARO · {approved.length}</h2>
              {approved.length > 0 && (
                <Link href={`${base}/export`}>Choose items or mark them delivered →</Link>
              )}
            </div>
            {approved.length ? (
              <div className="ks-table">
                <table className="ks-list">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Answer</th>
                      <th>Version</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.slice(0, CAP).map((r) => (
                      <tr key={r.itemId}>
                        <td>
                          <Link href={`${base}/item/${r.itemId}?stage=approved&from=overview`}>
                            <b>{r.itemId}</b>
                          </Link>
                        </td>
                        <td>
                          {r.subject}
                          <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.course}</div>
                        </td>
                        <td>{ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}</td>
                        <td>{r.key || r.evelynAnswer || "–"}</td>
                        <td>v{r.version}</td>
                        <td style={{ textAlign: "right" }}>
                          <a href={`/api/keystone/export?ids=${r.itemId}`}>⬇ Download</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ks-empty">Approved solutions appear here as soon as Castle Rock approves them.</div>
            )}
            {approved.length > CAP && (
              <Link className="ks-more" href={`${base}/export`}>
                See all {approved.length} ready →
              </Link>
            )}
          </section>
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
              {todo.length === 1 ? "item needs" : "items need"} Evelyn · {counts.changes_requested} with solution changes, {counts.received} new
              {counts.drafting ? `, ${counts.drafting} drafting` : ""}
              {counts.item_data ? ` · ${counts.item_data} with Castle Rock technical for item data` : ""}
              {counts.key_query ? ` · ${counts.key_query} key ${counts.key_query === 1 ? "query" : "queries"} with Castle Rock review` : ""}
            </div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{total} items in all · {counts.approved + counts.delivered} approved</div>
        </div>
        <Stats counts={counts} base={base} stages={["received", "drafting", "ready", "in_review", "changes_requested", "item_data", "key_query", "approved", "delivered", "rejected"]} />
        <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}>
          <section className="ks-card">
            <h2>Needs Evelyn</h2>
            <ItemsTable rows={todo.slice(0, CAP)} base={base} verdicts={verdicts} linkQuery="?from=overview" />
            {todo.length > CAP && (
              <p className="ks-more">
                {counts.changes_requested > 0 && <Link href={`${base}/items?stage=changes_requested`}>All {counts.changes_requested} with solution changes →</Link>}{" "}
                {counts.received > 0 && <Link href={`${base}/items?stage=received`}>All {counts.received} new →</Link>}{" "}
                {counts.drafting > 0 && <Link href={`${base}/items?stage=drafting`}>All {counts.drafting} drafting →</Link>}
              </p>
            )}
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
