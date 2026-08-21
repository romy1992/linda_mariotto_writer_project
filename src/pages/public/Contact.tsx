import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Seo } from "../../components/seo/Seo";
import { PRIVACY_NOTICE_VERSION } from "../../constants/privacy";
import { contactsService } from "../../services/contacts.service";

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

export function Contact() {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

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
      <section className="mx-auto max-w-xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Contatti</h1>

        {isSent ? (
          <p className="text-ink">
            Grazie per il tuo messaggio, ti risponderò al più presto.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-muted">Nome</label>
                <input
                  {...register("firstName")}
                  className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-700">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Cognome</label>
                <input
                  {...register("lastName")}
                  className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-700">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-muted">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
              />
              {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm text-muted">Telefono (opzionale)</label>
              <input
                {...register("phone")}
                className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-muted">Tipologia progetto</label>
              <select
                {...register("projectType")}
                defaultValue=""
                className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
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
              <label className="mb-1 block text-sm text-muted">Messaggio</label>
              <textarea
                rows={5}
                {...register("message")}
                className="w-full border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
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
              className="bg-ink px-6 py-3 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Invio in corso…" : "Invia messaggio"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
