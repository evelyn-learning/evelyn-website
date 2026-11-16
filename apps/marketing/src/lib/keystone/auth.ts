import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_DAYS, type Role } from "./config";
import { ks } from "./db";
import { ksHref } from "./paths";

export type KsUser = { username: string; name: string; role: Role };

export async function signIn(username: string, password: string): Promise<KsUser | null> {
  const { User, Session } = await ks();
  const u = await User.findOne({ username: username.trim().toLowerCase() }).lean();
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return null;
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await Session.create({ token, username: u.username, expiresAt });
  await User.updateOne({ username: u.username }, { $set: { lastLoginAt: new Date() } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return { username: u.username, name: u.name, role: u.role };
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const { Session } = await ks();
    await Session.deleteOne({ token });
  }
  jar.delete(SESSION_COOKIE);
}

/** Reads the session from a raw token (route handlers pass the cookie value). */
export async function userFromToken(token: string | undefined): Promise<KsUser | null> {
  if (!token) return null;
  const { Session, User } = await ks();
  const s = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).lean();
  if (!s) return null;
  const u = await User.findOne({ username: s.username }).lean();
  return u ? { username: u.username, name: u.name, role: u.role } : null;
}

export async function currentUser(): Promise<KsUser | null> {
  return userFromToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages and server actions: signed-in user or a redirect to sign-in. */
export async function requireUser(check?: (r: Role) => boolean): Promise<KsUser> {
  const u = await currentUser();
  if (!u) redirect(await ksHref("/login"));
  if (check && !check(u.role)) redirect(await ksHref("/"));
  return u;
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
