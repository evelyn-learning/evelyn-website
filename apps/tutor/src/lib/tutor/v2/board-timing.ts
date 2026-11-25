/**
 * Tutor brain v2 — when a board item appears in a spoken reply.
 *
 * A reply is written in a second or two and spoken over twenty. Each board call can carry `say_with`,
 * the opening words of the sentence it belongs with (tools.ts); this finds that sentence among the
 * ones sent to the voice, so the client can hold the item until it starts playing.
 */
import { TUTOR_V2_NO_FALSE_SILENCE, TUTOR_V2_PRACTICE_ASK_CAP, TUTOR_V2_QUESTION_ONCE } from '../orchestrator/flags';

// 2026-11-24, \p{M}: a Devanagari word keeps its vowel signs (cut at them, a ten-word Hindi ask counted as thirty words).
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

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
    // Not named in what has been said: it turns with what is said next. Turned at the start of the stretch, the
    // page for the next problem came up while the tutor was still confirming the last answer (chemistry,
    // embed-1794512595935).
    return last + 1;
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
const DO_THIS = /^(?:(?:now|next|then|so|first|okay|ok|please|go on and|go ahead and|this time|again)[,:]?\s+)*(?:write|list|find|interpret|read|say|name|work|solve|classify|choose|pick|explain|describe|compare|calculate|compute|draw|sketch|check|look|try|use|apply|think|decide|suggest|simplify|expand|factor|factorise|factorize|rearrange|substitute|count|build|make|start|finish|complete|fill|give|state|identify|estimate|predict|answer|square|multiply|divide|add|subtract|take|fix|correct|redo|set up|plug|put|trace|follow|group|sort|order|match|label|mark|plot|graph|convert|round|evaluate|integrate|differentiate|derive|prove|show|justify|test|define|summarise|summarize|quote|keep going|carry on)\b/i;
/** Whether a reply asks the student anything at all, wherever in it. A question in the middle still hands the
 *  turn over: "Have you met the disc method before? Picture the region spinning…" was taken for a reply that
 *  asked nothing, and the tutor went on while the student was answering (embed-1794446765164). */
export function asksAnywhere(sentences: string[]): boolean {
  return sentences.some((x, i) => /[?？]/.test(x) || (i >= sentences.length - 2 && asksAloud([x])));
}

/** Task 6e fix round 1 (F2): a request to say the sentence that names "you" ("Now you say it: …") hands over too; taken
 *  for a statement, it got "Are you with me so far?" added, and the "Yes." to that set the request off again. */
const YOU_SAY = /\b(?:now )?you (?:say|try|repeat)\b|\bsay it (?:again|back|once more|with me|after me)\b|\brepeat after me\b|\bsay the (?:whole )?sentence\b|言ってみて|言ってください/i;
/** Task 7m (NO_FALSE_SILENCE): a starter offered anywhere in the sentence hands over ("Now, another sentence about you, with
 *  "I have…" Try starting with "I have worked with…""; DO_THIS is anchored at a clause's start). Not "start with" alone: "Let's
 *  start with the past simple." is the tutor's own plan, and so is "Let's try starting with the chain rule." (fix round 1, M3), also with "both / just / now…" between (fix round 2, N2). */
