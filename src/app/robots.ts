import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://evelynlearning.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      // Allow AI crawlers for GEO (Generative Engine Optimization)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
