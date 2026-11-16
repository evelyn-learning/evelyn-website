import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase, ksHref } from "@/lib/keystone/paths";
import { STAGES, STAGE_LABEL, SUBJECTS, type Stage } from "@/lib/keystone/config";
import { countItems, itemExists, latestVerdicts, listItems, stageCounts } from "@/lib/keystone/queries";
import { TopBar } from "../_components/TopBar";
import { ItemsTable } from "../_components/ui";
import { ctxQuery } from "@/lib/keystone/listctx";

export const dynamic = "force-dynamic";
export const metadata = { title: "All items" };

const PAGE_SIZE = 50;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; subject?: string; q?: string; page?: string }>;
}) {
  const user = await requireUser();
  const base = await ksBase();
  const sp = await searchParams;
  const stage = STAGES.includes(sp.stage as Stage) ? (sp.stage as Stage) : undefined;
  const subject = SUBJECTS.includes(sp.subject as (typeof SUBJECTS)[number]) ? sp.subject : undefined;
  const search = (sp.q ?? "").trim().slice(0, 80);

  // An exact item number goes straight to the item.
  if (/^\d+$/.test(search) && (await itemExists(search))) redirect(await ksHref(`/item/${search}`));

  const filter = { stage, subject, search: search || undefined };
  const [matched, counts] = await Promise.all([countItems(filter), stageCounts()]);
  const pages = Math.max(1, Math.ceil(matched / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const rows = await listItems(filter, { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE });
  const verdicts = await latestVerdicts(rows.map((r) => r.itemId));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const href = (p: { stage?: string; subject?: string; q?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (p.stage) q.set("stage", p.stage);
    if (p.subject) q.set("subject", p.subject);
    if (p.q) q.set("q", p.q);
    if (p.page && p.page > 1) q.set("page", String(p.page));
    const s = q.toString();
    return `${base}/items${s ? `?${s}` : ""}`;
  };
  const from = matched ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(matched, page * PAGE_SIZE);

  // Compact page list: 1 … 4 5 [6] 7 8 … 20
  const nums: (number | "…")[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= 2) nums.push(n);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  const pager =
    pages > 1 ? (
      <nav className="ks-pager" aria-label="Pages">
        {page > 1 ? <Link href={href({ stage, subject, q: search, page: page - 1 })}>‹ Previous</Link> : <span className="off">‹ Previous</span>}
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} className="gap">…</span>
          ) : n === page ? (
            <span key={n} className="cur" aria-current="page">{n}</span>
          ) : (
            <Link key={n} href={href({ stage, subject, q: search, page: n })}>{n}</Link>
          ),
        )}
        {page < pages ? <Link href={href({ stage, subject, q: search, page: page + 1 })}>Next ›</Link> : <span className="off">Next ›</span>}
      </nav>
    ) : null;

  return (
    <>
      <TopBar user={user} on="items" />
      <main className="ks-main">
        <div className="ks-hero" style={{ marginBottom: 6 }}>
          <div>
            <h1>All items</h1>
            <p className="ks-sub" style={{ margin: 0 }}>
              {matched} shown of {total}
              {matched > PAGE_SIZE ? ` · ${from}–${to} on this page` : ""}
              {search ? ` · matching “${search}”` : ""}
            </p>
          </div>
          <form method="get" action={`${base}/items`} className="ks-search" role="search">
            {stage && <input type="hidden" name="stage" value={stage} />}
            {subject && <input type="hidden" name="subject" value={subject} />}
            <input type="search" name="q" defaultValue={search} placeholder="Item number or topic" aria-label="Search items" />
            <button className="ks-btn">Search</button>
            {search && <Link href={href({ stage, subject })}>Clear</Link>}
          </form>
        </div>
        <div className="ks-tabs">
          <Link href={href({ subject, q: search })} className={!stage ? "on" : ""}>All · {total}</Link>
          {STAGES.map((s) => (
            <Link key={s} href={href({ stage: s, subject, q: search })} className={stage === s ? "on" : ""}>
              {STAGE_LABEL[s]} · {counts[s]}
            </Link>
          ))}
        </div>
        <div className="ks-tabs">
          <Link href={href({ stage, q: search })} className={!subject ? "on" : ""}>All subjects</Link>
          {SUBJECTS.map((s) => (
            <Link key={s} href={href({ stage, subject: s, q: search })} className={subject === s ? "on" : ""}>
              {s}
            </Link>
          ))}
        </div>
        <section className="ks-card">
          {pager}
          <ItemsTable rows={rows} base={base} verdicts={verdicts} linkQuery={ctxQuery({ stage, subject })} />
          {pager}
        </section>
      </main>
    </>
  );
}
