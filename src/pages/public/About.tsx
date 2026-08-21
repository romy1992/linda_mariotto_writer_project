import { useDocument } from "../../hooks/useDocument";
import { Seo } from "../../components/seo/Seo";
import type { SiteSettings } from "../../types";

export function About() {
  const { data: settings } = useDocument<SiteSettings>("settings", "site");
  const professionalName = settings?.professionalName ?? "Linda Mariotto";

  return (
    <>
      <Seo
        title={`Chi sono — ${professionalName}`}
        description={settings?.bio ?? ""}
      />

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-28">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Profilo</p>
            <h1 className="font-serif text-4xl text-ink md:text-5xl">Chi sono</h1>
            {settings?.photoURL && (
              <img
                src={settings.photoURL}
                alt={professionalName}
                className="mt-10 aspect-[3/4] w-full max-w-md object-cover"
              />
            )}
          </div>

          <div className="md:pt-12">
            {settings?.bio && (
              <p className="text-lg leading-[1.8] text-ink md:text-xl">{settings.bio}</p>
            )}

            {(settings?.instagramUrl || settings?.linkedinUrl) && (
              <div className="mt-10 flex flex-wrap gap-6 text-sm tracking-wide text-accent">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    Instagram
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {(settings?.philosophy || settings?.method) && (
        <section>
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
            {settings.philosophy && (
              <div className="border-t border-line pt-10">
                <p className="text-xs uppercase tracking-[0.22em] text-accent">01</p>
                <h2 className="mt-3 font-serif text-3xl text-ink">Filosofia di scrittura</h2>
                <p className="mt-6 leading-[1.8] text-muted">{settings.philosophy}</p>
              </div>
            )}
            {settings.method && (
              <div className="border-t border-line pt-10">
                <p className="text-xs uppercase tracking-[0.22em] text-accent">02</p>
                <h2 className="mt-3 font-serif text-3xl text-ink">Metodo di lavoro</h2>
                <p className="mt-6 leading-[1.8] text-muted">{settings.method}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
