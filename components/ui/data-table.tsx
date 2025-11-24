"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Download, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV, exportToPDF, exportToExcel, type ExportColumn } from "@/lib/export-utils"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filename?: string
  exportColumns?: ExportColumn[]
  exportFormats?: ("csv" | "pdf" | "xlsx")[]
  allowRowSelection?: boolean
  searchKey?: string
  searchPlaceholder?: string
  filters?: Record<string, any>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filename = "export",
  exportColumns,
  exportFormats = ["csv", "pdf", "xlsx"],
  allowRowSelection = false,
  searchKey,
  searchPlaceholder = "Search...",
  filters = {},
}: DataTableProps<TData, TValue>) {
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isExporting, setIsExporting] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleExport = async (format: "csv" | "pdf" | "xlsx", scope: "current" | "all" | "selected") => {
    setIsExporting(true)

    try {
      let exportData: TData[] = []

      if (scope === "current") {
        exportData = table.getFilteredRowModel().rows.map((row) => row.original)
      } else if (scope === "all") {
        exportData = data
      } else if (scope === "selected") {
        exportData = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
        if (exportData.length === 0) {
          toast({
            title: "No rows selected",
            description: "Please select rows to export",
            variant: "destructive",
          })
          setIsExporting(false)
          return
        }
      }

      const exportOptions = {
        filename,
        columns: exportColumns || [],
        data: exportData,
        filters,
      }

      if (format === "csv") {
        exportToCSV(exportOptions)
      } else if (format === "pdf") {
        exportToPDF(exportOptions)
      } else if (format === "xlsx") {
        exportToExcel(exportOptions)
      }

      toast({
        title: "Export successful",
        description: `Exported ${exportData.length} rows as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2 flex-1">
          {searchKey && (
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {exportFormats.includes("csv") && (
              <>
                <DropdownMenuItem onClick={() => handleExport("csv", "current")}>
                  Export Current View (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv", "all")}>Export All Data (CSV)</DropdownMenuItem>
                {allowRowSelection && (
                  <DropdownMenuItem onClick={() => handleExport("csv", "selected")}>
                    Export Selected Rows (CSV)
                  </DropdownMenuItem>
                )}
              </>
            )}
            {exportFormats.includes("pdf") && (
              <DropdownMenuItem onClick={() => handleExport("pdf", "current")}>Export as PDF Report</DropdownMenuItem>
            )}
            {exportFormats.includes("xlsx") && (
              <DropdownMenuItem onClick={() => handleExport("xlsx", "current")}>Export to Excel</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span className="mr-4">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                selected
              </span>
            )}
            Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
