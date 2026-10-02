# Tutor token optimization — cross-session prompt cache (design)

Date: 2026-10-02 · Branch `tutor-token-opt` (worktree, from origin/main `14746c02`) · Status: awaiting review

## Purpose

Short tutor sessions lose money. Every session start costs about $0.46–0.58 before the student
speaks (measured 2026-09-29), so GameClass "Ask Tutor", GAC homework/self-study and the marketing
demo run at $0.17–0.25/min against a $0.12–0.15/min price. Long Crimsora sessions amortise it
(≈ $0.10/min). The goal of phase 1 is to remove most of that start cost on every surface without
changing what the tutor is told or can do.

Success: on a warm cache, turn 1 of a session shows `cache_read` ≥ 80% of the prefix and
`cache_creation` limited to the session-specific tail; the fixed start cost falls from ≈ $0.50 to
≈ $0.05–0.12; no behaviour change (prompt text byte-identical when concatenated).

## What happens today (verified in code at `14746c02`)

Per brain turn (`lib/tutor/voice/claude-brain.ts` ~L1991–2015):

- `tools`: the tool array, no cache marker.
- `system`: ONE text block holding the whole prompt, `cache_control {ephemeral, ttl:'1h'}`.
- `messages`: history (second marker on the last history message), then the uncached turn content.

The API caches by exact prefix in the order tools → system → messages. The single system block
contains session values (student name, topic, grade guidance, humor level, persona, session goal,
subject/grade-filtered diagram catalog), so two sessions practically never produce the same bytes
up to the marker. Each session therefore writes its own ≈ 110–130K-token cache entry at the 1-hour
write price (2× input) on turn 1. Sonnet 5 is $2/MTok input, so 125K × $4/MTok ≈ $0.50 — the
measured start cost.

The system prompt is built in the browser (`system-prompt-builder.ts` `buildSystemPrompt`, called
from `VoiceTutorRealtime.tsx`) and sent as a string in each `/api/tutor/brain/stream` body.

Order inside the string: BASE_PROMPT (≈ 174.5K chars; static per deployment except one
subject-filtered block spliced into its middle) → branding (static) → pedagogy spine (level,
humor) → diagram catalog (subject, topic, grade) → knowledge module → session context (subject,
topic, student name, goal) → pronunciation → persona → flag clauses → text-mode block → voice
wrapper.

### Tools and subjects (as built)

- ≈ 86 tools. 40 are tagged with one or more of 8 subjects in
  `lib/tutor/ai/tool-subject-taxonomy.ts` (chemistry, physics, biology, earth, ela, social, math,
  cs). The other ≈ 46 are untagged "core" and always sent: lesson control, problem/solution cards,
  equations, graphs, geometry, tables, `show_diagram` (the gateway to the 132-kind diagram
  catalog), annotate/scribble/handwrite.
- The server filters the tool array **by subject only** (`route.ts` L587–612). The topic is not
  passed to that filter. Topic is used only client-side, for the diagram catalog and the prose
  tool list inside BASE, and only as a fallback when the subject is not one of the known names.
- The filter applies only when `TUTOR_TOOL_SUBJECT_FILTER=true` (on in prod) AND the turn carries a
  lesson plan whose id does not start with `freestyle-`. Otherwise every tool is sent ("fail
  open"). Unknown subjects ("Financial Literacy", "Precalculus"), plan-less sessions (GameClass
  Ask Tutor) and open-scope demos (subject withheld) all get every tool.
- `set_current_problem` is appended for `homework-help` sessions only.
- The server is stateless: if turn 1 has no plan and turn 2 has one, the tool array changes
  mid-session, which rewrites the entire cache for that session.

## Design — phase 1

### 1. Split the system prompt into a shared block and a session block

`buildSystemPrompt` returns two strings instead of one:

- **core** = BASE_PROMPT (including its flag splices and the subject-filtered tool-list block, in
  place) + branding.
- **session** = everything after: pedagogy spine, catalog, module, session context, pronunciation,
  persona, flag clauses, text-mode block, voice wrapper.

`core + session` is byte-identical to today's single string. No sentence moves.

The client sends both parts. The server sends:

