"use client";

import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import useSWR from "swr";

export default function useUser() {
  const { companyId } = useCompany();
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(`/api/company/${companyId}/auth`, defaultFetcherGet);

  return {
    user,
    isLoading,
    error,
  };
}
