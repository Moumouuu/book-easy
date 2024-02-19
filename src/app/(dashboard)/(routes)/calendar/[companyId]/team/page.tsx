"use client";
import useSWR from "swr";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { defaultFetcherGet } from "@/lib/fetcher";
import { useCompany } from "@/store/dashboard";
import DefaultError from "@/components/defaultError";
import DatatableSkeleton from "@/components/datatable/datatableSkeleton";
import { $Enums } from "@prisma/client";

export interface IUserDataTableProps {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone_number: string | null;
  role: $Enums.Role;
}

export default function TeamPage() {
  const { companyId } = useCompany();
  const { data, isLoading, error } = useSWR(
    `/api/company/${companyId}/team`,
    defaultFetcherGet,
  );

  if (isLoading) return <DatatableSkeleton />;

  const formattedUsers = formatUser(data);

  if (error)
    return (
      <DefaultError title="Une erreur est survenue" message={error.message} />
    );

  return (
    <div className="container justify-center flex p-4">
      <DataTable columns={columns} data={formattedUsers} />
    </div>
  );
}

const formatUser = (users: any[]) => {
  const userObjects = users.map((user: any) => {
    // Extracting roles from user object
    const role = user.user.companies[0].role;

    // Adding roles as attributes to the user object
    const newUser = { ...user }; // Create a shallow copy of the user object
    newUser.user.role = role; // Add the role attribute to the user object

    return newUser.user;
  });

  return userObjects;
};
