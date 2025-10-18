import React, { useState, useRef, useCallback } from 'react';
import './FileUpload.css';

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  previewUrl?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = 'image/*,video/*',
  maxSizeMB = 10,
  previewUrl: externalPreviewUrl,
  className = '',
  disabled = false,
  multiple = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar preview externo si se proporciona, sino usar el interno
  const previewUrl = externalPreviewUrl || internalPreviewUrl;

  // Validar archivo
  const validateFile = useCallback((file: File): boolean => {
    // Validar tamaño
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB permitido.`);
      return false;
    }

    // Validar tipo (si se especificaron tipos específicos)
    if (acceptedTypes !== '*/*') {
      const acceptedTypesArray = acceptedTypes.split(',').map(type => type.trim());
      const fileType = file.type;
      
      const isValidType = acceptedTypesArray.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(category + '/');
        }
        return fileType === type;
      });

      if (!isValidType) {
        alert(`Tipo de archivo no válido. Formatos aceptados: ${acceptedTypes}`);
        return false;
      }
    }

    return true;
  }, [acceptedTypes, maxSizeMB]);

  // Manejar selección de archivo
  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    
    // Crear URL para preview
    const objectUrl = URL.createObjectURL(file);
    setInternalPreviewUrl(objectUrl);
    
    // Notificar al componente padre
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  // Manejar cambio en input file
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Manejar drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = multiple ? Array.from(files) : [files[0]];
      file.forEach(f => handleFileSelect(f));
    }
  };

  // Limpiar archivo seleccionado
  const handleRemoveFile = () => {
    if (internalPreviewUrl) {
      URL.revokeObjectURL(internalPreviewUrl);
    }
    setSelectedFile(null);
    setInternalPreviewUrl('');
    onFileSelect(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Obtener tipo de archivo para mostrar icono apropiado
  const getFileTypeIcon = () => {
    if (!selectedFile) return '📁';
    
    if (selectedFile.type.startsWith('image/')) return '🖼️';
    if (selectedFile.type.startsWith('video/')) return '🎥';
    if (selectedFile.type.startsWith('audio/')) return '🎵';
    
    return '📄';
  };

  return (
    <div className={`file-upload-wrapper ${className}`}>
      <div 
        className={`file-upload-area ${previewUrl ? 'has-preview' : ''} ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && !disabled && fileInputRef.current?.click()}
      >
        {!previewUrl ? (
          <div className="upload-placeholder">
            <div className="upload-icon">{getFileTypeIcon()}</div>
            <p>Arrastra y suelta tu archivo aquí</p>
            <p className="upload-subtext">o</p>
            <button 
              type="button"
              className="browse-button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
            >
              Selecciona un archivo
            </button>
            <p className="file-requirements">
              Formatos: {acceptedTypes} • Máx. {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="file-preview">
            {selectedFile?.type.startsWith('image/') ? (
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                className="preview-image"
              />
            ) : selectedFile?.type.startsWith('video/') ? (
              <div className="video-preview">
                <video controls className="preview-video">
                  <source src={previewUrl} type={selectedFile?.type} />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            ) : (
              <div className="file-info-preview">
                <div className="file-icon">{getFileTypeIcon()}</div>
                <div className="file-details">
                  <span className="file-name">{selectedFile?.name}</span>
                  <span className="file-type">{selectedFile?.type}</span>
                </div>
              </div>
            )}
            
            <div className="preview-info">
              <span className="file-name">{selectedFile?.name}</span>
              <span className="file-size">
                {(selectedFile?.size! / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            
            {!disabled && (
              <button 
                type="button"
                className="remove-file-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                title="Eliminar archivo"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleInputChange}
          className="file-input-hidden"
          disabled={disabled}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default FileUpload;