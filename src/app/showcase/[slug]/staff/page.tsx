'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

export default function StaffLoginPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!site) return null;

  const baseUrl = `/showcase/${site.slug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/showcase/${site.slug}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode, staffAccess: true }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store staff session
        sessionStorage.setItem(`showcase_staff_${site.slug}`, JSON.stringify({
          site: data.site,
          timestamp: Date.now(),
          authenticated: true,
        }));
        router.push(`${baseUrl}/staff/dashboard`);
      } else {
        setError(data.error || 'Invalid access code');
      }
    } catch {
      setError('Network error. Please try again.');
    }

    setIsVerifying(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href={baseUrl}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${site.branding.primaryColor}15` }}
            >
              <Sparkles className="w-8 h-8" style={{ color: site.branding.primaryColor }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
            <p className="text-gray-600 mt-2">
              Enter your access code to access AI tools and dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter your code"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent text-lg tracking-wider font-mono"
                  style={{ '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties}
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !accessCode}
              className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: site.branding.primaryColor }}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Help text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Contact your administrator if you need an access code.
          </p>
        </div>
      </div>
    </div>
  );
}
