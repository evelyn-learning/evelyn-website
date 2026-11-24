/**
 * Partner dashboard and self-serve sandbox: what happens, written against a store (`DashStore`) so the whole
 * flow runs in a test with no database. `mongo-store.ts` is the store production uses.
 *
 * The flow: a form asks for a link (`requestLink`) → the emailed link is used (`useLink`), which creates the
 * sandbox for a new email (partner row, sealed secret, 300-minute pool, owner account, a note to us) and signs
 * the person in → the dashboard reads through `accountForSession`.
 */
import {
  DASH_SESSION_TTL_MS, LOGIN_LINK_TTL_MS, ROTATED_SECRET_GRACE_MS, SANDBOX_FREE_MINUTES, SANDBOX_TERMS_VERSION,
  cleanEmail, cleanText, hashToken, loginLinkUrl, newPartnerSecret, newToken, pickPartnerId, type SignupLimits,
} from './core';

export interface AccountRow {
  email: string; partnerId: string; name: string; company: string; role: 'owner' | 'member';
  useCase?: string; termsVersion?: string; termsAcceptedAt?: Date; lastLoginAt?: Date; firstSessionAt?: Date; createdAt?: Date;
}

export interface LinkRow {
  tokenHash: string; email: string; purpose: 'signup' | 'login';
  signup?: { name: string; company: string; useCase: string; termsVersion: string };
  ip?: string; expiresAt: Date;
}

export interface Mail { to: string; subject: string; text: string; html: string; replyTo?: string }

export interface DashStore {
  now(): number;
  /** True when the counter was under its cap and is now one higher (demo-gate/counter.ts reserveCounter). */
  reserve(key: string, cap: number): Promise<boolean>;
  release(key: string): Promise<void>;
  findAccount(email: string): Promise<AccountRow | null>;
  listAccounts(partnerId: string): Promise<AccountRow[]>;
  /** False when the email already has an account (the unique index decides, not a read before the write). */
  createAccount(row: AccountRow & { signupIp?: string }): Promise<boolean>;
  updateAccount(email: string, set: Partial<AccountRow>): Promise<void>;
  removeAccount(email: string): Promise<void>;
  saveLink(row: LinkRow): Promise<void>;
  /** The unused, unexpired link with this hash, marked used in the same step; null otherwise. */
  takeLink(tokenHash: string): Promise<LinkRow | null>;
  saveSession(tokenHash: string, email: string, expiresAt: Date): Promise<void>;
  sessionEmail(tokenHash: string): Promise<string | null>;
  dropSession(tokenHash: string): Promise<void>;
  dropSessionsOf(email: string): Promise<void>;
  partnerIdTaken(id: string): Promise<boolean>;
  /** Writes the partner row with its sealed secret and the minute pool. Throws when the id is taken. */
  createPartner(input: { partnerId: string; name: string; secret: string; poolMinutes: number }): Promise<void>;
  partnerSecrets(partnerId: string): Promise<Array<{ secret: string; label: string; createdAt: string; expiresAt?: string }>>;
  /** Puts `secret` first (what links are signed with) and gives every other live secret an expiry. */
  rotateSecret(partnerId: string, secret: string, othersExpireAt: Date): Promise<void>;
  sendMail(mail: Mail): Promise<boolean>;
}

export interface ServiceEnv { origin: string; limits: SignupLimits; ownerEmail: string; signupOn: boolean }

export type RequestLinkResult =
  | { ok: true }
  | { ok: false; error: 'invalid_email' | 'missing_fields' | 'terms_required' | 'rate_limited' | 'signup_closed' };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Ask for a sign-in link. One form serves both: an email with an account gets a sign-in link, a new email gets
 *  a link that creates its sandbox. The answer never says which, so the form cannot be used to find accounts. */
