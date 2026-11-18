import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, can } from "@/lib/keystone/config";
import { ks } from "@/lib/keystone/db";
import { countItems, listItems } from "@/lib/keystone/queries";
import { markDeliveredAction } from "../actions";
import { TopBar } from "../_components/TopBar";
import { ago } from "../_components/ui";
import { PAGE_SIZE, Pager, pageOf } from "../_components/Pager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Download for SOLARO" };

// Two lists, each paged 50 at a time on its own (ap = ready page, dp = delivered page).
export default async function ExportPage({ searchParams }: { searchParams: Promise<{ ap?: string; dp?: string }> }) {
  const user = await requireUser(can.export);
  const base = await ksBase();
  const sp = await searchParams;
  // Rows read as Castle Rock technical sees them (released version and answer), matching what the download carries.
  const [approvedTotal, doneTotal] = await Promise.all([countItems({ stage: "approved" }), countItems({ stage: "delivered" })]);
  const ap = pageOf(sp.ap, approvedTotal);
  const dp = pageOf(sp.dp, doneTotal);
  const [approved, done] = await Promise.all([
    listItems({ stage: "approved", role: "tech" }, { skip: ap.skip, limit: PAGE_SIZE }),
    listItems({ stage: "delivered", role: "tech" }, { skip: dp.skip, limit: PAGE_SIZE }),
  ]);
  const { Activity } = await ks();
  const lastOf = async (ids: string[], match: Record<string, unknown>) =>
    new Map(
      (
        await Activity.aggregate<{ _id: string; at: Date; name: string }>([
          { $match: { ...match, itemId: { $in: ids } } },
          { $sort: { createdAt: -1 } },
          { $group: { _id: "$itemId", at: { $first: "$createdAt" }, name: { $first: "$name" } } },
        ])
      ).map((r) => [r._id, r]),
    );
  const [approvals, deliveries] = await Promise.all([
    lastOf(approved.map((a) => a.itemId), { type: "verdict", verdict: "approved" }),
    lastOf(done.map((a) => a.itemId), { type: "stage", body: /^Delivered/ }),
  ]);

  const href = (p: { ap?: number; dp?: number }) => {
    const q = new URLSearchParams();
    const a = p.ap ?? ap.page;
    const d = p.dp ?? dp.page;
    if (a > 1) q.set("ap", String(a));
    if (d > 1) q.set("dp", String(d));
    const s = q.toString();
    return `${base}/export${s ? `?${s}` : ""}`;
  };
  const pageIds = approved.map((r) => r.itemId).join(",");
  const readyPager = <Pager page={ap.page} pages={ap.pages} href={(n) => href({ ap: n })} />;
  const donePager = <Pager page={dp.page} pages={dp.pages} href={(n) => `${href({ dp: n })}#delivered`} />;

  return (
    <>
      <TopBar user={user} on="export" />
      <main className="ks-main">
        <h1>Download for SOLARO</h1>
        <p className="ks-sub">
          Every solution Castle Rock has approved, ready to import. The download is one zip with a folder per item: solution.html in the
          solution_step markup with every equation as a PNG (no MathML), the images in resources/, and a QTI 2.1 package (item_&lt;id&gt;.zip)
          for items that came from a QTI export. A manifest.csv lists them all.
        </p>
        <section className="ks-card">
          <div className="ks-hero" style={{ marginBottom: 6 }}>
            <div>
              <h2 style={{ margin: 0 }}>Ready to import · {approvedTotal}</h2>
              {ap.pages > 1 && (
                <div className="ks-sub" style={{ margin: 0 }}>
                  {ap.from}–{ap.to} on this page
                </div>
              )}
            </div>
            {approvedTotal > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="ks-btn primary" href="/api/keystone/export">
                  ⬇ Download all {approvedTotal} for SOLARO
                </a>
                {ap.pages > 1 && (
                  <a className="ks-btn" href={`/api/keystone/export?ids=${pageIds}`}>
                    ⬇ Download this page ({approved.length})
                  </a>
                )}
              </div>
            )}
          </div>
          {approvedTotal ? (
            <form action={markDeliveredAction}>
              {readyPager}
              <div className="ks-table">
                <table className="ks-list">
                  <thead>
                    <tr>
                      <th style={{ width: 28 }}></th>
                      <th>Item</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Answer</th>
                      <th>Version</th>
                      <th>Approved</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.map((r) => {
                      const a = approvals.get(r.itemId);
                      return (
                        <tr key={r.itemId}>
                          <td>
                            <input type="checkbox" name="itemId" value={r.itemId} defaultChecked aria-label={`Select ${r.itemId}`} />
                          </td>
                          <td>
                            <Link href={`${base}/item/${r.itemId}?stage=approved&from=export`}>
                              <b>{r.itemId}</b>
                            </Link>
                            {r.player?.entry && <div><span className="ks-chip">▶ Animated</span></div>}
                          </td>
                          <td>
                            {r.subject}
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.course}</div>
                          </td>
                          <td>{ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}</td>
                          <td>{r.key || r.evelynAnswer || "–"}</td>
                          <td>v{r.version}</td>
                          <td style={{ fontSize: 13, color: "var(--muted)" }}>
                            {a ? `${a.name} · ${ago(a.at)}` : r.priorStatus === "approved" ? "28 Oct (earlier layout)" : "–"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <a href={`/api/keystone/export?ids=${r.itemId}`}>⬇ Download</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {readyPager}
              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button className="ks-btn">Mark ticked items as delivered to SOLARO</button>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                  Do this once they are imported, so the list shows only what is still to do.
                  {ap.pages > 1 ? " Ticks apply to this page." : ""}
                </span>
              </div>
            </form>
          ) : (
            <div className="ks-empty">Nothing approved is waiting. Approved items appear here as soon as Castle Rock approves them.</div>
          )}
        </section>

        <section className="ks-card" style={{ marginTop: 16 }} id="delivered">
          <div className="ks-hero" style={{ marginBottom: 6 }}>
            <div>
              <h2 style={{ margin: 0 }}>Already delivered · {doneTotal}</h2>
              {dp.pages > 1 && (
                <div className="ks-sub" style={{ margin: 0 }}>
                  {dp.from}–{dp.to} on this page
                </div>
              )}
            </div>
            {doneTotal > 0 && (
              <a className="ks-btn" href="/api/keystone/export?stage=delivered">
                ⬇ Download all {doneTotal} again
              </a>
            )}
          </div>
          {doneTotal ? (
            <>
              {donePager}
              <div className="ks-table">
                <table className="ks-list">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Version</th>
                      <th>Delivered</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {done.map((r) => {
                      const d = deliveries.get(r.itemId);
                      return (
                        <tr key={r.itemId}>
                          <td>
                            <Link href={`${base}/item/${r.itemId}?stage=delivered&from=export`}>
                              <b>{r.itemId}</b>
                            </Link>
                          </td>
                          <td>
                            {r.subject}
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.course}</div>
                          </td>
                          <td>{ITEM_TYPE_LABEL[r.itemType] ?? r.itemType}</td>
                          <td>v{r.version}</td>
                          <td style={{ fontSize: 13, color: "var(--muted)" }}>{d ? `${d.name} · ${ago(d.at)}` : "–"}</td>
                          <td style={{ textAlign: "right" }}>
                            <a href={`/api/keystone/export?stage=delivered&ids=${r.itemId}`}>⬇ Download again</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {donePager}
            </>
          ) : (
            <div className="ks-empty">None yet.</div>
          )}
        </section>
      </main>
    </>
  );
}
