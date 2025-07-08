
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api';
import { EvaluacionDTO } from './Types/EvaluationType';


export const crearEvaluacion = async (dto: EvaluacionDTO, token: string): Promise<EvaluacionDTO> => {
  const response = await axios.post(`${BASE_URL}/Evaluacion`, dto, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const listarEvaluaciones = async (token: string): Promise<any[]> => {
  const response = await axios.get(`${BASE_URL}/Evaluacion`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};


export const obtenerEvaluacionPorId = async (id: number, token: string): Promise<any> => {
  const response = await axios.get(`${BASE_URL}/publicaciones/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};