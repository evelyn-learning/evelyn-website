'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        {/* Co-brand */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-medium text-purple-200">
            Explorer Academy <span className="text-yellow-400">&times;</span> Evelyn Learning
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Explorer Academy Learning Platform
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-2">
          AI-Powered Math &amp; Science for Grades 3&ndash;10
        </p>
        <p className="text-purple-300 max-w-2xl mx-auto">
          Personalized, curriculum-aligned learning tools built exclusively for Explorer Academy students
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            'BC Curriculum Aligned',
            'Adaptive Learning',
            'AI-Powered Tutoring',
            '24/7 Homework Help',
            'Progress Analytics',
          ].map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-sm text-purple-100"
            >
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
