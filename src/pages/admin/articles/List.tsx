import { Link } from "react-router-dom";
import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { articlesService } from "../../../services/articles.service";
import type { Article } from "../../../types";

export function ArticlesList() {
  const constraints = useMemo(() => [orderBy("createdAt", "desc")], []);
  const { data: articles } = useCollection<Article>("articles", constraints);

  async function handleDelete(id: string) {
    if (confirm("Eliminare questo articolo?")) {
      await articlesService.remove(id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-ink">Articoli</h1>
        <Link to="/admin/articoli/nuovo" className="bg-ink px-4 py-2 text-sm text-paper">
          + Nuovo articolo
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Titolo</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Stato</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-line">
                <td className="py-3 text-ink">{article.title}</td>
                <td className="py-3 text-muted">{article.category}</td>
                <td className="py-3 text-muted">{article.status}</td>
                <td className="py-3 text-right">
                  <Link to={`/admin/articoli/${article.id}`} className="mr-4 text-accent">
                    Modifica
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-700">
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
