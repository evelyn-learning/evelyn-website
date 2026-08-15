// See the Header shim beside this file. The Footer lives in packages/core so
// both apps can render the same site chrome; apps/tutor needs it for the
// /admin tools (tutor-sessions, demos, video-curator) that M1a moved into the
// engine, which were wrapped by marketing's AppShell before the split.
export { Footer } from "@core/components/layout/Footer";
