// api/services/UserService.ts
import api from "../axios";
import axios from 'axios';
import { Usuario, AuthResponse, LoginDTO } from "../types/userexample";



export const registerUser = async (data: any) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {  // <-- Usamos axios directamente
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data;
        throw new Error(errorMessage);
      } else {
        throw new Error('Error de conexión. Por favor intenta nuevamente.');
      }
    }
    throw error;
  }
};


export const loginUser = async (loginData: LoginDTO): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Ejemplo de función para crear un usuario
export const crearUsuario = async (userData: Usuario): Promise<Usuario> => {
  try {
    const response = await api.post("/usuarios", userData)
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await api.get("/usuarios");
    
    console.log("Respuesta de la API:", response.data); //esto sirve para verificar el formato

    if (Array.isArray(response.data)) {
      return response.data; 
    } else {
      console.error("La API devolvió un formato inesperado:", response.data);
      return []; // Devuelve un array vacío en caso de error
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (userId: number, token: string): Promise<Usuario> => {
  try {
    
    const response = await api.get(`/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    throw error;
  }
};

// Ejemplo de función para actualizar un usuario
export const actualizarUsuario = async (id: number, userData: Usuario): Promise<Usuario> => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};


// Ejemplo de función para actualizar un usuario
export const actualizarDatosUsuario = async (id: number, userData: Usuario, token:string): Promise<Usuario> => {
  try {
    const response = await api.put(`/usuarios/actualizar/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Ejemplo de función para eliminar un usuario
export const eliminarUsuario = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};









// // api/services/UserService.ts
// import api from "../axios";

// export interface EcoTip {
//   id: number;
//   nombre: string;
//   email: string;
//   puntos_totales: number;
//   foto_perfil: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: EcoTip;
// }


// export const registerUser = (data: any) => api.post("/auth/register", data);
  


// export interface EcoTip {
//   id: number;
//   nombre: string;
//   email: string;
//   puntos_totales: number;
//   foto_perfil: string;
//   // Añade otros campos que devuelva Spring
//   roles?: string[];
//   enabled?: boolean;
// }

// export interface LoginResponse {
//   token: string;
//   user: EcoTip;
// }

// export const loginUser = async (credentials: {
//   email: string;
//   password: string;
// }): Promise<LoginResponse> => {
//   try {
//     const response = await api.post("/auth/login", credentials);
    
//     // Asegúrate de que esto coincida con la respuesta de Spring
//     return {
//       token: response.data.token,
//       user: {
//         id: response.data.user.id,
//         nombre: response.data.user.nombre || response.data.user.username,
//         email: response.data.user.email,
//         puntos_totales: response.data.user.puntos_totales || 0,
//         foto_perfil: response.data.user.foto_perfil || "default.jpg",
//         // Mapea otros campos de Spring
//         roles: response.data.user.roles || [],
//         enabled: response.data.user.enabled || false
//       }
//     };
//   } catch (error) {
//     console.error("Error en login:", error);
//     throw error;
//   }
// };

// // Servicio para obtener los datos del usuario
// export const obtenerDatosUsuario = async (userId: number): Promise<EcoTip> => {
//   try {
//     const response = await api.get(`/api/usuarios/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error obteniendo datos del usuario:", error);
//     throw error;
//   }
// };


// export const obtenerEcoTips = async (): Promise<EcoTip[]> => {
//   try {
//     const response = await api.get("/api/ecotips");
//     return response.data;
//   } catch (error) {
//     console.error("Error obteniendo ecotips:", error);
//     throw error;
//   }
// };