import api from "../axios";
import { LoginResponse, LoginCredentials, RegisterCredentials, EcoTip } from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      return {
        token: response.data.token,
        user: {
          id: response.data.user.id,
          nombre: response.data.user.nombre,
          email: response.data.user.email,
          puntos_totales: response.data.user.puntos_totales || 0,
          foto_perfil: response.data.user.foto_perfil || "default.jpg",
          nivel: response.data.user.nivel
        }
      };
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Credenciales incorrectas o error del servidor");
    }
  },

  async register(userData: RegisterCredentials): Promise<EcoTip> {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error("Error al registrar usuario");
    }
  },

  async getCurrentUser(token: string): Promise<EcoTip> {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      throw new Error("Error al obtener información del usuario");
    }
  }
};