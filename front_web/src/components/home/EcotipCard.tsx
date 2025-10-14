// EcoTipsPage.tsx
import { useState } from "react";
import { crearPublicacion, obtenerTodasLasPublicaciones } from "../../api/services/Publications/PublicacionesService";
import { PublicacionDTO } from "../../api/services/Publications/Types/PublicationType";
import { useAuth } from "../../api/AuthContext";
import EcoTipFormModal from "../../components/common/PublicationsSection/PublicationFormModal";
import PublicationsList from "../../components/common/PublicationsSection/PublicationsList";
import "./EcoTipCard.css";
import { uploadImageToS3 } from "../../api/services/s3Services";
import { useInfiniteScroll } from "../../api/hooks/useInfiniteScroll";

const EcoTipsPage = () => {
  const { user, token } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // 👇 Hook scroll infinito
  const {
    items: tips,
    loading,
    error,
    hasMore,
    loadMore
  } = useInfiniteScroll<PublicacionDTO>(
    async (page, size) => {
      if (!token) return { content: [], totalPages: 0, totalElements: 0 };
      // Debes tener un endpoint paginado
      const data = await obtenerTodasLasPublicaciones( token, "APROBADA",page,size);
      return {
        content: data.content,
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0
      };
    },
    5, // tamaño de página
    { idField: "idPublicacion" } // 👈 ajusta este campo al que usa tu DTO
  );

  const handleAddTip = async (nuevo: PublicacionDTO, file?: File) => {
    if (!token) return;
    try {
      if (file) {
        const key = await uploadImageToS3(file, token);
        nuevo.contenido_key = key;
      }

      const respuesta = await crearPublicacion(nuevo, token);

      // Opcional: puedes resetear el scroll para que vuelva a cargar desde la primera página
      

      setShowModal(false);
    } catch (error) {
      console.error("Error publicando tip:", error);
      alert("No se pudo publicar el EcoTip.");
    }
  };

  return (
    <div className="ecotips-container">
      <div onClick={() => setShowModal(true)} className="share-tip-container">
        <div className="share-tip-text">Comparte un tip...</div>
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

      {/* 🧠 Lista de publicaciones con scroll infinito */}
      <PublicationsList publicaciones={tips} user={user} />

      {/* Loader / Error / Load more */}
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {hasMore && (
        <button onClick={loadMore} disabled={loading} className="load-more-btn">
          Ver más
        </button>
      )}
    </div>
  );
};

export default EcoTipsPage;
