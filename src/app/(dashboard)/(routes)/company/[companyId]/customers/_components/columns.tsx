"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  Phone,
  User,
} from "lucide-react";

import DefaultError from "@/components/defaultError";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultFetcherGet } from "@/lib/fetcher";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useCompany } from "@/store/dashboard";
import { formatDate } from "@/utils";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import useSWR from "swr";
import { IUserDataTableProps } from "../page";

export const columns: ColumnDef<IUserDataTableProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Téléphone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.email)}
              >
                Copier l&apos;Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={customer.firstName ? false : true}>
                <SheetTrigger>Voir la fiche client</SheetTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CustomerSheetContent customer={customer} />
        </Sheet>
      );
    },
  },
];

const CustomerSheetContent = ({
  customer,
}: {
  customer: IUserDataTableProps;
}) => {
  const { companyId } = useCompany();
  const { data, error, isLoading } = useSWR(
    `/api/company/${companyId}/customers/stats?customerId=${customer.id}`,
    defaultFetcherGet
  );

  if (isLoading) return null;

  if (error)
    return (
      <DefaultError
        title="Une erreur est survenue"
        message="Problème de récupération des données utilisateurs"
      />
    );

  return (
    <SheetContent className="sm:max-w-[300px]  md:max-w-none md:w-1/2">
      <SheetHeader>
        <div className="flex flex-col md:flex-row items-center my-3">
          <Image
            alt="Customer profile"
            src={`https://api.dicebear.com/8.x/open-peeps/png?seed=${customer.id}`}
            height={100}
            width={100}
            className="mr-4"
          />
          <div className="flex flex-col">
            <div className="flex items-center my-1">
              <User className="h-4 w-4 mr-2" />
              {customer.firstName && customer.lastName && (
                <p className="text-md font-medium">
                  {capitalizeFirstLetter(customer.firstName)}{" "}
                  {capitalizeFirstLetter(customer.lastName)}
                </p>
              )}
            </div>
            <div className="flex items-center my-1">
              <MdEmail className="h-4 w-4 mr-2" />
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div className="flex items-center my-1">
              <Phone className="h-4 w-4 mr-2" />
              <p className="text-sm text-muted-foreground">
                {customer?.phone_number}
              </p>
            </div>
            <div className="flex items-center my-1">
              <Calendar className="h-4 w-4 mr-2" />
              <p className="text-sm text-muted-foreground">
                Client depuis le {formatDate(data.slice(-1)[0].value)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col ">
          <span className="text-xl font-medium">
            Données statistiques du client
          </span>
          <div className="flex flex-wrap">
            {data
              .slice(0, data.length - 1)
              .map(
                (stat: { label: string; value: number; suffix?: string }) => (
                  <div
                    key={stat.label}
                    className="dark:bg-dark-tremor-background-muted text-tremor-default text-tremor-content dark:text-dark-tremor-content  m-2 flex flex-1 flex-col rounded border p-3 font-medium"
                  >
                    <p>{stat.label}</p>
                    <span
                      className={
                        "text-2xl font-semibold text-black dark:text-white"
                      }
                    >
                      {stat.value}
                      {stat.suffix}
                    </span>
                  </div>
                )
              )}
          </div>
        </div>
      </SheetHeader>
    </SheetContent>
  );
};
