// api/services/UserService.ts
import api from "../axios";
import axios from "axios";
import { UsuarioDTO, AuthResponse, LoginDTO } from "../types/UserTypes";

// ✅ Registro
export const registerUser = async (data: any) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.data;
        throw new Error(errorMessage);
      } else {
        throw new Error("Error de conexión. Por favor intenta nuevamente.");
      }
    }
    throw error;
  }
};

// ✅ Login
export const loginUser = async (
  loginData: LoginDTO
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error: any) {
     if (error.response?.status === 401) {
      console.log("esta bien")
      throw new Error('Credenciales inválidas');
    } else if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado');
    } else {
      throw new Error('Error de conexión. Intente más tarde');
    }
  }
};

// ✅ Crear usuario
export const crearUsuario = async (userData: UsuarioDTO): Promise<UsuarioDTO> => {
  try {
    const response = await api.post("/usuarios", userData);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// ✅ Obtener usuarios paginados (NUEVO)
export const obtenerUsuariosPaginados = async (
  page: number = 0,
  size: number = 10,
  sort: string = "nombre"
) => {
  try {
    const response = await api.get(`/usuarios/paginados`, {
      params: { page, size, sort },
    });
    return response.data; // Es un Page<UserDTO> -> trae content, totalPages, etc.
  } catch (error) {
    console.error("Error al obtener usuarios paginados:", error);
    throw error;
  }
};

// ✅ Obtener todos los usuarios (legacy)
export const obtenerUsuarios = async (): Promise<UsuarioDTO[]> => {
  try {
    const response = await api.get("/usuarios");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// ✅ Obtener usuario por ID
export const obtenerUsuarioPorId = async (
  userId: number,
  token?: string
): Promise<UsuarioDTO> => {
  try {
    const response = await api.get(`/usuarios/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    throw error;
  }
};

// ✅ Actualizar usuario completo
export const actualizarUsuario = async (
  id: number,
  userData: UsuarioDTO
): Promise<UsuarioDTO> => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// ✅ Actualizar datos con token (ruta especial)
export const actualizarDatosUsuario = async (
  id: number,
  userData: UsuarioDTO,
  token: string
): Promise<UsuarioDTO> => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// ✅ Eliminar usuario
export const eliminarUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// ✅ Sumar puntos
export const actualizarPuntos = async (
  id: number,
  puntosTotales: number
): Promise<UsuarioDTO> => {
  try {
    const response = await api.put(`/usuarios/${id}/puntos`, { puntosTotales });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar puntos:", error);
    throw error;
  }
};

// ✅ Obtener puntos de un usuario
export const obtenerPuntos = async (id: number): Promise<number> => {
  try {
    const response = await api.get(`/usuarios/${id}/puntos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener puntos:", error);
    throw error;
  }
};

// ✅ Actualización parcial
export const actualizarParcial = async (
  id: number,
  data: Partial<UsuarioDTO>
): Promise<UsuarioDTO> => {
  try {
    const response = await api.patch(`/usuarios/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error en actualización parcial:", error);
    throw error;
  }
};

// ✅ Verificar si existe usuario
export const existeUsuario = async (id: number): Promise<boolean> => {
  try {
    const response = await api.get(`/usuarios/${id}/existe`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar existencia:", error);
    throw error;
  }
};

// ✅ Buscar usuario por email
export const obtenerUsuarioPorEmail = async (
  email: string
): Promise<UsuarioDTO> => {
  try {
    const response = await api.get(`/usuarios/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario por email:", error);
    throw error;
  }
};
