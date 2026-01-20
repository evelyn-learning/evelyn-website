import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB, isDBConfigured } from "@/lib/db";
import { BlogPost } from "@/models";
import { formatDate } from "@/lib/utils";
import { marked } from "marked";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { BlogPostingJsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all published blog posts (enables sitemap discovery)
// Returns empty array if DB unavailable (pages will render on-demand)
export async function generateStaticParams() {
  if (!isDBConfigured()) {
    return [];
  }

  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" }).select("slug").lean();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn("Could not fetch blog posts for static generation:", error);
    return [];
  }
}

async function getBlogPost(slug: string) {
  await connectDB();
  const post = await BlogPost.findOne({ slug, status: "published" }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

async function getRelatedPosts(category: string, currentSlug: string) {
  await connectDB();
  const posts = await BlogPost.find({
    status: "published",
    category,
    slug: { $ne: currentSlug },
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, slug);
  const contentHtml = marked(post.content);

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        slug={slug}
        publishedAt={post.publishedAt}
        modifiedAt={post.updatedAt}
        author={post.author}
        featuredImage={post.featuredImage}
        category={post.category}
      />

      {/* Article Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 md:py-16">
        <div className="container-wide">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-primary-500 hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mx-auto mt-6 max-w-3xl">
            <span className="text-sm font-medium uppercase tracking-wider text-primary-500">
              {post.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full"
                />
              </div>
            )}

            {/* Content */}
            <article
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-8">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <h2 className="heading-2 text-center">Related Articles</h2>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost: any) => (
                <article
                  key={relatedPost._id}
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50">
                      {relatedPost.featuredImage && (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
