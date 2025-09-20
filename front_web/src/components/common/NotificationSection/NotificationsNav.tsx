// import React from 'react';
import { ActiveTab } from './NotificationsPanel';

interface NotificationsNavProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
   availableTabs: ActiveTab[];
}

const NotificationsNav: React.FC<NotificationsNavProps> = ({
  activeTab,
  unreadCount,
  onTabChange,
   availableTabs
}) => {
    const tabLabels: Record<ActiveTab, string> = {
    notificaciones: `Notificaciones`,
    solicitudes: 'Solicitudes',
    evaluaciones: 'Evaluaciones',
    publicacion: 'Publicación'
  };

  return (

    
    <nav className="notifications-nav">
      {availableTabs.map(tab => (
        <button
          key={tab}
          className={`nav-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
           {tabLabels[tab]}
            {tab === 'notificaciones' && unreadCount > 0 && (
              <span className="unread-badge">
                {unreadCount}
              </span>
            )}
        </button>
      ))}
    </nav>
  );
};

export default NotificationsNav;

