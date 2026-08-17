import { format } from "date-fns";
import { it } from "date-fns/locale";

export function formatDate(timestamp: number, pattern = "d MMMM yyyy"): string {
  return format(new Date(timestamp), pattern, { locale: it });
}
