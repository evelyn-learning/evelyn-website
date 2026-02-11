'use client';

import { useState, useEffect, useContext } from 'react';
import { Clock, Phone, Mail, Sparkles, ChevronDown, ChevronUp, ExternalLink, XCircle, AlertTriangle } from 'lucide-react';
import { SiteContext } from '@/app/showcase/[slug]/ShowcaseLayoutClient';

interface EvelynSettings {
  contactEmail: string;
  contactPhone: string;
}

interface DemoBannerProps {
  trialExpiresAt?: Date;
}

export function DemoBanner({ trialExpiresAt }: DemoBannerProps) {
  const site = useContext(SiteContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [evelynSettings, setEvelynSettings] = useState<EvelynSettings>({
    contactEmail: 'info@evelynlearning.com',
    contactPhone: '+1 (302) 212-0975',
  });

  // Fetch Evelyn's contact info from SiteSettings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.contactEmail || data.contactPhone) {
          setEvelynSettings({
            contactEmail: data.contactEmail || evelynSettings.contactEmail,
            contactPhone: data.contactPhone || evelynSettings.contactPhone,
          });
        }
      })
      .catch(() => {
        // Use defaults if fetch fails
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!site) return null;

  // Calculate days remaining
  const daysRemaining = trialExpiresAt
    ? Math.max(0, Math.ceil((trialExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 14; // Default 14 days

  const isUrgent = daysRemaining <= 3;

  // Build contact page URL with subject
  const contactSubject = encodeURIComponent(`Launch My Website - ${site.businessName}`);
  const evelynContactUrl = `https://evelynlearning.com/contact?subject=${contactSubject}`;

  // Track activity in the database
  const trackActivity = async (action: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch(`/api/showcase/${site.slug}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata }),
      });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  };

  const handleDeclineOffer = async () => {
    setIsDeclining(true);
    try {
      const res = await fetch(`/api/showcase/${site.slug}/decline`, {
        method: 'POST',
      });

      if (res.ok) {
        await trackActivity('declined');
        setIsDeclined(true);
        setShowDeclineModal(false);
      }
    } catch (error) {
      console.error('Failed to decline offer:', error);
    } finally {
      setIsDeclining(false);
    }
  };

  const handleKeepDemo = () => {
    trackActivity('keep_demo');
    setShowDeclineModal(false);
  };

  const handleExpandBanner = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (newExpanded) {
      trackActivity('expanded_banner');
    }
  };

  const handleContactClick = () => {
    trackActivity('clicked_contact');
  };

  const handleScheduleClick = () => {
    trackActivity('clicked_schedule');
  };

  // Show declined message if offer was declined
  if (isDeclined) {
    return (
      <div className="sticky top-0 z-[60]">
        <div className="py-3 px-4 text-sm bg-gray-800 text-white text-center">
          <p>
            Thank you for your time. This demo has been removed.
            If you change your mind, feel free to{' '}
            <a
              href={evelynContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              contact us
            </a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[60]">
        {/* Main Banner - Always Visible */}
        <div
          className={`py-2 px-4 text-sm ${
            isUrgent
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
          } text-white`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Trial Info */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">Demo Site for {site.businessName}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-white/80">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isUrgent ? (
                    <span className="font-bold text-amber-300">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left!</span>
                  ) : (
                    <span>{daysRemaining} days remaining</span>
                  )}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExpandBanner}
                className="hidden sm:flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition text-xs font-medium"
              >
                {isExpanded ? 'Less' : 'Get Started'}
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <a
                href={evelynContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactClick}
                data-tour="contact-button"
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition text-xs font-semibold"
              >
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">Contact Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="bg-gray-900 text-white py-6 px-4 border-t border-gray-700">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {/* What You're Seeing */}
                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    What You&apos;re Seeing
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This is a custom demo website we&apos;ve built for <strong>{site.businessName}</strong>.
                    It shows how your business could look with a modern, AI-powered website hosted on your own domain.
                  </p>
                </div>

                {/* What's Included */}
                <div>
                  <h3 className="font-semibold text-white mb-2">What You&apos;ll Get</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Your own branded website on your domain
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      AI chat widget trained on your content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Staff portal for managing content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Analytics & conversation insights
                    </li>
                  </ul>
                </div>

                {/* Ready to Launch? */}
                <div>
                  <h3 className="font-semibold text-white mb-2">Ready to Launch?</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Let&apos;s discuss launching this on your own domain.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${evelynSettings.contactPhone}`}
                      className="flex items-center gap-2 text-sm text-white hover:text-purple-300 transition"
                    >
                      <Phone className="w-4 h-4" />
                      {evelynSettings.contactPhone}
                    </a>
                    <a
                      href={`mailto:${evelynSettings.contactEmail}?subject=Launch My Website - ${site.businessName}`}
                      className="flex items-center gap-2 text-sm text-white hover:text-purple-300 transition"
                    >
                      <Mail className="w-4 h-4" />
                      {evelynSettings.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-gray-400 text-sm">
                    This demo expires in <strong className="text-white">{daysRemaining} days</strong>.
                    Contact us to launch your website!
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 font-medium rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Not Interested
                  </button>
                  <a
                    href={evelynContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleScheduleClick}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition text-sm"
                  >
                    Schedule a Call
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Decline This Offer?</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to decline this demo? This will remove your demo website and mark you as not interested.
                If you change your mind later, you can always reach out to us.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleKeepDemo}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Keep Demo
                </button>
                <button
                  onClick={handleDeclineOffer}
                  disabled={isDeclining}
                  className="flex-1 px-4 py-2.5 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {isDeclining ? 'Processing...' : 'Yes, Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
