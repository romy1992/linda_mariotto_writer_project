export type ContentType = "article" | "service" | "portfolio" | "book" | "social";
export type AiMode = "generate" | "correct";

export interface GenerateFieldRequest {
  mode?: AiMode;
  contentType: ContentType;
  fieldKey: string;
  context: Record<string, string>;
  /** Testo attuale del campo da correggere. Richiesto quando mode === "correct". */
  text?: string;
}

export interface GenerateFieldResponse {
  text: string;
}
