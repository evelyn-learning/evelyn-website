import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Users,
  Code,
  GraduationCap,
  Cpu,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | AI-Powered Learning Company",
  description:
    "Learn about Evelyn Learning - 10+ years building adaptive learning platforms, intelligent tutoring systems, and AI-powered learning solutions. 300+ educators and engineers creating personalized learning experiences for 500+ clients worldwide.",
  keywords: [
    'AI-Powered Learning Company',
    'EdTech Company',
    'Adaptive Learning Provider',
    'Intelligent Tutoring Systems',
    'Educational AI Development',
    'Learning Analytics Company',
    'Personalized Learning Solutions',
  ],
};

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for excellence in every piece of content we create, ensuring accuracy and pedagogical effectiveness.",
  },
  {
    icon: Eye,
    title: "Innovation",
    description:
      "We embrace cutting-edge technologies including AI to deliver modern, engaging learning experiences.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "We maintain the highest ethical standards in all our partnerships and content development practices.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with our clients, understanding their unique needs to deliver tailored solutions.",
  },
];

const milestones = [
  { year: "2013", event: "Evelyn Learning founded" },
  { year: "2015", event: "Expanded services to US educational publishers" },
  { year: "2017", event: "Launched digital content development division" },
  { year: "2019", event: "Opened San Francisco office" },
  { year: "2022", event: "Introduced AI-powered content solutions" },
  { year: "2024", event: "Serving 500+ clients across 50+ countries" },
  { year: "2026", event: "Named to TIME's Top EdTech Companies of 2026" },
];

const teamStrengths = [
  {
    icon: GraduationCap,
    title: "Educators First",
    description:
      "Every team member has classroom experience. Teaching is a prerequisite for joining Evelyn—we believe you can't build great education tools without having taught.",
  },
  {
    icon: Code,
    title: "Technical Depth",
    description:
      "Our educators aren't just subject matter experts—many are also proficient in technology, data, and AI. This dual fluency is rare and powerful.",
  },
  {
    icon: Cpu,
    title: "AI Engineering Excellence",
    description:
      "Our engineering team specializes in AI/ML for education, building intelligent systems that understand pedagogy, not just patterns.",
  },
  {
    icon: BookOpen,
    title: "Content Mastery",
    description:
      "With millions of content items developed, we understand curriculum design, assessment creation, and learning science at scale.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/site/hero-education.jpg"
            alt="Educational technology background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/80" />
        </div>

        <div className="container-wide relative py-16 md:py-20">
          <div className="max-w-3xl">
            <Link
              href="/press/time-top-edtech-2026"
              className="group inline-flex items-center gap-2 mb-6 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                New
              </span>
              <span>
                Recognized by TIME as a Top EdTech Company of 2026
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <h1 className="heading-1">About Evelyn Learning</h1>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;re a team of 300+ educators and engineers building adaptive learning platforms
              and intelligent tutoring systems that deliver personalized learning at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary-100 bg-primary-50 p-8">
              <Target className="h-12 w-12 text-primary-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-700">
                To empower educational institutions, publishers, and
                organizations with innovative AI solutions and content that enhance
                learning outcomes and make quality education accessible to all.
              </p>
            </div>

            <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-8">
              <Eye className="h-12 w-12 text-secondary-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Our Vision
              </h2>
              <p className="mt-4 text-gray-700">
                To be the partner of choice for education companies seeking AI transformation—
                recognized for our unique combination of pedagogical expertise and technical innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-2">Our Story</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Founded in 2013, Evelyn Learning began with a simple observation:
                  the best educational technology is built by people who understand
                  both education AND technology deeply.
                </p>
                <p>
                  We started as a content development company, building curriculum
                  and assessments for publishers and test prep companies. This gave
                  us deep expertise in what makes learning work.
                </p>
                <p>
                  When AI emerged as a transformative force, we were uniquely positioned
                  to build intelligent education tools—because our team already spoke
                  both languages: pedagogy and technology.
                </p>
                <p>
                  Today, we combine content development services with AI-powered products,
                  serving education companies worldwide who want to harness AI without
                  losing the human expertise that makes education effective.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-primary-500">
                        {milestone.year}
                      </span>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team - What Makes Us Different */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-2">What Makes Our Team Unique</h2>
            <p className="mt-4 text-gray-600">
              We&apos;re not just a tech company that works in education, and we&apos;re not
              just educators dabbling in technology. We&apos;re both—and that combination
              is what makes Evelyn different.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {teamStrengths.map((strength) => (
              <div
                key={strength.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <strength.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {strength.title}
                </h3>
                <p className="mt-3 text-gray-600">{strength.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">The Evelyn Advantage</h3>
              <p className="text-primary-100 leading-relaxed">
                When you work with Evelyn, you get a team that can discuss Bloom&apos;s taxonomy
                and neural networks in the same conversation. Our content experts understand
                API integration. Our engineers understand cognitive load theory. This cross-functional
                fluency means we build AI tools that actually work for educators—because we are educators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Our Core Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              These principles guide everything we do, from how we develop
              content to how we build relationships with our clients.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-500 py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10+</div>
              <div className="mt-1 text-primary-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="mt-1 text-primary-100">Clients Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">1M+</div>
              <div className="mt-1 text-primary-100">Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="mt-1 text-primary-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide text-center">
          <h2 className="heading-2">Ready to Work With Us?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Whether you need AI-powered products, content development services, or
            a custom solution—let&apos;s talk about how we can help.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
