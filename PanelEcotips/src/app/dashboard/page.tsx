import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { obtenerTodasLasPublicaciones, obtenerTodasLasPublicacionesSinEstado } from "@/api/services/Publications/PublicacionesService"
import { useAuth } from "@/api/AuthContext"

export default function Page() {
  const { token } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const cargarPublicaciones = async () => {
      try {
        // 👇 AQUÍ LLAMAS AL BACKEND
        const response = await obtenerTodasLasPublicacionesSinEstado(
          token,
          undefined, // ⬅️ SIN ESTADO (ver punto 2)
          0,
          20
        )
        setData(response.content)
      } catch (error) {
        console.error("Error cargando publicaciones", error)
      } finally {
        setLoading(false)
      }
    }

    cargarPublicaciones()
  }, [token])

  if (loading) return <p>Cargando...</p>

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <DataTable data={data} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
