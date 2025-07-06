// services/NotificacionesService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/notificaciones';

export interface NotificationsDTO {
  id?: number;
  titulo: string;
  contenido: string;
  idUsuario: number;
  idPublicacion?: number;
  fechaCreacion?: string;
  leida?: boolean;
  tipo?: string;
}

export const obtenerNotificacionesPorUsuario = async (idUsuario: number, token: string): Promise<NotificationsDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return [];
  }
};

export const marcarComoLeida = async (idNotificacion: number, token: string): Promise<void> => {
  try {
    await axios.patch(`${BASE_URL}/${idNotificacion}/leida`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
};