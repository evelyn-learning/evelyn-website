# Per-accent teacher personas with geo pre-selection — design

**Date:** 2026-07-19
**Status:** Approved direction (user Q&A this session); persona copy below awaits user copy-approval as part of spec review
**Builds on:** `docs/superpowers/specs/2026-07-19-geo-accent-tutor-voice-design.md` — same branch (`geo-accent-voice`), which is fully reviewed but unmerged/undeployed
**Scope:** Engine repo, public `/tutor` page only. Portal embed untouched; `TeacherPersonaWire` is a frozen portal contract and gains NO new fields.

## Problem / decision

The geo-accent branch made personas voice-swap by student region (Sofia sounds
American to a US student). With a persona for every accent that model is wrong:
the user decided (Q&A 2026-07-19) that **geo should pre-select a local persona
and every persona always speaks its own native voice**. An explicit pick of any
persona sounds like that persona — no cross-gender or cross-accent swaps. This
also retires the final review's one Important finding (en-nl male persona
getting the female Anneliese voice) before it ever ships.

Decisions locked by user:
1. Geo pre-selects persona only; native voices always (voice-swap wiring removed from /tutor).
2. Grid shows the geo-matched F/M pair first, all other personas below.
3. All 9 accents get personas; Claude drafts names/bios, user approves (the roster below IS that draft).
4. F/M pre-select: random once, then sticky via localStorage.

## Persona roster (18 = 4 existing + 14 new)

Existing four keep their ids, copy, and voices: Ms. Elena Vasquez (en-us f,
Katie), Mr. Sameer (en-in m, Sameer), Dr. Amara Osei (en-us f, Skylar —
remains a third en-us option below the fold), Sofia (en-gb f, Gemma).

New personas — name, Cartesia voice, archetype, and student-facing intro
(card + spoken copy, same style rules as the existing four: generic about
curriculum, 1–2 sentences). **This table is the copy the user approves.**

| # | Accent | Name | Voice (locked id source) | Archetype | Intro |
|---|--------|------|--------------------------|-----------|-------|
| 1 | en-us m | Mr. Jake Sullivan | Jameson `a5136bf9-224c-4d76-b823-52bd5efcffcc` | hands-on builder | "I think you learn by building, so we'll roll up our sleeves and make ideas work — draw it, try it, break it, fix it. Expect to be doing, not just listening." |
| 2 | en-in f | Ms. Priya Nair | Palak `28ca2041-5dda-42df-8123-f58ea9c3da00` (recommended; alt: Katie en-in localized `dc4725ab-a34f-4625-9ae3-e35296b456e2`) | structured planner | "I love a good plan: we'll break every topic into small steps, tick them off together, and you'll always know exactly where you stand. Steady progress, no surprises." |
| 3 | en-gb m | Mr. Oliver Hartley | Archie `ef191366-f52f-447a-a398-ed8c0f2943a1` | socratic, dry wit | "I mostly ask questions — good ones, I like to think. You'll do the discovering, I'll supply the nudges and the occasional terrible joke." |
| 4 | en-ar-gulf f | Ms. Maryam Haddad | Maryam `9825cf5f-6aff-412a-80c5-bc58a8d55bc4` | warm everyday-analogies | "I connect every idea to something from daily life — food, family, the world around you. If it doesn't make sense yet, it just needs a better story." |
| 5 | en-ar-gulf m | Mr. Youssef Karim | Youssef `9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2` | calm step-by-step | "No rush, no panic. We take problems one clear step at a time, and we don't move on until the step before feels easy. Calm minds solve hard problems." |
| 6 | en-de f | Ms. Anna Weber | Jennifer `ac197a78-cec7-4c50-93e5-93bdc1910b11` | precise diagram-lover | "I think best with a picture — we'll draw what's really going on, label it properly, and suddenly the hard part isn't so hard. Clarity first, always." |
| 7 | en-de m | Mr. Lukas Brandt | Jan `42f14755-88c3-4124-aae3-5cc3a9618e8f` | systems connector | "Nothing you learn stands alone. I'll show you how today's topic clicks into what you already know, so it stays learned instead of memorized." |
| 8 | en-nl f | Ms. Anneliese de Vries | Anneliese `225ba8cf-9fc2-4371-a78c-fe38ba38898a` | methodical note-keeper | "Tidy notes, tidy thinking. We'll work carefully, keep track of what we discover, and by the end you'll have a page you can actually revise from." |
| 9 | en-au f | Ms. Grace Thompson | Grace `c2ad7092-0447-47ea-948b-61fbb6faf153` | relaxed confidence-builder | "Half of learning is believing you can. We'll keep things low-stress, have a laugh, and sneak up on the hard stuff before you've had time to worry about it." |
| 10 | en-au m | Mr. Cooper Reid | Cooper `49743b08-0f5d-4741-839c-b12933853780` | energetic, sport analogies | "I treat study like training — short focused sets, honest feedback, and you'll be surprised what a few good sessions do. Bring your energy, I'll bring mine." |
| 11 | en-sg f | Ms. Nadia Lim | Nadia `efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f` | sharp and efficient | "We'll be efficient: find exactly what you don't know yet, fix that, and skip what you've already got. Your time matters — let's spend it where it counts." |
| 12 | en-sg m | Mr. Kiran Raj | Kiran `ac5a9529-3965-4eac-b574-dce63664fbf4` | patient worked-examples | "Worked examples are my thing — we'll walk through problems together slowly first, then you take the wheel. Nobody falls behind in my sessions." |
| 13 | en-za f | Ms. Zanele Dlamini | Zanele `263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18` | storyteller, big picture | "Every subject is secretly a story about people and ideas. I'll tell it well, you'll remember it — and the details will finally have somewhere to live." |
| 14 | en-za m | Mr. Pieter van der Merwe | Pieter `baf84392-fa95-4d44-8871-d32ee36b0e01` | practical real-world | "I always answer 'when will I actually use this?' — because there's always an answer. We'll take ideas out of the textbook and put them to work." |

