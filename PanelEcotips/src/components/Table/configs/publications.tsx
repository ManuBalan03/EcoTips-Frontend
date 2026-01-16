// src/components/data-table/configs/publications.ts
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { IconCalendar, IconUser, IconTrendingUp } from "@tabler/icons-react"
import type { DataTableConfig } from "../types"
import { defaultStatusConfig } from "./shared"

// Schema
export const publicationSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  estado: z.string(),
  descripcion: z.string(),
  puntos: z.number(),
  url_key: z.string().optional(),
  fechaCreacion: z.string(),
  idUsuario: z.number(),
  nombreAutor: z.string(),
  fotoPerfil: z.string().optional(),
  contenido_key: z.string().optional(),
})

export type Publication = z.infer<typeof publicationSchema>

// Configuración
export const publicationConfig: DataTableConfig<Publication> = {
  schema: publicationSchema,
  columns: [
    {
      accessorKey: "titulo",
      header: "Título",
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">
          {row.original.titulo}
        </div>
      ),
      enableSorting: true,
      size: 300,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.estado
        const config = defaultStatusConfig[status] || {
          label: status,
          icon: null,
          styles: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800",
        }
        
        return (
          <Badge variant="outline" className={config.styles}>
            {config.icon}
            {config.label}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "puntos",
      header: "Puntos",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          <IconTrendingUp className="mr-1 h-3 w-3" />
          {row.original.puntos}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
          {new Date(row.original.fechaCreacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nombreAutor",
      header: "Autor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUser className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.original.nombreAutor}</span>
        </div>
      ),
      enableSorting: true,
    },
  ],
  
  // Configuración de estados - CORREGIDO: usar statusConfig, no statuses
  statusConfig: defaultStatusConfig,
  
  search: {
    enabled: true,
    placeholder: "Buscar publicaciones...",
    fields: ['titulo', 'descripcion', 'nombreAutor'],
  },
  
  pagination: {
    enabled: true,
    pageSizes: [10, 20, 50, 100],
  },
  
  selection: {
    enabled: true,
    multiSelect: true,
  },
  
  actions: {
    enabled: true,
    onView: undefined,
    onEdit: undefined,
    onDelete: undefined,
  },
  
  enableRowSelection: true,
  enableSorting: true,
}