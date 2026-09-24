'use client';

/**
 * Transcript View Component
 *
 * Displays the conversation history between student and tutor.
 */

import React, { useEffect, useRef, useState } from 'react';
// KaTeX styles for the InlineMathText bubbles (InlineMathText itself carries
// no CSS import so renderer files stay node-importable).
import 'katex/dist/katex.min.css';
import { User, Bot } from 'lucide-react';
import type { TranscriptEntry } from '@/lib/tutor/types';
// Brain-facing pacing-chip directives — shared with the SessionStage quick-
// actions layer so the two surfaces never drift. (The pure detection helpers
// below are mirrored in quick-actions.ts/getQuickActions for the stage.)
import { STUCK_TEXT, SKIP_TEXT } from '@/lib/tutor/quick-actions';
// Round-20: bubble math rendering — see renderBubbleText.
import { segment, normalizeSentenceGaps } from '@/lib/tutor/whiteboard/inline-math';
import { InlineMathText } from './whiteboard/InlineMathText';
// R38 task 13: renderInlineEmphasis hoisted to a shared module so the
// replay TranscriptBubble (ReplayPlayer.tsx) can reuse it too — see
// inline-emphasis.tsx for why renderBubbleText itself stays local.
import { renderInlineEmphasis } from './inline-emphasis';
import { ImageZoomOverlay } from './ImageZoomOverlay';
// GreenApple round 6, task 4: pure follow-to-bottom decision, shared between
// the immediate scroll below and the fonts.ready / ResizeObserver re-checks
// that fix math bubbles growing taller after KaTeX's web fonts swap in.
import { shouldFollowToBottom, refollowDecision, latchFromScrollEvent } from '@/lib/tutor/voice/transcript-follow';

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  isProcessing?: boolean;
  /** In-session lesson picker bubble. Rendered INLINE between
   *  visible-transcript entries, anchored at `pickerAnchorIndex`
   *  (captured the first time the picker becomes eligible). Without
   *  the anchor the picker would float at the end of the transcript
   *  and "drift downward" as the conversation grows — observed
   *  2026-04-29 geometry session, where the picker bubble kept
   *  jumping to the bottom on every new turn. */
  picker?: React.ReactNode;
  /** Visible-transcript index (post-bracket-strip) at/before which
   *  the picker should be inserted. e.g. 1 → picker appears after
   *  the first visible entry. */
  pickerAnchorIndex?: number | null;
  /** Optional quick-answer dispatch. When the latest tutor turn ends
   *  in a yes/no or true/false question, render small buttons next
   *  to the bubble that send the answer immediately on tap — saves
   *  the student waiting for TTS to finish before they can speak.
   *  2026-04-30: feature request from a calc session. */
  onQuickAnswer?: (text: string) => void;
  /** Phase 3: render Skip ahead / I'm stuck contextual chips on the
   *  latest tutor turn. Co-located with the yes/no/true-false chip
   *  row. Both inject synthetic student utterances via onQuickAnswer.
   *  Default false; the host wires `true` when the PACING_V2_BUTTONS
   *  flag is on. */
  enablePacingChips?: boolean;
  /** Empty-state second line. Voice's "Start speaking to begin!" assumes a
   *  mic — text mode has no mic, so the host overrides this with a typing
   *  hint. Defaults to the original voice copy so every other caller (and
   *  every existing snapshot) stays byte-identical. */
  emptyHint?: string;
  /** Text mode: standard chat "stick to bottom" auto-scroll instead of the
   *  voice near-bottom-only rule (see the effect below for why voice's
   *  gate doesn't work for text's un-streamed full-paragraph replies).
   *  Defaults to false/undefined so voice is byte-identical. */
  stickToBottom?: boolean;
  /** GreenApple round-2 Task 9: the persona's name, shown as a small label
   *  above tutor bubbles. Omitted ⇒ no label renders at all, so every
   *  caller without a persona stays byte-identical. */
  tutorLabel?: string;
}

/** Round-20 (2026-07-17): bubbles now render inline $…$ math via KaTeX.
 *  Rule 3b instructs the brain to wrap ALL spoken math in $…$ (the
 *  declared-pronunciation design) — without this, chat bubbles would fill
 *  with raw dollar signs. Math segments render through InlineMathText
 *  (which owns the math-vs-currency segmentation); prose segments keep
 *  the existing *emphasis* handling. */
function renderBubbleText(text: string): React.ReactNode {
  // Round-23: fix "1.So" / "$.Now" sentence run-ons on the display side
  // (speech side got the same normalization in round 21).
  text = normalizeSentenceGaps(text);
  if (!text || !text.includes('$')) return renderInlineEmphasis(text);
  const parts = segment(text);
  if (!parts.some((p) => p.kind === 'math')) return renderInlineEmphasis(text);
  return parts.map((p, i) =>
    p.kind === 'math'
      ? <InlineMathText key={`m-${i}`} text={`$${p.body}$`} />
      : <React.Fragment key={`t-${i}`}>{renderInlineEmphasis(p.body)}</React.Fragment>,
  );
}

