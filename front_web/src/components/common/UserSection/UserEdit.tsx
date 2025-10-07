import React, { useState } from "react";
import "./UserEdit.css";
import S3ImageUploader from "../../common/Buttons/S3ImageUploader";

interface EditProfileFormProps {
  nombre: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  onSave: (data: { 
    nombre: string; 
    email: string; 
    telefono?: string; 
    fotoPerfil?: string; 
    password?: string;
    file?: File; // 👈 añadimos file opcional
  }) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  nombre, email, telefono, fotoPerfil, onSave, onCancel 
}) => {
  const [formData, setFormData] = useState({
    nombre,
    email,
    telefono: telefono || "",
    password: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, fotoPerfil, file: selectedFile || undefined });
  };


   return (
    <div className="edit-profile-form">
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input 
          type="text" 
          name="nombre" 
          value={formData.nombre} 
          onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
        />

        <label>Correo:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />

        <label>
          Teléfono:
        </label>
         <input 
          type="text" 
          name="telefono" 
          value={formData.telefono} 
          onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
        />

        <S3ImageUploader
          currentImage={fotoPerfil}
          label="Foto de perfil"
          onFileSelect={setSelectedFile}
          shape="circle"
          size={120}
        />

        <label>Nueva contraseña:</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
