'use client';

import { useContext } from 'react';
import { User, Users } from 'lucide-react';
import { SiteContext } from '../ShowcaseLayoutClient';

interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
}

export default function ShowcaseTeamPage() {
  const site = useContext(SiteContext);

  if (!site) return null;

  const pages = site.pages as Record<string, unknown>;
  const team = pages.team as {
    title?: string;
    intro?: string;
    founder?: {
      name: string;
      role: string;
      bio: string;
      imageUrl?: string;
    };
    members?: TeamMember[];
  } | undefined;

  // Also check site.team directly (from generate-showcase)
  const siteTeam = site.team;
  const allMembers = team?.members || siteTeam || [];

  // If we have no team data at all, show a simple message
  const hasTeamData = allMembers.length > 0 || team?.founder;

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
              {team?.title || 'Our Team'}
            </h1>
            <p className="text-xl text-white/90">
              Meet the dedicated team behind {site.businessName}
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      {team?.intro && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              {team.intro}
            </p>
          </div>
        </section>
      )}

      {/* Founder / Lead */}
      {team?.founder && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Photo or Avatar */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {team.founder.imageUrl ? (
                      <img
                        src={team.founder.imageUrl}
                        alt={team.founder.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center ${team.founder.imageUrl ? 'hidden' : ''}`}
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <User className="w-16 h-16" style={{ color: site.branding.primaryColor }} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">{team.founder.name}</h2>
                      <p className="text-lg" style={{ color: site.branding.primaryColor }}>
                        {team.founder.role}
                      </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{team.founder.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Members */}
      {allMembers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              {team?.founder ? 'Our Team' : 'Meet the Team'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition text-center"
                >
                  {/* Member Photo */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = (e.target as HTMLImageElement).nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center ${member.imageUrl ? 'hidden' : ''}`}
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      <User className="w-10 h-10" style={{ color: site.branding.primaryColor }} />
                    </div>
                  </div>

                  {/* Member Info */}
                  <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                  {member.role && (
                    <p className="text-sm mt-1" style={{ color: site.branding.primaryColor }}>
                      {member.role}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Team Data Message */}
      {!hasTeamData && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${site.branding.primaryColor}15` }}
            >
              <Users className="w-10 h-10" style={{ color: site.branding.primaryColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Dedicated Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {site.businessName} is powered by a team of dedicated professionals committed to providing the best service possible.
              Contact us to learn more about our team and how we can help you.
            </p>
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
            Want to Learn More?
          </h2>
          <p className="text-white/90 mb-6">
            Contact us today to learn more about our team and services.
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
