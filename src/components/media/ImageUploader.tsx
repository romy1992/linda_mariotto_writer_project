import { useState, type ChangeEvent } from "react";
import { uploadMedia } from "../../services/storage.service";

interface ImageUploaderProps {
  folder: string;
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ folder, value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const path = `${folder}/${Date.now()}-${file.name}`;
      const url = await uploadMedia(path, file);
      onChange(url);
    } catch {
      setError("Upload non riuscito.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      {value && (
        <img src={value} alt="" className="mb-3 max-h-48 w-auto max-w-full object-cover" />
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <p className="mt-1 text-xs text-muted">Caricamento…</p>}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
