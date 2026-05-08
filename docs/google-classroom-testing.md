# Google Classroom Integration — Local Testing Guide

This integration adds a "Google Classroom" tab to the plagiarism-detection showcase. It lets a teacher
connect their Google Classroom (read-only) and run batch plagiarism/AI-detection across student
submissions.

There are two test paths:

- **Mock path** — uses fixtures under `src/lib/google/__mocks__/`. No real Google account needed.
  Recommended for UI iteration and offline work.
- **Real path** — runs the full OAuth round-trip and pulls live courses, assignments, and Drive
  attachments from your test Google account.

Both paths share the same dev server and the same UI.

---

## Prerequisites (one-time)

1. **Env vars.** Confirm `.env.local` has:
   ```
   GOOGLE_CLASSROOM_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
   GOOGLE_CLASSROOM_CLIENT_SECRET=<your-client-secret>
   GOOGLE_CLASSROOM_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   TOKEN_ENCRYPTION_KEY=<64-hex-chars>
   MOCK_GOOGLE_CLASSROOM=false
   ```
   If `TOKEN_ENCRYPTION_KEY` is missing, mint one:
   ```bash
   npm run gen:token-key
   ```

2. **MongoDB.** Confirm `MONGODB_URI` is set and the local SSH tunnel (or Atlas access) is up.

3. **Dev server.** From the repo root:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3001`.

---

## Path A — Mock Classroom (no real Google account)

Use this when you want to iterate on the UI/flow without burning an OAuth round-trip or touching real
student data.

### Step 1 — Flip the mock flag

In `.env.local`:
```
MOCK_GOOGLE_CLASSROOM=true
```
Restart the dev server after editing `.env.local`.

### Step 2 — Seed the test teacher (with mock auth tokens)

```bash
MOCK_GOOGLE_CLASSROOM=true npm run seed:teacher
```
This:
- Creates (or updates) a Teacher record for `praveen@evelynlearning.com`.
- Because `MOCK_GOOGLE_CLASSROOM=true`, also writes a placeholder `googleAuth` subdoc so the dashboard
  treats the teacher as already connected — no OAuth round-trip needed.
- Prints the teacher `_id` and a one-line `localStorage.setItem(...)` snippet to paste in the browser.

### Step 3 — Open the dashboard and seed localStorage

1. Navigate to `http://localhost:3001/showcase/plagiarism-detection`.
2. Open DevTools → Console.
3. Paste the `localStorage.setItem('plagiarism_teacher_id', '<id>')` line printed by the seed script.
   (Optionally also `plagiarism_teacher_email`.)
4. Reload the page.
5. Click the **Google Classroom** tab. It should immediately show the connected state with the teacher
   email and a green dot.

### Step 4 — Walk the flow

- **Course dropdown** → expect 2 options: *AP English Literature - Period 3*, *World History - Honors*.
- **Assignment dropdown** → expect 2 per course (Gatsby/Macbeth or Industrial Revolution/Cold War).
- **Submissions panel** → expect 3–5 rows per assignment with student names + mock filenames.
- **Analyze All Submissions** → triggers batch analysis against the mocked Drive content.
- When analysis completes the view auto-switches to the **Batch Upload** tab and the BatchDashboard
  renders the results.

### Step 5 — Verify result quality

The fixtures include a deliberate mix:
- *Aisha Patel*'s Gatsby essay → should score as mostly original.
- *Marcus Chen*'s Gatsby essay → formal/hedging tone, expect a higher AI-detection score.
- *Zara Ahmed* / *Hannah Goldberg* on the Industrial Revolution → similar pattern.

Click any row to drill into the per-submission report. Note: because we never store raw text from
Classroom, the textarea on the single-detail view will be empty. Annotations and scores still render.

### Step 6 — Reset

```bash
# Disconnect via the UI button, OR clear localStorage manually:
localStorage.removeItem('plagiarism_teacher_id');
localStorage.removeItem('plagiarism_teacher_email');
```
Or delete the Teacher document directly in MongoDB.

