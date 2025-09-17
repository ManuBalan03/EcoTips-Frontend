import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";
import CommentSection from "../CommentComponent";
interface Props {
  tip: PublicacionDTO;
  user: any;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const EcoTipCard = ({ tip, user, onDelete, onEdit }: Props) => {
  const isAuthor = tip.idUsuario === user?.id;

  // Funciones adaptadoras para los eventos
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onDelete) onDelete(tip.id!);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onEdit) onEdit(tip.id!);
  };

  return (
    <div className="tip-card">
      <h4>{tip.titulo}</h4>

      {tip.contenido?.startsWith("http") ? (
        <img src={tip.contenido} alt="EcoTip" className="tip-image" />
      ) : (
        <p className="tip-content">{tip.contenido}</p>
      )}

      {tip.descripcion && (
        <div className="tags-container">
          {tip.descripcion.split(",").map((tag, i) => (
            <span key={i} className="tag">{tag.trim()}</span>
          ))}
        </div>
      )}

      <small className="author-info">
        Publicado por: {tip.nombreAutor || user?.nombre}
      </small>

      {isAuthor && (onDelete || onEdit) && (
        <div className="publication-actions">
          {onEdit && <button onClick={handleEdit} className="edit-btn">Modificar</button>}
          {onDelete && <button onClick={handleDelete} className="delete-btn">Eliminar</button>}
        </div>
      )}

      {tip.id && (
        <CommentSection
          idPublicacion={tip.id}
          onCommentAdded={() => console.log("Comentario agregado")}
          onReactionUpdated={() => console.log("Reacción actualizada")}
        />
      )}
    </div>
  );
};

export default EcoTipCard;
