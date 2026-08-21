import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { orderBy, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Seo } from "../../components/seo/Seo";
import { RatingStars } from "../../components/testimonials/RatingStars";
import { PRIVACY_NOTICE_VERSION } from "../../constants/privacy";
import { useCollection } from "../../hooks/useCollection";
import { testimonialsService } from "../../services/testimonials.service";
import type { Testimonial } from "../../types";

const testimonialSchema = z.object({
  displayName: z.string().trim().min(2, "Inserisci almeno 2 caratteri").max(80),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(20, "Scrivi almeno 20 caratteri")
    .max(1500, "Massimo 1.500 caratteri"),
  publicationConsent: z
    .boolean()
    .refine((value) => value, "Devi autorizzare la pubblicazione della recensione"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export function Testimonials() {
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const constraints = useMemo(
    () => [
      where("status", "==", "published"),
      where("isDemo", "==", false),
      orderBy("createdAt", "desc"),
    ],
    [],
  );
  const { data: testimonials, isLoading } = useCollection<Testimonial>(
    "testimonials",
    constraints,
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5, publicationConsent: false },
  });
  const selectedRating = watch("rating");

  async function onSubmit(values: TestimonialFormValues) {
    setSubmitError(null);
    try {
      const now = Date.now();
      await testimonialsService.create({
        ...values,
        status: "pending",
        isDemo: false,
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
        createdAt: now,
        updatedAt: now,
      });
      reset({ rating: 5, publicationConsent: false });
      setIsSent(true);
    } catch {
      setSubmitError("Non è stato possibile inviare la recensione. Riprova tra poco.");
    }
  }

  return (
    <>
      <Seo
        title="Dicono di me — Linda Mariotto"
        description="Recensioni sul lavoro di Linda Mariotto e modulo per condividere la propria esperienza."
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Testimonianze</p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl">Dicono di me</h1>
            <p className="mt-5 leading-relaxed text-muted">
              Esperienze condivise da chi ha lavorato con me. Le recensioni vengono controllate
              prima della pubblicazione.
            </p>
          </div>

          <div className="mt-16 space-y-14 md:mt-20 md:space-y-20">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="border-l border-accent pl-6 md:pl-10">
                <blockquote>
                  <p className="whitespace-pre-wrap font-serif text-2xl leading-snug text-ink md:text-3xl md:leading-snug">
                    “{testimonial.comment}”
                  </p>
                </blockquote>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <h2 className="font-serif text-lg text-ink">{testimonial.displayName}</h2>
                  <RatingStars rating={testimonial.rating} className="text-accent" />
                </div>
              </article>
            ))}
          </div>

          {isLoading && <p className="mt-12 text-muted">Caricamento recensioni…</p>}
          {!isLoading && testimonials.length === 0 && (
            <p className="mt-12 text-muted">Non ci sono ancora recensioni pubblicate.</p>
          )}
        </div>
      </section>

      <section className="bg-paper-deep/35">
        <div className="mx-auto max-w-xl px-6 py-20 md:py-28">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Scrivi</p>
          <h2 className="font-serif text-3xl text-ink">Condividi la tua esperienza</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Puoi indicare il tuo nome oppure un nome visualizzato. La recensione apparirà sul
            sito solo dopo l'approvazione.
          </p>

          {isSent ? (
            <div className="mt-10 border border-line bg-paper p-6">
              <p className="text-ink">Grazie, la recensione è stata inviata.</p>
              <p className="mt-2 text-sm text-muted">
                Verrà controllata prima di essere resa pubblica.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="mt-4 text-sm text-accent transition-colors hover:text-ink"
              >
                Scrivi un'altra recensione
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
              <div>
                <label htmlFor="testimonial-name" className="mb-1 block text-sm text-muted">
                  Nome o nome visualizzato
                </label>
                <input
                  id="testimonial-name"
                  {...register("displayName")}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-700">{errors.displayName.message}</p>
                )}
              </div>

              <fieldset>
                <legend className="mb-2 text-sm text-muted">Valutazione</legend>
                <input type="hidden" {...register("rating", { valueAsNumber: true })} />
                <div className="flex gap-1" role="radiogroup" aria-label="Valutazione da 1 a 5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={selectedRating === rating}
                      aria-label={`${rating} ${rating === 1 ? "stella" : "stelle"}`}
                      onClick={() => setValue("rating", rating, { shouldValidate: true })}
                      className={`text-3xl transition-colors ${
                        rating <= selectedRating ? "text-accent" : "text-line"
                      }`}
                    >
                      <span aria-hidden="true">★</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="testimonial-comment" className="mb-1 block text-sm text-muted">
                  Recensione
                </label>
                <textarea
                  id="testimonial-comment"
                  rows={6}
                  {...register("comment")}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-accent"
                />
                {errors.comment && (
                  <p className="mt-1 text-xs text-red-700">{errors.comment.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm leading-relaxed text-muted">
                <input
                  type="checkbox"
                  {...register("publicationConsent")}
                  aria-invalid={Boolean(errors.publicationConsent)}
                  className="mt-1"
                />
                <span>
                  Confermo che il testo descrive la mia esperienza e autorizzo la pubblicazione
                  del nome indicato, della valutazione e della recensione dopo la moderazione. Ho
                  letto l'
                  <Link to="/privacy" target="_blank" className="underline hover:text-ink">
                    informativa privacy
                  </Link>
                  .
                </span>
              </label>
              {errors.publicationConsent && (
                <p className="text-xs text-red-700">{errors.publicationConsent.message}</p>
              )}

              {submitError && <p className="text-sm text-red-700">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-ink px-6 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Invio in corso…" : "Invia recensione"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
