"use client";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import { appTitle } from "@/utils";
import Image from "next/image";
import useSWR from "swr";

export default function AsideTop() {
  const { companyId } = useCompany();
  const { data: company } = useSWR(
    `/api/company/${companyId}`,
    defaultFetcherGet
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Image
          src="/assets/images/icon-bookEasy.png"
          alt="BookEasy"
          width={50}
          height={50}
          className="mr-2"
        />
        <div className="flex flex-col">
          <h1 className="bg-gradient-to-r from-blue-200 to-blue-600 bg-clip-text text-xl font-semibold text-transparent">
            {appTitle}
          </h1>
          <span className="font-medium text-sm">{company?.name}</span>
        </div>
      </div>
      <span className="text-muted-foreground text-sm mt-2">
        {company?.description}
      </span>
    </div>
  );
}
