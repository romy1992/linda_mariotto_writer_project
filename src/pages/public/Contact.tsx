import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Seo } from "../../components/seo/Seo";
import { contactsService } from "../../services/contacts.service";

const contactSchema = z.object({
  firstName: z.string().min(1, "Campo obbligatorio"),
  lastName: z.string().min(1, "Campo obbligatorio"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Seleziona una tipologia"),
  message: z.string().min(10, "Racconta qualcosa in più sul progetto"),
  privacyAccepted: z.boolean().refine((v) => v, "Devi accettare la privacy policy"),
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
    await contactsService.create({ ...values, createdAt: Date.now() });
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
              <input type="checkbox" {...register("privacyAccepted")} className="mt-1" />
              Ho letto e accetto l'informativa sulla privacy.
            </label>
            {errors.privacyAccepted && (
              <p className="text-xs text-red-700">{errors.privacyAccepted.message}</p>
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
