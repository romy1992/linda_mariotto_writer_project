import { useState } from "react";
import { generateFieldContent, getAiErrorMessage, type ContentType } from "../../services/ai.service";

export function AiGenerateButton({
  contentType,
  fieldKey,
  context,
  onGenerated,
}: {
  contentType: ContentType;
  fieldKey: string;
  context: Record<string, string>;
  onGenerated: (text: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const text = await generateFieldContent(contentType, fieldKey, context);
      onGenerated(text);
    } catch (err) {
      setError(getAiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="border border-line px-2 py-1 text-xs text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generazione…" : "Genera con AI"}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
