import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.evelynlearning.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh7-us.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
    ],
  },
  async redirects() {
    return [
      // WordPress to new site URL redirects
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/short-interviews",
        destination: "/interviews",
        permanent: true,
      },
      {
        source: "/short-interviews/",
        destination: "/interviews",
        permanent: true,
      },
      {
        source: "/speakers-hall-of-fame",
        destination: "/speakers",
        permanent: true,
      },
      {
        source: "/speakers-hall-of-fame/",
        destination: "/speakers",
        permanent: true,
      },
      {
        source: "/webinar",
        destination: "/webinars",
        permanent: true,
      },
      {
        source: "/webinar/",
        destination: "/webinars",
        permanent: true,
      },
      // Old WordPress service URLs → new industry pages
      {
        source: "/services/k12",
        destination: "/industries/k12",
        permanent: true,
      },
      {
        source: "/services/k12/",
        destination: "/industries/k12",
        permanent: true,
      },
      {
        source: "/services/university",
        destination: "/industries/higher-ed",
        permanent: true,
      },
      {
        source: "/services/university/",
        destination: "/industries/higher-ed",
        permanent: true,
      },
      // Tag and category hub pages now handled by /tag/[slug] and /category/[slug] routes
      {
        source: "/blog/:page(\\d+)",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/:page(\\d+)/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/event-year/:path*",
        destination: "/webinars",
        permanent: true,
      },
      {
        source: "/staging-1/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/staging-2/:path*",
        destination: "/blog",
        permanent: true,
      },
      // Old WordPress service pages → new industry/service pages
      {
        source: "/services/organizations",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/organizations/",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/publishing",
        destination: "/industries/publishers",
        permanent: true,
      },
      {
        source: "/services/publishing/",
        destination: "/industries/publishers",
        permanent: true,
      },
      {
        source: "/services/test-prep",
        destination: "/industries/test-prep",
        permanent: true,
      },
      {
        source: "/services/test-prep/",
        destination: "/industries/test-prep",
        permanent: true,
      },
      {
        source: "/services/schools",
        destination: "/industries/k12",
        permanent: true,
      },
      {
        source: "/services/schools/",
        destination: "/industries/k12",
        permanent: true,
      },
      // Old about/contact/career pages
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/about-us/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/career-opportunity",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/career-opportunity/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/Job",
        destination: "/about",
        permanent: true,
      },
      // WordPress author pages → about
      {
        source: "/author/:slug",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/author/:slug/",
        destination: "/about",
        permanent: true,
      },
      // Speaker slug redirects (old WP slugs → correct DB slugs)
      {
        source: "/speakers/brad-waid-2",
        destination: "/speakers/brad-waid",
        permanent: true,
      },
      {
        source: "/speakers/erin-dowd-2",
        destination: "/speakers/erin-dowd",
        permanent: true,
      },
      {
        source: "/speakers/corey-seemiller",
        destination: "/speakers/corey-seemiller-ph-d",
        permanent: true,
      },
      {
        source: "/speakers/ellen-prescott",
        destination: "/speakers/ellen-prescott-ph-d-pmp",
        permanent: true,
      },
      {
        source: "/speakers/kevin-j-fleming",
        destination: "/speakers/kevin-j-fleming-ph-d",
        permanent: true,
      },
      // Speakers not in DB → speakers listing
      {
        source: "/speakers/dr-audrey-peek",
        destination: "/speakers",
        permanent: false,
      },
      {
        source: "/speakers/dr-danny-barnes",
        destination: "/speakers",
        permanent: false,
      },
      {
        source: "/speakers/erin-lenihan",
        destination: "/speakers",
        permanent: false,
      },
      {
        source: "/speakers/lucas-b-kavlie",
        destination: "/speakers",
        permanent: false,
      },
      // Short interview sub-pages → interviews
      {
        source: "/short-interviews/:slug",
        destination: "/interviews",
        permanent: true,
      },
      {
        source: "/short-interviews/:slug/",
        destination: "/interviews",
        permanent: true,
      },
      // Tag/category feed URLs → blog
      {
        source: "/tag/:slug/feed",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/tag/:slug/feed/",
        destination: "/blog",
        permanent: true,
      },
      // Tag pagination → blog
      {
        source: "/tag/:slug/page/:page",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/tag/:slug/page/:page/",
        destination: "/blog",
        permanent: true,
      },
      // WordPress date archives → blog
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})",
        destination: "/blog",
        permanent: true,
      },
      // Old webinar individual pages → webinars listing
      {
        source: "/webinar/:slug",
        destination: "/webinars",
        permanent: true,
      },
      {
        source: "/webinar/:slug/",
        destination: "/webinars",
        permanent: true,
      },
      // WordPress blog/page pagination → blog
      {
        source: "/blog/page/:page",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/page/:page/",
        destination: "/blog",
        permanent: true,
      },
      // WordPress category pagination → blog
      {
        source: "/category/:slug/page/:page",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page/",
        destination: "/blog",
        permanent: true,
      },
      // WordPress wp-content/uploads (old PDFs, images) → gone
      {
        source: "/wp-content/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      // Clone pages (leaked WordPress drafts)
      {
        source: "/clone/:path*",
        destination: "/blog",
        permanent: true,
      },
      // Old AI services pages
      {
        source: "/ai-services",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/ai-services/",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/ai-services-2",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/ai-services-2/",
        destination: "/products",
        permanent: true,
      },
      // Old root-level blog post slugs → /blog/:slug
      // 141 WordPress blog posts lived at root level (e.g., /adaptive-learning/)
      // Now migrated to /blog/:slug — redirect to the actual post.
      // Next.js pages take priority over redirects, so /case-studies etc. still work.
      {
        source: "/:slug([a-z0-9]+-[a-z0-9-]+)",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/:slug([a-z0-9]+-[a-z0-9-]+)/",
        destination: "/blog/:slug",
        permanent: true,
      },
      // Truncated URLs with trailing hyphens
      {
        source: "/:slug([a-z0-9-]+)-",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/:slug([a-z0-9-]+-)/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
