// GA4 custom-event helper is shared cross-app — both marketing's demo funnel
// and apps/tutor's live /tutor page track events through it — so it lives in
// packages/core. Re-exported here so every existing
// `@/lib/analytics/events` import site keeps working unchanged.
export { trackEvent, type DemoEventName } from "@core/analytics/events";
