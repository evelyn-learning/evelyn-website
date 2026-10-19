/**
 * Server side of the live-demo buttons: sign a fresh demo-engine embed token
 * per click (HS256 JWT, the partner embed contract — see
 * docs/whitelabel/kanzoo/examples/sign-embed-token.js). A new student_id every
 * time: a reused id has prior sessions, so the tutor would open as a
 * returning learner. The secret is the gdi-demo partner's registry secret,
 * read from GDI_DEMO_PARTNER_SECRET by the route; it never reaches the page.
 */
import { createHmac } from "node:crypto";
import { GDI_LESSONS, isGdiLessonKey, type GdiLessonKey, type GdiTeacher } from "./lessons";

export { GDI_LESSONS, GDI_LESSON_LIST, isGdiLessonKey } from "./lessons";
export type { GdiLessonKey } from "./lessons";

export const GDI_DEMO_EMBED_BASE = "https://tutor-demo.evelynlearning.com/tutor-portal/embed";
export const GDI_DEMO_TTL_HOURS = 3;
const STUDENT_NAME_MAX = 40;

export type GdiEmbedPayload = {
  partner_id: "gdi-demo";
  student_id: string;
  student_name: string;
  subject: "languages";
  level: string;
  topic: string;
  curriculum_module: string;
  target_kind: "lessonNode";
  input_mode: "voice";
  teacher: GdiTeacher;
  tutor_languages: ["en", "ja"];
  speech_rate: number;
  thinking_cue: true;
  max_duration_minutes: number;
  iat: number;
  exp: number;
};

let mintCounter = 0;

export function buildGdiEmbedPayload(args: {
  lesson: GdiLessonKey;
  studentName: string;
  nowSec: number;
  ttlHours?: number;
}): GdiEmbedPayload {
  if (!isGdiLessonKey(args.lesson)) throw new Error(`unknown lesson: ${String(args.lesson)}`);
  const l = GDI_LESSONS[args.lesson];
  const name = (args.studentName ?? "").trim().slice(0, STUDENT_NAME_MAX) || "Demo Learner";
  // Unique per mint even within the same second: time + a process counter.
  mintCounter = (mintCounter + 1) % 1296;
  const suffix = `${args.nowSec.toString(36)}${mintCounter.toString(36).padStart(2, "0")}`;
  const ttl = args.ttlHours ?? GDI_DEMO_TTL_HOURS;
  return {
    partner_id: "gdi-demo",
    student_id: `${l.studentIdBase}-${suffix}`,
    student_name: name,
    subject: "languages",
    level: l.level,
    topic: l.topic,
    curriculum_module: l.plan,
    target_kind: "lessonNode",
    input_mode: "voice",
    teacher: l.teacher,
    tutor_languages: ["en", "ja"],
    speech_rate: l.speechRate,
    thinking_cue: true,
    max_duration_minutes: 30,
    iat: args.nowSec,
    exp: args.nowSec + Math.round(ttl * 3600),
  };
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function signEmbedToken(payload: object, secret: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest();
  return `${header}.${body}.${b64url(sig)}`;
}

export function gdiEmbedUrl(token: string): string {
  return `${GDI_DEMO_EMBED_BASE}?token=${token}`;
}
