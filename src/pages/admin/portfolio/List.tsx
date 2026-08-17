import { Link } from "react-router-dom";
import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { portfolioService } from "../../../services/portfolio.service";
import type { PortfolioItem } from "../../../types";

export function PortfolioList() {
  const constraints = useMemo(() => [orderBy("year", "desc")], []);
  const { data: items } = useCollection<PortfolioItem>("portfolio", constraints);

  async function handleDelete(id: string) {
    if (confirm("Eliminare questo lavoro?")) {
      await portfolioService.remove(id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-ink">Lavori</h1>
        <Link to="/admin/lavori/nuovo" className="bg-ink px-4 py-2 text-sm text-paper">
          + Nuovo lavoro
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Titolo</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Stato</th>
              <th className="py-2">Visibilità</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="py-3 text-ink">{item.title}</td>
                <td className="py-3 text-muted">{item.category}</td>
                <td className="py-3 text-muted">{item.status}</td>
                <td className="py-3 text-muted">{item.visibility}</td>
                <td className="py-3 text-right">
                  <Link to={`/admin/lavori/${item.id}`} className="mr-4 text-accent">
                    Modifica
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="text-red-700">
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
