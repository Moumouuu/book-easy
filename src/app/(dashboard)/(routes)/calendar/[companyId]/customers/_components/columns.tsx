"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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

const onSubmit = () => {
  // Accessing form values
  const email = (document.getElementById("email") as HTMLInputElement)?.value;
  const firstName = (document.getElementById("firstname") as HTMLInputElement)
    ?.value;
  const lastName = (document.getElementById("lastname") as HTMLInputElement)
    ?.value;
  const phoneNumber = (
    document.getElementById("phoneNumber") as HTMLInputElement
  )?.value;

  // Validate or process form data as needed

  // Example: Log form values
  console.log("Email:", email);
  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);
  console.log("Phone Number:", phoneNumber);

  // Optionally, you can submit the form data to your backend here
};

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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Créé le
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
                onClick={() => navigator.clipboard.writeText(customer.email)}
              >
                Copier l&apos;Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DialogTrigger>Modifier les détails</DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem>Voir les réservations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Modification du profil de {customer.firstName}{" "}
                {customer.lastName}
              </DialogTitle>
              <DialogDescription>
                Modifiez les détails de ce client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="email" className="mb-2 text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue={customer.email}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col items-start">
                <Label htmlFor="firstname" className="mb-2 text-right">
                  Prénom
                </Label>
                <Input
                  id="firstname"
                  defaultValue={customer.firstName ?? ""}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col items-start">
                <Label htmlFor="lastname" className="mb-2 text-right">
                  Nom
                </Label>
                <Input
                  id="lastname"
                  defaultValue={customer.lastName ?? ""}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col items-start">
                <Label htmlFor="phoneNumber" className="mb-2 text-right">
                  Téléphone
                </Label>
                <Input
                  id="phoneNumber"
                  defaultValue={customer.phone_number ?? ""}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onSubmit} type="submit">
                Modifier le client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
