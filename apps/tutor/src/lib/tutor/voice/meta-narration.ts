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

function isLeakShape(s: string): boolean {
  return isPrivateWorking(s)
    || isTurnGrading(s)
    || ARTEFACT_REACTION_RE.test(s)
    || TOOL_RESULT_RE.test(s)
    || REPEAT_VERDICT_RE.test(s)
    || isBareSelfCheckClaim(s);
}

export function isMetaNarration(
  sentence: string,
  opts?: { structural?: boolean },
): boolean {
  const s = sentence ?? '';
  const shapes = shapesEnabled();
  if ((shapes ? PHRASE_START_RE : PHRASE_START_LEGACY_RE).test(s) || PHRASE_ANYWHERE_RE.test(s) || SELF_REFERENCE_RE.test(s) || SELF_AUDIT_RE.test(s) || RE_DERIVE_RE.test(s) || TURN_CLASSIFYING_RE.test(s) || THIRD_PERSON_PLAN_RE.test(s)) return true;
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
