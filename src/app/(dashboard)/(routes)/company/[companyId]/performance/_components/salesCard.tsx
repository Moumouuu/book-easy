// 'use client';
import DefaultError from "@/components/defaultError";
import useIsPremium from "@/hooks/useIsPremium";
import { defaultFetcherGet } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { BarChart, Card, Divider, Switch } from "@tremor/react";
import { useState } from "react";
import useSWR from "swr";
import { PerformanceAreaSkeleton } from "./skeletons/performanceAreaSkeleton";
import PremiumButton from "@/components/premiumButton";

export function valueFormatter(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
    currency: "EUR",
    style: "currency",
  });

  return formatter.format(number);
}
export default function SalesCard() {
  const isSubscribed = useIsPremium();
  const { companyId } = useCompany();
  const [showComparison, setShowComparison] = useState(false);
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/sales`,
    defaultFetcherGet
  );

  if (isLoading) {
    return <PerformanceAreaSkeleton />;
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
    <div className="relative w-full m-3">
      {!isSubscribed.isPremium && (
        <KPINotSubscribe
          title="Abonnez-vous pour voir cette section"
          message="Obtenez des informations plus détaillées sur vos ventes grâce à des comparaisons mensuelles et annuelles."
        />
      )}
      <Card className={cn(!isSubscribed.isPremium && "blur")}>
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong  mr-1 font-semibold">
          Aperçu des ventes
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Comparaison des ventes de cette année avec celles de l&apos;année
          dernière
        </p>
        <BarChart
          data={data}
          index="date"
          categories={
            showComparison ? ["Last Month", "This Month"] : ["This Month"]
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
            showComparison ? ["Last Month", "This Month"] : ["This Month"]
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
            Comparaison avec l&apos;année dernière
          </label>
        </div>
      </Card>
    </div>
  );
}

export function KPINotSubscribe({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="z-10 absolute h-full">
      <div className="h-full w-full">
        <div className="text-center h-full flex items-center justify-center flex-col">
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong text-2xl font-semibold">
            {title}
          </h3>
          <p className="text-tremor-default text-muted-foreground mt-2 mb-4">
            {message}
          </p>
          <PremiumButton />
        </div>
      </div>
    </div>
  );
}
