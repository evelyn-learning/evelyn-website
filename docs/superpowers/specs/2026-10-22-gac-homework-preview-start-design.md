# GAC homework — preview first, "Start tutoring" on demand

Date: 2026-10-22. Owner: Praveen ("yes lets spec & build that Start tutoring button flow"). Academy worktree `gac-29oct` (`/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, HEAD `a342c950`). Engine unchanged.

## Why

"Work on this" today mints an engine session on page mount: mint (0.5–0.9 s) + iframe load + the tutor's opener (1.7–2.3 s to the first sentence), and every open spends a session — a warm one reads ≈ 208k cached tokens per turn, a cold one writes the ≈ 108k-token prefix (≈ $0.50). A student who only wants to look at the problem, its figure and where they left off pays all of that and holds the live-session lock.

## What

The problem page (`/app/homework/<set>/<n>`) opens as a **preview** rendered by the academy from data it already has: the problem text with the `[Figure: …]` block stripped (`stripFigureDescriptions`), the figure thumbnail (`figureSvg` as the same data-URI `<img>` the list uses, larger: full card width, max height 360 px; the list's "Figure ready" / "Drawing the figure…" fallbacks when there is no SVG yet), the problem's status chip (`problemChip`), the prior-work note when the set view carries one, and two actions: a primary **Start tutoring** button and the plain **← Back to list** link. No engine call, no session, no lock, no billing until Start.

**Start tutoring** runs today's start exactly (POST `/api/homework/<set>/problems/<n>/start`, then the embed); every existing outcome of that call keeps its notice (`busy`, `checking` with Try again, `exhausted`, `error` with Try again). While starting, the button reads "Opening Problem n…" and is disabled; the preview stays visible until the embed replaces it.

Once the session is active nothing changes: the engine panel shows the problem, "Back to list" pauses, finish records the outcome, `?paused=n` / `?finished=n` polling as in round 11.

A problem whose build is still `preparing` previews the same way (text + skeleton) and Start is allowed (the engine's start snapshots the build as today). A `checking` card: the list already disables "Work on this"; the preview's Start gets the 409 notice as today.

## How

`HomeworkProblemSession` gains a `preview` prop (`{ text: string; figureSvg?: string; hasFigure: boolean; build: string; work: { status: string; priorNote?: string } }`) and an initial state `{ status: 'preview' }`. The mount effect no longer starts on `attempt === 0`; `attempt` becomes the Start counter (Start → `setState({status:'starting'})`, `attempt + 1`; the effect starts only for `attempt >= 1`). The page (`[setId]/[n]/page.tsx`) passes the problem from `getHomeworkSet`. A new small component `HomeworkProblemPreview` (text, figure, chip, prior note, actions) keeps `HomeworkProblemSession` focused on the session.

`data-testid`s: `hw-problem-preview`, `hw-start-tutoring`, `hw-preview-figure`; the existing `hw-session-starting` / `hw-session-notice` / `hw-back-to-list` keep their meaning.

## Acceptance

Open a problem from the list: the text, figure and chip appear at once (no "Opening Problem…"), the api log shows no `/start`; press Start tutoring → the session opens as before; Back to list from the preview is instant and records nothing. The e2e homework spec (`e2e/greenapple-homework.spec.ts`) presses Start where it used to wait for the session.
