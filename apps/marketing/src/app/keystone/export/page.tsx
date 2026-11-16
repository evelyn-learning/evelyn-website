import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, can } from "@/lib/keystone/config";
import { ks } from "@/lib/keystone/db";
import { listItems } from "@/lib/keystone/queries";
import { markDeliveredAction } from "../actions";
import { TopBar } from "../_components/TopBar";
import { ago } from "../_components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Approved for SOLARO" };

export default async function ExportPage() {
  const user = await requireUser(can.export);
  const base = await ksBase();
  const [approved, done] = await Promise.all([listItems({ stage: "approved" }), listItems({ stage: "delivered" })]);
  const { Activity } = await ks();
  const approvals = new Map(
    (
      await Activity.aggregate<{ _id: string; at: Date; name: string }>([
        { $match: { type: "verdict", verdict: "approved", itemId: { $in: approved.map((a) => a.itemId) } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$itemId", at: { $first: "$createdAt" }, name: { $first: "$name" } } },
      ])
    ).map((r) => [r._id, r]),
  );

  return (
    <>
      <TopBar user={user} on="export" />
      <main className="ks-main">
        <h1>Approved for SOLARO</h1>
        <p className="ks-sub">
          Every solution Castle Rock has approved, ready to import. The download is one zip with a folder per item (solution.html in the
          solution_step markup, its images, the Markdown source and item.json) and a manifest.csv.
        </p>
        <section className="ks-card">
          <div className="ks-hero" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>Ready to import · {approved.length}</h2>
            {approved.length > 0 && (
              <a className="ks-btn primary" href="/api/keystone/export">
                Download all {approved.length} (zip)
              </a>
            )}
          </div>
          {approved.length ? (
            <form action={markDeliveredAction}>
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
                            <Link href={`${base}/item/${r.itemId}`}>
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
                          <td style={{ fontSize: 13, color: "var(--muted)" }}>
                            {a ? `${a.name} · ${ago(a.at)}` : r.priorStatus === "approved" ? "28 Oct (earlier layout)" : "–"}
                          </td>
                          <td>
                            <a href={`/api/keystone/export?ids=${r.itemId}`}>Download</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
                <button className="ks-btn">Mark ticked items as delivered to SOLARO</button>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Do this once they are imported, so the list shows only what is still to do.</span>
              </div>
            </form>
          ) : (
            <div className="ks-empty">Nothing approved is waiting. Approved items appear here as soon as Castle Rock approves them.</div>
          )}
        </section>
        <section className="ks-card" style={{ marginTop: 16 }}>
          <div className="ks-hero" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>Already delivered · {done.length}</h2>
            {done.length > 0 && (
              <a className="ks-btn" href={`/api/keystone/export?include=delivered&ids=${done.map((d) => d.itemId).join(",")}`}>
                Download again
              </a>
            )}
          </div>
          {done.length ? (
            <p style={{ margin: 0 }}>
              {done.map((d, i) => (
                <span key={d.itemId}>
                  {i ? ", " : ""}
                  <Link href={`${base}/item/${d.itemId}`}>{d.itemId}</Link>
                </span>
              ))}
            </p>
          ) : (
            <div className="ks-empty">None yet.</div>
          )}
        </section>
      </main>
    </>
  );
}
