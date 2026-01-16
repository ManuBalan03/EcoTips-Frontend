// src/components/data-table/actions.tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import type { DataTableConfig, TableData } from "./types"

interface DataTableActionsProps<T extends TableData> {
  item: T
  config: DataTableConfig<T>
  onAction?: (action: string, item: T) => void
}

export function DataTableActions<T extends TableData>({
  item,
  config,
  onAction,
}: DataTableActionsProps<T>) {
  const handleAction = (actionType: string) => {
    if (onAction) {
      onAction(actionType, item)
    }
    
    switch (actionType) {
      case 'view':
        config.actions?.onView?.(item)
        break
      case 'edit':
        config.actions?.onEdit?.(item)
        break
      case 'delete':
        config.actions?.onDelete?.(item)
        break
    }
  }

  if (!config.actions?.enabled) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <IconDotsVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {config.actions.onView && (
          <DropdownMenuItem onClick={() => handleAction('view')}>
            <IconEye className="mr-2 h-4 w-4" />
            <span>Ver detalles</span>
          </DropdownMenuItem>
        )}
        
        {config.actions.onEdit && (
          <DropdownMenuItem onClick={() => handleAction('edit')}>
            <IconEdit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </DropdownMenuItem>
        )}
        
        {/* Acciones personalizadas */}
        {config.actions.customActions?.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(item)}
            className={action.variant === 'destructive' ? 'text-destructive' : ''}
          >
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </DropdownMenuItem>
        ))}
        
        {config.actions.onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction('delete')}
              className="text-destructive focus:text-destructive"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}