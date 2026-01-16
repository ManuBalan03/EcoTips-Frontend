// src/components/data-table/index.tsx
import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react"
import type { DataTableProps } from "./Table/types"

export function DataTable<T extends Record<string, any>>({
  data,
  config,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  pagination,
  onPaginationChange,
  searchQuery = "",
  onSearch,
  onClearSearch,
  onRowClick,
  className = "",
  enableSelection = false,
  renderHeader,
  renderFooter,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [internalSearch, setInternalSearch] = React.useState(searchQuery)

  // Manejar selección individual
  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId)
    } else {
      newSelected.add(rowId)
    }
    setSelectedRows(newSelected)
  }

  // Manejar selección de todas las filas
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      const allIds = data.map((_, index) => index.toString())
      setSelectedRows(new Set(allIds))
    }
  }

  // Manejar búsqueda
  const handleSearchSubmit = () => {
    onSearch?.(internalSearch)
  }

  const handleClear = () => {
    setInternalSearch("")
    onClearSearch?.()
  }

  // Obtener ID único para cada fila
  const getRowId = (item: T, index: number): string => {
    return item.id?.toString() || index.toString()
  }

  // Renderizar contenido de celda
  const renderCell = (item: T, accessorKey: string, cellRenderer?: any) => {
    if (cellRenderer) {
      return cellRenderer({ row: { original: item } })
    }
    return String(item[accessorKey] || "")
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header personalizado */}
      {renderHeader ? (
        renderHeader()
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:max-w-md">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={config.search?.placeholder || "Buscar..."}
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="pl-10"
                disabled={loading}
              />
              {internalSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  disabled={loading}
                >
                  <IconX className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {/* Columna de selección */}
              {enableSelection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Seleccionar todo"
                  />
                </TableHead>
              )}
              
              {/* Encabezados de columnas */}
              {config.columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {typeof column.header === 'function' 
                    ? column.header({}) 
                    : column.header}
                </TableHead>
              ))}
              
              {/* Columna de acciones si está habilitada */}
              {config.actions?.enabled && (
                <TableHead className="w-24 text-right">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + (enableSelection ? 1 : 0) + (config.actions?.enabled ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconLoader2 className="h-5 w-5 animate-spin" />
                    <span>Cargando datos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + (enableSelection ? 1 : 0) + (config.actions?.enabled ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => {
                const rowId = getRowId(item, rowIndex)
                
                return (
                  <TableRow
                    key={rowId}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => onRowClick?.(item)}
                  >
                    {/* Checkbox de selección */}
                    {enableSelection && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedRows.has(rowId)}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          aria-label="Seleccionar fila"
                        />
                      </TableCell>
                    )}
                    
                    {/* Celdas de datos */}
                    {config.columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {renderCell(item, column.accessorKey, column.cell)}
                      </TableCell>
                    ))}
                    
                    {/* Celda de acciones */}
                    {config.actions?.enabled && (
                      <TableCell className="text-right">
                        {/* Aquí irían los botones de acciones */}
                        <span className="text-sm text-muted-foreground">...</span>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      // src/components/data-table/index.tsx - sección corregida
{/* Paginación */}
{config.pagination?.enabled && pagination && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="text-sm text-muted-foreground">
      {selectedRows.size > 0 && `${selectedRows.size} seleccionados • `}
      Mostrando {data.length} de {pagination.totalElements || data.length} registros
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Filas por página:</span>
        <select
          value={pagination.pageSize}
          onChange={(e) => onPaginationChange?.(0, Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
          disabled={loading}
        >
          {(config.pagination.pageSizes || [10, 20, 50, 100]).map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPaginationChange?.(pagination.pageIndex - 1, pagination.pageSize)}
          disabled={pagination.pageIndex === 0 || loading}
        >
          Anterior
        </Button>
        
        <span className="text-sm px-2">
          Página {pagination.pageIndex + 1} de {pagination.totalPages || 1}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPaginationChange?.(pagination.pageIndex + 1, pagination.pageSize)}
          disabled={pagination.pageIndex + 1 >= (pagination.totalPages || 1) || loading}
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
)}

      {/* Footer personalizado */}
      {renderFooter && renderFooter()}
    </div>
  )
}