"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { can, SECTIONS, STAGES, STAGE_LABEL, VERDICTS, type SectionKind, type Stage, type Verdict } from "@/lib/keystone/config";
import { changePassword, requireUser, signIn } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";
import { ks } from "@/lib/keystone/db";
import {
  addComment,
  clearHoldByOwner,
  holdByOwner,
  keepHoldingByOwner,
  releaseIfHeld,
  saveSolution,
  sendBackByOwner,
  sendToReviewByOwner,
  setStage,
  setVerdict,
  type OwnerOutcome,
} from "@/lib/keystone/store";
import { nextInQueue } from "@/lib/keystone/queries";
import { ctxQuery, parseCtx } from "@/lib/keystone/listctx";

// Server actions never call redirect(): on keystone.evelynlearning.com the
// pages live behind a proxy rewrite, and an action's redirect renders the
// target in the same request without the rewrite (it served the marketing
// home page). Actions return where to go; the client navigates.

export type SignInResult = { error?: string; go?: string };

export async function signInAction(_prev: SignInResult, form: FormData): Promise<SignInResult> {
  const u = await signIn(String(form.get("username") || ""), String(form.get("password") || ""));
  if (!u) return { error: "That username and password do not match." };
  return { go: await ksHref("/") };
}

export type ReviewResult = { error?: string; go?: string; ok?: number };

/** Approve / send back (solution, item data, reject) / comment from the review bar. On a verdict, moves on to the next item waiting. */
export async function reviewAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  const user = await requireUser();
  const itemId = String(form.get("itemId"));
  const intent = String(form.get("intent"));
  const comment = String(form.get("comment") || "");
  try {
    if (intent === "comment") {
      if (!comment.trim()) return { error: "Write a comment first." };
      await addComment(itemId, comment, user);
      revalidatePath("/keystone", "layout");
      return { ok: Date.now() };
    }
    if (!can.review(user.role)) return { error: "Only the reviewer can approve or send an item back." };
    const verdict = (intent === "approve" ? "approved" : intent) as Verdict;
    if (!(verdict in VERDICTS)) return { error: "Unknown decision." };
    await setVerdict(itemId, verdict, comment, user);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/keystone", "layout");
  const ctx = parseCtx(new URLSearchParams(String(form.get("ctx") || "").replace(/^\?/, "")));
  const next = await nextInQueue(itemId, { stage: ctx.stage, subject: ctx.subject, role: user.role });
  if (next) return { go: await ksHref(`/item/${next}${ctxQuery(ctx)}`) };
  // End of the list: back to it (or to the overview when reviewing the queue).
  return { go: await ksHref(ctx.stage || ctx.subject ? `/items${ctxQuery({ stage: ctx.stage, subject: ctx.subject })}` : `/?done=1`) };
}

export async function saveSolutionAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  const user = await requireUser(can.edit);
  const itemId = String(form.get("itemId"));
  const sections = SECTIONS.map((kind) => ({ kind: kind as SectionKind, md: String(form.get(`s_${kind}`) || "") })).filter(
    (s) => s.md.trim(),
  );
  const { Item } = await ks();
  await Item.updateOne(
    { itemId },
    {
      $set: {
        evelynAnswer: String(form.get("evelynAnswer") || ""),
        reviewNote: String(form.get("reviewNote") || ""),
        topic: String(form.get("topic") || ""),
      },
    },
  );
  await saveSolution(itemId, sections, user, {
    submit: form.get("intent") === "submit",
    note: String(form.get("note") || "") || undefined,
  });
  revalidatePath("/keystone", "layout");
  return { go: await ksHref(`/item/${itemId}${String(form.get("ctx") || "")}`) };
}

export async function setStageAction(form: FormData) {
  const user = await requireUser();
  const itemId = String(form.get("itemId"));
  const stage = String(form.get("stage")) as Stage;
  // A key query needs our answer and working: only raiseKeyQuery makes one.
  if (!STAGES.includes(stage) || stage === "key_query") return;
  if (stage === "delivered" ? !can.deliver(user.role) : !can.edit(user.role)) return;
  // A status that puts the solution in front of Castle Rock releases its latest version first.
  // A solution written for an earlier version of a re-sent question is refused: the status is then left as it is.
  if (stage === "in_review" || stage === "approved" || stage === "delivered") {
    try {
      await releaseIfHeld(itemId, user);
    } catch {
      return;
    }
  }
  await setStage(itemId, stage, user, `Status set to ${STAGE_LABEL[stage]}.`);
  revalidatePath("/keystone", "layout");
}

/** Tech: mark every approved item (or the ones ticked) as handed to SOLARO. */
export async function markDeliveredAction(form: FormData) {
  const user = await requireUser(can.deliver);
  const ids = form.getAll("itemId").map(String);
  for (const id of ids) await setStage(id, "delivered", user, "Delivered to SOLARO.");
  revalidatePath("/keystone", "layout");
}

