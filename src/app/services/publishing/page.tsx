import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  FileText,
  Palette,
  Globe,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Publishing Services",
  description:
    "End-to-end publishing services for educational content, textbooks, and digital curriculum materials.",
};

const features = [
  {
    icon: FileText,
    title: "Textbook Development",
    description:
      "Complete textbook creation from concept to publication, including writing, editing, and design.",
  },
  {
    icon: Layers,
    title: "Digital Content Publishing",
    description:
      "Transform traditional content into engaging digital formats optimized for modern learning platforms.",
  },
  {
    icon: Palette,
    title: "Editorial & Design",
    description:
      "Professional editing, proofreading, illustration, and layout design services.",
  },
  {
    icon: Globe,
    title: "Multi-format Delivery",
    description:
      "Publish across print, ebook, web, and mobile platforms with consistent quality.",
  },
];

const benefits = [
  "Expert subject matter writers",
  "Standards-aligned content",
  "Professional editorial review",
  "Custom illustration and design",
  "Accessibility compliance",
  "Multi-platform publishing",
];

export default function PublishingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <BookOpen className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">Publishing Services</h1>
              <p className="mt-4 text-lg text-gray-600">
                End-to-end publishing services for educational content,
                textbooks, and digital curriculum materials. From manuscript to
                market-ready publication.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Discuss Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/site/lesson-types.webp"
                alt="Educational Publishing Services"
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
            <h2 className="heading-2">Publishing Capabilities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive publishing solutions for educational content across
              all formats.
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
            Ready to Publish Your Educational Content?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Partner with us to bring your educational vision to life with
            professional publishing services.
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
