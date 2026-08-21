import { useMemo } from "react";
import { Link } from "react-router-dom";
import { limit, orderBy, where } from "firebase/firestore";
import { useDocument } from "../../hooks/useDocument";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import { SHOW_PORTFOLIO_PUBLICLY } from "../../constants/features";
import type { Article, PortfolioItem, Service, SiteSettings } from "../../types";

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

  return (
    <>
      <Seo
        title={settings?.seoDefaultTitle ?? "Linda Mariotto — Ghostwriter"}
        description={
          settings?.seoDefaultDescription ??
          "Ghostwriting per libri, biografie, articoli e contenuti social."
        }
      />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-24">
        <p className="mb-4 text-sm uppercase tracking-widest text-accent">Ghostwriter</p>
        <h1 className="font-serif text-4xl leading-tight text-ink md:text-6xl">
          {settings?.professionalName ?? "Linda Mariotto"}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          {settings?.payoff ?? "Do voce alle tue idee, mantenendo la tua voce."}
        </p>
        <Link
          to="/contatti"
          className="mt-8 inline-block border border-ink px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Parliamo del tuo progetto
        </Link>
      </section>

      {settings?.bio && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="max-w-2xl text-lg leading-relaxed text-ink">{settings.bio}</p>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="mb-8 font-serif text-2xl text-ink">Servizi</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/servizi/${service.slug}`}
                  className="border border-line p-6 transition-colors hover:border-accent"
                >
                  <h3 className="font-serif text-xl text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted">{service.shortDescription}</p>
                </Link>
              ))}
            </div>
            <Link to="/servizi" className="mt-6 inline-block text-sm text-accent">
              Tutti i servizi →
            </Link>
          </div>
        </section>
      )}

      {SHOW_PORTFOLIO_PUBLICLY && portfolio.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="mb-8 font-serif text-2xl text-ink">Lavori selezionati</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {portfolio.map((item) => (
                <Link key={item.id} to={`/lavori/${item.slug}`} className="group">
                  {item.imageURL && (
                    <img
                      src={item.imageURL}
                      alt={item.title}
                      className="mb-3 aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <h3 className="font-serif text-lg text-ink">{item.title}</h3>
                  <p className="text-sm text-muted">{item.category}</p>
                </Link>
              ))}
            </div>
            <Link to="/lavori" className="mt-6 inline-block text-sm text-accent">
              Tutti i lavori →
            </Link>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="mb-8 font-serif text-2xl text-ink">Articoli recenti</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} to={`/articoli/${article.slug}`} className="group">
                  <h3 className="font-serif text-lg text-ink">{article.title}</h3>
                  <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                </Link>
              ))}
            </div>
            <Link to="/articoli" className="mt-6 inline-block text-sm text-accent">
              Tutti gli articoli →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
