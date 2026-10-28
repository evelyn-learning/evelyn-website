# evelynlearning — read before any change

1. Read `docs/ops/WORKFLOW.md` first. It names the repo, worktree, gate, deploy script and tenant gate for every product (tutor engine, marketing, GAC, GDI, GameClass, Kanzoo, partners).
2. Never edit, build or deploy in this root checkout. `scripts/ops/wt.sh sweep`, then `scripts/ops/wt.sh new <product>-<topic>` (off origin/main) and work there.
3. Tenant-specific behaviour = partner row / build flag (default ON) / plan kind. Never a per-tenant branch.
4. Gate before deploy: `npm run test:changed` in `apps/tutor` (it says when `test:all` is needed), prod build. Deploy with the per-app script in `scripts/deploy/` from the worktree, one at a time. Never `deploy-update.sh`. GAC :3008 only via `deploy-tutor-gac.sh` and only when GAC has been told.
5. Finish with `scripts/ops/wt.sh finish` (merges origin/main, gates, pushes to main, removes the worktree).
6. Laptop port 2710 is the PROD Mongo tunnel. Reads are fine; writes need Praveen's go-ahead.
