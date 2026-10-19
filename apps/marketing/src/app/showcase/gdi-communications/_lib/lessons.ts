/**
 * The three GDI demo lessons, as the live-demo slide lists them and the mint
 * route signs them. Client-safe (no Node imports). Mirrors
 * docs/whitelabel/gdi/demo/mint-demo-links.js + teachers.json — change both.
 */
export type GdiLessonKey = "starter" | "advanced" | "meeting";

export type GdiTeacher = {
  id: string;
  name: string;
  intro: string;
  subjects: string[];
  levels: string[];
  style: Record<string, string | string[]>;
  voice: { provider: string; voiceId: string };
};

export type GdiLesson = {
  key: GdiLessonKey;
  title: string;
  /** Who it is for, in plain words (the card). */
  audience: string;
  description: string;
  minutes: number;
  plan: string;
  teacher: GdiTeacher;
  speechRate: number;
  level: string;
  topic: string;
  studentIdBase: string;
};

const RYOTA: GdiTeacher = {
  id: "ryota",
  name: "Ryota",
  intro: "I help Japanese professionals start speaking English with confidence. I explain in Japanese whenever it helps, and we practise short, useful English together.",
  subjects: ["english"],
  levels: ["adult-beginner"],
  style: {
    teaching: "Calm and encouraging. Explains grammar and instructions in polite Japanese, then models short English phrases for the learner to repeat and use.",
    pace: "gentle",
    questioning: "One short question at a time; gives the first English word as a scaffold when the learner is stuck.",
    encouragement: "Warm and specific, in Japanese — names exactly what the learner said well.",
    humor: "light",
    catchphrases: ["大丈夫ですよ。", "Let's try it together."],
    analogyDomains: ["everyday office life in Japan", "business trips", "weekend hobbies"],
    errorResponse: "Never says 'wrong'. Repeats the learner's sentence correctly and asks them to say it once more.",
    formality: "polite",
    boardHabits: "One phrase card at a time: the English phrase large, a short Japanese gloss underneath.",
  },
  voice: { provider: "cartesia", voiceId: "14c639be-eccb-447c-949e-112bd6dd326a" },
};

const JAMESON: GdiTeacher = {
  id: "jameson",
  name: "Jameson",
  intro: "I coach business English for meetings, presentations and everyday conversations at work. We'll practise the real situations you face, and I can explain in Japanese whenever you ask.",
  subjects: ["english"],
  levels: ["adult-intermediate", "adult-advanced"],
  style: {
    teaching: "Practical and conversational. Teaches through role-plays of real workplace situations, then gives short, focused feedback.",
    pace: "brisk",
    questioning: "Open questions about the learner's own work; keeps his own turns short so the learner talks more.",
    encouragement: "Professional and specific.",
    humor: "light",
    catchphrases: ["Nice — now make it a bit more polite.", "Let's role-play it."],
    analogyDomains: ["meetings", "client visits", "travel"],
    errorResponse: "Lets the conversation flow, then gives at most two corrections at the end, each with a better version to say aloud.",
    formality: "professional",
    boardHabits: "Phrase tables ordered casual to polite; key phrases only.",
  },
  voice: { provider: "cartesia", voiceId: "a5136bf9-224c-4d76-b823-52bd5efcffcc" },
};

export const GDI_LESSONS: Record<GdiLessonKey, GdiLesson> = {
  starter: {
    key: "starter",
    title: "Experiences — Starter",
    audience: "Adult beginner (A1) · Ryota · Japanese guidance",
    description: "Talking about what you did and what you have done: \"I went to…\", \"Have you ever…?\". Ryota explains in Japanese and the learner speaks English from the first minute.",
    minutes: 15,
    plan: "gdi.demo.english.experiences.starter.v1",
    teacher: RYOTA,
    speechRate: 0.75,
    level: "Adult beginner (A1)",
    topic: "Experiences — Starter",
    studentIdBase: "gdi-showcase-starter",
  },
  advanced: {
    key: "advanced",
    title: "Experiences — Talking About the Past",
    audience: "Adult A2–B1 · Jameson · mostly English",
    description: "From your \"Gambit Series: Advanced — Experiences\" sample. Past simple against present perfect, follow-up questions, and the learner telling their own story.",
    minutes: 18,
    plan: "gdi.demo.english.experiences.advanced.v1",
    teacher: JAMESON,
    speechRate: 0.85,
    level: "Adult advanced (A2–B1)",
    topic: "Experiences — Talking About the Past",
    studentIdBase: "gdi-showcase-advanced",
  },
  meeting: {
    key: "meeting",
    title: "Meeting Skills 1 — Scheduling a Meeting",
    audience: "Business English · Jameson · two role-plays",
    description: "From your Meeting Skills Unit 1. Meeting types, the preparation checklist, and scheduling phrases from casual to polite, then two role-plays with the tutor as the colleague.",
    minutes: 20,
    plan: "gdi.demo.english.meeting-skills.u1-scheduling.v1",
    teacher: JAMESON,
    speechRate: 0.85,
    level: "Adult business English",
    topic: "Meeting Skills 1 — Scheduling a Meeting",
    studentIdBase: "gdi-showcase-business",
  },
};

export const GDI_LESSON_LIST: GdiLesson[] = [GDI_LESSONS.starter, GDI_LESSONS.advanced, GDI_LESSONS.meeting];

export function isGdiLessonKey(x: unknown): x is GdiLessonKey {
  return typeof x === "string" && x in GDI_LESSONS;
}
