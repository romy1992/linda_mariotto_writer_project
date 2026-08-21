import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { limit, where } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { Seo } from "../../components/seo/Seo";
import { formatDate } from "../../utils/formatDate";
import type { Article } from "../../types";

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const constraints = useMemo(
    () => [where("slug", "==", slug), where("status", "==", "published"), limit(1)],
    [slug],
  );
  const { data, isLoading } = useCollection<Article>("articles", constraints);
  const article = data[0];

  if (isLoading) return null;

  if (!article) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-muted">Articolo non trovato.</p>
        <Link to="/articoli" className="mt-4 inline-block text-sm text-accent">
          ← Torna agli articoli
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={article.seoTitle || article.title}
        description={article.metaDescription || article.excerpt}
        image={article.coverURL}
      />
      <article className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link to="/articoli" className="mb-10 inline-block text-sm tracking-wide text-accent transition-colors hover:text-ink">
          ← Tutti gli articoli
        </Link>
        <p className="text-sm text-muted">
          {article.publishedAt ? formatDate(article.publishedAt) : ""} · {article.category}
        </p>
        <h1 className="mb-8 mt-3 font-serif text-4xl text-ink md:text-5xl">{article.title}</h1>
        {article.coverURL && (
          <img src={article.coverURL} alt={article.title} className="mb-10 w-full object-cover" />
        )}
        <div
          className="prose prose-neutral prose-editorial max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        {article.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="border border-line px-3 py-1 text-xs tracking-wide text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
