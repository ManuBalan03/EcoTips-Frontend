// src/components/data-table/hooks/use-columns.ts
import { useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import type { DataTableConfig, TableData } from "../types"

// Función helper para obtener el ID
const getRowId = <T extends TableData>(row: T): string => {
  if (row.id !== undefined) {
    return typeof row.id === 'number' ? row.id.toString() : row.id
  }
  // Si no hay id, usar un índice o otro campo único
  return JSON.stringify(row)
}

export function useColumns<T extends TableData>({
  config,
}: {
  config: DataTableConfig<T>
}) {
  return useMemo<ColumnDef<T>[]>(() => {
    const baseColumns: ColumnDef<T>[] = []

    // Columna de selección
    if (config.selection?.enabled) {
      baseColumns.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<T>)
    }

    // Columnas configuradas
    config.columns.forEach((colConfig) => {
      const column: ColumnDef<T> = {
        accessorKey: colConfig.accessorKey as string,
        header: typeof colConfig.header === 'function' 
          ? colConfig.header 
          : (() => colConfig.header) as any,
        cell: colConfig.cell as any,
        enableSorting: colConfig.enableSorting ?? true,
        enableHiding: colConfig.enableHiding ?? true,
      }

      // Agregar propiedades opcionales solo si existen
      if (colConfig.size !== undefined) column.size = colConfig.size
      if (colConfig.minSize !== undefined) column.minSize = colConfig.minSize
      if (colConfig.maxSize !== undefined) column.maxSize = colConfig.maxSize

      baseColumns.push(column)
    })

    // Columna de acciones
    if (config.actions?.enabled) {
      baseColumns.push({
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex justify-end">
            {/* Se renderizará con DataTableActions */}
            <span>Acciones</span>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<T>)
    }

    return baseColumns
  }, [config])
}

// Función para obtener el ID de la fila
export function getRowIdFunction<T extends TableData>(): (row: T) => string {
  return (row: T) => getRowId(row)
}