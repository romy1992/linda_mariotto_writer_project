import type { ContentType } from "./types";

export type AiModel = "claude-haiku-4-5" | "claude-sonnet-5";

export interface FieldConfig {
  model: AiModel;
  maxTokens: number;
  isHtml: boolean;
  buildPrompt: (context: Record<string, string>) => string;
}

const HTML_INSTRUCTIONS =
  "Rispondi solo con HTML semplice, usando esclusivamente questi tag quando utile: <p>, <h2>, <h3>, <ul>, <li>, <blockquote>, <strong>, <em>. Non includere markdown, non includere i tag <html> o <body>, non aggiungere commenti o spiegazioni al di fuori dell'HTML.";

const PLAIN_INSTRUCTIONS =
  "Rispondi solo con il testo richiesto, senza markdown, senza virgolette introduttive, senza spiegazioni aggiuntive.";

// Correzione: sempre Haiku 4.5, compito meccanico che non richiede un modello più costoso.
export const CORRECTION_MODEL: AiModel = "claude-haiku-4-5";

export function buildCorrectionPrompt(isHtml: boolean, text: string): string {
  const task =
    "Correggi solo errori di ortografia, punteggiatura e grammatica nel seguente testo in italiano. Non riscrivere il contenuto, non aggiungere o togliere frasi, non cambiare significato, tono o stile: correggi esclusivamente gli errori.";

  if (isHtml) {
    return `${task} Il testo è HTML: mantieni invariati tutti i tag e la loro struttura, correggi solo il testo al loro interno.\n\nTesto:\n${text}\n\n${HTML_INSTRUCTIONS}`;
  }
  return `${task}\n\nTesto:\n${text}\n\n${PLAIN_INSTRUCTIONS}`;
}

function contextLines(context: Record<string, string>): string {
  const lines = Object.entries(context)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .map(([key, value]) => `- ${key}: ${value.trim()}`);
  return lines.length > 0 ? lines.join("\n") : "(nessun contesto aggiuntivo disponibile)";
}

export const FIELD_CONFIG: Record<ContentType, Record<string, FieldConfig>> = {
  article: {
    excerpt: {
      model: "claude-haiku-4-5",
      maxTokens: 300,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi un estratto (excerpt) breve e accattivante, massimo 2-3 frasi, per un articolo di blog in italiano. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    content: {
      model: "claude-sonnet-5",
      maxTokens: 4000,
      isHtml: true,
      buildPrompt: (context) =>
        `Scrivi il corpo completo di un articolo di blog in italiano, ben strutturato con paragrafi e sottotitoli. Contesto:\n${contextLines(context)}\n\n${HTML_INSTRUCTIONS}`,
    },
    tagsInput: {
      model: "claude-haiku-4-5",
      maxTokens: 150,
      isHtml: false,
      buildPrompt: (context) =>
        `Suggerisci una lista di 5-8 tag pertinenti (parole chiave separate da virgola) in italiano per questo articolo. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    seoTitle: {
      model: "claude-haiku-4-5",
      maxTokens: 100,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi un titolo SEO ottimizzato (massimo 60 caratteri) in italiano per questo contenuto. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    metaDescription: {
      model: "claude-haiku-4-5",
      maxTokens: 150,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una meta description SEO (massimo 155 caratteri) in italiano per questo contenuto. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
  },
  service: {
    shortDescription: {
      model: "claude-haiku-4-5",
      maxTokens: 300,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una breve descrizione (2-3 frasi) in italiano per questo servizio professionale. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    content: {
      model: "claude-sonnet-5",
      maxTokens: 4000,
      isHtml: true,
      buildPrompt: (context) =>
        `Scrivi il contenuto completo e ben strutturato della pagina dedicata a questo servizio professionale, in italiano. Contesto:\n${contextLines(context)}\n\n${HTML_INSTRUCTIONS}`,
    },
    seoTitle: {
      model: "claude-haiku-4-5",
      maxTokens: 100,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi un titolo SEO ottimizzato (massimo 60 caratteri) in italiano per questo servizio. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    metaDescription: {
      model: "claude-haiku-4-5",
      maxTokens: 150,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una meta description SEO (massimo 155 caratteri) in italiano per questo servizio. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
  },
  portfolio: {
    description: {
      model: "claude-haiku-4-5",
      maxTokens: 300,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una breve descrizione (2-3 frasi) in italiano per questo progetto di portfolio. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    content: {
      model: "claude-sonnet-5",
      maxTokens: 4000,
      isHtml: true,
      buildPrompt: (context) =>
        `Scrivi il contenuto completo e ben strutturato della pagina dedicata a questo progetto di portfolio, in italiano. Contesto:\n${contextLines(context)}\n\n${HTML_INSTRUCTIONS}`,
    },
  },
  book: {
    description: {
      model: "claude-sonnet-5",
      maxTokens: 1200,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una descrizione accattivante (3-5 frasi) in italiano per questo libro. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
  },
  social: {
    text: {
      model: "claude-haiku-4-5",
      maxTokens: 400,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi il testo di un post social accattivante in italiano. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    caption: {
      model: "claude-haiku-4-5",
      maxTokens: 300,
      isHtml: false,
      buildPrompt: (context) =>
        `Scrivi una didascalia (caption) breve e accattivante in italiano per questo post social. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
    hashtagsInput: {
      model: "claude-haiku-4-5",
      maxTokens: 150,
      isHtml: false,
      buildPrompt: (context) =>
        `Suggerisci una lista di 5-10 hashtag pertinenti (separati da spazio, con simbolo #) in italiano/inglese per questo post social. Contesto:\n${contextLines(context)}\n\n${PLAIN_INSTRUCTIONS}`,
    },
  },
};

export function getFieldConfig(contentType: ContentType, fieldKey: string): FieldConfig | undefined {
  return FIELD_CONFIG[contentType]?.[fieldKey];
}
