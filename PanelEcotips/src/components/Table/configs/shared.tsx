// src/components/data-table/configs/shared.ts
import { IconCircleCheckFilled, IconClock, IconCircleXFilled, IconCheck } from "@tabler/icons-react"
import type { StatusConfigItem } from "../types"

// IMPORTANTE: Esto debe coincidir con StatusConfigItem
export const defaultStatusConfig: Record<string, StatusConfigItem> = {
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