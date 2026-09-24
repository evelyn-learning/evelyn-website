"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Trash2, Wand2 } from "lucide-react";

interface GmailStatus { accounts?: { account: string; connected: boolean; connectedAt: string | null }[] }
interface PageResult { nextPageToken?: string; scanned: number; kept: number; created: number; updated: number; suppressed: number; touchesAdded: number; errors: number; skipped: Record<string, number>; samples: { threadId: string; subject: string; participant: string; verdict: string }[] }
interface DeletedLead { _id: string; company: string; deletedAt: string; emails: string[] }
interface FixResult { matched: number; updated: number; dryRun: boolean; remaining: number; samples: { id: string; from: string; to: string }[] }

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
  const [deleted, setDeleted] = useState<DeletedLead[] | null>(null);
  const [deletedBusy, setDeletedBusy] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState<string | null>(null);
  const [fix, setFix] = useState<FixResult | null>(null);
  const [fixBusy, setFixBusy] = useState(false);
  const [fixMsg, setFixMsg] = useState<string | null>(null);

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
    const acc: PageResult = { scanned: 0, kept: 0, created: 0, updated: 0, suppressed: 0, touchesAdded: 0, errors: 0, skipped: {}, samples: [] };
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
        acc.scanned += p.scanned; acc.kept += p.kept; acc.created += p.created; acc.updated += p.updated; acc.suppressed += p.suppressed ?? 0; acc.touchesAdded += p.touchesAdded; acc.errors += p.errors ?? 0;
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

  const loadDeleted = async () => {
    setDeletedBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/deleted");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to load deleted leads"); return; }
      setDeleted(data.deleted ?? []);
    } catch (err) {
      setDeletedMsg(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletedBusy(false);
    }
  };

  const restore = async (suppressionId: string) => {
    setDeletedBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/leads/restore", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suppressionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to restore lead"); return; }
      setDeletedMsg(
        data.alreadyExisted
          ? "Lead already existed — tombstone removed and linked to the existing lead."
          : "Lead restored."
      );
      // Reload from the server rather than trusting local state, so the
      // deleted list reflects the source of truth, then refresh the
      // console's lead list.
      await loadDeleted();
      await onImported();
    } catch (err) {
      setDeletedMsg(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletedBusy(false);
    }
  };

  const fixUnknown = async (dryRun: boolean) => {
    setFixBusy(true);
    try {
      const res = await fetch("/api/admin/outreach/maintenance/fix-unknown-companies", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Failed to fix company names"); return; }
      setFix(data as FixResult);
      if (!dryRun) await onImported();
    } catch (err) {
      setFixMsg(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setFixBusy(false);
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
              scanned {totals.scanned} · kept {totals.kept} · created {totals.created} · updated {totals.updated} · suppressed {totals.suppressed} · touches {totals.touchesAdded}
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

      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 flex items-center gap-2 font-semibold"><Trash2 className="h-4 w-4" /> Deleted leads</h3>
        <p className="text-xs text-gray-500">
          Deleted leads are suppressed: an importer reports them under <code>suppressed</code> instead of recreating them.
          Restoring one brings back its touches and makes it importable again.
        </p>
        <button
          type="button"
          onClick={() => void loadDeleted()}
          disabled={deletedBusy}
          className="mt-2 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium disabled:opacity-50"
        >
          {deletedBusy ? "Working…" : deleted ? "Reload" : "Show deleted leads"}
        </button>
        {deletedMsg && (
          <p className={`mt-2 text-xs ${deletedMsg.startsWith("Error:") ? "font-medium text-red-600" : "text-gray-600"}`}>{deletedMsg}</p>
        )}
        {deleted && (
          deleted.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">Nothing has been deleted.</p>
          ) : (
            <ul className="mt-2 max-h-64 divide-y overflow-y-auto text-sm">
              {deleted.map((d) => (
                <li key={d._id} className="flex items-center gap-2 py-1.5">
                  <span className="font-medium text-gray-900">{d.company}</span>
                  <span className="truncate text-xs text-gray-500">{d.emails.join(", ")}</span>
                  <span className="ml-auto shrink-0 text-xs text-gray-400">{new Date(d.deletedAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => void restore(d._id)}
                    disabled={deletedBusy}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 flex items-center gap-2 font-semibold"><Wand2 className="h-4 w-4" /> Fix &ldquo;Unknown&rdquo; companies</h3>
        <p className="text-xs text-gray-500">
          Applies the current naming rule (organisation domain → person&rsquo;s name → email address) to leads whose company is
          <code>Unknown</code> or empty. Dry run first.
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => void fixUnknown(true)}
            disabled={fixBusy}
            className="rounded-lg bg-gray-100 px-3 py-1 font-medium disabled:opacity-50"
          >
            Dry run
          </button>
          <button
            type="button"
            onClick={() => void fixUnknown(false)}
            disabled={fixBusy || !fix || !fix.dryRun || fix.updated === 0}
            className="rounded-lg bg-primary-600 px-3 py-1 font-medium text-white disabled:opacity-50"
          >
            Apply
          </button>
          {fix && (
            <span className="text-xs text-gray-600">
              matched {fix.matched} · {fix.dryRun ? "would update" : "updated"} {fix.updated}
              {fix.remaining > 0 && ` · ${fix.remaining} more beyond this batch — run again`}
            </span>
          )}
        </div>
        {fixMsg && (
          <p className={`mt-2 text-xs ${fixMsg.startsWith("Error:") ? "font-medium text-red-600" : "text-gray-600"}`}>{fixMsg}</p>
        )}
        {fix && fix.samples.length > 0 && (
          <ul className="mt-2 max-h-48 overflow-y-auto text-xs text-gray-600">
            {fix.samples.map((s) => (
              <li key={s.id} className="border-b py-1"><span className="font-mono">{s.from || "(empty)"}</span> → {s.to}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
