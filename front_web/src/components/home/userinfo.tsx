// components/UserCard.jsx
import React from "react";
import "./userinfo.css"; // Estilos por separado


interface UserCardProps {
  nombre: string;
  puntosTotales: number;
  fotoPerfil?: string; // Puede ser opcional si no siempre hay foto
  nivel:string;
}
const UserCard: React.FC<UserCardProps> = ({ nombre, puntosTotales, fotoPerfil, nivel}) => {
  const xp = puntosTotales || 0;
  const nextLevelXp = 100;
  const porcentaje = Math.min((xp % 100) / nextLevelXp * 100, 100);
  return (
    <div className="user-card">
      <div className="user-card-header" />

      <div className="user-avatar">
        {fotoPerfil ? (
          <img src={fotoPerfil} alt={`Foto de perfil de ${nombre}`} />
        ) : (
          <div className="default-avatar">
            <span>{nombre.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      <h2 className="user-name">{nombre}</h2>

      <div className="xp-bar-container">
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${porcentaje}%` }} />
        </div>
        <div className="xp-info">
          <span>{nivel}</span>
          <span>{xp}xp</span>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
