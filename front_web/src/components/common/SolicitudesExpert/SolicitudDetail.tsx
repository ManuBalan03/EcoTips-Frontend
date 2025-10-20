import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { 
  obtenerSolicitudPorId,
  obtenerVotosPorPublicacion,
  enviarVoto,
  VotosDTO
} from '../../../api/services/Publications/VotesServices';
import './solicitud.css';

import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";

interface SolicitudDetailProps {
  solicitudId: number;
  onBack: () => void;
}

const SolicitudDetail: React.FC<SolicitudDetailProps> = ({ solicitudId, onBack }) => {
  const { user, token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [votos, setVotos] = useState<VotosDTO[]>([]);
  const [comentario, setComentario] = useState('');
  const [decision, setDecision] = useState<'ACUERDO' | 'EN_DESACUERDO' | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votoEnviado, setVotoEnviado] = useState(false); // Nuevo estado para controlar redirección

  useEffect(() => {
    const cargarDetalles = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const solicitudData = await obtenerSolicitudPorId(solicitudId, token);
        setPublicacion(solicitudData);
        
        const votosData = await obtenerVotosPorPublicacion(solicitudId, token);
        setVotos(votosData);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError("No se pudieron cargar los detalles de la solicitud");
      } finally {
        setLoading(false);
      }
    };

    cargarDetalles();
  }, [solicitudId, token]);

  // Efecto para redirigir después de enviar voto
  useEffect(() => {
    if (votoEnviado) {
      onBack(); // Llama a la función para volver atrás
    }
  }, [votoEnviado, onBack]);

  const handleEnviarVoto = async () => {
    if (!user?.idUsuario || !token || !decision || submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const votoData = {
        Voto: decision,
        Comentario: comentario,
        idUsuario: user.idUsuario,
        idPublicacion: solicitudId,
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil
      };

      await enviarVoto(votoData, token);
      
      // Actualizar la lista de votos
      const updatedVotos = await obtenerVotosPorPublicacion(solicitudId, token);
      setVotos(updatedVotos);
      
      // Limpiar formulario
      setComentario('');
      setDecision(null);
      
      // Marcar que el voto fue enviado para redirigir
      setVotoEnviado(true);
      
    } catch (err) {
      console.error("Error al enviar voto:", err);
      setError("Error al enviar el voto. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  const obtenerIniciales = (nombre?: string): string => {
    if (!nombre) return 'U';
    return nombre.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-message">
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
        No se encontró la solicitud solicitada
      </div>
    );
  }

  return (
    <div className="solicitud-detail">
      <button onClick={onBack} className="back-button">
      Volver a la lista
      </button>
      
      <div className="solicitud-header">
        <div className="solicitud-avatar">
          {publicacion ? (
            <img src={publicacion.fotoPerfil} alt={publicacion.nombreAutor || 'Autor'} />
          ) : (
            <div className="avatar-initial">
              {obtenerIniciales(publicacion.nombreAutor)}
            </div>
          )}
        </div>
        <div className="solicitud-meta">
          <h2>{publicacion.titulo}</h2>
          <p className="solicitud-author">{publicacion.nombreAutor || 'Usuario'}</p>
          <p className="solicitud-date">{formatDate(publicacion.fechaCreacion)}</p>
        </div>
      </div>
      
      <div className="solicitud-content">
        <h3>Descripción</h3>
        <p>{publicacion.descripcion || 'Sin descripción'}</p>
        
        {publicacion.url_key && (
          <>
            <h3>Contenido</h3>
            <div className="solicitud-image-container">
              <img src={publicacion.url_key} alt="Contenido de la publicación" />
            </div>
          </>
        )}
      </div>
      
      <div className="votos-section">
        <h3>Votos ({votos.length})</h3>
        
        {votos.length === 0 ? (
          <p className="no-votos">Aún no hay votos registrados</p>
        ) : (
          <ul className="votos-list">
            {votos.map(voto => (
              <li key={voto.idVotos || Math.random()} className="voto-item">
                <div className="voto-avatar">
                  {voto.fotoPerfil ? (
                    <img src={voto.fotoPerfil} alt={voto.nombreAutor || 'Avatar'} />
                  ) : (
                    <div className="avatar-initial">
                      {obtenerIniciales(voto.nombreAutor)}
                    </div>
                  )}
                </div>
                <div className="voto-info">
                  <span className="voto-author">{voto.nombreAutor || 'Usuario'}</span>
                  <span className={`voto-decision ${voto.Voto?.toLowerCase()}`}>
                    {voto.Voto === 'ACUERDO' ? '👍 Aceptado' : '👎 Rechazado'}
                  </span>
                  {voto.Comentario && (
                    <p className="voto-comment">{voto.Comentario}</p>
                  )}
                  <span className="voto-date">
                    {voto.fechaVoto ? formatDate(voto.fechaVoto) : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {user?.nivel !== 'nivel 0' && (  
        <div className="voto-form">
          <h3>Tu evaluación</h3>
          
          <div className="voto-options">
            <button
              className={`voto-btn ${decision === 'ACUERDO' ? 'active' : ''}`}
              onClick={() => setDecision('ACUERDO')}
            >
              👍 Aceptar
            </button>
            <button
              className={`voto-btn ${decision === 'EN_DESACUERDO' ? 'active' : ''}`}
              onClick={() => setDecision('EN_DESACUERDO')}
            >
              👎 Rechazar
            </button>
          </div>
          
          <div className="voto-comment-input">
            <label>Comentario (opcional)</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Explica tu decisión..."
              rows={3}
            />
          </div>
          
          <button
            onClick={handleEnviarVoto}
            className="submit-btn"
            disabled={!decision || submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Voto'}
          </button>
          
          {error && <p className="form-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default SolicitudDetail;