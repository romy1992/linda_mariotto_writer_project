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
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/servizi" className="mb-8 inline-block text-sm text-accent">
          ← Tutti i servizi
        </Link>
        <h1 className="mb-6 font-serif text-3xl text-ink md:text-4xl">{service.title}</h1>
        {service.imageURL && (
          <img src={service.imageURL} alt={service.title} className="mb-8 w-full object-cover" />
        )}
        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
        <Link
          to="/contatti"
          className="mt-10 inline-block border border-ink px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Richiedi informazioni
        </Link>
      </section>
    </>
  );
}
