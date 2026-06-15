import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB, isDBConfigured } from "@/lib/db";
import { AdminUser } from "@/models";

// Fallback admin user (used only if no admin exists in database)
const FALLBACK_ADMIN = {
  id: "1",
  email: "admin@evelynlearning.com",
  name: "Admin",
  // Hash of "admin123" - change in production!
  passwordHash: "$2a$10$QXEk.Jl/pUTJEScgf5vwKev6UXxn9JjWU/ytSzm2wRjphM4zfSivu",
};

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

        // Try database first
        if (isDBConfigured()) {
          try {
            await connectDB();
            const dbUser = await AdminUser.findOne({ email: credentials.email });

            if (dbUser) {
              const isValid = await bcrypt.compare(
                credentials.password,
                dbUser.passwordHash
              );
              if (isValid) {
                return {
                  id: dbUser._id.toString(),
                  email: dbUser.email,
                  name: dbUser.name,
                };
              }
              return null;
            }
          } catch (error) {
            console.error("Database auth error:", error);
          }
        }

        // Fallback to hardcoded admin
        if (credentials.email === FALLBACK_ADMIN.email) {
          const isValid = await bcrypt.compare(
            credentials.password,
            FALLBACK_ADMIN.passwordHash
          );
          if (isValid) {
            return {
              id: FALLBACK_ADMIN.id,
              email: FALLBACK_ADMIN.email,
              name: FALLBACK_ADMIN.name,
            };
          }
        }

        return null;
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