Full `style` blocks (teaching/pace/questioning/etc.) are authored at
implementation time to elaborate each approved archetype, matching the depth
and format of the existing four; they are reviewed in code review, not by the
user. en-nl has no male persona (no passing male voice — accepted).

## Data model

- `DEMO_TEACHERS` (src/lib/tutor/ai/teacher-persona.ts) grows to 18 entries.
  New personas set `voice: { provider: 'cartesia', voiceId: <native voice> }`.
  `TeacherPersonaWire` is NOT modified (frozen portal contract). The header
  comment ("FOUR diverse house personas") is updated.
- `TEACHER_VOICES` (src/lib/tutor/voice/cartesia-voice-registry.ts) gains the
  14 new id → {voiceId, label, gender, nativeAccent} entries — it already
  carries exactly this metadata for the existing four, so the registry stays
  the single source of accent/gender truth.
- New registry export for the page: `teachersForAccent(accent: string):
  { female?: string; male?: string }` returning DEMO_TEACHERS ids whose
  nativeAccent matches. For en-us it returns Elena (f) and Jake (m); Amara is
  never a geo pick (second female) but remains selectable in the grid.
- OpenAI-realtime path: new personas have no OpenAI voice; the existing
  fallback (`selectedTeacher.voice.provider === 'openai' ? … : selectedOpenAIVoice`)
  already handles this — no change.

## /tutor page behavior

- **Voice resolution reverts to persona-native:** the `cartesiaVoiceId` memo
  goes back to `resolveCartesiaVoice({ teacherId: selectedTeacherId })` — the
  `accent` argument is no longer passed. `resolveCartesiaVoice`'s accent
  support and `ACCENT_POOLS` stay intact for the embed/EmbedConfig path.
  `accentFromTimezone` (geo-accent.ts) is reused unchanged for pre-selection.
- **Grid order:** client-side after mount (same post-hydration pattern the
  existing stored-choice restore uses; brief reorder flash accepted): the
  geo pair renders first (female card then male card), remaining personas
  follow — existing four first (minus any already in the pair), then the
  rest grouped by accent in registry order. No geo match (unmapped timezone)
  → today's order exactly, Elena pre-selected. Each card gains a small
  accent hint line (e.g. "Australian accent") — new personas only; the
  existing four stay visually unchanged.
- **Pre-selection (random-once-sticky):** if a stored teacher choice exists
  (existing localStorage persistence), it wins — geo never overrides a
  returning student's teacher. Otherwise pick female/male from the geo pair
  with a 50/50 coin flip and store the result through the SAME persistence
  mechanism, so it sticks on return visits like an explicit pick.
  localStorage unavailable → coin flip each load, non-sticky (graceful).
- Explicitly picking any persona behaves exactly as today (persisted choice,
  native voice).

## Error handling

- Unknown/absent timezone → `accentFromTimezone` returns undefined → default
  order + Elena, i.e. today's behavior.
- Accent with no persona pair (cannot happen after this change — every pool
  accent has ≥1 persona; en-nl pair has only female) → pre-select whichever
  gender exists.
- Corrupt stored teacher id (persona removed later) → existing fallback to
  DEMO_TEACHERS[0] stands.

## Testing

- New script `scripts/test-teacher-roster.ts` (npm `test:teacher-roster`):
  every DEMO_TEACHERS id resolves in TEACHER_VOICES with a gender and
  nativeAccent; every ACCENT_POOLS accent has ≥1 persona; ids unique; new
  persona voiceIds match the locked table above exactly; intros non-empty;
  `teachersForAccent` returns the expected pair for all 9 accents (en-us →
  Elena/Jake, not Amara; en-nl → female only).
- Extend `scripts/test-cartesia-voice-registry.ts`: each new teacher id
  resolves to its native voice with no accent arg.
- Existing suites (`test:geo-accent`, registry) must stay green; tsc clean.
- Live smoke check (carried over from the geo-accent branch): load /tutor
  with a spoofed timezone → correct pair first, one pre-selected, session
  speaks the persona's native voice; verify sticky behavior on reload.

## Out of scope

- Portal/embed changes of any kind; `TeacherPersonaWire` untouched.
- Persona name localization of the existing four; new OpenAI Realtime voices.
- en-nl male persona (no passing voice); es→en / fr→en personas.
