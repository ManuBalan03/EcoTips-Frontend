import { useState, useRef } from "react";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";
import FileUpload from "../Buttons/FileUpload";

interface Props {
  onClose: () => void;
  onPublish: (nuevo: PublicacionDTO, file?: File) => void;
  user: any;
}

const EcoTipFormModal = ({ onClose, onPublish, user }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [Url_key] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [] = useState<string>("");
  const [, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈 Nuevo estado
  const submitInProgress = useRef(false); // 👈 Referencia para prevenir doble submit


  const handleSubmit = async () => {
    // 👇 PREVENCIÓN DE DOBLE SUBMIT
    if (isSubmitting || submitInProgress.current) {
      console.log('⚠️ Submit ya en progreso, ignorando...');
      return;
    }

    if (!user) return;

    // 🔒 BLOQUEAR NUEVOS SUBMITS
    setIsSubmitting(true);
    submitInProgress.current = true;
    setIsUploading(true);

    try {
      const nuevaPublicacion: PublicacionDTO = {
        titulo,
        url_key: Url_key,
        descripcion,
        idUsuario: user.id!,
        fechaCreacion: new Date().toISOString(),
      };

      await onPublish(nuevaPublicacion, selectedFile ?? undefined);
      
      // ✅ Éxito - cerrar modal
      onClose();

    } catch (error) {
      console.error('Error al subir archivo:', error);
      alert('Error al subir el archivo. Intenta nuevamente.');
    } finally {
      // 🔓 DESBLOQUEAR
      setIsSubmitting(false);
      submitInProgress.current = false;
      setIsUploading(false);
    }
  };

  // ... resto del código igual




  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Publicar EcoTip</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="form-group">
          <input 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            placeholder="Título" 
            className="form-input"
            disabled={isSubmitting} // 👈 Deshabilitar inputs durante submit
          />
          
          <input 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            placeholder="Descripción" 
            className="form-input"
            disabled={isSubmitting} // 👈 Deshabilitar inputs durante submit
          />

          <FileUpload 
            onFileSelect={setSelectedFile}
            acceptedTypes="image/*,video/*"
            maxSizeMB={10}
            className="ecotip-file-upload"
            disabled={isSubmitting} // 👈 Pasar prop disabled al FileUpload
          />

          <button 
            onClick={handleSubmit} 
            className="publish-button"
            disabled={isSubmitting || !titulo.trim()} // 👈 Usar isSubmitting aquí
          >
            {isSubmitting ? "🔄 Publicando..." : "📤 Publicar"}
          </button>

          {/* 👇 Mensaje de prevención de doble click */}
          {isSubmitting && (
            <div className="submit-warning">
              ⚠️ No cierres esta ventana mientras se publica...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcoTipFormModal;