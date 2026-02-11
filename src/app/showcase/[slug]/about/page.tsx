'use client';

import { useContext } from 'react';
import { BookOpen, Target, Users, Award, GraduationCap } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

export default function ShowcaseAboutPage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const about = pages.about as {
    title?: string;
    subtitle?: string;
    content?: string[];
    mission?: { title?: string; content?: string };
    approach?: { title?: string; subtitle?: string; content?: string };
  } | undefined;

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
              {about?.title || 'About Us'}
            </h1>
            <p className="text-xl text-white/90">
              {about?.subtitle || site.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Text */}
            <div className="lg:col-span-2">
              {about?.content?.map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {!about?.content && (
                <>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    At {site.businessName}, we are dedicated to providing exceptional educational services
                    that help students achieve their full potential. Our experienced team of educators
                    brings passion and expertise to every lesson.
                  </p>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    We believe that every student can succeed with the right support and guidance.
                    Our personalized approach ensures that each student receives the attention they need
                    to thrive academically.
                  </p>
                </>
              )}
            </div>

            {/* Quick Facts */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  {site.stats?.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                      >
                        <Award className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      {about?.mission && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                >
                  <Target className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {about.mission.title || 'Our Mission'}
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {about.mission.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Approach Section */}
      {about?.approach && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                >
                  <BookOpen className="w-7 h-7" style={{ color: site.branding.primaryColor }} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {about.approach.title || 'Our Approach'}
                  </h2>
                  {about.approach.subtitle && (
                    <p className="text-gray-500">{about.approach.subtitle}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {about.approach.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at {site.businessName}.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Excellence',
                description: 'We strive for the highest standards in education and student outcomes.',
              },
              {
                icon: Users,
                title: 'Individual Attention',
                description: 'Every student receives personalized support tailored to their needs.',
              },
              {
                icon: Target,
                title: 'Results-Driven',
                description: 'Our methods are proven to deliver measurable improvements.',
              },
              {
                icon: BookOpen,
                title: 'Lifelong Learning',
                description: 'We instill a love of learning that extends beyond the classroom.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                >
                  <value.icon className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
