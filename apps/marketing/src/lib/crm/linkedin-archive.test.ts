import { strict as assert } from "node:assert";
import { parseArchive, parseArchiveDetailed } from "./linkedin-archive";
let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}
const OWNER = "https://www.linkedin.com/in/praveentyagi";
const MESSAGES = `CONVERSATION ID,CONVERSATION TITLE,FROM,SENDER PROFILE URL,TO,RECIPIENT PROFILE URLS,DATE,SUBJECT,CONTENT,FOLDER,IS MESSAGE DRAFT,IS CONVERSATION ARCHIVED
c1,,Praveen Tyagi,${OWNER},Skyler Scarlett,https://www.linkedin.com/in/skylerscarlett,2026-09-19 13:28:00 UTC,,"Hi Skyler, I run Evelyn Learning.",INBOX,No,No
c1,,Skyler Scarlett,https://www.linkedin.com/in/skylerscarlett,Praveen Tyagi,${OWNER},2026-09-19 14:22:00 UTC,,Very cool,INBOX,No,No
c2,,Some Recruiter,https://www.linkedin.com/in/recruiter,Praveen Tyagi,${OWNER},2026-09-01 10:00:00 UTC,,We have a role,INBOX,No,No
c3,,Praveen Tyagi,${OWNER},Jane Doe,https://www.linkedin.com/in/janedoe,2026-08-01 10:00:00 UTC,,draft text,INBOX,Yes,No
c4,,Praveen Tyagi,${OWNER},"Ann Lee, Bob Roy","https://www.linkedin.com/in/annlee,https://www.linkedin.com/in/bobroy",2026-09-10 09:00:00 UTC,,Hello both,INBOX,No,No
c4,,Ann Lee,https://www.linkedin.com/in/annlee,Praveen Tyagi,${OWNER},2026-09-10 09:30:00 UTC,,Hi there,INBOX,No,No
`;
const CONNECTIONS = `Notes:\n"When exporting your connection data, you may notice..."\n\nFirst Name,Last Name,URL,Email Address,Company,Position,Connected On\nSkyler,Scarlett,https://www.linkedin.com/in/skylerscarlett,,GameClass,Founder | CEO,18 Sep 2026\n`;
(async () => {
await test("keeps only conversations with an owner-sent, non-draft message", () => {
  const convs = parseArchive({ messagesCsv: MESSAGES, connectionsCsv: CONNECTIONS, ownerProfileUrl: OWNER });
  assert.deepEqual(convs.map((c) => c.conversationId), ["c1"]);
});
await test("messages ordered, directions set, participant enriched from Connections", () => {
  const c = parseArchive({ messagesCsv: MESSAGES, connectionsCsv: CONNECTIONS, ownerProfileUrl: OWNER })[0];
  assert.deepEqual(c.messages.map((m) => m.outbound), [true, false]);
  assert.equal(c.messages[0].at.toISOString(), "2026-09-19T13:28:00.000Z");
  assert.equal(c.participant.name, "Skyler Scarlett");
  assert.equal(c.participant.profileUrl, "https://www.linkedin.com/in/skylerscarlett");
  assert.equal(c.participant.company, "GameClass");
  assert.equal(c.participant.title, "Founder | CEO");
});
await test("works without a Connections file", () => {
  const c = parseArchive({ messagesCsv: MESSAGES, ownerProfileUrl: OWNER })[0];
  assert.equal(c.participant.company, undefined);
});
await test("group conversations are excluded, not misattributed, and counted separately from no-owner-message skips", () => {
  const detail = parseArchiveDetailed({ messagesCsv: MESSAGES, connectionsCsv: CONNECTIONS, ownerProfileUrl: OWNER });
  assert.deepEqual(detail.conversations.map((c) => c.conversationId), ["c1"]);
  assert.equal(detail.skippedGroup, 1);
  assert.equal(detail.skippedNoOwnerMessage, 1);
});
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
