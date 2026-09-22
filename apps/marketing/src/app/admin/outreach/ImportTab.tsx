"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface GmailStatus { accounts?: { account: string; connected: boolean; connectedAt: string | null }[] }
interface PageResult { nextPageToken?: string; scanned: number; kept: number; created: number; updated: number; touchesAdded: number; errors: number; skipped: Record<string, number>; samples: { threadId: string; subject: string; participant: string; verdict: string }[] }

const MAX_PAGES = 200;
const MAX_PAGE_RETRIES = 3;
const MAX_RETRY_WAIT_MS = 90_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function ImportTab({ gmailStatus, onImported }: { gmailStatus: GmailStatus | null; onImported: () => Promise<void> }) {
  const accounts = gmailStatus?.accounts ?? [];
  const [account, setAccount] = useState(accounts[0]?.account ?? "");
  const [days, setDays] = useState(365);
  const [running, setRunning] = useState<"idle" | "dry" | "real">("idle");
  const [totals, setTotals] = useState<PageResult | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [archiveMsg, setArchiveMsg] = useState<string | null>(null);
  // The account/days a completed dry run actually used. "Import for real" is
  // only safe to enable when these still match the current inputs — an
  // operator changing the account or day-count after previewing must dry-run
  // again before the real button re-arms.
  const [previewedFor, setPreviewedFor] = useState<{ account: string; days: number } | null>(null);

  // gmailStatus loads asynchronously (fetched in a useEffect one level up),
  // so accounts is empty on first render. Whenever the account list changes,
  // correct the selection to the first CONNECTED account if the current
  // pick is empty or is no longer a connected entry in the list (e.g. the
  // initial useState grabbed a disconnected first account before status
  // loaded).
  useEffect(() => {
    setAccount((current) => {
      const stillValid = current && accounts.some((a) => a.account === current && a.connected);
      if (stillValid) return current;
      const firstConnected = accounts.find((a) => a.connected);
      return firstConnected ? firstConnected.account : current;
    });
  }, [accounts]);

  const clearPreview = () => {
    setTotals(null);
    setLog([]);
    setPreviewedFor(null);
  };

  const selectedAccountConnected = accounts.find((a) => a.account === account)?.connected ?? false;
  const canImportForReal =
    !!totals && !!previewedFor && previewedFor.account === account && previewedFor.days === days;

  const run = async (dryRun: boolean) => {
    setRunning(dryRun ? "dry" : "real"); setLog([]);
    const acc: PageResult = { scanned: 0, kept: 0, created: 0, updated: 0, touchesAdded: 0, errors: 0, skipped: {}, samples: [] };
    let pageToken: string | undefined;
    let pageCount = 0;
    try {
      do {
        // A page can 429 on the shared per-user Gmail quota (the reply-
        // watcher cron draws on the same budget). Retry the SAME pageToken
        // in place — this does not advance pageCount (the 200-page cap) or
        // touch pageToken (the repeated-token guard below), since nothing
        // about the page itself has changed, only the account's quota.
        let res: Response;
        let data: unknown;
        let rateLimitRetries = 0;
        for (;;) {
          res = await fetch("/api/admin/outreach/ingest/gmail", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account, days, pageToken, dryRun }),
          });
          data = await res.json();
          if (res.status === 429 && rateLimitRetries < MAX_PAGE_RETRIES) {
            const retryAfterMs = Math.min((data as { retryAfterMs?: number }).retryAfterMs ?? MAX_RETRY_WAIT_MS, MAX_RETRY_WAIT_MS);
            rateLimitRetries += 1;
            setLog((l) => [...l, `rate limited — waiting ${Math.round(retryAfterMs / 1000)}s, retrying the same page`]);
            await sleep(retryAfterMs);
            continue;
          }
          break;
        }
        if (!res.ok) { setLog((l) => [...l, `Error: ${(data as { error?: string }).error}`]); break; }
        const p = data as PageResult;
        acc.scanned += p.scanned; acc.kept += p.kept; acc.created += p.created; acc.updated += p.updated; acc.touchesAdded += p.touchesAdded; acc.errors += p.errors ?? 0;
        for (const [k, v] of Object.entries(p.skipped ?? {})) acc.skipped[k] = (acc.skipped[k] ?? 0) + v;
        if (acc.samples.length < 60) acc.samples.push(...(p.samples ?? []));
        setTotals({ ...acc }); setLog((l) => [...l, `page: scanned ${p.scanned}, kept ${p.kept}`]);
        pageCount += 1;
        const nextToken = p.nextPageToken;
        if (nextToken && nextToken === pageToken) {
          setLog((l) => [...l, "stopped: next page token repeated the previous one"]);
          break;
        }
        if (nextToken && pageCount >= MAX_PAGES) {
          setLog((l) => [...l, `stopped: reached the ${MAX_PAGES}-page cap`]);
          break;
        }
        pageToken = nextToken;
      } while (pageToken);
      if (dryRun) {
        setPreviewedFor({ account, days });
      } else {
        await onImported();
        setLog((l) => [...l, `done: created ${acc.created}, updated ${acc.updated}, touches ${acc.touchesAdded}`]);
        // A completed real run is a one-shot: force a fresh dry run (with
        // whatever inputs the operator picks next) before another real
        // import can fire.
        setTotals(null);
        setPreviewedFor(null);
      }
    } catch (err) {
      setLog((l) => [...l, `Error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setRunning("idle");
    }
  };

  const uploadArchive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setArchiveMsg("Uploading…");
    try {
      const res = await fetch("/api/admin/outreach/ingest/linkedin-archive", { method: "POST", body: fd });
      const data = await res.json();
      setArchiveMsg(res.ok ? JSON.stringify(data) : `Error: ${data.error}`);
      if (res.ok && fd.get("dryRun") === "0") await onImported();
    } catch (err) {
      setArchiveMsg(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">Gmail sent-folder import</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <select
            className="rounded-lg border px-2 py-1"
            value={account}
            disabled={running !== "idle"}
            onChange={(e) => { setAccount(e.target.value); clearPreview(); }}
          >
            {accounts.map((a) => <option key={a.account} value={a.account} disabled={!a.connected}>{a.account}{a.connected ? "" : " (not connected)"}</option>)}
          </select>
          <label>Days <input
            type="number"
            className="w-20 rounded-lg border px-2 py-1"
            value={days}
            min={1}
            max={3650}
            disabled={running !== "idle"}
            onChange={(e) => { setDays(Number(e.target.value)); clearPreview(); }}
          /></label>
          <button disabled={running !== "idle" || !account || !selectedAccountConnected} onClick={() => run(true)} className="rounded-lg bg-gray-100 px-3 py-1 font-medium disabled:opacity-50">Dry run</button>
          <button disabled={running !== "idle" || !canImportForReal} onClick={() => run(false)} className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white disabled:opacity-50">Import for real</button>
          {accounts.some((a) => !a.connected) && (
            <a className="text-primary-600 underline" href={`/api/admin/outreach/gmail/auth?account=${accounts.find((a) => !a.connected)?.account}`}>Connect {accounts.find((a) => !a.connected)?.account}</a>
          )}
        </div>
        {totals && (
          <div className="mt-3 text-sm">
            <div>
              scanned {totals.scanned} · kept {totals.kept} · created {totals.created} · updated {totals.updated} · touches {totals.touchesAdded}
              {" · "}
              <span className={totals.errors > 0 ? "font-medium text-red-600" : undefined}>errors {totals.errors}</span>
            </div>
            <div className="text-xs text-gray-600">skipped: {Object.entries(totals.skipped).map(([k, v]) => `${k} ${v}`).join(" · ") || "none"}</div>
            <ul className="mt-2 max-h-64 overflow-y-auto text-xs">
              {totals.samples.map((s) => <li key={s.threadId} className="border-b py-1"><span className="font-mono">{s.verdict}</span> — {s.subject || "(no subject)"} {s.participant && `· ${s.participant}`}</li>)}
            </ul>
          </div>
        )}
        {log.length > 0 && <pre className="mt-2 max-h-32 overflow-y-auto rounded bg-gray-50 p-2 text-xs">{log.join("\n")}</pre>}
        <p className="mt-2 text-xs text-gray-500">Ongoing: label any thread <code>CRM</code> in Gmail; the watcher imports it within 15 minutes.</p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 font-semibold">LinkedIn</h3>
        <p className="text-sm">Same-day: <Link href="/admin/outreach/linkedin-import" className="text-primary-600 underline">conversation import page + bookmarklet</Link>.</p>
        <form onSubmit={uploadArchive} className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label>messages.csv <input type="file" name="messages" accept=".csv" required /></label>
          <label>Connections.csv <input type="file" name="connections" accept=".csv" /></label>
          <select name="dryRun" className="rounded-lg border px-2 py-1" defaultValue="1"><option value="1">Dry run</option><option value="0">Import</option></select>
          <button className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white">Upload archive</button>
        </form>
        {archiveMsg && <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">{archiveMsg}</pre>}
      </section>
    </div>
  );
}
