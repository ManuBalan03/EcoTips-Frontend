
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/publicaciones';

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

interface Solicitud {
  id: number;
  titulo: string;
  contenido: string;
  descripcion?: string;
  idUsuario: number;
  fechaCreacion?: string;
  nombreAutor?: string;
  fotoPerfil?:string;
}

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


export const obtenerSolicitudesPendientes = async (token: string): Promise<Solicitud[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/pendiente`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return [];
  }
};

// En tu archivo de servicios
export const obtenerSolicitudPorId = async (id: number, token: string): Promise<Solicitud> => {
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