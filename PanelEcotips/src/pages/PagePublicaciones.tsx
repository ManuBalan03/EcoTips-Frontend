// src/pages/publications.tsx
import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/data_table"
import { publicationConfig, type Publication } from "@/components/Table/configs"
import { obtenerTodasLasPublicacionesSinEstado } from "@/api/services/Publications/PublicacionesService"
import { useAuth } from "@/api/AuthContext"
import { toast } from "sonner"

export default function PublicationsPage() {
  const { token } = useAuth()
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Cargar datos
  const fetchData = useCallback(async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await obtenerTodasLasPublicacionesSinEstado(
        token,
        undefined,
        pagination.pageIndex,
        pagination.pageSize
      )
      
      setPublications(response.content || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalElements || 0
      }))
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error al cargar las publicaciones")
    } finally {
      setLoading(false)
    }
  }, [token, pagination.pageIndex, pagination.pageSize])

  // Efecto para cargar datos
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Configuración personalizada con tipos correctos
  const config = {
    ...publicationConfig,
    actions: {
      ...publicationConfig.actions,
      onView: (publication: Publication) => {
        console.log("Ver publicación:", publication)
        toast.info(`Viendo: ${publication.titulo}`)
      },
      onEdit: (publication: Publication) => {
        console.log("Editar publicación:", publication)
        toast.info(`Editando: ${publication.titulo}`)
      },
      onDelete: (publication: Publication) => {
        if (confirm(`¿Estás seguro de eliminar la publicación "${publication.titulo}"?`)) {
          console.log("Eliminar publicación:", publication)
          toast.success(`Publicación "${publication.titulo}" eliminada`)
        }
      },
    }
  }

  // Handler para cambio de paginación
  const handlePaginationChange = useCallback((pageIndex: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, pageIndex, pageSize }))
  }, [])

  // Handler para búsqueda
  const handleSearch = useCallback((query: string) => {
    console.log("Búsqueda realizada:", query)
    setSearchQuery(query)
  }, [])

  // Handler para limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    console.log("Búsqueda limpiada")
  }, [])

  // Handler para clic en fila
  const handleRowClick = useCallback((publication: Publication) => {
    console.log("Fila clickeada:", publication)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Publicaciones</h1>
        <p className="text-muted-foreground mt-2">
          Administra y revisa todas las publicaciones del sistema
        </p>
      </div>

      <DataTable
        data={publications}
        config={config}
        loading={loading}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onRowClick={handleRowClick}
        enableSelection={true}
        emptyMessage="No hay publicaciones disponibles"
        className="bg-card rounded-lg border shadow-sm"
      />
    </div>
  )
}