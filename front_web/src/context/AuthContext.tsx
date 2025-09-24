// api/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (userData: any, authToken: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para obtener datos del localStorage
const getStoredAuthData = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token
    };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return { user: null, token: null };
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Si no hay contexto, usar localStorage como fallback
  if (!context) {
    console.warn('useAuth usado fuera de AuthProvider - usando localStorage como fallback');
    const { user, token } = getStoredAuthData();
    
    return {
      user,
      token,
      login: (userData: any, authToken: string) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
      },
      logout: async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('notificaciones');
        window.location.href = '/login';
      },
      isAuthenticated: !!token
    };
  }
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar desde localStorage
    const { user: storedUser, token: storedToken } = getStoredAuthData();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = (userData: any, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('notificaciones');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};