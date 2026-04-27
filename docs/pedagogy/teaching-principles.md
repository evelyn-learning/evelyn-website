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
- status: proposed (Track 2b)
- where: `system-prompt-builder.ts` rule + `claude-brain.ts` sentence event extension + `useOpenAIRealtime.ts` Realtime instructions
- notes: see Track 2b plan — `*word*` → emphasis tag; explicit pause events.

### [P-02] Allow the student a few seconds to comprehend

**Principle.** When a teacher writes something on the board or says something dense, students need 2–5 seconds to read, parse, and absorb before being asked anything. Filling that silence with more talk degrades comprehension.

**Manifestation in tutor.** After every `show_*` tool call, the spoken voice pauses for an appropriate beat (length scaled by content density and student grade) before continuing. If the student speaks during the pause, the pause cancels.

**Implementation.**
- type: engine-rule
- status: proposed (Track 2d)
- where: orchestrator post-tool-call hook + speakText queue extension
- notes: pause length proposal: small=800ms, medium=1500ms, large=2500ms; multiplied 1× for grades 9-12, 1.5× for 3-8, 2× for K-2.

<!-- Append new principles below. Suggested numbering continues from P-03. -->
