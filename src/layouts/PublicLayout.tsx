import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import type { SiteSettings } from "../types";

const HEADER_NAV_LINKS = [
  { to: "/chi-sono", label: "Chi sono" },
  { to: "/servizi", label: "Servizi" },
  { to: "/libri", label: "Libri" },
  { to: "/articoli", label: "Articoli" },
  { to: "/dicono-di-me", label: "Dicono di me" },
];

const FOOTER_NAV_LINKS = [
  ...HEADER_NAV_LINKS,
  { to: "/contatti", label: "Contatti" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `relative text-[13px] tracking-wide transition-colors hover:text-ink ${
    isActive
      ? "text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-accent"
      : "text-muted"
  }`;
}

function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `block border-b border-line py-3 text-base transition-colors ${
    isActive ? "text-ink" : "text-muted hover:text-ink"
  }`;
}

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: settings } = useDocument<SiteSettings>("settings", "site");
  const brandName = settings?.professionalName?.trim() || "Linda Mariotto";
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:py-5">
          <NavLink
            to="/"
            className="group min-w-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="block font-serif text-lg tracking-tight text-ink md:text-xl">
              {brandName}
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-muted">
              Autrice &amp; Ghostwriter
            </span>
          </NavLink>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigazione principale">
            {HEADER_NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contatti"
              className="ml-2 bg-ink px-4 py-2.5 text-[13px] tracking-wide text-paper transition-opacity hover:opacity-90"
            >
              Raccontami il tuo progetto
            </NavLink>
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`block h-px w-5 bg-ink transition-transform ${isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-transform ${isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>

        {isMenuOpen && (
          <nav
            className="border-t border-line px-6 py-4 lg:hidden"
            aria-label="Navigazione mobile"
          >
            {HEADER_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={mobileNavClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contatti"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 inline-flex bg-ink px-4 py-3 text-sm text-paper transition-opacity hover:opacity-90"
            >
              Raccontami il tuo progetto
            </NavLink>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-paper-deep/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl uppercase tracking-wide text-ink">{brandName}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              Autrice &amp; Ghostwriter
            </p>
            {settings?.payoff && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{settings.payoff}</p>
            )}
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-accent">Navigazione</p>
            <ul className="space-y-2 text-sm text-muted">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="transition-colors hover:text-ink">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {(settings?.instagramUrl || settings?.linkedinUrl) && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-accent">Social</p>
              <ul className="space-y-2 text-sm text-muted">
                {settings.instagramUrl && (
                  <li>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-ink"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {settings.linkedinUrl && (
                  <li>
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-ink"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-accent">Contatti</p>
            <ul className="space-y-2 text-sm text-muted">
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="transition-colors hover:text-ink">
                    {settings.email}
                  </a>
                </li>
              )}
              <li>
                <NavLink to="/contatti" className="transition-colors hover:text-ink">
                  Raccontami il tuo progetto
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="transition-colors hover:text-ink">
                  Privacy
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted">
            <span>
              © {year} {brandName}
            </span>
            <NavLink to="/privacy" className="tracking-wide transition-colors hover:text-ink">
              Privacy
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
