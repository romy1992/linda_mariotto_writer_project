import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { limit, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { Book } from "../../types";

export function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const constraints = useMemo(
    () => [where("slug", "==", slug), where("status", "==", "published"), limit(1)],
    [slug],
  );
  const { data, isLoading } = useCollection<Book>("books", constraints);
  const book = data[0];

  if (isLoading) return null;

  if (!book) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-muted">Libro non trovato.</p>
        <Link to="/libri" className="mt-4 inline-block text-sm text-accent">
          ← Torna ai libri
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo title={book.title} description={book.description} />
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <Link to="/libri" className="mb-10 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink">
          ← Tutti i libri
        </Link>
        <div className="grid gap-12 md:grid-cols-[240px_1fr] md:gap-16">
          {book.coverURL && (
            <img src={book.coverURL} alt={book.title} className="aspect-[2/3] w-full object-cover" />
          )}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Libro</p>
            <h1 className="mb-4 font-serif text-4xl text-ink md:text-5xl">{book.title}</h1>
            <p className="mb-8 text-sm text-muted">
              {book.year}
              {book.publisher ? ` — ${book.publisher}` : ""}
              {book.isbn ? ` — ISBN ${book.isbn}` : ""}
            </p>
            <p className="max-w-2xl leading-[1.8] text-ink">{book.description}</p>
            <div className="mt-10 flex flex-wrap gap-6 text-sm tracking-wide text-accent">
              {book.purchaseLink && (
                <a href={book.purchaseLink} target="_blank" rel="noreferrer" className="hover:text-ink">
                  Acquista
                </a>
              )}
              {book.externalLink && (
                <a href={book.externalLink} target="_blank" rel="noreferrer" className="hover:text-ink">
                  Scopri di più
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
