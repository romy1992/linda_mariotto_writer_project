import { Link } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";
import { PRIVACY_NOTICE_VERSION } from "../../constants/privacy";
import { useDocument } from "../../hooks/useDocument";
import type { SiteSettings } from "../../types";

const LAST_UPDATED = "21 agosto 2026";

export function Privacy() {
  const { data: settings } = useDocument<SiteSettings>("settings", "site");
  const controllerName = settings?.professionalName?.trim() || "Linda Mariotto";
  const contactEmail = settings?.email?.trim();

  return (
    <>
      <Seo
        title="Informativa privacy — Linda Mariotto"
        description="Informativa sul trattamento dei dati personali ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR)."
      />
      <section className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-accent">Legale</p>
        <h1 className="mb-2 font-serif text-4xl text-ink md:text-5xl">Informativa privacy</h1>
        <p className="mb-12 text-sm text-muted">
          Informativa ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR)
        </p>

        <div className="space-y-8 text-ink [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-xl [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-muted">
          <div>
            <h2>Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento è {controllerName}. Per richieste relative ai dati
              personali è possibile utilizzare il <Link to="/contatti">modulo di contatto</Link>
              {contactEmail ? (
                <>
                  {" "}o scrivere a <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </>
              ) : null}
              .
            </p>
          </div>

          <div>
            <h2>Dati trattati</h2>
            <p>Il sito tratta le seguenti categorie di dati:</p>
            <ul>
              <li>
                dati inviati tramite il modulo: nome, cognome, indirizzo email, eventuale numero
                di telefono, tipologia di progetto e contenuto del messaggio;
              </li>
              <li>
                data e ora dell'invio e versione dell'informativa mostrata al momento della
                richiesta;
              </li>
              <li>
                per le recensioni: nome o nome visualizzato, valutazione da una a cinque stelle,
                testo della recensione, stato di moderazione, data e ora dell'invio e prova del
                consenso alla pubblicazione;
              </li>
              <li>
                dati tecnici di navigazione trattati dai sistemi necessari al funzionamento e
                alla sicurezza del sito, come indirizzo IP, tipo di browser o dispositivo,
                risorsa richiesta e log tecnici.
              </li>
            </ul>
            <p className="mt-3">
              Nel messaggio è opportuno non inserire dati particolari, come informazioni sulla
              salute, né dati personali di terzi non necessari alla richiesta.
            </p>
          </div>

          <div>
            <h2>Finalità e basi giuridiche</h2>
            <ul>
              <li>
                Rispondere a richieste di informazioni o preventivo e gestire le comunicazioni
                conseguenti: esecuzione di misure precontrattuali richieste dall'interessato (art.
                6, par. 1, lett. b GDPR).
              </li>
              <li>
                Garantire il funzionamento e la sicurezza del sito, prevenire abusi e risolvere
                problemi tecnici: legittimo interesse del titolare alla sicurezza dei propri
                sistemi (art. 6, par. 1, lett. f GDPR).
              </li>
              <li>
                Valutare e, dopo approvazione, pubblicare una recensione con il nome indicato e la
                relativa valutazione: consenso dell'interessato (art. 6, par. 1, lett. a GDPR).
                La moderazione serve inoltre a prevenire abusi e contenuti illeciti, sulla base
                del legittimo interesse del titolare.
              </li>
              <li>
                Adempiere a eventuali obblighi di legge e accertare, esercitare o difendere un
                diritto: obbligo legale o legittimo interesse del titolare, secondo il caso (art.
                6, par. 1, lett. c o f GDPR).
              </li>
            </ul>
            <p className="mt-3">
              I dati raccolti con il modulo non sono utilizzati per newsletter, pubblicità,
              profilazione o altre finalità di marketing.
            </p>
          </div>

          <div>
            <h2>Natura del conferimento</h2>
            <p>
              I campi indicati come obbligatori sono necessari per esaminare e rispondere alla
              richiesta; senza tali dati non è possibile inviare il modulo. Il numero di telefono
              è facoltativo. Non viene richiesto il consenso al trattamento necessario per
              rispondere: la casella presente nel modulo serve a confermare la presa visione di
              questa informativa. L'invio di una recensione è facoltativo; è possibile usare un
              nome visualizzato anziché il nome anagrafico, ma l'autorizzazione alla pubblicazione
              è necessaria per inviarla.
            </p>
          </div>

          <div>
            <h2>Modalità del trattamento</h2>
            <p>
              I dati sono trattati con strumenti elettronici, secondo principi di liceità,
              correttezza, trasparenza e minimizzazione. L'accesso alle richieste è limitato al
              titolare e agli eventuali soggetti autorizzati o fornitori che ne abbiano necessità
              per erogare il servizio.
            </p>
          </div>

          <div>
            <h2>Destinatari e fornitori</h2>
            <p>
              I dati sono trattati tramite servizi Google Firebase, utilizzati per l'hosting del
              sito, la sicurezza e l'archiviazione delle richieste. Google opera come responsabile
              del trattamento nei casi previsti dai relativi accordi. I dati possono inoltre
              essere comunicati a consulenti o autorità quando necessario per obblighi di legge o
              per la tutela di un diritto. Dopo l'approvazione, nome visualizzato, valutazione e
              testo della recensione diventano visibili ai visitatori del sito. Gli altri dati di
              moderazione non sono pubblici. I dati non sono venduti o comunicati a terzi per
              finalità di marketing. Ulteriori informazioni sono disponibili nella pagina
              ufficiale sulla{" "}
              <a href="https://firebase.google.com/support/privacy">
                privacy e sicurezza di Firebase
              </a>
              .
            </p>
          </div>

          <div>
            <h2>Trasferimenti fuori dallo Spazio Economico Europeo</h2>
            <p>
              Nell'erogazione dei servizi Firebase, Google e i suoi sub-responsabili possono
              trattare dati anche in Paesi esterni allo Spazio Economico Europeo. In tali casi il
              trasferimento avviene sulla base dei meccanismi previsti dal GDPR, quali decisioni
              di adeguatezza o clausole contrattuali standard, secondo i termini applicabili al
              servizio.
            </p>
          </div>

          <div>
            <h2>Conservazione</h2>
            <p>
              Le richieste che non danno origine a un rapporto professionale sono conservate per
              il tempo necessario a gestirle e comunque non oltre 12 mesi dalla conclusione della
              corrispondenza. Se dalla richiesta nasce un rapporto professionale, i dati necessari
              alla sua gestione sono conservati per la durata del rapporto e, per quanto richiesto
              dalla normativa civile e fiscale, di regola per 10 anni dalla sua conclusione. I
              dati possono essere conservati più a lungo quando necessario per un contenzioso o
              per adempiere a un obbligo di legge. I log tecnici sono conservati per periodi
              limitati, determinati in base a esigenze di sicurezza e alle configurazioni del
              fornitore. Le recensioni non pubblicate o rifiutate sono eliminate entro 6 mesi;
              quelle pubblicate restano online fino alla revoca del consenso o finché risultano
              pertinenti, salvo conservazione ulteriore necessaria per tutelare un diritto.
            </p>
          </div>

          <div>
            <h2>Cookie e altri strumenti tecnici</h2>
            <p>
              Il sito pubblico non utilizza cookie di profilazione né strumenti di analisi
              statistica o marketing. L'area riservata utilizza esclusivamente strumenti tecnici
              necessari all'autenticazione e alla sicurezza; per questi strumenti non è richiesto
              il consenso. Se in futuro saranno introdotti strumenti non tecnici, questa
              informativa sarà aggiornata e, quando richiesto, tali strumenti saranno attivati
              solo dopo aver raccolto il consenso.
            </p>
          </div>

          <div>
            <h2>Diritti dell'interessato</h2>
            <p>
              Nei casi previsti dagli artt. 15-22 GDPR è possibile chiedere al titolare l'accesso
              ai dati, la rettifica, la cancellazione, la limitazione del trattamento, la
              portabilità o opporsi al trattamento. È inoltre possibile proporre reclamo al{" "}
              <a href="https://www.garanteprivacy.it/">
                Garante per la protezione dei dati personali
              </a>
              . Le richieste possono essere inviate utilizzando i recapiti indicati nella sezione
              “Titolare del trattamento”. Il consenso alla pubblicazione di una recensione può
              essere revocato in qualsiasi momento, senza pregiudicare la liceità del trattamento
              svolto prima della revoca; la recensione verrà quindi rimossa dal sito.
            </p>
          </div>

          <div>
            <h2>Decisioni automatizzate</h2>
            <p>
              I dati raccolti tramite il modulo non sono sottoposti a decisioni unicamente
              automatizzate né a profilazione.
            </p>
          </div>

          <p className="text-xs text-muted">
            Ultimo aggiornamento: {LAST_UPDATED} · Versione {PRIVACY_NOTICE_VERSION}
          </p>
        </div>
      </section>
    </>
  );
}
