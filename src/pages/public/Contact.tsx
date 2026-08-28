import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Seo } from "../../components/seo/Seo";
import { PRIVACY_NOTICE_VERSION } from "../../constants/privacy";
import { contactsService } from "../../services/contacts.service";
import { useDocument } from "../../hooks/useDocument";
import type { SiteSettings } from "../../types";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Campo obbligatorio").max(100, "Massimo 100 caratteri"),
  lastName: z.string().trim().min(1, "Campo obbligatorio").max(100, "Massimo 100 caratteri"),
  email: z.string().trim().email("Email non valida").max(320, "Email troppo lunga"),
  phone: z.string().trim().max(30, "Massimo 30 caratteri").optional(),
  projectType: z.string().min(1, "Seleziona una tipologia"),
  message: z
    .string()
    .trim()
    .min(10, "Racconta qualcosa in più sul progetto")
    .max(5000, "Massimo 5.000 caratteri"),
  privacyNoticeAcknowledged: z
    .boolean()
    .refine((value) => value, "Devi confermare di aver letto l'informativa privacy"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const PROJECT_TYPES = [
  "Libro breve",
  "Biografia",
  "Autobiografia",
  "Articoli",
  "Contenuti social",
  "Ghostwriting Instagram",
  "Ghostwriting LinkedIn",
  "Altro",
];

function t(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function Contact() {
  const [isSent, setIsSent] = useState(false);
  const { data: settings } = useDocument<SiteSettings>("settings", "site");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const eyebrow = t(settings?.contactEyebrow, "Contatti");
  const title = t(settings?.contactTitle, "Raccontami il tuo progetto.");
  const subtitle = t(
    settings?.contactSubtitle,
    "Non serve avere già tutto chiaro. Raccontami da dove vorresti partire.",
  );
  const successMessage = t(
    settings?.contactSuccessMessage,
    "Grazie per il tuo messaggio, ti risponderò al più presto.",
  );
  const submitLabel = t(settings?.contactSubmitLabel, "Invia messaggio");

  async function onSubmit(values: ContactFormValues) {
    const { privacyNoticeAcknowledged, ...contactData } = values;
    await contactsService.create({
      ...contactData,
      privacyAccepted: privacyNoticeAcknowledged,
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      createdAt: Date.now(),
    });
    setIsSent(true);
    reset();
  }

  return (
    <>
      <Seo title="Contatti — Linda Mariotto" description="Raccontami il tuo progetto." />
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:py-28">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
          <h1 className="text-balance font-serif text-4xl leading-[1.12] text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted">{subtitle}</p>
          {(settings?.email || settings?.instagramUrl || settings?.linkedinUrl) && (
            <ul className="mt-10 space-y-3 text-sm text-muted">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="transition-colors hover:text-ink">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.instagramUrl && (
                <li>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {settings.linkedinUrl && (
                <li>
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <div>
          {isSent ? (
            <p className="border border-line bg-paper-deep/40 p-8 text-ink">{successMessage}</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-first-name" className="mb-1 block text-sm text-muted">
                    Nome
                  </label>
                  <input
                    id="contact-first-name"
                    {...register("firstName")}
                    className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-700">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="mb-1 block text-sm text-muted">
                    Cognome
                  </label>
                  <input
                    id="contact-last-name"
                    {...register("lastName")}
                    className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-700">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm text-muted">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register("email")}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-1 block text-sm text-muted">
                  Telefono (opzionale)
                </label>
                <input
                  id="contact-phone"
                  {...register("phone")}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="contact-project-type" className="mb-1 block text-sm text-muted">
                  Tipologia progetto
                </label>
                <select
                  id="contact-project-type"
                  {...register("projectType")}
                  defaultValue=""
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                >
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-xs text-red-700">{errors.projectType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm text-muted">
                  Messaggio
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  {...register("message")}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-700">{errors.message.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  {...register("privacyNoticeAcknowledged")}
                  aria-invalid={Boolean(errors.privacyNoticeAcknowledged)}
                  aria-describedby={
                    errors.privacyNoticeAcknowledged ? "privacy-notice-error" : undefined
                  }
                  className="mt-1"
                />
                <span>
                  Ho letto l'
                  <Link to="/privacy" target="_blank" className="underline hover:text-ink">
                    informativa privacy
                  </Link>
                  {" "}relativa ai dati inviati con questo modulo.
                </span>
              </label>
              {errors.privacyNoticeAcknowledged && (
                <p id="privacy-notice-error" className="text-xs text-red-700">
                  {errors.privacyNoticeAcknowledged.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-ink px-6 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Invio in corso…" : submitLabel}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
