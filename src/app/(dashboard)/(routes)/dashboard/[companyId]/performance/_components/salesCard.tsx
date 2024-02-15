// 'use client';
import { defaultFetcherGet } from "@/lib/fetcher";
import { BarChart, Card, Divider, Switch } from "@tremor/react";
import { useState } from "react";
import useSWR from "swr";
import { PerformanceAreaSkeleton } from "./skeletons/performanceAreaSkeleton";
import { useCompany } from "@/store/dashboard";

function valueFormatter(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "EUR",
  });

  return formatter.format(number);
}

export default function SalesCard() {
  const { companyId } = useCompany();
  const [showComparison, setShowComparison] = useState(false);
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/sales`,
    defaultFetcherGet,
  );

  if (isLoading) {
    return <PerformanceAreaSkeleton />;
  }

  if (error) {
    return <div>Failed to load</div>;
  }

  return (
    <>
      <Card className="m-3">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong  mr-1 font-semibold">
          Aperçu des ventes
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Comparaison des ventes de cette année avec celles de l'année dernière
        </p>
        <BarChart
          data={data}
          index="date"
          categories={
            showComparison ? ["Last Year", "This Year"] : ["This Year"]
          }
          colors={showComparison ? ["cyan", "blue"] : ["blue"]}
          valueFormatter={valueFormatter}
          yAxisWidth={45}
          className="mt-6 hidden h-60 sm:block"
        />
        <BarChart
          data={data}
          index="date"
          categories={
            showComparison ? ["Last Year", "This Year"] : ["This Year"]
          }
          colors={showComparison ? ["cyan", "blue"] : ["blue"]}
          valueFormatter={valueFormatter}
          showYAxis={false}
          className="mt-4 h-56 sm:hidden"
        />
        <Divider />
        <div className="mb-2 flex items-center space-x-3">
          <Switch
            id="comparison"
            onChange={() => setShowComparison(!showComparison)}
          />
          <label
            htmlFor="comparison"
            className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
          >
            Comparaison avec l'année dernière
          </label>
        </div>
      </Card>
    </>
  );
}
