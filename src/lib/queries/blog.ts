import { cache } from "react";

import { blogFallbackPosts } from "@/content/blog-fallback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPostDetail, BlogPostSummary } from "@/types";

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  reading_minutes: number | null;
  category?: string | null;
  content_html?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  author_name?: string | null;
};

function toSummary(row: BlogPostRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    coverImageUrl: row.cover_image_url,
    publishedAt: row.published_at ?? new Date().toISOString(),
    readingMinutes: row.reading_minutes ?? 4,
    category: row.category ?? null,
  };
}

function toDetail(row: BlogPostRow): BlogPostDetail {
  return {
    ...toSummary(row),
    contentHtml:
      row.content_html ??
      "<p>This article is being prepared by the logistics team.</p>",
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    authorName: row.author_name ?? null,
  };
}

export const getBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return blogFallbackPosts;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, published_at, reading_minutes",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return blogFallbackPosts;
    }

    return (data as BlogPostRow[]).map(toSummary);
  } catch {
    return blogFallbackPosts;
  }
});

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    try {
      const supabase = await createSupabaseServerClient();

      if (supabase) {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (!error && data) {
          return toDetail(data as BlogPostRow);
        }
      }
    } catch {
      // Fallback below keeps the public blog usable when Supabase is unavailable.
    }

    return blogFallbackPosts.find((post) => post.slug === slug) ?? null;
  },
);

export async function getRelatedBlogPosts(
  slug: string,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const posts = await getBlogPosts();

  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
