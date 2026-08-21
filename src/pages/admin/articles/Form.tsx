import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../../hooks/useDocument";
import { articlesService } from "../../../services/articles.service";
import { Field, inputClass } from "../../../components/ui/Field";
import { RichTextEditor } from "../../../components/editor/RichTextEditor";
import { ImageUploader } from "../../../components/media/ImageUploader";
import { slugify } from "../../../utils/slugify";
import { getSaveErrorMessage } from "../../../utils/getSaveErrorMessage";
import { AiGenerateButton } from "../../../components/ai/AiGenerateButton";
import { AiCorrectButton } from "../../../components/ai/AiCorrectButton";
import type { Article } from "../../../types";

const schema = z.object({
  title: z.string().min(1, "Campo obbligatorio"),
  slug: z.string().min(1, "Campo obbligatorio"),
  excerpt: z.string().min(1, "Campo obbligatorio"),
  content: z.string().min(1, "Campo obbligatorio"),
  category: z.string().min(1, "Campo obbligatorio"),
  tagsInput: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  seoTitle: z.string().min(1, "Campo obbligatorio"),
  metaDescription: z.string().min(1, "Campo obbligatorio"),
});

type FormValues = z.infer<typeof schema>;

export function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuovo";
  const navigate = useNavigate();
  const { data: existing, isLoading } = useDocument<Article>("articles", isNew ? null : id!);
  const [coverURL, setCoverURL] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft" },
  });

  useEffect(() => {
    if (existing) {
      reset({ ...existing, tagsInput: existing.tags.join(", ") });
      setCoverURL(existing.coverURL);
    }
  }, [existing, reset]);

  async function onSubmit(values: FormValues) {
    const tags = (values.tagsInput ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { tagsInput: _tagsInput, ...rest } = values;

    setSaveError(null);
    try {
      if (isNew) {
        await articlesService.create({
          ...rest,
          tags,
          coverURL,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          publishedAt: values.status === "published" ? Date.now() : undefined,
        });
      } else {
        await articlesService.update(id!, {
          ...rest,
          tags,
          coverURL,
          updatedAt: Date.now(),
          publishedAt:
            values.status === "published" ? (existing?.publishedAt ?? Date.now()) : undefined,
        });
      }
      navigate("/admin/articoli");
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (!isNew && isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">
        {isNew ? "Nuovo articolo" : "Modifica articolo"}
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

        <Field label="Excerpt" error={errors.excerpt?.message}>
          <textarea rows={2} {...register("excerpt")} className={inputClass} />
          <AiGenerateButton
            contentType="article"
            fieldKey="excerpt"
            context={{ title: getValues("title"), category: getValues("category") }}
            onGenerated={(text) => setValue("excerpt", text, { shouldDirty: true })}
          />
          <AiCorrectButton
            contentType="article"
            fieldKey="excerpt"
            getText={() => getValues("excerpt")}
            onCorrected={(text) => setValue("excerpt", text, { shouldDirty: true })}
          />
        </Field>

        <div>
          <label className="mb-1 block text-sm text-muted">Copertina</label>
          <ImageUploader folder="articles" value={coverURL} onChange={setCoverURL} />
        </div>

        <Field label="Contenuto" error={errors.content?.message}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <>
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                <AiGenerateButton
                  contentType="article"
                  fieldKey="content"
                  context={{
                    title: getValues("title"),
                    category: getValues("category"),
                    excerpt: getValues("excerpt"),
                  }}
                  onGenerated={(html) => field.onChange(html)}
                />
                <AiCorrectButton
                  contentType="article"
                  fieldKey="content"
                  getText={() => field.value ?? ""}
                  onCorrected={(html) => field.onChange(html)}
                />
              </>
            )}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.category?.message}>
            <input {...register("category")} className={inputClass} />
          </Field>
          <Field label="Tag (separati da virgola)" error={errors.tagsInput?.message}>
            <input {...register("tagsInput")} className={inputClass} />
            <AiGenerateButton
              contentType="article"
              fieldKey="tagsInput"
              context={{
                title: getValues("title"),
                category: getValues("category"),
                excerpt: getValues("excerpt"),
              }}
              onGenerated={(text) => setValue("tagsInput", text, { shouldDirty: true })}
            />
            <AiCorrectButton
              contentType="article"
              fieldKey="tagsInput"
              getText={() => getValues("tagsInput") ?? ""}
              onCorrected={(text) => setValue("tagsInput", text, { shouldDirty: true })}
            />
          </Field>
        </div>

        <Field label="Stato" error={errors.status?.message}>
          <select {...register("status")} className={inputClass}>
            <option value="draft">Bozza</option>
            <option value="published">Pubblicato</option>
            <option value="archived">Archiviato</option>
          </select>
        </Field>

        <Field label="SEO Title" error={errors.seoTitle?.message}>
          <input {...register("seoTitle")} className={inputClass} />
          <AiGenerateButton
            contentType="article"
            fieldKey="seoTitle"
            context={{ title: getValues("title"), excerpt: getValues("excerpt") }}
            onGenerated={(text) => setValue("seoTitle", text, { shouldDirty: true })}
          />
          <AiCorrectButton
            contentType="article"
            fieldKey="seoTitle"
            getText={() => getValues("seoTitle")}
            onCorrected={(text) => setValue("seoTitle", text, { shouldDirty: true })}
          />
        </Field>

        <Field label="Meta description" error={errors.metaDescription?.message}>
          <textarea rows={2} {...register("metaDescription")} className={inputClass} />
          <AiGenerateButton
            contentType="article"
            fieldKey="metaDescription"
            context={{ title: getValues("title"), excerpt: getValues("excerpt") }}
            onGenerated={(text) => setValue("metaDescription", text, { shouldDirty: true })}
          />
          <AiCorrectButton
            contentType="article"
            fieldKey="metaDescription"
            getText={() => getValues("metaDescription")}
            onCorrected={(text) => setValue("metaDescription", text, { shouldDirty: true })}
          />
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
