'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ExternalLink, FileUp, ListChecks, Mic, Play, Rocket } from 'lucide-react';
import { FAQ } from '@/components/ui/FAQ';
import { productFAQs } from '@/data/faqs/products';
import { DemoTracker } from '@/components/demos/DemoTracker';

const AcademyPlatformDemo = dynamic(() => import('@/components/demos/AcademyPlatformDemo'), {
  ssr: false,
  loading: () => <div className="h-[640px] bg-slate-100 rounded-2xl animate-pulse" />,
});

/**
 * Video walkthrough (spec 2026-09-16 §7). null until the asset ships in
 * public/videos — the section and the hero CTA render only when it is set,
 * so the page never points at a missing file.
 */
const ACADEMY_TOUR_VIDEO: { src: string; poster: string; label: string } | null = null;

function ProductHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-700 via-violet-700 to-indigo-800">
      <div className="container-wide">
        <div className="max-w-4xl">
          <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-8">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">Evelyn Academy</span>
          </nav>

          <div className="flex items-start gap-6">
            <span className="text-6xl hidden sm:block">🏫</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Evelyn Academy</h1>
              <p className="text-xl text-indigo-100 mb-6">
                Your own branded AI learning platform — with a voice tutor teaching every lesson. Courses, practice, mock exams,
                progress tracking and reports in one academy, under your name, built from your syllabus.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#demo" className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition">
                  Try the Demo
                </a>
                {ACADEMY_TOUR_VIDEO && (
                  <a href="#tour" className="px-6 py-3 bg-white/10 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/20 transition">
                    Watch the {ACADEMY_TOUR_VIDEO.label} Tour
                  </a>
                )}
                <Link
                  href="/contact?product=academy"
                  className="px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition"
                >
                  Talk to Us
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
    { value: 'Your brand', label: 'Name, domain & colours', icon: '🏷️' },
    { value: 'Voice tutor', label: 'In every lesson', icon: '🎙️' },
    { value: 'Your syllabus', label: 'Courses built from it', icon: '📚' },
    { value: 'Live today', label: 'On two platforms', icon: '✅' },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
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

