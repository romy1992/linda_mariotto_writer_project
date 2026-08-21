import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../../hooks/useDocument";
import { booksService } from "../../../services/books.service";
import { Field, inputClass } from "../../../components/ui/Field";
import { ImageUploader } from "../../../components/media/ImageUploader";
import { slugify } from "../../../utils/slugify";
import { getSaveErrorMessage } from "../../../utils/getSaveErrorMessage";
import { AiGenerateButton } from "../../../components/ai/AiGenerateButton";
import { AiCorrectButton } from "../../../components/ai/AiCorrectButton";
import type { Book } from "../../../types";

const schema = z.object({
  title: z.string().min(1, "Campo obbligatorio"),
  slug: z.string().min(1, "Campo obbligatorio"),
  description: z.string().min(1, "Campo obbligatorio"),
  year: z.coerce.number().int(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  externalLink: z.string().optional(),
  purchaseLink: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function BookForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuovo";
  const navigate = useNavigate();
  const { data: existing, isLoading } = useDocument<Book>("books", isNew ? null : id!);
  const [coverURL, setCoverURL] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { year: new Date().getFullYear(), status: "draft" },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
      setCoverURL(existing.coverURL);
    }
  }, [existing, reset]);

  async function onSubmit(values: FormOutput) {
    setSaveError(null);
    try {
      if (isNew) {
        await booksService.create({ ...values, coverURL });
      } else {
        await booksService.update(id!, { ...values, coverURL });
      }
      navigate("/admin/libri");
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (!isNew && isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">{isNew ? "Nuovo libro" : "Modifica libro"}</h1>
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

        <div>
          <label className="mb-1 block text-sm text-muted">Copertina</label>
          <ImageUploader folder="books" value={coverURL} onChange={setCoverURL} />
        </div>

        <Field label="Descrizione" error={errors.description?.message}>
          <textarea rows={4} {...register("description")} className={inputClass} />
          <AiGenerateButton
            contentType="book"
            fieldKey="description"
            context={{ title: getValues("title") }}
            onGenerated={(text) => setValue("description", text, { shouldDirty: true })}
          />
          <AiCorrectButton
            contentType="book"
            fieldKey="description"
            getText={() => getValues("description")}
            onCorrected={(text) => setValue("description", text, { shouldDirty: true })}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Anno" error={errors.year?.message}>
            <input type="number" {...register("year")} className={inputClass} />
          </Field>
          <Field label="Editore (opzionale)" error={errors.publisher?.message}>
            <input {...register("publisher")} className={inputClass} />
          </Field>
        </div>

        <Field label="ISBN (opzionale)" error={errors.isbn?.message}>
          <input {...register("isbn")} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Link esterno" error={errors.externalLink?.message}>
            <input {...register("externalLink")} className={inputClass} />
          </Field>
          <Field label="Link acquisto" error={errors.purchaseLink?.message}>
            <input {...register("purchaseLink")} className={inputClass} />
          </Field>
        </div>

        <Field label="Stato" error={errors.status?.message}>
          <select {...register("status")} className={inputClass}>
            <option value="draft">Bozza</option>
            <option value="published">Pubblicato</option>
          </select>
        </Field>

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
