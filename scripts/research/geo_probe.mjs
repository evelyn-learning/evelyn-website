// GEO probe: ask Claude (with web search) buyer/learner questions about edu products and
// record which domains get cited. Mirrors academy Beacon's geo.ts, but with a broad question set.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const here = path.dirname(new URL(import.meta.url).pathname);
const env = fs.readFileSync(path.join(here, "../../apps/marketing/.env.local"), "utf8");
const apiKey = env.match(/^ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim();
if (!apiKey) throw new Error("no ANTHROPIC_API_KEY in apps/marketing/.env.local");
const client = new Anthropic({ apiKey });
const OWN = ["evelynlearning.com", "evelyntutor.com", "crimsora.com"];

const QUESTIONS = [
  // institution / educator buyers
  ["edu-ai-tutor-schools", "What is the best AI tutoring platform for schools and districts?"],
  ["edu-virtual-labs", "What is the best virtual science lab software for high schools, and what does it cost?"],
  ["edu-labster-alt", "What are the best Labster alternatives for virtual labs?"],
  ["edu-lms-tutoring-biz", "What is the best LMS for a small tutoring business?"],
  ["edu-ai-grading", "What is the best AI grading tool for teachers?"],
  ["edu-lesson-planner", "What is the best AI lesson plan generator for teachers?"],
  ["edu-quiz-gen", "What is the best AI quiz and question generator for teachers?"],
  ["edu-ai-detector-uni", "What is the best plagiarism and AI-writing detector for universities?"],
  ["edu-whitelabel-tutoring", "Which companies offer a white-label AI tutor that a tutoring company can brand as its own?"],
  ["edu-question-banks", "Who builds question banks and practice tests for test-prep companies and publishers?"],
  ["edu-adaptive-k12", "What is the best adaptive learning platform for K-12 math?"],
  ["edu-proctoring", "What is the best online proctoring software for exams?"],
  ["edu-essay-grader", "What is the best AI essay grader for a school district?"],
  ["edu-textbook-to-course", "How can a publisher turn textbooks into interactive online courses with AI?"],
  ["edu-content-gen-publishers", "Which companies generate curriculum-aligned educational content for publishers using AI?"],
  ["edu-embed-tutor-lms", "How do I add an AI tutor to my existing LMS such as Canvas or Moodle?"],
  ["edu-ai-tutor-cost", "How much does it cost to build or license an AI tutor for an education company?"],
  ["edu-voice-tutor", "Which AI voice tutors can hold a spoken conversation with students?"],
  ["edu-nursing-sim", "What AI simulation tools exist for nursing and allied-health programs?"],
  ["edu-corporate-training", "What is the best AI platform for corporate training and employee upskilling?"],
  // learner / parent buyers
  ["learn-homework-app", "What is the best homework help app for high school students?"],
  ["learn-math-solver", "What is the best AI math solver that shows step-by-step working?"],
  ["learn-sat-prep", "What is the best SAT prep app or online course?"],
  ["learn-ap-tutor", "What is the best online tutor for AP Calculus and AP Physics?"],
  ["learn-free-chem-lab", "Where can students do a free virtual chemistry or biology lab online?"],
  ["learn-jee-neet-ai", "What is the best AI tutor app for JEE and NEET preparation in India?"],
  ["learn-ib-tutor", "What is the best online tutoring service for IB students?"],
  ["learn-study-flashcards", "What is the best AI study app with flashcards and practice questions?"],
  ["learn-language-voice", "What is the best AI app to practice speaking English with a voice tutor?"],
  ["learn-coding-bootcamp", "What is the best online coding bootcamp in 2026?"],
];

const domainOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };

async function ask([id, question]) {
  const t0 = Date.now();
  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 4000,
    output_config: { effort: "medium" },
    system: "You are answering a buyer's research question. Search the web, then answer concisely with specific vendors/products and cite sources.",
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }],
    messages: [{ role: "user", content: question }],
  });
  const msg = await stream.finalMessage();
  const searched = [], cited = [];
  let text = "";
  for (const b of msg.content) {
    if (b.type === "web_search_tool_result" && Array.isArray(b.content)) for (const r of b.content) if (r.type === "web_search_result") searched.push(r.url);
    if (b.type === "text") { text += b.text; for (const c of b.citations ?? []) if (c.type === "web_search_result_location") cited.push(c.url); }
  }
  const mentioned = OWN.filter((d) => text.toLowerCase().includes(d) || [...searched, ...cited].some((u) => (domainOf(u) || "").endsWith(d)));
  return { id, question, stop: msg.stop_reason, secs: Math.round((Date.now() - t0) / 1000), searched: [...new Set(searched)], cited: [...new Set(cited)], mentioned, answer: text, usage: msg.usage };
}

const out = [];
const queue = [...QUESTIONS];
async function worker() { while (queue.length) { const q = queue.shift(); try { const r = await ask(q); out.push(r); console.error(`${r.id} ${r.secs}s cited=${r.cited.length} own=${r.mentioned.join(",") || "-"}`); } catch (e) { console.error(q[0], "ERR", e.message); out.push({ id: q[0], question: q[1], error: e.message }); } } }
await Promise.all([worker(), worker(), worker()]);
fs.mkdirSync(path.join(here, "out"), { recursive: true });
fs.writeFileSync(path.join(here, "out/geo_probe.json"), JSON.stringify(out, null, 1));
console.error("done", out.length);
