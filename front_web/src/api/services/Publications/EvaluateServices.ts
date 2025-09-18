// api/services/EvaluacionService.ts
import axios from "axios";
import { EvaluacionDTO } from "./Types/EvaluationType";
import { PublicacionDTO } from "./Types/PublicationType";

const BASE_URL = "http://localhost:8082/api";

// ✅ Crear evaluación
export const crearEvaluacion = async (
  dto: EvaluacionDTO,
  token: string
): Promise<EvaluacionDTO> => {
  const response = await axios.post(`${BASE_URL}/Evaluacion`, dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Listar evaluaciones paginadas
export const listarEvaluaciones = async (
  token: string,
  estado: string = "PENDIENTE",
  page: number = 0,
  size: number = 10
): Promise<{
  
  content: PublicacionDTO[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
}> => {
  const response = await axios.get(`${BASE_URL}/Evaluacion`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { estado, page, size },
  });
  return response.data; // ← esto es un Page<PublicacionDTO>
};

// ✅ Listar sin paginación (endpoint antiguo)
export const listarTodasEvaluacionesSinPaginacion = async (
  token: string,
  estado: string = "PENDIENTE"
): Promise<any[]> => {
  const response = await axios.get(`${BASE_URL}/Evaluacion/todas`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { estado },
  }); 
  return response.data;
};

// ✅ Evaluaciones de una publicación específica
export const obtenerEvaluacionesPorPublicacion = async (
  idPublicacion: number,
  token: string
): Promise<EvaluacionDTO[]> => {
  const response = await axios.get(
    `${BASE_URL}/Evaluacion/publicacion/${idPublicacion}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
