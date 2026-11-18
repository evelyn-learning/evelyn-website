import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { ITEM_TYPE_LABEL, OWNER_LABEL, SECTION_TITLE, STAGES, STAGE_HELP, STAGE_LABEL, STAGE_OWNER, can, sectionTitle } from "@/lib/keystone/config";
import { getItem, holdReasons, itemChecks, neighbours, reviewQueue } from "@/lib/keystone/queries";
import { pacificTime } from "@/lib/keystone/pipeline/status";
import type { OwnerPipeline } from "@/lib/keystone/store";
import { setStageAction } from "../../actions";
import { TopBar } from "../../_components/TopBar";
import { Feed, Note, StageChip, ago } from "../../_components/ui";
import { ReviewBar } from "./ReviewBar";
import { PlayerButton } from "./PlayerButton";
import { ctxBackHref, ctxLabel, ctxQuery, isFiltered, parseCtx } from "@/lib/keystone/listctx";
import { playerUrl } from "@/lib/keystone/assets";
import { InteractionView } from "./InteractionView";
import { ChecksPanel } from "../../_components/ChecksPanel";
import { DoneNote, HeldControls, HoldControl } from "../../_components/OwnerControls";
import { OwnerKeys } from "../../_components/OwnerKeys";

export const dynamic = "force-dynamic";

const viewingOldFor = (solution: { version: number } | null, item: { version: number }) => !!solution && solution.version !== item.version;

