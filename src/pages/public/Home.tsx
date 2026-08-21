import { useMemo } from "react";
import { Link } from "react-router-dom";
import { limit, orderBy, where } from "firebase/firestore";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import { RatingStars } from "../../components/testimonials/RatingStars";
import { SHOW_PORTFOLIO_PUBLICLY } from "../../constants/features";
import type {
  Article,
  Book,
  PortfolioItem,
  Service,
  SiteSettings,
  Testimonial,
} from "../../types";

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
        <div className="mx-auto grid max-w-6xl items-end gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:pb-28 md:pt-24">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.22em] text-accent">Ghostwriter</p>
            <h1 className="max-w-xl text-balance font-serif text-5xl leading-[1.05] text-ink md:text-7xl">
              {professionalName}
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted md:text-xl">
              {settings?.payoff ?? "Do voce alle tue idee, mantenendo la tua voce."}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/contatti"
                className="inline-block bg-ink px-6 py-3.5 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
              >
                Raccontami il tuo progetto
              </Link>
              <Link
                to="/servizi"
                className="text-sm tracking-wide text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Scopri i servizi
              </Link>
            </div>
          </div>

          {settings?.photoURL ? (
            <div className="relative md:justify-self-end">
              <div className="absolute -left-4 top-6 hidden h-[calc(100%-3rem)] w-px bg-line md:block" aria-hidden="true" />
              <img
                src={settings.photoURL}
                alt={professionalName}
                className="aspect-[4/5] w-full max-w-md object-cover md:ml-auto"
              />
            </div>
          ) : (
            <div
              className="hidden aspect-[4/5] w-full max-w-md bg-paper-deep md:block md:ml-auto"
              aria-hidden="true"
            />
          )}
        </div>
      </section>

      {/* Bio / proposta di valore */}
      {settings?.bio && (
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.35fr_0.65fr] md:gap-16 md:py-28">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent">Chi sono</p>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Una voce al servizio della tua</h2>
            </div>
            <div>
              <p className="text-lg leading-[1.75] text-ink md:text-xl">{settings.bio}</p>
              <Link
                to="/chi-sono"
                className="mt-8 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink"
              >
                Continua a leggermi →
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
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Servizi</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Come posso aiutarti</h2>
              </div>
              <Link
                to="/servizi"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                Tutti i servizi →
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
                    <span className="text-sm text-muted opacity-0 transition-opacity group-hover:opacity-100 md:self-center">
                      Apri →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Filosofia + Metodo */}
      {(settings?.philosophy || settings?.method) && (
        <section className="border-b border-line bg-paper-deep/35">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
            {settings.philosophy && (
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Filosofia</p>
                <h2 className="mt-4 font-serif text-3xl text-ink">Come penso la scrittura</h2>
                <p className="mt-6 leading-[1.8] text-muted">{settings.philosophy}</p>
              </div>
            )}
            {settings.method && (
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Metodo</p>
                <h2 className="mt-4 font-serif text-3xl text-ink">Come lavoro</h2>
                <p className="mt-6 leading-[1.8] text-muted">{settings.method}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Autorevolezza — libri */}
      {books.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Autrice</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Libri pubblicati</h2>
              </div>
              <Link
                to="/libri"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                Tutti i libri →
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {books.map((book) => (
                <Link key={book.id} to={`/libri/${book.slug}`} className="group">
                  {book.coverURL && (
                    <img
                      src={book.coverURL}
                      alt={book.title}
                      className="mb-4 aspect-[2/3] w-full object-cover transition-opacity group-hover:opacity-90"
                    />
                  )}
                  <h3 className="font-serif text-lg text-ink">{book.title}</h3>
                  <p className="mt-1 text-sm text-muted">{book.year}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio — gated by feature flag */}
      {SHOW_PORTFOLIO_PUBLICLY && portfolio.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Portfolio</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Lavori selezionati</h2>
              </div>
              <Link
                to="/lavori"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                Tutti i lavori →
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
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Testimonianze</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Dicono di me</h2>
              </div>
              <Link
                to="/dicono-di-me"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                Leggi tutte le recensioni →
              </Link>
            </div>

            <div className="space-y-12 md:space-y-16">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.id} className="border-l border-accent pl-6 md:pl-10">
                  <p className="font-serif text-2xl leading-snug text-ink md:text-3xl md:leading-snug">
                    “{testimonial.comment}”
                  </p>
                  <footer className="mt-6 flex flex-wrap items-center gap-3">
                    <cite className="not-italic text-sm text-muted">{testimonial.displayName}</cite>
                    <RatingStars rating={testimonial.rating} className="text-sm text-accent" />
                  </footer>
                </blockquote>
              ))}
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
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Scrittura</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Articoli recenti</h2>
              </div>
              <Link
                to="/articoli"
                className="text-sm tracking-wide text-muted transition-colors hover:text-ink"
              >
                Tutti gli articoli →
              </Link>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articoli/${article.slug}`}
                  className="group grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10"
                >
                  <div>
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{article.excerpt}</p>
                  </div>
                  <span className="text-sm text-muted md:pt-1">Leggi →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contatto */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">Contatti</p>
            <h2 className="mt-4 max-w-xl text-balance font-serif text-3xl text-ink md:text-5xl">
              Hai una storia da raccontare?
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              Scrivimi: ascolto il progetto, ne capisco la voce e ti propongo il percorso più
              adatto.
            </p>
          </div>
          <Link
            to="/contatti"
            className="inline-block border border-ink px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Raccontami il tuo progetto
          </Link>
        </div>
      </section>
    </>
  );
}
