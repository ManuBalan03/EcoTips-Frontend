// services/NotificacionesService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notificaciones';

export interface NotificationsDTO {
  idNotificacion?: number;
  tipo: string;
  mensaje: string;
  idUsuario: number;
  idPublicacion?: number;
  fechaEnvio?: string;
  leido?: boolean;
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

// services/NotificacionesService.ts
export const marcarComoLeida = async (idNotificacion: number, token: string): Promise<void> => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${idNotificacion}/leida`, 
      {}, // Body vacío para PATCH
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    
    if (response.status !== 200) {
      throw new Error('Error al marcar como leída');
    }
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Error en el servidor'
        : 'Error al marcar como leída'
    );
  }
};
