import { useState, useRef } from "react";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";

interface Props {
  onClose: () => void;
  onPublish: (nuevo: PublicacionDTO, file?: File) => void;
  user: any;
}


const EcoTipFormModal = ({ onClose, onPublish, user }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [Url_key, setContenido] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecciona una imagen (JPEG, PNG, GIF, WebP) o video (MP4, MOV)');
      return;
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setSelectedFile(file);
    setContenido(URL.createObjectURL(file)); // Preview temporal
    
    // Para preview inmediato
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // También establecer la URL/key para el backend
    setContenido(file.name); // O lo que necesites para tu backend
  };

  // Simular subida de archivo (debes integrar con tu servicio real)
  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aquí iría tu lógica real de subida a AWS S3, Cloudinary, etc.
        const fakeUrl = `https://tu-bucket.s3.amazonaws.com/${Date.now()}-${file.name}`;
        resolve(fakeUrl);
      }, 2000);
    });
  };

 const handleSubmit = async () => {
  if (!user) return;

  setIsUploading(true);

  try {
    const nuevaPublicacion: PublicacionDTO = {
      titulo,
      url_key: Url_key, // key temporal, luego el padre la reemplaza
      descripcion,
      idUsuario: user.id!,
      fechaCreacion: new Date().toISOString(),
    };

    // 👉 Ahora le pasamos la publicación y el archivo seleccionado al padre
    onPublish(nuevaPublicacion, selectedFile ?? undefined);

    // Cerrar modal aquí si quieres
  } catch (error) {
    console.error('Error al subir archivo:', error);
    alert('Error al subir el archivo. Intenta nuevamente.');
  } finally {
    setIsUploading(false);
  }
};


  // Limpiar preview cuando el componente se desmonte
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setContenido("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const event = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

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
          />
          
          <input 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            placeholder="Descripción" 
            className="form-input"
          />

          {/* Nuevo componente de subida de archivos */}
          <div 
            className={`file-upload-area ${previewUrl ? 'has-preview' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!previewUrl ? (
              <>
                <div className="upload-placeholder">
                  <div className="upload-icon">📁</div>
                  <p>Arrastra y suelta una imagen o video aquí</p>
                  <p className="upload-subtext">o</p>
                  <button 
                    type="button"
                    className="browse-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecciona un archivo
                  </button>
                  <p className="file-requirements">
                    Formatos: JPEG, PNG, GIF, WebP, MP4, MOV • Máx. 10MB
                  </p>
                </div>
              </>
            ) : (
              <div className="file-preview">
                {selectedFile?.type.startsWith('image/') ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="preview-image"
                  />
                ) : (
                  <div className="video-preview">
                    <video controls className="preview-video">
                      <source src={previewUrl} type={selectedFile?.type} />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                )}
                <div className="preview-info">
                  <span className="file-name">{selectedFile?.name}</span>
                  <span className="file-size">
                    {(selectedFile?.size! / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  type="button"
                  className="remove-file-button"
                  onClick={handleRemoveFile}
                >
                  ✕
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="file-input-hidden"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            className="publish-button"
            disabled={isUploading || !titulo.trim()}
          >
            {isUploading ? "Subiendo..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcoTipFormModal;