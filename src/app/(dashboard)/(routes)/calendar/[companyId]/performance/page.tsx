"use client";
import AreaCard from "./_components/areaCard";
import KPISection from "./_components/KPISection";
import ReservationsCard from "./_components/reservationsCard";
import SalesCard from "./_components/salesCard";
import GeneralCompanyStats from "./_components/generalCompanyStats";
import UserSection from "./_components/userSection";
import FutureReservationsCard from "./_components/futureReservationsCard";

export default function Performance() {
  return (
    <div className="flex w-full flex-col p-4">
      <UserSection />

      <KPISection />
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row ">
        <AreaCard />
        <SalesCard />
      </div>
      <GeneralCompanyStats />
      <div className="my-5 flex flex-col justify-center rounded border p-4 ">
        <ReservationsCard />
        <FutureReservationsCard />
      </div>
    </div>
  );
}
