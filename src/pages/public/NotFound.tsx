import { Link } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";

export function NotFound() {
  return (
    <>
      <Seo title="Pagina non trovata — Linda Mariotto" description="Pagina non trovata." />
      <section className="mx-auto max-w-xl px-6 py-32 text-center md:py-40">
        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">404</p>
        <h1 className="mb-6 font-serif text-4xl text-ink">Pagina non trovata</h1>
        <Link to="/" className="text-sm tracking-wide text-accent transition-colors hover:text-ink">
          ← Torna alla home
        </Link>
      </section>
    </>
  );
}
