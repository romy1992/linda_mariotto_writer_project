import { PRIVACY_NOTICE_VERSION } from "../constants/privacy";
import type { Testimonial } from "../types";

type SampleTestimonial = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

export const SAMPLE_TESTIMONIALS: SampleTestimonial[] = [
  {
    displayName: "Cliente esempio 01",
    rating: 5,
    comment:
      "Un ascolto attento e una scrittura capace di restituire la mia voce con naturalezza. Il percorso è stato chiaro, delicato e molto curato.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 02",
    rating: 5,
    comment:
      "Ha dato ordine a ricordi e appunti sparsi, trasformandoli in un racconto coerente ed emozionante senza perdere l’autenticità.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 03",
    rating: 4,
    comment:
      "Metodo preciso, comunicazione puntuale e grande disponibilità nelle revisioni. Mi sono sentito accompagnato in ogni fase del progetto.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 04",
    rating: 5,
    comment:
      "Il testo finale è scorrevole, personale e fedele a ciò che volevo raccontare. Un lavoro sensibile e professionale.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 05",
    rating: 5,
    comment:
      "È riuscita a cogliere il tono giusto fin dalle prime pagine. Le mie idee hanno finalmente trovato una forma chiara e coinvolgente.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 06",
    rating: 4,
    comment:
      "Un confronto sempre costruttivo e rispettoso. Ogni osservazione è stata accolta con attenzione e tradotta in soluzioni efficaci.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 07",
    rating: 5,
    comment:
      "La capacità di fare le domande giuste ha fatto emergere dettagli che non pensavo di riuscire a raccontare. Un’esperienza preziosa.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 08",
    rating: 5,
    comment:
      "Tempi rispettati, revisioni organizzate e una grande cura delle parole. Il risultato è esattamente quello che speravo di ottenere.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 09",
    rating: 4,
    comment:
      "Professionale e disponibile, ha trasformato un progetto ancora confuso in un testo solido, leggibile e pienamente riconoscibile.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Cliente esempio 10",
    rating: 5,
    comment:
      "Un lavoro svolto con empatia e rigore. Mi ha aiutato a raccontare una storia importante con semplicità, rispetto e profondità.",
    status: "published",
    isDemo: true,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
];
