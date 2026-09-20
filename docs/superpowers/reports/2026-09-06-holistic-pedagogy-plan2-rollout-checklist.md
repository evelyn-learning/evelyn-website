# Plan 2 rollout checklist (Task 5) — EXECUTED 2026-09-06 on Praveen's go (steps 1–3 done; step 4 live check pending a real session)

**Done:** contract v1.15.0 tagged+pushed (`78231c0`); engine pinned (`4e7c92c4`), deployed BUILD_ID `T5G_eM_Neo7CcjdFAOU-g`, pushed to main; academy pinned (`168f9d7`), env drift none, Crimsora + evelyntutor.com deployed (contract 1.15.0 on both servers, health 200), branch pushed to origin/main. Positive signed check on the live engine route: 200 `{assignments: []}`; garbage signature 401.

**Pending (step 4):** first real Crimsora session — `practice_assigned` without `silent=no-locator`, goodbye names "Unit N · Practice", the card on the Practice tab, `homework_checked` next session.

Built 2026-09-06 while you were away; nothing outward-facing has been done. State at handoff:

| Repo | Branch / head | Pin | Gate |
|---|---|---|---|
| contract `/Users/luke/Dev/portal-contract` | `main` `78231c0` = v1.15.0, **untagged, unpushed** | — | `npm test` 45/0, build clean |
| engine worktree `tutor-rounds` | `45426b61` (2 over main `17827db9`) | `package.json` still `#v1.14.0` (node_modules holds the 1.15.0 build) | tsc 0 · test:all 229 PASS / 4 known reds |
| academy worktree `.claude/worktrees/holistic-pedagogy-plan2` | `90f7430` (4 over origin/main `cba2cbd`) | root + `apps/api` still `#v1.14.0` (node_modules holds 1.15.0) | typecheck clean · vitest 282 files 0 fail |

Pins were deliberately NOT bumped: the tag does not exist, and `npm ci` (deploy-tutor.sh) hard-fails on a pin/lock mismatch. Bump pin + lock together after the tag exists.

⚠️ **Do not deploy the academy before step 1.** `deploy-crimsora.sh` runs a server-side `npm ci` + `pm2 restart` + web build; with the pin still at v1.14.0 the API would crash on the missing `AssignedPractice*` exports and the web build would fail. The engine is only safe by accident (it bundles the contract from the local build). Order is tag → pin+lock → gate → deploy, never any other.

⚠️ **Partner allowlist is invisible on failure.** A 403 from `/api/portal/v1/assigned-practice` is swallowed by the academy into `{ assignments: [] }` (best-effort surface). In step 4, do not accept "the tab renders" — assert a positive 200 from the engine route for the test partner (the academy API log line `[assigned-practice] engine read failed` must be ABSENT, and a seeded assignment must appear on the card). If a partner row was backfilled with `allowedEndpoints: []`, add the prefix grant before the live check.

## Order
1. **Tag + push contract**
   ```bash
   cd /Users/luke/Dev/portal-contract && git tag v1.15.0 && git push origin main v1.15.0
   ```
2. **Engine: pin, lock, gate, deploy, push** (from the worktree, never the root)
   ```bash
   cd /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-rounds
   sed -i '' 's/portal-contract#v1.14.0/portal-contract#v1.15.0/' package.json && npm install --no-audit --no-fund
   grep -c 'portal-contract#v1.15.0' package.json package-lock.json      # both ≥ 1
   cmp .env.local.production /Users/luke/Dev/evelynlearning/.env.local.production && echo ENV_IDENTICAL
   (cd apps/tutor && npx tsc --noEmit -p . && npm run test:portal)
   git add package.json package-lock.json && git commit -m "chore(tutor): pin @evelyn/portal-contract v1.15.0"
   ./deploy-tutor.sh          # then verify:
   ssh root@84.247.185.169 'cat /root/evelyn-tutor/apps/tutor/.next/BUILD_ID; curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3007/api/portal/v1/assigned-practice; curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3007/api/portal/v1/zzz'   # 401 then 404
   git push origin tutor-rounds:main
   ```
3. **Academy: pin, lock, gate, deploy both tenants** (from the worktree)
   ```bash
   cd /Users/luke/Dev/academy/.claude/worktrees/holistic-pedagogy-plan2
   sed -i '' 's/portal-contract#v1.14.0/portal-contract#v1.15.0/' package.json apps/api/package.json && npm install --no-audit --no-fund
   npm run typecheck && npm test
   git add package.json apps/api/package.json package-lock.json && git commit -m "chore: pin @evelyn/portal-contract v1.15.0"
   deploy/env-drift-check.sh
   ./deploy-crimsora.sh && ./deploy-evelyntutor.com.sh
   ```
   Merge/push `holistic-pedagogy-plan2` → `origin/main` per the academy protocol (root main is stale; do not checkout there).
4. **Live check (crimsora test account)**: full lesson → tutor assigns at close (`practice_assigned` in the session's debugEvents; the tutor names "Unit N · Practice") → Practice tab shows the "From your tutor" card at that LO's unit → Start → drill → check → collapse (`/api/practice/attempt` posted) → next session on the same course: `homework_checked` in debugEvents and the opener acknowledges it. Record the four observations with session ids in the Plan 2 ledger report.

## What ships
- Contract v1.15.0: `POST /assigned-practice` schemas; `SessionResult.assignedPractice?` / `nextSessionIntent?`.
- Engine: `POST /api/portal/v1/assigned-practice` (HMAC, locator-gated, course wildcard for unstamped records); result echo (student-scoped, locator-gated).
- Academy API: `EngineClient.assignedPractice`; `practice_locator` ("Unit N · Practice") + `goal_note` minted on start AND resume, never on trial; `Session.assignedPractice` chip + `nextSessionIntent`; `PracticeSet.source='tutor-assigned'`; `GET /me/assigned-practice` (best-effort) + `POST /artifacts/practice/assigned` (no paywall; 404 on a stale card).
- Academy web: "From your tutor" card above the quiz cards on the Practice tab, reusing `PracticeDrill` with a preset so attempts flow back as evidence.
