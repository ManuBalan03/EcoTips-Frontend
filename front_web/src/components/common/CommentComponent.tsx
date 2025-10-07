import { useEffect } from "react";
import { useAuth } from "../../api/AuthContext";
import { useCommentSection } from "../../api/hooks/CommentSection/UseCommentSection";
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
  
  const {
    comentarios,
    reactions,
    reactionCounts,
    newComment,
    setNewComment,
    showReactions,
    setShowReactions,
    showComments,
    setShowComments,
    loadingComentarios,
    errorComentarios,
    processingReaction,
    loadInitialData,
    handleSubmitComment,
    handleReactionClick
  } = useCommentSection(idPublicacion, token, user);

  // Cargar datos cuando cambien las dependencias
  useEffect(() => {
    loadInitialData();
  }, [idPublicacion, showComments, loadInitialData]);

  // Reacción types para UI
  const reactionTypes = [
    { type: "LIKE", emoji: "👍", label: "Me gusta" },
    { type: "ME_ENCANTA", emoji: "❤️", label: "Me encanta" },
    { type: "INTERESANTE", emoji: "😮", label: "Sorprendido" },
    { type: "TRISTE", emoji: "😢", label: "Triste" },
  ];

  // Buscar la reacción actual del usuario
  const userReaction = reactions.find(r => r.idUsuario === user?.idUsuario);
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  const currentReactionType = userReaction ? 
    reactionTypes.find(r => r.type === userReaction.Tipo) : null;

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
                    onClick={() => handleReactionClick(reaction.type)
                      .then(() => onReactionUpdated?.())
                      .catch(() => {})}
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
            💬 {comentarios.length > 0 ? comentarios.length : ''} Comentarios
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      {showComments && (
        <>
          {loadingComentarios ? (
            <div className="loading-comments">Cargando comentarios...</div>
          ) : errorComentarios ? (
            <div className="error-comments">Error al cargar comentarios</div>
          ) : (
            <div className="comments-list">
              {comentarios.map(comment => (
                <div key={comment.idcomentario || Math.random()} className="comment-item">
                  <div className="comment-avatar">
                    {comment.fotoPerfil ? (
                      <img
                        src={comment.fotoPerfil}
                        alt={comment.nombreAutor || 'Avatar'}
                        className="avatar-image"
                      />
                    ) : (
                      comment.nombreAutor?.charAt(0).toUpperCase() || 'U'
                    )}
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
          <form onSubmit={(e) => handleSubmitComment(e)
            .then(() => onCommentAdded?.())
            .catch(() => {})} 
            className="comment-form"
          >
            <div className="comment-avatar">
              {user?.fotoPerfil ? (
                <img src={user.fotoPerfil} alt="Avatar" />
              ) : (
                user?.nombre?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="comment-input"
              required
            />
            
            <button 
              type="submit" 
              className="comment-submit"
              disabled={!newComment.trim()}
            >
              Publicar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CommentSection;