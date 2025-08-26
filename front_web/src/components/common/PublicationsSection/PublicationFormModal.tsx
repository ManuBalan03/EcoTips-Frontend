import { useState } from "react";
import { PublicacionDTO } from "../../../api/services/PublicacionesService";

interface Props {
  onClose: () => void;
  onPublish: (nuevo: PublicacionDTO) => void;
  user: any;
}

const EcoTipFormModal = ({ onClose, onPublish, user }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");

  const handleSubmit = () => {
    if (!user) return;
    const nuevaPublicacion: PublicacionDTO = {
      titulo,
      contenido,
      descripcion,
      idUsuario: user.id!,
      fechaCreacion: new Date().toISOString(),
    };
    onPublish(nuevaPublicacion);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Publicar EcoTip</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="form-group">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
          <textarea value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Contenido o URL" rows={4} />
          <button onClick={handleSubmit} className="publish-button">Publicar</button>
        </div>
      </div>
    </div>
  );
};

export default EcoTipFormModal;