---

## Path B — Real Google Classroom (full OAuth)

Use this for the genuine end-to-end smoke test before shipping.

### Step 1 — Confirm Google Cloud Console

- OAuth client must list `http://localhost:3001/api/auth/google/callback` as an authorized redirect
  URI.
- The OAuth consent screen must include the six scopes used by `src/lib/google/oauth-client.ts`:
  `classroom.courses.readonly`, `classroom.coursework.students.readonly`,
  `classroom.rosters.readonly`, `classroom.profile.emails`, `drive.readonly`, `documents.readonly`.
- Your test Google account must be listed as a Test User (if the app is in "Testing" mode).

### Step 2 — Disable mock mode

In `.env.local`:
```
MOCK_GOOGLE_CLASSROOM=false
```
Restart the dev server.

### Step 3 — (Optional) Pre-create the Teacher record

You can let the OAuth callback auto-create the Teacher, or seed first:
```bash
npm run seed:teacher -- praveen@evelynlearning.com "Praveen"
```
The script without `MOCK_GOOGLE_CLASSROOM=true` will create the teacher *without* googleAuth — the
OAuth flow fills it in.

### Step 4 — Walk the OAuth flow

1. Open `http://localhost:3001/showcase/plagiarism-detection`.
2. Click **Google Classroom** tab → click **Connect with Google**.
3. Sign in with your test teacher account, grant the read-only scopes.
4. Google redirects to `/api/auth/google/callback` → server exchanges the code, encrypts the tokens,
   upserts the Teacher, and bounces back to
   `/showcase/plagiarism-detection?google_connected=true&teacher_id=<id>&teacher_email=<email>`.
5. The ClassroomTab effect ingests the query params, writes them to localStorage, strips them from
   the URL, and renders the connected state.

### Step 5 — Pick a course / assignment / analyze

If your test Google account has at least one **active** Google Classroom course with student
submissions, choose it and run **Analyze All Submissions**. Otherwise create a quick test course in
classroom.google.com first.

### Step 6 — Verify token refresh

Tokens auto-refresh ~60s before expiry. To test manually:
1. In MongoDB, set `Teacher.googleAuth.tokenExpiry` to a date in the past:
   ```
   db.teachers.updateOne({email: 'praveen@evelynlearning.com'}, {$set: {'googleAuth.tokenExpiry': new Date(0)}})
   ```
2. In the dashboard, switch course or assignment dropdowns to trigger a fresh API call.
3. The first API hit will refresh the token transparently. Verify the `tokenExpiry` field has been
   updated in the DB.

### Step 7 — Verify disconnect

1. Click **Disconnect** in the connected panel header.
2. The browser POSTs `/api/auth/google/disconnect`, the server revokes the access token via
   `https://oauth2.googleapis.com/revoke`, and unsets `Teacher.googleAuth`.
3. Reload — the tab returns to the disconnected "Connect with Google" state.

### Step 8 — Verify error / reconnect path

1. With the dev server running, manually revoke access for the app at
   <https://myaccount.google.com/permissions>.
2. Reload the dashboard and trigger any Classroom API call. The route returns 401 with
   `code: 'INVALID_GRANT'`, the panel flips to the error card, and the "Reconnect" button restarts
   the OAuth flow.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `TOKEN_ENCRYPTION_KEY must be 64 hex characters` on every API call | Key missing or wrong length | Run `npm run gen:token-key`, paste into `.env.local`, restart server |
