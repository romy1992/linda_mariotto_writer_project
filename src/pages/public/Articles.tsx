import { useMemo } from "react";
import { Link } from "react-router-dom";
import { orderBy, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import { formatDate } from "../../utils/formatDate";
import type { Article } from "../../types";

export function Articles() {
  const constraints = useMemo(
    () => [where("status", "==", "published"), orderBy("publishedAt", "desc")],
    [],
  );
  const { data: articles } = useCollection<Article>("articles", constraints);

  return (
    <>
      <Seo title="Articoli — Linda Mariotto" description="Riflessioni su scrittura e storytelling." />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Scrittura</p>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">Articoli</h1>
        </div>
        <div className="mt-14 divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <Link key={article.id} to={`/articoli/${article.slug}`} className="group block py-10">
              <p className="text-sm text-muted">
                {article.publishedAt ? formatDate(article.publishedAt) : ""} · {article.category}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-accent md:text-3xl">
                {article.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
