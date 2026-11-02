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
  /** Custom site logo. Falls back to the default /logo.svg mark when unset. */
  logoURL?: string;
  email: string;
  phone?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  ogImageURL?: string;

  // Testi condivisi tra più pagine.
  /** Etichetta dei bottoni CTA "contattami" ripetuti su più sezioni. */
  ctaButtonLabel?: string;
  /** Etichetta del link "scopri il libro" (Home e Libri). */
  bookLinkLabel?: string;
  /** Etichetta "Autrice" usata come eyebrow (Home e Libri). */
  authorLabel?: string;
  /** Eyebrow "Chi sono" (sezione bio della Home e pagina Chi sono). */
  aboutEyebrow?: string;

  // Home — testi editoriali oltre ai titoli già esistenti.
  homeHeroEyebrow?: string;
  homeHeroSecondaryLinkLabel?: string;
  /** Paragrafo sotto il titolo del Manifesto. */
  homeManifestoSubtitle?: string;
  homeAboutLinkLabel?: string;
  homeServicesEyebrow?: string;
  homeServicesTitle?: string;
  homeServicesLinkLabel?: string;
  homeServiceItemLinkLabel?: string;
  homeApproachEyebrow?: string;
  homeApproachTitle?: string;
  homeApproachPhilosophyLabel?: string;
  homeApproachMethodLabel?: string;
  homeBooksTitle?: string;
  homeBooksOthersLabel?: string;
  homeBooksAllLinkLabel?: string;
  homePortfolioEyebrow?: string;
  homePortfolioTitle?: string;
  homePortfolioLinkLabel?: string;
  homeTestimonialsEyebrow?: string;
  homeTestimonialsTitle?: string;
  homeTestimonialsLinkLabel?: string;
  homeArticlesEyebrow?: string;
  homeArticlesTitle?: string;
  homeArticlesLinkLabel?: string;
  homeArticleItemLinkLabel?: string;
  /** Titolo della CTA finale. Use new lines for separate rows. */
  homeCtaTitle?: string;
  homeCtaSubtitle?: string;

  // Chi sono.
  /** Titolo H1 di "Chi sono". Use new lines for separate rows. */
  aboutHeadingTitle?: string;
  aboutPhilosophyChapterLabel?: string;
  aboutPhilosophyTitle?: string;
  aboutMethodChapterLabel?: string;
  aboutMethodTitle?: string;

  // Libri.
  booksEyebrow?: string;
  booksTitle?: string;
  booksSubtitle?: string;

  // Contatti.
  contactEyebrow?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactSuccessMessage?: string;
  contactSubmitLabel?: string;

  updatedAt: number;
}
