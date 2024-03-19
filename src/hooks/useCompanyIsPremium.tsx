import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import useSWR from "swr";

export default function useCompanyIsPremium() {
  const { companyId } = useCompany();
  const { data: isPremium, error } = useSWR(
    `/api/company/${companyId}/premium`,
    defaultFetcherGet
  );

  if (error) {
    console.error("Error fetching premium status:", error);
  }

  return { isPremium, error };
}
