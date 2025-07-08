import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { crearEvaluacion, obtenerEvaluacionPorId } from '../../../api/services/Publications/EvaluateServices';
import { obtenerVotosPorPublicacion, VotosDTO } from '../../../api/services/Publications/VotesServices';
import './Evaluation.css';

interface EvaluacionDetailProps {
  evaluacionId: number;
  onBack: () => void;
}

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

// Tipo para los veredictos posibles
type Veredicto = 'APROBADA' | 'RECHAZADA' | 'MODIFICACION';

const EvaluacionDetail: React.FC<EvaluacionDetailProps> = ({ evaluacionId, onBack }) => {
  const { user, token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [votos, setVotos] = useState<VotosDTO[]>([]);
  const [comentario, setComentario] = useState('');
  const [veredicto, setVeredicto] = useState<Veredicto | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVotos, setLoadingVotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles de la publicación y votos
  useEffect(() => {
    const cargarDetalles = async () => {
      if (!token || !evaluacionId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [publicacionData, votosData] = await Promise.all([
          obtenerEvaluacionPorId(evaluacionId, token),
          obtenerVotosPorPublicacion(evaluacionId, token)
        ]);
        
        setPublicacion(publicacionData);
        setVotos(votosData);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError("No se pudieron cargar los detalles de la evaluación");
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [evaluacionId, token]);

  const handleEnviarEvaluacion = async () => {
    if (!user?.id || !token || !veredicto || submitting || !publicacion) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const evaluacionData = {
        veredicto,
        comentario_final: comentario,
        idpublicacion: publicacion.id,
        idUsuario: user.id,
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil,
        fecha_evaluacion: new Date().toISOString()
      };

      await crearEvaluacion(evaluacionData, token);
      
      // Recargar los votos después de enviar
      const votosActualizados = await obtenerVotosPorPublicacion(evaluacionId, token);
      setVotos(votosActualizados);
      
      onBack(); // Volver a la lista después de enviar
      
    } catch (err) {
      console.error("Error al enviar evaluación:", err);
      setError("Error al enviar la evaluación. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerIniciales = (nombre?: string): string => {
    if (!nombre) return 'U';
    return nombre.charAt(0).toUpperCase();
  };

  const obtenerIconoVeredicto = (veredicto: Veredicto) => {
    switch(veredicto) {
      case 'APROBADA': return '👍';
      case 'RECHAZADA': return '👎';
      case 'MODIFICACION': return '✏️';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando detalles...</p>
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

  if (!publicacion) {
    return (
      <div className="empty-message">
        No se encontró la evaluación solicitada
      </div>
    );
  }

  return (
    <div className="evaluation-detail-container">
      <button onClick={onBack} className="back-button">
        ← Volver a la lista
      </button>

      <div className="evaluation-header">
        <div className="evaluacion-avatar">
          {publicacion.fotoPerfil ? (
            <img src={publicacion.fotoPerfil} alt={publicacion.nombreAutor || 'Autor'} />
          ) : (
            <div className="avatar-initial">
              {obtenerIniciales(publicacion.nombreAutor)}
            </div>
          )}
        </div>
        <h1>{publicacion.titulo}</h1>
        <div className="evaluation-meta">
          <span className="author">{publicacion.nombreAutor || 'Usuario'}</span>
          <span className="date">{formatDate(publicacion.fechaCreacion)}</span>
        </div>
      </div>

      <div className="evaluation-content">
        <section className="description-section">
          <h2>Descripción</h2>
          <p>{publicacion.descripcion || 'Sin descripción'}</p>
        </section>

        <section className="content-section">
          <h2>Contenido</h2>
          {publicacion.contenido ? (
            <div className="content-display">
              <img src={publicacion.contenido} alt="Contenido de la publicación" />
            </div>
          ) : (
            <p>No hay contenido adjunto</p>
          )}
        </section>

        <section className="votes-section">
          <h2>Votos ({votos.length})</h2>
          {votos.length === 0 ? (
            <p className="no-votes">Aún no hay votos registrados</p>
          ) : (
            <div className="votes-list">
              {votos.map((voto) => (
                <div key={voto.idVotos} className="vote-item">
                  <div className="vote-avatar">
                    {voto.fotoPerfil ? (
                      <img src={voto.fotoPerfil} alt={voto.nombreAutor || 'Usuario'} />
                    ) : (
                      <div className="avatar-initial-small">
                        {obtenerIniciales(voto.nombreAutor)}
                      </div>
                    )}
                  </div>
                  <div className="vote-details">
                    <div className="vote-header">
                      <span className="vote-author">{voto.nombreAutor || 'Usuario'}</span>
                      <span className={`vote-decision ${voto.Voto?.toLowerCase()}`}>
                        {obtenerIconoVeredicto(voto.Voto as Veredicto)} {voto.Voto}
                      </span>
                    </div>
                    {voto.Comentario && (
                      <p className="vote-comment">{voto.Comentario}</p>
                    )}
                    <span className="vote-date">
                      {voto.fechaVoto ? formatDate(voto.fechaVoto) : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="evaluation-form">
          <h2>Tu evaluación</h2>
          <div className="veredict-options">
            <label className="veredict-option">
              <input
                type="radio"
                name="veredicto"
                checked={veredicto === 'APROBADA'}
                onChange={() => setVeredicto('APROBADA')}
              />
              <span>👍 Aprobar</span>
            </label>
            <label className="veredict-option">
              <input
                type="radio"
                name="veredicto"
                checked={veredicto === 'RECHAZADA'}
                onChange={() => setVeredicto('RECHAZADA')}
              />
              <span>👎 Rechazar</span>
            </label>
            <label className="veredict-option">
              <input
                type="radio"
                name="veredicto"
                checked={veredicto === 'MODIFICACION'}
                onChange={() => setVeredicto('MODIFICACION')}
              />
              <span>✏️ Requiere modificaciones</span>
            </label>
          </div>

          <div className="comment-section">
            <label>Comentario (Obligatorio)</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Explica tu decisión..."
              rows={3}
            />
          </div>

          <button
            onClick={handleEnviarEvaluacion}
            className="submit-button"
            disabled={!veredicto || submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Voto'}
          </button>

          {error && <p className="error-message">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default EvaluacionDetail;