import React, { useRef } from 'react';
import { listarEvaluaciones } from '../../../api/services/Publications/EvaluateServices';
import { useInfiniteScroll } from '../../../api/hooks/useInfiniteScroll';
import { useAuth } from '../../../api/AuthContext';
import './Evaluation.css';

interface PublicacionDTO {
  id: number;
  titulo: string;
  contenido?: string;
  descripcion?: string;
  estado?: string;
  fechaCreacion?: string;
  nombreAutor?: string;
  fotoPerfil?: string;
}

interface EvaluationListProps {
  onSelectEvaluacion: (id: number) => void;
}

const EvaluationList: React.FC<EvaluationListProps> = ({ onSelectEvaluacion }) => {
  const { token } = useAuth();

  const { items: evaluaciones, hasMore, loading, error, loadMore } = useInfiniteScroll(
    async (page, size) => {
      if (!token) return { content: [], totalPages: 0, totalElements: 0, number: 0, size: 0, last: true };
      const data = await listarEvaluaciones(token, 'PENDIENTE', page, size);
      return { ...data, content: data.content as PublicacionDTO[] };
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIniciales = (nombre?: string) => {
    if (!nombre) return 'U';
    return nombre.charAt(0).toUpperCase();
  };

  return (
    <div className="notifications-container">
      <h1>Evaluaciones Pendientes</h1>

      {evaluaciones.length === 0 && !loading ? (
        <div className="empty-notification">
          No se encontraron evaluaciones
        </div>
      ) : (
        <div className="notification-list">
          {evaluaciones.map((eva, index) => {
            const isLast = evaluaciones.length === index + 1;
            return (
              <div
                key={eva.id}
                ref={isLast ? lastElementRef : null}
                className="notification-item"
                onClick={() => onSelectEvaluacion(eva.id)}
              >
                <div className="notification-header">
                  <div className="notification-avatar">
                    {eva.fotoPerfil ? (
                      <img src={eva.fotoPerfil} alt={eva.nombreAutor || 'Autor'} />
                    ) : (
                      <div className="avatar-initial">
                        {obtenerIniciales(eva.nombreAutor)}
                      </div>
                    )}
                  </div>
                  <div className="notification-user-info">
                    <span className="notification-author">{eva.nombreAutor || 'Usuario'}</span>
                    <span className="notification-date">{formatDate(eva.fechaCreacion)}</span>
                  </div>
                </div>

                <div className="notification-content">
                  <strong>{eva.titulo}</strong>
                  <p>{eva.descripcion || ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && <p>Cargando más...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!hasMore && evaluaciones.length > 0 && <p>No hay más datos</p>}
    </div>
  );
};

export default EvaluationList;
