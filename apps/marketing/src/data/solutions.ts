// The /solutions/[segment] page registry is marketing content, but each
// segment's demoLessons[].planId is validated against the tutor's SEED_PLANS
// catalog by scripts/test-solutions-demo-lessons.ts (npm run
// test:solutions-demo) — a cross-app consistency guard that needs both sides
// in one place. Lives in packages/core so that script (which otherwise only
// has access to apps/tutor's own tree) can reach it without an
// apps/marketing import. Re-exported here so every existing
// `@/data/solutions` import site keeps working unchanged.
export {
  BOOKING_URL,
  SOLUTION_SEGMENTS,
  getSegment,
  type SolutionSegment,
} from "@core/data/solutions";
