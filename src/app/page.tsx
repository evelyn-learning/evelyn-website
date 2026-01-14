import Link from "next/link";
import {
  BookOpen,
  Brain,
  GraduationCap,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "For Organizations",
    description:
      "Custom content solutions tailored to your organization's specific learning needs.",
    href: "/services/organizations",
  },
  {
    icon: Brain,
    title: "AI Services",
    description:
      "Leverage AI for content creation, assessment generation, and personalized learning.",
    href: "/services/ai",
  },
  {
    icon: BookOpen,
    title: "Publishing",
    description:
      "End-to-end publishing services for educational content and curriculum materials.",
    href: "/services/publishing",
  },
  {
    icon: GraduationCap,
    title: "K-12 Solutions",
    description:
      "Comprehensive K-12 educational content aligned with curriculum standards.",
    href: "/services/k12",
  },
];

const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "500+", label: "Clients Served" },
  { value: "1M+", label: "Content Items" },
  { value: "50+", label: "Countries Reached" },
];

const features = [
  "Curriculum-aligned content development",
  "AI-powered learning solutions",
  "Assessment and test preparation",
  "Interactive multimedia content",
  "Accessibility compliant materials",
  "Multi-language localization",
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="heading-1">
              Transforming Education Through{" "}
              <span className="text-primary-500">Innovative Content</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Evelyn Learning empowers educational institutions, publishers, and
              organizations with comprehensive content solutions, AI-powered
              learning experiences, and expert curriculum development.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Request a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-primary-100 opacity-50 blur-3xl" />
        <div className="absolute -left-1/4 -top-1/2 h-96 w-96 rounded-full bg-secondary-100 opacity-50 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary-500 md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Our Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive educational solutions designed to meet the diverse
              needs of modern learners and institutions.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-500">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-2">The Evelyn Advantage</h2>
              <p className="mt-4 text-gray-600">
                With over two decades of experience in educational content
                development, we bring unparalleled expertise and innovation to
                every project.
              </p>

              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/about" className="btn-primary mt-8">
                Learn More About Us
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
                {/* Placeholder for image or video */}
                <div className="flex h-full items-center justify-center">
                  <Users className="h-24 w-24 text-primary-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Educational Content?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Let&apos;s discuss how Evelyn Learning can help you achieve your
            educational goals with innovative content solutions.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Resources Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <h2 className="heading-2">Latest Resources</h2>
            <Link
              href="/blog"
              className="hidden items-center text-sm font-medium text-primary-500 hover:underline sm:flex"
            >
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {/* Placeholder for blog posts - will be dynamic */}
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
              >
                <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50" />
                <div className="p-6">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
                    Education
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-500">
                    Sample Blog Post Title
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>5 min read</span>
                    <span>Jan 14, 2026</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-primary-500"
            >
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
