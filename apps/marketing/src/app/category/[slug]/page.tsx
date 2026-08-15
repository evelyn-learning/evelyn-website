import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isDBConfigured } from "@core/db";
import { BlogPost } from "@/models";
import { formatDate } from "@core/utils";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  elearning: "E-Learning",
  "teaching-methodologies": "Teaching & Pedagogy",
  "stem-education": "STEM Education",
  "assessment-of-learning": "Assessment",
  "learning-styles": "Learning Styles",
  "artificial-intelligence": "AI & Technology",
  technology: "AI & Technology",
  "educational-standards": "Curriculum & Standards",
  publishing: "Educational Publishing",
  "learner-counselling": "Career & Counseling",
  newsletter: "Industry News",
  "programming-language": "AI & Technology",
  "distance-learning": "E-Learning",
  uncategorized: "Education",
};

function slugToDisplayName(slug: string): string {
  if (CATEGORY_DISPLAY_NAMES[slug]) {
    return CATEGORY_DISPLAY_NAMES[slug];
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displayName = slugToDisplayName(slug);

  return {
    title: `${displayName} Articles | Evelyn Learning Blog`,
    description: `Explore ${displayName} articles from Evelyn Learning. Insights, trends, and best practices in education and e-learning.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

async function getPostsByCategory(categorySlug: string) {
  if (!isDBConfigured()) {
    return [];
  }

  await connectDB();

  // Convert slug to a pattern that matches the category (case-insensitive, hyphen = space or hyphen)
  const categoryPattern = categorySlug.replace(/-/g, "[- ]");

  const posts = await BlogPost.find({
    category: { $regex: new RegExp(`^${categoryPattern}$`, "i") },
    status: "published",
  })
    .sort({ publishedAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const displayName = slugToDisplayName(slug);

  let posts: any[] = [];
  try {
    posts = await getPostsByCategory(slug);
  } catch {
    posts = [];
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-500">
              Category
            </p>
            <h1 className="heading-1 mt-2">{displayName}</h1>
            <p className="mt-4 text-lg text-gray-600">
              {posts.length > 0
                ? `${posts.length} article${posts.length === 1 ? "" : "s"} in ${displayName}`
                : `No articles found in "${displayName}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <article
                  key={post._id}
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50">
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
                        {post.category}
                      </span>
                      <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-500 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>{post.readingTime} min read</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No articles found in this category. Browse all posts on our
                blog.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
              >
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
