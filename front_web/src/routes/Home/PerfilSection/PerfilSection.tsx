import { useAuth } from "../../../api/AuthContext";
import UserPublicationsSection from "../../../components/common/PublicationsSection/PublicationsUser";
import UserPerfil from "../../../components/common/UserSection/UserPerfil";

import './PerfilSection.css'

function PerfilSection() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return (
        <div className="home-container">
          <div className="message-container">
            <h2>No has iniciado sesión</h2>
            <p>Por favor, inicia sesión para ver tu información personal.</p>
            <a href="/login" className="login-button">Iniciar Sesión</a>
          </div>
        </div>
    );
  }
  return (
      <div className="home-container">
    

    <UserPerfil 
          nombre={user.nombre}
          fotoPerfil={user.fotoPerfil}
          nivel={user.nivel}
          email={user.email} 
          idUsuario={user.idUsuario} 
          telefono={user.telefono}       />
        
        <UserPublicationsSection 
        
        />
      </div>
  );
}

export default PerfilSection;