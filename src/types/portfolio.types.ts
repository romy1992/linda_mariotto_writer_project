import type { ContentStatus } from "./service.types";

export type PortfolioVisibility = "public" | "private";

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  imageURL?: string;
  client?: string;
  year: number;
  externalLink?: string;
  status: ContentStatus;
  visibility: PortfolioVisibility;
  createdAt: number;
  publishedAt?: number;
}
