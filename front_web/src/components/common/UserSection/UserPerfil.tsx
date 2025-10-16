import React, { useState, useEffect } from "react";
import { useUserPoints } from '../../../context/UserPointsContext';
import EditProfileForm from "./UserEdit";
import { actualizarDatosUsuario } from "../../../api/services/UserService";
import "./UserPerfil.css";
import { useAuth } from "../../../api/AuthContext";
import { obtenerUrlImagen, uploadImageToS3 } from "../../../api/services/s3Services";
import { UsuarioDTO } from "../../../api/types/UserTypes";

interface UserPerfilProps {
  usuario?: UsuarioDTO;
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
  const { user, updateUser, token } = useAuth();

  // 🎯 Usar directamente el usuario del contexto si está disponible
  const initialUsuario = user || usuarioProp || {
    idUsuario: idUsuario || 0,
    nombre: nombre || "Usuario",
    email: email || "",
    telefono: telefono,
    fotoPerfil: fotoPerfil,
    nivel: nivel || "Principiante",
    seguidores: seguidores
  };

  const [usuario, setUsuario] = useState<UsuarioDTO>(initialUsuario);

  // 🔄 Sincronizar con el contexto cuando cambie
  useEffect(() => {
    if (user) {
      setUsuario(user);
    } else if (usuarioProp) {
      setUsuario(usuarioProp);
    }
  }, [user, usuarioProp]);

  // 🔄 Método para obtener la URL presignada y actualizar el usuario
  const obtenerYGuardarUrl = async (fotoPerfilKey: string) => {
    if (!token || !fotoPerfilKey) return null;

    try {
      const { urlkey } = await obtenerUrlImagen(token, fotoPerfilKey);
      console.log("✅ URL presignada obtenida:", urlkey);
      
      // 🎯 Actualizar el usuario localmente con la URL presignada
      setUsuario(prev => ({
        ...prev,
        fotoPerfil: urlkey
      }));
      
      return urlkey;
    } catch (error) {
      console.error("❌ Error al obtener la URL presignada:", error);
      return null;
    }
  };

  const handleSave = async (data: any) => {
    try {
      let updatedFotoPerfilKey = usuario.fotoPerfil;

      // 📤 Si el usuario seleccionó una nueva imagen, súbela a S3
      if (data.file) {
        const key = await uploadImageToS3(data.file, token || "");
        updatedFotoPerfilKey = key;
      }

      // 📝 Enviar al backend los nuevos datos del usuario (con la key)
      const updatedUser = await actualizarDatosUsuario(
        usuario.idUsuario,
        { 
          ...usuario, 
          ...data, 
          fotoPerfil: updatedFotoPerfilKey 
        },
        token || ""
      );

      // ✅ Actualizar el contexto de autenticación primero
      updateUser(updatedUser);
      
      // 🎯 Si hay una nueva imagen, obtener la URL presignada
      if (data.file && updatedFotoPerfilKey) {
        await obtenerYGuardarUrl(updatedFotoPerfilKey);
      }

      setEditing(false);
      console.log("✅ Perfil actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);
      alert("Hubo un error al actualizar tu perfil.");
    }
  };

  // 🔄 Cargar la URL presignada al montar o cuando cambie la foto
  useEffect(() => {
    if (usuario.fotoPerfil && token && !usuario.fotoPerfil.startsWith('http')) {
      // Solo si es una key (no una URL ya presignada)
      obtenerYGuardarUrl(usuario.fotoPerfil);
    }
  }, [usuario.fotoPerfil, token]);

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