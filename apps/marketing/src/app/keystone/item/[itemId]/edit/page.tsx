import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { SECTIONS, SECTION_TITLE, can } from "@/lib/keystone/config";
import { getItem } from "@/lib/keystone/queries";
import { saveSolutionAction } from "../../../actions";
import { TopBar } from "../../../_components/TopBar";
import { Feed } from "../../../_components/ui";
import { ActionForm } from "../../../_components/ActionForm";
import { ctxQuery, parseCtx } from "@/lib/keystone/listctx";

export const dynamic = "force-dynamic";

const HINT: Record<string, string> = {
  short: "The answer, restating only what the question needs. MC: name the letter. No plan, no method.",
  diploma: "What a strong student writes on the exam, in time. Plan first for multi-part items. Final-answer sentence.",
  extended: "Only when there is teaching to add. Leave empty to omit.",
  alternate: "Only for a genuinely different method. Leave empty to omit.",
  errors: "0–2 bullets: the slip and how to avoid it. Never tour the wrong options.",
};

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser(can.edit);
  const base = await ksBase();
  const { itemId } = await params;
  const q = ctxQuery(parseCtx(await searchParams));
  const data = await getItem(itemId);
  if (!data) notFound();
  const { item, solution, activity } = data;
  const md = (k: string) => solution?.sections.find((s) => s.kind === k)?.md ?? "";
  const asks = activity.filter((a) => a.type === "verdict" || a.type === "comment");

  return (
    <>
      <TopBar user={user} />
      <main className="ks-main">
        <p className="ks-sub">
          <Link href={`${base}/item/${itemId}${q}`}>← Item {itemId}</Link>
        </p>
        <h1>{item.version ? `Revise solution (now v${item.version})` : "Write solution"}</h1>
        <p className="ks-sub">
          Markdown with LaTeX: <code>$…$</code> inline, <code>$$…$$</code> display. Figures: <code>```figure alt=&quot;…&quot;</code> with inline SVG ≤ 240 px.
          Saving creates a new version; Castle Rock always sees the latest.
        </p>
        <div className="ks-split">
          <section className="ks-card ks-question">
            <h3>Question</h3>
            <div className="ks-prose" dangerouslySetInnerHTML={{ __html: item.questionHtml }} />
            {item.options.length > 0 && (
              <ol className="ks-opts">
                {item.options.map((o) => (
                  <li key={o.label} className={item.key.split(",").includes(o.label) ? "key" : ""}>
                    <b>{o.label}</b>
                    <span className="ks-prose" dangerouslySetInnerHTML={{ __html: o.html }} />
                  </li>
                ))}
              </ol>
            )}
            <div className="ks-answer">
              <b>Key:</b> {item.key || "none supplied"}
            </div>
            {item.castleRockSolutionHtml && (
              <details className="ks-crsol">
                <summary>Castle Rock&apos;s existing solution</summary>
                <div className="ks-prose" dangerouslySetInnerHTML={{ __html: item.castleRockSolutionHtml }} />
              </details>
            )}
            <h3 style={{ marginTop: 16 }}>What Castle Rock said</h3>
            <Feed rows={asks} base={base} empty="No comments yet." />
          </section>
          <ActionForm action={saveSolutionAction} className="ks-card ks-form">
            <input type="hidden" name="itemId" value={itemId} />
            <input type="hidden" name="ctx" value={q} />
            <div className="ks-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label htmlFor="evelynAnswer">Our answer</label>
                <input id="evelynAnswer" name="evelynAnswer" type="text" defaultValue={item.evelynAnswer} />
              </div>
              <div>
                <label htmlFor="topic">Topic</label>
                <input id="topic" name="topic" type="text" defaultValue={item.topic} />
              </div>
            </div>
            <label htmlFor="reviewNote">Note for the reviewer (shown at the top of the item)</label>
            <input id="reviewNote" name="reviewNote" type="text" defaultValue={item.reviewNote ?? ""} />
            {SECTIONS.map((k) => (
              <div key={k}>
                <label htmlFor={`s_${k}`}>
                  {SECTION_TITLE[k]} <span style={{ fontWeight: 400, color: "var(--muted)" }}>— {HINT[k]}</span>
                </label>
                <textarea id={`s_${k}`} name={`s_${k}`} defaultValue={md(k)} rows={k === "short" ? 3 : k === "errors" ? 4 : 10} />
              </div>
            ))}
            <label htmlFor="note">What changed (shown in the history)</label>
            <input id="note" name="note" type="text" placeholder="e.g. Shortened the Diploma answer as asked" />
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button className="ks-btn primary" name="intent" value="submit">
                Save and send for review
              </button>
              <button className="ks-btn" name="intent" value="draft">
                Save as draft
              </button>
              <Link className="ks-btn" href={`${base}/item/${itemId}${q}`} style={{ marginLeft: "auto" }}>
                Cancel
              </Link>
            </div>
          </ActionForm>
        </div>
      </main>
    </>
  );
}
