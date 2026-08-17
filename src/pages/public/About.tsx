import { useDocument } from "../../hooks/useDocument";
import { Seo } from "../../components/seo/Seo";
import type { SiteSettings } from "../../types";

export function About() {
  const { data: settings } = useDocument<SiteSettings>("settings", "site");

  return (
    <>
      <Seo
        title={`Chi sono — ${settings?.professionalName ?? "Linda Mariotto"}`}
        description={settings?.bio ?? ""}
      />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-10 font-serif text-3xl text-ink md:text-4xl">Chi sono</h1>

        {settings?.photoURL && (
          <img
            src={settings.photoURL}
            alt={settings.professionalName}
            className="mb-10 aspect-[3/4] w-full max-w-sm object-cover"
          />
        )}

        {settings?.bio && (
          <p className="mb-8 text-lg leading-relaxed text-ink">{settings.bio}</p>
        )}

        {settings?.philosophy && (
          <div className="mb-8">
            <h2 className="mb-3 font-serif text-xl text-ink">Filosofia di scrittura</h2>
            <p className="leading-relaxed text-muted">{settings.philosophy}</p>
          </div>
        )}

        {settings?.method && (
          <div className="mb-8">
            <h2 className="mb-3 font-serif text-xl text-ink">Metodo di lavoro</h2>
            <p className="leading-relaxed text-muted">{settings.method}</p>
          </div>
        )}

        {(settings?.instagramUrl || settings?.linkedinUrl) && (
          <div className="mt-10 flex gap-6 text-sm text-accent">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        )}
      </section>
    </>
  );
}