export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }) {
  return { title: `Item ${(await params).itemId}` };
}

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser();
  const base = await ksBase();
  const { itemId } = await params;
  const sp = await searchParams;
  // For reviewer/tech, getItem returns the item as they see it: stage via visibleStage, version = the released one.
  const data = await getItem(itemId, sp.v ? Number(sp.v) : undefined, user.role);
  if (!data) notFound();
  const { item, solution, activity, versions } = data;
  const parsed = parseCtx(sp);
  // "ready" is not a list Castle Rock has; treat it as no stage filter.
  const ctx = parsed.stage === "ready" && user.role !== "evelyn" ? { ...parsed, stage: undefined } : parsed;
  const q = ctxQuery(ctx);
  const filter = { stage: ctx.stage, subject: ctx.subject, role: user.role };
  const listName = ctxLabel({ stage: ctx.stage, subject: ctx.subject });
  const [nb, queue, checks] = await Promise.all([neighbours(itemId, filter), reviewQueue(), itemChecks(itemId, user.role)]);
  // Evelyn only, decided here on the server: the hold, its reasons and the Checks panel are never rendered for
  // Castle Rock (for them `item.stage` is never "ready" and itemChecks returns null).
  const forOwner = user.role === "evelyn";
  const pipe = forOwner ? (item.pipeline as OwnerPipeline | undefined) : undefined;
  const ownerHeld = forOwner && item.stage === "ready" && pipe?.heldFor === "praveen" && !viewingOldFor(solution, item);
  const ownerGoing = forOwner && item.stage === "ready" && !pipe?.heldFor;
  const useList = isFiltered(ctx) || !!ctx.from || user.role !== "reviewer";
  // A key query is not a solution: its panel takes the solution's place, for every role.
  const keyQuery = item.stage === "key_query";
  const viewingOld = !keyQuery && !!solution && solution.version !== item.version;

  const qi = queue.indexOf(itemId);
  const nextWaiting = queue.length ? queue[(qi + 1) % queue.length] : null;
  const prevWaiting = queue.length ? queue[(qi - 1 + queue.length) % queue.length] : null;
  const inQueue = qi >= 0;

  // Sent back: say at the top what kind, whose move it is and what was asked.
  const sentBack = item.stage === "changes_requested" || item.stage === "item_data" || item.stage === "rejected";
  const ask = sentBack ? activity.find((a) => a.type === "verdict") : undefined;
  const owner = STAGE_OWNER[item.stage];

  const keyLetters = (item.key || (item.keySource === "evelyn" ? item.evelynAnswer : "")).split(",").map((s) => s.trim());
  const isChoice = item.options.length > 0;

  return (
    <>
      <TopBar user={user} />
      <main className="ks-main">
        <div className="ks-crumbs">
          {isFiltered(ctx) || ctx.from ? (
            <Link href={ctxBackHref(base, ctx)}>← {ctxLabel(ctx)}</Link>
          ) : user.role === "reviewer" ? (
            <Link href={`${base}/items?stage=in_review`}>← Waiting for review</Link>
          ) : (
            <Link href={`${base}/items`}>← All items</Link>
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
            <StageChip stage={item.stage} role={user.role} />
            {versions.length > 0 && !keyQuery && (
              <span>
                Version{" "}
                {versions
                  .slice()
                  .reverse()
                  .map((v) => (
                    <Link
                      key={v}
                      href={`${base}/item/${itemId}${v === item.version ? q : ctxQuery(ctx, { v: String(v) })}`}
                      style={{ fontWeight: solution?.version === v ? 700 : 400, marginLeft: 4 }}
                    >
                      v{v}
                    </Link>
                  ))}
              </span>
            )}
            <span>
              {nb.prev && <Link href={`${base}/item/${nb.prev}${q}`}>‹ prev</Link>}{" "}
              {nb.inList ? `${nb.index} of ${nb.total}${isFiltered(ctx) ? ` · ${listName}` : ""}` : `no longer in ${listName}`}{" "}
              {nb.next && <Link href={`${base}/item/${nb.next}${q}`}>next ›</Link>}
            </span>
            {can.edit(user.role) && (
              <Link className="ks-btn" href={`${base}/item/${itemId}/edit${q}`}>
                {item.version ? "Revise solution" : "Write solution"}
              </Link>
            )}
          </div>
        </div>

        {sentBack && (
          <div className={`ks-note ks-sentback s-${item.stage}`}>
            <b>
              {STAGE_LABEL[item.stage]}
              {owner ? ` · with ${OWNER_LABEL[owner]}` : ""}.
            </b>{" "}
            {STAGE_HELP[item.stage]}
            {ask?.body && (
              <div className="ks-ask">
                <span className="when">
                  {ask.name} · {ago(ask.createdAt)}
                </span>
                <Note body={ask.body} />
              </div>
            )}
          </div>
        )}
        {forOwner && <DoneNote done={sp.done} />}
        {ownerHeld && (
          <div className="ks-note ks-owner">
            <b>Held for you.</b> Castle Rock sees this item as Drafting until you send it.
            <ul className="ks-q-why">
              {holdReasons(pipe).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
            {pipe?.seenAt && <div className="ks-q-seen">Seen {pacificTime(new Date(pipe.seenAt))}</div>}
            <HeldControls itemId={itemId} back="item" ids />
            <OwnerKeys />
          </div>
        )}
        {ownerGoing && (
          <div className="ks-note info ks-owner">
            <b>Passed our checks.</b>{" "}
            {pipe?.releaseAt ? `Goes to Castle Rock's review by itself ${pacificTime(new Date(pipe.releaseAt))}.` : "No release time yet."}
            <HoldControl itemId={itemId} back="item" />
          </div>
        )}
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
            {(item.interactions ?? [])
              .filter((i) => i.kind !== "choice")
              .map((i, n) => (
                <InteractionView key={n} i={i} keys={item.keys ?? {}} showKey={item.keySource === "castle-rock"} />
              ))}
            {item.keySource === "castle-rock" ? (
              <div className="ks-answer">
                <b>Key:</b> {Object.keys(item.keys ?? {}).length > 1 ? "shown with each part above." : item.key}{" "}
                <span style={{ color: "var(--muted)" }}>(Castle Rock)</span>
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

          {keyQuery ? (
            <section className="ks-card ks-keyquery">
              <h3>Key query</h3>
              <p className="ks-sub">{STAGE_HELP.key_query}</p>
              <dl className="ks-kq">
                <div>
                  <dt>Our answer</dt>
                  <dd>{item.keyQuery?.ourAnswer || "–"}</dd>
                </div>
                <div>
                  <dt>Your key</dt>
                  <dd>{item.key || "–"}</dd>
                </div>
              </dl>
              <h4>Our working</h4>
              {item.keyQuery?.workingHtml ? (
                <div className="ks-prose" dangerouslySetInnerHTML={{ __html: item.keyQuery.workingHtml }} />
              ) : (
                <div className="ks-empty">No working recorded.</div>
              )}
            </section>
          ) : (
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
                      {sectionTitle(s.kind, item.course) ?? SECTION_TITLE[s.kind]}
                    </h2>
                    <div className="ks-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                  </div>
                ))
              ) : (
                <div className="ks-empty">{STAGE_HELP[item.stage]}</div>
              )}
            </section>
          )}
        </div>

        {forOwner && <ChecksPanel run={checks} itemKey={item.key || (item.keySource === "evelyn" ? "none supplied" : "–")} />}

        <section className="ks-card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h2>History</h2>
            {can.edit(user.role) && (
              <form action={setStageAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="hidden" name="itemId" value={itemId} />
                <select name="stage" defaultValue={item.stage} className="ks-btn" style={{ fontWeight: 400 }}>
                  {STAGES.filter((s) => s !== "key_query").map((s) => (
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
        canReview={can.review(user.role) && !viewingOld}
        hasSolution={!!item.version}
        stage={item.stage}
        ctx={q}
        position={
          useList
            ? nb.inList
              ? `${nb.index} of ${nb.total}${isFiltered(ctx) ? ` ${listName}` : ""}`
              : `${nb.total} ${listName}`
            : inQueue
              ? `${qi + 1} of ${queue.length} waiting`
              : queue.length
                ? `${queue.length} waiting`
                : "Nothing waiting"
        }
        nextHref={
          useList
            ? nb.next
              ? `${base}/item/${nb.next}${q}`
              : null
            : nextWaiting && nextWaiting !== itemId
              ? `${base}/item/${nextWaiting}`
              : null
        }
        prevHref={
          useList
            ? nb.prev
              ? `${base}/item/${nb.prev}${q}`
              : null
            : prevWaiting && prevWaiting !== itemId
              ? `${base}/item/${prevWaiting}`
              : null
        }
      />
    </>
  );
}
