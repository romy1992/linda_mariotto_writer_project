import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../../hooks/useDocument";
import { portfolioService } from "../../../services/portfolio.service";
import { Field, inputClass } from "../../../components/ui/Field";
import { RichTextEditor } from "../../../components/editor/RichTextEditor";
import { ImageUploader } from "../../../components/media/ImageUploader";
import { slugify } from "../../../utils/slugify";
import { getSaveErrorMessage } from "../../../utils/getSaveErrorMessage";
import type { PortfolioItem } from "../../../types";

const schema = z.object({
  title: z.string().min(1, "Campo obbligatorio"),
  slug: z.string().min(1, "Campo obbligatorio"),
  category: z.string().min(1, "Campo obbligatorio"),
  description: z.string().min(1, "Campo obbligatorio"),
  content: z.string().min(1, "Campo obbligatorio"),
  client: z.string().optional(),
  year: z.coerce.number().int(),
  externalLink: z.string().optional(),
  status: z.enum(["draft", "published"]),
  visibility: z.enum(["public", "private"]),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function PortfolioForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuovo";
  const navigate = useNavigate();
  const { data: existing, isLoading } = useDocument<PortfolioItem>(
    "portfolio",
    isNew ? null : id!,
  );
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { year: new Date().getFullYear(), status: "draft", visibility: "public" },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
      setImageURL(existing.imageURL);
    }
  }, [existing, reset]);

  async function onSubmit(values: FormOutput) {
    setSaveError(null);
    try {
      if (isNew) {
        await portfolioService.create({
          ...values,
          imageURL,
          createdAt: Date.now(),
          publishedAt: values.status === "published" ? Date.now() : undefined,
        });
      } else {
        await portfolioService.update(id!, {
          ...values,
          imageURL,
          publishedAt:
            values.status === "published" ? (existing?.publishedAt ?? Date.now()) : undefined,
        });
      }
      navigate("/admin/lavori");
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (!isNew && isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">
        {isNew ? "Nuovo lavoro" : "Modifica lavoro"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Titolo" error={errors.title?.message}>
          <input
            {...register("title", {
              onChange: (e) => setValue("slug", slugify(e.target.value)),
            })}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" error={errors.slug?.message}>
          <input {...register("slug")} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.category?.message}>
            <input {...register("category")} className={inputClass} />
          </Field>
          <Field label="Cliente (opzionale)" error={errors.client?.message}>
            <input {...register("client")} className={inputClass} />
          </Field>
        </div>

        <Field label="Descrizione" error={errors.description?.message}>
          <textarea rows={2} {...register("description")} className={inputClass} />
        </Field>

        <Field label="Contenuto" error={errors.content?.message}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </Field>

        <div>
          <label className="mb-1 block text-sm text-muted">Immagine</label>
          <ImageUploader folder="portfolio" value={imageURL} onChange={setImageURL} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Anno" error={errors.year?.message}>
            <input type="number" {...register("year")} className={inputClass} />
          </Field>
          <Field label="Link esterno" error={errors.externalLink?.message}>
            <input {...register("externalLink")} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Stato" error={errors.status?.message}>
            <select {...register("status")} className={inputClass}>
              <option value="draft">Bozza</option>
              <option value="published">Pubblicato</option>
            </select>
          </Field>
          <Field label="Visibilità" error={errors.visibility?.message}>
            <select {...register("visibility")} className={inputClass}>
              <option value="public">Pubblico</option>
              <option value="private">Riservato</option>
            </select>
          </Field>
        </div>

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
