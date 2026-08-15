'use client';

import React, { useState } from 'react';

interface VideoEmbedProps {
  youtubeId: string;
  title?: string;
  caption?: string;
}

export default function VideoEmbed({ youtubeId, title, caption }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full bg-gray-100 rounded-xl border border-gray-200 p-8 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-gray-500 text-sm">Video unavailable</p>
        {title && <p className="text-gray-400 text-xs mt-1">{title}</p>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-900" style={{ paddingBottom: '56.25%' }}>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title || 'Educational video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">{caption}</p>
      )}
    </div>
  );
}
