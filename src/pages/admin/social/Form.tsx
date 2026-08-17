import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDocument } from "../../../hooks/useDocument";
import { socialPostsService } from "../../../services/socialPosts.service";
import { Field, inputClass } from "../../../components/ui/Field";
import { ImageUploader } from "../../../components/media/ImageUploader";
import { getSaveErrorMessage } from "../../../utils/getSaveErrorMessage";
import type { SocialPost } from "../../../types";

const schema = z.object({
  internalTitle: z.string().min(1, "Campo obbligatorio"),
  platform: z.enum(["instagram", "linkedin"]),
  type: z.enum(["post", "carousel", "reel-script", "linkedin-post", "linkedin-article"]),
  text: z.string().optional(),
  caption: z.string().optional(),
  hashtagsInput: z.string().optional(),
  status: z.enum(["idea", "draft", "review", "ready", "scheduled", "published"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SocialForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "nuovo";
  const navigate = useNavigate();
  const { data: existing, isLoading } = useDocument<SocialPost>(
    "socialPosts",
    isNew ? null : id!,
  );
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platform: "instagram", type: "post", status: "idea" },
  });

  useEffect(() => {
    if (existing) {
      reset({ ...existing, hashtagsInput: existing.hashtags.join(", ") });
      setImageURL(existing.imageURL);
    }
  }, [existing, reset]);

  async function onSubmit(values: FormValues) {
    const hashtags = (values.hashtagsInput ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    const { hashtagsInput: _hashtagsInput, ...rest } = values;

    setSaveError(null);
    try {
      if (isNew) {
        await socialPostsService.create({
          ...rest,
          text: rest.text ?? "",
          caption: rest.caption ?? "",
          hashtags,
          imageURL,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        await socialPostsService.update(id!, {
          ...rest,
          hashtags,
          imageURL,
          updatedAt: Date.now(),
        });
      }
      navigate("/admin/social");
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  }

  if (!isNew && isLoading) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-2xl text-ink">
        {isNew ? "Nuovo contenuto social" : "Modifica contenuto social"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Titolo interno" error={errors.internalTitle?.message}>
          <input {...register("internalTitle")} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Piattaforma" error={errors.platform?.message}>
            <select {...register("platform")} className={inputClass}>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </Field>
          <Field label="Tipologia" error={errors.type?.message}>
            <select {...register("type")} className={inputClass}>
              <option value="post">Post</option>
              <option value="carousel">Carousel</option>
              <option value="reel-script">Reel script</option>
              <option value="linkedin-post">LinkedIn post</option>
              <option value="linkedin-article">LinkedIn article</option>
            </select>
          </Field>
        </div>

        <Field label="Testo" error={errors.text?.message}>
          <textarea rows={5} {...register("text")} className={inputClass} />
        </Field>

        <Field label="Caption" error={errors.caption?.message}>
          <textarea rows={2} {...register("caption")} className={inputClass} />
        </Field>

        <Field label="Hashtag (separati da virgola)" error={errors.hashtagsInput?.message}>
          <input {...register("hashtagsInput")} className={inputClass} />
        </Field>

        <div>
          <label className="mb-1 block text-sm text-muted">Immagine</label>
          <ImageUploader folder="social" value={imageURL} onChange={setImageURL} />
        </div>

        <Field label="Stato" error={errors.status?.message}>
          <select {...register("status")} className={inputClass}>
            <option value="idea">Idea</option>
            <option value="draft">Bozza</option>
            <option value="review">In revisione</option>
            <option value="ready">Pronto</option>
            <option value="scheduled">Programmato</option>
            <option value="published">Pubblicato</option>
          </select>
        </Field>

        <Field label="Note" error={errors.notes?.message}>
          <textarea rows={2} {...register("notes")} className={inputClass} />
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
