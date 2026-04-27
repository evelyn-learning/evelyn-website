# Teaching principles → engine rules

A working file. As you (or anyone) discover principles of good teaching, drop them here. Each one becomes one of:

- a **system-prompt rule** the brain follows,
- an **engine rule** in the orchestrator (timing, dispatch, validation),
- a **tool affordance** (a new tool or a flag on an existing tool), or
- an **out-of-scope** note (with a reason).

The point of this file is to keep the principle, the manifestation, and the implementation status in one place so we can see at a glance which principles are wired in and which are still aspirational.

---

## Format

Each entry follows this template:

```markdown
### [P-NN] Short principle title

**Principle.** One paragraph in plain English. What good teaching looks like.

**Manifestation in tutor.** Concrete behavior. What does this look like
when the tutor follows the principle? What would a student notice?

**Implementation.**
- type: [system-prompt-rule | engine-rule | tool-affordance | out-of-scope]
- status: [proposed | wired | partial | wontfix]
- where: [file path or component, when wired]
- notes: [any nuance or follow-up]
```

When a principle is wired, mark it `wired` and link the file. When it's a known gap we've decided not to fix, mark it `wontfix` with a reason.

---

## Active principles

<!-- Drop new principles below. Number them P-01, P-02, … so they can be referenced from commits, PRs, and other docs. -->

### [P-01] Talk like a teacher, not a TTS agent

**Principle.** A teacher emphasises certain keywords, varies their cadence, pauses before important points, and slows down when something is hard. A TTS narration reads at uniform pace and uniform stress, which is exhausting to listen to and obscures what's important.

**Manifestation in tutor.** When the brain wants emphasis on a word, the spoken voice actually emphasises it. After writing a formula on the board, the tutor reads it aloud with stress on the variables, then pauses. Difficult concepts come in slower than easy summaries.

**Implementation.**
- type: system-prompt-rule + engine-rule
- status: wired (Track 2b)
- where: `src/lib/tutor/pedagogy/voice-cadence.ts` (system prompt block) + `src/lib/tutor/voice/claude-brain.ts` `BrainStreamEvent.sentence.pauseAfter` + `src/lib/tutor/engine/orchestrator.ts` (auto-emits pause events) + `src/app/tutor/components/VoiceTutorRealtime.tsx` (strips `*emphasis*` markers before voicing for now; raw markers available upstream when a future TTS layer wants prosody).
- notes: brain wraps stress words `*like this*`. Emphasis is stripped client-side today since neither Realtime nor Cartesia consumes the markers directly yet — Cartesia SSML hookup is the natural follow-up.

### [P-02] Allow the student a few seconds to comprehend

**Principle.** When a teacher writes something on the board or says something dense, students need 2–5 seconds to read, parse, and absorb before being asked anything. Filling that silence with more talk degrades comprehension.

**Manifestation in tutor.** After every `show_*` tool call, the spoken voice pauses for an appropriate beat (length scaled by content density and student grade) before continuing. If the student speaks during the pause, the pause cancels.

**Implementation.**
- type: engine-rule
- status: wired (Track 2d)
- where: `src/lib/tutor/engine/orchestrator.ts` auto-emits a `pause` event after every visual tool call; `BrainStreamEvent.sentence.pauseAfter` lets the brain hint small/medium/large after dense sentences. `VoiceTutorRealtime` honors `pause` events with a `setTimeout` between sentence voicings, gated by the attempt-killed flag so a pause inside a doomed retry doesn't delay the winning attempt.
- notes: baseline durations small=600ms / medium=1200ms / large=2000ms; post-tool baseline 1100ms. Multiplied per grade band — K-2 ×2, 3-5 ×1.5, 6-8 ×1.2, 9-12 ×1.0 — by `getGradeProfile()`.

### [P-03] Pedagogy adapts to the student's grade band

**Principle.** A 6-year-old learning what an answer looks like and a 17-year-old reasoning about abstractions don't benefit from the same Socratic depth, sentence length, vocabulary, or pacing. Teaching is a moving target, not a uniform style.

**Manifestation in tutor.** Configured grade is read at the start of every brain call. The system prompt inlines a `<grade_profile>` block specific to one of four bands (K-2, 3-5, 6-8, 9-12) describing Socratic default, sentence-length target, vocabulary policy, label-length cap, and pacing multiplier.

**Implementation.**
- type: system-prompt-rule + engine-rule
- status: wired (Track 2a)
- where: `src/lib/tutor/pedagogy/grade-profile.ts` (4 bands, profile struct + render block); `src/lib/tutor/ai/system-prompt-builder.ts` injects the block into the prompt preamble; `src/lib/tutor/engine/orchestrator.ts` reads the profile's `pacingMultiplier` to scale comprehension pauses.
- notes: K-2 defaults to direct modeling, vocabulary capped at Fry-100, label words ≤ 3, ×2 pacing. 9-12 unrestricted. Brain may deviate when the student's actual ability says otherwise — the profile is a default, not a constraint.

### [P-04] Humor is a tool, not a garnish

**Principle.** Humor lands when it serves the pedagogy (analogies, parallel situations, callbacks) and matches the student's register. It fails when it's at the student's expense, when it's a non-sequitur joke, or when it's so clever it derails the explanation. The available level differs by age.

**Manifestation in tutor.** A `<humor ceiling="...">` block in the system prompt tells the brain what's available at the configured grade band's ceiling. Includes localization guidance: bias analogies toward what the student would recognize from their location/language signal (cricket vs baseball, etc.).

**Implementation.**
- type: system-prompt-rule
- status: wired (Track 2c)
- where: `src/lib/tutor/pedagogy/humor.ts` (off / light / medium / heavy ceilings with available + off-limits guidance); selected by the grade profile.
- notes: K-2 ceiling = light; 3-5 = medium; 6-8 = medium; 9-12 = heavy. Future per-student override via the student profile (Track 4).

### [P-05] Try-yourself loops keep the student active

**Principle.** A tutor that lectures without checking in produces students who nod through misconceptions. Mid-explanation, hand off a small problem the student can answer (voice, scribble, photo, or tap), then react to whether they got it.

**Manifestation in tutor.** New tool `show_try_yourself` paints a "your turn" card with the problem, hints (revealed on demand), and an answer surface (MCQ tap, free-response input, numeric box). The student can also answer by writing on the whiteboard or uploading a photo of their work — those existing paths work as before.

**Implementation.**
- type: tool-affordance
- status: partial (Track 2e)
- where: `src/app/tutor/hooks/toolDefinitions.ts` (tool registered + dispatch); `src/app/tutor/components/whiteboard/TryYourselfRenderer.tsx` (UI); `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` (case wired). Whiteboard scribble + photo upload flow through `/api/tutor/extract-homework` as before.
- notes: still to do — wire the `onSubmit` callback to inject a synthetic student turn into the brain so the brain sees the answer immediately (today the student would need to also speak the answer). Tracking under Track 2e completion.

<!-- Append new principles below. Suggested numbering continues from P-03. -->
