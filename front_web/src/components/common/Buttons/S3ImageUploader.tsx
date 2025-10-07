import React, { useState, useRef, useEffect } from "react";
import "./S3ImageUploader.css";

interface S3ImageUploaderProps {
  /** URL actual de la imagen (opcional) */
  currentImage?: string;
  /** Callback cuando el usuario selecciona un nuevo archivo */
  onFileSelect: (file: File | null) => void;
  /** Texto opcional para la etiqueta */
  label?: string;
  /** Forma de la imagen (circle | rect) */
  shape?: "circle" | "rect";
  /** Ancho/alto de preview */
  size?: number;
}

const S3ImageUploader: React.FC<S3ImageUploaderProps> = ({
  currentImage,
  onFileSelect,
  label = "Imagen",
  shape = "circle",
  size = 100
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div className="s3-uploader">
      {label && <label className="s3-uploader-label">{label}</label>}
      <div
        className={`s3-uploader-preview ${shape}`}
        style={{ width: size, height: size }}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" />
        ) : (
          <div className="s3-uploader-placeholder">Seleccionar</div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default S3ImageUploader;
