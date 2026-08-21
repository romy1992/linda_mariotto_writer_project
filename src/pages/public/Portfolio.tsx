import { useMemo } from "react";
import { Link } from "react-router-dom";
import { orderBy, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { PortfolioItem } from "../../types";

export function Portfolio() {
  const constraints = useMemo(
    () => [
      where("status", "==", "published"),
      where("visibility", "==", "public"),
      orderBy("year", "desc"),
    ],
    [],
  );
  const { data: items } = useCollection<PortfolioItem>("portfolio", constraints);

  return (
    <>
      <Seo title="Lavori — Linda Mariotto" description="Progetti di ghostwriting selezionati." />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Portfolio</p>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">Lavori</h1>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} to={`/lavori/${item.slug}`} className="group">
              {item.imageURL && (
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="mb-4 aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-90"
                />
              )}
              <h2 className="font-serif text-xl text-ink transition-colors group-hover:text-accent">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {item.category} — {item.year}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
