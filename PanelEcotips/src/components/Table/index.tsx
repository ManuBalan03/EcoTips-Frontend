// src/components/data-table/index.tsx
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { DataTableProps } from "./types"

export function DataTable<T extends Record<string, any>>({
  data,
  config,
  loading = false,
  emptyMessage = "No se encontraron resultados.",
  pagination,
  onPaginationChange,
  searchQuery,
  onSearch,
  onClearSearch,
  className = "",
  enableSelection = false,
}: DataTableProps<T>) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery || "")
  const [rowSelection, setRowSelection] = useState({})

  // Preparar columnas
  const columns = useMemo(() => {
    const cols: any[] = []

    // Columna de selección
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }: any) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
      })
    }

    // Agregar columnas configuradas
    cols.push(...config.columns.map(col => ({
      accessorKey: col.accessorKey,
      header: typeof col.header === 'function' ? col.header : () => col.header,
      cell: col.cell || (({ row }: any) => (
        <div>{String(row.getValue(col.accessorKey) || "")}</div>
      )),
      enableSorting: col.enableSorting ?? true,
    })))

    return cols
  }, [config.columns, enableSelection])

  // Configurar tabla
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: pagination || { pageIndex: 0, pageSize: 10 },
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (!pagination || !onPaginationChange) return
      
      const newPagination = typeof updater === 'function' 
        ? updater(pagination) 
        : updater
      
      onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages,
  })

  // Handlers para búsqueda
  const handleSearch = () => {
    onSearch?.(internalSearchQuery)
  }

  const handleClearSearch = () => {
    setInternalSearchQuery("")
    onClearSearch?.()
  }

  // Efecto para debounce de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalSearchQuery !== searchQuery) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [internalSearchQuery])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda */}
      {config.search?.enabled && (
        <div className="relative max-w-md">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={config.search.placeholder}
            value={internalSearchQuery}
            onChange={(e) => setInternalSearchQuery(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
          {internalSearchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            >
              <IconX className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-md border">
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación (simplificada) */}
      {config.pagination?.enabled && pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {data.length} de {pagination.totalElements || data.length} registros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPaginationChange?.(pagination.pageIndex - 1, pagination.pageSize)}
              disabled={pagination.pageIndex === 0}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {pagination.pageIndex + 1} de {pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPaginationChange?.(pagination.pageIndex + 1, pagination.pageSize)}
              disabled={pagination.pageIndex + 1 >= (pagination.totalPages || 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}