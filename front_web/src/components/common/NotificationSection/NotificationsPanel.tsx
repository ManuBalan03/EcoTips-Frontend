// components/NotificationsPanel.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../api/AuthContext';
import {
  marcarComoLeida,
  NotificationsDTO,
  obtenerContadorNoLeidas,
  obtenerNotificacionesPaginadas
} from '../../../api/services/UserServices/NotificacionesService';
import SolicitudesList from '../SolicitudesExpert/SolicitudesList';
import SolicitudDetail from '../SolicitudesExpert/SolicitudDetail';
import EvaluationList from '../SolicitudesEvaluation/EvaluationList';
import EvaluacionDetail from '../SolicitudesEvaluation/EvaluationsDetail';
import DetailsPublication from '../Publication/PublicationDetail';
import NotificationsList from '../NotificationSection/NotificationList';
import NotificationsNav from '../NotificationSection/NotificationsNav';
import { useInfiniteScroll } from '../../../api/hooks/useInfiniteScroll';
import './NotificationsPanel.css';

// Definir tipos
export type ActiveTab = 'notificaciones' | 'solicitudes' | 'evaluaciones' | 'publicacion';

const NotificationsPanel: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('notificaciones');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [publicacionView, setPublicacionView] = useState<'list' | 'detail'>('list');
  const [selectedPublicacion, setSelectedPublicacion] = useState<number | null>(null);

  const [solicitudesView, setSolicitudesView] = useState<'list' | 'detail'>('list');
  const [selectedSolicitud, setSelectedSolicitud] = useState<number | null>(null);

  const [evaluacionesView, setEvaluacionesView] = useState<'list' | 'detail'>('list');
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<number | null>(null);

  // 🚀 Scroll infinito para notificaciones
  const {
    items: notificaciones,
    loading,
    error,
    hasMore,
    loadMore
  } = useInfiniteScroll<NotificationsDTO>(
  async (page, size) => {
    if (!user?.idUsuario || !token) return { content: [], totalPages: 0, totalElements: 0 };
    const data = await obtenerNotificacionesPaginadas(user.idUsuario, { page, size }, token);
    return { content: data.content, totalPages: data.totalPages ?? 0, totalElements: data.totalElements ?? 0 };
  },
  5, // page size
  { idField: 'idNotificacion' } // <- aquí le dices cuál propiedad usar como id
);

  // 🔄 Contador de no leídas
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user?.idUsuario || !token) return;
      try {
        const count = await obtenerContadorNoLeidas(user.idUsuario, token);
        setUnreadCount(count);
      } catch (err) {
        console.error("Error al cargar contador de no leídas:", err);
      }
    };
    fetchUnread();
  }, [user, token]);

  const handleNotificationClick = async (notificacion: NotificationsDTO) => {
    if (!user?.idUsuario || !token) return;
    const notificationId = notificacion.idNotificacion;
    const publicacionId = notificacion.idPublicacion;

    if (!notificationId) return;

    if (!notificacion.leido) {
      await marcarComoLeida(notificationId, token);
      // actualizar estado local
    }

    // Navegación según tipo...
    if (notificacion.tipo === 'Solicitud Publicacion' && publicacionId) {
      setActiveTab('solicitudes');
      setSelectedSolicitud(publicacionId);
      setSolicitudesView('detail');
    } else if (publicacionId) {
      setSelectedPublicacion(publicacionId);
      setPublicacionView('detail');
    }
  };

  const renderContent = () => {
    if (activeTab === 'notificaciones') {
      if (publicacionView === 'detail' && selectedPublicacion !== null) {
        return (
          <DetailsPublication
            publicacionId={selectedPublicacion}
            onBack={() => {
              setSelectedPublicacion(null);
              setPublicacionView('list');
            }}
          />
        );
      }

      return (
        <NotificationsList
          notificaciones={notificaciones}
          loading={loading}
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
          onNotificationClick={handleNotificationClick}
        />
      );
    }

    if (activeTab === 'solicitudes') {
      return solicitudesView === 'detail' && selectedSolicitud ? (
        <SolicitudDetail
          solicitudId={selectedSolicitud}
          onBack={() => {
            setSolicitudesView('list');
            setSelectedSolicitud(null);
          }}
        />
      ) : (
        <SolicitudesList onSelectSolicitud={id => {
          setSelectedSolicitud(id);
          setSolicitudesView('detail');
        }} />
      );
    }

    if (activeTab === 'evaluaciones') {
      return evaluacionesView === 'detail' && selectedEvaluacion ? (
        <EvaluacionDetail
          evaluacionId={selectedEvaluacion}
          onBack={() => {
            setSelectedEvaluacion(null);
            setEvaluacionesView('list');
          }}
        />
      ) : (
        <EvaluationList onSelectEvaluacion={id => {
          setSelectedEvaluacion(id);
          setEvaluacionesView('detail');
        }} />
      );
    }
  };

  return (
    <div className="notifications-container">
     <NotificationsNav
  activeTab={activeTab}
  unreadCount={unreadCount}
  onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
  availableTabs={['notificaciones', 'solicitudes', 'evaluaciones']}
/>

      <div className="notifications-content">{renderContent()}</div>
    </div>
  );
};

export default NotificationsPanel;
