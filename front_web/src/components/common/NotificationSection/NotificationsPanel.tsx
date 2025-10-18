// components/NotificationsPanel.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
import  ModificationDetail from '../PublicationsSection/PublicationModificationDetail';
import './NotificationsPanel.css';
import { obtenerEstadoPublicacion } from '../../../api/services/Publications/PublicacionesService';

// Tipos
export type ActiveTab = 'notificaciones' | 'solicitudes' | 'evaluaciones' | 'publicacion';

// Niveles de usuario
const USER_LEVELS = {
  BASE: "nivel 0",        // nivel 0
  INTERMEDIO: "nivel 1",  // nivel 1
  EXPERTO: "nivel 2",     // nivel 2
  ADMIN: "admin",       // admin
};

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

  const [modificacionView, setModificacionView] = useState<'list' | 'detail'>('list');
  const [selectedModificacion, setSelectedModificacion] = useState<number | null>(null);


  // 🚀 Scroll infinito para notificaciones
  const {
    items: notificaciones,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  } = useInfiniteScroll<NotificationsDTO>(
    async (page, size) => {
      if (!user?.idUsuario || !token) return { content: [], totalPages: 0, totalElements: 0 };
      const data = await obtenerNotificacionesPaginadas(user.idUsuario, { page, size }, token);
      return { content: data.content, totalPages: data.totalPages ?? 0, totalElements: data.totalElements ?? 0 };
    },
    5,
    { idField: 'idNotificacion' }
  );

     const refreshNotifications = async () => {
  if (!user?.idUsuario || !token) return;
  try {
    await refresh(); 
    const count = await obtenerContadorNoLeidas(user.idUsuario, token);
    setUnreadCount(count);
  } catch (err) {
    console.error("Error al refrescar notificaciones:", err);
  }
};

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

  // 🔐 Nivel del usuario (por defecto 0 si no existe)
  const userLevel = user?.nivel ?? USER_LEVELS.BASE;

  // 🧭 Pestañas visibles según el nivel
  const availableTabs = useMemo(() => {
    const tabs: ActiveTab[] = ['notificaciones'];
    if (userLevel >= USER_LEVELS.INTERMEDIO) tabs.push('solicitudes');
    if (userLevel >= USER_LEVELS.EXPERTO) tabs.push('evaluaciones');
    return tabs;
  }, [userLevel]);

  // ⚙️ Evita mostrar pestañas que el usuario no debería ver
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('notificaciones');
    }
  }, [availableTabs, activeTab]);

  // 🔔 Manejar clic en notificación
  const handleNotificationClick = async (notificacion: NotificationsDTO) => {
    if (!user?.idUsuario || !token) return;

     const estado = await obtenerEstadoPublicacion(notificacion.idPublicacion!, token);
if (notificacion.tipo === 'Publicacion Modificaciones' && notificacion.idPublicacion  &&  estado==='MODIFICACION') {
  setSelectedModificacion(notificacion.idPublicacion);
  setModificacionView('detail');
  return;
}
else{
  alert("publicacion ya fue modificada")
}


    const notificationId = notificacion.idNotificacion;
    const publicacionId = notificacion.idPublicacion;
    if (!notificationId) return;

    if (!notificacion.leido) {
      await marcarComoLeida(notificationId, token);
    }

    // Navegación según tipo de notificación
    if (notificacion.tipo === 'Solicitud Publicacion' && publicacionId) {
      if (userLevel >= USER_LEVELS.INTERMEDIO) {
        setActiveTab('solicitudes');
        setSelectedSolicitud(publicacionId);
        setSolicitudesView('detail');
      } else {
        alert('No tienes acceso a las solicitudes.');
      }
    } else if (publicacionId) {
      setSelectedPublicacion(publicacionId);
      setPublicacionView('detail');
    }
  };

  // 🧩 Renderizar contenido según pestaña
  const renderContent = () => {
    if (activeTab === 'notificaciones') {

      if (modificacionView === 'detail' && selectedModificacion !== null) {
  return (
    <ModificationDetail
      publicacionId={selectedModificacion}
      onBack={() => {
        setSelectedModificacion(null);
        setModificacionView('list');
      }}
    />
  );
}

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
      if (userLevel < USER_LEVELS.INTERMEDIO) return <p>No tienes acceso a solicitudes.</p>;
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
      if (userLevel < USER_LEVELS.EXPERTO) return <p>No tienes acceso a evaluaciones.</p>;
      return evaluacionesView === 'detail' && selectedEvaluacion ? (
        <EvaluacionDetail
          evaluacionId={selectedEvaluacion}
          onBack={() => {
            setSelectedEvaluacion(null);
            setEvaluacionesView('list');
          }}
           onRefreshNotifications={refreshNotifications}
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
        availableTabs={availableTabs} // ✅ Solo muestra las pestañas permitidas
      />
      <div className="notifications-content">{renderContent()}</div>
    </div>
  );
};

export default NotificationsPanel;
