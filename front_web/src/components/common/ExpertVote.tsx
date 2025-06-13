// components/SolicitudesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { obtenerSolicitudesPendientes } from '../../api/services/Publications/VotesServices';
import { obtenerVotosPorPublicacion, enviarVoto, VotosDTO } from '../../api/services/Publications/VotesServices';
import './ExpertVote.css';

interface Solicitud {
  id: number;
  titulo: string;
  contenido: string;
  descripcion?: string;
  idUsuario: number;
  fechaCreacion?: string;
  nombreAutor?: string;
  fotoPerfil?: string;
  
}

const SolicitudesPage: React.FC = () => {
  const { user, token } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [votos, setVotos] = useState<Record<number, VotosDTO[]>>({});
  const [comentarios, setComentarios] = useState<Record<number, string>>({});
  const [decisiones, setDecisiones] = useState<Record<number, 'ACUERDO' | 'EN_DESACUERDO'>>({});
  const [loading, setLoading] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const navigate = useNavigate();

  // Obtener solicitudes pendientes y sus votos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        console.log("Cargando solicitudes pendientes...");
        const solicitudesData = await obtenerSolicitudesPendientes(token);
        setSolicitudes(solicitudesData);
        
        console.log("Cargando votos para cada solicitud...");
        const votosData: Record<number, VotosDTO[]> = {};
        for (const solicitud of solicitudesData) {
          votosData[solicitud.id] = await obtenerVotosPorPublicacion(solicitud.id, token);
        }
        setVotos(votosData);
        
        console.log("Datos cargados exitosamente");
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token]);

  // Manejar cambio de decisión
  const handleDecisionChange = (idPublicacion: number, decision: 'ACUERDO' | 'EN_DESACUERDO') => {
    setDecisiones(prev => ({
      ...prev,
      [idPublicacion]: decision
    }));
  };

  // Manejar cambio de comentario
  const handleComentarioChange = (idPublicacion: number, comentario: string) => {
    setComentarios(prev => ({
      ...prev,
      [idPublicacion]: comentario
    }));
  };

  // Enviar voto
  const handleEnviarVoto = async (idPublicacion: number) => {
    if (!user?.id || !token || submittingVote) return;
    if (!decisiones[idPublicacion]) {
      alert('Por favor selecciona una decisión');
      return;
    }

    setSubmittingVote(true);
    
    try {
      console.log("=== DEBUG VOTO ===");
      console.log("ID Publicación:", idPublicacion);
      console.log("Decisión:", decisiones[idPublicacion]);
      console.log("Comentario:", comentarios[idPublicacion]);
      console.log("ID Usuario:", user.id);

      const votoData = {
        Voto: decisiones[idPublicacion],
        Comentario: comentarios[idPublicacion] || '',
        idUsuario: user.id,
        idPublicacion,
        nombreAutor: user.nombre,
        fotoPerfil: user.fotoPerfil
      };

      console.log("Enviando voto con datos:", votoData);
      const nuevoVoto = await enviarVoto(votoData, token);
      console.log("Voto enviado exitosamente:", nuevoVoto);

      // Actualizar estado local
      setVotos(prev => ({
        ...prev,
        [idPublicacion]: [...(prev[idPublicacion] || []), nuevoVoto]
      }));

      // Limpiar formulario
      setComentarios(prev => {
        const newState = {...prev};
        delete newState[idPublicacion];
        return newState;
      });
      setDecisiones(prev => {
        const newState = {...prev};
        delete newState[idPublicacion];
        return newState;
      });

      // Recargar datos para asegurar consistencia
      const updatedSolicitudes = await obtenerSolicitudesPendientes(token);
      setSolicitudes(updatedSolicitudes);
      
      const updatedVotos = await obtenerVotosPorPublicacion(idPublicacion, token);
      setVotos(prev => ({
        ...prev,
        [idPublicacion]: updatedVotos
      }));

    } catch (error) {
      console.error("Error al enviar voto:", error);
      alert("Error al enviar voto. Intenta nuevamente.");
    } finally {
      setSubmittingVote(false);
    }
  };



  // Función auxiliar para obtener iniciales de forma segura
  const obtenerIniciales = (nombre?: string): string => {
    if (!nombre || typeof nombre !== 'string') return 'U';
    return nombre.charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className="loading-container">Cargando solicitudes...</div>;
  }

  return (
    <div className="solicitudes-container">
      {/* Botón de notificaciones */}
     

      <h1>Solicitudes Pendientes</h1>

      {solicitudes.length === 0 ? (
        <div className="no-solicitudes">No hay solicitudes pendientes</div>
      ) : (
        solicitudes.map(solicitud => (
          <div key={solicitud.id} className="solicitud-card">
            <div className="solicitud-header">
              <div className="solicitud-avatar voto-avatar ">
               {solicitud.fotoPerfil ? (
                      <img
                        src={solicitud.fotoPerfil}
                        alt="contenido"
                        
                      />
                    ) : (
                      solicitud.nombreAutor?.charAt(0).toUpperCase() || 'U'
                    )}
              </div>
              <div className="solicitud-info">
                <h3>{solicitud.nombreAutor || 'Usuario sin nombre'}</h3>
              </div>
             
            </div>
            <div className="info">
               <p className='title'>{solicitud.titulo}</p>
               <p className='description'> { solicitud.descripcion}</p>
            </div>
            <div className="solicitud-contenido">
               {solicitud.contenido ? (
                      <img
                        src={solicitud.contenido}
                        alt="contenido"
                        
                      />
                    ) : (
                      solicitud.nombreAutor?.charAt(0).toUpperCase() || 'U'
                    )}
            </div>

            {/* Votos existentes */}
            {votos[solicitud.id]?.length > 0 && (
              <div className="votos-container">
                <h4>Votos registrados:</h4>
                <ul className="votos-list">
                  {votos[solicitud.id].map(voto => (
                    <li key={voto.idVotos || Math.random()} className="voto-item">
                      <div className="voto-avatar">
                        {voto.fotoPerfil ? (
                          <img src={voto.fotoPerfil} alt={voto.nombreAutor || 'Avatar'} />
                        ) : (
                          obtenerIniciales(voto.nombreAutor)
                        )}
                      </div>
                      <div className="voto-info">
                        <span className="voto-autor">{voto.nombreAutor || 'Usuario'}</span>
                        <span className={`voto-decision ${voto.Voto?.toLowerCase() || ''}`}>
                          {voto.Voto || 'Sin decisión'}
                        </span>
                        {voto.Comentario && (
                          <p className="voto-comentario">{voto.Comentario}</p>
                        )}
                        <span className="voto-fecha">
                          {voto.fechaVoto ? new Date(voto.fechaVoto).toLocaleString() : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formulario de voto */}
            <div className="voto-form">
              <h4>Tu voto:</h4>
              <div className="voto-opciones">
                <label className={`voto-opcion ${decisiones[solicitud.id] === 'ACUERDO' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name={`decision-${solicitud.id}`}
                    checked={decisiones[solicitud.id] === 'ACUERDO'}
                    onChange={() => handleDecisionChange(solicitud.id, 'ACUERDO')}
                  />
                  <span>Aceptar</span>
                </label>
                <label className={`voto-opcion ${decisiones[solicitud.id] === 'EN_DESACUERDO' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name={`decision-${solicitud.id}`}
                    checked={decisiones[solicitud.id] === 'EN_DESACUERDO'}
                    onChange={() => handleDecisionChange(solicitud.id, 'EN_DESACUERDO')}
                  />
                  <span>Rechazar</span>
                </label>
              </div>

              <div className="voto-comentario-input">
                <label>¿Por qué?</label>
                <textarea
                  value={comentarios[solicitud.id] || ''}
                  onChange={(e) => handleComentarioChange(solicitud.id, e.target.value)}
                  placeholder="Escribe tu justificacion"
                  rows={3}
                />
              </div>

              <button
                onClick={() => handleEnviarVoto(solicitud.id)}
                className="voto-submit-btn"
                disabled={!decisiones[solicitud.id] || submittingVote}
              >
                {submittingVote ? 'Enviando...' : 'Enviar Voto'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SolicitudesPage;