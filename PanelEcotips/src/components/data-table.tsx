import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClock,
  IconCopy,
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconFile,
  IconGripVertical,
  IconHash,
  IconHeart,
  IconHelpCircle,
  IconLayoutColumns,
  IconLink,
  IconLoader,
  IconLoader2,
  IconMail,
  IconMessageCircle,
  IconMessageCircleExclamation,
  IconPhone,
  IconPhotoOff,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconShare2,
  IconStarFilled,
  IconTrash,
  IconTrendingUp,
  IconUser,
  IconX,
} from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, Bar, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip"
import { TooltipTrigger } from "./ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { BarChart } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale/es" // 👈 IMPORTACIÓN CORRECTA
import { useEffect } from "react"
import { obtenerUsuarioPorId } from "@/api/services/UserService"
import { useAuth } from "@/api/AuthContext"
import type { PublicacionDTO } from "@/api/services/Publications/Types/PublicationType"
import { actualizarPublicacion } from "@/api/services/Publications/PublicacionesService"

export const schema = z.object({
  id: z.number(),
  titulo:z.string(),
  estado: z.string(),
  descripcion: z.string(),
  puntos: z.number(),
  url_key: z.string(),
  fechaCreacion: z.string(),
  idUsuario: z.number(),
  nombreAutor: z.string(),
  fotoPerfil: z.string(),
  contenido_key: z.string()
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}



const formatDateOnly = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "Fecha no disponible"
  
  try {
    let date: Date
    
    if (dateString instanceof Date) {
      date = dateString
    } else if (typeof dateString === 'string') {
      date = new Date(dateString)
    } else {
      date = new Date(dateString)
    }
    
    if (!isValid(date)) {
      return "Fecha inválida"
    }
    
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale:es })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha desconocida"
  }
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}










