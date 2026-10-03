/**
 * Bridge line: the tutor's first words, spoken by the CLIENT from a fixed
 * table the moment the session starts — before the first brain call — so the
 * student hears something within a second instead of 3–8 s of silence.
 * No model, no personalisation beyond first name and the host's short title.
 */
const MAX_TITLE = 60;

export function bridgeLineFor(a: {
  studentName?: string;
  title?: string;
  inFlow: boolean;
  inputMode: 'voice' | 'text';
  resume: boolean;
}): string | null {
  if (a.inputMode === 'text' || a.resume) return null;
  const first = (a.studentName || '').trim().split(/\s+/)[0];
  const greet = first ? `Hey ${first}.` : 'Hey.';
  if (a.inFlow) {
    const t = (a.title || '').trim();
    const title = t.length > MAX_TITLE ? `${t.slice(0, MAX_TITLE - 1)}…` : t;
    return title ? `${greet} ${title} — let’s look at it.` : `${greet} Let’s look at it.`;
  }
  return `${greet} Let’s get started.`;
}

/** Appended to the opening directive when a bridge line was spoken. */
export const BRIDGE_SPOKEN_DIRECTIVE =
  ' You have ALREADY greeted the student by name a moment ago (a short spoken line); do not greet again or repeat ' +
  'their name — start directly with your first content sentence.';
