import { httpsCallable, FunctionsError } from "firebase/functions";
import { functions } from "../firebase/config";

// Deve restare sincronizzato con functions/src/ai/types.ts — i due progetti
// hanno build separate (frontend Vite/ESM, Cloud Functions CommonJS) e non
// condividono un tsconfig, quindi il tipo viene duplicato qui.
export type ContentType = "article" | "service" | "portfolio" | "book" | "social";

interface GenerateFieldResponse {
  text: string;
}

interface GenerateFieldRequest {
  mode?: "generate" | "correct";
  contentType: ContentType;
  fieldKey: string;
  context: Record<string, string>;
  text?: string;
}

const generateFieldContentCallable = httpsCallable<GenerateFieldRequest, GenerateFieldResponse>(
  functions,
  "generateFieldContent",
);

export async function generateFieldContent(
  contentType: ContentType,
  fieldKey: string,
  context: Record<string, string>,
): Promise<string> {
  const result = await generateFieldContentCallable({ contentType, fieldKey, context });
  return result.data.text;
}

export async function correctFieldText(
  contentType: ContentType,
  fieldKey: string,
  text: string,
): Promise<string> {
  const result = await generateFieldContentCallable({
    mode: "correct",
    contentType,
    fieldKey,
    context: {},
    text,
  });
  return result.data.text;
}

export function getAiErrorMessage(error: unknown): string {
  if (error instanceof FunctionsError) {
    switch (error.code) {
      case "functions/unauthenticated":
      case "functions/permission-denied":
        return "Permesso negato: non risulti autenticato come amministratore. Prova a rifare il login.";
      case "functions/invalid-argument":
        return "Non è stato possibile generare il contenuto: compila prima gli altri campi del form.";
      default:
        return "Generazione non riuscita. Riprova.";
    }
  }
  return "Generazione non riuscita. Riprova.";
}
