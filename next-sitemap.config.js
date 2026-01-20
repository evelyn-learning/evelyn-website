/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com",
  generateRobotsTxt: true,
  // Disable static sitemap generation - using dynamic sitemap from app/sitemap.ts instead
  exclude: ["*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
