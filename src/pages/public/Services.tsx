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
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Servizi</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/servizi/${service.slug}`}
              className="border border-line p-8 transition-colors hover:border-accent"
            >
              <h2 className="font-serif text-xl text-ink">{service.title}</h2>
              <p className="mt-3 text-muted">{service.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
