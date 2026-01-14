import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Webinar } from "@/models";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Play, ExternalLink } from "lucide-react";

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
                <article
                  key={webinar._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="grid md:grid-cols-3">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 md:aspect-auto">
                      {webinar.featuredImage ? (
                        <img
                          src={webinar.featuredImage}
                          alt={webinar.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Play className="h-16 w-16 text-primary-300" />
                        </div>
                      )}
                      {webinar.status === "past" && webinar.youtubeId && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="rounded-full bg-white/90 p-4">
                            <Play className="h-8 w-8 text-primary-500" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:col-span-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            webinar.status === "upcoming"
                              ? "bg-green-100 text-green-700"
                              : webinar.status === "live"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {webinar.status === "upcoming"
                            ? "Upcoming"
                            : webinar.status === "live"
                            ? "Live Now"
                            : "Watch Recording"}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(webinar.date)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {webinar.time} {webinar.timezone}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-primary-500">
                        {webinar.title}
                      </h2>
                      <p className="mt-2 text-gray-600 line-clamp-2">
                        {webinar.description}
                      </p>

                      {webinar.speakers && webinar.speakers.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Featuring:</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {webinar.speakers.map((speaker: any) => (
                              <span
                                key={speaker.name}
                                className="text-sm font-medium text-gray-700"
                              >
                                {speaker.name}
                                {speaker.title && `, ${speaker.title}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        {webinar.status === "upcoming" &&
                          webinar.registrationUrl && (
                            <a
                              href={webinar.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                            >
                              Register Now
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          )}
                        {webinar.status === "past" && webinar.youtubeId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${webinar.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                          >
                            Watch Recording
                            <Play className="ml-2 h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
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
    </>
  );
}
