export interface Usuario {
  idUsuario?: number;
  nombre: string;
  email: string;
  fotoPerfil?: string;
  puntosTotales?: number;
  nivel:string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export interface LoginDTO {
  email: string;
  password: string;
}