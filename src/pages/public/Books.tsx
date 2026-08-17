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
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Libri</h1>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {books.map((book) => (
            <Link key={book.id} to={`/libri/${book.slug}`} className="group">
              {book.coverURL && (
                <img
                  src={book.coverURL}
                  alt={book.title}
                  className="mb-3 aspect-[2/3] w-full object-cover"
                />
              )}
              <h2 className="font-serif text-base text-ink">{book.title}</h2>
              <p className="text-sm text-muted">{book.year}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
