export interface SiteSettings {
  professionalName: string;
  payoff: string;
  bio: string;
  philosophy: string;
  method: string;
  /** Home hero headline. Use new lines for separate rows. */
  homeHeroTitle?: string;
  /** Home manifesto headline. Use new lines for separate rows. */
  homeManifestoTitle?: string;
  /** Home “Chi sono” section title. */
  homeAboutTitle?: string;
  photoURL?: string;
  email: string;
  phone?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  ogImageURL?: string;
  updatedAt: number;
}
