import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart,
  BookOpen,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Test Preparation",
  description:
    "High-quality test preparation content for standardized tests, competitive exams, and professional certifications.",
};

const features = [
  {
    icon: Target,
    title: "Practice Tests",
    description:
      "Comprehensive practice tests that mirror real exam formats, difficulty levels, and time constraints.",
  },
  {
    icon: BookOpen,
    title: "Study Guides",
    description:
      "In-depth study materials covering all test topics with clear explanations and examples.",
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description:
      "Detailed performance tracking and analytics to identify strengths and areas for improvement.",
  },
  {
    icon: Award,
    title: "Adaptive Learning",
    description:
      "Personalized learning paths that adapt to individual student progress and needs.",
  },
];

const exams = [
  "SAT / ACT",
  "GRE / GMAT",
  "LSAT / MCAT",
  "AP Exams",
  "State Assessments",
  "Professional Certifications",
  "TOEFL / IELTS",
  "K-12 Standardized Tests",
];

export default function TestPrepPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <FileText className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">Test Preparation</h1>
              <p className="mt-4 text-lg text-gray-600">
                High-quality test preparation content for standardized tests,
                competitive exams, and professional certifications. Help your
                students achieve their target scores.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Create Test Prep Content
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 p-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Exams We Cover
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {exams.map((exam) => (
                  <div key={exam} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary-500" />
                    <span className="text-sm text-gray-700">{exam}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Test Prep Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive test preparation solutions designed to maximize
              student success.
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
            Help Students Achieve Their Goals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Partner with us to create effective test preparation content that
            drives results.
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
