import React, { useState, useEffect } from "react";
import { useUserPoints } from '../../../context/UserPointsContext';
import EditProfileForm from "./UserEdit";
import { actualizarDatosUsuario } from "../../../api/services/UserService";
import "./UserPerfil.css";
import { useAuth } from "../../../api/AuthContext";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  nivel: string;
  seguidores?: number;
}

interface UserPerfilProps {
  usuario?: Usuario;
  id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  fotoPerfil?: string;
  nivel?: string;
  seguidores?: number;
}

const UserPerfil: React.FC<UserPerfilProps> = ({ 
  usuario: usuarioProp, 
  id, 
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
  const { token } = useAuth();

  // Crear objeto usuario a partir de props individuales o del objeto completo
  const initialUsuario = usuarioProp || {
    id: id || 0,
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
    } else if (id !== undefined || nombre !== undefined) {
      setUsuario({
        id: id || usuario.id,
        nombre: nombre || usuario.nombre,
        email: email || usuario.email,
        telefono: telefono !== undefined ? telefono : usuario.telefono,
        fotoPerfil: fotoPerfil !== undefined ? fotoPerfil : usuario.fotoPerfil,
        nivel: nivel || usuario.nivel,
        seguidores: seguidores !== undefined ? seguidores : usuario.seguidores
      });
    }
  }, [usuarioProp, id, nombre, email, telefono, fotoPerfil, nivel, seguidores]);

  const handleSave = async (data: Partial<Usuario>) => {
    try {
      const updatedUser = await actualizarDatosUsuario(usuario.id, { ...usuario, ...data }, token || "");
      setUsuario(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Hubo un error al actualizar tu perfil.");
    }
  };

  // Si no hay datos de usuario, mostrar loading
  if (!usuario.nombre) {
    return <div className="loading">Cargando perfil...</div>;
  }

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
              <div className="xp-bar">
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