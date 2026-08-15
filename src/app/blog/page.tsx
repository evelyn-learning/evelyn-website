import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isDBConfigured } from "@core/db";
import { BlogPost } from "@/models";
import { formatDate } from "@core/utils";
import { ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore insights, trends, and best practices in education, e-learning, AI in education, and curriculum development from Evelyn Learning experts.",
  alternates: {
    canonical: "/blog",
  },
};

async function getBlogPosts(page = 1, limit = 12) {
  if (!isDBConfigured()) {
    return { posts: [], total: 0, totalPages: 0, currentPage: page };
  }

  await connectDB();

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments({ status: "published" }),
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  let blogData;
  try {
    blogData = await getBlogPosts(page);
  } catch {
    blogData = { posts: [], total: 0, totalPages: 0, currentPage: 1 };
  }

  const { posts, totalPages, currentPage } = blogData;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1">Blog</h1>
            <p className="mt-4 text-lg text-gray-600">
              Insights, trends, and best practices in education, e-learning, and
              curriculum development from our experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {posts.length > 0 ? (
            <>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/blog?page=${currentPage - 1}`}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}`}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          pageNum === currentPage
                            ? "bg-primary-500 text-white"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}

                  {currentPage < totalPages && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No blog posts yet. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <div className="rounded-2xl bg-primary-500 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Stay Updated
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-primary-100">
              Subscribe to our newsletter for the latest insights in education
              and learning technology.
            </p>
            <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-500 transition-colors hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
