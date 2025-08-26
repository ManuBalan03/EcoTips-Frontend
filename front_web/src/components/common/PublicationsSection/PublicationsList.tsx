import { PublicacionDTO } from "../../../api/services/PublicacionesService";
import EcoTipCard from "./PublicationCard";

interface Props {
  tips: PublicacionDTO[];
  user: any;
onDelete?: (id: number) => void;  // Añade el parámetro number
  onEdit?: (id: number) => void; 
}

const PublicationList = ({ tips, user, onDelete, onEdit }: Props) => {
  if (!tips.length) return <p>No se encontraron publicaciones.</p>;


return (
    <div className="tips-list">
      {tips.map((tip) => (
        <EcoTipCard 
          key={tip.id} 
          tip={tip} 
          user={user}
          onDelete={onDelete ? () => onDelete(tip.id!) : undefined}
          onEdit={onEdit ? () => onEdit(tip.id!) : undefined}
        />
      ))}
    </div>
  );
};



export default PublicationList;
