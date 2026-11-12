/**
 * Tutor brain v2 — when a board item appears in a spoken reply.
 *
 * A reply is written in a second or two and spoken over twenty. Each board call can carry `say_with`,
 * the opening words of the sentence it belongs with (tools.ts); this finds that sentence among the
 * ones sent to the voice, so the client can hold the item until it starts playing.
 */
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

/** Index of the sentence the anchor points at, or -1 when there is no anchor or nothing matches.
 *  The anchor may run across a sentence break ("Good. Now a trap."): the item goes with the sentence
 *  its last matched word is in. */
export function anchorSentenceIndex(sayWith: string | undefined, sentences: string[]): number {
  const want = norm(sayWith ?? '');
  if (!want.length) return -1;
  const words: string[] = []; const owner: number[] = [];
  sentences.forEach((s, i) => { for (const w of norm(s)) { words.push(w); owner.push(i); } });
  // The model copies the opening words, sometimes loosely: try five words, then fewer.
  for (const n of [5, 4, 3, 2]) {
    if (want.length < n) continue;
    for (let at = 0; at + n <= words.length; at++) {
      let k = 0;
      while (k < n && words[at + k] === want[k]) k++;
      if (k === n) return owner[at + n - 1];
    }
  }
  return -1;
}

const STOP = new Set(['the', 'a', 'an', 'is', 'it', 'its', 'this', 'that', 'here', 'heres', 'now', 'so', 'and', 'of', 'to', 'in', 'on', 'for', 'one', 'you', 'your', 'lets', 'let', 'me', 'we', 'yes', 'right', 'good', 'ok', 'okay', 's', 'with', 'at', 'be', 'are']);

/** Where an anchored item goes once the whole reply is known. The model sometimes describes its sentence
 *  instead of quoting it ("Here is the rule." for "Now let's see whether L'Hôpital's rule gets there"):
 *  then the sentence sharing most of the anchor's content words, and failing that the last sentence —
 *  an item the tutor meant for later should not appear first. */
export function anchorSentenceFinal(sayWith: string | undefined, sentences: string[]): number {
  const exact = anchorSentenceIndex(sayWith, sentences);
  if (exact >= 0 || !sentences.length) return exact;
  const want = norm(sayWith ?? '').filter((w) => !STOP.has(w));
  if (!want.length) return -1;
  let best = -1; let bestHits = 0;
  sentences.forEach((s, i) => { const words = new Set(norm(s)); const hits = want.filter((w) => words.has(w)).length; if (hits > bestHits) { best = i; bestHits = hits; } });
  return best >= 0 ? best : sentences.length - 1;
}

/** Words that carry what a board item or a sentence is about: names of functions and words of four letters
 *  or more, with spoken and written forms of the same thing made equal ("sine"/"\\sin", "limit"/"\\lim"). */
