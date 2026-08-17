import { Link } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
import { booksService } from "../../../services/books.service";
import type { Book } from "../../../types";

export function BooksList() {
  const { data: books } = useCollection<Book>("books");

  async function handleDelete(id: string) {
    if (confirm("Eliminare questo libro?")) {
      await booksService.remove(id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-ink">Libri</h1>
        <Link to="/admin/libri/nuovo" className="bg-ink px-4 py-2 text-sm text-paper">
          + Nuovo libro
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Titolo</th>
              <th className="py-2">Anno</th>
              <th className="py-2">Stato</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-line">
                <td className="py-3 text-ink">{book.title}</td>
                <td className="py-3 text-muted">{book.year}</td>
                <td className="py-3 text-muted">{book.status}</td>
                <td className="py-3 text-right">
                  <Link to={`/admin/libri/${book.id}`} className="mr-4 text-accent">
                    Modifica
                  </Link>
                  <button onClick={() => handleDelete(book.id)} className="text-red-700">
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
