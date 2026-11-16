import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, SECTION_TITLE, STAGES, STAGE_HELP, STAGE_LABEL, can } from "@/lib/keystone/config";
import { getItem, neighbours, reviewQueue } from "@/lib/keystone/queries";
import { setStageAction } from "../../actions";
import { TopBar } from "../../_components/TopBar";
import { Feed, StageChip } from "../../_components/ui";
import { ReviewBar } from "./ReviewBar";
import { PlayerButton } from "./PlayerButton";
import { playerUrl } from "@/lib/keystone/assets";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }) {
  return { title: `Item ${(await params).itemId}` };
}

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<{ v?: string; from?: string }>;
}) {
  const user = await requireUser();
  const base = await ksBase();
  const { itemId } = await params;
  const sp = await searchParams;
  const data = await getItem(itemId, sp.v ? Number(sp.v) : undefined);
  if (!data) notFound();
  const { item, solution, activity, versions } = data;
  const [nb, queue] = await Promise.all([neighbours(itemId), reviewQueue()]);
  const viewingOld = !!solution && solution.version !== item.version;

  const qi = queue.indexOf(itemId);
  const nextWaiting = queue.length ? queue[(qi + 1) % queue.length] : null;
  const prevWaiting = queue.length ? queue[(qi - 1 + queue.length) % queue.length] : null;
  const inQueue = qi >= 0;

  const keyLetters = (item.key || (item.keySource === "evelyn" ? item.evelynAnswer : "")).split(",").map((s) => s.trim());
  const isChoice = item.options.length > 0;

  return (
    <>
      <TopBar user={user} />
      <main className="ks-main">
        <div className="ks-crumbs">
          <Link href={base || "/"}>← Overview</Link> · <Link href={`${base}/items`}>All items</Link>
          {user.role === "reviewer" && queue.length > 0 && (
            <>
              {" "}
              · <Link href={`${base}/items?stage=in_review`}>Waiting for review ({queue.length})</Link>
            </>
          )}
        </div>
        <div className="ks-item-head">
          <div>
            <h1>
              Item {item.itemId} {item.showcase && <span className="ks-chip">Showcase</span>}
            </h1>
            <div className="ks-meta">
              <span>{item.subject}</span>·<span>{item.course}</span>·<span>{ITEM_TYPE_LABEL[item.itemType] ?? item.itemType}</span>
              {item.topic && (
                <>
                  ·<span>{item.topic}</span>
                </>
              )}
            </div>
          </div>
          <div className="ks-meta">
            <StageChip stage={item.stage} />
            {versions.length > 0 && (
              <span>
                Version{" "}
                {versions
                  .slice()
                  .reverse()
                  .map((v) => (
                    <Link
                      key={v}
                      href={`${base}/item/${itemId}${v === item.version ? "" : `?v=${v}`}`}
                      style={{ fontWeight: solution?.version === v ? 700 : 400, marginLeft: 4 }}
                    >
                      v{v}
                    </Link>
                  ))}
              </span>
            )}
            <span>
              {nb.prev && <Link href={`${base}/item/${nb.prev}`}>‹ prev</Link>} {nb.index} of {nb.total}{" "}
              {nb.next && <Link href={`${base}/item/${nb.next}`}>next ›</Link>}
            </span>
            {can.edit(user.role) && (
              <Link className="ks-btn" href={`${base}/item/${itemId}/edit`}>
                {item.version ? "Revise solution" : "Write solution"}
              </Link>
            )}
          </div>
        </div>

        {item.reviewNote && (
          <div className="ks-note">
            <b>Note from Evelyn:</b> {item.reviewNote}
          </div>
        )}
        {item.priorStatus === "approved" && item.version === 1 && (
          <div className="ks-note info">
            Castle Rock approved this solution on 28 October 2026 in the earlier layout. This is the same working, re-cut into the five sections.
          </div>
        )}
        {viewingOld && (
          <div className="ks-note">
            You are looking at version {solution!.version}. <Link href={`${base}/item/${itemId}`}>Go to the current version (v{item.version}) →</Link>
          </div>
        )}

        <div className="ks-split">
          <section className="ks-card ks-question">
            <h3>Question</h3>
            <div className="ks-prose" dangerouslySetInnerHTML={{ __html: item.questionHtml }} />
            {isChoice && (
              <ol className="ks-opts">
                {item.options.map((o) => (
                  <li key={o.label} className={keyLetters.includes(o.label) ? "key" : ""}>
                    <b>{o.label}</b>
                    <span className="ks-prose" dangerouslySetInnerHTML={{ __html: o.html }} />
                  </li>
                ))}
              </ol>
            )}
            {item.keySource === "castle-rock" ? (
              <div className="ks-answer">
                <b>Key:</b> {item.key} <span style={{ color: "var(--muted)" }}>(Castle Rock)</span>
                {item.evelynAnswer && item.evelynAnswer !== item.key && (
                  <div style={{ color: "var(--bad)" }}>Our solution reaches {item.evelynAnswer}, which differs from the key.</div>
                )}
              </div>
            ) : (
              <div className="ks-answer unconfirmed">
                {item.evelynAnswer ? (
                  <>
                    <b>Our answer:</b> {item.evelynAnswer.replace(/\.\s*$/, "")}. No key came with this item, so please confirm it.
                  </>
                ) : (
                  <>
                    <b>No answer yet.</b> {item.version ? "The item as exported cannot be answered; see the note above." : "Solution not written yet."}
                  </>
                )}
              </div>
            )}
            {item.castleRockSolutionHtml && (
              <details className="ks-crsol">
                <summary>Castle Rock&apos;s existing solution (from the export)</summary>
                <div className="ks-prose" dangerouslySetInnerHTML={{ __html: item.castleRockSolutionHtml }} />
              </details>
            )}
          </section>

          <section className="ks-card">
            <div className="ks-sol-head">
              <h3>Evelyn&apos;s solution{solution ? ` · v${solution.version}` : ""}</h3>
              {item.player && (
                <PlayerButton
                  src={playerUrl(item.itemId, item.player.entry)}
                  itemId={item.itemId}
                  height={item.player.height || 620}
                  voice={item.player.voice}
                  note={item.player.note}
                />
              )}
            </div>
            {solution ? (
              solution.sections.map((s, i) => (
                <div key={s.kind} className="ks-section">
                  <h2>
                    <span className="n">{i + 1}</span>
                    {SECTION_TITLE[s.kind]}
                  </h2>
                  <div className="ks-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                </div>
              ))
            ) : (
              <div className="ks-empty">{STAGE_HELP[item.stage]}</div>
            )}
          </section>
        </div>

        <section className="ks-card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h2>History</h2>
            {can.edit(user.role) && (
              <form action={setStageAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="hidden" name="itemId" value={itemId} />
                <select name="stage" defaultValue={item.stage} className="ks-btn" style={{ fontWeight: 400 }}>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {STAGE_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button className="ks-btn">Set status</button>
              </form>
            )}
          </div>
          <Feed rows={activity} base={base} />
        </section>
      </main>
      <ReviewBar
        itemId={itemId}
        base={base}
        canReview={can.review(user.role) && !!item.version && !viewingOld}
        stage={item.stage}
        position={inQueue ? `${qi + 1} of ${queue.length} waiting` : queue.length ? `${queue.length} waiting` : "Nothing waiting"}
        nextHref={nextWaiting && nextWaiting !== itemId ? `${base}/item/${nextWaiting}` : nb.next ? `${base}/item/${nb.next}` : null}
        prevHref={prevWaiting && prevWaiting !== itemId ? `${base}/item/${prevWaiting}` : nb.prev ? `${base}/item/${nb.prev}` : null}
      />
    </>
  );
}
