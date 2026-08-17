import { Link } from "react-router-dom";
import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { socialPostsService } from "../../../services/socialPosts.service";
import type { SocialPost } from "../../../types";

export function SocialList() {
  const constraints = useMemo(() => [orderBy("updatedAt", "desc")], []);
  const { data: posts } = useCollection<SocialPost>("socialPosts", constraints);

  async function handleDelete(id: string) {
    if (confirm("Eliminare questo contenuto?")) {
      await socialPostsService.remove(id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-ink">Social</h1>
        <Link to="/admin/social/nuovo" className="bg-ink px-4 py-2 text-sm text-paper">
          + Nuovo contenuto
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Titolo interno</th>
              <th className="py-2">Piattaforma</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Stato</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-line">
                <td className="py-3 text-ink">{post.internalTitle}</td>
                <td className="py-3 text-muted">{post.platform}</td>
                <td className="py-3 text-muted">{post.type}</td>
                <td className="py-3 text-muted">{post.status}</td>
                <td className="py-3 text-right">
                  <Link to={`/admin/social/${post.id}`} className="mr-4 text-accent">
                    Modifica
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-700">
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
