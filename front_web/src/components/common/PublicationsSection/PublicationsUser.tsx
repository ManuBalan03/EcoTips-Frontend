import React, { useEffect, useState } from "react";
import PublicationList from "./PublicationsList";
import './PublicationsUser.css';
import { useAuth } from "../../../api/AuthContext";
import { obtenerPublicacionesPorUsuario } from "../../../api/services/Publications/PublicationUsarioService";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType"; 

const UserPublicationsSection: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth(); 

  const [publicaciones, setPublicaciones] = useState<PublicacionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Función que carga publicaciones
  const cargarDatos = async () => {
    try {
      const publicacionesData = await obtenerPublicacionesPorUsuario(user!.idUsuario, token!);
      if (Array.isArray(publicacionesData)) {
        setPublicaciones(publicacionesData);
      } else {
        console.error("La API no devolvió un array:", publicacionesData);
        setPublicaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Efecto: se ejecuta cuando cambia el usuario o token
  useEffect(() => {
    if (isAuthenticated && user && token) {
      cargarDatos();
    }
  }, [isAuthenticated, user, token]);

  // ⚙️ Handlers (si los necesitas)
  const onDeletePublication = (id: number) => {
    setPublicaciones(prev => prev.filter(pub => pub.id !== id));
  };

  const onEditPublication = (updatedPub: PublicacionDTO) => {
    setPublicaciones(prev =>
      prev.map(pub => (pub.id === updatedPub.id ? updatedPub : pub))
    );
  };

  // 🖥️ Renderizado
  if (loading) return <p className="loanding-publications">Cargando publicaciones...</p>;
 
  if (!publicaciones.length) return <p>No se encontraron publicaciones.</p>;

  return (
    <div className="user-publications-container">
      <div className="publications-section">
        <h3>Publicaciones</h3>
        <PublicationList
          publicaciones={publicaciones}
         user={user}
        />
      </div>
    </div>
  );
};

export default UserPublicationsSection;