function ComparisonSection() {
  const rows = [
    {
      topic: 'How learners learn',
      video: 'Watch a recording. Nothing checks whether it landed.',
      academy: 'Talk with a tutor that explains, asks, listens and adapts — every lesson is a conversation.',
    },
    {
      topic: 'Pace and gaps',
      video: 'One pace for everyone. A learner who is lost stays lost.',
      academy: 'Each learner moves at their own pace; the platform tracks what is mastered and where they are stuck.',
    },
    {
      topic: 'Practice',
      video: 'A quiz at the end, the same for all.',
      academy: 'The tutor assigns follow-up practice from what happened in the session, and reviews it next time.',
    },
    {
      topic: 'What you can see',
      video: 'Completion percentages.',
      academy: 'Time spent, objectives mastered, open gaps, and a replay of any session.',
    },
    {
      topic: 'Updating content',
      video: 'Re-script, re-shoot, re-edit.',
      academy: 'Edit the lesson plan. The tutor teaches the new version the same day.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Why Not Just Make Video Courses?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Video e-learning made courses scalable, but it made them passive. A voice-tutor academy keeps the scale and brings
            back the teacher.
          </p>
        </div>
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full text-sm min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-1/5 p-3" />
                <th className="w-2/5 p-3 text-left font-semibold text-slate-500 bg-slate-50 rounded-tl-xl">Video-based course</th>
                <th className="w-2/5 p-3 text-left font-semibold text-white bg-indigo-600 rounded-tr-xl">Voice-tutor academy</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.topic}>
                  <td className="p-3 font-semibold text-slate-900 border-t border-slate-100 align-top">{row.topic}</td>
                  <td className="p-3 text-slate-600 bg-slate-50 border-t border-slate-100 align-top">{row.video}</td>
                  <td className="p-3 text-slate-800 bg-indigo-50 border-t border-indigo-100 align-top">{row.academy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have videos? They can sit alongside the tutor-led lessons where they add value.
        </p>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-slate-50 scroll-mt-16">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Interactive Demo
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Step Inside the Academy</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This is your academy, under your brand. Look around as a student, a parent and an admin — then click{' '}
            <span className="font-medium text-slate-900">Study</span> on any lesson to talk to the real tutor.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <DemoTracker productId="academy" productTitle="Evelyn Academy">
            <AcademyPlatformDemo />
          </DemoTracker>
        </div>
      </div>
    </section>
  );
}

function TourSection() {
  const [playing, setPlaying] = useState(false);
  if (!ACADEMY_TOUR_VIDEO) return null;
  const video = ACADEMY_TOUR_VIDEO;

  return (
    <section id="tour" className="py-16 bg-white scroll-mt-16">
      <div className="container-wide">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">The {video.label} Tour</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Real product footage, start to finish — sound on.</p>
        </div>
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate-900 aspect-video">
          {playing ? (
            <video src={video.src} poster={video.poster} controls autoPlay playsInline className="w-full h-full" />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play the Evelyn Academy tour"
              className="group relative w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${video.poster})` }}
            >
              <span className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                  <Play className="w-8 h-8 text-indigo-700 ml-1" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Live implementations. Guardrail (same as the voice-tutor page / the
 * 2026-08-04 cross-promotion spec): FACTUAL copy only — what each site is
 * and that it runs on the platform. No metrics, no quotes, no claims on
 * their behalf.
 */
function LiveImplementationsSection() {
  const sites = [
    {
      href: 'https://www.crimsora.com',
      domain: 'crimsora.com',
      name: 'Crimsora',
      description:
        'A structured learning academy running on Evelyn Academy — full courses with lessons, practice, quizzes and mock exams, with the voice tutor teaching every lesson.',
    },
    {
      href: 'https://www.evelyntutor.com',
      domain: 'evelyntutor.com',
      name: 'Evelyn Tutor',
      description:
        'Our direct-to-student tutoring platform on the same codebase, configured differently — learners bring any topic and the voice tutor teaches it live.',
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Already Live Under Two Brands</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            One platform, two very different products — which is exactly what white-label is supposed to mean.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {sites.map((site) => (
            <a
              key={site.domain}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{site.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
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
  const groups = [
    {
      role: 'For learners',
      icon: '🎓',
      items: [
        'A course workspace: lessons, practice & quizzes, mock exams, notes',
        'A live voice tutor with a whiteboard in every lesson',
        'Homework the tutor assigns from what happened in the session',
        'Timed mock exams with score reports and tutor-led review',
        'Session notes and a printable revision sheet',
        'Mastery by objective, spaced review and session replays',
      ],
    },
    {
      role: 'For parents & sponsors',
      icon: '👨‍👩‍👧',
      items: [
        'A weekly progress email written from the learner’s real sessions',
        'Time spent, lessons covered, what was mastered, what is still open',
        'Mock exam score reports by email',
        'One-click unsubscribe and per-learner settings',
      ],
    },
    {
      role: 'For your team',
      icon: '🛠️',
      items: [
        'Learner dashboard: sign-up source, engagement stage, sessions and hours',
        'Replay of any session — whiteboard and audio',
        'Manage courses, tutor personas and voices',
        'Plans, trials, fair-use minutes and billing',
        'Referral and campus codes',
      ],
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">What Is Inside Evelyn Academy?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {groups.map((group) => (
            <div key={group.role} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <span className="text-3xl mb-3 block">{group.icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{group.role}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SyllabusSection() {
  const steps = [
    { icon: FileUp, title: 'Share your syllabus', description: 'A course outline, handbook or module list — whatever you teach from today.' },
    { icon: ListChecks, title: 'Review the structure', description: 'It becomes units and learning objectives. You rename, reorder and approve.' },
    { icon: Mic, title: 'The tutor learns to teach it', description: 'Each objective gets a lesson plan, practice questions and notes the tutor works from.' },
    { icon: Rocket, title: 'Launch under your brand', description: 'Your name, your domain, your colours — your learners never see ours.' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bring Your Syllabus</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            School subjects, test prep, or professional courses like business communication and management — if it can be broken
            into learning objectives, the tutor can teach it.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.title} className="p-6 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <step.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-slate-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          A self-serve course builder that drafts the structure from an uploaded outline is available on request.
        </p>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = productFAQs['academy'] || [];
  return (
    <FAQ
      items={faqs}
      title="Evelyn Academy FAQ"
      description="Common questions about the white-label AI learning platform, how it compares to video e-learning, and how courses are built"
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-700 to-violet-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Own Academy?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Tell us what you teach. We&apos;ll show you your courses running with a voice tutor — and can set up a sandbox for your
            team to evaluate.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact?product=academy&demo=true" className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-slate-100 transition">
              Book a Call
            </Link>
            <Link href="/contact?product=academy" className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Get Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedProductsSection() {
  const related = [
    { title: 'AI Voice Tutor', href: '/products/voice-tutor', icon: '🎙️' },
    { title: 'Course Creator Studio', href: '/products/course-creator-studio', icon: '🎬' },
    { title: 'Analytics Dashboard', href: '/products/analytics-dashboard', icon: '📊' },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Related Products</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {related.map((product) => (
            <Link key={product.href} href={product.href} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow">
              <span className="text-3xl">{product.icon}</span>
              <span className="font-medium text-slate-900">{product.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AcademyProductPage() {
  return (
    <main className="pt-16">
      <ProductHero />
      <MetricsSection />
      <ComparisonSection />
      <DemoSection />
      <TourSection />
      <LiveImplementationsSection />
      <FeaturesSection />
      <SyllabusSection />
      <FAQSection />
      <CTASection />
      <RelatedProductsSection />
    </main>
  );
}
