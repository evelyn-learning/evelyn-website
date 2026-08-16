/**
 * Shared Mongoose configuration for the M1c ops scripts (M1c final review,
 * reviewer B finding 7).
 *
 * Both `seed-partner-registry.ts` and `backfill-partner-namespace.ts` must
 * run this BEFORE `connectDB()`. Mongoose 8 defaults `autoIndex` and
 * `autoCreate` to true, so merely opening the connection builds every
 * schema-declared index for every compiled model — including TutorSession's
 * TTL index, which DELETES sessions older than 180 days — and creates any
 * collection that does not exist yet (observed against real prod: an empty
 * `partners` collection appeared from a plain dry run before this guard
 * existed). A "dry run" must not do either.
 *
 * Extracted into one place, and given its own assertion in both suites,
 * because deleting the two `mongoose.set` lines from either script left
 * every test green (mutations M32/M34): the guard lived inside an untested
 * `main()`.
 */
import mongoose from 'mongoose';

export function configureMongooseForOpsScript(): void {
  mongoose.set('autoIndex', false);
  mongoose.set('autoCreate', false);
}

/** True only when BOTH side-effect switches are off. Exported so each ops
 *  script's suite can assert on the observable global state its `main()`
 *  left behind, rather than on the fact that a line of source exists. */
export function opsMongooseConfigured(): boolean {
  return mongoose.get('autoIndex') === false && mongoose.get('autoCreate') === false;
}
