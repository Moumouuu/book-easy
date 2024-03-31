"use client";
import { PerformanceKpiSkeleton } from "@/app/(dashboard)/(routes)/company/[companyId]/performance/_components/skeletons/performanceKPISkeleton";
import DefaultError from "@/components/defaultError";
import { defaultFetcherGet } from "@/lib/fetcher";
import { Book as BookType } from "@prisma/client";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { BadgeEuro, CalendarClock, Home } from "lucide-react";
import useSWR from "swr";

interface UserBooksPage extends BookType {
  company: {
    name: string;
    address: string;
  };
}

export default function UserBooksPage() {
  const {
    data: books,
    error,
    isLoading,
  } = useSWR<UserBooksPage[]>("/api/reservation", defaultFetcherGet);

  if (isLoading) return <PerformanceKpiSkeleton />;

  if (error)
    return <DefaultError title="Une erreur est survenue" message={error} />;

  if (books?.length === 0 || !books)
    return (
      <p className="text-xl text-semibold justify-center flex items-center h-56">
        Vous n&apos;avez pas de réservation
      </p>
    );

  return (
    <div className="flex flex-col items-center m-4 justify-center my-12">
      <h1 className="text-xl font-semibold ">Vos réservations</h1>
      <div className="flex flex-wrap justify-center w-[80%]">
        {books.map((book: UserBooksPage) => (
          <Book key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}

function Book({ id, price, start_at, end_at, company }: UserBooksPage) {
  return (
    <div
      key={id}
      className="bg-primary w-[300px] hover:bg-primary/70 transition duration-200 p-2 m-3 rounded "
    >
      <p className="text-md font-bold text-center">{company.name}</p>

      <p className="flex items-center my-2">
        <CalendarClock className="mr-1" size={20} />
        {format(
          utcToZonedTime(new Date(start_at), "Europe/Paris"),
          "HH:mm"
        )} - {format(utcToZonedTime(new Date(end_at), "Europe/Paris"), "HH:mm")}
      </p>

      <p className="text-sm items-center flex my-2">
        <Home className="mr-1" size={20} />
        {company.address}
      </p>

      {!!price && (
        <p className="flex items-center mb-2">
          <BadgeEuro className="mr-1" size={20} />
          {price}€
        </p>
      )}
    </div>
  );
}
