import { Metadata } from "next";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Webinar } from "@/models";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Play, ExternalLink } from "lucide-react";
import { WebinarCard } from "./WebinarCard";

export const metadata: Metadata = {
  title: "Webinars",
  description:
    "Watch our Ed-Confabs webinar series featuring thought leaders discussing the latest trends in education, AI, and learning technology.",
};

async function getWebinars() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    const webinars = await Webinar.find().sort({ date: -1 }).lean();
    return JSON.parse(JSON.stringify(webinars));
  } catch {
    return [];
  }
}

export default async function WebinarsPage() {
  const webinars = await getWebinars();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Ed-Confabs
            </span>
            <h1 className="mt-2 heading-1">Webinars</h1>
            <p className="mt-4 text-lg text-gray-600">
              Join our monthly webinar series featuring education experts,
              thought leaders, and innovators discussing the future of learning.
            </p>
          </div>
        </div>
      </section>

      {/* Webinars List */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {webinars.length > 0 ? (
            <div className="space-y-8">
              {webinars.map((webinar: any) => (
                <WebinarCard key={webinar._id} webinar={webinar} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No webinars scheduled yet. Check back soon for upcoming events!
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
              Want to Be a Speaker?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-primary-100">
              Share your expertise with our community. We are always looking for
              thought leaders to join our Ed-Confabs series.
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
