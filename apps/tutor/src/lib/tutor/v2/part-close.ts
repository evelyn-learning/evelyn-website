/**
 * Tutor brain v2 — a part is closed before the next is opened.
 *
 * The student answers, the tutor says "Yes, 8 volts", and in the same breath a new page turns and a new
 * subject begins: three sessions running, the student called that flip abrupt and asked to be told what comes
 * next and asked whether they have a question first (AP Physics, embed-1794496967839, embed-1794500923861).
 * Asking the tutor to do so in its instructions did not hold. So the runtime holds the page: a reply that
 * turns to a new page the student has not been asked about ends there, with the offer in its place, and the
 * page opens in the next reply once they have answered.
 */
const words = (x: string) => x.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
const SMALL = new Set(['and', 'the', 'of', 'in', 'on', 'for', 'to', 'with', 'an', 'vs', 'or', 'at', 'by', 'is', 'are', 'why', 'how', 'what']);
/** The words of a page heading that carry its subject. */
export const headingWords = (title: string) => [...new Set(words(title).filter((w) => !SMALL.has(w)))];
/** Whether `text` names the part a heading stands for: at least half the heading's words are in it. */
export function namesPart(title: string, text: string): boolean {
  const want = headingWords(title); if (!want.length) return false;
  const have = words(text);
  return want.filter((w) => have.some((x) => x === w || (w.length >= 5 && x.startsWith(w.slice(0, 5))))).length >= Math.ceil(want.length / 2);
}
/** The student is steering: asking for something, or asking to go on. */
const STEERS = /\b(?:move on|go on|go ahead|carry on|keep going|continue|next|skip|another|different|something else|instead|let'?s|(?:can|could|would|will|shall) (?:you|we|i)\b|(?:give|show|tell|teach|ask) me|i(?:'d| would) like|i want|ready|what|why|how|where|when)\b/i;
/** The tutor's last reply left the way open: it offered what comes next, or checked in. */
const OFFERS = /\b(?:next is|next up|ready|shall we|any questions?|a question first|make sense|with me|is that clear|all clear|so far|sound good)\b/i;

export interface PartTurn { title: string; studentSaid: string | null; lastTutor: string; pagesOpen: number }
/** May this reply turn to a new page headed `title` now? */
export function mayOpenPart(t: PartTurn): boolean {
  if (t.pagesOpen <= 1) return true; // the lesson is only beginning
  const student = t.studentSaid ?? '';
  if (student && (STEERS.test(student) || namesPart(t.title, student))) return true;
  const sentences = t.lastTutor.replace(/<board\b[\s\S]*?<\/board>/g, ' ').split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  return /\?["')\]]*$/.test(last) && student !== '' && (OFFERS.test(sentences.slice(-2).join(' ')) || namesPart(t.title, t.lastTutor));
}
/** What the tutor says in place of the held page. `named`: the reply had already said what the next part is. */
export function partOffer(title: string, named: boolean): string {
  const ask = 'Shall we go on, or do you have a question first?';
  return named ? ask : `Next is ${/^[A-Z][a-z]/.test(title) && !/^[A-Z][a-z]+'s\b/.test(title) ? title[0].toLowerCase() + title.slice(1) : title}. ${ask}`;
}