```
tools:  [ ...tool array for the session's bucket ]
system: [
  { type:'text', text: core,    cache_control:{type:'ephemeral', ttl:'1h'} },   // A: shared
  { type:'text', text: session, cache_control:{type:'ephemeral', ttl:'1h'} },   // B: per session
]
messages: [ ...history (marker C on the last history message, as today), turn content ]
```

Three of the four allowed markers are used. All stay at 1 hour (a 1-hour entry must precede any
shorter one, and A must outlive gaps between sessions).

How sharing works: marker A's cache entry is keyed by the bytes of `tools + core`. Any session,
on any tenant, whose tools and core match an entry written in the last hour reads it at 0.1×
instead of writing it at 2×. Every read restarts that entry's 1-hour timer, so steady traffic
keeps it alive indefinitely. Marker B then writes only the session tail (≈ 10–25K tokens).

What defines a distinct shared entry ("variant"):

| Input | Values today |
|---|---|
| Model | one (`claude-sonnet-5`) |
| Tool array | full; one per subject bucket (math, physics, chemistry, biology, earth, cs, ela, social, science-union); each ± `set_current_problem` |
| Tool-list block inside BASE | same bucket idea, resolved client-side from subject + topic |
| Deployment (BASE text, flags) | changes on every engine deploy that touches the prompt or tools |

Caches are isolated per API workspace. All tenants are served by one engine; the plan must confirm
they use one Anthropic key/workspace for the brain role (if not, sharing is per key).

### 2. One bucket per session, decided once

Today the tool array (server, subject only, plan required) and the BASE tool-list block (client,
subject + topic) are resolved separately and can disagree; that multiplies variants and the
mid-session flip rewrites the cache.

- Add one resolver, `resolveSessionBucket({subject, topic, planId, openScope})`, used for the tool
  array, the BASE tool-list block and the catalog. Same rules as today; no new filtering.
- The client resolves it once at session start and sends it on every turn. The server validates
  the value against the known bucket list (unknown → full) and uses it. A session never changes
  bucket; when in doubt it starts, and stays, on full.
- `set_current_problem` is decided at session start from `session_goal`, same stickiness.

### 3. Telemetry

- Server log per turn: `[cachekey] bucket=<b> hw=<0|1> core=<sha8> tools=<sha8>` beside the
  existing `[brain.stream] … cache_read= cache_creation=` line.
- Debug event on turn 1 of each session: `cache_start read=<n> created=<n>` (added to the embed
  persist allowlist), so warm/cold starts are visible per session in `tutorsessions`.
- Embed sessions start persisting the per-call `tokenUsage` array (today only retail does), so
  cost can be analysed by surface.

### 4. Variant policy and keep-warm — decided from data, not now

Sharing and filtering pull against each other. Filtering saves about 20% of a 0.1×-priced read
(≈ $0.005 per pass); a cold start costs ≈ $0.40–0.50. One extra cold start cancels roughly 40
turns of filter savings. At today's traffic, fewer variants probably beats finer filtering.

Phase 1 ships with today's buckets. After one week of `cache_start` data, choose one:

- **Collapse** to fewer variants (for example: full + math) if warm-start rate is low.
- **Keep-warm**: a server job sends a `max_tokens: 0`, non-streaming request with `tools + core`
  (marker on core, `thinking` disabled as in real traffic) every ~50 minutes for a short list of
  variants. Each ping is one cache read (≈ 110K × $0.2/MTok ≈ $0.02; ≈ $0.65/day per variant).
  Needs the server to build `core` itself; a test must prove it is byte-identical to the
  client-built one.
- **Leave as is** if traffic already keeps the main variants warm.

Widening the filter (mapping "Financial Literacy"/"Precalculus" to buckets, filtering plan-less
homework sessions) is deferred to that decision: it reduces read size but adds variants and
changes which tools the tutor can call.

## Phase 2 (separate spec, after phase 1 data)

A lean profile for "moment" sessions (GameClass Ask Tutor, GAC homework, text self-study): a core
tool set of roughly 20–30 tools and a BASE without geometry-construction and lesson-sequencing
sections, no voice rules in text mode. It is one more variant, but about half the size, so both
its cold write and every read are cheaper. It changes what the tutor can draw and needs a
behaviour evaluation, which is why it is not in phase 1.

