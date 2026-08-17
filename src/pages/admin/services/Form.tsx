import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../../hooks/useDocument";
import { servicesService } from "../../../services/services.service";
import { Field, inputClass } from "../../../components/ui/Field";
import { RichTextEditor } from "../../../components/editor/RichTextEditor";
import { ImageUploader } from "../../../components/media/ImageUploader";
import { slugify } from "../../../utils/slugify";
import { getSaveErrorMessage } from "../../../utils/getSaveErrorMessage";
import type { Service } from "../../../types";

const schema = z.object({
  title: z.string().min(1, "Campo obbligatorio"),
  slug: z.string().min(1, "Campo obbligatorio"),
  shortDescription: z.string().min(1, "Campo obbligatorio"),
  content: z.string().min(1, "Campo obbligatorio"),
  order: z.coerce.number().int(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().min(1, "Campo obbligatorio"),
  metaDescription: z.string().min(1, "Campo obbligatorio"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuovo";
  const navigate = useNavigate();
  const { data: existing, isLoading } = useDocument<Service>("services", isNew ? null : id!);
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
    defaultValues: { order: 0, status: "draft" },
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
        await servicesService.create({
          ...values,
          imageURL,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        await servicesService.update(id!, { ...values, imageURL, updatedAt: Date.now() });
      }
      navigate("/admin/servizi");
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (!isNew && isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">
        {isNew ? "Nuovo servizio" : "Modifica servizio"}
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

        <Field label="Descrizione breve" error={errors.shortDescription?.message}>
          <textarea rows={2} {...register("shortDescription")} className={inputClass} />
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
          <ImageUploader folder="services" value={imageURL} onChange={setImageURL} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Ordine" error={errors.order?.message}>
            <input type="number" {...register("order")} className={inputClass} />
          </Field>
          <Field label="Stato" error={errors.status?.message}>
            <select {...register("status")} className={inputClass}>
              <option value="draft">Bozza</option>
              <option value="published">Pubblicato</option>
            </select>
          </Field>
        </div>

        <Field label="SEO Title" error={errors.seoTitle?.message}>
          <input {...register("seoTitle")} className={inputClass} />
        </Field>

        <Field label="Meta description" error={errors.metaDescription?.message}>
          <textarea rows={2} {...register("metaDescription")} className={inputClass} />
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
