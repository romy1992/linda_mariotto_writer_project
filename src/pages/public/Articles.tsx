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
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Articoli</h1>
        <div className="space-y-10">
          {articles.map((article) => (
            <Link key={article.id} to={`/articoli/${article.slug}`} className="block group">
              <p className="text-sm text-muted">
                {article.publishedAt ? formatDate(article.publishedAt) : ""} · {article.category}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-ink">{article.title}</h2>
              <p className="mt-2 text-muted">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
