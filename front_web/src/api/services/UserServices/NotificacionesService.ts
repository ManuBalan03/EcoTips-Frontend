// // services/NotificacionesService.ts
// import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api/notificaciones';

// export interface NotificationsDTO {
//   idNotificacion?: number;
//   tipo: string;
//   mensaje: string;
//   idUsuario: number;
//   idPublicacion?: number;
//   fechaEnvio?: string;
//   leido?: boolean;
// }

// export const obtenerNotificacionesPorUsuario = async (idUsuario: number, token: string): Promise<NotificationsDTO[]> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/${idUsuario}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     });
//     return response.data || [];
//   } catch (error) {
//     console.error('Error al obtener notificaciones:', error);
//     return [];
//   }
// };

// // services/NotificacionesService.ts
// export const marcarComoLeida = async (idNotificacion: number, token: string): Promise<void> => {
//   try {
//     const response = await axios.patch(
//       `${BASE_URL}/${idNotificacion}/leida`, 
//       {}, // Body vacío para PATCH
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       }
//     );
    
//     if (response.status !== 200) {
//       throw new Error('Error al marcar como leída');
//     }
//   } catch (error) {
//     console.error('Error en marcarComoLeida:', error);
//     throw new Error(
//       axios.isAxiosError(error) 
//         ? error.response?.data?.message || 'Error en el servidor'
//         : 'Error al marcar como leída'
//     );
//   }
// };


// services/NotificacionesService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notificaciones';

export interface NotificationsDTO {
  idNotificacion?: number;
  tipo: string;
  mensaje: string;
  idUsuario: number; // Cambié de idUsuario a usuario para coincidir con el backend
  idPublicacion?: number;
  fechaEnvio?: string;
  leido?: boolean;
}

// Interfaces para la respuesta paginada
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface NotificationFilters {
  page?: number;
  size?: number;
  sort?: string;
  onlyUnread?: boolean;
  beforeDate?: string; // Para scroll infinito
}

// ✅ Obtener notificaciones PAGINADAS
export const obtenerNotificacionesPaginadas = async (
  idUsuario: number, 
  filters: NotificationFilters = {}, 
  token: string
): Promise<PageResponse<NotificationsDTO>> => {
  try {
    const { page = 0, size = 20, sort = 'fechaEnvio', onlyUnread = false, beforeDate } = filters;
    
    let url = `${BASE_URL}/usuario/${idUsuario}`;
    if (onlyUnread) {
      url = `${BASE_URL}/usuario/${idUsuario}/no-leidas`;
    }
    
    const params: any = { page, size, sort };
    if (beforeDate) {
      params.antesDe = beforeDate;
    }

    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones paginadas:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Error al cargar notificaciones'
        : 'Error de conexión'
    );
  }
};

// ✅ Obtener contador de notificaciones no leídas (para badge)
export const obtenerContadorNoLeidas = async (idUsuario: number, token: string): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/usuario/${idUsuario}/contador-no-leidas`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    
    return response.data.count;
  } catch (error) {
    console.error('Error al obtener contador de no leídas:', error);
    return 0;
  }
};

// ✅ Marcar una notificación como leída
export const marcarComoLeida = async (idNotificacion: number, token: string): Promise<void> => {
  try {
    await axios.patch(
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
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Error en el servidor'
        : 'Error al marcar como leída'
    );
  }
};

// ✅ Marcar TODAS las notificaciones como leídas
export const marcarTodasComoLeidas = async (idUsuario: number, token: string): Promise<void> => {
  try {
    await axios.patch(
      `${BASE_URL}/usuario/${idUsuario}/leer-todas`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
  } catch (error) {
    console.error('Error en marcarTodasComoLeidas:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Error en el servidor'
        : 'Error al marcar todas como leídas'
    );
  }
};

// ✅ Método de compatibilidad (mantener para componentes existentes)
export const obtenerNotificacionesPorUsuario = async (idUsuario: number, token: string): Promise<NotificationsDTO[]> => {
  try {
    const response = await obtenerNotificacionesPaginadas(idUsuario, { size: 50 }, token);
    return response.content;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return [];
  }
};

// ✅ Para scroll infinito - notificaciones más antiguas
export const obtenerNotificacionesAntiguas = async (
  idUsuario: number, 
  beforeDate: string, 
  token: string,
  size: number = 15
): Promise<PageResponse<NotificationsDTO>> => {
  try {
    const response = await axios.get(`${BASE_URL}/usuario/${idUsuario}/anteriores`, {
      params: {
        antesDe: beforeDate,
        size: size
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones antiguas:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Error al cargar más notificaciones'
        : 'Error de conexión'
    );
  }
};