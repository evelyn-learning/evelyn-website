/**
 * Student-declared hold ("wait until I say candle") — R58, live session
 * portal-2f23ece4: a young student said "I just need to talk to someone
 * real quick, so ignore everything I say until I say candle." The brain
 * UNDERSTOOD ("No problem, take the time you need") but had no mechanism
 * to actually stop listening — every overheard utterance ("Look at this",
 * "This is my tongue…") was dispatched and answered, and the private
 * aside to a friend landed in the lesson transcript. Students — kids
 * especially — don't know the mute button exists; the tutor has to be
 * the graceful party.
 *
 * Notably, the student never said the codeword on return — she said
 * "cupcake cake thing. Okay, I'm ready to keep going now." — so resume
 * detection must be INTENT-based first, with the cue as a bonus match,
 * never an exact-codeword gate.
 *
 * This module is the pure decision layer. The orchestrator owns the
 * state: while holding, student utterances are neither dispatched to the
 * brain nor appended to the lesson transcript (they're private), covers
 * and idle nudges are suppressed, and each utterance is only run through
 * `checkResume`.
 *
 * Pure — no side effects, never throws.
 */

export interface HoldRequest {
  hold: boolean;
  /** The student's chosen resume codeword, when they named one. */
  resumeCue?: string;
}

export interface ResumeCheck {
  resume: boolean;
  reason?: 'cue' | 'ready-intent' | 'direct-address' | 'soft-any-speech';
}

/**
 * 2026-10-17 (GDI, embed-1792274192055): a human barged in with "Okay, can
 * you just wait for a second?"; the brain called hold_for_student with no
 * cue, and the student's next five utterances — "No, but like, can you carry
 * on?", "What are we teaching here?", "Are you gonna start?", "Why don't you
 * start?", "Okay, can you carry on, please? I want to get on with the lesson."
 * — were all swallowed: none matched the resume shapes written for the
 * "until I say candle" case. Two changes:
 *   - a hold with NO codeword that the utterance itself did not declare as a
 *     step-away ("ignore me", "I need to talk to someone") is a SOFT hold —
 *     "wait a second" — and the next thing the student says resumes it;
 *   - the strict shapes gain the plain ways of asking the tutor to go on.
 */
export interface ResumeOptions {
  /** A cue-less hold the student never declared as stepping away: any
   *  substantive utterance resumes. */
  soft?: boolean;
}

/** A soft hold checks in — and ends — after this long, not five minutes. */
export const SOFT_HOLD_CHECKIN_MS = 60_000;

/** "ignore (everything I say) until I say X" — captures the cue. The cue
 *  capture stops at punctuation/conjunction so trailing chatter doesn't
 *  glue on. */
const IGNORE_UNTIL_RE =
  /\bignore\b[^.!?]{0,60}?\buntil\s+i\s+say\s+(?:the\s+word\s+)?["']?([a-z][a-z\s-]{0,30}?)["']?(?:[.,!?]|$|\s+(?:okay|ok|alright|so|and)\b)/i;

/** Explicit step-away declarations WITHOUT a cue. Deliberately narrow —
 *  "hold on" / "one sec" are ordinary thinking stalls (STALL_RE territory
 *  in cover-layer.ts) and must NOT enter hold. These shapes all declare
 *  the student is leaving the conversation or talking to someone else. */
// "don't listen / respond / reply" is an IMPERATIVE to the tutor. With a
// subject in front of it ("If I don't listen to you, then what will
// happen?", embed-1792275630905) it is the student talking ABOUT listening —
// that one armed a strict hold and swallowed seven utterances.
const STEP_AWAY_RE =
  /\b(?:i(?:'m| am| have| need|'ve got) (?:go(?:ing|nna)? |to )?(?:step away|talk to (?:someone|my|a friend)|take a (?:quick )?break)\b|(?<!\b(?:i|you|we|they|he|she|it|who|that|which|people|students|kids) )(?<!\bif i )(?:don'?t|do not) (?:listen|respond|reply)(?: to (?:me|us|anything|this))?\b|i'?m not talking to you\b|stop listening\b)/i;

const READY_INTENT_RE =
  /\b(?:i'?m ready\b|ready to (?:keep going|continue|go|start)\b|let'?s (?:continue|keep going|get back|go on|resume|start|carry on|pick (?:it )?(?:back )?up)\b|i'?m (?:back|done)\b|back now\b|okay,? i'?m (?:here|ready|back|done)\b|we can (?:continue|keep going|resume)\b|(?:can|could|will|would) you (?:please )?(?:carry on|continue|go on|keep going|start|resume|go ahead)\b|(?:why don'?t you|are you (?:gonna|going to)|aren'?t you (?:gonna|going to)) (?:start|continue|carry on|go on|keep going)\b|get on with (?:it|the lesson)\b|i'?m listening\b)/i;

/** The student addressing the TUTOR directly mid-hold — always resumes
 *  (a student asking "are you there?" must never be met with silence). */
const DIRECT_ADDRESS_RE =
  /\b(?:are you (?:there|still there|listening)\b|can you hear me\b|hello\?|hey,? (?:tutor|are you)\b|what are we (?:doing|teaching|learning|working on|practi[cs]ing)\b|what(?:'s| is) (?:the|today'?s) (?:lesson|topic|plan)\b)/i;

/** A bare "carry on" / "please continue" / "go ahead" at the start of the
 *  utterance or a clause — not inside one ("I am not continue… I have to
 *  talk to a friend", the live R58 fixture, must stay swallowed). */
const BARE_GO_ON_RE =
  /(?:^|[.!?]\s*|\b(?:okay|ok|yes|yeah|alright|so),?\s+)(?:please\s+)?(?:carry on|go on|go ahead|continue|keep going|resume)(?:,?\s*please)?\b/i;

function normalizeForCue(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function detectHoldRequest(utterance: string): HoldRequest {
  const t = (utterance ?? '').trim();
  if (!t || t.startsWith('[')) return { hold: false };
  const m = t.match(IGNORE_UNTIL_RE);
  if (m) {
    const cue = normalizeForCue(m[1]);
    return { hold: true, resumeCue: cue || undefined };
  }
  if (STEP_AWAY_RE.test(t)) return { hold: true };
  return { hold: false };
}

export function checkResume(utterance: string, resumeCue?: string, opts?: ResumeOptions): ResumeCheck {
  const t = (utterance ?? '').trim();
  if (!t) return { resume: false };
  // Soft hold ("wait a second"): the student is still talking to the tutor,
  // so anything with a couple of words in it resumes.
  if (opts?.soft && normalizeForCue(t).split(' ').filter(Boolean).length >= 2) {
    return { resume: true, reason: 'soft-any-speech' };
  }
  if (resumeCue) {
    const norm = ` ${normalizeForCue(t)} `;
    const cueTokens = resumeCue.split(' ').filter(Boolean);
    // Whole cue as a phrase, or — for a single-word cue — the bare token.
    if (norm.includes(` ${resumeCue} `)) return { resume: true, reason: 'cue' };
    // Multi-word cue: a majority of its tokens present counts (kids
    // rarely reproduce their own codeword verbatim).
    if (cueTokens.length > 1) {
      const hit = cueTokens.filter((c) => norm.includes(` ${c} `)).length;
      if (hit * 2 > cueTokens.length) return { resume: true, reason: 'cue' };
    }
  }
  if (READY_INTENT_RE.test(t) || BARE_GO_ON_RE.test(t)) return { resume: true, reason: 'ready-intent' };
  if (DIRECT_ADDRESS_RE.test(t)) return { resume: true, reason: 'direct-address' };
  return { resume: false };
}
