export interface EvaluacionDTO {
  idEvaluacion?: number;
  veredicto: string;
  comentario_final: string;
  fecha_evaluacion: string;
  idpublicacion: number;
  idUsuario: number;
  nombreAutor?: string;
  fotoPerfil?: string;
}