// The site Footer is shared cross-app — marketing renders it as part of its
// normal chrome (AppShell), and apps/tutor renders it around the three /admin
// tools that moved into the engine in M1a, so it lives in packages/core
// alongside Header for the same reason. Re-exported here so every existing
// `@/components/layout/Footer` import site keeps working unchanged.
export { Footer } from "@core/components/layout/Footer";
