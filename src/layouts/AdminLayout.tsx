import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/profilo", label: "Profilo" },
  { to: "/admin/servizi", label: "Servizi" },
  { to: "/admin/lavori", label: "Lavori" },
  { to: "/admin/libri", label: "Libri" },
  { to: "/admin/articoli", label: "Articoli" },
  { to: "/admin/social", label: "Social" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/contatti", label: "Contatti" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `block rounded px-3 py-2 text-sm transition-colors ${
    isActive ? "bg-ink text-paper" : "text-muted hover:bg-line"
  }`;
}

export function AdminLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex items-center justify-between border-b border-line p-4 md:hidden">
        <p className="font-serif text-base text-ink">Admin</p>
        <button
          type="button"
          aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-px w-5 bg-ink transition-transform ${isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-ink transition-transform ${isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </header>

      <aside
        className={`${isMenuOpen ? "block" : "hidden"} w-full shrink-0 border-b border-line p-4 md:block md:w-56 md:border-b-0 md:border-r`}
      >
        <p className="mb-6 hidden px-3 font-serif text-base text-ink md:block">Admin</p>
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="mt-8 px-3 text-sm text-muted hover:text-ink"
        >
          Esci
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
