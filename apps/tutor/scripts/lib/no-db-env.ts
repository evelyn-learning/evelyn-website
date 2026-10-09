/**
 * Side-effect import for tests that drive a Mongo-backed adapter over stubbed
 * models: import it FIRST, before anything that loads `@core/db`.
 *
 * `@core/db` reads MONGODB_URI once, at module load. This replaces whatever
 * the shell holds (a developer's .env can point at a real database) with an
 * address that cannot resolve, so `connectDB` has a URI to pass on but no
 * run of the test can reach a real server — whichever runner is used and
 * whether or not the test's own `mongoose.connect` stub took.
 */
export const NO_DB_URI = 'mongodb://no-db.invalid:1/evelyn_no_db_test';
process.env.MONGODB_URI = NO_DB_URI;
