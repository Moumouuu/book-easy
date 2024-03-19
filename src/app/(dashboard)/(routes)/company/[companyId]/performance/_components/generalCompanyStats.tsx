"use client";
import DefaultError from "@/components/defaultError";
import PremiumButton from "@/components/premiumButton";
import { Progress } from "@/components/ui/progress";
import { maximumFreeFeatures } from "@/constants";
import { MaximumFreeFeaturesEnum } from "@/enum/maximumFreeFeatures";
import useIsPremium from "@/hooks/useIsPremium";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import { useState } from "react"; // Import useState hook
import useSWR from "swr";
import { PerformanceKpiSkeleton } from "./skeletons/performanceKPISkeleton";

interface IItems {
  label: string;
  value: number;
  key: MaximumFreeFeaturesEnum;
}

export default function GeneralCompanyStats() {
  const { companyId } = useCompany();
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/general`,
    defaultFetcherGet
  );
  const isPremium = useIsPremium();
  const [showNumber, setShowNumber] = useState(!isPremium); // Initialize showNumber state based on isPremium

  if (error) {
    return (
      <DefaultError
        title="Un problème est survenue lors de la récupération de l'information."
        message={error.message}
      />
    );
  }
  if (isLoading) return <PerformanceKpiSkeleton />;

  const renderPourcentage = (value: number, total: number) => {
    return (value / total) * 100;
  };

  return (
    <>
      <div className="rounded border p-3">
        <div className="mb-3 flex flex-col items-start justify-between lg:flex-row lg:items-center">
          <span className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong my-3 ml-3 font-semibold">
            Vous êtes sur le plan {isPremium ? "Premium" : "Gratuit"}
          </span>
          <PremiumButton />
        </div>

        <div className="flex flex-col lg:flex-row">
          {data.map((item: IItems) => (
            <div
              key={item.key}
              className="dark:bg-dark-tremor-background-muted text-tremor-default text-tremor-content dark:text-dark-tremor-content m-2 m-2 flex flex-1 flex-col rounded border p-3 font-medium"
            >
              <p>{item.label}</p>
              <span
                className={
                  "text-tremor-metric font-semibold text-black dark:text-white"
                }
              >
                {item.value}{" "}
                {showNumber && ` / ${maximumFreeFeatures[item.key]}`}
              </span>
              {!isPremium && (
                <Progress
                  value={renderPourcentage(
                    item.value,
                    maximumFreeFeatures[item.key]
                  )}
                  className={"mt-3 h-3"}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
