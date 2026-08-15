// Admin auth (NextAuth config + AdminUser-backed credentials provider) is
// shared cross-app infrastructure — both the marketing app and this app gate
// their own /admin surfaces with it — so it lives in packages/core, matching
// the other cross-app-shared pieces (db, Teacher, SavedLesson, DemoSession,
// DemoInteraction, LessonImage). Re-exported here so every existing
// `@/lib/auth` import site keeps working unchanged.
export { authOptions } from "@core/auth";
