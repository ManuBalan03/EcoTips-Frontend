export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  email: string;
  fotoPerfil?: string;
  puntosTotales?: number;
  nivel:string;
  telefono?:string;
}

export interface AuthResponse {
  token: string;
  user: UsuarioDTO;
}

export interface LoginDTO {
  email: string;
  password: string;
}