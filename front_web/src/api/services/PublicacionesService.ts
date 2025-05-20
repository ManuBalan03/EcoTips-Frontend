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
const BASE_URL = 'http://localhost:8081/api/publicaciones'; // cambia al host de tu microservicio

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