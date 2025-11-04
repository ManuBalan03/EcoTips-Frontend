// routes/Home/Home.tsx
import { useAuth } from "../../api/AuthContext";
import UserCard from "../../components/home/userinfo";
import EcoTipsPage from "../../components/home/EcotipCard";
import { obtenerUsuarioPorId } from "../../api/services/UserService";
import { UsuarioDTO } from "../../api/types/UserTypes";
import { useState, useEffect, useRef } from "react";
import "./Home.css";

function Home() {
  const { user, isAuthenticated, token, updateUser } = useAuth();
  const [userCompleto, setUserCompleto] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // 👈 Referencia para controlar llamadas

  // 👇 useEffect CORREGIDO - Solo se ejecuta una vez
  useEffect(() => {
    // 🔒 Prevenir múltiples ejecuciones
    if (hasFetched.current || !user?.idUsuario || !token) {
      setLoading(false);
      return;
    }

    const cargarUsuario = async () => {
      try {
        console.log('🔄 Cargando datos del usuario...');
        const usuarioData = await obtenerUsuarioPorId(user.idUsuario, token);
        setUserCompleto(usuarioData);
        updateUser(usuarioData);
        hasFetched.current = true; // 👈 Marcar como ya cargado
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        // Si falla la API, mostramos el usuario del contexto
        setUserCompleto(user);
      } finally {
        setLoading(false);
      }
    };
   
    cargarUsuario();
  }, [user?.idUsuario, token, updateUser]); // 👈 Dependencias específicas

  // 🎯 Efecto para resetear cuando el usuario cambie
  useEffect(() => {
    // Si el usuario cambia, resetear el flag
    hasFetched.current = false;
    setUserCompleto(null);
    setLoading(true);
  }, [user?.idUsuario]); // 👈 Solo cuando cambia el ID del usuario

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
        <div className="loading-spinner">🔄 Cargando información...</div>
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