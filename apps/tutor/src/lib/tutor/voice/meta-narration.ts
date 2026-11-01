/**
 * Round-7++ meta-narration filter, extracted from the brain orchestrator so
 * it can be tested directly.
 *
 * The system prompt already forbids speaking internal reasoning, but the
 * brain leaks it regularly; orchestrator-side filtering is the safety net.
 *
 * TWO rules, and the second is why this module exists. The phrase rule
 * (moved verbatim) matches known leak wordings. The STRUCTURAL rule matches
 * XML/HTML-ish markup in a spoken sentence: portal-704e3e01 @1027.9s spoke a
 * whole `<result>…</result>` block to the student because it contained none
 * of the phrases — the filter had no notion that markup is never speech.
 * Structure is the durable signal; phrase lists only ever catch the leaks
 * someone already saw.
 *
 * Generic patterns only — no subject content.
 *
 * Pure module — no side effects, never throws.
 */

// The phrase-start rule as it stood before the 2026-10-03 round: EVERY sentence
// opening "The system …" / "The runtime …" is dropped. Used when
// NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES is `off`.
const PHRASE_START_LEGACY_RE =
  /^\s*(?:the student\b|the active problem\b|let me mark\b|since the student\b|the runtime\b|the system\b|that'?s? a greenlight\b|re-?checking my\b)/i;

// 2026-10-03 (narrowed 10-04): "The system …" / "The runtime …" are also
// lesson content — a system OF equations, an algorithm's runtime. The
// lookaheads let through only statements that are unmistakably about a system
// of equations; a quantifier alone is not enough ("The system has no record of
// your answer." is a leak), so each exemption needs an equations / solutions
// context word:
//   · "the system of [≤3 modifiers] equations / inequalities";
//   · "the system above / below" + a verb (has, is, gives, …);
//   · "the system has <no | one | exactly one | infinitely many | a unique …>
//     solution(s) / equations / unknowns / variables";
//   · "the system is <consistent | inconsistent | dependent | independent>"
//     (not "… consistent about / with / in …");
//   · "the runtime of …".
// Everything else ("The system flagged …", "The system has marked …", "The
// system is asking …") is still dropped. This narrowing is gated by
// NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES together with the leak shapes below.
const SYS_NOUN = String.raw`(?:solutions?|equations?|inequalit(?:y|ies)|unknowns?|variables?)`;
const SYS_VERB = String.raw`(?:has|have|is|are|was|can|could|will|would|must|should|does|gives?|shows?|represents?|reduces|simplifies|becomes)`;
const SYSTEM_AS_MATHS =
  String.raw`(?!\s+of\s+(?:[\w-]+\s+){0,3}?(?:equations?|inequalit(?:y|ies))\b` +
  String.raw`|\s+(?:above|below)\s+${SYS_VERB}\b` +
  String.raw`|\s+has\s+(?:no|zero|one|two|three|many|only\s+one|exactly\s+\w+|infinitely\s+many|an?\s+infinite\s+number\s+of|a\s+unique|a\s+single)\s+(?:(?:real|unique|distinct|possible|integer)\s+)?${SYS_NOUN}\b` +
  String.raw`|\s+is\s+(?:(?:both|therefore|then|also|not)\s+)?(?:consistent|inconsistent|dependent|independent)\b(?!\s+(?:about|with|in|on|of|at)\b))`;
const PHRASE_START_RE = new RegExp(
  String.raw`^\s*(?:the student\b|the active problem\b|let me mark\b|since the student\b|the runtime\b(?!\s+of\b)|the system\b${SYSTEM_AS_MATHS}|that'?s? a greenlight\b|re-?checking my\b)`,
  'i',
);

const PHRASE_ANYWHERE_RE =
  /\bactive problem\b|\bgreenlight to advance\b|\bmark (?:it|this|the)? *(?:segment )?complete\b|\b(?:current|active) *segment\s*[Ii][Dd]?\b|\bcanonicaltext\b|\btool[_ ]result\b/i;

const SELF_REFERENCE_RE =
  /\bthe student\b|\bno verdict\b|\bisn'?t (?:quite )?an answer\b|\bnot an answer\b|\bmy (?:last|earlier|previous) correction\b|\bmy correction was\b|\bnothing to walk back\b|\bno correction (?:is )?needed\b|\brequest pattern\b|\bclassify (?:away|silently)\b|\bgive (?:her|him|them) (?:room|space)\b|\bautomated review\b/i;

// 2026-08-31 (Haiku observation round): spoken self-audit
// collocations that slipped the lists above — "I need to
// check myself first / my prior turn", "Let me compute:
// 8+8+5+5", "So my 'Not quite' was correct". Colon after
// "compute" is load-bearing: "Let me compute the area
// together" is legitimate teaching and must survive.
// 2026-10-16 (GAC v12/v16): working shown and corrected mid-sentence —
// "…not $10y+5$... wait, let me say it plainly:", "(2u−2)(u+1)/... let's
// check:". A plain admission of a mistake to the student is not this.
const MID_REPLY_SELF_CORRECTION_RE =
  /(?:\.{2,}|…)\s*(?:wait|hmm+|let'?s check|let me (?:check|redo|re-?do|fix|say)|no,|actually)\b|\bwait,\s*let me\b|\blet me say (?:it|that) (?:plainly|again|properly)\b|\bscratch that\b/i;

const SELF_AUDIT_RE =
  /^\s*i need to check\b|\blet me compute:\s|\bmy (?:prior|previous|last) turn\b|\bmy ["'“”]?not quite["'“”]? was\b/i;

// 2026-09-05 (live, portal-51b667f1): the correction-note re-check narrated
// as a sentence — "Let me re-derive this myself before responding." and
// "Let me re-verify that prior problem silently:". The note text already
// forbids it; this is the spoken-text backstop. Anchored to a re-*/verify
// verb AND a private-act marker (myself / silently / before responding /
// first / that prior …) so "Let me verify this with you" survives.
// 2026-09-05 (live probes + portal-51b667f1): the brain classifying the
// student's turn aloud ("That's a request, not an attempt at this one yet",
// "That's session-end, no math needed here") and third-person planning about
// the student ("Let me support them concretely"). Both are the verdict
// layer's reasoning leaking into speech.
const TURN_CLASSIFYING_RE =
  /^\s*that'?s (?:a |an )?(?:request|question|greeting|statement|session-?end|non-?answer|meta)\b[^.!?]{0,40}\bnot (?:an? )?(?:attempt|answer)\b|^\s*that'?s session-?end\b|\bno (?:math|grading|verdict) needed\b/i;
// GDI starter session 2026-10-15 (embed-1792105245704): the model voiced
// its persona instructions as the turn's first sentence — "Ryota's rule
// applies here: no second full farewell beyond acknowledgment.", "Ryota's
// style: gentle pace, one catchphrase max, no re-greeting." A name's
// rule/style/persona label, or the instruction vocabulary itself, is never
// said TO a student.
const PERSONA_DIRECTIVE_RE =
  /^\s*[A-Z][\w-]*'s (?:rule|rules|style|persona|voice|catchphrase|guidelines?)\b|\bcatchphrase max\b|\bno re-greeting\b|\bbeyond acknowledg(?:e)?ment\b|\bsecond full farewell\b/i;

// GDI starter session 2026-10-16 (embed-1792125283926): the verdict layer's
// reasoning spoken in English to a beginner — "This matches what's on the
// board — …", "That's an attempt at this turn's open question — …", "That
// matches Pattern 2's expected answer …" — and bare English fillers as a
// whole sentence ("Let's see this together.", "Okay, let's see."). The
// filler is caught only when it IS the whole sentence; "Let's see what
// happens if…" is teaching and survives.
// 2026-10-18 (GDI embed-1792356364051): the same reasoning in Japanese —
// 「これは質問ですね — 答えではなく、もう一度同じ形を繰り返していますよ。」 (the
// turn-shape verdict read to the student). Whole-sentence openers only.
const VERDICT_NARRATION_JA_RE =
  /^\s*(?:これ|それ)は(?:質問|答え|繰り返し|同じ形)ですね\s*[—–、,]|同じ形を繰り返してい?ますよ?/;
const VERDICT_NARRATION_RE =
  /\bthis turn['’]?s\b|^\s*(?:this|that) matches (?:what['’]?s on the board|the (?:expected|target)\b)|\bexpected answer\b|^\s*that['’]?s an attempt at\b|^\s*that answers\b/i;
// embed-1792199116313: "Let me verify the card is there before scribbling." —
// a tool-use plan read aloud.
const TOOL_PLAN_SPOKEN_RE =
  /^\s*let me (?:just )?(?:verify|check|confirm|make sure)\b[^.!?]*\b(?:card|scribbl\w*|render\w*|tool|snapshot)\b|\bbefore (?:scribbling|rendering|drawing on the board)\b/i;
// embed-1792196208833: "Okay. let me think about that for a second." opened a
// Japanese explanation. Whole-sentence only, like the fillers below.
const THINK_FILLER_RE =
  /^\s*(?:(?:ok(?:ay)?|alright|all right|hmm|so)[,.]?\s+)?let me (?:just )?think(?: about (?:that|this|it))?(?: for a (?:second|sec|moment|bit))?[.!]?\s*$/i;
// embed-1792174263669 (2026-10-16): the filler came back reworded on almost
// every turn — "Let's see what you've got.", "Okay, let's hear what you've
// got.", "Let's see where this is.", "Let's see what's going on.", and the
// Japanese 「はい、少し見てみましょう。」. Still whole-sentence only.
const BARE_FILLER_RE =
  /^\s*(?:(?:ok(?:ay)?|alright|all right|right|ah|hmm|so)[,.]?\s+)?let['’]?s (?:see|hear|look|check)(?: at)?(?: (?:this(?: together)?|that|it|here|what you['’]?ve got|what we['’]?ve got|where this is|where we are|what['’]?s going on|what you said))?[.!]?\s*$/i;
// embed-1792185403054: tool names spoken to the learner ("show_passage を使って
// 完成した文を見せます", "show_equationを見てください") and the tutor's plan read
// aloud ("Let me give the correct form directly, kindly, then close this out
// and move on.", "That matches what you said, well done on part two.").
const TOOL_NAME_SPOKEN_RE =
  /(?:^|[^a-z_])(?:show|mark|advance|close|tutor|add|record|flag|expand|propose|hold|set|clear|request|render)_[a-z][a-z_]*/i;
const PLAN_ALOUD_RE =
  /\bclose (?:this|it) out\b|^\s*let me (?:give|just|now|quickly|first)\b[^.!?]*\b(?:then|and then)\b|\bthat matches what you said\b/i;
// GDI trial run 2 (2026-10-29): a runtime note about the lesson read aloud —
// "The level-check segment still needs a few more answers, and …" and "Let me
// show you one sentence card for the next step." Three shapes: a named segment's
// progress ("the <name> segment still needs / is done / comes next …" — never
// "the line segment"), the runtime's own nouns (sentence card, segment card,
// runtime note, lesson pointer), and an announced card ("I'll show the
// corrected sentence", "Let me show you one sentence card"). Review 2026-10-29:
// no bare "should"/"must"/"card" — "The red segment must be longer", "I'll show
// you a card from the deck" are teaching sentences. A sentence carrying a real
// correction is dropped with it: the card and the next sentence re-deliver it.
const RUNTIME_NOTE_NARRATION_RE =
  /\b(?:the|this) (?!line\b)[\w-]+ segment (?:still needs|has run|needs (?:a few|more) (?:answers|turns|questions)|is (?:over|complete|done|finished)|comes next)\b|\b(?:sentence card|segment card|runtime note|lesson pointer)\b|^\s*(?:I[’']?ll|Let me) show (?:you )?(?:the |one |a )?(?:corrected sentence|sentence card|segment card)\b/i;
// GDI run 4 (2026-10-29): "Those runtime notes are a mix, so let me just say
// it plainly." and "Let me put a quick hook on the board first." — the
// runtime's notes and the board staging read aloud. "Put the sentence on the
// board" is dropped too (the auto card already writes it); "Look at the
// sentence on the board." survives. A bare "these notes are …" is only
// dropped when it talks about the notes being mixed/unclear (a lesson can
// have real notes). "system note" alone stays ("A system note in the log
// shows the error." is a real sentence) — only the plural or those/these.
const BOARD_STAGING_NARRATION_RE =
  /\bruntime notes?\b|\b(?:those|these) system notes?\b|\bsystem notes\b|\bput (?:a|the|one) (?:quick )?(?:hook|card|sentence) on the board\b|^\s*(?:those|these|the) (?:runtime |system )?notes (?:are|were) (?:a mix|mixed|conflicting|unclear|confusing|contradictory)\b/i;
// Task 20 §C (GDI run 8, 2026-10-30): idle-nudge turns spoke the plan —
// "The question was about the present perfect, so I'll ask the next
// present-perfect question about their work.", "So I'll acknowledge briefly
// and hand the question back.", "Thanks, I heard you.", "Here is a new
// question, and I'll put it on the board. Here is the question on the board."
// Fix round 1 (I4): only on runtime-triggered turns (isMetaNarration
// opts.runtimeTriggered — a nudge / runtime directive, never the student).
// Fix round 2 (I4): runtime turns also TEACH (the fixed-script continue
// directive) — the plan CLAUSE goes, the content stays: "So I'll keep going
// with fractions: what is 1/2 + 1/4?" → "What is 1/2 + 1/4?"; "Here is the
// next equation, 3x - 5 = 10, and I'll put it on the board." → "Here is the
// next equation, 3x - 5 = 10." A sentence is dropped whole only when nothing
// substantive follows the plan clause (stripNudgePlanClause → '').
const NUDGE_PLAN_OPENER_RES: RegExp[] = [
  /^\s*(?:(?:so|ok(?:ay)?|right|alright),?\s*)?I['’]ll (?:acknowledge|hand\b[^.!?:]*?\bback|re-?ask|ask the next|keep going with)\b/i,
  /^\s*The (?:student|learner) (?:was|is|asked|said|wants|needs)\b[^.!?:]*?\b(?:so|therefore) I['’]ll\b/i,
  /^\s*The (?:question|student|learner|answer|last question) (?:was|is|asked|said|wants|needs)\b[^.!?:]*?\b(?:so|therefore) I['’]ll\b[^.!?:]*?\babout their\b/i,
  /^[^.!?:]*?\bI may have missed your answer\b/i,
  /^\s*Thanks, I heard (?:you|your answer|that)[.!]?\s*$/i,
  /^\s*(?:I['’]ll put (?:it|this|that|the question) on the board|Here is the question on the board)\b/i,
];
const PLAN_CLAUSE_SEPARATOR_RE = /:\s+|,\s+|\s[—–]\s+/g;
/** Text after a plan clause is worth keeping: a question, a sum / number, a
 *  quote, or at least four more words. */
function substantiveRest(rest: string): boolean {
  const r = rest.trim();
  if (!r) return false;
  if (/[?？]/.test(r) || /\d/.test(r) || /[=+×÷]/.test(r) || /["“「‘]/.test(r)) return true;
  return (r.match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []).length >= 4;
}
const TRAILING_BOARD_CLAUSE_RE = /,?\s*and I['’]ll put (?:it|this|that|the question) on the board\s*[.!]?\s*$/i;
/** The head left after a trailing "…, and I'll put it on the board." clause is
 *  kept only when it carries content (a number, a sum, a quote, a question). */
function substantiveHead(head: string): boolean {
  const h = head.trim();
  return /[?？]/.test(h) || /\d/.test(h) || /[=+×÷]/.test(h) || /["“「‘]/.test(h) || (h.match(/[\p{L}\p{N}]+/gu) ?? []).length >= 6;
}
const capitaliseFirst = (x: string) => x.replace(/^(\s*["“「‘(]?)(\p{Ll})/u, (_m, a: string, b: string) => a + b.toUpperCase());
/**
 * A runtime turn's sentence with its spoken plan clause removed: unchanged when
 * there is none, the content after the clause when there is some, '' when the
 * whole sentence is plan.
 */
export function stripNudgePlanClause(sentence: string): string {
  const s = sentence ?? '';
  const trailing = TRAILING_BOARD_CLAUSE_RE.exec(s);
  if (trailing && trailing.index > 0) {
    const head = s.slice(0, trailing.index).replace(/[,\s]+$/, '');
    if (!NUDGE_PLAN_OPENER_RES.some((re) => re.test(head))) return substantiveHead(head) ? `${head}.` : '';
  }
  for (const re of NUDGE_PLAN_OPENER_RES) {
    const m = re.exec(s);
    if (!m) continue;
    const from = m.index + m[0].length;
    PLAN_CLAUSE_SEPARATOR_RE.lastIndex = from;
    for (let sep = PLAN_CLAUSE_SEPARATOR_RE.exec(s); sep; sep = PLAN_CLAUSE_SEPARATOR_RE.exec(s)) {
      const rest = s.slice(sep.index + sep[0].length);
      if (substantiveRest(rest)) return capitaliseFirst(rest.trim());
    }
    return '';
  }
  return s;
}
// Task 21 §A (GDI run 9, 2026-10-30): a runtime note cited aloud on a
// STUDENT turn — 88 s "The pace preference says to slow down, so I'll stay on
// this one idea and check their understanding before moving on. Ryota here."
// The plan shapes above are runtime-turn only (Task 20); these cite the notes
// themselves and never carry teaching, so they apply on EVERY turn. Only a
// colon / quote continuation keeps its content ("The lesson note says: what
// is your job?" → "What is your job?") — a ", so I'll …" tail is more plan.
// A bare "<Name> here." self-announcement goes too — fix round 1: ONLY the
// session persona's own name (opts.personaName; without one the rule is off),
// so "Careful here!", "Same here.", "Five here." are never touched.
// Fix round 1 (m): "I'll stay on this one idea: what is 3 + 4?" keeps the
// question, like the note opener; a continuation that would START with a
// quote ('… says the word "because" is useful') leaves the sentence as it is.
const NOTE_CITING_OPENER_RE =
  /^\s*The (?:pace|level|lesson|plan|persona|runtime|system|teacher) (?:preference|note|pointer|setting|directive|guidance)s? (?:says?|tells?|asks?|wants?)\b/i;
const STAY_ON_ONE_IDEA_RE = /\bI['’]ll stay on this one idea\b/i;
const NOTE_CITATION_CONTINUATION_RE = /:\s+|\s(?=["“「])/g;
const escapeName = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function isPersonaSelfAnnounce(s: string, personaName: string | readonly string[] | null | undefined): boolean {
  const names = (Array.isArray(personaName) ? personaName : [personaName]).map((n) => (n ?? '').trim()).filter((n) => n.length >= 2 && n.length <= 60);
  return names.some((n) => new RegExp(`^\\s*${escapeName(n)} here[.!]?\\s*$`, 'i').test(s));
}
// Task 22 §C (GDI run 10, 299 s SPOKEN): `Ryota explains: "I have worked at
// Nagoya Corporation for three years" is the natural form when speaking.` — the
// persona narrating itself in the third person. A sentence that OPENS with
// "<persona name> explains / says / notes / … [:,]" loses that lead and keeps
// the rest; a sentence that is only the lead goes. Persona names only
// (opts.personaName; off without one) — "Ken says hello." is never touched.
const PERSONA_LEAD_VERBS = '(?:explains|says|notes|adds|replies|responds|continues|answers|asks|suggests)';
// Fix round 1 (m6): "Ryota asks you to say it once more." / "Ryota suggests
// that we …" — asks / suggests take an object; their lead goes only before a
// colon / comma or a quote.
const PERSONA_LEAD_OBJECT_VERBS_RE = /^(?:asks|suggests)$/i;
function stripPersonaLead(s: string, personaName: string | readonly string[] | null | undefined): string {
  const names = (Array.isArray(personaName) ? personaName : [personaName])
    .map((n) => (n ?? '').trim()).filter((n) => n.length >= 2 && n.length <= 60)
    .sort((a, b) => b.length - a.length);
  for (const n of names) {
    if (new RegExp(`^\\s*${escapeName(n)}\\s+${PERSONA_LEAD_VERBS}\\s*[:,.!]?\\s*$`, 'i').test(s)) return '';
    const m = new RegExp(`^\\s*${escapeName(n)}\\s+(${PERSONA_LEAD_VERBS})([:,])?\\s+`, 'i').exec(s);
    if (m) {
      const rest = s.slice(m[0].length);
      if (PERSONA_LEAD_OBJECT_VERBS_RE.test(m[1]!) && !m[2] && !/^["“「‘]/.test(rest)) return s;
      return capitaliseFirst(rest);
    }
  }
  return s;
}
// Task 22 §D1 (GDI run 10, 1138 s): plan narration and note citation on the
// segment-close turn — "Let me close out the pronunciation part and move to
// the summary." / "…, so I'll keep that point in mind." Whole-sentence
// shapes (nothing kept); the part / section / segment / step noun is required
// so "Let me finish this sentence and move to the next one" style teaching is
// untouched, and a student-facing "Keep that point in mind …" has no "so I'll".
const CLOSE_PART_NARRATION_RE =
  /^\s*Let me (?:close out|wrap up|finish(?: up)?|round off) (?:the|this) \w+(?: \w+)? (?:part|section|segment|step)(?: now)?,? and (?:move|go|get) (?:on )?to\b/i;
const KEEP_IN_MIND_TAIL_RE =
  /,?\s*\bso I['’]ll keep (?:(?:that|this|it)(?: point| in mind| noted)|that (?:point )?in mind)\b[^.!?]*[.!]?\s*$/i;
/** Fix round 1 (m7): a head that speaks TO the student ("You prefer short
 *  sentences, so I'll keep that in mind.") keeps its head; only the tail goes. */
function stripKeepInMindTail(s: string): string | null {
  const m = KEEP_IN_MIND_TAIL_RE.exec(s);
  if (!m) return null;
  const head = s.slice(0, m.index).trim();
  // quoted words ("for" and "our" as the sounds to work on) are not address
  if (!head || !ADDRESSES_STUDENT_RE.test(head.replace(/["“「‘][^"”」’]*["”」’]/g, ' '))) return '';
  return `${head.replace(/[,;:\s]+$/, '')}.`;
}
// Task 23 §H (GDI run 11, 555 s SPOKEN: `Their sentence, "I met a customer
// from the USA last year," is correct, but the question on the board is still
// about business events, so I'll bring that back. The question I'm asking now
// is: did you attend …?`). H1: the learner named in the third person at the
// start of a sentence about their sentence / answer / words / reply is
// addressed — "Their sentence" → "Your sentence", "The student's answer" →
// "Your answer"; the rest is kept. H2: a plan tail ", so I'll bring that
// back …" goes (the head stays), and a "The question I'm asking now is:" /
// "So / Now the question is:" lead goes (the question stays).
// Fix round 1 (m10) / fix round 2 (m2): only about the student's own output —
// the noun is followed by is / has / sounds / reads / means / needs / works or
// a quote; descriptive was / were / are ("Their reply was quick, so you won
// the contract.") and "Their answer arrived by email." stay.
const THIRD_PERSON_LEARNER_LEAD_RE = /^(\s*)(?:Their|The student['’]s|The learner['’]s) (sentence|answer|words|reply)\b(?=\s+(?:is|has|sounds|reads|means|needs|works)\b|\s*,\s*["“])/i;
const BRING_BACK_TAIL_RE = /,?\s*\bso I['’]ll bring (?:that|it|this) back\b[^.!?]*[.!?]?\s*$/i;
const QUESTION_LEAD_RE = /^\s*(?:The question I['’]m asking (?:you )?now is|(?:So|Now),? the question is)\s*:\s*/i;
// Task 24 §A5 (GDI run 12, 1092 s / 1168 s SPOKEN: "The transcript shows only
// the sentence itself, so I can check the words but not how they sounded.",
// "The last resort says the sentence wasn't captured …"): the capture /
// scoring pipeline narrated aloud. A transcript sentence needs shows / says /
// only after it ("Please write the transcript of the meeting." stays).
const CAPTURE_NARRATION_RE = /\btranscript\b[^.!?]*\b(?:shows?|says?|only)\b|\b(?:wasn'?t|was not|isn'?t|not) captured\b|\bthe last resort\b/i;
// Fix round 1 (m-2): "I can check the words but not how they sounded." is
// capture narration; "I can hear your th sounds clearer." is feedback. The
// first-person check clause counts only when NEGATED (can't / cannot /
// couldn't / could not / can … but not) or when the sentence also names the
// capture (transcript / recording / captured / last resort).
const CAPTURE_CHECK_CLAUSE_RE = /\bI (?:can(?:'t|not)?|cannot|could(?:n'?t| not)?) (?:check|hear|tell|judge|score)\b[^.!?]*\b(?:words|sound(?:ed|s)?)\b/i;
const CAPTURE_CHECK_NEGATED_RE = /\bI (?:can'?t|cannot|can not|couldn'?t|could not) (?:check|hear|tell|judge|score)\b|\bI can (?:check|hear|tell|judge|score)\b[^.!?]*\bbut not\b/i;
const CAPTURE_WORD_RE = /\b(?:transcript|recording|captured|last resort)\b/i;
function isCaptureNarration(s: string): boolean {
  if (CAPTURE_NARRATION_RE.test(s)) return true;
  return CAPTURE_CHECK_CLAUSE_RE.test(s) && (CAPTURE_CHECK_NEGATED_RE.test(s) || CAPTURE_WORD_RE.test(s));
}
// Task 24 §B1 (GDI run 12, 352 s: `The student said "I have worked …," which
// is correct …` was dropped whole by PHRASE_START_RE and the turn went
// silent): the learner's quoted words named in the third person are
// addressed — "The student said "…"" → "You said "…"". Only before a quote /
// that / it / the; "The student said nothing." is still dropped.
const THIRD_PERSON_SAID_RE = /^(\s*)The (?:student|learner) said\b(?=\s*(?:["“]|that\b|it\b|the\b))/i;
function addressLearner(s: string): string {
  s = s.replace(THIRD_PERSON_SAID_RE, '$1You said');
  let out = s.replace(THIRD_PERSON_LEARNER_LEAD_RE, (_m, sp: string, noun: string) => `${sp}Your ${noun.toLowerCase()}`);
  const tail = BRING_BACK_TAIL_RE.exec(out);
  if (tail && tail.index > 0) out = `${out.slice(0, tail.index).replace(/[,;:\s]+$/, '')}.`;
  const lead = QUESTION_LEAD_RE.exec(out);
  if (lead && out.slice(lead[0].length).trim()) out = capitaliseFirst(out.slice(lead[0].length));
  return out;
}
export interface NoteCitationOpts { /** the session persona's name(s) — full name and first name */ personaName?: string | readonly string[] | null }
/**
 * A sentence that cites a runtime note with the citation removed: unchanged
 * when there is none (or the continuation opens with a quote), the content
 * after a colon when there is some, '' when the whole sentence is citation.
 */
export function stripNoteCitationClause(sentence: string, opts?: NoteCitationOpts): string {
  const raw = sentence ?? '';
  if (isPersonaSelfAnnounce(raw, opts?.personaName)) return '';
  const s = addressLearner(stripPersonaLead(raw, opts?.personaName));
  if (s !== raw && !s.trim()) return '';
  if (CLOSE_PART_NARRATION_RE.test(s)) return '';
  if (isCaptureNarration(s)) return '';
  const keepStripped = stripKeepInMindTail(s);
  if (keepStripped !== null) return keepStripped;
  const m = NOTE_CITING_OPENER_RE.exec(s) ?? STAY_ON_ONE_IDEA_RE.exec(s);
  if (!m) return s;
  NOTE_CITATION_CONTINUATION_RE.lastIndex = m.index + m[0].length;
  const sep = NOTE_CITATION_CONTINUATION_RE.exec(s);
  if (sep) {
    const rest = s.slice(sep.index + sep[0].length);
    if (/^\s*["“「]/.test(rest) || !sep[0].startsWith(':')) return s;
    if (substantiveRest(rest)) return capitaliseFirst(rest.trim());
  }
  return '';
}
const BARE_FILLER_JA_RE =
  /^\s*(?:(?:はい|いいですね|では|じゃあ|さて)[、,]?\s*)?(?:少し|ちょっと)?見てみましょう(?:ね|か)?[。！!]?\s*$/;

/** A tag block the model echoed from its input ("<students_said> Hi, today
 *  </students_said> …", same session): the block and any stray tag go, the
 *  rest of the sentence stays. Only snake_case / lowercase tag names, so
 *  inequalities and maths survive. */
export function stripEchoedTags(sentence: string): string {
  return (sentence ?? '')
    .replace(/<([a-z][a-z_]*_[a-z_]*|[a-z]+_said)>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<\/?[a-z][a-z_]*_[a-z_]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Bare stage labels the model sometimes writes in front of a real sentence
 *  ("*opener* はい、…" — same session). Stripped, the sentence itself kept.
 *  Task 25 §A5 (GDI run 13, 1214 / 1292 / 1336 s): the persona's name written
 *  as a script label ("Ryota: 過去完了を…", "Ryota：「…」") — stripped ONLY when
 *  the persona's names are known and the label is one of them
 *  (case-insensitive, ASCII or full-width colon); the rest is kept.
 *  Fix round 1 (I-1): no capitalised-word fallback — scrubTutorText runs this
 *  on every sentence of every session without names, and "Say: "…"",
 *  "Listen: 「…」", "Remember: "…"" are instructions, never labels. */
export function stripLeakedLabels(sentence: string, personaNames?: string | readonly string[] | null): string {
  const s = (sentence ?? '').replace(/^\s*\*(?:opener|opening|ack|acknowledg(?:e)?ment|verdict|recap|closing|bridge)\*\s*/i, '');
  const names = (typeof personaNames === 'string' ? [personaNames] : (personaNames ?? []))
    .map((n) => (n ?? '').trim()).filter((n) => n.length > 0);
  if (names.length === 0) return s;
  const re = new RegExp(String.raw`^\s*(?:${names.map(escapeRe).sort((a, b) => b.length - a.length).join('|')})\s*[:：]\s*`, 'i');
  const m = re.exec(s);
  if (m && s.slice(m[0].length).trim()) return s.slice(m[0].length);
  return s;
}

// Task 25 §A1–A4 (GDI run 13): directive echo ("Keep it brief and use
// Japanese for the explanation, as the session asks."), third-person plan
// anywhere ("…, so I'll ask them to finish it."), board narration ("The board
// already shows the model sentence.", "That sentence is already on the
// board.") and a retry narrating its own continuation ("Here is the rest of
// the summary."). Whole-sentence drops. "I'll ask you …", "Let's put it on
// the board.", "Here is the next question." are speech and survive.
const DIRECTIVE_ECHO_RE =
  /\bas the (?:session|lesson|notes?|instructions?|prompt|guidelines?) (?:asks?|says?|requires?|wants?|suggests?)\b|^\s*Keep it (?:brief|short)\b|\b(?:use|in) Japanese for the explanation\b/i;
// Task 27 §D1 (GDI run 14, 840–886 s): a continuation / retry turn SPOKE its
// directive — "Hmm, I need to be careful: the last thing I said was a
// correction, so …", "Confirm plainly and move on: the next question is about
// …, and it's a good moment to ask …". Whole-sentence drops: a first-person
// caution about the tutor's own last turn, an imperative lead with a colon
// (the note's own shape — "Confirm your booking: …" is no tutor sentence),
// "it's a good moment to", and a note-shaped "The next question is about …,
// and it's …". Second-person advice ("Be careful with the article.") and the
// questions themselves survive.
const DIRECTIVE_ECHO_NOTE_RE = new RegExp(
  [
    String.raw`^\s*(?:Hmm,?\s*)?I (?:need|have) to be careful\b`,
    String.raw`\bthe last thing I said was an? \w+\b`,
    // fix round 1 (m-4): not when the text after the colon is a question to the student
    String.raw`^\s*(?:Confirm|Acknowledge|Affirm|Reply|Respond|Answer)(?: plainly| briefly| in one sentence)?(?: and move on)?\s*:(?![^:]*\?\s*$)`,
    String.raw`\bit['’]s a good moment to\b`,
    String.raw`^\s*(?:The|My) next question is about\b[^.!?]*\b(?:and|so) it['’]s\b`,
  ].join('|'),
  'i',
);
// Task 28 §C (GDI run 15, 374 s / 461 s): the idle-nudge turn SPOKE its note
// in its own words — "Acknowledge it briefly, then move on to the next item."
// — and a staging line "The board card is up." went out before a repeat ask.
// Whole-sentence drops: an order to acknowledge / confirm / praise / correct
// "it / that / the answer …" then move on / continue / ask; a bare "move on
// to the next item / question / step / part" order (fix round 1, I-2 —
// below); "The (board) card is up / on the board / ready." "Here's the next
// question." is a fine bridge and is kept.
const NUDGE_ECHO_ORDER_RE =
  /^\s*(?:Acknowledge|Confirm|Affirm|Praise|Correct)\s+(?:it|that|this|the (?:answer|sentence|student|learner))(?:\s+briefly|\s+in one sentence)?\b[^.!?]*\b(?:then|and) (?:move on|continue|go on|ask)\b/i;
// Fix round 1 (I-2): the "move on" drop is for a sentence that is NOTHING but
// the order — "Acknowledge briefly, then move on." / "Then move on to the next
// question." — never one with a subject (you / we / let's / let us / I) or a
// step after it ("Move on to the next step and divide both sides by 2.",
// "Time to move on to the next question." survive).
const ORDER_THEN_MOVE_ON_RE = /^\s*(?:Acknowledge|Confirm|Affirm|Praise|Correct)[^.!?]*\b(?:then|and) (?:move on|continue|go on)\b[^.!?]*[.!]?\s*$/i;
const BARE_NEXT_ITEM_MOVE_RE = /^\s*(?:then,?\s+)?move on to the next (?:item|question|step|part)\s*[.!]?\s*$/i;
const ORDER_HAS_SUBJECT_RE = /\b(?:you|your|we|let['’]?s|let us|us|I|I['’]ll|I will)\b/i;
// Fix round 1 (m-3): "The card is up on the board." / "The board card is up now."
const BOARD_CARD_UP_RE = /^\s*The (?:board )?card is (?:up(?: on the board)?|on the board|ready)(?: now)?\s*[.!]?\s*$/i;
/** Task 28 §C: a nudge-note echo or a board-card staging line (see above). */
export function isNudgeDirectiveEcho(sentence: string): boolean {
  const s = sentence ?? '';
  if (NUDGE_ECHO_ORDER_RE.test(s) || BOARD_CARD_UP_RE.test(s)) return true;
  if (ORDER_HAS_SUBJECT_RE.test(s)) return false;
  return ORDER_THEN_MOVE_ON_RE.test(s) || BARE_NEXT_ITEM_MOVE_RE.test(s);
}
const THIRD_PERSON_PLAN_ANYWHERE_RE =
  /\bI(?:['’]ll| will) (?:ask|tell|have|get|let|help|guide|remind|prompt) (?:them|the student|the learner)\b/i;
const BOARD_ALREADY_NARRATION_RE =
  /^\s*(?:The board already (?:shows|has|displays)\b|It already (?:shows|has|displays) (?:the|that|this) (?:model )?(?:sentence|question|card|answer)\b)[^.!?]*[.!?]?\s*$|^\s*(?:That|This|The) (?:sentence|question|card|answer) is already (?:on|up on) the board[.!]?\s*$/i;
const CONTINUATION_NARRATION_RE =
  /^\s*(?:Here is|Here's|This is) the rest of (?:the|my|your|today's) \w+[.!:]?\s*$/i;

const THIRD_PERSON_PLAN_RE =
  /^\s*let me (?:support|help|guide|redirect|steer|reassure|encourage) them\b/i;

const RE_DERIVE_RE =
  /^\s*(?:ok(?:ay)?,?\s+)?let me (?:re-?derive|re-?verify|re-?check|re-?do|re-?examine|double-?check|verify|check)\b[^.!?]{0,60}?\b(?:myself|silently|quietly|before (?:responding|answering|replying)|first,?\s+then|that prior|my prior|my earlier|my previous|my last)\b/i;

/** A tag-shaped run: '<' + a letter or '/', a tag name, then '>'. Requires
 *  BOTH delimiters AND an '=' in any attribute section (so unspaced algebra
 *  like "3<n and n>10" or "a<b and c>d" survives — prose between brackets
 *  never contains attribute assignments). Legitimate markup either has no
 *  attributes ("<result>", "<thinking>") or carries a real one
 *  ("<span style="...">"). Spoken inequalities and LaTeX are unaffected. */
const MARKUP_RE = /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*=[^<>]*)?>/;

// 2026-10-15 (GAC staging v6/v7): the homework ledger's own words reached the
// student — "Those are already recorded as solved." A sentence about the
// software's record of the session, or its [SOLVED]/[OPEN] marks, is never
// speech. Narrow: a record verb + "as" + a status word, the marks, or "the
// software".
const LEDGER_RECORD_RE = /\b(?:recorded|marked|logged|flagged|registered|noted)\s+(?:it\s+|that\s+|them\s+)?as\s+(?:solved|done|finished|complete|completed|correct|open|unsolved)\b|\[(?:SOLVED|OPEN)\]|\bthe software(?:'s)?\b|\b(?:my|the|session(?:'s)?)\s+(?:record|ledger)s?\s+(?:shows?|says|has)\b/i;

// ─────────────────────────────────────────────────────────────────────────
// 2026-10-03 round: leak SHAPES (narrowed 2026-10-04). Each rule below matches
// the grammatical shape of a leak class seen in production, not the sentence
// that leaked.
//
// NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES (default ON) gates everything this
// round changed in the per-sentence filter: the shape rules below AND the
// "The system … / The runtime …" lesson-content exemptions in
// PHRASE_START_RE. `off` therefore restores the pre-round filter exactly —
// no shape rule, and every "The system …" / "The runtime …" opener dropped
// (PHRASE_START_LEGACY_RE). The flag is read per call so the test script can
// exercise both states.
//
// A false drop costs more than a missed leak: the student loses teaching, or
// the correction the tutor was asked to give. So every rule here follows the
// same principles —
//   · never drop a sentence that states a result, a verdict or a correction;
//   · never drop a sentence that addresses the student with content;
//   · match the tutor-RUNTIME frame (something handed TO the tutor, the
//     student's TURN being graded), never the bare noun;
//   · when a rule cannot tell the leak from teaching, keep the sentence.
// ─────────────────────────────────────────────────────────────────────────
function flagOn(value: string | undefined): boolean {
  return value !== 'off';
}
function shapesEnabled(): boolean {
  try { return flagOn(process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_SHAPES); } catch { return true; }
}
function thirdPersonEnabled(): boolean {
  try { return flagOn(process.env.NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON); } catch { return true; }
}
function correctionWorkingEnabled(): boolean {
  try { return flagOn(process.env.NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP); } catch { return true; }
}

/** Second person / inclusive first person: the sentence is talking TO the
 *  student, so whatever it announces is shared work, not private work. */
const ADDRESSES_STUDENT_RE = /\b(?:you|your|yours|yourself|you['’](?:re|ve|ll|d)|we|we['’](?:re|ve|ll|d)|us|our|ours|let['’]?s|together)\b/i;

/** The sentence goes on to say something: a colon / dash / semicolon clause,
 *  or a coordinated clause. Whatever follows is content (usually the result),
 *  so the sentence is no longer a bare announcement or a bare claim. */
const CONTINUES_RE = /[:;—–]\s*\S|,\s*(?:and|so|but|which|then)\b|\b(?:and|so|but|because|which)\s+\S/i;
const TRAILING_PUNCT_RE = /[\s.!?…"'”’)\]]+$/;

// 2026-10-04 (second review): rules a–d below were narrowed again. Two review
// rounds found real teaching being dropped, so each rule now needs a shape
// that is unmistakably the tutor talking about its own runtime; anything
// short of that is KEPT (a missed leak is acceptable, lost teaching is not).
//
// a. Private working ANNOUNCED aloud. Shape: first-person opener + up to three
// adverbs/fillers + a working verb, AND an unmistakable privacy marker:
// quietly / silently / privately / internally (before the verb or after it),
// "to myself", or "before answering / responding / replying". Nothing else
// counts: a sentence-final "first", "in my head", "mentally", "myself" and
// "on my own" are how a tutor thinks ALOUD ("Let me re-check that calculation
// first.", "Let me work this out myself.") and are kept.
// Never when the sentence addresses the student ("Let me quietly check your
// second line with you"), and never when it continues with content ("I'll
// quietly check: 12 times 12 is 144" states the result). (RE_DERIVE_RE above
// is the older, pre-round rule and keeps its own list.)
const PRIVATE_WORKING_RE = new RegExp(
  String.raw`^\s*(?:(?:ok(?:ay)?|so|hmm+|right|alright|well|now|actually|wait|hold on)[,.…—–-]?\s+){0,2}` +
  String.raw`(?:let me|i['’]?ll|i will|i need to|i have to|i should|i want to|i['’]?m going to|i am going to)\s+` +
  String.raw`((?:(?:just|first|now|also|actually|really|[a-z]+ly),?\s+){0,3})` +
  String.raw`(re-?derive|re-?verify|re-?compute|re-?calculate|re-?work|re-?check|re-?do|re-?examine|double-?check|sanity-?check|verify|check|compute|calculate|derive|work (?:(?:this|that|it|these|those)(?: one)? )?out)\b`,
  'i',
);
const PRIVATE_ADVERB_RE = /\b(?:quietly|silently|privately|internally)\b/i;
const PRIVATE_TAIL_RE = /\b(?:silently|quietly|privately|internally|to myself|before (?:responding|answering|replying|i (?:respond|answer|reply)))\b/i;

function isPrivateWorking(s: string): boolean {
  const m = PRIVATE_WORKING_RE.exec(s);
  if (!m) return false;
  if (ADDRESSES_STUDENT_RE.test(s)) return false;
  const fillers = m[1];
  const rest = s.slice(m.index + m[0].length).replace(TRAILING_PUNCT_RE, '');
  if (CONTINUES_RE.test(rest)) return false;
  return PRIVATE_ADVERB_RE.test(fillers) || PRIVATE_TAIL_RE.test(rest);
}

// b. The student's TURN classified aloud for grading, with no content for the
// student. Two shapes only:
//   · "<that / this / asking …> is a request / question / statement …, not
//     something (for me) to grade / score / judge / mark" — and the sentence
//     ENDS there;
//   · the bare fragment "Nothing to grade (here | there)." (optionally
//     "There's …", "… yet") — the WHOLE sentence.
// Kept: anything that addresses the student (you / your / we / let's / "want
// to" / a question mark), anything that continues with content ("…, it's just
// practice", "… until you press submit"), and "not an attempt" in every form
// ("That isn't an attempt at the problem yet — want to give it a go?", "It was
// a comment, not an attempt.").
const TURN_NOT_GRADABLE_RE = new RegExp(
  String.raw`\b(?:is|was|that['’]?s|it['’]?s|counts as|reads as|sounds like)\s+(?:just\s+|only\s+|really\s+|more of\s+)?(?:a|an)\s+(?:request|question|greeting|statement|comment|aside|non-?answer)\b[^.!?]{0,40}?\bnot\s+(?:something|anything|one)\s+(?:for me\s+)?to\s+(?:grade|score|judge|mark)\s*[.!…]*\s*$`,
  'i',
);
const NOTHING_TO_GRADE_RE =
  /^\s*(?:(?:ok(?:ay)?|so|hmm+|right|alright|well)[,.…—–-]?\s+)?(?:there(?:['’]s|\s+is)\s+)?nothing\s+(?:(?:here|there)\s+)?to\s+grade(?:\s+(?:here|there))?(?:\s+yet)?\s*[.!…]*\s*$/i;
const GRADING_ADDRESSES_STUDENT_RE = /\bwant to\b|\?/i;

function isTurnGrading(s: string): boolean {
  if (ADDRESSES_STUDENT_RE.test(s) || GRADING_ADDRESSES_STUDENT_RE.test(s)) return false;
  return TURN_NOT_GRADABLE_RE.test(s) || NOTHING_TO_GRADE_RE.test(s);
}

// c. A runtime artefact named as the thing the tutor is REACTING to. note /
// hint / cue / instructions are ordinary lesson words (a card's hint, a note
// in the margin, a context cue, a musician's note), so the bare nouns are
// never matched. Only two shapes drop:
//   · the artefact noun (cue / hint / note / signal / flag) QUALIFIED by a
//     runtime / affect word that cannot be lesson content — boredom,
//     frustration, confusion, pacing, pace, engagement, runtime, system,
//     validator — in a reaction frame: governed by a because-of preposition
//     ("Given that boredom cue, …", "Per the pacing hint, …") or as the
//     definite subject of says / tells / asks / wants ("The validator note
//     says …"). "A system note in the log shows the error." is neither;
//   · the fixed phrase "the correction note" as the SUBJECT of says / tells /
//     asks / wants + "me". As an object or in a location ("Write that
//     correction note down.", "The correction note in the margin shows …")
//     it is kept.
const RUNTIME_QUALIFIER = String.raw`(?:boredom|frustration|confusion|pacing|pace|engagement|runtime|system|validator)`;
const ARTEFACT_NOUN = String.raw`(?:cue|hint|note|signal|flag)s?`;
const ARTEFACT_SAYS = String.raw`(?:says|said|tells|told|asks|asked|wants|wanted|is\s+telling|is\s+asking|keeps\s+telling)`;
const ARTEFACT_REACTION_RE = new RegExp(
  [
    String.raw`\b(?:given|per|following|based on|according to|because of|in light of|thanks to)\s+(?:that|this|the|my|a)\s+${RUNTIME_QUALIFIER}\s+${ARTEFACT_NOUN}\b`,
    String.raw`(?<![\w-])(?:the|that|this)\s+${RUNTIME_QUALIFIER}\s+${ARTEFACT_NOUN}\s+${ARTEFACT_SAYS}\b`,
    String.raw`(?<![\w-])the\s+correction\s+note\s+${ARTEFACT_SAYS}\s+(?:to\s+)?me\b`,
  ].join('|'),
  'i',
);

// d. Commentary on what the problem bank / generator keeps SERVING. One shape:
//   "<the (problem | question | practice | item) bank | the (problem)
//    generator> keeps / kept handing / giving / serving / returning me <a
//    served PROBLEM>"
// where the served thing is "the one(s) we already did", "the same problem /
// question / item / card / exercise / one", "a repeat" or "a duplicate" —
// never "the same answer / number / amount / result / box". A bare "the bank"
// is also a word-problem noun, so it needs "the one(s) we already did" as its
// object. "The tool …" and "The random number generator …" are never matched.
const KEEPS_SERVING_ME = String.raw`(?:keeps|kept)\s+(?:on\s+)?(?:handing|giving|serving|returning)\s+me\s+(?:back\s+|up\s+)?`;
const ONE_WE_DID = String.raw`the\s+ones?\s+we(?:['’]ve)?\s+(?:(?:already|just|have)\s+)*(?:did|done|solved|saw|seen|had|tried|finished|covered)\b`;
const SERVED_PROBLEM = String.raw`(?:the\s+ones?\s+we\b|(?:the\s+)?(?:(?:very|exact)\s+)?same\s+(?:problem|question|item|card|exercise|one)s?\b|a\s+(?:repeat|duplicate)\b)`;
const TOOL_RESULT_RE = new RegExp(
  [
    String.raw`(?<![\w-])the\s+(?:(?:problem|question|practice|item)\s+bank|(?:problem\s+)?generator)\s+${KEEPS_SERVING_ME}${SERVED_PROBLEM}`,
    String.raw`(?<![\w-])the\s+bank\s+${KEEPS_SERVING_ME}${ONE_WE_DID}`,
  ].join('|'),
  'i',
);
// The served item called a repeat — only as a BARE verdict fragment: the whole
// sentence is "that('s | one's) (also) a repeat / duplicate". Any continuation
// makes it lesson content ("That's a repeat, so the decimal is 0.333
// repeating", "a duplicate factor", "a repeat of the pattern …").
const REPEAT_VERDICT_RE =
  /^\s*(?:(?:ah|oh|hmm+|ok(?:ay)?|and|so|well)[,…—–-]?\s+)?(?:that|this)(?:\s+one)?(?:['’]s|\s+is|\s+was)\s+(?:(?:also|again|just|another|yet another)\s+)*(?:an?\s+)?(?:repeat|duplicate|dupe)(?:\s+(?:again|too|as well|also))?\s*[.!…]*\s*$/i;

// e. A first-person claim of an internal check — only the BARE claim. The rule
// needs both: (1) the claim, at the start of the sentence, with a private
// marker ("I checked your move myself") or a re-do verb with at most a pronoun
// / "your move" object ("I've re-derived it"); and (2) NOTHING else — no
// result, verdict or correction after it, and not done for / with the
// student. "I recomputed it and the answer is 7, not 9", "I re-verified your
// steps, and they hold", "I've re-derived the formula on the board for you"
// are the correction itself and are kept.
const CLAIM_LEAD = String.raw`^\s*(?:(?:ok(?:ay)?|so|hmm+|right|alright|well|now|actually|and|yes|yep)[,.…—–-]?\s+){0,2}i(?:['’]ve| have)?\s+(?:(?:just|already|also|now|quietly|silently)\s+)*`;
const CLAIM_END = String.raw`\s*[.!…]*\s*$`;
const SELF_CHECK_CLAIM_RE = new RegExp(
  CLAIM_LEAD + String.raw`(?:` +
  String.raw`(?:re-?|double-?)?(?:checked|verified|derived|computed|calculated|worked)\b[^.!?,;:—–]{0,60}?\b(?:myself|on my own|internally|silently|quietly|privately|behind the scenes|in my head)` +
  String.raw`|re-?(?:derived|verified|computed|calculated|checked)(?:\s+(?:it|this|that|them|those|(?:this|that) one|your (?:move|answer|step|steps|work|line)))?` +
  String.raw`)` + CLAIM_END,
  'i',
);
const CLAIM_HAS_MORE_RE = /\b(?:and|so|but|because|which|for you|with you|for us|on the board|on the screen|on the whiteboard)\b/i;

function isBareSelfCheckClaim(s: string): boolean {
  return SELF_CHECK_CLAIM_RE.test(s) && !CLAIM_HAS_MORE_RE.test(s);
}

// f. Deliberation ABOUT the learner (2026-10-05, live AP Calculus BC
// portal-40a1e217): "Let me stay focused: they're mid-step on problem 2, so I
// should answer the active question first." reached the student as the reply.
// The rule needs BOTH halves in one sentence:
//   (1) the learner in the third person, in a learner-STATE frame — "they're
//       mid-step / still on / stuck / asking / answering / working on / on
//       problem 2", "the learner / the student / the user is | has | asked |
//       needs …"; and
//   (2) an instruction to SELF about the turn — "I should / I need to / I
//       must answer | respond | address | finish | wait | stay | focus …",
//       "let me stay focused", "let me not …".
// Either half alone is ordinary teaching and is kept: "They're both
// solutions.", "The user of a microscope turns the coarse focus first.",
// "When charges are alike they're repelled, so I should expect a larger
// angle.", "I should mention one more case.", "Let me focus on the second
// term with you." NEXT_PUBLIC_TUTOR_META_NARRATION_THIRD_PERSON=off disables it.
const LEARNER_THIRD_PERSON_RE = new RegExp(
  String.raw`\bthey(?:['’]re|\s+are|\s+were)\s+(?:(?:now|still|currently|already|clearly|just|actually)\s+)*(?:mid-?(?:step|problem|question|way)|in\s+the\s+middle\s+of|stuck|confused|lost|asking|answering|working\s+(?:on|through)|on\s+(?:problem|part|question|step|item)\b|trying\s+to|struggling|guessing|not\s+(?:asking|answering|ready|done)|done\s+with|ready\s+(?:for|to))` +
  String.raw`|\bthey\s+(?:just\s+|already\s+)?(?:asked|answered|said|typed|wrote|haven['’]?t\s+(?:answered|finished|tried)|didn['’]?t\s+(?:answer|ask|finish))\b` +
  String.raw`|\b(?:the|this)\s+(?:learner|student|user)(?:['’]s\s+(?:answer|question|turn|message|reply|request)\b|\s+(?:is|was|has|hasn['’]?t|had|needs?|wants?|asked|said|answered|typed|wrote|seems?|just|didn['’]?t|doesn['’]?t|should|still)\b)`,
  'i',
);
const SELF_INSTRUCTION_RE = new RegExp(
  String.raw`\b(?:so\s+|and\s+|then\s+|which\s+means\s+)?i\s+(?:should(?:n['’]?t)?|need\s+to|must(?:n['’]?t)?|have\s+to|ought\s+to|can['’]?t|won['’]?t|will\s+need\s+to)\s+(?:first\s+|now\s+|just\s+|only\s+|still\s+|not\s+)*(?:answer|respond|reply|address|finish|complete|wait|stay|focus|ask|check|grade|judge|confirm|correct|redirect|handle|acknowledge|continue|keep|avoid|move|advance|switch|defer|hold|treat|give|let|stick)\b` +
  String.raw`|\blet\s+me\s+(?:stay\s+focused|stay\s+on|not\s+\w+|refocus)\b` +
  String.raw`|\bmy\s+(?:next\s+(?:move|step|turn)|job|task|response|reply)\s+(?:is|should|here)\b`,
  'i',
);
function isLearnerDeliberation(s: string): boolean {
  return LEARNER_THIRD_PERSON_RE.test(s) && SELF_INSTRUCTION_RE.test(s);
}

// g. Commentary on the reply itself or on an instruction about it (round 3,
// Haiku 5.5, 2026-10-27): "Those words already ask the question, so I'll stop
// there." / "Your words already ended with the question, so I'll stop here." /
// "The equation card is up, so there's nothing more to add." — a later call
// talking about what the earlier one said. Each form is narrow: "words
// already", "already asks/ends with the question", a sentence-final "nothing
// more to add", a BARE "<…> card is up" (or "…, so"), and "so I'll stop
// here/there". "Let's stop here", "nothing more to add to the left side" and
// "The card is up on the board — what's …?" are kept.
const REPLY_COMMENTARY_RE = new RegExp(
  [
    String.raw`\b(?:those|these|your|my|the)\s+words\s+already\b`,
    String.raw`\balready\s+(?:asks?|asked|ends?|ended)\s+(?:with\s+)?(?:the|a|that|this)\s+question\b`,
    String.raw`\bnothing\s+(?:more|else)\s+to\s+add\s*[.!…]*\s*$`,
    String.raw`^\s*(?:the\s+)?(?:[\w-]+\s+){0,2}card\s+is\s+(?:up|showing)\s*(?:[.!…]*\s*$|,\s*so\b)`,
    String.raw`\bso\s+i(?:['’]ll|\s+will)\s+stop\s+(?:here|there)\b`,
  ].join('|'),
  'i',
);

function isLeakShape(s: string): boolean {
  return REPLY_COMMENTARY_RE.test(s)
    || isPrivateWorking(s)
    || isTurnGrading(s)
    || ARTEFACT_REACTION_RE.test(s)
    || TOOL_RESULT_RE.test(s)
    || REPEAT_VERDICT_RE.test(s)
    || isBareSelfCheckClaim(s);
}

export function isMetaNarration(
  sentence: string,
  opts?: { structural?: boolean; /** Task 20 fix round 1: the turn answers a runtime directive / nudge (transcript starts with "["), not the student */ runtimeTriggered?: boolean; /** Task 21 fix round 1: the persona's name(s) for the "<Name> here." rule */ personaName?: string | readonly string[] | null },
): boolean {
  const s = sentence ?? '';
  const shapes = shapesEnabled();
  if ((shapes ? PHRASE_START_RE : PHRASE_START_LEGACY_RE).test(s) || PHRASE_ANYWHERE_RE.test(s) || LEDGER_RECORD_RE.test(s) || SELF_REFERENCE_RE.test(s) || SELF_AUDIT_RE.test(s) || RE_DERIVE_RE.test(s) || TURN_CLASSIFYING_RE.test(s) || THIRD_PERSON_PLAN_RE.test(s) || PERSONA_DIRECTIVE_RE.test(s) || MID_REPLY_SELF_CORRECTION_RE.test(s) || VERDICT_NARRATION_RE.test(s) || VERDICT_NARRATION_JA_RE.test(s) || BARE_FILLER_RE.test(s) || THINK_FILLER_RE.test(s) || TOOL_PLAN_SPOKEN_RE.test(s) || BARE_FILLER_JA_RE.test(s) || TOOL_NAME_SPOKEN_RE.test(s) || PLAN_ALOUD_RE.test(s) || RUNTIME_NOTE_NARRATION_RE.test(s) || BOARD_STAGING_NARRATION_RE.test(s) || DIRECTIVE_ECHO_RE.test(s) || DIRECTIVE_ECHO_NOTE_RE.test(s) || THIRD_PERSON_PLAN_ANYWHERE_RE.test(s) || BOARD_ALREADY_NARRATION_RE.test(s) || CONTINUATION_NARRATION_RE.test(s) || isNudgeDirectiveEcho(s) || (s.trim() !== '' && stripNoteCitationClause(s, { personaName: opts?.personaName }) === '') || (opts?.runtimeTriggered === true && s.trim() !== '' && stripNudgePlanClause(s) === '')) return true;
  if (shapes && isLeakShape(s)) return true;
  if (thirdPersonEnabled() && isLearnerDeliberation(s)) return true;
  if (opts?.structural === false) return false;
  return MARKUP_RE.test(s);
}

// ─────────────────────────────────────────────────────────────────────────
// Leading narrated working in a reply to a correction note.
//
// A turn that answers a "[correction note — not from the student] …" input
// has been seen to OPEN with the re-check spoken aloud: an announcement
// ("Let me quietly re-derive this one first."), the derivation, and its
// conclusion ("So the correct answer is …"). The announcement is caught per
// sentence; the derivation lines that follow it have no per-sentence
// signature (they are ordinary maths), so they can only be recognised by
// POSITION.
//
// That makes this the most dangerous rule in the module — the same turn IS
// the correction the tutor was asked to give — so it is narrow and fails
// open (2026-10-04):
//   · A run STARTS only on the turn's first sentence, and only when that
//     sentence is unmistakably PRIVATE working: a first-person working opener
//     with a privacy marker (isPrivateWorking — quietly / silently / to
//     myself / before answering …). Plain "Let me check / see / think /
//     verify …", "Let me re-check that calculation first." and "I'm checking
//     …" are how a tutor talks and never start a run.
//   · Inside a run only BARE working is withheld: a sentence with a numeral or
//     an expression in it that does not state a conclusion or a correction,
//     does not address the student, is not a question and is not an
//     acknowledgement / apology. The first sentence that is anything else
//     ENDS the run and is spoken — so "So the correct answer is …" is always
//     heard.
//   · When the sentence that ends the run is NOT a conclusion (a question, an
//     apology, an acknowledgement, plain prose), the result of the working
//     would otherwise be lost ("That gives fourteen." withheld, only "Sorry
//     for the mix-up earlier." spoken). The tracker then RELEASES the last
//     withheld sentence — release() — for the caller to speak first.
//   · The run is capped at 4 sentences, announcement included.
//   · A turn is never muted entirely. The tracker does not decide what is
//     finally spoken (other filters run after it), so the CALLER reports it:
//     markSpoken() when a sentence is really enqueued, withhold() for a
//     sentence another positional filter dropped during the run. finish()
//     returns every withheld derivation line when nothing was spoken. The
//     array form applies the same rule itself.
// Flag NEXT_PUBLIC_TUTOR_CORRECTION_WORKING_DROP (default ON).
// ─────────────────────────────────────────────────────────────────────────
/** Openers that turn to the student without a pronoun: an acknowledgement,
 *  an apology or an admission. */
const TURNS_TO_STUDENT_RE =
  /^\s*(?:sorry|apologies|my (?:mistake|apologies|bad|error)|i was (?:wrong|right|mistaken)|i made (?:a|an) (?:mistake|error|slip)|i (?:misspoke|apologi[sz]e)|good|nice|great|yes|yep|right|correct|exactly|thanks|thank|well done|fair|true)\b/i;
const ENDS_AS_QUESTION_RE = /\?\s*["'”’)\]]*\s*$/;

const NUMBER_WORD = '(?:zero|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|half|third|quarter)';
/** States a conclusion or a correction — never dropped. */
const CONCLUSION_RE = new RegExp(
  [
    String.raw`\bthe\s+(?:correct\s+|right\s+|final\s+|actual\s+)?(?:answer|result|solution)\s+(?:is|was|should|comes|stands)\b`,
    String.raw`\bshould\s+(?:read|be|have\s+(?:been|read))\b`,
    String.raw`\b(?:is|are|was|were|that['’]?s|it['’]?s)\s+(?:in)?correct\b`,
    String.raw`\b(?:is|are|was|were)\s+(?:wrong|right|mistaken|off)\b`,
    String.raw`\bnot\s+(?:\$|\\|[-+−]?\d|negative\b|minus\b|one\b|${NUMBER_WORD}\b|(?![ai]\b)[a-z]\b)`,
    String.raw`\bi\s+had\s+(?:that|it|this|those|them)\b`,
    String.raw`\bthe\s+(?:slip|mistake|error|typo)\s+(?:was|is)\b`,
    String.raw`\bthe\s+correct\b`,
    String.raw`\bit\s+(?:works|checks out|holds)\b`,
  ].join('|'),
  'i',
);
/** Has a numeral or an expression in it — the only thing a derivation line
 *  is recognised by. ("one" alone does not count: "This one is tricky.") */
const HAS_MATHS_RE = new RegExp(String.raw`\d|\$|=|\bequals?\b|\b${NUMBER_WORD}\b`, 'i');

/** Hard ceiling on a run, announcement included. */
const MAX_WORKING_RUN = 4;

function addressesStudent(s: string): boolean {
  return ADDRESSES_STUDENT_RE.test(s) || ENDS_AS_QUESTION_RE.test(s) || TURNS_TO_STUDENT_RE.test(s);
}
function startsPrivateRun(s: string): boolean {
  return isPrivateWorking(s) && !addressesStudent(s);
}
function isBareWorking(s: string): boolean {
  if (addressesStudent(s) || CONCLUSION_RE.test(s)) return false;
  return HAS_MATHS_RE.test(s) || isPrivateWorking(s);
}

/**
 * Streaming form — one tracker per brain-turn ATTEMPT. `maxRun` can lower the
 * 4-sentence ceiling, never raise it.
 *
 * `isWorking(sentence, answersCorrectionNote)` — true while the sentence
 *   belongs to the leading private-working run (see the rules above): the
 *   caller withholds it.
 * `release()` — call after every `isWorking` that returned false. When that
 *   sentence ended a run without stating a conclusion, returns the LAST
 *   withheld derivation line (at most one, handed out once) for the caller to
 *   speak BEFORE the sentence; otherwise [].
 * `withhold(sentence)` — the caller dropped this sentence by another
 *   positional filter (bare arithmetic re-check) while the run was active;
 *   record it so it can be released / restored. Returns whether a run was
 *   active (nothing is recorded outside one).
 * `markSpoken()` — the caller really enqueued a sentence for speech. The
 *   tracker cannot infer this: a sentence it passed may still be dropped by a
 *   later filter.
 * `finish()` — call once when the turn has finished streaming. Returns the
 *   withheld derivation lines (never a private announcement) when NOTHING was
 *   marked spoken, so the caller can speak them rather than mute the turn;
 *   otherwise [].
 */
export function createCorrectionWorkingTracker(opts?: { maxRun?: number }): {
  isWorking: (sentence: string, answersCorrectionNote: boolean) => boolean;
  release: () => string[];
  withhold: (sentence: string) => boolean;
  markSpoken: () => void;
  finish: () => string[];
} {
  const requested = opts?.maxRun;
  const maxRun = typeof requested === 'number' && Number.isFinite(requested)
    ? Math.max(0, Math.min(Math.floor(requested), MAX_WORKING_RUN))
    : MAX_WORKING_RUN;
  let state: 'start' | 'run' | 'done' = 'start';
  let count = 0;
  let spokenAny = false;
  let pending: string[] = [];
  const withheld: string[] = [];
  return {
    isWorking(sentence: string, answersCorrectionNote: boolean): boolean {
      const s = sentence ?? '';
      if (s.trim() === '') return false;
      if (state === 'done') return false;
      if (!answersCorrectionNote || !correctionWorkingEnabled()) { state = 'done'; return false; }
      const inRun = count < maxRun && (state === 'start' ? startsPrivateRun(s) : isBareWorking(s));
      if (!inRun) {
        // The run ends on this sentence. Unless it states the conclusion
        // itself, hand back the last derivation line so the result is heard.
        if (state === 'run' && withheld.length > 0 && !CONCLUSION_RE.test(s)) {
          pending = [withheld[withheld.length - 1]];
        }
        state = 'done';
        return false;
      }
      // Announcements ("Let me quietly …") are never handed back — only maths.
      if (state === 'run' && !isPrivateWorking(s)) withheld.push(s);
      state = 'run';
      count++;
      return true;
    },
    release(): string[] {
      const out = pending;
      pending = [];
      return out;
    },
    withhold(sentence: string): boolean {
      const s = sentence ?? '';
      if (state !== 'run' || s.trim() === '') return false;
      withheld.push(s);
      return true;
    },
    markSpoken(): void {
      spokenAny = true;
    },
    finish(): string[] {
      return spokenAny ? [] : [...withheld];
    },
  };
}

/**
 * Array form — the same decisions as the streaming tracker, applied to a whole
 * turn: `true` = working (drop from speech and transcript). A released
 * sentence (see `release()`) is un-marked. All false when the turn does not
 * answer a correction note, when it does not open with private working, or
 * when nothing would be left to speak — every other sentence is marked or is
 * meta-narration the caller drops anyway (a turn must never be muted
 * entirely).
 */
export function markCorrectionNoteWorking(sentences: string[], answersCorrectionNote: boolean): boolean[] {
  const list = Array.isArray(sentences) ? sentences : [];
  const none = list.map(() => false);
  if (!answersCorrectionNote) return none;
  const tracker = createCorrectionWorkingTracker();
  const marks = list.map(() => false);
  list.forEach((s, i) => {
    marks[i] = tracker.isWorking(s, true);
    if (marks[i]) return;
    for (const released of tracker.release()) {
      for (let j = i - 1; j >= 0; j--) {
        if (marks[j] && list[j] === released) { marks[j] = false; break; }
      }
    }
  });
  const spoken = list.some((s, i) => !marks[i] && (s ?? '').trim() !== '' && !isMetaNarration(s));
  return spoken ? marks : none;
}
