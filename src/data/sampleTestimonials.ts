import { PRIVACY_NOTICE_VERSION } from "../constants/privacy";
import type { Testimonial } from "../types";

type SampleTestimonial = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

export const SAMPLE_TESTIMONIALS: SampleTestimonial[] = [
  {
    displayName: "Chiara Ferraro",
    rating: 5,
    comment:
      "Avevo mesi di audio e fogli sparsi sulla storia di mio padre. Linda ha saputo ascoltare senza forzare nulla e ha restituito una biografia che sembra davvero la sua voce: semplice, calda, senza retorica. Le revisioni sono state chiare e mai invasive.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Marco Bellini",
    rating: 5,
    comment:
      "Per LinkedIn mi serviva un tono più serio senza diventare freddo. In poche settimane ha sistemato profilo, post e una serie di articoli: adesso ricevo messaggi da persone che prima non mi scrivevano. Lavoro puntuale e molto concreto.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Elena Romano",
    rating: 5,
    comment:
      "Volevo un’autobiografia per i miei figli, non un libro “da libreria”. Linda ha fatto domande che non mi aspettavo e ha tenuto insieme ricordi difficili con delicatezza. Il testo finale mi emoziona ogni volta che lo rileggo.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Andrea Conti",
    rating: 4,
    comment:
      "Avevo un libro breve in testa ma non sapevo da dove partire. Ci siamo dati una struttura chiara, scadenze realistiche e due giri di revisione. Il risultato non è perfetto al millimetro, ma è onesto e leggibile: per me contava soprattutto questo.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Francesca De Luca",
    rating: 5,
    comment:
      "Gestisco un piccolo brand e i contenuti Instagram mi rubavano intere serate. Linda ha trovato un linguaggio che sembra mio, non “da copy”. Piano editoriale chiaro, bozze rapide, poche correzioni necessarie. Finalmente pubblico con regolarità.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Luca Moretti",
    rating: 5,
    comment:
      "Dopo anni in azienda volevo raccontare il percorso senza sembrare un curriculum. Ha trasformato meeting e appunti in una narrazione continua, con il tono giusto tra professionale e personale. Consegna nei tempi e comunicazione sempre precisa.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Giulia Bianchi",
    rating: 5,
    comment:
      "Avevo paura di non riconoscermi nel testo. Invece ogni capitolo mi somiglia: le pause, le parole che uso davvero, anche i dubbi. Linda non scrive “al posto tuo”, ti aiuta a dire quello che già sapevi ma non riuscivi a mettere in ordine.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Paolo Ricci",
    rating: 4,
    comment:
      "Collaborazione seria e senza fronzoli. Mi ha aiutato a chiudere una serie di articoli per il sito aziendale che restavano in bozza da mesi. Qualche andirivieni in più del previsto sulle bozze, ma il livello finale vale la pena.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Sara Martini",
    rating: 5,
    comment:
      "Per la biografia di mia nonna serviva rispetto e pazienza. Linda ha intervistato anche parenti, ha verificato date e aneddoti, e ha tenuto un ritmo che si legge tutto d’un fiato. In famiglia siamo rimasti colpiti da quanto sia fedele e leggero insieme.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
  {
    displayName: "Davide Gallo",
    rating: 5,
    comment:
      "Mi serviva ghostwriting per LinkedIn: post, commenti strategici e un paio di newsletter. Ha capito subito il pubblico a cui mi rivolgo e ha proposto un calendario sostenibile. Zero stile generico, massima affidabilità sulle scadenze.",
    status: "published",
    isDemo: false,
    publicationConsent: true,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
  },
];
