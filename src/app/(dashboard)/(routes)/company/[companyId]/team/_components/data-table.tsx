"use client";
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
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { NewTeamateDialog } from "./newTeamateDialog";

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

  const [isLoadingDeleteTeamate, setisLoadingDeleteTeamate] =
    useState<boolean>(false);

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
    const teamateDatatableIds = Object.keys(rowSelection).map((id: string) => {
      return parseInt(id);
    });
    const teamateIds = teamateDatatableIds.map((id: number) => {
      return data[id].id;
    });
    return teamateIds;
  };

  const onClickDeleteTeamate = async () => {
    if (!userIsAdmin) return;
    setisLoadingDeleteTeamate(true);

    try {
      const teamateIds = getDataFromSelectedRow();

      // Delete customers
      await axios.delete(`/api/company/${companyId}/team`, {
        data: teamateIds,
      });

      // Tell all SWRs with this key to revalidate
      mutate(`/api/company/${companyId}/team`);

      // Remove the selected rows
      setRowSelection({});
    } catch (error) {
      console.error("An error occurred while deleting customers:", error);
      toast("Une erreur est survenue", {
        description:
          "Si le problème persiste veuillez contacter un administrateur",
      });
    } finally {
      setisLoadingDeleteTeamate(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-between py-4 lg:flex-row">
        <Input
          placeholder="Filtrer par Emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="mt-3 flex items-center lg:m-0">
          <NewTeamateDialog numberOfTeamates={data.length} />
          <Button
            disabled={
              isLoadingDeleteTeamate ||
              !userIsAdmin ||
              Object.entries(rowSelection).length === 0
            }
            isLoading={isLoadingDeleteTeamate}
            className="mx-2"
            variant={"destructive"}
            onClick={onClickDeleteTeamate}
          >
            {userIsAdmin
              ? "Supprimer le collaborateur"
              : "Autorisation requise pour supprimer un collaborateur"}
          </Button>
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
