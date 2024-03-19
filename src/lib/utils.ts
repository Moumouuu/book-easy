import { type ClassValue, clsx } from "clsx"
import { format, utcToZonedTime } from "date-fns-tz";
import { twMerge } from "tailwind-merge"
import { fr } from "date-fns/locale";
import { parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BOOKEASY_URL}/${path}`;
}
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatDate = (date: Date): string => {
  return format(
    utcToZonedTime(parseISO(date.toISOString()), "UTC"),
    "EEEE d MMMM 'à' HH'h'mm",
    {
      locale: fr,
    }
  );
};