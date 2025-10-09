import React, { useRef } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { useInfiniteScroll } from '../../../api/hooks/useInfiniteScroll';
import { obtenerSolicitudesPendientes } from '../../../api/services/Publications/VotesServices';
import './solicitud.css';

interface Solicitud {
  id: number;
  titulo: string;
  contenido?: string;
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

  // Usamos el hook de scroll infinito
  const { items: solicitudes, hasMore, loading, error, loadMore } = useInfiniteScroll<Solicitud>(
    async (page, size) => {
      if (!token) {
        return { content: [], totalPages: 0, totalElements: 0 };
      }
      //POSIBLE OPTIMIZACION CAMBIO CON OTRA
      const data = await obtenerSolicitudesPendientes(token, "PENDIENTE" ,page, size);
      return { ...data, content: data.content as Solicitud[] };
    }
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="solicitudes-content">
      <h2>Solicitudes de Publicación</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="solicitudes-list">
        {solicitudes.length === 0 && !loading ? (
          <div className="empty-message">No hay solicitudes pendientes</div>
        ) : (
          solicitudes.map((solicitud, index) => {
            const isLast = index === solicitudes.length - 1;
            return (
              <div
                key={solicitud.id}
                ref={isLast ? lastElementRef : null}
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
            );
          })
        )}
      </div>

      {loading && <p>Cargando más...</p>}
      {!hasMore && solicitudes.length > 0 && <p>No hay más solicitudes</p>}
    </div>
  );
};

export default SolicitudesList;
