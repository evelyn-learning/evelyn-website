"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

export function VideoModal({
  youtubeId,
  title,
  thumbnailUrl,
  className = "",
}: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const thumbnail = thumbnailUrl || defaultThumbnail;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative block w-full overflow-hidden ${className}`}
        aria-label={`Play video: ${title}`}
      >
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30">
          <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform hover:scale-110">
            <Play className="h-8 w-8 text-primary-500" fill="currentColor" />
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Video Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Title */}
            <p className="mt-4 text-center text-lg font-medium text-white">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Simple play button trigger (for use in cards)
export function VideoPlayButton({
  youtubeId,
  title,
  className = "",
}: {
  youtubeId: string;
  title: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`flex items-center gap-2 ${className}`}
        aria-label={`Play video: ${title}`}
      >
        <Play className="h-4 w-4" />
        Watch Recording
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <p className="mt-4 text-center text-lg font-medium text-white">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
