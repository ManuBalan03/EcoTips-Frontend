// src/components/data-table/types.ts
import { z } from "zod"
import type React from "react"

export type TableData = Record<string, any> & {
  id?: string | number
}

export interface StatusConfigItem {
  label: string
  icon: React.ReactNode
  styles: string  // O className, depende de cómo lo uses
  tooltip?: string
}

export interface ColumnConfig<T extends TableData> {
  accessorKey: string
  header: string | React.ReactNode | ((props: any) => React.ReactNode)
  cell?: (props: { row: { original: T } }) => React.ReactNode
  enableSorting?: boolean
  enableHiding?: boolean
  enableDrag?: boolean
  width?: string | number
  className?: string
  size?: number
  minSize?: number
  maxSize?: number
}

export interface DataTableConfig<T extends TableData> {
  // Schema para validación (opcional)
  schema?: z.ZodSchema<T>
  
  // Columnas de la tabla
  columns: ColumnConfig<T>[]
  
  // Configuración de estados - IMPORTANTE: usar statusConfig, no statuses
  statusConfig?: Record<string, StatusConfigItem>
  
  // Configuración de búsqueda
  search?: {
    enabled?: boolean
    fields?: string[]
    placeholder?: string
    debounce?: number
  }
  
  // Configuración de paginación
  pagination?: {
    enabled?: boolean
    pageSizes?: number[]
  }
  
  // Configuración de drag & drop
  dragAndDrop?: {
    enabled?: boolean
    onReorder?: (items: T[]) => void
  }
  
  // Configuración de visibilidad de columnas
  columnVisibility?: {
    defaultHidden?: string[]
    allowToggle?: boolean
  }
  
  // Configuración de selección
  selection?: {
    enabled?: boolean
    multiSelect?: boolean
  }
  
  // Configuración de acciones
  actions?: {
    enabled?: boolean
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    onView?: (item: T) => void
    customActions?: Array<{
      label: string
      icon: React.ReactNode
      onClick: (item: T) => void
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    }>
  }
  
  // Opciones adicionales
  enableRowSelection?: boolean
  enableMultiSelection?: boolean
  enableSorting?: boolean
  enableFilters?: boolean
  
  // Callbacks
  onRowClick?: (item: T) => void
  onSelectionChange?: (selectedItems: T[]) => void
  onDataChange?: (data: T[]) => void
}

export interface DataTableProps<T extends TableData = any> {
  // Datos y configuración
  data: T[]
  config: DataTableConfig<T>
  
  // Estado
  loading?: boolean
  emptyMessage?: string
  
  // Paginación
  pagination?: {
    pageIndex: number
    pageSize: number
    totalPages?: number
    totalElements?: number
  }
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  
  // Búsqueda
  searchQuery?: string
  onSearch?: (query: string) => void
  onClearSearch?: () => void
  
  // Callbacks
  onRowClick?: (item: T) => void
  onSelectionChange?: (selectedItems: T[]) => void
  onDataChange?: (data: T[]) => void
  
  // Customización
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: string | ((item: T) => string)
  
  // Features
  enableSelection?: boolean
  enableExport?: boolean
  enableRefresh?: boolean
  
  // Renderers personalizados
  renderEmptyState?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  
  // Stats
  totalDataCount?: number
  filteredCount?: number
  searchMode?: 'active' | 'inactive'
}