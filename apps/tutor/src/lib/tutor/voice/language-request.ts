// src/lib/tutor/voice/language-request.ts
/**
 * Wave 11 (GDI run 7, 187 s): the tutor explained the scores in Japanese, the
 * student said "Can you please talk in English?", and the tutor answered "Of
 * course, let's continue in English" — and moved on to the summary without
 * ever saying the explanation in English. A request to be spoken to in a
 * session language is a "say that again in <language>" request: the previous
 * turn is restated in that language, the open ask is asked again, and the
 * preference sticks for the rest of the session.
 *
 *  - languageRequestIn: the session language (code) the student asked for, or null;
 *  - languageRequestNoteFirst / languageRequestNote: the brain notes (first turn
 *    carries the previous tutor turn; later turns the short preference).
 * Pure, generic over the session's languages.
 */

const LANGUAGE_WORDS: Record<string, { name: string; latin: string; native?: string }> = {
  en: { name: 'English', latin: 'english', native: '英語で' },
  ja: { name: 'Japanese', latin: 'japanese', native: '日本語で' },
  zh: { name: 'Chinese', latin: '(?:chinese|mandarin)' },
  ko: { name: 'Korean', latin: 'korean' },
  es: { name: 'Spanish', latin: 'spanish' },
  fr: { name: 'French', latin: 'french' },
  de: { name: 'German', latin: 'german' },
  pt: { name: 'Portuguese', latin: 'portuguese' },
  hu: { name: 'Hungarian', latin: 'hungarian' },
  ar: { name: 'Arabic', latin: 'arabic' },
};

export function languageNameOf(code: string): string {
  return LANGUAGE_WORDS[code.toLowerCase().split(/[-_]/)[0]!]?.name ?? code;
}

// Review (wave 11, Critical): "How do you say it in English?" is the most common thing a Japanese learner says in an English
// lesson — a QUESTION about English, never a request to be spoken to in it. The detector works per CLAUSE and accepts
// three shapes only: (a) the language alone with "in" / "please" / a leading "sorry"; (b) "can/could/would/will you
// <speak|talk|explain (that)|say that (again)|repeat that|continue|go on|do that> (in) <language>"; (c) the same verbs as
// an imperative. A clause with a question word (how / what / which / do you / is this …) never counts, and a verb that
// takes an object other than that/it/this ("repeat the English word", "teach me English words") never counts.
const CLAUSE_SPLIT = /[,.;:!?，。、！？]+/;
const FILLER_RE = /\b(?:um+|uh+|er+|erm|ah+|hmm+|well|okay|ok)\b/gi;
const QUESTION_RE = /\b(?:how|what|which|when|why|who|whom|whose|do you|does|did you|is it|is this|is that|are you|are these)\b/i;
const REQ_VERB = '(?:speak|talk|explain(?:\\s+(?:that|it|this))?|say\\s+(?:that|it|this)(?:\\s+again)?|repeat\\s+(?:that|it|this)|continue|go\\s+on|do\\s+(?:that|it|this))';
const LEAD = '(?:sorry|excuse me)';
const NATIVE_VERB = '(?:話して|言って|説明して|やって|続けて|お願い)?(?:ください|お願いします|もらえますか|いただけますか|くれますか|ね|よ)?';
const NATIVE_LEAD = '(?:すみません|えっと|あの|ちょっと)?';

function clausesOf(text: string): string[] {
  return text.split(CLAUSE_SPLIT).map((c) => c.replace(FILLER_RE, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
}

/** The session language the student asks to be spoken to in (its code from `sessionLanguages`), or null. An engine
 *  directive (bracketed) is never a request. */
export function languageRequestIn(studentText: string | null | undefined, sessionLanguages: readonly string[]): string | null {
  const t = (studentText ?? '').trim();
  if (!t || /^\s*\[/.test(t)) return null;
  const clauses = clausesOf(t.toLowerCase());
  for (const raw of sessionLanguages) {
    const code = raw.toLowerCase().split(/[-_]/)[0]!;
    const w = LANGUAGE_WORDS[code];
    if (!w) continue;
    const L = w.latin;
    const shortRe = new RegExp(`^(${LEAD})?\\s*(please)?\\s*(in)?\\s*${L}\\s*(please)?$`, 'i');
    const askYouRe = new RegExp(`^(?:please\\s+)?(?:can|could|would|will)\\s+you\\s+(?:please\\s+)?${REQ_VERB}\\s+(?:(?:to|with)\\s+me\\s+)?(?:again\\s+)?(?:in\\s+)?${L}(?:\\s+please)?$`, 'i');
    const imperativeRe = new RegExp(`^(?:please\\s+)?${REQ_VERB}\\s+(?:(?:to|with)\\s+me\\s+)?(?:again\\s+)?(?:in\\s+)?${L}(?:\\s+please)?$`, 'i');
    const nativeRe = w.native ? new RegExp(`^${NATIVE_LEAD}\\s*${w.native}${NATIVE_VERB}$`) : null;
    for (let i = 0; i < clauses.length; i++) {
      const c = clauses[i]!;
      if (nativeRe && nativeRe.test(c.replace(/\s+/g, ''))) return code;
      if (QUESTION_RE.test(c)) continue;
      const m = c.match(shortRe);
      if (m) {
        // the language alone needs a marker: "in …", "… please", a leading "sorry", or a previous clause that is one
        if (m[1] || m[2] || m[3] || m[4]) return code;
        if (i > 0 && /^(?:sorry|excuse me|please)$/.test(clauses[i - 1]!)) return code;
        if (i + 1 < clauses.length && /^please$/.test(clauses[i + 1]!)) return code;
        continue;
      }
      if (askYouRe.test(c) || imperativeRe.test(c)) return code;
    }
  }
  return null;
}

const PREV_CAP = 700;

/** The note for the turn the request arrives on: restate the previous turn in that language, then re-ask; sticky. */
export function languageRequestNoteFirst(code: string, previousTutorTurn: string | null | undefined): string {
  const name = languageNameOf(code);
  const prev = (previousTutorTurn ?? '').replace(/\s+/g, ' ').trim();
  const shown = prev.length > PREV_CAP ? `${prev.slice(0, PREV_CAP)}…` : prev;
  return `[Language request — the student asked you to use ${name}] First say again in ${name} what your previous turn said — its content (any scores, the explanation, the question), in at most two sentences, not word for word — then ask the open question again. From now on in this session use ${name} for explanations, instructions and feedback too; use the other session language only when the student asks for it.${supportLine(code)}${shown ? ` Your previous turn was: "${shown}"` : ''}`;
}

/** The short preference note for every later turn of the session. */
export const LANGUAGE_REQUEST_NOTE = (name: string, extra = ''): string =>
  `[Language preference] The student asked for ${name}: give explanations, instructions and feedback in ${name}.${extra}`;

/** Review m7: after an English request the typed turn's Japanese support slot stays empty. */
function supportLine(code: string): string {
  return code === 'en' ? ' Leave support_ja empty.' : '';
}

export function languageRequestNote(code: string): string {
  return LANGUAGE_REQUEST_NOTE(languageNameOf(code), supportLine(code));
}
