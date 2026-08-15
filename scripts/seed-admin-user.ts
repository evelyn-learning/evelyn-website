/**
 * Create or reset an admin account.
 *
 * This is the ONLY supported way to create the first admin. Sign-in
 * (src/lib/auth.ts) authenticates solely against the AdminUser collection and
 * fails closed — there is no hardcoded fallback credential any more, and the
 * change-password route no longer bootstraps a row from one. With an empty
 * collection, nobody can reach /admin until this has been run.
 *
 * Usage (reads MONGODB_URI from the environment, same as the app):
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npx tsx scripts/seed-admin-user.ts
 *
 * Against production, source the production env first:
 *
 *   set -a; source .env.local.production; set +a
 *   ADMIN_EMAIL=... ADMIN_PASSWORD='...' npx tsx scripts/seed-admin-user.ts
 *
 * Idempotent: an existing row for that email has its password reset; a new
 * one is created otherwise. Never prints the password or the hash.
 *
 * Quote the password in single quotes so the shell doesn't expand $, !, or
 * backticks in it, and prefix the command with a space if your shell is
 * configured to keep history (HISTCONTROL=ignorespace) — it lands in your
 * shell history otherwise.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../apps/marketing/src/models';

const BCRYPT_ROUNDS = 10; // matches src/app/api/admin/password/route.ts
const MIN_PASSWORD_LENGTH = 12;

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!email) throw new Error('ADMIN_EMAIL is not set');
  if (!password) throw new Error('ADMIN_PASSWORD is not set');

  // Deliberately stricter than the change-password route's 8, because this
  // credential is the only door into /admin and is set non-interactively.
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (password === 'admin123') {
    throw new Error('refusing the retired default password');
  }

  await mongoose.connect(uri);
  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const existing = await AdminUser.findOne({ email });

    if (existing) {
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log(`Reset password for existing admin: ${email}`);
    } else {
      await AdminUser.create({ email, name: process.env.ADMIN_NAME || 'Admin', passwordHash });
      console.log(`Created admin: ${email}`);
    }

    const total = await AdminUser.countDocuments();
    console.log(`AdminUser rows now: ${total}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(`seed-admin-user failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
