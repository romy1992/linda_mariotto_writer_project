import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref, type StorageReference } from "firebase/storage";
import { storage } from "../../firebase/config";
import { deleteMedia } from "../../services/storage.service";

const FOLDERS = ["profile", "services", "portfolio", "books", "articles", "social"];

interface MediaFile {
  path: string;
  url: string;
}

export function Media() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadFiles() {
    setIsLoading(true);
    const results: MediaFile[] = [];
    for (const folder of FOLDERS) {
      try {
        const folderRef = ref(storage, folder);
        const list = await listAll(folderRef);
        for (const item of list.items as StorageReference[]) {
          const url = await getDownloadURL(item);
          results.push({ path: item.fullPath, url });
        }
      } catch {
        // folder may not exist yet
      }
    }
    setFiles(results);
    setIsLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleDelete(path: string) {
    if (confirm("Eliminare questo file?")) {
      await deleteMedia(path);
      setFiles((prev) => prev.filter((f) => f.path !== path));
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-ink">Media</h1>
      {isLoading ? (
        <p className="text-muted">Caricamento…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <div key={file.path} className="border border-line p-2">
              <img src={file.url} alt="" className="mb-2 aspect-square w-full object-cover" />
              <p className="truncate text-xs text-muted" title={file.path}>
                {file.path}
              </p>
              <button
                onClick={() => handleDelete(file.path)}
                className="mt-1 text-xs text-red-700"
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
