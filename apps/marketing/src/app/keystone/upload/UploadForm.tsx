"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Result = { file: string; created: string[]; updated: string[]; messages: string[] };

export function UploadForm({ base }: { base: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/keystone/upload", { method: "POST", body: new FormData(formEl) });
      const json = await res.json().catch(() => ({ error: `Upload failed (${res.status}).` }));
      if (!res.ok) setError(json.error || `Upload failed (${res.status}).`);
      else {
        setResults(json.results);
        formEl.reset();
        router.refresh();
      }
    } catch {
      setError("Upload failed. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="ks-form">
      <label htmlFor="files">Files</label>
      <input id="files" name="files" type="file" multiple accept=".zip,.csv,.tsv,.xlsx" required />
      <div style={{ marginTop: 12 }}>
        <button className="ks-btn primary" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
      {error && <div className="ks-err">{error}</div>}
      {results && (
        <div style={{ marginTop: 14 }}>
          {results.map((r) => (
            <div key={r.file} className="ks-note info" style={{ marginBottom: 8 }}>
              <b>{r.file}</b>
              <div>
                {r.created.length > 0 && (
                  <>
                    New: {r.created.map((id, i) => (
                      <span key={id}>
                        {i ? ", " : ""}
                        <Link href={`${base}/item/${id}`}>{id}</Link>
                      </span>
                    ))}
                    .{" "}
                  </>
                )}
                {r.updated.length > 0 && <>Updated: {r.updated.join(", ")}. </>}
                {!r.created.length && !r.updated.length && "No items added."}
              </div>
              {r.messages.map((m, i) => (
                <div key={i} style={{ fontSize: 13 }}>
                  {m}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
