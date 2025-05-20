import { useState, useEffect } from 'react';
import { EcoTip, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../services/CardUserService';

export function useAuth() {
  const [user, setUser] = useState<EcoTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verificar si el token es válido obteniendo el usuario actual
          const currentUser = await authService.getCurrentUser(token);
          setUser(currentUser);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (userData: RegisterCredentials) => {
    const user = await authService.register(userData);
    // Opcional: auto-login después del registro
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { 
    user, 
    loading,
    login, 
    register, 
    logout,
    isAuthenticated: !!user
  };
}