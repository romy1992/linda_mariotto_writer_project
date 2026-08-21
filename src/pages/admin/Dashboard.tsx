import { useCollection } from "../../hooks/useCollection";
import type {
  Article,
  Book,
  ContactRequest,
  PortfolioItem,
  Service,
  SocialPost,
  Testimonial,
} from "../../types";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}

export function Dashboard() {
  const { data: articles } = useCollection<Article>("articles");
  const { data: services } = useCollection<Service>("services");
  const { data: portfolio } = useCollection<PortfolioItem>("portfolio");
  const { data: books } = useCollection<Book>("books");
  const { data: socialPosts } = useCollection<SocialPost>("socialPosts");
  const { data: contacts } = useCollection<ContactRequest>("contacts");
  const { data: testimonials } = useCollection<Testimonial>("testimonials");

  const publishedArticles = articles.filter((a) => a.status === "published").length;
  const draftArticles = articles.filter((a) => a.status === "draft").length;
  const pendingTestimonials = testimonials.filter((item) => item.status === "pending").length;

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Articoli pubblicati" value={publishedArticles} />
        <StatCard label="Articoli in bozza" value={draftArticles} />
        <StatCard label="Servizi" value={services.length} />
        <StatCard label="Lavori" value={portfolio.length} />
        <StatCard label="Libri" value={books.length} />
        <StatCard label="Contenuti social" value={socialPosts.length} />
        <StatCard label="Recensioni da approvare" value={pendingTestimonials} />
        <StatCard label="Richieste contatto" value={contacts.length} />
      </div>
    </div>
  );
}
