// Demo-interaction tracking (posts to /api/demos/session and /api/demos/track,
// both marketing-hosted routes reached by relative URL regardless of which
// app renders the calling component) is shared cross-app infrastructure —
// both marketing's showcase demo pages and apps/tutor's live Voice Tutor
// components use it — so it lives in packages/core, matching the other
// cross-app-shared pieces (db, auth, Teacher, SavedLesson, DemoSession,
// DemoInteraction, LessonImage). Re-exported here so every existing
// `@/hooks/useDemoTracking` import site keeps working unchanged.
export {
  useDemoTracking,
  type InteractionType,
} from "@core/hooks/useDemoTracking";
