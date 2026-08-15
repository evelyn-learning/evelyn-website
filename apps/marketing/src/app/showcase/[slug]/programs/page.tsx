'use client';

import { useContext, useState } from 'react';
import { BookOpen, GraduationCap, Clock, Users, ChevronDown, ChevronUp, DollarSign, CheckCircle } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

interface Program {
  id?: string;
  name: string;
  description?: string;
  price?: string;
  features?: string[];
}

interface Category {
  name: string;
  courses: Array<{
    name: string;
    grades?: string;
    description: string;
    schedule?: string;
  }>;
}

export default function ShowcaseProgramsPage() {
  const site = useContext(SiteContext);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const programsData = pages.programs as {
    title?: string;
    subtitle?: string;
    programs?: Program[];
    services?: string[];
    categories?: Category[];
  } | undefined;

  // Get programs and services
  const programs = programsData?.programs || [];
  const services = programsData?.services || [];
  const categories = programsData?.categories || [];

  // Check if we have any data
  const hasPrograms = programs.length > 0;
  const hasServices = services.length > 0;
  const hasCategories = categories.length > 0;
  const hasAnyData = hasPrograms || hasServices || hasCategories;

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
              {programsData?.title || 'Our Programs & Services'}
            </h1>
            <p className="text-xl text-white/90">
              {programsData?.subtitle || `Discover what ${site.businessName} has to offer`}
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid - if we have structured programs */}
      {hasPrograms && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Our Programs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, idx) => (
                <div
                  key={program.id || idx}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>

                  {program.description && (
                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  )}

                  {program.price && (
                    <div
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4"
                      style={{
                        backgroundColor: `${site.branding.primaryColor}15`,
                        color: site.branding.primaryColor,
                      }}
                    >
                      <DollarSign className="w-4 h-4" />
                      {program.price}
                    </div>
                  )}

                  {program.features && program.features.length > 0 && (
                    <ul className="space-y-2">
                      {program.features.slice(0, 4).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: site.branding.primaryColor }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services List - if we have services but no programs */}
      {hasServices && !hasPrograms && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Our Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Categories - if we have structured categories */}
      {hasCategories && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Course Categories
            </h2>
            <div className="space-y-6">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() =>
                      setExpandedCategory(expandedCategory === category.name ? null : category.name)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                      >
                        <BookOpen
                          className="w-6 h-6"
                          style={{ color: site.branding.primaryColor }}
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.courses.length} course{category.courses.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {expandedCategory === category.name ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedCategory === category.name && (
                    <div className="px-6 pb-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {category.courses.map((course, courseIdx) => (
                          <div
                            key={courseIdx}
                            className="bg-gray-50 p-5 rounded-xl border border-gray-100"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{course.name}</h4>
                              {course.grades && (
                                <span
                                  className="px-2 py-1 text-xs font-medium rounded-full"
                                  style={{
                                    backgroundColor: `${site.branding.primaryColor}15`,
                                    color: site.branding.primaryColor,
                                  }}
                                >
                                  {course.grades}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                            {course.schedule && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {course.schedule}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Data Message */}
      {!hasAnyData && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${site.branding.primaryColor}15` }}
            >
              <BookOpen className="w-10 h-10" style={{ color: site.branding.primaryColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {site.businessName} offers a range of services designed to meet your needs.
              Contact us to learn more about our offerings and how we can help you.
            </p>
            <a
              href={`/showcase/${site.slug}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition"
              style={{
                backgroundColor: site.branding.primaryColor,
                color: 'white',
              }}
            >
              Contact Us to Learn More
            </a>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-12"
        style={{ backgroundColor: site.branding.primaryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6">
            Contact us today to learn more about our programs and find the right fit for you.
          </p>
          <a
            href={`/showcase/${site.slug}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
