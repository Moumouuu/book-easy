"use client";
import useSWR from "swr";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import DefaultError from "@/components/defaultError";
import DatatableSkeleton from "@/components/datatable/datatableSkeleton";
import { formatDateWithTime } from "@/utils";

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

  const bookingsFormated = formatDateBookings(data);

  return (
    <div className="container flex justify-center p-4">
      <DataTable columns={columns} data={bookingsFormated} />
    </div>
  );
}

const formatDateBookings = (data: IUserDataTableProps[]) => {
  return data.map((booking) => {
    return {
      ...booking,
      start_at: formatDateWithTime(booking.start_at.toString()),
      end_at: formatDateWithTime(booking.end_at.toString()),
    };
  });
};
