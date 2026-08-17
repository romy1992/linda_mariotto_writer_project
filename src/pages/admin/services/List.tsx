import { Link } from "react-router-dom";
import { orderBy } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "../../../hooks/useCollection";
import { servicesService } from "../../../services/services.service";
import type { Service } from "../../../types";

export function ServicesList() {
  const constraints = useMemo(() => [orderBy("order")], []);
  const { data: services } = useCollection<Service>("services", constraints);

  async function handleDelete(id: string) {
    if (confirm("Eliminare questo servizio?")) {
      await servicesService.remove(id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl text-ink">Servizi</h1>
        <Link to="/admin/servizi/nuovo" className="bg-ink px-4 py-2 text-sm text-paper">
          + Nuovo servizio
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2">Titolo</th>
              <th className="py-2">Stato</th>
              <th className="py-2">Ordine</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-line">
                <td className="py-3 text-ink">{service.title}</td>
                <td className="py-3 text-muted">{service.status}</td>
                <td className="py-3 text-muted">{service.order}</td>
                <td className="py-3 text-right">
                  <Link to={`/admin/servizi/${service.id}`} className="mr-4 text-accent">
                    Modifica
                  </Link>
                  <button onClick={() => handleDelete(service.id)} className="text-red-700">
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
