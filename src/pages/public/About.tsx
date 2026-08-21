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
            {settings?.photoURL ? (
              <img
                src={settings.photoURL}
                alt={professionalName}
                className="aspect-[3/4] w-full max-w-md object-cover"
              />
            ) : (
              <div className="aspect-[3/4] w-full max-w-md bg-paper-deep" aria-hidden="true" />
            )}
          </div>

          <div className="md:pt-4">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Chi sono</p>
            <h1 className="text-balance font-serif text-4xl leading-[1.12] text-ink md:text-5xl">
              <span className="block">Dietro ogni testo</span>
              <span className="block">c’è prima di tutto ascolto.</span>
            </h1>
            {settings?.bio && (
              <p className="mt-10 text-lg leading-[1.8] text-ink md:text-xl">{settings.bio}</p>
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
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            {settings.philosophy && (
              <article className="border-t border-line pt-12">
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Capitolo 01</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                  Filosofia di scrittura
                </h2>
                <p className="mt-8 text-lg leading-[1.85] text-muted">{settings.philosophy}</p>
              </article>
            )}
            {settings.method && (
              <article className="mt-16 border-t border-line pt-12 md:mt-20">
                <p className="text-xs uppercase tracking-[0.22em] text-accent">Capitolo 02</p>
                <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Metodo di lavoro</h2>
                <p className="mt-8 text-lg leading-[1.85] text-muted">{settings.method}</p>
              </article>
            )}
          </div>
        </section>
      )}
    </>
  );
}
