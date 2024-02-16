"use client";
import { Progress } from "@/components/ui/progress";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import useSWR from "swr";
import { PerformanceKpiSkeleton } from "./skeletons/performanceKPISkeleton";
import { maximumFreeFeatures } from "@/constants";
import { MaximumFreeFeaturesEnum } from "@/enum/maximumFreeFeatures";
import { Button } from "@/components/ui/button";
import { GiPartyPopper } from "react-icons/gi";
import PremiumButton from "@/components/premiumButton";

interface IItems {
  label: string;
  value: number;
  key: MaximumFreeFeaturesEnum;
}

export default function GeneralCompanyStats() {
  const { companyId } = useCompany();
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/general`,
    defaultFetcherGet,
  );

  if (error) return <div>error</div>;
  if (isLoading) return <PerformanceKpiSkeleton />;

  const renderPourcentage = (value: number, total: number) => {
    return (value / total) * 100;
  };

  return (
    <>
      <div className="rounded border p-3">
        <div className="flex items-center justify-between">
          <span className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong my-3 ml-3 font-semibold">
            Vous êtes sur le plan Gratuit
          </span>
          <PremiumButton />
        </div>

        <div className="flex">
          {data.map((item: IItems) => (
            <div
              key={item.key}
              className="dark:bg-dark-tremor-background-muted text-tremor-default text-tremor-content dark:text-dark-tremor-content m-2 flex flex-1 flex-col rounded border p-3 font-medium"
            >
              <p className="">{item.label}</p>
              <span
                className={
                  "text-tremor-metric font-semibold text-black dark:text-white"
                }
              >
                {item.value} / {maximumFreeFeatures[item.key]}
              </span>
              <Progress
                value={renderPourcentage(
                  item.value,
                  maximumFreeFeatures[item.key],
                )}
                className={"mt-3 h-3"}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
