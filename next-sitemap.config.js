/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.startsWith("/blog/")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path === "/blog" || path === "/services") {
      priority = 0.9;
      changefreq = "weekly";
    } else if (path === "/contact" || path === "/about") {
      priority = 0.8;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
