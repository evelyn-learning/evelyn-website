const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com";

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