const SAME: Record<string, string> = { sine: 'sin', cosine: 'cos', tangent: 'tan', limit: 'lim', limits: 'lim', log: 'ln', logarithm: 'ln', natural: 'ln', infinity: 'infty', infinite: 'infty', derivative: 'deriv', derivatives: 'deriv', differentiate: 'deriv', differentiated: 'deriv', differentiating: 'deriv', frac: '', left: '', right: '', text: '', begin: '', aligned: '', quad: '', cdot: '', cdots: '', displaystyle: '' };
const MATHS_NAME = new Set(['sin', 'cos', 'tan', 'lim', 'ln', 'exp', 'infty', 'sqrt', 'deriv']);
function about(s: string): Set<string> {
  const out = new Set<string>();
  for (const raw of norm(s.replace(/∞/g, ' infty ').replace(/([A-Za-z])['′](?![A-Za-z])/g, '$1 deriv '))) {
    const w = raw in SAME ? SAME[raw] : raw;
    if (w && (MATHS_NAME.has(w) || (w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w)))) out.add(w);
  }
  return out;
}

/** Which sentence an inline board item appears with. The model writes the words about something and then
 *  its block, so the item belongs to the stretch of speech since the previous block (`segStart` up to the
 *  last sentence so far). Working, a figure or a note appears as that stretch begins: the student must see
 *  it while it is being talked about. Matching those by shared words put equations late whenever the
 *  sentence used no word from the item ("So the expression becomes…"), and late is the failure students
 *  notice (Praveen, embed-1794361050464); a sentence early is not.
 *
 *  A problem is different: its stretch usually opens with the verdict on the last answer, and a new problem
 *  under "Yes, the box keeps sitting" is early. It appears where the tutor starts telling it — the first
 *  sentence of the stretch that shares its words with the card ("A sled sits still on snow…"), or the short
 *  lead-in just before ("Now a bigger case."). Holding it to the last sentence left the student hearing a
 *  whole scenario with nothing to look at (embed-1794371869806). Nothing shared: the last sentence. */
const LEAD_IN_WORDS = 10;
export function inlineSentenceIndex(toolName: string, content: string, sentences: string[], segStart: number): number {
  const last = sentences.length - 1;
  if (last < 0) return 0;
  const from = Math.min(Math.max(0, segStart), last);
  // A page is turned where the tutor first names what it is headed: turned at the start of the stretch, the
  // "Stemplot" page came up under "Yes, three students scored 6" (browser run 2026-11-11).
  if (toolName === 'new_page') {
    const heading = about(content);
    for (let i = from; i <= last; i++) if ([...about(sentences[i])].some((w) => heading.has(w))) return i;
    return from;
  }
  if (toolName !== 'show_problem') return from;
  const card = about(content); const cardNums = new Set(content.match(/\d+(?:\.\d+)?/g) ?? []);
  // The first sentence of a reply answers the student, often in the words of the problem just done.
  for (let i = Math.max(from, last > 0 ? 1 : 0); i <= last; i++) {
    const words = [...about(sentences[i])].filter((w) => card.has(w)).length;
    const nums = (sentences[i].match(/\d+(?:\.\d+)?/g) ?? []).filter((n) => cardNums.has(n)).length;
    if (words >= 2 || (words >= 1 && nums >= 1) || nums >= 2) {
      // The first sentence of a reply answers the student; it is never a lead-in to the next problem.
      const leadIn = i - 1 >= from && i - 1 > 0 && norm(sentences[i - 1]).length <= LEAD_IN_WORDS;
      return leadIn ? i - 1 : i;
    }
  }
  return last;
}

/** Whether the end of a spoken reply hands the student something to do: a question, or an instruction to them
 *  ("Tell me the full stemplot when you have it.", "List all the bins you would need."). A reply that ends
 *  this way has asked, with or without a question mark; one that ends on a statement has not, and the student
 *  does not know whose move it is. */
const TO_THE_STUDENT = /\b(?:tell me|let me know|show me|give me|send me|walk me through|your turn|have a go|give it a (?:go|try)|try (?:it|this|that|one|the|your|another|building|writing|working)|take your time|go ahead|over to you|what do you (?:think|get|notice|see))\b/i;
const DO_THIS = /^(?:(?:now|next|then|so|first|okay|ok|please|go on and|go ahead and|this time|again)[,:]?\s+)*(?:write|list|find|read|say|name|work|solve|classify|choose|pick|explain|describe|compare|calculate|compute|draw|sketch|check|look|try|use|apply|think|decide|suggest|simplify|expand|factor|factorise|factorize|rearrange|substitute|count|build|make|start|finish|complete|fill|give|state|identify|estimate|predict|answer|square|multiply|divide|add|subtract|take|fix|correct|redo|set up|plug|put|trace|follow|group|sort|order|match|label|mark|plot|graph|convert|round|evaluate|integrate|differentiate|derive|prove|show|justify|test|define|summarise|summarize|quote|keep going|carry on)\b/i;
/** Whether a reply asks the student anything at all, wherever in it. A question in the middle still hands the
 *  turn over: "Have you met the disc method before? Picture the region spinning…" was taken for a reply that
 *  asked nothing, and the tutor went on while the student was answering (embed-1794446765164). */
export function asksAnywhere(sentences: string[]): boolean {
  return sentences.some((x, i) => /[?？]/.test(x) || (i >= sentences.length - 2 && asksAloud([x])));
}

export function asksAloud(sentences: string[]): boolean {
  return sentences.slice(-2).some((x) => /[?？]/.test(x) || TO_THE_STUDENT.test(x) || x.split(/[,;:]\s+|\s+and\s+/).some((clause) => DO_THIS.test(clause.trim())));
}

/** In a spoken lesson, what a problem card asks must also be heard: a tutor who tells the scenario and stops,
 *  or says nothing about the card at all, leaves the student waiting in silence with the question sitting
 *  unread on the board (embed-1794371869806, embed-1794376295543). Given the card and the sentences spoken,
 *  this returns the words still to be said, or null when the reply already asks (asksAloud). Otherwise: the
 *  card's task sentence. Only a short one is said: a long card is for reading, and a card read out in full
 *  (a 90-word source excerpt, fifteen data values) is a voice reciting the board (embed-1794416183291). */
const SAY_ASK_WORDS = 30;
const SAY_WHOLE_CARD_WORDS = 45;
export function unsaidAsk(statement: string, sentences: string[]): string | null {
  const card = statement.replace(/\s+/g, ' ').trim();
  if (!card || !sentences.length || asksAloud(sentences)) return null;
  const parts: string[] = []; let cur = ''; let inMath = false;
  for (let i = 0; i < card.length; i++) {
    const ch = card[i]; cur += ch;
    if (ch === '$') inMath = !inMath;
    if (!inMath && /[.!?]/.test(ch) && (i + 1 >= card.length || card[i + 1] === ' ')) { parts.push(cur.trim()); cur = ''; }
  }
  if (cur.trim()) parts.push(cur.trim());
  // A card in parts "(a) … (b) …" asks in the line above them.
  const firstPart = parts.findIndex((x) => /^\(?[a-e]\)\s/i.test(x));
  const ask = firstPart > 0 ? parts.slice(0, firstPart).join(' ') : firstPart === 0 ? card : parts[parts.length - 1];
  const askWords = [...about(ask)];
  const shared = (sentence: string, words: string[]) => { const w = about(sentence); return words.filter((x) => w.has(x)).length; };
  if (askWords.length && sentences.slice(-3).some((x) => shared(x, askWords) / askWords.length >= 0.6)) return null;
  const short = (x: string) => norm(x).length <= SAY_ASK_WORDS && (x.match(/\d+(?:\.\d+)?/g) ?? []).length <= 5;
  const cardWords = [...about(card)];
  const told = sentences.some((x) => shared(x, cardWords) >= 2);
  if (!told && norm(card).length <= SAY_WHOLE_CARD_WORDS && (card.match(/\d+(?:\.\d+)?/g) ?? []).length <= 5) return card;
  return short(ask) ? ask : 'Have a look at it on the board, and tell me what you think.';
}

/** Whether a spoken reply already set the question a card states: most of what the card is about (its words
 *  and its numbers) was said. The check after a reply may put up a card only for a question the tutor asked
 *  aloud, never one of its own making. */
export function saidCovers(statement: string, said: string): boolean {
  const words = [...about(statement)]; const nums = [...new Set(statement.match(/\d+(?:\.\d+)?/g) ?? [])];
  const heard = about(said); const heardNums = new Set(said.match(/\d+(?:\.\d+)?/g) ?? []);
  const hits = words.filter((w) => heard.has(w)).length + nums.filter((n) => heardNums.has(n)).length;
  return hits >= 2 && hits >= (words.length + nums.length) * 0.5;
}