const TRY_STARTING = /(?<!\b(?:let'?s|let us|we(?:'ll| will| can)?|i(?:'ll| will)?)(?:\s+(?:both|all|just|now|first|then|also))*\s)\btry (?:starting|beginning)\b/i;
/** Task 7m (QUESTION_ONCE, mic test 4 flag 5a): a Japanese request to answer, say, write or use hands over (「まず、一文で答えて
 *  みてください。」 was taken for a statement, and the card was read out after it). */
const JA_HAND_OVER = /(?:答え|話し|書い|言っ|読ん|使っ|作っ|続け)てみて|(?:答え|話し|書い|続け)てください/;
export function asksAloud(sentences: string[]): boolean {
  return sentences.slice(-2).some((x) => /[?？]/.test(x) || TO_THE_STUDENT.test(x) || (TUTOR_V2_PRACTICE_ASK_CAP && YOU_SAY.test(x)) || (TUTOR_V2_NO_FALSE_SILENCE && TRY_STARTING.test(x)) || (TUTOR_V2_QUESTION_ONCE && JA_HAND_OVER.test(x)) || x.split(/[,;:]\s+|\s+and\s+/).some((clause) => DO_THIS.test(clause.trim())));
}

/** In a spoken lesson, what a problem card asks must also be heard: a tutor who tells the scenario and stops,
 *  or says nothing about the card at all, leaves the student waiting in silence with the question sitting
 *  unread on the board (embed-1794371869806, embed-1794376295543). Given the card and the sentences spoken,
 *  this returns the words still to be said, or null when the reply already asks (asksAloud). Otherwise: the
 *  card's task sentence. Only a short one is said: a long card is for reading, and a card read out in full
 *  (a 90-word source excerpt, fifteen data values) is a voice reciting the board (embed-1794416183291). */
const SAY_ASK_WORDS = 30;
const SAY_WHOLE_CARD_WORDS = 45;
/** Task 7m (QUESTION_ONCE): a card's question, as it is spoken where the card stands: its last run of sentences that ask (end
 *  in ? or ？), without a leading label ("Question:"). Null when the card asks no question (an instruction is the reply's to say), holds
 *  mathematics, or the question is longer than SAY_ASK_WORDS words. */
export function cardQuestion(statement: string): string | null {
  const card = statement.replace(/\s+/g, ' ').trim().replace(/^(?:\*\*)?(?:question|質問)\s*\d*\s*[:：](?:\*\*)?\s*/i, '');
  if (!card || /\$|\\[a-zA-Z]/.test(card)) return null;
  const parts = card.split(/(?<=[.!?。！？])\s+|(?<=[。！？])/).map((x) => x.trim()).filter(Boolean);
  // The run of questions that ends at the card's last one ("Can you tell me a little about your job? What do you do?"); an
  // instruction after it ("Answer with one sentence…") is the reply's to say.
  const last = parts.map((x) => /[?？]$/.test(x)).lastIndexOf(true);
  if (last < 0) return null;
  let first = last;
  while (first > 0 && /[?？]$/.test(parts[first - 1]!)) first -= 1;
  const q = parts.slice(first, last + 1).join(' ');
  return norm(q).length <= SAY_ASK_WORDS ? q : null;
}
/** Task 7z (UNHEARD_ASK_OWED): a question card's question spoken by the runtime, without a lead-in clause the sentence said just before it
 *  already said: "Before we finish, one check question." then the card "Before we finish, can you explain…?" was heard as "Before we
 *  finish" twice (mic test 8, embed-1795115593161, T101). The lead-in is the words before the question's first comma (at most five);
 *  they must all stand, in order, in the last sentence said. Only the runtime's own words change; the card is unchanged. */
export function v2DropSaidLead(question: string, said: string): string {
  const m = /^([^,，、?？]{2,60})[,，、]\s*(\S[\s\S]*)$/.exec(question.trim());
  if (!m) return question;
  const lead = norm(m[1]!);
  if (!lead.length || lead.length > 5) return question;
  const last = said.replace(/<board[\s\S]*?<\/board>/g, ' ').trim().split(/(?<=[.!?。！？])\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).pop() ?? '';
  if (!` ${norm(last).join(' ')} `.includes(` ${lead.join(' ')} `)) return question;
  const rest = m[2]!;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}
export function unsaidAsk(statement: string, sentences: string[], opts: { questionOnce?: boolean; lookAtBoard?: string } = {}): string | null {
  const card = statement.replace(/\s+/g, ' ').trim();
  if (!card || !sentences.length) return null;
  // Task 7m (QUESTION_ONCE, mic test 4 flag 5a): the card's question already heard (said where the card stands, or by the
  // model) is not said again after the reply's own lead-in and hint.
  if (opts.questionOnce ?? TUTOR_V2_QUESTION_ONCE) {
    // Fix round 1 (M10): a short question ("Why?", "True or false?") counts as said only as a whole sentence of its own: "That's
    // why we test it." does not say "Why?".
    const q = cardQuestion(card); const qw = q ? norm(q).join(' ') : '';
    if (q && sentences.some((y) => (norm(q).length >= 3 ? ` ${norm(y).join(' ')} `.includes(` ${qw} `) : norm(y).join(' ') === qw && /[?？]\s*$/.test(y)))) return null;
  }
  // A bare instruction is not the question: "Here is a new one. Say yes or no, and say why." was taken as asked, and
  // a nine-year-old heard no question while "Does the bulb light up?" sat on the card (demo check, 2026-11-13).
  const cardAbout = about(card);
  // A sentence that carries the card's own expression has put the problem: "Try the vertex of y = x² − 6x + 5." was
  // followed by the card's question read out in full, the equation said twice in one breath (ACT Math, portal-3d431436).
  const squeeze = (x: string) => x.replace(/\s+|\$/g, '').replace(/−/g, '-').toLowerCase();
  const cardText = squeeze(card);
  const sharesExpression = (x: string) => { const t = squeeze(x); for (let i = 0; i + 6 <= t.length; i++) { const piece = t.slice(i, i + 6); if (/\d/.test(piece) && /[=+\-<>^²³/]/.test(piece) && cardText.includes(piece)) return true; } return false; };
  const bare = (x: string) => !/[?？]/.test(x) && !sharesExpression(x) && [...about(x)].filter((w) => cardAbout.has(w)).length < 2;
  const asking = sentences.slice(-2).filter((x) => asksAloud([x]));
  if (asking.length && !asking.every(bare)) return null;
  const parts: string[] = []; let cur = ''; let inMath = false;
  for (let i = 0; i < card.length; i++) {
    const ch = card[i]; cur += ch;
    if (ch === '$') inMath = !inMath;
    if (!inMath && /[.!?]/.test(ch) && (i + 1 >= card.length || card[i + 1] === ' ')) { parts.push(cur.trim()); cur = ''; }
  }
  if (cur.trim()) parts.push(cur.trim());
  // A card in parts "(a) … (b) …" asks in the line above them.
  const firstPart = parts.findIndex((x) => /^\(?[a-e]\)\s/i.test(x));
  // The ask is the card's last question, with any instruction after it that was not already said ("Does the bulb
  // light up? Say yes or no, and say why."); without a question, its last sentence.
  const lastQ = parts.map((x) => /[?？]/.test(x)).lastIndexOf(true);
  const saidAlready = (x: string) => sentences.some((y) => norm(y).join(' ') === norm(x).join(' '));
  const ask = firstPart > 0 ? parts.slice(0, firstPart).join(' ') : firstPart === 0 ? card : lastQ >= 0 ? parts.slice(lastQ).filter((x, i) => i === 0 || !saidAlready(x)).join(' ') : parts[parts.length - 1];
  const askWords = [...about(ask)];
  const shared = (sentence: string, words: string[]) => { const w = about(sentence); return words.filter((x) => w.has(x)).length; };
  if (askWords.length && sentences.slice(-3).some((x) => shared(x, askWords) / askWords.length >= 0.6)) return null;
  const short = (x: string) => norm(x).length <= SAY_ASK_WORDS && (x.match(/\d+(?:\.\d+)?/g) ?? []).length <= 5;
  const cardWords = [...about(card)];
  const told = sentences.some((x) => shared(x, cardWords) >= 2);
  if (!told && norm(card).length <= SAY_WHOLE_CARD_WORDS && (card.match(/\d+(?:\.\d+)?/g) ?? []).length <= 5) return card;
  return short(ask) ? ask : opts.lookAtBoard ?? 'Have a look at it on the board, and tell me what you think.';
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

/** The longest sentence card, and the most options of a menu, that are read out: longer is for reading. */
const SAY_SENTENCE_WORDS = 30;
const SAY_OPTIONS = 6;
const SAY_OPTION_WORDS = 12;
const OPTION_LINE = /^\s*\(?(\d{1,2})[.)]\s+(\S.*)$/;
/** Mathematics or markup is the board's to show; a voice reading LaTeX helps nobody (keep today's behaviour there). */
const HAS_MARKUP = /\$|\\[a-zA-Z]/;
/** An ask about saying a sentence ("Please say it back to me.", "Try the sentence again."), or about picking an option. */
const ABOUT_SENTENCE = /\b(?:say|repeat|read|try|practi[sc]e|copy)\b[^.?!]*\b(?:it|this|that|these|sentence|one|again|back|aloud|after me)\b|\bsentence\b|もう一度|言って|読んで/i;
/** A choice question: asks the learner to pick among options, not any "which" ("Which step is hardest?" under a numbered
 *  steps note is a question about the steps; reading them out as a menu answered nothing, final review M5). Covers a
 *  menu asked as "What would you like to practise?" or "Would you like words or a sentence?", which the bare keyword
 *  list missed. */
const ABOUT_OPTIONS = /\bwhich(?: one| of (?:these|them|those|the \w+))?\s*\?|\bwhich\b(?: one| of (?:these|them|those))?[^.?!]*\b(?:would you|do you|shall|should we|want|like|prefer|choose|pick|start|try)\b|\b(?:choose|pick|select)\b|\b(?:the|a|its) number\b|\boptions?\b|\bwould you (?:like|prefer|rather)\b[^.?!]*\bor\b|\bwhat would you like to (?:practi[sc]e|do|try|work on|start with|focus on)\b|どれ|どちら|番号/i;
/** Task 8g fix round 1 (I5): a question asking the learner to pick among options (ABOUT_OPTIONS), or one holding a numbered menu of two
 *  options or more ("1) words, 2) a sentence, 3) …"). Shape only. */
export function v2AsksToChoose(question: string): boolean {
  return ABOUT_OPTIONS.test(question) || (question.match(/(?:^|[\s(])\d{1,2}[.)]\s/g) ?? []).length >= 2;
}

/** In a spoken lesson, a sentence card or a numbered list of options the reply asks the learner to act on must also be
 *  heard (D2, gdi-on-v2 Task 6): "Which one would you like? Just say the number." went with a menu only on the board
 *  (real-run-B t49), and "Please say it back to me." with the sentence only on the board drew "What sentence do you want me
 *  to say?" (upper-int t61). Given this reply's board calls and its spoken sentences, this returns the words still to
 *  be said: the sentence as it stands, or the options as "1, …; 2, …". Null when the reply asks nothing, when the spoken
 *  words already carry the item (most of its words were said), when the item holds mathematics, or when it is too long
 *  to say. Problem cards are not handled here (unsaidAsk). */
export function unsaidBoardItem(calls: ReadonlyArray<{ name: string; args: Record<string, unknown>; outcome: string }>, sentences: string[], say: { sentences?: boolean } = {}): string | null {
  if (!sentences.length || !asksAnywhere(sentences)) return null;
  const shown = calls.filter((c) => !/^not /.test(c.outcome) || /^not painted again: .*scrolled back/.test(c.outcome));
  const items = shown.map((c) => {
    if (c.name === 'show_sentence' && typeof c.args.sentence === 'string') return { kind: 'sentence' as const, text: c.args.sentence.replace(/\s+/g, ' ').trim() };
    if (c.name === 'annotate' && typeof c.args.text === 'string') {
      const lines = c.args.text.split('\n').map((l) => l.trim()).filter(Boolean);
      const opts = lines.map((l) => l.match(OPTION_LINE)).filter((m): m is RegExpMatchArray => !!m);
      if (opts.length >= 2) return { kind: 'options' as const, text: c.args.text, options: opts.map((m) => ({ n: m[1], what: m[2].replace(/[.;,:]+$/, '').trim() })) };
    }
    return null;
  }).filter((x): x is NonNullable<typeof x> => !!x);
  const item = items[items.length - 1];
  if (!item || HAS_MARKUP.test(item.text)) return null;
  // Task 6e fix round 1 (F5): a sentence card is said where it stands (sentenceCardToSay) or not at all; read after the
  // ask, an example card came out as a non-sequitur (tester A ×4, tester B ×1). `sentences: false` leaves cards out.
  if (item.kind === 'sentence' && say.sentences === false) return null;
  // The item is said after the reply, so only when the reply's last ask is about it: a corrected sentence's card read
  // out after "Now, what did you do last weekend?" lands after a question about something else (review M6).
  const asks = sentences.slice(-2).filter((x) => asksAloud([x]));
  if (!asks.some((x) => (item.kind === 'sentence' ? ABOUT_SENTENCE : ABOUT_OPTIONS).test(x))) return null;
  // Carried already: most of what the item is about was said, or (an item of small words only) all its words were.
  const said = sentences.join(' ');
  const want = [...about(item.text)];
  if (want.length) { const heard = about(said); if (want.filter((w) => heard.has(w)).length / want.length >= 0.6) return null; }
  else if (norm(said).join(' ').includes(norm(item.text).join(' '))) return null;
  if (item.kind === 'sentence') return norm(item.text).length <= SAY_SENTENCE_WORDS ? item.text : null;
  const opts = item.options;
  if (opts.length > SAY_OPTIONS || opts.some((o) => norm(o.what).length > SAY_OPTION_WORDS)) return null;
  return `${opts.map((o) => `${o.n}, ${o.what}`).join('; ')}.`;
}

/** A lead-in that hands over to a sentence: the words before the card end in a colon ("The correct sentence is:",
 *  "we say:", "Please use 'people' without 'a':"). */
const LEAD_IN_COLON = /[:：]["'”’)\]]*\s*$/;

/** In a spoken lesson, the words a sentence card written at this point of the reply must also be spoken as (D2 in voice,
 *  Task 6e): the block is lifted out of the speech, so "The correct sentence is: <card> We use 'have worked'…" was heard
 *  as "The correct sentence is: We use…" and the corrected sentence was never said (v2audio tester B, 6 turns). Given
 *  the card's sentence and the words said so far in this reply, this returns the sentence to speak in its place, or
 *  null: when the words before it do not lead into it with a colon (a card after a sentence that already said it, or
 *  one put up beside the talk), when the reply has already said it, or when it holds mathematics. */
/** A lead-in without a colon: a statement that announces a sentence ("Here are two sentences that look similar…",
 *  "I'll put your idea into one sentence with the past simple.") (Task 6e fix round 1, F5: both went unsaid). */
const CARD_LEAD_IN = /\b(?:here (?:is|are)|here's|sentences?|for example|an example|examples|we say|we'd say|you can say|you could say|like this|it (?:would be|becomes)|should be|the correct (?:form|version|one)|put (?:it|that|this|your \w+) (?:into|in))\b|例えば|次の文|こう言います/i;
const lastSentenceOf = (text: string) => text.trim().split(/(?<=[.!?。！？])["'”’」)]*\s+/).filter(Boolean).pop() ?? '';

export function sentenceCardToSay(sentence: string, saidSoFar: string, opts: { leadIn?: boolean; continuing?: boolean } = {}): string | null {
  const s = sentence.replace(/\s+/g, ' ').trim();
  if (!s || HAS_MARKUP.test(s)) return null;
  // `leadIn`: a statement that announces it, or the next card under a lead-in already spoken (`continuing`). Never after
  // words that ask them something: read there, an example card sounded like an answer to its own question (finding B).
  const last = lastSentenceOf(saidSoFar);
  const announced = LEAD_IN_COLON.test(saidSoFar) || (!!opts.leadIn && (!!opts.continuing || (CARD_LEAD_IN.test(last) && !/[?？]/.test(last) && !asksAloud([last]))));
  if (!announced) return null;
  const want = norm(s).join(' ');
  if (!want || norm(saidSoFar).join(' ').includes(want)) return null;
  return /[.!?。！？]["'”’)]*$/.test(s) ? s : `${s}.`;
}

/** Task 6f: the most example sentences of a note or table said where it stands, and their most words together. */
const NOTE_SAY_MAX = 4;
const NOTE_SAY_WORDS = 45;
/** A line or cell that is an English sentence to say: a capital, a full stop or "!", no gap to fill ("I have ? here"), no
 *  arrow ("work → have worked"), no letters outside English. A form line ("have / has + past participle") is not one. */
const SAYABLE = (x: string) => /^[A-Z]/.test(x) && /[.!]["'”’)]*$/.test(x) && !/[?？→_]|\.\.\.|…/.test(x) && !HAS_MARKUP.test(x) && /^[\x20-\x7E’‘“”—–]+$/.test(x) && norm(x).length >= 3;

/** The example sentences of a note or a table block, in order: each line of a note (a list marker taken off, a label
 *  before a colon taken off when what follows is a sentence, a gloss in brackets at its end left out), each cell of a
 *  table. Not a numbered menu (two option lines or more): unsaidBoardItem reads those. */
export function exampleSentencesOf(kind: string, body: string): string[] {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  if (kind === 'note' && lines.filter((l) => OPTION_LINE.test(l)).length >= 2) return [];
  const pieces = kind === 'note' ? lines : kind === 'table' ? lines.flatMap((l) => l.split('|')) : [];
  const out: string[] = [];
  for (const raw of pieces) {
    let x = raw.replace(/^\s*(?:[-*•・]|\d{1,2}[.)])\s+/, '').trim().replace(/\s*[(（][^()（）]*[)）]\s*$/, '').trim();
    const labelled = x.match(/^[^:：]{1,40}[:：]\s*(.+)$/);
    if (labelled && SAYABLE(labelled[1]!.trim())) x = labelled[1]!.trim();
    if (SAYABLE(x) && !out.some((y) => norm(y).join(' ') === norm(x).join(' '))) out.push(x);
  }
  return out;
}

/** Words that point at what is on the board: before the block ("Now let's look at the two tenses you just used.") or as
 *  the lead-ins of sentenceCardToSay. */
const BOARD_POINTER = /\b(?:let'?s (?:look|have a look|take a look) at|(?:look|looking) at (?:the|these|this|those)|on the board|the (?:form|rule|pattern)s?\b)|ここにある|ここの文|これらの文|次の(?:文|例)|例文/i;
/** A sentence just after the block that points back at its sentences ("ここにある文を、ひとつずつ読んでみてください。",
 *  "Read these sentences aloud."): the sentences are said before it. */
const POINTS_BACK = /\b(?:these (?:sentences|examples|lines)|the sentences (?:here|on the board|above)|(?:read|say) (?:them|these|each(?: one)?)\b|one by one|on the board)\b|ここにある|ここの文|この文|これらの文|ひとつずつ|一つずつ/i;
export function pointsBackAtBoard(sentence: string): boolean { return POINTS_BACK.test(sentence); }

/** In a spoken language lesson, the example sentences of a note or a table to speak where the block stands (Task 6f): the
 *  block is lifted out of the speech, and three lead-ins pointed at sentences never said ("Here is the form, and then
 *  I'll ask you a question." over a note; "Now let's look at the two tenses you just used." over a table; a note followed
 *  by "ここにある文を、ひとつずつ読んでみてください。"). `announced`: the words before it lead into it (a colon, a lead-in
 *  as for a sentence card, or words pointing at the board), not a question; otherwise the words are to be said only if
 *  the next sentence points back at them. Null when it has no example sentence not already said, or too many to say. */
export function noteSentencesToSay(kind: string, body: string, saidSoFar: string): { say: string; announced: boolean } | null {
  const said = norm(saidSoFar).join(' ');
  const fresh = exampleSentencesOf(kind, body).filter((x) => !said.includes(norm(x).join(' ')));
  if (!fresh.length) return null;
  const picked: string[] = []; let words = 0;
  for (const x of fresh) { const n = norm(x).length; if (picked.length >= NOTE_SAY_MAX || words + n > NOTE_SAY_WORDS) break; picked.push(x); words += n; }
  if (!picked.length) return null;
  const last = lastSentenceOf(saidSoFar);
  const asking = /[?？]/.test(last) || asksAloud([last]);
  const announced = !asking && (LEAD_IN_COLON.test(saidSoFar) || CARD_LEAD_IN.test(last) || BOARD_POINTER.test(last));
  return { say: picked.join(' '), announced };
}

/** Task 7u (CARD_AT_SENTENCE, mic test 6, embed-1795067373124 at 18.4 min): where a board item of a spoken language lesson goes
 *  (V2ToolCall.timed), given `today`, the sentence it would go with before. A card or note the runtime speaks next ('next') goes
 *  with that sentence, the one about to be sent (`sentences.length`): the summary's cards went up with the paragraph before them,
 *  a sentence early, and each next card's stretch began at the last card's spoken line. A sentence card ('text') goes with the
 *  last sentence since the page turn that quotes it whole. Anything else keeps `today`. Never before `floor`, the latest sentence
 *  an item the reply wrote earlier goes with: the board's order is the order the reply wrote. Pure. */
export function v2TimedItemIndex(item: { name: string; timed?: 'next' | 'text'; text?: string }, sentences: readonly string[], today: number, floor: number, pageTurnAt = 0, floorIsCardLine = false): number {
  if (!item.timed) return today;
  const card = item.name === 'show_sentence' || item.name === 'annotate' || item.name === 'show_table';
  let idx = today;
  if (card && item.timed === 'next') idx = sentences.length;
  // A question card is never placed with the spoken line of the card before it (`floorIsCardLine`): taken for the question's short
  // lead-in, the line "I work in sales." put the check question up a sentence early.
  else if (item.name === 'show_problem' && floorIsCardLine && idx <= floor && floor + 1 < sentences.length) idx = floor + 1;
  else if (item.name === 'show_sentence' && item.text) {
    const want = norm(item.text).join(' ');
    for (let i = sentences.length - 1; want && i >= Math.max(0, pageTurnAt); i--) if (` ${norm(sentences[i]!).join(' ')} `.includes(` ${want} `)) { idx = i; break; }
  }
  return Math.max(idx, floor);
}
