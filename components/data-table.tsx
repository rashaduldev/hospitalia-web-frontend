"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  DownloadIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useI18n } from "@/locales/client";
import { format } from "date-fns/format";
import { Typography } from "./ui/Typography";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filename?: string;
  emptyMessage?: string;
  excludeColumns?: string[];
};

export function DataTableWithExport<TData, TValue>({
  columns,
  data,
  filename = "export",
  emptyMessage,
  excludeColumns = [],
}: DataTableProps<TData, TValue>) {
  const t = useI18n();
  const filteredColumns = columns.filter((col: any) => {
    const key = col.accessorKey || col.id;
    return !excludeColumns.includes(key);
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns: filteredColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {      

      const searchValue = filterValue.toLowerCase();      
      const location = String((row.original as any)?.locationName ?? "").toLowerCase();

      const dateObj = (row.original as any)?.appointmentDate
        ? new Date((row.original as any).appointmentDate)
        : null;
      const formattedDate = dateObj
        ? format(dateObj, "dd MMM yyyy").toLowerCase()
        : "";

      return (
        location.includes(searchValue) ||
        formattedDate.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // --- Export Logic ---
  const getExportData = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    return selectedRows.length > 0
      ? selectedRows.map((row) => row.original)
      : table.getFilteredRowModel().rows.map((row) => row.original);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(getExportData(), { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, `${filename}-${new Date().toLocaleDateString()}.csv`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(getExportData());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(
      workbook,
      `${filename}-${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  const downloadFile = (blob: Blob, name: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Pagination Helpers ---
  const paginationState = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = paginationState.pageIndex * paginationState.pageSize + 1;
  const endRow = Math.min(startRow + paginationState.pageSize - 1, totalRows);

  return (
    <div className="w-full space-y-4">
      {/* Search and Export Bar */}
      <div className="flex justify-between gap-2 pb-2 max-sm:flex-col sm:items-center">
        <Input
          placeholder={`${t("table.search")}...`}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-[20rem]"
        />
        <div className="flex items-center space-x-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <span className="text-muted-foreground text-sm">
              {table.getSelectedRowModel().rows.length} {t("table.selected")}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadIcon className="mr-2 h-4 w-4" /> {t("table.export")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={filteredColumns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Typography size="sm" weight="medium" color="foreground">
                      {globalFilter
                        ? t("table.no_results_for" as any, {
                            query: globalFilter,
                          })
                        : emptyMessage || t("table.noData")}
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Design (Matching Image) */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {t("table.showing")} {startRow}-{endRow} {t("table.of")} {totalRows}{" "}
          {t("table.results")}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("table.previous")}
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {table.getPageOptions().map((pageIndex) => {
              // Logic to show limited page numbers (simplified for now)
              if (
                pageIndex === 0 ||
                pageIndex === table.getPageCount() - 1 ||
                (pageIndex >= table.getState().pagination.pageIndex - 1 &&
                  pageIndex <= table.getState().pagination.pageIndex + 1)
              ) {
                return (
                  <Button
                    key={pageIndex}
                    variant={
                      table.getState().pagination.pageIndex === pageIndex
                        ? "outline"
                        : "ghost"
                    }
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1"
          >
            {t("table.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}