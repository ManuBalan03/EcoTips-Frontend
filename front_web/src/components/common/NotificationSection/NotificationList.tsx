// components/NotificationsList.tsx
import React from 'react';
import { NotificationsDTO } from '../../../api/services/UserServices/NotificacionesService';
import NotificationDetail from './NotificationDetail';

interface NotificationsListProps {
  notificaciones: NotificationsDTO[];
  loading: boolean;
  error: string | null;
  onNotificationClick: (notificacion: NotificationsDTO) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notificaciones,
  loading,
  error,
  onNotificationClick,
  onLoadMore,
hasMore
}) => {
  const getFilteredNotifications = () => {
    return notificaciones.slice(0);
  };

  if (loading) {
    return (
      <div className="loading-message">
        <div className="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
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
              <NotificationDetail
                key={notificationId || Math.random()}
                notificacion={notificacion}
                onClick={onNotificationClick}
              />
            );
          })
        )}
      </div>

      {hasMore && (
  <button className="load-more-btn" onClick={onLoadMore}>
    Ver más notificaciones
  </button>
)}

    </>
  );
};

export default NotificationsList;