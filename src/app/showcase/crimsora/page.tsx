import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CrimsoraBrowserFrame } from '@/components/showcase/CrimsoraBrowserFrame';

export const metadata: Metadata = {
  title: 'Client Story: Crimsora | Evelyn Learning',
  description:
    'How Crimsora delivers live 1-on-1 AI voice tutoring at consumer scale — high school core, AP, and SAT/ACT — on Evelyn Learning’s Voice Tutor engine.',
  alternates: { canonical: '/showcase/crimsora' },
};

const OFFERINGS = [
  { title: 'High school core', body: 'Algebra 1, Geometry, Biology, Chemistry, English, and World History — full courses with lessons, notes, practice, and quizzes.' },
  { title: 'AP courses', body: '9 AP courses with exam-style practice and FRQs graded on real rubrics.' },
  { title: 'SAT & ACT prep', body: 'Full SAT and ACT prep courses with timed, full-length mock exams — part of Crimsora’s 15-form mock catalog spanning SAT, ACT, and AP.' },
];

const ENGINE_POINTS = [
  { title: 'Live voice sessions', body: 'Every lesson is taught out loud by an AI teacher on an interactive whiteboard — embedded natively in Crimsora’s product.' },
  { title: 'Adaptive pedagogy', body: 'Diagnostics, per-skill mastery tracking, and gap follow-up come from the engine and drive what each student sees next.' },
  { title: 'White-label deployment', body: 'Crimsora’s own brand, courses, accounts, and billing — the Voice Tutor engine runs invisibly underneath, licensed from Evelyn Learning.' },
];

export default function CrimsoraShowcasePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="container-wide max-w-4xl mx-auto text-center">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Client story</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              How Crimsora delivers 1-on-1 voice tutoring at consumer scale
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed">
              Crimsora is a consumer learning platform for high school students. It licenses
              Evelyn Learning&rsquo;s Voice Tutor engine to teach every course live, out loud,
              on an interactive whiteboard.
            </p>
            <a
              href="https://crimsora.com"
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              See it live at crimsora.com <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* What Crimsora offers */}
        <section className="py-16 bg-white">
          <div className="container-wide max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Crimsora offers students</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {OFFERINGS.map((o) => (
                <div key={o.title} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{o.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="py-16 bg-slate-50 border-y border-slate-100">
          <div className="container-wide max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Voice Tutor, in Crimsora&rsquo;s product</h2>
            <div className="space-y-10">
              <CrimsoraBrowserFrame label="AP Macroeconomics session">
                <Image src="/showcase/crimsora/whiteboard-1.png" alt="A live Crimsora AP Macroeconomics session: the tutor walking a student through a money-market supply and demand graph on the whiteboard" width={1600} height={820} className="w-full h-auto" />
              </CrimsoraBrowserFrame>
              <CrimsoraBrowserFrame label="Biology session">
                <Image src="/showcase/crimsora/crimsora-session.png" alt="A live Crimsora Biology session: the tutor building a concept map on the whiteboard from spontaneous generation to cell theory" width={1600} height={820} className="w-full h-auto" />
              </CrimsoraBrowserFrame>
            </div>
          </div>
        </section>

        {/* How it uses Evelyn Learning */}
        <section className="py-16 bg-white">
          <div className="container-wide max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Evelyn Learning provides</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {ENGINE_POINTS.map((p) => (
                <div key={p.title} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{p.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container-wide max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bring the Voice Tutor to your product</h2>
            <p className="text-slate-600 text-lg mb-8">
              The same engine behind Crimsora is available to license — white-label, with your
              content and your brand.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Talk to us <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://crimsora.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                Try Crimsora live <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
