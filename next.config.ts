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
      // WordPress tag/category/pagination patterns → blog
      {
        source: "/tag/:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/tag/:slug/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/blog",
        permanent: true,
      },
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
      // Old root-level blog post slugs → blog
      // 238+ WordPress blog posts lived at root level (e.g., /adaptive-learning/)
      // Catch-all: any root path with a hyphen → /blog
      // Next.js pages take priority over redirects, so /case-studies (the only
      // root-level hyphenated page) will still serve its page correctly.
      {
        source: "/:slug([a-z0-9]+-[a-z0-9-]+)",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/:slug([a-z0-9]+-[a-z0-9-]+)/",
        destination: "/blog",
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
