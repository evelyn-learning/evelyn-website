/**
 * Adds one Keystone sign-in and prints its password ONCE.
 *
 *   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:2710 \
 *   npx tsx apps/marketing/scripts/keystone-add-user.ts <username> "<Full Name>" <reviewer|tech|evelyn>
 *
 * Never changes an existing user (they change their own password at /account).
 */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { closeKs, ks } from "../src/lib/keystone/db";
import { KEYSTONE_DB, ROLE_LABEL, type Role } from "../src/lib/keystone/config";

async function main() {
  if (!process.env.KEYSTONE_MONGODB_URI) throw new Error(`Set KEYSTONE_MONGODB_URI explicitly (database is always ${KEYSTONE_DB}).`);
  const [username, name, role] = process.argv.slice(2);
  if (!/^[a-z][a-z0-9._-]{1,30}$/.test(username ?? "") || !name?.trim() || !(role in ROLE_LABEL)) {
    throw new Error('Usage: keystone-add-user.ts <username> "<Full Name>" <reviewer|tech|evelyn>  (username lower-case)');
  }
  const { User } = await ks();
  if (await User.exists({ username })) throw new Error(`user ${username} already exists; unchanged`);
  const password = randomBytes(9).toString("base64url");
  await User.create({ username, name: name.trim(), role: role as Role, passwordHash: await bcrypt.hash(password, 10) });
  console.log(`user ${username} (${name.trim()}, ${role}) created — password: ${password}`);
  await closeKs();
}

main().catch(async (e) => {
  console.error((e as Error).message);
  await closeKs();
  process.exit(1);
});
