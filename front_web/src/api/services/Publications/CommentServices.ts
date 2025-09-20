import axios from 'axios';
import { ComentarioDTO, ComentarioCreateDTO, PaginatedResponse } from './Types/PublicationType';

const BASE_URL = 'http://localhost:8082/api/publicaciones/comentarios';

/**
 * Obtiene todos los comentarios de una publicación (sin paginación)
 */
export const obtenerComentariosPorPublicacion = async (
  idPublicacion: number,
  token: string
): Promise<ComentarioDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/publicacion/${idPublicacion}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return [];
  }
};

/**
 * Obtiene comentarios paginados de una publicación
 */
export const obtenerComentariosPaginados = async (
  idPublicacion: number,
  token: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<ComentarioDTO>> => {
  try {
    const response = await axios.get(`${BASE_URL}/publicacion/${idPublicacion}/paginados`, {
      withCredentials: true,
      params: {
        page,
        size
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data || { content: [], totalElements: 0, totalPages: 0, number: 0, size: 0 };
  } catch (error) {
    console.error('Error al obtener comentarios paginados:', error);
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 0 };
  }
};

/**
 * Obtiene estadísticas de comentarios de una publicación
 */
export const obtenerEstadisticasComentarios = async (
  idPublicacion: number,
  token: string
): Promise<Record<string, any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/publicacion/${idPublicacion}/estadisticas`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data || {};
  } catch (error) {
    console.error('Error al obtener estadísticas de comentarios:', error);
    return {};
  }
};

/**
 * Crea un nuevo comentario
 */
export const crearComentario = async (
  comentario: ComentarioCreateDTO,
  token: string
): Promise<ComentarioDTO> => {
  try {
    const response = await axios.post(
      BASE_URL,
      comentario,
      {
        withCredentials: true,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error detallado en crearComentario:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Datos de error del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
    }
    throw error;
  }
};

/**
 * Elimina un comentario
 */
export const eliminarComentario = async (
  idComentario: number,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${idComentario}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    throw error;
  }
};