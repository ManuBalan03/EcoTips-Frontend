import { useState, useCallback } from 'react';
import { 
  eliminarReaccion, 
  contarReaccionesPorTipo, 
  obtenerReaccionesPorPublicacion, 
  agregarReaccion 
} from '../../services/Publications/ReactionsServices';
 import {ReactionsDTO} from "../../services/Publications/Types/PublicationType"
export const useReacciones = (token: string | null) => {
  const [reactions, setReactions] = useState<ReactionsDTO[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [processingReaction, setProcessingReaction] = useState(false);

  const loadReactions = useCallback(async (idPublicacion: number) => {
    if (!token) return;
    
    try {
      const reacciones = await obtenerReaccionesPorPublicacion(idPublicacion, token);
      setReactions(reacciones);
    } catch (error) {
      console.error("Error cargando reacciones:", error);
    }
  }, [token]);

  const loadReactionCounts = useCallback(async (idPublicacion: number) => {
    if (!token) return;
    
    try {
      const conteos = await contarReaccionesPorTipo(idPublicacion, token);
      setReactionCounts(conteos);
    } catch (error) {
      console.error("Error cargando conteo de reacciones:", error);
    }
  }, [token]);

  const handleReaction = useCallback(async (idPublicacion: number, userId: number, tipo: string, nombreUsuario: string) => {
    if (!token || processingReaction) return;
    
    setProcessingReaction(true);
    
    try {
      const reaccionExistente = reactions.find(r => r.idUsuario === userId);
      
      if (reaccionExistente) {
        if (reaccionExistente.Tipo === tipo) {
          // Eliminar reacción existente
          await eliminarReaccion(reaccionExistente.idReaccion!, token);
          setReactions(prev => prev.filter(r => r.idUsuario !== userId));
        } else {
          // Cambiar tipo de reacción
          await eliminarReaccion(reaccionExistente.idReaccion!, token);
          const nuevaReaccion = await agregarReaccion({
            idPublicacion,
            idUsuario: userId,
            Tipo: tipo,
            nombreAutor: nombreUsuario
          }, token);
          
          setReactions(prev => 
            prev.map(r => r.idUsuario === userId ? nuevaReaccion : r)
          );
        }
      } else {
        // Crear nueva reacción
        const nuevaReaccion = await agregarReaccion({
          idPublicacion,
          idUsuario: userId,
          Tipo: tipo,
          nombreAutor: nombreUsuario
        }, token);
        
        setReactions(prev => [...prev, nuevaReaccion]);
      }
      
      // Recargar conteos
      await loadReactionCounts(idPublicacion);
      return true;
    } catch (error) {
      console.error("Error procesando reacción:", error);
      // Recargar para mantener consistencia
      await loadReactions(idPublicacion);
      await loadReactionCounts(idPublicacion);
      throw error;
    } finally {
      setProcessingReaction(false);
    }
  }, [token, processingReaction, reactions, loadReactionCounts, loadReactions]);

  return {
    reactions,
    reactionCounts,
    processingReaction,
    loadReactions,
    loadReactionCounts,
    handleReaction
  };
};