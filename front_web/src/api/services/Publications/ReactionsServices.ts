import axios from 'axios';
import { ReactionsDTO } from './Types/PublicationType';

const BASE_URL = 'http://localhost:8082/api/publicaciones/reacciones';

export const obtenerReaccionesPorPublicacion = async (
  idPublicacion: number,
  token: string
): Promise<ReactionsDTO[]> => {
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
    console.error('Error al obtener reacciones:', error);
    return [];
  }
};

export const contarReaccionesPorTipo = async (
  idPublicacion: number,
  token: string
): Promise<Record<string, number>> => {
  try {
    const response = await axios.get(`${BASE_URL}/conteo/${idPublicacion}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data || {};
  } catch (error) {
    console.error('Error al contar reacciones:', error);
    return {};
  }
};

export const agregarReaccion = async (
  reaccion: Omit<ReactionsDTO, 'idReaccion' | 'fechaCreacion'>,
  token: string
): Promise<ReactionsDTO> => {
  const response = await axios.post(
    BASE_URL,
    reaccion,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const eliminarReaccion = async (
  idReaccion: number,
  token: string
): Promise<void> => {
  await axios.delete(`${BASE_URL}/${idReaccion}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};