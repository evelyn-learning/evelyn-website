// The site nav Header is shared cross-app — marketing renders it as part of
// its normal chrome, and apps/tutor's standalone (non-embedded) /tutor page
// renders it too, so it lives in packages/core. Re-exported here so every
// existing `@/components/layout/Header` import site keeps working unchanged.
export { Header } from "@core/components/layout/Header";
