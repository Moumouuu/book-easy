"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompany } from "@/store/dashboard";
import { IUserDataTableProps } from "../page";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
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
    accessorKey: "created_by_email_temp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email du client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "formated_start_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Début de la réservation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "formated_end_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fin de la réservation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prix
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
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
                onClick={() =>
                  navigator.clipboard.writeText(book.created_by.email)
                }
              >
                Copier l&apos;Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Modifier la réservation</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetUpdateBook book={book} />
        </Dialog>
      );
    },
  },
];

export function SheetUpdateBook({ book }: { book: IUserDataTableProps }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendEmail, setIsSendEmail] = useState<boolean>(true);

  const { companyId } = useCompany();
  const { mutate } = useSWRConfig();
  const [newBook, setNewBook] = useState<IUserDataTableProps>(book);

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // delete the formated dates
      delete newBook?.formated_end_at;
      delete newBook?.formated_start_at;

      // Update bookings
      await axios.put(`/api/company/${companyId}/bookings`, {
        data: { newBook },
      });

      // Send email only if the checkbox is checked
      if (isSendEmail) {
        await axios.post(`/api/send/${companyId}/updateBook`, {
          data: { ...newBook },
        });
      }

      toast("La réservation a bien été modifiée", {
        description:
          "Un email a été envoyé au client si vous avez coché la case",
      });

      // Invalidate SWR cache
      mutate(`/api/company/${companyId}/bookings`);
      mutate(`/api/company/${companyId}/calendar/bookings`);
    } catch (error) {
      console.error("An error occurred while submitting:", error);
      toast("Une erreur est survenue", {
        description:
          "Si le problème persiste veuillez contacter un administrateur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedStart_at = book.start_at.toString().slice(0, 16);
  const formattedEnd_at = book.end_at?.toString().slice(0, 16);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modification de la réservation</DialogTitle>
        <DialogDescription>
          Modifiez les dates de la réservation du client et le prix
        </DialogDescription>
      </DialogHeader>

      <div className="my-1 flex flex-col">
        <Label htmlFor="start_at">Début de la réservation</Label>
        <Input
          onChange={(e) =>
            setNewBook({ ...newBook, start_at: new Date(e.target.value) })
          }
          id="start_at"
          type="datetime-local"
          className="mt-2"
          defaultValue={formattedStart_at}
        />
      </div>

      <div className="my-1 flex flex-col">
        <Label htmlFor="end_at">Fin de la réservation</Label>
        <Input
          onChange={(e) =>
            setNewBook({ ...newBook, end_at: new Date(e.target.value) })
          }
          id="end_at"
          type="datetime-local"
          className="mt-2"
          defaultValue={formattedEnd_at}
        />
      </div>

      <div className="my-1 flex flex-col">
        <Label htmlFor="price">Prix de la réservation / prestation</Label>
        <Input
          onChange={(e) =>
            setNewBook({ ...newBook, price: parseInt(e.target.value) })
          }
          id="price"
          type="number"
          className="mt-2"
          defaultValue={book.price}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          defaultChecked
          onCheckedChange={(e) => setIsSendEmail(!!e)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Envoyer un email d&apos;information au client
        </label>
      </div>

      <DialogFooter>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
        >
          Modifier la réservation
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
