import AreaCard from "./_components/areaCard";
import KPISection from "./_components/KPISection";

export default function Performance() {
  return (
    <div className="flex w-full flex-col p-4">
      <KPISection />
      <AreaCard />
    </div>
  );
}
