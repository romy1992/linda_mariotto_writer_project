import { useMemo } from "react";
import { Link } from "react-router-dom";
import { limit, orderBy, where } from "firebase/firestore";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import { RatingStars } from "../../components/testimonials/RatingStars";
import { SHOW_PORTFOLIO_PUBLICLY } from "../../constants/features";
import { formatDate } from "../../utils/formatDate";
import { titleLines } from "../../utils/titleLines";
import type {
  Article,
  Book,
  PortfolioItem,
  Service,
  SiteSettings,
  Testimonial,
} from "../../types";

const DEFAULT_HERO_TITLE = "Le tue storie.\nLe parole giuste\nper raccontarle.";
const DEFAULT_MANIFESTO_TITLE = "Scrivo al posto tuo.\nNon al posto della tua voce.";
const DEFAULT_ABOUT_TITLE = "Una voce al servizio della tua";
const DEFAULT_CTA_TITLE =
  "Forse la tua storia esiste già.\nHa solo bisogno delle parole giuste.";

export function Home() {
  const { data: settings } = useDocument<SiteSettings>("settings", "site");

  const serviceConstraints = useMemo(
    () => [where("status", "==", "published"), orderBy("order"), limit(4)],
    [],
  );
  const { data: services } = useCollection<Service>("services", serviceConstraints);

  const portfolioConstraints = useMemo(
    () => [
      where("status", "==", "published"),
      where("visibility", "==", "public"),
      orderBy("year", "desc"),
      limit(3),
    ],
    [],
  );
  const { data: portfolio } = useCollection<PortfolioItem>("portfolio", portfolioConstraints);

  const articleConstraints = useMemo(
    () => [where("status", "==", "published"), orderBy("publishedAt", "desc"), limit(3)],
    [],
  );
  const { data: articles } = useCollection<Article>("articles", articleConstraints);

  const bookConstraints = useMemo(() => [where("status", "==", "published"), limit(4)], []);
  const { data: books } = useCollection<Book>("books", bookConstraints);
  const featuredBook = books[0];
  const otherBooks = books.slice(1);

  const testimonialConstraints = useMemo(
    () => [
      where("status", "==", "published"),
      where("isDemo", "==", false),
      orderBy("createdAt", "desc"),
      limit(3),
    ],
    [],
  );
  const { data: testimonials } = useCollection<Testimonial>(
    "testimonials",
    testimonialConstraints,
  );

  const professionalName = settings?.professionalName ?? "Linda Mariotto";
  const heroTitleLines = titleLines(settings?.homeHeroTitle, DEFAULT_HERO_TITLE);
  const manifestoTitleLines = titleLines(
    settings?.homeManifestoTitle,
    DEFAULT_MANIFESTO_TITLE,
  );
  const aboutTitle =
    settings?.homeAboutTitle?.trim() || DEFAULT_ABOUT_TITLE;
  const ctaTitleLines = titleLines(settings?.homeCtaTitle, DEFAULT_CTA_TITLE);

  const t = (value: string | undefined, fallback: string) => value?.trim() || fallback;
  const ctaButtonLabel = t(settings?.ctaButtonLabel, "Raccontami il tuo progetto");
  const bookLinkLabel = t(settings?.bookLinkLabel, "Scopri il libro →");
  const authorLabel = t(settings?.authorLabel, "Autrice");
  const aboutEyebrow = t(settings?.aboutEyebrow, "Chi sono");
  const heroEyebrow = t(settings?.homeHeroEyebrow, "Autrice & Ghostwriter");
  const heroSecondaryLinkLabel = t(settings?.homeHeroSecondaryLinkLabel, "Scopri come lavoro");
  const manifestoSubtitle = t(
    settings?.homeManifestoSubtitle,
    "Il mio lavoro non è sostituirmi a te, ma ascoltare abbastanza bene da trasformare pensieri, ricordi ed esperienze in parole che continuino a sembrarti tue.",
  );
  const aboutLinkLabel = t(settings?.homeAboutLinkLabel, "Continua a leggermi →");
  const servicesEyebrow = t(settings?.homeServicesEyebrow, "Servizi");
  const servicesTitle = t(settings?.homeServicesTitle, "Come posso aiutarti");
  const servicesLinkLabel = t(settings?.homeServicesLinkLabel, "Tutti i servizi →");
  const serviceItemLinkLabel = t(settings?.homeServiceItemLinkLabel, "Scopri il servizio →");
  const approachEyebrow = t(settings?.homeApproachEyebrow, "Approccio");
  const approachTitle = t(settings?.homeApproachTitle, "Come lavoro");
  const approachPhilosophyLabel = t(settings?.homeApproachPhilosophyLabel, "Filosofia");
  const approachMethodLabel = t(settings?.homeApproachMethodLabel, "Metodo");
  const booksTitle = t(
    settings?.homeBooksTitle,
    "Anche le mie storie hanno trovato le loro parole.",
  );
  const booksOthersLabel = t(settings?.homeBooksOthersLabel, "Altre pubblicazioni");
  const booksAllLinkLabel = t(settings?.homeBooksAllLinkLabel, "Tutti i libri →");
  const portfolioEyebrow = t(settings?.homePortfolioEyebrow, "Portfolio");
  const portfolioTitle = t(settings?.homePortfolioTitle, "Lavori selezionati");
  const portfolioLinkLabel = t(settings?.homePortfolioLinkLabel, "Tutti i lavori →");
  const testimonialsEyebrow = t(settings?.homeTestimonialsEyebrow, "Testimonianze");
  const testimonialsTitle = t(settings?.homeTestimonialsTitle, "Dicono di me");
  const testimonialsLinkLabel = t(
    settings?.homeTestimonialsLinkLabel,
    "Leggi tutte le esperienze →",
  );
  const articlesEyebrow = t(settings?.homeArticlesEyebrow, "Magazine");
  const articlesTitle = t(settings?.homeArticlesTitle, "Articoli recenti");
  const articlesLinkLabel = t(settings?.homeArticlesLinkLabel, "Tutti gli articoli →");
  const articleItemLinkLabel = t(settings?.homeArticleItemLinkLabel, "Leggi →");
  const ctaSubtitle = t(
    settings?.homeCtaSubtitle,
    "Raccontami cosa vorresti realizzare. Partiremo da lì.",
  );

  return (
    <>
      <Seo
        title={settings?.seoDefaultTitle ?? "Linda Mariotto — Ghostwriter"}
        description={
          settings?.seoDefaultDescription ??
          "Ghostwriting per libri, biografie, articoli e contenuti social."
        }
      />

      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-end gap-12 px-6 pb-20 pt-14 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:pb-28 md:pt-20">
          <div className="reveal">
            <p className="mb-6 text-xs uppercase tracking-[0.22em] text-accent">
              {heroEyebrow}
            </p>
            <h1 className="max-w-xl text-balance font-serif text-4xl leading-[1.08] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {heroTitleLines.map((line, index) => (
                <span key={`hero-${index}`} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 font-serif text-2xl text-ink md:text-3xl">{professionalName}</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted md:text-xl">
              {settings?.payoff ?? "Do voce alle tue idee, mantenendo la tua voce."}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/contatti"
                className="inline-block bg-ink px-6 py-3.5 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
              >
                {ctaButtonLabel}
              </Link>
              <a
                href="#come-lavoro"
                className="text-sm tracking-wide text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {heroSecondaryLinkLabel}
              </a>
            </div>
          </div>

          {settings?.photoURL ? (
            <div className="reveal reveal-delay-1 relative md:justify-self-end">
              <div
                className="absolute -left-4 top-6 hidden h-[calc(100%-3rem)] w-px bg-line md:block"
                aria-hidden="true"
              />
              <img
                src={settings.photoURL}
                alt={professionalName}
                className="aspect-[3/4] w-full max-w-md object-cover md:ml-auto"
              />
            </div>
          ) : (
            <div
              className="hidden aspect-[3/4] w-full max-w-md bg-paper-deep md:block md:ml-auto"
              aria-hidden="true"
            />
          )}
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <h2 className="text-balance font-serif text-3xl leading-[1.15] text-ink md:text-5xl">
            {manifestoTitleLines.map((line, index) => (
              <span key={`manifesto-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-base leading-[1.85] text-muted md:text-lg">
            {manifestoSubtitle}
          </p>
        </div>
      </section>

      {/* Bio / proposta di valore */}
      {settings?.bio && (
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.35fr_0.65fr] md:gap-16 md:py-28">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent">{aboutEyebrow}</p>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                {aboutTitle}
              </h2>
            </div>
            <div>
              <p className="text-lg leading-[1.75] text-ink md:text-xl">{settings.bio}</p>
              <Link
                to="/chi-sono"
                className="mt-8 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink"
              >
                {aboutLinkLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Servizi — lista editoriale numerata */}
      {services.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">{servicesEyebrow}</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                  {servicesTitle}
                </h2>
              </div>
              <Link
                to="/servizi"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                {servicesLinkLabel}
              </Link>
            </div>

            <ol className="divide-y divide-line border-y border-line">
              {services.map((service, index) => (
                <li key={service.id}>
                  <Link
                    to={`/servizi/${service.slug}`}
                    className="group grid gap-4 py-8 transition-colors md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-10 md:py-10"
                  >
                    <span className="font-serif text-sm tabular-nums text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent md:text-3xl">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                        {service.shortDescription}
                      </p>
                    </div>
                    <span className="text-sm text-muted transition-colors group-hover:text-ink md:self-center">
                      {serviceItemLinkLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="mt-14 text-center">
              <Link
                to="/contatti"
                className="inline-block bg-ink px-6 py-3.5 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
              >
                {ctaButtonLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filosofia + Metodo */}
      {(settings?.philosophy || settings?.method) && (
        <section id="come-lavoro" className="scroll-mt-24 border-b border-line bg-paper-deep/35">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-14 max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-accent">{approachEyebrow}</p>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">{approachTitle}</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              {settings.philosophy && (
                <div className="border-t border-line pt-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-accent">01</p>
                  <h3 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
                    {approachPhilosophyLabel}
                  </h3>
                  <p className="mt-6 leading-[1.8] text-muted">{settings.philosophy}</p>
                </div>
              )}
              {settings.method && (
                <div className="border-t border-line pt-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-accent">02</p>
                  <h3 className="mt-3 font-serif text-2xl text-ink md:text-3xl">
                    {approachMethodLabel}
                  </h3>
                  <p className="mt-6 leading-[1.8] text-muted">{settings.method}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Autorevolezza — libri */}
      {featuredBook && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-14 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-accent">{authorLabel}</p>
              <h2 className="mt-4 text-balance font-serif text-3xl text-ink md:text-4xl">
                {booksTitle}
              </h2>
            </div>

            <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
              {featuredBook.coverURL ? (
                <Link to={`/libri/${featuredBook.slug}`} className="block max-w-xs md:max-w-none">
                  <img
                    src={featuredBook.coverURL}
                    alt={featuredBook.title}
                    className="aspect-[2/3] w-full object-cover transition-opacity hover:opacity-90"
                  />
                </Link>
              ) : (
                <div className="aspect-[2/3] w-full max-w-xs bg-paper-deep" aria-hidden="true" />
              )}

              <div className="md:pt-6">
                <p className="text-xs uppercase tracking-[0.22em] text-accent">{authorLabel}</p>
                <h3 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                  {featuredBook.title}
                </h3>
                {featuredBook.year && (
                  <p className="mt-2 text-sm text-muted">{featuredBook.year}</p>
                )}
                {featuredBook.description && (
                  <p className="mt-6 max-w-lg leading-[1.8] text-muted">
                    {featuredBook.description}
                  </p>
                )}
                <Link
                  to={`/libri/${featuredBook.slug}`}
                  className="mt-8 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink"
                >
                  {bookLinkLabel}
                </Link>
              </div>
            </div>

            {otherBooks.length > 0 && (
              <div className="mt-16 border-t border-line pt-12">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <p className="text-sm text-muted">{booksOthersLabel}</p>
                  <Link
                    to="/libri"
                    className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
                  >
                    {booksAllLinkLabel}
                  </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                  {otherBooks.map((book) => (
                    <Link key={book.id} to={`/libri/${book.slug}`} className="group">
                      {book.coverURL && (
                        <img
                          src={book.coverURL}
                          alt={book.title}
                          className="mb-4 aspect-[2/3] w-full max-w-[10rem] object-cover transition-opacity group-hover:opacity-90"
                        />
                      )}
                      <h3 className="font-serif text-lg text-ink transition-colors group-hover:text-accent">
                        {book.title}
                      </h3>
                      {book.year && <p className="mt-1 text-sm text-muted">{book.year}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherBooks.length === 0 && (
              <div className="mt-12">
                <Link
                  to="/libri"
                  className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
                >
                  {booksAllLinkLabel}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Portfolio — gated by feature flag */}
      {SHOW_PORTFOLIO_PUBLICLY && portfolio.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">{portfolioEyebrow}</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">{portfolioTitle}</h2>
              </div>
              <Link
                to="/lavori"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                {portfolioLinkLabel}
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {portfolio.map((item) => (
                <Link key={item.id} to={`/lavori/${item.slug}`} className="group">
                  {item.imageURL && (
                    <img
                      src={item.imageURL}
                      alt={item.title}
                      className="mb-4 aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-90"
                    />
                  )}
                  <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dicono di me — preview */}
      {testimonials.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">
                  {testimonialsEyebrow}
                </p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                  {testimonialsTitle}
                </h2>
              </div>
              <Link
                to="/dicono-di-me"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                {testimonialsLinkLabel}
              </Link>
            </div>

            <div className="space-y-14 md:space-y-20">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.id}
                  className="border-l border-accent pl-6 md:max-w-3xl md:pl-10"
                >
                  <p className="font-serif text-2xl leading-snug text-ink md:text-3xl md:leading-snug">
                    “{testimonial.comment}”
                  </p>
                  <footer className="mt-6 flex flex-wrap items-center gap-3">
                    <RatingStars rating={testimonial.rating} className="text-sm text-accent" />
                    <cite className="not-italic font-medium text-ink">
                      {testimonial.displayName}
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/contatti"
                className="inline-block border border-ink px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {ctaButtonLabel}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Articoli */}
      {articles.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">{articlesEyebrow}</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">{articlesTitle}</h2>
              </div>
              <Link
                to="/articoli"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                {articlesLinkLabel}
              </Link>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articoli/${article.slug}`}
                  className="group grid gap-3 py-8 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-10"
                >
                  <time className="text-sm text-muted">
                    {article.publishedAt ? formatDate(article.publishedAt, "d MMM yyyy") : ""}
                  </time>
                  <div>
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{article.excerpt}</p>
                  </div>
                  <span className="text-sm text-muted md:pt-1">{articleItemLinkLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA finale */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <h2 className="text-balance font-serif text-3xl leading-[1.15] text-ink md:text-5xl">
            {ctaTitleLines.map((line, index) => (
              <span key={`cta-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-8 max-w-md leading-relaxed text-muted">{ctaSubtitle}</p>
          <Link
            to="/contatti"
            className="mt-10 inline-block bg-ink px-6 py-3.5 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
          >
            {ctaButtonLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
