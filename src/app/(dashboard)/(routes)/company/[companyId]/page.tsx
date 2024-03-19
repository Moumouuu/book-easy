"use client";
import DatatableSkeleton from "@/components/datatable/datatableSkeleton";
import DefaultError from "@/components/defaultError";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { maximumFreeFeatures } from "@/constants";
import useCompanyIsPremium from "@/hooks/useCompanyIsPremium";
import { defaultFetcherGet } from "@/lib/fetcher";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { addDays, format, startOfWeek } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import fr from "date-fns/locale/fr";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { ButtonNewReservation } from "./_components/buttonNewReservation";
import { SheetUpdateBook } from "./bookings/_components/columns";

export interface IReservationType {
  id: string;
  start_at: Date;
  end_at: Date;
  price: number;
  created_by: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function Calendar() {
  const { companyId } = useCompany();
  const {
    data: reservations,
    isLoading,
    error,
  } = useSWR(`/api/company/${companyId}/calendar/bookings`, defaultFetcherGet);
  const { isPremium } = useCompanyIsPremium();
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate);

  const navigateToPreviousWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, -7));
  };

  const navigateToNextWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 7));
  };

  const focusToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) return <DatatableSkeleton />;
  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  const limitReservationReached =
    reservations.length >= maximumFreeFeatures.numberOfOrders && !isPremium;

  const limitCustomerReached =
    reservations.filter(
      (reservation: IReservationType) => reservation.created_by?.email
    ).length >= maximumFreeFeatures && !isPremium;

  return (
    <div className="w-full h-[90%] px-4 py-8">
      <div className="flex justify-between mb-4">
        <div className="items-center flex">
          <Button variant={"outline"} className="mx-1" onClick={focusToday}>
            Aujourd&apos;hui
          </Button>
          <Button
            variant={"outline"}
            className="mx-1"
            onClick={navigateToPreviousWeek}
          >
            <ArrowLeft size={20} />
          </Button>
          <Button
            variant={"outline"}
            className="mx-1"
            onClick={navigateToNextWeek}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <h2 className="text-2xl font-bold">
          {/* Render the month and the year in french*/}
          {capitalizeFirstLetter(
            format(currentDate, "MMMM yyyy", {
              locale: fr,
            })
          )}
        </h2>
        {/* Render the button to create a new reservation */}
        {limitCustomerReached || limitReservationReached ? (
          <Button disabled>Quota atteint</Button>
        ) : (
          <ButtonNewReservation />
        )}
      </div>
      <div className="flex p-2">
        {/* Render days of the week */}
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
          (day, index: number) => (
            <div key={day} className="flex-1 text-center font-bold">
              {/* Render the date and the number of the date */}
              {day} {format(addDays(startOfCurrentWeek, index + 1), "dd/MM")}
            </div>
          )
        )}
      </div>
      <div className="flex flex-wrap h-full overflow-y-scroll ">
        {/* Render dates of the week */}
        {Array.from({ length: 7 }, (_, index) => {
          const date = addDays(startOfWeek(currentDate), index);
          return (
            <div key={date.getTime()} className="flex-1 border p-2 h-full">
              {/* Render reservation cards for each day */}
              <ReservationCard reservations={reservations} date={date} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  reservations: IReservationType[];
  date: Date;
}

const ReservationCard: React.FC<Props> = ({ reservations, date }) => {
  return (
    <>
      {reservations
        .filter(
          (reservation: IReservationType) =>
            format(
              utcToZonedTime(new Date(reservation.start_at), "UTC"),
              "yyyy-MM-dd"
            ) ===
            format(
              utcToZonedTime(addDays(new Date(date), 2), "UTC"),
              "yyyy-MM-dd"
            )
        )
        .sort(
          (a, b) =>
            new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
        )
        .map((reservation: IReservationType) => (
          <Dialog key={reservation.id}>
            <DialogTrigger asChild>
              <div
                key={reservation.id}
                className="bg-primary hover:bg-primary/70 transition duration-200 p-2 my-2 rounded cursor-pointer"
              >
                <p>
                  {format(
                    utcToZonedTime(new Date(reservation.start_at), "UTC"),
                    "HH:mm"
                  )}{" "}
                  -{" "}
                  {format(
                    utcToZonedTime(new Date(reservation.end_at), "UTC"),
                    "HH:mm"
                  )}
                </p>
                <p className="font-semibold">
                  {reservation.created_by?.firstName}{" "}
                  {reservation.created_by?.lastName}
                </p>
                <p>{reservation.price}€</p>
              </div>
            </DialogTrigger>
            <SheetUpdateBook book={reservation} />
          </Dialog>
        ))}
    </>
  );
};
