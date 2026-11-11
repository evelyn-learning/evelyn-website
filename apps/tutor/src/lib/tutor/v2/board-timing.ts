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

/** In a spoken lesson, what a problem card asks must also be heard: a tutor who tells the scenario and stops,
 *  or says nothing about the card at all, leaves the student waiting in silence with the question sitting
 *  unread on the board (embed-1794371869806, embed-1794376295543). Given the card and the sentences spoken,
 *  this returns the words still to be said, or null when the reply already asks. A reply that ends on a
 *  question has asked. Otherwise: the card's task sentence when the speech told the problem, and the whole
 *  card (when short) when the speech never mentioned it. */
const SAY_WHOLE_CARD_WORDS = 45;
export function unsaidAsk(statement: string, sentences: string[]): string | null {
  const card = statement.replace(/\s+/g, ' ').trim();
  if (!card || !sentences.length || sentences.slice(-2).some((x) => /[?？]/.test(x))) return null;
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
  const cardWords = [...about(card)];
  const told = sentences.some((x) => shared(x, cardWords) >= 2);
  return !told && norm(card).length <= SAY_WHOLE_CARD_WORDS ? card : ask;
}
