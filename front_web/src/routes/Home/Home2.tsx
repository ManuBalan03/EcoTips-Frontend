import React from "react";
import { useAuth } from "../../api/AuthContext";
import NavMainLayout from "../../components/layout/NavMainLayout";
import UserCard from "../../components/home/userinfo";
// import  SolicitudesPage from "../../components/common/ExpertVote";
import "./Home.css";

function Home() {
  const { user, isAuthenticated } = useAuth();

  // Si no hay usuario autenticado, mostramos un mensaje
  if (!isAuthenticated || !user) {
    return (
      <NavMainLayout>
        <div className="home-container">
          <div className="message-container">
            <h2>No has iniciado sesión</h2>
            <p>Por favor, inicia sesión para ver tu información personal.</p>
            <a href="/login" className="login-button">Iniciar Sesión</a>
          </div>
        </div>
      </NavMainLayout>
    );
  }

  return (
    <NavMainLayout>
      <div className="home-container">
        <div className="home-layout">
          {/* Columna izquierda: UserCard */}
          <div className="left-column">
            <UserCard
              nombre={user.nombre}
              fotoPerfil={user.fotoPerfil}
            />
          </div>
          
          {/* Columna central: EcoTipsPage */}
          <div className="center-column">
            {/* < SolicitudesPage /> */}
          </div>
          
          {/* Columna derecha: Espacio vacío para contenido futuro */}
          <div className="right-column">
            {/* Espacio reservado para contenido futuro */}
          </div>
        </div>
      </div>
    </NavMainLayout>
  );
}

export default Home;