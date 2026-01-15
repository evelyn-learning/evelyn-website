import { Metadata } from "next";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Interview } from "@/models";
import { InterviewCard } from "./InterviewCard";

export const metadata: Metadata = {
  title: "Ed-Insights Interviews",
  description:
    "Watch our Ed-Insights interview series featuring conversations with education leaders, innovators, and experts sharing their insights on the future of learning.",
};

async function getInterviews() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    const interviews = await Interview.find().sort({ episode: -1 }).lean();
    return JSON.parse(JSON.stringify(interviews));
  } catch {
    return [];
  }
}

export default async function InterviewsPage() {
  const interviews = await getInterviews();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Ed-Insights
            </span>
            <h1 className="mt-2 heading-1">Expert Interviews</h1>
            <p className="mt-4 text-lg text-gray-600">
              Candid conversations with education leaders, innovators, and
              experts sharing their insights on transforming learning
              experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Interviews Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {interviews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview: any) => (
                <InterviewCard key={interview._id} interview={interview} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No interviews available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <div className="rounded-2xl bg-primary-500 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Share Your Insights
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-primary-100">
              Are you an education leader with insights to share? We would love
              to feature you in our Ed-Insights series.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
