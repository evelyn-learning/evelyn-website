import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { DIPLOMA_COURSES, ITEM_TYPE_LABEL, LEVEL_SOURCE_LABEL, OWNER_LABEL, SECTION_TITLE, STAGES, STAGE_HELP, STAGE_LABEL, STAGE_OWNER, can, releasedVersionOf, sectionTitle } from "@/lib/keystone/config";
import { getItem, holdReasons, itemChecks, neighbours, reviewQueue } from "@/lib/keystone/queries";
import { pacificTime } from "@/lib/keystone/pipeline/status";
import { LEVEL_OPEN_STAGES, type OwnerPipeline } from "@/lib/keystone/store";
import { askForAnimationAction, setLevelAction, setStageAction } from "../../actions";
import { ActionForm } from "../../_components/ActionForm";
import { NO_ANIMATION_DEFAULT } from "@/lib/keystone/animreview/store";
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
import { getReview, type Flag } from "@/lib/keystone/animreview/store";
import { animatedUrl, flagSide, parseVersion, raisedBy } from "@/lib/keystone/animreview/pure";
import { AnimReview, type FlagView } from "../../animated/[itemId]/AnimReview";

export const dynamic = "force-dynamic";

const viewingOldFor = (solution: { version: number } | null, item: { version: number }) => !!solution && solution.version !== item.version;

