// // src/pages/Dashboard.tsx
// import { useEffect, useState, useMemo, useCallback } from "react"
// import { AppSidebar } from "@/components/app-sidebar"
// import { DataTable } from "@/components/data-table"
// import { publicationConfig } from "@/components/data-table/configs"
// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import { 
//   obtenerTodasLasPublicacionesSinEstado,
//   obtenerPublicacionPorId 
// } from "@/api/services/Publications/PublicacionesService"
// import { useAuth } from "@/api/AuthContext"
// import { toast } from "sonner"

// export default function Dashboard() {
//   const { token } = useAuth()
//   const [allData, setAllData] = useState<any[]>([])
//   const [displayData, setDisplayData] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchLoading, setSearchLoading] = useState(false)
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//     totalPages: 1,
//     totalElements: 0
//   })
//   const [searchQuery, setSearchQuery] = useState("")

//   // Customizar configuración para dashboard
//   const dashboardConfig = useMemo(() => ({
//     ...publicationConfig,
//     actions: {
//       view: (item) => {
//         // Ver detalles de publicación
//         console.log('Ver publicación:', item)
//       },
//       edit: (item) => {
//         // Editar publicación
//         console.log('Editar publicación:', item)
//       },
//       delete: (item) => {
//         // Eliminar publicación con confirmación
//         if (confirm(`¿Eliminar publicación "${item.titulo}"?`)) {
//           console.log('Eliminar:', item)
//         }
//       }
//     }
//   }), [])

//   // Resto del código del Dashboard permanece igual...
//   // Solo cambia cómo usas DataTable:

//   return (
//     <SidebarProvider>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col p-6">
//           <DataTable 
//             data={paginatedData} 
//             config={dashboardConfig}
//             pagination={pagination}
//             onPaginationChange={handlePaginationChange}
//             loading={loading || searchLoading}
//             onSearch={handleSearch}
//             onClearSearch={handleClearSearch}
//             searchQuery={searchQuery}
//             totalDataCount={allData.length}
//             searchMode={searchQuery.trim() !== "" ? "active" : "inactive"}
//             enableSelection={true}
//             enableExport={true}
//             renderHeader={() => (
//               <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-bold">Gestión de Publicaciones</h1>
//                 <Button variant="default">
//                   Nueva publicación
//                 </Button>
//               </div>
//             )}
//           />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }