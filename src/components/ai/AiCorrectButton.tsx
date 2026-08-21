import { useState } from "react";
import { correctFieldText, getAiErrorMessage, type ContentType } from "../../services/ai.service";

export function AiCorrectButton({
  contentType,
  fieldKey,
  getText,
  onCorrected,
}: {
  contentType: ContentType;
  fieldKey: string;
  getText: () => string;
  onCorrected: (text: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    const text = getText();
    if (!text.trim()) {
      setError("Scrivi prima un testo da correggere.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const corrected = await correctFieldText(contentType, fieldKey, text);
      onCorrected(corrected);
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
        {loading ? "Correzione…" : "Correggi punteggiatura"}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
