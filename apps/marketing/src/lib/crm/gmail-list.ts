import { getOutreachGmail } from "@/lib/outreach/gmail";

// src/lib/outreach is guarded against inbox-wide listing (see
// scripts/test-outreach-guards.ts) so the reply watcher can never scan
// mail; bounded CRM queries (sent folder, `label:CRM`) live here instead,
// behind the operator's explicit import action.
export async function listThreadIds(account: string, q: string, pageToken?: string): Promise<{ ids: string[]; nextPageToken?: string }> {
  const gmail = await getOutreachGmail(account);
  const res = await gmail.users.threads.list({ userId: "me", q, maxResults: 50, pageToken });
  return { ids: (res.data.threads ?? []).map((t) => t.id ?? "").filter(Boolean), nextPageToken: res.data.nextPageToken ?? undefined };
}
