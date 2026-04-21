import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlogCard,
  BlogHero,
  BlogRichContent,
  SeoJsonLd,
} from "@/components/marketing";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
} from "@/lib/queries/blog";
import {
  createBlogPostMetadata,
  createPageMetadata,
  getBlogPostingJsonLd,
  getOrganizationJsonLd,
} from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function deriveTakeaways(contentHtml: string) {
  const matches = [...contentHtml.matchAll(/<h2>(.*?)<\/h2>/g)].map(
    (match) => match[1],
  );

  return matches.slice(0, 3);
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Article Not Found",
      description: "This Atlas Courier article could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.slug, 3);
  const metaParts = [
    post.category,
    formatDate(post.publishedAt),
    `${post.readingMinutes} min read`,
  ].filter(Boolean);

  return (
    <main>
      <SeoJsonLd
        data={[getOrganizationJsonLd(), getBlogPostingJsonLd(post)]}
      />
      <BlogHero
        eyebrow={post.category ?? "Courier insights"}
        title={post.title}
        description={post.excerpt}
        meta={metaParts.join(" - ")}
      />

      <section className="py-16 lg:py-20">
        <BlogRichContent
          contentHtml={post.contentHtml}
          takeaways={deriveTakeaways(post.contentHtml)}
        />
      </section>

      {relatedPosts.length ? (
        <section className="pb-16 lg:pb-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                  Related reading
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
                  More courier guidance
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                View all articles
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
