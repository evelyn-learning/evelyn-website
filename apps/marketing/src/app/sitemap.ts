import { MetadataRoute } from "next";
import { connectDB, isDBConfigured } from "@core/db";
import { BlogPost } from "@/models";
import { services } from "@/data/services";
import { productCategories } from "@/data/products";
import { SOLUTION_SEGMENTS } from "@/data/solutions";
import { isSitemapPost } from "@/lib/blog/beacon-flags";

// Force dynamic rendering so sitemap fetches fresh data from DB
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages carry no lastModified: stamping "now" on every fetch tells
  // crawlers every page changed every day, which they learn to ignore.
  // Static core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/about`,             changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`,           changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/careers`,           changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/security`,          changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/responsible-data`,  changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/integrations`,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/showcase/crimsora`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Services: listing + 7 individual pages, generated from @/data/services
  // (prevents sitemap drift from filesystem — services.ts is the single source of truth)
  const servicePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/services`,          changeFrequency: "weekly",  priority: 0.9 },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Products: listing + one page per product, generated from @/data/products
  // (prevents sitemap drift — products.ts is the single source of truth)
  const productPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/products`,          changeFrequency: "weekly",  priority: 0.9 },
    ...productCategories.flatMap((category) =>
      category.products.map((product) => ({
        url: `${SITE_URL}/products/${product.id}`,
          changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    ),
  ];

  // Solutions: hub + 6 segment pages, generated from @/data/solutions
  // (prevents sitemap drift — SOLUTION_SEGMENTS is the single source of truth)
  const solutionPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/solutions`,         changeFrequency: "monthly", priority: 0.8 },
    ...SOLUTION_SEGMENTS.map((segment) => ({
      url: `${SITE_URL}/solutions/${segment.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // Resources
  const resourcePages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`,              changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/webinars`,          changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/interviews`,        changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/speakers`,          changeFrequency: "weekly",  priority: 0.7 },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];

  if (isDBConfigured()) {
    try {
      await connectDB();
      const posts = await BlogPost.find({ status: "published" })
        .select("slug status noindex updatedAt")
        .lean<Array<{ slug: string; status: string; noindex?: boolean; updatedAt: Date }>>();

      // Noindexed posts (Beacon) stay live but leave the sitemap.
      blogPosts = posts.filter((post) => isSitemapPost(post)).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
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
    ...solutionPages,
    ...resourcePages,
    ...blogPosts,
  ];
}
