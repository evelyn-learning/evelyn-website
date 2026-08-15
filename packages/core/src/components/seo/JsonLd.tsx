// The root-layout JSON-LD (EducationalOrganization + WebSite schema) is
// rendered by both apps' root layouts — extracted here from
// apps/marketing/src/components/seo/JsonLd.tsx, which keeps its other
// (marketing-only: blog posts, services, FAQs, breadcrumbs, etc.) exports
// locally since those have no tutor consumer.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com";

// Enhanced Organization Schema for Educational Organizations
export function EducationalOrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Evelyn Learning",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "Evelyn Learning provides AI-powered learning solutions, adaptive learning platforms, intelligent tutoring systems, and educational content services for organizations, publishers, and educational institutions worldwide.",
    sameAs: [
      "https://www.linkedin.com/company/evelyn-learning/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@evelynlearning.com",
      telephone: "+1-302-212-0975",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      addressCountry: "US",
    },
    foundingDate: "2013",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      maxValue: 200,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    knowsAbout: [
      "AI-Powered Learning",
      "Adaptive Learning Platform",
      "Personalized Learning",
      "Intelligent Tutoring Systems",
      "Learning Analytics",
      "Automated Grading",
      "Educational Technology",
      "EdTech",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// WebSite schema with SearchAction — enables Google sitelinks search box
// and gives LLMs a canonical WebSite entity for the domain.
export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Evelyn Learning",
    alternateName: "Evelyn Learning Systems",
    url: `${SITE_URL}/`,
    description:
      "AI-powered learning solutions, adaptive learning platforms, intelligent tutoring systems, and educational content services.",
    publisher: {
      "@type": "EducationalOrganization",
      name: "Evelyn Learning",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
