import React, { useState, useEffect } from "react";
import { useAuth } from "../../../api/AuthContext";
import { crearEvaluacion } from "../../../api/services/Publications/EvaluateServices";
import { obtenerVotosPorPublicacion, VotosDTO } from "../../../api/services/Publications/VotesServices";
import { obtenerPublicacionPorId } from "../../../api/services/Publications/PublicacionesService";
import { useUserPoints } from "../../../context/UserPointsContext";
import "./Evaluation.css";
import { PublicacionDTO } from "../../../api/services/Publications/Types/PublicationType";

interface EvaluacionDetailProps {
  evaluacionId: number;
  onBack: () => void;
  onRefreshNotifications?: () => void;
}

type Veredicto = "APROBADA" | "RECHAZADA" | "MODIFICACION";

const EvaluacionDetail: React.FC<EvaluacionDetailProps> = ({ evaluacionId, onBack, onRefreshNotifications }) => {
  const { user, token } = useAuth();
  const [publicacion, setPublicacion] = useState<PublicacionDTO | null>(null);
  const [votos, setVotos] = useState<VotosDTO[]>([]);
  const [comentario, setComentario] = useState("");
  const [veredicto, setVeredicto] = useState<Veredicto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshPoints } = useUserPoints();

  useEffect(() => {
    if (!token || !evaluacionId) return;
    let isMounted = true;
    setLoading(true);

    const cargarDetalles = async () => {
      try {
        const [publicacionData, votosData] = await Promise.all([
          obtenerPublicacionPorId(evaluacionId, token),
          obtenerVotosPorPublicacion(evaluacionId, token),
        ]);
        if (isMounted) {
          setPublicacion(publicacionData as PublicacionDTO);
          setVotos(votosData);
        }
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        if (isMounted) setError("No se pudieron cargar los detalles");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    cargarDetalles();
    return () => { isMounted = false; };
  }, [evaluacionId, token]);

  const handleEnviarEvaluacion = async () => {
    if (!user?.idUsuario || !token || !veredicto || !publicacion) return;
    setSubmitting(true);
    setError(null);

    try {
      await crearEvaluacion({
        veredicto,
        comentario_final: comentario,
        idpublicacion: publicacion.id || 0,
        idUsuario: user.idUsuario,
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil,
        fecha_evaluacion: new Date().toISOString(),
      }, token);

      await refreshPoints();
      const votosActualizados = await obtenerVotosPorPublicacion(evaluacionId, token);
      setVotos(votosActualizados);
      onRefreshNotifications?.();
      onBack();
    } catch (err) {
      console.error("Error al enviar evaluación:", err);
      setError("No se pudo enviar la evaluación. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    }) : "Fecha no disponible";

  const obtenerIniciales = (nombre?: string) => nombre ? nombre.charAt(0).toUpperCase() : "U";
  const obtenerIconoVeredicto = (v: Veredicto) => v === "APROBADA" ? "👍" : v === "RECHAZADA" ? "👎" : "✏️";

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!publicacion) return <p>No se encontró la evaluación solicitada</p>;

  return (
    <div className="evaluation-detail-container">
      <button onClick={onBack} className="back-button">Volver</button>

      <div className="evaluation-header">
        <div className="evaluacion-avatar">
          {publicacion.fotoPerfil ? <img src={publicacion.fotoPerfil} alt={publicacion.nombreAutor} /> :
            <div className="avatar-initial">{obtenerIniciales(publicacion.nombreAutor)}</div>}
        </div>
        <div className="evaluation-meta">
           <h2>{publicacion.titulo}</h2>
          <p className="author">{publicacion.nombreAutor || 'Usuario'}</p>
          <p className="date">{formatDate(publicacion.fechaCreacion)}</p>
        </div>
      </div>

      <div className="evaluation-content">
        <section className="description-section">
          <h2>Descripción</h2>
          <p>{publicacion.descripcion || 'Sin descripción'}</p>
        </section>

        <section className="content-section">
          <h2>Contenido</h2>
          {publicacion.url_key ? <div className="content-display"><img src={publicacion.url_key} alt="Contenido" /></div> :
            <p>No hay contenido adjunto</p>}
        </section>

        <section className="votes-section">
          <h2>Votos ({votos.length})</h2>
          {votos.length === 0 ? <p className="no-votes">Aún no hay votos registrados</p> :
            <div className="votes-list">
              {votos.map(voto => (
                <div key={voto.idVotos} className="vote-item">
                  <div className="vote-avatar">
                    {voto.fotoPerfil ? <img src={voto.fotoPerfil} alt={voto.nombreAutor} /> :
                      <div className="avatar-initial-small">{obtenerIniciales(voto.nombreAutor)}</div>}
                  </div>
                  <div className="vote-details">
                    <div className="vote-header">
                      <span className="vote-author">{voto.nombreAutor}</span>
                      <span className={`vote-decision ${voto.Voto?.toLowerCase()}`}>{obtenerIconoVeredicto(voto.Voto as Veredicto)} {voto.Voto}</span>
                    </div>
                    {voto.Comentario && <p className="vote-comment">{voto.Comentario}</p>}
                    <span className="vote-date">{voto.fechaVoto ? formatDate(voto.fechaVoto) : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        </section>

        <section className="evaluation-form">
          <h2>Tu evaluación</h2>
          <div className="veredict-options">
            <label><input type="radio" name="veredicto" checked={veredicto === 'APROBADA'} onChange={() => setVeredicto('APROBADA')} /> 👍 Aprobar</label>
            <label><input type="radio" name="veredicto" checked={veredicto === 'RECHAZADA'} onChange={() => setVeredicto('RECHAZADA')} /> 👎 Rechazar</label>
            <label><input type="radio" name="veredicto" checked={veredicto === 'MODIFICACION'} onChange={() => setVeredicto('MODIFICACION')} /> ✏️ Requiere modificaciones</label>
          </div>
          <textarea className="evaluation-text" value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Explica tu decisión..." rows={3} />
          <button className="back-button " onClick={handleEnviarEvaluacion} disabled={!veredicto || submitting}>
            {submitting ? 'Enviando...' : 'Enviar Voto'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default EvaluacionDetail;
