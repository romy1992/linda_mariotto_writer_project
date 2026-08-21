import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { to: "/chi-sono", label: "Chi sono" },
  { to: "/servizi", label: "Servizi" },
  { to: "/libri", label: "Libri" },
  { to: "/articoli", label: "Articoli" },
  { to: "/dicono-di-me", label: "Dicono di me" },
  { to: "/contatti", label: "Contatti" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `transition-colors hover:text-ink ${isActive ? "text-ink" : "text-muted"}`;
}

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <NavLink
            to="/"
            className="font-serif text-lg tracking-tight text-ink"
            onClick={() => setIsMenuOpen(false)}
          >
            Linda Mariotto
          </NavLink>
          <nav className="hidden gap-8 text-sm md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
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
          <nav className="flex flex-col gap-1 border-t border-line px-6 py-4 text-sm md:hidden">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="block py-2">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-muted">
          <span>© {new Date().getFullYear()} Linda Mariotto — Ghostwriter</span>
          <NavLink to="/privacy" className="hover:text-ink">
            Privacy
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
