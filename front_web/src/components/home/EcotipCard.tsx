import { useState, useEffect } from "react";
import { crearPublicacion, obtenerTodasLasPublicaciones } from "../../api/services/Publications/PublicacionesService";
import {PublicacionDTO} from "../../api/services/Publications/Types/PublicationType"
import { useAuth } from "../../api/AuthContext";
import EcoTipFormModal from "../../components/common/PublicationsSection/PublicationFormModal";
import PublicationsList from "../../components/common/PublicationsSection/PublicationsList";
import "./EcoTipCard.css";
import {uploadImageToS3} from "../../api/services/s3Services";




const EcoTipsPage = () => {
  const { user, token } = useAuth();
  const [tips, setTips] = useState<PublicacionDTO[]>([]);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const cargarPublicaciones = async () => {
      if (!token) return;
      try {
        const publicaciones = await obtenerTodasLasPublicaciones(token);
        console.log(publicaciones)
        setTips(publicaciones.content);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };
    cargarPublicaciones();
  }, [token]);

 const handleAddTip = async (nuevo: PublicacionDTO, file?: File) => {
  if (!token) return;
  try {
    // 📤 1. Si hay imagen, primero súbela a S3
    if (file) {
      const key = await uploadImageToS3(file, token);
      console.log("key  ")
      console.log(key)
      nuevo.contenido_key = key;
    }

    // 📝 2. Luego guarda la publicación con la key en la BD
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
