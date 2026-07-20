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
exercised against a form that also has full unit-test coverage.