export type PasswordResult = { error?: string; done?: boolean };

export async function changePasswordAction(_prev: PasswordResult, form: FormData): Promise<PasswordResult> {
  const user = await requireUser();
  const current = String(form.get("current") || "");
  const next = String(form.get("next") || "");
  if (next !== String(form.get("confirm") || "")) return { error: "The two new passwords do not match." };
  const err = await changePassword(user.username, current, next);
  return err ? { error: err } : { done: true };
}

// --- Praveen's queue (the owner's final look). Evelyn only, checked here on the server for every call. ---

const OWNER_ONLY = "Only Evelyn can do that.";

/** Where an owner action returns to: the queue (default) or the item it was made on. */
async function ownerBack(form: FormData, itemId: string, note?: string): Promise<string> {
  const q = note ? `?done=${note}` : "";
  return ksHref(String(form.get("back")) === "item" ? `/item/${encodeURIComponent(itemId)}${q}` : `/queue${q}`);
}

async function ownerAction(form: FormData, run: (itemId: string, user: Awaited<ReturnType<typeof requireUser>>) => Promise<OwnerOutcome>, done: string): Promise<ReviewResult> {
  const user = await requireUser();
  if (user.role !== "evelyn") return { error: OWNER_ONLY };
  const itemId = String(form.get("itemId") || "");
  if (!itemId) return { error: "No item given." };
  let out: OwnerOutcome;
  try {
    out = await run(itemId, user);
  } catch (e) {
    return { error: (e as Error).message };
  }
  if ("error" in out) return { error: out.error };
  revalidatePath("/keystone", "layout");
  return { go: await ownerBack(form, itemId, "already" in out ? "already" : done) };
}

/** Send to review: the held solution goes to Castle Rock as an ordinary "Sent for review". A second call is harmless. */
export async function sendToReviewAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  return ownerAction(form, (itemId, user) => sendToReviewByOwner(itemId, user), "sent");
}

/** Send back to the pipeline with a note the author must address (stays hidden from Castle Rock). */
export async function sendBackAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  return ownerAction(form, (itemId, user) => sendBackByOwner(itemId, String(form.get("note") || ""), user), "sentback");
}

/** Keep holding: records only that it was seen. */
export async function keepHoldingAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  return ownerAction(form, (itemId) => keepHoldingByOwner(itemId), "seen");
}

/** Hold this one: a clean item that would go out by itself waits for the owner instead. */
export async function holdAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  return ownerAction(form, (itemId) => holdByOwner(itemId), "held");
}

/** Seen: clear an information-only hold (a question re-sent mid-review or after approval). Flags stay as history. */
export async function clearHoldAction(_prev: ReviewResult, form: FormData): Promise<ReviewResult> {
  return ownerAction(form, (itemId) => clearHoldByOwner(itemId), "cleared");
}

/** Runs after the response: builds what is queued for API credits. Never throws (there is no one to catch it). */
async function startAnimatedBuild() {
  try {
    const { buildQueued } = await import("@/lib/keystone/animated/serverbuild");
    await buildQueued();
  } catch (e) {
    console.error(`[keystone animated build] stopped: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/** The owner's "To animate" list: queue the ticked items for the API build, or take them back to the by-hand list. */
export async function setAnimateRouteAction(form: FormData) {
  const user = await requireUser();
  if (user.role !== "evelyn") return;
  const { setAnimateRoute } = await import("@/lib/keystone/animreview/store");
  const asked = String(form.get("route"));
  const route = asked === "api" || asked === "hand" || asked === "none" ? asked : "undecided";
  const r = await setAnimateRoute(form.getAll("itemId").map(String), route, { username: user.username, role: user.role }, String(form.get("reason") || ""));
  // "Build with API credits" starts the server's build by itself, after this response is sent (the request does
  // not wait for it). A build already running picks the new items up; KEYSTONE_ANIM_SERVER_BUILD=off leaves the
  // button marking the item only.
  if (route === "api" && "ok" in r) {
    const { serverBuildOn } = await import("@/lib/keystone/animated/buildstate");
    if (serverBuildOn()) after(startAnimatedBuild);
  }
  revalidatePath("/keystone", "layout");
}

/** Any signed-in user, on an item marked "No animation needed": ask for an animated version (it returns to the owner's list). */
export async function askForAnimationAction(form: FormData) {
  const user = await requireUser();
  const itemId = String(form.get("itemId") || "");
  const { askForAnimation } = await import("@/lib/keystone/animreview/store");
  const r = await askForAnimation(itemId, { username: user.username, role: user.role });
  if ("ok" in r) await addComment(itemId, "Asked for an animated version of this solution.", user);
  revalidatePath("/keystone", "layout");
}
