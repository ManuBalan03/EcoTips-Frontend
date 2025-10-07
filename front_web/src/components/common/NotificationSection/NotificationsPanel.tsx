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
import './NotificationsPanel.css';

// Definir tipos
export type ActiveTab = 'notificaciones' | 'solicitudes' | 'evaluaciones' | 'publicacion';
type SolicitudesView = 'list' | 'detail';
type PublicacionView = 'list' | 'detail'; 

// Definir niveles de usuario
const USER_LEVELS = {
  BASE: "nivel 0",
  INTERMEDIO: "nivel 1",
  EXPERTO: "nivel 2",
  ADMIN: "admin"
};

const NotificationsPanel: React.FC = () => {
  const [publicacionView, setPublicacionView] = useState<PublicacionView>('list');
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('notificaciones');
  const [solicitudesView, setSolicitudesView] = useState<SolicitudesView>('list');
  const [selectedSolicitud, setSelectedSolicitud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPublicacion, setSelectedPublicacion] = useState<number | null>(null);
  const [evaluacionesView, setEvaluacionesView] = useState<'list' | 'detail'>('list');
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificaciones, setNotificaciones] = useState<NotificationsDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Obtener nivel del usuario (si user.level no existe, asumimos nivel 0)
  const userLevel = user?.nivel || USER_LEVELS.BASE;

  // Determinar qué pestañas debe ver el usuario según su nivel
  const availableTabs = React.useMemo(() => {
    const tabs: ActiveTab[] = ['notificaciones']; // Todos ven notificaciones
    
    // Nivel 1, 2 y Admin ven solicitudes
    if (userLevel >= USER_LEVELS.INTERMEDIO) {
      tabs.push('solicitudes');
    }
    
    // Solo nivel 2 y Admin ven evaluaciones
    if (userLevel >= USER_LEVELS.EXPERTO) {
      tabs.push('evaluaciones');
    }
    
    return tabs;
  }, [userLevel]);

  // Asegurar que la pestaña activa esté disponible para el usuario
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('notificaciones');
    }
  }, [availableTabs, activeTab]);

  // 🚀 Cargar notificaciones iniciales cuando se selecciona la pestaña de notificaciones
  useEffect(() => {
    if (!user?.idUsuario || !token || activeTab !== 'notificaciones') return;
    loadNotificaciones(0);
  }, [user, token, activeTab]);

  // 🚀 Cargar contador de no leídas en un efecto separado
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

  const loadNotificaciones = async (pageToLoad: number) => {
    if (!user?.idUsuario || !token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await obtenerNotificacionesPaginadas(user.idUsuario, { page: pageToLoad, size: 5 }, token);

      if (pageToLoad === 0) {
        setNotificaciones(data.content);
      } else {
        setNotificaciones(prev => [...prev, ...data.content]);
      }

      setPage(data.pageable.pageNumber);
      setHasMore(!data.last);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificacion: NotificationsDTO) => {
    if (!user?.idUsuario || !token) return;

    const notificationId = notificacion.idNotificacion;
    const publicacionId = notificacion.idPublicacion;

    if (!notificationId) return;

    // Marcar como leída
    if (!notificacion.leido) {
      await marcarComoLeida(notificationId, token);
      setNotificaciones(prev => 
        prev.map(n => n.idNotificacion === notificationId ? { ...n, leido: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Navegar según el tipo de notificación
    if (notificacion.tipo === 'Solicitud Publicacion' && publicacionId) {
      // Verificar si el usuario tiene acceso a solicitudes
      if (userLevel >= USER_LEVELS.INTERMEDIO) {
        setActiveTab('solicitudes');
        setSelectedSolicitud(publicacionId);
        setSolicitudesView('detail');
        resetOtherStates('solicitudes');
      }
    } else if (publicacionId) {
      setSelectedPublicacion(publicacionId);
      setPublicacionView('detail');
      resetOtherStates('publicacion');
    }
  };

  const resetOtherStates = (currentTab: string) => {
    if (currentTab !== 'solicitudes') {
      setSelectedSolicitud(null);
      setSolicitudesView('list');
    }
    if (currentTab !== 'publicacion') {
      setSelectedPublicacion(null);
      setPublicacionView('list');
    }
    if (currentTab !== 'evaluaciones') {
      setSelectedEvaluacion(null);
      setEvaluacionesView('list');
    }
  };

  const handleTabChange = (tab: string) => {
    // Verificar si el usuario tiene acceso a la pestaña seleccionada
    if (availableTabs.includes(tab as ActiveTab)) {
      setActiveTab(tab as ActiveTab);
      resetAllStates();
    }
  };

  const resetAllStates = () => {
    setSolicitudesView('list');
    setPublicacionView('list');
    setSelectedSolicitud(null);
    setSelectedPublicacion(null);
    setSelectedEvaluacion(null);
    setEvaluacionesView('list');
  };

  const renderContent = () => {
    const isNotificacionesTab = activeTab === 'notificaciones';
    const isDetailView = publicacionView === 'detail';
    const hasSelectedPublicacion = selectedPublicacion !== null;
    
    if (isNotificacionesTab && isDetailView && hasSelectedPublicacion) {
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

    if (activeTab === 'solicitudes') {
      if (solicitudesView === 'detail' && selectedSolicitud) {
        return (
          <SolicitudDetail 
            solicitudId={selectedSolicitud} 
            onBack={() => {
              setSolicitudesView('list');
              setSelectedSolicitud(null);
            }}
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

    // 🔔 Lista de notificaciones (con botón o scroll infinito)
    return (
      <NotificationsList
        notificaciones={notificaciones}
        loading={loading}
        error={error}
        onNotificationClick={handleNotificationClick}
        onLoadMore={() => loadNotificaciones(page + 1)}
        hasMore={hasMore}
      />
    );
  };

  return (
    <div className="notifications-container">
      <NotificationsNav
        activeTab={activeTab}
        unreadCount={unreadCount}
        onTabChange={handleTabChange}
        availableTabs={availableTabs} // Pasar las pestañas disponibles
      />
      <div className="notifications-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default NotificationsPanel;