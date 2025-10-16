// routes/Home/Home.tsx
import { useAuth } from "../../api/AuthContext";
import UserCard from "../../components/home/userinfo";
import EcoTipsPage from "../../components/home/EcotipCard";
import { obtenerUsuarioPorId } from "../../api/services/UserService";
import { UsuarioDTO } from "../../api/types/UserTypes";
import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const { user, isAuthenticated, token, updateUser } = useAuth();
  const [userCompleto, setUserCompleto] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // 👇 useEffect para cargar el usuario completo desde la API
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!user || !token) return;

      try {
        const usuarioData = await obtenerUsuarioPorId(user.idUsuario, token);
        setUserCompleto(usuarioData);
        updateUser(usuarioData); //
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        // Si falla la API, mostramos el usuario del contexto
        setUserCompleto(user);
  
      } finally {
        setLoading(false);
      }
    };
   
    cargarUsuario();
  }, [user, token]);

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

  if (loading) {
    return (
      <div className="home-container">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-layout">
        <div className="left-column">
          <UserCard
            nombre={userCompleto?.nombre || user.nombre}
            fotoPerfil={userCompleto?.fotoPerfil}
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
