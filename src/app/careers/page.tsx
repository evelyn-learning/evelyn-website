import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Zap,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Evelyn Learning team. Explore career opportunities in educational content development, AI, and learning technology.",
};

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness programs",
  },
  {
    icon: Zap,
    title: "Flexible Work",
    description: "Remote-friendly culture with flexible working hours",
  },
  {
    icon: GraduationCap,
    title: "Learning & Growth",
    description: "Professional development budget and learning opportunities",
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Work with passionate educators and technologists",
  },
];

const openings = [
  {
    title: "Senior Content Developer",
    department: "Content",
    location: "Remote / Bay Area",
    type: "Full-time",
    description:
      "Create engaging educational content for K-12 and higher education markets.",
  },
  {
    title: "AI/ML Engineer",
    department: "Technology",
    location: "Remote / Bay Area",
    type: "Full-time",
    description:
      "Build AI-powered learning solutions and content generation tools.",
  },
  {
    title: "Instructional Designer",
    department: "Content",
    location: "Remote / India",
    type: "Full-time",
    description:
      "Design effective learning experiences and curriculum frameworks.",
  },
  {
    title: "Project Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description:
      "Lead content development projects and coordinate cross-functional teams.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1">Join Our Team</h1>
            <p className="mt-4 text-lg text-gray-600">
              Help us transform education through innovative content and
              technology. We are always looking for passionate individuals to
              join our growing team.
            </p>
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="bg-white">
        <div className="container-wide">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/site/team.jpg"
              alt="Evelyn Learning Team"
              width={1400}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Why Work With Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              At Evelyn Learning, we believe in creating an environment where
              talented people can do their best work.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Open Positions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore our current openings and find your perfect role.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {openings.map((job) => (
              <div
                key={job.title}
                className="rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-primary whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">
            Do not See Your Role?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            We are always interested in hearing from talented individuals. Send
            us your resume and let us know how you can contribute.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
