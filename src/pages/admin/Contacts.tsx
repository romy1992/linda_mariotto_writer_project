import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "../../hooks/useCollection";
import { contactsService } from "../../services/contacts.service";
import { formatDate } from "../../utils/formatDate";
import type { ContactRequest } from "../../types";

export function Contacts() {
  const constraints = useMemo(() => [orderBy("createdAt", "desc")], []);
  const { data: contacts } = useCollection<ContactRequest>("contacts", constraints);

  async function handleDelete(id: string) {
    if (confirm("Eliminare questa richiesta?")) {
      await contactsService.remove(id);
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-ink">Richieste di contatto</h1>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="border border-line p-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-serif text-lg text-ink">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="text-xs text-muted">{formatDate(contact.createdAt)}</p>
            </div>
            <p className="text-sm text-muted">
              {contact.email}
              {contact.phone ? ` · ${contact.phone}` : ""} · {contact.projectType}
            </p>
            <p className="mt-3 text-ink">{contact.message}</p>
            <button
              onClick={() => handleDelete(contact.id)}
              className="mt-3 text-xs text-red-700"
            >
              Elimina
            </button>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-muted">Nessuna richiesta ricevuta.</p>}
      </div>
    </div>
  );
}
