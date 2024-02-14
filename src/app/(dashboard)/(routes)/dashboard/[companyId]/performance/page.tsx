"use client";
import { useCompany } from "@/store/dashboard";
import KPICards from "./_components/KPICards";
import useSWR from "swr";
import { defaultFetcherGet } from "@/lib/fetcher";

export default function Performance() {
  const { companyId } = useCompany();
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/performance/?period=${"day"}`,
    defaultFetcherGet,
  );

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex w-full flex-col p-4">
      <KPICards company={data} />
    </div>
  );
}
