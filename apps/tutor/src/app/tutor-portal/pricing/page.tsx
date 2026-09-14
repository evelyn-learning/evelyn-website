import type { Metadata } from 'next';
import Link from 'next/link';
import { pricing, sandboxLimits, perSessionUsd } from '../data/pricing';
import { CostCalculator } from './components/CostCalculator';

export const metadata: Metadata = {
  title: 'Pricing',
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Pricing</h1>
        <p className="text-lg text-slate-600">{pricing.tagline}</p>
      </div>

      {/* The one price */}
      <div className="mb-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div className="text-center md:pr-8 md:text-left">
            <p className="text-sm font-medium uppercase tracking-wider text-blue-600">{pricing.productName}</p>
            <div className="mt-2 flex items-baseline justify-center gap-1 md:justify-start">
              <span className="text-5xl font-bold text-slate-900">${pricing.perMinuteUsd.toFixed(2)}</span>
              <span className="text-lg text-slate-500">/ tutoring minute</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              A 30-minute session costs ${perSessionUsd(30).toFixed(2)}. An hour costs ${perSessionUsd(60).toFixed(2)}.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm text-slate-600">{pricing.description}</p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {pricing.billing.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-600">&#10003;</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Every minute includes</h2>
        <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {pricing.includes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Voice and text sessions are billed at the same rate. There are no tiers, add-ons or per-seat fees.
        </p>
      </div>

      {/* Cost calculator */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Estimate Your Cost</h2>
        <CostCalculator />
      </div>

      {/* Sandbox */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Sandbox — Free</h2>
        <p className="mb-4 text-sm text-slate-600">
          Evaluate the full integration at no cost. Same engine, same whiteboard, your own signed keys.
        </p>
        <ul className="mb-6 space-y-2 text-sm text-slate-600">
          <li>{sandboxLimits.freeMinutes} free tutoring minutes</li>
          <li>{sandboxLimits.maxSessionDurationMinutes} min max per session, {sandboxLimits.maxConcurrentSessions} concurrent sessions</li>
          <li>Partner API and end-of-session events included</li>
          <li>No credit card required</li>
        </ul>
        <Link
          href="/sandbox"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Request Sandbox Access
        </Link>
      </div>
    </div>
  );
}
