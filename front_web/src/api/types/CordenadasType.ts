export interface CoordenadasDTO {
    latitud: number,
    longitud: number,
}
export interface PuntoVerdeDTO {
   id?: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  direccion: string;
  tipo_residuo: string;
  imagen_url: string;
}