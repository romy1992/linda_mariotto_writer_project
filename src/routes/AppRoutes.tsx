import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { Home } from "../pages/public/Home";
import { About } from "../pages/public/About";
import { Services } from "../pages/public/Services";
import { ServiceDetail } from "../pages/public/ServiceDetail";
import { Portfolio } from "../pages/public/Portfolio";
import { PortfolioDetail } from "../pages/public/PortfolioDetail";
import { Books } from "../pages/public/Books";
import { BookDetail } from "../pages/public/BookDetail";
import { Articles } from "../pages/public/Articles";
import { ArticleDetail } from "../pages/public/ArticleDetail";
import { Testimonials } from "../pages/public/Testimonials";
import { Contact } from "../pages/public/Contact";
import { Privacy } from "../pages/public/Privacy";
import { NotFound } from "../pages/public/NotFound";

// Admin bundle (auth forms, Tiptap editor, react-hook-form/zod) is lazy-loaded
// so public visitors never pay for it.
const AdminLayout = lazy(() =>
  import("../layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const Login = lazy(() => import("../pages/admin/Login").then((m) => ({ default: m.Login })));
const Dashboard = lazy(() =>
  import("../pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Profile = lazy(() =>
  import("../pages/admin/Profile").then((m) => ({ default: m.Profile })),
);
const Content = lazy(() =>
  import("../pages/admin/Content").then((m) => ({ default: m.Content })),
);
const Media = lazy(() => import("../pages/admin/Media").then((m) => ({ default: m.Media })));
const Contacts = lazy(() =>
  import("../pages/admin/Contacts").then((m) => ({ default: m.Contacts })),
);
const TestimonialsAdmin = lazy(() =>
  import("../pages/admin/Testimonials").then((m) => ({ default: m.TestimonialsAdmin })),
);
const ServicesList = lazy(() =>
  import("../pages/admin/services/List").then((m) => ({ default: m.ServicesList })),
);
const ServiceForm = lazy(() =>
  import("../pages/admin/services/Form").then((m) => ({ default: m.ServiceForm })),
);
const PortfolioList = lazy(() =>
  import("../pages/admin/portfolio/List").then((m) => ({ default: m.PortfolioList })),
);
const PortfolioForm = lazy(() =>
  import("../pages/admin/portfolio/Form").then((m) => ({ default: m.PortfolioForm })),
);
const BooksList = lazy(() =>
  import("../pages/admin/books/List").then((m) => ({ default: m.BooksList })),
);
const BookForm = lazy(() =>
  import("../pages/admin/books/Form").then((m) => ({ default: m.BookForm })),
);
const ArticlesList = lazy(() =>
  import("../pages/admin/articles/List").then((m) => ({ default: m.ArticlesList })),
);
const ArticleForm = lazy(() =>
  import("../pages/admin/articles/Form").then((m) => ({ default: m.ArticleForm })),
);
const SocialList = lazy(() =>
  import("../pages/admin/social/List").then((m) => ({ default: m.SocialList })),
);
const SocialForm = lazy(() =>
  import("../pages/admin/social/Form").then((m) => ({ default: m.SocialForm })),
);

function AdminFallback() {
  return <div className="flex min-h-screen items-center justify-center text-muted">Caricamento…</div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="chi-sono" element={<About />} />
        <Route path="servizi" element={<Services />} />
        <Route path="servizi/:slug" element={<ServiceDetail />} />
        <Route path="lavori" element={<Portfolio />} />
        <Route path="lavori/:slug" element={<PortfolioDetail />} />
        <Route path="libri" element={<Books />} />
        <Route path="libri/:slug" element={<BookDetail />} />
        <Route path="articoli" element={<Articles />} />
        <Route path="articoli/:slug" element={<ArticleDetail />} />
        <Route path="dicono-di-me" element={<Testimonials />} />
        <Route path="contatti" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <Login />
          </Suspense>
        }
      />

      <Route path="admin" element={<ProtectedRoute />}>
        <Route
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profilo" element={<Profile />} />
          <Route path="contenuti" element={<Content />} />
          <Route path="servizi" element={<ServicesList />} />
          <Route path="servizi/:id" element={<ServiceForm />} />
          <Route path="lavori" element={<PortfolioList />} />
          <Route path="lavori/:id" element={<PortfolioForm />} />
          <Route path="libri" element={<BooksList />} />
          <Route path="libri/:id" element={<BookForm />} />
          <Route path="articoli" element={<ArticlesList />} />
          <Route path="articoli/:id" element={<ArticleForm />} />
          <Route path="social" element={<SocialList />} />
          <Route path="social/:id" element={<SocialForm />} />
          <Route path="media" element={<Media />} />
          <Route path="recensioni" element={<TestimonialsAdmin />} />
          <Route path="contatti" element={<Contacts />} />
        </Route>
      </Route>
    </Routes>
  );
}
