import axios from 'axios';
import {PublicacionDTO } from './Types/PublicationType';

const BASE_URL = 'http://localhost:8082/api/publicaciones';

export const crearPublicacion = async (
  publicacion: PublicacionDTO,
  token: string
): Promise<PublicacionDTO> => {
  const response = await axios.post(`${BASE_URL}`, publicacion, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const obtenerTodasLasPublicaciones = async (
  token: string, 
  estado: string = 'APROBADA', 
  page: number = 0, 
  size: number = 20
): Promise<any> => {
  try {
    const response = await axios.get(BASE_URL, {
      withCredentials: true,
      params: {
        estado,
        page,
        size
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    
    console.error('Formato de respuesta no reconocido:', response.data);
    return { content: [], totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Estado de respuesta:', error.response.status);
      console.error('Datos de respuesta:', error.response.data);
    }
    return { content: [], totalElements: 0, totalPages: 0 };
  }
};

export const obtenerPublicacionPorId = async (
  id: number,
  token: string
): Promise<PublicacionDTO> => {
  const response = await axios.get(`${BASE_URL}/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const actualizarPublicacion = async (
  id: number,
  publicacion: PublicacionDTO,
  token: string
): Promise<PublicacionDTO> => {
  const response = await axios.put(`${BASE_URL}/${id}`, publicacion, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const actualizarEstadoPublicacion = async (
  id: number,
  nuevoEstado: string,
  token: string
): Promise<PublicacionDTO> => {
  const response = await axios.patch(
    `${BASE_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`,
    {},
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

export const eliminarPublicacion = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};