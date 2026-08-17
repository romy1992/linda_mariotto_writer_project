export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverURL?: string;
  content: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  seoTitle: string;
  metaDescription: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}
