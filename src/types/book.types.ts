import type { ContentStatus } from "./service.types";

export interface Book {
  id: string;
  title: string;
  slug: string;
  coverURL?: string;
  description: string;
  year: number;
  isbn?: string;
  publisher?: string;
  externalLink?: string;
  purchaseLink?: string;
  status: ContentStatus;
}
