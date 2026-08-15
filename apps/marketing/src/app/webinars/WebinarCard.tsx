"use client";

import { useState } from "react";
import { Calendar, Clock, Play, X, ExternalLink } from "lucide-react";
import { formatDate } from "@core/utils";

interface WebinarCardProps {
  webinar: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    date: string;
    time: string;
    timezone: string;
    youtubeId?: string;
    featuredImage?: string;
    status: "upcoming" | "past" | "live";
    registrationUrl?: string;
    speakers?: { name: string; title?: string }[];
  };
}

export function WebinarCard({ webinar }: WebinarCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Generate URL slug from title for linking to original site
  const webinarUrl = `https://www.evelynlearning.com/webinar/${webinar.slug}/`;

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="grid md:grid-cols-3">
          {/* Thumbnail / Video */}
          <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 md:aspect-auto md:min-h-[250px]">
            {webinar.youtubeId ? (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={`https://img.youtube.com/vi/${webinar.youtubeId}/maxresdefault.jpg`}
                  alt={webinar.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30">
                  <div className="rounded-full bg-white/90 p-4 shadow-lg transition-transform hover:scale-110">
                    <Play className="h-8 w-8 text-primary-500" fill="currentColor" />
                  </div>
                </div>
              </button>
            ) : webinar.featuredImage ? (
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
                  {webinar.speakers.map((speaker) => (
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

            <div className="mt-6 flex flex-wrap gap-3">
              {webinar.status === "upcoming" && webinar.registrationUrl && (
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
              {webinar.status === "past" && (
                <>
                  {webinar.youtubeId ? (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="btn-primary"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Recording
                    </button>
                  ) : (
                    <a
                      href={webinarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      View Webinar
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Video Modal */}
      {showVideo && webinar.youtubeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${webinar.youtubeId}?autoplay=1&rel=0`}
                title={webinar.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <p className="mt-4 text-center text-lg font-medium text-white">
              {webinar.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
