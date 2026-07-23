# Q-pin collapse + drag — design

**Date:** 2026-07-23
**Problem:** The Q-pin (tutor-question gist toast, R23) is an absolute overlay at top-center of the board (`SessionStage.tsx` ~line 720, `top-16`/`top-[100px]`, z-20). Whiteboard content frequently starts at the top (tables, headers), so the pin covers it for the whole turn — observed live in AP Statistics U1.9 (2026-07-23).

## Goals

- The pin still catches a student who missed the spoken question.
- Long-term occlusion of board ink drops from "whole turn" to a few seconds.
- Student can reposition the pin; works on touch devices.

## Design

### 1. Auto-collapse to edge chip

- Pin renders full-size exactly as today when a new turn's question lands.
- **Collapse trigger:** tutor-finished-speaking + 6s. **Hard fallback:** 15s after pin-show (covers a missing/never-firing TTS-end signal).
- On collapse, the pin animates into a small amber `Q` chip docked at the board's **right edge, under the tools/wrench rail** (already reserved non-board space).
- **Tap chip → re-expand** at the remembered expanded position (custom if dragged this session, else default top-center); the collapse timer restarts (tutor-not-speaking path: plain 6s).
- **✕ keeps its current meaning:** dismiss entirely for the turn (no chip). Existing `pinFetchedTurnRef` guard prevents same-turn reappearance.
- **New turn** resets to expanded at the default (or session-custom, see below) position.

### 2. Draggability

- The **expanded** pin is draggable anywhere over the board. The chip is **not** draggable (stays docked).
- Implemented with **pointer events** (`pointerdown/move/up` + `setPointerCapture`) so mouse and touch share one code path; drag handle = the whole pin body.
- **~5px movement threshold** distinguishes drag from tap, so tap-to-open-transcript and Enter/Space keyboard activation keep working unchanged.
- Position **clamps to the stage bounds** (pin never leaves the board area or slides under the floating tutor bar / header).
- A drag is a deliberate placement: it **cancels auto-collapse for that turn**, and the custom position is **remembered for subsequent pins in the same session** (ref, not persisted).
- Position stored as **fractional offsets** (x%, y% of stage) so it survives stage resizes / orientation changes; re-clamped on resize.

### 3. Mobile / touch specifics

- `touch-action: none` on the pin while a pointer is down, so dragging doesn't scroll/zoom the embed page; taps unaffected.
- Threshold check happens before any `preventDefault`, so native tap semantics stay intact.
- Chip hit target ≥ 40×40px (visual can be smaller with padding) for touch accuracy.
- Pin `max-width` already `min(88vw, 560px)`; clamping uses the live stage rect, so small phones keep the pin fully on-screen.
- No hover affordances required anywhere (tap chip to expand; hover states remain cosmetic).
- Drag must respect iOS safe-area insets via the existing stage bounds (the stage already accounts for them).

### 4. Ownership / code shape

- **`SessionStage.tsx`** owns all new state: collapse timer, expanded/chip mode, drag handling, custom position ref. It already owns pin placement.
- **`TutorSession.tsx`** keeps building the pin content unchanged; additionally exposes an **`isTutorSpeaking` boolean** (or a "speech ended" timestamp) to SessionStage for the collapse timer.
- The hiccup pin (round-28b, board-bottom) is untouched.

## Error handling / edge cases

- TTS-end never fires → 15s fallback collapses anyway.
- Question dismissed (✕) mid-drag → drag state cleared with the pin.
- Stage resize while chip is shown → chip stays docked (no position math needed); expanded pin re-clamps.
- Turn changes while collapsed → chip replaced by the new turn's expanded pin (existing turn-id gating already unmounts stale pins).

## Testing

- Unit: threshold logic (tap vs drag), clamp math, timer trigger precedence (TTS-end+6s vs 15s fallback), custom-position reuse across turns.
- Manual (desktop + iOS Safari + Android Chrome, inside the academy embed): drag, tap-to-transcript still works, chip tap re-expands, no page scroll during drag, safe-area clamping in landscape.

## Out of scope

- Content-aware placement (measuring ink bounds).
- Persisting position across sessions.
- Making the hiccup pin draggable/collapsible.
