// hooks/useComentarios.ts - EL HOOK
import { useState, useCallback } from 'react';
import {  ComentarioDTO,
  ComentarioCreateDTO,
  PaginatedResponse} from "../../services/Publications/Types/PublicationType"
import {obtenerComentariosPorPublicacion,
  obtenerComentariosPaginados,
  obtenerEstadisticasComentarios,
  crearComentario as crearComentarioService,
  eliminarComentario as eliminarComentarioService,
} from "../../services/Publications/CommentServices"


export const useComentarios = (token: string) => {
  const [comentarios, setComentarios] = useState<ComentarioDTO[]>([]);
  const [comentariosPaginados, setComentariosPaginados] = useState<PaginatedResponse<ComentarioDTO>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 0
  });
  const [estadisticas, setEstadisticas] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarComentarios = useCallback(async (idPublicacion: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerComentariosPorPublicacion(idPublicacion, token);
      setComentarios(data);
    } catch (err) {
      setError('Error al cargar comentarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const cargarComentariosPaginados = useCallback(async (
    idPublicacion: number,
    page: number = 0,
    size: number = 20
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerComentariosPaginados(idPublicacion, token, page, size);
      setComentariosPaginados(data);
    } catch (err) {
      setError('Error al cargar comentarios paginados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const cargarEstadisticas = useCallback(async (idPublicacion: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerEstadisticasComentarios(idPublicacion, token);
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const crearComentario = useCallback(async (comentario: ComentarioCreateDTO) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoComentario = await crearComentarioService(comentario, token);
      
      // Actualizar la lista de comentarios
      setComentarios(prev => [nuevoComentario, ...prev]);
      
      // Actualizar comentarios paginados si es necesario
      if (comentariosPaginados.content.length < comentariosPaginados.size) {
        setComentariosPaginados(prev => ({
          ...prev,
          content: [nuevoComentario, ...prev.content],
          totalElements: prev.totalElements + 1
        }));
      }
      
      return nuevoComentario;
    } catch (err) {
      setError('Error al crear comentario');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, comentariosPaginados.size, comentariosPaginados.content.length]);

  const eliminarComentario = useCallback(async (idComentario: number) => {
    setLoading(true);
    setError(null);
    try {
      await eliminarComentarioService(idComentario, token);
      
      // Actualizar la lista de comentarios
      setComentarios(prev => prev.filter(c => c.idcomentario !== idComentario));
      
      // Actualizar comentarios paginados
      setComentariosPaginados(prev => ({
        ...prev,
        content: prev.content.filter(c => c.idcomentario !== idComentario),
        totalElements: prev.totalElements - 1
      }));
    } catch (err) {
      setError('Error al eliminar comentario');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    comentarios,
    comentariosPaginados,
    estadisticas,
    loading,
    error,
    cargarComentarios,
    cargarComentariosPaginados,
    cargarEstadisticas,
    crearComentario,
    eliminarComentario
  };
};