/** Find the trailing question in a tutor turn — the actionable ask the
 *  student needs to respond to. The brain typically structures turns as
 *  "[explanation]. [question]?", and the question is what we want to
 *  highlight visually. We look for the LAST sentence-ending '?' and
 *  treat everything from the prior sentence boundary to that '?' as
 *  the question. Returns [bodyBefore, question, restAfter] or null when
 *  no trailing question exists (statement-only turns aren't bolded).
 *
 *  Conservative on edge cases: a '?' inside parens or quotes still
 *  counts (the heuristic is "last ? in the text"). The boundary
 *  detection uses /[.!?]\s+/ before the question — same heuristic the
 *  SentenceBuffer uses on the brain side. */
function splitTrailingQuestion(text: string): { body: string; question: string } | null {
  if (!text) return null;
  // The trailing ? must be near the end of the text — no significant
  // content after it, otherwise it's a mid-sentence question.
  const trimmed = text.trimEnd();
  const lastQ = trimmed.lastIndexOf('?');
  if (lastQ < 0) return null;
  const tail = trimmed.slice(lastQ + 1).trim();
  // Allow a short trailing fragment after the ? (e.g., "?)" or "? :)")
  // but not a whole sentence.
  if (tail.length > 8) return null;
  // Find the last sentence boundary BEFORE the question. Look for
  // ". " or "! " or "? " before lastQ. The chosen boundary is the
  // start of the question sentence.
  let qStart = 0;
  // Scan for sentence terminators. Allow a small run of closing
  // punctuation (quotes, parens, brackets — straight or curly) BETWEEN
  // the terminator and the next sentence boundary, since narration often
  // ends a quoted span with `." Which...` (period inside the quote).
  // Then require the next non-space char to be uppercase — `\s+(?=[A-Z])`
  // for a space-delimited boundary or `(?=[A-Z])` for the no-space case
  // ("...equals 1.Now, on that circle..."). Critically, do NOT accept
  // `\s+` alone — that wrongly treats the period in "U.S. economy" as a
  // sentence boundary (observed 2026-05-07 AP Macro session: the chat
  // bolded only the word "economy?" because qStart landed after `U.S. `).
  // Negative lookbehind `(?<!\b[A-Z])` skips single-uppercase abbreviation
  // periods like the `U.` and `S.` in `U.S.` — those were also being
  // accepted as boundaries when they happened to satisfy the
  // uppercase-after rule. Use matchAll + take-last instead of a
  // `(?=[^.!?]*$)` lookahead so intermediate abbreviation periods don't
  // disqualify a real earlier boundary.
  const boundaryRe = /(?<!\b[A-Z])[.!?][)\]'"’”]*(?:\s+(?=[A-Z])|(?=[A-Z]))/g;
  const boundaries = [...trimmed.slice(0, lastQ).matchAll(boundaryRe)];
  const lastBoundary = boundaries[boundaries.length - 1];
  if (lastBoundary) {
    qStart = lastBoundary.index! + lastBoundary[0].length;
  }
  const body = trimmed.slice(0, qStart).trimEnd();
  const question = trimmed.slice(qStart, lastQ + 1).trim() + (tail ? ' ' + tail : '');
  // Don't bold tiny questions ("Yes?") or ones that look like an
  // interjection — keep the bubble visually calm when the "question"
  // is just an acknowledgement.
  if (question.length < 6) return null;
  // If the body is empty (no sentence terminator before the ?), the
  // entire bubble is one question. Bolding the whole bubble looks
  // visually noisy — observed 2026-04-30, single-question turns
  // rendered fully bold. Skip the split so the renderer falls back
  // to plain rendering.
  if (!body) return null;
  return { body, question };
}

/** Classify the trailing question as yes/no, true/false, or open. Used to
 *  decide whether to render quick-answer buttons.
 *  - 'yes-no'      → "Does that make sense?", "Want to try one?", "Did you get it?"
 *  - 'true-false'  → "True or false: ...", "Is this right or wrong?"
 *  - 'open'        → anything else; no quick-answer buttons.
 *
 *  Conservative: only the most-clearly-structured patterns trigger
 *  buttons. False positives mean the student sees a quick-answer UI
 *  for a question that actually needed a longer answer — annoying but
 *  not blocking. False negatives mean no buttons (current default).
 */
