import { useState, useEffect } from "react";
import { useAuth } from "../../api/AuthContext";
import {
  ComentarioDTO,
  ReactionsDTO,
  obtenerComentariosPorPublicacion,
  crearComentario,
  obtenerReaccionesPorPublicacion,
  agregarReaccion,
  eliminarReaccion,
  contarReaccionesPorTipo
} from "../../api/services/PublicacionesService";
import './CommentSection.css';

interface CommentSectionProps {
  idPublicacion: number;
  onCommentAdded?: () => void;
  onReactionUpdated?: () => void;
}

const CommentSection = ({
  idPublicacion,
  onCommentAdded,
  onReactionUpdated
}: CommentSectionProps) => {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<ComentarioDTO[]>([]);
  const [reactions, setReactions] = useState<ReactionsDTO[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [newComment, setNewComment] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [processingReaction, setProcessingReaction] = useState(false); // Para evitar múltiples clics

  // Cargar comentarios, reacciones y conteos
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
    loadReactions();
    loadReactionCounts();
  }, [idPublicacion, showComments]);

  const loadComments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const comentarios = await obtenerComentariosPorPublicacion(idPublicacion, token);
      setComments(comentarios);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReactions = async () => {
    if (!token) return;
    try {
      const reacciones = await obtenerReaccionesPorPublicacion(idPublicacion, token);
      setReactions(reacciones);
    } catch (error) {
      console.error("Error cargando reacciones:", error);
    }
  };

  const loadReactionCounts = async () => {
    if (!token) return;
    try {
      const conteos = await contarReaccionesPorTipo(idPublicacion, token);
      setReactionCounts(conteos);
    } catch (error) {
      console.error("Error cargando conteo de reacciones:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Intentando enviar comentario..."); // Debug
    console.log("Datos del usuario:", user); // Debug
    console.log("Token disponible:", !!token); // Debug
    console.log("Contenido del comentario:", newComment); // Debug
    
    if (!newComment.trim()) {
      console.log("Comentario vacío");
      return;
    }
    
    if (!user?.id) {
      console.log("Usuario no válido:", user);
      return;
    }
    
    if (!token) {
      console.log("Token no disponible");
      return;
    }

    setSubmittingComment(true);
    
    try {
      console.log("Enviando comentario con datos:", {
        idPublicacion,
        idUsuario: user.id,
        contenido: newComment.trim(),
        nombreAutor: user.nombre
      });
      
      const comentario = await crearComentario({
        idPublicacion,
        idUsuario: user.id,
        contenido: newComment.trim(),
        nombreAutor: user.nombre
      }, token);
      
      console.log("Comentario creado exitosamente:", comentario);
      
      // Actualizar la lista de comentarios
      setComments(prevComments => [...prevComments, comentario]);
      setNewComment("");
      onCommentAdded?.();
      
      console.log("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error detallado al agregar comentario:", error);
      
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReaction = async (tipo: string) => {
    if (!user?.id || !token || processingReaction) return;
    
    setProcessingReaction(true);
    
    try {
      console.log("=== DEBUG REACCIÓN ===");
      console.log("Tipo de reacción:", tipo);
      console.log("Usuario ID:", user.id);
      console.log("ID Publicación:", idPublicacion);
      
      // Buscar si el usuario ya tiene una reacción en esta publicación
      const reaccionExistente = reactions.find(r => r.idUsuario === user.id);
      console.log("Reacción existente:", reaccionExistente);
      
      if (reaccionExistente) {
        // Si ya tiene una reacción
        if (reaccionExistente.Tipo === tipo) {
          // Si es la misma reacción, eliminarla
          console.log("Eliminando reacción existente del mismo tipo");
          await eliminarReaccion(reaccionExistente.idReaccion!, token);
          
          // Actualizar estado local - remover la reacción del usuario
          setReactions(prev => prev.filter(r => r.idUsuario !== user.id));
          
        } else {
          // Si es diferente, actualizarla (eliminar la anterior y crear nueva)
          console.log("Cambiando tipo de reacción");
          await eliminarReaccion(reaccionExistente.idReaccion!, token);
          
          const nuevaReaccion = await agregarReaccion({
            idPublicacion,
            idUsuario: user.id,
            Tipo: tipo,
            nombreAutor: user.nombre
          }, token);
          
          // Actualizar estado local - reemplazar la reacción del usuario
          setReactions(prev => 
            prev.map(r => r.idUsuario === user.id ? nuevaReaccion : r)
          );
        }
      } else {
        // No tiene reacción, crear nueva
        console.log("Creando nueva reacción");
        const nuevaReaccion = await agregarReaccion({
          idPublicacion,
          idUsuario: user.id,
          Tipo: tipo,
          nombreAutor: user.nombre
        }, token);
        
        // Actualizar estado local - agregar nueva reacción
        setReactions(prev => [...prev, nuevaReaccion]);
      }
      
      // Recargar conteos para mantener sincronización
      await loadReactionCounts();
      onReactionUpdated?.();
      
      console.log("Reacción procesada exitosamente");
      
    } catch (error) {
      console.error("Error procesando reacción:", error);
      
      // En caso de error, recargar todo para mantener consistencia
      await loadReactions();
      await loadReactionCounts();
      
      alert("Error al procesar reacción. Intenta nuevamente.");
    } finally {
      setProcessingReaction(false);
    }
  };

  const reactionTypes = [
    { type: "LIKE", emoji: "👍", label: "Me gusta" },
    { type: "ME_ENCANTA", emoji: "❤️", label: "Me encanta" },
    { type: "INTERESANTE", emoji: "😮", label: "Sorprendido" },
    { type: "TRISTE", emoji: "😢", label: "Triste" }, // Corregido el typo TRSITE -> TRISTE
  ];

  // Buscar la reacción actual del usuario
  const userReaction = reactions.find(r => r.idUsuario === user?.id);
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  
  // Buscar el tipo de reacción del usuario para mostrar el emoji correcto
  const currentReactionType = userReaction ? reactionTypes.find(r => r.type === userReaction.Tipo) : null;

  return (
    <div className="comment-section">
      {/* Sección de reacciones */}
      <div className="reactions-container">
        <div className="reactions-summary">
          {totalReactions > 0 && (
            <div className="reaction-count">
              {totalReactions} {totalReactions === 1 ? "reacción" : "reacciones"}
            </div>
          )}
        </div>
        <div className="reaction-options">
          <button
            className={`reaction-button ${userReaction ? "active" : ""}`}
            onClick={() => setShowReactions(!showReactions)}
            disabled={processingReaction}
          >
            {currentReactionType ? currentReactionType.emoji : "👍"}
            <span>
              {currentReactionType ? currentReactionType.label : "Me gusta"}
            </span>
          </button>
          {showReactions && (
            <div className="reaction-picker">
              {reactionTypes.map(reaction => {
                const isSelected = userReaction?.Tipo === reaction.type;
                return (
                  <button
                    key={reaction.type}
                    className={`reaction-option ${isSelected ? "selected" : ""}`}
                    onClick={() => handleReaction(reaction.type)}
                    title={`${reaction.label} (${reactionCounts[reaction.type] || 0})`}
                    disabled={processingReaction}
                  >
                    {reaction.emoji}
                    <span className="reaction-count-badge">
                      {reactionCounts[reaction.type] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <button 
            className="comment-button"
            onClick={() => setShowComments(!showComments)}
          >
            💬 {comments.length > 0 ? comments.length : ''} Comentarios
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      {showComments && (
        <>
          {loading ? (
            <div className="loading-comments">Cargando comentarios...</div>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.idcomentario || Math.random()} className="comment-item">
                  <div className="comment-avatar">
                    {comment.nombreAutor?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.nombreAutor || 'Usuario'}
                      </span>
                      <span className="comment-time">
                        {comment.fechaCreacion 
                          ? new Date(comment.fechaCreacion).toLocaleString() 
                          : 'Fecha no disponible'}
                      </span>
                    </div>
                    <p className="comment-text">{comment.contenido}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-avatar">
              {user?.nombre?.charAt(0).toUpperCase() || 'T'}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="comment-input"
              disabled={submittingComment}
              required
            />
            <button 
              type="submit" 
              className="comment-submit"
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? "Enviando..." : "Publicar"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CommentSection;