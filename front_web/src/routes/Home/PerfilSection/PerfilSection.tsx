import React, { useState, useEffect } from "react";
import { useAuth } from "../../../api/AuthContext";
import DefaultLayout from "../../../components/layout/NavMainLayout";
import UserPublicationsSection from "../../../components/common/PublicationsSection/PublicationsUser";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";
import { obtenerPublicacionesPorUsuario } from "../../../api/services/Publications/PublicationUsarioService";
import { obtenerUsuarioPorId } from "../../../api/services/UserService";
import { UsuarioDTO } from "../../../api/types/UserTypes";
import './PerfilSection.css'

function PerfilSection() {
  const { user, isAuthenticated, token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionDTO[]>([]);
  const [userCompleto, setUserCompleto] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("Montando componente");
  console.log("Estado de useAuth:", { user, isAuthenticated, token });

  // Cargar datos completos del usuario y sus publicaciones
useEffect(() => {
  // console.log("Entrando al useEffect con:", { isAuthenticated, user?.idUsuario , token });

  const cargarDatos = async () => {
    try {
      console.log("Ejecutando cargarDatos...");
      const [usuarioCompleto, publicacionesData] = await Promise.all([
        obtenerUsuarioPorId(user!.idUsuario, token!),
        obtenerPublicacionesPorUsuario(user!.idUsuario, token!)
      ]);

      console.log("Publicaciones recibidas:", publicacionesData);
      setUserCompleto(usuarioCompleto);

      if (Array.isArray(publicacionesData)) {
        setPublicaciones(publicacionesData);
      } else {
        console.error("La API no devolvió un array:", publicacionesData);
        setPublicaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setUserCompleto(user || null);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.idUsuario && token) {
    console.log("Sí hay user/token, cargando datos...");
    cargarDatos();
  } else {
    console.log("No hay user/token todavía, esperando...");
  }
}, [isAuthenticated, user, token]);

  const handleDeletePublication = (id: number) => {
    setPublicaciones(publicaciones.filter(pub => pub.id !== id));
  };

  const handleEditPublication = (id: number) => {
    console.log("Editar publicación con ID:", id);
  };

  if (!isAuthenticated || !user) {
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
            nombre: userCompleto?.nombre || user.nombre,
            email: userCompleto?.email || user.email || "Sin email",
            telefono: userCompleto?.telefono || "No disponible",
            fotoPerfil: userCompleto?.fotoPerfil || user.fotoPerfil,
            nivel: userCompleto?.nivel || user.nivel || "Principiante",
            idUsuario: userCompleto?.idUsuario || user.idUsuario
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