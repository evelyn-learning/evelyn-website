import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { recentUploads } from "@/lib/keystone/queries";
import { TopBar } from "../_components/TopBar";
import { ago } from "../_components/ui";
import { UploadForm } from "./UploadForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Upload items" };

export default async function UploadPage() {
  const user = await requireUser();
  const base = await ksBase();
  const uploads = await recentUploads(15);
  return (
    <>
      <TopBar user={user} on="upload" />
      <main className="ks-main">
        <h1>Upload items</h1>
        <p className="ks-sub">
          Upload the SOLARO QTI 2.1 export as a zip: one folder per item (item XML with the key, the metadata file and the resources folder).
          One zip per item, one zip of many items, or a zip of zips all work. Add a spreadsheet (CSV or Excel) with item ID, subject, course and
          a showcase column if you have one. Re-uploading an item refreshes its question and keeps its solution and history.
        </p>
        <div className="ks-grid" style={{ gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)" }}>
          <section className="ks-card">
            <UploadForm base={base} />
          </section>
          <section className="ks-card">
            <h2>Previous uploads</h2>
            {uploads.length ? (
              <ul className="ks-feed">
                {uploads.map((u, i) => (
                  <li key={i}>
                    <b>{u.filename}</b> <span className="when">· {u.username} · {ago(u.createdAt)}</span>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>
                      {u.itemIds.length} item{u.itemIds.length === 1 ? "" : "s"}
                      {u.messages.length ? ` · ${u.messages.join(" ")}` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="ks-empty">No uploads yet.</div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
