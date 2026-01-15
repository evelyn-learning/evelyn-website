import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Brain,
  BookOpen,
  GraduationCap,
  School,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Evelyn Learning's comprehensive educational services including AI solutions, content development, publishing, K-12, and test preparation services.",
};

const services = [
  {
    icon: Building2,
    title: "For Organizations",
    slug: "organizations",
    description:
      "Custom content solutions tailored to your organization's specific learning and training needs.",
    features: [
      "Corporate training content",
      "Employee onboarding materials",
      "Compliance training modules",
      "Custom e-learning development",
    ],
  },
  {
    icon: Brain,
    title: "AI Services",
    slug: "ai",
    description:
      "Leverage cutting-edge AI technology for content creation, assessment generation, and personalized learning experiences.",
    features: [
      "AI-powered content generation",
      "Automated assessment creation",
      "Personalized learning paths",
      "Intelligent tutoring systems",
    ],
  },
  {
    icon: BookOpen,
    title: "Publishing",
    slug: "publishing",
    description:
      "End-to-end publishing services for educational content, textbooks, and digital curriculum materials.",
    features: [
      "Textbook development",
      "Digital content publishing",
      "Editorial services",
      "Illustration and design",
    ],
  },
  {
    icon: GraduationCap,
    title: "University",
    slug: "university",
    description:
      "Higher education content solutions including courseware, assessments, and supplementary learning materials.",
    features: [
      "Course content development",
      "OER and open textbooks",
      "Lab manuals and guides",
      "Research support materials",
    ],
  },
  {
    icon: School,
    title: "K-12 Solutions",
    slug: "k12",
    description:
      "Comprehensive K-12 educational content aligned with curriculum standards and designed for student success.",
    features: [
      "Standards-aligned content",
      "Interactive worksheets",
      "Assessment banks",
      "Teacher resources",
    ],
  },
  {
    icon: FileText,
    title: "Test Preparation",
    slug: "test-prep",
    description:
      "High-quality test preparation content for standardized tests, competitive exams, and certifications.",
    features: [
      "Practice tests and questions",
      "Study guides and materials",
      "Performance analytics",
      "Adaptive learning paths",
    ],
  },
];

export default function ServicesPage() {
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
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1">Our Services</h1>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive educational content solutions designed to meet the
              diverse needs of modern learners, institutions, and organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <service.icon className="h-7 w-7" />
                </div>

                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  {service.title}
                </h2>
                <p className="mt-3 text-gray-600">{service.description}</p>

                <ul className="mt-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary-500 hover:underline"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Our Process</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We follow a proven methodology to deliver high-quality educational
              content that meets your specific requirements.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "Understanding your needs, audience, and learning objectives.",
              },
              {
                step: "02",
                title: "Planning",
                description:
                  "Creating a detailed content strategy and project roadmap.",
              },
              {
                step: "03",
                title: "Development",
                description:
                  "Expert content creation with rigorous quality checks.",
              },
              {
                step: "04",
                title: "Delivery",
                description:
                  "Final review, deployment, and ongoing support.",
              },
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                  {phase.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Contact us to discuss your educational content needs and discover
            how we can help you achieve your goals.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
          >
            Request a Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
