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
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Lavori</h1>
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} to={`/lavori/${item.slug}`} className="group">
              {item.imageURL && (
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="mb-3 aspect-[4/3] w-full object-cover"
                />
              )}
              <h2 className="font-serif text-lg text-ink">{item.title}</h2>
              <p className="text-sm text-muted">
                {item.category} — {item.year}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
