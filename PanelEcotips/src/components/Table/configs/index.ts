// src/components/data-table/configs/index.ts
// export * from './shared'
// export * from './publications'

// Re-exportar tipos para conveniencia
export type { Publication } from './publications'

// src/components/data-table/index.ts
// Re-exportar el componente principal
export { DataTable } from "../index"

// Re-exportar configuraciones
export * from "../configs"

// Re-exportar tipos
export type { DataTableConfig, DataTableProps, TableData } from "../types"

// Re-exportar componentes relacionados
export { DataTableActions } from "../actions"