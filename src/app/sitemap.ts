import { MetadataRoute } from "next";
import { connectDB, isDBConfigured } from "@/lib/db";
import { BlogPost } from "@/models";
import { services } from "@/data/services";
import { productCategories } from "@/data/products";

// Force dynamic rendering so sitemap fetches fresh data from DB
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/about`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/careers`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/security`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/integrations`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Services: listing + 7 individual pages, generated from @/data/services
  // (prevents sitemap drift from filesystem — services.ts is the single source of truth)
  const servicePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/services`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Products: listing + 24 individual pages, generated from @/data/products
  // (prevents sitemap drift — products.ts is the single source of truth)
  const productPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/products`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    ...productCategories.flatMap((category) =>
      category.products.map((product) => ({
        url: `${SITE_URL}/products/${product.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    ),
  ];

  // Resources
  const resourcePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`,              lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/webinars`,          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/interviews`,        lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/speakers`,          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];

  if (isDBConfigured()) {
    try {
      await connectDB();
      const posts = await BlogPost.find({ status: "published" })
        .select("slug updatedAt publishedAt")
        .lean();

      blogPosts = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.warn("Could not fetch blog posts for sitemap:", error);
    }
  }

  return [
    ...corePages,
    ...servicePages,
    ...productPages,
    ...resourcePages,
    ...blogPosts,
  ];
}
