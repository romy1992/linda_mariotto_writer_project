import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { assertAdmin } from "./auth/adminGuard";
import { getAnthropicClient, anthropicApiKey } from "./ai/anthropicClient";
import { getFieldConfig, buildCorrectionPrompt, CORRECTION_MODEL, type AiModel } from "./ai/promptTemplates";
import type { GenerateFieldRequest, GenerateFieldResponse } from "./ai/types";

export const generateFieldContent = onCall(
  { region: "europe-west1", secrets: [anthropicApiKey] },
  async (request: CallableRequest<GenerateFieldRequest>): Promise<GenerateFieldResponse> => {
    assertAdmin(request);

    const { mode = "generate", contentType, fieldKey, context, text } =
      request.data ?? ({} as GenerateFieldRequest);
    if (!contentType || !fieldKey || typeof context !== "object" || context === null) {
      throw new HttpsError("invalid-argument", "Parametri mancanti o non validi.");
    }

    const fieldConfig = getFieldConfig(contentType, fieldKey);
    if (!fieldConfig) {
      throw new HttpsError("invalid-argument", `Campo non supportato: ${contentType}.${fieldKey}`);
    }

    let prompt: string;
    let model: AiModel;

    if (mode === "correct") {
      if (typeof text !== "string" || !text.trim()) {
        throw new HttpsError("invalid-argument", "Nessun testo da correggere.");
      }
      prompt = buildCorrectionPrompt(fieldConfig.isHtml, text);
      model = CORRECTION_MODEL;
    } else {
      prompt = fieldConfig.buildPrompt(context);
      model = fieldConfig.model;
    }

    try {
      const client = getAnthropicClient();
      const message = await client.messages.create({
        model,
        max_tokens: fieldConfig.maxTokens,
        // Generazione/correzione dirette: il ragionamento esteso non serve
        // e su Sonnet 5 è attivo di default se il parametro viene omesso.
        thinking: model === "claude-sonnet-5" ? { type: "disabled" } : undefined,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = message.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new HttpsError("internal", "Nessun contenuto testuale generato.");
      }

      return { text: textBlock.text.trim() };
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }
      console.error("generateFieldContent error", error);
      throw new HttpsError("internal", "Errore durante la generazione del contenuto.");
    }
  }
);
