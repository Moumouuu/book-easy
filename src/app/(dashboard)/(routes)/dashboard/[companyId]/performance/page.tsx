"use client";
import { useCompany } from "@/store/dashboard";
import KPICards from "./_components/KPICards";
import useSWR from "swr";
import { defaultFetcherGet } from "@/lib/fetcher";
import { SelectPeriod } from "./_components/selectPeriod";
import { useState } from "react";
import { PeriodEnum } from "@/enum/period";
import { PerformanceSkeleton } from "./_components/PerformanceSkeleton";
import AreaCard from "./_components/areaCard";

export default function Performance() {
  const { companyId } = useCompany();
  const [period, setPeriod] = useState<string>(PeriodEnum.DAY);
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/?period=${period}`,
    defaultFetcherGet,
  );

  if (isLoading) {
    return <PerformanceSkeleton />;
  }

  if (error) {
    return <div>Error</div>;
  }
  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex justify-end pb-4">
        <SelectPeriod period={period} setPeriod={setPeriod} />
      </div>
      <KPICards companyStats={data.KPI} />
      <AreaCard companyStats={data.areaChart} />
    </div>
  );
}
