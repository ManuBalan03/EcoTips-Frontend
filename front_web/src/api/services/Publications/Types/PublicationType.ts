export interface PublicacionDTO {
  id?: number;
  titulo: string;
  url_key: string;
  descripcion?: string;
  idUsuario: number;
  fechaCreacion?: string;
  nombreAutor?: string;
  estado?: string;
//  fotoPerfil?: string;
    contenido_key?: string;
}

export interface ReactionsDTO {
  idReaccion?: number;
  idPublicacion: number;
  idUsuario: number;
  Tipo: string;
  fechaCreacion?: string;
  nombreAutor?: string;
}

export interface ComentarioCreateDTO {
  idPublicacion: number;
  idUsuario: number;
  contenido: string;
  nombreAutor?: string;
  fotoPerfil?: string;
}

export interface ComentarioDTO extends ComentarioCreateDTO {
  idcomentario?: number;
  fechaCreacion?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}