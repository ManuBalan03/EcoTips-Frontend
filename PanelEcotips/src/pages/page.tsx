
// src/pages/Dashboard.tsx
import { useEffect, useState, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { 
  obtenerTodasLasPublicacionesSinEstado,
  obtenerPublicacionPorId 
} from "@/api/services/Publications/PublicacionesService"
import { useAuth } from "@/api/AuthContext"
import { toast } from "sonner"

export default function Dashboard() {
  const { token } = useAuth()
  const [allData, setAllData] = useState<any[]>([]) // Todos los datos cargados
  const [displayData, setDisplayData] = useState<any[]>([]) // Datos que se muestran (filtrados o todos)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Cargar todos los datos inicialmente
  const fetchAllData = useCallback(async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await obtenerTodasLasPublicacionesSinEstado(
        token,
        undefined,
        0,
        100 // Carga 100 registros inicialmente
      )
      
      const data = response.content || []
      setAllData(data)
      setDisplayData(data)
      
      setPagination({
        pageIndex: 0,
        pageSize: 10,
        totalPages: Math.ceil(data.length / 10),
        totalElements: data.length
      })
    } catch (e) {
      console.error("Error fetching data:", e)
      toast.error("Error al cargar las publicaciones")
    } finally {
      setLoading(false)
    }
  }, [token])

  // Función para buscar por ID
  const searchById = useCallback(async (idString: string) => {
    if (!token) return
    
    const id = parseInt(idString)
    if (isNaN(id)) {
      toast.error("ID debe ser un número válido")
      return
    }
    
    setSearchLoading(true)
    try {
      const publicacion = await obtenerPublicacionPorId(id, token)
      
      if (publicacion) {
        setDisplayData([publicacion])
        setPagination({
          pageIndex: 0,
          pageSize: 10,
          totalPages: 1,
          totalElements: 1
        })
        toast.success(`Publicación #${id} encontrada`)
      } else {
        toast.error(`No se encontró publicación con ID ${id}`)
        setDisplayData([])
        setPagination({
          pageIndex: 0,
          pageSize: 10,
          totalPages: 0,
          totalElements: 0
        })
      }
    } catch (error: any) {
      console.error("Error searching by ID:", error)
      
      if (error.response?.status === 404) {
        toast.error(`Publicación con ID ${id} no encontrada`)
      } else {
        toast.error("Error al buscar la publicación")
      }
      
      setDisplayData([])
      setPagination({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0
      })
    } finally {
      setSearchLoading(false)
    }
  }, [token])

  // Manejar cambios en la búsqueda
  useEffect(() => {
    const query = searchQuery.trim()
    
    if (query === "") {
      // Mostrar todos los datos si no hay búsqueda
      setDisplayData(allData)
      setPagination(prev => ({
        ...prev,
        pageIndex: 0,
        totalPages: Math.ceil(allData.length / prev.pageSize),
        totalElements: allData.length
      }))
    } else if (/^\d+$/.test(query)) {
      // Si es solo números, buscar por ID
      const timer = setTimeout(() => {
        searchById(query)
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      // Si es texto, filtrar localmente
      const filtered = allData.filter(item =>
        item.titulo?.toLowerCase().includes(query.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
        item.estado?.toLowerCase().includes(query.toLowerCase()) ||
        item.nombreAutor?.toLowerCase().includes(query.toLowerCase())
      )
      
      setDisplayData(filtered)
      setPagination(prev => ({
        ...prev,
        pageIndex: 0,
        totalPages: Math.ceil(filtered.length / prev.pageSize),
        totalElements: filtered.length
      }))
    }
  }, [searchQuery, allData, searchById])

  // Cargar datos iniciales
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Obtener datos paginados para la tabla
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return displayData.slice(start, end)
  }, [displayData, pagination.pageIndex, pagination.pageSize])

  // Función para manejar cambios de página - CORREGIDA
  const handlePaginationChange = useCallback((pageIndex: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex,
      pageSize,
      totalPages: Math.ceil(displayData.length / pageSize)
    }))
  }, [displayData])

  // Función para búsqueda desde el DataTable
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Función para limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])

  if (loading && allData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Cargando publicaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <DataTable 
            data={paginatedData} 
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            loading={loading || searchLoading}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            searchQuery={searchQuery}
            totalDataCount={allData.length}
            searchMode={searchQuery.trim() !== "" ? "active" : "inactive"}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}