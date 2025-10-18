// components/NotificationItem.tsx
import React from 'react';
import { NotificationsDTO } from '../../../api/services/UserServices/NotificacionesService';

interface NotificationItemProps {
  notificacion: NotificationsDTO;
  onClick: (notificacion: NotificationsDTO) => void;
}

const NotificationDetail: React.FC<NotificationItemProps> = ({ notificacion, onClick }) => {
  const getNotificationIcon = (tipo?: string) => {
    switch(tipo) {
      case 'APROBADA': return '✅';
      case 'RECHAZADA': return '❌';
      case 'Comentario': return '💬';
      case 'Reaccion': return '❤️';
      case 'Solicitud Publicacion': return '📝';
      case 'Publicacion': return '⏳';
      case 'Publicacion Modificaciones': return '✏️';
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

  return (
    <div 
      className={`notification-item ${notificacion.leido ? 'read' : 'unread'}`}
      onClick={() => onClick(notificacion)}
    >
      <div className="notification-icon">
        {getNotificationIcon(notificacion.tipo)}
      </div>
      <div className="notification-details">
        <h3>{ notificacion.tipo}</h3>
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
};

export default NotificationDetail;