// components/NotificationsNav.tsx
import React from 'react';

interface NotificationsNavProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
}

const NotificationsNav: React.FC<NotificationsNavProps> = ({
  activeTab,
  unreadCount,
  onTabChange
}) => {
  const tabs = [
    { id: 'notificaciones', label: '🔔 Notificaciones', showBadge: true },
    { id: 'solicitudes', label: '📝 Solicitudes', showBadge: false },
    { id: 'evaluaciones', label: 'Evaluaciones', showBadge: false },
  ];

  return (
    <div className="notifications-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.showBadge && unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default NotificationsNav;