import React, { useEffect, useState } from 'react';
import { EvaluacionDTO } from '../../../api/services/Publications/Types/EvaluationType';
import { PublicacionDTO } from '../../../api/services/Publications/Types/PublicationType';
import { obtenerEvaluacionesPorPublicacion } from '../../../api/services/Publications/EvaluateServices';
import { obtenerPublicacionPorId, actualizarPublicacion, actualizarEstadoPublicacion } from '../../../api/services/Publications/PublicacionesService';
import { uploadImageToS3 } from '../../../api/services/s3Services';
import { useAuth } from '../../../api/AuthContext';
import FileUpload from '../../common/Buttons/FileUpload';
import './ModificationDetail.css';

interface ModificationDetailProps {
  publicacionId: number;
  onBack: () => void;
}

const ModificationDetail: React.FC<ModificationDetailProps> = ({ publicacionId, onBack }) => {
  const { token } = useAuth();
  const [evaluacion, setEvaluacion] = useState<EvaluacionDTO | null>(null);
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [contenidoKey, setContenidoKey] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // ✅ Obtener evaluación y publicación por separado
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        
        // Obtener evaluación de la publicación
        const evaluaciones = await obtenerEvaluacionesPorPublicacion(publicacionId, token);
        setEvaluacion(evaluaciones);

        // Obtener datos de la publicación
        const publicacionData = await obtenerPublicacionPorId(publicacionId, token);
        setPublicacion(publicacionData);
        
        // Cargar datos en el formulario
        setTitulo(publicacionData.titulo || '');
        setDescripcion(publicacionData.descripcion || '');
        setContenidoKey( publicacionData.url_key || '');

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setMensaje('❌ Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicacionId, token]);

  // ✅ Manejar selección de archivo
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  // ✅ Guardar cambios
  const handleGuardarCambios = async () => {
    if (!token || !publicacion) {
      setMensaje('❌ Error: Datos incompletos');
      return;
    }

    if (!titulo.trim()) {
      setMensaje('⚠️ El título es obligatorio');
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      let nuevaContenidoKey = contenidoKey;

      // 🔹 Subir nuevo archivo si se seleccionó
      if (selectedFile) {
        try {
          nuevaContenidoKey = await uploadImageToS3(selectedFile, token);
          console.log('✅ Archivo subido:', nuevaContenidoKey);
        } catch (uploadError) {
          console.error('Error al subir archivo:', uploadError);
          setMensaje('❌ Error al subir el archivo');
          setGuardando(false);
          return;
        }
      }

      // 🔹 Actualizar la publicación
      const publicacionActualizada: PublicacionDTO = {
        id: publicacionId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        idUsuario: publicacion.idUsuario, // Mantener el usuario original
        contenido_key: nuevaContenidoKey || undefined,
        fechaCreacion: publicacion.fechaCreacion // Mantener fecha original
      };

      await actualizarPublicacion(publicacionId, publicacionActualizada, token);

      // 🔹 Cambiar estado a PENDIENTE para nueva revisión
      await actualizarEstadoPublicacion(publicacionId, 'PENDIENTE', token);

      setMensaje('✅ Publicación actualizada y enviada para revisión');
      
      // 🔹 Redirigir después de 2 segundos
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (error) {
      console.error('Error al actualizar:', error);
      setMensaje('❌ Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="modification-detail">
        <div className="loading-state">Cargando datos...</div>
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="modification-detail">
        <button className="back-btn" onClick={onBack}>⬅ Volver</button>
        <div className="error-state">❌ No se encontró la publicación</div>
      </div>
    );
  }

  return (
    <div className="modification-detail">
      {/* Botón de volver */}
      <button className="back-btn" onClick={onBack}>
        ⬅ Volver
      </button>

      <h2>📝 Modificar Publicación</h2>

      {/* Información de la evaluación si existe */}
      {evaluacion && (
        <div className="evaluation-info">
          <h3>Evaluación</h3>
          <div className="evaluation-details">
            <div className="text-evaluation"> 
              <strong>Veredicto:</strong> 
              <p>
              <span className={`veredicto ${evaluacion.veredicto?.toLowerCase()}`}>
                {evaluacion.veredicto}
              </span>
            </p>
            </div>
            <div className="text-evaluation">
               <strong>Fecha de evaluación:</strong> 
              <p>
              {new Date(evaluacion.fecha_evaluacion).toLocaleDateString('es-ES')}
            </p>
            </div>
           
          
          </div>

             <strong>Comentario:</strong> 
            <p>
              {evaluacion.comentario_final || 'Sin comentarios adicionales'}
            </p>
        </div>
      )}

      {/* Formulario de edición */}
      <div className="publication-edit">
        <h3>Editar Publicación</h3>
        
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la publicación"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la publicación..."
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Contenido Multimedia</label>

            {contenidoKey && !selectedFile && (
            <div className="current-content">
              <p><strong>Contenido actual:</strong></p>
              <div className="current-preview">
                {contenidoKey.match(/\.(mp4|mov|avi|webm)$/i) ? (
                  <video controls className="preview-media">
                    <source src={contenidoKey} type="video/mp4" />
                    Tu navegador no soporta el video.
                  </video>
                ) : (
                  <img src={contenidoKey} alt="Contenido actual" className="preview-media" />
                )}
              </div>
            </div>
          )}
          <p className="field-help">Puedes subir una nueva imagen o video para reemplazar el actual</p>
          
          <FileUpload 
            onFileSelect={handleFileSelect}
            acceptedTypes="image/*,video/*"
            maxSizeMB={10}
          />
          
       
        
        </div>

        <button
          onClick={handleGuardarCambios}
          disabled={guardando || !titulo.trim()}
          className="save-btn"
        >
          {guardando ? 'Guardando...' : 'Guardar y Enviar para Revisión'}
        </button>

        {mensaje && (
          <div className={`mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModificationDetail;