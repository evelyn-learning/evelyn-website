'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { Mic, MessageSquare, Upload, Pencil, ExternalLink } from 'lucide-react';

const VoiceTutorLiveDemo = dynamic(
  () => import('@/components/demos/VoiceTutorLiveDemo'),
  { ssr: false, loading: () => <div className="h-[420px] bg-gray-100 rounded-2xl animate-pulse" /> }
);

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">AI Voice Tutor</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🎙️</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AI Voice Tutor
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Voice tutor AI that provides 24/7 student support with real-time spoken explanations and a visual whiteboard. Students speak naturally and receive step-by-step guidance while equations and diagrams appear on screen.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#demo" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition">
                  Try Live Demo
                </a>
                <Link href="/contact?product=voice-tutor" className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
                  Get Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  const metrics = [
    { value: 'Voice + Text', label: 'Dual input modes', icon: '🎤' },
    { value: 'Real-time', label: 'Whiteboard visuals', icon: '📐' },
    { value: 'Photo Upload', label: 'Homework support', icon: '📸' },
    { value: 'STEM Ready', label: 'Physics, Math & more', icon: '🔬' }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <span className="text-3xl mb-2 block">{metric.icon}</span>
              <div className="text-xl font-bold text-slate-900">{metric.value}</div>
              <div className="text-sm text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Try the AI Voice Tutor</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            Pick a lesson and start talking — this is the real tutor, not a video. Just your name and email, ~2 minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Live demo — real embed behind a click-to-start cover */}
          <VoiceTutorLiveDemo />

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Voice Mode</h4>
                <p className="text-sm text-slate-600">Speak naturally and hear responses. Just like talking to a real tutor.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Text Mode</h4>
                <p className="text-sm text-slate-600">Type your questions if you prefer text-based interaction.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Pencil className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Visual Whiteboard</h4>
                <p className="text-sm text-slate-600">See equations, graphs, and diagrams as the tutor explains.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Homework Upload</h4>
                <p className="text-sm text-slate-600">Take a photo of your homework for guided help.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Live implementations of the tutor engine (2026-08-29). Guardrail (same as
 * CrimsoraClientStory / the 2026-08-04 cross-promotion spec): FACTUAL copy
 * only — what each site is and that the tutor runs there. No metrics, no
 * quotes, no claims on their behalf.
 */
function LiveImplementationsSection() {
  const sites = [
    {
      href: 'https://www.evelyntutor.com',
      domain: 'evelyntutor.com',
      name: 'Evelyn Tutor',
      description:
        'Our direct-to-student tutoring platform. The AI Voice Tutor teaches live sessions on any topic a student brings — try it and sign up there.',
    },
    {
      href: 'https://www.crimsora.com',
      domain: 'crimsora.com',
      name: 'Crimsora',
      description:
        'A structured learning academy built on the same engine — full courses with lesson plans, practice, and the voice tutor teaching every lesson.',
    },
  ];
  return (
    <section className="py-16">
      <div className="container-wide">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">See It Live in Production</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            The same tutor engine already powers two live products. Try it in action — and sign up if it fits your needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {sites.map((site) => (
            <a
              key={site.domain}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{site.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  <ExternalLink className="w-3 h-3" />
                  Visit Site
                </span>
              </div>
              <p className="text-sm text-slate-600 flex-1">{site.description}</p>
              <p className="text-xs text-slate-400 mt-4">{site.domain}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Natural Voice Conversations', description: 'Speak to the tutor just like talking to a real teacher', icon: '🎤' },
    { title: 'Visual Whiteboard', description: 'Equations, graphs, and diagrams appear in real-time', icon: '📐' },
    { title: 'Homework Photo Upload', description: 'Snap a picture of problems for guided assistance', icon: '📸' },
    { title: 'Step-by-Step Guidance', description: 'Socratic method teaching, not just answers', icon: '📋' },
    { title: 'Multiple Topics', description: 'Physics, math, and expanding STEM coverage', icon: '🔬' },
    { title: 'White-Label Ready', description: 'Your branding, your platform, your curriculum', icon: '🏷️' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How Does an AI Voice Tutor Help Students Learn?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors">
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: 1, title: 'Choose Your Topic', description: 'Select from available physics topics or request custom subjects for your curriculum.' },
    { step: 2, title: 'Select Your Mode', description: 'Use voice chat for natural conversation or text chat for typing-based interaction.' },
    { step: 3, title: 'Start Learning', description: 'Ask questions, work through problems, and see visual explanations on the whiteboard.' },
    { step: 4, title: 'Upload Homework', description: 'Take a photo of your homework and get guided step-by-step help.' },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How Does AI Voice Tutoring Work?</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = productFAQs['voice-tutor'] || [];
  return (
    <FAQ
      items={faqs}
      title="AI Voice Tutor FAQ"
      description="Common questions about voice tutor AI, how it compares to traditional tutoring, and what subjects it supports"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Tutoring?</h2>
          <p className="text-xl text-blue-100 mb-8">Let&apos;s discuss how the AI Voice Tutor can scale personalized instruction for your students.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact?product=voice-tutor" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-100 transition">
              Get Pricing
            </Link>
            <Link href="/contact?product=voice-tutor&demo=true" className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Book Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedProductsSection() {
  const related = [
    { title: '24/7 Homework Helper', href: '/products/homework-bot', icon: '🤖' },
    { title: 'AI Math Solver', href: '/products/math-solver', icon: '🔢' },
    { title: 'Tutoring Co-Pilot', href: '/products/tutor-copilot', icon: '👨‍🏫' }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Related Products</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product, idx) => (
            <Link key={idx} href={product.href} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow">
              <span className="text-3xl">{product.icon}</span>
              <span className="font-medium text-slate-900">{product.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function VoiceTutorProductPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <DemoSection />
      <LiveImplementationsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
