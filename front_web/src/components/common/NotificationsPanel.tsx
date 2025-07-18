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
import DetailsPublication from './Publication/PublicationDetail';

type ActiveTab = 'notificaciones' | 'solicitudes' | 'evaluaciones' | 'publicacion';
type SolicitudesView = 'list' | 'detail';
type PublicacionView = 'list' | 'detail'; 

const NotificationsPanel: React.FC = () => {
  const [publicacionView, setPublicacionView] = useState<PublicacionView>('list');
  const { user, token } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificationsDTO[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('notificaciones');
  const [solicitudesView, setSolicitudesView] = useState<SolicitudesView>('list');
  const [selectedSolicitud, setSelectedSolicitud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedPublicacion, setSelectedPublicacion] = useState<number | null>(null);
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
    if (!user?.id || !token) return;

    // Usar la propiedad correcta del objeto
    const notificationId = notificacion.idNotificacion;
    const publicacionId = notificacion.idPublicacion;

    console.log('Notificación clickeada:', notificacion);
    console.log('ID de notificación:', notificationId);
    console.log('ID de publicación:', publicacionId);

    if (!notificationId) {
      console.error('No se encontró ID de notificación');
      return;
    }

    
      // Marcar como leída usando la propiedad correcta
      if (!notificacion.leido) { // Usar 'leido' en lugar de 'leida'
        await marcarComoLeida(notificationId, token);
        setNotificaciones(prev => 
          prev.map(n => {
            const nId =n.idNotificacion;
            return nId === notificationId ? { ...n, leido: true } : n;
          })
        );
      }
        
      // Navegar según el tipo de notificación
      if (notificacion.tipo === 'Solicitud Publicacion' && publicacionId) {
        setActiveTab('solicitudes');
        setSelectedSolicitud(publicacionId);
        setSolicitudesView('detail');
        // Limpiar otros estados
        setSelectedPublicacion(null);
        setPublicacionView('list');
        setSelectedEvaluacion(null);
        setEvaluacionesView('list');
      } else if (publicacionId) {
        console.log('Navegando a publicación:', publicacionId);
        console.log('Tipo de notificación:', notificacion.tipo);
        
        setSelectedPublicacion(publicacionId);
        setPublicacionView('detail');
        // Limpiar otros estados
        setSelectedSolicitud(null);
        setSolicitudesView('list');
        setSelectedEvaluacion(null);
        setEvaluacionesView('list');
      }
      
    
  };

  const handleBackToList = () => {
    setSolicitudesView('list');
    setSelectedSolicitud(null);
  };



  const resetAllStates = () => {
    setSolicitudesView('list');
    setPublicacionView('list');
    setSelectedSolicitud(null);
    setSelectedPublicacion(null);
    setSelectedEvaluacion(null);
    setEvaluacionesView('list');
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

  // Función para renderizar el contenido principal
  const renderContent = () => {
   
    // Verificar cada condición paso a paso
    const isNotificacionesTab = activeTab === 'notificaciones';
    const isDetailView = publicacionView === 'detail';
    const hasSelectedPublicacion = selectedPublicacion !== null;
    
  
    
    const shouldShowPublicacion = isNotificacionesTab && isDetailView && hasSelectedPublicacion;
  
    if (shouldShowPublicacion) {
      console.log('✅ MOSTRANDO DetailsPublication con ID:', selectedPublicacion);
      return (
        <DetailsPublication 
          publicacionId={selectedPublicacion}
          onBack={() => {
            console.log('Ejecutando onBack...');
            setSelectedPublicacion(null);
            setPublicacionView('list');
          }}
        />
      );
    }
    
    // Si estamos en el tab de solicitudes
    if (activeTab === 'solicitudes') {
      if (solicitudesView === 'detail' && selectedSolicitud) {
        return (
          <SolicitudDetail 
            solicitudId={selectedSolicitud} 
            onBack={handleBackToList}
          />
        );
      } else {
        return (
          <SolicitudesList 
            onSelectSolicitud={(id) => {
              setSelectedSolicitud(id);
              setSolicitudesView('detail');
            }}
          />
        );
      }
    }

    // Si estamos en el tab de evaluaciones
    if (activeTab === 'evaluaciones') {
      if (evaluacionesView === 'detail' && selectedEvaluacion) {
        return (
          <EvaluacionDetail 
            evaluacionId={selectedEvaluacion}
            onBack={() => {
              setSelectedEvaluacion(null);
              setEvaluacionesView('list');
            }}
          />
        );
      } else {
        return (
          <EvaluationList 
            onSelectEvaluacion={(id: number) => {
              setSelectedEvaluacion(id);
              setEvaluacionesView('detail');
            }}
          />
        );
      }
    }

    // Por defecto, mostrar notificaciones
    return (
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
                getFilteredNotifications().map(notificacion => {
                  const notificationId = notificacion.idNotificacion;
                  return (
                    <div 
                      key={notificationId || Math.random()}
                      className={`notification-item ${notificacion.leido ? 'read' : 'unread'}`}
                      onClick={() => {
                        console.log('🔥 CLICK EN NOTIFICACIÓN DETECTADO', notificacion);
                        handleNotificationClick(notificacion);
                      }}
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
                      {!notificacion.leido && <div className="unread-dot"></div>}
                    </div>
                  );
                })
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
    );
  };

  return (
    <div className="notifications-container">
      {/* Botones de navegación */}
      <div className="notifications-nav">
        <button 
          className={`nav-button ${activeTab === 'notificaciones' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('notificaciones');
            resetAllStates();
          }}
        >
          🔔 Notificaciones
          {notificaciones.some(n => !n.leido) && (
            <span className="unread-badge">
              {notificaciones.filter(n => !n.leido).length}
            </span>
          )}
        </button>
        <button 
          className={`nav-button ${activeTab === 'solicitudes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('solicitudes');
            resetAllStates();
          }}
        >
          📝 Solicitudes
        </button>
        <button 
          className={`nav-button ${activeTab === 'evaluaciones' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('evaluaciones');
            resetAllStates();
          }}
        >
          Evaluaciones
        </button>
       
      </div>

      {/* Contenido del panel */}
      <div className="notifications-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default NotificationsPanel;