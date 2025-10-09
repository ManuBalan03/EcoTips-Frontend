
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/publicaciones';
import {PublicacionDTO } from './Types/PublicationType';

export interface VotosDTO {
  idVotos?: number;
  Comentario: string;
  Voto: 'ACUERDO' | 'EN_DESACUERDO';
  fechaVoto?: string;
  idUsuario: number;
  idPublicacion: number;
  nombreAutor?: string;
  fotoPerfil?: string;
}

// interface Solicitud {
//   id: number;
//   titulo: string;
//   contenido: string;
//   descripcion?: string;
//   idUsuario: number;
//   fechaCreacion?: string;
//   nombreAutor?: string;
//   fotoPerfil?:string;
// }

export const obtenerVotosPorPublicacion = async (idPublicacion: number, token: string): Promise<VotosDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/votos/publicaciones/${idPublicacion}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener votos:', error);
    return [];
  }
};

export const enviarVoto = async (votoData: Omit<VotosDTO, 'idVotos' | 'fechaVoto'>, token: string): Promise<VotosDTO> => {
  try {
    const response = await axios.post(`${BASE_URL}/votos`, votoData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al enviar voto:', error);
    throw error;
  }
};


export const obtenerSolicitudesPendientes = async (
 token: string, 
  estado: string = 'PENDIENTE', 
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

// En tu archivo de servicios
export const obtenerSolicitudPorId = async (id: number, token: string): Promise<PublicacionDTO> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener la solicitud');
  }
  
  return response.json();
};