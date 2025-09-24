// components/common/Buttons/LogoutButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  variant = 'primary' 
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      return;
    }

    setIsLoggingOut(true);
    try {
      // Limpiar todo
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('notificaciones');
      localStorage.removeItem('userPreferences');
      
      // Redirigir
      navigate('/login', { replace: true });
      
      // Recargar para limpiar estado
      setTimeout(() => window.location.reload(), 100);
      
    } catch (error) {
      console.error('Error durante logout:', error);
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoggingOut}
      className={`logout-button logout-button--${variant} ${className}`}
    >
      {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
    </button>
  );
};

export default LogoutButton;