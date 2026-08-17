export type ContentStatus = "draft" | "published";

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  imageURL?: string;
  order: number;
  status: ContentStatus;
  seoTitle: string;
  metaDescription: string;
  createdAt: number;
  updatedAt: number;
}