// `owner`: the owner's labels say whose flag it is ("Name · Castle Rock"); Castle Rock just see their colleague's name.
const flagView = (f: Flag, owner: boolean): FlagView => ({
  id: f.id,
  version: f.version,
  step: f.step ?? null,
  line: f.line ?? null,
  timeMs: f.timeMs ?? null,
  comment: f.comment,
  spoken: !!f.spoken,
  shots: f.shots ?? [],
  status: f.status,
  fixedInVersion: f.fixedInVersion ?? null,
  reply: f.reply ?? null,
  reopenOf: f.reopenOf ?? null,
  createdBy: f.createdBy,
  createdAt: new Date(f.createdAt).toISOString(),
  by: owner ? raisedBy(f) : f.createdByName || f.createdBy,
  castleRock: flagSide(f.createdByRole) === "castle-rock",
  pending: !!f.pending,
});

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
  // The animated version with its flag panel (flag, speak, snap), on the same page as the written solution.
  // The owner reviews any version (?av=). Castle Rock get the released version only, with Castle Rock's flags
  // only: getReview decides that from the role and ignores the version for them, so ?av= is not even passed.
  const anim = await getReview(itemId, forOwner && sp.av !== undefined ? parseVersion(sp.av) : null, user.role);
  const pipe = forOwner ? (item.pipeline as OwnerPipeline | undefined) : undefined;
  // Something to send: the current version's solution row exists and is unreleased (the actions check this again).
  const sendable = !!solution && solution.version === item.version && !solution.releasedAt && releasedVersionOf(item) < item.version;
  const ownerHeld = forOwner && item.stage === "ready" && pipe?.heldFor === "praveen" && sendable && !viewingOldFor(solution, item);
  const ownerGoing = forOwner && item.stage === "ready" && !pipe?.heldFor && sendable;
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
              <span>{item.subject}</span>·
              <span title={item.levelWhy || undefined}>
                {/* The file's own course data is not a level we write to: shown only once a level is set. */}
                {item.courseSource === "metadata" ? "Level not set yet" : <>Level: <b>{item.course || "not set yet"}</b></>}
                {item.courseSource && LEVEL_SOURCE_LABEL[item.courseSource] && <span style={{ fontSize: 12 }}> ({LEVEL_SOURCE_LABEL[item.courseSource]})</span>}
              </span>
              ·<span>{ITEM_TYPE_LABEL[item.itemType] ?? item.itemType}</span>
              {item.topic && (
                <>
                  ·<span>{item.topic}</span>
                </>
              )}
            </div>
          </div>
          <div className="ks-meta ks-head-tools">
            {/* Walk links first and at fixed widths, so they stay under the pointer from one item to the next. */}
            <span className="ks-walk">
              {nb.prev ? <Link className="ks-step" href={`${base}/item/${nb.prev}${q}`}>‹ Prev</Link> : <span className="ks-step off" aria-disabled="true">‹ Prev</span>}
              {nb.next ? <Link className="ks-step" href={`${base}/item/${nb.next}${q}`}>Next ›</Link> : <span className="ks-step off" aria-disabled="true">Next ›</span>}
              <span className="ks-walk-at">{nb.inList ? `${nb.index} of ${nb.total}${isFiltered(ctx) ? ` · ${listName}` : ""}` : `no longer in ${listName}`}</span>
            </span>
            {can.edit(user.role) && (
              <Link className="ks-btn" href={`${base}/item/${itemId}/edit${q}`}>
                {item.version ? "Revise solution" : "Write solution"}
              </Link>
            )}
            {can.review(user.role) && LEVEL_OPEN_STAGES.includes(item.stage) && (
              <details className="ks-level">
                <summary>Change level</summary>
                <ActionForm action={setLevelAction} className="ks-level-form">
                  <input type="hidden" name="itemId" value={item.itemId} />
                  <label>
                    Level the solution should be written to
                    <input name="level" list="ks-levels" defaultValue={item.courseSource === "metadata" ? "" : item.course} maxLength={40} required placeholder="Math 30-1" />
                  </label>
                  <datalist id="ks-levels">
                    {DIPLOMA_COURSES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <label>
                    Note (optional)
                    <input name="note" maxLength={300} />
                  </label>
                  {item.levelWhy && <p className="ks-level-why">Why this level: {item.levelWhy}</p>}
                  {item.stage === "in_review" && <p className="ks-level-why">The solution will come back to you rewritten to the new level.</p>}
                  <button className="ks-btn" type="submit">Save level</button>
                </ActionForm>
              </details>
            )}
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
                      className={`ks-ver${solution?.version === v ? " on" : ""}`}
                    >
                      v{v}
                    </Link>
                  ))}
              </span>
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
            <HeldControls itemId={itemId} back="item" ctx={q} ids />
            <OwnerKeys />
          </div>
        )}
        {ownerGoing && (
          <div className="ks-note info ks-owner">
            <b>Passed our checks.</b>{" "}
            {pipe?.releaseAt ? `Goes to Castle Rock's review by itself ${pacificTime(new Date(pipe.releaseAt))}.` : "No release time yet."}
            <HoldControl itemId={itemId} back="item" ctx={q} />
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
            {(item.sourceNotes ?? []).map((n) => (
              <div key={n} className="ks-note info">{n}</div>
            ))}
            {(item.sourceFindings ?? []).length > 0 && (
              <div className="ks-note">
                <b>The QTI export differs from Castle Rock&apos;s source file for this item:</b>
                <ul style={{ margin: "4px 0 0 18px" }}>
                  {item.sourceFindings!.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
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
              {!item.player && item.animate?.route === "none" && solution && (
                <form action={askForAnimationAction} className="ks-note info ks-noanim">
                  <input type="hidden" name="itemId" value={itemId} />
                  <b>No animated version.</b> {item.animate.reason || NO_ANIMATION_DEFAULT} If you would like one,{" "}
                  <button className="ks-linkbtn">ask for an animation</button>.
                </form>
              )}
              {!item.player && item.animate?.askedBy && item.animate.route !== "none" && (
                <div className="ks-note info ks-noanim">An animated version has been asked for and is on Evelyn&apos;s list.</div>
              )}
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

        {anim && (
          <section className="ks-card ks-anim" id="animated" style={{ marginTop: 16 }}>
            <AnimReview
              key={`${anim.animation.itemId}-${anim.animation.version}`}
              embedded
              viewer={anim.viewer}
              base={base}
              me={user.username}
              itemId={anim.animation.itemId}
              version={anim.animation.version}
              status={anim.animation.status}
              voice={anim.animation.voice ?? null}
              notes={anim.animation.notes ?? null}
              src={animatedUrl(anim.animation.itemId, anim.animation.version, anim.animation.entry || "solution.html")}
              height={anim.animation.height || 900}
              versions={anim.versions.map((x) => ({ version: x.version, status: x.status }))}
              flags={anim.flags.map((f) => flagView(f, forOwner))}
              fixedHere={anim.fixedHere.map((f) => flagView(f, forOwner))}
              stillOpen={anim.stillOpen.map((f) => flagView(f, forOwner))}
              canAccept={anim.canAccept}
            />
          </section>
        )}

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
