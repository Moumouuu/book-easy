"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useCompany } from "@/store/dashboard";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<any, TValue>) {
  const userIsAdmin = useIsAdmin();
  const { companyId } = useCompany();
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  });

  const getDataFromSelectedRow = () => {
    const bookDatatableIds = Object.keys(rowSelection).map((id: string) => {
      return parseInt(id);
    });
    const bookIds = bookDatatableIds.map((id: number) => {
      return data[id].id;
    });
    return bookIds;
  };

  const onClickDeleteBook = async () => {
    if (!userIsAdmin) return;
    setIsLoading(true);

    const bookIds = getDataFromSelectedRow();
    try {
      // Send email to inform the client that their booking has been deleted
      // & delete reservations
      await axios.post(`/api/send/${companyId}/deleteBooks`, {
        data: bookIds,
      });

      // Tell all SWRs with this key to revalidate
      mutate(`/api/company/${companyId}/bookings`);
      toast("La réservation a été supprimée avec succès", {
        description: "Un email a été envoyé au.x client.s pour le notifier",
      });

      // Remove the selected rows
      setRowSelection({});
    } catch (error) {
      console.error("An error occurred while deleting bookings:", error);
      toast("Une erreur est survenue", {
        description:
          "Si le problème persiste veuillez contacter un administrateur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-between py-4 lg:flex-row">
        <Input
          placeholder="Filtrer par Email ..."
          value={
            (table.getColumn("created_by_email")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("created_by_email")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="mt-3 lg:m-0">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                disabled={
                  isLoading ||
                  !userIsAdmin ||
                  Object.entries(rowSelection).length === 0
                }
                isLoading={isLoading}
                className="mr-2"
                variant={"destructive"}
              >
                {userIsAdmin
                  ? "Supprimer la réservation"
                  : "Autorisation requise pour supprimer un client"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes vous sûr de vouloir supprimer cette réservation ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Vous ne pourrez pas annuler
                  cette action. Voulez-vous continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  disabled={
                    isLoading ||
                    !userIsAdmin ||
                    Object.entries(rowSelection).length === 0
                  }
                  className="bg-red-600 hover:bg-red-700"
                  onClick={onClickDeleteBook}
                >
                  {userIsAdmin
                    ? "Supprimer"
                    : "Autorisation requise pour supprimer un client"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mr-2 flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
      <div className="text-muted-foreground my-2 flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s)
      </div>
    </div>
  );
}
