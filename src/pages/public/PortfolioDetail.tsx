import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { limit, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { PortfolioItem } from "../../types";

export function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const constraints = useMemo(
    () => [
      where("slug", "==", slug),
      where("status", "==", "published"),
      where("visibility", "==", "public"),
      limit(1),
    ],
    [slug],
  );
  const { data, isLoading } = useCollection<PortfolioItem>("portfolio", constraints);
  const item = data[0];

  if (isLoading) return null;

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-muted">Lavoro non trovato.</p>
        <Link to="/lavori" className="mt-4 inline-block text-sm text-accent">
          ← Torna ai lavori
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo title={item.title} description={item.description} />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/lavori" className="mb-8 inline-block text-sm text-accent">
          ← Tutti i lavori
        </Link>
        <h1 className="mb-2 font-serif text-3xl text-ink md:text-4xl">{item.title}</h1>
        <p className="mb-6 text-sm text-muted">
          {item.category} — {item.year}
          {item.client ? ` — ${item.client}` : ""}
        </p>
        {item.imageURL && (
          <img src={item.imageURL} alt={item.title} className="mb-8 w-full object-cover" />
        )}
        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
        {item.externalLink && (
          <a
            href={item.externalLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block text-sm text-accent"
          >
            Vedi il progetto →
          </a>
        )}
      </section>
    </>
  );
}
