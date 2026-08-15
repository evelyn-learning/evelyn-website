# evelynlearning

An npm-workspaces monorepo: two independently-deployable Next.js apps over one shared
package. The split (M1a) exists so the marketing site can ship without rebuilding the
tutor engine, and vice versa.

## Workspaces

| Workspace | What it is | Dev | Deploy | pm2 | Port |
|---|---|---|---|---|---|
| `apps/tutor` | The tutor engine: `/tutor`, `/tutor-portal/*`, `/api/tutor/*`, `/api/portal/v1/*`. Every portal (Crimsora, evelyntutor, white-labels, API partners) consumes THIS. | `npm run --workspace @evelyn/tutor dev` | `./deploy-tutor.sh` | `evelyn-tutor` | 3007 |
| `apps/marketing` | evelynlearning.com: site, blog, admin, outreach, prospecting, showcase. | `npm run --workspace @evelyn/marketing dev` | `./deploy-marketing.sh` | `evelyn-marketing` | 3001 |
| `packages/core` | Shared, tutor-agnostic: db, knowledge, utils, Teacher/SavedLesson models. Imported as `@core/*`. | — | — | — | — |

The `Port` column is the **production** port each app is served on. In dev the tutor also
uses 3007, but marketing uses **3006** (`next dev -p 3006`) so both can run at once.

Dependencies stay hoisted at the workspace root, so `npm ci` runs at the root — not inside
an app.

## Deploying

Each script builds and ships **only its own app**; nothing else is rebuilt.

- `./deploy-tutor.sh` — engine → pm2 `evelyn-tutor` on :3007.
- `./deploy-marketing.sh` — site → pm2 `evelyn-marketing` on :3001.

`deploy-to-production.sh` **no longer exists** — it deployed the pre-split single app and
was replaced by the two scripts above. `deploy-update.sh` is **banned**: it builds on the
server, which takes ~30 minutes.

nginx sends `/tutor`, `/tutor-portal/*`, `/api/tutor/*`, `/api/portal/v1/*` and the
tutor-owned admin routes to :3007; everything else falls through to :3001
(see `nginx/evelyn.conf`).

## Tests

```bash
npm run test:all          # the full 181-entry regression oracle (both apps)
```

Root `test:all` runs the **union**: `apps/tutor`'s hermetic suite (172 entries) followed by
`apps/marketing`'s `test:outreach` chain (9 entries) = **181**. It runs the marketing half
even when the tutor half fails, and exits non-zero if either half does.

The baseline to compare against is `docs/superpowers/baselines/2026-08-14-pre-split.txt`:
**178 pass, 3 known-red** (`test:verdict-guard`, `test:pedagogy-posed-problem`,
`test:pedagogy-d1`) — red before the split, not caused by it.

`apps/tutor` declares 184 `test:*` entries; its runner
(`apps/tutor/scripts/run-all-tests.mjs`) executes the 172 hermetic ones and skips the rest,
which need live APIs, a seeded DB, or a required argument. Run one app's suite directly
with `npm run --workspace @evelyn/tutor test:all` or
`npm run --workspace @evelyn/marketing test:outreach`.

## Boundaries

```bash
npm run check:boundaries
```

`scripts/check-workspace-boundaries.mjs` enforces the three structural invariants the split
created — marketing must not import the tutor, the tutor must not reference
`apps/marketing`, and `packages/core` must not import the tutor. A violation re-couples the
two deploys, so this exits non-zero and names the offending lines. Rule 3 matches import
specifiers, not the bare string `lib/tutor`, because core carries accurate prose comments
about the pre-split paths.
