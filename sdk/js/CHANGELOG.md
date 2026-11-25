# Changelog

All notable changes to `@evelynlearning/tutor`. The package follows semantic versioning.

## 0.1.0

First release.

- **Session links.** `createSessionToken`, `sessionUrl`, `createSessionUrl` and `verifySessionToken`, with typed `SessionClaims` and clear errors for obvious mistakes. Claims the types do not list are signed as given.
- **Client.** `EvelynTutor` reads `EVELYN_PARTNER_ID` and `EVELYN_PARTNER_SECRET` and offers `sessionToken`, `sessionUrl`, `usage`, `languages`, `sessions.summary` and the worksheet flow (`worksheet.read`, `prepare`, `build`, `status`, `outcome`, `sessionUrl`). It refuses to be built in a browser.
- **Request signing.** `signRequest` for any `/api/portal/v1` endpoint.
- **Languages.** `fetchLanguages` and `languages()` read the service's list (English, Japanese, Traditional Chinese, Simplified Chinese, Hindi, Hinglish, French, Spanish at release), with a bundled fallback. The `switch_languages` claim lets a student change the lesson's language by asking the tutor.
- **Webhooks.** `verifyWebhook` and `webhookHandler` for `session.ended`, `pool.low`, `pool.exhausted` and `webhook.test`, with typed events and `EvelynWebhookError`.
- **Browser helper.** `mountTutor` in `@evelynlearning/tutor/embed`: the iframe with its permissions, and the session page's events with an origin check.
- **Command line.** `evelyn-tutor init`, `token`, `languages`, `usage`, `doctor` (which also says when a newer version exists) and `docs`.
- **MCP server.** `evelyn-tutor-mcp` (also `evelyn-tutor mcp`) with the tools `evelyn_docs`, `evelyn_get_keys_instructions`, `evelyn_languages`, `evelyn_create_session_url`, `evelyn_usage`, `evelyn_read_worksheet`, `evelyn_prepare_problem`, `evelyn_scaffold` and `evelyn_doctor`.
- No runtime dependencies. Node 18 or later. ES modules, CommonJS and type declarations.
