import { useState, useEffect } from "react";
import { crearPublicacion, obtenerTodasLasPublicaciones,PublicacionDTO } from "../../api/services/PublicacionesService";
import { useAuth } from "../../api/AuthContext";
import CommentSection from "../common/CommentComponent";
import '../home/EcoTipCard.css';
const EcoTipsPage = () => {
  const { user, token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tips, setTips] = useState<PublicacionDTO[]>([]);
  
  
  

useEffect(() => {
  const cargarPublicaciones = async () => {
    try {
      if (!token) {
        console.log("No hay token disponible");
        return;
      }
      
      
      const publicaciones = await obtenerTodasLasPublicaciones(token);
      
     
      setTips(publicaciones);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
    }
  };

  cargarPublicaciones();
}, [token]);

  const handleAddTip = async () => {
    if (contenido.trim() && user && token) {
      const nuevaPublicacion: PublicacionDTO = {
        titulo,
        contenido,
        descripcion,
        idUsuario: user.idUsuario!,
        fechaCreacion: new Date().toISOString(),
      };

      try {
        const respuesta = await crearPublicacion(nuevaPublicacion, token);
        setTips([...tips, respuesta]);
        setTitulo('');
        setContenido('');
        setDescripcion('');
        setShowModal(false); // Cierra el modal después de publicar
      } catch (error) {
        console.error("Error publicando tip:", error);
        alert("No se pudo publicar el EcoTip.");
      }
    }
  };

  return (
    <div className="ecotips-container">
      {/* Nuevo diseño del botón como un cuadro de texto con iconos */}
      <div 
        onClick={() => setShowModal(true)}
        className="share-tip-container"
      >
        <div className="share-tip-text">Comparte un tip...</div>
        <div className="share-tip-icons">
          <div className="icon-container">
            <span className="tip-icon camera-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </span>
          </div>
          <div className="icon-container">
            <span className="tip-icon image-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </span>
          </div>
          <div className="icon-container">
            <span className="tip-icon link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Publicar EcoTip</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="close-button"
              >
                &times;
              </button>
            </div>
            
            <div className="form-group">
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título"
                className="form-input"
              />
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Comparte tu tip.."
                className="form-textarea"
              />
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="imagen"
                className="form-input"
                rows={4}
              />
              <div className="formatting-toolbar">
                <button type="button" className="format-button">B</button>
                <button type="button" className="format-button">I</button>
                <button type="button" className="format-button">U</button>
                <div className="tag-selector">
                  <select className="tag-dropdown">
                    <option>Seleccionar etiqueta</option>
                    <option>Reciclaje</option>
                    <option>Jardinería</option>
                    <option>Energía</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleAddTip}
                className="publish-button"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
<h4>Tips del dia</h4>
<hr></hr>
<div className="tips-list">
  {Array.isArray(tips) ? (
    tips.map((tip) => (
      <div key={tip.id} className="tip-card">
        <h4>{tip.titulo}</h4>

        {tip.contenido && tip.contenido.startsWith("http") ? (
          <img src={tip.contenido} alt="EcoTip" className="tip-image" />
        ) : (
          <p className="tip-content">{tip.contenido}</p>
        )}

        {tip.descripcion && (
          <div className="tags-container">
            {tip.descripcion.split(',').map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}

        <small className="author-info">
          Publicado por: {tip.nombreAutor || user?.nombre}
        </small>

                      {tip.id && (
                <CommentSection 
                  idPublicacion={tip.id}
                  onCommentAdded={() => console.log("Comentario agregado")}
                  onReactionUpdated={() => console.log("Reacción actualizada")}
                />
              )}

      </div>
    ))
  ) : (
    <p>No se encontraron publicaciones.</p>
  )}
</div>


    </div>
  );
};

export default EcoTipsPage;