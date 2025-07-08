import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { obtenerSolicitudesPendientes } from '../../../api/services/Publications/VotesServices';
import './solicitud.css';

interface Solicitud {
  id: number;
  titulo: string;
  descripcion?: string;
  fechaCreacion?: string;
  nombreAutor?: string;
  fotoPerfil?: string;
  estado?: string;
}

interface SolicitudesListProps {
  onSelectSolicitud: (id: number) => void;
}

const SolicitudesList: React.FC<SolicitudesListProps> = ({ onSelectSolicitud }) => {
  const { token } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await obtenerSolicitudesPendientes(token);
        setSolicitudes(data);
      } catch (err) {
        console.error("Error al cargar solicitudes:", err);
        setError("No se pudieron cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitudes();
  }, [token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="loading-message">
        <div className="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="solicitudes-content">
      <h2>Solicitudes de Publicación</h2>
      
      <div className="solicitudes-list">
        {solicitudes.length === 0 ? (
          <div className="empty-message">
            No hay solicitudes pendientes
          </div>
        ) : (
          <>
            {solicitudes.slice(0, visibleCount).map(solicitud => (
              <div 
                key={solicitud.id} 
                className="solicitud-item"
                onClick={() => onSelectSolicitud(solicitud.id)}
              >
               <div className="user-info-container">
  <div className="avatar-container">
    {solicitud.fotoPerfil ? (
      <img src={solicitud.fotoPerfil} alt={solicitud.nombreAutor || 'Usuario'} />
    ) : (
      <span className="avatar-initial">
         {solicitud.nombreAutor?.charAt(0).toUpperCase() || 'U'}
      </span>
    )}
  </div>
  
  <div className="user-text-info">
    <p className="user-name">{solicitud.nombreAutor || 'Usuario'}</p>
    <p className="post-date">{formatDate(solicitud.fechaCreacion)}</p>
  </div>
</div>
                <div className="post-data">
                   <h3>{solicitud.titulo}</h3>
                <p>{solicitud.descripcion || 'Sin descripción'}</p>
                </div>
               
                
                {solicitud.estado && (
                  <div className={`solicitud-status ${solicitud.estado.toLowerCase()}`}>
                    {solicitud.estado}
                  </div>
                )}
              </div>
            ))}
           
            {solicitudes.length > visibleCount && (
              <button 
                className="load-more-btn"
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                Ver más solicitudes
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SolicitudesList;