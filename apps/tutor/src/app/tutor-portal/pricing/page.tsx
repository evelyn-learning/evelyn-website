import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../components/JsonLd';
import { count, minuteCounting, portalFacts, rateUsd, usd } from '../data/facts';
import { pricing, sandboxLimits, perSessionUsd } from '../data/pricing';
import { PORTAL_ORIGIN, PORTAL_SITE_NAME } from '../portal-pages';
import { organizationLd, portalMetadata } from '../seo';
import { CostCalculator } from './components/CostCalculator';

// 2026-11-24: this page said "billed monthly in arrears" and "5 concurrent sessions". A self-serve account
// pays in prepaid packs (partner-dashboard/billing.ts) and nothing limits concurrent sessions. Every number
// below is read from the constants through data/facts.ts; scripts/test-portal-seo.ts compares them.
const facts = portalFacts();
const typedLessPct = Math.round((1 - facts.textMinuteRate) * 100);
const invoiceMail = 'mailto:info@evelynlearning.com?subject=Voice%20Tutor%20monthly%20invoicing';

export const metadata: Metadata = portalMetadata('/pricing', {
  description:
    `${rateUsd(facts.voicePerMinuteUsd)} per voice tutoring minute, ${rateUsd(facts.textPerMinuteUsd)} per typed minute. ` +
    `Prepaid packs from ${count(facts.packs[0]!.minutes)} minutes for ${usd(facts.packs[0]!.usd)}, and a free sandbox with ${count(facts.sandboxFreeMinutes)} minutes.`,
});

/** The questions shown at the foot of the page. The same text goes into the FAQPage structured data, so what a
 *  search engine reads is what a visitor reads. */
const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'How much does the Voice Tutor cost?',
    a: `${rateUsd(facts.voicePerMinuteUsd)} per voice tutoring minute and ${rateUsd(facts.textPerMinuteUsd)} per typed minute. There is no setup fee, no monthly platform fee and no minimum commitment.`,
  },
  {
    q: 'How do I pay?',
    a: `By card, in prepaid packs bought from your dashboard: ${facts.packs.map((p) => `${count(p.minutes)} minutes for ${usd(p.usd)}`).join(', ')}. Minutes are added to your balance when the payment clears. Sales tax or VAT is added at checkout where it applies.`,
  },
  {
    q: 'Do prepaid minutes expire?',
    a: `Minutes bought in a pack are good for ${facts.packValidityMonths} months from the day they are added. The free sandbox minutes do not expire and are used first.`,
  },
  { q: 'How are minutes counted?', a: minuteCounting(facts).balance },
  {
    q: 'How do typed sessions count?',
    a: `One balance covers both. A minute of a voice session uses one minute; a minute of a typed session uses ${facts.textMinuteRate} of a minute, so typed tutoring costs ${typedLessPct}% less.`,
  },
  {
    q: 'What does the free sandbox include?',
    a: `${count(facts.sandboxFreeMinutes)} free tutoring minutes on the production engine, with your own signed keys, the partner API and webhooks. A sandbox session ends at ${facts.sandboxSessionMinutes} minutes. No card is needed.`,
  },
  {
    q: 'How long can a session run?',
    a: `Up to ${facts.sandboxSessionMinutes} minutes in the free sandbox. Buying any pack raises the session limit to ${facts.paidSessionMinutes} minutes.`,
  },
  {
    q: 'Can I be invoiced monthly instead?',
    a: `Monthly invoicing is by arrangement for accounts that need more than the largest pack (${count(facts.largestPack.minutes)} minutes). Write to info@evelynlearning.com.`,
  },
];

const pricingLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationLd,
    {
      '@type': 'SoftwareApplication',
      '@id': `${PORTAL_ORIGIN}/#software`,
      name: PORTAL_SITE_NAME,
      url: `${PORTAL_ORIGIN}/`,
      applicationCategory: ['EducationalApplication', 'DeveloperApplication'],
      operatingSystem: 'Web',
      publisher: { '@id': organizationLd['@id'] },
      offers: [
        {
          '@type': 'Offer',
          name: 'Voice tutoring, per minute',
          price: facts.voicePerMinuteUsd.toFixed(2),
          priceCurrency: 'USD',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: facts.voicePerMinuteUsd.toFixed(2), priceCurrency: 'USD', unitCode: 'MIN', unitText: 'tutoring minute' },
          url: `${PORTAL_ORIGIN}/pricing`,
        },
        {
          '@type': 'Offer',
          name: 'Typed tutoring, per minute',
          price: facts.textPerMinuteUsd.toFixed(2),
          priceCurrency: 'USD',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: facts.textPerMinuteUsd.toFixed(2), priceCurrency: 'USD', unitCode: 'MIN', unitText: 'tutoring minute' },
          url: `${PORTAL_ORIGIN}/pricing`,
        },
        ...facts.packs.map((p) => ({
          '@type': 'Offer',
          name: `Prepaid pack: ${p.label}`,
          price: String(p.usd),
          priceCurrency: 'USD',
          url: `${PORTAL_ORIGIN}/pricing`,
        })),
        {
          '@type': 'Offer',
          name: 'Free sandbox',
          price: '0',
          priceCurrency: 'USD',
          description: `${count(facts.sandboxFreeMinutes)} free tutoring minutes, sessions of up to ${facts.sandboxSessionMinutes} minutes.`,
          url: `${PORTAL_ORIGIN}/sandbox`,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${PORTAL_ORIGIN}/pricing#faq`,
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};

const check = <span className="mt-0.5 text-blue-600">&#10003;</span>;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={pricingLd} />
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
            <p className="mt-1 text-sm text-slate-500">
              Text-only sessions: ${pricing.textPerMinuteUsd.toFixed(2)} / minute.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm text-slate-600">{pricing.description}</p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {pricing.billing.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  {check}
                  {line}
                </li>
              ))}
              <li className="flex items-start gap-2">
                {check}
                <span>
                  Monthly invoicing by arrangement above {count(facts.largestPack.minutes)} minutes:{' '}
                  <a href={invoiceMail} className="font-medium text-blue-600 underline underline-offset-2">write to us</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Prepaid packs */}
      <section aria-labelledby="packs" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="packs" className="mb-1 text-lg font-semibold text-slate-900">Prepaid minute packs</h2>
        <p className="mb-5 text-sm text-slate-600">
          You buy minutes ahead, by card, from the Billing page of your dashboard. Larger packs cost less per minute.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {facts.packs.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500">{p.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{usd(p.usd)}</p>
              <p className="mt-2 text-sm text-slate-600">{rateUsd(p.perMinuteUsd)} per voice minute</p>
              <p className="text-xs text-slate-500">{rateUsd(p.perMinuteUsd * facts.textMinuteRate)} per typed minute</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 space-y-2 text-sm text-slate-600">
          <li>
            One balance covers voice and typed sessions. A typed session uses {facts.textMinuteRate} of a minute per
            minute, so typed tutoring costs {typedLessPct}% less.
          </li>
          <li>
            Minutes bought in a pack are good for {facts.packValidityMonths} months from the day they are added. The
            free sandbox minutes do not expire and are used first.
          </li>
          <li>
            Buying any pack raises the session limit from {facts.sandboxSessionMinutes} to {facts.paidSessionMinutes} minutes.
          </li>
          <li>
            Automatic top-up, which you can turn on after a first purchase, buys the pack you choose when your
            balance runs low, so a class in progress does not run out.
          </li>
          <li>Sales tax or VAT is added at checkout where it applies.</li>
          <li>
            Need more than {count(facts.largestPack.minutes)} minutes at a time, or an invoice each month?{' '}
            <a href={invoiceMail} className="font-medium text-blue-600 underline underline-offset-2">Write to info@evelynlearning.com</a>.
          </li>
        </ul>
      </section>

      {/* What's included */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Every minute includes</h2>
        <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {pricing.includes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              {check}
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Voice sessions are billed at ${pricing.perMinuteUsd.toFixed(2)}/min and text-only sessions at $
          {pricing.textPerMinuteUsd.toFixed(2)}/min. There are no tiers, add-ons or per-seat fees.
        </p>
      </div>

      {/* Cost calculator */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Estimate Your Cost</h2>
        <CostCalculator />
      </div>

      {/* Sandbox */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Sandbox — Free</h2>
        <p className="mb-4 text-sm text-slate-600">
          Evaluate the full integration at no cost. Same engine, same whiteboard, your own signed keys.
        </p>
        <ul className="mb-6 space-y-2 text-sm text-slate-600">
          <li>{count(facts.sandboxFreeMinutes)} free tutoring minutes</li>
          <li>{sandboxLimits.maxSessionDurationMinutes} min max per session</li>
          <li>Partner API, webhooks and end-of-session events included</li>
          <li>No credit card required; keys are shown as soon as you confirm your email address</li>
        </ul>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/sandbox"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Get API keys
          </Link>
          <Link href="/dashboard/login" className="text-sm font-medium text-blue-600 underline underline-offset-2">
            Sign in
          </Link>
        </div>
      </div>

      {/* Questions: the visible text of the FAQPage structured data above */}
      <section aria-labelledby="pricing-faq">
        <h2 id="pricing-faq" className="mb-4 text-lg font-semibold text-slate-900">Questions</h2>
        <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-6">
          {faqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="text-sm font-semibold text-slate-900">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
