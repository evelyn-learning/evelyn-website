# Working on the products — the one-main-line workflow

Agreed 2026-10-28 after the GDI / GAC / main three-way merge cost a day
(154 files, 170 commits to review, 10 conflicts) and every tenant-specific
behaviour ended up behind a gate anyway. Applies to **evelynlearning**
(tutor engine + marketing), **academy** (Crimsora, evelyntutor, GreenApple
web) and **portal-contract**.

## 1. Start of a session

1. `scripts/ops/wt.sh sweep` in the repo the task belongs to. Anything
   unmerged and older than 7 days is raised in the first message, not worked
   around.
2. Name the product and look it up in §2. That fixes repo, worktree name,
   gate, deploy script and tenant gate before the first edit.
3. `scripts/ops/wt.sh new <product>-<topic>` — one task, one worktree, always
   off **origin/main** (never local main). Env files, Ketcher bundle and a
   root `npm ci` are done for you.

## 2. Product routing

| Product | Repo / app | Deploy | Process | Tenant gate |
|---|---|---|---|---|
| Tutor engine, all tenants | evelynlearning `apps/tutor` | `deploy-tutor.sh` | `evelyn-tutor` :3007 | partner row (`lib/tutor/portal/partner-session-options.ts`), build flag default ON (`orchestrator/flags.ts`), plan kind |
| GAC engine | same code | `deploy-tutor-gac.sh` — **only when GAC is told** | `evelyn-tutor-gac` :3008 | `TUTOR_NO_REVEAL_LEDGER_PARTNERS`, `homework-problem` plan kind, GAC env keys (fallback off, drawn answers) |
| GDI and partner previews | same code | `deploy-tutor-demo.sh` | `evelyn-tutor-demo` :3009 | `sessionAllowsNonLatin(tutorLanguages)`, `gdi-demo` partner row |
| Marketing site + back office | evelynlearning `apps/marketing` | `deploy-marketing.sh` | `evelyn-marketing` :3001 | — |
| Crimsora / evelyntutor / GreenApple web | academy (one codebase) | `deploy-crimsora.sh` / `deploy-evelyntutor.com.sh` / `deploy-greenapple.sh` | `<tenant>-web` + `<tenant>-api` | tenant env file, tenant config in the app |
| GameClass, Kanzoo, new partners | engine + dev portal | `deploy-tutor.sh` | :3007 | partner row + Mongo partner registry |
| portal-contract | portal-contract | tag `vX.Y.Z`, bump the `github:…#vX.Y.Z` pin in **both** consumers | — | additive schema changes only |

evelynlearning.com is one domain served by two processes: nginx sends
`/tutor`, `/tutor-portal`, `/api/tutor`, `/api/portal/v1`,
`/admin/tutor-sessions`, `/admin/demos`, `/admin/video-curator` to :3007 and
everything else to :3001. `packages/core` is shared by both apps: a change
there is two deploys.

## 3. Worktrees and branches

* Name: `<product>-<topic>` — `gac-figure-labels`, `gdi-prefetch-fix`,
  `mktg-security-page`, `crimsora-tour-copy`, `ops-deploy-speed`.
* Lifetime: merges when its gate is green, not at a commit count. Soft
  limits that trigger a check-in with Praveen: **7 days** old or **15
  commits** ahead.
* Merge: `scripts/ops/wt.sh finish` — merges origin/main if it moved, runs
  the gate, fast-forwards `origin/main`, removes the worktree and branch.
  (With `--no-push` it only gates.) Deploy happens between the gate and the
  push: merge → GATE → deploy → push.
* **No long-lived tenant branches, ever.** A client freeze pins a deploy
  (the build id on the box), never a branch. GAC during a freeze: fixes land
  on main; :3008 moves only on Praveen's word.
* Root checkouts are never deployed from (the deploy scripts refuse).

## 4. Gate before any deploy

* `npm run test:changed` in `apps/tutor` (or the academy root): the `test:*`
  scripts whose source covers the files changed against origin/main, plus
  the typecheck and the prod build of the app touched. That is the gate for
  a routine fix.
* `test:all` only when the change is cross-cutting: `claude-brain.ts`,
  `VoiceTutorRealtime.tsx`, `system-prompt-builder.ts`, the verdict files,
  `packages/core`, or more than ~10 source files. `test:changed` says so.
* No gate ever spends money: live model calls in tests run only with
  `TUTOR_TEST_LIVE=1`.
* Known baseline failures live in memory
  (`project_engine_test_all_preexisting_failures`); anything else red blocks.

## 5. Flags and tenant behaviour — decide in the first reply

| The ask is… | Mechanism |
|---|---|
| one partner wants it, others must not see it | partner row in `partner-session-options.ts`, or the plan kind / partner list the feature already keys on |
| a generic fix every tenant benefits from | global, with a `NEXT_PUBLIC_*` kill switch defaulting ON (`!== 'off'`) |
| prompt wording | core prompt stays generic (no client names, no worked examples); partner wording goes in a partner block; any core-prompt edit is a shared-cache reset and is called out |
| a new partner | Mongo `partners` row + `PARTNER_SESSION_DEFAULTS` row (prefetch OFF unless bilingual) |

## 6. Deploys

* One at a time — all scripts share `/tmp/evelyn-deploy.lock`.
* `deploy-tutor.sh` / `-demo` / `-gac`: build locally (Turbopack cache kept
  in `.next/cache`, excluded from upload), upload, and on the server run
  `npm ci` **only when package-lock.json changed** (`.deploy-lock-hash`).
* `deploy-marketing.sh`: same, and `public/` (210 MB of media) is rsynced
  incrementally, never zipped. `public/images/blog` is not in git — it lives
  on the server and in each developer's checkout only.
* Academy: `deploy/academy-deploy.sh` typechecks locally, rsyncs the tree,
  and the server runs `npm ci` only when the lockfile changed and then
  `next build` — the build stays on the server by design (`apps/web` pages
  fetch the tenant API at http://127.0.0.1 at build time; a laptop build
  would bake empty pages). `DEPLOY_CHECK=1` stops before touching the
  server. After merging into any academy checkout run `npm ci` there.
* After every deploy: process Ready, the public URL answers 200, and the
  **other** engine build ids are unchanged. GAC :3008 and GreenApple web move
  only when GAC has been told.
* A deploy over **3 minutes is a script bug**, not a cost of doing business.
* Env key changes go to both engine env files (`deploy-tutor-gac.sh` swaps
  its three GAC keys in).

## 7. Database

One un-authenticated mongod on the box, isolation by database name only.
* No new database without telling Praveen; new collections named in the
  merge note.
* Schema changes additive (new optional fields, TTL indexes) so a pinned
  build keeps reading the same rows.
* Laptop :2710 is the PROD tunnel: reads are fine, writes need a go-ahead,
  scripts refuse to run without an explicit database name.

## 8. portal-contract

A change is a version bump + tag, and the **same release** bumps the pin in
evelynlearning and academy and gates both. Never a floating ref.

## 9. End of a session that merged

`wt.sh finish` already removed the worktree and branch. If a deploy
happened, record build id + commit in memory; if something was left undone,
say so in the last message.