| `Cannot find module '/.../src/lib/db'` when running a script | ts-node is in ESM mode (the repo's tsconfig is ESM) | Use `npm run seed:teacher` / `npm run gen:token-key` — they pass `--compiler-options '{"module":"commonjs"}'` to ts-node |
| Browser stuck on "Checking Google Classroom connection…" | localStorage has a stale `plagiarism_teacher_id` whose Mongo doc was deleted | Open DevTools → Application → Local Storage → delete the keys |
| Callback fails with `redirect_uri_mismatch` | Cloud Console has 3001 (or another port) instead of 3006 | Update authorized redirect URIs in Cloud Console |
| Mock mode shows "No courses" | Forgot to restart the dev server after editing `.env.local` | Restart it; Next.js caches env at boot |
| OAuth callback returns `missing_tokens` | App was previously authorized — Google didn't re-issue a refresh token | At <https://myaccount.google.com/permissions> remove the app, then reconnect |

---

## Endpoints reference

---

## Deploying to production

The Classroom OAuth env vars are **namespaced as `GOOGLE_CLASSROOM_*`** so they coexist with any
existing `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` already in `.env.local.production` (used by
GA/GSC tooling). Add the Classroom block alongside — do not overwrite the GA/GSC values.

### Step 1 — Add an authorized redirect URI in Google Cloud Console

In the OAuth client used for Classroom (project ID starts with `1039298465093-...`), add:
```
https://www.evelynlearning.com/api/auth/google/callback
```
The localhost URI stays in the list — one OAuth client supports multiple redirect URIs.

### Step 2 — Append to `.env.local.production`

```
# Google Classroom Integration (read-only OAuth — plagiarism detector)
GOOGLE_CLASSROOM_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLASSROOM_CLIENT_SECRET=<your-client-secret>
GOOGLE_CLASSROOM_CALLBACK_URL=https://www.evelynlearning.com/api/auth/google/callback
TOKEN_ENCRYPTION_KEY=<run `npm run gen:token-key` and paste the output — DO NOT reuse the dev key>
MOCK_GOOGLE_CLASSROOM=false
```

The existing `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` block stays exactly as it is.

**Critical:** generate a fresh `TOKEN_ENCRYPTION_KEY` for production. Reusing the dev key would let
anyone with dev access decrypt prod refresh tokens. Once a prod key is set, never rotate it without
invalidating the existing `Teacher.googleAuth` records (rotation = decrypt with old key + re-encrypt
with new key, which means a maintenance window).

### Step 3 — Verify the OAuth consent screen

Whatever Google Workspace project hosts this OAuth client must:
- Have the six readonly Classroom/Drive/Docs scopes added.
- Be in **Production** mode (not Testing) so any teacher can connect — or, for a private trial,
  add their email as a Test User.
- Have your privacy policy + terms-of-service URLs filled in (Google requires these for sensitive
  scopes once the app is in Production mode).

### Step 4 — Deploy and smoke-test

After deploying:
1. Visit `https://www.evelynlearning.com/showcase/plagiarism-detection`.
2. Click **Google Classroom** tab → **Connect with Google**.
3. Confirm the redirect lands on the production callback URL and back on the showcase with
   `?google_connected=true`.
4. Run a one-submission analyze on a test course to confirm the Drive extract + analyze pipeline
   works end-to-end on prod.

### Note on the dev/prod port

Dev runs on port **3001** (matches production via `npx nodemon --exec "npm run dev -- -p 3001"`).
The Cloud Console redirect URI list should include both `http://localhost:3001/...` and the
production HTTPS URL.

---

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/auth/google` | Start OAuth, redirect to consent screen |
| GET | `/api/auth/google/callback` | Exchange code, upsert Teacher, redirect to showcase |
| POST | `/api/auth/google/disconnect` | Revoke token, clear `Teacher.googleAuth` |
| GET | `/api/auth/google/status?teacherId=<id>` | Connection state |
| GET | `/api/classroom/courses?teacherId=<id>` | List active courses |
| GET | `/api/classroom/courses/:courseId/assignments?teacherId=<id>` | List assignments |
| GET | `/api/classroom/assignments/:courseId/:assignmentId/submissions?teacherId=<id>` | List student submissions |
| POST | `/api/classroom/assignments/:courseId/:assignmentId/analyze` | Batch-analyze all submissions |
