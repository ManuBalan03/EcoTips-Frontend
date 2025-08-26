import React from "react";
import { useAuth } from "../../api/AuthContext";
import DefaultLayout from "../../components/layout/navbar";
import UserCard from "../../components/home/userinfo";
import EcoTipsPage from "../../components/home/EcotipCard";
import "./Home.css";

function Home() {
  const { user, isAuthenticated } = useAuth();

  // Si no hay usuario autenticado, mostramos un mensaje
  if (!isAuthenticated || !user) {
    return (
      <DefaultLayout>
        <div className="home-container">
          <div className="message-container">
            <h2>No has iniciado sesión</h2>
            <p>Por favor, inicia sesión para ver tu información personal.</p>
            <a href="/login" className="login-button">Iniciar Sesión</a>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="home-container">
        <div className="home-layout">
          {/* Columna izquierda: UserCard */}
          <div className="left-column">
            <UserCard
              nombre={user.nombre}
              fotoPerfil={user.fotoPerfil}
              nivel={user.nivel}
            />
          </div>
          
          {/* Columna central: EcoTipsPage */}
          <div className="center-column">
            <EcoTipsPage />
          </div>
          
          {/* Columna derecha: Espacio vacío para contenido futuro */}
          <div className="right-column">
            {/* Espacio reservado para contenido futuro */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Home;