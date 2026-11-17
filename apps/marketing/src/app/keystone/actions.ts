"use server";

import { revalidatePath } from "next/cache";
import { can, SECTIONS, STAGES, STAGE_LABEL, VERDICTS, type SectionKind, type Stage, type Verdict } from "@/lib/keystone/config";
import { changePassword, requireUser, signIn } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";
import { ks } from "@/lib/keystone/db";
import { addComment, releaseIfHeld, saveSolution, setStage, setVerdict } from "@/lib/keystone/store";
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
  if (stage === "in_review" || stage === "approved" || stage === "delivered") await releaseIfHeld(itemId, user);
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
