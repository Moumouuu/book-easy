"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IUserDataTableProps } from "../page";
import { RoleEnum } from "@/enum/roles";
import { useState } from "react";
import axios from "axios";
import { useCompany } from "@/store/dashboard";
import { useSWRConfig } from "swr";
import useUser from "@/hooks/useUser";

export const columns: ColumnDef<IUserDataTableProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) => {
          // Get all rows
          const allRows = table.getFilteredRowModel().rows;
          // Filter out admin rows
          const nonAdminRows = allRows.filter(
            (row) => row.original.role !== RoleEnum.ADMIN,
          );
          // Check if any non-admin rows are selected
          const areAnyNonAdminRowsSelected = nonAdminRows.some((row) =>
            row.getIsSelected(),
          );
          // Toggle selection for non-admin rows based on initial state
          nonAdminRows.forEach((row) =>
            row.toggleSelected(areAnyNonAdminRowsSelected ? false : true),
          );
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        disabled={row.original.role === "ADMIN"}
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
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teamate = row.original;
      const user = useUser();
      return (
        <Dialog>
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
                onClick={() => navigator.clipboard.writeText(teamate.email)}
              >
                Copier l&apos;Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem
                  disabled={
                    teamate.role === RoleEnum.ADMIN &&
                    user.user.id === teamate.id
                  }
                  onClick={() => navigator.clipboard.writeText(teamate.email)}
                >
                  Modifier le rôle
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetUpdateRole teamate={teamate} />
        </Dialog>
      );
    },
  },
];

export function SheetUpdateRole({ teamate }: { teamate: IUserDataTableProps }) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { companyId } = useCompany();
  const { mutate } = useSWRConfig();

  const onSubmit = async () => {
    setIsLoading(true);

    await axios.put(`/api/company/${companyId}/team`, {
      data: { selectedRole, teamateId: teamate.id },
    });

    // Invalidate SWR cache
    mutate(`/api/company/${companyId}/team`);
    setIsLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          Modification du rôle de {teamate.firstName} {teamate.lastName}
        </DialogTitle>
        <DialogDescription>
          Modifiez le rôle de {teamate.firstName} {teamate.lastName} en
          sélectionnant un rôle dans la liste déroulante.
        </DialogDescription>
      </DialogHeader>
      <Select onValueChange={(v) => setSelectedRole(v)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sélectionner un rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rôles</SelectLabel>
            {[RoleEnum.ADMIN, RoleEnum.USER].map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DialogFooter>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
        >
          Modifier
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
