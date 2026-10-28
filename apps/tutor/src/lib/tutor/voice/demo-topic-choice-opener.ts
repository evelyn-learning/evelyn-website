/**
 * Deterministic demo opener (2026-10-28, Praveen, after four local trials in
 * which the brain never asked):
 *
 *   "Hey Praveen."                                   ← bridge line (client)
 *   "I see you picked Grade 7 Life Science. Want me  ← THIS line (client)
 *    to teach that, or something else?"               + a topic card on the board
 *   …student answers…                                 ← mic is live; no kickoff
 *   brain turn 1 carries <demo_topic_choice>:        ← opener directive + this
 *     named something else → propose_plan_swap NOW (targetSubject), say
 *     "Sure — moving to …", NEW page, hook on the new topic;
 *     yes / vague → open on the configured topic now, board first.
 *
 * Why client-side: the confirm was put in the opener directive three ways
 * (appended, leading, as a HARD RULE naming Rule 6) and Haiku skipped it
 * every time — the first turn is the most over-instructed turn of the
 * session. A spoken line the client owns cannot be skipped. Pure,
 * client-safe; gated by TUTOR_DEMO_TOPIC_CHOICE + the embed `is_trial` claim
 * at the call site.
 */

/** 'grade-7-life-science' → 'Grade 7 Life Science'; falls back to level + subject. */
export function humanizeTopicLabel(a: { topic?: string; subject?: string; level?: string }): string {
  const t = (a.topic ?? '').trim();
  if (t && !/^[0-9a-f]{8,}$/i.test(t)) {
    const words = t
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((w) => (/^(and|or|of|the|in|to|for|a|an)$/i.test(w) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)));
    return words.join(' ');
  }
  const level = (a.level ?? '').trim();
  const subject = (a.subject ?? '').trim();
  const subj = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : '';
  return [level, subj].filter(Boolean).join(' ') || 'this topic';
}

/** The spoken line. Never a placeholder name (student-name.ts). */
export function demoTopicChoiceLine(a: { studentName?: string; topic?: string; subject?: string; level?: string }): string {
  const label = humanizeTopicLabel(a);
  return `I see you picked ${label}. Want me to teach that, or something else?`;
}

/** The board card shown with the line — a handwrite line cannot be rejected
 *  by any render validator (opener-fallback.ts). */
export function demoTopicCardCommand(a: { topic?: string; subject?: string; level?: string }): { action: 'handwrite'; text: string } {
  return { action: 'handwrite', text: `Today: ${humanizeTopicLabel(a)} — or something else?` };
}

/**
 * Attached to the FIRST brain turn (the student's answer) next to the opener
 * directive. Generic by design — no topic examples.
 */
export function demoTopicChoiceDirective(line: string): string {
  return (
    `<demo_topic_choice>\n` +
    `You have ALREADY greeted the student and asked aloud: "${line}" — the topic is on the board. The student's message below is their answer. Do not greet again and do not ask that question again.\n` +
    `- If they name a different topic or subject: that is the lesson now. In THIS turn call propose_plan_swap (targetSubTopic 3-8 words, targetSubject the plain subject word), call new_page so the old topic leaves the board, and say ONE short sentence that you are moving to it (name the topic; when a lesson for a nearby grade is the closest fit, name that grade). Then open on the NEW topic with your hook on the board, as the opening directive says.\n` +
    `- If they say yes, name the configured topic, or are vague ("anything", "you choose", "ok"): open on the configured topic now — board first, hook first — with no further question about what to study.\n` +
    `- Never say a topic is outside this session; in a demo every topic is in scope.\n` +
    `</demo_topic_choice>`
  );
}

/** Opener-clause lead used INSTEAD of the spoken-confirm hard rule when the
 *  client already asked the question. */
export const DEMO_TOPIC_ASKED_LEAD =
  'The topic question has ALREADY been asked aloud by you, and the student\'s message is their answer (see <demo_topic_choice> in this turn): do not greet again and do not ask it again; act on their answer. ';

