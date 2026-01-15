import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FlaskConical,
  FileText,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "University Solutions",
  description:
    "Higher education content solutions including courseware, assessments, and supplementary learning materials.",
};

const features = [
  {
    icon: BookOpen,
    title: "Course Content Development",
    description:
      "Comprehensive courseware development aligned with learning outcomes and accreditation requirements.",
  },
  {
    icon: FlaskConical,
    title: "Lab Manuals & Guides",
    description:
      "Detailed laboratory manuals, practical guides, and hands-on learning materials.",
  },
  {
    icon: FileText,
    title: "OER & Open Textbooks",
    description:
      "Development and adaptation of Open Educational Resources for cost-effective learning.",
  },
  {
    icon: Lightbulb,
    title: "Research Support",
    description:
      "Academic writing support, literature reviews, and research methodology materials.",
  },
];

const benefits = [
  "Discipline-specific expertise",
  "Accreditation-aligned content",
  "Peer-reviewed quality",
  "Interactive digital components",
  "Accessibility compliant",
  "LMS-ready formats",
];

export default function UniversityPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">University Solutions</h1>
              <p className="mt-4 text-lg text-gray-600">
                Higher education content solutions designed to enhance teaching
                effectiveness and student learning outcomes. From courseware to
                research support materials.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Partner With Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/site/university-service.webp"
                alt="University Education Solutions"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Higher Education Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive solutions for universities and colleges across all
              disciplines.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-white p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">
            Elevate Your Institution's Learning Experience
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Partner with us to develop world-class educational content for your
            university.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