export type QuickAnswerKind = 'yes-no' | 'true-false' | 'open';
/**
 * Detect continuation / wrap-up questions ("Ready for the next one?",
 * "Want to keep drilling?", "Should we wrap up?"). Used to gate the
 * I'm-stuck button: when the tutor's trailing question is offering
 * forward motion (no active problem to be stuck on), the button is
 * meaningless — and observed 2026-05-24 the brain interprets the
 * click as an advance signal instead of a Socratic-breakdown request.
 *
 * Mirrors the orchestrator's continuationQuestionRegex shape so the
 * UI gate aligns with the brain-side detection.
 */
function isContinuationQuestion(question: string): boolean {
  if (!question) return false;
  const q = question.trim();
  if (!q.endsWith('?')) return false;
  return /\b(?:ready (?:to|for)|want to|should we|shall we|on to the|move on|got it|next one|keep going|keep drilling|wrap up|done for now|good for now|all set|that's enough|more practice)\b[^?]{0,80}\?\s*$/i.test(q);
}

export function classifyQuestionForQuickAnswer(question: string): QuickAnswerKind {
  if (!question) return 'open';
  const q = question.trim().toLowerCase();
  // True/false form: explicit "true or false" framing or "is this right or wrong"
  if (/\btrue or false\b/.test(q) || /\bright or wrong\b/.test(q) || /\bcorrect or incorrect\b/.test(q)) {
    return 'true-false';
  }
  // Yes/no form: starts with one of the canonical yes/no question words
  // and is reasonably short. Long questions usually want a richer answer
  // even when phrased as yes/no.
  if (q.length > 140) return 'open';
  // Polite-imperative open questions ("Can you tell me X?", "Could you
  // explain Y?", "Will you describe Z?") look like yes/no on the
  // surface but expect a content answer — filter them BEFORE the
  // yes-no test so they fall through to 'open'. Pattern: yes/no aux +
  // "you" + open-imperative verb. Observed 2026-04-30 pre-calc session
  // showing Yes/No buttons on "Can you tell me what the expansion of
  // (sin+cos)^2 actually is?".
  const politeImperative = /^(can|could|will|would|do|did|does|are|is|have|has)\s+(you|i)\s+(tell|explain|describe|show|give|find|name|list|state|write|solve|calculate|compute|figure|work|think|recall|remember|identify|expand|simplify|derive|estimate|guess)\b/;
  if (politeImperative.test(q)) return 'open';
  const yesNoStart = /^(does|did|do|is|are|was|were|will|would|can|could|should|shall|may|might|have|has|had|want|ready|sure|got|see|make sense|makes sense)\b/;
  if (yesNoStart.test(q)) return 'yes-no';
  // "Want to try X?" / "Ready to do Y?" common tutor close-out form
  if (/\b(want to|ready to|shall we|how about|wanna)\b.+\?$/.test(q)) return 'yes-no';
  // "Does that make sense?" / "Make sense?" specifically
  if (/\bmake[s]? sense\?$/.test(q)) return 'yes-no';
  return 'open';
}

export function TranscriptView({ transcript, isProcessing, picker, pickerAnchorIndex, onQuickAnswer, enablePacingChips, emptyHint = 'Start speaking to begin!', stickToBottom = false, tutorLabel }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // GreenApple round 6, task 4: wraps just the message bubbles (not the
  // portalled zoom overlay) so a ResizeObserver can watch CONTENT growth —
  // the scroller div itself is `h-full` and never resizes as messages are
  // added, only its scrollHeight does, which ResizeObserver can't see on
  // that element directly.
  const contentRef = useRef<HTMLDivElement>(null);
  // Task 9: the upload thumbnail currently open in the zoom overlay.
  const [zoomImage, setZoomImage] = useState<{ dataUrl: string; name?: string } | null>(null);

  // Auto-scroll to bottom when new messages arrive (or when the picker
  // mounts/unmounts) — but ONLY if the user is already near the bottom.
  // Otherwise a streaming update would yank them back down every tick,
  // making the transcript feel "stuck" / unscrollable when they try to
  // read earlier turns (observed in the new SessionStage drawer 2026-06-23).
  // Text mode ("stickToBottom"): standard chat semantics instead of the
  // near-bottom-only rule below. Diagnosis (owner live-test, re-review
  // 2026-09-19), two root causes found against a live :3007 session:
  //  1. `containerRef` IS the real scroller (confirmed via an instrumented
  //     run — the ancestor chain up to the panel's `absolute z-50` wrapper
  //     all report scrollHeight===clientHeight; only this `h-full
  //     overflow-y-auto` div actually overflows) — so it was never a
  //     wrong-element problem. But the `< 120` "near bottom" gate below
  //     compares the STALE scrollTop from before a DOM commit against the
  //     NEW scrollHeight after it, so a reply that lands as one full
  //     paragraph (text mode has no per-character caption reveal the way
  //     voice's TTS-timed captions do) can jump distance-from-bottom past
  //     120px in a single commit, permanently stranding the view with no
  //     event left to re-trigger the scroll.
  //  2. The FIX's own first attempt (a separate `useEffect(…, [stickToBottom])`
  //     that attached scroll/wheel/touch listeners once, to track when the
  //     student deliberately scrolls up) had a mount-order bug: this
  //     component EARLY-RETURNS a completely different, containerRef-less
  //     JSX tree while `transcript.length === 0` (see the empty-state
  //     return below), so on the very first render `containerRef.current`
  //     is null. `[stickToBottom]` never changes again after mount, so
  //     that effect ran exactly once against a null ref and the listeners
  //     were NEVER attached — confirmed by an instrumented run: the
  //     "scrolled up" ref stayed `false` no matter how far the student
  //     scrolled, and the very next tutor chunk always yanked the view
  //     back to the bottom (a real second bug, not merely a test
  //     artifact — reproduced with both a real wheel scroll and a direct,
  //     synchronous `scrollTop` + `dispatchEvent('scroll')`, ruling out an
  //     event-ordering race). Folding attachment into THIS effect — which
  //     already re-runs on every `transcript`/`picker` change, i.e.
  //     exactly when the empty→populated transition happens — fixes it:
  //     by the time this effect body runs for a non-empty transcript,
  //     `containerRef.current` is guaranteed to be the mounted node.
  // `stickToBottom` sidesteps gate (1) entirely: the student's own message
  // always scrolls to bottom, and a tutor entry arriving/streaming scrolls
  // to bottom unless the student deliberately scrolled away. Voice's
  // near-bottom-only rule (the `else` branch) is completely untouched.
  const userScrolledUpRef = useRef(false);
  // Round 7, task 5: end of TranscriptView's own programmatic-scroll guard
  // window (`performance.now() + 200`, armed by `scrollToBottom()` below).
  // A `scroll` event the listener sees before this deadline is presumed to
  // be an echo of our own `el.scrollTop = el.scrollHeight` write — not the
  // student scrolling away — and is ignored via `latchFromScrollEvent`.
  const programmaticScrollUntilRef = useRef(0);
  // Round 7, task 5, fix round 1: hoisted out of the follow-to-bottom
  // effect below so the drawer-open snap effect further down (which writes
  // `el.scrollTop = el.scrollHeight` on the SAME container) can arm the
  // same guard window — it can false-latch exactly like the three sites
  // already fixed. Reads `containerRef.current` fresh on every call
  // (rather than closing over one effect's `el`) so it's safe to call from
  // any effect in this component.
  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    programmaticScrollUntilRef.current = performance.now() + 200;
    el.scrollTop = el.scrollHeight;
  };
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    const lastEntry = transcript[transcript.length - 1];
    const lastRole = lastEntry?.role;
    let removeListeners: (() => void) | undefined;
    if (stickToBottom) {
      const onScrollLikeEvent = (event: Event) => {
        const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
        const latch = latchFromScrollEvent({
          type: event.type as 'scroll' | 'wheel' | 'touchmove',
          distanceFromBottom: distance,
          now: performance.now(),
          programmaticUntil: programmaticScrollUntilRef.current,
        });
        if (latch !== null) userScrolledUpRef.current = latch;
      };
      el.addEventListener('scroll', onScrollLikeEvent, { passive: true });
      el.addEventListener('wheel', onScrollLikeEvent, { passive: true });
      el.addEventListener('touchmove', onScrollLikeEvent, { passive: true });
      removeListeners = () => {
        el.removeEventListener('scroll', onScrollLikeEvent);
        el.removeEventListener('wheel', onScrollLikeEvent);
        el.removeEventListener('touchmove', onScrollLikeEvent);
      };
      // The student's own message just landed (or is still the latest
      // entry while the reply is pending) — always clear the "scrolled
      // up" latch, exactly like sending a message in any standard chat
      // UI. (The actual scroll happens via the shared decision below.)
      if (lastRole === 'student') {
        userScrolledUpRef.current = false;
      }
    }
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    // GreenApple round 6, task 4: the shared pure decision (see
    // transcript-follow.ts) — same rule the fonts.ready / ResizeObserver
    // re-checks below re-apply.
    const decision = shouldFollowToBottom({
      stickToBottom,
      userScrolledUp: userScrolledUpRef.current,
      lastRole,
      nearBottom,
    });
    if (decision) scrollToBottom();

    // Math bubbles render through InlineMathText's synchronous
    // `katex.render()` with no font-load handling (unlike EquationRenderer,
    // which re-fits after `document.fonts.ready`). A math-bearing reply can
    // land, get the scroll above, and then grow taller once KaTeX's web
    // fonts swap in — stranding the view short of the bottom (live
    // symptom: a math-bearing tutor reply appeared but the panel stayed
    // short of the bottom).
    //
    // Fix round 1: this must NOT re-apply the `decision` captured above —
    // a student can scroll away in the gap between the initial scroll and
    // fonts settling, and re-applying a frozen "should follow" would yank
    // them back down. `refollowDecision` reads `userScrolledUpRef.current`
    // LIVE, at the moment fonts actually settle. Gated to text mode
    // (`stickToBottom`) so voice mode — which never had a fonts.ready
    // re-check before commit 97e933bc — stays byte-identical.
    // `nearBottomNow: true` is a dummy: `refollowDecision` ignores it in
    // text mode (text mode's rule is latch/role-based, not distance-based)
    // and short-circuits to `false` before reading it at all in voice mode.
    if (stickToBottom && typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        if (refollowDecision({ stickToBottom, userScrolledUpNow: userScrolledUpRef.current, lastRole, nearBottomNow: true })) {
          scrollToBottom();
        }
      });
    }

    // Late layout growth beyond the font swap (e.g. images decoding, a
    // second reflow) — text mode only. Re-follow for as long as this
    // effect instance is alive, gated by the LIVE "scrolled up" latch via
    // the same `refollowDecision` the fonts.ready check above uses.
    let ro: ResizeObserver | undefined;
    if (stickToBottom && typeof ResizeObserver !== 'undefined' && contentRef.current) {
      ro = new ResizeObserver(() => {
        if (cancelled) return;
        if (refollowDecision({ stickToBottom, userScrolledUpNow: userScrolledUpRef.current, lastRole, nearBottomNow: true })) {
          scrollToBottom();
        }
      });
      ro.observe(contentRef.current);
    }

    return () => {
      cancelled = true;
      removeListeners?.();
      ro?.disconnect();
    };
  }, [transcript, picker, stickToBottom]);

  // Round-6e (third attempt at "open at the latest message"): the drawer's
  // OWNER announces every open ('evelyn:transcript-drawer-opened', see
  // SessionStage) and we snap on that signal. The two prior attempts
  // detected the hidden→visible transition with a ResizeObserver (immediate
  // snap, then a 220ms-delayed snap) — both worked in a minimal Chromium
  // repro and failed on real phones, i.e. they depended on engine-specific
  // RO delivery for display:none subtrees (WebKit does not reliably deliver
  // the 0-size observation while hidden, so the transition never registers
  // after the first open). An explicit signal has no such dependency. The
  // 200ms delay covers the drawer's own layout settling (the q-pin deep
  // link's 180ms wait is the same idea); a pending entryId deep link (set
  // below) owns the position instead.
  const pendingEntryScrollAtRef = useRef(0);
  useEffect(() => {
    const onOpened = () => {
      setTimeout(() => {
        if (Date.now() - pendingEntryScrollAtRef.current < 1500) return;
        // Round 7, task 5, fix round 1: routed through the shared
        // scrollToBottom() helper (armed guard window) instead of a bare
        // write — this snap dispatches a `scroll` event on the same
        // container the follow-to-bottom effect's listener watches, and
        // could false-latch "scrolled up" identically to the three sites
        // fixed earlier.
        scrollToBottom();
      }, 200);
    };
    window.addEventListener('evelyn:transcript-drawer-opened', onOpened);
    return () => window.removeEventListener('evelyn:transcript-drawer-opened', onOpened);
  }, []);

  // Q-pin deep link (2026-07-15): the pin's click carries the tutor entry id
  // on the 'evelyn:open-transcript' event; scroll that entry into view once
  // the drawer has opened (the drawer is display:none while closed on
  // phones, so the scroll must wait a beat for it to become visible) and
  // flash it so the eye lands on the right bubble.
  const [flashEntryId, setFlashEntryId] = useState<string | null>(null);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const entryId = (e as CustomEvent<{ entryId?: string }>).detail?.entryId;
      if (!entryId) return;
      // Tell the visibility-snap (above) that a deep-link scroll owns the
      // position for this open.
      pendingEntryScrollAtRef.current = Date.now();
      setTimeout(() => {
        const container = containerRef.current;
        const target = container?.querySelector(`[data-entry-id="${CSS.escape(entryId)}"]`) as HTMLElement | null;
        // R35 T-B: manual container-scoped scroll — NOT scrollIntoView().
        // scrollIntoView() walks every ancestor scrolling box to bring the
        // target into view, and in the embedded Crimsora demo (this whole
        // app inside an iframe on a marketing page) that walk doesn't stop
        // at the drawer or even at the iframe boundary — Chrome/Safari
        // propagate the "scroll me into view" request up into the PARENT
        // document too, so opening the transcript yanked the ENTIRE
        // marketing page down (2026-07 demo feedback). Computing the
        // target's offset against this drawer's own scroll container via
        // getBoundingClientRect (pure geometry read, no scrolling side
        // effect) and setting scrollTop directly never touches any
        // ancestor outside this element — safe inside an iframe or not.
        if (container && target) {
          const delta = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
          container.scrollTop += delta;
        }
        setFlashEntryId(entryId);
        setTimeout(() => setFlashEntryId(null), 2000);
      }, 180);
    };
    window.addEventListener('evelyn:open-transcript', onOpen);
    return () => window.removeEventListener('evelyn:open-transcript', onOpen);
  }, []);

  // Progressive hint under the typing-dots while the brain is composing.
  // Most turns finish in 2-7s; if it takes longer, fade in a soft
  // "still thinking…" reassurance, then a recovery hint near the
  // page-level 10s watchdog so the student knows what to do if the
  // request truly stalled.
  const [thinkingHint, setThinkingHint] = useState<string | null>(null);
  useEffect(() => {
    if (!isProcessing) {
      setThinkingHint(null);
      return;
    }
    setThinkingHint(null);
    const t1 = setTimeout(() => setThinkingHint('Still thinking…'), 4000);
    const t2 = setTimeout(() => setThinkingHint('Hmm, that\'s taking a moment — feel free to type below if I missed you.'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isProcessing]);

  if (transcript.length === 0 && !isProcessing && !picker) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p className="text-center">
          Your conversation will appear here.
          <br />
          {emptyHint}
        </p>
      </div>
    );
  }

  // Strip bracketed system-style segments from student bubbles. The
  // picker / homework-upload paths embed runtime instructions for the
  // brain inside `[...]` so the model knows context without the student
  // seeing model-facing text. Two cases:
  //   - Whole-bubble bracketed (e.g. "[start session]"): hide entirely.
  //   - Mixed bubble ("Let's do: Algebra. [Use show_segment_card...]"):
  //     keep the visible prefix, strip the brackets at render time.
  // The brain still sees the FULL text in its prompt — only the chat
  // display is sanitized.
  //
  // Defensive: also strip a TRAILING orphan `]...]` if a synthetic
  // message accidentally contained nested brackets (e.g. `segments[]`
  // inside the instruction) — observed 2026-04-29 trig session, where
  // " array — do not invent segment ids.]" leaked into the bubble
  // because the inner `]` truncated the non-greedy match early.
  const visibleTranscript = transcript
    // historyOnly entries exist purely for the brain's conversation
    // history (e.g. "(rendered: tool, tool, …)" placeholders for
    // tool-only turns). They MUST NOT render in the chat UI.
    // Task 9 exception: an image-bearing historyOnly entry (the upload's
    // echo / placeholder) renders as the thumbnail ALONE — its text is the
    // brain-facing extraction, so it's blanked here.
    .filter((entry) => !entry.historyOnly || !!entry.image)
    .map((entry) => {
      if (entry.historyOnly && entry.image) return { ...entry, text: '' };
      if (entry.role !== 'student') return entry;
      let stripped = entry.text.replace(/\s*\[[\s\S]*?\]\s*/g, ' ');
      // Trailing orphan `]` (no matching `[` ahead in remaining text):
      // anything from the last unmatched `]` back to the prior sentence
      // boundary is brain-only instruction that leaked.
      if (stripped.includes(']') && !stripped.includes('[')) {
        const lastBracket = stripped.lastIndexOf(']');
        const cutFrom = stripped.lastIndexOf('.', lastBracket);
        stripped = (cutFrom >= 0 ? stripped.slice(0, cutFrom + 1) : '').trim();
      }
      stripped = stripped.replace(/\s+/g, ' ').trim();
      if (!stripped) return entry.image ? { ...entry, text: '' } : null;
      return stripped === entry.text ? entry : { ...entry, text: stripped };
    })
    .filter((e): e is TranscriptEntry => e !== null);

  // Compute the split point: clamp the anchor to [0, visibleTranscript.length].
  // If the anchor was never set (picker not yet eligible) or the picker
  // is null (dismissed/started), no split happens.
  const anchor = picker != null && typeof pickerAnchorIndex === 'number'
    ? Math.max(0, Math.min(pickerAnchorIndex, visibleTranscript.length))
    : null;
  const beforePicker = anchor !== null ? visibleTranscript.slice(0, anchor) : visibleTranscript;
  const afterPicker = anchor !== null ? visibleTranscript.slice(anchor) : [];

  // Identify the LATEST tutor entry id — quick-answer buttons render
  // only on that one (and only when its trailing question is yes/no
  // or true/false). Without this gating we'd show buttons under every
  // tutor turn in scrollback, which would clutter and confuse.
  //
  // ADDITIONAL gate: hide the buttons once the student has responded
  // to that tutor turn (typed something, or already tapped a button).
  // The new tutor turn might still be in flight — latestTutorEntryId
  // doesn't shift until streaming completes — so without this, a
  // late tap on the now-stale buttons gets queued and processed as
  // an answer to the NEXT question. Observed 2026-04-30 geography
  // session: user typed "got it" / "ok" then clicked Yes; "Yes"
  // arrived as a fresh student turn against the next tutor question.
  let latestTutorEntryId: string | null = null;
  let studentRespondedAfterLatest = false;
  for (let i = visibleTranscript.length - 1; i >= 0; i--) {
    const e = visibleTranscript[i];
    if (e.role === 'tutor' && !e.streaming) {
      latestTutorEntryId = e.id;
      break;
    }
    if (e.role === 'student') {
      studentRespondedAfterLatest = true;
    }
  }
  // Phase 3: pacing chips (Skip ahead / I'm stuck) gating. Don't show
  // on the very first tutor turn (the welcome / hook) — there's no
  // problem to be stuck on or skip from yet, and the chips read as
  // visual noise. After the welcome message and the student's first
  // response, the chips become available.
  // Heuristic: count finalized tutor turns; only show chips when ≥ 2
  // (welcome + at least one teaching turn).
  const tutorTurnsFinalized = visibleTranscript.reduce(
    (n, e) => n + (e.role === 'tutor' && !e.streaming ? 1 : 0),
    0,
  );
  const pacingChipsAllowed = tutorTurnsFinalized >= 2;

  const renderEntry = (entry: TranscriptEntry) => {
    // System-role entries are orchestrator-injected notices (e.g.
    // "Plan changed → <title>"). They are NOT chat bubbles — render as
    // a slim centred pill so they're visibly distinct from student
    // and tutor turns. No avatar, no quick-answer chips.
    if (entry.role === 'system') {
      return (
        <div key={entry.id} className="flex justify-center">
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            {entry.text}
          </div>
        </div>
      );
    }
    const split = entry.role === 'tutor' && !entry.streaming ? splitTrailingQuestion(entry.text) : null;
    const quickKind = (
      onQuickAnswer && entry.id === latestTutorEntryId && split && !studentRespondedAfterLatest
        ? classifyQuestionForQuickAnswer(split.question)
        : 'open'
    );
    // Issue #2a gate (2026-05-24): hide the I'm-stuck chip when the
    // trailing question is a continuation / wrap-up offer. In that
    // state there's no active problem to break down — the prior one
    // was just solved, the tutor is offering forward motion. Observed
    // 2026-05-24: student clicked I'm-stuck right after "Ready for the
    // next one?" and the brain advanced + acknowledged the prior
    // answer as if it were the response. The button is meaningless in
    // this state; gating prevents the ambiguous click. Skip ahead stays
    // visible — it's meaningful regardless. The button also stays
    // hidden when there's NO trailing question at all (statement-only
    // tutor turns).
    const showStuckChip = !!split && !isContinuationQuestion(split.question);
    return (
    <div
      key={entry.id}
      data-entry-id={entry.id}
      className={`flex gap-3 transition-all duration-300 ${
        entry.role === 'student' ? 'flex-row-reverse' : ''
      } ${entry.revising ? 'opacity-40 italic' : ''} ${
        entry.id === flashEntryId ? 'rounded-xl ring-2 ring-amber-300 bg-amber-50/60' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          entry.role === 'student'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-purple-100 text-purple-600'
        }`}
      >
        {entry.role === 'student' ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message */}
      <div
        className={`flex-1 ${
          entry.role === 'student' ? 'text-right' : ''
        }`}
      >
        {entry.role === 'tutor' && tutorLabel && (
          <p className="text-[11px] text-slate-500 mb-0.5">{tutorLabel}</p>
        )}
        <div
          className={`inline-block max-w-[80%] p-3 rounded-lg ${
            entry.role === 'student'
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {entry.image && (
            <button
              type="button"
              onClick={() => setZoomImage(entry.image ?? null)}
              className={`block ${entry.text ? 'mb-2' : ''} ${entry.role === 'student' ? 'ml-auto' : ''}`}
              aria-label="Enlarge uploaded image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- live-only data: URL */}
              <img
                src={entry.image.dataUrl}
                alt={entry.image.name ?? 'Uploaded image'}
                className="h-24 rounded-lg border border-slate-200 object-cover"
              />
            </button>
          )}
          {entry.image && !entry.text ? null : entry.role === 'tutor' && !entry.streaming
            ? (() => {
                if (!split) {
                  return (
                    <p className="whitespace-pre-wrap">
                      {renderBubbleText(entry.text)}
                    </p>
                  );
                }
                return (
                  <p className="whitespace-pre-wrap">
                    {split.body && (
                      <>
                        {renderBubbleText(split.body)}
                        {' '}
                      </>
                    )}
                    <span className="font-semibold">
                      {renderBubbleText(split.question)}
                    </span>
                  </p>
                );
              })()
            : (
              <p className={`whitespace-pre-wrap ${entry.role === 'tutor' && entry.streaming ? 'typing-caret' : ''}`}>
                {renderBubbleText(entry.text)}
              </p>
            )
          }
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-1">
          {formatTime(entry.timestamp)}
        </p>

        {/* Quick-answer + pacing buttons under the LATEST tutor turn.
            Yes/no/true-false chips appear when the trailing question
            classifies (existing behavior). Phase 3 adds Skip ahead /
            I'm stuck chips that always appear on the latest tutor
            turn when enablePacingChips is on. All chips share the
            same visual row — single region of "quick actions". They
            disappear when the next tutor turn starts streaming
            because that turn becomes the new "latest". */}
        {onQuickAnswer && entry.id === latestTutorEntryId && !studentRespondedAfterLatest && (quickKind !== 'open' || (enablePacingChips && pacingChipsAllowed)) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(quickKind === 'yes-no'
              ? [
                  { label: 'Yes', text: 'Yes' },
                  { label: 'No', text: 'No' },
                  { label: 'Not sure', text: 'I\'m not sure' },
                ]
              : quickKind === 'true-false'
                ? [
                    { label: 'True', text: 'True' },
                    { label: 'False', text: 'False' },
                    { label: 'Not sure', text: 'I\'m not sure' },
                  ]
                : []
            ).map((opt) => (
              <button
                key={opt.label}
                // Disable while a brain turn is in flight. Otherwise the
                // tap is queued and processed AFTER the in-flight turn
                // completes — by which point the question on screen has
                // already advanced (observed 2026-04-30 algebra-2
                // session: user typed "Sure", buttons remained on the
                // prior bubble during streaming, user also clicked
                // "Yes", brain treated it as a response to the next
                // question and revealed the misconception answer
                // unprompted).
                disabled={!!isProcessing}
                onClick={() => onQuickAnswer(opt.text)}
                className="px-3 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                {opt.label}
              </button>
            ))}
            {/* Phase 3 — pacing chips. Slightly different visual tone
                (amber/gray) so they read as a separate kind of action
                vs. the yes/no answers, while sharing the same row.
                Hidden on the very first tutor turn (the welcome /
                hook); see pacingChipsAllowed gate above. */}
            {enablePacingChips && pacingChipsAllowed && (
              <>
                {showStuckChip && (
                <button
                  key="pacing-stuck"
                  disabled={!!isProcessing}
                  // Bracketed directive locks the brain into Socratic
                  // breakdown — the chip's intent is "guide me", not
                  // "show me the answer". Without this directive the
                  // brain has been observed revealing the answer card
                  // and self-affirming as if the student had given it
                  // (2026-05-06 lines session: brain emitted
                  // show_equation("y = 2x + 5") then said "Exactly —
                  // y equals 2x plus 5!" without student ever
                  // answering). TranscriptView's bracketed-segment
                  // strip hides the directive in chat.
                  // Gated by showStuckChip (2026-05-24) — hidden when
                  // the trailing question is a continuation / wrap-up
                  // offer with no active problem to be stuck on.
                  onClick={() => onQuickAnswer(STUCK_TEXT)}
                  className="px-3 py-1 text-xs font-medium bg-white text-amber-700 border border-amber-300 rounded-full hover:bg-amber-50 hover:border-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  I&apos;m stuck
                </button>
                )}
                <button
                  key="pacing-skip"
                  disabled={!!isProcessing}
                  // Bracketed directive teaches the brain to be
                  // decisive — actually skip rather than counter-asking
                  // "skip to what?". TranscriptView strips the
                  // bracketed segment from the visible chat (see
                  // mixed-bubble strip), so the student sees only the
                  // clean leading sentence.
                  //
                  // Anti-self-affirmation guard added 2026-05-07: brain
                  // was observed treating a Skip click as if the student
                  // had answered the prior question — emitted "Neutrons
                  // — exactly right!" and continued teaching instead of
                  // advancing. The student saw their Skip click next to
                  // a fabricated affirmation. The directive below is
                  // explicit that Skip is NOT an answer and the brain
                  // MUST NOT affirm or fabricate one.
                  onClick={() => onQuickAnswer(SKIP_TEXT)}
                  className="px-3 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Skip ahead
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4"
    >
      {/* GreenApple round 6, task 4: this inner wrapper (not the scroller
          div above) is what the ResizeObserver in the scroll effect
          watches — the scroller is `h-full` and never resizes as content
          grows, only its scrollHeight does. `space-y-4` moved down here
          with the content it was already spacing. */}
      <div ref={contentRef} className="space-y-4">
        {beforePicker.map(renderEntry)}
        {anchor !== null && picker}
        {afterPicker.map(renderEntry)}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="inline-block bg-gray-100 p-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
                {thinkingHint && (
                  <p className="text-xs text-gray-500 mt-1.5 italic">{thinkingHint}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {zoomImage && (
        <ImageZoomOverlay
          src={zoomImage.dataUrl}
          alt={zoomImage.name ?? 'Uploaded image'}
          onClose={() => setZoomImage(null)}
        />
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
