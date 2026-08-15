// The demo-tracking React context is shared cross-app infrastructure — it
// lives in packages/core alongside DemoTracker.tsx and useDemoTracking, which
// both depend on it. Re-exported here so every existing
// `@/components/demos/DemoTrackingContext` import site keeps working
// unchanged.
export {
  DemoTrackingProvider,
  useTrackInteraction,
} from "@core/components/demos/DemoTrackingContext";
