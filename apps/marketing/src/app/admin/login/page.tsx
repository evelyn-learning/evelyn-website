"use client";

import { Suspense, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

// next-auth appends ?error=<code> to the signIn page when an OAuth attempt
// fails. AccessDenied is what our signIn callback returns for a Google
// account that is not an admin — say so plainly instead of "invalid password".
const OAUTH_ERRORS: Record<string, string> = {
  AccessDenied:
    "That Google account is not an admin. Sign in with an authorized account or use your password.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  Callback: "Google sign-in failed. Please try again.",
  Configuration: "Google sign-in is not configured on this server.",
};

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => {
    const code = searchParams.get("error");
    return code ? OAUTH_ERRORS[code] || "Sign-in failed. Please try again." : "";
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Only render the Google button when the server actually registered the
  // provider (it is conditional on GOOGLE_CLIENT_ID/SECRET being set).
  const [hasGoogle, setHasGoogle] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProviders()
      .then((providers) => {
        if (!cancelled && providers && "google" in providers) setHasGoogle(true);
      })
      .catch(() => {
        /* password form still works */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/admin" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Lock className="h-6 w-6 text-primary-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage your website content
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {hasGoogle && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Sign in with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              or
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="admin@evelynlearning.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// useSearchParams() in a client component needs a Suspense boundary so the
// page can still be statically prerendered (Next requires it at build time).
export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
