// src/components/data-table/hooks/use-data-table.ts
import { useState, useEffect } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { IconLoader2 } from "@tabler/icons-react"
import type { DataTableConfig, DataTableProps, TableData } from "../types"
import { useColumns, getRowIdFunction } from "./use_Data_columns"

export function useDataTable<T extends TableData>({
  data,
  config,
  pagination,
  onPaginationChange,
  searchQuery,
  onSearch,
  onClearSearch,
  loading,
  emptyMessage,
}: Pick<DataTableProps<T>, 
  'data' | 'config' | 'pagination' | 'onPaginationChange' | 
  'searchQuery' | 'onSearch' | 'onClearSearch' | 'loading' | 'emptyMessage'
>) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery || "")
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // Obtener columnas dinámicas
  const columns = useColumns({ config })

  // Función para obtener ID de fila
  const getRowId = getRowIdFunction<T>()

  // Configurar tabla
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: pagination || { pageIndex: 0, pageSize: 10 },
    },
    getRowId,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages,
    rowCount: pagination?.totalElements,
  })

  // Efectos para búsqueda
  useEffect(() => {
    if (searchQuery !== undefined) {
      setInternalSearchQuery(searchQuery)
    }
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalSearchQuery !== searchQuery && internalSearchQuery !== "") {
        onSearch?.(internalSearchQuery)
      }
    }, config.search?.debounce || 500)

    return () => clearTimeout(timer)
  }, [internalSearchQuery, searchQuery, onSearch, config.search?.debounce])

  // Handlers
  const handleSearch = (query: string) => {
    onSearch?.(query)
  }

  const handleClearSearch = () => {
    setInternalSearchQuery("")
    onClearSearch?.()
  }

  // Renderers
  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
        {emptyMessage}
      </td>
    </tr>
  )

  const renderLoadingState = () => (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Cargando...</p>
      </div>
    </div>
  )

  const handleTablePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    onPaginationChange?.(newPagination.pageIndex, newPagination.pageSize)
  }

  return {
    table,
    internalSearchQuery,
    setInternalSearchQuery,
    handleSearch,
    handleClearSearch,
    renderEmptyState,
    renderLoadingState,
    handleTablePaginationChange,
    columnsCount: columns.length,
  }
}