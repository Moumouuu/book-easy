"use client";
import Loader from "@/components/loader";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export default function CompanyProvider({ children }: CompanyLayoutProps) {
  const { setCompanyId } = useCompany();
  const { companyId } = useParams();

  useEffect(() => {
    if (companyId) {
      setCompanyId(companyId);
    }
  }, [companyId, setCompanyId]);

  // Fetch company data using SWR
  const { error, isLoading } = useSWR(
    companyId ? `/api/company/${companyId}` : null,
    defaultFetcherGet,
  );

  if (error) {
    // Handle error state, e.g., display an error message
    // todo : error message
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    // Handle loading state, e.g., display a loading spinner
    // todo loading state
    return <Loader />;
  }

  // If data is fetched successfully and no error occurred, render children
  return <>{children}</>;
}
