export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fotoPerfil?: string;
  puntosTotales?: number;
  nivel:string;
  telefono?:string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export interface LoginDTO {
  email: string;
  password: string;
}