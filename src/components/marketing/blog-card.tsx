import Link from "next/link";

import type { BlogPostSummary } from "@/types";

type BlogCardProps = {
  post: BlogPostSummary;
  isFeatured?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogCard({ post, isFeatured = false }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div
          className="flex min-h-48 items-end bg-[#0B1C3A] p-6 text-white"
          style={
            post.coverImageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(11, 28, 58, 0.35), rgba(11, 28, 58, 0.75)), url("${post.coverImageUrl}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          <div>
            {post.category ? (
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {post.category}
              </span>
            ) : null}
            {isFeatured ? (
              <p className="mt-4 text-sm font-semibold text-[#FFB38E]">
                Featured article
              </p>
            ) : null}
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm leading-7 text-slate-600">
            {formatDate(post.publishedAt)} - {post.readingMinutes} min read
          </p>
          <h2
            className={
              isFeatured
                ? "mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]"
                : "mt-3 font-heading text-xl font-bold tracking-tight text-[#0B1C3A]"
            }
          >
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex text-sm font-semibold text-[#FF6B2B]">
            Read article
          </span>
        </div>
      </Link>
    </article>
  );
}
