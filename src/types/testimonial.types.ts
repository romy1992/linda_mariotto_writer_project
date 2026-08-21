export type TestimonialStatus = "pending" | "published" | "rejected";

export interface Testimonial {
  id: string;
  displayName: string;
  rating: number;
  comment: string;
  status: TestimonialStatus;
  isDemo: boolean;
  publicationConsent: boolean;
  privacyNoticeVersion: string;
  createdAt: number;
  updatedAt: number;
}
