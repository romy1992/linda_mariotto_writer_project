import { useMemo } from "react";
import { Link } from "react-router-dom";
import { where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { Book } from "../../types";

export function Books() {
  const constraints = useMemo(() => [where("status", "==", "published")], []);
  const { data: books } = useCollection<Book>("books", constraints);

  return (
    <>
      <Seo title="Libri — Linda Mariotto" description="Libri e pubblicazioni." />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Pubblicazioni</p>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">Libri</h1>
          <p className="mt-5 leading-relaxed text-muted">
            Storie che hanno trovato la propria forma sulla pagina.
          </p>
        </div>

        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {books.map((book, index) => (
            <article
              key={book.id}
              className={`grid items-start gap-8 border-t border-line pt-10 md:grid-cols-[200px_1fr] md:gap-14 md:pt-14 ${
                index % 2 === 1 ? "md:grid-cols-[1fr_200px]" : ""
              }`}
            >
              <Link
                to={`/libri/${book.slug}`}
                className={`block max-w-[200px] ${index % 2 === 1 ? "md:order-2 md:justify-self-end" : ""}`}
              >
                {book.coverURL ? (
                  <img
                    src={book.coverURL}
                    alt={book.title}
                    className="aspect-[2/3] w-full object-cover transition-opacity hover:opacity-90"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-paper-deep" aria-hidden="true" />
                )}
              </Link>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Autrice</p>
                <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                  <Link to={`/libri/${book.slug}`} className="transition-colors hover:text-accent">
                    {book.title}
                  </Link>
                </h2>
                {book.year > 0 && <p className="mt-2 text-sm text-muted">{book.year}</p>}
                {book.description && (
                  <p className="mt-5 max-w-xl leading-[1.8] text-muted">{book.description}</p>
                )}
                <Link
                  to={`/libri/${book.slug}`}
                  className="mt-6 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink"
                >
                  Scopri il libro →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
