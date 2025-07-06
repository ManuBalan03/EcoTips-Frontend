// components/NotificationsPanel.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { 
  obtenerNotificacionesPorUsuario, 
  marcarComoLeida, 
  NotificationsDTO 
} from '../../api/services/UserServices/NotificacionesService';
import './NotificationsPanel.css';

const NotificationsPanel: React.FC = () => {
  const { user, token } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificationsDTO[]>([]);
  const [activeTab, setActiveTab] = useState<'notificaciones' | 'solicitudes' | 'evaluaciones'>('notificaciones');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtener notificaciones reales del endpoint
  useEffect(() => {
    if (!user?.id || !token) return;

    const cargarNotificaciones = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Obteniendo notificaciones para usuario ${user.id}`);
        const data = await obtenerNotificacionesPorUsuario(user.id, token);
        setNotificaciones(data);
        console.log("Notificaciones recibidas:", data);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setError("No se pudieron cargar las notificaciones");
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, [user, token]);

  const handleNotificationClick = async (notificacion: NotificationsDTO) => {
    // Marcar como leída si no lo está
    if (notificacion.id && !notificacion.leida) {
      try {
        await marcarComoLeida(notificacion.id, token);
        // Actualizar estado local
        setNotificaciones(prev => 
          prev.map(n => 
            n.id === notificacion.id ? { ...n, leida: true } : n
          )
        );
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }
    
    // Navegar según el tipo de notificación
    if (notificacion.idPublicacion) {
      navigate(`/publicacion/${notificacion.idPublicacion}`);
    }
  };

  const getNotificationIcon = (tipo?: string) => {
    switch(tipo) {
      case 'aceptada': return '✅';
      case 'rechazada': return '❌';
      case 'comentario': return '💬';
      case 'reaccion': return '❤️';
      case 'revision': return '🔍';
      case 'proceso': return '⏳';
      case 'modificaciones': return '✏️';
      default: return '🔔';
    }
  };

  // Filtrar notificaciones por tipo según la pestaña activa
  const getFilteredNotifications = () => {
    switch(activeTab) {
      case 'solicitudes':
        return notificaciones.filter(n => n.tipo === 'solicitud');
      case 'evaluaciones':
        return notificaciones.filter(n => n.tipo === 'evaluacion');
      default:
        return notificaciones;
    }
  };

  return (
    <div className="notifications-container">
      {/* Botones fijos de navegación */}
      <div className="notifications-nav">
        <button 
          className={`nav-button ${activeTab === 'notificaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('notificaciones')}
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
          onClick={() => setActiveTab('solicitudes')}
        >
          📝 Solicitudes de publicación
        </button>
        <button 
          className={`nav-button ${activeTab === 'evaluaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluaciones')}
        >
          🧐 Evaluaciones de moderador
        </button>
      </div>

      {/* Contenido del panel */}
      <div className="notifications-content">
        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Cargando notificaciones...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Reintentar
            </button>
            
          </div>
        ) : (
          <>
            <div className="notifications-list">
              {getFilteredNotifications().length === 0 ? (
                <div className="empty-message">
                  No hay {activeTab === 'notificaciones' ? 'notificaciones' : 
                  activeTab === 'solicitudes' ? 'solicitudes' : 'evaluaciones'}
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
                      <h3>{notificacion.titulo}</h3>
                      {notificacion.contenido && (
                        <p className="notification-content">{notificacion.contenido}</p>
                      )}
                      <p className="notification-date">
                        {notificacion.fechaCreacion ? 
                          new Date(notificacion.fechaCreacion).toLocaleDateString() : 
                          'Fecha no disponible'}
                      </p>
                    </div>
                    {!notificacion.leida && <div className="unread-dot"></div>}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;