export async function requestLink(store: DashStore, env: ServiceEnv, input: { email?: unknown; name?: unknown; company?: unknown; useCase?: unknown; acceptTerms?: unknown; ip?: string }): Promise<RequestLinkResult> {
  const email = cleanEmail(input.email);
  if (!email) return { ok: false, error: 'invalid_email' };
  const account = await store.findAccount(email);
  const name = cleanText(input.name, 60);
  const company = cleanText(input.company, 80);
  const useCase = cleanText(input.useCase, 1000);
  if (!account) {
    // A sign-in attempt for an email with no account: say nothing, send nothing that could create one.
    if (!name && !company) return { ok: true };
    if (!env.signupOn) return { ok: false, error: 'signup_closed' };
    if (!name || !company) return { ok: false, error: 'missing_fields' };
    if (input.acceptTerms !== true) return { ok: false, error: 'terms_required' };
  }
  const today = day(store.now());
  const emailKey = `dash:link:email:${email}:${today}`;
  if (!(await store.reserve(emailKey, env.limits.linksPerEmailPerDay))) return { ok: false, error: 'rate_limited' };
  if (input.ip && !(await store.reserve(`dash:link:ip:${input.ip}:${today}`, env.limits.linksPerIpPerDay))) {
    await store.release(emailKey);
    return { ok: false, error: 'rate_limited' };
  }
  const token = newToken();
  await store.saveLink({
    tokenHash: hashToken(token), email, purpose: account ? 'login' : 'signup',
    ...(account ? {} : { signup: { name, company, useCase, termsVersion: SANDBOX_TERMS_VERSION } }),
    ip: input.ip, expiresAt: new Date(store.now() + LOGIN_LINK_TTL_MS),
  });
  const url = loginLinkUrl(token, env.origin);
  const what = account ? 'sign in to your Evelyn Voice Tutor dashboard' : 'create your Evelyn Voice Tutor sandbox';
  await store.sendMail({
    to: email,
    subject: account ? 'Your sign-in link for the Evelyn Voice Tutor dashboard' : 'Confirm your email to get your Evelyn Voice Tutor sandbox keys',
    text: `Use this link to ${what}:\n\n${url}\n\nIt works once and for 30 minutes. If you did not ask for it, ignore this email.\n\nEvelyn Learning`,
    html: `<p>Use this link to ${what}:</p><p><a href="${esc(url)}">${esc(url)}</a></p><p>It works once and for 30 minutes. If you did not ask for it, ignore this email.</p><p>Evelyn Learning</p>`,
  });
  return { ok: true };
}

export type UseLinkResult =
  | { ok: true; sessionToken: string; expiresAt: Date; created: boolean; partnerId: string }
  | { ok: false; error: 'invalid_link' | 'rate_limited' | 'signup_closed' };

