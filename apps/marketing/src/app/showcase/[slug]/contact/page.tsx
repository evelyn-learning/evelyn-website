'use client';

import { useContext, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

export default function ShowcaseContactPage() {
  const site = useContext(SiteContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const contactPage = pages.contact as {
    title?: string;
    intro?: string;
  } | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
              {contactPage?.title || 'Contact Us'}
            </h1>
            <p className="text-xl text-white/90">
              We&apos;d love to hear from you. Get in touch with us today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {contactPage?.intro && (
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
              {contactPage.intro}
            </p>
          )}

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                {site.contact.phone && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <Phone className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a
                        href={`tel:${site.contact.phone}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {site.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {site.contact.email && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <Mail className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {site.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {site.contact.address && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{site.contact.address}</p>
                    </div>
                  </div>
                )}

                {site.contact.businessHours && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <Clock className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hours</h3>
                      <p className="text-gray-600">{site.contact.businessHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map placeholder */}
              <div className="mt-8">
                <div
                  className="w-full h-48 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${site.branding.primaryColor}10` }}
                >
                  <div className="text-center">
                    <MapPin
                      className="w-8 h-8 mx-auto mb-2 opacity-50"
                      style={{ color: site.branding.primaryColor }}
                    />
                    <p className="text-sm text-gray-500">Map integration coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <CheckCircle
                        className="w-8 h-8"
                        style={{ color: site.branding.primaryColor }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                      }}
                      className="text-sm font-medium hover:underline"
                      style={{ color: site.branding.primaryColor }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent"
                            style={
                              { '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties
                            }
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent"
                            style={
                              { '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties
                            }
                            placeholder="john@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent"
                            style={
                              { '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties
                            }
                            placeholder="(617) 555-1234"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent"
                            style={
                              { '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties
                            }
                          >
                            <option value="">Select a subject</option>
                            <option value="enrollment">Enrollment Inquiry</option>
                            <option value="programs">Program Information</option>
                            <option value="tutoring">Private Tutoring</option>
                            <option value="pricing">Pricing & Fees</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent resize-none"
                          style={
                            { '--tw-ring-color': site.branding.primaryColor } as React.CSSProperties
                          }
                          placeholder="Tell us about your needs..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ backgroundColor: site.branding.primaryColor }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  q: 'What ages do you teach?',
                  a: 'We offer programs for students from grades 1 through 12, with curriculum tailored to each age group.',
                },
                {
                  q: 'How are classes structured?',
                  a: 'Classes are small (maximum 8 students) and meet weekly for 1.5-2 hours. Students receive homework and regular assessments.',
                },
                {
                  q: 'Do you offer trial classes?',
                  a: 'Yes! We encourage new students to attend a trial class to see if our program is a good fit.',
                },
                {
                  q: 'What payment options are available?',
                  a: 'We offer monthly, semi-annual, and annual payment plans. Sibling discounts are also available.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
