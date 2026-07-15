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

export const runtime = 'nodejs';

const GIST_MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 120;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM = `You extract the question a tutor just asked a student.

Reply with ONLY the question, restated in at most 12 words, ending with "?".
Keep the student-facing essence (what they must answer), drop the preamble.
Preserve any inline $...$ LaTeX EXACTLY as written — do not convert or drop it.
If the turn asks the student nothing, reply with exactly: NONE`;

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
    const gist = raw && raw !== 'NONE' && raw.length <= 200 ? raw : null;
    return Response.json({ gist });
  } catch {
    // Fail soft — the client keeps its derived-sentence fallback.
    return Response.json({ gist: null });
  }
}
