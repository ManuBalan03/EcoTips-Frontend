// components/NotificationsPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { 
  obtenerNotificacionesPorUsuario, 
  marcarComoLeida, 
  NotificationsDTO 
} from '../../api/services/UserServices/NotificacionesService';
import SolicitudesList from './SolicitudesExpert/SolicitudesList';
import SolicitudDetail from './SolicitudesExpert/SolicitudDetail';
import EvaluationList from './SolicitudesEvaluation/EvaluationList';
import EvaluacionDetail from './SolicitudesEvaluation/EvaluationsDetail';
import './NotificationsPanel.css';

type ActiveTab = 'notificaciones' | 'solicitudes' | 'evaluaciones';
type SolicitudesView = 'list' | 'detail';

const NotificationsPanel: React.FC = () => {
  const { user, token } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificationsDTO[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('notificaciones');
  const [solicitudesView, setSolicitudesView] = useState<SolicitudesView>('list');
  const [selectedSolicitud, setSelectedSolicitud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const navigate = useNavigate();
  const [evaluacionesView, setEvaluacionesView] = useState<'list' | 'detail'>('list');
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<number | null>(null);

  // Obtener notificaciones
  useEffect(() => {
    if (!user?.id || !token || activeTab !== 'notificaciones') return;

    const userId = Number(user.id);
    if (isNaN(userId)) {
      setError("ID de usuario inválido");
      return;
    }

    const cargarNotificaciones = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await obtenerNotificacionesPorUsuario(userId, token);
        setNotificaciones(data);
        setVisibleCount(5);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setError("No se pudieron cargar las notificaciones");
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, [user, token, activeTab]);

  const handleNotificationClick = async (notificacion: NotificationsDTO) => {
    if (!user?.id || !token || !notificacion.id) return;

    try {
      if (!notificacion.leida) {
        await marcarComoLeida(notificacion.id, token);
        setNotificaciones(prev => 
          prev.map(n => 
            n.id === notificacion.id ? { ...n, leida: true } : n
          )
        );
      }
      
      if (notificacion.tipo === 'Solicitud Publicacion' && notificacion.idPublicacion) {
        setActiveTab('solicitudes');
        setSelectedSolicitud(notificacion.idPublicacion);
        setSolicitudesView('detail');
      } else if (notificacion.idPublicacion) {
        navigate(`/publicacion/${notificacion.idPublicacion}`);
      }
    } catch (error) {
      console.error("Error al manejar la notificación:", error);
    }
  };

  const handleBackToList = () => {
    setSolicitudesView('list');
    setSelectedSolicitud(null);
  };

  const getNotificationIcon = (tipo?: string) => {
    switch(tipo) {
      case 'aceptada': return '✅';
      case 'rechazada': return '❌';
      case 'Comentario': return '💬';
      case 'Reaccion': return '❤️';
      case 'Solicitud Publicacion': return '📝';
      case 'Publicacion': return '⏳';
      case 'modificaciones': return '✏️';
      default: return '🔔';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredNotifications = () => {
    return notificaciones.slice(0, visibleCount);
  };

  return (
    <div className="notifications-container">
      {/* Botones de navegación */}
      <div className="notifications-nav">
        <button 
          className={`nav-button ${activeTab === 'notificaciones' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('notificaciones');
            setSolicitudesView('list');
            setSelectedSolicitud(null);
          }}
        >
          🔔 Notificaciones
          {notificaciones.some(n => !n.leida) && (
            <span className="unread-badge">
              {notificaciones.filter(n => !n.leida).length}
            </span>
          )}
        </button>
        <button 
          className={`nav-button ${activeTab === 'solicitudes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('solicitudes');
            setSolicitudesView('list');
            setSelectedSolicitud(null);
          }}
        >
          📝 Solicitudes
        </button>
        <button 
          className={`nav-button ${activeTab === 'evaluaciones' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('evaluaciones');
            setSolicitudesView('list');
            setSelectedSolicitud(null);
          }}
        >
           Evaluaciones
        </button>
      </div>

      {/* Contenido del panel */}
      <div className="notifications-content">
        {activeTab === 'solicitudes' ? (
          solicitudesView === 'detail' && selectedSolicitud ? (
            <SolicitudDetail 
              solicitudId={selectedSolicitud} 
              onBack={handleBackToList}
            />
          ) : (
            <SolicitudesList 
              onSelectSolicitud={(id) => {
                setSelectedSolicitud(id);
                setSolicitudesView('detail');
              }}
            />
          )
        ) : activeTab === 'evaluaciones' ? (
        evaluacionesView === 'detail' && selectedEvaluacion ? (
          <EvaluacionDetail 
            evaluacionId={selectedEvaluacion}
            onBack={() => {
              setSelectedEvaluacion(null);
              setEvaluacionesView('list');
            }}
          />
        ) : (
          <EvaluationList 
            onSelectEvaluacion={(id: number) => {
              setSelectedEvaluacion(id);
              setEvaluacionesView('detail');
            }}
          />
        )
      ) : (
          <>
            {loading ? (
              <div className="loading-message">
                <div className="spinner"></div>
                <p>Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
              </div>
            ) : (
              <>
                <div className="notifications-list">
                  {getFilteredNotifications().length === 0 ? (
                    <div className="empty-message">
                      No hay notificaciones
                    </div>
                  ) : (
                    getFilteredNotifications().map(notificacion => (
                      <div 
                        key={notificacion.id || Math.random()}
                        className={`notification-item ${notificacion.leida ? 'read' : 'unread'}`}
                        onClick={() => handleNotificationClick(notificacion)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notificacion.tipo)}
                        </div>
                        <div className="notification-details">
                          <h3>{notificacion.tipo}</h3>
                          {notificacion.mensaje && (
                            <p className="notification-content">{notificacion.mensaje}</p>
                          )}
                          <p className="notification-date">
                            {formatDateTime(notificacion.fechaEnvio)}
                          </p>
                        </div>
                        {!notificacion.leida && <div className="unread-dot"></div>}
                      </div>
                    ))
                  )}
                </div>

                {notificaciones.length > visibleCount && (
                  <button 
                    className="load-more-btn"
                    onClick={() => setVisibleCount(prev => prev + 5)}
                  >
                    Ver más notificaciones
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;