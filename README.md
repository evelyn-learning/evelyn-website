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

nginx sends `/tutor`, `/tutor-portal/*`, `/api/tutor/*`, `/api/portal/v1/*`, `/ketcher/*`
and the tutor-owned admin routes to :3007; everything else falls through to :3001
(see `nginx/evelyn.conf`). `/ketcher/*` is the one to remember: it is a plain static
tree, it lives only in the tutor's `public/`, and if it is ever unrouted the molecule
editor fails **silently** — no build, typecheck or test notices.

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

## Partner registry (M1c)

`apps/tutor` reads per-partner identity, secrets, allowed endpoints, limits and
flag overrides from a `Partner` collection (`src/models/Partner.ts`), with the
`PORTAL_PARTNER_SECRETS` / `PORTAL_PARTNER_ID` env vars kept as a fallback for
any partner without a registry row (`src/lib/tutor/portal/registry.ts`).
Secrets are encrypted at rest with AES-256-GCM
(`src/lib/tutor/portal/secret-box.ts`).

**`PORTAL_SECRET_ENC_KEY` must be backed up with the other production
secrets.** It is the only key that can open a sealed partner secret — losing
it means every partner must re-key.

**Secret rotation has no tooling in M1c.** The seed script's update path
never touches an existing row's `secrets` array (by design — see below), so
nothing in M1c can add a second secret to an existing partner. The first
rotation must be done by hand: seal the new secret with `encryptSecret`
(`src/lib/tutor/portal/secret-box.ts`), append it to that partner's
`secrets` array directly in Mongo, then remove the old entry once traffic
has moved over. An admin console for this is M1e. `PORTAL_SECRET_ENC_KEY` is
brand new as of this milestone, so the first rotation is not far off —
recording this now rather than leaving it to be discovered mid-incident.

Two ops commands (run from `apps/tutor`; neither is a `test:*` entry, so
neither runs in CI or `npm run test:all`). **Both default to a dry run** —
pass `--write` to apply either one:

- `npm run seed:partner-registry` — creates/refreshes `Partner` rows from
  `PORTAL_PARTNER_SECRETS`, plus a `kind: 'first-party'` `evelyn` row with no
  secrets. Aborts non-zero, before touching the database, if
  `PORTAL_PARTNER_SECRETS` is unset, unparseable, or parses to zero usable
  secrets — a forgotten or fat-fingered env must not silently seed only
  `evelyn` and exit 0 while an operator believes every partner was seeded.
  Idempotent: re-running an existing row only refreshes `name`/`updatedAt`;
  `status`, `secrets`, `allowedEndpoints`, `limits`, `flagOverrides`,
  `metering` and `kind` are never touched once a row exists, because each is
  either operator state (e.g. `status: 'suspended'` — the incident-response
  lever) or fixed at creation (`kind`, so a `kind: 'test'` fixture like
  `portalA` can never be silently reclassified as `'partner'`). **Undo:**
  delete the row from the `partners` collection; the `PORTAL_PARTNER_SECRETS`
  env fallback resumes automatically within 60s (`registry.ts`'s cache TTL).
- `npm run backfill:partner-namespace` — stamps `(partnerId,
  externalStudentId)` onto existing `StudentProfile` rows and (with
  `--build-index`) builds the unique index that makes cross-partner
  collision impossible. **Refuses to run if any real partner id it observes
  has no `Partner` row — run the seed script first.**

Two flags gate the rollout:

- `PORTAL_LIMITS_MODE=report-only` — logs what the per-partner rate/quota
  limiter would block without actually blocking it, but still serves the
  request. Not set in any env sample today. **Unset means enforce**, and
  `checkPartnerLimits` runs for every portal call the moment this code is
  live — so this flag is set **in the same deploy** that ships the limiter,
  not scheduled as a later step (see rollout below).
- `PORTAL_IDENTITY_RESOLUTION` — default off. Once on, portal call sites
  resolve a partner's external student id through the registry instead of
  using the raw request id as the profile `_id`. Flip only after the
  backfill has run and the unique index is built — flipping earlier gives
  every existing student a blank profile.

### Rollout order (production)

Each step is independently reversible; do not batch them. Two hard
preconditions before any of this starts:

1. **`EMBED_TOKEN_ENFORCE=on`** in the target environment (production
   already has it). With it `off`, an unauthenticated request falls back to
   the `evelyn` partner, defeating the namespace split.
2. **The seed script must run before the backfill.** The backfill aborts
   otherwise (see above).

Ordered steps:

1. Set and back up `PORTAL_SECRET_ENC_KEY`, and **deploy with
   `PORTAL_LIMITS_MODE=report-only` set in that same deploy** — not later.
2. `npm run seed:partner-registry` dry run, review; then `-- --write`.
   Registry rows now win per-partner; env remains the fallback for any
   partner without a row.
3. `npm run backfill:partner-namespace` dry run; review the attribution
   table. `already-migrated: 0` and `ambiguous: 0` are the real gate — the
   index build below succeeds regardless of attribution correctness, because
   `externalStudentId` is stamped equal to the already-unique `_id`.
4. `npm run backfill:partner-namespace -- --write`.
5. `npm run backfill:partner-namespace -- --build-index`.
6. Set `PORTAL_IDENTITY_RESOLUTION=on` and deploy. Preconditions:
   `EMBED_TOKEN_ENFORCE=on` (already confirmed above) and steps 3–5 complete.
7. Observe the report-only window, then remove `PORTAL_LIMITS_MODE` — limits
   enforced.

**Not a rollout step, and blocked in M1c: removing `PORTAL_PARTNER_SECRETS`
from the env.** A registry row does **not** cover this. Three call sites
resolve a partner's secret through `getPartnerSecret`
(`src/lib/tutor/portal/auth.ts`), which reads `process.env` **only** and
never consults the registry: `embed-token.ts`, `replay-token.ts`, and the
demo-token route. `verifyEmbedToken` gates the `tutor-portal/embed` page
that academy and Crimsora iframe, plus six `/api/tutor/**` routes. Removing
the env var returns `unknown partner` for every partner regardless of
registry state — an immediate outage of every embedded session. Unblocking
this means migrating those three call sites off `getPartnerSecret`, which is
not M1c.

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
