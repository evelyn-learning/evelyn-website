import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evelynlearning.com';

// Disallow list shared by all user agents
const DISALLOW = ['/admin/', '/api/', '/_next/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      // AI search / retrieval bots — OpenAI
      { userAgent: 'GPTBot',         allow: '/', disallow: DISALLOW },
      { userAgent: 'ChatGPT-User',   allow: '/', disallow: DISALLOW },
      { userAgent: 'OAI-SearchBot',  allow: '/', disallow: DISALLOW },
      // Anthropic
      { userAgent: 'ClaudeBot',      allow: '/', disallow: DISALLOW },
      { userAgent: 'anthropic-ai',   allow: '/', disallow: DISALLOW },
      // Perplexity
      { userAgent: 'PerplexityBot',  allow: '/', disallow: DISALLOW },
      { userAgent: 'Perplexity-User',allow: '/', disallow: DISALLOW },
      // Google (AI surfaces distinct from organic Googlebot)
      { userAgent: 'GoogleOther',    allow: '/', disallow: DISALLOW },
      { userAgent: 'Google-Extended',allow: '/', disallow: DISALLOW },
      // Others
      { userAgent: 'cohere-ai',      allow: '/', disallow: DISALLOW },
      { userAgent: 'Bytespider',     allow: '/', disallow: DISALLOW },
      { userAgent: 'MistralAI-User', allow: '/', disallow: DISALLOW },
      { userAgent: 'Amazonbot',      allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
