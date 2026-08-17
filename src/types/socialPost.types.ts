export type SocialPlatform = "instagram" | "linkedin";

export type SocialPostType =
  | "post"
  | "carousel"
  | "reel-script"
  | "linkedin-post"
  | "linkedin-article";

export type SocialPostStatus =
  | "idea"
  | "draft"
  | "review"
  | "ready"
  | "scheduled"
  | "published";

export interface SocialPost {
  id: string;
  internalTitle: string;
  platform: SocialPlatform;
  type: SocialPostType;
  text: string;
  caption: string;
  hashtags: string[];
  imageURL?: string;
  scheduledDate?: number;
  status: SocialPostStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
