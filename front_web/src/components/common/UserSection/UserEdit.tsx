import React, { useState } from "react";
import "./UserEdit.css";

interface EditProfileFormProps {
  nombre: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  onSave: (data: { nombre: string; email: string; telefono?: string; fotoPerfil?: string; password?: string }) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ nombre, email, telefono, fotoPerfil, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre,
    email,
    telefono: telefono || "",
    fotoPerfil: fotoPerfil || "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  

  return (
    <div className="edit-profile-form">
      <h3>Editar Perfil</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </label>

        <label>
          Correo:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>
          Teléfono:
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
        </label>

        <label>
          Foto de perfil (URL):
          <input type="text" name="fotoPerfil" value={formData.fotoPerfil} onChange={handleChange} />
        </label>

        <label>
          Nueva contraseña:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
