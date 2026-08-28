import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../hooks/useDocument";
import { updateSiteSettings } from "../../services/settings.service";
import { Field, inputClass } from "../../components/ui/Field";
import { getSaveErrorMessage } from "../../utils/getSaveErrorMessage";
import type { SiteSettings } from "../../types";

const contentSchema = z.object({
  ctaButtonLabel: z.string().optional(),
  bookLinkLabel: z.string().optional(),
  authorLabel: z.string().optional(),
  aboutEyebrow: z.string().optional(),

  homeHeroEyebrow: z.string().optional(),
  homeHeroTitle: z.string().optional(),
  homeHeroSecondaryLinkLabel: z.string().optional(),
  homeManifestoTitle: z.string().optional(),
  homeManifestoSubtitle: z.string().optional(),
  homeAboutTitle: z.string().optional(),
  homeAboutLinkLabel: z.string().optional(),
  homeServicesEyebrow: z.string().optional(),
  homeServicesTitle: z.string().optional(),
  homeServicesLinkLabel: z.string().optional(),
  homeServiceItemLinkLabel: z.string().optional(),
  homeApproachEyebrow: z.string().optional(),
  homeApproachTitle: z.string().optional(),
  homeApproachPhilosophyLabel: z.string().optional(),
  homeApproachMethodLabel: z.string().optional(),
  homeBooksTitle: z.string().optional(),
  homeBooksOthersLabel: z.string().optional(),
  homeBooksAllLinkLabel: z.string().optional(),
  homePortfolioEyebrow: z.string().optional(),
  homePortfolioTitle: z.string().optional(),
  homePortfolioLinkLabel: z.string().optional(),
  homeTestimonialsEyebrow: z.string().optional(),
  homeTestimonialsTitle: z.string().optional(),
  homeTestimonialsLinkLabel: z.string().optional(),
  homeArticlesEyebrow: z.string().optional(),
  homeArticlesTitle: z.string().optional(),
  homeArticlesLinkLabel: z.string().optional(),
  homeArticleItemLinkLabel: z.string().optional(),
  homeCtaTitle: z.string().optional(),
  homeCtaSubtitle: z.string().optional(),

  aboutHeadingTitle: z.string().optional(),
  aboutPhilosophyChapterLabel: z.string().optional(),
  aboutPhilosophyTitle: z.string().optional(),
  aboutMethodChapterLabel: z.string().optional(),
  aboutMethodTitle: z.string().optional(),

  booksEyebrow: z.string().optional(),
  booksTitle: z.string().optional(),
  booksSubtitle: z.string().optional(),

  contactEyebrow: z.string().optional(),
  contactTitle: z.string().optional(),
  contactSubtitle: z.string().optional(),
  contactSuccessMessage: z.string().optional(),
  contactSubmitLabel: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

type TextFieldConfig = {
  name: keyof ContentFormValues;
  label: string;
  placeholder: string;
  rows?: number;
};

const SHARED_FIELDS: TextFieldConfig[] = [
  { name: "ctaButtonLabel", label: "Bottone CTA — «contattami»", placeholder: "Raccontami il tuo progetto" },
  { name: "bookLinkLabel", label: "Link «Scopri il libro»", placeholder: "Scopri il libro →" },
  { name: "authorLabel", label: "Etichetta «Autrice»", placeholder: "Autrice" },
  { name: "aboutEyebrow", label: "Eyebrow «Chi sono»", placeholder: "Chi sono" },
];

const HOME_FIELDS: TextFieldConfig[] = [
  { name: "homeHeroEyebrow", label: "Hero — eyebrow", placeholder: "Autrice & Ghostwriter" },
  {
    name: "homeHeroTitle",
    label: "Hero — titolo principale",
    placeholder: "Le tue storie.\nLe parole giuste\nper raccontarle.",
    rows: 3,
  },
  { name: "homeHeroSecondaryLinkLabel", label: "Hero — link secondario", placeholder: "Scopri come lavoro" },
  {
    name: "homeManifestoTitle",
    label: "Manifesto — titolo",
    placeholder: "Scrivo al posto tuo.\nNon al posto della tua voce.",
    rows: 2,
  },
  {
    name: "homeManifestoSubtitle",
    label: "Manifesto — paragrafo",
    placeholder:
      "Il mio lavoro non è sostituirmi a te, ma ascoltare abbastanza bene da trasformare pensieri, ricordi ed esperienze in parole che continuino a sembrarti tue.",
    rows: 3,
  },
  { name: "homeAboutTitle", label: "Chi sono — titolo sezione", placeholder: "Una voce al servizio della tua" },
  { name: "homeAboutLinkLabel", label: "Chi sono — link", placeholder: "Continua a leggermi →" },
  { name: "homeServicesEyebrow", label: "Servizi — eyebrow", placeholder: "Servizi" },
  { name: "homeServicesTitle", label: "Servizi — titolo", placeholder: "Come posso aiutarti" },
  { name: "homeServicesLinkLabel", label: "Servizi — link «tutti i servizi»", placeholder: "Tutti i servizi →" },
  { name: "homeServiceItemLinkLabel", label: "Servizi — link riga servizio", placeholder: "Scopri il servizio →" },
  { name: "homeApproachEyebrow", label: "Come lavoro — eyebrow", placeholder: "Approccio" },
  { name: "homeApproachTitle", label: "Come lavoro — titolo", placeholder: "Come lavoro" },
  { name: "homeApproachPhilosophyLabel", label: "Come lavoro — etichetta filosofia", placeholder: "Filosofia" },
  { name: "homeApproachMethodLabel", label: "Come lavoro — etichetta metodo", placeholder: "Metodo" },
  { name: "homeBooksTitle", label: "Libri — titolo sezione", placeholder: "Anche le mie storie hanno trovato le loro parole." },
  { name: "homeBooksOthersLabel", label: "Libri — etichetta «altre pubblicazioni»", placeholder: "Altre pubblicazioni" },
  { name: "homeBooksAllLinkLabel", label: "Libri — link «tutti i libri»", placeholder: "Tutti i libri →" },
  { name: "homePortfolioEyebrow", label: "Portfolio — eyebrow", placeholder: "Portfolio" },
  { name: "homePortfolioTitle", label: "Portfolio — titolo", placeholder: "Lavori selezionati" },
  { name: "homePortfolioLinkLabel", label: "Portfolio — link «tutti i lavori»", placeholder: "Tutti i lavori →" },
  { name: "homeTestimonialsEyebrow", label: "Testimonianze — eyebrow", placeholder: "Testimonianze" },
  { name: "homeTestimonialsTitle", label: "Testimonianze — titolo", placeholder: "Dicono di me" },
  { name: "homeTestimonialsLinkLabel", label: "Testimonianze — link", placeholder: "Leggi tutte le esperienze →" },
  { name: "homeArticlesEyebrow", label: "Articoli — eyebrow", placeholder: "Magazine" },
  { name: "homeArticlesTitle", label: "Articoli — titolo", placeholder: "Articoli recenti" },
  { name: "homeArticlesLinkLabel", label: "Articoli — link «tutti gli articoli»", placeholder: "Tutti gli articoli →" },
  { name: "homeArticleItemLinkLabel", label: "Articoli — link riga articolo", placeholder: "Leggi →" },
  {
    name: "homeCtaTitle",
    label: "CTA finale — titolo",
    placeholder: "Forse la tua storia esiste già.\nHa solo bisogno delle parole giuste.",
    rows: 2,
  },
  { name: "homeCtaSubtitle", label: "CTA finale — paragrafo", placeholder: "Raccontami cosa vorresti realizzare. Partiremo da lì." },
];

const ABOUT_FIELDS: TextFieldConfig[] = [
  {
    name: "aboutHeadingTitle",
    label: "Titolo H1",
    placeholder: "Dietro ogni testo\nc’è prima di tutto ascolto.",
    rows: 2,
  },
  { name: "aboutPhilosophyChapterLabel", label: "Filosofia — etichetta capitolo", placeholder: "Capitolo 01" },
  { name: "aboutPhilosophyTitle", label: "Filosofia — titolo", placeholder: "Filosofia di scrittura" },
  { name: "aboutMethodChapterLabel", label: "Metodo — etichetta capitolo", placeholder: "Capitolo 02" },
  { name: "aboutMethodTitle", label: "Metodo — titolo", placeholder: "Metodo di lavoro" },
];

const BOOKS_FIELDS: TextFieldConfig[] = [
  { name: "booksEyebrow", label: "Eyebrow", placeholder: "Pubblicazioni" },
  { name: "booksTitle", label: "Titolo", placeholder: "Libri" },
  { name: "booksSubtitle", label: "Sottotitolo", placeholder: "Storie che hanno trovato la propria forma sulla pagina." },
];

const CONTACT_FIELDS: TextFieldConfig[] = [
  { name: "contactEyebrow", label: "Eyebrow", placeholder: "Contatti" },
  { name: "contactTitle", label: "Titolo", placeholder: "Raccontami il tuo progetto." },
  { name: "contactSubtitle", label: "Sottotitolo", placeholder: "Non serve avere già tutto chiaro. Raccontami da dove vorresti partire." },
  { name: "contactSuccessMessage", label: "Messaggio dopo l'invio", placeholder: "Grazie per il tuo messaggio, ti risponderò al più presto." },
  { name: "contactSubmitLabel", label: "Bottone invio", placeholder: "Invia messaggio" },
];

const ALL_FIELDS: TextFieldConfig[] = [
  ...HOME_FIELDS,
  ...ABOUT_FIELDS,
  ...BOOKS_FIELDS,
  ...CONTACT_FIELDS,
  ...SHARED_FIELDS,
];

export function Content() {
  const { data: settings, isLoading } = useDocument<SiteSettings>("settings", "site");
  const [savedMessage, setSavedMessage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormValues>({ resolver: zodResolver(contentSchema) });

  useEffect(() => {
    if (!settings) return;
    const withDefaults = { ...settings } as ContentFormValues;
    for (const field of ALL_FIELDS) {
      if (!withDefaults[field.name]?.trim()) {
        withDefaults[field.name] = field.placeholder;
      }
    }
    reset(withDefaults);
  }, [settings, reset]);

  async function onSubmit(values: ContentFormValues) {
    setSavedMessage(false);
    setSaveError(null);
    try {
      await updateSiteSettings(values);
      setSavedMessage(true);
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (isLoading) return null;

  function renderFields(fields: TextFieldConfig[]) {
    return fields.map((field) => (
      <Field key={field.name} label={field.label} error={errors[field.name]?.message}>
        {field.rows ? (
          <textarea
            rows={field.rows}
            placeholder={field.placeholder}
            {...register(field.name)}
            className={inputClass}
          />
        ) : (
          <input placeholder={field.placeholder} {...register(field.name)} className={inputClass} />
        )}
      </Field>
    ));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-serif text-2xl text-ink">Contenuti</h1>
      <p className="mb-8 text-sm leading-relaxed text-muted">
        Tutti i testi editoriali e i bottoni delle pagine pubbliche, già compilati con il testo
        attuale: modificali liberamente. Nei titoli multi-riga usa una riga per ogni verso. Se svuoti
        un campo torna il testo di default mostrato come placeholder.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <details open className="border-t border-line pt-5">
          <summary className="cursor-pointer text-sm font-medium text-ink">Home</summary>
          <div className="mt-5 space-y-5">{renderFields(HOME_FIELDS)}</div>
        </details>

        <details className="border-t border-line pt-5">
          <summary className="cursor-pointer text-sm font-medium text-ink">Chi sono</summary>
          <div className="mt-5 space-y-5">{renderFields(ABOUT_FIELDS)}</div>
        </details>

        <details className="border-t border-line pt-5">
          <summary className="cursor-pointer text-sm font-medium text-ink">Libri</summary>
          <div className="mt-5 space-y-5">{renderFields(BOOKS_FIELDS)}</div>
        </details>

        <details className="border-t border-line pt-5">
          <summary className="cursor-pointer text-sm font-medium text-ink">Contatti</summary>
          <div className="mt-5 space-y-5">{renderFields(CONTACT_FIELDS)}</div>
        </details>

        <details className="border-t border-line pt-5">
          <summary className="cursor-pointer text-sm font-medium text-ink">Testi condivisi</summary>
          <div className="mt-5 space-y-5">{renderFields(SHARED_FIELDS)}</div>
        </details>

        {savedMessage && <p className="text-sm text-accent">Salvato.</p>}
        {saveError && <p className="text-sm text-red-700">{saveError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-ink px-6 py-3 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Salvataggio…" : "Salva"}
        </button>
      </form>
    </div>
  );
}
