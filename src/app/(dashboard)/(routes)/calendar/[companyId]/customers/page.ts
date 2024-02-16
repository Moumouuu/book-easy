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
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone_number: string | null;
  createdAt: Date;
}

export default function CustomerPage() {
  const { companyId } = useCompany();
  const { data, isLoading, error } = useSWR(
    `/api/company/${companyId}/customers`,
    defaultFetcherGet,
  );

  if (isLoading) return <DatatableSkeleton />;

  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  return (
    <div className="container justify-center flex p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
