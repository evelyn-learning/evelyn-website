import { getOutreachGmail } from "@/lib/outreach/gmail";

// src/lib/outreach is guarded against inbox-wide listing (see
// scripts/test-outreach-guards.ts) so the reply watcher can never scan
// mail; bounded CRM queries (sent folder, `label:CRM`) live here instead,
// behind the operator's explicit import action.
export async function listThreadIds(account: string, q: string, pageToken?: string): Promise<{ ids: string[]; nextPageToken?: string }> {
  const gmail = await getOutreachGmail(account);
  // 25, not 50: bounds how long a single `threads.list` + per-thread
  // fetch page can run behind nginx's proxy read timeout, and keeps a
  // single import page's burst against the shared per-user Gmail quota
  // smaller (see gmail-ingest.ts's rate-limit handling).
  const res = await gmail.users.threads.list({ userId: "me", q, maxResults: 25, pageToken });
  return { ids: (res.data.threads ?? []).map((t) => t.id ?? "").filter(Boolean), nextPageToken: res.data.nextPageToken ?? undefined };
}
