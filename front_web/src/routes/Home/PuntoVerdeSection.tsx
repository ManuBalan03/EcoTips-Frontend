// routes/Home/Home.tsx
import { useAuth } from "../../api/AuthContext";
import Geolocalization from "../../components/common/GeolocalizationSection/Geolocalization";
import "./PuntoVerde.css";
function PuntoVerdeSection() {
  const { user, isAuthenticated } = useAuth();

  // Si no hay usuario autenticado, mostramos un mensaje
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
      <div className="punto-layout">
        {/* <div className="left-column">
          <UserCard
            nombre={user.nombre}
            fotoPerfil={user?.fotoPerfil}
          />
        </div>
        <div className="center-column"> */}
          <Geolocalization></Geolocalization>
        {/* </div>
        <div className="right-column">
          
        </div> */}
      </div>
    </div>
  );
}

export default PuntoVerdeSection;
