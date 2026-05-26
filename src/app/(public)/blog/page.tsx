import type { Metadata } from "next";

import { BlogCard, BlogHero, SeoJsonLd } from "@/components/marketing";
import { getBlogPosts } from "@/lib/queries/blog";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Courier Insights",
  description:
    "Read practical courier, cargo, and freight articles on business shipping, tracking, delivery planning, customs preparation, and shipment readiness.",
  path: "/blog",
  keywords: [
    "courier blog",
    "shipping advice",
    "delivery planning",
    "tracking tips",
    "business shipping",
  ],
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <BlogHero
        eyebrow="Courier insights"
        title="Practical shipping guidance for better delivery days."
        description="Explore courier operations advice for pickup planning, tracking clarity, quote preparation, customs details, and repeat business shipping."
      >
        {featuredPost ? <BlogCard post={featuredPost} isFeatured /> : null}
      </BlogHero>

      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Latest articles
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy">
              Guidance for shippers, operators, and support teams.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(otherPosts.length ? otherPosts : posts).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
