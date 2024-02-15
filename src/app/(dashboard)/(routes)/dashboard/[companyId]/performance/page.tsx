"use client";
import AreaCard from "./_components/areaCard";
import KPISection from "./_components/KPISection";
import SalesCard from "./_components/salesCard";

export default function Performance() {
  return (
    <div className="flex w-full flex-col p-4">
      <KPISection />
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row ">
        <AreaCard />
        <SalesCard />
        {/*todo pricing element like number of members in team, number of account clients etc avec des ronds*/}
      </div>
      <div className="my-5 flex flex-col justify-center rounded border p-4 lg:flex-row ">
        {/*todo aperçu des réservations / mois sur les 12 derniers mois */}
        <SalesCard />
      </div>
    </div>
  );
}
