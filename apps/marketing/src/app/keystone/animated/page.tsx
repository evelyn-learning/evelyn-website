import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { listAnimations } from "@/lib/keystone/animreview/store";
import { ANIMATION_STATUS_LABEL } from "@/lib/keystone/animreview/pure";
import { pacificTime } from "@/lib/keystone/pipeline/status";
import { TopBar } from "../_components/TopBar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Animated solutions" };

// Praveen's review of the animated solutions. Evelyn only: any other role gets 404 (decided on the server;
// listAnimations also returns null for any other role). Castle Rock never sees an unreleased version.

export default async function AnimatedList() {
  const user = await requireUser();
  if (user.role !== "evelyn") notFound();
  const rows = await listAnimations(user.role);
  if (!rows) notFound();
  const base = await ksBase();
  return (
    <>
      <TopBar user={user} on="animated" />
      <main className="ks-main ks-anim">
        <h1>Animated solutions</h1>
        <p className="ks-sub">Every item with an animated version. Castle Rock never sees a version until you release it.</p>
        <section className="ks-card">
          {rows.length ? (
            <div className="ks-table">
              <table className="ks-list">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Latest</th>
                    <th>Status</th>
                    <th>Open flags</th>
                    <th>Published</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.itemId} data-item={r.itemId}>
                      <td>
                        <b>{r.itemId}</b>
                      </td>
                      <td>
                        v{r.latest}
                        {r.versions > 1 ? <span className="ks-q-meta"> · {r.versions} versions</span> : null}
                      </td>
                      <td>
                        <span className={`ks-chip a-${r.status}`}>{ANIMATION_STATUS_LABEL[r.status]}</span>
                      </td>
                      <td>{r.openFlags || "–"}</td>
                      <td className="ks-q-meta">{pacificTime(new Date(r.updatedAt))}</td>
                      <td>
                        <Link className="ks-btn" href={`${base}/animated/${encodeURIComponent(r.itemId)}`}>
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="ks-empty">No animated solution has been published yet.</div>
          )}
        </section>
      </main>
    </>
  );
}