//datos
export function DataTable({
  data: initialData,
  pagination: serverPagination,
  onPaginationChange,
  onSearch,
  onClearSearch,
  searchQuery: externalSearchQuery,
  loading = false,
  totalDataCount = 0,
  searchMode = "inactive"
}: {
  data: z.infer<typeof schema>[]
  pagination: {
    pageIndex: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onSearch?: (query: string) => void
  onClearSearch?: () => void
  searchQuery?: string
  loading?: boolean
  totalDataCount?: number
  searchMode?: 'active' | 'inactive'
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState(serverPagination)
  
  // Estado interno para el input de búsqueda
  const [internalSearchQuery, setInternalSearchQuery] = React.useState(externalSearchQuery || "")
  const [searchLoading, setSearchLoading] = React.useState(false)

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // Sincronizar con query externo
  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery)
    }
  }, [externalSearchQuery])

  // Función para manejar búsqueda
  const handleSearch = () => {
    if (onSearch) {
      onSearch(internalSearchQuery)
    }
  }

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setInternalSearchQuery("")
    if (onSearch) {
      onSearch("")
    } else if (onClearSearch) {
      onClearSearch()
    }
  }

  // Debounce para búsqueda automática
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalSearchQuery !== externalSearchQuery && internalSearchQuery !== "") {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [internalSearchQuery, externalSearchQuery])

  // Actualizar datos cuando cambia initialData
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Actualizar paginación cuando cambia serverPagination
  useEffect(() => {
    setPagination(serverPagination)
  }, [serverPagination])

  const handleUpdatePublication = (updatedItem: z.infer<typeof schema>) => {
    setData(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ))
    toast.success("Publicación actualizada correctamente")
  }

  // ⚠️ ELIMINA ESTA FUNCIÓN DUPLICADA - YA LA TIENES EN Dashboard.tsx ⚠️
  // const handlePaginationChange = (pageIndex: number, pageSize: number) => {
  //   setPagination(prev => ({
  //     ...prev,
  //     pageIndex,
  //     pageSize,
  //     totalPages: Math.ceil(filteredData.length / pageSize)
  //   }))
  // }

  // Función para cambios de paginación desde la tabla
  const handleTablePaginationChange = (updater: any) => {
    const newPagination = typeof updater === 'function' 
      ? updater(pagination) 
      : updater
    
    setPagination(newPagination)
    
    // Llamar al callback del padre
    if (onPaginationChange) {
      onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
    }
  }


  const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <DragHandle id={row.original.id} />
      </div>
    ),
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "titulo",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Título de la Publicación</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="group flex min-w-[200px] max-w-[300px] flex-col space-y-1">
        <TableCellViewer item={row.original} onUpdate={handleUpdatePublication}/>
        {row.original.descripcion && (
          <p className="text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-2 transition-all">
            {row.original.descripcion}
          </p>
        )}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex items-center justify-end space-x-2">
        <span className="font-semibold">ID</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Badge 
          variant="secondary" 
          className="font-mono text-xs bg-muted hover:bg-muted/80 transition-colors"
        >
          #{row.original.id}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="max-w-[250px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                {row.original.descripcion || "Sin descripción"}
              </p>
            </TooltipTrigger>
            {row.original.descripcion && (
              <TooltipContent className="max-w-[300px]">
                <p className="text-sm">{row.original.descripcion}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Estado</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const estado = row.original.estado;
      const estadoConfig = {
        APROBADA: {
          icon: <IconCircleCheckFilled className="h-3.5 w-3.5 fill-green-500 mr-1.5" />,
          styles: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
          label: "Aprobada",
          tooltip: "Publicación visible para todos los usuarios"
        },
        PENDIENTE: {
          icon: <IconClock className="h-3.5 w-3.5 fill-amber-500 mr-1.5 animate-pulse" />,
          styles: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
          label: "Pendiente",
          tooltip: "Esperando revisión por un experto"
        },
        MODIFICACION: {
          icon: <IconMessageCircleExclamation className="h-3.5 w-3.5 fill-orange-500 mr-1.5" />,
          styles: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
          label: "Modificación",
          tooltip: "Requiere cambios por el autor"
        },
        RECHAZADA: {
          icon: <IconCircleXFilled className="h-3.5 w-3.5 fill-red-500 mr-1.5" />,
          styles: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
          label: "Rechazada",
          tooltip: "No cumple con los criterios de publicación"
        }
      };

      const config = estadoConfig[estado as keyof typeof estadoConfig] || {
        icon: <IconLoader className="h-3.5 w-3.5 fill-gray-500 mr-1.5" />,
        styles: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800",
        label: estado,
        tooltip: "Estado desconocido"
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={`inline-flex items-center ${config.styles} px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-90`}
              >
                {config.icon}
                <span className="font-medium">{config.label}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{config.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "puntos",
    header: ({ column }) => (
      <div className="flex items-center justify-end space-x-2">
        <span className="font-semibold">Puntos</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Badge 
          variant="secondary" 
          className="font-mono text-xs bg-muted hover:bg-muted/80 transition-colors"
        >
          {row.original.puntos}
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "fechaCreacion",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Fecha de Creación</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaCreacion);
      const ahora = new Date();
      const diferenciaDias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
      
      let tiempoRelativo = "";
      if (diferenciaDias === 0) tiempoRelativo = "Hoy";
      else if (diferenciaDias === 1) tiempoRelativo = "Ayer";
      else if (diferenciaDias < 7) tiempoRelativo = `Hace ${diferenciaDias} días`;
      else tiempoRelativo = `Hace ${Math.floor(diferenciaDias / 7)} semanas`;

      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {tiempoRelativo} • {fecha.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "idUsuario",
    header: ({ column }) => (
      <div className="flex items-center justify-end space-x-2">
        <span className="font-semibold">ID Usuario</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 w-8 p-0"
        >
          <IconChevronUp className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Badge 
          variant="secondary" 
          className="font-mono text-xs bg-muted hover:bg-muted/80 transition-colors"
        >
          #{row.original.idUsuario}
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "url_key",
    header: "Imagen/Contenido",
    cell: ({ row }) => {
      const url = row.original.url_key;
      
      if (!url) {
        return (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <IconPhotoOff className="h-4 w-4" />
            <span className="text-sm">Sin imagen</span>
          </div>
        );
      }

      const esImagen = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      const esVideo = /\.(mp4|mov|avi|webm)$/i.test(url);

      return (
        <div className="flex items-center space-x-3">
          {esImagen ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-md border">
              <img 
                src={url} 
                alt="Miniatura" 
                className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          ) : esVideo ? (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
              <IconPlayerPlay className="h-5 w-5" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-center">
                <span className="text-[10px] text-white">VID</span>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
              <IconLink className="h-4 w-4" />
            </div>
          )}
          
          <div className="max-w-[150px]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {esImagen ? "Ver imagen" : esVideo ? "Ver video" : "Ver contenido"}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Click para abrir en nueva pestaña</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-[10px] text-muted-foreground block truncate">
              {url.split('/').pop()?.substring(0, 20)}...
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted data-[state=open]:bg-muted"
          >
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="flex items-center gap-2">
            <IconEdit className="h-4 w-4" />
            <span>Editar publicación</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center gap-2"
            onClick={() => navigator.clipboard.writeText(row.original.id.toString())}
          >
            <IconCopy className="h-4 w-4" />
            <span>Copiar ID</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 text-amber-600 focus:text-amber-600 dark:text-amber-400"
            onClick={() => {/* Cambiar estado a pendiente */}}
          >
            <IconClock className="h-4 w-4" />
            <span>Marcar como pendiente</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center gap-2 text-green-600 focus:text-green-600 dark:text-green-400"
            onClick={() => {/* Cambiar estado a aprobada */}}
          >
            <IconCircleCheck className="h-4 w-4" />
            <span>Aprobar publicación</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center gap-2 text-orange-600 focus:text-orange-600 dark:text-orange-400"
            onClick={() => {/* Cambiar estado a modificación */}}
          >
            <IconMessageCircleExclamation className="h-4 w-4" />
            <span>Solicitar modificaciones</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            variant="destructive"
            className="flex items-center gap-2 text-red-600 focus:text-red-600 dark:text-red-400"
            onClick={() => {/* Eliminar publicación */}}
          >
            <IconTrash className="h-4 w-4" />
            <span>Eliminar publicación</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handleTablePaginationChange, // Usar nuestro handler
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: !!onPaginationChange, // Importante: paginación manual
    pageCount: serverPagination?.totalPages, // Número total de páginas del servidor
    rowCount: serverPagination?.totalElements, // Número total de elementos
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }
return (
  <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 lg:px-6">
      {/* BUSCADOR - LADO IZQUIERDO */}
      <div className="w-full sm:flex-1 sm:max-w-md">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
            {searchLoading ? (
              <IconLoader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : internalSearchQuery.match(/^\d+$/) ? (
              <IconHash className="h-4 w-4 text-blue-500" />
            ) : (
              <IconSearch className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          <input
            type="text"
            placeholder={searchMode === 'active' ? "Buscar por ID o texto..." : "Buscar por ID (número) o texto..."}
            value={internalSearchQuery}
            onChange={(e) => {
              const value = e.target.value
              setInternalSearchQuery(value)
              // Si es un número completo, buscar inmediatamente
              if (/^\d+$/.test(value) && value.length >= 1) {
                if (onSearch) onSearch(value)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (onSearch) onSearch(internalSearchQuery)
              }
              if (e.key === 'Escape') {
                if (onClearSearch) onClearSearch()
              }
            }}
            className="pl-10 pr-24 w-full h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || searchLoading}
          />
          
          {/* Indicador de tipo de búsqueda */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {internalSearchQuery && (
              <button
                onClick={() => {
                  setInternalSearchQuery("")
                  if (onClearSearch) onClearSearch()
                }}
                className="p-1 hover:bg-muted rounded transition-colors"
                disabled={loading || searchLoading}
              >
                <IconX className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            
            {searchMode === 'active' && (
              <>
                <div className="h-4 w-px bg-border"></div>
                <div className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                  {internalSearchQuery.match(/^\d+$/) ? 'Búsqueda por ID' : 'Búsqueda por texto'}
                </div>
              </>
            )}
          </div>
          
          {/* Sugerencias */}
          <div className="absolute left-0 right-0 top-full mt-1 text-xs text-muted-foreground hidden sm:flex items-center justify-between">
            <span>
              {searchMode === 'active' 
                ? `Mostrando ${pagination.totalElements} de ${totalDataCount} resultados` 
                : `Total: ${totalDataCount} publicaciones`
              }
            </span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <IconHash className="h-3 w-3" />
                Buscar por ID
              </span>
              <span className="flex items-center gap-1">
                <IconSearch className="h-3 w-3" />
                Buscar por texto
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS Y CONTROLES - LADO DERECHO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <TabsContent
      value="outline"
      className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
    >
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="text-muted-foreground text-sm order-2 sm:order-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {serverPagination?.totalElements || table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4 order-1 sm:order-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium hidden sm:block">
              Filas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value)
                handleTablePaginationChange({
                  pageIndex: 0,
                  pageSize: newSize
                })
              }}
              disabled={loading}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-center text-sm font-medium">
            {loading ? (
              <div className="flex items-center gap-2">
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : (
              <>
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {serverPagination?.totalPages || table.getPageCount()}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden sm:flex h-8 w-8 p-0"
              onClick={() => handleTablePaginationChange({ pageIndex: 0, pageSize: pagination.pageSize })}
              disabled={!table.getCanPreviousPage() || loading}
            >
              <span className="sr-only">Ir a primera página</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => handleTablePaginationChange({
                pageIndex: pagination.pageIndex - 1,
                pageSize: pagination.pageSize
              })}
              disabled={!table.getCanPreviousPage() || loading}
            >
              <span className="sr-only">Ir a página anterior</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => handleTablePaginationChange({
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize
              })}
              disabled={!table.getCanNextPage() || loading}
            >
              <span className="sr-only">Ir a página siguiente</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden sm:flex size-8"
              size="icon"
              onClick={() => handleTablePaginationChange({
                pageIndex: (serverPagination?.totalPages || 1) - 1,
                pageSize: pagination.pageSize
              })}
              disabled={!table.getCanNextPage() || loading}
            >
              <span className="sr-only">Ir a última página</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mostrar estado de carga si está cargando */}
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <IconLoader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Cargando datos...</p>
          </div>
        </div>
      )}
    </TabsContent>
  </Tabs>
)
}






const formatDateSafe = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "Fecha no disponible"
  
  try {
    let date: Date
    
    if (dateString instanceof Date) {
      date = dateString
    } else if (typeof dateString === 'string') {
      // Intenta parsear ISO
      date = parseISO(dateString)
      
      // Si no es válido ISO, intenta con new Date
      if (!isValid(date)) {
        date = new Date(dateString)
      }
    } else {
      date = new Date(dateString)
    }
    
    if (!isValid(date)) {
      return "Fecha inválida"
    }
    
    return format(date, "dd/MM/yyyy HH:mm", { locale: es })
  } catch (error) {
    console.error("Error al formatear fecha:", error, dateString)
    return "Error en fecha"
  }
}



const chartConfig = {
  likes: {
    label: "Me gustas",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Comentarios",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

function TableCellViewer({ item, onUpdate }: { 
  item: z.infer<typeof schema>;
  onUpdate?: (updatedItem: z.infer<typeof schema>) => void;
}) {
  const isMobile = useIsMobile();
  const { token } = useAuth();
  
  const [userData, setUserData] = useState<{
    idUsuario: number;
    nombre: string;
    email: string;
    telefono?: string;
    fotoPerfil?: string;
    nivel?: string;
    puntosTo?: number;
  } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);


  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!item.idUsuario || !token) return;
      
      setLoadingUser(true);
      try {
        const user = await obtenerUsuarioPorId(item.idUsuario, token);
        setUserData(user);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, [item.idUsuario, token]);


  // Configuración del estado
  const getEstadoConfig = (estado: string) => {
    switch(estado) {
      case "APROBADA":
        return { 
          icon: <IconCircleCheckFilled className="h-4 w-4 fill-green-500" />,
          color: "text-green-600",
          bg: "bg-green-50"
        }
      case "PENDIENTE":
        return { 
          icon: <IconClock className="h-4 w-4 fill-amber-500" />,
          color: "text-amber-600",
          bg: "bg-amber-50"
        }
      case "MODIFICACION":
        return { 
          icon: <IconMessageCircleExclamation className="h-4 w-4 fill-orange-500" />,
          color: "text-orange-600",
          bg: "bg-orange-50"
        }
      case "RECHAZADA":
        return { 
          icon: <IconCircleXFilled className="h-4 w-4 fill-red-500" />,
          color: "text-red-600",
          bg: "bg-red-50"
        }
      default:
        return { 
          icon: <IconHelpCircle className="h-4 w-4 fill-gray-500" />,
          color: "text-gray-600",
          bg: "bg-gray-50"
        }
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      // Aquí iría tu llamada a la API para subir a S3
      // Por ahora es un placeholder
      toast.info("Subiendo imagen...");
      
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // URL de ejemplo - reemplazar con la URL real de tu S3
      const s3Url = `https://tu-bucket-s3.s3.amazonaws.com/${Date.now()}-${file.name}`;
      
      toast.success("Imagen subida correctamente");
      return s3Url;
      
    } catch (error) {
      toast.error("Error al subir la imagen");
      console.error("Error en upload:", error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  
  const estadoConfig = getEstadoConfig(item.estado)

 const handleSave = async () => {
    if (!token || !editedItem.id) return;
    
    setLoadingSave(true);
    
    try {
      const datosActualizados: PublicacionDTO = {
        titulo: editedItem.titulo,
        descripcion: editedItem.descripcion || "",
        estado: editedItem.estado,
        contenido_key: editedItem.contenido_key || "",
        fechaCreacion: editedItem.fechaCreacion,
        puntos: editedItem.puntos
      };
      
      // Llamar a la API
      const respuesta = await actualizarPublicacion(
        editedItem.id, 
        datosActualizados,
        token
      );
      
      // Mostrar notificación de éxito con Sonner
      toast.success("¡Éxito! La publicación se ha actualizado correctamente.", {
        description: `"${editedItem.titulo}" ha sido actualizada.`,
        duration: 3000,
      });
      
      setIsEditing(false);
      
      // Actualizar la tabla si se proporcionó el callback
      if (onUpdate) {
        onUpdate({
          ...item,
          ...datosActualizados,
          fechaCreacion: editedItem.fechaCreacion,
        });
      }
      
    } catch (error: any) {
      console.error('Error al guardar cambios:', error);
      
      const mensajeError = error.response?.data?.message || 
                          error.message || 
                          "Error al actualizar la publicación";
      
      toast.error("Error al guardar cambios", {
        description: mensajeError,
        duration: 5000,
      });
      
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
    toast.info("Cambios cancelados");
  };

  // Formatear fecha para datetime-local
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

const renderEditForm = () => (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo" className="font-medium">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="titulo" 
            value={editedItem.titulo}
            onChange={(e) => setEditedItem({...editedItem, titulo: e.target.value})}
            placeholder="Título de la publicación"
            required
            disabled={loadingSave}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descripcion" className="font-medium">
            Descripción
          </Label>
          <textarea 
            id="descripcion" 
            value={editedItem.descripcion || ""}
            onChange={(e) => setEditedItem({...editedItem, descripcion: e.target.value})}
            placeholder="Describe tu publicación..."
            rows={3}
            disabled={loadingSave}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="puntos" className="font-medium">
              Puntos
            </Label>
            <Input 
              id="puntos" 
              type="number"
              min="0"
              value={editedItem.puntos || 0}
              onChange={(e) => setEditedItem({...editedItem, puntos: parseInt(e.target.value) || 0})}
              placeholder="Puntos de la publicación"
              disabled={loadingSave}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado" className="font-medium">
              Estado
            </Label>
            <Select 
              value={editedItem.estado}
              onValueChange={(value) => setEditedItem({...editedItem, estado: value})}
              disabled={loadingSave}
            >
              <SelectTrigger id="estado" className={loadingSave ? "opacity-50" : ""}>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APROBADA" className="flex items-center gap-2">
                  <IconCircleCheckFilled className="h-3.5 w-3.5 fill-green-500" />
                  Aprobada
                </SelectItem>
                <SelectItem value="PENDIENTE" className="flex items-center gap-2">
                  <IconClock className="h-3.5 w-3.5 fill-amber-500" />
                  Pendiente
                </SelectItem>
                <SelectItem value="MODIFICACION" className="flex items-center gap-2">
                  <IconMessageCircleExclamation className="h-3.5 w-3.5 fill-orange-500" />
                  En modificación
                </SelectItem>
                <SelectItem value="RECHAZADA" className="flex items-center gap-2">
                  <IconCircleXFilled className="h-3.5 w-3.5 fill-red-500" />
                  Rechazada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha" className="font-medium">
              Fecha y hora de publicación
            </Label>
            <Input 
              id="fecha" 
              type="datetime-local"
              value={formatDateForInput(editedItem.fechaCreacion)}
              onChange={(e) => {
                if (e.target.value) {
                  setEditedItem({...editedItem, fechaCreacion: new Date(e.target.value).toISOString()});
                }
              }}
              disabled={loadingSave}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contenido_key" className="font-medium">
              Clave del contenido (S3)
            </Label>
            <Input 
              id="contenido_key" 
              value={editedItem.contenido_key || ""}
              onChange={(e) => setEditedItem({...editedItem, contenido_key: e.target.value})}
              placeholder="clave-s3/imagen.jpg"
              disabled={loadingSave || uploadingImage}
            />
          </div>
        </div>
        
        {/* Sección para subir imágenes */}
        <div className="space-y-2">
          <Label className="font-medium">
            Subir imagen a S3
          </Label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Input 
                id="image-upload"
                type="file"
                accept="image/*,video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const s3Url = await handleImageUpload(file);
                    if (s3Url) {
                      setEditedItem(prev => ({
                        ...prev,
                        contenido_key: s3Url,
                        url_key: s3Url // También actualizar url_key si es necesario
                      }));
                    }
                  }
                }}
                disabled={uploadingImage || loadingSave}
                className="flex-1"
              />
              {uploadingImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  Subiendo...
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Formatos aceptados: JPG, PNG, GIF, MP4, MOV</p>
              <p>La imagen se subirá a tu bucket de S3</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url_key" className="font-medium">
            URL pública del contenido
          </Label>
          <Input 
            id="url_key" 
            value={editedItem.url_key || ""}
            onChange={(e) => setEditedItem({...editedItem, url_key: e.target.value})}
            placeholder="https://ejemplo.com/imagen.jpg"
            type="url"
            disabled={loadingSave}
          />
          <p className="text-xs text-muted-foreground">
            URL pública para visualizar el contenido (opcional si usas S3)
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          type="submit" 
          className="flex-1 gap-2"
          disabled={loadingSave || uploadingImage}
        >
          {loadingSave ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={loadingSave || uploadingImage}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );


    const renderReadOnlyInfo = () => (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-sm font-medium text-muted-foreground">Título</Label>
        <p className="text-base">{item.titulo}</p>
      </div>
      
      <div className="space-y-1">
        <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
        <p className="text-base text-muted-foreground">{item.descripcion || "Sin descripción"}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-muted-foreground">Puntos</Label>
          <Badge variant="secondary" className="font-mono">
            {item.puntos || 0} pts
          </Badge>
        </div>
        
        <div className="space-y-1">
          <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
          <Badge 
            variant="outline" 
            className={`inline-flex items-center gap-1.5 ${estadoConfig.bg} ${estadoConfig.color} border-current/20`}
          >
            {estadoConfig.icon}
            {item.estado}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-1">
        <Label className="text-sm font-medium text-muted-foreground">Fecha de creación</Label>
        <p className="text-base">{formatDateSafe(item.fechaCreacion)}</p>
      </div>
      
      {item.contenido_key && (
        <div className="space-y-1">
          <Label className="text-sm font-medium text-muted-foreground">Clave S3</Label>
          <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
            {item.contenido_key}
          </p>
        </div>
      )}
      
      {item.url_key && (
        <div className="space-y-1">
          <Label className="text-sm font-medium text-muted-foreground">URL del contenido</Label>
          <a 
            href={item.url_key} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
          >
            <IconExternalLink className="h-4 w-4" />
            Ver contenido original
          </a>
        </div>
      )}
      
      {/* Información del usuario */}
      <div className="space-y-1">
        <Label className="text-sm font-medium text-muted-foreground">Autor</Label>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-background">
            {userData?.fotoPerfil ? (
              <AvatarImage 
                src={userData.fotoPerfil} 
                alt={userData.nombre}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {loadingUser ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                userData?.nombre?.charAt(0)?.toUpperCase() || "U"
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {loadingUser ? (
                  <span className="flex items-center gap-2">
                    <IconLoader2 className="h-3 w-3 animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  userData?.nombre || `Usuario #${item.idUsuario}`
                )}
              </p>
              {userData?.nivel && (
                <Badge 
                  variant="outline" 
                  className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800"
                >
                  {userData.nivel}
                </Badge>
              )}
            </div>
            
            {userData?.email && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <IconMail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {userData.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <Drawer  direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger  asChild>
        <Button 
          variant="link" 
          className="text-foreground hover:text-primary w-fit px-0 text-left hover:underline transition-colors"
        >
          <div className="flex items-center gap-2">
            {item.url_key && (
              <div className="h-6 w-6 overflow-hidden rounded border">
                {item.url_key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={item.url_key} 
                    alt="Miniatura" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <IconFile className="h-3 w-3" />
                  </div>
                )}
              </div>
            )}
            <span className="truncate max-w-[150px] md:max-w-[200px]">{item.titulo}</span>
          </div>
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[90vh]  bg-gray-500">
        <DrawerHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold flex items-center gap-2">
                {item.titulo}
                <Badge variant="outline" className={`${estadoConfig.bg} ${estadoConfig.color} border-current/20`}>
                  {estadoConfig.icon}
                  {item.estado}
                </Badge>
              </DrawerTitle>
              <DrawerDescription className="mt-1 flex items-center gap-2">
                <IconCalendar className="h-3.5 w-3.5" />]
                Publicado el {formatDateOnly(item.fechaCreacion)}

              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconX className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {/* Vista previa de contenido */}
          {item.url_key && (
            <div className="rounded-lg border overflow-hidden">
              {item.url_key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img 
                  src={item.url_key} 
                  alt={item.titulo}
                  className="w-full max-h-[300px] object-contain bg-muted"
                />
              ) : item.url_key.match(/\.(mp4|mov|avi|webm)$/i) ? (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <video controls className="max-h-[300px]">
                    <source src={item.url_key} type="video/mp4" />
                  </video>
                </div>
              ) : null}
            </div>
          )}
          
          {/* Estadísticas rápidas */}
          {!isMobile && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Interacciones</p>
                      <p className="text-2xl font-bold">142</p>
                    </div>
                    <IconHeart className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Comentarios</p>
                      <p className="text-2xl font-bold">28</p>
                    </div>
                    <IconMessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Compartidos</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                    <IconShare2 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Formulario de edición */}
                <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Información de la publicación</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5"
              disabled={loadingSave || uploadingImage}
            >
              {isEditing ? (
                <>
                  <IconEye className="h-3.5 w-3.5" />
                  Ver
                </>
              ) : (
                <>
                  <IconEdit className="h-3.5 w-3.5" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEditing ? renderEditForm() : renderReadOnlyInfo()}
        </CardContent>
      </Card>

        </div>
        
        <DrawerFooter className="border-t px-6 py-4">
          <div className="flex w-full gap-3">
            <Button className="flex-1 gap-2">
              <IconDownload className="h-4 w-4" />
              Exportar datos
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="gap-2">
                <IconX className="h-4 w-4" />
                Cerrar
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}