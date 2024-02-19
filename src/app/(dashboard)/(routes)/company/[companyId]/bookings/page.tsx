"use client";
import useSWR from "swr";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import DefaultError from "@/components/defaultError";
import DatatableSkeleton from "@/components/datatable/datatableSkeleton";

export interface IUserDataTableProps {
  id: string;
  created_by: {
    email: string;
  };
  price: number;
  start_at: Date;
  end_at: Date;
}

export default function BookingsPage() {
  const { companyId } = useCompany();
  const { data, isLoading, error } = useSWR(
    `/api/company/${companyId}/bookings`,
    defaultFetcherGet,
  );

  if (isLoading) return <DatatableSkeleton />;

  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  return (
    <div className="container flex justify-center p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
