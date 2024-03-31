import { PerformanceKpiSkeleton } from "@/app/(dashboard)/(routes)/company/[companyId]/performance/_components/skeletons/performanceKPISkeleton";
import DefaultError from "@/components/defaultError";
import { Book as BookType } from "@prisma/client";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { BadgeEuro, CalendarClock } from "lucide-react";
import useSWR from "swr";

interface UserBooksPage extends BookType {
  companyName: string;
}

export default function UserBooksPage() {
  const {
    data: books,
    error,
    isLoading,
  } = useSWR<UserBooksPage[]>("/api/reservation");

  if (isLoading) return <PerformanceKpiSkeleton />;

  if (error)
    return <DefaultError title="Une erreur est survenue" message={error} />;

  if (!books)
    return (
      <p className="text-xl text-medium text-center">
        Vous n&apos;avez pas de réservation
      </p>
    );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap">
        {books.map((book: UserBooksPage) => (
          <Book key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}

function Book({ id, price, start_at, end_at, companyName }: UserBooksPage) {
  return (
    <div
      key={id}
      className="bg-primary hover:bg-primary/70 transition duration-200 p-2 my-3 rounded cursor-pointer"
    >
      <p className="flex items-center my-2">
        <CalendarClock className="mr-1" size={20} />
        {format(
          utcToZonedTime(new Date(start_at), "Europe/Paris"),
          "HH:mm"
        )} - {format(utcToZonedTime(new Date(end_at), "Europe/Paris"), "HH:mm")}
      </p>

      {!!price && (
        <p className="flex items-center mb-2">
          <BadgeEuro className="mr-1" size={20} />
          {price}€
        </p>
      )}

      <p className="text-sm font-bold">{companyName}</p>
    </div>
  );
}
