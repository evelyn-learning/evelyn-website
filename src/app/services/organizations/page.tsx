import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Target,
  Users,
  BarChart,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Organizations",
  description:
    "Custom content solutions tailored to your organization's specific learning and training needs. Corporate training, employee onboarding, and compliance modules.",
};

const features = [
  {
    icon: Target,
    title: "Custom Training Programs",
    description:
      "Tailored learning content designed specifically for your organizational goals and industry requirements.",
  },
  {
    icon: Users,
    title: "Employee Onboarding",
    description:
      "Comprehensive onboarding materials that help new hires get up to speed quickly and effectively.",
  },
  {
    icon: BarChart,
    title: "Compliance Training",
    description:
      "Industry-specific compliance modules that meet regulatory requirements and keep your team informed.",
  },
  {
    icon: BookOpen,
    title: "Skills Development",
    description:
      "Upskilling and reskilling content to help your workforce adapt to evolving industry demands.",
  },
];

const benefits = [
  "Reduced training time and costs",
  "Improved employee engagement and retention",
  "Consistent learning experience across teams",
  "Measurable learning outcomes",
  "Scalable solutions for growing organizations",
  "Mobile-friendly content access",
];

export default function OrganizationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <Building2 className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">For Organizations</h1>
              <p className="mt-4 text-lg text-gray-600">
                Custom content solutions tailored to your organization's
                specific learning and training needs. We help you build a
                knowledgeable, skilled, and compliant workforce.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Request a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/site/organizations-courses.png"
                alt="Corporate Training Solutions"
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
            <h2 className="heading-2">What We Offer</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Comprehensive organizational learning solutions designed to meet
              your unique business needs.
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
            Ready to Transform Your Organization's Learning?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Let us discuss how we can help you create effective training
            programs that drive results.
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
