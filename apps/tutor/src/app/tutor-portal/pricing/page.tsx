import type { Metadata } from 'next';
import Link from 'next/link';
import { pricingTiers, volumeDiscounts, platformFees, sandboxLimits, launchPromo } from '../data/pricing';
import { CostCalculator } from './components/CostCalculator';

export const metadata: Metadata = {
  title: 'Pricing',
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Pricing</h1>
        <p className="text-lg text-slate-600">
          Usage-based pricing. Pay for what your students use.
        </p>
      </div>

      {/* Launch Partner Promo */}
      <div className="mb-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
            Launch Partner Program
          </span>
          <span className="text-sm text-slate-500">Limited availability</span>
        </div>
        <p className="mb-6 text-sm text-slate-600">
          Join as a launch partner and receive 50% off setup and platform fees for your first year.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">One-time setup</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">${launchPromo.setupPrice.toLocaleString()}</p>
              <p className="text-lg text-slate-400 line-through">${platformFees.setup.toLocaleString()}</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">Sandbox access, technical onboarding, integration support</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Monthly platform fee</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">${launchPromo.monthlyPrice}/mo</p>
              <p className="text-lg text-slate-400 line-through">${platformFees.monthly}/mo</p>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              For first {launchPromo.monthlyDiscountMonths} months, then ${platformFees.monthly}/mo
            </p>
          </div>
        </div>
      </div>

      {/* Per-minute pricing */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Usage</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border-2 p-6 ${
                tier.name === 'Premium Voice'
                  ? 'border-blue-200 bg-blue-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <h3 className="mb-1 text-lg font-semibold text-slate-900">{tier.name}</h3>
              <p className="mb-4 text-sm text-slate-500">{tier.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">
                  ${tier.costPerMinute.toFixed(2)}
                </span>
                <span className="text-sm text-slate-500">/minute</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ~${(tier.costPerMinute * 30).toFixed(2)} per 30-min session
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          All tiers include full whiteboard support (19 visual types), session analytics, and webhook events.
          Rates cover all AI inference costs.
        </p>
      </div>

      {/* Volume discounts */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Volume Discounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left">
                <th className="pb-3 pr-4 font-medium text-slate-500">Monthly Volume</th>
                <th className="pb-3 font-medium text-slate-500">Discount</th>
              </tr>
            </thead>
            <tbody>
              {volumeDiscounts.map((d) => (
                <tr key={d.label} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 text-slate-700">{d.label}</td>
                  <td className="py-2.5">
                    {d.discount === null ? (
                      <span className="font-medium text-blue-600">Custom pricing</span>
                    ) : d.discount === 0 ? (
                      <span className="text-slate-400">Standard rate</span>
                    ) : (
                      <span className="font-medium text-green-600">{d.discount * 100}% off</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          Test the full integration at no cost during development.
        </p>
        <ul className="mb-6 space-y-2 text-sm text-slate-600">
          <li>Standard engine (Premium available in production)</li>
          <li>{sandboxLimits.maxSessionsPerMonth} sessions/month, {sandboxLimits.maxSessionDurationMinutes} min max per session</li>
          <li>{sandboxLimits.maxConcurrentSessions} concurrent sessions</li>
          <li>Up to {sandboxLimits.maxModuleUploads} curriculum module uploads</li>
          <li>Full webhook testing included</li>
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
