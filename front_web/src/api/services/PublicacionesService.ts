import axios from 'axios';

export interface PublicacionDTO {
  id?: number;
  titulo: string;
  contenido: string;
  descripcion?: string;
  idUsuario: number;
  fechaCreacion?: string;
  nombreAutor?: string;
}

export interface ReactionsDTO {
  idReaccion?: number;
  idPublicacion: number;
  idUsuario: number;
  Tipo: string;
  fechaCreacion?: string;
  nombreAutor?: string;
}

// Define un tipo específico para creación que no requiera campos opcionales
export interface ComentarioCreateDTO {
  idPublicacion: number;
  idUsuario: number;
  contenido: string;
  nombreAutor?: string;
}

// Mantén ComentarioDTO completo para las respuestas
export interface ComentarioDTO extends ComentarioCreateDTO {
  idcomentario?: number;
  fechaCreacion?: string;
}

interface ConteoReacciones {
  [tipo: string]: number;
}

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

export const obtenerTodasLasPublicaciones = async (token: string): Promise<PublicacionDTO[]> => {
  try {
    console.log('Intentando obtener publicaciones con token:', token.substring(0, 10) + '...');
    
    const response = await axios.get(BASE_URL, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respuesta obtenida:', response);
    
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
      } else {
        console.error('Respuesta inesperada del backend:', response.data);
        return [];
      }
    }
    
    console.error('Formato de respuesta no reconocido:', response.data);
    return [];
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Estado de respuesta:', error.response.status);
      console.error('Datos de respuesta:', error.response.data);
    }
    return [];
  }
};

// Servicios para Comentarios
export const obtenerComentariosPorPublicacion = async (
  idPublicacion: number,
  token: string
): Promise<ComentarioDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/comentarios/publicacion/${idPublicacion}`, {
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
    console.log('Enviando comentario al servidor:', comentario);
    console.log('Token utilizado:', token.substring(0, 10) + '...');
    
    const response = await axios.post(
      `${BASE_URL}/comentarios`,
      comentario,
      {
        withCredentials: true, // Añadido withCredentials
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Añadido Content-Type
        }
      }
    );
    
    console.log('Respuesta del servidor para comentario:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado en crearComentario:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Datos de error del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
      console.error('Headers de respuesta:', error.response.headers);
    }
    throw error; // Re-lanzar el error para que el componente lo pueda manejar
  }
};

// Servicios para Reacciones
export const obtenerReaccionesPorPublicacion = async (
  idPublicacion: number,
  token: string
): Promise<ReactionsDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/reacciones/publicacion/${idPublicacion}`, {
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
): Promise<ConteoReacciones> => {
  try {
    const response = await axios.get(`${BASE_URL}/reacciones/conteo/${idPublicacion}`, {
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
    `${BASE_URL}/reacciones`,
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
  await axios.delete(`${BASE_URL}/reacciones/${idReaccion}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};