"use client";
import { defaultFetcherGet } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { Card } from "@tremor/react";
import useSWR from "swr";
import { PerformanceKpiSkeleton } from "./skeletons/performanceKPISkeleton";
import DefaultError from "@/components/defaultError";

interface ICompanyStats {
  label: string;
  value: number;
  percentageChange: number;
  changeType: "positive" | "negative" | "neutral";
  suffix?: string;
}

interface IProps {
  period: string;
}

export default function KPICards({ period }: IProps) {
  const { companyId } = useCompany();

  const {
    data: companyStats,
    error,
    isLoading,
  } = useSWR(
    `/api/company/${companyId}/performance/kpi?period=${period}`,
    defaultFetcherGet,
  );

  if (isLoading) {
    return <PerformanceKpiSkeleton />;
  }

  if (error) {
    return (
      <DefaultError
        title="Un problème est survenue lors de la récupération de l'information."
        message={error.message}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companyStats.KPI.map((companyStat: ICompanyStats) => (
          <Card key={companyStat.label}>
            <div className="flex items-center justify-between">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content font-medium">
                {companyStat.label}
              </p>
              <span
                className={cn(
                  companyStat.changeType === "positive"
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                    : "bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20",
                  "rounded-tremor-small text-tremor-label inline-flex items-center px-2 py-1 font-medium ring-1 ring-inset",
                )}
              >
                {companyStat.percentageChange}%{" "}
                {companyStat.changeType === "positive" ? "↑" : "↓"}
              </span>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              {companyStat.value} {companyStat?.suffix}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
