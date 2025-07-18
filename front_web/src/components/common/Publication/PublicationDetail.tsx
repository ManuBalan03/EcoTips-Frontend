import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import { 
  PublicacionDTO,
  obtenerComentariosPorPublicacion,
  crearComentario,
  ComentarioDTO,
  contarReaccionesPorTipo,
  agregarReaccion,
  eliminarReaccion
} from '../../../api/services/PublicacionesService';
import './Publication.css';

interface DetailsPublicationProps {
  publicacionId: number;
  onBack?: () => void;
}

const DetailsPublication: React.FC<DetailsPublicationProps> = ({ publicacionId, onBack }) => {
  const { user, token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioDTO[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reacciones, setReacciones] = useState<{[tipo: string]: number}>({});
  const [miReaccion, setMiReaccion] = useState<string | null>(null);

  // Cargar datos de la publicación
  useEffect(() => {
    const cargarDatos = async () => {
      if (!token || !publicacionId) {
        setError('No hay token o ID de publicación');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 1. Obtener publicación
        const pubResponse = await fetch(`http://localhost:8082/api/publicaciones/${publicacionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!pubResponse.ok) {
          throw new Error(`Error al obtener publicación: ${pubResponse.status}`);
        }

        const pubData = await pubResponse.json();
        
        if (!pubData) {
          throw new Error('No se recibieron datos de la publicación');
        }

        setPublicacion(pubData);

        // 2. Obtener comentarios
        try {
          const comentariosData = await obtenerComentariosPorPublicacion(publicacionId, token);
          setComentarios(comentariosData || []);
        } catch (err) {
          console.error("Error al cargar comentarios:", err);
          setComentarios([]);
        }

        // 3. Obtener reacciones
        try {
          const reaccionesData = await contarReaccionesPorTipo(publicacionId, token);
          setReacciones(reaccionesData || {});
        } catch (err) {
          console.error("Error al cargar reacciones:", err);
          setReacciones({});
        }

        // 4. Obtener reacción del usuario actual (si existe)
        // Implementar según tu API

      } catch (err) {
        console.error("Error en cargarDatos:", err);
       
        setPublicacion(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [publicacionId, token]);

  const handleEnviarComentario = async () => {
    if (!user?.id || !token || !publicacionId || !nuevoComentario.trim()) return;
    
    try {
      const comentarioData = {
        idPublicacion: publicacionId,
        idUsuario: user.id,
        contenido: nuevoComentario,
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil
      };

      const comentarioCreado = await crearComentario(comentarioData, token);
      setComentarios(prev => [comentarioCreado, ...prev]);
      setNuevoComentario('');
      
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("Error al enviar el comentario. Intente nuevamente.");
    }
  };

  const handleReaccion = async (tipo: string) => {
    if (!user?.id || !token || !publicacionId) return;
    
    try {
      // Si ya reaccionó con este tipo, eliminar la reacción
      if (miReaccion === tipo) {
        // Necesitarías implementar un servicio para obtener el ID de la reacción del usuario
        // await eliminarReaccion(reaccionId, token);
        setReacciones(prev => ({
          ...prev,
          [tipo]: (prev[tipo] || 0) - 1
        }));
        setMiReaccion(null);
      } 
      // Si ya reaccionó pero con otro tipo, cambiar la reacción
      else if (miReaccion) {
        // Implementar lógica para cambiar reacción
        setReacciones(prev => ({
          ...prev,
          [miReaccion]: (prev[miReaccion] || 0) - 1,
          [tipo]: (prev[tipo] || 0) + 1
        }));
        setMiReaccion(tipo);
      }
      // Si no ha reaccionado, agregar nueva reacción
      else {
        await agregarReaccion({
          idPublicacion: publicacionId,
          idUsuario: user.id,
          Tipo: tipo
        }, token);
        
        setReacciones(prev => ({
          ...prev,
          [tipo]: (prev[tipo] || 0) + 1
        }));
        setMiReaccion(tipo);
      }
    } catch (err) {
      console.error("Error al manejar reacción:", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando publicación...</p>
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
        No se encontró la publicación solicitada
      </div>
    );
  }

  return (
    <div className="details-publication-container">
      {onBack && (
        <button onClick={onBack} className="back-button">
          ← Volver
        </button>
      )}

      <div className="publication-header">
        <h1 className="publication-title">{publicacion.titulo}</h1>
        <div className="publication-meta">
          <span className="author">Publicado por: {publicacion.nombreAutor || 'admin'}</span>
          {publicacion.fechaCreacion && (
            <span className="date">{formatDate(publicacion.fechaCreacion)}</span>
          )}
        </div>
      </div>

      <div className="publication-content">
        {publicacion.descripcion && (
          <p className="publication-description">{publicacion.descripcion}</p>
        )}
        
        {publicacion.contenido && (
          <div className="publication-image-container">
            <img 
              src={publicacion.contenido} 
              alt={publicacion.titulo} 
              className="publication-image"
            />
          </div>
        )}
      </div>

      <div className="publication-actions">
        <button 
          className={`like-button ${miReaccion === 'LIKE' ? 'active' : ''}`}
          onClick={() => handleReaccion('LIKE')}
        >
          👍 Me gusta {reacciones['LIKE'] || 0}
        </button>
        <span className="comments-count">
          💬 Comentarios {comentarios.length}
        </span>
      </div>

      <div className="comments-section">
        <h3>Comentarios</h3>
        
        <div className="new-comment">
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={3}
            className="comment-input"
          />
          <button
            onClick={handleEnviarComentario}
            className="comment-submit-button"
            disabled={!nuevoComentario.trim()}
          >
            Publicar
          </button>
        </div>

        <div className="comments-list">
          {comentarios.length === 0 ? (
            <p className="no-comments">No hay comentarios aún</p>
          ) : (
            comentarios.map(comentario => (
              <div key={comentario.idcomentario} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {comentario.nombreAutor || 'Usuario'}
                  </span>
                  <span className="comment-date">
                    {formatDate(comentario.fechaCreacion)}
                  </span>
                </div>
                <p className="comment-content">{comentario.contenido}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPublication;