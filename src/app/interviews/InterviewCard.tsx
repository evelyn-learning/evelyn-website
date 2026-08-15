"use client";

import { useState } from "react";
import { Play, X, Linkedin } from "lucide-react";
import { formatDate } from "@core/utils";

interface InterviewCardProps {
  interview: {
    _id: string;
    title: string;
    episode: number;
    description: string;
    youtubeId: string;
    youtubeUrl: string;
    publishedAt: string;
    guest: {
      name: string;
      title?: string;
      company?: string;
      image?: string;
      linkedIn?: string;
    };
  };
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Use hqdefault.jpg which is always available for all YouTube videos
  // maxresdefault.jpg returns a gray placeholder for videos without HD thumbnails
  const thumbnailUrl = interview.youtubeId
    ? `https://img.youtube.com/vi/${interview.youtubeId}/hqdefault.jpg`
    : null;

  // Generate anchor ID from guest's last name (lowercase)
  const guestLastName = interview.guest.name.split(' ').pop()?.toLowerCase() || '';

  return (
    <>
      <article
        id={guestLastName}
        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md scroll-mt-24">
        {/* Video Thumbnail */}
        <button
          onClick={() => setShowVideo(true)}
          className="relative block aspect-video w-full bg-gradient-to-br from-primary-100 to-secondary-100"
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={interview.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 text-primary-500" fill="currentColor" />
            </div>
          </div>
          <span className="absolute left-4 top-4 rounded bg-primary-500 px-2 py-1 text-xs font-bold text-white">
            Episode {interview.episode}
          </span>
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-500">
            {interview.title}
          </h2>

          {/* Guest Info */}
          <div className="mt-4 flex items-center gap-3">
            {interview.guest.image ? (
              <img
                src={interview.guest.image}
                alt={interview.guest.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-500 font-semibold">
                {interview.guest.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{interview.guest.name}</p>
              <p className="text-sm text-gray-600">
                {interview.guest.title}
                {interview.guest.company && `, ${interview.guest.company}`}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
            {interview.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatDate(interview.publishedAt)}
            </span>
            <div className="flex gap-2">
              {interview.guest.linkedIn && (
                <a
                  href={interview.guest.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              <button
                onClick={() => setShowVideo(true)}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Watch
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Video Modal */}
      {showVideo && interview.youtubeId && (
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
                src={`https://www.youtube.com/embed/${interview.youtubeId}?autoplay=1&rel=0`}
                title={interview.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-white">{interview.title}</p>
              <p className="mt-1 text-sm text-gray-300">
                with {interview.guest.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
