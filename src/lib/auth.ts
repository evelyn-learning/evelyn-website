import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB, isDBConfigured } from "@/lib/db";
import { AdminUser } from "@/models";

// There is deliberately NO hardcoded fallback admin here. There used to be
// one — admin@evelynlearning.com with a bcrypt hash of "admin123" and a
// "change in production!" comment — reached whenever the AdminUser lookup
// below didn't return a row. Two ways that fired: no row for the submitted
// email, and (worse, because it survived setting a real password) ANY thrown
// error from connectDB/findOne, since the catch logged and fell through to
// it. A Mongo blip therefore re-enabled a published credential on an /admin
// surface that has no middleware gate — every page and handler gates itself.
//
// Authentication now fails CLOSED: no database, no login. Admin accounts live
// only in the AdminUser collection. Seed or reset one with
// `npx tsx scripts/seed-admin-user.ts` (ADMIN_EMAIL + ADMIN_PASSWORD) —
// that script is the only supported way to create the first admin.

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // The database is the ONLY credential store. Without it configured
        // there is nothing to authenticate against, so refuse rather than
        // reaching for a second, weaker source.
        if (!isDBConfigured()) {
          console.error("[auth] MONGODB_URI is not configured — refusing all sign-ins");
          return null;
        }

        try {
          await connectDB();
          // Normalized the same way seed-admin-user.ts stores it, so a
          // capitalized sign-in doesn't miss a lowercase row (findOne is
          // case-sensitive). Safe for existing rows — the only one on prod
          // is already lowercase.
          const dbUser = await AdminUser.findOne({ email: credentials.email.trim().toLowerCase() });
          if (!dbUser) return null;

          const isValid = await bcrypt.compare(credentials.password, dbUser.passwordHash);
          if (!isValid) return null;

          return {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
          };
        } catch (error) {
          // Fail CLOSED. This catch used to log and fall through to the
          // hardcoded fallback, which turned any transient Mongo failure
          // into a working "admin123" sign-in.
          console.error("[auth] database error during sign-in — denying:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  // 2026-06-16: silence the JWT_SESSION_ERROR stack-trace spam. Fires
  // when a stale next-auth cookie was signed with a different
  // NEXTAUTH_SECRET than the current process knows about — benign for
  // demo endpoints (they treat decryption failures as "no session"
  // gracefully). next-auth's default logger emits a multi-line stack
  // trace per occurrence, which fills server logs during normal
  // tutoring sessions. Downgrade to a single one-liner; other auth
  // errors continue to log normally.
  logger: {
    error(code) {
      if (code === 'JWT_SESSION_ERROR' || code === 'JWE_DECRYPTION_FAILED') {
        // Suppress entirely — stale-cookie noise.
        return;
      }
      console.error(`[next-auth] ${code}`);
    },
    warn(code) {
      console.warn(`[next-auth] ${code}`);
    },
    debug() {
      // Always off.
    },
  },
};
