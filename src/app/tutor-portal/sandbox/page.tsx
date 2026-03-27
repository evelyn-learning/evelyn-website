'use client';

import { useState } from 'react';
import { sandboxLimits } from '../data/pricing';

const regions = [
  'Algeria', 'Brazil', 'Egypt', 'France', 'Germany', 'Gulf States',
  'India', 'Morocco', 'Nigeria', 'Pakistan', 'South Korea', 'Southeast Asia',
  'Turkey', 'United Kingdom', 'United States', 'Other',
];

const volumeRanges = [
  'Under 1,000 students',
  '1,000 - 10,000 students',
  '10,000 - 100,000 students',
  '100,000+ students',
];

export default function SandboxPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name'),
      email: form.get('email'),
      company: form.get('company'),
      region: form.get('region'),
      volume: form.get('volume'),
      website: form.get('website'),
      useCase: form.get('useCase'),
    };

    try {
      const res = await fetch('/api/tutor-portal/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Request Received</h1>
        <p className="mb-6 text-slate-600">
          We&apos;ll review your request and provision sandbox API keys within 1-2 business days.
          You&apos;ll receive credentials and documentation at the email address you provided.
        </p>
        <a
          href="/docs/quickstart"
          className="text-sm font-medium text-blue-600 underline"
        >
          Read the Getting Started guide while you wait
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Request Sandbox Access</h1>
      <p className="mb-8 text-lg text-slate-600">
        Get free API keys to test the Voice Tutor integration in your development environment.
      </p>

      {/* Sandbox limits info */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Sandbox includes:</p>
        <ul className="space-y-1 text-sm text-slate-500">
          <li>Standard voice engine</li>
          <li>{sandboxLimits.maxSessionsPerMonth} sessions/month, {sandboxLimits.maxSessionDurationMinutes} min max each</li>
          <li>Up to {sandboxLimits.maxModuleUploads} curriculum module uploads</li>
          <li>Full webhook and API access</li>
          <li>No credit card required</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Work Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-700">
            Company / Organization *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="region" className="mb-1 block text-sm font-medium text-slate-700">
              Target Market / Region *
            </label>
            <select
              id="region"
              name="region"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="volume" className="mb-1 block text-sm font-medium text-slate-700">
              Expected Student Volume *
            </label>
            <select
              id="volume"
              name="volume"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select volume</option>
              {volumeRanges.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="website" className="mb-1 block text-sm font-medium text-slate-700">
            Website URL
          </label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="https://"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="useCase" className="mb-1 block text-sm font-medium text-slate-700">
            Use Case *
          </label>
          <textarea
            id="useCase"
            name="useCase"
            required
            rows={4}
            placeholder="Describe your platform, target audience, and how you plan to use the Voice Tutor..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-blue-300"
        >
          {submitting ? 'Submitting...' : 'Request Sandbox Access'}
        </button>

        <p className="text-center text-xs text-slate-400">
          We&apos;ll review your request and respond within 1-2 business days.
        </p>
      </form>
    </div>
  );
}
