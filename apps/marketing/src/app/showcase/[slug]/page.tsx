'use client';

import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, Users, Award, BookOpen, Play, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiteContext } from './ShowcaseLayoutClient';

export default function ShowcaseHomePage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const baseUrl = `/showcase/${site.slug}`;
  const pages = site.pages as Record<string, unknown>;
  const home = pages.home as Record<string, unknown> | undefined;
  const hero = home?.hero as { title?: string; subtitle?: string; backgroundImage?: string } | undefined;
  const highlights = (home?.highlights as string[]) || [];
  const announcement = home?.announcement as { title?: string; subtitle?: string } | undefined;
  const youtubeVideoId = home?.youtubeVideoId as string | undefined;
  const mission = home?.mission as string | undefined;
  const featuredImages = (home?.featuredImages as Array<{ url: string; alt: string }>) || [];

  // Get actual stats from site data - NO hardcoded defaults
  const stats = site.stats && site.stats.length > 0 ? site.stats : null;

  // Get actual testimonials from site data - NO hardcoded defaults
  const testimonials = site.testimonials && site.testimonials.length > 0 ? site.testimonials : null;

  // Get actual programs/services from site pages data
  const programsPage = pages.programs as { programs?: Array<{ name: string; description?: string; price?: string }>; services?: string[] } | undefined;
  const programs = programsPage?.programs || [];
  const services = programsPage?.services || [];

  // Get team members
  const teamPage = pages.team as { members?: Array<{ name: string; role?: string; imageUrl?: string }> } | undefined;
  const teamMembers = teamPage?.members || [];

  // Get all extracted images
  const allImages = site.images;
  const heroImage = hero?.backgroundImage || allImages?.find(img => img.context === 'hero')?.url;
  const logoImage = site.branding?.logoUrl || allImages?.find(img => img.context === 'logo')?.url;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background: heroImage
            ? undefined
            : `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
        }}
      >
        {heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        {!heroImage && <div className="absolute inset-0 bg-black/10" />}
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            {logoImage && (
              <div className="mb-6">
                <img
                  src={logoImage}
                  alt={`${site.businessName} logo`}
                  className="h-16 md:h-20 w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {hero?.title || site.tagline || site.businessName}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {hero?.subtitle || site.tagline || 'Excellence in Education'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`${baseUrl}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`${baseUrl}/programs`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition border border-white/30"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Banner - only if we have one */}
      {announcement && announcement.title && (
        <section className="py-6 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p
              className="text-xl md:text-2xl font-bold mb-1"
              style={{ color: site.branding.accentColor || site.branding.primaryColor }}
            >
              {announcement.title}
            </p>
            {announcement.subtitle && (
              <p
                className="text-lg font-semibold"
                style={{ color: site.branding.accentColor || site.branding.primaryColor }}
              >
                {announcement.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Mission Statement Section - only if we have one */}
      {mission && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              {mission}
            </p>
          </div>
        </section>
      )}

      {/* Contact Info Bar - if available */}
      {(site.contact.phone || site.contact.email || site.contact.address) && (
        <section className="py-6 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {site.contact.phone && (
                <a href={`tel:${site.contact.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Phone className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                  {site.contact.phone}
                </a>
              )}
              {site.contact.email && (
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Mail className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                  {site.contact.email}
                </a>
              )}
              {site.contact.address && (
                <span className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                  {site.contact.address}
                </span>
              )}
              {site.contact.businessHours && (
                <span className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                  {site.contact.businessHours}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* YouTube Video Section */}
      {youtubeVideoId && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Play className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Featured Video
                </h2>
              </div>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="Featured Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Stats Section - only if we have real stats */}
      {stats && stats.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: site.branding.primaryColor }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights Section - only if we have them */}
      {highlights.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose {site.businessName}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${site.branding.primaryColor}20` }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: site.branding.primaryColor }}
                    />
                  </div>
                  <p className="text-gray-700 font-medium">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services/Programs Preview - use actual scraped data */}
      {(services.length > 0 || programs.length > 0) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover what {site.businessName} has to offer.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Show programs first if available */}
              {programs.slice(0, 6).map((program, idx) => (
                <div
                  key={`prog-${idx}`}
                  className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: site.branding.primaryColor }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                  {program.description && (
                    <p className="text-gray-600 text-sm mb-2">{program.description}</p>
                  )}
                  {program.price && (
                    <p className="text-sm font-medium" style={{ color: site.branding.primaryColor }}>
                      {program.price}
                    </p>
                  )}
                </div>
              ))}
              {/* Show services if no programs */}
              {programs.length === 0 && services.slice(0, 6).map((service, idx) => (
                <div
                  key={`svc-${idx}`}
                  className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition"
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
            <div className="text-center mt-8">
              <Link
                href={`${baseUrl}/programs`}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition"
                style={{
                  backgroundColor: site.branding.primaryColor,
                  color: 'white',
                }}
              >
                View All Programs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Images Gallery - if we have images */}
      {featuredImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredImages.slice(0, 8).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt || `Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Preview - if we have team members */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.slice(0, 4).map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${member.imageUrl ? 'hidden' : ''}`} style={{ backgroundColor: `${site.branding.primaryColor}15` }}>
                      <Users className="w-10 h-10" style={{ color: site.branding.primaryColor }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  {member.role && <p className="text-sm text-gray-500">{member.role}</p>}
                </div>
              ))}
            </div>
            {teamMembers.length > 4 && (
              <div className="text-center mt-8">
                <Link
                  href={`${baseUrl}/team`}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: site.branding.primaryColor }}
                >
                  View Full Team <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials - only if we have real testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Clients Say
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    {testimonial.imageUrl && (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      {testimonial.role && (
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Contact us today to learn more about our services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`${baseUrl}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            {site.contact.phone && (
              <a
                href={`tel:${site.contact.phone}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition border border-white/30"
              >
                Call {site.contact.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
