import { useMemo } from "react";
import { Link } from "react-router-dom";
import { orderBy, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import type { Service } from "../../types";

export function Services() {
  const constraints = useMemo(
    () => [where("status", "==", "published"), orderBy("order")],
    [],
  );
  const { data: services } = useCollection<Service>("services", constraints);

  return (
    <>
      <Seo title="Servizi — Linda Mariotto" description="Servizi di ghostwriting su misura." />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Offerta</p>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">Servizi</h1>
          <p className="mt-5 leading-relaxed text-muted">
            Percorsi di scrittura su misura, dal primo ascolto alla voce finale del progetto.
          </p>
        </div>

        <ol className="mt-16 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <li key={service.id}>
              <Link
                to={`/servizi/${service.slug}`}
                className="group grid gap-4 py-10 transition-colors md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-12"
              >
                <span className="font-serif text-sm tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-ink transition-colors group-hover:text-accent md:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                    {service.shortDescription}
                  </p>
                </div>
                <span className="text-sm text-muted transition-colors group-hover:text-ink md:self-center">
                  Approfondisci →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
