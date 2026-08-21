import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { limit, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { Service } from "../../types";

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const constraints = useMemo(
    () => [where("slug", "==", slug), where("status", "==", "published"), limit(1)],
    [slug],
  );
  const { data, isLoading } = useCollection<Service>("services", constraints);
  const service = data[0];

  if (isLoading) return null;

  if (!service) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-muted">Servizio non trovato.</p>
        <Link to="/servizi" className="mt-4 inline-block text-sm text-accent">
          ← Torna ai servizi
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo title={service.seoTitle || service.title} description={service.metaDescription || service.shortDescription} />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link to="/servizi" className="mb-10 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink">
          ← Tutti i servizi
        </Link>
        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Servizio</p>
        <h1 className="mb-8 font-serif text-4xl text-ink md:text-5xl">{service.title}</h1>
        {service.imageURL && (
          <img src={service.imageURL} alt={service.title} className="mb-10 w-full object-cover" />
        )}
        <div
          className="prose prose-neutral prose-editorial max-w-none"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
        <Link
          to="/contatti"
          className="mt-12 inline-block border border-ink px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Raccontami il tuo progetto
        </Link>
      </section>
    </>
  );
}
