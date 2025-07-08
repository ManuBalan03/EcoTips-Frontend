import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { crearEvaluacion, listarEvaluaciones } from '../../../api/services/Publications/EvaluateServices';
import './Evaluation.css';
import { EvaluacionDTO } from '../../../api/services/Publications/Types/EvaluationType';

interface PublicacionDTO {
  id: number;
  titulo: string;
  contenido: string;
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
  const { user, token } = useAuth();
  const [evaluaciones, setEvaluaciones] = useState<PublicacionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEvaluaciones = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await listarEvaluaciones(token);
        setEvaluaciones(data);
      } catch (err) {
        console.error("Error al cargar evaluaciones:", err);
        setError("No se pudieron cargar las evaluaciones pendientes");
      } finally {
        setLoading(false);
      }
    };

    cargarEvaluaciones();
  }, [token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIniciales = (nombre?: string): string => {
    if (!nombre) return 'U';
    return nombre.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando evaluaciones...</p>
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
    <div className="notifications-container">
      <h1>Evaluaciones Pendientes</h1>

      {evaluaciones.length === 0 ? (
        <div className="empty-notification">
          No se encontró la evaluacion solicitada
        </div>
      ) : (
        <div className="notification-list">
          {evaluaciones.map(evaluacion => (
            <div 
              key={evaluacion.id} 
              className="notification-item"
              onClick={() => onSelectEvaluacion(evaluacion.id)}
            >
              <div className="notification-header">
                <div className="notification-avatar">
                  {evaluacion.fotoPerfil ? (
                    <img src={evaluacion.fotoPerfil} alt={evaluacion.nombreAutor || 'Autor'} />
                  ) : (
                    <div className="avatar-initial">
                      {obtenerIniciales(evaluacion.nombreAutor)}
                    </div>
                  )}
                </div>
                <div className="notification-user-info">
                  <span className="notification-author">{evaluacion.nombreAutor || 'Usuario'}</span>
                  <span className="notification-date">{formatDate(evaluacion.fechaCreacion)}</span>
                </div>
              </div>
              
              <div className="notification-content">
                <strong>{evaluacion.titulo}</strong>
                <p>{evaluacion.descripcion || ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationList;