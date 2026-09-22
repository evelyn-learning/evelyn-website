import type { ITouch, LeadStatus, TouchChannel } from "../../models/Lead";

// 4-step channel-aware sequence:
// [email intro] → +1d [linkedin note] → +3d [email bump] → +6d [email breakup] → parked
export const FOLLOW_UP_DELAYS_DAYS = [1, 3, 6] as const;
export const MAX_OUTBOUND_TOUCHES = 4;
export const SEQUENCE_CHANNELS: TouchChannel[] = ["email", "linkedin", "email", "email"];
export const SEQUENCE_STEP_LABELS = ["Intro email", "LinkedIn note", "Email bump", "Breakup email"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

// True for a touch the operator actually sent through this console's own
// send flow (origin `undefined` — written before origins existed — or
// explicitly `"console"`), false for anything an importer pulled in
// (gmail_import/gmail_label/gmail_watcher/contact_form/linkedin_paste/
// linkedin_archive/backfill). A real historical thread or LinkedIn/
// contact-form message landing in the timeline must not advance the
// 4-step outreach sequence or trip the auto-park cap.
export function isCadenceTouch(t: Pick<ITouch, "origin">): boolean {
  return t.origin === undefined || t.origin === "console";
}

function outboundCount(touches: ITouch[]): number {
  return touches.filter((t) => t.direction === "outbound" && isCadenceTouch(t)).length;
}

// Suggested next channel by outbound count alone — channel-blind: what was
// actually sent doesn't shift the sequence, marking any channel consumes a step.
export function expectedNextChannel(touches: ITouch[]): TouchChannel | null {
  return SEQUENCE_CHANNELS[outboundCount(touches)] ?? null;
}

export function applyMarkSent(
  input: { status: LeadStatus; touches: ITouch[] },
  channel: TouchChannel,
  summary: string,
  now: Date
): { status: LeadStatus; nextActionAt: Date | null; touch: ITouch } {
  const touch: ITouch = { at: now, channel, direction: "outbound", summary };
  const countAfterSend = outboundCount(input.touches) + 1;

  if (countAfterSend >= MAX_OUTBOUND_TOUCHES) {
    return { status: "parked", nextActionAt: null, touch };
  }
  const delayDays = FOLLOW_UP_DELAYS_DAYS[countAfterSend - 1] ?? 6;
  return {
    status: "contacted",
    nextActionAt: new Date(now.getTime() + delayDays * DAY_MS),
    touch,
  };
}
