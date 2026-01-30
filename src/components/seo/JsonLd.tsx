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

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Evelyn Learning",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "Evelyn Learning provides comprehensive educational content solutions, AI-powered learning services, and expert content development for organizations, publishers, and educational institutions.",
    sameAs: [
      "https://www.linkedin.com/company/evelyn-learning/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@evelynlearning.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  featuredImage?: string;
  category?: string;
}

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  author,
  featuredImage,
  category,
}: BlogPostingJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Evelyn Learning",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    ...(featuredImage && {
      image: {
        "@type": "ImageObject",
        url: featuredImage,
      },
    }),
    ...(category && {
      articleSection: category,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebPageJsonLdProps {
  title: string;
  description: string;
  path: string;
}

export function WebPageJsonLd({ title, description, path }: WebPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: `${SITE_URL}${path}`,
    publisher: {
      "@type": "Organization",
      name: "Evelyn Learning",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Software Application Schema for Product Pages
interface SoftwareApplicationJsonLdProps {
  name: string;
  description: string;
  applicationCategory: string;
  url: string;
  featureList?: string[];
  screenshot?: string;
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  applicationCategory,
  url,
  featureList,
  screenshot,
}: SoftwareApplicationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    applicationCategory: applicationCategory,
    operatingSystem: "Web-based",
    url: `${SITE_URL}${url}`,
    provider: {
      "@type": "Organization",
      name: "Evelyn Learning",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Contact for enterprise pricing",
    },
    ...(featureList && featureList.length > 0 && {
      featureList: featureList.join(", "),
    }),
    ...(screenshot && {
      screenshot: {
        "@type": "ImageObject",
        url: screenshot,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Service Schema for Service Pages
interface ServiceJsonLdProps {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  areaServed?: string;
}

export function ServiceJsonLd({
  name,
  description,
  serviceType,
  url,
  areaServed = "Worldwide",
}: ServiceJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    serviceType: serviceType,
    url: `${SITE_URL}${url}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "Evelyn Learning",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: areaServed,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${name} Services`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: name,
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// FAQ Page Schema for FAQ Sections
interface FAQPageJsonLdProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQPageJsonLd({ faqs }: FAQPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb Schema for Navigation
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
