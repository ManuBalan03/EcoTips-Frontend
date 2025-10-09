import React, { useState, useEffect } from "react";
import { useAuth } from "../../../api/AuthContext";

import {
  obtenerComentariosPorPublicacion,
} from "../../../api/services/Publications/CommentServices";

import {
  contarReaccionesPorTipo,
} from "../../../api/services/Publications/ReactionsServices";

import {
  obtenerPublicacionPorId,
} from "../../../api/services/Publications/PublicacionesService";

import { ComentarioDTO, PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";

import "../../home/EcoTipCard.css";
import "./Publication.css";

import CommentSection from "../CommentComponent";

interface DetailsPublicationProps {
  publicacionId: number;
  onBack?: () => void;
}

const DetailsPublication: React.FC<DetailsPublicationProps> = ({ publicacionId, onBack }) => {
  const { token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioDTO[]>([]);
  const [reacciones, setReacciones] = useState<{ [tipo: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la publicación
  useEffect(() => {
    const cargarDatos = async () => {
      if (!token || !publicacionId) {
        setError("No hay token o ID de publicación");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Obtener publicación desde servicio centralizado
        const pubData = await obtenerPublicacionPorId(publicacionId, token);
        
        setPublicacion(pubData);

        // 2️⃣ Obtener comentarios
        try {
          const comentariosData = await obtenerComentariosPorPublicacion(publicacionId, token);
          setComentarios(comentariosData || []);
        } catch (err) {
          console.error("Error al cargar comentarios:", err);
          setComentarios([]);
        }

        // 3️⃣ Obtener reacciones
        try {
          const reaccionesData = await contarReaccionesPorTipo(publicacionId, token);
          setReacciones(reaccionesData || {});
        } catch (err) {
          console.error("Error al cargar reacciones:", err);
          setReacciones({});
        }

      } catch (err) {
        console.error("❌ Error en cargarDatos:", err);
        setPublicacion(null);
        setError("No se pudo cargar la publicación");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [publicacionId, token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <span className="author-info">
          Publicado por: {publicacion.nombreAutor || "admin"}
        </span>
        {publicacion.fechaCreacion && (
          <span className="date">{formatDate(publicacion.fechaCreacion)}</span>
        )}
      </div>

      <CommentSection
        idPublicacion={publicacion.id ?? 0}
        onCommentAdded={() => console.log("Comentario agregado")}
        onReactionUpdated={() => console.log("Reacción actualizada")}
      />
    </div>
  );
};

export default DetailsPublication;
