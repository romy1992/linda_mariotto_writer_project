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
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Link to="/libri" className="mb-8 inline-block text-sm text-accent">
          ← Tutti i libri
        </Link>
        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          {book.coverURL && (
            <img src={book.coverURL} alt={book.title} className="aspect-[2/3] w-full object-cover" />
          )}
          <div>
            <h1 className="mb-2 font-serif text-3xl text-ink">{book.title}</h1>
            <p className="mb-6 text-sm text-muted">
              {book.year}
              {book.publisher ? ` — ${book.publisher}` : ""}
              {book.isbn ? ` — ISBN ${book.isbn}` : ""}
            </p>
            <p className="leading-relaxed text-ink">{book.description}</p>
            <div className="mt-8 flex gap-4 text-sm text-accent">
              {book.purchaseLink && (
                <a href={book.purchaseLink} target="_blank" rel="noreferrer">
                  Acquista
                </a>
              )}
              {book.externalLink && (
                <a href={book.externalLink} target="_blank" rel="noreferrer">
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
