'use client';

import { useContext } from 'react';
import { BookOpen, ExternalLink, GraduationCap, Users } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

interface ResourceLink {
  name: string;
  description: string;
  url?: string;
}

interface ResourceCategory {
  name: string;
  links: ResourceLink[];
}

export default function ShowcaseResourcesPage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const resources = pages.resources as {
    title?: string;
    subtitle?: string;
    categories?: ResourceCategory[];
  } | undefined;

  const categories = resources?.categories || [];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {resources?.title || 'Useful Resources'}
            </h1>
            <p className="text-xl text-white/90">
              {resources?.subtitle || 'Educational links and tools to support your learning'}
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {categories.length > 0 ? (
            <div className="space-y-12">
              {categories.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      {category.name.toLowerCase().includes('kid') ? (
                        <Users className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                      ) : (
                        <GraduationCap className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.links.map((link, linkIdx) => (
                      <div
                        key={linkIdx}
                        className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                              {link.name}
                            </h3>
                            <p className="text-sm text-gray-600">{link.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources Coming Soon</h3>
              <p className="text-gray-500">
                We&apos;re compiling helpful resources for students and parents.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Ways to Learn</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Practice Problems',
                description:
                  'Access our collection of practice problems and worksheets designed to reinforce classroom learning.',
              },
              {
                icon: GraduationCap,
                title: 'SAT Prep Materials',
                description:
                  'Official SAT practice tests and study guides to help you prepare for test day.',
              },
              {
                icon: Users,
                title: 'Study Groups',
                description:
                  'Join study groups with fellow students to collaborate and learn together.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Study Tips for Success</h2>

            <div className="space-y-4">
              {[
                'Practice consistently - a little every day is better than cramming',
                'Work through problems step by step, showing all your work',
                'Don\'t be afraid to ask questions in class',
                'Review your mistakes to understand where you went wrong',
                'Use multiple resources to see concepts explained different ways',
                'Teach concepts to others - it reinforces your own understanding',
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                    style={{ backgroundColor: site.branding.primaryColor }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
