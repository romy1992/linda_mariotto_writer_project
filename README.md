# linda_mariotto_writer_project

## Sviluppo Firebase locale isolato

In sviluppo il frontend usa un progetto fittizio (`demo-linda-writer`) e la
Firebase Emulator Suite eseguita in Docker. Nessuna operazione locale raggiunge
Firestore, Storage, Authentication o Functions del progetto di produzione.

### Avvio

Prerequisito: Docker Desktop in esecuzione.

```powershell
npm run emulators:up
npm run emulators:check
```

Il primo comando avvia in Docker sia Firebase Emulator Suite sia il sito Vite.
Non serve eseguire separatamente `npm run dev` sul computer.

`emulators:check` verifica il sito, i quattro servizi Firebase, il login admin,
un ciclo scrittura/lettura/cancellazione su Firestore e Storage e il rifiuto
delle letture private senza autenticazione.

Aprire:

- sito locale: http://127.0.0.1:5175
- pannello admin: http://127.0.0.1:5175/admin/login
- Firebase Emulator UI: http://127.0.0.1:4000

Credenziali dell'amministratore esclusivamente locale:

```text
Email: admin@local.test
Password: LocalAdmin2026!
```

L'UID locale coincide intenzionalmente con quello richiesto dalle regole, così
Firestore, Storage e la Function AI possono essere testati con le stesse regole
di autorizzazione della produzione.

### Servizi e dati

| Servizio | Porta locale |
| --- | ---: |
| Sito Vite | 5175 |
| Emulator UI | 4000 |
| Functions | 5001 |
| Firestore | 8080 |
| Authentication | 9099 |
| Storage | 9199 |

I dati sono esportati in `.firebase-emulator-data/export/`, che è locale e
ignorata da Git. `npm run emulators:down` attende il completamento dell'export e
solo dopo arresta i container; se l'export fallisce, non li spegne. Al riavvio i
dati vengono importati automaticamente. Usare quindi questo comando, invece di
`docker compose down`, quando si vogliono conservare le modifiche locali.

Per seguire i log o controllare lo stato:

```powershell
npm run emulators:logs
npm run emulators:status
```

### Separazione dalla produzione

`.env.development.local` sostituisce la configurazione Firebase con valori
`demo-*` e abilita tutti gli emulatori con un unico flag. Il codice interrompe
l'avvio se il flag locale è attivo ma il project ID non comincia con `demo-`.
Le build di produzione non caricano `.env.development.local`.

La Function AI gira localmente, ma continua a chiamare Anthropic attraverso
`functions/.secret.local`. Usare una chiave di sviluppo separata se si desidera
separare anche i consumi Anthropic.
