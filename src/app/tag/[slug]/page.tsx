import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isDBConfigured } from "@/lib/db";
import { BlogPost } from "@/models";
import { formatDate } from "@/lib/utils";

function slugToDisplayName(slug: string): string {
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
    title: `Posts tagged "${displayName}" | Evelyn Learning Blog`,
    description: `Browse articles about ${displayName} from Evelyn Learning. Insights, trends, and best practices in education and e-learning.`,
    alternates: {
      canonical: `/tag/${slug}`,
    },
  };
}

async function getPostsByTag(tagSlug: string) {
  if (!isDBConfigured()) {
    return [];
  }

  await connectDB();

  // Convert slug to a pattern that matches the tag (case-insensitive, hyphen = space)
  const tagPattern = tagSlug.replace(/-/g, "[- ]");

  const posts = await BlogPost.find({
    tags: { $regex: new RegExp(tagPattern, "i") },
    status: "published",
  })
    .sort({ publishedAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const displayName = slugToDisplayName(slug);

  let posts: any[] = [];
  try {
    posts = await getPostsByTag(slug);
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
              Tag
            </p>
            <h1 className="heading-1 mt-2">{displayName}</h1>
            <p className="mt-4 text-lg text-gray-600">
              {posts.length > 0
                ? `${posts.length} post${posts.length === 1 ? "" : "s"} tagged with "${displayName}"`
                : `No posts found for "${displayName}"`}
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
                No posts found with this tag. Browse all posts on our blog.
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