Also deferred: caching the per-turn tail inside a turn's tool loop; audit of BASE growth since May
(101.6K → 174.5K chars); whether the answer-checker prompt (≈ 4K tokens, Haiku 4.5 minimum is
4,096) is ever cached; including helper calls in `estimatedCost`.

## Error handling and safety

- Flag `TUTOR_SHARED_PROMPT_CACHE` (server, default ON, `!== 'off'`). Off → the server
  concatenates `core + session` into one block exactly as today.
- Old clients that send only `systemPrompt` keep working (single block).
- Empty `session` or `core` → fall back to the single block (the API rejects cache markers on
  empty text).
- Non-Anthropic fallback targets already strip `cache_control`; two plain system blocks are sent.
- The rare tools-less rescue call keeps its own behaviour (it cannot reuse a tools-first prefix).

## Testing

- Unit: `core + session` equals the legacy string byte for byte across a matrix of subject, topic,
  level, goal, input mode, persona, open scope.
- Unit: `resolveSessionBucket` reproduces today's tool sets for every existing subject and the
  fail-open cases; tool order unchanged.
- Unit: request builder emits two system blocks with markers; flag off emits one.
- Live (dev, real API): two different sessions (different student, topic, same bucket) back to
  back; the second session's turn 1 must log `cache_read` ≈ size of tools + core and
  `cache_creation` ≈ session tail. Then a turn 2 on each must show normal incremental writes.
- Token counts for core, tools per bucket and a typical session tail on `claude-sonnet-5`, using
  the existing `scripts/measure-*.ts` (updated from the 4.6 model id), recorded in the plan.
- `npm run test:all` baseline 263/265 on main (two known failures).

## Out of scope

- Prompt content edits, tool description trims, model changes.
- The fact that the system prompt is assembled in the browser and trusted by the server.
- Anything in the academy repo or partner contracts.

## Expected effect (estimates until measured)

| | Today | Phase 1, warm | Phase 1, cold |
|---|---|---|---|
| Turn-1 cache write | ≈ 125K tok (≈ $0.50) | ≈ 10–25K tok (≈ $0.04–0.10) | as today |
| Turn-1 cache read | 0 | ≈ 105K tok (≈ $0.02) | 0 |
| Later turns | unchanged | unchanged | unchanged |

Every engine deploy that changes BASE or the tools makes the next session per variant a cold
start once.

## Measured (2026-10-02, claude-sonnet-5, `scripts/measure-prompt-cache-parts.ts`, countTokens)

```
core            63071 tok  (183745 chars)
session math_g8            9146 tok
session physics_ap         7426 tok
session freetext_subject   23308 tok   (unrecognised subject ⇒ full diagram catalog)
session no_name_no_topic   9406 tok
session text_mode          9261 tok
session open_scope         6009 tok
session first_turn_flags   7657 tok
session humor_override     8551 tok
session self_report        5155 tok
tools full       51628 tok  (86/86 tools)
tools math       34371 tok  (55/86)     tools physics    38539 tok  (61/86)
tools chemistry  35041 tok  (54/86)     tools biology    32312 tok  (51/86)
tools earth      31310 tok  (48/86)     tools cs         32477 tok  (51/86)
tools ela        33330 tok  (52/86)     tools social     32981 tok  (51/86)
tools science    45141 tok  (73/86)
```

Session figures exclude the ≈ 1.2K-char voice wrapper the client appends. Shared entry on the
full tool list = 63.1K + 51.6K ≈ 115K tokens. At Sonnet 5 rates ($2/MTok input; 1-hour write 2×,
read 0.1×):

| | Today | Shared cache, warm | Shared cache, cold |
|---|---|---|---|
| Turn-1 write | ≈ 121–138K tok ≈ $0.48–0.55 | session only: 5–9K tok ≈ $0.02–0.04 (23K ≈ $0.09 for an unrecognised subject) | as today |
| Turn-1 read | 0 | ≈ 115K tok ≈ $0.023 | 0 |
| Start cost | ≈ $0.50 | ≈ $0.05–0.06 (≈ $0.12 unrecognised subject) | ≈ $0.50 |

The live two-session probe (`scripts/probe-shared-cache.ts`) has not been run yet (paid).
