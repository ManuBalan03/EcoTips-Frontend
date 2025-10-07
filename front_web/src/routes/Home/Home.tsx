// routes/Home/Home.tsx
import { useAuth } from "../../api/AuthContext";
import UserCard from "../../components/home/userinfo";
import EcoTipsPage from "../../components/home/EcotipCard";
import "./Home.css";

function Home() {
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
      <div className="home-layout">
        <div className="left-column">
          <UserCard
            nombre={user.nombre}
            fotoPerfil={user.fotoPerfil}
          />
        </div>
        <div className="center-column">
          <EcoTipsPage />
        </div>
        <div className="right-column">
          {/* Espacio reservado para contenido futuro */}
        </div>
      </div>
    </div>
  );
}

export default Home;