import { useState, useCallback } from 'react';
import { useComentarios } from './useComents';
import { useReacciones } from './useReactions';

export const useCommentSection = (idPublicacion: number, token: string | null, user: any) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Usar nuestros hooks personalizados
  const {
    comentarios,
    loading: loadingComentarios,
    error: errorComentarios,
    cargarComentarios,
    crearComentario: crearComentarioService
  } = useComentarios(token!);

  const {
    reactions,
    reactionCounts,
    processingReaction,
    loadReactions,
    loadReactionCounts,
    handleReaction
  } = useReacciones(token);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (showComments) {
      await cargarComentarios(idPublicacion);
    }
    await loadReactions(idPublicacion);
    await loadReactionCounts(idPublicacion);
  }, [idPublicacion, showComments, cargarComentarios, loadReactions, loadReactionCounts]);

  // Manejar envío de comentario
  const handleSubmitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user?.idUsuario || !token) return;

    try {
      const comentario = await crearComentarioService({
        idPublicacion,
        idUsuario: user.idUsuario,
        contenido: newComment.trim(),
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil
      });

      setNewComment("");
      return comentario;
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      throw error;
    }
  }, [newComment, user, token, idPublicacion, crearComentarioService]);

  // Manejar reacción
  const handleReactionClick = useCallback(async (tipo: string) => {
    if (!user?.idUsuario) return;
    
    try {
      await handleReaction(idPublicacion, user.idUsuario, tipo, user.nombre);
      return true;
    } catch (error) {
      console.error("Error en reacción:", error);
      throw error;
    }
  }, [user, idPublicacion, handleReaction]);

  return {
    // Estados
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
    
    // Funciones
    loadInitialData,
    handleSubmitComment,
    handleReactionClick
  };
};