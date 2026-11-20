/**
 * Was this recognised speech said to the tutor, or is it another voice in the room? (lib/tutor/v2/room-voices.ts)
 *
 * Input: { heard, tutorSaid, earlier? }. Output: { background: boolean }.
 * With extract: true the output is { student: string | null }: the student's own words out of a stretch that
 * may hold a television's too, or null when none of it is theirs.
 *
 * A one-word judgement from the small model, asked by the voice client before speech picked up while the tutor
 * is talking is allowed to cut it off. Any failure answers 502 and the client takes the words as the student's:
 * a tutor that ignores its student is worse than one a television interrupts.
 */
import { NextRequest } from 'next/server';
import { getModelClient } from '@/lib/tutor/ai/model-registry';
import { ROOM_CHECK_SYSTEM, ROOM_EXTRACT_SYSTEM, repliedBackground, roomCheckMessage, studentPart, studentWordsIn } from '@/lib/tutor/v2/room-voices';

export const runtime = 'nodejs';

const { client: anthropic, model: MODEL_ID } = getModelClient('room-voices');

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { heard?: unknown; tutorSaid?: unknown; earlier?: unknown; extract?: unknown };
    const heard = typeof body.heard === 'string' ? body.heard.trim() : '';
    if (!heard) return Response.json({ background: false, student: null });
    const tutorSaid = typeof body.tutorSaid === 'string' ? body.tutorSaid : '';
    const earlier = Array.isArray(body.earlier) ? body.earlier.filter((x): x is string => typeof x === 'string').slice(-2) : [];
    const content = roomCheckMessage({ tutorSaid, heard, earlier });
    if (body.extract === true) {
      // Both readings at once (room-voices.ts, studentPart): whose the stretch is, and which words are the student's.
      const [whole, picked] = await Promise.all([
        anthropic.messages.create({ model: MODEL_ID, max_tokens: 8, temperature: 0, system: ROOM_CHECK_SYSTEM, messages: [{ role: 'user', content }] }),
        anthropic.messages.create({ model: MODEL_ID, max_tokens: 300, temperature: 0, system: ROOM_EXTRACT_SYSTEM, messages: [{ role: 'user', content }] }),
      ]);
      const text = (m: typeof whole) => (m.content[0]?.type === 'text' ? m.content[0].text : '');
      return Response.json({ student: studentPart(repliedBackground(text(whole)), studentWordsIn(text(picked), heard), heard) });
    }
    const msg = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: 8,
      temperature: 0,
      system: ROOM_CHECK_SYSTEM,
      messages: [{ role: 'user', content }],
    });
    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    return Response.json({ background: repliedBackground(raw) });
  } catch {
    return Response.json({ background: false, ok: false }, { status: 502 });
  }
}
