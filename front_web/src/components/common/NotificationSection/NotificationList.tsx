// components/NotificationSection/NotificationsList.tsx
import React, { useRef } from 'react';
import { NotificationsDTO } from '../../../api/services/UserServices/NotificacionesService';
import NotificationDetail from './NotificationDetail';

interface NotificationsListProps {
  notificaciones: NotificationsDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onNotificationClick: (notificacion: NotificationsDTO) => void;
  loadMore: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notificaciones,
  loading,
  error,
  hasMore,
  onNotificationClick,
  loadMore
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  };

  if (loading && notificaciones.length === 0) {
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
        {notificaciones.length === 0 ? (
          <div className="empty-message">No hay notificaciones</div>
        ) : (
          notificaciones.map((notificacion, index) => {
            const isLast = index === notificaciones.length - 1;
            return (
              <div
                key={notificacion.idNotificacion || index}
                ref={isLast ? lastElementRef : null}
              >
                <NotificationDetail
                  notificacion={notificacion}
                  onClick={onNotificationClick}
                />
              </div>
            );
          })
        )}
      </div>

      {loading && notificaciones.length > 0 && <p>Cargando más...</p>}
      {!hasMore && notificaciones.length > 0 && <p>No hay más notificaciones</p>}
    </>
  );
};

export default NotificationsList;