/** Use an emailed link: sign the person in, and for a new email create the sandbox first. */
export async function useLink(store: DashStore, env: ServiceEnv, token: unknown): Promise<UseLinkResult> {
  if (typeof token !== 'string' || token.length < 20 || token.length > 200) return { ok: false, error: 'invalid_link' };
  const link = await store.takeLink(hashToken(token));
  if (!link) return { ok: false, error: 'invalid_link' };
  let account = await store.findAccount(link.email);
  let created = false;
  if (!account) {
    // A sign-in link whose account has since been removed signs nobody in.
    if (link.purpose !== 'signup' || !link.signup) return { ok: false, error: 'invalid_link' };
    if (!env.signupOn) return { ok: false, error: 'signup_closed' };
    const today = day(store.now());
    const globalKey = `dash:signup:global:${today}`;
    if (!(await store.reserve(globalKey, env.limits.sandboxesPerDay))) return { ok: false, error: 'rate_limited' };
    const ipKey = link.ip ? `dash:signup:ip:${link.ip}:${today}` : '';
    if (ipKey && !(await store.reserve(ipKey, env.limits.sandboxesPerIpPerDay))) {
      await store.release(globalKey);
      return { ok: false, error: 'rate_limited' };
    }
    const partnerId = await pickPartnerId(link.signup.company, (id) => store.partnerIdTaken(id));
    const row: AccountRow & { signupIp?: string } = {
      email: link.email, partnerId, name: link.signup.name, company: link.signup.company, role: 'owner', useCase: link.signup.useCase,
      termsVersion: link.signup.termsVersion, termsAcceptedAt: new Date(store.now()), signupIp: link.ip,
    };
    // The account first: its unique email is what makes one sandbox per email hold when two links for one new
    // email are used at the same moment. The loser signs in to the winner's account and creates no partner.
    if (!(await store.createAccount(row))) {
      await store.release(globalKey); if (ipKey) await store.release(ipKey);
      account = await store.findAccount(link.email);
      if (!account) return { ok: false, error: 'invalid_link' };
    } else {
      try {
        await store.createPartner({ partnerId, name: link.signup.company, secret: newPartnerSecret(), poolMinutes: SANDBOX_FREE_MINUTES });
      } catch (err) {
        // No keys were made: the account must not outlive them, or the email could never sign up again.
        await store.removeAccount(link.email);
        await store.release(globalKey); if (ipKey) await store.release(ipKey);
        throw err;
      }
      account = row; created = true;
      await store.sendMail({
        to: env.ownerEmail, replyTo: link.email,
        subject: `New sandbox: ${link.signup.company} (${link.signup.name})`,
        text: `A new self-serve sandbox was created.\n\nCompany: ${link.signup.company}\nName: ${link.signup.name}\nEmail: ${link.email}\nPartner id: ${partnerId}\nFree minutes: ${SANDBOX_FREE_MINUTES}\nIP: ${link.ip || 'unknown'}\n\nWhat they are building:\n${link.signup.useCase || '(not given)'}\n`,
        html: `<h2>New self-serve sandbox</h2><table>${[['Company', link.signup.company], ['Name', link.signup.name], ['Email', link.email], ['Partner id', partnerId], ['Free minutes', String(SANDBOX_FREE_MINUTES)], ['IP', link.ip || 'unknown']].map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v!)}</td></tr>`).join('')}</table><p><strong>What they are building:</strong></p><p>${esc(link.signup.useCase || '(not given)').replace(/\n/g, '<br>')}</p>`,
      }).catch(() => false);
    }
  }
  if (!account.termsAcceptedAt) await store.updateAccount(account.email, { termsVersion: SANDBOX_TERMS_VERSION, termsAcceptedAt: new Date(store.now()) });
  await store.updateAccount(account.email, { lastLoginAt: new Date(store.now()) });
  const sessionToken = newToken();
  const expiresAt = new Date(store.now() + DASH_SESSION_TTL_MS);
  await store.saveSession(hashToken(sessionToken), account.email, expiresAt);
  return { ok: true, sessionToken, expiresAt, created, partnerId: account.partnerId };
}

/** The account a session cookie belongs to, or null (no cookie, an ended session, a removed account). */
export async function accountForSession(store: DashStore, sessionToken: string | undefined | null): Promise<AccountRow | null> {
  if (!sessionToken || sessionToken.length < 20 || sessionToken.length > 200) return null;
  const email = await store.sessionEmail(hashToken(sessionToken));
  return email ? store.findAccount(email) : null;
}

export async function signOut(store: DashStore, sessionToken: string | undefined | null): Promise<void> {
  if (sessionToken) await store.dropSession(hashToken(sessionToken));
}

/** Replace the partner's secret. The new one signs from now on; the old ones keep working for a day, so the
 *  partner's servers can be switched over without an outage. Owners only. */
export async function rotateSecret(store: DashStore, account: AccountRow): Promise<{ ok: true; secret: string; oldValidUntil: Date } | { ok: false; error: 'owner_only' }> {
  if (account.role !== 'owner') return { ok: false, error: 'owner_only' };
  const secret = newPartnerSecret();
  const oldValidUntil = new Date(store.now() + ROTATED_SECRET_GRACE_MS);
  await store.rotateSecret(account.partnerId, secret, oldValidUntil);
  return { ok: true, secret, oldValidUntil };
}

/** Give a colleague access: an account on the same partner, signed in to by their own emailed link. */
export async function addMember(store: DashStore, env: ServiceEnv, owner: AccountRow, rawEmail: unknown): Promise<{ ok: true } | { ok: false; error: 'owner_only' | 'invalid_email' | 'email_in_use' | 'too_many' }> {
  if (owner.role !== 'owner') return { ok: false, error: 'owner_only' };
  const email = cleanEmail(rawEmail);
  if (!email) return { ok: false, error: 'invalid_email' };
  if ((await store.listAccounts(owner.partnerId)).length >= 10) return { ok: false, error: 'too_many' };
  if (!(await store.createAccount({ email, partnerId: owner.partnerId, name: '', company: owner.company, role: 'member' }))) return { ok: false, error: 'email_in_use' };
  await store.sendMail({
    to: email,
    subject: `${owner.name || owner.email} added you to ${owner.company || 'their'} Evelyn Voice Tutor dashboard`,
    text: `You now have access to the Evelyn Voice Tutor dashboard for ${owner.company || owner.partnerId}.\n\nSign in with this email address at ${env.origin}/dashboard/login\n\nEvelyn Learning`,
    html: `<p>You now have access to the Evelyn Voice Tutor dashboard for ${esc(owner.company || owner.partnerId)}.</p><p>Sign in with this email address at <a href="${esc(env.origin)}/dashboard/login">${esc(env.origin)}/dashboard/login</a>.</p><p>Evelyn Learning</p>`,
  }).catch(() => false);
  return { ok: true };
}

export async function removeMember(store: DashStore, owner: AccountRow, rawEmail: unknown): Promise<{ ok: true } | { ok: false; error: 'owner_only' | 'not_found' }> {
  if (owner.role !== 'owner') return { ok: false, error: 'owner_only' };
  const email = cleanEmail(rawEmail);
  const target = email ? await store.findAccount(email) : null;
  // Only a member of the owner's own partner, and never the owner: the partner would be left with nobody.
  if (!target || target.partnerId !== owner.partnerId || target.role === 'owner') return { ok: false, error: 'not_found' };
  await store.dropSessionsOf(target.email);
  await store.removeAccount(target.email);
  return { ok: true };
}

/** Called when a partner's session is charged to its pool: the first time, we are told (Praveen 2026-11-24:
 *  "they are actually implementing it"). The stamp is set in one step, so two sessions ending together send one. */
export async function noteFirstSession(store: DashStore & { stampFirstSession(partnerId: string, at: Date): Promise<AccountRow | null> }, env: ServiceEnv, info: { partnerId: string; sessionId: string; minutes: number; languages?: string[] | null; topic?: string | null; inputMode?: string | null }): Promise<boolean> {
  const owner = await store.stampFirstSession(info.partnerId, new Date(store.now()));
  if (!owner) return false;
  const lang = info.languages?.length ? info.languages.join(', ') : 'English';
  const lines = [`Company: ${owner.company}`, `Contact: ${owner.name} <${owner.email}>`, `Partner id: ${info.partnerId}`, `Session: ${info.sessionId}`, `Length: ${info.minutes.toFixed(1)} min`, `Language: ${lang}`, `Mode: ${info.inputMode || 'voice'}`, `Topic: ${info.topic || '(none)'}`];
  await store.sendMail({
    to: env.ownerEmail, replyTo: owner.email,
    subject: `First session: ${owner.company || info.partnerId} ran its first lesson`,
    text: `${owner.company || info.partnerId} has run its first session on the tutor engine.\n\n${lines.join('\n')}\n`,
    html: `<h2>First session from a sandbox partner</h2><p>${lines.map(esc).join('<br>')}</p>`,
  }).catch(() => false);
  return true;
}
