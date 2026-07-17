/**
 * Question gist — Q pin (2026-07-14 live-test ask).
 *
 * Input: the tutor's finished turn text (often long — a whole explanation
 * ending in a question). Output: { gist } — a ≤12-word restatement of the
 * question the student is being asked, or null when the turn asks nothing.
 *
 * The client pins the gist over the whiteboard while the student thinks and
 * answers (TutorSession → SessionStage questionPin), clearing it when the
 * next tutor turn starts. It shows an instant client-derived fallback (the
 * turn's last "?" sentence) and swaps this gist in when it lands.
 *
 * Why Haiku: same reasoning as the judge route — a small, well-scoped
 * extraction task, ~100-200ms and ~$0.0002/turn. Inline $...$ LaTeX must be
 * preserved verbatim: the pin renders through InlineMathText/KaTeX, so a
 * math question's equation survives into the gist.
 */
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { parseGistReply } from '@/lib/tutor/question-gist-text';

export const runtime = 'nodejs';

const GIST_MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM = `You extract the question a tutor just asked a student, for a small reminder card pinned over the whiteboard while the student thinks.

Reply with ONLY the question, rephrased as ONE complete, self-contained, natural-sounding question of at most 14 words, ending with "?". Never cut a question off — rephrase it shorter instead. Keep the student-facing essence: exactly what they must answer or decide. Drop preamble, context recaps, and scaffolding.
Preserve any inline $...$ LaTeX EXACTLY as written — do not convert or drop it.

Reply with exactly NONE when the turn's only question is conversational plumbing rather than something worth pinning: asking the student to repeat or rephrase themselves ("could you say that again?"), reacting to a mishear, or a rhetorical aside the student isn't meant to answer.
Choice prompts ARE real questions — pin them (e.g. "Want another at this level, something harder, or move on?").`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { turnText?: unknown };
    const turnText = typeof body.turnText === 'string' ? body.turnText.trim() : '';
    if (!turnText) return Response.json({ gist: null });

    const msg = await anthropic.messages.create({
      model: GIST_MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      // Long explanations bury the ask at the end — the tail is what matters.
      messages: [{ role: 'user', content: turnText.slice(-4000) }],
    });
    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text.trim() : '';
    const gist = parseGistReply(raw);
    // 200 always means "the model judged this turn" — gist:null here is a
    // DELIBERATE verdict (NONE / over-length), not a failure.
    return Response.json({ gist });
  } catch {
    // Task Y2: internal failure (Anthropic 5xx/timeout/malformed response)
    // — NOT a deliberate NONE. Round-4 had this collapse to the same
    // `Response.json({ gist: null })` as a real NONE verdict, so the
    // client's fetch `.then` treated both as "ok, no pin" and its
    // lastQuestionSentence `.catch()` fallback never ran for genuine
    // errors. A non-200 status (plus an explicit ok:false in the body)
    // makes the client's `r.ok` check reject the promise so the fallback
    // fires ONLY here, never for a legitimate NONE.
    return Response.json({ gist: null, ok: false }, { status: 502 });
  }
}
