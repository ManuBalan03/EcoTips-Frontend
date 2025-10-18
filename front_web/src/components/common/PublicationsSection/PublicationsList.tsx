import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";
import EcoTipCard from "./PublicationCard";

interface Props {
  publicaciones: PublicacionDTO[];
  user: any;
onDelete?: (id: number) => void;  // Añade el parámetro number
  onEdit?: (id: number) => void; 
}

const PublicationList = ({ publicaciones, user, onDelete, onEdit }: Props) => {
  if (!publicaciones.length) return <p>No se encontraron publicaciones.</p>;


return (
    <div className="tips-list">
      {publicaciones.map((publicacion, index) => (
        <EcoTipCard 
          key={`${publicacion.id}-${index}`}
          tip={publicacion} 
          user={user}
          onDelete={onDelete ? () => onDelete(publicacion.id!) : undefined}
          onEdit={onEdit ? () => onEdit(publicacion.id!) : undefined}
        />
      ))}
    </div>
  );
};



export default PublicationList;
