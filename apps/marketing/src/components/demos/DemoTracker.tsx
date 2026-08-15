// The demo-tracking wrapper component/hook is shared cross-app — both
// marketing's product/showcase demo pages and apps/tutor's live Voice Tutor
// page use it — so it lives in packages/core, matching useDemoTracking.
// Re-exported here so every existing `@/components/demos/DemoTracker`
// import site keeps working unchanged.
export { DemoTracker, useDemoTracker } from "@core/components/demos/DemoTracker";
