// src/components/data-table/configs.tsx
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconMail,
  IconUser,
  IconTrendingUp,
} from "@tabler/icons-react"
import type { DataTableConfig } from "./types"
import type React from "react"

// Schema para publicaciones
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

// Schema para usuarios
export const userSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  rol: z.string(),
  estado: z.string(),
  fechaRegistro: z.string(),
  ultimoAcceso: z.string().optional(),
  avatar: z.string().optional(),
})

// Exportar tipos inferidos
export type Publication = z.infer<typeof publicationSchema>
export type User = z.infer<typeof userSchema>

// Configuración de estado por defecto
export const defaultStatusConfig = {
  APROBADA: {
    label: "Aprobada",
    icon: <IconCircleCheckFilled className="h-3.5 w-3.5 fill-green-500" />,
    styles: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    tooltip: "Elemento aprobado"
  },
  PENDIENTE: {
    label: "Pendiente",
    icon: <IconClock className="h-3.5 w-3.5 fill-amber-500" />,
    styles: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    tooltip: "Elemento pendiente"
  },
  ACTIVO: {
    label: "Activo",
    icon: <IconCheck className="h-3.5 w-3.5 fill-green-500" />,
    styles: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    tooltip: "Usuario activo"
  },
  INACTIVO: {
    label: "Inactivo",
    icon: <IconCircleXFilled className="h-3.5 w-3.5 fill-red-500" />,
    styles: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    tooltip: "Usuario inactivo"
  },
}

// Configuración para publicaciones
export const publicationConfig: DataTableConfig<Publication> = {
  schema: publicationSchema,
  statusConfig: defaultStatusConfig,
  search: {
    enabled: true,
    fields: ['titulo', 'descripcion', 'nombreAutor'],
    placeholder: "Buscar publicaciones..."
  },
  pagination: {
    enabled: true,
    pageSizes: [10, 20, 30, 50]
  },
  dragAndDrop: {
    enabled: true
  },
  columnVisibility: {
    defaultHidden: ['contenido_key', 'fotoPerfil'],
    allowToggle: true
  },
  enableRowSelection: true,
  enableSorting: true,
  columns: [
    {
      accessorKey: "titulo",
      header: "Título",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.titulo}</div>
      ),
      enableSorting: true,
      enableHiding: false
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.estado
        const config = defaultStatusConfig[status as keyof typeof defaultStatusConfig] || {
          label: status,
          icon: null,
          styles: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800",
          tooltip: "Estado desconocido"
        }
        
        return (
          <Badge variant="outline" className={config.styles}>
            {config.icon}
            {config.label}
          </Badge>
        )
      },
      enableSorting: true,
      enableHiding: false
    },
    {
      accessorKey: "puntos",
      header: "Puntos",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.puntos}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          {new Date(row.original.fechaCreacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: "nombreAutor",
      header: "Autor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.nombreAutor}</span>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    }
  ]
}

// Configuración para usuarios
export const userConfig: DataTableConfig<User> = {
  schema: userSchema,
  statusConfig: defaultStatusConfig,
  search: {
    enabled: true,
    fields: ['nombre', 'email', 'rol'],
    placeholder: "Buscar usuarios..."
  },
  pagination: {
    enabled: true,
    pageSizes: [10, 20, 30, 50]
  },
  dragAndDrop: {
    enabled: false
  },
  columnVisibility: {
    defaultHidden: ['ultimoAcceso'],
    allowToggle: true
  },
  enableRowSelection: true,
  enableSorting: true,
  columns: [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.avatar && (
            <img 
              src={row.original.avatar} 
              alt={row.original.nombre}
              className="h-8 w-8 rounded-full object-cover border"
            />
          )}
          <div>
            <div className="font-medium">{row.original.nombre}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
      enableSorting: true,
      enableHiding: false
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconMail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.email}</span>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: "rol",
      header: "Rol",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.rol}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.estado
        const config = defaultStatusConfig[status as keyof typeof defaultStatusConfig] || {
          label: status,
          icon: null,
          styles: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800",
          tooltip: "Estado desconocido"
        }
        
        return (
          <Badge variant="outline" className={config.styles}>
            {config.icon}
            {config.label}
          </Badge>
        )
      },
      enableSorting: true,
      enableHiding: false
    },
    {
      accessorKey: "fechaRegistro",
      header: "Registro",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          {new Date(row.original.fechaRegistro).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    }
  ]
}