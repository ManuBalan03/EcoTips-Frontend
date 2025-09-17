import axios from 'axios';
import { PublicacionDTO } from './Types/PublicationType';

const BASE_URL = 'http://localhost:8082/api/publicaciones';

export const obtenerPublicacionesPorUsuario = async (
  userId: number,
  token: string,
  estado?: string,
  page: number = 0,
  size: number = 10
): Promise<PublicacionDTO[]> => {
  try {
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: estado ? { estado, page, size } : { page, size }
    };

    const response = await axios.get(`${BASE_URL}/usuario/${userId}`, config);

    if (response.data && Array.isArray(response.data.content)) {
      return response.data.content; // 🔥 devolvemos solo el array
    }
    
    console.error('Formato de respuesta inesperado:', response.data);
    return [];
  } catch (error) {
    console.error('Error al obtener publicaciones por usuario:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return [];
  }
};


export const obtenerEstadisticasUsuario = async (
  userId: number,
  token: string
): Promise<Record<string, any>> => {
  try {
    const response = await axios.get(`${BASE_URL}/usuario/${userId}/estadisticas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data || {};
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {};
  }
};