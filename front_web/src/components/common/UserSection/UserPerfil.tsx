import React, { useState, useEffect } from "react";
import { useUserPoints } from '../../../context/UserPointsContext';
import EditProfileForm from "./UserEdit";
import { actualizarDatosUsuario } from "../../../api/services/UserService";
import "./UserPerfil.css";
import { useAuth } from "../../../api/AuthContext";
import { uploadImageToS3 } from "../../../api/services/s3Services"; 

interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  nivel: string;
  seguidores?: number;
}

interface UserPerfilProps {
  usuario?: Usuario;
  idUsuario?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  fotoPerfil?: string;
  nivel?: string;
  seguidores?: number;
}

const UserPerfil: React.FC<UserPerfilProps> = ({ 
  usuario: usuarioProp, 
  idUsuario, 
  nombre, 
  email, 
  telefono, 
  fotoPerfil, 
  nivel, 
  seguidores = 0 
}) => {
  const { points } = useUserPoints();
  const xp = points || 0;
  const [editing, setEditing] = useState(false);
  const { updateUser, token } = useAuth();


  // Crear objeto usuario a partir de props individuales o del objeto completo
  const initialUsuario = usuarioProp || {
    idUsuario: idUsuario || 0,
    nombre: nombre || "Usuario",
    email: email || "",
    telefono: telefono,
    fotoPerfil: fotoPerfil,
    nivel: nivel || "Principiante",
    seguidores: seguidores
  };

  const [usuario, setUsuario] = useState<Usuario>(initialUsuario);

  // Actualizar estado si las props cambian
  useEffect(() => {
    if (usuarioProp) {
      setUsuario(usuarioProp);
    } else if (idUsuario !== undefined || nombre !== undefined) {
      setUsuario({
        idUsuario: idUsuario || usuario.idUsuario,
        nombre: nombre || usuario.nombre,
        email: email || usuario.email,
        telefono: telefono !== undefined ? telefono : usuario.telefono,
        fotoPerfil: fotoPerfil !== undefined ? fotoPerfil : usuario.fotoPerfil,
        nivel: nivel || usuario.nivel,
        seguidores: seguidores !== undefined ? seguidores : usuario.seguidores
      });
    }
  }, [usuarioProp, idUsuario, nombre, email, telefono, fotoPerfil, nivel, seguidores]);


  
 const handleSave = async (data: any) => {
  try {
    let updatedFotoPerfil = usuario.fotoPerfil;

    // 📤 Si el usuario seleccionó una nueva imagen, súbela a S3
    if (data.file) {
      const key = await uploadImageToS3(data.file, token || "");
      updatedFotoPerfil = key;
    }

    // 📝 Enviar al backend los nuevos datos del usuario
    const updatedUser = await actualizarDatosUsuario(
      usuario.idUsuario,
      { 
        ...usuario, 
        ...data, 
        fotoPerfil: updatedFotoPerfil 
      },
      token || ""
    );


// Actualizar Context para que otros componentes se enteren
updateUser(updatedUser);

    setUsuario(updatedUser);
    setEditing(false);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("Hubo un error al actualizar tu perfil.");
  }
};

  return (
    <div className="user-profile-wrapper">
      <div className="user-cover" />

      {!editing ? (
        <div className="user-profile-content">
          <div className="user-info-left">
            <div className="avatar-container">
              {usuario.fotoPerfil ? (
                <img 
                  src={usuario.fotoPerfil} 
                  alt={`Foto de ${usuario.nombre}`} 
                  className="avatar-large" 
                />
              ) : (
                <div className="default-avatar-large">
                  <span>{usuario.nombre?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="user-name">{usuario.nombre}</h2>
              {usuario.email && <p className="user-email">Correo: {usuario.email}</p>}
              {usuario.telefono && <p className="user-phone">Teléfono: {usuario.telefono}</p>}
              <span className="followers">Seguidores {usuario.seguidores}</span>
            </div>
          </div>

          <div className="user-info-right">
            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              Editar Perfil
            </button>
            <div className="user-level">
              <div className="xp-bar-perfile">
                <div className="xp-progress" style={{ width: `${xp % 100}%` }} />
              </div>
              <small>{usuario.nivel} - {xp}xp</small>
            </div>
          </div>
        </div>
      ) : (
        <EditProfileForm
          nombre={usuario.nombre}
          email={usuario.email}
          telefono={usuario.telefono}
          fotoPerfil={usuario.fotoPerfil}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
};

export default UserPerfil;