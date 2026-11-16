"use server";

import { revalidatePath } from "next/cache";
import { can, SECTIONS, STAGES, type SectionKind, type Stage } from "@/lib/keystone/config";
import { changePassword, requireUser, signIn } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";
import { ks } from "@/lib/keystone/db";
import { addComment, saveSolution, setStage, setVerdict } from "@/lib/keystone/store";
import { nextInQueue } from "@/lib/keystone/queries";

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

/** Approve / needs changes / comment from the review bar. On a verdict, moves on to the next item waiting. */
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
    if (!can.review(user.role)) return { error: "Only the reviewer can approve or ask for changes." };
    await setVerdict(itemId, intent === "approve" ? "approved" : "changes", comment, user);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/keystone", "layout");
  const next = await nextInQueue(itemId);
  return { go: await ksHref(next ? `/item/${next}?from=${itemId}` : `/?done=1`) };
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
  return { go: await ksHref(`/item/${itemId}`) };
}

export async function setStageAction(form: FormData) {
  const user = await requireUser();
  const itemId = String(form.get("itemId"));
  const stage = String(form.get("stage")) as Stage;
  if (!STAGES.includes(stage)) return;
  if (stage === "delivered" ? !can.deliver(user.role) : !can.edit(user.role)) return;
  await setStage(itemId, stage, user, `Stage set to ${stage.replace("_", " ")}.`);
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
