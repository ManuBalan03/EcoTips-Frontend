import React, { useState, useEffect } from "react";
import { useAuth } from "../../../api/AuthContext";
import DefaultLayout from "../../../components/layout/navbar";
import UserPublicationsSection from "../../../components/common/PublicationsSection/PublicationsUser";
import { PublicacionDTO } from "../../../api/services/PublicacionesService";
import { obtenerPublicacionesPorUsuario } from "../../../api/services/PublicacionesService";
import { obtenerUsuarioPorId } from "../../../api/services/UserService";
import { Usuario } from "../../../api/types/userexample";
import './PerfilSection.css'

function PerfilSection() {
  const { user: authUser, isAuthenticated, token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionDTO[]>([]);
  const [userCompleto, setUserCompleto] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos completos del usuario y sus publicaciones
  useEffect(() => {
    const cargarDatos = async () => {
      if (isAuthenticated && authUser?.id && token) {
        try {
          // Cargar datos del usuario en paralelo con las publicaciones
          const [usuarioCompleto, publicacionesData] = await Promise.all([
            obtenerUsuarioPorId(authUser.id, token),
            obtenerPublicacionesPorUsuario(authUser.id, token)
          ]);

          setUserCompleto(usuarioCompleto);
          
          if (Array.isArray(publicacionesData)) {
            setPublicaciones(publicacionesData);
          } else {
            console.error("La API no devolvió un array:", publicacionesData);
            setPublicaciones([]);
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
          setUserCompleto(authUser); // Usar datos básicos si falla
        } finally {
          setLoading(false);
        }
      }
    };

    cargarDatos();
  }, [isAuthenticated, authUser, token]);

  const handleDeletePublication = (id: number) => {
    setPublicaciones(publicaciones.filter(pub => pub.id !== id));
  };

  const handleEditPublication = (id: number) => {
    console.log("Editar publicación con ID:", id);
  };

  if (!isAuthenticated || !authUser) {
    return (
      <DefaultLayout>
        <div className="home-container">
          <div className="message-container">
            <h2>No has iniciado sesión</h2>
            <p>Por favor, inicia sesión para ver tu información personal.</p>
            <a href="/login" className="login-button">Iniciar Sesión</a>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (loading) {
    return (
      <DefaultLayout>
        <div className="home-container">
          <div className="loading-message">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="home-container">
   
        
        <UserPublicationsSection 
          user={{
            nombre: userCompleto?.nombre || authUser.nombre,
            email: userCompleto?.email || authUser.email || "Sin email",
            telefono: userCompleto?.telefono || "No disponible",
            fotoPerfil: userCompleto?.fotoPerfil || authUser.fotoPerfil,
            nivel: userCompleto?.nivel || authUser.nivel || "Principiante",
            id: userCompleto?.id || authUser.id
          }}
          publicaciones={publicaciones}
          onDeletePublication={handleDeletePublication}
          onEditPublication={handleEditPublication}
        />
      </div>
    </DefaultLayout>
  );
}

export default PerfilSection;