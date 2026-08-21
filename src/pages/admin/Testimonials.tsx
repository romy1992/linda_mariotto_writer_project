import { orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { RatingStars } from "../../components/testimonials/RatingStars";
import { SAMPLE_TESTIMONIALS } from "../../data/sampleTestimonials";
import { useCollection } from "../../hooks/useCollection";
import { testimonialsService } from "../../services/testimonials.service";
import { formatDate } from "../../utils/formatDate";
import type { Testimonial, TestimonialStatus } from "../../types";

const STATUS_LABELS: Record<TestimonialStatus, string> = {
  pending: "Da approvare",
  published: "Pubblicata",
  rejected: "Rifiutata",
};

export function TestimonialsAdmin() {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const constraints = useMemo(() => [orderBy("createdAt", "desc")], []);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(
    "testimonials",
    constraints,
  );
  const pendingCount = testimonials.filter((item) => item.status === "pending").length;
  const publishedCount = testimonials.filter((item) => item.status === "published").length;
  const hasSeededTestimonials = SAMPLE_TESTIMONIALS.some((sample) =>
    testimonials.some(
      (item) =>
        item.displayName === sample.displayName &&
        item.status === "published" &&
        item.comment === sample.comment,
    ),
  );

  async function updateStatus(id: string, status: TestimonialStatus) {
    setActionError(null);
    try {
      await testimonialsService.update(id, { status, updatedAt: Date.now() });
    } catch {
      setActionError("Non è stato possibile aggiornare la recensione.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare definitivamente questa recensione?")) return;
    setActionError(null);
    try {
      await testimonialsService.remove(id);
    } catch {
      setActionError("Non è stato possibile eliminare la recensione.");
    }
  }

  async function seedPublishedTestimonials() {
    if (
      !confirm(
        "Caricare e pubblicare dieci recensioni con nomi e testi aggiornati? Compariranno subito sul sito pubblico.",
      )
    ) {
      return;
    }
    setActionError(null);
    setIsSeeding(true);
    try {
      const demoIds = testimonials.filter((item) => item.isDemo).map((item) => item.id);
      await Promise.all(demoIds.map((id) => testimonialsService.remove(id)));

      const now = Date.now();
      await Promise.all(
        SAMPLE_TESTIMONIALS.map((testimonial, index) =>
          testimonialsService.create({
            ...testimonial,
            createdAt: now - index * 86_400_000,
            updatedAt: now,
          }),
        ),
      );
    } catch {
      setActionError("Non è stato possibile caricare le recensioni.");
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Recensioni</h1>
          <p className="mt-2 text-sm text-muted">
            {pendingCount} da approvare · {publishedCount} pubblicate
          </p>
        </div>
        <button
          type="button"
          onClick={seedPublishedTestimonials}
          disabled={hasSeededTestimonials || isSeeding || isLoading}
          className="border border-ink px-4 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasSeededTestimonials
            ? "Recensioni già caricate"
            : isSeeding
              ? "Pubblicazione…"
              : "Pubblica 10 recensioni"}
        </button>
      </div>

      <div className="mb-6 border border-line p-4 text-sm leading-relaxed text-muted">
        Le nuove recensioni restano private finché non scegli “Pubblica”. Il pulsante carica dieci
        testimonianze già pubblicate e le mostra sul sito.
      </div>

      {actionError && <p className="mb-4 text-sm text-red-700">{actionError}</p>}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="border border-line p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg text-ink">{testimonial.displayName}</h2>
                  {testimonial.isDemo && (
                    <span className="border border-line px-2 py-0.5 text-xs text-muted">
                      Esempio
                    </span>
                  )}
                  <span className="bg-line px-2 py-0.5 text-xs text-muted">
                    {STATUS_LABELS[testimonial.status]}
                  </span>
                </div>
                <RatingStars rating={testimonial.rating} className="text-accent" />
              </div>
              <time className="text-xs text-muted">{formatDate(testimonial.createdAt)}</time>
            </div>

            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ink">
              {testimonial.comment}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {testimonial.status !== "published" && (
                <button
                  type="button"
                  onClick={() => updateStatus(testimonial.id, "published")}
                  className="text-accent"
                >
                  Pubblica
                </button>
              )}
              {testimonial.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => updateStatus(testimonial.id, "rejected")}
                  className="text-muted"
                >
                  Rifiuta
                </button>
              )}
              {testimonial.status !== "pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(testimonial.id, "pending")}
                  className="text-muted"
                >
                  Rimetti in attesa
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(testimonial.id)}
                className="text-red-700"
              >
                Elimina
              </button>
            </div>
          </article>
        ))}

        {isLoading && <p className="text-muted">Caricamento recensioni…</p>}
        {!isLoading && testimonials.length === 0 && (
          <p className="text-muted">Nessuna recensione ricevuta.</p>
        )}
      </div>
    </div>
  );
}
