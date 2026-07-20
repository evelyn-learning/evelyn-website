# fixture-form-a

`form.json` + `items.json` are a byte-for-byte serialization of
`FIXTURE_FORM` / `FIXTURE_ITEMS` in
`src/lib/tutor/mock-exam/fixtures.ts` (minus `FIXTURE_FORM.status`,
which the seed CLI controls via `--go-live`, not the data file).

**Keep these three in lockstep.** If you change the shape or values of
`FIXTURE_FORM`/`FIXTURE_ITEMS` in `fixtures.ts` (used by the mock-exam
service/report/scoring unit tests), mirror the change here — and vice
versa. That's the point of this fixture: the same data backs both the
in-memory test fixtures and a real `npm run seed:mock-form` dry run /
Mongo seed, so `scripts/seed-mock-form.ts` and the form-lint rules stay
exercised against a form that also has full unit-test coverage. (This
fixture caught a real bug this way: `fx-m2e-1`'s answer key was wrong
— `--dry-run` real-verify flagged the Sonnet mismatch before it could
ship live.)

**Local dev flow**: just run real verification — it's 5 items, seconds,
and cheap:
```
npm run seed:mock-form -- --form=fixture-form-a --go-live
```
`--no-verify --go-live` is refused (the live gate requires lint clean
AND every item to pass the real Sonnet verify gate — `--no-verify`
skips that gate entirely, so combining it with `--go-live` would
publish a form live with zero verification, which is exactly how the
`fx-m2e-1` incident above would have shipped). If you deliberately want
to publish live without verifying (e.g. iterating on form/blueprint
plumbing, not item correctness), add `--force-live-unverified`
alongside `--no-verify --go-live` — it prints a loud warning naming the
unverified item count at upsert time. `--no-verify` alone (without
`--go-live`) still works for fast draft re-seeds.
