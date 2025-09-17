import React from "react";
import PublicationList from "./PublicationsList";
import UserPerfil from "../../common/UserSection/UserPerfil";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";
import './PublicationsUser.css';

interface UserPublicationsSectionProps {
  user: {
    nombre: string;
    email: string;
    fotoPerfil?: string;
    nivel: string;
    id:number;
    telefono:string;
  };
  publicaciones: PublicacionDTO[];
  onDeletePublication: (id: number) => void;
  onEditPublication: (id: number) => void;
}

const UserPublicationsSection: React.FC<UserPublicationsSectionProps> = ({
  user,
  publicaciones,
  onDeletePublication,
  onEditPublication
}) => {
  return (
    <div className="user-publications-container">
      {/* Sección de información del usuario */}
      <div className="user-profile-section">
      
        <UserPerfil 
          nombre={user.nombre}
          fotoPerfil={user.fotoPerfil}
          nivel={user.nivel}
          email={user.email} 
          id={user.id} 
          telefono={user.telefono}       />

      
      </div>

      {/* Sección de publicaciones */}
      <div className="publications-section">
        <h3>Publicaciones</h3>
        
        <PublicationList 
          tips={publicaciones} 
          user={user}
          onDelete={onDeletePublication}
          onEdit={onEditPublication}
        />
      </div>
    </div>
  );
};

export default UserPublicationsSection;