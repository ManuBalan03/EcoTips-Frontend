import axios from 'axios';

export interface PublicacionDTO {
  id?: number;
  titulo: string;
  contenido: string;
  descripcion?: string;
  idUsuario: number;
  fechaCreacion?: string;
  nombreAutor ?:string;
}
const BASE_URL = 'http://localhost:8082/api/publicaciones'; // cambia al host de tu microservicio

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
    
    // Con axios, los datos ya vienen procesados en response.data
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.content && Array.isArray(response.data.content)) {
        // Algunos APIs devuelven paginación con un objeto que contiene 'content'
        return response.data.content;
      } else {
        console.error('Respuesta inesperada del backend:', response.data);
        return []; // Devuelve un array vacío en lugar de lanzar un error
      }
    }
    
    console.error('Formato de respuesta no reconocido:', response.data);
    return []; // Devuelve un array vacío si no se puede procesar la respuesta
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    // Manejo específico para errores de Axios
    if (axios.isAxiosError(error) && error.response) {
      console.error('Estado de respuesta:', error.response.status);
      console.error('Datos de respuesta:', error.response.data);
    }
    // Devuelve un array vacío en lugar de propagar el error
    return [];
  }
};