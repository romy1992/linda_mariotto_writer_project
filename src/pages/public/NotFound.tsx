import { Link } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";

export function NotFound() {
  return (
    <>
      <Seo title="Pagina non trovata — Linda Mariotto" description="Pagina non trovata." />
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="mb-4 font-serif text-3xl text-ink">Pagina non trovata</h1>
        <Link to="/" className="text-sm text-accent">
          ← Torna alla home
        </Link>
      </section>
    </>
  );
}
