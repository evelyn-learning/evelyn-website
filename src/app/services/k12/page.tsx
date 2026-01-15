import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  School,
  CheckCircle2,
  ArrowRight,
  ClipboardCheck,
  BookMarked,
  Users,
  Puzzle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "K-12 Solutions",
  description:
    "Comprehensive K-12 educational content aligned with curriculum standards and designed for student success.",
};

const features = [
  {
    icon: BookMarked,
    title: "Standards-Aligned Content",
    description:
      "Curriculum materials aligned with Common Core, NGSS, state standards, and international frameworks.",
  },
  {
    icon: Puzzle,
    title: "Interactive Worksheets",
    description:
      "Engaging, interactive worksheets and activities designed to reinforce learning concepts.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment Banks",
    description:
      "Comprehensive assessment item banks for formative and summative evaluations.",
  },
  {
    icon: Users,
    title: "Teacher Resources",
    description:
      "Lesson plans, teaching guides, and professional development materials for educators.",
  },
];

const benefits = [
  "Grade-appropriate content",
  "Standards alignment verified",
  "Differentiated instruction support",
  "Multi-modal learning resources",
  "Progress monitoring tools",
  "Parent communication materials",
];

export default function K12Page() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <School className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">K-12 Solutions</h1>
              <p className="mt-4 text-lg text-gray-600">
                Comprehensive K-12 educational content aligned with curriculum
                standards and designed for student success. From kindergarten
                through high school.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Explore K-12 Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/site/k12-service.webp"
                alt="K-12 Education Solutions"
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
            <h2 className="heading-2">K-12 Content Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Age-appropriate, engaging content that supports diverse learning
              needs across all grade levels.
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
            Empower Your K-12 Students
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Partner with us to develop engaging, standards-aligned content for
            your school or district.
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
