import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LogoutButton.css'; // Reutiliza los estilos

interface LogoutLinkProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
  asButton?: boolean;
}

const LogoutLink: React.FC<LogoutLinkProps> = ({ 
  className = '', 
  variant = 'text',
  asButton = false
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación normal del enlace
    
    if (!window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      return;
    }

    setIsLoggingOut(true);
    try {
      // Limpiar todo el almacenamiento local
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('notificaciones');
      localStorage.removeItem('userPreferences');
      
      // También limpiar sessionStorage por si acaso
      sessionStorage.clear();
      
      // Redirigir al login
      navigate('/login', { replace: true });
      
      // Recargar para limpiar estado completamente
      setTimeout(() => window.location.reload(), 100);
      
    } catch (error) {
      console.error('Error durante logout:', error);
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Si quieres que se vea como botón pero sea un enlace
  if (asButton) {
    return (
      <button 
        onClick={handleLogout} 
        disabled={isLoggingOut}
        className={`logout-button logout-button--${variant} ${className}`}
      >
        {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
      </button>
    );
  }

  // Como enlace normal (recomendado para sidebar)
  return (
    <a 
      href="#" 
      onClick={handleLogout}
      className={`logout-link logout-link--${variant} ${className} ${isLoggingOut ? 'logout-link--loading' : ''}`}
    >
      {isLoggingOut ? '🔄 Cerrando...' : ' Cerrar Sesión'}
    </a>
  );
};

export default LogoutLink;