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
        </div>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {books.map((book) => (
            <Link key={book.id} to={`/libri/${book.slug}`} className="group">
              {book.coverURL && (
                <img
                  src={book.coverURL}
                  alt={book.title}
                  className="mb-4 aspect-[2/3] w-full object-cover transition-opacity group-hover:opacity-90"
                />
              )}
              <h2 className="font-serif text-lg text-ink transition-colors group-hover:text-accent">
                {book.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{book.year}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
