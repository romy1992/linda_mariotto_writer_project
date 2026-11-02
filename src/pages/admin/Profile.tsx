import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../hooks/useDocument";
import { updateSiteSettings } from "../../services/settings.service";
import { ImageUploader } from "../../components/media/ImageUploader";
import { Field, inputClass } from "../../components/ui/Field";
import { getSaveErrorMessage } from "../../utils/getSaveErrorMessage";
import type { SiteSettings } from "../../types";

const settingsSchema = z.object({
  professionalName: z.string().min(1, "Campo obbligatorio"),
  payoff: z.string().min(1, "Campo obbligatorio"),
  bio: z.string().min(1, "Campo obbligatorio"),
  philosophy: z.string().optional(),
  method: z.string().optional(),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  seoDefaultTitle: z.string().min(1, "Campo obbligatorio"),
  seoDefaultDescription: z.string().min(1, "Campo obbligatorio"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function Profile() {
  const { data: settings, isLoading } = useDocument<SiteSettings>("settings", "site");
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);
  const [logoURL, setLogoURL] = useState<string | undefined>(undefined);
  const [savedMessage, setSavedMessage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema) });

  useEffect(() => {
    if (settings) {
      reset(settings);
      setPhotoURL(settings.photoURL);
      setLogoURL(settings.logoURL);
    }
  }, [settings, reset]);

  async function onSubmit(values: SettingsFormValues) {
    setSavedMessage(false);
    setSaveError(null);
    try {
      await updateSiteSettings({ ...values, photoURL, logoURL });
      setSavedMessage(true);
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">Profilo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm text-muted">Foto</label>
          <ImageUploader folder="profile" value={photoURL} onChange={setPhotoURL} />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Logo</label>
          <p className="mb-2 text-xs leading-relaxed text-muted">
            Mostrato nell'header e nel footer del sito al posto del monogramma di default. Consigliata
            un'immagine quadrata. Dopo aver caricato il file, premi "Salva" in fondo alla pagina per
            pubblicarlo.
          </p>
          <div className="mb-3 flex items-center gap-3">
            <img
              src={logoURL || "/logo.svg"}
              alt="Anteprima logo attuale"
              className="h-16 w-16 border border-line object-contain p-1"
            />
            <span className="text-xs text-muted">
              {logoURL ? "Logo personalizzato" : "Logo di default, nessuno personalizzato caricato"}
            </span>
          </div>
          <ImageUploader folder="branding" value={logoURL} onChange={setLogoURL} />
        </div>

        <Field label="Nome e cognome" error={errors.professionalName?.message}>
          <input {...register("professionalName")} className={inputClass} />
        </Field>

        <Field label="Payoff" error={errors.payoff?.message}>
          <input {...register("payoff")} className={inputClass} />
        </Field>

        <Field label="Biografia" error={errors.bio?.message}>
          <textarea rows={4} {...register("bio")} className={inputClass} />
        </Field>

        <Field label="Filosofia di scrittura" error={errors.philosophy?.message}>
          <textarea rows={3} {...register("philosophy")} className={inputClass} />
        </Field>

        <Field label="Metodo di lavoro" error={errors.method?.message}>
          <textarea rows={3} {...register("method")} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} className={inputClass} />
          </Field>
          <Field label="Telefono" error={errors.phone?.message}>
            <input {...register("phone")} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instagram" error={errors.instagramUrl?.message}>
            <input {...register("instagramUrl")} className={inputClass} />
          </Field>
          <Field label="LinkedIn" error={errors.linkedinUrl?.message}>
            <input {...register("linkedinUrl")} className={inputClass} />
          </Field>
        </div>

        <Field label="SEO — Title di default" error={errors.seoDefaultTitle?.message}>
          <input {...register("seoDefaultTitle")} className={inputClass} />
        </Field>

        <Field label="SEO — Meta description di default" error={errors.seoDefaultDescription?.message}>
          <textarea rows={2} {...register("seoDefaultDescription")} className={inputClass} />
        </Field>

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
