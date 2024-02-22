export const appTitle = "Bookeasy";

export const formatDate = (date: string) => {
  const options: any = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { utcToZonedTime } from "date-fns-tz";

export const formatDateWithTime = (date: string | null) => {
  if (!date) return "";

  const utcDate = new Date(date);
  const zonedDate = utcToZonedTime(utcDate, "UTC"); // Convertir en temps UTC
  return format(zonedDate, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
};
