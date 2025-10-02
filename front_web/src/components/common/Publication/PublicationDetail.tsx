import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';

import {
  obtenerComentariosPorPublicacion,
  crearComentario
} from "../../../api/services/Publications/CommentServices";

import {
  contarReaccionesPorTipo, agregarReaccion
} from "../../../api/services/Publications/ReactionsServices";

import {  ComentarioDTO, PublicacionDTO} from "../../../api/services/Publications/Types/PublicationType"

import '../../home/EcoTipCard.css';
import './Publication.css';

import CommentSection  from '../CommentComponent';
import '../CommentComponent'

interface DetailsPublicationProps {
  publicacionId: number;
  onBack?: () => void;
}

const DetailsPublication: React.FC<DetailsPublicationProps> = ({ publicacionId, onBack }) => {
  const { user, token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  // const [publicacion, setPublicacion] = useState<PublicacionDTO []>([]);
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
    if (!user?.idUsuario || !token || !publicacionId || !nuevoComentario.trim()) return;
    
    try {
      const comentarioData = {
        idPublicacion: publicacionId,
        idUsuario: user.idUsuario,
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
    if (!user?.idUsuario || !token || !publicacionId) return;
    
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
          idUsuario: user.idUsuario,
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
    <div className="tip-card">
      {onBack && (
        <button onClick={onBack} className="back-button">
          ← Volver
        </button>
      )}

      
        <h4 className="publication-title">{publicacion.titulo}</h4>

        {publicacion.url_key && (
            <img 
              src={publicacion.url_key} 
              alt={publicacion.titulo} 
              className="tip-image"
            />
        )}
        

         <div className="tags-container">
        {publicacion.descripcion && (
          <span className="tag">{publicacion.descripcion}</span>
        )}
        
        
      </div>
        <div className="publication-meta">
          <span className="author-info">Publicado por: {publicacion.nombreAutor || 'admin'}</span>
          {publicacion.fechaCreacion && (
            <span className="date">{formatDate(publicacion.fechaCreacion)}</span>
          )}
        </div>
    

     



      


<CommentSection 
  idPublicacion={publicacion?.id ?? 0} // Usa 0 o un valor por defecto
  onCommentAdded={() => console.log("Comentario agregado")}
  onReactionUpdated={() => console.log("Reacción actualizada")}
/>

  
    </div>

                    

  );
};

export default DetailsPublication;