'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { DollarSign, Check, CreditCard, Users, ArrowRight } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

interface TuitionItem {
  course: string;
  duration: string;
  singlePayment?: string;
  semiannual?: string;
  monthly?: string;
}

export default function ShowcasePricingPage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const pricing = pages.pricing as {
    title?: string;
    enrollmentInfo?: {
      applicationFee?: string;
      process?: string;
      siblingDiscount?: string;
    };
    tuition?: TuitionItem[];
    tutoring?: {
      oneStudent?: string;
      twoStudents?: string;
      threeStudents?: string;
    };
    paymentPlans?: string[];
    pricingInfo?: {
      summary?: string;
      rates?: Array<{ service: string; price: string; details?: string }>;
      hasFreeTrial?: boolean;
      hasFreeConsultation?: boolean;
    };
    programs?: Array<{ name: string; description?: string; price?: string }>;
  } | undefined;

  const baseUrl = `/showcase/${site.slug}`;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {pricing?.title || 'Pricing & Enrollment'}
            </h1>
            <p className="text-xl text-white/90">
              Transparent pricing and flexible payment options
            </p>
          </div>
        </div>
      </section>

      {/* Enrollment Info */}
      {pricing?.enrollmentInfo && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.enrollmentInfo.applicationFee && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <CreditCard
                      className="w-6 h-6"
                      style={{ color: site.branding.primaryColor }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application Fee</h3>
                    <p className="text-gray-600 text-sm">{pricing.enrollmentInfo.applicationFee}</p>
                  </div>
                </div>
              )}
              {pricing.enrollmentInfo.siblingDiscount && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <Users className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sibling Discount</h3>
                    <p className="text-gray-600 text-sm">{pricing.enrollmentInfo.siblingDiscount}</p>
                  </div>
                </div>
              )}
              {pricing.enrollmentInfo.process && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <Check className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enrollment Process</h3>
                    <p className="text-gray-600 text-sm">{pricing.enrollmentInfo.process}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Summary */}
      {pricing?.pricingInfo?.summary && (
        <section className="py-8 bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${site.branding.primaryColor}15` }}
              >
                <DollarSign
                  className="w-6 h-6"
                  style={{ color: site.branding.primaryColor }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pricing Overview</h3>
                <p className="text-gray-600">{pricing.pricingInfo.summary}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Scraped Rates Table */}
      {pricing?.pricingInfo?.rates && pricing.pricingInfo.rates.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Service</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.pricingInfo.rates.map((rate, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{rate.service}</td>
                      <td className="py-4 px-4">
                        <span
                          className="font-semibold"
                          style={{ color: site.branding.primaryColor }}
                        >
                          {rate.price}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{rate.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(pricing.pricingInfo.hasFreeTrial || pricing.pricingInfo.hasFreeConsultation) && (
              <div className="mt-6 flex gap-4">
                {pricing.pricingInfo.hasFreeTrial && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                    <Check className="w-4 h-4" /> Free Trial Available
                  </span>
                )}
                {pricing.pricingInfo.hasFreeConsultation && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                    <Check className="w-4 h-4" /> Free Consultation
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Programs with Pricing */}
      {pricing?.programs && pricing.programs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Programs & Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricing.programs.map((program, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{program.name}</h3>
                  {program.price && (
                    <p
                      className="text-xl font-bold mb-3"
                      style={{ color: site.branding.primaryColor }}
                    >
                      {program.price}
                    </p>
                  )}
                  {program.description && (
                    <p className="text-gray-600 text-sm">{program.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tuition Table */}
      {pricing?.tuition && pricing.tuition.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tuition Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Course</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Duration</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Single Payment
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Semi-Annual</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.tuition.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-900">{item.course}</td>
                      <td className="py-4 px-4 text-gray-600">{item.duration}</td>
                      <td className="py-4 px-4">
                        <span
                          className="font-semibold"
                          style={{ color: site.branding.primaryColor }}
                        >
                          {item.singlePayment || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{item.semiannual || '—'}</td>
                      <td className="py-4 px-4 text-gray-600">{item.monthly || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Fallback if no pricing data */}
      {!pricing?.pricingInfo?.rates?.length && !pricing?.programs?.length && !pricing?.tuition?.length && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Us for Pricing</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600 mb-6">
                Please contact us directly to discuss pricing options tailored to your needs.
              </p>
              <Link
                href={`${baseUrl}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition"
                style={{ backgroundColor: site.branding.primaryColor }}
              >
                Get a Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Private Tutoring */}
      {pricing?.tutoring && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Private Tutoring Rates</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'One Student', price: pricing.tutoring.oneStudent },
                { label: 'Two Students', price: pricing.tutoring.twoStudents },
                { label: 'Three Students', price: pricing.tutoring.threeStudents },
              ].map(
                (item, idx) =>
                  item.price && (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-sm text-center">
                      <h3 className="text-gray-500 mb-2">{item.label}</h3>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: site.branding.primaryColor }}
                      >
                        {item.price}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payment Plans */}
      {pricing?.paymentPlans && pricing.paymentPlans.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Options</h2>
            <div className="max-w-3xl">
              <div className="space-y-4">
                {pricing.paymentPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <DollarSign
                        className="w-4 h-4"
                        style={{ color: site.branding.primaryColor }}
                      />
                    </div>
                    <p className="text-gray-600">{plan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-12"
        style={{ backgroundColor: site.branding.primaryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6">
            Contact us to discuss your needs and find the right program for your student.
          </p>
          <Link
            href={`${baseUrl}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
