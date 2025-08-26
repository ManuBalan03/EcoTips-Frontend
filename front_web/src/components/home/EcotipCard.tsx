import { useState, useEffect } from "react";
import { crearPublicacion, obtenerTodasLasPublicaciones, PublicacionDTO } from "../../api/services/PublicacionesService";
import { useAuth } from "../../api/AuthContext";
import EcoTipFormModal from "../../components/common/PublicationsSection/PublicationFormModal";
import PublicationsList from "../../components/common/PublicationsSection/PublicationsList";
import "./EcoTipCard.css";




const EcoTipsPage = () => {
  const { user, token } = useAuth();
  const [tips, setTips] = useState<PublicacionDTO[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      if (!token) return;
      try {
        const publicaciones = await obtenerTodasLasPublicaciones(token);
        setTips(publicaciones);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };
    cargarPublicaciones();
  }, [token]);

  const handleAddTip = async (nuevo: PublicacionDTO) => {
    if (!token) return;
    try {
      const respuesta = await crearPublicacion(nuevo, token);
      setTips([...tips, respuesta]);
      setShowModal(false);
    } catch (error) {
      console.error("Error publicando tip:", error);
      alert("No se pudo publicar el EcoTip.");
    }
  };

  return (
    <div className="ecotips-container">
      <div 
        onClick={() => setShowModal(true)} 
        className="share-tip-container"
      >
        <div className="share-tip-text">Comparte un tip...</div>
        <div className="share-tip-icons"> {/* íconos aquí */} </div>
      </div>

      {showModal && (
        <EcoTipFormModal 
          onClose={() => setShowModal(false)} 
          onPublish={handleAddTip} 
          user={user}
        />
      )}

      <h4>Tips del día</h4>
      <hr />
      <PublicationsList tips={tips} user={user} />
    </div>
  );
};

export default EcoTipsPage;
