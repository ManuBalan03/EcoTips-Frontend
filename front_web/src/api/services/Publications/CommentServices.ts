import axios from 'axios';
import { ComentarioDTO, ComentarioCreateDTO } from './Types/PublicationType';

const BASE_URL = 'http://localhost:8082/api/publicaciones/comentarios';

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