"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/outreach/enums";

interface Preview { participant: string; messages: { from: string; at: string; body: string; outbound: boolean }[] }

// The bookmarklet runs on linkedin.com and cannot POST here (cross-site
// cookies). It opens this page with the payload in the URL fragment, which
// never leaves the browser, and this page — same origin, admin session —
// does the POST.
//
// Built as a function of the origin (rather than a module-level constant
// evaluated with `window.location.origin`) so the server-rendered markup
// never differs from what the client renders on hydration — the origin is
// only known once this component has mounted in the browser.
function buildBookmarklet(origin: string): string {
  return `javascript:(function(){var l=document.querySelector('.msg-s-message-list-content')||document.querySelector('.msg-s-message-list')||document.body;var a=document.querySelector('a.msg-thread__link-to-profile')||document.querySelector('.msg-entity-lockup__entity-title a');var n=(document.querySelector('.msg-entity-lockup__entity-title')||{}).innerText||'';var p={text:l.innerText,profileUrl:a?a.href:'',name:n.trim()};var s=btoa(unescape(encodeURIComponent(JSON.stringify(p)))).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');window.open('${origin}/admin/outreach/linkedin-import#'+s,'_blank');})();`;
}

function decodeHash(): { text: string; profileUrl: string; name: string } | null {
  try {
    const h = window.location.hash.slice(1);
    if (!h) return null;
    const b64 = h.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch { return null; }
}

export default function LinkedinImport() {
  const [text, setText] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState<string>("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const p = decodeHash();
    if (p) { setText(p.text); setProfileUrl(p.profileUrl); setName(p.name); window.history.replaceState({}, "", window.location.pathname); }
  }, []);

  const post = async (dryRun: boolean) => {
    setBusy(true); setResult(null);
    try {
      const res = await fetch("/api/admin/outreach/ingest/linkedin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text, profileUrl: profileUrl || undefined, name: name || undefined, company: company || undefined, product: product || undefined, dryRun,
          tzOffsetMinutes: new Date().getTimezoneOffset(), now: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "Failed"); return; }
      setPreview({ participant: data.participant, messages: data.messages });
      if (!dryRun) setResult(`${data.created ? "Created" : "Updated"} lead ${data.leadId} (+${data.added} touches)`);
    } finally { setBusy(false); }
  };

  const bookmarklet = useMemo(() => (origin ? buildBookmarklet(origin) : ""), [origin]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">LinkedIn conversation import</h1>
        <Link href="/admin/outreach" className="text-sm text-primary-600">← Outreach console</Link>
      </div>
      <p className="text-sm text-gray-600">
        Drag this to your bookmarks bar, open a LinkedIn conversation, click it:&nbsp;
        {bookmarklet ? (
          <a href={bookmarklet} className="rounded bg-gray-900 px-2 py-1 text-xs font-semibold text-white" onClick={(e) => e.preventDefault()}>Evelyn CRM ⇪</a>
        ) : (
          <span className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-500">loading…</span>
        )}
        &nbsp;Or paste the conversation below.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Profile URL" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} />
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Name (auto-detected if blank)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <select className="rounded-lg border px-3 py-2 text-sm" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">Product (optional)</option>
          {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <textarea className="h-64 w-full rounded-lg border p-3 font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the LinkedIn conversation here" />
      <div className="flex gap-2">
        <button disabled={busy || !text} onClick={() => post(true)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium disabled:opacity-50">Preview</button>
        <button disabled={busy || !preview} onClick={() => post(false)} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Import</button>
        {result && <span className="self-center text-sm text-gray-700">{result}</span>}
      </div>
      {preview && (
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="mb-2 text-sm font-semibold">{preview.participant} · {preview.messages.length} messages</div>
          <ul className="space-y-2">
            {preview.messages.map((m, i) => (
              <li key={i} className={`rounded-lg p-3 text-sm ${m.outbound ? "bg-blue-50" : "bg-gray-50"}`}>
                <div className="mb-1 text-xs text-gray-500">{m.outbound ? "You" : m.from} · {new Date(m.at).toLocaleString()}</div>
                <div className="whitespace-pre-wrap">{m.body}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
