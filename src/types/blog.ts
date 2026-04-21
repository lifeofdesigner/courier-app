export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string;
  readingMinutes: number;
  category: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  authorName: string | null;
}
