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
    ];
  },
};

export default nextConfig;
