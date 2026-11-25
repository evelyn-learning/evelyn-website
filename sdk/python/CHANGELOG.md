# Changelog

All notable changes to `evelyn-tutor`. The package follows semantic versioning.

## 0.1.0

First release.

- **Session links.** `create_session_token`, `session_url`, `create_session_url` and `verify_session_token`, with a typed `SessionClaims` and clear errors for obvious mistakes. Claims the package does not list are signed as given. Tokens are byte-identical to the Node package's for the same claims.
- **Client.** `EvelynTutor` reads `EVELYN_PARTNER_ID` and `EVELYN_PARTNER_SECRET` and offers `session_token`, `session_url`, `usage`, `languages`, `sessions_summary` and the worksheet flow (`worksheet.read`, `prepare`, `build`, `status`, `outcome`, `session_url`).
- **Request signing.** `sign_request` for any `/api/portal/v1` endpoint.
- **Languages.** `fetch_languages` and `languages()` read the service's list (English, Japanese, Traditional Chinese, Simplified Chinese, Hindi, Hinglish, French, Spanish at release), with a bundled fallback. The `switch_languages` claim lets a student change the lesson's language by asking the tutor.
- **Webhooks.** `verify_webhook` for `session.ended`, `pool.low`, `pool.exhausted` and `webhook.test`, with typed events and `EvelynWebhookError`.
- No dependencies. Python 3.9 or later. Typed (`py.typed`).
