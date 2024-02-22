"use client";
import KPISection from "./_components/KPISection";
import AreaCard from "./_components/areaCard";
import FutureReservationsCard from "./_components/futureReservationsCard";
import GeneralCompanyStats from "./_components/generalCompanyStats";
import ReservationPercentage from "./_components/reservationPercentage";
import ReservationsCard from "./_components/reservationsCard";
import SalesCard from "./_components/salesCard";
import { SoonReservationCard } from "./_components/soonReservationCard";

export default function Performance() {
  return (
    <div className="flex w-full flex-col p-4">
      <KPISection />
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row ">
        <AreaCard />
        <SalesCard />
      </div>
      <GeneralCompanyStats />
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row">
        <ReservationsCard />
        <FutureReservationsCard />
      </div>
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row">
        <SoonReservationCard />
        <ReservationPercentage />
      </div>
    </div>
  );
}
