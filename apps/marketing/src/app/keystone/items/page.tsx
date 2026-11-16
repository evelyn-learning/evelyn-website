import Link from "next/link";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { STAGES, STAGE_LABEL, SUBJECTS, type Stage } from "@/lib/keystone/config";
import { latestVerdicts, listItems, stageCounts } from "@/lib/keystone/queries";
import { TopBar } from "../_components/TopBar";
import { ItemsTable } from "../_components/ui";
import { RememberList } from "../_components/BackNav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const metadata = { title: "All items" };

export default async function ItemsPage({ searchParams }: { searchParams: Promise<{ stage?: string; subject?: string }> }) {
  const user = await requireUser();
  const base = await ksBase();
  const sp = await searchParams;
  const stage = STAGES.includes(sp.stage as Stage) ? (sp.stage as Stage) : undefined;
  const subject = SUBJECTS.includes(sp.subject as (typeof SUBJECTS)[number]) ? sp.subject : undefined;
  const [rows, counts] = await Promise.all([listItems({ stage, subject }), stageCounts()]);
  const verdicts = await latestVerdicts(rows.map((r) => r.itemId));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const href = (p: { stage?: string; subject?: string }) => {
    const q = new URLSearchParams();
    if (p.stage) q.set("stage", p.stage);
    if (p.subject) q.set("subject", p.subject);
    const s = q.toString();
    return `${base}/items${s ? `?${s}` : ""}`;
  };
  return (
    <>
      <TopBar user={user} on="items" />
      <Suspense>
        <RememberList label={[stage ? STAGE_LABEL[stage] : subject ? "" : "All items", subject].filter(Boolean).join(" · ")} />
      </Suspense>
      <main className="ks-main">
        <h1>All items</h1>
        <p className="ks-sub">{rows.length} shown of {total}</p>
        <div className="ks-tabs">
          <Link href={href({ subject })} className={!stage ? "on" : ""}>All · {total}</Link>
          {STAGES.map((s) => (
            <Link key={s} href={href({ stage: s, subject })} className={stage === s ? "on" : ""}>
              {STAGE_LABEL[s]} · {counts[s]}
            </Link>
          ))}
        </div>
        <div className="ks-tabs">
          <Link href={href({ stage })} className={!subject ? "on" : ""}>All subjects</Link>
          {SUBJECTS.map((s) => (
            <Link key={s} href={href({ stage, subject: s })} className={subject === s ? "on" : ""}>
              {s}
            </Link>
          ))}
        </div>
        <section className="ks-card">
          <ItemsTable rows={rows} base={base} verdicts={verdicts} />
        </section>
      </main>
    </>
  );
}
