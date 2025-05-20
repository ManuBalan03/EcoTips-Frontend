// types/auth.ts
export interface EcoTip {
  id: number;
  nombre: string;
  email: string;
  puntos_totales: number;
  foto_perfil: string;
  nivel:string;
}

export interface LoginResponse {
  token: string;
  user: EcoTip;
}

export interface LoginCredentials {
  email: string;
  password: string;
  nombre?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  // Puedes añadir campos adicionales específicos para registro
  foto_perfil?: string;
}